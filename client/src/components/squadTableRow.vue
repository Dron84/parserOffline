<template>
  <div class="rows">
    <div
      class="row"
      v-if="team_squad !== undefined"
      v-for="(rows, index) in team_squad"
      :key="index"
      :style="styleForRow"
    >
      <div class="columns fs17px">{{ rows.shirtnumber }}</div>
      <playerStatus
        :name="rows.name"
        class="names"
        :class="getGamerStatus(rows)"
        @changePlayerStatus="
          $emit('changePlayerStatus', { data: $event, index })
        "
      />
      <gamerStatus
        v-model="rows.gamerStatus"
        :id="rows.shirtnumber"
        :name="rows.name"
        :teamsId="id"
        :teamName="teamName"
      />
      <lu_button
        color="blue"
        v-model="rows.blue"
        :id="rows.shirtnumber"
        :name="rows.name"
        :teamsId="id"
        :teamName="teamName"
        v-if="blueButtons"
      />
      <lu_button
        color="lightblue"
        v-model="rows.lightblue"
        :id="rows.shirtnumber"
        :name="rows.name"
        :teamsId="id"
        :teamName="teamName"
      />

      <lineup_status
        class="columns LU"
        v-model="rows.LU"
        :id="rows.shirtnumber"
        :name="rows.name"
        :teamsId="id"
      />
      <lu_button
        color="black"
        v-model="rows.black"
        :id="rows.shirtnumber"
        :name="rows.name"
        :teamsId="id"
        :teamName="teamName"
      />
      <div class="columns flag">
        <span :class="rows.flag"></span>
      </div>
      <newMatch
        class="columns"
        v-model="rows.NM"
        :id="rows.shirtnumber"
        :name="rows.name"
        :teamsId="id"
        v-if="NM"
      />
      <div class="columns matches">
        <div
          class="columns m12px"
          :class="getSquadClass(rows, index)"
          v-for="(item, index) in team_matches"
          v-if="index < matchCount && !isEmptyObject(item.squad)"
          :key="index"
        >
          <span>&nbsp;</span>
        </div>
        <!-- :class="getAddedSquadClass(rows, index)" -->
        <!-- <newMatch
          class="columns"
          @input="setMatchSquad(rows, index, $event)"
          :id="rows.shirtnumber"
          :name="rows.name"
          :teamsId="id"
        /> -->
      </div>
      <div class="columns">{{ rows.age }}</div>
      <div class="columns">{{ rows.position }}</div>
      <div class="columns">{{ rows["game-minutes"] }}</div>
      <div class="columns">{{ rows.appearances }}</div>
      <div class="columns">{{ rows.lineups }}</div>
      <div class="columns">{{ rows["subs-on-bench"] }}</div>

      <!--:class="{'max_goals': goal_max === rows.goals}"-->
      <div class="columns" :class="[getGoals(rows.goals) ? 'max_goals' : '']">
        {{ rows.goals }}
      </div>
      <div class="columns">{{ rows.assists }}</div>
      <div
        class="columns onHover"
        :class="{ yellowBorder: rows.yellowCardStatus }"
        @click="$emit('yellowCard', { data: !rows.yellowCardStatus, index })"
        v-if="cards"
      >
        {{ rows["yellow-cards"] }}
      </div>
      <div class="columns" v-if="cards">{{ rows["2nd-yellow-cards"] }}</div>
      <div class="columns" v-if="cards">{{ rows["red-cards"] }}</div>
      <!--:class="{'max_price': rows.price.max }"-->
      <div
        class="columns"
        :class="[getMaxPrice(rows.shirtnumber) ? 'max_price' : '']"
      >
        {{ getPlayerPrice(rows.shirtnumber) }}
      </div>
      <div class="columns" v-if="players">
        <span
          class="ico"
          style="position: relative; top: -4px;"
          @click="$emit('removePlayer', rows)"
          ><img :src="trashImg" alt="Удалить" style="height: 15px;"
        /></span>
      </div>
    </div>
  </div>
</template>
<script>
import lu_button from "./lu_button.vue";
import gamerStatus from "./gamerStatus";
import lineup_status from "./lineup_status";
import newMatch from "./newMatch";
import trashImg from "../assets/img/trash.svg";
import playerStatus from "@/components/playerStatus";

export default {
  name: "squadTableRow",
  components: {
    lu_button,
    gamerStatus,
    lineup_status,
    newMatch,
    playerStatus
  },
  data: () => ({ trashImg }),
  props: {
    team_squad: { type: Array },
    team_matches: { type: Array },
    matchCount: { type: String },
    NM: null,
    cards: null,
    blueButtons: null,
    id: null,
    teamName: "",
    players: null
  },
  methods: {
    setMatchSquad(rows, index, val) {
      const match = { ...this.team_matches[index] };
      match.addsquad === undefined ? (match.addsquad = []) : false;
      const getNewVal = val =>
        val === "squad"
          ? "substitution"
          : val === "substitution"
          ? "none"
          : val === "none" && "squad";
      const find = match.addsquad.find(
        item => item.shirtnumber === rows.shirtnumber
      );
      !find
        ? match.addsquad.push({
            flag: rows.flag,
            name: rows.name,
            shirtnumber: rows.shirtnumber,
            squad: val
          })
        : match.addsquad.map(item =>
            item.shirtnumber === rows.shirtnumber
              ? (item.squad = getNewVal(item.squad))
              : 0
          );
      this.$emit("setMatchSquad", { match, index });
    },
    getGamerStatus(row) {
      return ` ${row.playerStatus} `;
    },

    getSquadClass(player, matchNumber) {
      let color;
      if (this.team_matches[matchNumber].squad !== undefined) {
        this.team_matches[matchNumber].squad.forEach(item => {
          if (item.shirtnumber === 0) {
            const getName = name => {
              name = name.replace(/\w\.\s/, "").split(" ");
              if (name.length === 2) {
                return name[1];
              } else if (name.length === 3) {
                return `${name[1]} ${name[2]}`;
              } else {
                return name[0];
              }
            };
            const playerName = getName(player.name);
            const itemName = getName(item.name);
            if (playerName === itemName) {
              if (item.squad === "squad") {
                color = "roundgreen";
              } else if (item.squad === "substitution") {
                color = "roundyellow";
              }
            }
          } else {
            if (item.shirtnumber === player.shirtnumber) {
              if (item.squad === "squad") {
                color = "roundgreen";
              } else if (item.squad === "substitution") {
                color = "roundyellow";
              }
            }
          }
        });
        return color;
      } else {
        return "";
      }
    },
    getAddedSquadClass(player, matchNumber) {
      let color;
      if (this.team_matches[matchNumber].addsquad !== undefined) {
        this.team_matches[matchNumber].addsquad.forEach(item => {
          if (item.shirtnumber === 0) {
            const getName = name => {
              name = name.replace(/\w\.\s/, "").split(" ");
              if (name.length === 2) {
                return name[1];
              } else if (name.length === 3) {
                return `${name[1]} ${name[2]}`;
              } else {
                return name[0];
              }
            };
            const playerName = getName(player.name);
            const itemName = getName(item.name);
            if (playerName === itemName) {
              if (item.squad === "squad") {
                color = "roundgreen";
              } else if (item.squad === "substitution") {
                color = "roundyellow";
              }
            }
          } else {
            if (item.shirtnumber === player.shirtnumber) {
              if (item.squad === "squad") {
                color = "roundgreen";
              } else if (item.squad === "substitution") {
                color = "roundyellow";
              }
            }
          }
        });
        return color;
      } else {
        return "";
      }
    },
    getGoals(numGoals) {
      return this.goal_max === Number(numGoals) ? true : false;
    },
    getMaxPrice(shirtnumber) {
      const price = this.getNumber(this.getPlayerPrice(shirtnumber));
      return this.price_max > 0 && price === this.price_max ? true : false;
    },
    getPlayerPrice(shirtnumber) {
      if (this.lineupPrice) {
        let price = "N/D";
        this.lineupPrice.forEach(item => {
          if (Number(item.number) === Number(shirtnumber)) {
            price = item.price;
          }
        });
        return price;
      }
    }
  },
  computed: {
    styleForRow() {
      const getPlayer = player => (player ? "40px" : "");
      const getNMBlueButtons = (NM, btn) => {
        if (NM && btn) {
          return "repeat(7, 1fr)";
        } else if (NM && !btn) {
          return "repeat(6, 1fr)";
        } else if (!NM && btn) {
          return "repeat(6, 1fr)";
        } else {
          return "repeat(5, 1fr)";
        }
      };
      const getCards = card => (card ? "repeat(8, 1fr)" : "repeat(5, 1fr)");
      const getMatches = () => this.matchCount * 40 + 3;
      return `grid-template-columns: 25px 6fr ${getNMBlueButtons(
        this.NM,
        this.blueButtons
      )} ${getMatches()}px repeat(2, 1fr) 2fr ${getCards(
        this.cards
      )} 3fr ${getPlayer(this.players)};`;
    },
    price_max() {
      let price = [];
      if (!this.isEmptyObject(this.lineupPrice)) {
        this.lineupPrice.forEach(async item => {
          price.push(this.getNumber(item.price));
        });
      }
      return this.MaxOnArray(price);
    },
    goal_max() {
      let goals = [];
      if (!this.isEmptyObject(this.team_squad)) {
        this.team_squad.forEach(async item => {
          goals.push(item.goals);
        });
      }
      return this.MaxOnArray(goals);
    }
  }
};
</script>