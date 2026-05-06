import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import { readFileSync } from 'fs'; // to read the .graphql file
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { buildResolvers } from './resolvers/index.js';
import { ShopifyService } from './Shopify/ShopifyService.js';
import cors from 'cors';

// __dirname doesn't exist in ES modules, so we recreate it
const __dirname = dirname(fileURLToPath(import.meta.url));

// Read the schema.graphql file as a string
// Apollo needs the schema as a string (typeDefs)
const typeDefs = readFileSync(resolve(__dirname, './schema/schema.graphql'), 'utf-8');
dotenv.config();
const PORT = process.env['PORT'] ?? '4000';

async function start() {
  // Create the service instance (our mock Shopify)
  const shopify = new ShopifyService();

  // Build resolvers, injecting the shopify service
  const resolvers = buildResolvers(shopify);

  // Create Apollo Server with schema + resolvers
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  const app = express();

  app.use(express.json());

  // CORS: Allowed Request from client
  app.use(
    cors({
      origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'],
    }),
  );

  app.use('/graphql', expressMiddleware(server));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.listen(PORT, () => {
    console.log(`GraphQL server ready at http://localhost:${PORT}/graphql`);
    console.log(`Health check at http://localhost:${PORT}/health`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
