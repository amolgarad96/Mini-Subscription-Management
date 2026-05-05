subscription-backend/
│
├── apps/
│   └── src/
│       ├── schema/
│       │   └── schema.graphql          ← GraphQL schema file
│       │
│       ├── shopify/                    ← lowercase 's'
│       │   ├── fixtures.ts             ← mock contracts + contractStore
│       │   └── ShopifyService.ts       ← service layer (pause/resume/cancel)
│       │
│       ├── resolvers/
│       │   └── index.ts                ← all query + mutation resolvers
│       │
│       ├── types.ts                    ← your domain TypeScript types
│       └── server.ts                   ← Apollo Server entry point
│
├── node_modules/
├── .env
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── package.json
└── tsconfig.json
