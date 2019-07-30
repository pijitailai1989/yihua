<template>
  <yd-layout class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'积分明细'" title="积分明细" color="#fff" :bgcolor="mainColor" height=".88rem">
         <router-link to="#" slot="left">
            <span @click="back"><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </router-link>
      </yd-navbar>
    </div>
   <yd-search v-model="value1" :on-submit="submitHandler"></yd-search>
  </yd-layout>
</template>
<script>
  import Vue from 'vue';
  import {Search} from 'vue-ydui/dist/lib.rem/search';

  Vue.component(Search.name, Search);


  import fn from '@/assets/js/product'
  import qs from 'qs'

  export default {
    data() {
      return {
        mainColor: "",
        value1: ''
      }
    },
    methods: {
      turnTo(url) {
        this.$router.push(url)
      },
      back(){
        this.$router.go(-1)
      },
      submitHandler(value) {
                this.$dialog.toast({mes: `搜索：${value}`});
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

 .yd-search>.yd-search-input{background-color:#fff;}
.yd-search>.yd-search-input>.search-input{background-color:#ccc;}
.footList{}
.yd-cell-right i{display:block;color:#989998;}
  /*消息列表结束*/
</style>
