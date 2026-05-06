Mini subscription Management

# Folder Structure

    subscription-backend/
    │
    ├── apps/
    │   └── src/
    │       ├── schema/
    │       │   └── schema.graphql          ← GraphQL schema file
    │       │
    │       ├── shopify/                    
    │       │   ├── fixtures.ts             ← mock contracts + contractStore
    │       │   └── ShopifyService.ts       ← service layer (pause/resume/cancel)
    │       │
    │       ├── resolvers/
    │       │   └── index.ts                ← all query + mutation resolvers
    │       │
    │       ├── types.ts                    ← TypeScript types
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

# Tech Stack

    Node.js (ESM)
    TypeScript
    Apollo Server (GraphQL)
    Express
    Zod (Validation)
    ESLint + Prettier

# Setup Instructions
    Run following commands

    git clone <repo-url>
    npm install

    Create a .env file in the root:
    add keys-value based on .env.example file

    Run project using
    npm run build
    npm run dev

# Architecture Overview
  
  - Check image in public folder inside apps
    apps/public/images/project-architecture/architecture.png


# Future Improvements

    - Add authentication (JWT)
    - Connect real database (MongoDB/Postgres)
    - Integrate real Shopify APIs
    - Add unit & integration tests
