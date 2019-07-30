<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" v-title="'我的商机'" title="我的商机" :bgcolor="mainColor" color="#fff">
      <span class="addClickArea" slot="left" @click="back" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
      <span class="addClickArea" @click="turnTo('/supply/product/purchase_collection')" slot="right" style="color: #fff;">我的收藏</span>
    </yd-navbar>
    <div class="search">
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
                 <span><yd-datetime type="date" v-model="screen.endTime" slot="right"></yd-datetime></span>
               </li>
               <li>
                <button @click="toggle">取消</button>
                <button @click="confirm" class="bb">确定</button>
               </li>
               </ul>
              </div>
    </div>

    <div class="tab">
        <ul>
            <li @click="leftTab"><span :style="{color:mainColor}">&nbsp;<&nbsp;</span></li>
            <li>
                <yd-tab :active-color="mainColor" style="width:100%;" :callback="callback">
                     <yd-tab-panel active label="客户邀标" tabkey="yb"></yd-tab-panel>
                     <yd-tab-panel label="报价/投标" tabkey="bj"></yd-tab-panel>
                </yd-tab>
            </li>
            <li @click="rightTab"><span style="color:#999">&nbsp;>&nbsp;</span></li>
        </ul>
    </div>

    <div class="lists" @scroll="scrollHandler" ref="listDom">
             <ul class="libList" v-for="(item,index) in libraryList" :key="index">
                <li @click="checks(index)">
                  <i v-if="item.clickImg"><img src="../../../../assets/images/rent/baishitong/select_active.png" alt=""></i>
                  <i v-else><img src="../../../../assets/images/rent/baishitong/select.png" alt=""></i>
                </li>
                <li v-if="item.type==5" @click="turnTo('/supply/purchase/details/1/'+item.poId+'?type1=1')">
                     <p>
                       <span class="font32 textHidden" style="width:4rem">{{item.organName}}</span>
                     </p>
                     <p>
                       <span v-if="item.organInfoDto3!=null">{{item.organInfoDto3.organName}}</span>
                       <span v-if="item.organAddress!=null">{{item.organAddress}}</span>
                     </p>
                     <span class="font24" style="color:#A7A7A7;">
                        <i><img src="../../../../assets/images/rent/supply/riqi.png" alt=""></i>
						           {{item.offerTime}}
					           </span>
                </li>
                <li v-else @click="turnTo('/supply/purchase/details/'+item.type+'/'+item.poId+'?a='+item.myExplain+'&b='+item.myOffer+'&c='+item.offerTime)">
                     <p>
                       <span class="font32 textHidden" style="width:4rem">【{{item.type1}}】{{item.title}}</span>
                     </p>
                     <p>
                       <span v-if="item.organInfoDto3!=null">{{item.organInfoDto3.organName}}</span>
                       <span v-if="item.organAddress!=null">{{item.organAddress}}</span>
                     </p>
                     <span class="font24" style="color:#A7A7A7;">
                        <i><img src="../../../../assets/images/rent/supply/riqi.png" alt=""></i>
						           {{item.offerTime}}
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
                <span v-show="parameter.type=='yb'" class="font30" @click="delInvitedMark">删除</span>
                <span v-show="parameter.type=='bj'" class="font30" @click="delRegister">删除</span>
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
        list:['客户邀标','报价/投标'],
        screen:{
          startTime:this.$today(),
          endTime:this.$today()
        },
        show1:false,
        checkAllImg:false,
        parameter:{
          token:'',
          userId:null,
          type:'',
          pageNo:1,
          startTime:'',
          endTime:'',
          pageSize:6,
          pageCount:0,
          guidList:'',
          title:'',
        },
        value:'',
        libraryList:[],
        libraryList1:[],
      };
    },
    watch:{
      'parameter.type':'tabFn'
    },
    methods: {
       tabFn(){
         this.parameter.pageNo=1;
         this.parameter.pageSize=6;
         this.parameter.pageCount=0;
         this.parameter.startTime='';
         this.parameter.endTime='';
         this.libraryList=[]
         if(this.parameter.type=='bj'){
           this.myRegisterList()
         }else if(this.parameter.type=='yb'){
           this.invitedMarkList()
         }
       },
       turnTo(url){
           this.$router.push(url)
       },
       leftTab(){
        this.$router.push('/supply/product/my_business');
      },
      rightTab(){
        this.$router.push('/supply/product/my_businesss');
      },
      back() {
        this.$router.go(-1);
      },
      confirm(){
        this.show1=!this.show1
        this.parameter.pageNo=1;
        this.parameter.startTime=this.screen.startTime
        this.parameter.endTime=this.screen.endTime
        this.libraryList=[]
        if(this.parameter.type=='bj'){
                   this.myRegisterList()
                 }else if(this.parameter.type=='yb'){
                   this.invitedMarkList()
                 }
        this.parameter.startTime=''
        this.parameter.endTime=''
      },
      toggle(){
        this.show1=!this.show1
        
      },
      submitHandler(value) {
                this.$dialog.toast({mes: `产品关键字：${value}`});
                this.parameter.pageNo=1;
                this.parameter.title=value;
                if(this.parameter.type=='bj'){
                   this.myRegisterList()
                 }else if(this.parameter.type=='yb'){
                   this.invitedMarkList()
                 }
                
       },
        scrollHandler(){

        if(store.loading||this.parameter.pageNo > this.parameter.pageCount){
            return
         }
          
          let listDom = this.$refs.listDom;
          if(listDom.scrollHeight - listDom.scrollTop - listDom.clientHeight < 100){
              if(this.parameter.type=='bj'){
                  this.myRegisterList()
                }else if(this.parameter.type=='yb'){
                  this.invitedMarkList()
                }
          }
 
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
      },
      callback(val,guid){
        this.parameter.pageNo=1;
        this.parameter.pageSize=6;
        this.parameter.type=guid;
        this.checkAllImg=false;
      },
        myRegisterList(){
        let data={}
        data.token=this.parameter.token;
        if(this.parameter.startTime!=''){
          data.startTime=this.parameter.startTime+' 00:00:01';
        }
        if(this.parameter.endTime!=''){
          data.endTime=this.parameter.endTime+' 23:59:59';
        }
        if(this.parameter.title!='') data.title=this.parameter.title;
        data.pageNo=this.parameter.pageNo;
        data.pageSize=this.parameter.pageSize;
        this.xhr.post(`${this.subUrl.bd}/opportunity/myRegisterList`, qs.stringify(data) ).then((res) => {
          if (res.data.code == 1) {
            this.$dialog.loading.close();
            if(res.data.data.list!=null){
            res.data.data.list.forEach(element => {
               element.offerTime=element.offerTime.split(' ')[0]
               element.clickImg=false;
               if(element.type==1){
                 element.type1='招标'
               }else if(element.type==2){
                 element.type1='采购'
               }
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
          } else if (res.data.code == '-902'){
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      },
      //邀标列表
      invitedMarkList(){
        let data={}
        data.token=this.parameter.token;
        if(this.parameter.startTime!=''){
          data.startTime=this.parameter.startTime+' 00:00:01';
        }
        if(this.parameter.endTime!=''){
          data.endTime=this.parameter.endTime+' 23:59:59';
        }
        if(this.parameter.title!='') data.title=this.parameter.title;
        data.pageNo=this.parameter.pageNo;
        data.pageSize=this.parameter.pageSize;
        this.xhr.post(`${this.subUrl.bd}/opportunity/invitedMarkList`, qs.stringify(data) ).then((res) => {
          if (res.data.code == 1) {
            if(res.data.data.list!=null){
            res.data.data.list.forEach(element => {
               element.offerTime=element.createTime.split(' ')[0]
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
          } else if (res.data.code == '-902'){
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      },
      delInvitedMark(){
        if(this.parameter.guidList==''){
          this.$dialog.toast({mes: '请选择操作对象！'});
          return
        }
        this.checkAllImg=false;
        var data={
          token:this.parameter.token,
          guidList:this.parameter.guidList,
        }
        this.xhr.post(`${this.subUrl.bd}/opportunity/delInvitedMark`, qs.stringify(data) ).then((res) => {
          if (res.data.code == 1) {
            this.libraryList=this.libraryList1
            this.$dialog.toast({mes: '操作成功！'});
            this.parameter.pageNo=1;
            this.invitedMarkList()
          } else if (res.data.code == '-902'){
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      },


      delRegister(){
        if(this.parameter.guidList==''){
          this.$dialog.toast({mes: '请选择操作对象！'});
          return
        }
        this.checkAllImg=false;
        var data={
          token:this.parameter.token,
          guidList:this.parameter.guidList,
        }
        this.xhr.post(`${this.subUrl.bd}/opportunity/delRegister`, qs.stringify(data) ).then((res) => {
          if (res.data.code == 1) {
            this.libraryList=this.libraryList1
            this.$dialog.toast({mes: '操作成功！'});
            this.parameter.pageNo=1;
                this.myRegisterList()

          } else if (res.data.code == '-902'){
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      }
    },
    mounted() {
      this.parameter.userId = this.userInfo.guid;
      this.parameter.token = fn.getIng();
      console.log(this.parameter.type)
      // this.myRegisterList();
    }
  };
</script>
<style scoped>

.tab{width: 100%;background: white;}
.tab>ul{width:100%;display: flex;justify-content: center;align-items: center;}
.tab>ul>li:first-child{width:.5rem;}
.tab>ul>li:nth-child(2){flex:1;}
.tab>ul>li:last-child{width:.5rem;}
.tab>ul>li{display: flex;justify-content: center;align-items: center;}
.tab>ul>li>span{font-size:.4rem;}

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

  .lists{overflow-y: scroll;height:calc( 100vh - 2.93rem );}
  .libList{width:100%;display:flex;background: white;border-bottom:1px solid #D9D9D9;}
  .libList li{display:flex;height:2rem;}
  .libList li:nth-child(1){width:.7rem;justify-content: center;align-items:center;}
  .libList li:nth-child(1)>i{width:.35rem;height:.35rem;}
  .libList li:nth-child(1)>i>img{width:100%;height:100%;}
  .libList li:nth-child(2){flex:1;flex-flow:column;justify-content: center;}
  .libList li:nth-child(2)>p{margin-bottom:.1rem;display: flex;align-items: center;}
  .libList li:nth-child(2)>p:nth-child(2)>span{padding:.02rem 0;
  margin-left:.2rem;font-size: .26rem;color:#999;}

  .libList li:nth-child(2)>span{display: flex;}
  .libList li:nth-child(2)>span>i{display:flex;width:.35rem;height:.35rem;
  margin-right:.1rem;}
  .libList li:nth-child(2)>span>i>img{width:100%;height:100%;}
  .libList li:nth-child(3){width:1.2rem;flex-flow:column;justify-content: center;align-items: flex-start;}
  .libList li:nth-child(3)>p{margin-bottom:.1rem;display: flex;align-items: center;}
  .libList li:nth-child(3)>p>span{padding:.02rem .02rem;font-size: .24rem;color:#999;border-radius: .05rem;}

  .libList li:nth-child(3)>span{display: flex;}
  .libList li:nth-child(3)>span>i{display:flex;width:.35rem;height:.35rem;
  margin-right:.1rem;}
  .libList li:nth-child(3)>span>i>img{width:100%;height:100%;}

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