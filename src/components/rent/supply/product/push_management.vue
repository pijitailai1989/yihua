<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" v-title="'推送管理'" title="推送管理" :bgcolor="mainColor" color="#fff">
      <span class="addClickArea" slot="left" @click="back" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
      <span @click="turnTo('/supply/product/push_set')" slot="right" style="color:#fff;font-size:.3rem;margin-right:.2rem;">设置</span>
      <span @click="turnTo('/supply/product/push_information')" slot="right" style="color:#fff;font-size:.55rem;">+</span>
    </yd-navbar>
    <div class="search" style="border-bottom:1px solid #e4e4e4;">
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
               <ul>
                  <li @click="selectS(1)"><p>正常</p></li>
                  <li @click="selectS(2)"><p>失效</p></li>
               </ul>
             </div>
    </div>

    <div class="lists" @scroll="scrollHandler" ref="listDom">
             <ul class="libList" v-for="(item,index) in libraryList" :key="index">
                <li @click="checks(index)">
                  <i v-if="item.clickImg"><img src="../../../../assets/images/rent/baishitong/select_active.png" alt=""></i>
                  <i v-else><img src="../../../../assets/images/rent/baishitong/select.png" alt=""></i>
                </li>
                <li>
                     <p>
                       <span class="font32 textHidden" style="width:4rem;margin-left:.2rem;">{{item.expandTitle}}</span>
                     </p>
                     <span style="color:#A7A7A7;margin-left:.2rem;margin-bottom:.1rem;">
                        <i><img src="../../../../assets/images/rent/supply/type.png" alt=""></i>
						  {{item.type}}
					</span>
                     <span class="font24" style="color:#A7A7A7;margin-left:.2rem;">
                        <i><img src="../../../../assets/images/rent/supply/riqi.png" alt=""></i>
						  {{item.createDate}}
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
                <span class="font30" @click="delPush">删除</span>
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
      return {
        organInfo:{},
        mainColor:"",
        userInfo:{},
        screen:{
          startTime:this.$today(),
          entTime:this.$today()
        },
        show1:false,
        show2:false,
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
          expandTitle:'',
          keyword:'',
          guidList:'',
        },
        value:'',
        libraryList:[],
        libraryList1:[],
      };
    },
    methods: {
      selectS(state){
        this.parameter.state=state;
        this.parameter.pageNo=1;
        this.libraryList=[]
        this.pushInfoList()
        this.parameter.state=null
        this.show2=!this.show2
      },
      turnTo(url){
          this.$router.push(url)
      },
      delPush(){
        this.checkAllImg=false;
        if(this.parameter.guidList==''){
          return
          this.$dialog.toast({mes: '请选择对象！'});
        }
        var data={
          token:this.parameter.token,
          guidList:this.parameter.guidList
        }
        this.xhr.post(`${this.subUrl.bd}/opportunity/delPush`, qs.stringify(data) ).then((res) => {
          if (res.data.code == 1) {
            this.libraryList=this.libraryList1
            this.$dialog.toast({mes: '删除成功！'});
            this.pushInfoList()
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
      confirm(){
        this.parameter.startDate=this.screen.startTime;
        this.parameter.endDate=this.screen.entTime;
        this.parameter.pageNo=1;
        this.libraryList=[]
        this.pushInfoList()
        this.parameter.endDate=''
        this.parameter.startDate=''
        this.show1=!this.show1
      },
      toggle(){
        this.show1=!this.show1
        this.show2=false
      },
      toggle1(){
        this.show2=!this.show2
        this.show1=false
      },
      submitHandler(value) {
                this.$dialog.toast({mes: `产品关键字：${value}`});
                this.parameter.pageNo=1;
                this.parameter.expandTitle=value;
                this.libraryList=[]
                this.pushInfoList()
               this.parameter.expandTitle=''

       },
        scrollHandler(){

        if(store.loading||this.parameter.pageNo > this.parameter.pageCount){
            return
         }

          let listDom = this.$refs.listDom;
          if(listDom.scrollHeight - listDom.scrollTop - listDom.clientHeight < 100){
              this.pushInfoList() }

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
        if(this.parameter.startDate!='') data.startDate=this.parameter.startDate+' 00:00:00';
        if(this.parameter.endDate!='') data.endDate=this.parameter.endDate+' 23:59:59';
         if(this.parameter.state!=null) data.state=this.parameter.state;
         if(this.parameter.expandTitle!='') data.expandTitle=this.parameter.expandTitle;
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
      if(this.$route.query.token){
        this.$getUserInfo(res=>{
          this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
          this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
          this.mainColor = this.$color[this.userInfo.organType]
          this.parameter.userId = this.userInfo.guid;
          this.parameter.token = fn.getIng();
          this.pushInfoList();
        },this)
      }else{
        this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
        this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
        this.mainColor = this.$color[this.userInfo.organType]
        this.parameter.userId = this.userInfo.guid;
        this.parameter.token = fn.getIng();
        this.pushInfoList();
      }

    }
  };
</script>
<style scoped>
  .search{width:100%;background:#F7F7F9;position: relative;margin-bottom:.2rem;}
  .search>ul{width:100%;display: flex;align-items:center;}
  .search>ul li:nth-child(3){flex:1;}
  .search>ul li:nth-child(1){width:1.2rem;display: flex;justify-content:center;align-items: center;}
  .search>ul li:nth-child(2){width:1.2rem;display: flex;justify-content:center;align-items: center;}
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

  .lists{overflow-y: scroll;height:calc( 100vh - 2.88rem );}
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
  .libList li:nth-child(3){width:1rem;flex-flow:column;justify-content: center;align-items: flex-start;}
  .libList li:nth-child(3)>p{margin-bottom:.1rem;display: flex;align-items: center;}
  .libList li:nth-child(3)>p>span{padding:.02rem .02rem;font-size: .24rem;border-radius: .05rem;}

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
