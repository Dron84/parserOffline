<template>
  <div class="container toTop">
    <div class="row">
      <div class="col-12">
        <div class="alert alert-warning alert-with-icon" data-notify="container" v-if="msg !== ''">
          <button type="button" aria-hidden="true" class="close" @click="msg = ''">×</button>
          <span data-notify="icon" class="ti-bell"></span>
          <span data-notify="message">{{ msg }}</span>
        </div>
      </div>
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Добавление Имени команды в TransferMarket</h4>
            <h5>
              <span @click="deleteTeam()" class="onHover">
                <i class="ti-share"></i>&nbsp;Удалить БД
              </span>
              &nbsp;&nbsp;&nbsp;
              <span @click="addTeam()" class="onHover">
                <i class="ti-support"></i>&nbsp;Добавить из Файла
              </span>&nbsp;&nbsp;&nbsp;
              <span @click="backUpTeam()" class="onHover">
                <i class="ti-save"></i>&nbsp;Создать Бекап
              </span>
            </h5>
          </div>
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr class="gridCont">
                  <th>Soccerway name</th>
                  <th>TM Link</th>
                </tr>
              </thead>
              <tbody>
                <tr class="gridCont">
                  <td>
                    <input
                      type="text"
                      class="form-control"
                      v-model="soccerway_name"
                      :placeholder="ph.soccerway_name"
                      @change="checkForm()"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      class="form-control"
                      v-model="parseSite_name"
                      :placeholder="ph.parseSite_name"
                      @change="checkForm()"
                    />
                  </td>
                  <td style="display: flex;align-items: center" class="onHover">
                    <i class="ti-trash" @click="clearValues" title="Отчистить"></i>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="card-footer">
            <button
              class="btn"
              :class="[!checkForm() ? 'btn-default' : 'btn-success']"
              :disabled="!checkForm()"
              @click="addItem"
            >Добавить</button>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Список Имен комманд transfermarketa</h4>
          </div>
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr class="gridContRm">
                  <th>#</th>
                  <th>Soccerway name</th>
                  <th>TM link</th>
                  <th title="refound">∑</th>
                  <th title="copy">C</th>
                  <th title="remove">R</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in filter(teamName)" class="gridContRm" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.soccerway }}</td>
                  <td>{{ item.tm_link }}</td>
                  <td>
                    <span class="list-btn onHover" title="Обновить данные" @click="refreshTM(item)">
                      <img :src="refreshImg" alt="Обновить данные" />
                    </span>
                  </td>
                  <td>
                    <span
                      class="list-btn onHover"
                      @click="copyItem(item._id)"
                      title="Копировать элемент"
                    >
                      <img :src="copyImg" alt="скопировать" />
                    </span>
                  </td>
                  <td>
                    <span
                      class="list-btn onHover"
                      @click="removeItem(item._id, index)"
                      title="Удалить элемент"
                    >
                      <img :src="removeImg" alt="удалить" />
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import copyImg from "../assets/img/copy.svg";
import removeImg from "../assets/img/trash.svg";
import refreshImg from "../assets/img/refresh.svg";
export default {
  name: "tm_Name",
  data() {
    return {
      soccerway_name: "",
      parseSite_name: "",
      teamName: [],
      msg: "",
      ph: {
        soccerway_name: "Название команды на SoccerWay",
        parseSite_name: "TransferMarket ссылка на команду"
      },
      copyImg,
      removeImg,
      refreshImg
    };
  },
  methods: {
    getDatas() {
      this.$axios.get(`/tm`).then(res => {
        this.teamName = res.data;
      });
    },
    async refreshTM(item) {
      await this.$axios.get(`/tm/update/${item._id}`);
      this.getDatas();
      await this.$store.dispatch("GET_SERVER_PRICE");
    },
    clearValues() {
      this.soccerway_name = "";
      this.parseSite_name = "";
    },
    async addTeam() {
      await this.$axios
        .get("/tm/added")
        .then(res => (this.teamName = res.data));
      this.getDatas();
      this.clearValues();
      await this.$store.dispatch("GET_SERVER_PRICE");
    },
    async deleteTeam() {
      this.$axios
        .get("/tm/delete")
        .then(async res => {
          this.teamName = [];
          this.getDatas();
          await this.$store.dispatch("GET_SERVER_PRICE");
        })
        .catch(e => {
          this.msg = "Нет данных в БД";
          this.teamName = [];
          setTimeout(_ => {
            this.msg = "";
          }, 10000);
        });
    },
    backUpTeam() {
      this.$axios.get("/tm/backup").then(res => {
        this.msg = res.data.message;
        setTimeout(_ => {
          this.msg = "";
        }, 10000);
      });
    },
    async addItem() {
      this.$axios
        .post("/tm", {
          soccerway: this.soccerway_name,
          tm_name: this.parseSite_name
        })
        .then(async res => {
          this.teamName.push(res.data);
          this.getDatas();
          await this.$store.dispatch("GET_SERVER_PRICE");
        });
    },
    async removeItem(id) {
      this.$axios.delete(`/tm/${id}`).then(async res => {
        if (res.data !== undefined && res.data._id === id) {
          this.teamName = this.teamName.filter(obj =>
            obj._id !== id ? true : false
          );
          this.getDatas();
          await this.$store.dispatch("GET_SERVER_PRICE");
        }
      });
    },
    copyItem(id) {
      const obj = this.teamName.find(obj => (obj._id === id ? true : false));
      this.soccerway_name = obj.soccerway;
      this.parseSite_name = obj.parseSite;
      window.scrollTo(0, 0);
    },
    checkForm() {
      if (this.soccerway_name !== "" && this.parseSite_name !== "") {
        return true;
      } else {
        return false;
      }
    },
    filter(arr) {
      if (this.soccerway_name !== "") {
        return arr.filter(obj =>
          obj.soccerway.match(new RegExp(this.soccerway_name, "i"))
        );
      } else {
        return arr;
      }
    }
  },
  mounted() {
    this.getDatas();
  }
};
</script>

<style scoped lang="sass">
@keyframes rotation
  0%
    transform: rotateY(0deg)
  100%
    transform: rotateY(360deg)
.gridCont
  display: grid
  grid-template-columns: repeat(2, minmax(290px ,1fr)) 40px
.gridContRm
  display: grid
  grid-template-columns: 60px repeat(2, minmax(290px ,1fr)) 40px 40px 40px
.onHover
  cursor: pointer
.list-btn
  img
    height: 20px
.toTop
  z-index: 999999
</style>