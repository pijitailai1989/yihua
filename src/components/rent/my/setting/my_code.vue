<template>
  <yd-layout class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="titleText" :title="titleText" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span @click="back" class="spanLeft" to="" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
      </yd-navbar>
    </div>

    <div class="codeS">
         <span><img :src="codeUrl" alt=""></span>
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
        titleText:'',
        userId:'',
        getkey:'',
        codeUrl:''
      }
    },
    methods: {
      turnTo(url) {
        this.$router.push(url)
      },
      back(){
           this.$router.go(-1)
      },
      getCode(type){
         this.xhr.get(`${this.subUrl.user}/user/`+type+'?token='+this.getkey).then(res=>{
            this.codeUrl=res.config.url;
           })
      },

    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = localStorage.getItem('mainColor');
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      if(this.$route.hash=='#inviteMerchant'){
          this.titleText='商家二维码';
          this.getCode('inviteMerchant')
      }else if(this.$route.hash=='#inviteLessee'){
          this.titleText='租户二维码'
          this.getCode('inviteLessee')
      }else if(this.$route.hash=='#myCode'){
          this.titleText='我的二维码'
          this.getCode('myQRCode')
      }
     document.title=this.titleText;

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

  .codeS{padding:.8rem 0;display:flex;justify-content:center;}
  .codeS span{padding:.5rem;border:1px solid #E6E8E8;border-radius:0.2rem;background:white;}
  .codeS span img{width:100%;height:100%;}

</style>
