<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" title="关系管理" :bgcolor="mainColor" color="#fff">
      <span class="addClickArea" slot="left" @click="back" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
    </yd-navbar>
    <div class="search" style="border-bottom:1px solid #e4e4e4;">
        <ul>
            <li><yd-search placeholder="输入搜索关键词" v-model="value" :on-submit="submitHandler"></yd-search></li>             
        </ul>
    </div>

    <div class="lists" @scroll="scrollHandler" ref="listDom">
             <ul class="libList">
                <li @click="turnTo('/relation/details')">
                     <p>
                       <span class="font32 textHidden" style="width:5rem">规划和一个私人游艇股价提供优惠</span>
                     </p>
                     <span style="color:#A7A7A7;margin-bottom:.1rem;">
                        <i><img src="../../../assets/images/rent/supply/ding.png" alt=""></i>
						  的规划土地规划研讨会
					</span>
                     <span class="font24" style="color:#A7A7A7;">
                        <i><img src="../../../assets/images/rent/supply/riqi.png" alt=""></i>
						  点头哈腰突入认同
					</span>
                </li>
                <li>
                    <p>
                       <span :style="{color:mainColor,border:'1px solid '+mainColor}">正常</span>
                     </p>
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
          userId:null,
          state:null,
          pageNo:1,
          pageSize:10,
          pageCount:0,
          startDate:'',
          endDate:'',
          kaIds:'',
          keyword:'',
          guidList:'',
        },
        value:'',
        libraryList:[],
        libraryList1:[],
      };
    },
    methods: {
      turnTo(url){
          this.$router.push(url)
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
      submitHandler(value) {
                this.$dialog.toast({mes: `产品关键字：${value}`});
                this.parameter.pageNo=1;
                this.pushInfoList()
                
       },
        scrollHandler(){

        if(store.loading||this.parameter.pageNo > this.parameter.pageCount){
            return
         }
          
          let listDom = this.$refs.listDom;
          if(listDom.scrollHeight - listDom.scrollTop - listDom.clientHeight < 100){
              this.pushInfoList() }
 
      },
      callback(val,guid){
        this.parameter.pageNo=1;
        this.parameter.pageSize=6;
        this.parameter.type=guid;
        this.checkAllImg=false;
        // let that=this;
        // that.$dialog.loading.open('加载中..');
      },
        pushInfoList(){
        let data={}
        data.token=this.parameter.token;
        data.state=this.parameter.state;
        data.startDate=this.parameter.startDate;
        data.endDate=this.parameter.endDate;
        data.pageNo=this.parameter.pageNo;
        data.pageSize=this.parameter.pageSize;
        
        this.xhr.post(`${this.subUrl.bd}/opportunity/pushInfoList`, qs.stringify(data) ).then((res) => {
          if (res.data.code == 1) {
            this.$dialog.loading.close();
            if(res.data.data.list!=null){
            res.data.data.list.forEach(element => {
               element.createDate=element.createDate.split(' ')[0]
               element.clickImg=false
               if(element.type==1){
                 element.type='优惠劵'
               }else if(element.type==2){
                 element.type='会员卡'
               }
               if(element.state==1){
                 element.state='正常'
               }else if(element.state==2){
                 element.state="失效"
               }else if(element.state==3){
                 element.state="删除"
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
    },
    mounted() {
      this.parameter.userId = this.userInfo.guid;
      this.parameter.token = fn.getIng();
      this.pushInfoList();
    }
  };
</script>
<style scoped>
  .search{width:100%;background:#F7F7F9;position: relative;margin-bottom:.2rem;}
  .search>ul{width:100%;display: flex;align-items:center;}
  .search>ul li:nth-child(1){flex:1;}
  .lists{overflow-y: scroll;height:calc( 100vh - 2.88rem );}
  .libList{width:100%;display:flex;background: white;border-bottom:1px solid #D9D9D9;}
  .libList li{display:flex;height:2rem;}
  .libList li:nth-child(1){flex:1;flex-flow:column;justify-content: center;padding:0 .3rem;}
  .libList li:nth-child(1)>p{margin-bottom:.1rem;display: flex;align-items: center;}
  .libList li:nth-child(1)>p:nth-child(2)>span{padding:.02rem 0;
  margin-left:.2rem;font-size: .26rem;color:#999;}

  .libList li:nth-child(1)>span{display: flex;}
  .libList li:nth-child(1)>span>i{display:flex;width:.35rem;height:.35rem;
  margin-right:.1rem;}
  .libList li:nth-child(1)>span>i>img{width:100%;height:100%;}
  .libList li:nth-child(2){width:1rem;flex-flow:column;justify-content: center;align-items: flex-start;}
  .libList li:nth-child(2)>p{margin-bottom:.1rem;display: flex;align-items: center;}
  .libList li:nth-child(2)>p>span{padding:.02rem .02rem;font-size: .24rem;border-radius: .05rem;}

  .libList li:nth-child(2)>span{display: flex;}
  .libList li:nth-child(2)>span>i{display:flex;width:.35rem;height:.35rem;
  margin-right:.1rem;}
  .libList li:nth-child(2)>span>i>img{width:100%;height:100%;}

  .checkAll{position:absolute;width:100%;background: white;height:.8rem;
  bottom:0;left:0;z-index:998;}
  .checkAll ul li{width: 100%;height:100%;}
  .checkAll ul{display: flex;height:100%;}
  .checkAll ul li:nth-child(1){width:.8rem;display: flex;justify-content: center;align-items:center;}
  .checkAll ul li:nth-child(1)>i{width:.35rem;height:.35rem;}
  .checkAll ul li:nth-child(1)>i>img{width:100%;height:100%;}
  .checkAll ul li:nth-child(2){flex:1;display: flex;align-items: center;}
  .checkAll ul li:nth-child(3){width:1.5rem;height:.8rem;background: #FF5A5A;color:white;display: flex;
  justify-content: center;align-items: center;}
</style>