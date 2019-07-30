<template>
  <yd-layout class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'商机点明细'" title="商机点明细" color="#fff" :bgcolor="mainColor" height=".88rem">
         <router-link to="#" slot="left">
            <span @click="back"><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </router-link>
      </yd-navbar>
    </div>
   <yd-search v-model="value1" :on-submit="submitHandler"></yd-search>

   <div class="tab_two">
       <ul>
         <li class="font600 font30" v-for="(item,index) in tabT" :key='index' @click="toggle(index)"
          :class="{blue:num==index&&userInfo.organType == 4,green:num==index&&userInfo.organType == 1,orange:num==index&&userInfo.organType == 5}">{{item}}</li>
         </ul>
   </div>

   <div class="news">

       <ul v-if="num">
         <li v-for="(item,index) in news1" :key="index">
             <p>
                <span class="font28">{{item.type}}</span>
                <span class="font24">{{item.data}}&nbsp;{{item.time}}</span>
             </p>
             <p class="font30 font600">{{item.price}}</p>
         </li>
       </ul>
       <ul v-else>
         <li v-for="(item,index) in news" :key="index">
             <p>
                <span class="font28">{{item.type}}</span>
                <span class="font24">{{item.data}}&nbsp;{{item.time}}</span>
             </p>
             <p class="font30 font600">{{item.price}}</p>
         </li>
        </ul>
   </div>

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
        value1: '',
        tabT:['收入记录','消费记录'],
        num:0,
        news:[{type:'物流采购教程',data:'2017-10-10',time:'10:23:34',price:'+10'},
        {type:'物流采购教程',data:'2017-10-10',time:'10:23:34',price:'+10'},
        {type:'物流采购教程',data:'2017-10-10',time:'10:23:34',price:'+10'},
        {type:'物流采购教程',data:'2017-10-10',time:'10:23:34',price:'+10'},
        {type:'物流采购教程',data:'2017-10-10',time:'10:23:34',price:'+10'}],
        news1:[{type:'物流采购教程',data:'2017-10-10',time:'10:23:34',price:'-10'},
        {type:'物流采购教程',data:'2017-10-10',time:'10:23:34',price:'-10'},
        {type:'物流采购教程',data:'2017-10-10',time:'10:23:34',price:'-10'},
        {type:'物流采购教程',data:'2017-10-10',time:'10:23:34',price:'-10'},
        {type:'物流采购教程',data:'2017-10-10',time:'10:23:34',price:'-10'}],
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
      },
      submitHandler(value) {
                this.$dialog.toast({mes: `搜索：${value}`});
      },
      toggle(index){
         this.num=index;
         this.$router.push('#'+index)
      },
      tab(){
        if(this.$route.hash=='#0'){
          this.num=0

        }else if(this.$route.hash=='#1'){
          this.num=1
        }
      }


    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = localStorage.getItem('mainColor');
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      this.userId = this.userInfo.guid;
    },
    beforeUpdate(){
       this.tab();
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
  .tab_two{width:100%;height:1.1rem;padding:0.2rem 1.2rem;background:#F7F7F9;}
  .tab_two ul{width:100%;height:.7rem;display:flex;flex-direction:row;border-radius:.1rem;background:white;}
  .tab_two ul li{width:50%;height:.7rem;text-align:center;line-height:.7rem;}
  .tab_two ul li:nth-child(1){border-radius:.1rem 0 0 .1rem}
  .tab_two ul li:nth-child(2){border-radius:0 .1rem .1rem 0}

  .green {background: #23AC38;color:white;}
  .orange{background: #FAB23E;color:white;}
  .blue{background:#0093D2;color:white;}

  .news{width:100%;background:white;border-top:1px solid #F3F3F4;border-bottom:1px solid #F3F3F4;}
  .news ul{width:100%;padding:0 .2rem}
  .news ul li{display:flex;flex-direction:row;padding:.2rem 0;border-bottom:1px solid #F8F8F8;}
  .news ul li p:nth-child(1){flex:8;display:grid;grid-template-columns:1fr;}
  .news ul li p:nth-child(1) span{margin:.05rem 0;}
  .news ul li p:nth-child(1) span:nth-child(2){margin:.05rem 0;color:#A3A3A3;}
  .news ul li p:nth-child(2){flex:2;display:flex;justify-content:center;align-items:center;color:#FF3D3D;}
</style>
