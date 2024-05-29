// npm install @apollo/server express graphql cors
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import morgan from "morgan";
import http from 'http';
import cors from 'cors';
import {readFile} from "node:fs/promises";
import {authMiddleware, getUser, handleLogin} from "./auth/auth";
import {ResolverContext, resolvers} from "./graphql/resolvers";

const typeDefs = readFile('src/graphql/schema.graphql', 'utf-8');

const app = express();
const httpServer = http.createServer(app);
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({httpServer})],
  introspection: process.env.NODE_ENV !== 'production', // https://www.apollographql.com/blog/why-you-should-disable-graphql-introspection-in-production/
});

interface Request extends express.Request {
  auth?: {sub: string};
}

async function getContext({req}: {req: Request}): Promise<ResolverContext> {
  const context: ResolverContext = {};
  if (req.auth) {
    // TODO: not sure if we need the context below
    context.user = await getUser(req.auth.sub);
  }
  return context;
}

await apolloServer.start();
app.use(morgan('dev'), cors<cors.CorsRequest>(), express.json(), authMiddleware);
app.use('/graphql', expressMiddleware(apolloServer, {context: getContext}));
app.post('/login', handleLogin);

await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000/graphql`);
