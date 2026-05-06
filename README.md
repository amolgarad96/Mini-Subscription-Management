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

# Decisions & trade-offs

- appolo server : 
    - I was chosen appolo server to build the GraphQL API due to its strong ecosystem, ease of integration with Express, and developer-friendly tooling
    - It allows clean separation between schema, resolvers, and business logic
    - requires understanding of GraphQL concepts for effective usage

- GraphQl :
  - Learning from GraphQl: it is best choice to choose graphql instead rest for e-commerce like shopify so we can minimize api calls, we can query required data

- Typescript :
    - I was chose this as programming language to know errors during compiletime instead runtime

- Mock data:
    - store in memory mock data help me to focus on api design and business logic

# What's incomplete

    - Test
    - Automated tests (unit/integration) were not included in this version.
    - Priority was given to building a working end-to-end flow and clean architecture.

# Future Improvements

    - Add authentication (JWT)
    - Connect real database (MongoDB/Postgres)
    - Integrate real Shopify APIs
    - Add unit & integration tests