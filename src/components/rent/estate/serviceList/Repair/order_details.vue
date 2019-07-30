<template>
  <yd-layout class="layout_my">
    <yd-navbar class="header" slot="navbar" v-show="!userAgent.isWX" v-title="'报修详情'" title="报修详情" color="#fff" :bgcolor="mainColor" height=".88rem">
      <router-link :to="'/estate/repair'" slot="left"><!--url[url.length-1]-->
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </router-link>
    </yd-navbar>
    <!--<div class="div-row text-center" style="font-size: 16px">-->
    <!--{{result.repairsBill.unitName}}-->
    <!--</div>-->
    <div class="div-row text-left" v-if="result.repairsBill"
         style="height:3em;border-bottom: 1px solid #e6e6e6;font-size: 16px">
      {{result.repairsBill.location }}
    </div>
    <div v-if="hide">
      <div class="div-row">
        <div>报修人</div>
        {{result.repairsBill.customerInfo.name}}
      </div>
      <div class="div-row">
        <div>单号</div>
        {{result.repairsBill.guid}}
      </div>
      <div class="div-row">
        <div>报修类型</div>
        {{result.repairsBill.typeName}}
      </div>
      <div class="div-row">
        <div>具体位置</div>
        {{result.repairsBill.location}}
      </div>
    </div>
    <div class="div-row" v-if="result.repairsBill">
      <div>报修时间</div>
      {{result.repairsBill.createDate}}
      <a class="pull-right hide-or-show fong26" v-if="hide" @click="hideDiv">隐藏</a>
      <a class="pull-right hide-or-show fong26" v-if="!hide" @click="hideDiv">展开</a>
    </div>
    <div class="title-img"></div>
    <div class="order-detail" v-if="result.repairsBill">
      <div class="div-remark">{{result.repairsBill.remark}}</div>
      <br>
      <div class="img-flex">
        <div style="width: 20%;" v-for="(item,index) in result.commAccessoryList" :key="index">
          <img v-if="result.commAccessoryList.length%5!=0" :src="item.path" alt="">
        </div>
      </div>
    </div>
    <div class="order-detail-ing">
      <div v-for="(item,index) in result.tasksRecordList" :key="index">
        <div class="left-list-item" v-if="result.tasksRecordList&&result.tasksRecordList.length"
             v-bind:style="index==0?'background: rgb(0,147,210)':'background:#fff;border:1px solid rgb(153,151,153)'">
          <div v-bind:style="index==0?'background:#fff':'background:rgb(153,151,153)'">
            <div
              v-bind:style="result.tasksRecordList.length==1||index==result.tasksRecordList.length-1?'height:4em':''"></div>
          </div>
        </div>
        <span class="triangle">
        </span>
        <div class="order-ing-content">
          <div class="div-first-child">{{item.title}}
            <span v-if="item.createTime" class="text-right">
            {{item.createTime.split(' ')[1]}}<br>{{item.createTime.split(' ')[0]}}
          </span>
          </div>
          <div>上报人：{{item.usetName}}</div>
          <div>备注：{{item.remark}}</div>
        </div>
      </div>
      <div class="text-center btn-sure-ok" v-if="result.repairsBill&&result.repairsBill.status==9" @click="toEvaluate">
        {{StatusDescript}}
      </div>
      <div class="text-center btn-sure-ok" v-if="result.repairsBill&&result.repairsBill.status!=9">{{StatusDescript}}
      </div>
      <!--<div class="text-center btn-sure-ok" @click="getOrder">接单</div>-->
      <div v-if="showEvaluate||showStyle" class="black-bg" @click="cancel"></div>
      <div v-if="showStyle" class="fixed-evaluate select-style">
        <div class="first-div">请选择处理模式</div>
        <div class="text-center">内部调度</div>
        <div class="text-center">外部派单</div>
      </div>
      <!--showEvaluate-->
      <div v-if="showEvaluate" class="fixed-evaluate">
        <br>
        <div>
          <div class="text-right width-100">速度
            <div class="img-div">
              <yd-cell-group>
                <yd-cell-item>
                  <yd-rate slot="left" v-model="rate1"></yd-rate>
                  <span slot="right"></span>
                </yd-cell-item>
              </yd-cell-group>
            </div>
          </div>
          <div class="text-right width-100">服务
            <div class="img-div">
              <yd-cell-group>
                <yd-cell-item>
                  <yd-rate slot="left" v-model="rate2"></yd-rate>
                  <span slot="right"></span>
                </yd-cell-item>
              </yd-cell-group>
            </div>
          </div>
          <div class="text-right width-100">性价比
            <div class="img-div">
              <yd-cell-group>
                <yd-cell-item>
                  <yd-rate slot="left" v-model="rate3"></yd-rate>
                  <span slot="right"></span>
                </yd-cell-item>
              </yd-cell-group>
            </div>
          </div>
          <textarea class="evaluate-area" name="" v-model="comment" placeholder="默认好评" id="" cols="30"
                    rows="10"></textarea>
        </div>
        <div class="evaluate-over-submit text-center" @click="sureToEvaluate">
          发布评价
        </div>
      </div>
    </div>
  </yd-layout>
</template>
<script>
import fn from "@/assets/js/product";
import qs from "qs";
import "vue-ydui/dist/ydui.base.css";
import Vue from "vue";
import { Rate } from "vue-ydui/dist/lib.rem/rate";
/* 使用px：import {Rate} from 'vue-ydui/dist/lib.px/rate'; */

Vue.component(Rate.name, Rate);

export default {
  data() {
    return {
      organInfo: "",
      hasMessage: {
        count: 99,
        new: true
      },
      value2: "",
      result: [],
      url: this.fromRoute ? this.fromRoute : "",
      userInfo: "",
      mainColor: "",
      guid: "",
      showEvaluate: false,
      comment: "",
      speedRating: 5,
      serviceRating: 5,
      costPerformanceRating: 5,
      showStyle: "",
      StatusDescript: "",
      hide: false,
      rate1: 5,
      rate2: 5,
      rate3: 5
    };
  },
  methods: {
    hideDiv() {
      this.hide = !this.hide;
    },
    itemClickHandler() {},
    clearLoacl() {
      this.alertS = true;
    },
    cancel() {
      this.showEvaluate = false;
      this.showStyle = false;
    },
    quit() {
      this.alertS = false;
    },
    toEvaluate() {
      this.showEvaluate = true;
    },
    getUserInfo(cb) {
      var data = { userId: this.userId, token: this.getkey };
      this.xhr
        .post(`${this.subUrl.user}/user/getUserInfo`, qs.stringify(data))
        .then(res => {
          if (res.data.code == 1) {
            this.userInfo = res.data.data.userInfo;
            this.organInfo = res.data.data.organInfo;
            cb && cb();
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        });
    },
    sureToEvaluate(cb) {
      if (!this.comment || this.comment == "") {
        this.comment = "维修速度快，服务态度好";
      }
      var data = {
        userId: this.userId,
        token: this.getkey,
        taskId: this.guid,
        speedRating: this.speedRating,
        serviceRating: this.serviceRating,
        costPerformanceRating: this.costPerformanceRating,
        comment: this.comment
      };
      this.xhr
        .post(
          `${this.subUrl.activity}/repairs/userEvaluation?` + qs.stringify(data)
        )
        .then(res => {
          if (res.data.code == 1) {
            this.showEvaluate = false;
            this.getOrderDetail();
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        });
    },
    getStatusToSHow(status) {
      switch (status) {
        case 0:
          this.StatusDescript = "完成";
        case 1:
          this.StatusDescript = "关闭";
        case 2:
          this.StatusDescript = "草稿";
        case 3:
          this.StatusDescript = "客服分配";
        case 4:
          this.StatusDescript = "经理分配";
        case 5:
          this.StatusDescript = "派单";
        case 6:
          this.StatusDescript = "抢单";
        case 7:
          this.StatusDescript = "分单";
        case 8:
          this.StatusDescript = "处理中";
        case 9:
          this.StatusDescript = "用户评价";
        case 10:
          this.StatusDescript = "客服评价关闭";
      }
    },
    getOrderDetail(cb) {
      var data = {
        userId: this.userId,
        token: this.getkey,
        repairsId: this.guid
      };
      this.xhr
        .post(`${this.subUrl.activity}/repairs/detail?` + qs.stringify(data))
        .then(res => {
          if (res.data.code == 1) {
            this.result = res.data.data;
            this.getStatusToSHow(this.result.repairsBill.status);
            this.userInfo = res.data.data.userInfo;
            this.organInfo = res.data.data.organInfo;
            cb && cb();
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        });
    }
  },
  mounted() {
    if (this.$route.query.guid) {
      this.guid = this.$route.query.guid;
    }
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.mainColor = this.$color[this.userInfo.organType];
    this.userId = this.userInfo.guid;
    this.getkey = fn.getIng();
    this.userId = this.userInfo.guid;
    var that = this;
    this.getUserInfo(function() {
      that.getOrderDetail();
    });
  }
};
</script>
<style scoped>
.div-row {
  width: 100%;
  color: #333333;
  background: #ffffff;
  padding-left: 1em;
  line-height: 2.5em;
  font-size: 15px;
}

.div-row div {
  display: inline-block;
  width: 20%;
  text-align: right;
  margin-right: 1.5em;
  color: #6b6b6b !important;
}

/*.layout_my{*/
/*background: #f7f7f9;*/
/*}*/
.layout_my .header:after {
  display: none;
}

.title-img {
  font-size: 12px;
  height: 1em;
  color: #5b6b6b;
  padding-left: 1.5em;
  line-height: 2.5em;
}

.img-flex {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}

.img-flex div {
  width: 20%;
  padding: 0.5em;
  border-radius: 2px;
}

.div-remark {
  line-height: 1.8em;
  min-height: 6em;
  padding: 0 0.5em;
  padding-top: 0.5em;
  border: 1px solid #eeeeee;
  margin: 0.3em 0.5em;
}

.img-flex div > img {
  width: 100%;
}

.order-detail {
  width: 100%;
  background: #ffffff;
  border-radius: 4px;
  padding-top: 0.3em;
}

.left-list-item {
  width: 1.5em;
  height: 1.5em;
  padding: 0.44em;
  border-radius: 0.75em;
  background: rgb(0, 147, 210);
  border: 1px solid rgb(0, 147, 210);
  margin-left: 8%;
  margin-bottom: 6.5em;
}

.left-list-item > div {
  width: 100%;
  height: 100%;
  border-radius: 0.35em;
  background: #fff;
  padding: 0.168em;
}

.left-list-item > div > div {
  width: 100%;
  height: 6em;
  background: rgb(153, 151, 153);
  margin-top: 1em;
}

.triangle {
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  /* border-top: 10px solid #5851c3; */
  border-right: 0px solid transparent;
  border-bottom: 15px solid #ffffff;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  float: left;
  margin-left: 18%;
  margin-top: -31%;
}

.order-detail-ing {
  padding-top: 12%;
  margin-top: 1em;
  width: 100%;
  background: rgb(248, 248, 249);
  padding-bottom: 0.01em;
  margin-bottom: 3em;
}

.order-ing-content {
  float: left;
  margin-left: 18%;
  left: 15px;
  margin-top: -37%;
  width: 65%;
  position: absolute;
  min-height: 7em;
  background: #ffffff;
}

.order-ing-content div {
  line-height: 2em;
  padding-left: 1em;
  color: #6b6b6b;
}

.order-ing-content div > span {
  line-height: 1em;
  font-size: 12px;
  padding-left: 1em;
  float: right;
  margin: 0.5em;
  color: #6b6b6b;
}

.order-ing-content .div-first-child {
  font-size: 16px;
  color: #5881ff;
  min-height: 32px;
}

.btn-sure-ok {
  position: fixed;
  bottom: 0;
  background: #ffffff;
  border-top: 1px solid #e6e6e6;
  line-height: 4em;
  color: #6b6b6b;
  width: 100%;
}

.hide-or-show {
  margin-right: 1em;
  color: #5881ff;
}

.width-100 {
  width: 100%;
  line-height: 2.5em;
}
.width-100 img-div {
  padding-left: 10%;
}
</style>
