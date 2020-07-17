<template>
  <div class="refreh_update">
    <span class="ico refresh" @click="refreshMatch()">
      <img :src="refreshImg" alt />
    </span>
    <span class="ico refresh" @click="refreshPrice()">
      <img :src="refreshTMImg" alt />
    </span>
  </div>
</template>
<script>
import refreshImg from "../assets/img/refreshTeam.svg";
import refreshTMImg from "../assets/img/refreshTM.svg";

export default {
  name: "refresh_update",
  data: () => ({
    refreshImg,
    refreshTMImg
  }),
  methods: {
    async CheckPriceByTeam(teamA, teamB) {
      const PA = await this.$store.dispatch("CHECK_PRICE", teamA.name);
      !this.isEmptyObject(PA) &&
        this.isEmptyObject(PA.message) &&
        this.$store.commit("SET_PRICE", PA);
      const PB = await this.$store.dispatch("CHECK_PRICE", teamB.name);
      !this.isEmptyObject(PB) &&
        this.isEmptyObject(PB.message) &&
        this.$store.commit("SET_PRICE", PB);
    },
    async refreshMatch() {
      const matches = { ...this.matches };
      const filtredMatches = this.savedMatches.filter(item =>
        item.teamA.name === this.matches.teamA.name &&
        item.teamB.name === this.matches.teamB.name
          ? false
          : true
      );
      this.$store.commit("SET_SAVED_MATCHES", filtredMatches);
      const teamA = await this.$store.dispatch("PARSE_URL", {
        url: this.matches.teamA.href,
        team: "teamA"
      });
      const teamB = await this.$store.dispatch("PARSE_URL", {
        url: this.matches.teamB.href,
        team: "teamB"
      });
      matches.teamA = teamA;
      matches.teamB = teamB;
      filtredMatches.push({ ...matches });
      this.$store.commit("SET_SAVED_MATCHES", filtredMatches);
      this.$store.dispatch("GET_SAVED_COLOR");
      this.CheckPriceByTeam(teamA, teamB);
    },
    async refreshPrice() {
      const matches = { ...this.matches };
      const { data } = await this.$axios.get(`/tm`);
      // console.log(`data`, data);
      data.map(item => {
        item.soccerway.toLowerCase() === matches.teamA.name.toLowerCase()
          ? this.$axios.get(`/tm/update/${item._id}`)
          : item.soccerway.toLowerCase() === matches.teamB.name.toLowerCase() &&
            this.$axios.get(`/tm/update/${item._id}`);
      });
      this.$store.dispatch("GET_SERVER_PRICE");
    }
  },
  computed: {
    matches() {
      return this.$store.getters.matches;
    },
    savedMatches() {
      return this.$store.getters.savedMatches;
    },
    price() {
      return this.$store.getters.price;
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang='sass'></style>