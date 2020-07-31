<template>
  <nav class="navbar navbar-expand-md navbar-bg navbar-dark">
    <!-- Brand -->
    <!-- Toggler/collapsibe Button -->
    <button
      class="navbar-toggler"
      :class="{ collapsed: !show }"
      type="button"
      @click="show = !show"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <!-- Navbar links-->
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
    <refreh_update class="positionCorrection" />
    <span
      @click="$emit('settingsShow')"
      class="nav-link onHover positionCorrection"
      v-if="premissions === 'admin'"
    >
      <img :src="settingsImg" alt="setting img" />
    </span>
    <span
      @click="$emit('groupShow')"
      class="nav-link onHover positionCorrection"
      v-if="premissions === 'admin'"
    >
      <img :src="groupImg" alt="group img" />
    </span>

    <span class="nav-link onHover positionCorrection" @click="exit()">
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
import groupImg from "../assets/img/group.svg";
import inputsForms from "../components/InputForms";
import refreh_update from "../components/refreshUpdate.vue";

export default {
  name: "navbars",
  components: { inputsForms, refreh_update },
  data: () => ({
    // saveImg,
    // shotImg,
    // addListImg,
    settingsImg,
    exitImg,
    groupImg,
  }),
  methods: {
    exit() {
      this.$cookie.delete("token");
      location.reload();
    },
  },
  props: {
    show: { type: Boolean, default: false },
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
      },
    },
    premissions() {
      return this.$store.getters.premissions;
    },
  },
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

.navbar-toggler-icon
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%280, 0, 0, 0.5%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e") !important

@media (min-width: 1551px)
  .positionCorrection
    right: 70px
    position: relative

@media (max-width: 1550px)
  .positionCorrection
    right: 0
  .nav-link
    padding: 1.0em 0
</style>