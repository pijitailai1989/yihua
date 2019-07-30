<template>
  <div class="forget_box">
    <yd-layout>
      <yd-navbar height=".88rem" v-show="!userAgent.isWX" v-title="'忘记密码'" title="忘记密码" bgcolor="#0093d2" color="#fff">
        <span @click="back" slot="left">
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </span>
      </yd-navbar>
      <div class="content">
        <div class="forget" v-show="!isSuccess">
          <div class="form-login">
            <div class="user-name inputBox">
              <span class="login-icon"></span>
              <input class="needsclick" placeholder="请输入手机号" v-model="forgetData.mobile" maxlength="11" />
            </div>
            <div class="password inputBox">
              <span class="login-icon verify"></span>
              <input class="needsclick" placeholder="请输入验证码" maxlength="6" v-model="forgetData.code" name="code" type="text" />
              <!--<button type="button" class="mui-btn mui-btn-primary mui-btn-outlined">获取验证码</button>-->
              <yd-sendcode slot="right" class="get_code" init-str="发送验证码" v-model="start1" @click.native="sendCode1" type="warning"></yd-sendcode>
            </div>
            <div class="password inputBox">
              <span class="login-icon password"></span>
              <input class="needsclick" v-model="forgetData.password" placeholder="请输入6-12新密码" maxlength="12" type="password" />
            </div>
            <div class="password inputBox">
              <span class="login-icon password"></span>
              <input class="needsclick" v-model="forgetData.repassword" placeholder="请再次输入密码" maxlength="12" type="password" />
            </div>
            <div class="buttons">
              <!--<a size="normal" class="button button-big button-fill confirm">确定</a>-->
              <yd-button type="primary" size="large" @click.native="forgetPass">确定</yd-button>
            </div>
          </div>
        </div>
        <div class="forget_success" v-show="isSuccess">
          <div class="success"></div>
          <p style="font-size: .36rem;color: #666;font-weight:600;" align="center">恭喜密码修改成功!</p>
          <div class="toLoginOuter">
           <router-link to="/login">
             <yd-button type="primary" size="large">立即登录</yd-button>
           </router-link>
          </div>
        </div>
      </div>
    </yd-layout>
  </div>
</template>
<script>
  import Vue from 'vue';
  import qs from 'qs'
  import { Button, ButtonGroup } from 'vue-ydui/dist/lib.rem/button';
  import { SendCode } from 'vue-ydui/dist/lib.rem/sendcode';
  import { NavBar, NavBarBackIcon, NavBarNextIcon } from 'vue-ydui/dist/lib.rem/navbar';
  import { Alert, Loading, Toast } from 'vue-ydui/dist/lib.rem/dialog';
  Vue.prototype.$dialog = {
    alert: Alert,
    loading: Loading,
    toast: Toast
  };
  Vue.component(NavBar.name, NavBar);
  Vue.component(NavBarBackIcon.name, NavBarBackIcon);
  Vue.component(NavBarNextIcon.name, NavBarNextIcon);
  Vue.component(SendCode.name, SendCode);
  export default {
    name: '',
    data() {
      return {
        start1: false,
        isSuccess: false,
        reg: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
        regPhone: /^1[3578]\d{9}$/,
        forgetData: {}
      }
    },
    methods: {
      back(){
          history.back()
      },
      sendCode1() {
        var that = this;
        if (this.forgetData.mobile == "" || typeof this.forgetData.mobile == 'undefined') {
          this.$dialog.alert({ mes: "手机号不能为空" });
          return;
        } else if (!this.regPhone.test(this.forgetData.mobile)) {
          this.$dialog.alert({ mes: "手机号格式错误" });
          return;
        }
        this.xhr.post(this.subUrl.user + "/user/accountVerify", qs.stringify({
          account:this.forgetData.mobile
        })).then(function (res) {
          console.log(res);
          if (res.data.code == -903) {
            that.$dialog.alert({ mes: "账号未注册" });
          } else {
            that.$dialog.loading.open('发送中...');
            setTimeout(() => {
              that.$dialog.loading.close();
            }, 3000);
            that.xhr.post(that.subUrl.user + '/user/getVerificationCode', qs.stringify({ mobile: that.forgetData.mobile }))
              .then(function (res) {
                console.log(res.data);
                if (res.data.code == 1) {
                  that.$dialog.loading.close();
                  that.start1 = true;
                  that.$dialog.toast({
                    mes: '已发送',
                    icon: 'success',
                    timeout: 1500
                  });
                } else {
                  that.$dialog.toast({ mes: res.data.msg })
                }
              })
          }
        })

      },
      forgetPass() {
        if (this.forgetData.mobile == "" || typeof this.forgetData.mobile == 'undefined') {
          this.$dialog.alert({ mes: "手机号不能为空" });
          return;
        } else if (!this.regPhone.test(this.forgetData.mobile)) {
          this.$dialog.alert({ mes: "手机号格式错误" });
          return;
        };
        var codereg = /\d{6}/;
        var code = this.forgetData.code;
        if (code == "" || typeof code === "undefined") {
          this.$dialog.alert({ mes: "验证码不能为空" });
          return;
        } else if (!codereg.test(code)) {
          this.$dialog.alert({ mes: "验证码格式错误" });
          return;
        };
        var password = this.forgetData.password || "";
        if (password == "") {
          return this.$dialog.alert({ mes: "密码不能为空" });
        } else if (!this.reg.test(password)) {
          return this.$dialog.alert({ mes: "密码为6-12位数字和字母组合" });
        }
        var re_password = this.forgetData.repassword || "";
        if (re_password == "") {
          return this.$dialog.alert({ mes: "确认密码不能为空" });
        } else if (!this.reg.test(re_password)) {
          return this.$dialog.alert({ mes: "密码为6-12位数字和字母组合" });
        } else if (password != re_password) {
          return this.$dialog.alert({ mes: "确认密码不一致" });
        };
        var data = {
          account: this.forgetData.mobile,
          verificationCode: this.forgetData.code,
          newPassword: this.forgetData.password,
        };
        this.xhr.post(this.subUrl.user + '/user/resetPassword', qs.stringify(data)).then(res => {
          if (res.data.code == 1) {
            this.isSuccess = true;
          } else {
            return this.$dialog.alert({ mes: res.data.msg })
          }

        })
      }
    }
  }
</script>
<style scoped>
  .form-login {
    padding: 0 0.64rem 0.88rem;
  }

  .form-login>.inputBox {
    display: flex;
    height: 1rem;
    border-bottom: 1px solid #ddd;
    text-align: left;
    align-items: center;
  }

  .form-login>.inputBox input {
    border: none;
    margin: 0;
    outline: none;
    box-shadow: none;
    flex: 1;
    width: 100%;
    padding: 0;
    background: none;
  }

  /*输入框旁边的图标*/

  .get_code {
    border-radius: .1rem;
    height: .64rem;
    color: #0093d2;
    border: 1px solid #0093d2;
    background: #fff;
  }

  .login-icon {
    display: inline-block;
    vertical-align: middle;
    width: .6rem;
    height: .6rem;
    background: url("../../assets/images/login/phone.png") no-repeat 0 0;
    background-size: 100%;
    margin-left: .24rem;
    margin-right: .2rem;
  }

  .login-icon.phone {
    background-position: 0 bottom;
  }

  .login-icon.password {
    background: url("../../assets/images/login/password.png") no-repeat 0 0;
    background-size: 100%;
  }

  .login-icon.verify {
    background: url("../../assets/images/login/verify_code.png") no-repeat 0 0;
    background-size: 100%;
  }

  .buttons {
    margin-top: 1.4rem;
  }

  .confirm {
    margin-top: .64rem;
  }

  .forget {
    /*display: none;*/
  }

  .forget_success {
    /*display: none;*/
  }

  .forget_success .success {
    width: 1.66rem;
    height: 1.66rem;
    margin: 1.12rem auto .58rem;
    border-radius: 50%;
    text-align: center;
    line-height: .88rem;
    color: #0093d2;
    border: 1px solid #0093d2;
    font-size: 2.1rem;
    background: url("../../assets/images/login/right.png") no-repeat center center;
    background-size: .96rem;
  }

  .toLoginOuter {
    padding: 0 .64rem;
    padding-top: 2rem;
  }

  .toLogin {
    margin: 5rem 0 0;
    line-height: .88rem;
    width: 100%;
  }
</style>
