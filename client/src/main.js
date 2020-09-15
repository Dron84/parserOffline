import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
// import loginRoutes from "./router/login";
import login from "./login.vue";
import store from "./store";
import $axios from "./router/axios";
import {
    BootstrapVue,
    IconsPlugin
} from "bootstrap-vue";
import VueCookie from "vue-cookie";
import base64 from "base-64";
import latinize from "latinize";


Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);
const reg = new RegExp("localhost", "ig");

if (reg.test(location.host)) {
    Vue.config.productionTip = false;
} else {
    Vue.config.productionTip = true;
}

const getName = (name) => {
    const nameReg = /(\w)\.\s(\w+)|(\w+)\s(\w+)|(\w)\s(\w+)|(\w+)/i
    const isEmptyObject = (object) => object === null || object === undefined ? true : Object.entries(object).length === 0 ? true : false;
    name = latinize(name);
    // console.log(`name`, name);
    name = name !== null && name.trim().match(nameReg);
    // console.log(`name`, name);
    if (!isEmptyObject(name[1]) && !isEmptyObject(name[2])) {
        return `${name[1]} ${name[2]}`;
    } else if (
        isEmptyObject(name[1]) &&
        isEmptyObject(name[2]) &&
        !isEmptyObject(name[3]) &&
        !isEmptyObject(name[4])
    ) {
        const newName = name[3].slice(0, 1);
        return `${newName} ${name[4]}`;
    } else if (
        isEmptyObject(name[1]) &&
        isEmptyObject(name[2]) &&
        isEmptyObject(name[3]) &&
        isEmptyObject(name[4]) &&
        !isEmptyObject(name[5]) &&
        !isEmptyObject(name[6])
    ) {
        return `${name[5]} ${name[6]}`;
    } else {
        return `${name[7]}`;
    }
}

const getNumber = (val) => {
    if (val !== null && typeof val === "string" && val !== undefined) {
        const reg_price = /([0-9\.]+)(m|bn|k|Th|th)/;
        const newVal = val.match(reg_price);
        if (newVal !== null) {
            switch (newVal[2]) {
                case "m":
                    return Number(newVal[1].replace(".", "") + "0000");
                    break;
                case "bn":
                    return Number(newVal[1].replace(".", "") + "0000000");
                    break;
                case "k":
                    return Number(newVal[1].replace(".", "") + "000");
                    break;
                case "Th":
                    return Number(newVal[1].replace(".", "") + "000");
                    break;
                case "th":
                    return Number(newVal[1].replace(".", "") + "000");
                    break;
            }
        } else {
            return 0;
        }
    } else {
        return 0;
    }
};

const getPlayerPrice = (player, lineupPrice) => {
    if (lineupPrice) {
        let price = "0";
        const playerName = getName(player.name);
        lineupPrice.forEach(item => {
            const itemName = getName(item.name);
            if (playerName === itemName) {
                price = item.price;
            }
        });
        return price;
    }
}


Vue.prototype.isEmptyObject = (object) => object === null || object === undefined ? true : Object.entries(object).length === 0 ? true : false;
Vue.prototype.$axios = $axios;
Vue.prototype.$cookie = VueCookie;
Vue.prototype.getNumber = getNumber
Vue.prototype.MaxOnArray = (array) => Math.max.apply(Math, array)
Vue.prototype.getName = getName
Vue.prototype.getPlayerPrice = getPlayerPrice

if (
    VueCookie.get("token") !== "" &&
    VueCookie.get("token") !== undefined &&
    VueCookie.get("token") !== null
) {
    const nowtime = Number((+new Date() / 1000).toFixed(0));
    const exptime = JSON.parse(base64.decode(base64.decode(VueCookie.get("token")))).exptime;
    if (nowtime < exptime) {
        Vue.prototype.$token = VueCookie.get("token");
    }
}

new Vue({
    store,
    router,
    render: function(h) {
        return h(App);
    },
}).$mount("#app");