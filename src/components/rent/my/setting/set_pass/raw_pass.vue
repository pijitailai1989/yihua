<template>
  <yd-layout class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'密码修改'" title="密码修改" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span class="spanLeft" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
      </yd-navbar>
    </div>

    <div class="pass_raw">
        <ul>
            <li>
                <span class="font24 a">为了保障你的数据安全，修改密码前请填写原密码</span>
            </li>
            <li>
                <p class="font600 font30">原密码</p>
                <span>
                    <input type="password" placeholder="请输入" v-model="registerData.oldPass" maxlength="12">
                </span>
                <a @click="turnTo('/forget')" class="font24">忘记密码</a>
            </li>
            <li>
               <div>
                   <p class="font600 font30 qu" >设置新密码</p>
                   <div>
                      <yd-cell-item>
                         <yd-input slot="right" type="password" v-model="registerData.newPass1" placeholder="请输入密码" maxlength="12"></yd-input>
                      </yd-cell-item>
                   </div>
               </div>
               <div>
                   <p class="font600 font30 qu" >确认新密码</p>
                   <div>
                      <yd-cell-item>
                         <yd-input slot="right" type="password" v-model="registerData.newPass2" placeholder="请输入密码" maxlength="12"></yd-input>
                      </yd-cell-item>
                   </div>
               </div>
            </li>
            <li>
               <button class="font30 font600" @click="bt_pass" :style="{background:mainColor}">确 定</button>
            </li>
        </ul>
    </div>

  </yd-layout>
</template>
<script>
  import Vue from 'vue';
  import fn from '@/assets/js/product'
  import qs from 'qs'
  import {Input} from 'vue-ydui/dist/lib.rem/input';
  import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog';

Vue.prototype.$dialog = {
    confirm: Confirm,
    alert: Alert,
    toast: Toast,
    notify: Notify,
    loading: Loading,
};

  Vue.component(Input.name, Input);

  export default {
    data() {
      return {
        mainColor: "",
        input2:'',
        organInfo:'',
        userInfo:'',
        userId:'',
        getkey:'',
        regPass: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/,
        registerData: {
          oldPass:'',
          newPass1:'',
          newPass2:'',
        }
      }
    },
    methods: {
      turnTo(url) {
        this.$router.push(url)
      },
      back(){
          history.back()
      },
      bt_pass(){

        if (this.registerData.oldPass == "") {
          return this.$dialog.alert({
            "mes": "请输入原密码！"
          });
        }else if(this.registerData.newPass1 == ""){
          return this.$dialog.alert({
            "mes": "请输入新密码！"
          });
        }else if(this.registerData.newPass1!=this.registerData.newPass2){
          return this.$dialog.alert({
            "mes": "两次输入新密码不一样！"
          });
        }else if (!this.regPass.test(this.registerData.oldPass)) {
          return this.$dialog.alert({
            "mes": "原密码不正确！"
          });
        }else if (!this.regPass.test(this.registerData.newPass1)) {
          return this.$dialog.alert({
            "mes": "新密码要求的长度是6~12位！"
          });
        }



      var data={userId: this.userId, password: this.registerData.oldPass, newPassword: this.registerData.newPass1, token: this.getkey}
       this.xhr.post(`${this.subUrl.user}/user/updatePassword`, qs.stringify(data)).then((res) => {
         console.log(res)
          if (res.data.code == 1) {
             this.$dialog.alert({mes: '密码修改，请重新登录！'});
             this.logout();
          }else if(res.data.code == -1){
            this.$dialog.alert({mes: res.data.msg});
          }
        this.registerData.oldPass=''
        this.registerData.newPass1=''
        this.registerData.newPass2=''
        })

      },
      logout(){

        this.xhr.get(`${this.subUrl.logout}/user/logout?token=`+this.getkey).then((res) => {
        console.log(res)

        if(res.data.code==1){
          this.$router.push('/login')
          localStorage.clear();
        }

        })
      }

    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = localStorage.getItem('mainColor');
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      this.userId = this.userInfo.guid;
    }
  }
</script>
<style scoped>
  .layout_my .header:after {
    display: none;

  }
  .layout_my{
background:#E1F2F3;
  }

  .layout_my .blue_box {
    height: 0.88rem;
    background: #0093D2;
    background-size: 100% 100%;
  }

  .pass_raw,ul{width:100%;}
  .pass_raw ul li{padding:.2rem .2rem;}
  .font24.a{color:#A6AAAA;}
  .pass_raw ul li:nth-child(2){background:white;display:flex;flex-direction:row;align-items:center;margin-bottom:.2rem;}
  .pass_raw ul li:nth-child(2) p{width:1.6rem;height:.8rem;text-align:right;line-height:.8rem;color:#6D6D6D;}
  .pass_raw input{width:100%;border:none;}
  .pass_raw ul li:nth-child(2) span{padding:.1rem .1rem;margin-left:0.1rem;width:1.4rem;height:.8rem;border:1px solid #F6F6F6;display:flex;flex-direction:row;
  align-items:center;flex:1;border-radius:.1rem;}
  .pass_raw ul li:nth-child(2) a{width:1.6rem;height:.8rem;text-align:center;color:#4AADDC;line-height: .8rem;}

  .pass_raw ul li:nth-child(3){background:white;}
  .yd-cell-item{width:100%;}
  .pass_raw ul li:nth-child(3)>div{display:flex;flex-direction:row;align-items:center;width:100%;margin:.1rem 0;}
  .pass_raw ul li:nth-child(3)>div>div{flex:1;height:.8rem;border:1px solid #F6F6F6;border-radius:.1rem;display:flex;
  flex-direction:row;align-items:center;padding:.1rem .1rem;margin-left:0.1rem;}
  .pass_raw ul li:nth-child(3) .qu{width:1.6rem;height:.8rem;text-align:right;line-height:.8rem;color:#6D6D6D;}

  .pass_raw ul li:nth-child(4){width:100%;margin-top:3rem;height:.8rem;padding:0 .6rem;}
  .pass_raw ul li:nth-child(4) button{border:none;width:100%;height:100%;color:white;border-radius:.1rem;}


</style>
