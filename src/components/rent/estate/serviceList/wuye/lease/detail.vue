<template>
  <div style="height:100vh">
    <yd-layout v-show="showUser && showReplay">
      <yd-navbar slot="navbar" title="租赁问询详情" height=".88rem" color="#fff" :bgcolor="mainColor">
        <div class="addClickArea" slot="left" @click="$router.go(-1)">
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </div>
        <div class="addRightClickArea" slot="right" @click="checkHouse" :style="{color:'#fff'}"
             v-if="userInfo.organType == 3">房屋查询
        </div>
      </yd-navbar>
      <div class="bgwhite usuallyBox" style="padding:.2rem 0 .3rem" v-if="result.lease">
        <div class="list_item">
          <div class="label">单号</div>
          <div class="flex1">{{result.lease.guid}}</div>
        </div>
        <div class="list_item">
          <div class="label">问询时间</div>
          <div class="flex1">{{result.lease.createTime}}</div>
        </div>
        <div class="list_item">
          <div class="label">客户名称</div>
          <div class="flex1">{{result.lease.clientInfo.name}}</div>
        </div>
        <div class="list_item">
          <div class="label">联系电话</div>
          <div class="flex1">{{result.lease.clientInfo.account}}</div>
        </div>
        <div class="list_item">
          <div class="label">面积需求</div>
          <div class="flex1">{{result.lease.area}}平方米</div>
        </div>
        <div class="list_item">
          <div class="label">何时入驻</div>
          <div class="flex1">{{result.lease.settledTime.substr(0,10)}}</div>
        </div>
        <div class="list_item">
          <div class="label">主要用途</div>
          <div class="flex1">{{result.lease.muse}}</div>
        </div>
        <div class="list_item" style="height: auto;">
          <div class="label">其他备注</div>
          <div class="flex1" style="height: auto;">{{result.lease.remark}}</div>
        </div>
      </div>
      <div class="bgwhite usuallyBox mt3" style="padding:.2rem 0 .3rem" v-if="result.lease&&result.lease.contactsInfo">

        <div class="list_item">
          <div class="label">写字楼</div>
          <div class="flex1">{{result.lease.buildingName}}</div>
        </div>

        <div class="list_item">
          <div class="label">联系人</div>
          <div class="flex1">{{result.lease.contactsInfo.name}}</div>
        </div>
        <div class="list_item">
          <div class="label">联系电话</div>
          <div class="flex1">{{result.lease.contactsInfo.account}}</div>
        </div>
        <div class="list_item">
          <div class="label" style="display: inline-block">处理信息</div>
          <div class="" style="border:1px solid #ddd"></div>
        </div>
        <div class="font26 foCo9 radius" style="border:1px solid #ddd;margin: 0 .3rem 0 .6rem;padding: .1rem">
          {{result.lease.reply}}
        </div>

      </div>
      <div slot="bottom" class="flex-row-nowarp h9 bgwhite bt jusCenter foCo6"
           v-if="result.tasks && result.lease.status == 2">
        <div class="flex1 jusCenter br" @click="transForm">
          <!--<img src="" alt="">-->
          <yd-icon name="pinglun" size=".35rem" style="margin:.1rem .05rem 0 0 " custom></yd-icon>
          <span>转发</span>
        </div>
        <div class="flex1 jusCenter" @click="replay">
          <yd-icon name="pinglun" size=".35rem" style="margin:.1rem .05rem 0 0 " custom></yd-icon>
          <span>回复</span>
        </div>
      </div>
      <div slot="bottom" class="flex-row-nowarp h9 bgwhite bt jusCenter foCo6"
           v-if="result.tasks && result.lease.status == 3">
        <div class="flex1 jusCenter" @click="replay">
          <yd-icon name="pinglun" size=".35rem" style="margin:.1rem .05rem 0 0 " custom></yd-icon>
          <span>回复</span>
        </div>
      </div>
    </yd-layout>
    <departMent v-if='!showUser' :organId="organInfo.guid" @setUserId='setUserId'></departMent>
    <replay v-if="!showReplay" @operate="operate" :showFast="false"></replay>
  </div>
</template>

<script>
  import departMent from "../renovation/department_manager";
  import replay from "../rectification/replay";

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
    components: {
      departMent,
      replay
    },
    data() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = this.$color[this.userInfo.organType];
      return {
        result: {},
        showUser: true,
        showReplay: true,
      }
    }, methods: {
      checkHouse() {
        console.log('运行了')
          if (this.userAgent.isAndroid) {
            console.log('执行安卓的跳转');
            window.WebViewJavascriptBridge.callHandler(
              "chenkHouse",
              {param: `this is a checkhouse Page`},
              function () {
              }
            );
          } else {
            console.log('执行ios的跳转');
            toIOSApp(function (bridge) {
              /* Initialize your app here */
              bridge.registerHandler('receiveHouse', function (data, responseCallback) {
                console.log("reciviceDate", data);
                responseCallback(data)
              });
              bridge.callHandler('chenkHouse', {'service': `this is a checkhouse Page`}, function responseCallback(responseData) {
                console.log("JS received response:", responseData)
              })
              // alert(`${this.appLink}#/rent/circle/article/${guid}`)
            })
          }
      },
      transForm() {
        this.showUser = false;
      },
      replay() {
        this.showReplay = false;
      },
      setUserId(e) {
        console.log(111)
        this.showUser = true;
        if (e) {
          let data = {
            token: this.$getkey(),
            userId: this.userInfo.guid,
            leaseId: this.result.lease.guid,
            type: 2,
            handlerId: e.userId,
          };
          this.$ajax(`${this.subUrl.activity}/lease/reply`, data, res => {
            this.getDetail();
            this.$dialog.toast({mes: "转发成功", timeout: 800, icon: "success"})
          }, this)
        }
      },
      operate(e) {
        this.showReplay = true;
        if (e) {
          let data = {
            token: this.$getkey(),
            userId: this.userInfo.guid,
            leaseId: this.result.lease.guid,
            reply: e,
          }
          this.$ajax(`${this.subUrl.activity}/lease/handlerReply`, data, res => {
            this.getDetail();
            this.$dialog.toast({mes: "回复成功", timeout: 800, icon: "success"})
          }, this)
        }
      },
      getDetail() {
        let data = {
          userId: this.userInfo.guid,
          token: this.$getkey(),
          leaseId: this.$route.query.id,
        }
        this.$ajax(`${this.subUrl.activity}/lease/leaseDetail`, data, res => {
          this.result = res.data;
        }, this)
      },
    }, mounted() {
      this.getDetail();
    }
  }
</script>

<style scoped>
  .usuallyBox .list_item {
    height: .65rem;
  }

  .usuallyBox .flex1 {
    border: none;
    padding: 0;
  }
</style>
