<template>
  <yd-layout class="layout_my">
    <yd-navbar class="header" slot="navbar" v-show="!userAgent.isWX" v-title="'详情'" title="详情" color="#fff"
               :bgcolor="mainColor" height=".88rem">
         <span class="addClickArea spanLeft" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
    </yd-navbar>
    <div class="content">
      <div class="organInfos">
        <div class="info">
          <ul>
            <li><span>标题</span>
              <p>{{productInfo.title}}</p>
              <a class="font24" :style="{border:'1px solid'+mainColor,color:mainColor}">{{productInfo.state}}</a></li>
            <li><span>供应商</span>
              <p>{{organInfoDto3.organName}}</p>
              <a v-if="productInfo.userId!=userId" @click="turnTo('/supply/product/my_card?userId='+productInfo.userId+'&oName='+organInfoDto3.organName)"
                 :style="{color:mainColor}">【商家名片】</a></li>
            <li><span></span>
              <p><i style="background:#C8E7FF;color:#61BBFF;"
                    v-if="organInfoDto3.vipType!=''">{{organInfoDto3.vipType}}</i>
                <i style="background:#FFE7C8;color:#FFB454;">{{organInfoDto3.years}}年</i></p>
              <a v-if="productInfo.userId!=userId" :style="{color:mainColor}" @click="applyContact">【商家联系我】</a></li>
            <li><span>发布时间</span>
              <p>{{productInfo.createTime}}</p></li>
            <li><span>联系人</span>
              <p>{{organInfoDto3.userName}}</p>
              <a v-if="productInfo.isLookPhone==0&&productInfo.userId!=userId" @click="openConfrim"
                 :style="{border:'1px solid'+mainColor,color:mainColor}">
                <i v-if="mainColor=='#23ac38'"><img src="../../../../assets/images/rent/supply/phone1.png" alt=""></i>
                <i v-else><img src="../../../../assets/images/rent/supply/phone.png" alt=""></i>联系</a>
              <a v-if="productInfo.isLookPhone==1&&productInfo.userId!=userId" @click="openC"
                 :style="{border:'1px solid'+mainColor,color:mainColor}">
                <i v-if="mainColor=='#23ac38'"><img src="../../../../assets/images/rent/supply/phone1.png" alt=""></i>
                <i v-else><img src="../../../../assets/images/rent/supply/phone.png" alt=""></i>联系(已查看)</a>
            </li>
            <li><span>所在地</span>
              <p>{{organInfoDto3.organAddress}}</p>
              <a :style="{border:'1px solid'+mainColor,color:mainColor}" v-if="2==1">
                <i v-if="mainColor=='#23ac38'"><img src="../../../../assets/images/rent/supply/ding1.png" alt=""></i>
                <i v-else><img src="../../../../assets/images/rent/supply/ding2.png" alt=""></i>
                地图</a></li>
            <li><span>最小采购</span>
              <p>{{productInfo.minNumber==0?'不限':productInfo.minNumber}}</p></li>
            <li v-if="productInfo.userId!=userId"><span>价格</span>
              <p v-if="productInfo.isLookPhone==0" @click="openConfrim1">点击询价</p>
              <p v-if="productInfo.isLookPhone==1" @click="alert(3)">点击询价</p>
            </li>
          </ul>
        </div>
        <div class="group_buying" v-if="productInfo.isGroup!=0">
          <div>团购进行中</div>
          <div>
            <ul>
              <li style="height:.8rem;"><p>已参加</p><span style="color:#F2725E;font-size:.8rem;">{{productInfo.paGroupNum}}</span><a>倒计时</a>
              </li>
              <li><span style="margin-left:.3rem;color:#999">{{priceList[0]}}</span>
                <a>
                  <template>
                    <yd-countdown slot="right" :time="productInfo.endTime">
                      <em>{%d1}{%d2}</em>天
                      <em>{%h1}{%h2}</em>时
                      <em>{%m1}{%m2}</em>分
                    </yd-countdown>
                  </template>
                </a>
              </li>
              <li><span style="margin-left:.4rem;color:#999">{{priceList[1]}}</span><a>服务区域
                {{productInfo.scopeValueStr}}</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="text">
        <div class="ttt" style="margin-bottom:.2rem;">详情介绍</div>
        <ul>
          <li v-show="item.parameterName!=''" v-for="(item,index) in productParameterList" :key="index">
            {{item.parameterName}}：{{item.parameterValue}}
          </li>
        </ul>
        <p class="textHidden4">{{productInfo.explains}}</p>
        <div class="images">
          <!-- <ul>
            <li v-for="(item,index) in imgList" :key="index"><img :onerror="logo" :src="item" alt=""></li>
          </ul> -->
            <yd-lightbox :num="imgList.length">
                <yd-lightbox-img :onerror="imgs" v-for="(item,index) in imgList" :key="index" :src="item"></yd-lightbox-img>
            </yd-lightbox>
        </div>
      </div>

      <div class="declares" style="margin:.2rem 0">
        <ol>
          <li style="color:#333;">服务内容</li>
        </ol>
        <div class="textar" v-show="productInfo.serviceContent!=''">
          <span style="padding:.2rem 0">
            {{productInfo.serviceContent}}
          </span>
        </div>
        <div class="important-input-div" v-show="keyword.length>0">
          <input v-show="keyword[0]!=null" type="text" v-model="keyword[0]" disabled="disabled" placeholder="">
          <input v-show="keyword[1]!=null" placeholder="" v-model="keyword[1]" type="text" disabled="disabled">
          <input v-show="keyword[2]!=null" placeholder="" v-model="keyword[2]" type="text" disabled="disabled">
        </div>
      </div>

      <yd-accordion accordion style="background:none;">
        <!-- 发布范围 -->
        <yd-accordion-item title="范围" style="margin-bottom:.2rem;background:#fff;" open>
          <div style="padding: .24rem;display:flex;justify-content: space-between;color:#999;">
            <span class="scope">{{productInfo.scopeValueStr}}</span>
            <!-- <span>高新园</span> -->
          </div>
        </yd-accordion-item>
      </yd-accordion>

      <div class="text" v-show="2==1">
        <div class="ttt">更多推荐</div>
        <div class="images">
          <ul>
            <li><img src="../../../../assets/images/rent/supply/photo.png" alt=""></li>
            <li><img src="../../../../assets/images/rent/supply/photo.png" alt=""></li>
            <li><img src="../../../../assets/images/rent/supply/photo.png" alt=""></li>
            <li><img src="../../../../assets/images/rent/supply/photo.png" alt=""></li>
            <li><img src="../../../../assets/images/rent/supply/photo.png" alt=""></li>
          </ul>
        </div>
      </div>
      <div class="alertText" v-show="alertT">
        <ul>
          <li class="a" v-show="this.bm.type==2||this.bm.type==1"><p class="font28">姓名：</p><span><input
            v-model="bm.name" type="text" placeholder="请填写"></span></li>
          <li class="a" v-show="this.bm.type==2||this.bm.type==1"><p class="font28">电话：</p><span><input
            v-model="bm.phone" type="number" placeholder="请填写"></span></li>
          <li class="a" v-show="this.bm.type==2||this.bm.type==1"><p class="font28">验证码：</p><span><input
            v-model="bm.code" type="number" placeholder="请填写"></span></li>
          <li class="a" v-show="this.bm.type==2||this.bm.type==1"><p class="font28">地址：</p><span><input
            v-model="bm.address" type="text" placeholder="请填写"></span></li>
          <li class="a b">
            <p class="font28" v-show="this.bm.type==2||this.bm.type==1">备注：</p>
            <p class="font28" v-show="this.bm.type==3">我的留言：</p>
            <span style="height:1.4rem;"><textarea v-model="bm.remarks"></textarea></span>
          </li>
          <li>
            <button @click="cancel" :style="{background:mainColor}">取 消</button>
            <button @click="confirm" :style="{background:mainColor}">确 定</button>
          </li>
        </ul>
      </div>
    </div>

    <yd-tabbar slot="tabbar" v-show="this.userId!=productInfo.userId">
      <yd-tabbar-item title="免费预约" link="#" @click.native="alert(2)" v-if="productInfo.isBespeak==1">
        <yd-icon name="ucenter-outline" slot="icon"></yd-icon>
      </yd-tabbar-item>
      <yd-tabbar-item title="参加团购" link="#" @click.native="alert(1)" v-if="productInfo.isGroup==1">
        <yd-icon name="ucenter-outline" slot="icon"></yd-icon>
      </yd-tabbar-item>
    </yd-tabbar>
  </yd-layout>
</template>
<script>
  import Vue from 'vue';
  import fn from '@/assets/js/product'
  import qs from 'qs'
  import {CountDown} from 'vue-ydui/dist/lib.rem/countdown';
  import {Layout} from 'vue-ydui/dist/lib.rem/layout';

  Vue.component(Layout.name, Layout);
  Vue.component(CountDown.name, CountDown);
  import {Icons} from 'vue-ydui/dist/lib.rem/icons';

  Vue.component(Icons.name, Icons);
  import {LightBox, LightBoxImg, LightBoxTxt} from 'vue-ydui/dist/lib.rem/lightbox';
Vue.component(LightBox.name, LightBox);
Vue.component(LightBoxImg.name, LightBoxImg);
Vue.component(LightBoxTxt.name, LightBoxTxt);
  import {Confirm, Alert, Toast, Notify, Loading} from 'vue-ydui/dist/lib.rem/dialog';

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
  Vue.prototype.$dialog = {
    confirm: Confirm,
    alert: Alert,
    toast: Toast,
    notify: Notify,
    loading: Loading,
  };
  export default {
    data() {
      return {
        imgs: 'this.src="' + require('../../../../assets/images/rent/supply/chan.png') + '"',
        organInfo: {},
        userInfo: {},
        getkey: '',
        mainColor: "",
        titleT: '',
        guid: '',
        userId: '',
        productInfo: {},
        organInfoDto3: {},
        productParameterList: [],
        keyword: [],
        alertT: false,
        bm: {
          name: '',
          phone: '',
          code: '',
          remarks: '',
          address: '',
          type: 1
        },
        imgList: [],
        priceList: [],
        para: {
          value: ''
        }
      }
    },
    methods: {
      openC() {
        this.$dialog.alert({mes: '联系电话：' + this.organInfoDto3.phone});
      },
      lookPhonePara() {
        let data = {};
        data.token = this.getkey;
        data.type = 'lookPhone';
        this.$ajax(
          `${this.subUrl.bd}/purchase/lookPhonePara`,
          data,
          res => {
            this.para = res.data.para
            console.log(this.para.value)
          },
          this
        );
      },
      openConfrim() {
        this.$dialog.confirm({
          mes: '此次需支付' + this.para.value + '商机点！',
          opts: () => {
            this.lookPhone();
          }
        });
      },
      openConfrim1() {
        this.$dialog.confirm({
          mes: '此次需支付' + this.para.value + '商机点！',
          opts: () => {
            this.lookPhone(1);
          }
        });
      },
      // 查看
      lookPhone(type) {
        let data = {};
        data.guid = this.guid;
        data.token = this.getkey;
        data.lookType = 3;
        data.payType = 2;
        this.$ajax(
          `${this.subUrl.bd}/purchase/lookPhone`,
          data,
          res => {
            if (type == 1) {
              this.productInfo.isLookPhone = 1
              this.$dialog.toast({mes: '支付成功!'});
              this.alert(3);
            } else {
              this.productInfo.isLookPhone = 1
              this.productInfos();
              this.$dialog.alert({mes: '联系电话：' + res.data.account});
            }
          },
          this
        );
      },
      //邀联
      applyContact() {
        let data = {};
        data.token = this.getkey;
        data.productId = this.guid;
        this.$ajax(
          `${this.subUrl.bd}/product/applyContact`,
          data,
          res => {
            this.$dialog.toast({mes: '发送成功!'});
          },
          this
        );
      },

      //询价、预约
      confirm(type) {
        if (this.bm.type == 2 || this.bm.type == 1) {
          let data = {};
          data.token = this.getkey;
          data.productId = this.guid;
          data.name = this.bm.name;
          data.phone = this.bm.phone;
          data.code = this.bm.code;
          data.remarks = this.bm.remarks;
          data.address = this.bm.address;
          data.type = this.bm.type;
          this.$ajax(
            `${this.subUrl.bd}/product/addGroup`,
            data,
            res => {
              this.$dialog.toast({mes: '发送成功!'});
              this.alertT = false;
              this.bm.remarks = null
            },
            this
          );
        } else if (this.bm.type == 3) {
          let data = {};
          data.token = this.getkey;
          data.productId = this.guid;
          data.message = this.bm.remarks;
          this.$ajax(
            `${this.subUrl.bd}/product/addProductInquiry`,
            data,
            res => {
              this.$dialog.toast({mes: '发送成功!'});
              this.alertT = false;
              this.bm.remarks = null
            },
            this
          );
        }
      },

      cancel() {
        this.alertT = false;
      },
      alert(type) {
        this.bm = {
          name: '',
          phone: null,
          code: null,
          remarks: '',
          address: '',
        },
          this.alertT = true
        this.bm.type = type;
      },
      toggle() {
        this.show = !this.show;
      },
      turnTo(url) {
        this.$router.push(url)
      },
      back() {
        console.log(111)
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
      // 获取列表
      productInfos() {
        var data = {token: this.getkey, productId: this.guid};
        this.xhr.post(`${this.subUrl.bd}/product/productInfo`, qs.stringify(data)).then((res) => {
          console.log(res)
          if (res.data.code == 1) {
            this.productInfo = res.data.data.productInfo;
            this.imgList = this.productInfo.productImg.split(',')
            //  console.log(this.imgList,2222222222)
            this.priceList = this.productInfo.priceSectionDescribe.split(',')
            this.organInfoDto3 = res.data.data.productInfo.organInfoDto3;
            if (this.organInfoDto3.vipType == 1) {
              this.organInfoDto3.vipType = '基础'
            } else if (this.organInfoDto3.vipType == 2) {
              this.organInfoDto3.vipType = '中级'
            } else if (this.organInfoDto3.vipType == 3) {
              this.organInfoDto3.vipType = '高级'
            } else if (this.organInfoDto3.vipType == 4) {
              this.organInfoDto3.vipType = '金牌'
            } else if (this.organInfoDto3.vipType == 0) {
              this.organInfoDto3.vipType = '';
            }
            if (this.productInfo.state == 0) {
              this.productInfo.state = '已删除'
            } else if (this.productInfo.state == 1) {
              this.productInfo.state = "已上线"
            } else if (this.productInfo.state == 2) {
              this.productInfo.state = "已下线"
            } else if (this.productInfo.state == 3) {
              this.productInfo.state = "审核中"
            } else if (this.productInfo.state == 4) {
              this.productInfo.state = "未通过"
            }
            this.productInfo.createTime = this.productInfo.createTime.split(' ')[0];
            this.productParameterList = res.data.data.productInfo.productParameterList;
            if (this.productInfo.keyword != '') {
              this.keyword = this.productInfo.keyword.split(',')
            }
            console.log(this.productParameterList)
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      },
      getUserInfo(data, cb) {
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
              localStorage.setItem(
                "to",
                encodeURIComponent(this.$route.query.token)
              );
              fn.setIng(this.$route.query.token);
              var a = res.data.data.userInfo.organType;
              var b = res.data.data.userInfo.admin ? 1 : 0;
              localStorage.setItem("organType", a);
              localStorage.setItem("isManger", b);
              localStorage.setItem("user_Id", res.data.data.userInfo.guid);
              this.$emit("mainColor", this.$color[3]);
              cb && cb(res.data);
            } else if (res.data.code == "-902") {
              //-902
              /*重新登录*/
              fn.re_login(this);
            } else {
              this.$dialog.toast({mes: res.data.msg});
            }
          });
      },
    },
    mounted() {
      if (!this.$route.query.token) {
        this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
        this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
        this.mainColor = this.$color[this.userInfo.organType]
        this.userId = this.userInfo.guid;
        this.getkey = fn.getIng();

        this.guid = this.$route.params.guid;
        console.log(this.userId, 11111111111)
        this.productInfos();
        this.lookPhonePara();
      } else {
        this.getUserInfo({userId: this.$route.query.userId, token: this.$route.query.token}, res => {
          this.getkey = this.$getkey();
          this.mainColor = this.$color[this.userInfo.organType]
          this.userId = this.userInfo.guid;
          this.getkey = fn.getIng();
          this.guid = this.$route.params.guid;
          console.log(this.userId, 11111111111)
          this.productInfos();
          this.lookPhonePara();
        })
      }


    }
  }
</script>
<style scoped>
  .layout_my .header:after {
    display: none;

  }

  .layout_my {
    background: #EEF3FA;
  }

  .layout_my .blue_box {
    height: 0.88rem;
    background-size: 100% 100%;
  }

  .declares {
    width: 100%;
    background: white;
  }

  .declares > ul > li > span > i {
    padding: .02rem .02rem;
    color: #F2725E;
    border: 1px solid #F2725E;
    margin-left: .2rem;
    border-radius: .1rem;
  }

  .declares > ul {
    width: 100%;
    padding: 0.1rem 0.3rem;
  }

  .declares > ul li {
    display: flex;
    flex-flow: row;
    justify-content: center;
    align-items: center;
  }

  .declares > ul li > p {
    width: 1.4rem;
    display: flex;
    height: 0.6rem;
    justify-content: flex-end;
    align-items: center;
    font-size: 0.3rem;
    color: #777;
  }

  .declares > ul li > span {
    flex: 1;
    height: 0.6rem;
    display: flex;
    align-items: center;
    border-radius: 0.05rem;
    margin-left: .2rem;
  }

  .declares > ul li > span > input {
    width: 100%;
    height: 100%;
    border: none;
    margin-left: 0.1rem;
  }

  .declares > ol {
    width: 100%;
    margin-bottom: .2rem;
  }

  .declares > ol li {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    height: .8rem;
    color: #777;
    padding: 0 .4rem;
    align-items: center;
  }

  .declares > ol li > p {
    flex: 1;
    height: .8rem;
    line-height: .8rem;
  }

  .declares > ol li > span {
    width: 1.5rem;
    height: .8rem;
    line-height: .8rem;
  }

  .declares > ol li:nth-child(1) {
    border-bottom: 1px solid #ECECEC;
  }

  .organInfos {
    width: 100%;
    background: white;
  }

  .info {
    width: 100%;
    background: white;
    border-bottom: 1px solid #F3F6F5;
    font-size: .28rem;
    padding: .2rem 0;
  }

  .info ul li {
    display: flex;
    padding: .1rem .2rem;
  }

  .info ul li > span {
    width: 1.3rem;
    text-align: right;
    color: #9D9E9D;
  }

  .info ul li > p {
    flex: 1;
    padding: 0 .2rem;
    display: flex;
  }

  .info ul li > a {
    text-align: right;
    display: flex;
    padding: .03rem .05rem;
    border-radius: .05rem;
    font-size: .24rem;
    align-items: center;
  }

  .info ul li > a > i {
    display: flex;
    width: .3rem;
    height: .3rem;
    margin-right: .05rem;
  }

  .info ul li > a > i > img {
    width: 100%;
    height: 100%;
  }

  .info ul li > p > i {
    width: .8rem;
    height: .35rem;
    font-size: .24rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: .2rem;
  }

  .group_buying {
    width: 100%;
  }

  .group_buying > div:nth-child(1) {
    width: 100%;
    border-bottom: 1px solid #F3F6F5;
    padding: .1rem .3rem;
    color: #F2725E;
    font-size: .3rem;
    font-weight: 600;
  }

  .group_buying > div:nth-child(2) > ul {
    width: 100%;
    padding: .3rem 0;
  }

  .group_buying > div:nth-child(2) > ul > li {
    display: flex;
    padding: .05rem 0;
    align-items: center;
  }

  .group_buying > div:nth-child(2) > ul > li > p {
    width: 1.3rem;
    text-align: right;
    color: #9D9E9D;
  }

  .group_buying > div:nth-child(2) > ul > li > span {
    flex: 1;
    padding: 0 .2rem;
  }

  .group_buying > div:nth-child(2) > ul > li > a {
    width: 3.6rem;
    color: #9D9E9D;
  }

  .group_buying > div:nth-child(2) > ul > li > a em {
    padding: .1rem .06rem;
    border: 1px solid #F5F5F4;
    margin-right: .05rem;
  }

  .text {
    width: 100%;
    background: white;
    margin: .3rem 0;
    display: flex;
    flex-flow: column;
    align-items: center;
  }

  .text > .ttt {
    width: 100%;
    border-bottom: 1px solid #F3F6F5;
    padding: .1rem .3rem;
    font-size: .28rem;
  }

  .text > ul {
    width: 100%;
  }

  .text > ul > li {
    padding: .1rem .4rem;
  }

  .text > p {
    width: 90%;
    border: 1px solid #EFF1F1;
    text-indent: .5rem;
    line-height: .5rem;
    font-size: .3rem;
    font-weight: 600;
    color: #5A5B5A;
    padding: .1rem .2rem;
  }

  /* .images {
    width: 90%;
    margin-top: .2rem;
    display: flex;
    margin-bottom: .3rem;
  }

  .images > ul {
    width: 100%;
    display: flex;
    flex-flow: row;
    justify-content: flex-start;
    align-items: center;
  }

  .images > ul > li {
    width: 1.2rem;
    height: 1.2rem;
    border-radius: .1rem;
    margin-right: .2rem;
  }

  .images > ul > li > img {
    width: 100%;
    height: 100%;
    border-radius: .1rem;
  } */
  .images{width:90%;margin-top:.2rem;margin-bottom:.3rem;}
  .images>div{width:100%;display: flex;flex-flow:row;align-items:center;}
  .images>div>img{width:1.2rem;height:1.2rem;border-radius: .1rem;margin-right: .15rem;}
  /* .content{width:100%;height:calc( 100vh - .88rem );overflow-y: scroll} */

  .important-input-div {
    width: 100%;
    background: #ffffff;
    padding-bottom: 0.5em;
    display: flex;
    flex-wrap: wrap;
    padding: .2rem 0.3rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .important-input-div input {
    width: 1.45rem;
    font-size: 0.26rem;
    color: #999999;
    line-height: 0.38rem;
    border: none;
    border: 1px solid #ddd;
    border-radius: 0.05rem;
    text-align: center;
    margin-right: 0.2rem;

  }

  .to-select {
    width: 100%;
    margin-top: 1em;
    border-bottom: 1px solid #e6e6e6;
  }

  .to-select > div > span {
    transform: rotate(90deg);
  }

  /*transform:rotate(45deg)*/

  .important-input-div input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    font-size: 0.24rem;
    color: #999999;
    opacity: 1;
  }

  .important-input-div input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    font-size: 0.24rem;
    color: #999999;
    opacity: 1;
  }

  .important-input-div input:-ms-input-placeholder {
    font-size: 0.24rem;
    color: #999999;
    opacity: 1;
  }

  .important-input-div input::-webkit-input-placeholder {
    font-size: 0.24rem;
    color: #999999;
    opacity: 1;
  }

  .er {
    margin-left: .4rem;
    border-bottom: 1px solid #ECECEC;
  }

  .textar {
    display: flex;
    padding: .1rem .3rem;
    flex-flow: column;
  }

  .textar > div {
    display: flex;
    flex-flow: row;
    align-items: center;
    margin: 0.2rem 0;
  }

  .textar > div > p {
    width: 1.6rem;
    display: flex;
    justify-content: center;
    height: 0.7rem;
    align-items: center;
    font-size: 0.3rem;
    color: #777;
  }

  .textar > div > span.bb {
    flex: 1;
    height: 0.7rem;
    border: 1px solid #d9d9d9;
    border-radius: 0.05rem;
  }

  .textar > div > span.aa {
    flex: 1;
    height: 0.7rem;
    line-height: .7rem;
  }

  .textar > div > span > input {
    width: 100%;
    height: 100%;
    border: none;
    margin-left: 0.1rem;
  }

  .textar > span {
    width: 100%;
    height: 100%;
    border: 1px solid #d9d9d9;
  }

  .textar > div > i.bb {
    flex: 1;
    border: 1px solid #d9d9d9;
    padding: 0 .1rem;
  }

  .textar > div > i.aa {
    flex: 1;
  }

  .alertText {
    z-index: 999;
    width: 100%;
    position: fixed;
    height: 100vh;
    background: rgba(0, 0, 0, .1);
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .alertText > ul {
    width: 6.5rem;
    background: white;
    padding: .2rem .3rem;
    border-radius: .2rem;
    display: flex;
    flex-flow: column;
    justify-content: center;
  }

  .alertText ul li.a {
    width: 100%;
    display: flex;
    flex-flow: row;
    align-items: center;
    padding: .1rem 0;
  }

  .alertText ul li.a > span {
    border-radius: .05rem;
    flex: 1;
    border: 1px solid #E6E7E7;
    height: .7rem;
    display: flex;
    align-items: center;
  }

  .alertText ul li.a > p {
    width: 1.8rem;
    text-align: right;
  }

  .alertText ul li.a > span > input {
    border: none;
    margin-left: .2rem;
    height: 100%;
    width: 100%;
  }

  .alertText ul li:last-child {
    margin-top: .2rem;
    display: flex;
    justify-content: space-around;
  }

  .alertText ul li:last-child > button {
    font-size: .3rem;
    color: white;
    padding: .15rem .3rem;
    border: none;
    border-radius: .1rem;
  }

  .alertText ul li.a > span > textarea {
    border: none;
    width: 100%;
    height: 100%;
  }
</style>
