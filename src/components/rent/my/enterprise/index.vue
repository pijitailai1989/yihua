<template>
  <yd-layout class="layout_my">
      <yd-navbar class="header" slot="navbar" title="企业服务" color="#fff" :bgcolor="mainColor" height=".88rem">
         <div class="addClickArea"  @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
         </div>
      </yd-navbar>
    <div class="flex-row flex-start list" v-show="isShow">
      <!-- 写死的 -->
      <div class="flex center jusCenter"  @click="setUrl(item.name)" style="width:25%;" v-for="(item,index) in list" :key="index">
        <img :src="item.icon?item.icon:require(`../../../../assets/images/rent/ent/icon_0` + Number(index + 1) +'.png')" alt="">
        <div class="font28">{{item.name}}</div>
      </div>
      <div class="flex center jusCenter" @click="setUrl('服务订单')" style="width:25%;">
        <img src="../../../../assets/images/rent/ent/icon_06.png" alt="">
        <div class="font28">服务订单</div>
      </div>

      <div class="flex center jusCenter" @click="setUrl('业务模块')" style="width:25%;">
        <img src="../../../../assets/images/rent/ent/icon_07.png" alt="">
        <div class="font28">业务模块</div>
      </div>
      <div class="flex center jusCenter" @click="setUrl('特约写字楼')" style="width:25%;">
        <img src="../../../../assets/images/rent/ent/icon_08.png" alt="">
        <div class="font28">特约写字楼</div>
      </div>
   </div>

  </yd-layout>
</template>

<script>
  function setupWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'https://__bridge_loaded__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
  }
import fn from "@/assets/js/product.js";
export default {
  data() {
    if (this.$route.query.token) {
      this.getUserInfo(res => {
        this.mainColor = this.$color[this.userInfo.organType];
        this.getUserRoot();
      });
    } else {
      this.userInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("userInfo"))
      );
      this.organInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("organInfo"))
      );
      this.mainColor = this.$color[this.userInfo.organType];
      this.getUserRoot();
    }
    return {
      value1: "",
      num: 0,
      isShow:false,
      // mainColor
      // userInfo,
      // organInfo,
      list: []
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
    getUserRoot() {
      this.$ajax(
        `${this.subUrl.user}/user/getPermissions`,
        { userId: this.userInfo.guid, token: this.$getkey() },
        res => {
          console.log(res.data.workbench.subclass);
          this.isShow = true;
          this.list = res.data.workbench.subclass;
        },
        this
      );
    },
    turnTo(url) {
      console.log(111);
      this.$router.push(url);
    },
    setUrl(item) {
      switch (item) {
        case "任务进度":
          this.$router.push("/taskProcess");
          break;
        case "部门人员":
          this.$router.push("/personManger");
          break;
        case "工作汇报":
          this.$router.push("/taskreplay");
          break;
        case "供求管理":
          this.$router.push("/supplyManager");
          break;
        case "我的助手":
          this.$router.push("/myassistant");
          break;
        case "服务订单":
          this.$router.push("/estate/serviceList/waiqing");
          break;
        case "业务模块":
          // /estate/serviceList/building/detail?buildingId=391189500010692608&buildingName=%E6%B2%9B%E9%B8%BF%E5%A4%A7%E5%8E%A61&logo=http%3A%2F%2Foysfye6yt.bkt.clouddn.com%2FFuwAefaHfyoMvdVL15BMrBz_Sub3.png&isBuy=1
          console.log(this.userInfo);
          let data = {
            buildingId: this.userInfo.buildingId,
            buildingName: this.userInfo.buildingName,
            isRent: true
          };
          console.log(data);
          this.$router.push(
            `my/my_asset/voc_work`
          );
          break;
        case "特约写字楼":
          this.$router.push("/estate/serviceList/building");
          break;
        default:
          console.log(item);
      }
    },

    back() {
      if(this.$route.query.token){
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
          console.log('执行ios的方法')

          setupWebViewJavascriptBridge(function(bridge) {
            /* Initialize your app here */
            bridge.registerHandler('toIOSApp', function(data, responseCallback) {
              console.log("reciviceDate", data)
              responseCallback(data)
            })
            bridge.callHandler('toNativeApp', {'service':'this is a test data'}, function responseCallback(responseData) {
              console.log("JS received response:", responseData)
            })
          })
        } else {
          console.log('执行其他的方法')

          // 非这两种机型时退回主页面
          this.$router.go(-1);
        }
      }else{
        console.log('执行微信的方法')

        this.$router.go(-1);
      }
    }
  },
  mounted() {},
  beforeUpdate() {}
};
</script>
<style scoped>
.layout_my .header:after {
  display: none;
}
.layout_my {
  background: #f7f7f9;
}

.layout_my .blue_box {
  height: 0.88rem;
  background: #0093d2;
  background-size: 100% 100%;
}
.list {
  padding: 0.27rem 0;
  background: #fff;
  margin-bottom: 0.2rem;
}
.list > div {
  height: 2rem;
  flex-flow: column wrap;
}
.list > div img {
  margin-bottom: 0.1rem;
  width: 1.12rem;
  height: 1.12rem;
}
</style>
