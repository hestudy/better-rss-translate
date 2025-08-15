# better-rss-translate Brownfield Enhancement PRD

## Intro Project Analysis and Context

### Existing Project Overview

**Analysis Source**: IDE-based 新鲜分析

**Current Project State**:
better-rss-translate 是一个 RSS 翻译系统，主要功能是获取 RSS 源内容并进行翻译处理。项目使用现代 TypeScript 全栈架构，包含：

- **前端**: React + TanStack Router + Tailwind CSS + shadcn/ui
- **后端**: Hono + ORPC + Drizzle ORM + SQLite
- **队列系统**: BullMQ (rssQueue, scrapyQueue, translateQueue)
- **认证**: Better Auth (邮箱密码认证)

当前系统已有基础的队列管理组件，但缺少专门的 RSS 源管理界面。

### Available Documentation Analysis

**Available Documentation**:

- ✅ 技术栈文档 (从 package.json 和代码分析得出)
- ✅ 源码树/架构 (monorepo 结构清晰)
- ⚠️ 编码标准 (部分可从现有代码推断)
- ✅ API 文档 (ORPC 提供类型安全 API)
- ❌ 外部 API 文档 (需要补充)
- ❌ UX/UI 指南 (需要基于现有组件建立)
- ⚠️ 技术债务文档 (需要分析)

**建议**: 基于现有代码模式和组件库(shadcn/ui)建立一致的设计标准。

### Enhancement Scope Definition

**Enhancement Type**: ✅ 新功能添加

**Enhancement Description**:
创建一个完全独立的 RSS 队列管理界面，允许用户管理 RSS 源（添加、编辑、删除）并查看源和队列的统计信息。这个界面将与现有的 BullMQ 队列系统集成，但提供专门针对 RSS 源管理的用户体验。

**Impact Assessment**: ✅ 重大影响（需要新的数据模型、API 端点和前端界面）

### Goals and Background Context

**Goals**:

- 提供直观的 RSS 源管理界面，简化源的添加和维护
- 实现 RSS 源和翻译队列的可视化统计，提高系统透明度
- 建立独立的管理工作流，与现有队列监控分离
- 为未来的 RSS 源高级功能（如调度、优先级）奠定基础

**Background Context**:
当前系统虽然有队列处理能力，但缺少用户友好的 RSS 源管理界面。用户需要通过 API 或直接数据库操作来管理 RSS 源，这不利于日常运维。新的管理界面将填补这个空白，提供完整的 RSS 源生命周期管理，同时通过统计功能帮助用户了解系统运行状况和翻译效率。

**Change Log**:
| 日期 | 版本 | 描述 | 作者 |
|------|------|------|------|
| 2025-01-15 | 1.0 | 初始棕地增强 PRD | John (PM) |

## Requirements

### Functional

**FR1**: RSS 源管理 - 系统应提供完整的 RSS 源 CRUD 操作界面，包括添加新 RSS 源、编辑现有源信息、删除不需要的源，并与现有的 ORPC API 模式保持一致。

**FR2**: RSS 源验证 - 在添加或编辑 RSS 源时，系统应验证 RSS URL 的有效性和可访问性，确保源能够正常被队列系统处理。

**FR3**: 源状态监控 - 界面应显示每个 RSS 源的当前状态（活跃、暂停、错误），以及最后更新时间和下次计划更新时间。

**FR4**: 队列统计仪表板 - 提供 RSS 相关队列的实时统计信息，包括待处理项目数量、已完成项目数量、失败项目数量和平均处理时间。

**FR5**: 源级别统计 - 为每个 RSS 源显示详细统计，包括总文章数、翻译成功率、平均翻译时间和错误频率。

**FR6**: 批量操作 - 支持对多个 RSS 源进行批量操作，如批量启用/禁用、批量删除或批量更新设置。

**FR7**: 搜索和过滤 - 提供 RSS 源的搜索功能和状态过滤器，方便在大量源中快速定位特定项目。

**FR8**: 响应式设计 - 界面应适配桌面和移动设备，与现有的 shadcn/ui 组件库保持视觉一致性。

### Non Functional

**NFR1**: 性能要求 - RSS 管理界面的加载时间不应超过 2 秒，统计数据刷新不应影响现有队列处理性能。

**NFR2**: 数据一致性 - 所有 RSS 源操作必须与现有的 BullMQ 队列系统保持数据一致性，确保队列中的任务与源管理状态同步。

**NFR3**: 安全性 - RSS 源管理功能必须集成现有的 Better Auth 认证系统，确保只有授权用户可以修改 RSS 源配置。

**NFR4**: 可扩展性 - 系统应支持至少 1000 个 RSS 源的管理，统计查询性能不应随源数量增加而显著下降。

**NFR5**: 错误处理 - 界面应提供清晰的错误信息和恢复建议，特别是在 RSS 源验证失败或队列连接问题时。

**NFR6**: 数据库兼容性 - 新功能必须与现有的 SQLite/Turso 数据库架构兼容，使用 Drizzle ORM 进行数据操作。

### Compatibility Requirements

**CR1**: API 兼容性 - 新的 RSS 管理 API 必须遵循现有的 ORPC 模式，保持端到端类型安全，不破坏现有的队列 API 接口。

**CR2**: 数据库模式兼容性 - RSS 源管理的数据库变更必须通过 Drizzle 迁移系统实现，确保与现有表结构兼容且支持回滚。

**CR3**: UI/UX 一致性 - 新界面必须使用现有的 shadcn/ui 组件库、Tailwind CSS 配置和设计令牌，保持与现有队列管理界面的视觉一致性。

**CR4**: 集成兼容性 - RSS 管理功能必须与现有的 BullMQ 队列系统（rssQueue, scrapyQueue, translateQueue）无缝集成，不影响当前的队列处理流程。

## User Interface Enhancement Goals

### Integration with Existing UI

新的 RSS 队列管理界面将作为独立模块集成到现有应用中，遵循以下集成原则：

**设计系统一致性**: 复用现有的 shadcn/ui 组件库、Tailwind CSS 配置和颜色系统，确保与当前队列管理组件（queue-management-dashboard.tsx 和 queue-management-enhanced.tsx）保持视觉一致性。

**导航集成**: 在现有侧边栏导航中添加"RSS 源管理"菜单项，与现有的队列监控功能并列，但功能上独立。

**组件复用**: 利用现有的表格组件、搜索框、过滤器和状态标签组件，保持交互模式的一致性。

**主题支持**: 继承现有的深色/浅色主题切换功能，确保在所有主题下都有良好的视觉效果。

### Modified/New Screens and Views

**RSS 源管理主界面** (`/rss-management`):

- RSS 源列表视图，包含搜索、过滤和批量操作功能
- 源状态概览卡片，显示总数、活跃数、错误数等统计
- 添加新源的快速操作按钮

**RSS 源详情/编辑界面** (`/rss-management/source/:id`):

- 源基本信息编辑表单（URL、名称、描述、更新频率）
- 源特定统计图表（文章数量趋势、翻译成功率）
- 源相关的队列任务历史记录

**RSS 源添加界面** (`/rss-management/add`):

- 新源添加向导，包含 URL 验证和预览功能
- 源配置选项（更新频率、优先级、标签）
- 添加成功后的确认和下一步操作引导

**统计仪表板界面** (`/rss-management/analytics`):

- 全局 RSS 队列统计图表和趋势分析
- 源性能排行榜和异常源识别
- 系统健康状况监控面板

### UI Consistency Requirements

**视觉一致性**:

- 使用与现有队列管理界面相同的卡片布局、表格样式和按钮设计
- 保持相同的间距、字体大小和颜色使用规范
- 统一的图标使用（Lucide React 图标库）

**交互一致性**:

- 复用现有的搜索和过滤交互模式
- 保持相同的加载状态、错误提示和成功反馈样式
- 统一的表单验证和提交流程

**响应式一致性**:

- 在移动设备上采用与现有界面相同的布局调整策略
- 保持相同的断点和响应式行为模式

## Technical Constraints and Integration Requirements

### Existing Technology Stack

**语言**: TypeScript (前端和后端统一)
**框架**:

- 前端: React 18 + TanStack Router (文件路由)
- 后端: Hono (轻量级服务器框架)
  **数据库**: SQLite (本地开发) / Turso (生产环境)
  **ORM**: Drizzle ORM (TypeScript 优先)
  **API**: ORPC (端到端类型安全)
  **队列**: BullMQ (Redis-based)
  **认证**: Better Auth (邮箱密码认证)
  **UI 库**: shadcn/ui + Tailwind CSS + Lucide React 图标
  **构建工具**: Turborepo (monorepo 管理)

### Integration Approach

**数据库集成策略**:

- 创建新的 RSS 源管理表，使用 Drizzle schema 定义
- 通过外键关联现有队列任务表，保持数据一致性
- 使用 Drizzle 迁移系统进行 schema 变更，确保向后兼容
- 实现软删除机制，保留历史数据用于统计分析

**API 集成策略**:

- 扩展现有 ORPC 路由，添加 RSS 源管理端点
- 保持端到端类型安全，自动生成客户端类型
- 复用现有的认证中间件和错误处理模式
- 实现 RESTful API 设计，支持批量操作

**前端集成策略**:

- 在 apps/web 中创建新的 RSS 管理路由组件
- 复用现有的 shadcn/ui 组件和 Tailwind 配置
- 集成现有的认证状态管理和路由保护
- 使用 TanStack Query 进行数据获取和缓存管理

**测试集成策略**:

- 扩展现有的测试套件，添加 RSS 管理功能测试
- 使用相同的测试工具链和模式
- 实现 API 端点的集成测试和前端组件的单元测试

### Code Organization and Standards

**文件结构方法**:

```
apps/web/src/
├── routes/rss-management/     # RSS管理路由
├── components/rss/           # RSS特定组件
├── types/rss.ts             # RSS相关类型定义
└── hooks/useRssData.ts      # RSS数据获取hooks

apps/server/src/
├── routes/rss.ts            # RSS API路由
├── db/schema/rss.ts         # RSS数据库schema
├── services/rssService.ts   # RSS业务逻辑
└── queue/rssManagement.ts   # RSS队列管理
```

**命名约定**:

- 遵循现有的 camelCase (JS/TS) 和 kebab-case (文件名) 约定
- RSS 相关组件使用"Rss"前缀 (如: RssSourceList, RssStatsDashboard)
- API 端点使用 RESTful 约定 (/api/rss/sources, /api/rss/stats)

**编码标准**:

- 使用现有的 TypeScript 配置和 ESLint 规则
- 保持与现有代码相同的格式化标准 (Prettier)
- 遵循现有的错误处理和日志记录模式
- 使用 Zod 进行运行时类型验证

**文档标准**:

- 为新的 API 端点添加 JSDoc 注释
- 更新 README 文件，包含 RSS 管理功能说明
- 创建组件使用示例和 API 文档

### Risk Assessment and Mitigation

**技术风险**:

- 数据库 schema 变更可能影响现有功能
- 新的队列管理逻辑可能与现有队列冲突
- 大量 RSS 源可能影响数据库性能

**集成风险**:

- ORPC 类型生成可能因新端点而失败
- 现有认证流程可能需要调整权限模型
- 前端路由变更可能影响现有导航

**部署风险**:

- 数据库迁移失败可能导致数据丢失
- 新功能可能与现有环境配置冲突
- 队列系统变更可能影响现有任务处理

**缓解策略**:

- 实施渐进式数据库迁移和回滚计划
- 建立全面的测试覆盖，包括集成测试
- 使用功能开关控制新功能的启用
- 建立监控和告警机制，及时发现问题

## Epic and Story Structure

### Epic Approach

**Epic 结构决策**: 单个综合性 Epic，因为所有功能都围绕 RSS 源管理这一核心目标，并且需要协调的数据模型、API 和 UI 组件。这种结构可以确保功能的内聚性和实现的一致性。

## Epic 1: RSS 源管理系统

**Epic 目标**: 创建一个完整的 RSS 源管理系统，提供直观的用户界面来管理 RSS 源的生命周期（添加、编辑、删除），并通过统计仪表板监控 RSS 源和翻译队列的性能，同时与现有的 BullMQ 队列系统无缝集成。

**集成需求**:

- 与现有 BullMQ 队列系统（rssQueue, scrapyQueue, translateQueue）深度集成
- 保持与现有 ORPC API 和 Drizzle ORM 模式的一致性
- 复用现有 shadcn/ui 组件库和设计系统
- 集成现有 Better Auth 认证和权限管理

### Story 1.1: RSS 源数据模型和 API 基础设施

**As a** 系统开发者,
**I want** 建立 RSS 源管理的数据模型和基础 API 端点,
**so that** 为 RSS 源管理功能提供可靠的数据存储和访问接口。

#### Acceptance Criteria

1. 创建 RSS 源数据库表，包含字段：id, name, url, description, status, created_at, updated_at, last_fetch_at, fetch_interval
2. 实现 Drizzle schema 定义和数据库迁移脚本
3. 创建 ORPC 路由处理 RSS 源的 CRUD 操作（GET /api/rss/sources, POST /api/rss/sources, PUT /api/rss/sources/:id, DELETE /api/rss/sources/:id）
4. 实现 RSS URL 验证和可访问性检查
5. 添加适当的错误处理和类型安全验证
6. 创建 RSS 源相关的 TypeScript 类型定义

#### Integration Verification

- **IV1**: 验证新的数据库表不影响现有队列任务表的查询性能
- **IV2**: 确认 ORPC 类型生成正常工作，客户端可以获得完整的类型安全
- **IV3**: 验证 API 端点响应时间在可接受范围内（<500ms）

### Story 1.2: RSS 源列表和搜索界面

**As a** RSS 管理员,
**I want** 查看所有 RSS 源的列表并能够搜索和过滤,
**so that** 我可以快速找到和管理特定的 RSS 源。

#### Acceptance Criteria

1. 创建 RSS 源管理主页面（/rss-management），使用 TanStack Router
2. 实现 RSS 源列表组件，显示源名称、URL、状态、最后更新时间
3. 添加实时搜索功能，支持按名称和 URL 搜索
4. 实现状态过滤器（全部、活跃、暂停、错误）
5. 添加分页功能，支持大量 RSS 源的展示
6. 集成现有的 shadcn/ui 表格组件和搜索组件
7. 实现响应式设计，适配移动设备

#### Integration Verification

- **IV1**: 验证新页面与现有导航系统正确集成，侧边栏导航正常工作
- **IV2**: 确认页面样式与现有队列管理页面保持一致
- **IV3**: 验证认证保护正常工作，未登录用户无法访问

### Story 1.3: RSS 源添加和编辑功能

**As a** RSS 管理员,
**I want** 添加新的 RSS 源和编辑现有源的信息,
**so that** 我可以维护系统中的 RSS 源配置。

#### Acceptance Criteria

1. 创建 RSS 源添加页面（/rss-management/add），包含表单验证
2. 实现 RSS 源编辑页面（/rss-management/edit/:id）
3. 添加 RSS URL 实时验证，检查 URL 格式和可访问性
4. 实现表单字段：名称、URL、描述、更新频率、状态
5. 添加 RSS 源预览功能，显示源的基本信息和最新文章
6. 实现表单提交成功/失败的用户反馈
7. 添加取消和保存操作，包含未保存更改的提醒

#### Integration Verification

- **IV1**: 验证新添加的 RSS 源能够被现有队列系统正确识别和处理
- **IV2**: 确认表单验证与现有 API 错误处理机制兼容
- **IV3**: 验证编辑操作不会影响正在进行的队列任务

### Story 1.4: RSS 源删除和批量操作

**As a** RSS 管理员,
**I want** 删除不需要的 RSS 源和执行批量操作,
**so that** 我可以高效地维护 RSS 源列表。

#### Acceptance Criteria

1. 实现单个 RSS 源的删除功能，包含确认对话框
2. 添加批量选择功能，支持多选 RSS 源
3. 实现批量删除操作，包含批量确认机制
4. 添加批量启用/禁用 RSS 源功能
5. 实现软删除机制，保留历史数据用于统计
6. 添加删除前的依赖检查，防止删除有活跃任务的源
7. 提供清晰的操作反馈和撤销选项

#### Integration Verification

- **IV1**: 验证删除 RSS 源时，相关的队列任务得到正确处理（完成或取消）
- **IV2**: 确认批量操作不会导致数据库锁定或性能问题
- **IV3**: 验证软删除的 RSS 源不会出现在队列处理中

### Story 1.5: RSS 源和队列统计仪表板

**As a** RSS 管理员,
**I want** 查看 RSS 源和队列的统计信息,
**so that** 我可以监控系统性能和识别问题。

#### Acceptance Criteria

1. 创建统计仪表板页面（/rss-management/analytics）
2. 实现全局统计卡片：总源数、活跃源数、今日处理文章数、平均处理时间
3. 添加 RSS 源性能排行榜，显示最活跃和问题最多的源
4. 实现队列状态监控，显示各队列的待处理、进行中、已完成任务数
5. 添加时间范围选择器，支持查看不同时期的统计数据
6. 实现图表展示，使用适当的图表库显示趋势数据
7. 添加自动刷新功能，保持统计数据的实时性

#### Integration Verification

- **IV1**: 验证统计查询不会影响现有队列处理的性能
- **IV2**: 确认统计数据与实际队列状态保持一致
- **IV3**: 验证大量数据情况下统计页面的加载性能

### Story 1.6: RSS 源详情和历史记录

**As a** RSS 管理员,
**I want** 查看单个 RSS 源的详细信息和处理历史,
**so that** 我可以深入了解特定源的表现和问题。

#### Acceptance Criteria

1. 创建 RSS 源详情页面（/rss-management/source/:id）
2. 显示 RSS 源的完整信息：基本配置、统计数据、状态历史
3. 实现源相关的任务历史记录，显示最近的处理任务
4. 添加源特定的统计图表：文章数量趋势、成功率变化
5. 实现错误日志展示，帮助诊断问题源
6. 添加源测试功能，手动触发 RSS 源的获取和处理
7. 提供源配置的快速编辑入口

#### Integration Verification

- **IV1**: 验证详情页面的数据与队列系统中的实际任务状态一致
- **IV2**: 确认手动测试功能不会干扰正常的队列调度
- **IV3**: 验证历史记录查询的性能，确保不影响实时操作

---

## 总结

这个棕地增强 PRD 为 better-rss-translate 项目定义了一个完整的 RSS 源管理系统。通过 6 个协调的用户故事，我们将：

1. **建立坚实的技术基础** - 数据模型和 API 基础设施
2. **提供核心管理功能** - 列表、搜索、添加、编辑、删除
3. **支持高效运维** - 批量操作和统计监控
4. **确保深度集成** - 与现有 BullMQ 队列系统无缝协作

每个故事都包含详细的验收标准和集成验证要求，确保新功能不会破坏现有系统的稳定性。这个增强将显著提升 RSS 翻译系统的可管理性和可观测性。
