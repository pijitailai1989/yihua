<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" title="搜索管理处" :bgcolor="mainColor" color="#fff">
      <span class="addClickArea" slot="left" @click="back" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
    </yd-navbar>
    <template>
         <yd-search v-model="value" :on-submit="submitHandler"></yd-search>
    </template>

    <div class="lists" @scroll="scrollHandler" ref="listDom">
             <ul class="libList">
                <li v-for="(item,index) in libraryList" :key="index" 
                @click="turnTo('/property/management_details?guid='+item.guid+'&type=wei')">
                    <span class="font28 textHidden" style="width:5rem">{{item.organName}}</span>
                </li>
             </ul>
             <div  class="Section">
              <div v-if="parameter.pageNo <= parameter.pageCount">
              <div class="a b1">
                <ul>
               <li></li>
               <li></li>
               <li></li>
                </ul></div>
              </div>
              <div v-else>啦啦啦，啦啦啦，没有数据啦~~</div>
              </div>
    </div>
  </yd-layout>
</template>
<script>
  import fn from "@/assets/js/product";
  import qs from "qs";
  import InfiniteScroll from "vue-infinite-scroll";
  import Vue from "vue";
  import store from '@/store'
  import { CellGroup, CellItem } from "vue-ydui/dist/lib.rem/cell";
  import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog';
  import {Search} from 'vue-ydui/dist/lib.rem/search';
  Vue.component(Search.name, Search);
  Vue.prototype.$dialog = {
    confirm: Confirm,
    alert: Alert,
    toast: Toast,
    notify: Notify,
    loading: Loading,
  };
  Vue.component(CellGroup.name, CellGroup);
  Vue.component(CellItem.name, CellItem);
  export default {
    data() {
      let userInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("userInfo"))
      );
      let mainColor = this.$color[userInfo.organType];
      let endTime = this.$today();
      var organInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("organInfo"))
      );
      var userType = userInfo.organType
      let TypeListCircle;
      if (userType == 1) {
        TypeListCircle = 1;
      } else if (userType == 5) {
        TypeListCircle = 2;
      } else{
        TypeListCircle = 3
      }
      return {
        organInfo,
        mainColor,
        userInfo,
        screen:{
          startTime:this.$today(),
          entTime:this.$today()
        },
        show1:false,
        checkAllImg:false,
        parameter:{
            token:'',
            condition:'',
            pageNo:1,
            pageSize:20
        },
        value:'',
        libraryList:[],
        libraryList1:[],
        guid:'',
        type:'',
        organId:'',
        noticeObj:{
          name:'',
          guid:'',
        }
      };
    },
    methods: {
      back(){
          this.$router.go(-1);
      },
      turnTo(url){
        this.$router.push(url)
      },
      submitHandler(value) {
                this.$dialog.toast({mes: `管理处关键字：${value}`});
                this.parameter.pageNo=1;
                this.parameter.condition=value;
                this.libraryList=[]
                this.queryManage()
                
       },
        scrollHandler(){

        if(store.loading||this.parameter.pageNo > this.parameter.pageCount){
            return
         }
          
          let listDom = this.$refs.listDom;
          if(listDom.scrollHeight - listDom.scrollTop - listDom.clientHeight < 100){
              this.queryManage() 
              }
 
      },
        queryManage(){
        let data={}
        data.token=this.parameter.token;
        data.condition=this.parameter.condition;
        data.pageNo=this.parameter.pageNo;
        data.pageSize=this.parameter.pageSize;
        this.xhr.post(`${this.subUrl.activity}/proRelManage/queryManage`, qs.stringify(data) ).then((res) => {
            console.log(res)
          if (res.data.code == 1) {
            this.parameter.pageCount=res.data.data.pageCount;
            if(this.parameter.pageNo>=2){
              this.libraryList=this.libraryList.concat(res.data.data.list);
            }else{
              this.libraryList = res.data.data.list;
            }
           this.parameter.pageNo++;
          } else if (res.data.code == '-902'){
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      },
      
    },
    mounted() {
      this.parameter.userId = this.userInfo.guid;
      this.parameter.token = fn.getIng();
      this.parameter.organId=this.organInfo.guid;
      console.log(this.userInfo,this.organInfo,11111111111111)
    }
  };
</script>
<style scoped>
  .lists{overflow-y: scroll;height:calc( 100vh - 2rem );margin-top:.12rem;}
  .libList{width:100%;background: white;}
  .libList li{padding:.2rem .5rem;border-bottom:1px solid #D9D9D9;}
</style>