# Quick Reference - Key Files and Entry Points

## Critical Files for Understanding the System

- **Main Entry**: `apps/server/src/index.ts` - Hono server with ORPC, BullBoard, and auth
- **Configuration**: Environment variables, no centralized config file
- **Core Business Logic**: `apps/server/src/routers/feed.ts` - RSS feed CRUD operations
- **Database Models**: `apps/server/src/db/schema/feed.ts` - Feed and feeditem tables
- **Queue System**: `apps/server/src/queue/` - BullMQ queues (rss, scrapy, translate)
- **Frontend Components**: `apps/web/src/components/queue-management-*.tsx` - Existing queue UI

## Enhancement Impact Areas

Based on the RSS 管理界面增强 requirements, these files/modules will be affected:

- **New API Routes**: Extend `apps/server/src/routers/feed.ts` or create new RSS management router
- **Database Schema**: `apps/server/src/db/schema/feed.ts` - May need additional fields for management
- **Queue Integration**: `apps/server/src/queue/rssQueue.ts` - Statistics and monitoring integration
- **Frontend Routes**: New routes in `apps/web/src/routes/` for RSS management interface
- **UI Components**: New components in `apps/web/src/components/rss/` following existing patterns
- **Type Definitions**: Extend or create new types in `apps/web/src/types/`
