# Epic 1: RSS 源管理系统

**Epic 目标**: 创建一个完整的 RSS 源管理系统，提供直观的用户界面来管理 RSS 源的生命周期（添加、编辑、删除），并通过统计仪表板监控 RSS 源和翻译队列的性能，同时与现有的 BullMQ 队列系统无缝集成。

**集成需求**:

- 与现有 BullMQ 队列系统（rssQueue, scrapyQueue, translateQueue）深度集成
- 保持与现有 ORPC API 和 Drizzle ORM 模式的一致性
- 复用现有 shadcn/ui 组件库和设计系统
- 集成现有 Better Auth 认证和权限管理

## Story 1.1: RSS 源数据模型和 API 基础设施

**As a** 系统开发者,
**I want** 建立 RSS 源管理的数据模型和基础 API 端点,
**so that** 为 RSS 源管理功能提供可靠的数据存储和访问接口。

### Acceptance Criteria

1. 创建 RSS 源数据库表，包含字段：id, name, url, description, status, created_at, updated_at, last_fetch_at, fetch_interval
2. 实现 Drizzle schema 定义和数据库迁移脚本
3. 创建 ORPC 路由处理 RSS 源的 CRUD 操作（GET /api/rss/sources, POST /api/rss/sources, PUT /api/rss/sources/:id, DELETE /api/rss/sources/:id）
4. 实现 RSS URL 验证和可访问性检查
5. 添加适当的错误处理和类型安全验证
6. 创建 RSS 源相关的 TypeScript 类型定义

### Integration Verification

- **IV1**: 验证新的数据库表不影响现有队列任务表的查询性能
- **IV2**: 确认 ORPC 类型生成正常工作，客户端可以获得完整的类型安全
- **IV3**: 验证 API 端点响应时间在可接受范围内（<500ms）

## Story 1.2: RSS 源列表和搜索界面

**As a** RSS 管理员,
**I want** 查看所有 RSS 源的列表并能够搜索和过滤,
**so that** 我可以快速找到和管理特定的 RSS 源。

### Acceptance Criteria

1. 创建 RSS 源管理主页面（/rss-management），使用 TanStack Router
2. 实现 RSS 源列表组件，显示源名称、URL、状态、最后更新时间
3. 添加实时搜索功能，支持按名称和 URL 搜索
4. 实现状态过滤器（全部、活跃、暂停、错误）
5. 添加分页功能，支持大量 RSS 源的展示
6. 集成现有的 shadcn/ui 表格组件和搜索组件
7. 实现响应式设计，适配移动设备

### Integration Verification

- **IV1**: 验证新页面与现有导航系统正确集成，侧边栏导航正常工作
- **IV2**: 确认页面样式与现有队列管理页面保持一致
- **IV3**: 验证认证保护正常工作，未登录用户无法访问

## Story 1.3: RSS 源添加和编辑功能

**As a** RSS 管理员,
**I want** 添加新的 RSS 源和编辑现有源的信息,
**so that** 我可以维护系统中的 RSS 源配置。

### Acceptance Criteria

1. 创建 RSS 源添加页面（/rss-management/add），包含表单验证
2. 实现 RSS 源编辑页面（/rss-management/edit/:id）
3. 添加 RSS URL 实时验证，检查 URL 格式和可访问性
4. 实现表单字段：名称、URL、描述、更新频率、状态
5. 添加 RSS 源预览功能，显示源的基本信息和最新文章
6. 实现表单提交成功/失败的用户反馈
7. 添加取消和保存操作，包含未保存更改的提醒

### Integration Verification

- **IV1**: 验证新添加的 RSS 源能够被现有队列系统正确识别和处理
- **IV2**: 确认表单验证与现有 API 错误处理机制兼容
- **IV3**: 验证编辑操作不会影响正在进行的队列任务

## Story 1.4: RSS 源删除和批量操作

**As a** RSS 管理员,
**I want** 删除不需要的 RSS 源和执行批量操作,
**so that** 我可以高效地维护 RSS 源列表。

### Acceptance Criteria

1. 实现单个 RSS 源的删除功能，包含确认对话框
2. 添加批量选择功能，支持多选 RSS 源
3. 实现批量删除操作，包含批量确认机制
4. 添加批量启用/禁用 RSS 源功能
5. 实现软删除机制，保留历史数据用于统计
6. 添加删除前的依赖检查，防止删除有活跃任务的源
7. 提供清晰的操作反馈和撤销选项

### Integration Verification

- **IV1**: 验证删除 RSS 源时，相关的队列任务得到正确处理（完成或取消）
- **IV2**: 确认批量操作不会导致数据库锁定或性能问题
- **IV3**: 验证软删除的 RSS 源不会出现在队列处理中

## Story 1.5: RSS 源和队列统计仪表板

**As a** RSS 管理员,
**I want** 查看 RSS 源和队列的统计信息,
**so that** 我可以监控系统性能和识别问题。

### Acceptance Criteria

1. 创建统计仪表板页面（/rss-management/analytics）
2. 实现全局统计卡片：总源数、活跃源数、今日处理文章数、平均处理时间
3. 添加 RSS 源性能排行榜，显示最活跃和问题最多的源
4. 实现队列状态监控，显示各队列的待处理、进行中、已完成任务数
5. 添加时间范围选择器，支持查看不同时期的统计数据
6. 实现图表展示，使用适当的图表库显示趋势数据
7. 添加自动刷新功能，保持统计数据的实时性

### Integration Verification

- **IV1**: 验证统计查询不会影响现有队列处理的性能
- **IV2**: 确认统计数据与实际队列状态保持一致
- **IV3**: 验证大量数据情况下统计页面的加载性能

## Story 1.6: RSS 源详情和历史记录

**As a** RSS 管理员,
**I want** 查看单个 RSS 源的详细信息和处理历史,
**so that** 我可以深入了解特定源的表现和问题。

### Acceptance Criteria

1. 创建 RSS 源详情页面（/rss-management/source/:id）
2. 显示 RSS 源的完整信息：基本配置、统计数据、状态历史
3. 实现源相关的任务历史记录，显示最近的处理任务
4. 添加源特定的统计图表：文章数量趋势、成功率变化
5. 实现错误日志展示，帮助诊断问题源
6. 添加源测试功能，手动触发 RSS 源的获取和处理
7. 提供源配置的快速编辑入口

### Integration Verification

- **IV1**: 验证详情页面的数据与队列系统中的实际任务状态一致
- **IV2**: 确认手动测试功能不会干扰正常的队列调度
- **IV3**: 验证历史记录查询的性能，确保不影响实时操作

---
