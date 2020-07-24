<template>
  <div class="navlistbox bg" :class="{ show: show }">
    <div class="tabs">
      <div class="team">
        <div class="form-radio-inline">
          <label class="form-radio-label">
            <input
              type="radio"
              class="form-radio-input"
              value="name"
              v-model="types"
              @change="changeType"
            />Имена
          </label>
          <label class="form-radio-label">
            <input
              type="radio"
              class="form-radio-input"
              value="number"
              v-model="types"
              @change="changeType"
            />Номера
          </label>
        </div>
        <textarea
          v-model="txt"
          @keyup.enter.prevent="GO()"
          @keyup.ctrl.enter.prevent="newLine"
          ref="textarea"
        />
        <button class="btn btn-success" @click="GO()">GO</button>
      </div>
    </div>
  </div>
</template>
<script>
import latinize from "latinize";
export default {
  name: "addListBox",
  data: () => ({
    txt: "",
    types: "name",
    msg: "",
  }),
  props: {
    team: { type: Object },
    show: { type: Boolean, default: false },
  },
  methods: {
    changeType() {
      this.txt = "";
      this.$refs.textarea.focus();
    },
    newLine(e) {
      let caret = e.target.selectionStart;
      e.target.setRangeText("\n", caret, caret, "end");
      this.txt = e.target.value;
    },
    GO() {
      const getName = (name) => {
        const newname = name
          .toLowerCase()
          .replace(/\w\.\s/, "")
          .split(" ");
        if (newname.length === 2) {
          return newname[1];
        } else if (newname.length === 3) {
          return `${newname[1]} ${newname[2]}`;
        } else {
          return newname[0];
        }
      };
      let txt;
      if (this.types === "name") {
        txt = this.txt
          .split(/\n|\r|\n\r|,\s|,|;\s|;|\s-\s/)
          .filter((item) => (item !== "" ? true : false));
        txt = txt.map((item) =>
          item
            .replace(
              /[0-9]{0,3}\.|[0-9]{0,3}\s\.|[0-9]{0,3}\.\s|[0-9]{0,3}\s\.\s/,
              ""
            )
            .trim()
        );

        let err = [];
        txt.forEach((name) => {
          const nameString = getName(name);
          // const reg = new RegExp(nameString, "ig");
          let e;
          this.team.squad.forEach((item) => {
            console.log(nameString, getName(item.name));
            if (nameString === getName(item.name)) {
              this.$store.dispatch("SAVE_LINEUP", {
                shirtnumber: item.shirtnumber,
                teamsId: this.team._id,
                lineupStatus: null,
                name: item.name,
              });
              e = false;
            }
          });
          e === undefined ? err.push(name) : false;
        });
        if (err.length > 0) {
          const rem = [];
          err.forEach((name, index) => {
            const nameString = getName(name);
            let e;
            // const regLatin = new RegExp(, "ig");
            // console.log("regLatin", regLatin);
            this.team.squad.forEach((item) => {
              console.log(
                "latinize",
                latinize(nameString),
                latinize(item.name)
              );
              if (latinize(nameString) == latinize(getName(item.name))) {
                this.$store.dispatch("SAVE_LINEUP", {
                  shirtnumber: item.shirtnumber,
                  teamsId: this.team._id,
                  lineupStatus: null,
                  name: item.name,
                });
                e = false;
              }
            });
            e === false ? rem.push(index) : false;
          });

          rem.reverse().forEach((item) => {
            err.splice(item, 1);
          });
          if (err.length > 0) {
            this.txt = `Не могу найти: ${err.join(", ")}`;
          } else {
            this.txt = "";
          }
        } else {
          this.txt = "";
        }
      } else {
        txt = this.txt
          .split(/\n|\r|\n\r|,\s|,|;\s|;|\s|\s+/)
          .filter((item) => (item !== "" && Number(item) >= 0 ? true : false));
        txt = txt.map((item) =>
          Number(item.replace(/\.|\s\.|\.\s|\s\.\s/, "").trim())
        );

        const err = [];
        txt.forEach((num) => {
          let e;
          this.team.squad.forEach((item) => {
            if (Number(item.shirtnumber) === num) {
              // item.LU = "squad";
              this.$store.dispatch("SAVE_LINEUP", {
                shirtnumber: item.shirtnumber,
                teamsId: this.team._id,
                lineupStatus: null,
                name: item.name,
              });
              e = false;
            }
          });
          e === undefined ? err.push(num) : false;
        });
        if (err.length > 0) {
          this.txt = `Не могу найти: ${err.join(", ")}`;
        } else {
          this.txt = "";
        }
        this.$emit("hide");
      }
    },
  },
};
</script>
<style lang="sass">
@import "../assets/vars"

.bg
  background-color: $RoundGreen
.navlistbox
  display: block
  visibility: hidden
  opacity: 0
  position: absolute
  padding: 15px
  top: 40px
  right: 0px
  width: 0px
  height: 0px
  transition: all .3s linear
  z-index: 10000
  &.show
    visibility: visible
    opacity: 1
    width: 400px
    min-height: 200px
    height: auto
.btn-tabs
  display: flex
  justify-content: left
.tabs
  div
    textarea
      width: 100%
      height: 130px
      background-color: rgba(white,.99)
.form-radio-label
  margin: 0 20px
  display: flex
  align-self: center
  input
    margin-right: 10px
.err
  color: $RoundRed
</style>