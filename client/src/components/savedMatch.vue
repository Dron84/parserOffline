<template>
  <div class="scroller">
    <div id="accordion">
      <div class="card" v-for="(item, index) in savedMatches">
        <div class="card-header">
          <span class="card-link">{{ item.competition }} </span>
        </div>
        <div id="collapseOne" class="collapse show">
          <div class="card-body">
            <ul class="list-group">
              <li class="list-group-item" v-for="(row, id) in item.data">
                <span
                  class="list-group-item-span onHover"
                  @click="getMatch(index, id)"
                >
                  {{ row.teamA.name }} VS {{ row.teamB.name }}
                </span>
                <span class="remove onHover" @click="removeMatch(row)">
                  <img :src="removeImg" alt />
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import removeImg from "../assets/img/trash.svg";
export default {
  name: "savedMatch",
  data: () => ({ removeImg, ShowLigas: 0 }),
  methods: {
    getMatch(index, id) {
      const match = { ...this.savedMatches[index] };
      const obj = {
        competition: match.competition,
        ...match.data[id]
      };
      // console.log(obj);
      this.$store.commit("SET_MATCH", obj);
      this.$store.dispatch("GET_SAVED_COLOR");
    },
    removeMatch(row) {
      const match = [...this.$store.getters.savedMatches];
      this.$store.commit(
        "SET_SAVED_MATCHES",
        match.filter(item =>
          item.teamA === row.teamA && item.teamB === row.teamB ? false : true
        )
      );
    }
  },
  computed: {
    savedMatches() {
      const newMatches = [];
      const savedMatch = this.$store.getters.savedMatches;
      if (!this.isEmptyObject(savedMatch)) {
        let competition = [];
        let price = {};
        savedMatch.forEach(item => {
          competition.push(item.competition);
          price = item.price;
        });
        competition = new Set(competition);
        competition.forEach(item => {
          newMatches.push({ competition: item, data: [], price });
        });
        newMatches.forEach(item => {
          savedMatch.forEach(row => {
            if (item.competition === row.competition) {
              item.data.push({ teamA: row.teamA, teamB: row.teamB });
            }
          });
        });
        return newMatches;
      } else {
        return [];
      }
    }
  }
};
</script>

<style scoped lang="sass">
@import "../assets/vars"
.scroller
  height: 95vh
  overflow: scroll
.list-group-item
  height: 30px
  overflow: hidden
  padding: .5px
  display: flex
  justify-content: center
  align-items: center
.list-group-item-span
  display: block
  overflow: hidden
  white-space: nowrap
  width: 90%
  text-overflow: ellipsis
.remove
  position: relative
  border-bottom: 2px solid transparent
  img
    height: 20px
    border-bottom: 2px solid $aside_bg
    transition: all .3s ease-in-out
    &:hover
      transform: scale(1.1)
.card-body
  padding: .01em
.card-link
  font-weight: 900
.card-header
  padding: 0.01em
</style>