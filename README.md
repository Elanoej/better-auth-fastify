# TypeScript API Starter — Fastify + Better Auth + Drizzle

Estrutura **base para APIs em TypeScript**. A ideia é servir de ponto de partida: clone este repositório, ajuste as variáveis de ambiente e comece a adicionar suas rotas e modelos, sem precisar montar toda a fundação de novo.

Já vem com autenticação, validação, documentação automática (Swagger/Scalar) e ORM configurados e funcionando juntos.

## Stack

| Camada | Tecnologia | Versão |
| --- | --- | --- |
| Runtime / linguagem | Node.js + TypeScript | Node 20+ |
| Servidor HTTP | [Fastify](https://fastify.dev/) | ^5.12 |
| Validação de schema | [Zod](https://zod.dev/) | ^4.6 |
| Integração Zod ↔ Fastify | `@fastify/type-provider-zod` | ^1.0 |
| Doc da API (OpenAPI) | `@fastify/swagger` | ^9.9 |
| UI da doc | [Scalar](https://scalar.com/) (`@scalar/fastify-api-reference`) | ^1.74 |
| Autenticação | [Better Auth](https://www.better-auth.com/) | ^1.7 |
| ORM | [Drizzle ORM](https://orm.drizzle.team/) (`drizzle-orm` / `drizzle-kit`) | 1.0.0-rc |
| Banco de dados | PostgreSQL (`pg`) | ^8.23 |
| Variáveis de ambiente | `dotenv` | ^18.0 |
| Lint / formatação | [Biome](https://biomejs.dev/) | 2.5 |
| Execução em dev | `tsx` | ^4.23 |
| Gerenciador de pacotes | pnpm | 12.x |

> O `drizzle-orm` e o `drizzle-kit` aqui estão na **1.0.0-rc** (Release Candidate). Se você usar este repositório como base, fique atento às notas de migração entre RCs.

## Requisitos

- **Node.js** 20 ou superior (o projeto usa `fetch` nativo).
- **pnpm** 12+ (`corepack enable` ou instale globalmente).
- **Docker** (opcional) — só para subir o PostgreSQL local. Se você já tem um Postgres, pode apontar o `DATABASE_URL` para ele.

## Como rodar

```bash
# 1. Instale as dependências
pnpm install

# 2. Crie o arquivo de ambiente a partir do exemplo
cp .env.example .env

# 3. (Opcional) Suba o PostgreSQL local via Docker
docker compose up -d

# 4. Gere/execute as migrações do banco
pnpm exec drizzle-kit migrate

# 5. Suba o servidor em modo watch
pnpm dev
```

Depois de subir:

- API: <http://localhost:3333>
- Health check: <http://localhost:3333/health>
- Documentação (Scalar): <http://localhost:3333/docs>
- Rotas de autenticação (Better Auth): `http://localhost:3333/api/auth/*`

## Variáveis de ambiente

Todas ficam no `.env` (que **não** é versionado — veja `.env.example` como referência).

| Variável | Descrição |
| --- | --- |
| `BETTER_AUTH_SECRET` | Segredo usado para assinar sessões/tokens. Gere com `openssl rand -base64 32`. |
| `BETTER_AUTH_URL` | URL base da aplicação (ex.: `http://localhost:3333`). |
| `DATABASE_URL` | String de conexão do PostgreSQL. Precisa bater com o `docker-compose.yml`. |

## Estrutura de pastas

```
src/
├── server.ts                  # Ponto de entrada: sobe o Fastify na porta 3333
├── app.ts                     # Monta a aplicação (plugins + rotas)
├── client.ts                  # Scripts de exemplo para chamar a API de auth
├── lib/
│   ├── auth.ts                # Configuração do Better Auth
│   └── database.ts            # Instância do Drizzle (conexão + relations)
├── db/
│   ├── index.ts               # Barrel: exporta `tableSchemas` e `relations`
│   └── schema/
│       ├── user.ts            # Tabela `user`
│       ├── session.ts         # Tabela `session`
│       ├── account.ts         # Tabela `account`
│       ├── verification.ts    # Tabela `verification`
│       └── relations.ts       # Relações entre as tabelas
├── interfaces/
│   ├── routesConfig.ts        # Registra todas as rotas
│   ├── betterAuthRoutes.ts    # Monta o handler do Better Auth em /api/auth/*
│   └── routes/
│       └── health-route.ts    # GET /health (exemplo de rota com Zod)
└── plugins/
    └── openapi.ts             # Swagger + Scalar

drizzle/                       # Migrações geradas pelo drizzle-kit
```

### Decisões de estrutura

- **`tableSchemas` (em `src/db/index.ts`)** — as tabelas são exportadas como um único objeto `tableSchemas` e consumidas pelo adaptador do Drizzle no Better Auth. Isso deixa explícito, para qualquer área da aplicação, qual é o conjunto de tabelas do banco. As `relations` são exportadas separadamente por usarem a nova API `defineRelations`.
- **Alias `@/*`** — mapeado para `./src/*` no `tsconfig.json`, permitindo imports como `@/lib/auth`.
- **`app.ts` separado de `server.ts`** — a função `buildApp()` monta a aplicação sem subir o servidor, o que facilita reaproveitar a mesma instância em testes de integração.
- **`routesConfig.ts`** — ponto único onde cada novo módulo de rotas é registrado.
- **Zod → OpenAPI** — a documentação é gerada automaticamente a partir dos schemas Zod das rotas, via `jsonSchemaTransform` do `@fastify/type-provider-zod`.

## Endpoints

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/health` | Verifica se a API está online. |
| `GET` | `/docs` | Interface do Scalar para a documentação OpenAPI. |
| `GET`/`POST` | `/api/auth/*` | Rotas do Better Auth (sign-up, sign-in, sessão, etc.). |

## Banco de dados e migrações

O schema fica em `src/db/schema` e as migrações são geradas em `drizzle/` (config em `drizzle.config.ts`).

```bash
# Gerar uma nova migração a partir das mudanças no schema
pnpm exec drizzle-kit generate

# Aplicar as migrações pendentes
pnpm exec drizzle-kit migrate

# (Alternativa) Empurrar o schema direto para o banco, sem gerar arquivo
pnpm exec drizzle-kit push
```

## Chamando a API de autenticação

Há duas formas, e vale saber a diferença:

**1. Cliente HTTP (`better-auth/client`)** — simula um front-end, faz requisição real pela rede:

```ts
import { createAuthClient } from "better-auth/client";

const authClient = createAuthClient({ baseURL: "http://localhost:3333" });

const { data, error } = await authClient.signUp.email({
  email: "user@example.com",
  password: "senha123",
  name: "Fulano",
});
```

**2. API server-side (`auth.api.*`)** — chama o handler do Better Auth em processo, sem passar por HTTP (é o que `src/client.ts` usa hoje):

```ts
import { auth } from "./lib/auth";

const response = await auth.api.signUpEmail({
  body: { email: "user@example.com", password: "senha123", name: "Fulano" },
  asResponse: true,
});
```

## Pegadinhas (gotchas)

- **`MISSING_OR_NULL_ORIGIN` (403) ao chamar de um script Node.** O `fetch` do Node (undici) envia `sec-fetch-mode: cors` **mas não envia o header `Origin`**. O middleware de CSRF do Better Auth, ao ver os headers `Sec-Fetch-*`, força a validação de origem, não encontra `Origin` e responde `403 MISSING_OR_NULL_ORIGIN`. Isso afeta apenas clientes que **não** são navegador (scripts, curl, SSR). Soluções:
  - Chamar via `auth.api.*` (in-process, sem HTTP); ou
  - Enviar o header explicitamente no cliente: `createAuthClient({ baseURL, fetchOptions: { headers: { Origin: baseURL } } })`.
  - O `trustedOrigins` no servidor **não** resolve esse caso, porque não existe `Origin` nenhum para validar.
- **Nunca versione o `.env`.** O `BETTER_AUTH_SECRET` assina sessões; se vazar, alguém consegue forjar sessões. O `.gitignore` já cobre isso — mantenha assim.
- **`drizzle-orm` 1.0-rc.** APIs como `defineRelations` são novas e podem mudar até a versão estável.

## Licença

ISC.
