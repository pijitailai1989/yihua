<template>
  <div style="height:100vh">
    <yd-layout class="layout_my" v-if="showUser && !showReplay">
      <yd-navbar class="header"  slot="navbar" v-show="!userAgent.isWX" v-title="'投诉建议详情'" title="投诉建议详情" color="#fff" :bgcolor="mainColor" height=".88rem">
        <a @click="back" slot="left" class="addClickArea"><!--url[url.length-1]-->
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </a>
      </yd-navbar>
      <!--<div class="div-row text-center" style="font-size: 16px">-->
      <!--{{result.repairsBill.unitName}}-->
      <!--</div>-->
      <div class="bgwhite h9 pdlr2 text-left flex center" v-if="result.complaint"
          style="border-bottom: 1px solid #e6e6e6;font-size: 16px">
        {{result.complaint.customerName }}
        <!-- 1上报中，2已接单，3处理中，4待确认，5待评价，6完成，7关闭 -->
        <span class="state state2" v-if="result.complaint.status == 1">上报中</span>
        <span class="state state2" v-if="result.complaint.status == 2">已接单</span>
        <span class="state state2" v-if="result.complaint.status == 3">处理中</span>
        <span class="state state2" v-if="result.complaint.status == 4">待确认</span>
        <span class="state state1" v-if="result.complaint.status == 5">完成</span>
        <span class="state stateClose" v-if="result.complaint.status == 6">关闭</span>
        <span class="state state0" v-if="result.complaint.status == 7">不同意</span>
      </div>
      <div v-if="hide&&result.complaint">
        <div class="div-row">
          <div>报告人</div>
          {{result.complaint.userName }}
        </div>
        <div class="div-row">
          <div>具体位置</div>
          {{result.complaint.location}}
        </div>
        <!-- {{result.complaint.type}} -->
        <div class="div-row">
          <div>类型</div>
          {{result.complaint.type == 1?"投诉":"建议"}}
        </div>
        <div class="div-row">
          <div>填写时间</div>
          {{result.complaint.createDate}}

        </div>
        <!-- <div class="div-row">
          <div>单号</div>
          {{result.complaint.guid}}
        </div> -->
      </div>
      <div class="div-row" v-if="result.complaint">
        <div>单号</div>
        {{result.complaint.guid}}
        <a class="pull-right hide-or-show" v-if="hide" @click="hideDiv" >隐藏</a>
        <a class="pull-right hide-or-show" v-if="!hide" @click="hideDiv">展开</a>
      </div>
      <div class="title-img"></div>
      <div class="order-detail">
        <div class="div-remark" v-if="result.complaint">{{result.complaint.detailContent}}</div>
        <br>
        <div class="img-flex">
          <div style="width: 20%;" v-for="item,index in result.commAccessoryList">
            <img v-if="result.commAccessoryList.length%5!=0" :src="item.path" alt="">
          </div>
        </div>
      </div>
      <yd-timeline style="margin-top:.2rem;">
        <yd-timeline-item v-for='(item,index) in result.tasksRecordList' v-if="result.tasksRecordList && result.tasksRecordList.length > 0" :key='index'>
          <!-- <img style="width:.4rem;height:.4rem" src="../../../../../../assets/images/rent/estate/chooseSelected.png"
           slot="icon" v-if='index==0'
            alt="">-->
            <yd-icon name='tongxinyuan' :color='mainColor' size='.4rem' custom slot="icon" v-if='index==0' ></yd-icon>
          <div class="font32" :style="`color:${mainColor}`">{{item.title}}</div>
          <div class="font28 flex-row  flex-start">
            <span v-if='1'>操作人:</span>
            <span>{{item.usetName}}</span>
          </div>
          <div class="font28 flex-row flex-start" v-if='item.remark'>
            <span>备注:</span>
            <span>{{item.remark}}</span>
          </div>
          <p>{{item.createTime}}</p>
        </yd-timeline-item>
      </yd-timeline>
      <div class="flex-row h8 center jusCenter" @click="agree4" v-if="result.tasks && result.complaint.status == 4" :style="{background:mainColor,color:'#fff',margin:'.3rem .5rem','border-radius':'.1rem'}">
        确定
      </div>
      <div class="mask" v-if="showEvaluate" @click="showEvaluate=false">
        <div class="bgwhite" @click.stop="''">
          <div style="padding: 0.5rem .8rem 0">
            <yd-cell-item>
              <span slot="left">服务</span>
              <yd-rate slot="right" v-model="rate0"></yd-rate>
            </yd-cell-item>
            <yd-cell-item>
              <span slot="left">速度</span>
              <yd-rate slot="right" v-model="rate1"></yd-rate>
            </yd-cell-item>
             <!-- <yd-cell-item class="border" style="padding-right:0">
            </yd-cell-item> -->
             <yd-textarea class="border" style="padding:0 .1rem;margin-top:.1rem;" placeholder="请输入评语" v-model="comment" maxlength="100"></yd-textarea>

          </div>
          <div v-if="result.tasks && result.complaint.status == 5" class="flex-row h8 jusCenter center" @click="pingjia" :style="{background:mainColor,color:'#fff',margin:'.4rem','border-radius':'.1rem'}">
            <span>确定</span>
          </div>
        </div>
      </div>
      <!-- 完成评价 -->
      <div class="flex-row h8 center jusCenter" @click="showEvaluate = true" v-if="result.tasks && result.complaint.status == 5" :style="{background:mainColor,color:'#fff',margin:'.3rem .5rem','border-radius':'.1rem'}">
        评价
      </div>
        <!-- 客服处理 -->
        <div class="flex-row h9 bgwhite bt font32" v-if='result.tasks && result.complaint.status==1' slot='bottom'>
        <!-- 111 -->
        <div class="flex1 jusCenter br" @click="disagree1">
          <yd-icon custom name='delete' color='#f00'></yd-icon>
          <!-- <img style="width:.4rem;height:.4rem;" class="mr1" src="../../../../../../assets/images/rent/estate/disagree.png" alt=""> -->
          <span style='color:#ff483f;'>关闭</span>
        </div>
        <div class="flex1 center jusCenter" @click='agree1'>
          <yd-icon custom name='selected' style="padding-top:.1rem;" class="mr1" size='.4rem' :color='mainColor'></yd-icon>
          <!-- <img style="width:.4rem;height:.4rem;" class="mr1" src="../../../../../../assets/images/rent/estate/select_active.png" alt=""> -->
          <span :style='{color:mainColor}'>安排处理</span>
        </div>
      </div>
      <!-- 审批人处理 -->
        <div class="flex-row h9 bgwhite bt font32" style='overflow:hidden;' v-if='result.tasks && result.complaint.status==2' slot='bottom'>
        <!-- 111 -->
        <div class="flex1 jusCenter br" @click="disagree2">
          <yd-icon custom name='delete' color='#f00'></yd-icon>
          <!-- <img style="width:.4rem;height:.4rem;" class="mr1" src="../../../../../../assets/images/rent/estate/disagree.png" alt=""> -->
          <span style='color:#ff483f;'>拒绝</span>
        </div>
        <div class="flex1 center jusCenter" @click='agree2'>
          <yd-icon custom name='selected' style="padding-top:.1rem;" class="mr1" size='.4rem' :color='mainColor'></yd-icon>
          <!-- <img style="width:.4rem;height:.4rem;" class="mr1" src="../../../../../../assets/images/rent/estate/select_active.png" alt=""> -->
          <span :style='{color:mainColor}'>分派</span>
        </div>
      </div>
      <!-- 处理人确定 -->
      <div class="flex-row h9 bgwhite bt font32" style='overflow:hidden;' v-if='result.tasks && result.complaint.status==3' slot='bottom'>
        <!-- 111 -->
        <div class="flex1 jusCenter br" @click="agree3">
          <!-- <yd-icon custom name='delete' color='#f00'></yd-icon> -->
          <!-- <img style="width:.4rem;height:.4rem;" class="mr1" src="../../../../../../assets/images/rent/estate/disagree.png" alt=""> -->
          <span :style='{color:mainColor}' class="flex1 bt jusCenter center">执行人确定</span>
        </div>
      </div>
    </yd-layout>
     <departMent v-if='!showUser' @setUserId='setUserId'></departMent>
      <replay v-if="showReplay" @operate="operate" ></replay>
  </div>
</template>
<script>
import fn from "@/assets/js/product";
import qs from "qs";
import Vue from "vue";
import { TimeLine, TimeLineItem } from "vue-ydui/dist/lib.rem/timeline";
import departMent from "../repair/department_manager";
import replay from "../rectification/replay";

import { CellGroup, CellItem } from "vue-ydui/dist/lib.rem/cell";
Vue.component(CellGroup.name, CellGroup);
Vue.component(CellItem.name, CellItem);

Vue.component(TimeLine.name, TimeLine);
Vue.component(TimeLineItem.name, TimeLineItem);
import { Rate } from "vue-ydui/dist/lib.rem/rate";
Vue.component(Rate.name, Rate);
var userInfo = {};
export default {
  components: {
    departMent,
    replay
  },
  data() {
    if (this.$route.query.guid) {
      this.guid = this.$route.query.guid;
    }
    userInfo = JSON.parse(decodeURIComponent(localStorage.getItem("userInfo")));
    this.mainColor = this.$color[userInfo.organType];
    this.userId = userInfo.guid;
    this.getkey = fn.getIng();
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    return {
      rate0: 5,
      rate1: 5,
      showUser: true,
      hasMessage: {
        count: 99,
        new: true
      },
      showReplay: false,
      userInfo,
      value2: "",
      result: [],
      url: this.fromRoute ? this.fromRoute : "",
      guid: "",
      showEvaluate: false,
      comment: "",
      speedRating: 5,
      serviceRating: 5,
      costPerformanceRating: 5,
      showStyle: "",
      StatusDescript: "",
      hide: true
    };
  },
  methods: {
    pingjia() {
      if (this.comment == "") {
        return this.$dialog.toast({ mes: "请输入评语", timeout: "400" });
      }
      let data = {
        token: this.$getkey(),
        userId: userInfo.guid,
        speedRate: this.rate0,
        serviceRate: this.rate1,
        comment: this.comment,
        complaintId: this.result.complaint.guid
      };
      this.$ajax(
        `${this.subUrl.activity}/complaint/userEvaluate`,
        data,
        res => {
          this.showEvaluate = false;
          this.$dialog.toast({ mes: "已评价", timeout: "400",icon:"success" });
          this.getOrderDetail();
        },
        this
      );
    },
    setUserId(e) {
      this.showUser = true;
      if (e) {
        console.log(e);
        this.approverName = e.userName;
        this.approverId = e.userId;
        let data = {
          token: this.$getkey(),
          userId: userInfo.guid,
          complaintId: this.result.complaint.guid,
          assignee: e.userId
        };
        if (this.currentType == 1) {
          this.$ajax(
            `${this.subUrl.activity}/complaint/serviceAllocation`,
            data,
            res => {
              this.getOrderDetail();
              this.$dialog.toast({ mes: "已提交给审批人", icon: "success" });
            },
            this
          );
        } else if (this.currentType == 2) {
          data.operate = 1;
          this.$ajax(
            `${this.subUrl.activity}/complaint/managerAssign`,
            data,
            res => {
              this.getOrderDetail();
              this.$dialog.toast({ mes: "已安排处理", icon: "success" });
            },
            this
          );
        } else if (this.currentType == 3) {
        }
      }
    },
    // 带回复的
    operate(e) {
      this.showReplay = false;
      if (e) {
        console.log(e);
        var data = {
          token: this.$getkey(),
          userId: userInfo.guid,
          complaintId: this.result.complaint.guid,
          remark: e
        };
        // 经理拒绝
        if (this.replayType == 1) {
          data.operate = 2;
          this.$ajax(
            `${this.subUrl.activity}/complaint/managerAssign`,
            data,
            res => {
              this.$dialog.toast({
                mes: "已拒绝",
                icon: "success",
                timeout: 1000
              });
              this.getOrderDetail();
            },
            this
          );
        } else if (this.replayType == 2) {
          this.$ajax(
            `${this.subUrl.activity}/complaint/executorHandle`,
            data,
            res => {
              this.$dialog.toast({
                mes: "已确定",
                icon: "success",
                timeout: 1000
              });
              this.getOrderDetail();
            },
            this
          );
        }
      }
    },
    // 客服关闭
    disagree1() {
      console.log(this);
      console.log(userInfo);
      this.$dialog.confirm({
        mes: "是否关闭投诉",
        opts: () => {
          var data = {
            token: this.$getkey(),
            userId: userInfo.guid,
            complaintId: this.result.complaint.guid
          };
          this.$ajax(
            `${this.subUrl.activity}/complaint/close`,
            data,
            res => {
              this.getOrderDetail();
              this.$dialog.toast({ mes: "已关闭投诉", icon: "success" });
            },
            this
          );
        }
      });
    },
    // 客服同意
    agree1() {
      this.currentType = 1;
      this.showUser = false;
    },
    agree2() {
      // 经理同意
      this.currentType = 2;
      this.showUser = false;
    },
    //执行人确定
    agree3() {
      this.showReplay = true;
      this.replayType = 2;
    },
    // 租户确定
    agree4() {
      this.$dialog.confirm({
        mes: "是否确定完成",
        opts: () => {
          var data = {
            token: this.$getkey(),
            userId: userInfo.guid,
            complaintId: this.result.complaint.guid
          };
          this.$ajax(
            `${this.subUrl.activity}/complaint/userConfirm`,
            data,
            res => {
              this.getOrderDetail();
              this.$dialog.toast({ mes: "已确定", icon: "success" });
            },
            this
          );
        }
      });
    },
    disagree2() {
      this.showReplay = true;
      this.replayType = 1;
    },
    back() {
      this.$router.go(-1);
    },
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
        complaintId: this.$route.query.id
      };
      this.xhr
        .post(
          `${this.subUrl.activity}/complaint/getComplaint?` + qs.stringify(data)
        )
        .then(res => {
          if (res.data.code == 1) {
            this.result = res.data.data;
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
    this.getOrderDetail();
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
  font-size: 0.3rem;
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
  border-left: 0.3rem solid transparent;
  /* border-top: 10px solid #5851c3; */
  border-right: 0px solid transparent;
  border-bottom: 0.3rem solid #ffffff;
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
  margin-left: 22%;
  margin-top: -37%;
  width: 65%;
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
  font-size: 12px;
  color: #5881ff;
}
</style>
