<template>
  <nav class="navbar navbar-expand-md navbar-bg navbar-dark">
    <!-- Brand -->

    <!-- Toggler/collapsibe Button -->
    <!-- <button
      class="navbar-toggler"
      :class="{ collapsed: !show }"
      type="button"
      @click="show = !show"
    >
      <span class="navbar-toggler-icon"></span>
    </button>-->

    <!-- Navbar links -->
    <div class="collapse navbar-collapse" :class="{ show: show }">
      <inputsForms />
      <div class="match-count">
        <label for>Кол-во. Матчей</label>
        <input
          type="number"
          min="0"
          max="10"
          class="form-control match-count-input"
          placeholder="Матчей"
          v-model="matchCount"
        />
      </div>
    </div>

    <span
      @click="$emit('settingsShow')"
      class="nav-link onHover"
      style="right: 70px; position: relative;"
    >
      <img :src="settingsImg" alt="setting img" />
    </span>

    <span class="nav-link onHover" @click="exit()" style="right: 70px; position: relative;">
      <img :src="exitImg" alt="exit img" />
    </span>
  </nav>
</template>

<script>
// import saveImg from "../assets/img/save.svg";
// import shotImg from "../assets/img/shot.svg";
import exitImg from "../assets/img/exit.svg";
// import addListImg from "../assets/img/add_list.svg";
import settingsImg from "../assets/img/settings.svg";
import inputsForms from "../components/InputForms";

export default {
  name: "navbars",
  components: { inputsForms },
  data: () => ({
    // saveImg,
    // shotImg,
    // addListImg,
    settingsImg,
    exitImg
  }),
  methods: {
    exit() {
      this.$cookie.delete("token");
      location.reload();
    }
  },
  props: {
    show: { type: Boolean, default: false }
  },
  computed: {
    matches() {
      return this.$store.getters.matches;
    },
    matchCount: {
      get() {
        return this.$store.getters.matchCount;
      },
      set(val) {
        this.$store.commit("matchCount", val);
      }
    }
  }
};
</script>

<style lang="sass">
@import "../assets/vars"
nav
  grid-area: navbars
.navbar-bg
  background-color: rgba($RoundGreen, .3)
  .navbar-nav
    margin: 0 30px
.nav-link
  color: $aside_bg !important
  border-bottom: 2px solid transparent
  transition: all .3s linear
  margin: 0 10px
  img
    height: 20px
    &:hover
      border-bottom: 2px solid $aside_bg
.match-count
  display: flex
  text-align: left !important
  margin-left: 40px !important
  position: relative
  label
    position: relative
    top: 7px
    margin-right: 10px
  .match-count-input
    width: 90px
</style>