<template>
  <div class="columns fs17px boxes" @mouseleave="show = false">
    <span class="onHover names" @click="show = !show">{{ name }}</span>
    <div class="box" v-if="show">
      <span
        v-for="item in list"
        class="names"
        :class="item.setclass"
        :key="item.setclass"
        @click="changeStatus(item.setclass)"
      >{{ name }}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "player_status",
  data: () => ({
    show: false,
    list: [
      { setclass: " none " },
      { setclass: " red_text " },
      { setclass: " red_bg_white_text " },
      { setclass: " green_text " },
      { setclass: " yellow_text " }
    ]
  }),
  props: {
    name: { type: String, default: "Name" }
  },
  methods: {
    changeStatus(setclass) {
      this.$emit("changePlayerStatus", setclass);
      this.show = false;
      this.$store.dispatch("GET_SAVED_COLOR");
    }
  }
};
</script>
<style lang="sass">
@import '../assets/vars'
.names
  overflow: hidden
  text-overflow: ellipsis
.boxes
  position: relative
  width: 100%
  justify-content: left !important
  .box
    width: 100%
    position: absolute
    top: 20px
    display: grid
    align-items: center
    background-color: white
    z-index: 99999
    border-radius: 5px
    border: 1px solid $RoundGreen
    span
      height: 30px
      &:hover
        cursor: pointer
        background-color: rgba($RoundGreen,.3)
</style>