<template>
  <div class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'会员购买'" title="会员购买" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span class="spanLeft" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
         </span>
      </yd-navbar>
    </div>


    <div class="buying">
        <ul>
            <li @click="turnTo('/my/my_asset/bm_ConPay#'+index)" v-for="(item,index) in VipDetailList" :key="index" :style="'border-left:3px solid '+item.color">
                <div>
                     <span :style="'background:'+item.color"><img :src="item.image" alt=""></span>
                </div>
                <div>
                     <p class="font32 font600">{{item.name}}</p>
                     <span class="font24"> {{item.businessPoint}}商机点+{{item.product}}次发布产品 +{{item.purchase}}次发布采购 {{item.push}}次/月推送</span>
                </div>

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
        value1: '',
        num:0,
        userInfo:'',
        organInfo:'',
        VipDetailList:[]
      }
    },
    methods: {
      turnTo(url) {
        this.$router.push(url);
      },
      back(){
        this.$router.go(-1)
      },

      getVipDetailList(){

        this.xhr.post(`${this.subUrl.user}/asset/getVipDetailList?token=`+this.getkey).then((res) => {

          if (res.data.code == 1) {
              localStorage.setItem('VipDetailList',encodeURIComponent(JSON.stringify(res.data.data)));
              this.VipDetailList=res.data.data;
          } else if (res.data.code == '-902') {

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
      this.userId = this.userInfo.guid;
      this.getVipDetailList();
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
.buying{width:100%;padding:0 .2rem 0 0;margin-top:.2rem;}
.buying ul{width:100%;}
.buying ul li{width:100%;border:1px solid #EFEFF0;display:flex;flex-direction:row;margin-bottom:.2rem;background:white;}
.buying ul li>div:nth-child(1){flex:2;display:flex;justify-content:center;align-items:center}
.buying ul li>div:nth-child(2){flex:5;padding:.2rem 0;display:flex;flex-direction:column;}
.buying ul li>div{display:flex;flex-direction:column;}
.buying ul li>div:nth-child(1)>span{width:1rem;height:1rem;margin:.2rem;border-radius:50%;}
.buying ul li>div:nth-child(1)>span>img{width:100%;height:100%;}
.buying ul li>div:nth-child(2)>p{flex:3;display:flex;align-items:center;}
.buying ul li>div:nth-child(2)>span{flex:2;width:4.8rem;padding:0 .2rem 0 0;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
.font24{color:#B1B1B1;}
.font32{color:#454545;}

</style>
