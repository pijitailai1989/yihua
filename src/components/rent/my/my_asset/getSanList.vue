<template>
  <div class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'收款账户'" title="收款账户" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span class="spanLeft" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
         </span>
         <span class="spanRight" slot="right" @click="addshow" style="color:white;font-size:.65rem;">+</span>
      </yd-navbar>
    </div>

  <div class="sanList">
      <ul v-show="item.type==1" v-for="(item,index) in sanList" :key="index" :style="{background:item.type==1?'#3AAB35':''}">
          <li>
              <span><img src="../../../../assets/images/rent/my/wei1.png" alt=""></span>
              <p>微信支付</p>
          </li>
          <li>
              <span>微信帐号：{{item.account}}</span>
              <p @click="delSan(item.guid,index)">解绑帐号</p>
              <p @click="setDefaultSan(item.guid)">{{item.status==1?'默认帐号':'设为默认'}}</p>
          </li>
      </ul>
  </div>

  <div class="addSan" v-show="sanShow" @click="toggle">
       <ul class="font30">
         <li @click="turnTo('/my/my_asset/addSan#wecaht')"><span><img src="../../../../assets/images/rent/my/3jiao.png" alt=""></span>微信帐号</li>
         <li @click="turnTo('/my/my_asset/addSan#bank')">银行卡</li>
       </ul>
  </div>

  </div>
</template>
<script>
  import Vue from 'vue';
  import fn from '@/assets/js/product'
  import qs from 'qs'
import {Radio, RadioGroup} from 'vue-ydui/dist/lib.rem/radio';
import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog';
/* 使用px：import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.px/dialog'; */

Vue.prototype.$dialog = {
    confirm: Confirm,
    alert: Alert,
    toast: Toast,
    notify: Notify,
    loading: Loading,
};

Vue.component(Radio.name, Radio);
Vue.component(RadioGroup.name, RadioGroup);
  export default {
    data() {
      return {
        mainColor: "",
        num:0,
        num1:0,
        userInfo:'',
        organInfo:'',
        sanList:[],
        sanShow:false,
        organAccount:'',
        enterprise:false
        
      }
    },
    computed:{

    },
    methods: {
      toggle(){
        this.sanShow=false
      },
      turnTo(url) {
        this.$router.push(url)
        this.sanShow=false
      },
      back(){
        this.$router.go(-1)
      },
      getSanList(value){

            this.xhr.post(`${this.subUrl.user}/asset/getSanList?token=`+this.getkey+'&userId='+value).then(res=>{
              if (res.data.code == 1) {
                if(res.data.data.length!=0){
                  res.data.data.forEach(element => {
                    let first=element.account.slice(0,1)
                    let after=element.account.substr(-3,3)
                    element.account=first+'*****'+after;
                  });
                }
                this.sanList=res.data.data
                 console.log(this.sanList)

             } else if (res.data.code == '-902'){
               fn.re_login(this);
             } else {
              this.$dialog.toast({mes: res.data.msg});
             }
            })
      },
      delSan(sanID,index){
        let value='';
           if(this.enterprise==true){
             value=this.organAccount
           }else{
           value=this.userId
           }

            this.xhr.post(`${this.subUrl.user}/asset/delSan?token=`+this.getkey+'&userId='+value+'&sanId='+sanID).then(res=>{
              if (res.data.code == 1) {
                this.$dialog.toast({mes: '解绑账户成功！'});
                this.sanList.splice(index,1)
             } else if (res.data.code == '-902'){
               fn.re_login(this);
             } else {
              this.$dialog.toast({mes: res.data.msg});
             }
            })
      },
      setDefaultSan(sanID){

           let value='';
           if(this.enterprise==true){
             value=this.organAccount
           }else{
           value=this.userId
           }

            this.xhr.post(`${this.subUrl.user}/asset/setDefaultSan?token=`+this.getkey+'&userId='+value+'&sanId='+sanID).then(res=>{
              if (res.data.code == 1) {
                this.$dialog.toast({mes:'设置成功！'});
                this.getSanList(value);
             } else if (res.data.code == '-902'){
               fn.re_login(this);
             } else {
              this.$dialog.toast({mes: res.data.msg});
             }
            })
      },
      addshow(){
        this.sanShow=true;
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

      if(this.enterprise==true){
        this.getSanList(this.organAccount);
      }else{
        this.getSanList(this.userId)
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

  .sanList{width:100%;padding:.3rem .3rem;height:calc( 100vh - .88rem );overflow-y: scroll;}
  .sanList ul{width:100%;height:2.2rem;margin-bottom:.3rem;border-radius:.2rem;padding:.1rem .1rem;}
  .sanList ul li img{width:100%;height:100%}
  .sanList ul li{padding:.2rem .1rem;width:100%;}
  .sanList ul li:nth-child(1){height:60%;display:flex;flex-flow:row;align-items:center;border-bottom:1px solid #63BD5F;}
  .sanList ul li:nth-child(1)>span{width:.7rem;height:.7rem;margin-right:.3rem;}
  .sanList ul li:nth-child(1)>p{color:white;font-size:.5rem;}
  .sanList ul li:nth-child(2){height:40%;display:flex;flex-flow:row;align-items:center;}
  .sanList ul li:nth-child(2)>span{flex:1;margin-right:.3rem;color:#F0F0F0;font-size:.3rem;}
  .sanList ul li:nth-child(2)>p{padding:0.05rem .1rem;color:white;font-size:.32rem;border:1px solid white;border-radius:.1rem;margin-left:.1rem;}

  .addSan{width:100vw;height:100vh;background:rgba(0,0,0,0);position:fixed;left:0;top:0;}
  .addSan ul{width:3rem;height:1.6rem;background:white;display:flex;flex-flow:column;justify-content:center;
  align-items:center;border:1px solid #E5E5E5;border-radius:.1rem;position:absolute;right:.1rem;top:1rem;}
  .addSan ul li:nth-child(1){border-bottom:1px solid #E5E5E5;position:relative;z-index:666;}
  .addSan ul li:nth-child(1)>span{display:flex;width:.25rem;height:.25rem;position:absolute;top:-.25rem;z-index:555;right:.15rem;}
  .addSan ul li:nth-child(1)>span>img{width:100%;height:100%;}
  .addSan ul li{display:flex;justify-content:center;align-items:center;width:100%;height:.8rem;}




</style>
