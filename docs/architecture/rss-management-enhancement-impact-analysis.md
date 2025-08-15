# RSS Management Enhancement - Impact Analysis

## Files That Will Need Modification

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

## New Files/Modules Needed

**Backend**:

- `apps/server/src/routers/rssManagement.ts` - Dedicated RSS management API
- `apps/server/src/services/rssStatsService.ts` - Statistics aggregation service
- `apps/server/src/db/schema/rssManagement.ts` - Additional management tables if needed

**Frontend**:

- `apps/web/src/routes/rss-management/` - RSS management route directory
- `apps/web/src/components/rss/` - RSS-specific component directory
- `apps/web/src/types/rss.ts` - RSS management type definitions
- `apps/web/src/hooks/useRssData.ts` - RSS data fetching hooks

## Integration Considerations

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
