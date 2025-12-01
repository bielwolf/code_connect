**Visão Geral**
- **Propósito:** Aplicação Next.js (App Router) que serve um pequeno blog com API interna usando Prisma + PostgreSQL.
- **Onde olhar primeiro:** `src/app/` (rota / UI), `src/app/api/` (endpoints), `prisma/` (schema, seed, client), `package.json` (scripts).

**Como rodar localmente (rápido)**
- Subir o banco com Docker Compose: `docker compose up` (usa serviço `postgres` configurado em `docker-compose.yaml`).
- Instalar dependências: `yarn`.
- Preparar/build: `yarn build` (observe: esse script executa `prisma migrate dev && prisma generate && prisma db seed && next build`).
- Desenvolvimento: `yarn dev` (abre Next.js em `http://localhost:3000`).

**Variáveis de ambiente importantes**
- `POSTGRES_PRISMA_URL` e `POSTGRES_URL_NON_POOLING` — usadas em `prisma/schema.prisma` (datasource). Configure conforme `docker-compose.yaml` ou seu ambiente.

**Banco de dados e dados de exemplo**
- Prisma client está em `prisma/db.js` (export default `db`). Use esse import em rotas API.
- Seed: `prisma/seed.js` popula um usuário (`anabeatriz_dev`), posts e alguns comentários. O build chama `prisma db seed` automaticamente.

**Padrões de API e convenções do projeto**
- As APIs ficam em `src/app/api/*` com handlers HTTP exportados (`export async function GET/POST(...)`).
- Uso de `request.nextUrl` para params e `Response.json(...)` / `new Response(...)` para respostas.
- Rotas importantes e exemplos:
  - `GET /api/posts?page=&searchTerm=` — paginação (perPage = 4), retorna `{ data, prev, next }` (veja `src/app/api/posts/route.js`).
  - `GET /api/post?postId=` — rota de exemplo (mock) para rating (veja `src/app/api/post/route.js`).
  - `GET /api/post/[slug]` — busca post completo, converte `markdown` para HTML com `remark` (veja `src/app/api/post/[slug]/route.js`).
  - `POST /api/comment/[id]` — cria comentário; autor fixo `anabeatriz_dev` (veja `src/app/api/comment/[id]/route.js`).
  - `GET/POST /api/comment/[id]/replies` — replies para comentários (simula falha controlada em um slug específico para testes de retry).

**Import paths e aliases**
- Projeto usa alias `@/*` mapeado em `jsconfig.json` para `./src/*` (ex.: `import logger from "@/logger"`).

**Frontend / Componentes**
- Componentes React estão em `src/components/*`. Cada componente usa CSS Modules (`*.module.css`).
- Padrão: pasta do componente com `index.jsx` e `*.module.css` (ex.: `components/CardPost/index.jsx`).

**Logging e erros**
- Logger central em `src/logger.js` (Winston) e importado como `@/logger` nas APIs. Use `logger.error(...)` para falhas servidoras.

**Scripts e fluxo de build**
- `dev`: `NODE_OPTIONS='--inspect' next dev` — modo debug com inspect ativado.
- `build`: roda migrations, gera client, faz seed e chama `next build`. Atenção: rodar `yarn build` espera um banco configurado e acessível.

**Padrões a observar ao editar/estender**
- Ao adicionar endpoints use `prisma/db.js` para acesso ao DB e siga o padrão de `Response` usado no projeto.
- Para conteúdo Markdown, use `remark` + `remark-html` (ex.: conversão em `src/app/api/post/[slug]/route.js`).
- Ao modificar seed/migrations, lembre-se que `yarn build` pode alterar o banco (migrations + seed).

**Exemplos rápidos de chamadas (local)**
- Listar posts: `GET http://localhost:3000/api/posts?page=1`
- Buscar post por slug: `GET http://localhost:3000/api/post/introducao-ao-react` (via rota dinâmica `/api/post/[slug]`).
- Adicionar comentário: `POST http://localhost:3000/api/comment/1` com JSON `{ "id": 1, "text": "Oi" }`.

**Arquivos-chave para inspeção ao debugar**
- `package.json` — scripts e dependências.
- `prisma/schema.prisma` / `prisma/seed.js` — modelo de dados e dados de exemplo.
- `src/app/api/*` — handlers de API (padrões de request/response).
- `src/logger.js` — configuração de logs.

Se algo importante estiver faltando (ex.: variáveis de ambiente reais, endpoints externos, convenções de autenticação), diga quais detalhes quer que eu adicione e eu atualizo este arquivo.

FIM
