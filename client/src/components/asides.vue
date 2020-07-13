<template>
  <aside :class="{ show: show }">
    <div class="rollover" @click="show = !show">
      <span v-if="show">&lt;</span>
      <span v-else>&gt;</span>
    </div>
    <div class="inside">
      <logo />
      <savedMatch />
    </div>
  </aside>
</template>

<script>
import logo from "./logo";
import savedMatch from "./savedMatch";
export default {
  name: "asides",
  components: { logo, savedMatch },
  data: () => ({
    show: false
  })
};
</script>

<style lang="sass">
@import "../assets/vars"
aside
  grid-area: asides
  background-color: rgba($RoundGreen,.9)
  height: 100vh
  width: 3px
  position: fixed
  right: 0
  z-index: 10000
  transition: all .4s linear
  .rollover
    position: absolute
    top: 70px
    left: -30px
    width: 30px
    height: 30px
    transform: rotateY(180deg)
    background-color: rgba($RoundGreen,.9)
    border-radius: 0 50px 50px 0
    display: inline-flex
    justify-content: center
    align-items: center
    &:hover
      background-color: rgba($RoundGreen,.7)
      cursor: pointer
      color: white
  .inside
    transition: all .4s linear
    visibility: hidden
    opacity: 0
  &.show
    width: 400px
    .inside
      visibility: visible
      opacity: 1
</style>