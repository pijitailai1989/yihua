<template>
  <div style='height:100vh'>
    <yd-layout class="layout_my" v-if='showUser && showBuilding'>
      <yd-navbar class="header" slot="navbar" v-show="!userAgent.isWX" v-title="'报修详情'" title="报修详情" color="#fff" :bgcolor="mainColor"
        height=".88rem">
        <yd-navbar-back-icon slot="left" class="addClickArea" @click.native='$router.go(-1)' color="#fff"></yd-navbar-back-icon>
      </yd-navbar>
      <div class="flex-row pd3 bgwhite h8 font32 bb" v-if="result.repairsBill">
        <span>{{result.repairsBill.customerInfo.ridName}}{{result.repairsBill.customerInfo.unitName}}{{result.repairsBill.customerInfo.organName}}</span>
        <span class="pull-right state state1" v-if="result.repairsBill.status==0">完成</span>
        <span class="pull-right state stateClose" v-if="result.repairsBill.status==1">关闭</span>
        <span class="pull-right state state2" v-if="result.repairsBill.status==2">草稿</span>
        <span class="pull-right state state2" v-if="result.repairsBill.status==3">客服分配</span>
        <span class="pull-right state state2" v-if="result.repairsBill.status==4">经理分配</span>
        <span class="pull-right state state2" v-if="result.repairsBill.status==5">派单</span>
        <span class="pull-right state state2" v-if="result.repairsBill.status==6">抢单</span>
        <span class="pull-right state state2" v-if="result.repairsBill.status==7">分单</span>
        <span class="pull-right state state2" v-if="result.repairsBill.status==8">处理中</span>
        <span class="pull-right state state2" v-if="result.repairsBill.status==9">用户评价</span>
        <span class="pull-right state stateClose" v-if="result.repairsBill.status==10">客服评价关闭</span>
      </div>
      <div v-if="hide">
        <div class="div-row">
          <div>报修人</div>
          {{result.repairsBill.customerInfo.name }}
        </div>
        <div class="div-row">
          <div>单号</div>
          {{result.repairsBill.guid}}
        </div>
        <div class="div-row">
          <div>报修类型</div>
          {{result.repairsBill.typeName }}
        </div>
        <div class="div-row">
          <div>具体位置</div>
          {{result.repairsBill.location}}
        </div>
        <div class="div-row" v-if="result.repairsBill.costPerformanceRating">
          <div>速度评价</div>
          {{result.repairsBill.speedRating}}星
        </div>
        <div class="div-row" v-if="result.repairsBill.costPerformanceRating">
          <div>服务评价</div>
          {{result.repairsBill.serviceRating}}星
        </div>
        <div class="div-row" v-if="result.repairsBill.costPerformanceRating">
          <div>性价比评价</div>
          {{result.repairsBill.costPerformanceRating}}星
        </div>
      </div>
      <div class="div-row" v-if="result.repairsBill">
        <div>报修时间</div>
        {{result.repairsBill.createDate}}
        <a class="pull-right hide-or-show" :style="`color:${mainColor};border:1px soiid ${mainColor}`" v-if="hide" @click="hideDiv">隐藏</a>
        <a class="pull-right hide-or-show" :style="`color:${mainColor};border:1px soiid ${mainColor}`" v-if="!hide" @click="hideDiv">展开</a>
      </div>
      <div class="title-img"></div>
      <div class="order-detail" v-if="result.repairsBill">
        <div class="div-remark">{{result.repairsBill.remark}}</div>
        <br>
        <div class="img-flex">
          <div style="margin:0  0  .1rem .1rem;" v-for="item,index in result.commAccessoryList">
            <img v-if="result.commAccessoryList.length%5!=0" :src="item.path" alt="">
          </div>
        </div>
      </div>
      <yd-timeline>
        <yd-timeline-item v-for='(item,index) in result.tasksRecordList' :key='index'>
          <!-- <img style="width:.4rem;height:.4rem" src="../../../../../../assets/images/rent/estate/chooseSelected.png" slot="icon" v-if='index==0'
            alt=""> -->
            <yd-icon name='tongxinyuan' custom size='.5rem' slot="icon" :color='mainColor'></yd-icon>
          <div class="font32" :style="`color:${mainColor}`">{{item.title}}</div>
          <div class="font28 flex-row  flex-start">
            <span v-if='result.repairsBill.status'>操作人:</span>
            <span>{{item.usetName}}</span>
          </div>
          <div class="font28 flex-row flex-start" v-if='item.remark'>
            <span>备注:</span>
            <span>{{item.remark}}</span>
          </div>
          <p>{{item.createTime}}</p>
        </yd-timeline-item>
      </yd-timeline>
      <div class="order-detail-ing" v-if='showStyle'>
        <div v-if="showEvaluate||showStyle" class="black-bg" @click="cancel"></div>
        <div v-if="showStyle" class="fixed-evaluate select-style">
          <div class="flex-row h9 pdl3" style='border-bottom:1px dashed #ddd'>请选择处理模式</div>
          <div class="flex-row h9 jusCenter foCo3" style='border-bottom:1px dashed #ddd' @click='chooseUser(1)'>
            <img v-if='serviceMode ==1' class="chooseIcon" src="../../../../../../assets/images/rent/estate/select_active.png" alt="">
            <img class="chooseIcon" v-else src="../../../../../../assets/images/rent/estate/selected.png" alt="">
            <span>内部调度</span>
          </div>
          <div class="flex-row h9 jusCenter" @click='chooseUser(2)'>
            <img v-if='serviceMode ==2' class="chooseIcon" src="../../../../../../assets/images/rent/estate/select_active.png" alt="">
            <img class="chooseIcon" v-else src="../../../../../../assets/images/rent/estate/selected.png" alt="">
            <span>外部派单</span>
          </div>
        </div>
      </div>
      <!-- 评价框 -->
       <div class="mask" v-if="showEvaluate" @click="showEvaluate=false" style="position:fixed;">
          <div class="bgwhite" @click.stop='""'>
            <yd-cell-group>
              <yd-cell-item>
                <yd-rate slot="left" v-model="rate1"></yd-rate>
                <span slot="right">速度</span>
              </yd-cell-item>
              <!--  -->
              <yd-cell-item>
                <yd-rate slot="left" v-model="rate2"></yd-rate>
                <span slot="right">服务</span>
              </yd-cell-item>
              <!--  -->
              <yd-cell-item>
                <yd-rate slot="left" v-model="rate3"></yd-rate>
                <span slot="right">性价比</span>
              </yd-cell-item>
            </yd-cell-group>
            <textarea name="" style="border:1px solid #ddd;padding:.1rem;width:100%;" v-model="comment" placeholder="请输入评语"></textarea>
             <yd-button type="hollow" @click.native='sureToEvaluate'>发布评价</yd-button>
          </div>
        </div>

      <!-- 接单备注 -->
      <div class="mask" v-if="showMask" style="z-index:1000">
       <div class="bgwhite">
         <div class="flex-row jusCenter">处理方式</div>
         <div class="flex-row"><input class="flex1 h7 pdlr1" v-model="remark" style="width:auto" type="text" placeholder="备注"></div>
         <div class="flex-row jusCenter" style="margin:.4rem 0 .2rem">
           <div class="flex1 h7 jusCenter foCoF" style="background:#f00" @click="confirm(0)">拒绝处理</div>
           <div class="flex1 h7 jusCenter foCoF" :style="{background:mainColor}" @click="confirm(1)">确认处理</div>
         </div>
       </div>
      </div>
      <!-- 关闭评价 -->
      <div class="mask" v-show="showcloseCommet" @click="showcloseCommet = false">
        <div class="bgwhite" @click.stop="''">
          <yd-textarea placeholder="请输入评语" v-model="comment" style="height:1.6rem;padding:.1rem;border:1px solid #ddd;margin-bottom:.3rem;"></yd-textarea>
        <yd-button type='hollow'  @click.native="closeCommet">确定</yd-button>
        </div>
      </div>
      <!-- 状态 0：完成，1:关闭 2:草稿，3:客服分配，4:经理分配，5:派单，6:抢单，7:分单，8:处理，9:用户评价，10:客服评价关闭 -->
      <!--  && result.tasks -->
       <div class="evaluate-over-submit text-center" @click="showcloseCommet=true" v-if="result.repairsBill.status==10 && result.tasks"  slot='bottom'>
        关闭评价
      </div>
      <!-- && result.tasks -->
      <!-- 点击显示评价框 -->
       <div class="evaluate-over-submit text-center" :style="{color:mainColor}" v-if="result.repairsBill.status==9 && result.tasks"
        slot='bottom' @click="showEvaluate=true">
        发布评价
      </div>
      <!-- 处理  -->
      <div class="evaluate-over-submit text-center" :style="{color:mainColor}" v-if="result.repairsBill.status==8 && result.tasks"
        slot='bottom' @click="showMask=true">
        确定处理
      </div>
      <!-- 经理指派 -->
      <div class="flex-row h9 bgwhite bt font32" v-if='(result.repairsBill.status==4) && result.tasks' slot='bottom'>
        <div class="flex1 jusCenter br">
          <img style="width:.4rem;height:.4rem;" class="mr1" src="../../../../../../assets/images/rent/estate/disagree.png" alt="">
          <span style='color:#ff483f;'>拒绝</span>
        </div>
        <div class="flex1 jusCenter" @click='showUser=false'>
          <img style="width:.4rem;height:.4rem;" class="mr1" src="../../../../../../assets/images/rent/estate/select_active.png" alt="">
          <span :style='{color:mainColor}'>分派</span>
        </div>
      </div>
      <!-- 客服分配 -->
      <div class="flex-row h9 bgwhite bt font32" v-if='(result.repairsBill.status==3) && result.tasks' slot='bottom'>
        <!-- <div class="flex1 jusCenter br">
          <img style="width:.4rem;height:.4rem;" class="mr1" src="../../../../../../assets/images/rent/estate/disagree.png" alt="">
          <span style='color:#ff483f;'>任务关闭</span>
        </div> -->
        <div class="flex1 jusCenter" @click='showStyle=true'>
          <img style="width:.4rem;height:.4rem;" class="mr1" src="../../../../../../assets/images/rent/estate/select_active.png" alt="">
          <span :style='{color:mainColor}'>接单</span>
        </div>
      </div>
      <!-- 接单 -->
    </yd-layout>
    <departMent v-if='!showUser' @setUserId='setUserId'></departMent>
    <building  v-if='!showBuilding' @getBuilding='getBuilding'></building>
  </div>
</template>
<script>
import fn from "@/assets/js/product";
import qs from "qs";
import "vue-ydui/dist/ydui.base.css";
import departMent from "./department_manager";
import building from "./organBuilding";
import Vue from "vue";
import { Rate } from "vue-ydui/dist/lib.rem/rate";
import { TimeLine, TimeLineItem } from "vue-ydui/dist/lib.rem/timeline";

Vue.component(TimeLine.name, TimeLine);
Vue.component(TimeLineItem.name, TimeLineItem);
Vue.component(Rate.name, Rate);
import { CellGroup, CellItem } from "vue-ydui/dist/lib.rem/cell";
Vue.component(CellGroup.name, CellGroup);
Vue.component(CellItem.name, CellItem);

export default {
  components: {
    departMent,
    building
  },
  data() {
    return {
      showcloseCommet: false,
      showMask: false,
      showUser: true,
      showBuilding: true,
      organInfo: "",
      hasMessage: {
        count: 99,
        new: true
      },
      value2: "",
      result: { repairsBill: { customerInfo: {} } },
      url: this.fromRoute ? this.fromRoute : "",
      userInfo: "",
      mainColor: "",
      guid: "",
      showEvaluate: false,
      comment: "",
      serviceMode: -1,
      speedRating: 5,
      serviceRating: 5,
      costPerformanceRating: 5,
      showStyle: "",
      StatusDescript: "",
      hide: false,
      rate1: 5,
      rate2: 5,
      rate3: 5,
      remark: ""
    };
  },

  methods: {
    confirmDo() {},
    closeCommet() {
      if (this.comment == "") {
        return this.$dialog.toast({ mes: "请输入评语" });
      }
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        taskId: this.result.repairsBill.guid,
        comment: this.comment
      };
      this.$ajax(
        `${this.subUrl.activity}/repairs/csEvaluation`,
        data,
        res => {
          this.showcloseCommet = false;
          this.comment = "";
          this.$dialog.toast({ mes: "已关闭评价！", icon: "success" });
          this.getOrderDetail();
        },
        this
      );
    },
    setUserId(e) {
      console.log(e);
      this.showUser = true;
      if (e) {
        var data = {
          token: this.$getkey(),
          serviceMode: this.serviceMode,
          taskId: this.result.repairsBill.guid,
          userId: this.userInfo.guid,
          managerId: e.userId
        };
        this.showStyle = false;
        console.log(data);
        this.$dialog.loading.open("加载中");
        if (this.result.repairsBill.status == 3) {
          this.$ajax(
            `${this.subUrl.activity}/repairs/csAllocation`,
            data,
            res => {
              this.$dialog.loading.close();
              this.$dialog.toast({
                mes: "成功!",
                icon: "success",
                timeout: 1500
              });
              this.getOrderDetail();
            },
            this
          );
        } else {
          data.result = 1;
          data.handleId = data.managerId;
          this.$ajax(
            `${this.subUrl.activity}/repairs/managerAllocation`,
            data,
            res => {
              this.$dialog.toast({
                mes: "成功!",
                icon: "success",
                timeout: 1500
              });
              this.getOrderDetail();
            },
            this
          );
        }
      }
    },
    // 外部派单
    getBuilding(e) {
      this.showBuilding = true;
      if (e) {
        console.log(e);
        var data = {
          token: this.$getkey(),
          serviceMode: this.serviceMode,
          taskId: this.result.repairsBill.guid,
          userId: this.userInfo.guid,
        };
        this.showStyle = false;
        console.log(data);
        if (this.result.repairsBill.status == 3) {
          this.$dialog.loading.open("加载中");
          var arr = [];
          for(var val of e){
            arr.push(val.organId);
          }
          data.organIds = arr.join(',')
          this.$ajax(
            `${this.subUrl.activity}/repairs/csAllocation`,
            data,
            res => {
              this.$dialog.loading.close();
              this.$dialog.toast({
                mes: "成功!",
                icon: "success",
                timeout: 1500
              });
              this.getOrderDetail();
            },
            this
          );
        }
      }
    },
    // 处理方式
    confirm(e) {
      if (this.remark == "") {
        return this.$dialog.toast({
          mes: "请输入备注！"
        });
      }
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        taskId: this.result.repairsBill.guid,
        result: e,
        remark: this.remark
      };
      this.$ajax(
        `${this.subUrl.activity}/repairs/handle`,
        data,
        res => {
          this.showMask = false;
          let txt = e ? "已处理!" : "已拒绝处理!";
          this.$dialog.toast({ mes: txt });
          this.getOrderDetail();
        },
        this
      );
    },
    // 选择 调度方式
    chooseUser(e) {
      this.serviceMode = e;
      if (e == 1) {
        this.showUser = false;
      } else {
        this.showBuilding = false;
      }
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
        return this.$dialog.toast({ mes: "请输入评语!" });
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
            this.comment = "";
            this.getOrderDetail();
            this.$dialog.toast({ mes: "评价成功!", icon: "success" });
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
            console.log("获取详情！");
            this.result = res.data.data;
            this.getStatusToSHow(this.result.repairsBill.status);
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
.mask > div {
  position: absolute;
  left: 50%;
  right: 0;
  top: 50%;
  width: 5.6rem;
  transform: translate(-50%, -50%);
  padding: 0.3rem 0.5rem;
  border-radius: 0.1rem;
}
/* 弹窗 */

.select-style {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 300000;
}

.fixed-evaluate {
  margin: 0;
}

.status-type01 {
  font-size: 0.24rem;
  border: 1px solid #5881ff;
  line-height: 1.2em;
  color: #5881ff;
  padding: 0.03rem 0.05rem;
}

.status-type02 {
  font-size: 0.24rem;
  padding: 0.03rem 0.05rem;
  border: 1px solid orange;
  line-height: 1.2em;
  color: orange;
}
.status-type03 {
  font-size: 0.24rem;
  padding: 0.03rem 0.05rem;
  border: 1px solid #999999;
  line-height: 1.2em;
  color: #999999;
}

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

.div-remark {
  line-height: 1.8em;
  min-height: 6em;
  padding: 0 0.5em;
  padding-top: 0.5em;
  border: 1px solid #eeeeee;
  margin: 0.3em 0.5em;
}

.img-flex div > img {
  width: 1.5rem;
  height: 1.5rem;
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
  font-size: 12px;
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
