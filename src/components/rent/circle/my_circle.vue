<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" v-show="!userAgent.isWX" :title="mTitle" :bgcolor="mainColor" color="#fff">
      <span slot="left" @click="cancel()" color="#fff;padding-right:.2rem" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
    </yd-navbar>
    <ul class="oul" v-for="(item,index) in passW" v-if="!item.showFalse" :key="index">
      <router-link v-if="item.path&&item.name!='八爪圈'" :to="item.path" slot="left">
        <li v-bind:class="index==1||index==passW.length-1?'first-last-style':''"
            v-bind:style="index==0?'height:1.25rem;margin:.25rem 0':''"
            v-if="item.type*1!=99" style="border-bottom: 1px solid #ddd;border-top: 1px solid #ddd;">
          <img v-if="index!=0" class="l-left" :src="item.imgPath" alt="">
          <img v-if="index==0&&item.path&&item.name!='八爪圈'" style="width:.88rem;height:.88rem;border-radius: 50%"
               class="l-left" :src="userInfo.headPortrait"
               alt="">
          <span class="l-center">
            <a v-if="item.path&&item.name!='八爪圈'&&index!=0" slot="left">{{item.name}}</a>
            <a @click="cancel" v-if="item.name=='八爪圈'&&index!=0">{{item.name}}</a>
            <a @click="cancel" v-if="index==0" style="font-size:.32rem">{{userInfo.name}}</a>
            <span v-if="index==0">
              <br>暂无简介</span>
          </span>
          <img class="m-right l-right" src="../../../assets/images/rent/my/enter.png">
          <span v-if="index > 1 && index < 4" class="foCo9"> ({{item.num?item.num:0}}) </span>
          <yd-badge v-if="index > 3 && index < passW.length-1" type='danger'>{{item.num?item.num:0}}</yd-badge>
          <img v-if="!item.path&&item.name!='八爪圈'" class="m-right l-right"
               src="../../../assets/images/rent/my/enter.png">
          <img v-if="item.name=='八爪圈'" @click="cancel" class="m-right l-right"
               src="../../../assets/images/rent/my/enter.png">
        </li>
      </router-link>
      <a v-if="item.name=='八爪圈'" @click="cancel" slot="left">
        <li v-bind:class="index==1||index==passW.length-1?'first-last-style':''"
            v-bind:style="index==0?'height:5em;margin-top:1em':''"
            v-if="item.type*1!=99">
          <!-- {{item.imgPath}} -->
          <img class="l-left" :src="item.imgPath" alt="">
          <span class="l-center">
            <a @click="cancel" v-if="item.name=='八爪圈'&&index!=0">{{item.name}}</a>
            <a @click="cancel" v-if="index==0">{{userInfo.name}}</a>
          </span>
          <img class="m-right l-right" src="../../../assets/images/rent/my/enter.png">
          <img v-if="item.name=='八爪圈'" @click="cancel" class="m-right l-right"
               src="../../../assets/images/rent/my/enter.png">
        </li>
      </a>
    </ul>
  </yd-layout>
</template>
<script>
  var ua =
    navigator.userAgent.toLowerCase() || window.navigator.userAgent.toLowerCase();
  //判断user-agent
  var myUser = {
    // isWX : /MicroMessenger/i.test(ua), //微信端
    isWX: false,
    isIOS: /(iPhone|iPad|iPod|iOS)/i.test(ua), //苹果家族
    isAndroid: /(android|nexus)/i.test(ua), //安卓家族
    isWindows: /(Windows Phone|windows[\s+]phone)/i.test(ua), //微软家族
    isBlackBerry: /BlackBerry/i.test(ua) //黑莓家族
  };

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
  import {Icons} from "vue-ydui/dist/lib.rem/icons";
  import fn from '@/assets/js/product.js'
  /* 使用px：import {Icons} from 'vue-ydui/dist/lib.px/icons'; */
  Vue.component(Icons.name, Icons);
  export default {
    data() {
      var mainColor,
      mTitle;
      if (this.$route.query.token) {
        this.getUserInfo(res => {
          console.log(res)
          this.mainColor = this.$color[this.userInfo.organType];
          console.log(this.$color[this.userInfo.organType])
          this.getMyCirCle();
          this.mTitle = this.$route.query.circle ? "圈子管理" : "我的八爪";
        });
      } else {
        this.userInfo = JSON.parse(
          decodeURIComponent(localStorage.getItem("userInfo"))
        );
        var mainColor = this.$color[this.userInfo.organType];
        var getkey = this.$getkey();
        mTitle = this.$route.query.circle ? "圈子管理" : "我的八爪";
        this.getMyCirCle();
      }

      // 设置主色
      return {
        mainColor,
        getkey,
        mTitle,
        passW: [
          {
            name: "我是树枝",
            path: `/circle/my_circle/friend_detail/${this.$route.query.userId ? this.$route.query.userId : this.userInfo.guid}?showRemark=1`
          },
          {
            name: "八爪圈",
            imgPath: require("../../../assets/images/rent/circle/icon_01.png"),
            showFalse: this.$route.query.circle ? true : false,
          },
          {
            name: "我的帖子",
            path: "/circle/my_circle/my_post",
            imgPath: require("../../../assets/images/rent/circle/icon_02.png")
          },
          {
            name: "我的报名",
            path: "/circle/my_circle/my_join",
            imgPath: require("../../../assets/images/rent/circle/icon_03.png")
          },
          {
            name: "我的评论",
            path: "/circle/my_circle/my_comment",
            imgPath: require("../../../assets/images/rent/circle/icon_04.png")
          },
          {
            name: "给我回复",
            path: "/circle/my_circle/my_reply",
            imgPath: require("../../../assets/images/rent/circle/icon_05.png")
          },
          {
            name: "圈子好友",
            path: "/circle/my_circle/my_friend",
            imgPath: require("../../../assets/images/rent/circle/icon_06.png")
          }
        ]
      };
    },
    methods: {
      getUserInfo(cb) {
        let data = {
          token: this.$route.query.token
            ? this.$route.query.token
            : this.$getkey(),
          userId: this.$route.query.userId
            ? this.$route.query.userId
            : this.userInfo.guid
        };
        this.$ajax(
          `${this.subUrl.user}/user/getUserInfo`,
          data,
          res => {
            this.userInfo = res.data.userInfo;
            this.organInfo = res.data.organInfo;
            localStorage.setItem(
              "userInfo",
              encodeURIComponent(JSON.stringify(res.data.userInfo))
            );
            localStorage.setItem(
              "organInfo",
              encodeURIComponent(JSON.stringify(res.data.organInfo))
            );
            localStorage.setItem("to", encodeURIComponent(res.data.token));
            fn.setIng(this.$route.query.token);
            var a = res.data.userInfo.organType;
            var b = res.data.userInfo.admin ? 1 : 0;
            localStorage.setItem("organType", a);
            localStorage.setItem("isManger", b);
            localStorage.setItem("user_Id", res.data.userInfo.guid);
            cb && cb(res.data);
          },
          this
        );
      },

      cancel() {
        if (this.$route.query.token) {
          if (myUser.isAndroid) {
            console.log('执行安卓的方法')
            window.WebViewJavascriptBridge.callHandler(
              "doBack",
              {param: ""},
              function () {
              }
            );
            // 是IOS时那边有监听下列url
          } else if (myUser.isIOS) {
            console.log('执行ios的方法')

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
            console.log('执行其他的方法')

            // 非这两种机型时退回主页面
            this.$router.go(-1);
          }
        } else {
          console.log('执行微信的方法')

          this.$router.go(-1);
        }
      },
      chooseSuccess() {
      },
      getMyCirCle(data) {
        data = data ? data : {};
        data.token = this.$route.query.token ? this.$route.query.token : this.$getkey();
        data.userId = this.$route.query.userId ? this.$route.query.userId : this.userInfo.guid;
        this.$ajax(
          `${this.subUrl.sc}/bbs/getBaZhuaInfo`,
          data,
          res => {
            console.log(res.data);
            // 通过这种方法修改视图层才会同步更新
            this.$set(this.passW[2], "num", res.data.bbsNum);
            this.$set(this.passW[3], "num", res.data.applicantNum);
            this.$set(this.passW[4], "num", res.data.myComment);
            this.$set(this.passW[5], "num", res.data.myReply);
            // this.passW[2].num = res.data.bbsNum;
            // this.passW[3].num = res.data.applicantNum;
            // this.passW[4].num = res.data.myComment;
            // this.passW[5].num = res.data.myReply;
            console.log(this.passW);
          },
          this
        );
      }
    },
    mounted() {
    }
  };
</script>
<style scoped>
  .l-left {
    height: 0.4rem;
    width: 0.4rem;
  }

  li {
    font-size: 15px;
    height: 0.9rem;
    background: white;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    padding: 0 0.3rem;
    position: relative;
    border-bottom: 1px solid #ddd !important;
    border-top: 1px solid #ddd !important;
    margin-top: -1px;
  }

  .l-center {
    margin: 0 0.3rem;
  }

  .l-right {
    height: 0.3rem;
    width: 0.3rem;
    right: 0.3rem;
    top: 50%;
    margin-top: -0.5em;
    position: absolute;
  }

  li > span > span {
    font-size: 13px;
    color: #999999;
    line-height: 2em;
  }

  .first-last-style {
    margin: 0.3rem 0;
    border-bottom: 1px solid #ddd;
    border-top: 1px solid #ddd;
  }
</style>
