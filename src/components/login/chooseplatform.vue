<template>
  <div class="choose_type" v-title="'选择注册类型'">
    <yd-layout>
      <yd-navbar slot="navbar" height=".88rem" title="选择注册类型" bgcolor="#0093d2" color="#fff">
        <span @click='back' slot="left">
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </span>
      </yd-navbar>
      <div class="tips">
        请选择注册类型完成身份认证。
      </div>
      <div class="choose">
        <div class="slider-item-div" @click="turnTo(1,'/register/rent')">
          <img src="../../assets/images/register/zuhu.png">
          <div class="g-text">租户注册</div>
        </div>
        <div class="slider-item-div" @click="turnTo(4,'/register/company')">
          <img src="../../assets/images/register/wuye.png" alt="">
          <div class="g-text">物业公司注册</div>
        </div>
        <!--<div class="slider-item-div" @click="turnTo(5,'/register/personal')">-->
          <!--<img src="../../assets/images/register/personal.png">-->
          <!--<div class="g-text">个人注册</div>-->
        <!--</div>-->
      </div>
    </yd-layout>
  </div>
</template>
<script>
  import Vue from 'vue';
  export default {
    name: '',
    data() {
      return {
        isActive: 2,
        a: [{
          loop: false
        }]
      }
    },
    methods: {
      back(){
        this.$router.go(-1);
      },
      slide_switch(i) {
        this.isActive = i;
      },
      turnTo(type, url) {
        location.href = "#" + url;
      }
    }
  }
</script>
<style>
  .choose {
    perspective: 1.5rem;
    perspective-origin: 10% 10%;
    -webkit-perspective: 1.5rem; /* Safari 和 Chrome */
    -webkit-perspective-origin: 10% 10%; /* Safari 和 Chrome */
    overflow: hidden;
  }
  .choose_type .tips {
    padding: .67rem .4rem .4rem;
    color: #777;
    font-size: .26rem;
  }
  .slider-item-div {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    width: 5rem;
    height: 1.6rem;
    background: #fff;
    box-sizing: border-box;
    margin: 0 auto .3rem;
    box-shadow: .05rem .05rem .5rem rgba(0, 0, 0, .15);
    border-radius: .1rem;
  }
  .slider-item-div img {
    width: 1.28rem;
    height: 1.28rem;
    margin-left:.75rem;
    margin-right: .3rem;
  }
  .slider-item-div .g-text {
    font-size: .32rem;
    text-align: center;
    color: #333;
  }
  .choose .yd-slider-item {
    box-sizing: content-box;
  }
  .choose .yd-slider-pagination {
    display: none;
  }
</style>
