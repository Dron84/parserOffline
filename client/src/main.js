import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
// import loginRoutes from "./router/login";
import login from "./login.vue";
import store from "./store";
import $axios from "./router/axios";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import VueCookie from "vue-cookie";
import base64 from "base-64";

Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);
const reg = new RegExp("localhost", "ig");

if (reg.test(location.host)) {
  Vue.config.productionTip = false;
} else {
  Vue.config.productionTip = true;
}
Vue.prototype.isEmptyObject = (object) => {
  if (object === null || object === undefined) {
    return true;
  } else {
    if (Object.entries(object).length === 0) {
      return true;
    } else {
      return false;
    }
  }
};
Vue.prototype.$axios = $axios;
Vue.prototype.$cookie = VueCookie;
Vue.prototype.getNumber = (val) => {
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
Vue.prototype.MaxOnArray = (array) => {
  return Math.max.apply(Math, array);
};

if (
  VueCookie.get("token") !== "" &&
  VueCookie.get("token") !== undefined &&
  VueCookie.get("token") !== null
) {
  const nowtime = Number((+new Date() / 1000).toFixed(0));
  const exptime = JSON.parse(
    base64.decode(base64.decode(VueCookie.get("token")))
  ).exptime;
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
