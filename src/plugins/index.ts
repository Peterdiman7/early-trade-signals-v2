import pinia from "./pinia"
import createRouter from "@/router"
import urql from "./urql"

import { type App } from "vue"

export const registerPlugins = (app: App) => {
  app.use(pinia)
  app.use(urql.client, urql.createOptions())
  app.use(createRouter())
}