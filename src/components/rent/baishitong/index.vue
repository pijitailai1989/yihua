<template>
  <yd-layout class="layout_my">
    <yd-navbar class="header" v-show="!userAgent.isWX" height=".88rem" slot="navbar" :bgcolor="mainColor"
               v-title="titleT" color="#fff" :title="titleT">
            <span @click="back" slot="left">
                <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
            </span>
      <span @click="turnTo('/baishitong/myLibrary/upload')" slot="right" v-show="icons">
                <span style="color:#fff">发布</span>
            </span>
    </yd-navbar>
    <!-- <div slot='top'>111111111111111</div> -->

    <router-view @mainColor="colors"></router-view>
    <yd-tabbar slot="tabbar" :activeColor="mainColor">
      <yd-tabbar-item @click.native="chooseTab(0)" title="发现" link=""  :active="activeIdx==0">
        <!-- <img v-if="activeIdx==0" slot="icon" src="../../../assets/images/index/message_active2.png">
        <img v-else slot="icon" src="../../../assets/images/index/message.png"> -->
        <yd-icon name="discover" slot="icon" custom size=".45rem"></yd-icon>

      </yd-tabbar-item>
      <yd-tabbar-item @click.native="chooseTab(1)" link=""  title="我的文库" :active="activeIdx==1">
        <!-- <img v-if="activeIdx==1" slot="icon" src="../../../assets/images/index/message_active2.png">
        <img v-else slot="icon" src="../../../assets/images/index/message.png"> -->
        <yd-icon name="wendang" slot="icon" custom size=".41rem"></yd-icon>
      </yd-tabbar-item>
      <yd-tabbar-item @click.native="chooseTab(2)" link=""  title="我的财富" :active="activeIdx==2">
        <!-- <img v-if="activeIdx==2" slot="icon" src="../../../assets/images/index/message_active2.png">
        <img v-else slot="icon" src="../../../assets/images/index/message.png"> -->
        <yd-icon name="wodecaifu" slot="icon" custom size=".5rem"></yd-icon>
      </yd-tabbar-item>
    </yd-tabbar>
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

  import Vue from "vue";
  import fn from "@/assets/js/product";
  import qs from "qs";
  import {Layout} from "vue-ydui/dist/lib.rem/layout";
  import {TabBar, TabBarItem} from "vue-ydui/dist/lib.rem/tabbar";
  import {Badge} from "vue-ydui/dist/lib.rem/badge";

  Vue.component(Badge.name, Badge);
  Vue.component(TabBar.name, TabBar);
  Vue.component(TabBarItem.name, TabBarItem);
  Vue.component(Layout.name, Layout);
  import {Icons} from "vue-ydui/dist/lib.rem/icons";

  Vue.component(Icons.name, Icons);

  export default {
    data() {
      return {
        app: false,
        mainColor: "",
        organInfo: "",
        userInfo: "",
        activeIdx: "",
        activeIndex: {},
        titleT: "",
        icons: false,
        local: {
          a: 0,
          b: 0
        }
      };
    },
    methods: {
      turnTo(url) {
        this.$router.push(url);
      },
      back() {
        if (this.app == 'true') {
          //是安卓是执行jsBridge的方法
          // localStorage.setItem("app", false);
          if (this.userAgent.isAndroid) {
            console.log('执行安卓的方法')
            window.WebViewJavascriptBridge.callHandler(
              "doBack",
              {param: ""},
              function () {
              }
            );
            // 是IOS时那边有监听下列url
          } else if (this.userAgent.isIOS) {
            console.log('执行IOS的方法')
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
            // this.$router.go(-1);
            console.log('其他机型');
          }
        } else {
          console.log('微信的机型')
          this.$router.go(-1);
        }
        // if (this.userAgent.isAndroid) {
        //     alert("执行了安卓的方法！");
        //     window.WebViewJavascriptBridge.callHandler(
        //       "doBack",
        //       { param: "" },
        //       function() {
        //         alert("执行了安卓的方法的回掉参数");
        //       }
        //     );
        //     alert("没有被组赛");
        //   } else {
        //     // window.location.href = "http://www.back123456.com";
        //     setupWebViewJavascriptBridge(function(bridge) {
        //         /* Initialize your app here */
        //         bridge.registerHandler('toIOSApp', function(data, responseCallback) {
        //           console.log("reciviceDate", data)
        //           responseCallback(data)
        //         })
        //         bridge.callHandler('toNativeApp', {'service':'this is a test data'}, function responseCallback(responseData) {
        //           console.log("JS received response:", responseData)
        //         })
        //       })
        //   }
        // this.$router.push(
        //     "/index/" + this.local.a + "/" + this.local.b + "/3/rent/my"
        //   );
      },
      chooseTab(e) {
        switch (e) {
          case 0:
            this.$router.replace('/baishitong/find');
            break;
          case 1:
            this.$router.replace('/baishitong/myLibrary');
            break;
          case 2:
            this.$router.replace('/baishitong/myWealth');
            break;
          default:
            console.log(e);
        }
        this.activeIdx = e;
      },
      colors: function (data) {
        console.log(data);
        this.mainColor = data;
        localStorage.setItem("mainColor", this.mainColor);
      }
    },
    mounted() {
      this.userInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("userInfo"))
      );
      this.organInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("organInfo"))
      );
      this.mainColor = localStorage.getItem("mainColor");
      this.app = localStorage.getItem("app");
      console.log(this.app)
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      this.userId = this.userInfo.guid;

      if (this.$route.name == "find") {
        this.activeIdx = 0;
        this.titleT = "百事通";
      }
      this.local.b = localStorage.getItem("isManger");
      this.local.a = localStorage.getItem("organType");
    },
    beforeUpdate() {
      switch (this.$route.name) {
        case "find":
          this.activeIdx = 0;
          this.titleT = "百事通";
          this.icons = false;
          break;
        case "myLibrary":
          this.activeIdx = 1;
          this.titleT = "我的文库";
          this.icons = true;
          break;
        case "myWealth":
          this.activeIdx = 2;
          this.titleT = "";
          this.icons = false;
          break;
      }
    }
  };
</script>
<style scoped>
  .layout_my .header:after {
    display: none;
  }

  .layout_my {
    background: #f7f7f9;
    width: 100%;
    position: relative;
  }
</style>
