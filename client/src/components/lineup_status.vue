<template>
  <div class="LineUp" :class="getClass" @click="saveLU">
    <span>&nbsp;</span>
  </div>
</template>

<script>
export default {
  name: "lineup_status",
  data: () => ({
    s: null
  }),
  props: {
    id: "",
    teamsId: "",
    name: "",
    value: {
      type: String,
      default: null
    }
  },
  computed: {
    getClass: {
      get() {
        if (this.status === null) {
          return "";
        } else if (this.status === "squad") {
          return "roundred";
        } else if (this.status === "substitutions") {
          return "roundyellow";
        }
      }
    },
    status: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  methods: {
    saveLU() {
      if (this.status === null) {
        this.status = "squad";
      } else if (this.status === "squad") {
        this.status = "substitutions";
      } else if (this.status === "substitutions") {
        this.status = null;
      }
      this.$store.dispatch("SAVE_LINEUP", {
        shirtnumber: this.id,
        teamsId: this.teamsId,
        lineupStatus: this.status,
        name: this.name
      });
      this.$store.dispatch("GET_SAVED_COLOR");
    }
  }
};
</script>

<style scoped lang="sass">
@import "../assets/vars"
.LineUp
  height: 25px
  width: 25px
  border-radius: 50%
  &:hover
    cursor: pointer
    background-color: rgba($RoundRed, .4)
    &.roundred
      &:hover
        background-color: rgba($RoundYellow, .4)
    &.roundyellow
      &:hover
        background-color: rgba(white, .4)
</style>