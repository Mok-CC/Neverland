import { createApp } from "vue";
import App from "./App.vue";
import { router } from "@/router";
import store from "@/store";
import "virtual:windi.css";
import "@/permission.js";
import "nprogress/nprogress.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

import permission from "@/directives/permission.js";
app.use(permission);

app.use(router);
app.use(store);
app.mount("#app");
