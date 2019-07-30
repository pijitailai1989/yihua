<template>
   <div class="myWealth" v-title="''">
      <div class="headers" :style="{background:mainColor}" >
         <ul>
           <li><span >{{wealth.buyBusinessPoint+wealth.conBusinessPoint}} 商机点</span></li>
           <li><span class="font24">总财富</span></li>
          <li v-show="1==0" class="font26">
          <a @click="turnTo('/my/my_asset/exchange#'+wealth.conIntegral+'#'+wealth.conBusinessPoint)">兑换</a>
          <a @click="turnTo('/my/my_asset/recharge#'+wealth.businessPoint)">充值</a>
           </li>
         </ul>
         <ol>
           <li><span class="font32">{{countNum.uploadNum?countNum.uploadNum:0}}</span><p class="font28">上传文库</p></li>
           <li></li>
           <li><span class="font32">{{countNum.downloadNum?countNum.downloadNum:0}}</span><p class="font28">下载文库</p></li>
           <li></li>
           <li><span class="font32">{{countNum.fineNum?countNum.fineNum:0}}</span><p class="font28">文库罚扣</p></li>
         </ol>
      </div>
      <yd-tab :active-color="mainColor" :callback="callback">
          <yd-tab-panel :label="'我的下载('+countNum.downloadNum+')'" tabkey='2' style="background:#EFEFEF;">
            <div class="aa"  @scroll="scrollHandler" ref="listDom">
              <ul class="lists" v-for="(item,index) in lists" :key="index">
                <li v-if="item.title!=null">
                  <p class="textHidden" @click="turnTo('/baishitong/find/details/'+item.kaId)">{{item.title}}</p>
                  <span>{{item.createDate}}</span>
                </li>
                <li v-else>
                  <p class="textHidden">该信息已被删！</p>
                  <span></span>
                </li>
                <li v-show="item.title!=null">
                  <p>{{item.bp}}商机点</p>
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
          <yd-tab-panel :label="'我的上传('+countNum.uploadNum+')'" tabkey='3' active style="background:#EFEFEF">
            <div class="aa" @scroll="scrollHandler" ref="listDom1">
               <ul class="lists" v-for="(item,index) in lists" :key="index">
                <li>
                  <p @click="turnTo('/baishitong/find/details/'+item.kaId)" class="textHidden">{{item.title}}</p>
                  <span>{{item.createDate}}</span>
                </li>
                <li>
                  <p>{{item.bp}}商机点</p>
                  <span><i><yd-icon name="xiazai" slot="icon" custom size=".3rem"></yd-icon></i>{{item.downloadNum}}</span>
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
          <yd-tab-panel :label="'文库罚扣('+countNum.fineNum+')'" tabkey='4' style="background:#EFEFEF">
            <div class="aa" @scroll="scrollHandler" ref="listDom2">
               <ul class="lists" v-for="(item,index) in lists" :key="index">
                <li v-if="item.title!=null">
                  <p class="textHidden" @click="turnTo('/baishitong/find/details/'+item.kaId)">{{item.title}}</p>
                  <span>{{item.createDate}}</span>
                </li>
                <li v-else>
                  <p class="textHidden">该文库已被删！</p>
                  <span></span>
                </li>
                <li v-show="item.title!=null">
                  <p>{{item.bp}}商机点</p>
                  <span style="color:red;"><i style="font-size:.21rem;color:red;border:1px solid red;border-radius: 50%;
                  display: flex;justify-content:center;align-items:center;">
                    扣</i>{{item.fine}}</span>
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
      </yd-tab>
   </div>
</template>
<script type="template/vue">
  import Vue from 'vue';
  import fn from '@/assets/js/product'
  import qs from 'qs'
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
        mainColor: "",
        organInfo:'',
        userInfo:'',
        lists:[],
        parameter:{
          token:'',
          userId:null,
          type:3,
          pageNo:1,
          pageSize:5,
          pageCount:null,
        },
        countNum:{
          fineNum:0,
          uploadNum:0,
          downloadNum:0
        },
        wealth:{
          buyBusinessPoint:null,
          conBusinessPoint:null,
          conIntegral:null,


        },
        
      }

    },
    watch:{
       'parameter.type':'myLib'
    },
    methods: {
      scrollHandler(){

        if(store.loading||this.parameter.pageNo > this.parameter.pageCount){
            return
         }
          
          let listDom = this.$refs.listDom;
          if(listDom.scrollHeight - listDom.scrollTop - listDom.clientHeight < 100){
              this.myLib() }

          let listDom1 = this.$refs.listDom1;
          if(listDom1.scrollHeight - listDom1.scrollTop - listDom1.clientHeight < 100){
              this.myLib() }
                    
          let listDom2 = this.$refs.listDom2;
          if(listDom2.scrollHeight - listDom2.scrollTop - listDom2.clientHeight < 100){
              this.myLib() }
 
      },
      turnTo(url) {
        this.$router.push(url)
      },
      count(){
        var data={
          userId:this.parameter.userId,
          token:this.parameter.token,
        }
        this.xhr.post(`${this.subUrl.bd}/knowAll/count`, qs.stringify(data) ).then((res) => {
          if (res.data.code == 1) {
            if(res.data.data!=null){
              this.countNum.fineNum=res.data.data.fineNum
              this.countNum.uploadNum=res.data.data.uploadNum
              this.countNum.downloadNum=res.data.data.downloadNum
            }
            
          //  console.log(res.data)
          } else if (res.data.code == '-902'){
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      },
      getUserAsset(){
        var data={
          userId:this.parameter.userId,
          token:this.parameter.token,
        }
        this.xhr.post(`${this.subUrl.user}/asset/getUserAsset`, qs.stringify(data) ).then((res) => {
          if (res.data.code == 1) {
           console.log(res.data)
           if(res.data.data!=null){
             this.wealth=res.data.data;
           }
           
          } else if (res.data.code == '-902'){
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      },
      callback(val,guid){
        this.parameter.pageNo=1;
        this.parameter.pageSize=5;
        this.parameter.type=guid;
        // let that=this;
        // that.$dialog.loading.open('加载中..');
      },
      
      myLib(){
        
        var data={
          userId:this.parameter.userId,
          token:this.parameter.token,
          type:this.parameter.type,
          pageNo:this.parameter.pageNo,
          pageSize:this.parameter.pageSize
        }
        
        this.xhr.post(`${this.subUrl.bd}/knowAll/myLib`, qs.stringify(data) ).then((res) => {
          if (res.data.code == 1) {
            this.$dialog.loading.close();
            if(res.data.data.list!=null){
              res.data.data.list.forEach(element => {
               element.createDate=element.createDate.split(' ')[0]
            }) 
            }
            this.parameter.pageCount=res.data.data.pageCount;
            if(this.parameter.pageNo>=2){
              this.lists=this.lists.concat(res.data.data.list);
            }else{
              this.lists = res.data.data.list;
            }
           this.parameter.pageNo++;
            
            
          } else if (res.data.code == '-902'){
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      },
    },
    created(){
       
    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = localStorage.getItem('mainColor');
      this.parameter.userId = this.userInfo.guid;
      this.parameter.token = fn.getIng();
      this.count();
      this.getUserAsset();
      // this.myLib();


    },
    beforeUpdate(){

    }
  }
</script>
<style scoped>
  
  .myWealth{width:100%;}
  .headers{width:100%;height:3.4rem;position:relative;display: flex;justify-content: center;
   margin-bottom:1rem;}
  .headers>ul{width:100%;display: flex;flex-flow:column;align-items:center;color:white;}
  .headers>ul>li:nth-child(1){font-size:.45rem;padding:.2rem 0;}
  .headers>ul>li:nth-child(3){width:4rem;display: flex;justify-content: space-around;padding:.35rem 0;}
  .headers>ul>li:nth-child(3)>a{border:1px solid white;border-radius: .05rem;padding:.03rem .25rem;}

  .headers>ol{width:94%;height:1.7rem;background: white;border-radius: .2rem;
  position: absolute;bottom:-.75rem;display: flex;justify-content: center;
  align-items: center;left:3%;box-shadow: 0 .05rem .05rem #ccc;}
  .headers>ol>li{display: flex;justify-content: center;align-items: center;flex-flow:column;color:#818181;}
  .headers>ol>li>span{padding:.1rem 0;}
  .headers>ol>li>p{padding:.1rem 0;}
  .headers>ol>li:nth-child(2){background: #F0F0F0;width: 1px;height:1rem;margin:0 .6rem;}
  .headers>ol>li:nth-child(4){background: #F0F0F0;width: 1px;height:1rem;margin:0 .6rem;}
  .aa{overflow-y: scroll;height:calc( 100vh - 7.19rem );}

  .lists{width:100%;height:1.4rem;background: white;margin-top:.2rem;display: flex;flex-flow:column;
  justify-content: center;padding:0 .2rem;}
  .lists li{display: flex;padding:.05rem 0;}
  .lists li:nth-child(1){justify-content: space-between;align-items: center;}
  .lists li:nth-child(1)>p{font-size: .32rem;flex:1;}
  .lists li:nth-child(1)>span{color:#818181;width:2rem;text-align: center;}
  .lists li:nth-child(2){align-items: center;}
  .lists li:nth-child(2)>p{margin-right:.3rem;display: flex;color:#FF8D07;font-size: .24rem;}
  .lists li:nth-child(2)>span{display: flex;align-items:center;font-size: .24rem;color:#818181}
  .lists li:nth-child(2)>span>i{margin-right:.1rem;width:.3rem;height:.3rem;}
  .lists li:nth-child(2)>span>i>img{width:100%;height:100%;}
</style>
