import React, { useState, Suspense } from 'react';
import { cn } from '@/lib/utils';
import { MarkdownPageProps, DEFAULT_MARKDOWN_CONFIG } from '@/types/markdown';
const MarkdownRenderer = React.lazy(() => import('./MarkdownRenderer').then(module => ({ default: module.MarkdownRenderer })));



// 主要的MarkdownPage组件
export function MarkdownPage({
  content: initialContent = '',
  showMetadata: _showMetadata = false,
  className,
  onContentChange: _onContentChange
}: MarkdownPageProps) {
  const [content] = useState(initialContent);
  const [config] = useState(DEFAULT_MARKDOWN_CONFIG);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex-1 overflow-y-auto p-6">
        <Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">加载Markdown渲染器中...</p>
            </div>
          </div>
        }>
          <MarkdownRenderer
            content={content}
            config={config}
          />
        </Suspense>
      </div>
    </div>
  );
}

export default MarkdownPage;