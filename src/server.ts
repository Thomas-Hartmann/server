import {ApolloServer} from '@apollo/server';
import {expressMiddleware} from '@apollo/server/express4';
import {ApolloServerPluginDrainHttpServer} from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import morgan from 'morgan';
import http from 'http';
import cors from 'cors';
import {readFile} from "node:fs/promises";
import {ResolverContext, resolvers} from './graphql/resolvers';
import {authMiddleware, getUser, handleLogin} from "./auth/auth";

const typeDefs = await readFile('./src/graphql/schema.graphql', 'utf8');
const app = express();
const httpServer = http.createServer(app);
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer})],
    // TODO: disable introspection in production https://www.apollographql.com/blog/why-you-should-disable-graphql-introspection-in-production/
    introspection: process.env.NODE_ENV !== 'production',
});

interface Request extends express.Request {
    auth?: { sub: string };
}

async function getContext({req}: { req: Request }): Promise<ResolverContext> {
    const context: ResolverContext = {};

    if (req.auth) {
        context.user = await getUser(req.auth.sub);
    }
    return context;
}

await apolloServer.start();
app.use(morgan('dev'), cors(), express.json(), authMiddleware);
app.use('/graphql', expressMiddleware(apolloServer, {context: getContext}));
app.post('/login', handleLogin);


await new Promise<void>((resolve) => httpServer.listen({port: 4000}, resolve));
console.log(`🚀 Server ready at http://localhost:4000/graphql`);
