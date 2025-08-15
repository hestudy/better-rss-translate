# Technical Debt and Known Issues

## Critical Technical Debt

1. **Typo in Schema**: `shoudScrapy` should be `shouldScrapy` in feed table
2. **Queue Job Management**: Job cleanup on feed deletion could be more robust
3. **Error Handling**: Limited error recovery in queue workers
4. **Testing**: No comprehensive test coverage for queue integration

## Workarounds and Gotchas

- **Redis Connection**: Queue system requires Redis URL in environment
- **Job Scheduling**: Uses cron patterns, but no validation of cron syntax
- **Feed Limits**: RSS worker hardcoded to process max 10 items per feed
- **Database**: SQLite for development, Turso for production (connection handling differs)
