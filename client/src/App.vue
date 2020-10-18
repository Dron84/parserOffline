<template>
  <div id="app">
    <div class="main-layout" v-if="tokenState !== undefined">
      <navbars
        @settingsShow="settingShow"
        :show="setting"
        @groupShow="groupShow"
       
      />
      <asides />
      <tmName v-if="setting && !group_show" />
      <group v-else-if="group_show && !setting" />
      <router-view ref="routes" v-else />
      <img :src="images" alt v-if="images !== null" />
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
import group from "./views/group";

export default {
  name: "App",
  data: () => ({
    images: null,
    setting: false,
    group_show: false,
    savedData: false,
  }),
  components: { asides, navbars, Login, tmName, group },
  methods: {
    settingShow() {
      this.setting = !this.setting;
      this.group_show = false;
    },
    groupShow() {
      this.group_show = !this.group_show;
      this.setting = false;
    },
    async syncGetInfo(){
      const user_id = localStorage.getItem('user_id')
      const {data} = await this.$axios.get(`/storage/${user_id}`)
      console.log(`data`,data)
      data.map(item=>{
        localStorage.setItem(item.key,item.data)
      })
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
    },
  },
  async created() {
    // TODO 'sync is off' 'uncomment to sync is on'
    await this.syncGetInfo()
    window.addEventListener('blur',()=>{
      console.log(`mouse out`)
      this.sync()
    })
    this.$store.dispatch("GET_SAVED_MATCHES_FROM_LOCAL_STORAGE");
    this.$store.dispatch("GET_SERVER_PRICE");
  },
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
