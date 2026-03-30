import { createApp, h } from "vue"
import { IonicVue } from "@ionic/vue"
import { createPinia } from "pinia"
import { provideClient } from "@urql/vue"

import "@ionic/vue/css/core.css"
import "@ionic/vue/css/normalize.css"
import "@ionic/vue/css/structure.css"
import "@ionic/vue/css/typography.css"
import "@ionic/vue/css/padding.css"
import "@ionic/vue/css/float-elements.css"
import "@ionic/vue/css/text-alignment.css"
import "@ionic/vue/css/text-transformation.css"
import "@ionic/vue/css/flex-utils.css"
import "@ionic/vue/css/display.css"
import "./assets/global.css"

import App from "./App.vue"
import router from "./router"
import urqlClient from "./plugins/urql"

const app = createApp({
  setup() {
    provideClient(urqlClient)
  },
  render: () => h(App),
})

app.use(IonicVue, { mode: "md", animated: true })
app.use(createPinia())
app.use(router)

router.isReady().then(() => app.mount("#app"))