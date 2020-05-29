"use strict";

// import "@babel/polyfill";
import "core-js/stable";
import "regenerator-runtime/runtime";

import "element-ui/lib/theme-chalk/index.css";
import "assets/global-styles.scss";

import Vue from "vue";
import ElementUI from "element-ui";
import locale from "element-ui/lib/locale/lang/en";
Vue.use(ElementUI, { locale });

import VueScrollTo from "vue-scrollto";
Vue.use(VueScrollTo);

import fontawesome from "@fortawesome/fontawesome-free/js/all";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoReplaceSvg = "nest";

import App from "components/app.vue";
import { router } from "./routes";
import { store } from "./store";

App.router = router;
App.store = store;
const app = new Vue(App);
