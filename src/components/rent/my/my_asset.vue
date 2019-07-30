<template>
  <yd-layout class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" :title="titleT" color="#fff" :bgcolor="mainColor" height=".88rem">
         <router-link :to="'/index/'+local.a+'/'+local.b+'/3/rent/my'" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </router-link>
      </yd-navbar>
    </div>

    <div v-if="enterprise" class="jifen" :style="{background:mainColor}">
       <div class="opa"></div>
       <div style="padding:.1rem 0 .5rem 0;font-size:.26rem">
         <span>商机点总计</span>
         <span style="font-size:1rem;padding:.1rem 0">{{myAsset.businessPoint + myAsset.conBusinessPoint}}</span>
         <span style="font-size:.33rem;">可兑换商机点&nbsp;{{myAsset.conBusinessPoint}}</span>
       </div>
       <div class="j_list">
                <div>
                     <p>商机点收入</p>
                     <span>{{myAsset.incomeBusinessPoint}}</span>
                </div>
                <div>
                     <p>购买商机点</p>
                     <span>{{myAsset.buyBusinessPoint}}</span>
                </div>
                <div>
                     <p>商机点消费</p>
                     <span>{{myAsset.consumeBusinessPoint}}</span>
                </div>
       </div>

    </div>
    <div v-else class="jifen" :style="{background:mainColor}">
       <div class="opa"></div>
        <ul>
           <li>
              <p class="font24">积分</p>
              <span class="text_bold">{{myAsset.integral}}</span>
           </li>
           <li>
              <p class="font24">商机点</p>
              <span class="text_bold">{{myAsset.businessPoint}}</span>
           </li>
           <li>
              <p class="font24">可兑积分</p>
              <span>{{myAsset.conIntegral }}</span>
           </li>
           <li>
              <p class="font24">可兑商机点</p>
              <span>{{myAsset.conBusinessPoint}}</span>
           </li>
           <li class="j_list">
                <div>
                     <p>商机点收入</p>
                     <span>{{myAsset.incomeBusinessPoint}}</span>
                </div>
                <div>
                     <p>购买商机点</p>
                     <span>{{myAsset.buyBusinessPoint}}</span>
                </div>
                <div>
                     <p>商机点消费</p>
                     <span>{{myAsset.consumeBusinessPoint}}</span>
                </div>
           </li>
        </ul>
    </div>


    <div class="Tab_text">
          <ul>
             <li @click="turnTo('/my/my_asset/exchange#'+myAsset.conIntegral+'#'+myAsset.conBusinessPoint)" :style="{color:mainColor}" class="font30 font800" >兑换</li>
             <li @click="turnTo('/my/my_asset/recharge#'+myAsset.businessPoint)" :style="{color:mainColor}" class="font30 font800" >充值</li>
          </ul>
    </div>

    <div class="Tab_icon">
          <ul>
              <li @click="turnTo('/my/my_asset/buy_mem')">
                 <span><img src="../../../assets/images/rent/my/b_menber.png" alt=""></span>
                 <p class="font30">会员购买</p>
              </li>
            <!--<li @click="turnTo(`/estate/serviceList/building/detail?buildingId=${userInfo.buildingId}&buildingName=${userInfo.buildingName}&isRent=true`)">-->
            <li @click="turnTo(`/my/my_asset/voc_work`)">
                 <span><img src="../../../assets/images/rent/my/y_mok.png" alt=""></span>
                 <p class="font30">业务模块</p>
              </li>
          </ul>
    </div>

    <div class="take_info">
         <yd-cell-group>

          <yd-cell-item arrow type="label" @click.native="turnTo('/my/my_asset/ExchangeLog')">
            <span class="font28 font800" slot="left">兑换记录</span>
          </yd-cell-item>
          <yd-cell-item arrow type="label" @click.native="turnTo('/my/my_asset/BuyLog')">
            <span class="font28 font800" slot="left">充值记录</span>
          </yd-cell-item>
          <yd-cell-item v-show="!enterprise" arrow type="label" @click.native="turnTo('/my/my_asset/IntegralLog')">
            <span class="font28 font800" slot="left">积分明细</span>
          </yd-cell-item>
          <yd-cell-item v-show="!enterprise" arrow type="label" @click.native="turnTo('/my/my_asset/invite_bus')">
            <span class="font28 font800" slot="left">邀请商家</span>
          </yd-cell-item>
          <yd-cell-item v-show="!enterprise" arrow type="label" @click.native="turnTo('/my/my_asset/baiShiTong')">
            <span class="font28 font800" slot="left">百事通</span>
          </yd-cell-item>
          <yd-cell-item v-show="!enterprise" arrow type="label" @click.native="turnTo('/my/my_asset/see_niche')">
            <span class="font28 font800" slot="left">查看商机</span>
          </yd-cell-item>
          <yd-cell-item v-show="!enterprise" arrow type="label" @click.native="turnTo('/my/my_asset/BpLog')">
            <span class="font28 font800" slot="left">其他消费</span>
          </yd-cell-item>
          <yd-cell-item v-show="enterprise" arrow type="label" @click.native="turnTo('/my/my_asset/BpLog#1')">
            <span class="font28 font800" slot="left">收入明细</span>
          </yd-cell-item>
          <yd-cell-item v-show="enterprise" arrow type="label" @click.native="turnTo('/my/my_asset/BpLog#2')">
            <span class="font28 font800" slot="left">消费明细</span>
          </yd-cell-item>

         </yd-cell-group>
    </div>
  </yd-layout>
</template>
<script>
  import Vue from 'vue';
  import fn from '@/assets/js/product';
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

import {CellGroup, CellItem} from 'vue-ydui/dist/lib.rem/cell';
/* 使用px：import {CellGroup, CellItem} from 'vue-ydui/dist/lib.px/cell'; */

Vue.component(CellGroup.name, CellGroup);
Vue.component(CellItem.name, CellItem);

  export default {
    data() {
      return {
        mainColor: "",
        userInfo:'',
        organInfo:'',
        myAsset:{},
        titleT:'',
        enterprise:false,
        local:{
          a:0,
          b:0,},
      }
    },
    methods: {
      turnTo(url) {
        this.$router.push(url)
      },
      back(){
          history.back()
      },
      getUserAsset(value){
        var data = {userId:value, token: this.getkey};
        this.xhr.post(`${this.subUrl.user}/asset/getUserAsset`, qs.stringify(data)).then((res) => {

          if (res.data.code == 1) {
              console.log(res)
              this.myAsset=res.data.data;
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
      },

    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = localStorage.getItem('mainColor');
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      // this.organAccount = this.organInfo.organAccount;

      this.local.b= localStorage.getItem('isManger');
      this.local.a= localStorage.getItem('organType');
       console.log(this.local.a,this.local.b)
      if(this.$route.hash=='#enterprise'){
         this.titleT='企业财富'
         this.enterprise=true
         localStorage.setItem('enterprise',encodeURIComponent(JSON.stringify(this.enterprise)));
          this.getUserAsset(this.organInfo.organAccount)
      }else{
         this.titleT='我的资产'
         this.enterprise=false
         localStorage.setItem('enterprise',encodeURIComponent(JSON.stringify(this.enterprise)));
         this.getUserAsset(this.userId)
      }
      document.title=this.titleT;
    }
  }
</script>
<style scoped>
  .layout_my .header:after {
    display: none;

  }
  .layout_my{
background:#F7F7F9;
  }

  .layout_my .blue_box {
    height: 0.88rem;
    background: #0093D2;
    background-size: 100% 100%;
  }
  .jifen{width:100%;height:4rem;color:white;padding:.1rem .4rem;position:relative;display:flex;flex-flow:column;}
  .opa{position:absolute;bottom:0;left:0;width:100%;height:1.3rem;background:rgba(255,255,255,0.1)}
  .jifen ul{width:100%;height:100%;display:flex;flex-flow:row wrap;}
  .jifen ul li{width:50%;display:flex;flex-direction:column;justify-content:center;}
  .jifen ul li.j_list{width:100%;display:flex;flex-direction:row;}
  .jifen ul li.j_list>div{flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;}
  .jifen>div:nth-child(2){display:flex;flex-flow:column;justify-content:center;align-items:center;flex:1;}
  .jifen div.j_list{width:100%;display:flex;flex-direction:row;height:1rem;}
  .jifen div.j_list>div{flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;}
  .jifen ul li .text_bold{font-size:0.6rem;color:white;}
  .font24{margin-bottom:.1rem;}
  .Tab_text{width:100%;height:.8rem;}
  .Tab_text ul{width:100%;display:flex;flex-flow:row wrap;grid-column-gap:1px;background-color:#EEEEEF;
              border-bottom:1px solid #eee;}
  .Tab_text ul li{width:50%;text-align:center;height:.8rem;line-height:.8rem;background:white;}


  .Tab_icon{width:100%;height:1.8rem;padding:.2rem .2rem .1rem;background:white;border-bottom:1px solid #eee;
           border-top:1px solid #eee;margin-top:.3rem}
  .Tab_icon ul{width:100%;height:100%;display:flex;flex-flow:row wrap;grid-column-gap:1px;background-color:#EEEEEF;}
  .Tab_icon ul li:nth-child(1){border-right:1px solid #eee;}
  .Tab_icon ul li{width:50%;color:#7D7D7D;height:100%;background:white;
  display:flex;flex-direction:column;justify-content:center;align-items:center;}
  .Tab_icon ul li span{width:.85rem;height:.85rem;margin-bottom:.1rem;}
  .Tab_icon ul li span img{width:100%;height:100%;}

  .take_info{width:100%;margin-top:.3rem;}
  .font28{color:#3E3E3E;}

  /*消息列表结束*/
</style>
