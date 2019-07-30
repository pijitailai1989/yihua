<template>
  <yd-layout class="layout_my">
      <yd-navbar class="header" slot="navbar" v-show="!userAgent.isWX" title="财务送批详情" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span class="addClickArea spanLeft" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
      </yd-navbar>

      <div class="declares" style="margin-bottom:.2rem;">
        <ol>
            <li style="color:#333;font-size:.32rem;" class="font600"><p>{{ocReport.title}}</p></li>
        </ol>
        <ul>
            <li><p>启动时间</p><span v-if="ocReport.startTime">{{ocReport.startTime.split(' ')[0]}}</span></li>
            <li><p>完成时间</p><span v-if="ocReport.endTime">{{ocReport.endTime.split(' ')[0]}}</span></li>
            <li><p>管理处</p><span v-if="ocReport.info">{{ocReport.info.organName}}</span></li>
            <li><p>创建时间</p><span v-if="ocReport.createTime">{{ocReport.createTime.split(' ')[0]}}</span></li>
            <li><p>编制</p><span v-if="ocReport.info">{{ocReport.info.name}}</span></li>
            <li><p>单号</p><span>{{ocReport.guid}}</span></li>
        </ul>
       </div>

      <div class="text" style="margin-bottom:.2rem;">
        <p class="textHidden8">{{ocReport.content}}</p>
        <div class="images">
            <ul>
              <li v-for="(item,index) in commAccessoryList" :key="index" v-if="index<5">
                <img :src="item.path" alt="">
              </li>
            </ul>
        </div>
      </div>

      <div class="declares" style="margin-bottom:.2rem;" v-if="!show">
        <ol>
            <li style="color:#333;"><p>审批信息</p></li>
        </ol>
        <div style="padding: 0 .2rem;height:.4rem;">{{ocReport.reply}}</div>
        <div class="images" style="padding:.2rem .2rem">
            <ul>
              <li v-for="(item,index) in replyAccessoryList" :key="index" v-if="index<5">
                <img :src="item.path" alt="">
              </li>
            </ul>
        </div>
       </div>

      <yd-tabbar slot="tabbar" class="bottoms" v-show="show">
        <span @click="turnTo('/finance/reply?type=0&orId='+orId)"><i><img src="../../../assets/images/rent/supply/disagree.png" alt=""></i>不同意</span>
        <span @click="turnTo('/finance/reply?type=1&orId='+orId)"><i><img src="../../../assets/images/rent/supply/agree.png" alt=""></i>同意</span>
     </yd-tabbar>
  </yd-layout>
</template>
<script>
  import Vue from 'vue';
  import fn from '@/assets/js/product'
  import qs from 'qs'
  import {CountDown} from 'vue-ydui/dist/lib.rem/countdown';
  import {Layout} from 'vue-ydui/dist/lib.rem/layout';
  Vue.component(Layout.name, Layout);
  Vue.component(CountDown.name, CountDown);
  import {Icons} from 'vue-ydui/dist/lib.rem/icons';
  Vue.component(Icons.name, Icons);
  import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog';

  Vue.prototype.$dialog = {
    confirm: Confirm,
    alert: Alert,
    toast: Toast,
    notify: Notify,
    loading: Loading,
  };
  export default {
    data() {
      return {
       logo: 'this.src="' + require('../../../assets/images/rent/supply/photo.png') + '"',
       organInfo:{},
       userInfo:{},
       getkey:'',
       mainColor: "",
       titleT:'',
       guid:'',
       userId:'',
       orId:'',
       productInfo:{},
       organInfoDto3:{},
       productParameterList:[],
       keyword:[],
       alertT:false,
       bm:{
          name:'',
          phone:'',
          code:'',
          remarks:'',
          address:'',
          type:1
        },
        imgList:[],
        priceList:[],
        para:{
          value:''
        },
        commAccessoryList:[],
        ocReport:{},
        replyAccessoryList:[],
        show:true,
      }
    },
    methods: {
      
     toggle(){
       this.show=!this.show;
     },
      turnTo(url) {
        this.$router.push(url)
      },
      back(){
          history.back()
      },
      // 获取列表
       Detail(){
        var data = {token:this.getkey,userId:this.userId,orId:this.orId};
        this.xhr.post(`${this.subUrl.activity}/ownersCom/ocReport/Detail`,qs.stringify(data)).then((res) => {
          console.log(res)
          if (res.data.code == 1) {
             this.commAccessoryList=res.data.data.commAccessoryList
             this.ocReport=res.data.data.ocReport
             if(this.ocReport.status==0){
               this.show=false;
             }else if(this.ocReport.status==1){
               this.show=false;
             }else{
               this.show=true;
             }
             this.replyAccessoryList=res.data.data.replyAccessoryList
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      },

    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = this.$color[this.userInfo.organType]
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      this.orId=this.$route.query.orId;
      this.Detail();
      console.log()
    }
  }
</script>
<style scoped>
  .layout_my .header:after {
    display: none;

  }
  .layout_my{
background:#EEF3FA;
  }

    .declares {
  width: 100%;background: white;
}
.declares>ul>li>span>i{padding:.02rem .02rem;color:#F2725E;border:1px solid #F2725E;
margin-left:.2rem;border-radius: .1rem;}
.declares>ul {
  width: 100%;
  padding: 0.1rem 0.3rem;
}
.declares>ul li {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
}
.declares>ul li > p {
  width: 1.4rem;
  display: flex;
  height: 0.6rem;
  justify-content: flex-end;
  align-items: center;
  font-size: 0.3rem;
  color: #777;
}
.declares>ul li > span {
  flex: 1;
  height: 0.6rem;
  display: flex;
  align-items: center;
  border-radius: 0.05rem;
  margin-left:.2rem;
}
.declares>ul li > span > input {
  width: 100%;
  height: 100%;
  border: none;
  margin-left: 0.1rem;
}

.declares>ol {
  width: 100%;
  margin-bottom:.2rem;
}
.declares>ol li{
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  height:.8rem;
  color: #777;
  padding:0 .4rem;
  align-items: center;
}
.declares>ol li>p{flex:1;height: .8rem;line-height: .8rem;}
.declares>ol li>span{width:1.5rem;height: .8rem;line-height: .8rem;}
.declares>ol li:nth-child(1){
  border-bottom:1px solid #ECECEC;
}

  .text{width:100%;background: white;padding:.2rem .2rem;display: flex;flex-flow: column;align-items: center;}
  .text>ul{width:100%;}
  .text>ul>li{padding:.1rem .1rem;}
  .text>p{width:100%;border:1px solid #EFF1F1;text-indent:.5rem;line-height:.5rem;font-size:.3rem;
  font-weight:600;color:#5A5B5A;padding:.1rem .2rem;}

  .images{width:100%;margin-top:.2rem;display: flex;}
  .images>ul{width:100%;display: flex;flex-flow:row;justify-content:flex-start;align-items:center;}
  .images>ul>li{width:1.2rem;height:1.2rem;border-radius:.1rem;margin-right: .2rem;}
  .images>ul>li>img{width:100%;height:100%;border-radius:.1rem;}

  .bottoms{width:100%;background: white;height:1rem;display: flex;
  justify-content: space-around;}
  .bottoms>span{font-size: .32rem;color: #333;display: flex;
  align-items: center;font-weight: 600;}
  .bottoms>span>i{display:flex;width: .5rem;height:.5rem;margin-right:.2rem;}
  .bottoms>span>i>img{height:100%;width: 100%;}
</style>
