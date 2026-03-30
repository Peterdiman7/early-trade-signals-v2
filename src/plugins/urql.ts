import urql, { fetchExchange, subscriptionExchange } from "@urql/vue"
import { cacheExchange } from "@urql/exchange-graphcache"

import { createClient as createWsClient } from "graphql-ws"

import type { ClientOptions } from "@urql/vue"

import schema from "@/generated/introspection_schema.json"

const wsClient = createWsClient({
  url: `${window.location.protocol === "https:" ? "wss://" : "ws://"}${window.location.host}/graphql`,
  keepAlive: 10000,
})

const createOptions = (): ClientOptions => {
  return {
    url: `${window.location.protocol}//${window.location.host}/graphql`,
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
            subscribe(sink) {
              const unsubscribe = wsClient.subscribe(request, sink)
              return { unsubscribe }
            },
          }
        },
      }),
    ],
  }
}

export default {
  client: urql,
  createOptions,
}