<template>
  <yd-layout class="layout_my">
    <yd-navbar v-show="!userAgent.isWX" class="header" height=".88rem" slot="navbar" :bgcolor="mainColor"
               v-title="titleT" color="#fff" :title="titleT">
            <span class="addClickArea" @click="back" slot="left">
                <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
            </span>
      <span @click="addshow" slot="right" v-show="icons" class="addClickArea edit spanRight"
            style="color: #fff;font-size:.5rem;">+</span>
      <span @click="turnTo('/supply/product/release_products')" slot="right" v-show="icons1"
            class="addClickArea edit spanRight" style="color: #fff;font-size:.28rem;">发布产品</span>
    </yd-navbar>
    <router-view @mainColor="colors" @organType="organTypes"></router-view>
    <yd-tabbar slot="tabbar" :activeColor="mainColor">
      <yd-tabbar-item @click.native="chooseTab(0)" title="发现" link="" :active="activeIdx==0">
        <!-- <img v-if="activeIdx==0" slot="icon" src="../../../assets/images/index/message_active2.png">
        <img v-else slot="icon" src="../../../assets/images/index/message.png"> -->
        <yd-icon name="discover" slot="icon" custom size=".45rem"></yd-icon>

      </yd-tabbar-item>
      <yd-tabbar-item @click.native="chooseTab(1)" title="我的采购" link="" :active="activeIdx==1" v-show="shows">
        <!-- <img v-if="activeIdx==1" slot="icon" src="../../../assets/images/index/message_active2.png">
        <img v-else slot="icon" src="../../../assets/images/index/message.png"> -->
        <yd-icon name="wendang" slot="icon" custom size=".41rem"></yd-icon>
      </yd-tabbar-item>
      <yd-tabbar-item @click.native="chooseTab(2)" title="我的产品" link="" :active="activeIdx==2">
        <yd-icon name="wodecaifu" slot="icon" custom size=".5rem"></yd-icon>
      </yd-tabbar-item>
    </yd-tabbar>
    <div class="addSan" v-show="sanShow" @click="toggle2">
      <ul class="font30">
        <li @click="turnTo('/supply/purchase/release_purchase')">发布采购</li>
        <li @click="turnTo('/supply/purchase/tender_invitation')">发布招标</li>
      </ul>
    </div>
  </yd-layout>
</template>
<script>
  function setupWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
      return callback(WebViewJavascriptBridge);
    }
    if (window.WVJBCallbacks) {
      return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'https://__bridge_loaded__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () {
      document.documentElement.removeChild(WVJBIframe)
    }, 0)
  }

  import Vue from 'vue';
  import fn from '@/assets/js/product'
  import qs from 'qs'
  import {Layout} from 'vue-ydui/dist/lib.rem/layout';
  import {TabBar, TabBarItem} from 'vue-ydui/dist/lib.rem/tabbar';
  import {Badge} from 'vue-ydui/dist/lib.rem/badge';

  Vue.component(Badge.name, Badge);
  Vue.component(TabBar.name, TabBar);
  Vue.component(TabBarItem.name, TabBarItem);
  Vue.component(Layout.name, Layout);
  import {Icons} from 'vue-ydui/dist/lib.rem/icons';

  Vue.component(Icons.name, Icons);


  export default {
    data() {
      if(this.$route.query.token){
        localStorage.setItem('app',true);
      }
      return {
        shows:true,
        app: false,
        organType: '',
        mainColor: "",
        organInfo: '',
        userInfo: '',
        activeIdx: 2,
        activeIndex: {},
        titleT: '物业供求',
        icons: false,
        icons1: false,
        sanShow: false,
        local: {
          a: 0,
          b: 0,
        },

      }

    },
    methods: {
      // back() {
      // // 有传参时代表是嵌入网页的app
      //   //是安卓是执行jsBridge的方法
      //   if (this.userAgent.isAndroid) {
      //     window.WebViewJavascriptBridge.callHandler(
      //       "doBack",
      //       { param: "" },
      //       function() {}
      //     );
      //     // 是IOS时那边有监听下列url
      //   } else if (this.userAgent.isIOS) {
      //     window.location.href = "http://www.back123456.com";
      //   } else {
      //     // 非这两种机型时退回主页面
      //     this.$router.go(-1);
      //   }
      // },
      back() {
        if (this.app == 'true') {
          //是安卓是执行jsBridge的方法
          if (this.userAgent.isAndroid) {
            console.log('是安卓是执行jsBridge的方法')
            window.WebViewJavascriptBridge.callHandler(
              "doBack",
              {param: ""},
              function () {
              }
            );
            // 是IOS时那边有监听下列url
          } else if (this.userAgent.isIOS) {
            console.log('是iOS是执行jsBridge的方法')
            setupWebViewJavascriptBridge(function (bridge) {
              /* Initialize your app here */
              bridge.registerHandler('toIOSApp', function (data, responseCallback) {
                console.log("reciviceDate", data)
                responseCallback(data)
              })
              bridge.callHandler('toNativeApp', {'service': 'this is a test data'}, function responseCallback(responseData) {
                console.log("JS received response:", responseData)
              })
            })
          } else {
            // 非这两种机型时退回主页面
            console.log('是其他机型的方法')
            this.$router.go(-1);
          }
        } else {
          console.log('微信端')
          this.$router.go(-1);
        }
      },
      chooseTab(e) {
        switch (e) {
          case 0:
            this.$router.replace('/supply/find');
            break;
          case 1:
            this.$router.replace('/supply/purchase');
            break;
          case 2:
            this.$router.replace('/supply/product');
            break;
          default:
            console.log(e);
        }
        this.activeIdx = e;
      },
      toggle2() {
        this.sanShow = !this.sanShow
      },
      addshow() {
        this.sanShow = true;
      },
      toBack() {
        this.$router.push('/index/' + this.local.a + '/' + this.local.b + '/3/rent/my');
      },
      turnTo(url) {
        this.$router.push(url)
      },
      colors: function (data) {
        console.log(data)
        this.mainColor = data;
        localStorage.setItem('mainColor', this.mainColor);

      },
      organTypes(data) {
        this.organType = data;
        if(data==6){
          this.shows=false;
        }else if(data==7){
          this.shows=false;
        }else{
          this.shows=true;
        }
        localStorage.setItem('organType', this.organType);
      }

    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = localStorage.getItem('mainColor');
      this.organType = localStorage.getItem('organType');
      this.app = localStorage.getItem('app');
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      this.local.b = localStorage.getItem('isManger');
      this.local.a = localStorage.getItem('organType');
      
    },
    beforeUpdate() {
      if (this.organType == 1) {
        this.titleM = '供求市场'
      } else {
        this.titleM = '物业供求'
      }
      switch (this.$route.name) {
        case 'supply_find':
          this.activeIdx = 0;
          this.titleT = this.titleM;
          this.icons = false;
          this.icons1 = false;
          break;
        case 'product':
          this.activeIdx = 2;
          this.titleT = '我的产品';
          this.icons = false;
          this.icons1 = true;
          break;
        case 'purchase':
          this.activeIdx = 1;
          this.titleT = '我的采购';
          this.icons = true;
          this.icons1 = false;
          break;
      }
      // console.log(this.$route.name)
    }
  }
</script>
<style scoped>
  .layout_my .header:after {
    display: none;

  }

  .layout_my {
    background: #F7F7F9;
    width: 100%;
    position: relative;
  }

  .layout_my .blue_box {
    height: 0.88rem;
    background: #0093D2;
    background-size: 100% 100%;
  }

  .addSan {
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0);
    position: fixed;
    left: 0;
    top: 0;
  }

  .addSan ul {
    width: 3rem;
    height: 1.6rem;
    background: white;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    border: 1px solid #E5E5E5;
    border-radius: .1rem;
    position: absolute;
    right: .1rem;
    top: 1rem;
  }

  .addSan ul li:nth-child(1) {
    border-bottom: 1px solid #E5E5E5;
    position: relative;
    z-index: 666;
  }

  .addSan ul li:nth-child(1) > span {
    display: flex;
    width: .25rem;
    height: .25rem;
    position: absolute;
    top: -.25rem;
    z-index: 555;
    right: .15rem;
  }

  .addSan ul li:nth-child(1) > span > img {
    width: 100%;
    height: 100%;
  }

  .addSan ul li {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: .8rem;
  }
</style>
