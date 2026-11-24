import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MarkdownPage } from '@/components/markdown/MarkdownPage';
import { useMarkdown } from '@/hooks/useMarkdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  FileText,
  Download,
  Upload,
  Save,
  History,
  Settings,
  Share2,
  BookOpen,
  Clock,
  BarChart3
} from 'lucide-react';
import { DEFAULT_MARKDOWN_CONFIG } from '@/types/markdown';

// 示例Markdown内容
const EXAMPLE_CONTENT = `# Markdown 编辑器演示

欢迎使用我们的 **Markdown 编辑器**！这是一个功能丰富的在线编辑器，支持实时预览和多种高级功能。

## 主要特性

### ✨ 实时预览
- 支持分屏模式，左侧编辑，右侧实时预览
- 语法高亮显示
- 响应式设计，适配各种屏幕尺寸

### 🎨 丰富的语法支持

#### 文本格式
- **粗体文本**
- *斜体文本*
- ~~删除线~~
- \`行内代码\`

#### 代码块
\`\`\`javascript
function hello() {
  console.log("Hello, Markdown!");
  return "Welcome to our editor!";
}

hello();
\`\`\`

#### 表格
| 功能 | 状态 | 描述 |
|------|------|------|
| 语法高亮 | ✅ | 支持多种编程语言 |
| 实时预览 | ✅ | 即时查看渲染效果 |
| 文件导入导出 | ✅ | 支持 .md 文件 |
| 自动保存 | ✅ | 防止数据丢失 |

#### 任务列表
- [x] 完成基础编辑器功能
- [x] 添加语法高亮
- [x] 实现实时预览
- [ ] 添加协作功能
- [ ] 支持插件系统

### 🔗 链接和图片

访问我们的 [官方网站](https://example.com) 了解更多信息。

> **提示**: 这是一个引用块，用于突出显示重要信息。

### 📊 数学公式（如果支持）

行内公式：$E = mc^2$

块级公式：
$$
\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n
$$

---

## 使用指南

1. **编辑模式**: 在左侧面板输入 Markdown 内容
2. **预览模式**: 在右侧面板查看渲染效果
3. **配置选项**: 使用左侧配置面板调整编辑器设置
4. **文件操作**: 使用工具栏导入/导出文件

### 快捷操作

- **Ctrl + S**: 保存到本地存储
- **Ctrl + O**: 导入文件
- **Ctrl + E**: 导出文件

---

*感谢使用我们的 Markdown 编辑器！如有问题或建议，请随时联系我们。*
`;

// 统计信息展示组件
interface StatsDisplayProps {
  stats: any;
  className?: string;
}

function StatsDisplay({ stats, className }: StatsDisplayProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          文档统计
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">字符数</span>
              <Badge variant="outline">{stats.characters}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">词数</span>
              <Badge variant="outline">{stats.words}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">行数</span>
              <Badge variant="outline">{stats.lines}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">阅读时间</span>
              <Badge variant="outline">{stats.readingTime} 分钟</Badge>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">标题</span>
              <Badge variant="outline">
                {Object.values(stats.headings).reduce((a: number, b: any) => a + Number(b), 0).toString()}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">链接</span>
              <Badge variant="outline">{stats.links}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">图片</span>
              <Badge variant="outline">{stats.images}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">代码块</span>
              <Badge variant="outline">{stats.codeBlocks}</Badge>
            </div>
          </div>
        </div>
        
        {/* 标题层级分布 */}
        {Object.values(stats.headings).some((count: any) => Number(count) > 0) && (
          <div className="space-y-2">
            <Separator />
            <h4 className="text-sm font-medium">标题分布</h4>
            <div className="space-y-1">
              {Object.entries(stats.headings).map(([level, count]) =>
                Number(count) > 0 ? (
                  <div key={level} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{level.toUpperCase()}</span>
                    <span>{Number(count)}</span>
                  </div>
                ) : null
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// 历史记录组件
interface HistoryPanelProps {
  history: any[];
  onRestore: (id: string) => void;
  onClear: () => void;
  className?: string;
}

function HistoryPanel({ history, onRestore, onClear, className }: HistoryPanelProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5" />
            编辑历史
          </div>
          {history.length > 0 && (
            <Button variant="outline" size="sm" onClick={onClear}>
              清空
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            暂无历史记录
          </p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-2 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {entry.content.split('\n')[0] || '空文档'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRestore(entry.id)}
                >
                  恢复
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// 主要的MarkdownViewer组件
export function MarkdownViewer() {
  const navigate = useNavigate();
  const [searchParams, _setSearchParams] = useSearchParams();
  const [sidebarTab, setSidebarTab] = useState<'stats' | 'history' | 'help'>('stats');
  const [showSidebar, setShowSidebar] = useState(true);

  // 从URL参数获取初始内容
  const urlContent = searchParams.get('content');
  const _urlMode = searchParams.get('mode') || 'split';

  // 使用Markdown Hook
  const {
    content,
    config: _config,
    isLoading: _isLoading,
    error,
    lastSaved,
    stats,
    updateContent,
    updateConfig: _updateConfig,
    clearContent: _clearContent,
    resetConfig: _resetConfig,
    importFile,
    exportFile,
    saveToStorage,
    restoreFromStorage: _restoreFromStorage,
    clearStorage: _clearStorage,
    history,
    clearHistory,
    restoreFromHistory
  } = useMarkdown(
    urlContent || EXAMPLE_CONTENT,
    DEFAULT_MARKDOWN_CONFIG,
    {
      autoSave: true,
      autoSaveDelay: 1000,
      enableHistory: true,
      maxHistoryEntries: 20
    }
  );

  // 处理历史恢复
  const handleRestoreFromHistory = (id: string) => {
    const restoredContent = restoreFromHistory?.(id);
    if (restoredContent) {
      updateContent(restoredContent, false); // 不添加到历史记录
    }
  };

  // 处理文件导入
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.markdown,.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        importFile(file).catch(console.error);
      }
    };
    input.click();
  };

  // 处理分享
  const handleShare = () => {
    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.set('content', content);
    
    if (navigator.share) {
      navigator.share({
        title: 'Markdown 文档',
        text: '查看这个 Markdown 文档',
        url: shareUrl.toString()
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareUrl.toString()).then(() => {
        // 这里可以添加一个toast提示
        console.log('链接已复制到剪贴板');
      }).catch(console.error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <h1 className="text-xl font-semibold">Markdown 编辑器</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {lastSaved && (
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {lastSaved.toLocaleTimeString()}
            </Badge>
          )}
          
          <Button variant="outline" size="sm" onClick={handleImport}>
            <Upload className="h-4 w-4 mr-2" />
            导入
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => exportFile()}>
            <Download className="h-4 w-4 mr-2" />
            导出
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            分享
          </Button>
          
          <Button variant="outline" size="sm" onClick={saveToStorage}>
            <Save className="h-4 w-4 mr-2" />
            保存
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <Alert className="m-4 border-destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 主要内容区域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* Markdown编辑器 */}
        <div className="flex-1">
          <MarkdownPage
            content={content}
            showMetadata={false}
            onContentChange={updateContent}
            className="h-full"
          />
        </div>

        {/* 右侧边栏 */}
        {showSidebar && (
          <div className="w-80 border-l border-border bg-muted/30">
            <Tabs value={sidebarTab} onValueChange={(value: any) => setSidebarTab(value)} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 m-2">
                <TabsTrigger value="stats" className="text-xs">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  统计
                </TabsTrigger>
                <TabsTrigger value="history" className="text-xs">
                  <History className="h-3 w-3 mr-1" />
                  历史
                </TabsTrigger>
                <TabsTrigger value="help" className="text-xs">
                  <BookOpen className="h-3 w-3 mr-1" />
                  帮助
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto p-2">
                <TabsContent value="stats" className="mt-0">
                  <StatsDisplay stats={stats} />
                </TabsContent>

                <TabsContent value="history" className="mt-0">
                  <HistoryPanel
                    history={history || []}
                    onRestore={handleRestoreFromHistory}
                    onClear={clearHistory || (() => {})}
                  />
                </TabsContent>

                <TabsContent value="help" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        使用帮助
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                      <div>
                        <h4 className="font-medium mb-2">快捷键</h4>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div>Ctrl + S - 保存</div>
                          <div>Ctrl + O - 导入文件</div>
                          <div>Ctrl + E - 导出文件</div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-medium mb-2">支持的语法</h4>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div>• 标题 (# ## ###)</div>
                          <div>• 粗体 (**文本**)</div>
                          <div>• 斜体 (*文本*)</div>
                          <div>• 代码 (`代码`)</div>
                          <div>• 链接 ([文本](URL))</div>
                          <div>• 图片 (![alt](URL))</div>
                          <div>• 表格</div>
                          <div>• 任务列表</div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-medium mb-2">功能特性</h4>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div>• 实时预览</div>
                          <div>• 语法高亮</div>
                          <div>• 自动保存</div>
                          <div>• 历史记录</div>
                          <div>• 文件导入导出</div>
                          <div>• 文档统计</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}

export default MarkdownViewer;