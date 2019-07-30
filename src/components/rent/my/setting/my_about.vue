<template>
  <yd-layout class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'关于八爪'" title="关于八爪" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span class="spanLeft" @click="back" slot="left">
            <span @click="back"><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
      </yd-navbar>
    </div>

    <div class="copyright">
        <div class="copy_name">
           <img src="../../../../assets/images/rent/my/a_icon.png" alt=""><span class="font30">八爪网&nbsp;您的服务专家</span>
        </div>
    </div>
    <div class="yd_z">
    <yd-cell-group>
        <yd-cell-item arrow v-if="false">
            <span class="font30" slot="left">版本更新</span>
            <span class="font26" slot="right"><i class="icon font24">NEW</i>{{myabout.version}}</span>
        </yd-cell-item>
        <yd-cell-item>
            <span class="font30" slot="left">微信号</span>
            <span class="font26" slot="right">{{myabout.wechat}}</span>
        </yd-cell-item>
        <yd-cell-item>
            <span class="font30" slot="left">客服电话</span>
            <span class="font26" slot="right">{{myabout.serviceTel}}</span>
        </yd-cell-item>
        <yd-cell-item>
            <span class="font30" slot="left">电子邮箱</span>
            <span class="font26" slot="right">{{myabout.email}}</span>
        </yd-cell-item>
        <yd-cell-item>
            <span class="font30" slot="left">官方版本</span>
            <span class="font26" slot="right">{{myabout.website}}</span>
        </yd-cell-item>
        <yd-cell-item>
            <span class="font30" slot="left">版本所有</span>
            <span class="font26" slot="right">{{myabout.releaseAll}}</span>
        </yd-cell-item>
    </yd-cell-group>
    </div>

    <!-- <div class="b_login">
        <button @click="logout" class="font600" :style="{background:mainColor,color:'white'}">退出登录</button>
    </div> -->
  </yd-layout>
</template>
<script>
  import Vue from 'vue';
  import {CellGroup, CellItem} from 'vue-ydui/dist/lib.rem/cell';
/* 使用px：import {CellGroup, CellItem} from 'vue-ydui/dist/lib.px/cell'; */

  Vue.component(CellGroup.name, CellGroup);
  Vue.component(CellItem.name, CellItem);

  import fn from '@/assets/js/product'
  import qs from 'qs'

  export default {
    data() {
      return {
        mainColor:'',
        myabout:{}
      }
    },
    methods: {
      back(){
        history.back()
      },
      turnTo(url) {
        this.$router.push(url)
      },
      back(){
          history.back()
      },about() {
        this.xhr.post(`${this.subUrl.user}/user/about`,).then((res) => {
          console.log(res)
          if (res.data.code == 1) {
            this.myabout=res.data.data;
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
          console.log(this.myabout)
        })
      },logout(){

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
      this.about();
      this.mainColor = localStorage.getItem('mainColor');
    }
  }
</script>
<style scoped>
  .layout_my .header:after {
    display: none;

  }
  .layout_my{
background:#F7F7F9;
position:relative;
  }

  .layout_my .blue_box {
    height: 0.88rem;
    background: #0093D2;
    background-size: 100% 100%;
  }

  .copyright{width:100%;}
  .copy_name{width:100%;height:3rem;display:flex;flex-direction:column;justify-content:center;align-items:center;}
  .copy_name img{width:1.6rem;height:1.8rem;margin-bottom:0.2rem;}
.yd_z{border-top:1px solid #ECECEC;}
.icon{width:0.7rem;height:0.4rem;background:red;display:inline-block;border-radius:0.2rem;color:white;text-align:center;line-height:.4rem;}
.yd-cell-right span{color:#999;}

.b_login{width:100%;height:2rem;display:flex;flex-flow:row;justify-content:center;align-items:center;position:absolute;left:0;bottom:0;}
.b_login button{width:80%;height:.7rem;border:none;border-radius:.1rem;}

  /*消息列表结束*/
</style>
