<template>
  <div class="squadTable table_sort">
    <div class="captions">
      <div class="teamname">
        <a :href="teamHref" target="_blank">
          <img :src="team.img_href" alt="teamlogo" />
          <h5>{{ teamName }}</h5>
        </a>
        <span style="width: 60px;"></span>
      </div>
      <div class="listBox">
        <span class="ico" @click="listBoxShow = !listBoxShow">
          <img :src="addListImg" alt="add lineup list" />
        </span>
      </div>

      <a :href="`${teamPrice.href}`" target="_blank" v-if="teamPrice !== undefined">
        <h5
          v-if="priceOfLineup !== null && priceOfLineup !== 0"
        >Цена лайнапа: €{{ numeral(priceOfLineup).format("0.00a") }}</h5>
      </a>
      <a :href="`${teamPrice.href}`" target="_blank" v-if="teamPrice !== undefined">
        <h5>Цена команды: {{ teamPrice.total_market_value }}</h5>
      </a>
    </div>
    <addListBox :show="listBoxShow" :team="team" @hide="listBoxShow = false" />
    <div class="body">
      <div class="row head_row" :class="getGamerStatus(0)" :style="styleForRow">
        <div class="columns">#</div>
        <div class="columns">Имя</div>
        <div class="columns"></div>
        <div class="columns LU">LU</div>
        <div class="columns" v-if="blueButtons"></div>
        <div class="columns"></div>
        <div class="columns"></div>
        <div class="columns"></div>
        <div class="columns NM" v-if="NM">NM</div>
        <div class="matches">
          <div
            v-if="index < matchCount && !isEmptyObject(item.squad)"
            class="columns m12px w40"
            v-for="(item, index) in team.matches"
            :key="index"
          >{{ setMathesName(item) }}</div>
        </div>
        <div class="columns">В</div>
        <div class="columns">П</div>
        <div class="columns minute"></div>
        <div class="columns appearance"></div>
        <div class="columns lineup"></div>
        <div class="columns subsOnBench"></div>
        <div class="columns goal"></div>
        <div class="columns assist"></div>
        <div class="columns yc" v-if="cards"></div>
        <div class="columns y2c" v-if="cards"></div>
        <div class="columns rc" v-if="cards"></div>
        <div class="columns price">€</div>
        <div class="columns remove" v-if="players">R</div>
      </div>
      <div
        class="row"
        v-for="(rows, index) in team.squad"
        v-if="team.squad !== undefined"
        :key="index"
        :style="styleForRow"
        :class="{'addBorder': addBorder}"
      >
        <div class="columns fs17px">{{ rows.shirtnumber }}</div>
        <playerStatus
          :name="rows.name"
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
        <lineup_status
          class="columns LU"
          v-model="rows.LU"
          :id="rows.shirtnumber"
          :name="rows.name"
          :teamsId="id"
        />
        <lu_button
          color="blue"
          v-model="rows.blue"
          :id="rows.shirtnumber"
          :names="rows.name"
          :teamsId="id"
          :teamName="teamName"
          v-if="blueButtons"
        />
        <lu_button
          color="lightblue"
          v-model="rows.lightblue"
          :id="rows.shirtnumber"
          :names="rows.name"
          :teamsId="id"
          :teamName="teamName"
        />
        <lu_button
          color="black"
          v-model="rows.black"
          :id="rows.shirtnumber"
          :names="rows.name"
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
        <div class="matches">
          <div
            class="columns m12px"
            :class="getSquadClass(rows, index)"
            v-for="(item, index) in team.matches"
            :key="index"
            v-if="index < matchCount && !isEmptyObject(item.squad)"
          >
            <span>&nbsp;</span>
          </div>
          <!-- <newMatch
            class="columns"
            :class="getAddedSquadClass(rows, index)"
            @input="setMatchSquad(rows, index, $event)"
            :id="rows.shirtnumber"
            :name="rows.name"
            :teamsId="id"
            v-else
          />-->
        </div>
        <div class="columns">{{ rows.age }}</div>
        <div class="columns">{{ rows.position }}</div>
        <div class="columns">{{ rows["game-minutes"] }}</div>
        <div class="columns">{{ rows.appearances }}</div>
        <div class="columns">{{ rows.lineups }}</div>
        <div class="columns">{{ rows["subs-on-bench"] }}</div>

        <!--:class="{'max_goals': goal_max === rows.goals}"-->
        <div class="columns" :class="[getGoals(rows.goals) ? 'max_goals' : '']">{{ rows.goals }}</div>
        <div class="columns">{{ rows.assists }}</div>
        <div
          class="columns onHover"
          :class="{ yellowBorder: rows.yellowCardStatus }"
          @click="$emit('yellowCard', { data: !rows.yellowCardStatus, index })"
          v-if="cards"
        >{{ rows["yellow-cards"] }}</div>
        <div class="columns" v-if="cards">{{ rows["2nd-yellow-cards"] }}</div>
        <div class="columns" v-if="cards">{{ rows["red-cards"] }}</div>
        <!--:class="{'max_price': rows.price.max }"-->
        <priceSelecter
          class="columns"
          :class="[getMaxPrice(rows) ? 'max_price' : '']"
          v-model="rows.price"
          :row="rows"
          :index="index"
          :priceList="lineupPrice"
          @changePrice="$emit('changePrice', $event)"
        />

        <div class="columns" v-if="players">
          <span
            class="ico"
            style="position: relative; top: -4px;"
            @click="$emit('removePlayer', rows)"
          >
            <img :src="trashImg" alt="Удалить" style="height: 15px;" />
          </span>
        </div>
      </div>
      <div
        class="row DOP_ROWS"
        v-for="(rows, index) in team.addsquad"
        v-if="team.addsquad !== undefined"
        :key="index + rows.name"
        :style="styleForRow"
        :class="{'addBorder': addBorder}"
      >
        <div class="columns fs17px">{{ rows.shirtnumber }}</div>
        <playerStatus
          :name="rows.name"
          :class="getGamerStatus(rows)"
          @changePlayerStatus="
            $emit('changePlayerStatus', {
              data: $event,
              index,
              name: rows.name,
              addsquad: true
            })
          "
        />
        <gamerStatus
          v-model="rows.gamerStatus"
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
          color="blue"
          v-model="rows.blue"
          :id="rows.shirtnumber"
          :names="rows.name"
          :teamsId="id"
          :teamName="teamName"
          v-if="blueButtons"
        />
        <lu_button
          color="lightblue"
          v-model="rows.lightblue"
          :id="rows.shirtnumber"
          :names="rows.name"
          :teamsId="id"
          :teamName="teamName"
        />
        <lu_button
          color="black"
          v-model="rows.black"
          :id="rows.shirtnumber"
          :names="rows.name"
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
        <div class="matches">
          <div
            class="columns m12px"
            :class="getSquadClass(rows, index)"
            v-for="(item, index) in team.matches"
            :key="index"
            v-if="index < matchCount && !isEmptyObject(item.squad)"
          >
            <span>&nbsp;</span>
          </div>
        </div>
        <div class="columns">{{ rows.age }}</div>
        <div class="columns">{{ rows.position }}</div>
        <div class="columns">{{ rows["game-minutes"] }}</div>
        <div class="columns">{{ rows.appearances }}</div>
        <div class="columns">{{ rows.lineups }}</div>
        <div class="columns">{{ rows["subs-on-bench"] }}</div>

        <!--:class="{'max_goals': goal_max === rows.goals}"-->
        <div class="columns" :class="[getGoals(rows.goals) ? 'max_goals' : '']">{{ rows.goals }}</div>
        <div class="columns">{{ rows.assists }}</div>
        <div
          class="columns onHover"
          :class="{ yellowBorder: rows.yellowCardStatus }"
          @click="$emit('yellowCard', { data: !rows.yellowCardStatus, index })"
          v-if="cards"
        >{{ rows["yellow-cards"] }}</div>
        <div class="columns" v-if="cards">{{ rows["2nd-yellow-cards"] }}</div>
        <div class="columns" v-if="cards">{{ rows["red-cards"] }}</div>
        <!--:class="{'max_price': rows.price.max }"-->
        <priceSelecter
          class="columns"
          :class="[getMaxPrice(rows) ? 'max_price' : '']"
          :row="rows"
          :priceList="lineupPrice"
          @changePrice="$emit('changePrice', $event)"
        />

        <div class="columns" v-if="players">
          <span
            class="ico"
            style="position: relative; top: -4px;"
            @click="$emit('removeAddPlayer', rows)"
          >
            <img :src="trashImg" alt="Удалить" style="height: 15px;" />
          </span>
        </div>
      </div>
    </div>

    <div class="add_player" v-if="addPlayers">
      <div class="form-group flex">
        <input
          type="text"
          class="form-control"
          v-model="addPlayerURL"
          placeholder="Ссылка на игрока SoccerWay"
          @input="getPlayerData($event)"
          @keyup.enter="getPlayerData($event)"
        />
        <!-- playerLoader -->
        <transition name="fade">
          <div class="playerLoader" v-if="playerLoader">
            <preloader />
          </div>
        </transition>
        <transition name="fade">
          <select class="form-control" v-model="addPlayerMatch" v-if="playerMatches.length > 0">
            <option
              :value="index"
              v-for="(match, index) in playerMatches"
              :key="index"
            >{{ match.season }} {{ match.team }}</option>
          </select>
        </transition>
        <transition name="fade">
          <button
            class="btn btn-success"
            @click="addPlayer()"
            v-if="playerMatches.length > 0 && addPlayerMatch !== null"
          >Добавить</button>
        </transition>
      </div>
    </div>
    <div class="comments" v-if="comments">
      <textarea :value="team.comment" @change="$emit('setComment', $event.target.value)" />
    </div>
    <div class="footer">
      <span class="ico" title="Отчистить Статус игрока" @click="$emit('clearSavedStatus', id)">
        <img :src="trashImg" alt="delete" />
      </span>

      <span class="ico" title="Отчистить Цвета" @click="$emit('clearSavedColor', id)">
        <img :src="trashImg" alt="delete" />
      </span>
      <span class="ico" title="Отчистить LU" @click="$emit('clearSavedLU', id)">
        <img :src="trashImg" alt="delete" />
      </span>

      <switches caption="BB" v-model="blueButtons" />
      <switches caption="NM" v-model="NM" />

      <switches caption="Уда.И" v-model="players" title="Удалить игрока" />
      <switches caption="Доб.И" v-model="addPlayers" title="Добавить игрока" />
      <switches caption="Комм" v-model="comments" title="Комментарий" />
    </div>
  </div>
</template>

<script>
import lu_button from "./lu_button.vue";
import gamerStatus from "./gamerStatus";
import lineup_status from "./lineup_status";
import newMatch from "./newMatch";
import trashImg from "../assets/img/trash.svg";
import addListImg from "../assets/img/add_list.svg";
import numeral from "numeral";
import addListBox from "@/components/addListBox";
import switches from "@/components/switches.vue";
import preloader from "@/components/preloader";
import playerStatus from "@/components/playerStatus";
import priceSelecter from "@/components/priceSelecter";

export default {
  name: "squadTable",
  components: {
    lu_button,
    gamerStatus,
    lineup_status,
    newMatch,
    addListBox,
    switches,
    preloader,
    playerStatus,
    priceSelecter,
  },
  data: () => ({
    numeral,
    trashImg,
    addListImg,
    listBoxShow: false,
    comments: true,
    NM: false,
    players: false,
    addPlayers: false,
    addPlayerURL: "",
    addPlayerMatch: null,
    playerMatches: [],
    playerData: {},
    playerLoader: false,
    blueButtons: false,
  }),
  props: {
    id: "",
    teamName: "",
    team: null,
    teamPrice: null,
    teamHref: "",
    lineupPrice: null,
    priceOfLineup: { type: Number, default: null },
    matchCount: { type: String },
    cards: { type: Boolean, default: false },
    addBorder: { type: Boolean, default: false },
  },
  methods: {
    setMatchSquad(rows, index, val) {
      const match = { ...this.team.matches[index] };
      match.addsquad === undefined ? (match.addsquad = []) : false;
      const getNewVal = (val) =>
        val === "squad"
          ? "substitution"
          : val === "substitution"
          ? "none"
          : val === "none" && "squad";
      const find = match.addsquad.find(
        (item) => item.shirtnumber === rows.shirtnumber
      );
      !find
        ? match.addsquad.push({
            flag: rows.flag,
            name: rows.name,
            shirtnumber: rows.shirtnumber,
            squad: val,
          })
        : match.addsquad.map((item) =>
            item.shirtnumber === rows.shirtnumber
              ? (item.squad = getNewVal(item.squad))
              : 0
          );
      this.$emit("setMatchSquad", { match, index });
    },
    async getPlayerData() {
      this.playerLoader = true;
      this.playerMatches = [];
      this.playerData = {};
      this.addPlayerMatch = null;
      const reg = /int\.soccerway\.com\/players\//;
      if (reg.test(this.addPlayerURL)) {
        const { data } = await this.$store.dispatch("GET_PLAYER_DATA", {
          url: this.addPlayerURL,
        });
        this.playerData = data;
        this.playerMatches = data.matches;
        this.playerLoader = false;
      } else {
        this.playerLoader = false;
      }
    },
    addPlayer() {
      const player = {
        ...this.playerData.player,
        ...this.playerData.matches[this.addPlayerMatch],
      };
      this.addPlayerURL = "";
      this.playerMatches = [];
      this.$emit("addPlayer", player);
    },
    setMathesName(match) {
      const comp = match.teamData.competition.name;
      const date = match.teamData.date
        .match(/(\d+\/\d+)\/\d+/)[1]
        .replace("/", ".");
      return `${comp}\n${date}`;
    },
    getGamerStatus(row) {
      return ` ${row.playerStatus} `;
    },

    getSquadClass(player, matchNumber) {
      let color;
      if (this.team.matches[matchNumber].squad !== undefined) {
        const playerName = this.getName(player.name);
        this.team.matches[matchNumber].squad.forEach((item) => {
          const itemName = this.getName(item.name);
          if (playerName === itemName) {
            if (item.squad === "squad") {
              color = "roundgreen";
            } else if (item.squad === "substitution") {
              color = "roundyellow";
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
      if (this.team.matches[matchNumber].addsquad !== undefined) {
        const playerName = this.getName(player.name);
        this.team.matches[matchNumber].addsquad.forEach((item) => {
          if (item.shirtnumber === 0) {
            const itemName = this.getName(item.name);
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
    getMaxPrice(player) {
      const price = this.getNumber(
        this.getPlayerPrice(player, this.lineupPrice)
      );
      return this.price_max > 0 && price === this.price_max ? true : false;
    },
  },
  computed: {
    styleForRow() {
      const getPlayer = (player) => (player ? "40px" : "");
      const getNMBlueButtons = (NM, btn) => {
        if (NM && btn) {
          return "repeat(7, 25px)";
        } else if (NM && !btn) {
          return "repeat(6, 25px)";
        } else if (!NM && btn) {
          return "repeat(6, 25px)";
        } else {
          return "repeat(5, 25px)";
        }
      };
      const getCards = (card) => (card ? "repeat(8, 25px)" : "repeat(5, 25px)");
      const getMatches = () => this.matchCount * 40 + 3;
      console.log(
        `grid-template-columns: 25px 180px ${getNMBlueButtons(
          this.NM,
          this.blueButtons
        )} ${getMatches()}px repeat(2, 25px) 40px ${getCards(
          this.cards
        )} 65px ${getPlayer(this.players)};`
      );

      return `grid-template-columns: 25px 180px ${getNMBlueButtons(
        this.NM,
        this.blueButtons
      )} ${getMatches()}px repeat(2, 25px) 40px ${getCards(
        this.cards
      )} 65px ${getPlayer(this.players)};`;
    },
    price_max() {
      let price = [];
      if (!this.isEmptyObject(this.lineupPrice)) {
        this.lineupPrice.forEach(async (item) => {
          price.push(this.getNumber(item.price));
        });
      }
      return this.MaxOnArray(price);
    },
    goal_max() {
      let goals = [];
      if (!this.isEmptyObject(this.team.squad)) {
        this.team.squad.forEach(async (item) => {
          goals.push(item.goals);
        });
      }
      return this.MaxOnArray(goals);
    },
  },
  watched() {
    const mt = this.team.matches;
  },
};
</script>

<style lang="sass">
@import "../assets/vars"
.footer
  display: flex
  align-items: center
.none
  color: black
  background-color: transparent
.red_text
  color: $RoundRed
  text-decoration: line-through
.red_bg_white_text
  background-color: rgba($RoundRed,.5)
  color: white
.green_text
  color: $RoundGreen
.yellow_text
  color: $RoundBroun
.yellowBorder
  border: 3px solid $RoundYellow !important
  box-sizing: border-box
.w40
  width: 40px !important
.max_goals
  border: 3px solid $RoundRed !important
  box-sizing: border-box
.max_price
  border: 3px solid $RoundGreen !important
  box-sizing: border-box
.comments
  width: 100%
  textarea
    width: 100%
    height: auto
    min-height: 100px
.teamname
  display: flex
  align-items: center
  span
    margin: 0 5px
.listBox
  display: flex
  align-items: center
.squadTable
  position: relative
  display: grid
  justify-content: center
  align-content: start
  margin: 0 25px
  .captions
    display: flex
    // grid-template-columns: repeat(auto-fit, minmax(290px, 1fr))
    justify-content: space-around
    height: 40px
    align-content: center
    a
      display: flex
      flex-wrap: nowrap
      align-items: center
      h5
        font-size: 1.2em
        padding: 0
        margin: 0
      img
        height: 25px
        width: 25px
        margin: 0 10px 0 0
        position: relative
    h5
      font-size: 1.2em
      padding: 0
      margin: 0
  .body
    display: grid
    justify-content: center
    .row
      display: inline-grid
      width: auto
      height: auto
      &.addBorder
        border: 1px solid black
      .matches
        display: grid
        grid-template-columns: repeat(auto-fit, minmax(25px , 1fr))
      &:hover
        background-color: rgba($RoundLightBlue,.4) !important
      div
        border: .8px solid rgba(white,.7)
      &.NM
        color: $RoundYellow
        background-color: rgba(black,.5) !important
      &:nth-child(2n)
        background-color: rgba(#dadada,.4)
        &.red_bg_white_text
          background-color: rgba($RoundRed,.5)
          color: white
      .columns
        min-width: 25px
        width: auto
        min-height: 25px
        font-weight: 500
        height: auto
        text-align: center
        display: grid
        align-content: center
        justify-content: center
        &.name
          text-align: left
        &.flag span
          height: 15px
          transform: scale(1.2)
        &.roundblue, &.roundred, &.roundyellow, &.roundgreen, &.roundlightblue, &.roundblack
          cursor: pointer
          span
            border-radius: 50%
            width: 17px
            height: 17px
            display: block
            margin: 0 auto
          &.active:hover::after
            display: none
          &.LU:hover::after
            display: none
        &.roundred
          span
            border: 1px solid $RoundRed
            background-color: $RoundRed
        &.roundyellow
          span
            border: 1px solid $RoundYellow
            background-color: $RoundYellow
        &.roundgreen
          span
            border: 1px solid $RoundGreen
            background-color: $RoundGreen
        &.roundblue
          span
            border: 1px solid $RoundBlue
            background-color: $RoundBlue
          &:hover
            &::after
              content: ''
              border-radius: 50%
              width: 17px
              height: 17px
              display: block
              margin: 0 auto
              border: 1px solid $RoundBlue
              background-color: $RoundBlue
              opacity: .5
        &.roundlightblue
          span
            border: 1px solid $RoundLightBlue
            background-color: $RoundLightBlue
          &:hover
            &::after
              content: ''
              border-radius: 50%
              width: 17px
              height: 17px
              display: block
              margin: 0 auto
              border: 1px solid $RoundLightBlue
              background-color: $RoundLightBlue
              opacity: .5
        &.roundblack
          span
            border: 1px solid black
            background-color: black
          &:hover
            &::after
              content: ''
              border-radius: 50%
              width: 17px
              height: 17px
              display: block
              margin: 0 auto
              border: 1px solid black
              background-color: black
              opacity: .5
    .head_row
      height: auto !important
      .columns
        min-width: 25px
        width: auto
        min-height: 25px
        height: auto
        text-align: center
        display: grid
        align-content: center
        justify-content: center
        &.minute, &.appearance, &.lineup, &.goal, &.assist, &.yc, &.y2c, &.rc, &.subsOnBench
          position: relative
          &::after
            position: relative
            content: ""
            background-image: url('../assets/img/table/minute_played.png')
            background-position: center
            background-size: 15px 15px
            width: 15px
            height: 15px
        &.appearance::after
          background-image: url('../assets/img/table/appearance.png')
        &.lineup::after
          background-image: url('../assets/img/table/L.png')
        &.subsOnBench::after
          background-image: url('../assets/img/table/bench.png')
        &.goal::after
          background-image: url('../assets/img/table/G.png')
        &.assist::after
          background-image: url('../assets/img/table/AS.png')
        &.yc::after
          background-image: url('../assets/img/table/YC.png')
        &.y2c::after
          background-image: url('../assets/img/table/Y2C.png')
        &.rc::after
          background-image: url('../assets/img/table/RC.png')
        &.LU.err
          background-color: rgba($RoundRed, .5)
        &.m10px
          font-size: 10px
          font-weight: 700
        &.m12px
          font-size: 10px

.form-group.flex
  display: grid
  grid-gap: 10px
  grid-template-columns: repeat(auto-fit, minmax(290px,1fr) )
  margin: 10px 0 !important
  transition: all .3s  ease-in-out
.playerLoader
  .preloader
    img
      height: 25px
</style>
