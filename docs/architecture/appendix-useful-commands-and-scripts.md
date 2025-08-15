# Appendix - Useful Commands and Scripts

## Frequently Used Commands

```bash
pnpm dev              # Start all applications in development
pnpm dev:web          # Start only frontend (port 3001)
pnpm dev:server       # Start only backend (port 3000)
pnpm build            # Build all applications
pnpm check-types      # TypeScript checking across workspaces
pnpm db:push          # Push schema changes to database
pnpm db:studio        # Open Drizzle Studio for database management
```

## Debugging and Troubleshooting

- **Queue Monitoring**: Bull Board UI at `http://localhost:3000/ui`
- **Database Studio**: `pnpm db:studio` opens web interface
- **ORPC Types**: Auto-generated, check network tab for type mismatches
- **Redis Issues**: Ensure Redis is running and URL is correct in environment
- **Auth Issues**: Check Better Auth configuration and session handling

## Architecture Patterns to Follow

**For RSS Management Enhancement**:

1. **API Design**: Follow existing ORPC patterns in `feed.ts`
2. **Component Structure**: Mirror existing queue management components
3. **Type Safety**: Leverage ORPC for end-to-end types
4. **State Management**: Use TanStack Query patterns from existing code
5. **UI Consistency**: Follow shadcn/ui and Tailwind patterns
6. **Queue Integration**: Respect existing BullMQ job lifecycle patterns
