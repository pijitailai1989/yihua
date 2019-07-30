<template>
  <yd-layout class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'密码设置'" title="密码设置" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span class="spanLeft" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
      </yd-navbar>
    </div>

    <div class="pass_s">

       <yd-cell-group>

         <yd-cell-item arrow type="label" @click.native="turnTo('/my/setting/set_pass/raw_pass')">
            <span slot="left">通过原密码修改</span>
         </yd-cell-item>
         <yd-cell-item arrow type="label" @click.native="turnTo('/my/setting/set_pass/phone_pass')">
            <span slot="left">手机短信初始密码修改</span>
         </yd-cell-item>
       </yd-cell-group>

    </div>

  </yd-layout>
</template>
<script>
  import Vue from 'vue';
  import fn from '@/assets/js/product'
  import qs from 'qs'

  import {CellGroup, CellItem} from 'vue-ydui/dist/lib.rem/cell';
/* 使用px：import {CellGroup, CellItem} from 'vue-ydui/dist/lib.px/cell'; */

Vue.component(CellGroup.name, CellGroup);
Vue.component(CellItem.name, CellItem);

  export default {
    data() {
      return {
        mainColor: "",

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
      this.mainColor = localStorage.getItem('mainColor');
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
  .pass_s{margin-top:.3rem;border-top:1px solid #D9D9D9;}
  /*消息列表结束*/
</style>
