<template>
  <div
    class="columns"
    :class="[!values ? 'round' + color : 'round' + color + ' active']"
    :id="teamsId + '_' + name + '_' + color"
    @click="saveColor()"
    v-if="color != ''"
  >
    <span v-if="values">&nbsp;</span>
  </div>
</template>

<script>
export default {
  name: "lu_button",
  props: {
    color: "",
    id: "",
    names: "",
    teamsId: "",
    teamName: "",
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    values: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    name() {
      return this.teamName.replace(" ", "").toLowerCase();
    }
  },
  methods: {
    async saveColor() {
      this.$store.dispatch("SAVE_COLOR", {
        teamsId: this.teamsId,
        id: this.id,
        color: this.color,
        name: this.names
      });
      this.$store.dispatch("GET_SAVED_COLOR");
    }
  }
};
</script>

<style></style>
