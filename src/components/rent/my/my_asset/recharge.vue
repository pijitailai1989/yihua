<template>
  <div class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'充值商机点'" title="充值商机点" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span class="spanLeft" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
         </span>
      </yd-navbar>
    </div>

  <div class="recharge">

      <ul>
          <li>

             <p class="font30 font600">当前商机点:{{businessPoint}}</p>
             <span class="font24" style="color:#BEBEBF;">1元=1商机点</span>

          </li>
          <li>
              <p class="font30">充值金额</p>
              <span><input v-model.lazy.number="price" placeholder="最低为1"></span>
              <a class="font30">元</a>
          </li>

      </ul>

  </div>

  <div class="conpay">
    <ul>
        <li>
           <span class="font24">支付方式</span>
        </li>
        <li class="payType" v-for="(item,index) in radios" :key="index">
             <span><img :src="item.icon" alt=""></span>
             <p class="font30 font600">{{item.type}}</p>
             <i v-show="num==index"><img src="../../../../assets/images/rent/my/select_active.png" alt=""></i>
        </li>

    </ul>

    <div class="buttonp">
        <button @click="payBp" class="font30 font600" :style="'background:'+mainColor">立即开通</button>
        <p class="font24">会员服务条款 | 会员特权说明</p>
    </div>
  </div>




  </div>
</template>
<script>
  import Vue from 'vue';
  import fn from '@/assets/js/product'
  import qs from 'qs'
import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog';
/* 使用px：import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.px/dialog'; */

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
        mainColor: "",
        num:0,
        num1:0,
        userInfo:'',
        organInfo:'',
        businessPoint:0,
        price:0,
        radios:[
            {icon:require('../../../../assets/images/rent/my/wei.png'),type:'1'}
        ],
        organAccount:'',
        enterprise:false
      }
    },
    computed:{

    },
    methods: {
      turnTo(url) {
        this.$router.push(url)
        localStorage.setItem('price',encodeURIComponent(this.price))
      },
      back(){
        this.$router.go(-1)
      },
      toggle(index){
          this.num=index;
          this.price=this.prices[index];
      },
      payBp(){
        let value='';
        if(this.enterprise==true){
        value=this.organInfo.organAccount
        }else{
         value=this.userId
        }

        if(typeof(parseInt (this.price) )=='number'&&this.price!=0){
            var data={userId:value,token:this.getkey,money:parseInt(this.price),payType:1}
              this.xhr.post(`${this.subUrl.user}/asset/payBp`, qs.stringify(data)).then(res=>{
                if (res.data.code == 1) {
                  this.$dialog.toast({mes: '充值成功！',icon: 'success'})
                } else if (res.data.code == '-902') {
                fn.re_login(this);
                } else {
                this.$dialog.toast({mes: res.data.msg});
                }
                this.price=0;
              })
        }else(
           this.$dialog.toast({mes: '请填充值金额！',icon: 'error'})
        )

         },
    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = localStorage.getItem('mainColor');
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      // this.organAccount = this.organInfo.organAccount;
      this.enterprise =  JSON.parse(decodeURIComponent(localStorage.getItem('enterprise')));

      let str=this.$route.hash
      let arr=str.split('#')
      this.businessPoint=parseInt(arr[1]);

      this.radios.forEach(function(item){
         if(item.type==1){
           item.type='微信'
         }else if(item.type==2){
           item.type="支付宝"
         }
       })


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
     background: #F7F7F9;
     width:100mv;
     height:100vh;
  }

  .layout_my .blue_box {
    height: 0.88rem;
    background-size: 100% 100%;
  }
.recharge{width:100%;}
.recharge ul{width:100%;}
.recharge ul li:nth-child(1){height:1.2rem;display:flex;flex-direction:column;justify-content:center;padding:0.1rem .2rem;}
.recharge ul li:nth-child(1)>p{padding:.1rem 0;}
.recharge ul li:nth-child(2){background:white;display:flex;flex-flow:row;align-items:center;padding:.1rem .2rem;}
.recharge ul li:nth-child(2) p{flex:2;}
.recharge ul li:nth-child(2) span{border-radius:.05rem;flex:7;border:1px solid #F1F1F1;height:.7rem;display:flex;align-items:center;padding:0 .2rem;}
.recharge ul li:nth-child(2) span input{width:100%;height:100%;border:none;}
.recharge ul li:nth-child(2) a{flex:1;display:flex;justify-content:center;}



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

  .buttonp{width:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;margin-top:2rem;}
  .buttonp button{width:80%;border:none;height:.8rem;color:white;
  margin-bottom:.1rem;border-radius:0.1rem;}
</style>
