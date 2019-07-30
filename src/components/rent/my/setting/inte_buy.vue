<template>
  <yd-layout class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'购买/兑换'" title="购买/兑换" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
      </yd-navbar>
    </div>
    <div class="jifen" :class="{green:userInfo.organType == 1,orange:userInfo.organType == 2}">
        <ul>
           <li>
              <p class="font24">积分</p>
              <span class="text_bold">{{jNum}}</span>
           </li>
           <li>
              <p class="font24">商机点</p>
              <span class="text_bold">{{sNum}}</span>
           </li>
           <li>
              <p class="font24">可兑积分</p>
              <span>{{jNum}}</span>
           </li>
           <li>
              <p class="font24">可兑商机点</p>
              <span>{{sNum}}</span>
           </li>
        </ul>
    </div>

    <div class="Tab_text">
          <ul>
             <li class="font800" :class="{green:userInfo.organType == 1,orange:userInfo.organType == 2}">兑换</li>
             <li class="font800" :class="{green:userInfo.organType == 1,orange:userInfo.organType == 2}">充值</li>
          </ul>
    </div>

    <div class="Tab_icon">
          <ul>
              <li>
                 <span><img src="../../../../assets/images/rent/my/system.png" alt=""></span>
                 <p>会员购买</p>
              </li>
              <li>
                 <span><img src="../../../../assets/images/rent/my/system.png" alt=""></span>
                 <p>业务模块</p>
              </li>
          </ul>
    </div>

    <div class="take_info">
         <yd-cell-group>

          <yd-cell-item arrow type="label">
            <span class="font28 font800" @click="turnTo('/my/setting/inte_buy/ExchangeLog')" slot="left">兑换记录</span>
          </yd-cell-item>
          <yd-cell-item arrow type="label">
            <span class="font28 font800" @click="turnTo('/my/setting/inte_buy/BuyLog')" slot="left">充值记录</span>
          </yd-cell-item>
          <yd-cell-item arrow type="label">
            <span class="font28 font800" @click="turnTo('/my/setting/inte_buy/IntegralLog')" slot="left">积分明细</span>
          </yd-cell-item>
          <yd-cell-item arrow type="label">
            <span class="font28 font800" @click="turnTo('/my/setting/inte_buy/BpLog')" slot="left">商机点明细</span>
          </yd-cell-item>

         </yd-cell-group>
    </div>
  </yd-layout>
</template>
<script>
  import Vue from 'vue';
  import fn from '@/assets/js/product';
  import qs from 'qs'

import {CellGroup, CellItem} from 'vue-ydui/dist/lib.rem/cell';
/* 使用px：import {CellGroup, CellItem} from 'vue-ydui/dist/lib.px/cell'; */

Vue.component(CellGroup.name, CellGroup);
Vue.component(CellItem.name, CellItem);

  export default {
    data() {
      return {
        mainColor: "",
        jNum:1000,
        sNum:200,
        userInfo:'',
        organInfo:''
      }
    },
    methods: {
      turnTo(url) {
        this.$router.push(url)
      },
      back(){
          history.back()
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
background:#F7F7F9;
  }

  .layout_my .blue_box {
    height: 0.88rem;
    background: #0093D2;
    background-size: 100% 100%;
  }
  .jifen{width:100%;height:3rem;background:#0093D2;color:#B8D8EE;padding:.3rem .3rem;}
  .jifen.green{width:100%;height:3rem;background:#23ac3b;color:#D4EED9;padding:.3rem .3rem;}
  .jifen.orange{width:100%;height:3rem;background:#fab23e;color:#FBECD5;padding:.3rem .3rem;}

  .jifen ul{width:100%;height:100%;display:grid;grid-template-columns:1fr 1fr;}
  .jifen ul li{display:flex;flex-direction:column;justify-content:center;}
  .jifen ul li .text_bold{font-size:0.6rem;color:white;}
  .Tab_text{width:100%;height:.8rem;}
  .Tab_text ul{display:grid;grid-template-columns:1fr 1fr;grid-column-gap:1px;background-color:#EEEEEF;
              border-bottom:1px solid #eee;}
  .Tab_text ul li{text-align:center;height:.8rem;line-height:.8rem;background:white;color:#0093D2;}
  .Tab_text ul li.green{color:#23ac3b;}
  .Tab_text ul li.orange{color:#fab23e;}

  .Tab_icon{width:100%;height:2rem;padding:.2rem .2rem;background:white;border-bottom:1px solid #eee;
           border-top:1px solid #eee;margin-top:.3rem}
  .Tab_icon ul{height:100%;display:grid;grid-template-columns:1fr 1fr;grid-column-gap:1px;background-color:#EEEEEF;
              }

  .Tab_icon ul li{color:#666;height:100%;background:white;
  display:flex;flex-direction:column;justify-content:center;align-items:center;}
  .Tab_icon ul li span{width:.7rem;height:.7rem;margin-bottom:.2rem;}
  .Tab_icon ul li span img{width:100%;height:100%;}

  .take_info{width:100%;margin-top:.3rem;}

  /*消息列表结束*/
</style>
