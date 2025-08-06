import React from "react";
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
} from "lucide-react";
import type { QueueItem } from "@/types/queue";

interface QueueManagementDashboardProps {
  className?: string;
}

// 模拟数据
const mockQueueData: QueueItem[] = [
  {
    id: "1",
    name: "RSS Feed Translation - Tech News",
    status: "active",
    priority: "high",
    assignee: "John Doe",
    createdAt: "2023-06-15",
    updatedAt: "2023-06-15",
  },
  {
    id: "2",
    name: "RSS Feed Translation - Sports",
    status: "pending",
    priority: "medium",
    assignee: "Jane Smith",
    createdAt: "2023-05-20",
    updatedAt: "2023-05-20",
  },
  {
    id: "3",
    name: "RSS Feed Translation - Business",
    status: "completed",
    priority: "low",
    assignee: "Mike Johnson",
    createdAt: "2023-04-10",
    updatedAt: "2023-04-10",
  },
  {
    id: "4",
    name: "RSS Feed Translation - Entertainment",
    status: "failed",
    priority: "medium",
    assignee: "Sarah Wilson",
    createdAt: "2023-03-05",
    updatedAt: "2023-03-05",
  },
  {
    id: "5",
    name: "RSS Feed Translation - Health",
    status: "active",
    priority: "high",
    assignee: "David Brown",
    createdAt: "2023-02-28",
    updatedAt: "2023-02-28",
  },
];

// 状态样式映射
const statusStyles = {
  active:
    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  failed: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
};

const priorityStyles = {
  high: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  medium:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  low: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
};

// 状态中文映射
const statusLabels = {
  active: "进行中",
  pending: "等待中",
  completed: "已完成",
  failed: "失败",
};

const priorityLabels = {
  high: "高",
  medium: "中",
  low: "低",
};

export default function QueueManagementDashboard({
  className,
}: QueueManagementDashboardProps) {
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
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 p-6">
          {/* 页面标题 */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-normal tracking-tight">
                    Queue Management Dashboard
                  </h1>
                  <ChevronDown className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 dark:bg-green-900/20">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">
                    Active
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>5 队列项目</span>
                </div>
                <MoreHorizontal className="h-5 w-5 cursor-pointer" />
              </div>
            </div>
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
                  {mockQueueData.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-border last:border-b-0"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium">{item.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            statusStyles[item.status]
                          }`}
                        >
                          {statusLabels[item.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            priorityStyles[item.priority]
                          }`}
                        >
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
          </div>
        </main>
      </div>

      {/* 页脚 */}
      <footer className="h-12 border-t border-border bg-card" />
    </div>
  );
}
