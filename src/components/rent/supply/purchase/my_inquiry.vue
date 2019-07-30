<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" v-title="'我的询盘'" title="我的询盘" :bgcolor="mainColor" color="#fff">
      <span class="addClickArea" slot="left" @click="back" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
      <span class="addClickArea" @click="turnTo('/supply/purchase/product_collection')" slot="right" style="color: #fff;">产品收藏</span>
    </yd-navbar>
    <div class="search" style="border-bottom:1px solid #e4e4e4;margin-bottom:.2rem">
             <ul>
               <li @click="toggle"><span style="color:#999;margin-right:.1rem;">日期</span><yd-icon name='toDown' size='.2rem' custom color="#999"></yd-icon></li>
               <li><yd-search placeholder="输入搜索关键词" v-model="value" :on-submit="submitHandler"></yd-search></li>
             </ul>
             <div v-show="show1" class="screen">
               <ul>
                <li><p>起止时间</p></li>
               <li>
                 <span><yd-datetime type="date" v-model="screen.startTime" slot="right"></yd-datetime></span>
                 <i>-</i>
                 <span><yd-datetime type="date" v-model="screen.entTime" slot="right"></yd-datetime></span>
               </li>
               <li>
                <button @click="toggle">取消</button>
                <button @click="confirm" class="bb">确定</button>
               </li>
               </ul>
             </div>
    </div>
    <yd-tab :active-color="mainColor" :callback="callback">
        <yd-tab-panel label="预约" tabkey='1' active></yd-tab-panel>
        <yd-tab-panel label="询价" tabkey='3'></yd-tab-panel>
        <yd-tab-panel label="邀标" tabkey='5'></yd-tab-panel>
        <yd-tab-panel label="邀联" tabkey='4'></yd-tab-panel>
        <yd-tab-panel label="团购" tabkey='2'></yd-tab-panel>
    </yd-tab>
    <div class="lists" @scroll="scrollHandler" ref="listDom">
             <ul class="libList" v-for="(item,index) in libraryList" :key="index">
                <li v-if="parameter.type==5" @click="turnTo('/supply/purchase/details/1/'+item.guid)">
                     <p>
                       <span class="font32 textHidden" style="width:4.5rem">{{item.title}}</span>
                     </p>
                     <span class="font28" style="color:#A7A7A7;margin-left:.1rem;">
						          {{item.organName}}
					           </span>
                </li>
                <li v-else @click="turnTo('/supply/purchase/my_details/'+parameter.type+'/'+item.guid+'?title='+item.title+'&status='+item.state)">
                     <p>
                       <span class="font32 textHidden" style="width:4.5rem">{{item.title}}</span>
                     </p>
                     <span class="font28" style="color:#A7A7A7;margin-left:.1rem;">
						          {{item.organName}}
					           </span>
                </li>
                <li>
                    <p>
                        <span class="font24" :style="{border:'1px solid '+mainColor,color:mainColor}">{{item.state}}</span>
                    </p>
                    <span class="font28" style="color:#A7A7A7;">
						        <i><img src="../../../../assets/images/rent/supply/riqi.png" alt=""></i>
						        {{item.createTime}}</span>
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
      return {
        organInfo:{},
        mainColor:"",
        userInfo:{},
        screen:{
          startTime:this.$today(),
          entTime:this.$today()
        },
        show1:false,
        libraryList:[],
        libraryList1:[],
        checkAllImg:false,
        parameter:{
          token:'',
          title:'',
          type:1,
          pageNo:1,
          pageSize:7,
          pageCount:0,
          startDate:'',
          endDate:''
        },
        value:'',
      };
    },
    watch: {
      'parameter.type':'inquiryList'
    },
    methods: {
      turnTo(url) {
        this.$router.push(url)
      },
      confirm(){
        this.parameter.startDate=this.screen.startTime;
        this.parameter.endDate=this.screen.entTime;
        this.parameter.pageNo=1;
        this.libraryList=[]
        this.inquiryList();
        this.parameter.endDate=''
        this.parameter.startDate=''
        this.show1=!this.show1
      },
        submitHandler(value) {
                this.$dialog.toast({mes: `产品关键字：${value}`});
                this.parameter.pageNo=1;
                this.parameter.title=value;
                this.libraryList=[]
                this.inquiryList()
                this.parameter.title=''

       },
       callback(val,guid){
         this.parameter.pageNo=1;
         this.libraryList=[]
        this.parameter.type=guid;
      },
        scrollHandler(){

        if(store.loading||this.parameter.pageNo > this.parameter.pageCount){
            return
         }

          let listDom = this.$refs.listDom;
          if(listDom.scrollHeight - listDom.scrollTop - listDom.clientHeight < 100){
              this.inquiryList() }

      },
        inquiryList(){

        let data={}
          data.token=this.parameter.token;
          if(this.parameter.startDate!='') data.startDate=this.parameter.startDate+' 00:00:00';
        if(this.parameter.endDate!='') data.endDate=this.parameter.endDate+' 23:59:59';
        if(this.parameter.title!='') data.title=this.parameter.title;
          data.type=this.parameter.type;
          data.pageNo=this.parameter.pageNo;
          data.pageSize=this.parameter.pageSize;
        this.xhr.post(`${this.subUrl.bd}/purchase/inquiryList`, qs.stringify(data) ).then((res) => {
          if (res.data.code == 1) {
            if(res.data.data.list!=null){
            res.data.data.list.forEach(element => {
              element.createTime=element.createTime.split(' ')[0]
               element.clickImg=false;
               if(element.state==1||element.state==3){
                 element.state='正常'
               }else{
                 element.state="失效"
               }
            });
            }
            this.parameter.pageCount=res.data.data.pageCount;

            if(this.parameter.pageNo>=2){
              this.libraryList=this.libraryList.concat(res.data.data.list);
            }else{
              this.libraryList = res.data.data.list;
            }

           this.parameter.pageNo++;
            console.log(this.parameter.pageCount)
          } else if (res.data.code == '-902'){
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      },
      back() {
        this.$back(this);
      },

      toggle(){
        this.show1=!this.show1
      },
    },
    mounted() {
      if(this.$route.query.token){
        this.parameter.token = this.$route.query.token;
        this.$getUserInfo(res=>{
          this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
          this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
          this.mainColor = localStorage.getItem('mainColor');
          this.parameter.userId = this.userInfo.guid;
        },this)
      }else{
        this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
        this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
        this.mainColor = localStorage.getItem('mainColor');
        this.parameter.userId = this.userInfo.guid;
        this.parameter.token = fn.getIng();
      }
    }
  };
</script>
<style scoped>
  .search{width:100%;background:#F7F7F9;position: relative;}
  .search>ul{width:100%;display: flex;align-items:center;}
  .search>ul li:nth-child(2){flex:1;}
  .search>ul li:nth-child(1){width:1.2rem;display: flex;justify-content:center;align-items: center;}
.screen {
  width: 100%;
  position: absolute;
  height: calc(100vh - 1.88rem);
  background: rgba(0, 0, 0, 0.1);
  z-index: 999;
  left: 0;
}
.screen ul {
  background: #f6f6f6;
}
.screen ul li {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
}
.screen ul li:nth-child(1) {
  width: 100%;
  padding: 0.1rem 0.3rem;
}
.screen ul li:nth-child(2) {
  width: 100%;
  padding: 0.1rem 0.3rem;
  justify-content: center;
}
.screen ul li:nth-child(2) > span {
  background: white;
  width: 3rem;
  height: 0.7rem;
  border: 1px solid #e9e9e9;
  display: flex;
  align-items: center;
}
.screen ul li:nth-child(2) > i {
  margin: 0 0.3rem;
}
.screen ul li:nth-child(2) > span > input {
  width: 3rem;
  height: 0.7rem;
  border: none;
}

.screen ul li:nth-child(3) {
  width: 100%;
  height: 0.95rem;
  background: white;
  display: flex;
  flex-flow: row;
  justify-content: space-around;
  align-items: center;
}
.screen ul li:nth-child(3) button {
  width: 50%;
  height: 0.95rem;
  border: none;
  border-top: 1px solid #e4e4e4;
  font-size: 0.3rem;
  font-weight: 600;
  color: #a2a2a2;
}
.screen ul li:nth-child(3) button.bb {
  border-left: 1px solid #e4e4e4;
}

  .lists{width:100%;overflow-y: scroll;height:calc( 100vh - 2.94rem );}
  .libList{width:100%;display:flex;background: white;border-bottom:1px solid #D9D9D9;}
  .libList li{display:flex;height:1.5rem; }
  .libList li:nth-child(1){flex:1;flex-flow:column;padding:.1rem .3rem;justify-content: center;}
  .libList li:nth-child(1)>p{margin-bottom:.2rem;display: flex;align-items: center;}
  .libList li:nth-child(1)>span{display: flex;}
  .libList li:nth-child(1)>span>i{display:flex;width:.35rem;height:.35rem;
  margin-right:.1rem;}
  .libList li:nth-child(1)>span>i>img{width:100%;height:100%;}
  .libList li:nth-child(2){width:3rem;flex-flow:column;justify-content:center;align-items: center;}
  .libList li:nth-child(2)>p{margin-bottom:.2rem;}
  .libList li:nth-child(2)>p>span{padding:.02rem .02rem;font-size: .24rem;border-radius: .05rem;}
  .libList li:nth-child(2)>span{display: flex;}
  .libList li:nth-child(2)>span>i{width:.35rem;height:.35rem;margin-right:.1rem;}
  .libList li:nth-child(2)>span>i>img{width:100%;height:100%;}
</style>
