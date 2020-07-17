import Vue from "vue";
import VueRouter from "vue-router";
import home from "../views/home";

Vue.use(VueRouter);

const routes = [{
        path: "/",
        name: "home",
        meta: {
            title: "Домашняя",
        },
        component: home,
    },
    // {
    //   path: "/settings",
    //   name: "settings",
    //   meta: {
    //     title: "Настройки",
    //   },
    //   component: function() {
    //     return import("../views/tm_Name.vue");
    //   },
    // },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

export default router;