<template>
  <yd-layout class="layout_my">
    <yd-navbar class="header" v-title="'物业服务单'" v-show="!userAgent.isWX" slot="navbar" title="物业服务单" color="#fff"
               :bgcolor="mainColor"
               height=".88rem">
      <span slot="left" class="addClickArea" @click="back('/index/1/'+local.b+'/3/rent/my')">
        <span>
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </span>
      </span>
    </yd-navbar>
    <div v-if="isShowlist">
      <div class="serviceList" v-show="userInfo.organType == 3">
        <ul @click="serviceSetting(1)" style="border-right:1px solid #ddd">
          <li>
            <i>
              <img style='width:100%;' src="../../../../assets/images/rent/estate/icon_01.png">
            </i>
            <p>外勤服务</p>
          </li>
        </ul>
        <ul @click="serviceSetting(2)">
          <li>
            <i>
              <img style='width:100%;' src="../../../../assets/images/rent/estate/icon_02.png">
            </i>
            <p>特约写字楼</p>
          </li>
        </ul>
        <ul @click="serviceSetting(3)">
          <li>
            <i>
              <img style='width:100%;' src="../../../../assets/images/rent/estate/icon_03.png">
            </i>
            <p>业务设置</p>
          </li>
        </ul>
      </div>

      <div class="serviceList">
        <ul v-for="(item,index) in serviceList" @click="turnTo(item.name)" :key="index"
            v-if="item.name!='通知' ">
          <li>
            <i>
              <img :src="item.icon" alt="">
            </i>
            <p>{{item.name}}</p>
          </li>
        </ul>
        <!-- <ul v-if="(serviceList.length-1)%3 == 1"></ul> -->
        <!-- <ul v-if="(serviceList.length%3-1) == 1 || (serviceList.length%3-1)%3 == 2"></ul> -->
      </div>
      <!-- 剩余两个 -->
      <!-- <div class="serviceList">
        <ul v-for="(item,index) in serviceList" v-if='index >= 9' :key="index">
          <li @click="turnTo(item.name)">
            <i>
              <img :src="item.icon" alt="">
            </i>
            <p>{{item.name}}</p>
          </li>
        </ul>
      </div> -->
    </div>
    <!-- <div class="contentList" v-if="userInfo.organType == 1">
      <div class="content" v-for="(item,index) in contentList" :key="index">
        <div class="top">
          <p>
            <yd-icon custom name='leibie' size='.3rem'></yd-icon>类别：{{item.list}}</p>
          <span>单号：{{item.guid}}</span>
        </div>
        <div class="bottom">
          <i style='width:.65rem;height:.8rem;'>
            <img src="../../../../assets/images/rent/estate/icon_03.png" alt="">
          </i>
          <p>
            <span>{{item.msg}}</span>
            <a>{{item.ress}}</a>
          </p>
          <span>
            <span :style="{color:item.status?'':'#FAB648',border:'1px solid #FAB648'}">{{item.status?'':'处理中'}}</span>
            <p>
              <yd-icon custom name='rili' size='.4rem' style='margin-top:-.08rem'></yd-icon>{{item.data}}</p>
          </span>
        </div>
      </div>
    </div> -->
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
  import Vue from "vue";
  import fn from "@/assets/js/product";
  import qs from "qs";

  export default {
    data() {
      var userInfo = {},
        mainColor;
      var para = this.$route.query;
      this.$dialog.loading.open("加载中");
      if (para.token) {
        this.getUserInfo(
          {
            token: para.token,
            userId: para.userId
          },
          res => {
            this.userId = this.userInfo.guid;
            this.getkey = para.token;
            this.mainColor = this.$color[this.userInfo.organType];
            this.getPermissions();
          }
        );
      } else {
        this.userInfo = JSON.parse(
          decodeURIComponent(localStorage.getItem("userInfo"))
        );
        var mainColor = this.$color[this.userInfo.organType];
        this.getPermissions();
      }
      return {
        para,
        mainColor,
        isShowlist: false,
        userInfo,
        serviceList: [],
        contentList: [
          {
            list: "维修",
            guid: 201700001,
            msg: "维修大门损坏",
            status: 0,
            ress: "1栋203单元",
            data: "2017-10-10"
          }
        ],
        local: {
          a: 0,
          b: 0
        }
      };
    },
    methods: {
      serviceSetting(e) {
        var url = "";
        switch (Number(e)) {
          case 1:
            url = "/estate/serviceList/waiqing";
            break;
          case 2:
            url = "/estate/serviceList/building";
            break;
          case 3:
            url = "/estate/serviceList/setting";
            break;
          default:
            console.log("没有匹配的case参数");
        }
        this.$router.push(url);
      },
      turnTo(url) {
        switch (url) {
          case "缴费":
            console.log(this.userInfo);
            if (this.userInfo.organType == 3) {
              this.$router.push("/estate/serviceList/wuye/payment");
            } else {
              this.$router.push("/estate/serviceList/payment");
            }
            break;
          case "通知":
            if (this.userInfo.organType == 3) {
              this.$router.push("/estate/serviceList/wuye/notice");
            } else {
              this.$router.push("/estate/serviceList/notice");
            }
            break;
          case "装修":
            if (this.userInfo.organType == 3) {
              this.$router.push("/estate/serviceList/wuye/renovation");
            } else {
              this.$router.push("/estate/serviceList/renovation");
            }
            break;
          case "整改":
            if (this.userInfo.organType == 3) {
              this.$router.push("/estate/serviceList/wuye/rectification");
            } else {
              this.$router.push("/estate/serviceList/rectification");
            }
            break;
          case "接待":
            if (this.userInfo.organType == 3) {
              this.$router.push("/estate/serviceList/wuye/reception");
            } else {
              this.$router.push("/estate/serviceList/reception");
            }
            break;
          case "报修":
            if (this.userInfo.organType == 3) {
              this.$router.push("/estate/wuye/repair");
            } else {
              this.$router.push("/estate/repair");
            }
            break;
          case "投诉":
            if (this.userInfo.organType == 3) {
              this.$router.push("/estate/serviceList/wuye/complain");
            } else {
              this.$router.push("/estate/serviceList/complain");
            }
            break;
          case "入驻":
            if (this.userInfo.organType == 3) {
              this.$router.push("/estate/serviceList/wuye/settled");
            } else {
              this.$router.push("/estate/serviceList/settled");
            }
            break;
          case "退租":
            if (this.userInfo.organType == 3) {
              this.$router.push("/estate/serviceList/wuye/exit_rent");

            } else {
              this.$router.push("/estate/serviceList/exit_rent");
            }
            break;
          case "放行条":
            if (this.userInfo.organType == 3) {
              this.$router.push("/estate/serviceList/wuye/release_pass");
            } else {
              this.$router.push("/estate/serviceList/release_pass");
            }
            break;
          case "租赁":
            if (this.userInfo.organType == 3) {
              this.$router.push("/estate/serviceList/wuye/lease");
            } else {
              this.$router.push("/estate/serviceList/lease");
            }
            break;
          case '服务设置':
            if (this.userInfo.organType == 3) {
              this.$router.push("/estate/serviceList/waiqing/setting");
            }
        }
      },
      back(url) {
        // 有传参时代表是嵌入网页的app
        if (this.$route.query.token) {
          if (this.userAgent.isAndroid) {
            window.WebViewJavascriptBridge.callHandler(
              "doBack",
              {param: ""},
              function () {
              }
            );
          } else if (this.userAgent.isIOS) {
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
            // 非这两种机型时退回主页面
            this.$router.go(-1);
          }
        } else {
          this.$router.go(-1);
        }
      },
      // 获取邀请信息列表
      getPermissions() {
        var data = {userId: this.userInfo.guid, token: this.$getkey()};
        console.log(data);
        var userType = this.userInfo.organType;
        this.xhr
          .post(`${this.subUrl.user}/user/getPermissions`, qs.stringify(data))
          .then(res => {
            this.$dialog.loading.close();
            this.isShowlist = true;
            console.log(res.data, "邀请信息列表");
            if (res.data.code == 1) {
              console.log("邀请信息列表", userType);
              if (userType == 3) {
                var arr = res.data.data.propertyManagement.subclass;
                for (var i in arr) {
                  if (arr[i].name == "物业服务") {
                    this.serviceList = arr[i].subclass;
                  }
                }
              } else {
                this.serviceList = res.data.data.propertyService.subclass;
              }
            } else if (res.data.code == "-902") {
              //-902
              /*重新登录*/
              fn.re_login(this);
            } else {
              this.$dialog.toast({mes: res.data.msg});
            }
          });
      },
      getUserInfo(data, cb) {
        // alert(1)
        this.xhr
          .post(`${this.subUrl.user}/user/getUserInfo`, qs.stringify(data))
          .then(res => {
            if (res.data.code == 1) {
              this.userInfo = res.data.data.userInfo;
              this.organInfo = res.data.data.organInfo;
              localStorage.setItem(
                "userInfo",
                encodeURIComponent(JSON.stringify(res.data.data.userInfo))
              );
              localStorage.setItem(
                "organInfo",
                encodeURIComponent(JSON.stringify(res.data.data.organInfo))
              );
              localStorage.setItem("to", encodeURIComponent(res.data.data.token));
              fn.setIng(this.$route.query.token);
              var a = res.data.data.userInfo.organType;
              var b = res.data.data.userInfo.admin ? 1 : 0;
              localStorage.setItem("organType", a);
              localStorage.setItem("isManger", b);
              localStorage.setItem("user_Id", res.data.data.userInfo.guid);
              cb && cb(res.data);
            } else if (res.data.code == "-902") {
              //-902
              /*重新登录*/
              fn.re_login(this);
            } else {
              this.$dialog.toast({mes: res.data.msg});
            }
          });
      }
    },
    mounted() {
    }
  };
</script>
<style scoped>
  .layout_my .header:after {
    display: none;
  }

  .layout_my .blue_box {
    height: 0.88rem;
    background: #0093d2;
    background-size: 100% 100%;
  }

  .set_service {
    width: 100%;
    height: 1.2rem;
    background: white;
    margin: 0.3rem 0;
  }

  .set_service > ul {
    width: 100%;
    height: 100%;
    display: flex;
    border-bottom: 1px solid #e4e6e6;
    border-top: 1px solid #e4e6e6;
  }

  .set_service > ul > li {
    flex: 1;
    display: flex;
    flex-flow: row;
    justify-content: center;
    align-items: center;
  }

  .set_service > ul > li > p {
    font-size: 30;
    margin-right: 0.3rem;
  }

  .set_service > ul > li:nth-child(1) {
    border-right: 1px solid #e4e6e6;
  }

  .set_service > ul > li > i {
    width: 0.9rem;
    height: 0.9rem;
    /* background: red; */
    border-radius: 50%;
  }

  .serviceList {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    background: white;
    border-top: 1px solid #ddd;
    /* padding: 0.2rem 0; */
    margin-top: 0.3rem;
  }

  .serviceList > ul {
    width: 33.33333333%;
    height: 2.2rem;
    display: flex;
    flex-flow: row wrap;
    background: white;
    justify-content: center;
    align-items: center;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    /* margin-right: -1px; */
  }

  .serviceList > ul:nth-child(3n) {
    border-right: 0;
  }

  .serviceList ul li {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    margin: 0.2rem 0;
  }

  .serviceList ul li > i {
    width: 0.5rem;
    height: 0.5rem;
    margin-bottom: 0.15rem;
  }

  .serviceList ul li > i > img {
    width: 100%;
    height: 100%;
  }

  .serviceList ul li > p {
    font-size: 0.3rem;
    margin-top: 0.1rem;
  }

  .search {
    width: 100%;
    height: 0.8rem;
    background: white;
    display: flex;
    flex-flow: row;
    border-bottom: 1px solid #ddd;
    padding: 0.15rem 0.3rem;
  }

  .search > div:nth-child(1) {
    flex: 1;
    background: #ebebed;
    border-radius: 0.6rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .search > div:nth-child(1) > i {
    width: 0.35rem;
    height: 0.35rem;
    margin-right: 0.1rem;
  }

  .search > div:nth-child(1) > i > img {
    width: 100%;
    height: 100%;
  }

  .search > div:nth-child(1) > span {
    width: 2.4rem;
  }

  .search > div:nth-child(1) > span > input {
    width: 100%;
    font-size: 0.24rem;
    color: #a2a1a6;
    border: none;
  }

  .search > div:nth-child(2) {
    width: 1.6rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* 列表 */

  .contentList {
    width: 100%;
  }

  .content {
    width: 100%;
    display: flex;
    flex-flow: column;
    padding: 0.1rem 0.2rem;
    background: white;
    margin-top: 0.2rem;
  }

  .top {
    border-bottom: 1px dashed #aaaaaa;
    color: #747474;
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
    font-size: 0.24rem;
  }

  .top > p {
    height: 0.6rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .top > p > i {
    height: 0.3rem;
    width: 0.3rem;
    margin-right: 0.1rem;
  }

  .top > p > i > img {
    width: 100%;
    height: 100%;
  }

  .bottom {
    display: flex;
    flex-flow: row;
    padding: 0.1rem 0 0.1rem 0.1rem;
    align-items: center;
  }

  .bottom > i {
    width: 1rem;
    height: 1.2rem;
  }

  .bottom > i > img {
    width: 100%;
    height: 100%;
  }

  .bottom > p {
    flex: 1;
    display: flex;
    flex-flow: column;
    justify-content: center;
    padding: 0 0.2rem;
  }

  .bottom > p > a {
    font-size: 0.24rem;
    color: #747474;
  }

  .bottom > p > span {
    font-size: 0.32rem;
    color: #000;
    margin: 0.1rem 0;
  }

  .bottom > span {
    width: 2rem;
    height: 1.2rem;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: flex-end;
  }

  .bottom > span > span {
    margin-bottom: 0.3rem;
    border-radius: 0.04rem;
    font-size: 0.22rem;
  }

  .bottom > span > p {
    display: flex;
    font-size: 0.24rem;
    color: #747474;
  }

  .bottom > span > p > i {
    height: 0.3rem;
    width: 0.3rem;
    margin-right: 0.1rem;
  }

  .bottom > span > p > i > img {
    width: 100%;
    height: 100%;
  }
</style>
