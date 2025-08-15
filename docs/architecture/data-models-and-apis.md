# Data Models and APIs

## Data Models

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

## API Specifications

**Current Feed API** (`apps/server/src/routers/feed.ts`):

- `feed.create` - Create new RSS feed with queue scheduling
- `feed.page` - Paginated feed listing with search
- `feed.delete` - Remove feed and cancel queue jobs
- `feed.update` - Update feed settings and reschedule jobs

**ORPC Integration**: All routes are type-safe with automatic client generation
