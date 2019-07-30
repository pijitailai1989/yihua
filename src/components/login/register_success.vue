<template>
  <div class="register_success">
    <yd-navbar  height=".88rem"v-show="!userAgent.isWX" v-title="'注册'" title="注册" bgcolor="#0093d2" color="#fff">
      <router-link to="/register/chooseplatform" slot="left">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </router-link>
    </yd-navbar>
    <div class="content">
      <div class="bg_success">

      </div>
      <div class="success_title">恭喜您，注册成功！</div>
      <div class="welcome">欢迎加入智慧楼宇服务平台</div>
      <div class="to_login">
        <router-link to="/login">
          <yd-button type="primary" size="large">立即登录</yd-button>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import {NavBar, NavBarBackIcon, NavBarNextIcon} from 'vue-ydui/dist/lib.rem/navbar';
  Vue.component(NavBar.name, NavBar);
  Vue.component(NavBarBackIcon.name, NavBarBackIcon);
  Vue.component(NavBarNextIcon.name, NavBarNextIcon);
  export default {
    name: '',
    data() {
      return {}
    },
    methods: {

    }
  }
</script>
<style scoped>
.bg_success{
  height: 3.6rem;
  line-height: 0;
  margin: .15rem 0;
  background: url("../../assets/images/register/register_success.png") no-repeat center;
  background-size: 3.6rem;
}
.content{
  text-align: center;
}
.success_title{
  font-size: .34rem;
  color: #666;
  line-height: .5rem;
}
  .welcome{
     font-size: .24rem;
    color: #999;
    margin-bottom: .7rem;
  }
  .to_login{
    padding: 0 .55rem;
  }
</style>
