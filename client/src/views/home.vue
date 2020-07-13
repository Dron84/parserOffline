<template>
  <div class="main-content">
    <preloader v-if="preloader" />

    <two_lineup
      v-if="
        (!isEmptyObject(matches.teamA) && !preloader) ||
          (!isEmptyObject(matches.teamB) && !preloader)
      "
      @clearSavedColor="clearSavedColor($event)"
      @clearSavedLU="clearSavedLU($event)"
      @clearSavedStatus="clearSavedStatus($event)"
      :matchCount="matchCount"
    />
  </div>
</template>

<script>
import preloader from "@/components/preloader";
import two_lineup from "@/components/two_lineup";
export default {
  name: "home",
  components: { two_lineup, preloader },

  methods: {
    clearSavedColor(id) {
      this.$store.dispatch("CLEAR_SAVED_COLOR", id);
      this.$store.dispatch("GET_SAVED_COLOR");
    },
    clearSavedLU(id) {
      this.$store.dispatch("CLEAR_SAVED_LU", id);
      this.$store.dispatch("GET_SAVED_COLOR");
    },
    clearSavedStatus(id) {
      this.$store.dispatch("CLEAR_SAVED_STATUS", id);
      this.$store.dispatch("GET_SAVED_COLOR");
    }
  },
  computed: {
    matches() {
      return this.$store.getters.matches;
    },
    preloader() {
      return this.$store.getters.preloader;
    },
    matchCount: {
      get() {
        return this.$store.getters.matchCount;
      }
    }
  }
};
</script>

<style scoped lang="sass">
</style>