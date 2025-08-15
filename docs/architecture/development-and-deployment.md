# Development and Deployment

## Local Development Setup

1. **Install dependencies**: `pnpm install`
2. **Start database**: `cd apps/server && pnpm db:local` (Turso local)
3. **Push schema**: `pnpm db:push`
4. **Start development**: `pnpm dev` (starts both web and server)

## Build and Deployment Process

- **Build Command**: `pnpm build` (Turborepo builds all apps)
- **Type Checking**: `pnpm check-types` (across all workspaces)
- **Database Management**: Drizzle Kit for migrations and studio
- **Environment**: Requires Redis URL, database URL, CORS origin configuration
