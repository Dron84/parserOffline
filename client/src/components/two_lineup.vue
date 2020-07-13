<template>
  <div class="two_lineups">
    <squadTable
      :teamHref="matches.teamA.href"
      :team="matches.teamA"
      :id="matches.teamA._id"
      :teamName="matches.teamA.name"
      :teamPrice="price(matches.teamA.name)"
      :lineupPrice="priceSquadList(matches.teamA.name)"
      @clearSavedColor="$emit('clearSavedColor', $event)"
      @clearSavedLU="$emit('clearSavedLU', $event)"
      @clearSavedStatus="$emit('clearSavedStatus', $event)"
      @setComment="setComment(matches.teamA._id, matches, $event)"
      @removePlayer="removePlayer(matches.teamA._id, $event)"
      @removeAddPlayer="removeAddPlayer(matches.teamA._id, $event)"
      @addPlayer="addPlayer(matches.teamA._id, $event)"
      :priceOfLineup="
        selectLineupPrice(matches.teamA, priceSquadList(matches.teamA.name))
      "
      @changePlayerStatus="changePlayerStatus(matches.teamA, $event)"
      @yellowCard="yellowCard(matches.teamA, $event)"
      @setMatchSquad="setMatchSquad(matches.teamA, $event)"
      :matchCount="matchCount"
    />

    <squadTable
      :teamHref="matches.teamB.href"
      :team="matches.teamB"
      :id="matches.teamB._id"
      :teamName="matches.teamB.name"
      :teamPrice="price(matches.teamB.name)"
      :lineupPrice="priceSquadList(matches.teamB.name)"
      @clearSavedColor="$emit('clearSavedColor', $event)"
      @clearSavedLU="$emit('clearSavedLU', $event)"
      @clearSavedStatus="$emit('clearSavedStatus', $event)"
      @setComment="setComment(matches.teamB._id, matches, $event)"
      @removePlayer="removePlayer(matches.teamB._id, $event)"
      @removeAddPlayer="removeAddPlayer(matches.teamB._id, $event)"
      @addPlayer="addPlayer(matches.teamB._id, $event)"
      :priceOfLineup="
        selectLineupPrice(matches.teamB, priceSquadList(matches.teamB.name))
      "
      @changePlayerStatus="changePlayerStatus(matches.teamB, $event)"
      @yellowCard="yellowCard(matches.teamB, $event)"
      @setMatchSquad="setMatchSquad(matches.teamB, $event)"
      :matchCount="matchCount"
    />
  </div>
</template>

<script>
import squadTable from "./squadTable";
import moment from "moment";
export default {
  name: "two_lineup",
  components: { squadTable },
  methods: {
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
        team.squad.forEach(item => {
          if (item.LU === "squad") {
            lineupPrice.forEach(async price => {
              if (Number(item.shirtnumber) === Number(price.number)) {
                result += Number(this.getNumber(price.price));
              }
            });
          }
        });
      }
      return result;
    },
    price(teamName) {
      const price = this.$store.getters.price;
      return price.length > 0
        ? price.filter(item => {
            const reg = new RegExp(teamName, "ig");
            if (reg.test(item.name)) {
              return true;
            }
          })[0]
        : [];
    },
    priceSquadList(teamName) {
      const getPrice = price => {
        const reg = new RegExp(teamName, "ig");
        const filtred = price.filter(item =>
          reg.test(item.name) ? true : false
        );
        return filtred.length > 0 ? filtred[0].squad_list : [];
      };
      return this.$store.getters.price.length > 0
        ? getPrice(this.$store.getters.price)
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
          val: data.data
        });
        this.$store.commit("SET_MATCH", match);
      } else {
        team[arr()][data.index].playerStatus = data.data;
        this.$store.dispatch("SAVE_PLAYER_STATUS", {
          teamsId: team._id,
          id: team[arr()][data.index].shirtnumber,
          name: team[arr()][data.index].name,
          val: data.data
        });
        this.$store.commit("SET_MATCH", match);
      }
      this.setSavedMathecs(match);
    },
    setSavedMathecs(match) {
      const saved = [...this.$store.getters.savedMatches];
      saved.map(item => {
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
        this.$store.commit("SET_MATCH", match);
      } else {
        team.squad[data.index].yellowCardStatus = data.data;
        this.$store.commit("SET_MATCH", match);
      }
      this.setSavedMathecs(match);
    }
  },
  computed: {
    matches() {
      const matches = this.$store.getters.matches;
      const teamA = { ...matches.teamA };
      const teamB = { ...matches.teamB };
      const toDate = date =>
        `20${date.split("/")[2]},${date.split("/")[1]},${date.split("/")[0]}`;
      const sortTeamMatches = team => {
        team.matches = team.matches.sort(
          ({ teamData: a }, { teamData: b }) =>
            new Date(toDate(b.date)) - new Date(toDate(a.date))
        );
        return team;
      };

      // teamB.matches = teamB.matches.reverse();
      matches.teamA = sortTeamMatches(teamA);
      matches.teamB = sortTeamMatches(teamB);
      return matches;
    }
  },
  props: {
    matchCount: { type: String }
  }
};
</script>

<style scoped lang="sass">
@import "../assets/vars"

.two_lineups
  display: flex
  grid-gap: 40px
  justify-content: left
  align-content: start
  position: relative
  padding: 30px 10px
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