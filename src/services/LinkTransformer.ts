/**
 * 链接转换器服务
 * 负责链接的格式转换、优化和增强
 */

import { ProcessedLink, LinkType, DocumentDifficulty } from '../types/link-detection';
import { getDifficultyConfig } from '../config/DifficultyConfig';

/**
 * 链接转换器类
 * 提供链接转换、优化和增强功能
 */
export class LinkTransformer {
  private readonly baseUrl: string;
  private readonly documentPath: string;
  
  constructor(baseUrl: string = window.location.origin, documentPath: string = '') {
    this.baseUrl = baseUrl;
    this.documentPath = documentPath;
  }

  /**
   * 转换链接为ProcessedLink对象
   * @param url 原始链接
   * @param text 链接文本
   * @param context 文档上下文
   * @returns 处理后的链接对象
   */
  transform(url: string, text: string, context?: {
    difficulty?: DocumentDifficulty;
    section?: string;
    lineNumber?: number;
  }): ProcessedLink {
    const linkType = this.detectLinkType(url);
    const processedUrl = this.processUrl(url, linkType);
    return {
      originalUrl: url,
      processedUrl: processedUrl,
      text: text,
      type: linkType,
      isValid: true,
      processedAt: Date.now(),
      metadata: {
        customAttributes: {
          requiresValidation: this.requiresValidation(linkType).toString(),
          difficulty: context?.difficulty || '',
          section: context?.section || '',
          transformedAt: Date.now().toString()
        }
      }
    };
  }

  /**
   * 批量转换链接
   * @param links 链接数组
   * @param context 文档上下文
   * @returns 处理后的链接数组
   */
  transformBatch(links: Array<{ url: string; text: string }>, context?: {
    difficulty?: DocumentDifficulty;
    section?: string;
  }): ProcessedLink[] {
    return links.map((link) => 
      this.transform(link.url, link.text, context)
    );
  }

  /**
   * 检测链接类型
   */
  private detectLinkType(url: string): LinkType {
    const trimmedUrl = url.trim().toLowerCase();
    
    if (trimmedUrl.startsWith('mailto:')) {
      return LinkType.EMAIL;
    }
    
    if (trimmedUrl.startsWith('tel:')) {
      return LinkType.PHONE;
    }
    
    if (trimmedUrl.startsWith('#')) {
      return LinkType.ANCHOR;
    }
    
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
      return this.isExternalLink(url) ? LinkType.EXTERNAL : LinkType.INTERNAL;
    }
    
    if (trimmedUrl.startsWith('/')) {
      return LinkType.INTERNAL;
    }
    
    if (trimmedUrl.startsWith('./') || trimmedUrl.startsWith('../')) {
      return LinkType.RELATIVE;
    }
    
    // 检查是否为文件链接
    if (this.isFileLink(url)) {
      return LinkType.FILE;
    }
    
    // 默认为相对链接
    return LinkType.RELATIVE;
  }

  /**
   * 处理URL
   */
  private processUrl(url: string, type: LinkType): string {
    switch (type) {
      case LinkType.RELATIVE:
        return this.resolveRelativeUrl(url);
      
      case LinkType.INTERNAL:
        return this.normalizeInternalUrl(url);
      
      case LinkType.EXTERNAL:
        return this.enhanceExternalUrl(url);
      
      case LinkType.ANCHOR:
        return this.processAnchorUrl(url);
      
      case LinkType.EMAIL:
        return this.processEmailUrl(url);
      
      case LinkType.PHONE:
        return this.processPhoneUrl(url);
      
      case LinkType.FILE:
        return this.processFileUrl(url);
      
      default:
        return url;
    }
  }

  /**
   * 解析相对URL
   */
  private resolveRelativeUrl(url: string): string {
    try {
      const baseUrl = this.documentPath ? 
        new URL(this.documentPath, this.baseUrl).href : 
        this.baseUrl;
      
      return new URL(url, baseUrl).href;
    } catch (error) {
      console.warn('无法解析相对URL:', url, error);
      return url;
    }
  }

  /**
   * 规范化内部URL
   */
  private normalizeInternalUrl(url: string): string {
    try {
      const urlObj = new URL(url, this.baseUrl);
      
      // 移除默认端口
      if ((urlObj.protocol === 'http:' && urlObj.port === '80') ||
          (urlObj.protocol === 'https:' && urlObj.port === '443')) {
        urlObj.port = '';
      }
      
      // 规范化路径
      urlObj.pathname = this.normalizePath(urlObj.pathname);
      
      return urlObj.href;
    } catch (error) {
      console.warn('无法规范化内部URL:', url, error);
      return url;
    }
  }

  /**
   * 增强外部URL
   */
  private enhanceExternalUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      
      // 确保使用HTTPS（如果可能）
      if (urlObj.protocol === 'http:' && this.shouldUpgradeToHttps(urlObj.hostname)) {
        urlObj.protocol = 'https:';
      }
      
      // 添加跟踪参数（如果需要）
      if (this.shouldAddTracking(urlObj.hostname)) {
        urlObj.searchParams.set('utm_source', 'newenergycoder');
        urlObj.searchParams.set('utm_medium', 'documentation');
      }
      
      return urlObj.href;
    } catch (error) {
      console.warn('无法增强外部URL:', url, error);
      return url;
    }
  }

  /**
   * 处理锚点URL
   */
  private processAnchorUrl(url: string): string {
    const anchorId = url.substring(1);
    
    // 验证锚点ID格式
    if (!this.isValidAnchorId(anchorId)) {
      console.warn('无效的锚点ID:', anchorId);
      return url;
    }
    
    // 如果当前页面有对应的锚点，保持原样
    // 否则可能需要添加页面路径
    return url;
  }

  /**
   * 处理邮件URL
   */
  private processEmailUrl(url: string): string {
    const email = url.replace('mailto:', '');
    
    // 验证邮件格式
    if (!this.isValidEmail(email)) {
      console.warn('无效的邮件地址:', email);
      return url;
    }
    
    // 可以添加默认的邮件主题或正文
    const urlObj = new URL(url);
    if (!urlObj.searchParams.has('subject')) {
      urlObj.searchParams.set('subject', '来自新能源编程者文档的咨询');
    }
    
    return urlObj.href;
  }

  /**
   * 处理电话URL
   */
  private processPhoneUrl(url: string): string {
    const phone = url.replace('tel:', '');
    
    // 规范化电话号码格式
    const normalizedPhone = this.normalizePhoneNumber(phone);
    
    return `tel:${normalizedPhone}`;
  }

  /**
   * 处理文件URL
   */
  private processFileUrl(url: string): string {
    try {
      const urlObj = new URL(url, this.baseUrl);
      
      // 添加文件下载参数（如果需要）
      if (this.shouldForceDownload(urlObj.pathname)) {
        urlObj.searchParams.set('download', '1');
      }
      
      return urlObj.href;
    } catch (error) {
      console.warn('无法处理文件URL:', url, error);
      return url;
    }
  }

  /**
   * 增强链接文本
   */
  private enhanceText(text: string, url: string, type: LinkType): string {
    let enhancedText = text.trim();
    
    // 如果文本为空，使用URL作为文本
    if (!enhancedText) {
      enhancedText = this.generateTextFromUrl(url, type);
    }
    
    // 根据链接类型添加图标或标识
    switch (type) {
      case LinkType.EXTERNAL:
        if (!enhancedText.includes('🔗') && !enhancedText.includes('↗')) {
          enhancedText += ' ↗';
        }
        break;
      
      case LinkType.EMAIL:
        if (!enhancedText.includes('📧') && !enhancedText.includes('@')) {
          enhancedText = '📧 ' + enhancedText;
        }
        break;
      
      case LinkType.PHONE:
        if (!enhancedText.includes('📞') && !enhancedText.includes('☎')) {
          enhancedText = '📞 ' + enhancedText;
        }
        break;
      
      case LinkType.FILE: {
        const fileExt = this.getFileExtension(url);
        const fileIcon = this.getFileIcon(fileExt);
        if (fileIcon && !enhancedText.includes(fileIcon)) {
          enhancedText = `${fileIcon} ${enhancedText}`;
        }
        break;
      }
    }
    
    return enhancedText;
  }

  /**
   * 从URL生成文本
   */
  private generateTextFromUrl(url: string, type: LinkType): string {
    switch (type) {
      case LinkType.EMAIL:
        return url.replace('mailto:', '');
      
      case LinkType.PHONE:
        return url.replace('tel:', '');
      
      case LinkType.ANCHOR:
        return url.substring(1);
      
      case LinkType.FILE:
        return this.getFileName(url);
      
      default:
        try {
          const urlObj = new URL(url);
          return urlObj.hostname + urlObj.pathname;
        } catch {
          return url;
        }
    }
  }

  /**
   * 工具方法
   */
  private isExternalLink(url: string): boolean {
    try {
      const urlObj = new URL(url, this.baseUrl);
      const baseUrlObj = new URL(this.baseUrl);
      return urlObj.hostname !== baseUrlObj.hostname;
    } catch {
      return false;
    }
  }

  private requiresValidation(type: LinkType): boolean {
    return [LinkType.EXTERNAL, LinkType.INTERNAL, LinkType.FILE].includes(type);
  }

  private isFileLink(url: string): boolean {
    const fileExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', 
                           '.zip', '.rar', '.tar', '.gz', '.jpg', '.jpeg', '.png', 
                           '.gif', '.svg', '.mp4', '.mp3', '.wav'];
    
    return fileExtensions.some(ext => url.toLowerCase().includes(ext));
  }

  private normalizePath(path: string): string {
    return path.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
  }

  private shouldUpgradeToHttps(hostname: string): boolean {
    // 已知支持HTTPS的域名列表
    const httpsSupported = ['github.com', 'stackoverflow.com', 'developer.mozilla.org'];
    return httpsSupported.some(domain => hostname.includes(domain));
  }

  private shouldAddTracking(hostname: string): boolean {
    // 需要添加跟踪参数的域名
    const trackingDomains = ['example.com'];
    return trackingDomains.some(domain => hostname.includes(domain));
  }

  private isValidAnchorId(id: string): boolean {
    return /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(id);
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private normalizePhoneNumber(phone: string): string {
    // 移除所有非数字字符，保留 + 号
    return phone.replace(/[^\d+]/g, '');
  }

  private shouldForceDownload(pathname: string): boolean {
    const downloadExtensions = ['.pdf', '.doc', '.docx', '.zip', '.rar'];
    return downloadExtensions.some(ext => pathname.toLowerCase().endsWith(ext));
  }

  private getFileExtension(url: string): string {
    try {
      const pathname = new URL(url).pathname;
      const lastDot = pathname.lastIndexOf('.');
      return lastDot > 0 ? pathname.substring(lastDot + 1).toLowerCase() : '';
    } catch {
      const lastDot = url.lastIndexOf('.');
      return lastDot > 0 ? url.substring(lastDot + 1).toLowerCase() : '';
    }
  }

  private getFileIcon(extension: string): string {
    const iconMap: Record<string, string> = {
      'pdf': '📄',
      'doc': '📝',
      'docx': '📝',
      'xls': '📊',
      'xlsx': '📊',
      'ppt': '📽️',
      'pptx': '📽️',
      'zip': '🗜️',
      'rar': '🗜️',
      'tar': '🗜️',
      'gz': '🗜️',
      'jpg': '🖼️',
      'jpeg': '🖼️',
      'png': '🖼️',
      'gif': '🖼️',
      'svg': '🖼️',
      'mp4': '🎥',
      'mp3': '🎵',
      'wav': '🎵'
    };
    
    return iconMap[extension] || '📎';
  }

  private getFileName(url: string): string {
    try {
      const pathname = new URL(url).pathname;
      const lastSlash = pathname.lastIndexOf('/');
      return lastSlash >= 0 ? pathname.substring(lastSlash + 1) : pathname;
    } catch {
      const lastSlash = url.lastIndexOf('/');
      return lastSlash >= 0 ? url.substring(lastSlash + 1) : url;
    }
  }

  /**
   * 根据难度级别转换链接样式
   * @param link 处理后的链接
   * @param difficulty 文档难度
   * @returns 带样式信息的链接
   */
  public applyDifficultyStyles(link: ProcessedLink, difficulty: DocumentDifficulty): ProcessedLink {
    const config = getDifficultyConfig(difficulty);
    
    return {
      ...link,
      metadata: {
        ...link.metadata,
        styleClass: `link-${difficulty.toLowerCase()}`,
        customAttributes: {
          ...link.metadata.customAttributes,
          difficulty: difficulty,
          color: config.color || '#000000'
        }
      }
    };
  }

  /**
   * 创建面包屑导航链接
   * @param path 文档路径
   * @returns 面包屑链接数组
   */
  public createBreadcrumbLinks(path: string): ProcessedLink[] {
    const segments = path.split('/').filter(Boolean);
    const links: ProcessedLink[] = [];
    
    // 添加首页链接
    links.push({
      originalUrl: '/',
      processedUrl: '/',
      text: '首页',
      type: LinkType.INTERNAL,
      isValid: true,
      processedAt: Date.now(),
      metadata: {
        customAttributes: {
          requiresValidation: 'false',
          isBreadcrumb: 'true',
          transformedAt: Date.now().toString()
        }
      }
    });
    
    // 添加路径段链接
    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      links.push({
        originalUrl: currentPath,
        processedUrl: currentPath,
        text: this.formatBreadcrumbText(segment),
        type: LinkType.INTERNAL,
        isValid: true,
        processedAt: Date.now(),
        metadata: {
          customAttributes: {
            requiresValidation: 'false',
            isBreadcrumb: 'true',
            isLast: (index === segments.length - 1).toString(),
            transformedAt: Date.now().toString()
          }
        }
      });
    });
    
    return links;
  }

  /**
   * 格式化面包屑文本
   */
  private formatBreadcrumbText(segment: string): string {
    return segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * 获取转换统计信息
   */
  public getTransformStats(): {
    totalTransformed: number;
    byType: Record<LinkType, number>;
    lastTransformTime: number;
  } {
    // 这里可以添加统计逻辑
    return {
      totalTransformed: 0,
      byType: {} as Record<LinkType, number>,
      lastTransformTime: Date.now()
    };
  }
}