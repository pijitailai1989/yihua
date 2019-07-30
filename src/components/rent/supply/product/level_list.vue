<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" v-title="'客户预约'" :title="titleN" :bgcolor="mainColor" color="#fff">
      <span class="addClickArea" slot="left" @click="back" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
    </yd-navbar>
    
    <div class="texts" style="border-bottom:1px solid #e4e4e4;margin-bottom:.2rem;">
        <span>{{title}}</span>
        <p><span :style="{border:'1px solid '+mainColor,color:mainColor}">{{status}}</span></p>
    </div>

    <div class="search" style="border-top:1px solid #e4e4e4;border-bottom:1px solid #e4e4e4;">
             <ul>
               <li @click="toggle"><span style="color:#999;margin-right:.1rem;">日期</span><yd-icon name='toDown' size='.2rem' custom color="#999"></yd-icon></li>
               <li @click="toggle1"><span style="color:#999;margin-right:.1rem;">状态</span><yd-icon name='toDown' size='.2rem' custom color="#999"></yd-icon></li>
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
             <div v-show="show2" class="screen1">
               <ul v-if="type==3">
                  <li @click="selectS(0)"><p>未报</p></li>
                  <li @click="selectS(1)"><p>已报</p></li>
                  <li @click="selectS(2)"><p>已取消</p></li>
               </ul>
               <ul v-else>
                  <li @click="selectS(0)"><p>未联</p></li>
                  <li @click="selectS(1)"><p>已联</p></li>
                  <li @click="selectS(2)"><p>已取消</p></li>
               </ul>
             </div>
    </div>
    
    <div class="lists" @scroll="scrollHandler" ref="listDom">
             <ul class="libList" v-for="(item,index) in libraryList" :key="index">
                <li @click="turnTo(index,'/supply/product/my_details1/'+type+'/'+item.guid+'?title='+title+'&status='+status+'&productId='+item.productId)">
                     <p>
                       <span class="font32 textHidden" style="width:4.5rem;margin-left:.2rem;">{{item.name}}</span>
                     </p>
                     <span class="font28" style="color:#A7A7A7;margin-left:.2rem;">{{item.address}}
					           </span>
                     <span class="font24" style="color:#A7A7A7;margin-left:.2rem;">
						     <i><img src="../../../../assets/images/rent/supply/riqi.png" alt=""></i>{{item.createTime}}
					           </span>
                </li>
                <li>
                    <p>
                        <span class="font24" :style="{border:'1px solid '+mainColor,color:mainColor}">{{item.state}}</span>
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
        list:['客户预约','客户询价','客户邀联','客户团购','客户邀标','报价/投标'],
        list4:[],
        organInfo,
        mainColor,
        userInfo,
        screen:{
          startTime:this.$today(),
          entTime:this.$today()
        },
        show1:false,
        show2:false,
        libraryList:[],
        libraryList1:[],
        checkAllImg:false,
        parameter:{
          token:'',
          productId:null,
          state:null,
          pageNo:1,
          pageSize:10,
          pageCount:0,
          businessName:'',
          startDate:'',
          endDate:''
        },
        value:'',
        title:'',
        status:'',
        titleN:'',
        type:null,
      };
    },
    methods: {
      confirm(){
        this.parameter.startDate=this.screen.startTime;
        this.parameter.endDate=this.screen.entTime;
        this.parameter.pageNo=1;
        this.libraryList=[]
        if(this.$route.params.type==1){
                  this.bespeakList();
                }else if(this.$route.params.type==2){
                  this.productInquiryList()
                }else if(this.$route.params.type==3){
                  this.productContactList()
                }else if(this.$route.params.type==4){
                  this.productGroupList()
                }
        this.parameter.endDate=''
        this.parameter.startDate=''
        this.show1=!this.show1
      },
      selectS(state){
        this.parameter.state=state;
        this.parameter.pageNo=1;
        this.libraryList=[]
        if(this.$route.params.type==1){
                  this.bespeakList();
                }else if(this.$route.params.type==2){
                  this.productInquiryList()
                }else if(this.$route.params.type==3){
                  this.productContactList()
                }else if(this.$route.params.type==4){
                  this.productGroupList()
                }
                this.parameter.state=null
        this.show2=!this.show2
      },
      turnTo(index,url) {
        this.$router.push(url)
        localStorage.setItem('details',encodeURIComponent(JSON.stringify(this.libraryList[index])));
      },
        submitHandler(value) {
                this.$dialog.toast({mes: `产品关键字：${value}`});
                this.parameter.pageNo=1;
                this.parameter.businessName=value;
                this.libraryList=[]
                if(this.$route.params.type==1){
                  this.bespeakList();
                }else if(this.$route.params.type==2){
                  this.productInquiryList()
                }else if(this.$route.params.type==3){
                  this.productContactList()
                }else if(this.$route.params.type==4){
                  this.productGroupList()
                }
               this.parameter.businessName=''  
       },
        scrollHandler(){

        if(store.loading||this.parameter.pageNo > this.parameter.pageCount){
            return
         }
          
          let listDom = this.$refs.listDom;
          if(listDom.scrollHeight - listDom.scrollTop - listDom.clientHeight < 100){
              if(this.$route.params.type==1){
        this.bespeakList();
      }else if(this.$route.params.type==2){
        this.productInquiryList()
      }else if(this.$route.params.type==3){
        this.productContactList()
      }else if(this.$route.params.type==4){
        this.productGroupList()
      }
              }
 
      },
      //预约
        bespeakList(){
        let data={}
        if(this.parameter.startDate!='') data.startDate=this.parameter.startDate+' 00:00:00';
        if(this.parameter.endDate!='') data.endDate=this.parameter.endDate+' 23:59:59';
        if(this.parameter.state!=null) data.state=this.parameter.state;
        data.token=this.parameter.token;
        data.productId=this.$route.params.guid;
        if(this.parameter.businessName!=''){
             data.businessName=this.parameter.businessName;
        }
        data.pageNo=this.parameter.pageNo;
        data.pageSize=this.parameter.pageSize;
        this.xhr.post(`${this.subUrl.bd}/opportunity/bespeakList`, qs.stringify(data) ).then((res) => {
          if (res.data.code == 1) {
            console.log(res.data.data.list)
            if(res.data.data.list!=null){
            res.data.data.list.forEach(element => {
               element.createTime=element.createTime.split(' ')[0]
              //  element.releaseTime=element.releaseTime.split(' ')[0]
               element.clickImg=false;
               if(element.state==0){
                 element.state='未联'
               }else if(element.state==1){
                 element.state="已联"
               }else if(element.state==2){
                 element.state="已取消"
               }
               if(element.type==1){
                 element.type1='招标'
               }else if(element.type==2){
                 element.type1='采购'
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
      //邀联
      productContactList(){
        let data={}
        if(this.parameter.startDate!='') data.startDate=this.parameter.startDate+' 00:00:00';
        if(this.parameter.endDate!='') data.endDate=this.parameter.endDate+' 23:59:59';
         if(this.parameter.state!=null) data.state=this.parameter.state;
        data.token=this.parameter.token;
        data.productId=this.$route.params.guid;
        if(this.parameter.businessName!=''){
             data.businessName=this.parameter.businessName;
        }
        data.pageNo=this.parameter.pageNo;
        data.pageSize=this.parameter.pageSize;
        this.xhr.post(`${this.subUrl.bd}/opportunity/productContactList`, qs.stringify(data) ).then((res) => {
          if (res.data.code == 1) {
            console.log(res.data.data.list)
            if(res.data.data.list!=null){
            res.data.data.list.forEach(element => {
               element.name=element.businessName;
               element.createTime=element.createTime.split(' ')[0]
              //  element.releaseTime=element.releaseTime.split(' ')[0]
               element.clickImg=false;
               if(element.state==0){
                 element.state='未联'
               }else if(element.state==1){
                 element.state="已联"
               }else if(element.state==2){
                 element.state="已取消"
               }
               if(element.type==1){
                 element.type1='招标'
               }else if(element.type==2){
                 element.type1='采购'
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
      productInquiryList(){
        let data={}
        if(this.parameter.startDate!='') data.startDate=this.parameter.startDate+' 00:00:00';
        if(this.parameter.endDate!='') data.endDate=this.parameter.endDate+' 23:59:59';
         if(this.parameter.state!=null) data.state=this.parameter.state;
        data.token=this.parameter.token;
        data.productId=this.$route.params.guid;
        if(this.parameter.businessName!=''){
             data.businessName=this.parameter.businessName;
        }
        data.pageNo=this.parameter.pageNo;
        data.pageSize=this.parameter.pageSize;
        this.xhr.post(`${this.subUrl.bd}/opportunity/productInquiryList`, qs.stringify(data) ).then((res) => {
          if (res.data.code == 1) {
            console.log(res.data.data.list)
            if(res.data.data.list!=null){
            res.data.data.list.forEach(element => {
               element.name=element.businessName;
               element.createTime=element.messageTime.split(' ')[0]
              //  element.releaseTime=element.releaseTime.split(' ')[0]
               element.clickImg=false;
               if(element.state==0){
                 element.state='未报'
               }else if(element.state==1){
                 element.state="已报"
               }else if(element.state==2){
                 element.state="已删除"
               }
               if(element.type==1){
                 element.type1='招标'
               }else if(element.type==2){
                 element.type1='采购'
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
      //团购列表
      productGroupList(){
        let data={}
        if(this.parameter.startDate!='') data.startDate=this.parameter.startDate+' 00:00:00';
        if(this.parameter.endDate!='') data.endDate=this.parameter.endDate+' 23:59:59';
         if(this.parameter.state!=null) data.state=this.parameter.state;
        data.token=this.parameter.token;
        data.productId=this.$route.params.guid;
        if(this.parameter.businessName!=''){
             data.businessName=this.parameter.businessName;
        }
        data.pageNo=this.parameter.pageNo;
        data.pageSize=this.parameter.pageSize;
        this.xhr.post(`${this.subUrl.bd}/opportunity/productGroupList`, qs.stringify(data) ).then((res) => {
          if (res.data.code == 1) {
            console.log(res.data.data.list)
            if(res.data.data.list!=null){
            res.data.data.list.forEach(element => {
               element.createTime=element.createTime.split(' ')[0]
               element.clickImg=false;
               if(element.state==0){
                 element.state='未联'
               }else if(element.state==1){
                 element.state="已联"
               }else if(element.state==2){
                 element.state="已取消"
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
      
      toggle(){
        this.show1=!this.show1
        this.show2=false
      },
      toggle1(){
        this.show2=!this.show2
        this.show1=false
      },
      leftTab(){
        this.list4=[this.list[0],this.list[1],this.list[2],this.list[3]]
      },
      rightTab(){
        this.list4=[this.list[2],this.list[3],this.list[4],this.list[5]]
      }
    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = localStorage.getItem('mainColor');
      this.list4=[this.list[0],this.list[1],this.list[2],this.list[3]]
      this.parameter.userId = this.userInfo.guid;
      this.parameter.token = fn.getIng();
      this.status=this.$route.query.status;
      this.title=this.$route.query.title;

      console.log(this.$route)
      if(this.$route.params.type==1){
        this.bespeakList();
        this.titleN='客户预约'
        this.type=1
      }else if(this.$route.params.type==2){
        this.productInquiryList()
        this.titleN='客户询价'
        this.type=3
      }else if(this.$route.params.type==3){
        this.productContactList()
        this.titleN='客户邀联'
        this.type=4
      }else if(this.$route.params.type==4){
        this.titleN='客户团购'
        this.type=2
        this.productGroupList()
      }
    }
  };
</script>
<style scoped>
.texts{width: 100%;display: flex;justify-content: space-between;padding:0 .3rem;background: white;}
.texts>span{flex:1;font-size: .32rem;font-weight: 600;height:1rem;display: flex;align-items: center;}
.texts>p{width:1.8rem;height:1rem;display: flex;align-items: center;justify-content: center;}
.texts>p>span{padding:.01rem .03rem;font-size: .24rem;border-radius: .05rem;}

.tab{width: 100%;background: white;}
.tab>ul{width:100%;display: flex;justify-content: center;align-items: center;}
.tab>ul>li:first-child{width:.5rem;}
.tab>ul>li:nth-child(2){flex:1;}
.tab>ul>li:last-child{width:.5rem;}
.tab>ul>li{display: flex;justify-content: center;align-items: center;}
.tab>ul>li>span{font-size:.4rem;}

.texts

  .search{width:100%;background:#F7F7F9;position: relative;}
  .search>ul{width:100%;display: flex;align-items:center;}
  .search>ul li:nth-child(3){flex:1;}
  .search>ul li:nth-child(1){width:1.2rem;display: flex;justify-content:center;align-items: center;}
  .search>ul li:nth-child(2){width:1.2rem;display: flex;justify-content:center;align-items: center;}

  .screen1 {
  width: 100%;
  position: absolute;
  height: calc(100vh - 3.1rem);
  background: rgba(0, 0, 0, 0.1);
  z-index: 999;
  left: 0;
  border-top:1px solid #D9D9D9;
}
.screen1 ul {
  background: #f6f6f6;
}
.screen1 ul li {
  height:.8rem;border-bottom:1px solid #D9D9D9;padding:0 .4rem;
  display: flex;align-items: center;font-size: .32rem;
}
.screen {
  width: 100%;
  position: absolute;
  height: calc(100vh - 3.1rem);
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

  .lists{width:100%;overflow-y: scroll;height:calc( 100vh - 3.2rem );}
  .libList{width:100%;display:flex;background: white;border-bottom:1px solid #D9D9D9;}
  .libList li{display:flex;height:1.8rem; }
  .libList li:nth-child(1){flex:1;flex-flow:column;padding:.1rem .3rem;justify-content: center;}
  .libList li:nth-child(1)>p{margin-bottom:.2rem;display: flex;align-items: center;}
  .libList li:nth-child(1)>span{display: flex;align-items: center;margin-bottom: .1rem;}
  .libList li:nth-child(1)>span>i{display:flex;width:.35rem;height:.35rem;
  margin-right:.1rem;}
  .libList li:nth-child(1)>span>i>img{width:100%;height:100%;}
  .libList li:nth-child(2){width:3rem;flex-flow:column;justify-content:center;align-items: center;}
  .libList li:nth-child(2)>p{margin-bottom:.1rem;}
  .libList li:nth-child(2)>p>span{padding:.02rem .02rem;font-size: .24rem;border-radius: .05rem;}
  .libList li:nth-child(2)>span{display: flex;}
  .libList li:nth-child(2)>span>i{width:.35rem;height:.35rem;margin-right:.1rem;}
  .libList li:nth-child(2)>span>i>img{width:100%;height:100%;}
</style>