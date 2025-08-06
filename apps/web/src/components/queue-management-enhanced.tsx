import React, { useState, useMemo } from 'react';
import { 
  Menu, 
  Search, 
  Grid3X3, 
  ChevronDown, 
  MoreHorizontal,
  Activity,
  Calendar,
  Clock,
  Users,
  Filter,
  Plus,
  RefreshCw
} from 'lucide-react';
import type { QueueItem } from '@/types/queue';

interface QueueManagementEnhancedProps {
  className?: string;
}

// 模拟数据
const mockQueueData: QueueItem[] = [
  {
    id: '1',
    name: 'RSS Feed Translation - Tech News',
    status: 'active',
    priority: 'high',
    assignee: 'John Doe',
    createdAt: '2023-06-15',
    updatedAt: '2023-06-15'
  },
  {
    id: '2', 
    name: 'RSS Feed Translation - Sports',
    status: 'pending',
    priority: 'medium',
    assignee: 'Jane Smith',
    createdAt: '2023-05-20',
    updatedAt: '2023-05-20'
  },
  {
    id: '3',
    name: 'RSS Feed Translation - Business',
    status: 'completed',
    priority: 'low',
    assignee: 'Mike Johnson',
    createdAt: '2023-04-10',
    updatedAt: '2023-04-10'
  },
  {
    id: '4',
    name: 'RSS Feed Translation - Entertainment',
    status: 'failed',
    priority: 'medium',
    assignee: 'Sarah Wilson',
    createdAt: '2023-03-05',
    updatedAt: '2023-03-05'
  },
  {
    id: '5',
    name: 'RSS Feed Translation - Health',
    status: 'active',
    priority: 'high',
    assignee: 'David Brown',
    createdAt: '2023-02-28',
    updatedAt: '2023-02-28'
  }
];

// 状态样式映射
const statusStyles = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
};

const priorityStyles = {
  high: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  low: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
};

// 状态中文映射
const statusLabels = {
  active: '进行中',
  pending: '等待中',
  completed: '已完成',
  failed: '失败'
};

const priorityLabels = {
  high: '高',
  medium: '中',
  low: '低'
};

export default function QueueManagementEnhanced({ className }: QueueManagementEnhancedProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // 过滤和搜索逻辑
  const filteredData = useMemo(() => {
    return mockQueueData.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.assignee.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [searchTerm, statusFilter, priorityFilter]);

  // 统计数据
  const stats = useMemo(() => {
    const total = mockQueueData.length;
    const active = mockQueueData.filter(item => item.status === 'active').length;
    const pending = mockQueueData.filter(item => item.status === 'pending').length;
    const completed = mockQueueData.filter(item => item.status === 'completed').length;
    const failed = mockQueueData.filter(item => item.status === 'failed').length;
    
    return { total, active, pending, completed, failed };
  }, []);

  return (
    <div className={`min-h-screen bg-background text-foreground ${className}`}>
      {/* 导航栏 */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            <Menu className="h-6 w-6 cursor-pointer" />
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded bg-primary" />
              <span className="text-xl font-light tracking-tight text-primary">
                BetterRssTranslate
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <Search className="h-6 w-6 cursor-pointer" />
            <Grid3X3 className="h-6 w-6 cursor-pointer" />
            <div className="h-10 w-10 rounded-full bg-muted" />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* 侧边栏 */}
        <aside className="w-80 border-r border-border bg-card p-6">
          <nav className="space-y-2">
            <div className="flex items-center gap-3 rounded-lg bg-primary/10 px-4 py-2 text-primary">
              <Activity className="h-5 w-5" />
              <span className="font-medium">Dashboard</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg px-4 py-2 text-muted-foreground hover:bg-muted">
              <Calendar className="h-5 w-5" />
              <span className="font-medium">Queues</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg px-4 py-2 text-muted-foreground hover:bg-muted">
              <Clock className="h-5 w-5" />
              <span className="font-medium">Settings</span>
            </div>
          </nav>

          {/* 统计卡片 */}
          <div className="mt-8 space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">队列统计</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border bg-background p-3">
                <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                <div className="text-xs text-muted-foreground">进行中</div>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-xs text-muted-foreground">等待中</div>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
                <div className="text-xs text-muted-foreground">已完成</div>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                <div className="text-xs text-muted-foreground">失败</div>
              </div>
            </div>
          </div>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 p-6">
          {/* 页面标题 */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-normal tracking-tight">
                    队列管理仪表板
                  </h1>
                  <ChevronDown className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 dark:bg-green-900/20">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">
                    运行中
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm hover:bg-muted">
                  <Plus className="h-4 w-4" />
                  新建队列
                </button>
                <button className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm hover:bg-muted">
                  <RefreshCw className="h-4 w-4" />
                  刷新
                </button>
              </div>
            </div>
          </div>

          {/* 搜索和过滤栏 */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索队列名称或负责人..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">所有状态</option>
              <option value="active">进行中</option>
              <option value="pending">等待中</option>
              <option value="completed">已完成</option>
              <option value="failed">失败</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">所有优先级</option>
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
            
            <button className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm hover:bg-muted">
              <Filter className="h-4 w-4" />
              更多筛选
            </button>
          </div>

          {/* 队列表格 */}
          <div className="rounded-lg border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                      队列名称
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                      状态
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                      优先级
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                      负责人
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                      创建时间
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                      更新时间
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item.id} className="border-b border-border last:border-b-0 hover:bg-muted/50">
                      <td className="px-6 py-4">
                        <div className="font-medium">{item.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusStyles[item.status]}`}>
                          {statusLabels[item.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${priorityStyles[item.priority]}`}>
                          {priorityLabels[item.priority]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {item.assignee}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {item.createdAt}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {item.updatedAt}
                      </td>
                      <td className="px-6 py-4">
                        <MoreHorizontal className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredData.length === 0 && (
              <div className="py-12 text-center">
                <div className="text-muted-foreground">没有找到匹配的队列项目</div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 页脚 */}
      <footer className="h-12 border-t border-border bg-card" />
    </div>
  );
}
