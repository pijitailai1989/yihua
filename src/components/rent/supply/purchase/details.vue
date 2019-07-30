<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" v-title="'title'" :title="title"
               :bgcolor="mainColor" color="#fff">
      <span class="addClickArea" slot="left" @click="back" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
      <span @click="turnTo('/supply/purchase/my_supplier?guid='+guid+'&type=yb')" class="addClickArea" slot="right"
            v-show="yaobiao" style="color: #fff;">邀标</span>
    </yd-navbar>

    <!-- <div class="info" v-if="!show">
         <ul>
           <li style="border-bottom:1px solid #ECECEC;"><span>状态</span><p>正常</p></li>
           <li><span>供应商</span><p>深圳市环宇服务有限公司</p></li>
           <li><span>供应商</span><p>深圳市环宇服务有限公司</p></li>
           <li><span></span><p><i style="background:#C8E7FF;color:#61BBFF;">高级</i>
           <i style="background:#FFE7C8;color:#FFB454;">2年</i></p></li>
           <li><span>联系人</span><p>马小云</p></li>
           <li><span>电话</span><p>1388888888888</p></li>
           <li><span>所在地</span><p>广东-深圳-南山区-街道</p></li>
         </ul>
    </div> -->

    <div class="contact">
      <ul>
        <li><span style="color:#999;">状态</span><span>{{details.state1}}</span><span></span></li>
        <li style="border:none;"><span style="color:#999;">联系人</span><span>{{organInfoDto.userName}}</span><span
          v-show="details.isLookPhone==0&&details.userId!=userId">
                 <a style="font-size:.24rem;" @click="openConfrim"><i><img
                   src="../../../../assets/images/rent/supply/chakan.png" alt=""></i>查看</a>
                </span></li>
        <li><span style="color:#999;">电话</span><span>{{organInfoDto.phone}}</span><span
          style="color:#999;font-size:.24rem;">已被查看{{details.lookNumber}}次</span></li>
        <li style="color:#999;font-size:.24rem;">联系时请说是在【八爪网】看到的</li>
      </ul>
    </div>

    <div class="declares" style="margin:.2rem 0" v-if="price!=undefined">
      <ol>
        <li v-if="show" style="color:#333;"><p>投标登记</p><span style="width:3rem;text-align:right">{{time}}</span></li>
        <li v-if="!show" style="color:#333;"><p>报价</p><span style="width:3rem;text-align:right">{{time}}</span></li>
      </ol>
      <div class="textar">
        <div><p>报价</p><span class="aa">{{price}}</span></div>
        <div>
          <p>附言</p>
          <i class="aa">
            {{postscript}}
          </i>
        </div>
      </div>
    </div>

    <div class="declares">
      <ul v-if="show">
        <li><p>项目名称</p><span>{{details.title}}</span></li>
        <li><p>招标金额</p><span>{{details.money==0?'面议':details.money}}</span></li>
        <li><p>发布日期</p><span>{{details.startTime}}</span></li>
        <li><p>截至日期</p><span>{{details.endTime}}</span></li>
        <li><p>买家地址</p><span>{{details.address}}</span></li>
        <li><p>交货日期</p><span>{{details.deliveryTime}}</span></li>
        <li><p>交货地址</p><span>{{details.deliveryAddress}}</span></li>
      </ul>
      <ul v-if="!show">
        <li><p>标题</p><span>{{details.title}}<i v-if="details.isUrgent==1">急</i></span></li>
        <li><p>采购数量</p><span>{{details.number==-1?'面议':details.number}}</span></li>
        <li><p>发布日期</p><span>{{details.startTime}}</span></li>
        <li><p>截至日期</p><span>{{details.endTime}}</span></li>
        <li><p>买家地址</p><span>{{details.deliveryAddress}}</span></li>
      </ul>
    </div>

    <div class="declares" style="margin:.2rem 0">
      <ol>
        <li style="color:#666;"><p>产品/服务</p><span>数量</span><span>金额(元)</span></li>
        <li v-for="(item,index) in list" :key="index"><p style="border-bottom:1px solid #ECECEC;">
          {{item.productService}}</p>
          <span style="border-bottom:1px solid #ECECEC;">{{item.number}}</span>
          <span style="color:#333;font-size:.3rem;border-bottom:1px solid #ECECEC;">{{item.money}}</span></li>
      </ol>
      <div class="textar" v-show="details.explains!=''">
          <span style="padding:.2rem 0">
            {{details.explains}}
          </span>
      </div>
      <div class="important-input-div" v-show="keyword.length>0">
        <input v-show="keyword[0]!=null" type="text" v-model="keyword[0]" disabled="disabled" placeholder="">
        <input v-show="keyword[1]!=null" placeholder="" v-model="keyword[1]" type="text" disabled="disabled">
        <input v-show="keyword[2]!=null" placeholder="" v-model="keyword[2]" type="text" disabled="disabled">
      </div>
      <div class="images">
            <yd-lightbox :num="imgList.length">
                <yd-lightbox-img :onerror="imgs" v-for="(item,index) in imgList" :key="index" :src="item.path"></yd-lightbox-img>
            </yd-lightbox>
        </div>
    </div>

    <yd-accordion accordion style="background:none;">
      <yd-accordion-item v-if="show" title="投标要求" style="margin-bottom:.2rem;background:#fff;" open>
        <div style="padding: .24rem;">
          <span class="scope" style="color:#999;">{{details.isOffer}}</span>
        </div>
      </yd-accordion-item>
      <!-- 发布范围 -->
      <yd-accordion-item title="范围" style="margin-bottom:.2rem;background:#fff;" open>
        <div style="padding: .24rem;display:flex;justify-content: space-between;color:#999;">
          <span class="scope">{{details.scopeValueStr}}</span>
          <!-- <span>高新园</span> -->
        </div>
      </yd-accordion-item>

      <yd-accordion-item title="供应商要求" style="margin-bottom:.2rem;background:#fff;" open>
        <div style="padding: .24rem;">
          <span class="scope" style="color:#999;">{{details.levelCondition}}</span>
        </div>
      </yd-accordion-item>
    </yd-accordion>

    <div class="declares" v-if="show" style="margin:.2rem 0">
      <ol>
        <li style="color:#333;">商家资质要求</li>
      </ol>
      <div class="textar">
        <div>
          <i class="bb" style="padding:.2rem 0;">
            {{details.seniority==null?'暂无':details.seniority}}
          </i>
        </div>
      </div>
    </div>

    <div class="declares" style="margin:.2rem 0" v-show="details.isRegister==0&&details.userId!=userId">
      <ol>
        <li v-if="show" style="color:#333;">投标登记(由采购方联系您)</li>
        <li v-if="!show" style="color:#333;">报价</li>
      </ol>
      <div class="textar">
        <div><p>我的报价</p><span class="bb"><input v-model="myOffer" type="text"></span></div>
        <div>
          <p>我的附言</p>
          <i class="bb">
            <yd-textarea slot="right" v-model="myExplain" placeholder="说明/附言" maxlength="100"></yd-textarea>
          </i>
        </div>
      </div>
    </div>

    <div class="to-select" v-show="details.isRegister==0&&details.userId!=userId">
      <div class="buttonBox">
        <yd-button size="large" class="send" @click.native="addRegister" :bgcolor="mainColor" color='#fff'
                   type="primary">确定
        </yd-button>
      </div>
    </div>

    <div class="alertText" v-show="alertT">
      <ul>
        <li class="a"><p class="font28">产品/服务：</p><span><input @blur="nameBlur()" v-model="info.name" type="text"
                                                               placeholder="请填写"></span></li>
        <li class="a"><p class="font28">数量：</p><span><input @blur="phoneBlur()" v-model="info.mobile" type="text"
                                                            placeholder="请填写"></span></li>
        <li class="a"><p class="font28">价格：</p><span><input @blur="idBlur()" v-model="info.decorationId" type="text"
                                                            placeholder="请填写"></span></li>
        <li>
          <button @click="cancel" :style="{background:mainColor}">取 消</button>
          <button @click="confirm" :style="{background:mainColor}">确 定</button>
        </li>
      </ul>
    </div>
  </yd-layout>
</template>
<script>
  import fn from "@/assets/js/product";
  import qs from "qs";
  import InfiniteScroll from "vue-infinite-scroll";
  import Vue from "vue";
  import {CellGroup, CellItem} from "vue-ydui/dist/lib.rem/cell";
  import {CheckBox, CheckBoxGroup} from 'vue-ydui/dist/lib.rem/checkbox';
  import {TextArea} from 'vue-ydui/dist/lib.rem/textarea';
  import {Confirm, Alert, Toast, Notify, Loading} from 'vue-ydui/dist/lib.rem/dialog';
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
  Vue.component(TextArea.name, TextArea);
  Vue.component(CheckBox.name, CheckBox);
  Vue.component(CheckBoxGroup.name, CheckBoxGroup);
  Vue.component(CellGroup.name, CellGroup);
  Vue.component(CellItem.name, CellItem);
  import {Radio, RadioGroup} from "vue-ydui/dist/lib.rem/radio";

  Vue.component(Radio.name, Radio);
  Vue.component(RadioGroup.name, RadioGroup);
  export default {
    data() {
      let userInfo, mainColor, organInfo, TypeListCircle, endTime, userType;
      if (this.$route.query.token) {
        this.getUserInfo({userId: this.$route.query.userId, token: this.$route.query.token},res => {
          this.getkey = this.$getkey();
          this.lookPhonePara();
          this.mainColor = this.$color[this.userInfo.organType];
          if (this.$route.params.type == 2) {
            this.title = '采购单详情'
            this.guid = this.$route.params.guid;
            this.purchasingInfo();
          } else if (this.$route.params.type == 1) {
            this.title = '招标书详情'
            this.guid = this.$route.params.guid;
            this.tenderInfo();
            this.show = true;
          }
        })
      } else {
        userInfo = JSON.parse(
          decodeURIComponent(localStorage.getItem("userInfo"))
        );
        mainColor = this.$color[userInfo.organType];
        endTime = this.$today();
        organInfo = JSON.parse(
          decodeURIComponent(localStorage.getItem("organInfo"))
        );
        // 圈子类型 1企业 2 个人 3 物业
        //用户类型 1:租户；2:商家；3:管理处；4:物业公司；5:其他（个人）；6：业主 0为空
        // 根据用户类型判断
        userType = userInfo.organType

        if (userType == 1) {
          TypeListCircle = 1;
        } else if (userType == 5) {
          TypeListCircle = 2;
        } else {
          TypeListCircle = 3
        }
      }
      return {
        imgs: 'this.src="' + require('../../../../assets/images/rent/supply/chan.png') + '"',
        picked: false,
        peopleNum: "",
        organInfo,
        mainColor,
        userInfo,
        imgLength: 0,
        imgIndex: 0,
        TypeListCircle,
        bbsList: [],
        pianList: [],
        uploadFileList: [],
        uploadPreviewList: [],
        selectList: [],
        keyword: [],
        checkbox: false,
        agree: false,
        userId: '',
        showTab: 0,
        text: "",
        getData: "",
        getLogoMsg: "",
        imageUrlList: [],
        imageKeyList: [],
        imageUrl: "",
        imgList:[],
        TypeList: "",
        TypeList1: -1,
        TypeList2: "",
        TypeList3: [],
        endTime,
        alertT: false,
        info: {
          name: '', mobile: null, decorationId: null, type: ''
        },
        getkey: '',
        guid: null,
        details: {},
        organInfoDto: {},
        list: [],
        title: "",
        show: false,
        myOffer: null,
        myExplain: null,
        poId: '',
        time: '',
        price: '',
        postscript: '',
        yaobiao: false,
        para: {
          value: ''
        },
        type:null
      };
    },
    methods: {
      openConfrim() {
        this.$dialog.confirm({
          mes: '此次需支付' + this.para.value + '商机点！',
          opts: () => {
            this.lookPhone();
          }
        });
      },
      add() {
        this.alertT = true;
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
      confirm() {

      },
      // nameBlur(){
      //   if(!this.regName.test(this.info.name)){
      //     this.$dialog.toast({mes: '请输入规范名字'});
      //     this.info.name=""
      //   }else if(this.info.name==null){
      //     this.$dialog.toast({mes: '名字不能为空'});
      //   }
      // },
      // idBlur(){
      //    if(!this.regId.test(this.info.decorationId)){
      //     this.$dialog.toast({mes: '身份号码格式错误'});
      //     this.info.decorationId=""
      //   }else if(this.info.decorationId==null){
      //     this.$dialog.toast({mes: '身份号码不能为空'});
      //   }
      // },
      // phoneBlur(){
      //    if(!this.regPhone.test(this.info.mobile)){
      //     this.$dialog.toast({mes: '手机号格式错误'});
      //     this.info.mobile=""
      //   }else if(this.info.mobile==null){
      //     this.$dialog.toast({mes: '手机号码不能为空'});
      //   }
      // },
      // 查看
      lookPhone() {
        let data = {};
        data.guid = this.guid;
        data.token = this.getkey;
        data.lookType = this.$route.params.type;
        data.payType = 2;
        this.$ajax(
          `${this.subUrl.bd}/purchase/lookPhone`,
          data,
          res => {
            this.organInfoDto.phone = res.data.account;
            this.details.isLookPhone = 1
            this.details.lookNumber++
            this.$dialog.toast({mes: '支付成功！'});
          },
          this
        );
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
      // 招标
      tenderInfo(data) {
        data = data ? data : {};
        data.guid = this.guid;
        data.token = this.getkey;
        data.type= this.type
        this.$ajax(
          `${this.subUrl.bd}/purchase/tenderInfo`,
          data,
          res => {
            if (res.data.tenderOrderInfo.state == 0) {
              res.data.tenderOrderInfo.state1 = '已删除'
            } else if (res.data.tenderOrderInfo.state == 1) {
              res.data.tenderOrderInfo.state1 = '已上线'
            } else if (res.data.tenderOrderInfo.state == 2) {
              res.data.tenderOrderInfo.state1 = '已下线'
            } else if (res.data.tenderOrderInfo.state == 3) {
              res.data.tenderOrderInfo.state1 = '审核中'
            } else if (res.data.tenderOrderInfo.state == 4) {
              res.data.tenderOrderInfo.state1 = '未通过'
            }
            if (res.data.tenderOrderInfo.keyword != '') {
              this.keyword = res.data.tenderOrderInfo.keyword.split(',')
            }
            this.details = res.data.tenderOrderInfo;
            if (this.details.levelCondition == 0) {
              this.details.levelCondition = '不限'
            } else if (this.details.levelCondition == 1) {
              this.details.levelCondition = '基础商家'
            } else if (this.details.levelCondition == 2) {
              this.details.levelCondition = '中级商家'
            } else if (this.details.levelCondition == 3) {
              this.details.levelCondition = '高级商家'
            } else if (this.details.levelCondition == 4) {
              this.details.levelCondition = '金牌商家'
            }
            if (this.details.isOffer == 0) {
              this.details.isOffer = '不限'
            } else if (this.details.isOffer == 1) {
              this.details.isOffer = '报价须含税'
            } else if (this.details.isOffer == 2) {
              this.details.isOffer = '物流费由商家承担'
            }
            this.details.startTime = this.details.startTime.split(' ')[0]
            this.details.endTime = this.details.endTime.split(' ')[0]
            this.details.deliveryTime = this.details.deliveryTime.split(' ')[0]
            if (this.details.userId == this.userId) {
              this.yaobiao = true;
            }
            this.organInfoDto = res.data.tenderOrderInfo.organInfoDto3
            this.list = res.data.tenderOrderInfo.purchaseDetailsList;
            this.imgList = res.data.tenderOrderInfo.accessoryList;
            imgList
          },
          this
        );
      },
      //采购
      purchasingInfo(data) {
        data = data ? data : {};
        data.guid = this.guid;
        data.token = this.$getkey();
        this.$ajax(
          `${this.subUrl.bd}/purchase/purchasingInfo`,
          data,
          res => {
            if (res.data.purchasingInfo.state == 0) {
              res.data.purchasingInfo.state1 = '已删除'
            } else if (res.data.purchasingInfo.state == 1) {
              res.data.purchasingInfo.state1 = '已上线'
            } else if (res.data.purchasingInfo.state == 2) {
              res.data.purchasingInfo.state1 = '已下线'
            } else if (res.data.purchasingInfo.state == 3) {
              res.data.purchasingInfo.state1 = '审核中'
            } else if (res.data.purchasingInfo.state == 4) {
              res.data.purchasingInfo.state1 = '未通过'
            }
            if (res.data.purchasingInfo.keyword != '') {
              this.keyword = res.data.purchasingInfo.keyword.split(',')
            }
            this.details = res.data.purchasingInfo;
            console.log(this.details.userId, 111111111111)
            if (this.details.levelCondition == 0) {
              this.details.levelCondition = '不限'
            } else if (this.details.levelCondition == 1) {
              this.details.levelCondition = '基础'
            } else if (this.details.levelCondition == 2) {
              this.details.levelCondition = '中级'
            } else if (this.details.levelCondition == 3) {
              this.details.levelCondition = '高级'
            } else if (this.details.levelCondition == 4) {
              this.details.levelCondition = '金牌'
            }
            this.details.startTime = this.details.startTime.split(' ')[0]
            this.details.endTime = this.details.endTime.split(' ')[0]

            this.organInfoDto = res.data.purchasingInfo.organInfoDto3
            this.list = res.data.purchasingInfo.purchaseDetailsList;
          },
          this
        );
      },
      //报投
      addRegister() {
        if(this.myOffer==null){
          return
          this.$dialog.toast({mes: '请填写报价！'});
        }
        if(this.myExplain==null){
          return
          this.$dialog.toast({mes: '请填写附言！'});
        }
        let data = {}
        data.type = this.$route.params.type;
        data.token = this.getkey;
        data.myOffer = this.myOffer;
        data.myExplain = this.myExplain;
        data.poId = this.$route.params.guid;
        this.$ajax(
          `${this.subUrl.bd}/purchase/addRegister`,
          data,
          res => {
            this.$dialog.toast({mes: '报价成功！'});
            this.details.isRegister=1
          },
          this
        );
      },
      turnTo(url) {
        this.$router.push(url)
      },
      selectTab(index) {
        this.showTab = index;
      },
      cancel() {
        this.alertT = false;
      },
      back() {
        console.log(111)
        if(this.$route.query.token){
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
    mounted() {
      if (this.$route.query.token) {

      } else {
        this.userId = this.userInfo.guid;
        this.getkey = fn.getIng();
        this.type=this.$route.query.type1
        this.lookPhonePara()
        if (this.$route.params.type == 2) {
          this.title = '采购单详情'
          this.guid = this.$route.params.guid;
          this.purchasingInfo();
        } else if (this.$route.params.type == 1) {
          this.title = '招标书详情'
          this.guid = this.$route.params.guid;
          this.tenderInfo();
          this.show = true;
        }
        if (this.$route.query) {
          this.price = this.$route.query.b;
          this.postscript = this.$route.query.a;
          this.time = this.$route.query.c;
        }
      }
    }
  };
</script>
<style scoped>
  .contact {
    width: 100%;
    margin-bottom: .2rem;
    background: white;
  }

  .contact > ul {
    width: 100%;
  }

  .contact > ul > li {
    display: flex;
    height: .7rem;
    align-items: center;
    padding: 0 .3rem;
    border-bottom: 1px solid #ECECEC;
  }

  .contact > ul > li > span:nth-child(1) {
    width: 1.4rem;
    text-align: right
  }

  .contact > ul > li > span:nth-child(2) {
    flex: 1;
    margin-left: .2rem;
  }

  .contact > ul > li > span:nth-child(3) {
    width: 1.8rem;
  }

  .contact > ul > li > span:nth-child(3) > a {
    background: #F2725E;
    display: flex;
    height: .6rem;
    justify-content: center;
    align-items: center;
    color: white;
    border-radius: .1rem;
  }

  .contact > ul > li > span:nth-child(3) > a > i {
    width: .3rem;
    height: .3rem;
    margin-right: .1rem;
  }

  .contact > ul > li > span:nth-child(3) > a > i > img {
    width: 100%;
    height: 100%;
  }

  .send {
    margin: 0;
  }

  .choose_item {
    height: 0.6rem;
    white-space: nowrap;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ECECEC;
  }

  .choose_item span {
    margin-right: 0.2rem;
  }

  .buttonBox {
    padding: 0 0.2rem 0.3rem;
  }

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

  .images{width:100%;padding:0 .4rem .2rem;}
  .images>div{width:100%;display: flex;flex-flow:row;align-items:center;}
  .images>div>img{width:1.2rem;height:1.2rem;border-radius: .1rem;margin-right: .15rem;}

  .declares ol li > a {
    width: 2rem;
    display: flex;
    flex-flow: row;
    align-items: center;
    color: #0093d2;
  }

  .declares ol li > a > i {
    border-radius: 50%;
    width: 0.4rem;
    height: 0.4rem;
    background: #0093d2;
    font-size: 0.4rem;
    display: flex;
    margin-right: 0.2rem;
    color: white;
    justify-content: center;
    align-items: center;
  }

  .alertText {
    width: 100%;
    position: fixed;
    height: 100vh;
    background: rgba(0, 0, 0, .2);
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .alertText > ul {
    width: 6.5rem;
    height: 5rem;
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

  .alertText ul li:nth-child(4) {
    margin-top: .2rem;
    display: flex;
    justify-content: space-around;
  }

  .alertText ul li:nth-child(4) > button {
    font-size: .32rem;
    font-weight: 600;
    color: white;
    padding: .2rem .5rem;
    border: none;
    border-radius: .1rem;
  }

  .info {
    width: 100%;
    background: white;
    border-bottom: 1px solid #F3F6F5;
    font-size: .28rem;
    padding: .1rem 0;
    margin-bottom: .2rem;
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
    background: red;
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
</style>
