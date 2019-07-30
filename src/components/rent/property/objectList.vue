<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" title="选择通知对象" :bgcolor="mainColor" color="#fff">
      <span class="addClickArea" slot="left" @click="back" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
      <span class="addClickArea" @click="confirm" slot="right" style="color:#fff">确定</span>
    </yd-navbar>
    

    <div class="lists" @scroll="scrollHandler" ref="listDom">
             <ul class="libList" v-for="(item,index) in libraryList" :key="index">
                <li @click="checks(index)">
                  <i v-if="item.clickImg"><img src="../../../assets/images/rent/baishitong/select_active.png" alt=""></i>
                  <i v-else><img src="../../../assets/images/rent/baishitong/select.png" alt=""></i>
                </li>
                <li>
                     <p>
                       <span class="font28 textHidden" style="width:5rem">{{item.organName}}</span>
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
                <i v-if="checkAllImg"><img src="../../../assets/images/rent/baishitong/select_active.png" alt=""></i>
                <i v-else><img src="../../../assets/images/rent/baishitong/select.png" alt=""></i>
              </li>
              <li>
                <p class="font30">所有管理处</p>
              </li>
              <li></li>
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
            keyword:'',
            content:'',
            title:'',
            accessorys:'',
            noticeObj:'',
            organId:'',
          token:'',
          userId:null,
          type:null,
          pageNo:1,
          pageSize:12,
          pageCount:0,
          kaIds:'',
          businessName:null,
          guidList:'',
          type1:'',
          supplierOrganId:'',
          supplierId:'',
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
        confirm(){
        if(this.noticeObj==''){
            this.$dialog.toast({mes: '请选择！'});
        }else{
            this.$emit('bmData',this.noticeObj)

        }
      },
        back() {
        this.$emit('bmData')
      },
      turnTo1(url,index){
        this.$router.push(url)
        this.libraryList[index].titleText="供应商详情"
        localStorage.setItem('libraryList',encodeURIComponent(JSON.stringify(this.libraryList[index])));
        
      },
      turnTo(url){
        this.$router.push(url)
      },
      toggle(){
        this.show1=!this.show1
      },
      submitHandler(value) {
                this.$dialog.toast({mes: `产品关键字：${value}`});
                this.parameter.pageNo=1;
                // this.myLib()
                
       },
        scrollHandler(){

        if(store.loading||this.parameter.pageNo > this.parameter.pageCount){
            return
         }
          
          let listDom = this.$refs.listDom;
          if(listDom.scrollHeight - listDom.scrollTop - listDom.clientHeight < 100){
            //   this.myLib() 
              }
 
      },
      checks(index){
         let arr1=[]
         let arr2=[]
         this.libraryList[index].clickImg=!this.libraryList[index].clickImg
         let arr=this.libraryList.filter((item,index)=>{
            return item.clickImg==true
         })
         this.libraryList1=this.libraryList.filter(item=>{
           return item.clickImg==false
         })
         
         arr.forEach(element=>{
            arr1.push(element.guid)
            arr2.push(element.organName)
         })
         if(this.libraryList.length>arr.length){
           this.checkAllImg=false;
         }else if(this.libraryList.length==arr.length){
           this.checkAllImg=true;
         }

         this.noticeObj.guid=arr1.join(',')
         this.noticeObj.name=arr2.join(',')
         console.log(this.parameter.supplierOrganId)
         
      },
      checkAll(){
         this.checkAllImg=!this.checkAllImg;
         this.libraryList.forEach(element => {
           element.clickImg=this.checkAllImg
         });
         let arr1=[]
         let arr2=[]
         this.libraryList1=this.libraryList.filter(item=>{
           return item.clickImg==false
         })
         let arr=this.libraryList.filter((item,index)=>{
            return item.clickImg==true
         })
         arr.forEach(element=>{
            arr1.push(element.guid)
            arr2.push(element.organName)
         })
         this.noticeObj.guid=arr1.join(',')
         this.noticeObj.name=arr2.join(',')
         console.log(this.parameter.supplierOrganId)
      },
      callback(val,guid){
        this.parameter.pageNo=1;
        this.parameter.pageSize=6;
        this.parameter.type=guid;
        this.checkAllImg=false;
        // let that=this;
        // that.$dialog.loading.open('加载中..');
      },
        queryBindOrgan(){
        let data={}
        data.token=this.parameter.token;
        data.organId=this.parameter.organId;
        data.pageNo=this.parameter.pageNo;
        data.pageSize=this.parameter.pageSize;
        
        this.xhr.post(`${this.subUrl.activity}/propertyNotice/queryBindOrgan`, qs.stringify(data) ).then((res) => {
            console.log(res)
          if (res.data.code == 1) {
            this.$dialog.loading.close();
            if(res.data.data.length>0){
            res.data.data.forEach(element => {
               element.clickImg=false;
            });
            }
            this.libraryList = res.data.data;
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
      this.queryBindOrgan();
    }
  };
</script>
<style scoped>
  .search{width:100%;background:#F7F7F9;position: relative;margin-bottom:.2rem;}
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
  border-top:1px solid #D9D9D9;
}
.screen ul {
  background: #f6f6f6;
}
.screen ul li {
  height:.8rem;border-bottom:1px solid #D9D9D9;padding:0 .4rem;
  display: flex;align-items: center;font-size: .32rem;
}


  .lists{overflow-y: scroll;height:calc( 100vh - 2.8rem );margin-top:1.2rem;}
  .libList{width:100%;display:flex;background: white;border-bottom:1px solid #D9D9D9;}
  .libList li{display:flex;height:.7rem;}
  .libList li:nth-child(1){width:.7rem;justify-content: center;align-items:center;}
  .libList li:nth-child(1)>i{width:.35rem;height:.35rem;}
  .libList li:nth-child(1)>i>img{width:100%;height:100%;}
  .libList li:nth-child(2){flex:1;flex-flow:column;justify-content: center;}
  .libList li:nth-child(2)>p{margin-bottom:.1rem;display: flex;align-items: center;}
  /* .libList li:nth-child(2)>p:nth-child(2)>span{padding:0 .2rem;
  margin-left:.2rem;font-size: .24rem;} */
/* 
  .libList li:nth-child(2)>span{display: flex;}
  .libList li:nth-child(2)>span>i{display:flex;width:.35rem;height:.35rem;
  margin-right:.1rem;}
  .libList li:nth-child(2)>span>i>img{width:100%;height:100%;} */
  /* .libList li:nth-child(3){width:2.2rem;justify-content:center;align-items: center;}
  .libList li:nth-child(3)>p{display: flex;}
  .libList li:nth-child(3)>p>i{width:.35rem;height:.35rem;margin-right:.1rem;}
  .libList li:nth-child(3)>p>i>img{width:100%;height:100%;} */

  .checkAll{position:absolute;width:100%;background: white;height:.8rem;
  top:0;left:0;z-index:998;}
  .checkAll ul li{width: 100%;height:100%;}
  .checkAll ul{display: flex;height:100%;}
  .checkAll ul li:nth-child(1){width:.8rem;display: flex;justify-content: center;align-items:center;}
  .checkAll ul li:nth-child(1)>i{width:.35rem;height:.35rem;}
  .checkAll ul li:nth-child(1)>i>img{width:100%;height:100%;}
  .checkAll ul li:nth-child(2){flex:1;display: flex;align-items: center;}
  .checkAll ul li:nth-child(3){width:1.5rem;height:.8rem;;display: flex;align-items: center;}
  .checkAll ul li:nth-child(4){width:1.5rem;height:.8rem;;display: flex;align-items: center;}
  /* .checkAll ul li:last-child{width:1.5rem;height:.8rem;background: #FF5A5A;color:white;display: flex;
  justify-content: center;align-items: center;} */
</style>