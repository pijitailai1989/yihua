<template>
  <yd-layout class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'本地服务'" title="本地服务" color="#fff" :bgcolor="mainColor" height=".88rem">
         <div slot="left" class="addClickArea" @click="back">
            <span ><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </div>

      </yd-navbar>
    </div>
    
    <div>本地服务</div>
   
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
       
      }
    },
    methods: {
      turnTo(url) {
        this.$router.push(url)
      },
      back(){
          history.back()
      },
      myInvitation(){
        var data = {userId: this.userId, token: this.getkey};
        this.xhr.post(`${this.subUrl.user}/user/myInvitation`, qs.stringify(data)).then((res) => {

          if (res.data.code == 1) {
              console.log(res)
              this.takes=res.data.data.list;
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
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

 
</style>
