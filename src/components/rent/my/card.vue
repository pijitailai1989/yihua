<template>
  <yd-layout class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'我的卡卷'" title="我的卡卷" color="#fff" :bgcolor="mainColor" height=".88rem">
         <router-link :to="'/index/'+local.a+'/'+local.b+'/3/rent/my'" slot="left">
                <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
         </router-link>
      </yd-navbar>
    </div>

   <div class="tab_card">
       <ul>
           <li v-for="(item,index) in tabs" :key="index" @click="toggle(index)"
            :class="{active:active==index&&userInfo.organType == 4,green1:active==index&&userInfo.organType == 1
            ,orange1:active==index&&userInfo.organType == 5}">
              <router-link :to="item.path">
               <span><img :src="item.img" alt=""></span>
               <p class="font28 font600">{{item.name}}</p>
               </router-link>
           </li>
       </ul>
   </div>
   <main>
   <router-view/>
   </main>

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
        tabs: [{
          name: "优惠卷",
          img: require('../../../assets/images/rent/my/coupon.png'),
          path: '/my/card/coupon'
        }, {
          name: "名片",
          img: require('../../../assets/images/rent/my/call.png'),
          path: "/my/card/call",

        }, {
          name: "会员卡",
          img: require('../../../assets/images/rent/my/mem.png'),
          path: "/my/card/mem",
        }],
        active:0,
        local:{
          a:0,
          b:0
        }
      }

    },
    methods: {
      back(){
        history.back()
      },
      turnTo(url) {
        this.$router.push(url)
      },
      toggle(index){
          this.active=index;
      },
      tab(){
        if(this.$route.name=='mem'){
          this.active=2
        }else if(this.$route.name=='call'){
          this.active=1
        }else if(this.$route.name=='coupon'){
          this.active=0
        }
      }

    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = localStorage.getItem('mainColor');
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      this.userId = this.userInfo.guid;
      this.local.b= localStorage.getItem('isManger');
      this.local.a= localStorage.getItem('organType');

    },
    beforeUpdate(){
      this.tab();
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

  .tab_card{width:100%}
  .tab_card ul{width:100%;height:1.6rem;display:flex;flex-direction:row;padding:0 0.2rem;}
  .tab_card ul li{flex:1;height:1.6rem;}
  .tab_card ul li a{ width:100%;height:1.6rem;display:flex;flex-direction:column;justify-content:center;align-items:center;}
  .tab_card ul li a span{width:.8rem;height:.6rem;margin:0.1rem;}
  .active {border-bottom:2px solid #0093D2;}
  .green1 {border-bottom:2px solid #1ed28c;}
  .orange1 {border-bottom:2px solid #FAB23E;}
  .tab_card ul li a img{width:100%;height:100%;}
  main{width:100%;height: calc( 100vh - 2.48rem );overflow-y:auto;}

</style>
