// 队列管理相关的类型定义

export type QueueStatus = 'active' | 'pending' | 'completed' | 'failed';
export type QueuePriority = 'high' | 'medium' | 'low';

export interface QueueItem {
  id: string;
  name: string;
  status: QueueStatus;
  priority: QueuePriority;
  assignee: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  estimatedDuration?: number; // 预估持续时间（分钟）
  actualDuration?: number; // 实际持续时间（分钟）
  tags?: string[];
}

export interface QueueStats {
  total: number;
  active: number;
  pending: number;
  completed: number;
  failed: number;
}

export interface QueueFilter {
  status?: QueueStatus[];
  priority?: QueuePriority[];
  assignee?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface QueueSortOptions {
  field: keyof QueueItem;
  direction: 'asc' | 'desc';
}
