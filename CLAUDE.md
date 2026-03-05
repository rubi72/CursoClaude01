# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# First-time setup (install deps + Prisma generate + migrate)
npm run setup

# Development server (with Turbopack + node-compat shim)
npm run dev

# Run tests (Vitest)
npm test

# Run a single test file
npx vitest run src/components/chat/__tests__/ChatInterface.test.tsx

# Lint
npm run lint

# Reset database
npm run db:reset

# Production build
npm run build
```

## Environment

Copy `.env` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=your_key_here
```

Without a key, the app falls back to a mock provider (`src/lib/provider.ts`) that returns hardcoded example components.

## Architecture

UIGen is an AI-powered React component generator. Users describe a component in a chat panel; Claude generates it using tool calls; the component renders live in a sandboxed iframe.

### Request Flow

1. User submits a prompt → `POST /api/chat` (`src/app/api/chat/route.ts`)
2. The route calls Claude (Vercel AI SDK) with a system prompt and two tools
3. Claude uses tools to create/edit virtual files
4. Tool call results flow back to the client via streaming
5. The client's `FileSystemContext` updates its in-memory file tree
6. `PreviewFrame` re-renders the component inside an iframe

### Key Abstractions

**Virtual File System** (`src/lib/file-system.ts`)
- All files live in memory — nothing is written to disk
- `VirtualFileSystem` class: `createFile`, `updateFile`, `deleteFile`, `serialize`, `deserialize`
- Serialized as JSON for storage in the SQLite `Project.data` column

**AI Tools** (`src/lib/tools/`)
- `str_replace_editor`: Create/view/edit files (like the built-in Claude Code editor tool)
- `file_manager`: Directory-level operations (list, delete dir)
- Tool definitions are passed to the Vercel AI SDK `streamText` call

**Contexts** (`src/lib/contexts/`)
- `FileSystemContext`: Virtual FS state + file operations; synced with server via project save
- `ChatContext`: Wraps Vercel AI SDK's `useChat`; coordinates file system updates from tool results

**Preview Pipeline** (`src/components/preview/PreviewFrame.tsx`)
- Babel Standalone transforms JSX to plain JS inside the browser
- An import map provides `react`, `react-dom`, and Tailwind CSS
- Entry point is auto-detected (App.jsx, index.jsx, etc.)
- Runs in a sandboxed `<iframe>`

**Code Editor** (`src/components/editor/`)
- Monaco Editor for syntax highlighting
- `FileTree` component shows the virtual FS tree

### Data Persistence

- SQLite via Prisma (`prisma/schema.prisma`, `prisma/dev.db`)
- `Project.messages` — serialized chat history (JSON string)
- `Project.data` — serialized virtual file system (JSON string)
- Anonymous users get no persistence; authenticated users auto-save

### Auth

- JWT tokens (7-day expiry) stored as HTTP-only cookies
- `jose` for signing/verifying, `bcrypt` for password hashing
- Implementation: `src/lib/auth.ts`, hook: `src/hooks/use-auth.ts`

### Layout

Three-panel resizable layout (`src/app/main-content.tsx`):
- **Left (35%):** Chat interface
- **Right (65%):** Tabbed panel
  - **Preview tab:** Live iframe preview
  - **Code tab:** File tree + Monaco editor

### System Prompt

`src/lib/prompts/generation.tsx` — controls how Claude generates components. Edit this to change generation behavior (e.g., preferred libraries, file conventions, output style).

### Testing

Vitest + jsdom + React Testing Library. Tests live in `__tests__/` folders co-located with the code they test. Config: `vitest.config.mts`.
