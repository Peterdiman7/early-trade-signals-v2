import { createClient, fetchExchange, subscriptionExchange } from "@urql/vue"
import { cacheExchange } from "@urql/exchange-graphcache"

import { createClient as createWsClient } from "graphql-ws"

import schema from "@/generated/introspection_schema.json"
import type { ClientOptions } from "@urql/vue"

const wsClient = createWsClient({
    url: `${window.location.protocol === "https:" ? "wss://" : "ws://"}${window.location.host}/graphql`,
    keepAlive: 10_000,
})

export const createOptions = (): ClientOptions => ({
    url: "/graphql",
    exchanges: [
        cacheExchange({
            schema,
            resolvers: {
                Query: {
                },
            },
        }),
        fetchExchange,
        subscriptionExchange({
            forwardSubscription(request) {
                return {
                    subscribe(observer) {
                        const unsubscribe = wsClient.subscribe(
                            { ...request, query: request.query ?? "" },
                            observer
                        )
                        return { unsubscribe }
                    },
                }
            },
        }),
    ],
})

// URQL client
export const urqlClient = createClient(createOptions())

export default urqlClient