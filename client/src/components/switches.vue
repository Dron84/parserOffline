<template>
  <div class="switches" @click="clickToSwitch">
    <input type="checkbox" v-model="value" style="display:none" />
    <label class="toggle">
      <span></span>
    </label>
    <label>{{ caption }}</label>
  </div>
</template>
<script>
export default {
  name: "switches",
  props: {
    caption: { type: String, default: "Switch" },
    value: { type: Boolean, default: false }
  },
  methods: {
    clickToSwitch() {
      this.$emit("input", !this.value);
    }
  }
};
</script>
<style lang='sass'>
$primary: #4F2EDC
$primary-light: #947ADA
$gray: #9A9999

.switches
  display: inline-flex
  cursor: pointer
.toggle
  position: relative
  display: block
  width: 40px
  height: 20px
  cursor: pointer
  -webkit-tap-highlight-color: transparent
  transform: translate3d(0,0,0)
  &:before
    content: ""
    position: relative
    top: 3px
    left: 3px
    width: 34px
    height: 14px
    display: block
    background: $gray
    border-radius: 8px
    transition: background .2s ease
  span
    position: absolute
    top: 0
    left: 0
    width: 20px
    height: 20px
    display: block
    background: white
    border-radius: 10px
    box-shadow: 0 3px 8px rgba($gray,.5)
    transition: all .2s ease
    &:before
      content: ""
      position: absolute
      display: block
      margin: -18px
      width: 56px
      height: 56px
      background: rgba($primary,.5)
      border-radius: 50%
      transform: scale(0)
      opacity: 1
      pointer-events: none

input[type='checkbox']:checked + .toggle
  &:before
    background: $primary-light
  span
    background: $primary
    transform: translateX(20px)
    transition: all .2s cubic-bezier(.8,.4,.3,1.25), background .15s ease
    box-shadow: 0 3px 8px rgba($primary,.2)
    &:before
      transform: scale(1)
      opacity: 0
      transition: all .4s ease
</style>