import axios from "axios";

let $axios;

const reg = new RegExp("localhost", "ig");
if (reg.test(location.host)) {
  $axios = axios.create({ baseURL: "//localhost:3000/api/" });
} else {
  $axios = axios.create({ baseURL: "/api/" });
}

export default $axios;
