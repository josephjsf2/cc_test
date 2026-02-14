# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run setup` — Install deps, generate Prisma client, run migrations
- `npm run dev` — Start dev server (Next.js + Turbopack) on port 3000
- `npm run dev:daemon` — Start dev server in background (logs to logs.txt)
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npm test` — Run all tests (vitest)
- `npx vitest run src/lib/__tests__/file-system.test.ts` — Run a single test file
- `npm run db:reset` — Reset SQLite database

## Architecture

UIGen is an AI-powered React component generator. Users describe components in a chat interface, Claude generates code via tool calls, and the result renders in a live iframe preview — all without writing files to disk.

### Core Flow

1. **Chat API** (`src/app/api/chat/route.ts`): Receives messages + serialized virtual file system from the client. Injects a system prompt, calls Claude (or a mock provider if no API key), and streams back text + tool calls. On completion, persists messages and file state to the project in SQLite.

2. **AI Tools**: The LLM has two tools to manipulate the virtual file system:
   - `str_replace_editor` (`src/lib/tools/str-replace.ts`) — create, view, str_replace, insert operations on files
   - `file_manager` (`src/lib/tools/file-manager.ts`) — rename, delete operations

3. **Virtual File System** (`src/lib/file-system.ts`): In-memory tree structure (`VirtualFileSystem` class) with serialize/deserialize support. Shared between server (for tool execution) and client (for display). The client sends the full serialized VFS with each chat request.

4. **Client-side Preview** (`src/lib/transform/jsx-transformer.ts` + `src/components/preview/PreviewFrame.tsx`): Transforms JSX/TSX files using `@babel/standalone` in the browser, creates blob URLs, builds an import map (with esm.sh for third-party packages), and renders everything in a sandboxed iframe with Tailwind CSS.

5. **Mock Provider** (`src/lib/provider.ts`): When `ANTHROPIC_API_KEY` is not set, a `MockLanguageModel` returns static component code so the app runs without an API key.

### Key Contexts (Client State)

- `FileSystemContext` (`src/lib/contexts/file-system-context.tsx`) — Owns the `VirtualFileSystem` instance, handles tool call side-effects on the client, triggers re-renders
- `ChatContext` (`src/lib/contexts/chat-context.tsx`) — Wraps Vercel AI SDK's `useChat`, wires tool calls to the file system context

### Auth & Data

- JWT-based auth using `jose` (`src/lib/auth.ts`), middleware protects `/api/projects` and `/api/filesystem`
- Prisma + SQLite: `User` and `Project` models. Project stores messages and file system data as JSON strings. Always reference `prisma/schema.prisma` for the database structure.
- Anonymous users can use the app; registered users get project persistence

### Code Style

- Use comments sparingly. Only comment complex code.

### Tech Stack

- Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4
- Vercel AI SDK (`ai` + `@ai-sdk/anthropic`) for streaming chat
- shadcn/ui (new-york style) with Radix primitives — components in `src/components/ui/`
- Monaco editor for code editing
- Path alias: `@/*` maps to `./src/*`
