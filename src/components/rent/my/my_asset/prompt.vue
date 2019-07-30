<template>
  <yd-layout class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'提示'" title="提示" color="#fff" :bgcolor="mainColor" height=".88rem">
        <span class="spanRight font28" @click="turnTo('/my/my_asset')" slot="right" style="color:white;">完成</span>
      </yd-navbar>
    </div>
    
    <div class="prompt">
        <ul :style="{background:mainColor}">
            <li><i><img src="../../../../assets/images/rent/my/comm.png" alt=""></i></li>
            <li>
                <p>兑换申请已提交</p>
                <span>{{info.money}} 元</span>
            </li>
        </ul>
        <ol>
            <li>
               <i>
                  <a :style="{background:mainColor}"></a>
                  <a></a>
               </i>
               <p>
                  <a :style="{color:mainColor}">{{info.createTime}} (今日)</a>
                  <a :style="{color:mainColor}">兑换申请提交成功</a>
               </p>
            </li>
            <li>
               <i>
                  <a style="background:#ccc;"></a>

               </i>
               <p style="color:#999;">
                  <a>{{info.handlingTime}} (预计)</a>
                  <a>兑换金额到账</a>
               </p>
            </li>
        </ol>

    </div>
    <div class="customer">
       <i><img src="../../../../assets/images/rent/my/customer.png" alt=""></i>
       <span class="font26" :style="{color:mainColor}">如有问题，请联系客服</span>
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
        value1: '',
        num:0,
        userInfo:'',
        organInfo:'',
        info:{},
      }
    },
    methods: {
      turnTo(url) {
        this.$router.push(url)
      },
      back(){
          history.back()
      },
      
    },
    mounted() {
      this.mainColor = localStorage.getItem('mainColor');
      this.$route.params.data.createTime=this.$route.params.data.createTime.split(' ')[0]
      this.$route.params.data.handlingTime=this.$route.params.data.handlingTime.split(' ')[0]
      this.info=this.$route.params.data
      console.log(this.$route.params.data)
     
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
  
  .prompt{width:100%;}
  .prompt ul{width:100%;height:2rem;display: flex;align-items:center;}
  .prompt ul li:nth-child(1){width:1.6rem;display: flex;justify-content: center;}
  .prompt ul li:nth-child(1)>i{width:1.1rem; height:1.1rem;}
  .prompt ul li:nth-child(1)>i>img{width:100%;height:100%;}
  .prompt ul li:nth-child(2)>p{color:white;margin-bottom: .1rem;font-size: .34rem;}
  .prompt ul li:nth-child(2)>span{color:white;font-size: .26rem;}

  .prompt ol li{height:1.2rem;width:100%;background: white;display: flex;}
  .prompt ol li>p{display: flex;flex-flow:column;height:100%;justify-content: center;}
  .prompt ol li>p>a{margin-bottom: .05rem;font-size: .26rem;}
  .prompt ol li>i{display: flex;width:1.5rem;height:100%;justify-content: center;
  position: relative;align-items: center;}
  .prompt ol li>i>a:nth-child(1){width:.3rem;height:.3rem;border-radius: 50%;top:.45rem;right:.6rem}
  .prompt ol li>i>a:nth-child(2){width: .03rem;height:100%;background: #ccc;top:.75rem;}
  .prompt ol li>i>a{position:absolute;}

  .customer{position: fixed;width: 100%;height:1.4rem;left:0;bottom:0;
  display: flex;justify-content: center;align-items: center;}
  .customer>i{width:.4rem;height:.4rem;margin-right: .1rem;}
  .customer>i>img{width:100%;height:100%;}
</style>
