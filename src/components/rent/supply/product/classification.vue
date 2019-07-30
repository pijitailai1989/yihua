<template>
  <yd-layout class="layout_my">
      <yd-navbar class="header" v-title="'分类'" slot="navbar" title="分类" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span class="addClickArea spanLeft" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
        <span slot="right" @click="confirm" style="color:white"  class="addClickArea font30 spanRight">确定</span>
      </yd-navbar>

    <yd-accordion>
        <yd-accordion-item v-for="(item,index) in list" :key="index" :title="item.name" open>
            <div class="box1">
          <ul>
          <li style="font-size:.26rem;" v-for="(todo,index) in item.subclass" :key="index" @click="checkBox(todo.guid,todo.name,item.guid)"
           :style="{background:piacked==todo.guid?mainColor:'',color:piacked==todo.guid?'white':''}">
               {{todo.name}}
          </li>
          </ul>
         </div>
        </yd-accordion-item>
    </yd-accordion>

    

  </yd-layout>
</template>
<script>
  import Vue from 'vue';
  import store from '@/store'
  import {Search} from 'vue-ydui/dist/lib.rem/search';

  Vue.component(Search.name, Search);


import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog';

Vue.prototype.$dialog = {
    confirm: Confirm,
    alert: Alert,
    toast: Toast,
    notify: Notify,
    loading: Loading,
};

  import fn from '@/assets/js/product'
  import qs from 'qs'

  export default {
    data() {
      return {
        mainColor: "",
        num:null,
        userInfo:'',
        organInfo:'',
        titleText:'',
        getkey:'',
        organId:'',
        interestList:[],
        // valueCenterList:[],
        addArr:[],
        addArr1:[],
        piacked:null,
          list:[],

      }
    },
    computed:{

    },
    methods: {
      //行业分类
      getIndustryCategory() {
        let data={}
        data.token=this.getkey;
        data.organId=this.organId;
        this.$ajax(
          `${this.subUrl.user}/comm/getIndustryCategory2`,
          data,
          res => {
            this.list=res.data;
          },
          this
        );
      },
      turnTo(url) {
        this.$router.push(url)
      },
      back(){
          this.$emit('bmData1')
          store.guid=null;
          store.name=null;
          store.fguid=null;
      },
      confirm(){
         this.$emit('bmData1')
      },
      checkBox(guid,name,fguid){
           this.piacked=guid;
           store.guid=guid;
           store.name=name;
           store.fguid=fguid;
           console.log(fguid,11111111111111)
       },
       
    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.user = JSON.parse(decodeURIComponent(localStorage.getItem('user')));
      this.users = JSON.parse(decodeURIComponent(localStorage.getItem('users')));

      this.mainColor = localStorage.getItem('mainColor');
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      this.organId = this.organInfo.guid;
      this.getIndustryCategory();

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
background:#F7F7F9;
  }

  .layout_my .blue_box {
    height: 0.88rem;
    background-size: 100% 100%;
    color:white;
  }

  .box{width:100%;display:flex;justify-content:center;align-items:center;height:1.2rem;background:#F3F3F3;padding:.2rem .3rem;border-bottom:1px solid #D8D8D8;}
  .box span{width:100%;height:100%;background:white;border:1px solid #D8D8D8;border-radius:.06rem;padding:.1rem .1rem;}
  .box span>input{width:100%;height:100%;border:none;color:#777;}

  .box1{width:100%;display:flex;padding:.28rem .28rem;}
  .box1 ul{width:100%;display:flex;flex-flow:row wrap;align-items:center;}
  .box1 ul li{width:22%;;height:.75rem;border:1px solid #E6E6E6;display:flex;justify-content:center;align-items:center;border-radius:.8rem;margin:.1rem .1rem;}

  .box2{width:100%;display:flex;padding:.2rem .2rem;}
  .box2 span{width:100%;border:1px solid #D8D8D8;border-radius:.06rem;background:white;}
  .box2 span>textarea{width:100%;height:2rem;border:none;}

  .box3{width:100%;display:flex;flex-flow:row wrap;padding:.1rem .1rem;}
  .box3 label{width:30%;height:.9rem;border:1px solid #E1E1E1;border-radius:.9rem;display:flex;flex-flow:column;
  justify-content:center;align-items:center;margin:.1rem .1rem}
  .box3 label>span{color:#333;letter-spacing:.07rem;}
  .box3 label>a{color:#AAAAAA;}

</style>
