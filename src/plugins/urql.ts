import { createClient, fetchExchange, subscriptionExchange } from "@urql/vue"
import { cacheExchange } from "@urql/exchange-graphcache"
import { createClient as createWsClient } from "graphql-ws"
import schema from "@/generated/introspection_schema.json"

// WebSocket client за subscriptions
const wsClient = createWsClient({
    url: `${window.location.protocol === "https:" ? "wss://" : "ws://"}${window.location.host}/graphql`,
    keepAlive: 10_000,
})

// URQL client
const urqlClient = createClient({
    url: `${window.location.protocol}//${window.location.host}/graphql`,
    exchanges: [
        cacheExchange({ schema }),
        fetchExchange,
        subscriptionExchange({
            forwardSubscription(request) {
                const input = { ...request, query: request.query ?? "" }
                return {
                    subscribe(observer) {
                        const unsubscribe = wsClient.subscribe(input, observer)
                        return { unsubscribe }
                    },
                }
            },
        }),
    ],
})

export default urqlClient