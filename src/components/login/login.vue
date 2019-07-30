<template>
  <div class="template" v-title="'登录'">
    <yd-layout>
      <div class="login-bg"></div>
      <div class="form-login">
        <div class="user-name inputBox">
          <p class="tip" id="phone_tip" v-show="phoneFlag">{{phoneText}}</p>
          <span class="login-icon"></span>
          <input placeholder="请输入手机号" v-model="loginData.userName" @blur="phoneBlur()"
                 id="phone" name="phone" maxlength="11"/>
        </div>
        <div class="password inputBox">
          <p class="tip" id="password_tip" v-show="passwordFlag">{{passwordText}}</p>
          <span class="login-icon phone password"></span>
          <!---->
            <input placeholder="请输入密码" id="password" v-on:blur="passwordBlur()" v-model="loginData.password"
                   @keyup.enter="MyLogin"
                   class="mui-input-password" name="password" maxlength="20" type="password"/>
        </div>
        <div class="password inputBox" v-show="showCode" v-on:blur="codeBlur()">
          <p class="tip" id="code_tip" v-show="codeFlag">{{codeText}}</p>
          <span class="login-icon invite"></span>
          <input placeholder="请输入邀请码" id="code" v-model="loginData.code"  maxlength="20"
                 type="text"/>
        </div>
        <div class="ProtocolBox">
          <span>登录即代表同意<a href="javascript:;">平台服务协议</a></span>
        </div>
        <div class="buttons">
          <yd-button size="large" class="button-login" @click.native="MyLogin()" type="primary">登录</yd-button>
        </div>
        <div class="forget_register">
          <a @click="turnTo('/forget')">忘记密码？</a>
          <a href="javascript:;" class="center_line"></a>
          <a @click="turnTo('/register/chooseplatform')">立即注册 》</a>
        </div>
      </div>
    </yd-layout>
  </div>

</template>
<script>
  import Vue from 'vue';
  import qs from 'qs';
  import axios from 'axios'
  import {Button, ButtonGroup} from 'vue-ydui/dist/lib.rem/button';
  import {Confirm, Alert, Toast, Notify, Loading} from 'vue-ydui/dist/lib.rem/dialog';
  import fn from '../../assets/js/product'
  import {loginIm} from '../../lib/utils'


  Vue.prototype.$dialog = {
    confirm: Confirm,
    alert: Alert,
    toast: Toast,
    notify: Notify,
    loading: Loading,
  };

  Vue.component(Button.name, Button);
  Vue.component(ButtonGroup.name, ButtonGroup);
  export default {
    name: '',
    data() {
      return {
        reg: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
        regPhone:/^1[3578]\d{9}$/,
        loginData: {
          userName: '',
          password: '',
          code: '',
          isLogin: false,
        },
        SDK:{},
        isregister: false,
        showCode: false,
        passwordText: "密码不能为空",
        passwordFlag: false,
        phoneText: "手机号不能为空",
        phoneFlag: false,
        codeFlag: false,
        codeText: '邀请码不能为空',
      }
    },
    methods: {
      turnTo(url) {
        this.$router.push(url);
      },
      MyLogin() {
        var that = this;
        var pass = this.loginData.password;
        if (this.loginData.userName == "") {
          this.phoneFlag = true;
          this.$dialog.alert({mes: '手机号不能为空'});
          return;
        }else if(!this.regPhone.test(this.loginData.userName)){
          this.phoneFlag = true;
          this.$dialog.alert({mes: '手机号格式错误'});
          return;
        }else{
          this.phoneFlag = false;
        }
        if (pass == ""){
          this.passwordFlag = true;
          this.$dialog.alert({mes: '密码不能为空'});
          return;
        }else if (!this.reg.test(pass)) {
          this.passwordFlag = true;
          this.$dialog.alert({mes: '密码格式错误'});
          this.passwordText = "密码格式错误";
          return;
        }else{
          this.passwordFlag = false;
        }
        console.log(this.showCode,this.code)
        if (this.showCode) {
          if (this.loginData.code == "") {
            this.codeFlag = true;
            this.codeText = "邀请码不能为空";
            return;
          }else{
            this.codeFlag = true;
          }
        }
        if (navigator.userAgent.indexOf("Windows") > 0) {
          this.loginData.source = 1;
        } else if (navigator.userAgent.indexOf("iPhone") > 0) {
          this.loginData.source = 3;
        } else if (navigator.userAgent.indexOf("Android") > 0) {
          this.loginData.source = 2;
        } else {
          this.loginData.source = 4;
        }
        var data = {
          account: this.loginData.userName,
          inviteCode: this.loginData.code,
          password: this.loginData.password,
          // source: this.loginData.source,
          source:4
        }
        // that.$dialog.alert({mes:JSON.stringify(data)});
        that.$dialog.loading.open('登录中');
        setTimeout(() => {
          that.$dialog.loading.close();
        }, 2000);
        this.xhr.post(this.subUrl.user+"/user/login", qs.stringify(data)).then(function (res) {
          console.log(res);
          that.$dialog.loading.close();
          if (res.data.code == 1) {
            localStorage.setItem('userInfo',encodeURIComponent(JSON.stringify(res.data.data.userInfo)));
            localStorage.setItem('organInfo',encodeURIComponent(JSON.stringify(res.data.data.organInfo)));
            localStorage.setItem('to',encodeURIComponent(res.data.data.token));
            fn.setIng(res.data.data.token);
            var a = res.data.data.userInfo.organType;
            var b = res.data.data.userInfo.admin?1:0;
            localStorage.setItem('organType',a);
            localStorage.setItem('isManger',b);
            localStorage.setItem('user_Id',res.data.data.userInfo.guid);
            localStorage.setItem('mainColor',that.$color[res.data.data.userInfo.organType])
            var c = 3;
            var url = `/index/${a}/${b}/${c}/rent/my`;
            that.$router.push(url);
//            loginIm()
            that.isLogin = true;
          } else {
            that.$dialog.alert({mes: res.data.msg,title:"登录失败"});
          }
        }).catch(function(e){
          that.$dialog.toast({mes:JSON.stringify(e)});
          window.alert(JSON.stringify(e));
        })
      },
      phoneBlur() {
        var that = this;
        if (this.loginData.userName == "") {
          if (this.loginData.userName == "") {
            this.phoneFlag = true;
            this.phoneText = "手机号不能为空";
            return;
          }
        }else if(!this.regPhone.test(this.loginData.userName)){
          this.phoneFlag = true;
          this.phoneText = "手机号格式错误";
          return;
        }else{
          this.phoneFlag = false;
        }
        this.xhr.post(this.subUrl.user+'/user/accountVerify', qs.stringify({account: this.loginData.userName})).then(function (res) {
          console.log(res.data);
          if (res.data.code == '-903') {
            that.phoneFlag = true;
            that.phoneText = res.data.msg;
            that.isregister = false;
          } else if (res.data.code == '-1') {
            that.showCode = true;
            that.isregister = true;
            that.phoneFlag = false;
          } else if (res.data.code == '1') {
            that.showCode = false;
            that.isregister = true;
            that.phoneFlag = false;
          }
        })
      },
      passwordBlur() {
        var pass = this.loginData.password;
        if (this.loginData.userName == "") {
          this.phoneFlag = true;
          this.phoneText = "手机号不能为空"
        }else if(!this.regPhone.test(this.loginData.userName)){
          this.phoneFlag = true;
          this.phoneText = "手机号格式错误"
        }else if(!this.isregister){
          this.phoneFlag = true;
          this.phoneText = "账号未注册!";
        }else{
          this.phoneFlag = false;
        }
        if (pass == "") {
          this.passwordFlag = true;
          this.passwordText = "密码不能为空"
        }else if (!this.reg.test(pass)) {
          this.passwordFlag = true;
          this.passwordText = "密码格式错误"
        }else{
          this.passwordFlag = false;
        }
      },
      codeBlur() {
        var pass = this.loginData.password;
        if (this.loginData.userName == "") {
          this.phoneFlag = true;
          this.phoneText = "手机号不能为空"
        }else if(!this.regPhone.test(this.loginData.userName)){
          this.phoneFlag = true;
          this.phoneText = "手机号格式错误"
        }else if(!this.isregister){
          this.phoneFlag = true;
          this.phoneText = "账号未注册";
        }else{
          this.phoneFlag = true;
        }
        if (pass == "") {
          this.passwordFlag = true;
          this.passwordText = "密码不能为空"
        }else if (!this.reg.test(pass)) {
          this.passwordFlag = true;
          this.passwordText = "密码格式错误"
        }else{
          this.passwordFlag = false;
        }
        if (this.showCode) {
          if (this.loginData.code == "") {
            this.codeFlag = true;
            this.codeText = "邀请码不能为空"
          }
        }
      }
    },
  }
</script>
<style scoped>
  .login-bg {
    width: 100%;
    height: 3.4rem;
    background: url("../../assets/images/login/login_bg.png") no-repeat left top;
    background-size: 100% 100%;
  }

  .login-icon {
    display: inline-block;
    vertical-align: middle;
    width: .6rem;
    height: .6rem;
    background: url("../../assets/images/login/phone.png") no-repeat 0 0;
    background-size: 100%;
    margin-left: .2rem;
    margin-right: .13rem;
  }

  .login-icon.phone {
    background-position: 0 bottom;
  }

  .login-icon.password {
    background: url("../../assets/images/login/password.png") no-repeat 0 0;
    background-size: 100%;
  }

  .login-icon.invite {
    background: url("../../assets/images/login/invite_code.png") no-repeat 0 0;
    background-size: 100%;
  }

  /*平台协议*/
  .ProtocolBox {
    font-size: .22rem;
    margin: .4rem .15rem 1.3rem;
    overflow: hidden;
  }

  .ProtocolBox a {
    color: #01b4ff;
    text-decoration: underline;
  }

  .form-login {
    padding: 0 .64rem .88rem;
  }

  .button-login {
    margin: 0;
    background: #50baf6;
  }

  .button-login.yd-btn-primary:active {
    background-color: #50b9f1;
  }

  .form-login > .inputBox {
    display: flex;
    height: 1rem;
    border-bottom: 1px solid #ddd;
    text-align: left;
    align-items: center;
    position: relative;
    box-sizing: border-box;
    padding-top: .34rem;
    width: 100%;
  }

  .form-login > .inputBox input {
    border: none;
    margin: 0;
    outline: none;
    box-shadow: none;
    flex: 1;
    height:100%;
    width: 100%;
    padding: 0;
    background: #e7f5f5;
    height: 100%;
  }

  /*忘记密码*/
  .forget_register {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #4f4f4f;
    margin-top: .68rem;
    font-size: .28rem;

  }

  .forget_register a {
    line-height: 1;
    padding: 0;
    display: inline-block;
    height: .32rem;
  }

  .forget_register a:first-child {
    text-decoration: underline;
  }

  .forget_register .center_line {
    display: inline-block;
    border-right: 1px solid #ddd;
    margin: 0 .44rem;
  }

  .tip {
    position: absolute;
    left: 0;
    top: 0;
    color: #f00;
    line-height: .34rem;
    padding-left: 0.3rem;
    font-size: .24rem;
  }

  .tip:before {
    display: inline-block;
    content: "!";
    width: .22rem;
    height: .22rem;
    color: #fff;
    background: #f00;
    line-height: .22rem;
    text-align: center;
    border-radius: 50%;
    margin-right: .08rem;
  }
</style>
