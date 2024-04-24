const typeDefs = `#graphql
    type Query {
        hello: String
    }
    `;
const resolvers = {
    Query: {
        hello: () => 'Hello world!',
    },
};
export { typeDefs, resolvers };
