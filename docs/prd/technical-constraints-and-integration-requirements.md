# Technical Constraints and Integration Requirements

## Existing Technology Stack

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

## Integration Approach

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

## Code Organization and Standards

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

## Risk Assessment and Mitigation

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
