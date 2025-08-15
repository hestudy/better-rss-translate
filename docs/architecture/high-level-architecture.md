# High Level Architecture

## Technical Summary

better-rss-translate is a modern TypeScript full-stack application for RSS feed translation. It uses a monorepo structure with separate web and server applications, connected via type-safe ORPC APIs. The system processes RSS feeds through a multi-stage queue pipeline: fetch → scrape → translate.

## Actual Tech Stack (from package.json analysis)

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

## Repository Structure Reality Check

- **Type**: Monorepo with Turborepo
- **Package Manager**: pnpm with workspaces
- **Notable**: Clean separation between web and server apps, shared types via ORPC
