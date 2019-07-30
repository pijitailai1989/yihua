<template>
  <div class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'确认支付'" title="确认支付" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span class="spanLeft" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
         </span>
      </yd-navbar>
    </div>

 <div class="payment font30">
      <ul>
          <li>
             <p>当前商机点：</p>
             <span class="font600">{{sNum}}</span>
          </li>
          <li>
             <p>充值金额：</p>
             <span class="font600">{{price}}</span>元
          </li>
          <li>
             <p>总商机点：</p>
             <span class="font600">{{sNum+price}}</span>
          </li>
      </ul>
 </div>

  <div class="conpay">
    <ul>
        <li>
           <span class="font24">支付方式</span>
        </li>
        <li class="payType" v-for="(item,index) in radios" @click="toggle(index)" :key="index">
             <span><img :src="item.icon" alt=""></span>
             <p class="font30 font600">{{item.type}}</p>
             <i v-show="num==index" class="font30" :style="'background:'+mainColor">✔</i>
        </li>

    </ul>

    <div class="buttonp">
        <button class="font30 font600" :style="'background:'+mainColor">立即开通</button>
        <p class="font24">会员服务条款 | 会员特权说明</p>
    </div>
  </div>


  </div>
</template>
<script>
  import Vue from 'vue';
  import fn from '@/assets/js/product'
  import qs from 'qs'


  export default {
    data() {
      return {
        mainColor: "",
        num:0,
        num1:0,
        userInfo:'',
        organInfo:'',
        radios:[
            {icon:require('../../../../assets/images/rent/my/wei.png'),type:'1'},
            {icon:require('../../../../assets/images/rent/my/zhi.png'),type:'2'}
        ],
        totals:0,
        buyType:{},
        sNum:0,
        price:0

      }
    },
    computed:{

    },
    methods: {
      turnTo(url) {
        this.$router.push(url)
      },
      back(){
        this.$router.go(-1)
      },
      toggle(index){
          this.num=index;
      }
    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = localStorage.getItem('mainColor');
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      this.userId = this.userInfo.guid;

      this.sNum = JSON.parse(decodeURIComponent(localStorage.getItem('sNum')));
      this.price = JSON.parse(decodeURIComponent(localStorage.getItem('price')));

      console.log(this.$router)

      this.radios.forEach(function(item){
         if(item.type==1){
           item.type='微信'
         }else if(item.type==2){
           item.type="支付宝"
         }
       })
    },
    beforeUpdate(){
       this.num=this.num;
    }
  }
</script>
<style scoped>
  .layout_my .header:after {
    display: none;

  }
  .layout_my{
     background: #F7F7F9;
     width:100mv;
     height:100vh;
  }

  .layout_my .blue_box {
    height: 0.88rem;
    background-size: 100% 100%;
  }

  .payment{width:100%}
  .payment ul{width:100%;background:white;}
  .payment ul li{display:flex;flex-flow:row;align-items:center;border-bottom:1px solid #F7F7F7;padding:.2rem 0;}
  .payment ul li p{width:1.9rem;text-align:right;}


  .conpay{width:100%;}
  .conpay ul{width:100%;}
  .conpay ul li{background:white;width:100%;display:flex;flex-direction:row;height:.9rem;align-items:center;
  border-bottom:1px solid #EFEFF0;padding:0 .3rem}
  .conpay ul li img{width:100%;height:100%;}
  .conpay ul li:nth-child(1){background:none;height:.8rem;}
  .conpay ul li:nth-child(2)>span{width:.6rem;height:.6rem;margin-right:0.2rem;}
  .payType>span{width:.6rem;height:.6rem;margin-right:.2rem;}
  .payType>p{flex:1;margin-right:0.2rem;}
  .payType>p{flex:1;margin-right:.2rem;}
  .payType>i{width:.5rem;height:.5rem;border-radius:50%;color:white;display:flex;justify-content:center;align-items:center;}
  .payType>i{width:.5rem;height:.5rem;border-radius:50%;color:white;display:flex;justify-content:center;align-items:center;}
  .font24{color:#727272;}

  .buttonp{width:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;margin-top:1rem;}
  .buttonp button{width:80%;border:none;height:.8rem;display:flex;justify-content:center;align-items:center;color:white;
  margin-bottom:.1rem;border-radius:0.1rem;}

</style>
