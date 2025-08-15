# Source Tree and Module Organization

## Project Structure (Actual)

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

## Key Modules and Their Purpose

- **Feed Management**: `apps/server/src/routers/feed.ts` - Complete CRUD for RSS feeds
- **Queue System**: `apps/server/src/queue/` - Three-stage processing pipeline
- **Database Layer**: `apps/server/src/db/schema/feed.ts` - Feed and feeditem models
- **Authentication**: `apps/server/src/lib/auth.ts` - Better Auth integration
- **Frontend Queue UI**: `apps/web/src/components/queue-management-*.tsx` - Existing patterns to follow
- **Type Safety**: ORPC provides end-to-end TypeScript types from server to client
