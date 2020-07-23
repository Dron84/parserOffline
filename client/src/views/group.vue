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
            <h4 class="card-title">Добавление пользователей</h4>
          </div>
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr class="gridCont">
                  <th>Логин</th>
                  <th>Пароль</th>
                </tr>
              </thead>
              <tbody>
                <tr class="gridCont">
                  <td>
                    <input
                      type="text"
                      class="form-control"
                      v-model="email"
                      placeholder="Логин"
                      @change="checkForm()"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      class="form-control"
                      v-model="password"
                      placeholder="Пароль"
                      @change="checkForm()"
                    />
                  </td>
                  <td style="display: flex;align-items: center" class="onHover">
                    <span class="ico" @click="clearValues" title="Отчистить">
                      <img :src="removeImg" alt />
                    </span>
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
            <h4 class="card-title">Список</h4>
          </div>
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr class="gridContRm">
                  <th>#</th>
                  <th>Логин</th>
                  <th title="remove">R</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in filter(userList)" class="gridContRm" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td class="names">{{ item.email }}</td>
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
  name: "group",
  data: () => ({
    email: "",
    password: "",
    msg: "",
    copyImg,
    removeImg,
    refreshImg,
    userList: [],
  }),
  methods: {
    getDatas() {
      this.$axios.get(`/user`).then((res) => {
        this.userList = res.data;
      });
    },

    clearValues() {
      this.email = "";
      this.password = "";
    },

    async addItem() {
      this.$axios
        .post("/user", {
          email: this.email.trim().toLowerCase(),
          password: this.password,
        })
        .then(async (res) => {
          this.userList.push(res.data);
          this.clearValues();
          this.getDatas();
        });
    },
    async removeItem(id) {
      this.$axios.delete(`/user/${id}`).then(async (res) => {
        if (res.data !== undefined && res.data._id === id) {
          this.userList = this.userList.filter((obj) =>
            obj._id !== id ? true : false
          );
        }
        this.getDatas();
      });
    },

    checkForm() {
      if (this.email !== "" && this.password !== "") {
        return true;
      } else {
        return false;
      }
    },
    filter(arr) {
      if (this.email !== "") {
        return arr.filter((obj) =>
          obj.email.match(new RegExp(this.email, "i"))
        );
      } else {
        return arr;
      }
    },
  },
  mounted() {
    this.getDatas();
  },
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
  grid-template-columns: 60px 1fr 40px
.onHover
  cursor: pointer
.list-btn
  img
    height: 20px
.toTop
  z-index: 999999
.names
  text-align: left
</style>