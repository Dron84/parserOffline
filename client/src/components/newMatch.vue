<template>
  <div class="newMatch" :class="getClass" @click="saveNewMatch">
    <span>&nbsp;</span>
  </div>
</template>

<script>
export default {
  name: "newMatch",
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
          return "roundgreen";
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
    saveNewMatch() {
      if (this.status === null) {
        this.status = "squad";
      } else if (this.status === "squad") {
        this.status = "substitutions";
      } else if (this.status === "substitutions") {
        this.status = null;
      }
      this.$store.dispatch("SAVE_NEW_MATCH", {
        shirtnumber: this.id,
        teamsId: this.teamsId,
        matchStatus: this.status,
        name: this.name
      });
      this.$store.dispatch("GET_SAVED_COLOR");
    }
  }
};
</script>

<style scoped lang="sass">
@import "../assets/vars"
.newMatch
  height: 25px
  width: 25px
  border-radius: 50%
  &:hover
    cursor: pointer
    background-color: rgba($RoundGreen, .4)
    &.roundgreen
      &:hover
        background-color: rgba($RoundYellow, .4)
    &.roundyellow
      &:hover
        background-color: rgba(white, .4)
</style>