<template>
  <div class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'兑换'" title="兑换" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span class="spanLeft" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
         </span>
      </yd-navbar>
    </div>
    <div class='exchange'>

       <div class="z-exchange">

         <p class="font30 font600">当前默认收款账户</p>

         <div class="z-right" @click="turnTo('/my/my_asset/getSanList')">

            <div v-for="(item,index) in radios" :key="index">
               <img :src="item.icon" alt="">
               <p>{{item.type}}</p>
            </div>

            <img class="" src="../../../../assets/images/rent/my/enter.png">

         </div>

       </div>
       <div class="m-exchange" v-show="inte">
            <div class="m-ke font30">
                <p>可兑积分：</p>
                <span>{{myAsset.conIntegral}}</span>
                <a class="font600" @click="All1">全部兑换</a>
            </div>
            <div class="m-dh font30">
                <p>兑换积分</p>
                <input type="text" v-model.lazy.number="price.input1" placeholder="最低为100">
            </div>
            <div class="m-sm font24">
                <p>100积分=1元</p>
            </div>
            <div class="m-hs font30">
                <p>换算金额</p>
                <span>{{price.input1/100}}</span>
                <a>元</a>
            </div>
       </div>
       <div class="m-exchange">
            <div class="m-ked font30">
                <p>可兑商机点：</p>
                <span>{{myAsset.conBusinessPoint}}</span>
                <a class="font600" @click="All2">全部兑换</a>
            </div>
            <div class="m-dh font30">
                <p>兑换商机点</p>
                <input type="text" v-model.lazy.number="price.input2" placeholder="最低为1">
            </div>
            <div class="m-sm font24">
                <p>1商机点=1元</p>
            </div>
            <div class="m-hs font30">
                <p>换算金额</p>
                <span>{{price.input2}}</span>
                <a>元</a>
            </div>
       </div>
       <div class="m-text">
          <p class="font24">提示</p>
          <span class="font24">通常2个工作日即可，账户不同稍有差异，请关注短信通知</span>
       </div>

    </div>

    <div class="m-button font30 font600">
        <p>
          <span>兑换总额</span>
          <span v-show="price.input1==null&&price.input2==null" style="color:red;">¥ 0</span>
          <span v-show="price.input1!=null||price.input2!=null" style="color:red;">¥{{exnum}}</span>
        </p>
        <button @click="exchange" class="font600" :style="{background:mainColor,color:'white'}">立即兑换</button>
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
        userInfo:'',
        organInfo:'',
        type:1,
        radios:[
            {icon:require('../../../../assets/images/rent/my/wei.png'),type:'1'},
            {icon:require('../../../../assets/images/rent/my/zhi.png'),type:'2'}
        ],
        reg:/^[1-9]\d*$/,
        price:{
            input1:0,
            input2:0
        },
        myAsset:{
          conIntegral:0,
          conBusinessPoint:0
          },
          // organAccount:'',
         enterprise:false,
         inte:true
      }
    },
    computed:{
       exnum(){
         return parseInt(this.price.input1/100)+parseInt(this.price.input2)
       }
    },
    methods: {
      turnTo(url) {
        this.$router.push(url)
      },
      back(){
        this.$router.go(-1)
      },
         All1(){
             this.price.input1=this.myAsset.conIntegral;
         },
         All2(){
             this.price.input2=this.myAsset.conBusinessPoint;
         },
         exchange(){

           if( typeof(parseInt(this.price.input1) )=='number'&& typeof( parseInt(this.price.input2 ) )=='number' ){
                if(this.price.input1!=0||this.price.input2!=0){
                   let value='';
                   if(this.enterprise==true){
                     value=this.organInfo.organAccount;
                     var data={userId:value,token:this.getkey,businessPoint:parseInt(this.price.input2)}
                   }else{
                     value=this.userId
                     var data={userId:value,token:this.getkey,integral:parseInt(this.price.input1),businessPoint:parseInt(this.price.input2)}
                    }

                  
               this.xhr.post(`${this.subUrl.user}/asset/exchange`, qs.stringify(data)).then(res=>{
                if (res.data.code == 1) {
                    // console.log(res.data.data)
                  this.$router.push({
                    name: 'prompt',
                    params:{
                      data:res.data.data
                    }
                  });
                } else if (res.data.code == '-902') {
                fn.re_login(this);
                } else {
                this.$dialog.toast({mes: res.data.msg});
                }
                this.price.input1=0;
                this.price.input2=0;
              })
              }else{
                this.$dialog.toast({mes: '兑换失败！',icon: 'error'});
              }
           }else{
               this.$dialog.toast({mes: '兑换失败！',icon: 'error'});
           }

         }

    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = localStorage.getItem('mainColor');
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      // this.organAccount = this.organInfo.organAccount;
      this.enterprise =  JSON.parse(decodeURIComponent(localStorage.getItem('enterprise')));
      if(this.enterprise==true){
          this.inte=false;
      }else{
          this.inte=true;  
      }

      this.radios=this.radios.filter(item=>{
          return item.type==this.type
      })

      this.radios.forEach(function(item){

         if(item.type==1){
           item.type='微信帐号'
         }else if(item.type==2){
           item.type="支付宝帐号"
         }
       })

       let str=this.$route.hash
       let arr=str.split('#')
       this.myAsset.conIntegral=arr[1];
       this.myAsset.conBusinessPoint=arr[2];



    },
    beforeUpdate(){

       if(this.price.input1>this.myAsset.conIntegral){
           this.price.input1=this.myAsset.conIntegral;
       }else if(this.price.input1<100){
         this.price.input1=0;
       }else if(this.price.input1==null){
         this.price.input1=0;
       }
       if(this.price.input2>this.myAsset.conBusinessPoint){
           this.price.input2=this.myAsset.conBusinessPoint;
       }else if(this.price.input2==null){
         this.price.input2=0;
       }

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
.exchange{width:100%;}
.z-exchange{width:100%;background:white;display:flex;flex-flow:row;align-items:center;padding:.25rem .3rem;}
.z-exchange>p{flex:1;}
.z-right{flex:1;display:flex;flex-flow:row;align-items:center;justify-content:flex-end;}
.z-right>img{width:.3rem;height:.3rem;}
.z-right>div{display:flex;flex-flow:row;align-items:center;width:2rem;}
.z-right>div>img{width:.5rem;height:.5rem;margin-right:.1rem}

.m-exchange{width:100%;background:white;}
.m-exchange>div>p{width:1.8rem;color:#878787;}
.m-exchange>div span{color:#878787;}
.m-exchange>div{width:100%;border-bottom:1px solid #F2F2F3;}
.m-ke{background:#F7F7F9;display:flex;flex-flow:row;padding:.2rem .3rem;align-items:center;}
.m-dh{display:flex;flex-flow:row;padding:0 .3rem;height:1rem;align-items:center;}
.m-sm{background:#F7F7F9;display:flex;flex-flow:row;padding:.15rem .3rem;align-items:center;}
.m-hs{display:flex;flex-flow:row;padding:.3rem .3rem;align-items:center;}
.m-hs>span{width:70%;}
.m-hs>a{color:#878787;}
.m-ke>a,.m-ked>a{margin-left:.2rem;color:#1B9BD4;}
.font24{color:#A7A7A7;}
.font30>input{width:70%;margin-right:0.1rem;height:100%;border:none;}
.m-ked{background:#F7F7F9;display:flex;flex-flow:row;padding:.2rem .3rem;align-items:center;}

.m-text{width:100%;padding:.2rem .3rem;color:#D1D1D3;}
.m-text>p{margin:.1rem 0;}

.m-button{width:100%;height:1rem;border-top:1px solid #F2F2F3;position:fixed;bottom:0;left:0;
display:flex;flex-flow:row;align-items:center;background:white;}
.m-button>p{flex:2;display:flex;flex-flow:row;justify-content:center;color:#333;}
.m-button>p>span{margin-left:.2rem}
.m-button>button{flex:1;border:none;height:1rem;}

</style>
