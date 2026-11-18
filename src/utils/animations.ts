// 轻量级动画工具，替代framer-motion
// 提供常用的动画效果和组件

// 动画配置类型
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
  fillMode?: 'forwards' | 'backwards' | 'both' | 'none';
}

// 动画类名映