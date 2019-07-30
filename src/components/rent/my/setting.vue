<template>

  <yd-layout class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'设置'" title="设置" color="#fff" :bgcolor="mainColor" height=".88rem">
         <router-link :to="'/index/'+local.a+'/'+local.b+'/3/rent/my'" slot="left">
            <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </router-link>
      </yd-navbar>
    </div>
    <div class="setList">
    <ul >
        <li v-for="(item,index) in about" :key="index" @click="turnTo(item.path)">
            <img class="l-left" :src="item.img" alt="">
            <span class="l-center">{{item.name}}</span>
            <img class="l-right" src="../../../assets/images/rent/my/enter.png" alt="">
        </li>
        <li @click="clearLoacl" v-if="false">
            <img class="l-left" src="../../../assets/images/rent/my/a_clear.png" alt="">
            <span class="l-center">清理缓存</span>
            <img class="l-right" src="../../../assets/images/rent/my/enter.png" alt="">
        </li>
        <li @click="turnTo('/my/setting/my_about')">
            <img class="l-left" src="../../../assets/images/rent/my/a_bazhua.png" alt="">
            <span class="l-center">关于八爪</span>
            <img class="l-right" src="../../../assets/images/rent/my/enter.png" alt="">
        </li>
    </ul>
    </div>
    <div class="b_login">
        <button style="font-size:.3rem" @click="logout" :style="{background:mainColor,color:'white'}">退出登录</button>
    </div>

    <div class="alertInfo" v-show="alertS" @click="quit">
       <div class="boxMin">
          <span>
            <img src="../../../assets/images/rent/my/select_active.png" alt="">
          </span>
          <p>已为您清理200MB缓存</p>
       </div>
    </div>
  </yd-layout>



</template>
<script>
  import fn from '@/assets/js/product'
  import qs from 'qs'

  export default {
    data() {
      return {
        alertS:false,
        mainColor: "",
        getKey:'',
        about: [{
            name: "密码设置",
            img: require('../../../assets/images/rent/my/a_pass.png'),
            path: "/my/setting/set_pass"
        },{
          name: "我的邀请",
          img: require('../../../assets/images/rent/my/a_inv.png'),
          path: "/my/setting/my_invite"
        }, {
          name: "我的足迹",
          img: require('../../../assets/images/rent/my/a_foot.png'),
          path: "/my/setting/my_foot"
        }],
        local:{
          a:0,
          b:0
        }
      }
    },
    methods: {
      turnTo(url) {
        this.$router.push(url)
      },
      back(){
          history.back()
      },
      clearLoacl(){
          this.alertS=true;
      },
      quit(){
        this.alertS=false;
      },
      logout(){
        this.xhr.get(`${this.subUrl.logout}/user/logout?token=`+this.getkey).then((res) => {
        console.log(res)
          if(res.data.code==1){
            this.$router.push('/login')
            localStorage.clear();
          }
        })
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
    }
  }
</script>
<style scoped>
  .layout_my .header:after {
    display: none;

  }
  .layout_my{
background:#F7F7F9;
width:100%;
position:relative;
  }

  .layout_my .blue_box {
    height: 0.88rem;
    background: #0093D2;
    background-size: 100% 100%;
  }

 .setList li{height:1.1rem;background:white;display:flex;flex-direction:row;align-items:center;
 padding: 0.3rem;border-bottom:1px solid #F0F0F0;font-size:.3rem;}
 .l-left{height:0.55rem;width:0.55rem;}
 .l-center{margin-left: 0.2rem;font-size:.32rem;}
 .l-right{height:0.3rem;width:0.3rem;right:0.5rem;position:absolute;}
 .setList .oul{margin-bottom:0.3rem;}

.b_login{width:100%;height:2rem;display:flex;flex-flow:row;justify-content:center;align-items:center;position:absolute;left:0;bottom:0;}
.b_login button{width:80%;height:.8rem;border:none;border-radius:.1rem;}

 .alertInfo{position:fixed;width:100vw;height:100vh;background:rgba(0,0,0,0.2);
 top:0;left:0;z-index:999;display:flex;justify-content:center;}
 .boxMin{width:5rem;height:4rem;background:white;margin-top:4rem;border-radius:0.5rem;
 display:flex;flex-direction:column;justify-content:center;align-items:center;}
 .boxMin p{margin-top:.8rem;font-weight:700;color:#0093D2;}

</style>
