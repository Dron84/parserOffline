<template>
  <div class="gamerStatus" @mouseleave="showStatusBoxSelecter = false">
    <div class="preloader" v-if="preloader">
      <img src="../assets/img/loader.gif" alt="loading" />
    </div>
    <div
      class="gamerStatus_button"
      :class="{ show: showStatusBoxSelecter }"
      @click="showStatusBoxSelecter = !showStatusBoxSelecter"
      v-if="values === null || values === 0"
    ></div>
    <div
      class="gamerStatus_button"
      :class="buttonClass()"
      @click="showStatusBoxSelecter = !showStatusBoxSelecter"
      v-else
    >
      <img :src="getSrc(values)" alt="image" />
    </div>

    <transition name="fade">
      <div class="gamerStatus_box" v-if="showStatusBoxSelecter">
        <div
          class="box_item"
          v-for="(item, index) in status"
          @click="selectStatus(item)"
          @change="selectStatus(item)"
          :key="index"
        >
          <img :src="item.src" alt="image" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import red_card from "../../src/assets/img/red.png";
import gree_card from "../../src/assets/img/green.png";
import yellow_card from "../../src/assets/img/yellow.png";
import red_plus from "../../src/assets/img/red_plus.svg";
import green_plus from "../../src/assets/img/green_plus.svg";
import red_plane from "../../src/assets/img/red_plane.svg";
import green_plane from "../../src/assets/img/green_plane.svg";
import question from "../../src/assets/img/question.png";
import redQuestion from "../../src/assets/img/redQuestion.png";
import player from "../../src/assets/img/soccer_player.svg";
import axios from "axios";

export default {
  name: "gamerStatus",
  data() {
    return {
      preloader: false,
      status: [
        { id: 0, src: player },
        { id: 1, src: question },
        { id: 2, src: redQuestion },
        { id: 3, src: red_plus },
        { id: 4, src: red_card },
        { id: 5, src: yellow_card },
        { id: 6, src: red_plane },
        { id: 7, src: green_plus },
        { id: 8, src: gree_card },
        { id: 9, src: green_plane }
      ],
      showStatusBoxSelecter: false
    };
  },
  props: {
    value: { type: Number, default: null },
    id: "",
    teamsId: "",
    teamName: "",
    index: "",
    name: ""
  },
  methods: {
    selectStatus(item) {
      this.preloader = true;
      this.values = item;
      this.showStatusBoxSelecter = false;
      this.saveStatus(item);
    },
    async saveStatus(item) {
      await this.$store.dispatch("SAVE_STATUS", {
        teamsId: this.teamsId,
        id: this.id,
        item_id: item.id,
        name: this.name
      });
      this.preloader = false;
      this.$store.dispatch("GET_SAVED_COLOR");
    },
    getSrc(id) {
      let src = "";
      this.status.forEach(item => {
        if (item.id === id) {
          src = item.src;
        }
      });
      return src;
    },
    buttonClass() {
      let result = "";
      if (this.showStatusBoxSelecter) {
        result = result + " show";
      }
      if (this.values !== undefined) {
        result = result + " statusSelected";
      }
      return result;
    }
  },
  computed: {
    values: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val.id);
        this.$emit("GamerStatusChange", {
          index: this.index,
          selected: val.id,
          teamId: this.teamsId,
          id: this.id
        });
      }
    }
  }
};
</script>

<style scoped lang="sass">
@import "../assets/vars"
.gamerStatus
  position: relative
  display: flex
  align-content: center
  justify-content: center
  .preloader
    position: absolute
    top: 0
    left: 0
    width: 20px
    height: 20px
    img
      height: 20px
      width: 20px
  &_button
    width: 20px
    height: 20px
    border-radius: 2px
    align-self: center
    justify-self: center
    cursor: pointer
    &.show
      &::after
        content: 'x'
        font-size: 25px
        color: indianred
        position: absolute
        top: -7px
        left: 5px
    &.statusSelected
      border: 1px solid transparent
      img
        width: 19px
        height: 19px
        position: absolute
        top: 2px
        left: 1px
  &_box
    width: 20px
    top: 20px
    left: 0
    position: absolute
    background-color: #ffffff
    border-radius: 8px
    border: 1px solid $RoundGreen
    display: grid
    z-index: 9999
    .box_item
      width: 100%
      width: 20px
      height: 20px
      text-align: center
      display: grid
      grid-template-columns: 20px
      align-content: center
      justify-content: center
      background: none
      color: black
      &:hover
        background-color: white
        cursor: pointer
        border: 1px solid $RoundGreen
        border-radius: 2px
      img
        width: 18px
        height: 18px

.fade-enter-active, .fade-leave-active
  transition: opacity .5s

.fade-enter, .fade-leave-to
  opacity: 0
</style>
