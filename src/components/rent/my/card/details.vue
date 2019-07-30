<template>
  <yd-layout class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'优惠券二维码'" title="优惠券二维码" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span @click="back" slot="left">
                <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
         </span>
      </yd-navbar>
    </div>
    <div class="details" :style="{background:mainColor}">
       <ul>
         <li class="li1">
           <i><img :src="detail.logoUrl" alt=""></i>
           <p>{{detail.shopName}}</p>
         </li>
         <li class="li2">
           <p>{{detail.expandTitle}}</p>
         </li>
         <li class="li3">
           <i><img :src="urlImg" alt=""></i>
         </li>
         <li class="li4">
           <p>票卷编号：{{detail.guid}}</p>
         </li>
         <li class="li5">
            <p style="margin-top:.5rem">使用条件：</p>
            <span style="margin-top:.5rem">{{detail.ruleIntroduction}}</span>
         </li>
         <li class="li5">
            <p>可用时间：</p>
            <span>{{detail.startDate}} - {{detail.endDate}} {{detail.usableTime}}</span>
         </li>
         <li class="li5">
            <p style="margin-bottom:.5rem">消费地址：</p>
            <span style="margin-bottom:.5rem">{{detail.shopAddress}}</span>
         </li>
       </ul>
    </div>
  </yd-layout>
</template>
<script>
  import Vue from 'vue';
  import fn from '@/assets/js/product'
  import qs from 'qs'


  export default {
    data() {
      return {
        mainColor: "",
        organInfo:'',
        userInfo:'',
        userId:'',
        getkey:'',
        detail:{},
        pushInformationId:'',
        urlImg:''
      }

    },
    methods: {
      back(){
        history.back()
      },
      turnTo(url) {
        this.$router.push(url)
      },
      getPushInformation(index){
        var data = {userId: this.userId, token: this.getkey,pushInformationId:this.pushInformationId};

        this.xhr.post(`${this.subUrl.user}/userCoupon/getPushInformation`, qs.stringify(data)).then((res) => {

          if (res.data.code == 1) {
            res.data.data.endDate=res.data.data.endDate.split(' ')[0]
            res.data.data.startDate=res.data.data.startDate.split(' ')[0]
            this.detail=res.data.data;
            
            console.log(this.detail)
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
      },
      getCouponQRCode(){
        this.xhr.get(`${this.subUrl.user}/userCoupon/getCouponQRCode?token=`+this.getkey+'&guid='+this.pushInformationId).then((res) => {
            console.log(res)
           this.urlImg=res.config.url;
        })
      }

      

    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = localStorage.getItem('mainColor');
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      this.pushInformationId=this.$route.query.guid;
      this.getPushInformation()
      this.getCouponQRCode();

    },
    beforeUpdate(){
    }
  }
</script>
<style scoped>
  .layout_my .header:after {
    display: none;

  }
  .layout_my{
background:#F7F7F9;
  }

  .layout_my .blue_box {
    height: 0.88rem;
    background: #0093D2;
    background-size: 100% 100%;
  }
  .details{width:100%;height: calc( 100vh - .88rem );display: flex;
       justify-content: center;align-items:center;}
  .details ul{width:94%;}
  .details ul li{display: flex;}
  .details .li1{background: url("../../../../assets/images/rent/my/list_tops.png") no-repeat left top;
    background-size: 100% 100%;height:1.2rem;padding:.2rem .4rem;}
  .details .li1>i{width:.7rem;height:.7rem;margin-right:.4rem;}
  .details .li1>i>img{width:100%;height:100%;}
  .details .li1>p{font-size: .32rem;font-weight: 600;margin-top:.06rem;}
  .details .li2{background: white;width:100%;justify-content: center;align-items:center;}
  .details .li2>p{font-size:.55rem;padding:.6rem 0 .2rem;}
  .details .li3{background: white;width:100%;justify-content: center;align-items:center;}
  .details .li3>i{width:3.5rem;height:3.5rem;margin:.2rem 0;}
  .details .li3>i>img{width:100%;height:100%;}
  .details .li4{background: white;width:100%;justify-content: center;align-items:center;border-bottom:1px dashed #F6F6F6;}
  .details .li4>p{color:#9F9F9F;font-size: .28rem;margin:.2rem 0 .4rem;}
  .details .li5{background: white;width:100%;padding:.06rem .5rem;font-size:.28rem;}
  .details .li5>p{color:#111}
  .details .li5>span{color:#999}


</style>
