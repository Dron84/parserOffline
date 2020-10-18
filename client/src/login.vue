<template>
  <div class="container centrize h100">
    <div class="forms">
      <div class="form-group">
        <label>Email:</label>
        <input
          type="email"
          class="form-control"
          placeholder="Email"
          v-model="email"
          @keyup.enter="loginin"
        />
      </div>
      <div class="form-group">
        <label>Пароль:</label>
        <input
          type="password"
          class="form-control"
          placeholder="Пароль"
          v-model="pass"
          @keyup.enter="loginin"
        />
      </div>

      <div class="form-group centrize" style="margin-top: 20px !important; ">
        <button type="submit" class="btn btn-primary" @click="loginin">Войти</button>
      </div>
      <p class="centrize m40" v-if="msg !== ''">{{ msg }}</p>
    </div>
  </div>
</template>
<script>
import base64 from "base-64";

export default {
  name: "",
  data: () => ({
    email: "",
    pass: "",
    msg: "",
  }),
  methods: {
    async loginin() {
      const { data } = await this.$axios.post("login", {
        email: this.email.trim().toLowerCase(),
        password: this.passBase,
      });
      if (data.message === undefined) {
        // console.log(`data`,data)
        localStorage.setItem('user_id',data.id)
        this.$cookie.set("token", data.token, 14);
        location.reload();
      } else {
        this.msg = data.message;
        setTimeout(() => {
          this.msg = "";
        }, 4000);
      }
    },
  },
  computed: {
    passBase() {
      return base64.encode(this.pass);
    },
  },
};
</script>
<style lang="sass">
.h100
  height: 100vh
.m40
  margin: 40px
.centrize
  display: flex
  justify-content: center
  align-items: center
  .forms
    width: 300px
</style>