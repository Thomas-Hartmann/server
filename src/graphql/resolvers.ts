import {UserEntity} from "../types";

export interface ResolverContext {
    user?: UserEntity,
    token?: string
}

export const resolvers = {
    Query: {
        hello: () => 'Hello world!',
    },
};