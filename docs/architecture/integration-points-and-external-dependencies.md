# Integration Points and External Dependencies

## External Services

| Service   | Purpose        | Integration Type | Key Files                             |
| --------- | -------------- | ---------------- | ------------------------------------- |
| Redis     | Queue Backend  | BullMQ           | All queue files                       |
| OpenAI    | Translation    | REST API         | `apps/server/src/lib/openaiClient.ts` |
| RSS Feeds | Content Source | HTTP/XML         | `apps/server/src/queue/rssQueue.ts`   |
| Turso     | Production DB  | libSQL           | `apps/server/src/db/index.ts`         |

## Internal Integration Points

- **Frontend-Backend**: ORPC on `/rpc/*` endpoints with type safety
- **Queue Dashboard**: Bull Board UI on `/ui` path for queue monitoring
- **Authentication**: Better Auth on `/api/auth/**` endpoints
- **RSS Output**: Generated RSS feeds on `/rss/:id` endpoints
