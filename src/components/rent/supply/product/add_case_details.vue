<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" v-title="title" :title="title" :bgcolor="mainColor" color="#fff">
      <span class="addClickArea" slot="left" @click="back" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
      <span class="addClickArea" v-if="show" @click="addCases" slot="right" style="color: #fff;">确定</span>
    </yd-navbar>
    <div class="details">
        <ol v-if="show">
            <li>案例名称</li>
            <li><span><input type="text" v-model="parameter.title"></span></li>
            <li>案例介绍</li>
            <li><span><yd-textarea style="height:90%" slot="right" v-model="parameter.contents" placeholder="请输入内容" maxlength="400"></yd-textarea></span></li>
        </ol>
         <ul v-else>
             <li><p>{{parameter.title}}</p><span :style="{border:'1px solid '+mainColor,color:mainColor}">正常</span></li>
             <li>
                 <p>案例介绍</p>
                 <span>{{parameter.contents}}</span>
             </li>
         </ul>
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
  Vue.prototype.$dialog = {
    confirm: Confirm,
    alert: Alert,
    toast: Toast,
    notify: Notify,
    loading: Loading,
  };
  Vue.component(CellGroup.name, CellGroup);
  Vue.component(CellItem.name, CellItem);
  import {Tab, TabPanel} from 'vue-ydui/dist/lib.rem/tab';
Vue.component(Tab.name, Tab);
Vue.component(TabPanel.name, TabPanel);
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
        list:['客户预约','客户询价','客户邀联','客户团购'],
        organInfo,
        mainColor,
        userInfo,
        screen:{
          startTime:this.$today(),
          entTime:this.$today()
        },
        show:false,
        libraryList:[],
        libraryList1:[],
        checkAllImg:false,
        parameter:{
          token:'',
          title:'',
          contents:''
        },
        value:'',
        title:''
      };
    },
    methods: {
      turnTo(url) {
        this.$router.push(url)
      },
        addCases(){
        let data={}
        data.token=this.parameter.token;
        if(this.parameter.title==''){
          this.$dialog.toast({mes: '案例名称不能为空！'});
          return
        }
        if(this.parameter.contents==''){
          this.$dialog.toast({mes: '案例内容不能为空！'});
          return
        }
        data.title=this.parameter.title;
        data.contents=this.parameter.contents
        
        this.xhr.post(`${this.subUrl.bd}/opportunity/addCases`, qs.stringify(data) ).then((res) => {
          if (res.data.code == 1) {
            this.$dialog.toast({mes: '新增案例成功！'});
            this.$router.go(-1);
          } else if (res.data.code == '-902'){
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      },
      back() {
        this.$router.go(-1);
      },
      confirm(){
        this.show1=!this.show1
      },
      toggle(){
        this.show1=!this.show1
      },
      leftTab(){
        this.$router.push('/supply/product/my_business');
      },
      rightTab(){
        this.$router.push('/supply/product/my_businesss');
      },
    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = localStorage.getItem('mainColor');
      this.parameter.userId = this.userInfo.guid;
      this.parameter.token = fn.getIng();
      if(this.$route.hash=='#add'){
          this.show=true;
          this.title='新增案例'
      }else if(this.$route.hash=='#details'){
          this.show=false;
          this.title='案例详情'
      }
    console.log(this.$route)
    if(this.$route.query.title!=''||this.$route.query.contents!=''){
      this.parameter.title=this.$route.query.title
      this.parameter.contents=this.$route.query.contents
    }

    }
  };
</script>
<style scoped>
  .details{width:100%;}
  .details>ul{width:100%;}
  .details>ul>li{display: flex;padding:.1rem .4rem;}
  .details>ul>li:nth-child(1){justify-content: space-between;height: 1rem;align-items: center;
  border-bottom:1px solid #EBEDEC;background: white;}
  .details>ul>li:nth-child(1)>p{font-size: .3rem;font-weight: 600;}
  .details>ul>li:nth-child(1)>span{padding:.02rem .06rem;border-radius: .05rem;font-size: .24rem;}
  .details>ul>li:nth-child(2){flex-flow: column;}
  .details>ul>li:nth-child(2)>p{color:#999;padding:.1rem 0;font-size: .3rem;}
  .details>ul>li:nth-child(2)>span{line-height: .5rem;}
  
  .details>ol{width:100%;padding:.2rem .4rem;}
  .details>ol>li{display: flex;color:#666;}
  .details>ol>li:nth-child(2){height:.7rem;width: 100%;margin:.2rem 0;}
  .details>ol>li:nth-child(4){height:5rem;width: 100%;margin:.2rem 0;}
  .details>ol>li:nth-child(2)>span{border: 1px solid #E8E9E9;border-radius: .1rem;width: 100%;
  background: white;display: flex;align-items: center;padding:0 .2rem;}
  .details>ol>li:nth-child(4)>span{border: 1px solid #E8E9E9;border-radius: .1rem;width: 100%;
  background: white;padding:.1rem .1rem;}
  .details>ol>li:nth-child(2)>span>input{border: none;width: 100%;height:100%;}
</style>