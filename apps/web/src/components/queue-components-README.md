# 队列管理组件

基于Figma设计生成的队列管理仪表板组件，包含两个版本：

## 组件列表

### 1. QueueManagementDashboard (基础版)
- **文件**: `queue-management-dashboard.tsx`
- **路由**: `/queue-management`
- **功能**: 基础的队列管理界面，直接从Figma设计转换而来

### 2. QueueManagementEnhanced (增强版)
- **文件**: `queue-management-enhanced.tsx`
- **路由**: `/queue-enhanced`
- **功能**: 增强版本，包含搜索、过滤、统计等功能

## 特性

### 基础版特性
- ✅ 响应式设计
- ✅ 深色/浅色主题支持
- ✅ 队列状态显示（进行中、等待中、已完成、失败）
- ✅ 优先级显示（高、中、低）
- ✅ 表格形式展示队列数据
- ✅ 侧边栏导航
- ✅ 顶部导航栏

### 增强版特性
- ✅ 所有基础版特性
- ✅ 实时搜索功能
- ✅ 状态和优先级过滤
- ✅ 队列统计卡片
- ✅ 新建队列按钮
- ✅ 刷新功能
- ✅ 悬停效果
- ✅ 空状态处理

## 技术栈

- **React 18** + **TypeScript**
- **Tailwind CSS** 用于样式
- **Lucide React** 用于图标
- **Tanstack Router** 用于路由
- **shadcn/ui** 设计系统

## 类型定义

队列相关的类型定义位于 `src/types/queue.ts`：

```typescript
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
  estimatedDuration?: number;
  actualDuration?: number;
  tags?: string[];
}
```

## 使用方法

### 1. 导入组件
```typescript
import QueueManagementDashboard from '@/components/queue-management-dashboard';
import QueueManagementEnhanced from '@/components/queue-management-enhanced';
```

### 2. 在路由中使用
```typescript
// 基础版
<QueueManagementDashboard />

// 增强版
<QueueManagementEnhanced />
```

### 3. 自定义样式
```typescript
<QueueManagementEnhanced className="custom-class" />
```

## 样式系统

组件使用项目的Tailwind CSS配置，支持：

- **颜色系统**: 使用CSS变量定义的主题颜色
- **深色模式**: 自动适配系统主题
- **响应式**: 移动端友好的布局
- **动画**: 悬停和交互效果

## 数据集成

目前使用模拟数据，可以通过以下方式集成真实数据：

1. **替换模拟数据**: 将 `mockQueueData` 替换为API调用
2. **添加状态管理**: 使用React Query或Zustand管理状态
3. **实现CRUD操作**: 添加创建、更新、删除功能

## 扩展建议

### 功能扩展
- [ ] 批量操作（批量删除、批量更新状态）
- [ ] 拖拽排序
- [ ] 导出功能（CSV、Excel）
- [ ] 队列详情页面
- [ ] 实时更新（WebSocket）
- [ ] 队列模板
- [ ] 权限控制

### UI/UX 改进
- [ ] 加载状态
- [ ] 错误处理
- [ ] 确认对话框
- [ ] 通知系统
- [ ] 键盘快捷键
- [ ] 无限滚动或分页

## 性能优化

- 使用 `useMemo` 优化过滤和搜索
- 虚拟化长列表（react-window）
- 懒加载图片和组件
- 防抖搜索输入

## 测试

建议添加以下测试：

```typescript
// 组件测试
describe('QueueManagementDashboard', () => {
  it('renders queue items correctly', () => {
    // 测试队列项目渲染
  });
  
  it('filters items by status', () => {
    // 测试状态过滤
  });
  
  it('searches items by name', () => {
    // 测试搜索功能
  });
});
```

## 部署注意事项

1. 确保所有依赖已安装
2. 检查TypeScript类型错误
3. 验证Tailwind CSS配置
4. 测试深色模式兼容性
5. 验证响应式布局
