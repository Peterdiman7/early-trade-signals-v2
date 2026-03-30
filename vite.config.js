import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// https://vitejs.dev/config/
export default defineConfig(function () {
    var proxyTarget = "https://ets-stage.app.devalex.consulting/graphql";
    return {
        plugins: [
            vue(),
        ],
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url)),
            }
        },
        preview: {
            port: 3000,
        },
        server: {
            port: 3000,
            proxy: {
                '/graphql': {
                    target: proxyTarget,
                    changeOrigin: true,
                    ws: true
                },
            }
        },
    };
});
