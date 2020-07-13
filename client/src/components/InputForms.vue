<template>
  <div class="forms">
    <div class="form-group">
      <input
        type="text"
        class="form-control"
        v-model="match"
        placeholder="Матч:"
        @keyup.enter="goMatch"
      />
    </div>
    <div class="flex">
      <button type="button" class="btn btn-secondary" @click="goMatch">
        GO
      </button>
    </div>
    <transition name="fade">
      <div class="form-group" v-if="addPriceTeamA">
        <input
          type="text"
          class="form-control"
          v-model="priceLinkTeamA"
          placeholder="TM Команда А"
          @keyup.enter="AddPrice('teamA')"
        />
      </div>
    </transition>
    <transition name="fade">
      <div class="flex" v-if="addPriceTeamA && priceLinkTeamA !== ''">
        <button
          type="button"
          class="btn btn-secondary"
          @click="AddPrice('teamA')"
        >
          GO
        </button>
      </div>
    </transition>
    <transition name="fade">
      <div class="form-group" v-if="addPriceTeamB">
        <input
          type="text"
          class="form-control"
          v-model="priceLinkTeamB"
          placeholder="TM Команда B"
          @keyup.enter="AddPrice('teamB')"
        />
      </div>
    </transition>
    <transition name="fade">
      <div class="flex" v-if="addPriceTeamB && priceLinkTeamB !== ''">
        <button
          type="button"
          class="btn btn-secondary"
          @click="AddPrice('teamB')"
        >
          GO
        </button>
      </div>
    </transition>

    <div class="form-group">
      <input
        type="text"
        class="form-control"
        v-model="teamA"
        placeholder="Команда A:"
      />
    </div>

    <div class="form-group">
      <input
        type="text"
        class="form-control"
        v-model="teamB"
        placeholder="Команда B:"
        @keyup.enter="goTeamAAndTeamB"
      />
    </div>

    <div class="flex">
      <button type="button" class="btn btn-secondary" @click="goTeamAAndTeamB">
        GO Team
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "InputForms",
  data: () => ({
    regMatches: /int\.soccerway\.com\/matches\//gi,
    regTeams: /int\.soccerway\.com\/teams\//gi,
    teamA: "",
    teamB: "",
    match: "",
    what: ["match", "teamA", "teamB"],
    addPriceTeamA: false,
    addPriceTeamB: false,
    priceLinkTeamA: "",
    priceLinkTeamB: "",
    priceTeamAName: "",
    priceTeamBName: ""
  }),
  methods: {
    async AddPrice(team) {
      if (team === "teamA") {
        const price = await this.$store.dispatch("ADD_TM_NAME", {
          soccerway: this.priceTeamAName,
          tm_link: this.priceLinkTeamA
        });
        this.$store.commit("SET_PRICE", price);
        this.addPriceTeamA = false;
        this.priceTeamAName = "";
        this.priceLinkTeamA = "";
      } else if (team === "teamB") {
        const price = await this.$store.dispatch("ADD_TM_NAME", {
          soccerway: this.priceTeamBName,
          tm_link: this.priceLinkTeamB
        });
        this.$store.commit("SET_PRICE", price);
        this.addPriceTeamB = false;
        this.priceTeamBName = "";
        this.priceLinkTeamB = "";
      }
    },
    async CheckPriceByTeam(teamA, teamB) {
      const PA = await this.$store.dispatch("CHECK_PRICE", teamA.name);
      this.priceTeamAName = teamA.name;
      !this.isEmptyObject(PA)
        ? !this.isEmptyObject(PA.message)
          ? (this.addPriceTeamA = true)
          : this.$store.commit("SET_PRICE", PA)
        : false;
      const PB = await this.$store.dispatch("CHECK_PRICE", teamB.name);
      this.priceTeamBName = teamB.name;
      !this.isEmptyObject(PB)
        ? !this.isEmptyObject(PB.message)
          ? (this.addPriceTeamB = true)
          : this.$store.commit("SET_PRICE", PB)
        : false;
    },
    async goMatch() {
      if (this.match !== "") {
        this.addPriceTeamA = false;
        this.addPriceTeamB = false;
        // this.$store.commit("SET_MATCH", { teamA: {}, teamB: {} });
        const match = await this.$store.dispatch("PARSE_URL", {
          url: this.match,
          team: this.what[0]
        });
        this.$store.dispatch("GET_SAVED_COLOR");
        this.$store.dispatch("ADD_SAVED_MATCHES", {
          ...match
        });
        this.match = "";
        this.CheckPriceByTeam(this.getMatch.teamA, this.getMatch.teamB);
      }
    },
    async goTeamAAndTeamB() {
      if (this.teamA !== "" && this.teamB !== "") {
        const teamA = await this.$store.dispatch("PARSE_URL", {
          url: this.teamA,
          team: this.what[1]
        });
        const teamB = await this.$store.dispatch("PARSE_URL", {
          url: this.teamB,
          team: this.what[2]
        });
        this.$store.dispatch("ADD_SAVED_MATCHES", { ...this.getMatch });
        this.teamA = "";
        this.teamB = "";
        this.CheckPriceByTeam(teamA, teamB);
      }
    }
  },
  computed: {
    matches() {
      if (this.teamA !== "") {
        if (this.regMatches.test(this.teamA)) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
    getMatch() {
      return this.$store.getters.matches;
    }
  }
};
</script>

<style scoped lang="sass">
.forms
  display: flex
  justify-content: center
  div:nth-child(2)
    margin-right: 30px
.flex
  display: flex
  position: relative
  align-items: center
.form-group
  display: flex
  align-items: center
</style>