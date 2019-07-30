<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" :title="title" :bgcolor="mainColor" color="#fff">
      <span class="addClickArea" slot="left" @click="back" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
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
    <div class="lists" @scroll="scrollHandler" ref="listDom">
             <ul class="libList" v-for="(item,index) in libraryList" :key="index">
                <li @click="turnTo('/supply/purchase/details/'+item.type+'/'+item.poId+'?a='+item.myExplain+'&b='+item.myOffer+'&c='+item.offerTime)">
                     <p>
                       <span class="font32 textHidden" style="width:4.5rem">{{item.organInfoDto3.organName}}</span>
                       <span v-show="item.organInfoDto3.vipType!=0" style="background:#C8E7FF;color:#61BBFF;">{{item.vipType}}</span>
                       <span style="background:#FFE7C8;color:#FFB454;">{{item.organInfoDto3.years}}年</span>
                     </p>
                     <span class="font24" style="color:#A7A7A7;margin-left:.2rem;">
                        <i><img src="../../../../assets/images/rent/supply/money.png" alt=""></i>报价：
						    {{item.myOffer}}
					 </span>
                     <span class="font24" style="color:#A7A7A7;margin-left:.2rem;">
                        <i><img src="../../../../assets/images/rent/supply/ding.png" alt=""></i>
						    {{item.organInfoDto3.organAddress}}
					 </span>
                     <div class="font24" style="color:#A7A7A7;margin-left:.2rem;">
                        <span><i><img src="../../../../assets/images/rent/supply/riqi.png" alt=""></i>{{item.offerTime1}}</span>
                        <span v-show="item.type==1"><i><img src="../../../../assets/images/rent/supply/type.png" alt=""></i>类型：{{item.type1}}</span>
					 </div>
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
        title:''
      };
    },
    methods: {
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
              this.myLib() }
 
      },
        registerList(){
        let data={}
        data.token=this.parameter.token;
        data.pageNo=this.parameter.pageNo;
        data.pageSize=this.parameter.pageSize;
        data.guid=this.$route.params.guid;
        data.orderType=this.$route.params.type;
        
        this.xhr.post(`${this.subUrl.bd}/purchase/registerList`, qs.stringify(data) ).then((res) => {
          if (res.data.code == 1) {
            if(res.data.data.list!=null){
            res.data.data.list.forEach(element => {
               element.offerTime1=element.offerTime.split(' ')[0]
               if(element.status==0){
                 element.status='不通过'
               }else if(element.status==1){
                 element.status="正常"
               }else if(element.status==2){
                 element.status="关闭"
               }
               if(element.type==1){
                 element.type1='招标'
               }else if(element.type==2){
                 element.type1='采购'
               }
               if(element.organInfoDto3.vipType==1){
                 element.vipType='基础'
               }else if(element.organInfoDto3.vipType==2){
                 element.vipType='中级'
               }else if(element.organInfoDto3.vipType==3){
                 element.vipType='高级'
               }else if(element.organInfoDto3.vipType==4){
                 element.vipType='金牌'
               }else if(element.organInfoDto3.vipType==0){
                 element.vipType='';
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
      turnTo(url){
        this.$router.push(url)
      },
      toggle(){
        this.show1=!this.show1
      },
    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = localStorage.getItem('mainColor');
      this.parameter.userId = this.userInfo.guid;
      this.parameter.token = fn.getIng();
      this.title=this.$route.query.title;
      this.registerList();
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

  .lists{width:100%;overflow-y: scroll;height:calc( 100vh - 2.1rem );}
  .libList{width:100%;display:flex;background: white;border-bottom:1px solid #D9D9D9;margin-bottom:.2rem;}
  .libList li{display:flex;height:2.5rem; }
  .libList li:nth-child(1){flex:1;flex-flow:column;padding:.1rem .3rem;justify-content: center;}
  .libList li:nth-child(1)>p{margin-bottom:.1rem;display: flex;align-items: center;}
  .libList li:nth-child(1)>span{display: flex;margin: .07rem 0;}
  .libList li:nth-child(1)>span>i{display:flex;width:.35rem;height:.35rem;
  margin-right:.1rem;}
  .libList li:nth-child(1)>span>i>img{width:100%;height:100%;}
  .libList li:nth-child(1)>p>span:nth-child(2){padding:.02rem .2rem;}
  .libList li:nth-child(1)>p>span:nth-child(3){padding:.02rem .2rem;}
  .libList li:nth-child(1)>p>span{margin-right: .1rem;}
  .libList li:nth-child(1)>div>span>i{display:flex;width:.35rem;height:.35rem;
  margin-right:.1rem;}
  .libList li:nth-child(1)>div>span>i>img{width:100%;height:100%;}
  .libList li:nth-child(1)>div{display: flex;flex-flow: row;justify-content: space-between;margin: .07rem 0;}
  .libList li:nth-child(1)>div>span{display: flex;flex-flow: row;}
</style>