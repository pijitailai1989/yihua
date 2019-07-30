<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" v-title="'案例管理'" title="案例管理" :bgcolor="mainColor" color="#fff">
      <span class="addClickArea" slot="left" @click="back" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
      <span class="addClickArea" @click="turnTo('/supply/product/add_case_details#add')" slot="right" style="color: #fff;font-size:.55rem">+</span>
    </yd-navbar>
    
    <div class="lists" @scroll="scrollHandler" ref="listDom">
             <ul class="libList" v-for="(item,index) in libraryList" :key="index">
               <li @click="checks(index)">
                  <i v-if="item.clickImg"><img src="../../../../assets/images/rent/baishitong/select_active.png" alt=""></i>
                  <i v-else><img src="../../../../assets/images/rent/baishitong/select.png" alt=""></i>
                </li>
                <li @click="turnTo('/supply/product/add_case_details?title='+item.title+'&contents='+item.contents+'#details')">
                     <p>
                       <span class="font32 textHidden" style="margin-left:.2rem;width:4.5rem">{{item.title}}</span>
                     </p>
                     <span class="font24" style="color:#A7A7A7;margin-left:.2rem;dispaly:flex;align-items:center;">
						     <i><img src="../../../../assets/images/rent/supply/riqi.png" alt=""></i>{{item.createTime}}
					           </span>
                </li>
                <li>
                    <p>
                        <span :style="{border:'1px solid '+mainColor,color:mainColor}">{{item.state}}</span>
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
    <div class="checkAll">
           <ul>
              <li @click="checkAll">
                <i v-if="checkAllImg"><img src="../../../../assets/images/rent/baishitong/select_active.png" alt=""></i>
                <i v-else><img src="../../../../assets/images/rent/baishitong/select.png" alt=""></i>
              </li>
              <li>
                <p class="font32 font600">全选</p>
              </li>
              <li>
                <span class="font30" @click="delCases">删除</span>
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
        show1:false,
        libraryList:[],
        libraryList1:[],
        checkAllImg:false,
        parameter:{
          token:'',
          userId:null,
          type:3,
          pageNo:1,
          pageSize:10,
          pageCount:0,
          kaIds:'',
          keyword:'',
        },
        value:'',
      };
    },
    methods: {
      turnTo(url) {
        this.$router.push(url)
      },
        submitHandler(value) {
                this.$dialog.toast({mes: `产品关键字：${value}`});
                this.parameter.pageNo=1;
                this.myLib()
                
       },
        scrollHandler(){

        if(store.loading||this.parameter.pageNo > this.parameter.pageCount){
            return
         }
          
          let listDom = this.$refs.listDom;
          if(listDom.scrollHeight - listDom.scrollTop - listDom.clientHeight < 100){
              this.casesList() }
 
      },
      checks(index){
         let arr1=[]
         this.libraryList[index].clickImg=!this.libraryList[index].clickImg
         let arr=this.libraryList.filter((item,index)=>{
            return item.clickImg==true
         })
         this.libraryList1=this.libraryList.filter(item=>{
           return item.clickImg==false
         })
         
         arr.forEach(element=>{
            arr1.push(element.guid)
         })
         if(this.libraryList.length>arr.length){
           this.checkAllImg=false;
         }else if(this.libraryList.length==arr.length){
           this.checkAllImg=true;
         }

         this.parameter.guidList=arr1.join(',')
         console.log(this.parameter.guidList)
         
      },
      checkAll(){
         this.checkAllImg=!this.checkAllImg;
         this.libraryList.forEach(element => {
           element.clickImg=this.checkAllImg
         });
         let arr1=[]
         this.libraryList1=this.libraryList.filter(item=>{
           return item.clickImg==false
         })
         let arr=this.libraryList.filter((item,index)=>{
            return item.clickImg==true
         })
         arr.forEach(element=>{
            arr1.push(element.guid)
         })
         this.parameter.guidList=arr1.join(',')
         console.log(this.parameter.guidList)
      },
      delCases(){
        if(this.parameter.guidList==''){
          this.$dialog.toast({mes: '请选择操作对象！'});
          return
        }
        this.checkAllImg=false;
        var data={
          token:this.parameter.token,
          guidList:this.parameter.guidList
        }
        this.xhr.post(`${this.subUrl.bd}/opportunity/delCases`, qs.stringify(data) ).then((res) => {
          if (res.data.code == 1) {
            this.libraryList=this.libraryList1
            this.$dialog.toast({mes: '删除成功！'});
            this.parameter.pageNo=1;
            this.casesList()
          } else if (res.data.code == '-902'){
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      },
        casesList(){
           var data={
          token:this.parameter.token,
          pageNo:this.parameter.pageNo,
          pageSize:this.parameter.pageSize
         }
        this.xhr.post(`${this.subUrl.bd}/opportunity/casesList`, qs.stringify(data) ).then((res) => {
          if (res.data.code == 1) {
            this.$dialog.loading.close();
            if(res.data.data.list!=null){
            res.data.data.list.forEach(element => {
               element.createTime=element.createTime.split(' ')[0]
               element.clickImg=false;
               if(element.state==1){
                 element.state='正常'
               }else if(element.state==2){
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
      this.list4=[this.list[0],this.list[1],this.list[2],this.list[3]]
      this.parameter.userId = this.userInfo.guid;
      this.parameter.token = fn.getIng();
      this.casesList();
    }
  };
</script>
<style scoped>
  .lists{overflow-y: scroll;height:calc( 100vh - 2.88rem );}
  .libList{width:100%;display:flex;background: white;border-bottom:1px solid #D9D9D9;}
  .libList li{display:flex;height:1.8rem;}
  .libList li:nth-child(1){width:.7rem;justify-content: center;align-items:center;}
  .libList li:nth-child(1)>i{width:.35rem;height:.35rem;}
  .libList li:nth-child(1)>i>img{width:100%;height:100%;}
  .libList li:nth-child(2){flex:1;flex-flow:column;justify-content: center;}
  .libList li:nth-child(2)>p{margin-bottom:.1rem;display: flex;align-items: center;}
  .libList li:nth-child(2)>p:nth-child(2)>span{padding:.02rem .2rem;
  margin-left:.2rem;font-size: .24rem;}

  .libList li:nth-child(2)>span{display: flex;}
  .libList li:nth-child(2)>span>i{display:flex;width:.35rem;height:.35rem;
  margin-right:.1rem;}
  .libList li:nth-child(2)>span>i>img{width:100%;height:100%;}
  .libList li:nth-child(3){width:2.2rem;justify-content:center;align-items: center;}
  .libList li:nth-child(3)>p{display: flex;}
  .libList li:nth-child(3)>p>span{padding:.05rem .05rem;font-size: .24rem;border-radius: .05rem;}

  .checkAll{position:absolute;width:100%;background: white;height:.8rem;
  bottom:0;left:0;z-index:998;}
  .checkAll ul li{width: 100%;height:100%;}
  .checkAll ul{display: flex;height:100%;}
  .checkAll ul li:nth-child(1){width:.8rem;display: flex;justify-content: center;align-items:center;}
  .checkAll ul li:nth-child(1)>i{width:.35rem;height:.35rem;}
  .checkAll ul li:nth-child(1)>i>img{width:100%;height:100%;}
  .checkAll ul li:nth-child(2){flex:1;display: flex;align-items: center;}
  .checkAll ul li:last-child{width:1.5rem;height:.8rem;background: #FF5A5A;color:white;display: flex;
  justify-content: center;align-items: center;}
</style>