# Task Manager

A simple task management application built with Next.js 15, React, TypeScript, and tRPC v11.

## Requirements

- Node.js 20+
- npm

## Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Features

- Task list rendered on the server (SSR).
- Create, edit, and delete tasks.
- Title validation on both the frontend and backend.
- Success and error messages, plus loading states.
- In-memory data storage (no database).

## Technical Decisions

- The task list and edit page call the tRPC router directly on the server.
- Interactive operations use the tRPC client with TanStack Query.
- Zod validates backend inputs.
- The repository uses an in-memory `Map` to store tasks.
- Data is volatile and may be lost when the process restarts. In multi-instance environments, each instance has its own storage; this is intentional for the scope of this challenge.
