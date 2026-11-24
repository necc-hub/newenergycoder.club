import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Settings,
  Bell,
  BookOpen,
  TrendingUp,
  Target,
  Star,
  Edit3,
  Camera,
  X,
  Bookmark,
  History,
  Search,
  ChevronRight,
  ExternalLink,
  PlayCircle,
  PauseCircle,
  BarChart3
} from 'lucide-react';
import {
  TechRoute
} from '../types/learning';
import TechRoadmapOverview from './TechRoadmapOverview';
import LearningResources from './LearningResources';
import LearningPathDetail from './LearningPathDetail';
import LearningProgress from './LearningProgress';

interface PersonalLearningCenterProps {
  userId?: string;
  onNavigate?: (path: string) => void;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  joinDate: Date;
  lastActive: Date;
  preferences: {
    language: 'zh' | 'en';
    theme: 'light' | 'dark';
    notifications: {
      email: boolean;
      push: boolean;
      weeklyReport: boolean;
      achievements: boolean;
    };
    privacy: {
      showProfile: boolean;
      showProgress: boolean;
      showAchievements: boolean;
    };
  };
}

interface LearningSession {
  id: string;
  routeId: string;
  stepId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // 分钟
  status: 'active' | 'paused' | 'completed';
}

interface BookmarkedItem {
  id: string;
  type: 'route' | 'resource' | 'step';
  title: string;
  description: string;
  url?: string;
  addedAt: Date;
  tags: string[];
}

const PersonalLearningCenter: React.FC<PersonalLearningCenterProps> = ({
  userId = 'demo-user',
  onNavigate: _onNavigate
}) => {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'progress' | 'routes' | 'resources' | 'bookmarks' | 'settings'>('dashboard');
  const [selectedRoute, setSelectedRoute] = useState<TechRoute | null>(null);
  const [_showProfileEdit, setShowProfileEdit] = useState(false);
  const [currentSession, setCurrentSession] = useState<LearningSession | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'route' | 'resource' | 'step'>('all');

  // 用户资料
  const [userProfile, _setUserProfile] = useState<UserProfile>({
    id: userId,
    name: '学习者',
    email: 'learner@example.com',
    avatar: undefined,
    bio: '热爱学习新技术，专注于嵌入式和图形界面开发',
    location: '中国',
    website: 'https://example.com',
    github: 'https://github.com/learner',
    linkedin: 'https://linkedin.com/in/learner',
    joinDate: new Date('2024-01-01'),
    lastActive: new Date(),
    preferences: {
      language: 'zh',
      theme: 'light',
      notifications: {
        email: true,
        push: true,
        weeklyReport: true,
        achievements: true
      },
      privacy: {
        showProfile: true,
        showProgress: true,
        showAchievements: true
      }
    }
  });

  // 收藏夹数据
  const [bookmarkedItems] = useState<BookmarkedItem[]>([
    {
      id: 'bookmark-1',
      type: 'route',
      title: 'FreeRTOS嵌入式开发',
      description: '学习实时操作系统的核心概念和应用',
      addedAt: new Date('2024-11-01'),
      tags: ['嵌入式', 'RTOS', 'C语言']
    },
    {
      id: 'bookmark-2',
      type: 'resource',
      title: 'Qt官方文档',
      description: 'Qt框架的完整开发文档',
      url: 'https://doc.qt.io',
      addedAt: new Date('2024-11-15'),
      tags: ['Qt', '图形界面', 'C++']
    },
    {
      id: 'bookmark-3',
      type: 'step',
      title: '任务调度算法',
      description: 'FreeRTOS中的任务调度机制详解',
      addedAt: new Date('2024-11-20'),
      tags: ['调度', '算法', 'RTOS']
    }
  ]);

  // 开始学习会话
  const startLearningSession = (routeId: string, stepId: string) => {
    const session: LearningSession = {
      id: `session-${Date.now()}`,
      routeId,
      stepId,
      startTime: new Date(),
      duration: 0,
      status: 'active'
    };
    setCurrentSession(session);
  };

  // 暂停/恢复学习会话
  const toggleSession = () => {
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        status: currentSession.status === 'active' ? 'paused' : 'active'
      });
    }
  };

  // 结束学习会话
  const endSession = () => {
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        endTime: new Date(),
        status: 'completed'
      });
      // 这里可以保存会话数据到后端
      setTimeout(() => setCurrentSession(null), 2000);
    }
  };

  // 筛选收藏夹项目
  const filteredBookmarks = bookmarkedItems.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = filterType === 'all' || item.type === filterType;
    
    return matchesSearch && matchesType;
  });

  // 仪表板页面
  const DashboardSection = () => (
    <div className="space-y-6">
      {/* 欢迎横幅 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">欢迎回来，{userProfile.name}！</h2>
            <p className="text-blue-100">
              继续你的学习之旅，今天也要加油哦 🚀
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100">上次活动</p>
            <p className="font-semibold">
              {userProfile.lastActive.toLocaleDateString('zh-CN')}
            </p>
          </div>
        </div>
      </div>

      {/* 当前学习会话 */}
      {currentSession && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${
                currentSession.status === 'active' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
              }`}>
                {currentSession.status === 'active' ? 
                  <PlayCircle className="w-6 h-6" /> : 
                  <PauseCircle className="w-6 h-6" />
                }
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {currentSession.status === 'active' ? '正在学习中...' : '学习已暂停'}
                </h3>
                <p className="text-sm text-gray-600">
                  开始时间: {currentSession.startTime.toLocaleTimeString('zh-CN')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleSession}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentSession.status === 'active'
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {currentSession.status === 'active' ? '暂停' : '继续'}
              </button>
              <button
                onClick={endSession}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                结束
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* 快速操作 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => setActiveSection('routes')}
          className="bg-white rounded-xl border border-gray-200 p-6 text-left hover:shadow-lg transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <BookOpen className="w-6 h-6" />
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">浏览学习路线</h3>
          <p className="text-sm text-gray-600">
            发现新的技术路线，开始你的学习之旅
          </p>
        </button>

        <button
          onClick={() => setActiveSection('progress')}
          className="bg-white rounded-xl border border-gray-200 p-6 text-left hover:shadow-lg transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors">
              <TrendingUp className="w-6 h-6" />
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">查看学习进度</h3>
          <p className="text-sm text-gray-600">
            跟踪你的学习进度和成就
          </p>
        </button>

        <button
          onClick={() => setActiveSection('resources')}
          className="bg-white rounded-xl border border-gray-200 p-6 text-left hover:shadow-lg transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Star className="w-6 h-6" />
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">学习资源库</h3>
          <p className="text-sm text-gray-600">
            探索丰富的学习资源和工具
          </p>
        </button>
      </div>

      {/* 最近活动和推荐 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近活动 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <History className="w-5 h-5 mr-2" />
            最近活动
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-600 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">完成了 "FreeRTOS基础概念"</p>
                <p className="text-xs text-gray-600">2小时前</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-600 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">收藏了 "Qt官方文档"</p>
                <p className="text-xs text-gray-600">1天前</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-600 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">开始学习 "嵌入式开发" 路线</p>
                <p className="text-xs text-gray-600">3天前</p>
              </div>
            </div>
          </div>
        </div>

        {/* 推荐内容 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2" />
            为你推荐
          </h3>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <h4 className="font-medium text-gray-900 mb-1">uC/OS-II实时系统</h4>
              <p className="text-sm text-gray-600 mb-2">
                基于你对FreeRTOS的学习，推荐这个经典的RTOS
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  嵌入式开发
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <h4 className="font-medium text-gray-900 mb-1">Qt高级特性</h4>
              <p className="text-sm text-gray-600 mb-2">
                深入学习Qt的高级功能和最佳实践
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  图形界面
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 收藏夹页面
  const BookmarksSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">我的收藏夹</h2>
        <div className="flex items-center space-x-4">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="搜索收藏..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* 类型筛选 */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">全部类型</option>
            <option value="route">学习路线</option>
            <option value="resource">学习资源</option>
            <option value="step">学习步骤</option>
          </select>
        </div>
      </div>

      {/* 收藏夹统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <Bookmark className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <p className="text-lg font-bold text-gray-900">{bookmarkedItems.length}</p>
          <p className="text-sm text-gray-600">总收藏</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <BookOpen className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <p className="text-lg font-bold text-gray-900">
            {bookmarkedItems.filter(item => item.type === 'route').length}
          </p>
          <p className="text-sm text-gray-600">学习路线</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <Star className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <p className="text-lg font-bold text-gray-900">
            {bookmarkedItems.filter(item => item.type === 'resource').length}
          </p>
          <p className="text-sm text-gray-600">学习资源</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <Target className="w-6 h-6 text-orange-600 mx-auto mb-2" />
          <p className="text-lg font-bold text-gray-900">
            {bookmarkedItems.filter(item => item.type === 'step').length}
          </p>
          <p className="text-sm text-gray-600">学习步骤</p>
        </div>
      </div>

      {/* 收藏夹列表 */}
      <div className="space-y-4">
        {filteredBookmarks.length > 0 ? (
          filteredBookmarks.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      item.type === 'route' ? 'bg-blue-100 text-blue-600' :
                      item.type === 'resource' ? 'bg-green-100 text-green-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {item.type === 'route' ? <BookOpen className="w-4 h-4" /> :
                       item.type === 'resource' ? <Star className="w-4 h-4" /> :
                       <Target className="w-4 h-4" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">
                        收藏于 {item.addedAt.toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{item.description}</p>
                  
                  {/* 标签 */}
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {item.url && (
                    <button
                      onClick={() => window.open(item.url, '_blank')}
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                  <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery || filterType !== 'all' ? '没有找到匹配的收藏' : '还没有收藏任何内容'}
            </h3>
            <p className="text-gray-600">
              {searchQuery || filterType !== 'all' ? 
                '尝试调整搜索条件或筛选器' : 
                '开始探索学习路线和资源，收藏你感兴趣的内容吧！'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // 设置页面
  const SettingsSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">个人设置</h2>
      
      {/* 个人资料 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">个人资料</h3>
          <button
            onClick={() => setShowProfileEdit(true)}
            className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>编辑</span>
          </button>
        </div>
        
        <div className="flex items-start space-x-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              {userProfile.avatar ? (
                <img 
                  src={userProfile.avatar} 
                  alt={userProfile.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <button className="absolute -bottom-1 -right-1 p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
              <Camera className="w-3 h-3" />
            </button>
          </div>
          
          <div className="flex-1 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
              <p className="text-gray-900">{userProfile.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <p className="text-gray-900">{userProfile.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">个人简介</label>
              <p className="text-gray-900">{userProfile.bio || '暂无简介'}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 通知设置 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">通知设置</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">邮件通知</p>
              <p className="text-sm text-gray-600">接收学习提醒和更新通知</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={userProfile.preferences.notifications.email}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">推送通知</p>
              <p className="text-sm text-gray-600">接收浏览器推送通知</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={userProfile.preferences.notifications.push}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">周报</p>
              <p className="text-sm text-gray-600">每周学习进度报告</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={userProfile.preferences.notifications.weeklyReport}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
      
      {/* 隐私设置 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">隐私设置</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">公开个人资料</p>
              <p className="text-sm text-gray-600">允许其他用户查看你的个人资料</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={userProfile.preferences.privacy.showProfile}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">公开学习进度</p>
              <p className="text-sm text-gray-600">允许其他用户查看你的学习进度</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={userProfile.preferences.privacy.showProgress}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-gray-900">学习中心</h1>
              
              {/* 导航菜单 */}
              <nav className="hidden md:flex space-x-6">
                {[
                  { key: 'dashboard', label: '仪表板', icon: <TrendingUp className="w-4 h-4" /> },
                  { key: 'progress', label: '学习进度', icon: <BarChart3 className="w-4 h-4" /> },
                  { key: 'routes', label: '学习路线', icon: <BookOpen className="w-4 h-4" /> },
                  { key: 'resources', label: '学习资源', icon: <Star className="w-4 h-4" /> },
                  { key: 'bookmarks', label: '收藏夹', icon: <Bookmark className="w-4 h-4" /> }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActiveSection(item.key as any)}
                    className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeSection === item.key
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
            
            {/* 用户菜单 */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveSection('settings')}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                {userProfile.avatar ? (
                  <img 
                    src={userProfile.avatar} 
                    alt={userProfile.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeSection === 'dashboard' && <DashboardSection />}
            {activeSection === 'progress' && (
              <LearningProgress 
                userId={userId}
                onRouteSelect={(_routeId) => {
                  setActiveSection('routes');
                  // 这里可以设置选中的路线
                }}
              />
            )}
            {activeSection === 'routes' && (
              selectedRoute ? (
                <LearningPathDetail 
                  route={selectedRoute}
                  onBack={() => setSelectedRoute(null)}
                  onStartLearning={(routeId) => {
                    // 开始学习会话
                    startLearningSession(routeId, 'step-1');
                    setActiveSection('dashboard');
                  }}
                />
              ) : (
                <TechRoadmapOverview 
                  onSelectRoute={(route) => setSelectedRoute(route)}
                />
              )
            )}
            {activeSection === 'resources' && (
              <LearningResources 
                onAddToLearningPlan={(resource) => {
                  // 添加到学习计划
                  console.log('Added to learning plan:', resource);
                }}
              />
            )}
            {activeSection === 'bookmarks' && <BookmarksSection />}
            {activeSection === 'settings' && <SettingsSection />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PersonalLearningCenter;