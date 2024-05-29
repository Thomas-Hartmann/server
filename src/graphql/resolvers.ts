import {UserEntity} from "../types";

export interface ResolverContext {
    user?: UserEntity,
}

export const resolvers = {
    Query: {
        hello: () => 'Hello world!',
    },
};

