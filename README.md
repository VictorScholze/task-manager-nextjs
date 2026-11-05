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

## Run with docker

```bash
docker compose up --build 
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
- Interactive operations use the tRPC client with TanStack Query. TanStack Query ensures the server response will be loaded before rendering the UI. 
- Zod validates backend inputs. Zod naturally integrates with tRPC, providing easier implementation and it defines input contract only once.
- The repository uses an in-memory `Map` to store tasks, separating data access from core business rules.
- Using Docker ensures that the application runs correctly regardless of the installed Node versions, since the generated image is always the same.

## Future implementations

- Multi-stage build to reduce final image size.
- Database implementation. SQL adequately meets current requirements, but if more complex or variable data types become necessary in the future, a NoSQL database might be a better choice. 
- Authentication: NextAuth or OAuth provider