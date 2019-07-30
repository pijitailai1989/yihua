<template>
   <yd-layout class="myLibrary" v-title="'我的采购'">
     <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" title="我的采购" :bgcolor="mainColor" color="#fff">
          <span @click="addshow" slot="right" class="addClickArea edit spanRight" style="color: #fff;font-size:.5rem;">+</span>
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
		   <div class="entrance" style="border-top:1px solid #D9D9D9;">
         <ul>
				  <li @click="turnTo('/supply/purchase/merchant_quotation')">
            <i><img src="../../../assets/images/rent/supply/baojia.png" alt=""></i>
					  <p>商家报价</p>
				  </li>
				  <li @click="turnTo('/supply/purchase/my_inquiry')">
            <i><img src="../../../assets/images/rent/supply/xunpan.png" alt=""></i>
					  <p>我的询盘</p>
				  </li>
				  <li @click="turnTo('/supply/purchase/my_supplier')">
            <i><img src="../../../assets/images/rent/supply/gongshang.png" alt=""></i>
					  <p>我的供应商</p>
				  </li>
			  </ul>
		    </div>
        <yd-tab :active-color="mainColor" :callback="callback">
          <yd-tab-panel label="已上线" style="background:#EFEFEF" tabkey='1'>
            <div class="aa" @scroll="scrollHandler" ref="listDom1">
             <ul class="libList" v-for="(item,index) in libraryList" :key="index">
                <li @click="checks(index)">
                  <i v-if="item.clickImg"><img src="../../../assets/images/rent/baishitong/select_active.png" alt=""></i>
                  <i v-else><img src="../../../assets/images/rent/baishitong/select.png" alt=""></i>
                </li>
                <li @click="turnTo('/supply/purchase/details/'+item.type+'/'+item.guid)">
                     <p>
                       <span class="font32 textHidden" style="width:6rem">【{{item.type2}}】{{item.title}}</span>
                     </p>
                     <span class="font24" style="color:#A7A7A7;margin-left:.2rem;">
                        <i><img src="../../../assets/images/rent/supply/money.png" alt=""></i>
						           {{item.type1}}({{item.countNum}})
						         </span>
                </li>
                <li>
                    <p class="font28" style="color:#A7A7A7;">
						<i><img src="../../../assets/images/rent/supply/riqi.png" alt=""></i>
						{{item.startTime}}</p>
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
          </yd-tab-panel>
          <yd-tab-panel label="已下线" style="background:#EFEFEF" tabkey='2'>
            <div class="aa" @scroll="scrollHandler" ref="listDom2">
             <ul class="libList" v-for="(item,index) in libraryList" :key="index">
                <li @click="checks(index)">
                  <i v-if="item.clickImg"><img src="../../../assets/images/rent/baishitong/select_active.png" alt=""></i>
                  <i v-else><img src="../../../assets/images/rent/baishitong/select.png" alt=""></i>
                </li>
                <li @click="turnTo('/supply/purchase/details/'+item.type+'/'+item.guid)">
                     <p>
                       <span class="font32 textHidden" style="width:6rem">【{{item.type2}}】{{item.title}}</span>
                     </p>
                     <span class="font24" style="color:#A7A7A7;margin-left:.2rem;">
                        <i><img src="../../../assets/images/rent/supply/money.png" alt=""></i>
						           {{item.type1}}({{item.countNum}})
						         </span>
                </li>
                <li>
                    <p class="font28" style="color:#A7A7A7;">
						<i><img src="../../../assets/images/rent/supply/riqi.png" alt=""></i>
						{{item.startTime}}</p>
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
          </yd-tab-panel>
          <yd-tab-panel label="审核中" active style="background:#EFEFEF" tabkey='3'>
            <div class="aa" @scroll="scrollHandler" ref="listDom3">
             <ul class="libList" v-for="(item,index) in libraryList" :key="index">
                <li @click="checks(index)">
                  <i v-if="item.clickImg"><img src="../../../assets/images/rent/baishitong/select_active.png" alt=""></i>
                  <i v-else><img src="../../../assets/images/rent/baishitong/select.png" alt=""></i>
                </li>
                <li @click="turnTo('/supply/purchase/details/'+item.type+'/'+item.guid)">
                     <p>
                       <span class="font32 textHidden" style="width:6rem">【{{item.type2}}】{{item.title}}</span>
                     </p>
                     <span class="font26" style="color:#A7A7A7;margin-left:.2rem;">
                        <i><img src="../../../assets/images/rent/supply/riqi.png" alt=""></i>
						           {{item.startTime}}
						         </span>
                </li>
                <!-- <li>
                    <p class="font28" style="color:#0093D2;">
						<i><img src="" alt=""></i>
						</p>
                </li> -->
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
          </yd-tab-panel>
		      <yd-tab-panel label="未通过" style="background:#EFEFEF" tabkey='4'>
            <div class="aa" @scroll="scrollHandler" ref="listDom4">
             <ul class="libList" v-for="(item,index) in libraryList" :key="index">
                <li @click="checks(index)">
                  <i v-if="item.clickImg"><img src="../../../assets/images/rent/baishitong/select_active.png" alt=""></i>
                  <i v-else><img src="../../../assets/images/rent/baishitong/select.png" alt=""></i>
                </li>
                <li @click="turnTo('/supply/purchase/details/'+item.type+'/'+item.guid)">
                     <p>
                       <span class="font32 textHidden" style="width:6rem">【{{item.type2}}】{{item.title}}</span>
                     </p>
                     <span class="font26" style="color:#A7A7A7;margin-left:.2rem;">
                        <i><img src="../../../assets/images/rent/supply/riqi.png" alt=""></i>
						           {{item.startTime}}
						         </span>
                </li>
                <!-- <li>
                    <p class="font28" style="color:#0093D2;">
						<i><img src="" alt=""></i>
						{{item.startTime}}</p>
                </li> -->
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
          </yd-tab-panel>
		      <yd-tab-panel label="已删除" style="background:#EFEFEF" tabkey='0'>
            <div class="aa" @scroll="scrollHandler" ref="listDom0">
             <ul class="libList" v-for="(item,index) in libraryList" :key="index">
                <li @click="checks(index)">
                  <i v-if="item.clickImg"><img src="../../../assets/images/rent/baishitong/select_active.png" alt=""></i>
                  <i v-else><img src="../../../assets/images/rent/baishitong/select.png" alt=""></i>
                </li>
                <li @click="turnTo('/supply/purchase/details/'+item.type+'/'+item.guid)">
                     <p>
                       <span class="font32 textHidden" style="width:6rem">【{{item.type2}}】{{item.title}}</span>
                     </p>
                     <span class="font26" style="color:#A7A7A7;margin-left:.2rem;">
                        <i><img src="../../../assets/images/rent/supply/riqi.png" alt=""></i>
						           {{item.startTime}}
						         </span>
                </li>
                <!-- <li>
                    <p class="font28" style="color:#0093D2;">
						<i><img src="" alt=""></i>
						</p>
                </li> -->
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
          </yd-tab-panel>
        </yd-tab>
        <div class="checkAll">
           <ul>
              <li @click="checkAll">
                <i v-if="checkAllImg"><img src="../../../assets/images/rent/baishitong/select_active.png" alt=""></i>
                <i v-else><img src="../../../assets/images/rent/baishitong/select.png" alt=""></i>
              </li>
              <li>
                <p class="font32 font600">全选</p>
              </li>
			        <li @click="upAndDownOrder(2)" class="font30" v-if="parameter.state==1" :style="{color:mainColor}">下架</li>
			        <li @click="upAndDownOrder(1)" class="font30" v-if="parameter.state==2" :style="{color:mainColor}">上架</li>
              <li style="border:none;">
                <span class="font30" @click="upAndDownOrder(0)">删除</span>
              </li>
           </ul>
        </div>
     <div class="addSan" v-show="sanShow" @click="toggle2">
       <ul class="font30">
         <li @click="turnTo('/supply/purchase/release_purchase')">发布采购</li>
         <li @click="turnTo('/supply/purchase/tender_invitation')">发布招标</li>
       </ul>
     </div>
   </yd-layout>
</template>
<script type="template/vue">
  import Vue from 'vue';
  import fn from '@/assets/js/product'
  import qs from 'qs'
  import {Search} from 'vue-ydui/dist/lib.rem/search';
  Vue.component(Search.name, Search);
  import {Tab, TabPanel} from 'vue-ydui/dist/lib.rem/tab';
  Vue.component(Tab.name, Tab);
  Vue.component(TabPanel.name, TabPanel);
  import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog';

Vue.prototype.$dialog = {
    confirm: Confirm,
    alert: Alert,
    toast: Toast,
    notify: Notify,
    loading: Loading,
};
  import store from '@/store'
  export default {
    data() {
      return {
        screen:{
          startTime:this.$today(),
          endTime:this.$today()
        },
        mainColor: "",
        organInfo:'',
        userInfo:'',
        value:'',
        libraryList:[],
        libraryList1:[],
        checkAllImg:false,
        parameter:{
          token:'',
          title:'',
          state:3,
          startData:'',
          endData:'',
          pageNo:1,
          pageSize:5,
          pageCount:null,
          poIdList:'',
          typeList:'',
        },
        countNum:{
          fineNum:0,
          uploadNum:0,
          downloadNum:0,
          collectNum:0
        },
        sanShow:false,
        show1:false,
      }

    },
    methods: {
     toggle2() {
        this.sanShow = !this.sanShow
      },
      addshow() {
        this.sanShow = true;
      },
      confirm(){
        this.show1=!this.show1
        this.parameter.startData=this.screen.startTime+' 00:00:01';
        this.parameter.endData=this.screen.endTime+' 23:59:59';
        this.libraryList=[]
        this.parameter.pageNo=1;
        this.orderList();
      },
      toggle(){
        this.show1=!this.show1
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
            arr2.push(element.type)
         })

         if(this.libraryList.length>arr.length){
           this.checkAllImg=false;
         }else if(this.libraryList.length==arr.length){
           this.checkAllImg=true;
         }

         this.parameter.poIdList=arr1.join(',')
         this.parameter.typeList=arr2.join(',')
        //  console.log(this.parameter.poIdList)
        //  console.log(this.parameter.typeList)

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
            arr2.push(element.type)
         })
         this.parameter.poIdList=arr1.join(',')
         this.parameter.typeList=arr2.join(',')
         console.log(this.parameter.poIdList)
         console.log(this.parameter.typeList)
      },
      turnTo(url) {
        this.$turnTo(url,this);
      },
      submitHandler(value) {
          this.$dialog.toast({mes: `产品关键字：${value}`});
          this.parameter.pageNo=1;
          this.orderList()
      },

      scrollHandler(){

        if(store.loading||this.parameter.pageNo > this.parameter.pageCount){
            return
         }

          let listDom = this.$refs.listDom0;
          if(listDom.scrollHeight - listDom.scrollTop - listDom.clientHeight < 70){
              this.orderList() }

          let listDom1 = this.$refs.listDom1;
          if(listDom1.scrollHeight - listDom1.scrollTop - listDom1.clientHeight < 70){
              this.orderList() }

          let listDom2 = this.$refs.listDom2;
          if(listDom2.scrollHeight - listDom2.scrollTop - listDom2.clientHeight < 70){
              this.orderList() }
              let listDom3 = this.$refs.listDom3;
          if(listDom3.scrollHeight - listDom3.scrollTop - listDom3.clientHeight < 70){
              this.orderList() }

          let listDom4 = this.$refs.listDom4;
          if(listDom4.scrollHeight - listDom4.scrollTop - listDom4.clientHeight < 70){
              this.orderList() }

      },
      callback(val,guid){
        this.parameter.pageNo=1;
        // this.parameter.pageSize=5;
        this.parameter.state=guid;
        this.checkAllImg=false;
        console.log(val,guid)
        this.orderList();
        // that.$dialog.loading.open('加载中..');
      },
      orderList(){
        if(this.value==''){
          var data={
          token:this.$route.query.token?this.$route.query.token:this.parameter.token,
          state:this.parameter.state,
          pageNo:this.parameter.pageNo,
          pageSize:this.parameter.pageSize,
          startData:this.parameter.startData,
          endData:this.parameter.endData,
          }
        }else{
           var data={
          token:this.$route.query.token?this.$route.query.token:this.parameter.token,
          state:this.parameter.state,
          pageNo:this.parameter.pageNo,
          pageSize:this.parameter.pageSize,
          title:this.value,
          startData:this.parameter.startData,
          endData:this.parameter.endData,
         }
        }

        this.xhr.post(`${this.subUrl.bd}/purchase/orderList`, qs.stringify(data) ).then((res) => {
          if (res.data.code == 1) {
            this.$dialog.loading.close();
            if(res.data.data.list!=null){
            res.data.data.list.forEach(element => {
               element.startTime=element.startTime.split(' ')[0]
               element.clickImg=false;
               if(element.type==1){
                 element.type2='招标'
                 element.type1='投标'
               }else if(element.type==2){
                 element.type2="采购"
                 element.type1="报价"
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
            console.log(this.libraryList)
          } else if (res.data.code == '-902'){
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      },
      upAndDownOrder(state){
        this.checkAllImg=false;
        var data={
          token:this.parameter.token,
          poIdList:this.parameter.poIdList,
          typeList:this.parameter.typeList,
          state:state
        }
        this.xhr.post(`${this.subUrl.bd}/purchase/upAndDownOrder`, qs.stringify(data) ).then((res) => {
          if (res.data.code == 1) {
            this.libraryList=this.libraryList1
            this.$dialog.toast({mes: '删除成功！'});
            this.orderList()
          } else if (res.data.code == '-902'){
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      },
      getUserInfo(data, cb) {
        this.xhr
          .post(`${this.subUrl.user}/user/getUserInfo`, qs.stringify(data))
          .then(res => {
            if (res.data.code == 1) {
              this.userInfo = res.data.data.userInfo;
              this.organInfo = res.data.data.organInfo;
              localStorage.setItem(
                "userInfo",
                encodeURIComponent(JSON.stringify(res.data.data.userInfo))
              );
              localStorage.setItem(
                "organInfo",
                encodeURIComponent(JSON.stringify(res.data.data.organInfo))
              );
              localStorage.setItem(
                "to",
                encodeURIComponent(this.$route.query.token)
              );
              localStorage.setItem("app", true)
              localStorage.setItem("mainColor",this.$color[this.userInfo.organType]);
              this.parameter.userId = this.$route.query.userId;
              console.log(this.$route.query, '-=-=-=-=-=--')
              fn.setIng(this.$route.query.token);
              console.log(this.$getkey())
              var a = res.data.data.userInfo.organType;
              var b = res.data.data.userInfo.admin ? 1 : 0;
              localStorage.setItem("organType", a);
              localStorage.setItem("isManger", b);
              localStorage.setItem("user_Id", res.data.data.userInfo.guid);
              this.$emit("mainColor", this.$color[a]);
              this.$emit("organType", a);

              cb && cb(res.data);
            } else if (res.data.code == "-902") {
              //-902
              /*重新登录*/
              fn.re_login(this);
            } else {
              this.$dialog.toast({mes: res.data.msg});
            }
          });
      },
    },
    mounted() {
    if(this.$route.query.token){
    this.getUserInfo({token: this.$route.query.token,userId:  this.$route.query.userId},
      res => {
        this.mainColor =  this.$color[this.userInfo.organType];
        this.parameter.token = this.$route.query.token;
        this.parameter.userId = this.$route.query.guid;
         this.orderList()
        })
    }else{
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = localStorage.getItem('mainColor');
      this.parameter.userId = this.userInfo.guid;
      this.parameter.token = fn.getIng();
      this.orderList()
      }
    },
    created(){

    },
    beforeUpdate(){
    }
  }
</script>
<style scoped>
  .addSan {
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0);
    position: fixed;
    left: 0;
    top: 0;
  }

  .addSan ul {
    width: 3rem;
    height: 1.6rem;
    background: white;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    border: 1px solid #E5E5E5;
    border-radius: .1rem;
    position: absolute;
    right: .1rem;
    top: 1rem;
  }

  .addSan ul li:nth-child(1) {
    border-bottom: 1px solid #E5E5E5;
    position: relative;
    z-index: 666;
  }

  .addSan ul li:nth-child(1) > span {
    display: flex;
    width: .25rem;
    height: .25rem;
    position: absolute;
    top: -.25rem;
    z-index: 555;
    right: .15rem;
  }

  .addSan ul li:nth-child(1) > span > img {
    width: 100%;
    height: 100%;
  }

  .addSan ul li {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: .8rem;
  }
  .myLibrary{width:100%;background: #EFEFEF;position: relative;height:100%;}
  .search{width:100%;background:#F7F7F9;position: relative;}
  .search>ul{width:100%;display: flex;align-items:center;}
  .search>ul li:nth-child(2){flex:1;}
  .search>ul li:nth-child(1){width:1.2rem;display: flex;justify-content:center;align-items: center;}

  .entrance{width:100%;margin-bottom:.3rem;background: white;padding:.3rem 0;}
  .entrance>ul{width:100%;display:flex;justify-content: space-around;align-items: center;}
  .entrance>ul>li{display:flex;flex-flow:column;justify-content: center;align-items: center;}
  .entrance>ul>li>i{margin:.1rem 0;width: .6rem;height:.6rem;}
  .entrance>ul>li>i>img{width:100%;height:100%;}

  .aa{margin-bottom: .8rem;overflow-y: scroll;height:calc( 100vh - 5.5rem );}
  .libList{width:100%;display:flex;background: white;border-bottom:1px solid #D9D9D9;}
  .libList li{display:flex;height:1.5rem;}
  .libList li:nth-child(1){width:.7rem;justify-content: center;align-items:center;}
  .libList li:nth-child(1)>i{width:.35rem;height:.35rem;}
  .libList li:nth-child(1)>i>img{width:100%;height:100%;}
  .libList li:nth-child(2){flex:1;flex-flow:column;justify-content: center;}
  .libList li:nth-child(2)>p{margin-bottom:.15rem;display: flex;align-items: center;}
  .libList li:nth-child(2)>span{display: flex;align-items: center;}
  .libList li:nth-child(2)>span>i{display:flex;width:.35rem;height:.35rem;
  margin-right:.1rem;}
  .libList li:nth-child(2)>span>i>img{width:100%;height:100%;}
  .libList li:nth-child(3){width:2.2rem;justify-content:center;align-items: center;}
  .libList li:nth-child(3)>p{display: flex;}
  .libList li:nth-child(3)>p>i{width:.35rem;height:.35rem;margin-right:.1rem;}
  .libList li:nth-child(3)>p>i>img{width:100%;height:100%;}


  .checkAll{position:absolute;width:100%;background: white;height:.8rem;
  bottom:0;left:0;z-index:998;}
  .checkAll ul li{width: 100%;height:100%;}
  .checkAll ul{display: flex;height:100%;}
  .checkAll ul li{border-bottom:1px solid #D9D9D9;border-top:1px solid #D9D9D9;}
  .checkAll ul li:nth-child(1){width:.8rem;display: flex;justify-content: center;align-items:center;}
  .checkAll ul li:nth-child(1)>i{width:.35rem;height:.35rem;}
  .checkAll ul li:nth-child(1)>i>img{width:100%;height:100%;}
  .checkAll ul li:nth-child(2){flex:1;display: flex;align-items: center;}
  .checkAll ul li:nth-child(3){width:1.5rem;height:.8rem;;display: flex;align-items: center;}
  .checkAll ul li:last-child{width:1.5rem;height:.8rem;background: #FF5A5A;color:white;display: flex;
  justify-content: center;align-items: center;}

  .screen {
  width: 100%;
  position: absolute;
  height: calc(100vh - 2.97rem);
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
</style>
