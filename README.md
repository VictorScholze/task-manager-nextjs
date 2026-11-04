# Task Manager

Aplicação simples de gerenciamento de tarefas usando Next.js 15, React, TypeScript e tRPC v11.

## Requisitos

- Node.js 20+
- npm

## Executar localmente

```bash
npm install
npm run dev
```

Acesse http://localhost:3000.

## Funcionalidades

- Listagem de tarefas com renderização no servidor (SSR).
- Criar, editar e excluir tarefas.
- Validação de título no frontend e backend.
- Mensagens de sucesso/erro e estado de carregamento.
- Dados armazenados em memória (sem banco de dados).

## Decisões técnicas

- A listagem e a página de edição consultam o router tRPC diretamente no servidor.
- As operações interativas utilizam o client tRPC com TanStack Query.
- O Zod valida os inputs no backend.
- O repository usa um `Map` em memória para manter as tarefas.
- Os dados são voláteis e podem ser perdidos ao reiniciar o processo. Em ambientes com múltiplas instâncias, cada instância terá seu próprio armazenamento; isso é intencional para o escopo do desafio.

## Estrutura

```text
src/
  app/
    api/trpc/[trpc]/route.ts
    tasks/
      [id]/edit/page.tsx
      new/page.tsx
      page.tsx
    layout.tsx
    page.tsx
    globals.css
  components/
    task-form.tsx
    task-list.tsx
  server/
    api/
      routers/task.ts
      root.ts
      trpc.ts
    repositories/task-repository.ts
  trpc/
    client.tsx
    server.ts
```
