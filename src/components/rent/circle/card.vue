<template>
  <div class="item" @click="goTo(listItem.guid)">
    <div class="top">
      <div class="title">【{{listItem.typeName}}】{{listItem.title}}</div>
      <!-- <div class="date"><span>昨天</span><span>12:13</span></div> -->
      <div class="date">{{listItem.createDate|times}}</div>
    </div>
    <div class="center">{{listItem.content}}</div>
    <div class="bottom">
      <div>
        <img class="header"
             :src="listItem.headPortrait?listItem.headPortrait:'http://oysfye6yt.bkt.clouddn.com/FrL_s80s2v-QQCw30uvFfSGve1K8'"/>
        <span class="userName">{{listItem.nickname}}</span>
      </div>
      <div>
        <div class="watch">
          <img src="../../../assets/images/rent/circle/eye_24.png" alt="">
          <span>{{listItem.commentNum?listItem.commentNum:0}}</span>
        </div>
        <div class="compenents">
          <img src="../../../assets/images/rent/circle/eye_27.png" alt="">
          <span>{{listItem.viewNum?listItem.viewNum:0}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  function toIOSApp(callback) {
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

  export default {
    props: ["listItem", "keyIndex"],
    data() {
      this.userInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("userInfo"))
      );
      return {};
    },
    methods: {
      goTo(guid) {
        if (!this.userInfo.isEnabled)
          return this.$dialog.alert({mes: "账号审核中，通过审核后才可体验完整功能"});
        this.$router.push(`/rent/circle/article/${guid}`);
        // console.log('执行iOS跳转的方法')
        // console.log(`${this.appLink}#/rent/circle/article/${guid}`)
        // if(this.userAgent.isAndroid){
        //   window.WebViewJavascriptBridge.callHandler(
        //     "jumpTo",
        //     {param:`/#${e}` },
        //     function () {
        //
        //     }
        //   );
        // }else{
        //   toIOSApp(function (bridge) {
        //     /* Initialize your app here */
        //     bridge.registerHandler('reciveCircle', function (data, responseCallback) {
        //       console.log("reciviceDate", data);
        //       responseCallback(data)
        //     })
        //     bridge.callHandler('circleLink', {'service': `/#/rent/circle/article/${guid}`}, function responseCallback(responseData) {
        //       console.log("JS received response:", responseData)
        //     })
        //     // alert(`${this.appLink}#/rent/circle/article/${guid}`)
        //   })
        // }
      }
    },
    mounted() {
    }
  };
</script>
<style scoped>
  .item {
    background: #fff;
    padding: 0 0.24rem;
  }

  .item .top {
    overflow: hidden;
    height: 0.7rem;
    line-height: 0.7rem;
  }

  .item .top .title {
    width: 60%;
    color: #333;
    font-weight: 600;
    font-size: 0.32rem;
    float: left;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .item .top .date {
    float: right;
    text-align: right;
    width: 39%;
    font-size: 0.26rem;
    color: #aaa;
  }

  .item .center {
    width: 88%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 0.6rem;
  }

  .item .bottom > div:nth-child(1) {
    float: left;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }

  .item .bottom > div:nth-child(2) {
    float: right;
    text-align: right;
    font-size: 0.26rem;
    color: #aaa;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    height: 0.62rem;
  }

  .item .bottom > div:nth-child(2) > div {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    margin-left: 0.2rem;
  }

  .item .bottom > div:nth-child(2) .watch img {
    width: 0.28rem;
    margin-right: 0.1rem;
  }

  .item .bottom > div:nth-child(2) .compenents img {
    width: 0.32rem;
    margin-right: 0.1rem;
  }

  .item .bottom .header {
    width: 0.62rem;
    height: 0.62rem;
    border-radius: 50%;
    border: 1px solid #ddd;
    margin-right: 0.2rem;
  }

  .item .bottom {
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
    overflow: hidden;
    border-bottom: 1px solid #ddd;
  }

  .item .bottom .userName {
    font-size: 0.28rem;
    line-height: 0.62rem;
  }
</style>
