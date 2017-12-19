<template>
  <div class="login">
    <form class="container"  method="post">
      <p class="title">Welcome</p>
      <div class="input-group">
          <input id="account" class="input-style" type="text" name="account"
               :class="{'alert' : account_alert }"
               v-model.trim="account" placeholder="">
          <label for="account" class="input-label" :class="{'active' : account}">帐号</label>
          <div class="input-alert-style"
               :class="{'active' : account_alert }">
               请输入正确帐号
          </div>
      </div>
      <div class="input-group">
        <input id="password" class="input-style " type="password" name="password"
              :class="{'alert' : password_alert }"
              v-model.trim="password" placeholder="">
        <label for="password" class="input-label" :class="{'active' : password }" >密码</label>
        <div class="input-alert-style "
             :class="{'active' : password_alert }">
             请输入正确密码
        </div>
      </div>
      <div class="input-group text-right">
        <button class="Btn" @click.prevent="submit()">登录</button>
      </div>
    </form>
  </div>
</template>

<script>
// import Vue from 'vue'
// import axios from 'axios'
// import VueAxios from 'vue-axios'
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      account: '',
      password: '',
      account_alert: false,
      password_alert: false,
    };
  },
  computed: {
    ...mapGetters(['LoginError']),
  },
  methods: {
    ...mapActions(['login', 'checkLogin']),
    async submit() {
      this.account_alert = this.account.length <= 0;
      this.password_alert = this.password.length <= 0;
      if (!this.account_alert && !this.password_alert) {
        const account = this.account;
        const password = this.password;
        const res = await this.login({ account, password });
        if (res.data.status === 0) {
          // 跳轉
          this.$router.replace('/');
        } else {
          this.account_alert = true;
          this.password_alert = true;
        }
        if (this.LoginError) {
          this.account_alert = true;
          this.password_alert = true;
        }
      }
    },
  },
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="sass" scoped>
  .container
    width: 40%
    margin: 50px auto
    padding: 30px 30px 30px
    border-radius: 4px
    min-width: 320px
    max-width: 410px
    box-sizing: border-box
    transition: .4s
    box-shadow: 0px 0px 5px 0 rgba(81, 189, 191, 0.5)
  .title
    font-size: 2.4em
    font-weight: 100
    color: #4c6263
    margin-bottom: 36px
  .login
    position: fixed
    top: 0px
    left: 0px
    right: 0px
    bottom: 0px
    background: #50a3a2;
    background: linear-gradient(to bottom right, #dbe6c6 0%, #50dde4 100%);
  .Btn
    padding: 6px 24px
    font-size: 1em

</style>
