<template>
  <div class="two_lineups">
    <div class="lineups_header">
      <switches caption="Карты" v-model="cards" />
      <switches caption="Границы" v-model="addBorder" />
    </div>
    <div class="lineups_body">
      <squadTable
        :teamHref="matches.teamA.href"
        :team="matches.teamA"
        :id="matches.teamA._id"
        :teamName="matches.teamA.name"
        :teamPrice="price(matches.teamA.name)"
        :lineupPrice="matches.teamA.priceSquadList"
        @clearSavedColor="$emit('clearSavedColor', $event)"
        @clearSavedLU="$emit('clearSavedLU', $event)"
        @clearSavedStatus="$emit('clearSavedStatus', $event)"
        @setComment="setComment(matches.teamA._id, matches, $event)"
        @removePlayer="removePlayer(matches.teamA._id, $event)"
        @removeAddPlayer="removeAddPlayer(matches.teamA._id, $event)"
        @addPlayer="addPlayer(matches.teamA._id, $event)"
        :priceOfLineup="selectLineupPrice(matches.teamA, matches.teamA.priceSquadList)"
        @changePlayerStatus="changePlayerStatus(matches.teamA, $event)"
        @yellowCard="yellowCard(matches.teamA, $event)"
        @setMatchSquad="setMatchSquad(matches.teamA, $event)"
        :matchCount="matchCount"
        @changePrice="changePrice(matches.teamA, $event)"
        :cards="cards"
        :addBorder="addBorder"
      />

      <squadTable
        :teamHref="matches.teamB.href"
        :team="matches.teamB"
        :id="matches.teamB._id"
        :teamName="matches.teamB.name"
        :teamPrice="price(matches.teamB.name)"
        :lineupPrice="matches.teamB.priceSquadList"
        @clearSavedColor="$emit('clearSavedColor', $event)"
        @clearSavedLU="$emit('clearSavedLU', $event)"
        @clearSavedStatus="$emit('clearSavedStatus', $event)"
        @setComment="setComment(matches.teamB._id, matches, $event)"
        @removePlayer="removePlayer(matches.teamB._id, $event)"
        @removeAddPlayer="removeAddPlayer(matches.teamB._id, $event)"
        @addPlayer="addPlayer(matches.teamB._id, $event)"
        :priceOfLineup="selectLineupPrice(matches.teamB, matches.teamB.priceSquadList)"
        @changePlayerStatus="changePlayerStatus(matches.teamB, $event)"
        @yellowCard="yellowCard(matches.teamB, $event)"
        @setMatchSquad="setMatchSquad(matches.teamB, $event)"
        :matchCount="matchCount"
        @changePrice="changePrice(matches.teamB, $event)"
        :cards="cards"
        :addBorder="addBorder"
      />
    </div>
  </div>
</template>

<script>
import squadTable from "./squadTable";
import moment from "moment";
import switches from "@/components/switches.vue";

export default {
  name: "two_lineup",
  data: () => ({
    cards: false,
    addBorder: false,
  }),
  components: { squadTable, switches },
  methods: {
    changePrice(team, obj) {
      const match = this.matches;
      team.squad.map((item, index) => {
        if (index === obj.index) {
          item.price = obj.newPrice;
        }
      });
      if (match.teamA._id === team._id) {
        match.teamA = team;
        this.$store.commit("SET_MATCH", match);
      } else {
        match.teamB = team;
        this.$store.commit("SET_MATCH", match);
      }
      this.setSavedMathecs(match);
    },
    setMatchSquad(team, obj) {
      const match = { ...this.matches };
      team.matches[obj.index] = obj.match;
      if (match.teamA._id === team._id) {
        match.teamA = team;
        this.$store.commit("SET_MATCH", match);
      } else {
        match.teamB = team;
        this.$store.commit("SET_MATCH", match);
      }
      this.setSavedMathecs(match);
    },
    setComment(id, match, val) {
      this.$store.dispatch("SET_COMMENT", { id, match, val });
    },
    removePlayer(teamId, player) {
      this.$store.dispatch("REMOVE_PLAYER", { teamId, player });
    },
    removeAddPlayer(teamId, player) {
      this.$store.dispatch("REMOVE_ADDED_PLAYER", { teamId, player });
    },
    addPlayer(teamId, player) {
      this.$store.dispatch("ADD_PLAYER", { teamId, player });
    },
    selectLineupPrice(team, lineupPrice) {
      let result = 0;
      if (lineupPrice && team) {
        team.squad.forEach((item) => {
          item.LU === "squad"
            ? this.isEmptyObject(item.price)
              ? (result += Number(
                  this.getNumber(this.getPlayerPrice(item, lineupPrice))
                ))
              : (result += Number(this.getNumber(item.price)))
            : null;
        });
      }
      return result;
    },
    price(teamName) {
      const price = this.$store.getters.price;
      return !this.isEmptyObject(price)
        ? price.filter((item) => {
            const reg = new RegExp(teamName, "ig");
            if (reg.test(item.name)) {
              return true;
            }
          })[0]
        : [];
    },
    
    changePlayerStatus(team, data) {
      const match = { ...this.matches };
      const arr = () => (data.addsquad === true ? "addsquad" : "squad");
      if (match.teamA === team) {
        team[arr()][data.index].playerStatus = data.data;
        this.$store.dispatch("SAVE_PLAYER_STATUS", {
          teamsId: team._id,
          id: team[arr()][data.index].shirtnumber,
          name: team[arr()][data.index].name,
          val: data.data,
        });
        this.$store.commit("SET_MATCH", match);
      } else {
        team[arr()][data.index].playerStatus = data.data;
        this.$store.dispatch("SAVE_PLAYER_STATUS", {
          teamsId: team._id,
          id: team[arr()][data.index].shirtnumber,
          name: team[arr()][data.index].name,
          val: data.data,
        });
        this.$store.commit("SET_MATCH", match);
      }
      this.setSavedMathecs(match);
    },
    setSavedMathecs(match) {
      const saved = [...this.$store.getters.savedMatches];
      saved.map((item) => {
        if (
          item.teamA._id === match.teamA._id &&
          item.teamB._id === match.teamB._id
        ) {
          item = match;
        }
      });
      this.$store.commit("SET_SAVED_MATCHES", saved);
    },
    yellowCard(team, data) {
      // console.log(team, data);
      const match = { ...this.matches };
      if (match.teamA === team) {
        team.squad[data.index].yellowCardStatus = data.data;
        this.$store.dispatch("SAVE_YELLOW_CARD", { team, data });
        this.$store.commit("SET_MATCH", match);
      } else {
        team.squad[data.index].yellowCardStatus = data.data;
        this.$store.dispatch("SAVE_YELLOW_CARD", { team, data });
        this.$store.commit("SET_MATCH", match);
      }
      this.setSavedMathecs(match);
    },
  },
  computed: {
    matches() {
      const matches = this.$store.getters.matches;
      const teamA = { ...matches.teamA };
      const teamB = { ...matches.teamB };
      const toDate = (date) =>
        `20${date.split("/")[2]},${date.split("/")[1]},${date.split("/")[0]}`;
      const sortTeamMatches = (team) => {
        team.matches = team.matches.sort(
          ({ teamData: a }, { teamData: b }) =>
            new Date(toDate(b.date)) - new Date(toDate(a.date))
        );
        return team;
      };
      const getMatches = () => {
        matches.teamA = sortTeamMatches(teamA);
        matches.teamB = sortTeamMatches(teamB);
        return matches;
      };
      // teamB.matches = teamB.matches.reverse();
      return (
        matches !== undefined &&
        matches.teamA !== undefined &&
        matches.teamB !== undefined &&
        getMatches()
      );

      // return matches
    },
  },
  props: {
    matchCount: { type: String },
  },
};
</script>

<style scoped lang="sass">
@import "../assets/vars"

.two_lineups
  display: grid
  grid-gap: 20px
  justify-content: left
  align-content: start
  position: relative
  padding: 30px 10px
  width: 100%
  grid-template-rows: 1fr 50px
  grid-template-areas: "body" "header"
  .lineups_header
    grid-area: header
    justify-content: left
    align-items: center
    display: flex
  .lineups_body
    grid-area: body
    display: flex
    flex-wrap: wrap
    // grid-template-columns: 1fr 1fr
  .match_link
    position: absolute
    display: inline-flex
    top: 0
    height: 40px
    left: calc(50% - 30px)
    transition: all .3s linear
    img
      height: 30px
    &:hover
      transform: scale(1.1)
      &::after
        visibility: visible
        opacity: 1
        &::after
          position: absolute
          content: attr(data-title)
          width: 130px
          text-align: center
          top: -30px
          left: calc(50% - 60px)
          background-color: rgba(black,.7)
          border-radius: 7px
          color: white
          opacity: 0
          visibility: hidden
          transition: all .3s linear
        img
          height: 40px

.fs17px
  font-size: 17px
</style>