<template>
  <div class="columns priceSelector">
    <span @click="box = !box">{{ price }}</span>
    <ul class="box" v-if="box">
      <span class="close" @click="box =false">&times;</span>
      <li v-for="item in priceList" :key="item._id" @click="price =item.price">
        <span>{{item.name}}</span>
        <span>{{item.price}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "priceSelector",
  data: () => ({
    box: false
  }),
  props: {
    rowPrice: { type: String },
    priceList: { type: Array },
    row: { type: Object }
  },
  methods: {},
  computed: {
    price: {
      get() {
        return this.row.price === null ? this.rowPrice : this.row.price;
      },
      set(val) {
        this.$store.dispatch("CHANGE_PRICE", {
          player: this.row,
          newPrice: val
        });
        this.$emit("changePrice", this.row);
        this.box = false;
        this.$store.dispatch("GET_SAVED_COLOR");
      }
    }
  }
};
</script>
<style lang="sass" scoped>
@import '../assets/vars'
.priceSelector
  position: relative
  .box
    padding: 30px 10px 10px 10px
    list-style: none
    width: 300px
    position: absolute
    top: 0
    left: -50%
    background: white
    border: 1px solid $RoundLightBlue
    z-index: 99999
    .close
      position: absolute
      top: 0
      right: 0
      padding: 5px
      border: 1px solid transparent
      &:hover
        color: red
        cursor: pointer
        border: 1px solid red

    li
      text-align: left
      display: grid
      grid-template-columns: 1fr 90px
      border: 1px solid transparent

      &:hover
        cursor: pointer
        border-bottom: 1px solid $RoundLightBlue
</style>