# better-rss-translate Brownfield Architecture Document

## Introduction

This document captures the CURRENT STATE of the better-rss-translate codebase, including technical debt, workarounds, and real-world patterns. It serves as a reference for AI agents working on the RSS queue management interface enhancement.

### Document Scope

Focused on areas relevant to: RSS 源管理界面增强 - 创建完全独立的 RSS 队列管理界面，功能包括 RSS 源的添加/编辑/删除，源和队列的统计

### Change Log

| Date       | Version | Description                 | Author  |
| ---------- | ------- | --------------------------- | ------- |
| 2025-01-15 | 1.0     | Initial brownfield analysis | Winston |

## Quick Reference - Key Files and Entry Points

### Critical Files for Understanding the System

- **Main Entry**: `apps/server/src/index.ts` - Hono server with ORPC, BullBoard, and auth
- **Configuration**: Environment variables, no centralized config file
- **Core Business Logic**: `apps/server/src/routers/feed.ts` - RSS feed CRUD operations
- **Database Models**: `apps/server/src/db/schema/feed.ts` - Feed and feeditem tables
- **Queue System**: `apps/server/src/queue/` - BullMQ queues (rss, scrapy, translate)
- **Frontend Components**: `apps/web/src/components/queue-management-*.tsx` - Existing queue UI

### Enhancement Impact Areas

Based on the RSS 管理界面增强 requirements, these files/modules will be affected:

- **New API Routes**: Extend `apps/server/src/routers/feed.ts` or create new RSS management router
- **Database Schema**: `apps/server/src/db/schema/feed.ts` - May need additional fields for management
- **Queue Integration**: `apps/server/src/queue/rssQueue.ts` - Statistics and monitoring integration
- **Frontend Routes**: New routes in `apps/web/src/routes/` for RSS management interface
- **UI Components**: New components in `apps/web/src/components/rss/` following existing patterns
- **Type Definitions**: Extend or create new types in `apps/web/src/types/`

## High Level Architecture

### Technical Summary

better-rss-translate is a modern TypeScript full-stack application for RSS feed translation. It uses a monorepo structure with separate web and server applications, connected via type-safe ORPC APIs. The system processes RSS feeds through a multi-stage queue pipeline: fetch → scrape → translate.

### Actual Tech Stack (from package.json analysis)

| Category        | Technology   | Version | Notes                                   |
| --------------- | ------------ | ------- | --------------------------------------- |
| Runtime         | Node.js      | Latest  | ESM modules, TypeScript throughout      |
| Monorepo        | Turborepo    | 2.5.4   | pnpm workspaces                         |
| Backend         | Hono         | 4.8.2   | Lightweight server framework            |
| API             | ORPC         | 1.5.0   | End-to-end type safety                  |
| Database        | SQLite/Turso | Latest  | Drizzle ORM 0.44.4                      |
| Queue           | BullMQ       | 5.56.9  | Redis-based, with Bull Board UI         |
| Auth            | Better Auth  | 1.3.4   | Email/password authentication           |
| Frontend        | React        | 19.0.0  | TanStack Router for file-based routing  |
| UI Library      | shadcn/ui    | Latest  | Tailwind CSS 4.0.15, Lucide React icons |
| Build           | Vite         | 6.2.2   | Frontend bundling                       |
| Package Manager | pnpm         | 10.12.4 | Workspace management                    |

### Repository Structure Reality Check

- **Type**: Monorepo with Turborepo
- **Package Manager**: pnpm with workspaces
- **Notable**: Clean separation between web and server apps, shared types via ORPC

## Source Tree and Module Organization

### Project Structure (Actual)

```text
better-rss-translate/
├── apps/
│   ├── web/                 # React frontend (port 3001)
│   │   ├── src/components/  # UI components including existing queue management
│   │   ├── src/routes/      # TanStack Router file-based routing
│   │   ├── src/types/       # Frontend type definitions
│   │   └── src/utils/       # ORPC client setup
│   └── server/              # Hono backend (port 3000)
│       ├── src/db/          # Drizzle schema and migrations
│       ├── src/queue/       # BullMQ queue definitions and workers
│       ├── src/routers/     # ORPC route handlers
│       └── src/lib/         # Auth, context, and utilities
├── docs/                    # Project documentation
│   ├── prd.md              # Product requirements for RSS management enhancement
│   └── brownfield-architecture.md  # This document
└── .bmad-core/             # BMad workflow configuration
```

### Key Modules and Their Purpose

- **Feed Management**: `apps/server/src/routers/feed.ts` - Complete CRUD for RSS feeds
- **Queue System**: `apps/server/src/queue/` - Three-stage processing pipeline
- **Database Layer**: `apps/server/src/db/schema/feed.ts` - Feed and feeditem models
- **Authentication**: `apps/server/src/lib/auth.ts` - Better Auth integration
- **Frontend Queue UI**: `apps/web/src/components/queue-management-*.tsx` - Existing patterns to follow
- **Type Safety**: ORPC provides end-to-end TypeScript types from server to client

## Data Models and APIs

### Data Models

Current RSS-related models in `apps/server/src/db/schema/feed.ts`:

**Feed Table** (RSS 源):

- `id`, `feedUrl`, `title`, `description`, `link` - Basic RSS metadata
- `cron` - Scheduling pattern for RSS fetching
- `shoudScrapy`, `shouldTranslate`, `translateLanguage` - Processing flags
- `jobId`, `jobStatus` - BullMQ integration tracking
- `userId` - User ownership
- `createDate`, `lastUpdate` - Timestamps

**FeedItem Table** (RSS 文章):

- `feedId` - Foreign key to feed
- `title`, `contentSnippet`, `content`, `link` - Original RSS item data
- `scrapyContent`, `scrapyJobId`, `scrapyJobStatus` - Scraping pipeline
- `translateTitle`, `translateContent`, `translateJobId`, `translateJobStatus` - Translation pipeline
- `categories`, `pubDate`, `guid` - RSS metadata

### API Specifications

**Current Feed API** (`apps/server/src/routers/feed.ts`):

- `feed.create` - Create new RSS feed with queue scheduling
- `feed.page` - Paginated feed listing with search
- `feed.delete` - Remove feed and cancel queue jobs
- `feed.update` - Update feed settings and reschedule jobs

**ORPC Integration**: All routes are type-safe with automatic client generation

## Technical Debt and Known Issues

### Critical Technical Debt

1. **Typo in Schema**: `shoudScrapy` should be `shouldScrapy` in feed table
2. **Queue Job Management**: Job cleanup on feed deletion could be more robust
3. **Error Handling**: Limited error recovery in queue workers
4. **Testing**: No comprehensive test coverage for queue integration

### Workarounds and Gotchas

- **Redis Connection**: Queue system requires Redis URL in environment
- **Job Scheduling**: Uses cron patterns, but no validation of cron syntax
- **Feed Limits**: RSS worker hardcoded to process max 10 items per feed
- **Database**: SQLite for development, Turso for production (connection handling differs)

## Integration Points and External Dependencies

### External Services

| Service   | Purpose        | Integration Type | Key Files                             |
| --------- | -------------- | ---------------- | ------------------------------------- |
| Redis     | Queue Backend  | BullMQ           | All queue files                       |
| OpenAI    | Translation    | REST API         | `apps/server/src/lib/openaiClient.ts` |
| RSS Feeds | Content Source | HTTP/XML         | `apps/server/src/queue/rssQueue.ts`   |
| Turso     | Production DB  | libSQL           | `apps/server/src/db/index.ts`         |

### Internal Integration Points

- **Frontend-Backend**: ORPC on `/rpc/*` endpoints with type safety
- **Queue Dashboard**: Bull Board UI on `/ui` path for queue monitoring
- **Authentication**: Better Auth on `/api/auth/**` endpoints
- **RSS Output**: Generated RSS feeds on `/rss/:id` endpoints

## Development and Deployment

### Local Development Setup

1. **Install dependencies**: `pnpm install`
2. **Start database**: `cd apps/server && pnpm db:local` (Turso local)
3. **Push schema**: `pnpm db:push`
4. **Start development**: `pnpm dev` (starts both web and server)

### Build and Deployment Process

- **Build Command**: `pnpm build` (Turborepo builds all apps)
- **Type Checking**: `pnpm check-types` (across all workspaces)
- **Database Management**: Drizzle Kit for migrations and studio
- **Environment**: Requires Redis URL, database URL, CORS origin configuration

## Testing Reality

### Current Test Coverage

- **Unit Tests**: Minimal, basic Vitest setup in server
- **Integration Tests**: None for queue system
- **E2E Tests**: None
- **Manual Testing**: Primary QA method via Bull Board UI

### Running Tests

```bash
# No comprehensive test suite currently
# Queue monitoring via Bull Board at http://localhost:3000/ui
```

## RSS Management Enhancement - Impact Analysis

### Files That Will Need Modification

Based on the PRD requirements for RSS 源管理界面增强, these files will be affected:

**Backend Changes**:

- `apps/server/src/routers/feed.ts` - Extend with statistics endpoints and batch operations
- `apps/server/src/routers/index.ts` - Add new RSS management router if needed
- `apps/server/src/db/schema/feed.ts` - Possible additional fields for management metadata
- `apps/server/src/queue/rssQueue.ts` - Add statistics collection and monitoring hooks

**Frontend Changes**:

- `apps/web/src/routes/` - New routes for RSS management interface
- `apps/web/src/components/` - New RSS-specific components following existing patterns
- `apps/web/src/types/` - RSS management type definitions
- `apps/web/src/utils/orpc.ts` - Client integration for new endpoints

### New Files/Modules Needed

**Backend**:

- `apps/server/src/routers/rssManagement.ts` - Dedicated RSS management API
- `apps/server/src/services/rssStatsService.ts` - Statistics aggregation service
- `apps/server/src/db/schema/rssManagement.ts` - Additional management tables if needed

**Frontend**:

- `apps/web/src/routes/rss-management/` - RSS management route directory
- `apps/web/src/components/rss/` - RSS-specific component directory
- `apps/web/src/types/rss.ts` - RSS management type definitions
- `apps/web/src/hooks/useRssData.ts` - RSS data fetching hooks

### Integration Considerations

**Must Follow Existing Patterns**:

- Use ORPC for all new API endpoints to maintain type safety
- Follow existing authentication middleware patterns in `apps/server/src/lib/auth.ts`
- Use existing Drizzle ORM patterns for database operations
- Follow shadcn/ui component patterns from existing queue management components
- Maintain consistency with existing error handling and response formats

**Queue System Integration**:

- Leverage existing BullMQ setup for statistics collection
- Integrate with Bull Board for enhanced monitoring
- Respect existing job lifecycle events and status tracking
- Ensure new management operations don't interfere with queue processing

**Database Considerations**:

- Use Drizzle migrations for any schema changes
- Maintain foreign key relationships with existing feed/feeditem tables
- Consider soft delete patterns for RSS source management
- Ensure statistics queries don't impact queue performance

## Appendix - Useful Commands and Scripts

### Frequently Used Commands

```bash
pnpm dev              # Start all applications in development
pnpm dev:web          # Start only frontend (port 3001)
pnpm dev:server       # Start only backend (port 3000)
pnpm build            # Build all applications
pnpm check-types      # TypeScript checking across workspaces
pnpm db:push          # Push schema changes to database
pnpm db:studio        # Open Drizzle Studio for database management
```

### Debugging and Troubleshooting

- **Queue Monitoring**: Bull Board UI at `http://localhost:3000/ui`
- **Database Studio**: `pnpm db:studio` opens web interface
- **ORPC Types**: Auto-generated, check network tab for type mismatches
- **Redis Issues**: Ensure Redis is running and URL is correct in environment
- **Auth Issues**: Check Better Auth configuration and session handling

### Architecture Patterns to Follow

**For RSS Management Enhancement**:

1. **API Design**: Follow existing ORPC patterns in `feed.ts`
2. **Component Structure**: Mirror existing queue management components
3. **Type Safety**: Leverage ORPC for end-to-end types
4. **State Management**: Use TanStack Query patterns from existing code
5. **UI Consistency**: Follow shadcn/ui and Tailwind patterns
6. **Queue Integration**: Respect existing BullMQ job lifecycle patterns
