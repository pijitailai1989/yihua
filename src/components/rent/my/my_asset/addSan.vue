<template>
  <div class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'添加'+titleT" :title="'添加'+titleT" color="#fff" :bgcolor="mainColor" height=".88rem">
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
                <p class="font600 font30">账户密码</p>
                <span>
                    <input type="password" @blur="passBlur" placeholder="请输入" v-model="select.password" maxlength="12">
                </span>
            </li>
            <li>
                   <p class="font600 font30 qu" >{{titleT}}</p>
                   <span>
                    <input type="text" placeholder="请输入" v-model="select.account" maxlength="12">
                  </span>
            </li>
            <li>
                   <p class="font600 font30 qu" >账户名称</p>
                   <span>
                    <input type="text" placeholder="请输入" v-model="select.accountName" maxlength="12">
                  </span>
            </li>
            <li>
                <span @click="toggle()" v-show="select.show1"><img src="../../../../assets/images/rent/my/select.png" alt=""></span>
                <span @click="toggle()" v-show="!select.show1"><img src="../../../../assets/images/rent/my/select_active.png" alt=""></span>
                <p class="font30">设为默认账户</p>
            </li>
            <li>
               <button class="font30 font600" @click="addSan" :style="{background:mainColor}">确定</button>
            </li>
        </ul>
    </div>


  </div>
</template>
<script>
  import Vue from 'vue';
  import fn from '@/assets/js/product'
  import qs from 'qs'
  import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog';
/* 使用px：import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.px/dialog'; */

Vue.prototype.$dialog = {
    confirm: Confirm,
    alert: Alert,
    toast: Toast,
    notify: Notify,
    loading: Loading,
};
  export default {
    data() {
      return {
        mainColor: "",
        num:0,
        num1:0,
        userInfo:'',
        organInfo:'',
        titleT:'',
        radio2:'',
        select:{
          show1:true,
          password:'',
          account:'',
          accountName:'',
          type:1
        },
        organAccount:'',
        enterprise:false
      }
    },
    computed:{

    },
    methods: {
      toggle(){
        this.select.show1=!this.select.show1
      },
      turnTo(url) {
        this.$router.push(url)
        this.sanShow=false
      },
      back(){
        this.$router.go(-1)
      },
      addSan(){

           let value='';
           if(this.enterprise==true){
             value=this.organAccount
           }else{
           value=this.userId
           }

           var data = {
             userId: value,
             token: this.getkey,
             isDefault:this.select.show1?0:1,
             password:this.select.password,
             account:this.select.account,
             accountName:this.select.accountName,
             type:this.select.type
             };
            this.xhr.post(`${this.subUrl.user}/asset/addSan`, qs.stringify(data)).then(res=>{
              if (res.data.code == 1) {

                this.$dialog.toast({mes: '提交成功！'});
                this.$router.go(-1)

             } else if (res.data.code == '-902'){
               fn.re_login(this);
             } else {
              this.$dialog.toast({mes: res.data.msg});
             }
            })
      },
      passBlur(){

        var data = {token: this.getkey,password:this.select.password};

        this.xhr.post(`${this.subUrl.user}/asset/validatePassword`, qs.stringify(data)).then(res=>{
              if (res.data.code == 1) {

                this.$dialog.toast({mes: '密码正确！'});

             } else if (res.data.code == '-902'){
               fn.re_login(this);
             } else {
              this.$dialog.toast({mes: res.data.msg});
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
      this.organAccount = this.organInfo.organAccount;
      this.enterprise =  JSON.parse(decodeURIComponent(localStorage.getItem('enterprise')));


      if(this.$route.hash=='#wecaht'){
        this.titleT='微信帐户'
        this.select.type=1
      }else if(this.$route.hash=='#bank'){
        this.titleT='银行账户'
        this.select.type=3
      }


    },
    beforeUpdate(){


    }
  }
</script>
<style scoped>
  .layout_my .header:after {
    display: none;

  }
  .layout_my{
     background: #F7F7F9;
     width:100mv;
     height:100vh;
  }

  .layout_my .blue_box {
    height: 0.88rem;
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
  .pass_raw ul li:nth-child(2) a{width:1.6rem;height:.8rem;text-align:center;color:#4AADDC;}

  .pass_raw ul li:nth-child(3){background:white;display:flex;flex-direction:row;align-items:center;border-bottom:1px solid #F6F6F6;}
  .pass_raw ul li:nth-child(3) p{width:1.6rem;height:.8rem;text-align:right;line-height:.8rem;color:#6D6D6D;}
  .pass_raw input{width:100%;border:none;}
  .pass_raw ul li:nth-child(3) span{padding:.1rem .1rem;margin-left:0.1rem;width:1.4rem;height:.8rem;border:1px solid #F6F6F6;display:flex;flex-direction:row;
  align-items:center;flex:1;border-radius:.1rem;}
  .pass_raw ul li:nth-child(3) a{width:1.6rem;height:.8rem;text-align:center;color:#4AADDC;}
  .pass_raw ul li:nth-child(4){background:white;display:flex;flex-direction:row;align-items:center;margin-bottom:.2rem;}
  .pass_raw ul li:nth-child(4) p{width:1.6rem;height:.8rem;text-align:right;line-height:.8rem;color:#6D6D6D;}
  .pass_raw input{width:100%;border:none;}
  .pass_raw ul li:nth-child(4) span{padding:.1rem .1rem;margin-left:0.1rem;width:1.4rem;height:.8rem;border:1px solid #F6F6F6;display:flex;flex-direction:row;
  align-items:center;flex:1;border-radius:.1rem;}
  .pass_raw ul li:nth-child(4) a{width:1.6rem;height:.8rem;text-align:center;color:#4AADDC;}

  .pass_raw ul li:nth-child(5){background:white;display:flex;flex-direction:row;align-items:center;margin-bottom:.2rem;height:1rem;width:100%;}
  .pass_raw ul li:nth-child(5)>span{margin-left:.4rem;margin-right:.4rem;width:.5rem;height:.5rem;}
  .pass_raw ul li:nth-child(5)>span>img{width:100%;height:100%;}

  .pass_raw ul li:nth-child(6){width:100%;margin-top:3rem;height:.8rem;padding:0 .6rem;}
  .pass_raw ul li:nth-child(6) button{border:none;width:100%;height:100%;color:white;border-radius:.1rem;}

</style>
