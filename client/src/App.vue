<template>
  <div id="app">
    <div class="main-layout" v-if="tokenState !== undefined">
      <navbars @settingsShow="settingShow" :show="setting" />
      <asides />
      <router-view ref="routes" />
      <img :src="images" alt v-if="images !== null" />
      <tmName v-if="setting" />
    </div>
    <div class="main-layout" v-else>
      <Login />
    </div>
  </div>
</template>

<script>
import asides from "@/components/asides";
import navbars from "@/components/navbars";
import Login from "./login";
import tmName from "./views/tm_Name";

export default {
  name: "App",
  data: () => ({
    images: null,
    setting: false
  }),
  components: { asides, navbars, Login, tmName },
  methods: {
    settingShow() {
      this.setting = !this.setting;
    }
  },
  computed: {
    matches() {
      return this.$store.getters.matches;
    },
    preloader() {
      return this.$store.getters.preloader;
    },
    tokenState() {
      return this.$token;
    }
  },
  created() {
    this.$store.dispatch("GET_SAVED_MATCHES_FROM_LOCAL_STORAGE");
    this.$store.dispatch("GET_MATCH_PRICES_FROM_LOCAL_STORAGE");
  }
};
</script>

<style lang="sass">
@import '../node_modules/bootstrap/dist/css/bootstrap.css'
@import '../node_modules/bootstrap-vue/dist/bootstrap-vue.css'
@import "assets/vars"
@import 'assets/map.css'
.onHover
  cursor: pointer
.form-group
  margin: 0 !important
.ico
  height: 20px
  width: 20px
  img
    height: 20px
    &:hover
      border-bottom: 2px solid $RoundRed
      cursor: pointer
#app
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50

  .main-layout
    display: grid
    grid-template-columns: 12fr
    grid-template-areas: "navbars" "maincontent"
    overflow: hidden

    .main-content
      grid-area: maincontent
      overflow: scroll
.fade-enter-active, .fade-leave-active
  transition: opacity .5s

.fade-enter, .fade-leave-to
  opacity: 0
</style>
