<template>
<div style="height:100vh">
  <yd-layout class="layout_my" v-if="showUser && !showReplay">
      <yd-navbar class="header" v-show="!userAgent.isWX" v-title="'接待详情'" slot="navbar" title="接待详情" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span class="spanLeft addClickArea" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
      </yd-navbar>
    <div class="organInfos">
      <div class="name">
        <p class="font32 font600 textHidden">{{dateils.customerName}}</p>
        <!-- <span v-show="dateils.status!=null" class="font22" :style="{border:'1px solid '+mainColor,color:mainColor}">{{dateils.status}}</span> -->
        <!-- 上报中：1，已接单：2，处理中：3，待确认：4，已完成：5，关闭：6,不同意：7） -->
          <span class="pdlr1 state state2" v-if="dateils.status == 1">上报中</span>
          <span class="pdlr1 state state2" v-if="dateils.status == 2">接单</span>
          <span class="pdlr1 state state2" v-if="dateils.status == 3">处理中</span>
          <span class="pdlr1 state state2" v-if="dateils.status == 4">待确认</span>
          <span class="pdlr1 state state1" v-if="dateils.status == 5">已完成</span>
          <span class="pdlr1 state stateClose" v-if="dateils.status == 6">关闭</span>
          <span class="pdlr1 state state0" v-if="dateils.status == 7">不同意</span>
      </div>
      <div class="info">
         <ul>
           <li><span>报告人：</span><p>{{dateils.applyUserName}}</p></li>
           <li><span>单号：</span><p>{{dateils.guid}}</p></li>
           <li><span>接待时间：</span><p>{{dateils.receptionDate}}</p></li>
           <li><span>接待地点：</span><p>{{dateils.receptionAddr}}</p></li>
           <li><span>填写日期：</span><p>{{dateils.createDate}}</p></li>
         </ul>
      </div>
    </div>
    <div class="details">
       <ul>
           <li v-for="(item,index) in type" :key="index">
              <yd-icon name='selected' v-if="active==index*1 + 1" custom size='.4rem' :color='mainColor'></yd-icon>
               <!-- <i v-if="active==index*1 + 1"><img  src="../../../../../../assets/images/rent/estate/select_active.png" alt=""></i> -->
               <i v-else><img src="../../../../../../assets/images/rent/estate/select.png" alt=""></i>
               <p class="font30 font600">{{item}}</p>
           </li>
       </ul>

        <div class="ss">
          <p class="textHidden4">{{dateils.detailContent}}</p>
        </div>
        <div class="images">
            <ul>
              <li v-for="(item,index) in commAccessoryList" :key="index"><img :src="item.path" alt=""></li>
            </ul>
        </div>
    </div>
   
    <div class='buttons'><button @click="agree4" v-if="result.tasks && result.reception.status == 4" :style="{background:mainColor}">确定完成</button></div>
    <div class='buttons'><button @click="confirm" v-if="result.tasks && result.reception.status == 5" :style="{background:mainColor}">评价</button></div>
    <div v-show="show2" class="evaluate" @click="show2 = false">
        <ul @click.stop="''">
          <li>
            <p class="font30">速度</p>
            <span>
               <yd-cell-item>
                <yd-rate slot="left" v-model="rate1"></yd-rate>
               </yd-cell-item>
            </span>
          </li>
          <li>
            <p class="font30">服务</p>
            <span>
                <yd-cell-item>
                <yd-rate slot="left" v-model="rate2"></yd-rate>
               </yd-cell-item>
            </span>
          </li>
          <li><yd-textarea slot="right" placeholder="说说" v-model="rate3" maxlength="100"></yd-textarea></li>
          <li @click="release">
            <span class="font30 font600" :style="{color:mainColor}">发布评价</span>
          </li>
        </ul>

    </div>

    <div class="status">
      <div class="one" v-for="(item,index) in tasksRecordList" :key="index">
           <div class="z">
            <div class="dot">
              <!-- <ul><li></li></ul> -->
              <yd-icon name='tongxinyuan' :color='mainColor' size='.5rem' custom></yd-icon>
            </div>
           <div class="wire"></div>
           </div>
           <div class="tag">
               <div class="result">
                   <ul>
                     <li>
                       <span :style="{color:mainColor}">{{item.title}}</span>
                       <p class="flex"><img style="width:.35rem;" class="mr1" src="../../../../../../assets/images/rent/estate/date.png" alt="">{{item.createTime}}</p>
                      </li>
                      <li>处理人：{{item.usetName}}</li>
                      <li>备注：{{item.remark}}</li>
                   </ul>
               </div>
               <div class="arrow">
                <em></em><span></span>
               </div>

            </div>
      </div>
    </div>
    <!-- 显示意见和获取 -->
    <div class="mask" v-if="showAdvice" @click="showAdvice = false">
      <div class="bgwhite" style="padding:.5rem 0;" @click.stop='""'>
        <div class="top" style="padding:0 .5rem;">
          <yd-textarea class="border pdlr1" maxlength='100' placeholder='请输入备注' v-model="remark" style="margin:.03rem 0;">

          </yd-textarea>
        </div>
        <div class="flex-row h7" @click="showUser=false"> 
          <input type="text"  class="flex1 jusCenter" readonly placeholder="选择执行人" style="height:100%;margin: 0.2rem .5rem 0;">
        </div>
      </div>
    </div>
    <!-- agree2 -->
    <!-- 完成评价 -->
      <div class="flex-row h8 center jusCenter" @click="showEvaluate = true" v-if="tasks && result.reception.status == 5" :style="{background:mainColor,color:'#fff',margin:'.3rem .5rem','border-radius':'.1rem'}">
        评价
      </div>
        <!-- 客服处理 -->
        <div class="flex-row h9 bgwhite bt font32" v-if='result.tasks && result.reception.status==1' slot='bottom'>
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
        <div class="flex-row h9 bgwhite bt font32" style='overflow:hidden;' v-if='result.tasks && result.reception.status==2' slot='bottom'>
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
      <div class="flex-row h9 bgwhite bt font32" style='overflow:hidden;' v-if='result.tasks && result.reception.status==3' slot='bottom'>
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
import Vue from "vue";
import fn from "@/assets/js/product";
import qs from "qs";
import { TextArea } from "vue-ydui/dist/lib.rem/textarea";
import { Input } from "vue-ydui/dist/lib.rem/input";
import {
  Confirm,
  Alert,
  Toast,
  Notify,
  Loading
} from "vue-ydui/dist/lib.rem/dialog";
import { Rate } from "vue-ydui/dist/lib.rem/rate";
import departMent from "../repair/department_manager";
import replay from "../rectification/replay";
Vue.component(Rate.name, Rate);

Vue.prototype.$dialog = {
  confirm: Confirm,
  alert: Alert,
  toast: Toast,
  notify: Notify,
  loading: Loading
};

Vue.component(Input.name, Input);

Vue.component(TextArea.name, TextArea);
var userInfo;
export default {
  components: {
    departMent,
    replay
  },
  data() {
    userInfo = JSON.parse(decodeURIComponent(localStorage.getItem("userInfo")));
    return {
      rate1: 5,
      rate2: 5,
      rate3: "",
      rete3: "", //报错未找到哪使用了这个数据
      userInfo: userInfo,
      organInfo: {},
      showUser: true,
      showReplay: false,
      commAccessoryList: [],
      showAdvice: false,
      active: "",
      show1: true,
      show2: false,
      images: [],
      remark: "",
      getkey: "",
      mainColor: "",
      input8: "",
      alertT: false,
      info: {
        name: "",
        tel: "",
        pid: ""
      },
      list: [],
      getHearLog: {
        domain: "",
        token: "",
        name: ""
      },
      imgName: [],
      imgUrl: [],

      statusList: [],
      d: true,
      userId: "",
      receptionId: "",
      dateils: {},
      type: ["车位", "横幅", "专用电梯"],
      statuss: ["上报成功", "已接单", "处理成功", "已评价", "关闭"],
      tasksRecordList: [],
      result: {},
      tasks: null
    };
  },
  computed: {
    lists() {
      return this.list;
    }
  },
  methods: {
    setUserId(e) {
      this.showUser = true;
      if (e) {
        console.log(e);
        this.approverName = e.userName;
        this.approverId = e.userId;
        let data = {
          token: this.$getkey(),
          userId: userInfo.guid,
          receptionId: this.result.reception.guid,
          assigneeId: e.userId
        };
        if (this.currentType == 1) {
          this.$ajax(
            `${this.subUrl.activity}/reception/serviceHandle`,
            data,
            res => {
              this.getReception();
              this.$dialog.toast({ mes: "已提交给审批人", icon: "success" });
            },
            this
          );
        } else if (this.currentType == 2) {
          data.opinion = 1;
          data.comment = this.remark ? this.remark : "";
          this.$ajax(
            `${this.subUrl.activity}/reception/manageAssign`,
            data,
            res => {
              this.getReception();
              this.$dialog.toast({ mes: "已安排处理", icon: "success" });
            },
            this
          );
        } else if (this.currentType == 3) {
        }
        this.remark = "";
        this.showAdvice = false;
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
          receptionId: this.result.reception.guid,
          remark: e
        };
        // 经理拒绝
        if (this.replayType == 1) {
          data.opinion = 2;
          this.$ajax(
            `${this.subUrl.activity}/reception/manageAssign`,
            data,
            res => {
              this.$dialog.toast({
                mes: "已拒绝",
                icon: "success",
                timeout: 1000
              });
              this.getReception();
            },
            this
          );
        } else if (this.replayType == 2) {
          this.$ajax(
            `${this.subUrl.activity}/reception/executorHandle`,
            data,
            res => {
              this.$dialog.toast({
                mes: "已确定",
                icon: "success",
                timeout: 1000
              });
              this.getReception();
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
        mes: "是否关闭接待",
        opts: () => {
          var data = {
            token: this.$getkey(),
            userId: userInfo.guid,
            receptionId: this.result.reception.guid
          };
          this.$ajax(
            `${this.subUrl.activity}/reception/close`,
            data,
            res => {
              this.getReception();
              this.$dialog.toast({ mes: "已关闭接待", icon: "success" });
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
      this.showAdvice = true;
    },
    //执行人确定
    agree3() {
      // this.showReplay = true;
      // this.replayType = 2;
      this.$dialog.confirm({
        mes: "是否确认处理完成",
        opts: () => {
          var data = {
            token: this.$getkey(),
            userId: userInfo.guid,
            receptionId: this.result.reception.guid,
          };
          this.$ajax(
            `${this.subUrl.activity}/reception/executorHandle`,
            data,
            res => {
              this.$dialog.toast({
                mes: "已确定",
                icon: "success",
                timeout: 1000
              });
              this.getReception();
            },
            this
          );
        }
      });
    },
    // 租户确定
    agree4() {
      this.$dialog.confirm({
        mes: "是否确定完成",
        opts: () => {
          var data = {
            token: this.$getkey(),
            userId: userInfo.guid,
            receptionId: this.result.reception.guid
          };
          this.$ajax(
            `${this.subUrl.activity}/reception/userConfirm`,
            data,
            res => {
              this.getReception();
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
    release() {
      if (this.rate3 == "") {
        return this.$dialog.toast({ mes: "请输入评语", timeout: "400" });
      }
      let data = {
        token: this.$getkey(),
        userId: userInfo.guid,
        speedEvaluate: this.rate1,
        serviceEvaluate: this.rate2,
        comment: this.rate3,
        receptionId: this.result.reception.guid
      };
      this.$ajax(
        `${this.subUrl.activity}/reception/evaluate`,
        data,
        res => {
          this.showEvaluate = false;
          this.$dialog.toast({ mes: "已评价", timeout: "400", icon: "success" });
          this.rate3 = "";
          this.getReception();
        },
        this
      );
      this.show2 = false;
    },
    confirm() {
      this.show2 = true;
    },
    turnTo(url) {
      this.$router.push(url);
    },
    back() {
      history.back();
    },
    // 获取邀请信息列表
    getReception() {
      var data = {
        token: this.getkey,
        userId: this.userId,
        receptionId: this.receptionId
      };
      this.xhr
        .post(
          `${this.subUrl.activity}/reception/getReception`,
          qs.stringify(data)
        )
        .then(res => {
          if (res.data.code == 1) {
            console.log(res);
            this.dateils = res.data.data.reception;
            res.data.data.tasksRecordList.forEach(element => {
              element.createTime = element.createTime.split(" ")[0];
            });
            this.tasksRecordList = res.data.data.tasksRecordList;
            this.commAccessoryList = res.data.data.commAccessoryList;
            this.active = this.dateils.type;
            this.result = res.data.data;
            // console.log(res)
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
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.mainColor = this.$color[this.userInfo.organType];
    this.userId = this.userInfo.guid;
    this.getkey = fn.getIng();

    this.receptionId = this.$route.hash.split("#")[1];
    console.log(this.$route);
    this.getReception();
  },
  beforeUpdate() {
    // this.imgName.forEach(item=>{
    //     this.imgUrl.push(this.getHearLog.domain+'/'+item)
    // })

    if (this.imgName.length >= 5) {
      this.show1 = false;
    }
  }
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
.organInfos {
  width: 100%;
}
.name {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0.3rem;
  background: white;
  border-bottom: 1px solid #f3f6f5;
}
.name > p {
  width: 5.5rem;
}
.name > span {
  border-radius: 0.05rem;
  /* border: 1px solid #2d88d4;
  color: #2d88d4; */
  padding: 0.05rem 0.1rem;
}

.info {
  width: 100%;
  background: white;
  padding: 0.1rem 0.3rem;
  font-size: 0.24rem;
  position: relative;
}
.info ul li {
  display: flex;
  height: 0.5rem;
}
.info ul li > span {
  width: 1.3rem;
  text-align: right;
  color: #9d9e9d;
}
.info ul li > p {
  flex: 1;
  margin-left: 0.2rem;
  font-size: 0.24rem;
}
.info > p {
  font-size: 0.28rem;
  color: #2d88d4;
  position: absolute;
  bottom: 0.15rem;
  right: 0.3rem;
}

.details {
  width: 100%;
  margin-top: 0.2rem;
  background: white;
  padding: 0.2rem;
  border-bottom: 1px solid #e5e5e5;
}
.details > ul {
  width: 100%;
  display: flex;
  flex-flow: row;
  justify-content: space-around;
  align-content: center;
}
.details > ul li {
  display: flex;
  margin-bottom: 0.2rem;
  justify-content: center;
  align-items: center;
}
.details > ul li > i {
  width: 0.4rem;
  height: 0.4rem;
  /* margin-right: 0.1rem; */
}
.details > ul li > i > img {
  width: 100%;
  height: 100%;
}
.ss {
  border: 1px solid #e8e8e8;
  border-radius: 0.05rem;
  padding: 0.2rem 0.2rem;
  line-height: 0.4rem;
}

.images {
  margin-top: 0.2rem;
  display: flex;
}
.images > p {
  border: 2px dashed #b6ceec;
  width: 1.2rem;
  height: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.1rem;
  position: relative;
}
.images > p > img {
  width: 0.6rem;
  height: 0.6rem;
}
.images > ul {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
}
.images > ul > li {
  width: 1.2rem;
  height: 1.2rem;
  margin: 0 0.1rem;
}
.images > ul > li > img {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 0.1rem;
}
.images > p > input {
  width: 100%;
  height: 0.9rem;
  opacity: 0;
  position: absolute;
  left: 0;
  top: 0;
}

.buttons {
  width: 100%;
  margin: 0.4rem 0;
  display: flex;
  justify-content: center;
}
.buttons > button {
  width: 90%;
  height: 0.8rem;
  color: white;
  font-size: 0.3rem;
  font-weight: 600;
  border-radius: 0.1rem;
  border: none;
}

.evaluate {
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  left: 0;
  padding: 3.6rem 0.4rem;
  z-index: 112;
}
.evaluate ul {
  width: 100%;
  height: 100%;
  background: #f8f8f9;
  border-radius: 0.2rem;
  display: flex;
  flex-flow: column;
  align-items: center;
}
.evaluate ul li {
  display: flex;
  justify-content: center;
  align-items: center;
}
.evaluate ul li:nth-child(1) {
  width: 100%;
  height: 1rem;
  margin-top: 0.2rem;
}
.evaluate ul li:nth-child(1) p {
  margin-right: 0.3rem;
  color: #686868;
}
.evaluate ul li:nth-child(2) p {
  margin-right: 0.3rem;
  color: #686868;
}
.evaluate ul li:nth-child(2) {
  width: 100%;
  height: 1rem;
}
.evaluate ul li:nth-child(3) {
  margin-top: 0.3rem;
  width: 90%;
  height: 2.4rem;
  border: 1px solid #e9e9ea;
  border-radius: 0.1rem;
}
.evaluate ul li:nth-child(3) textarea {
  width: 100%;
  height: 2.4rem;
  border-radius: 0.1rem;
}
.evaluate ul li:nth-child(4) {
  width: 100%;
  height: 1rem;
  border-top: 1px solid #eaeae9;
  background: white;
  margin-top: 0.25rem;
  border-radius: 0 0 0.2rem 0.2rem;
}

.status {
  width: 100%;
  background: #fafefd;
  margin-top: 0.3rem;
}
.one {
  width: 100%;
  height: 2rem;
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #f2f3f3;
  background: #f8f8f9;
}
.tag {
  width: 70%;
  height: 1.7rem;
  border: 1px solid #f2f3f3;
  position: relative;
  background-color: #fff;
  border-radius: 0.1rem;
}
.arrow {
  position: absolute;
  width: 0.3rem;
  height: 0.3rem;
  top: 0.6rem;
  left: -0.4rem;
}
.arrow * {
  display: block;
  border-width: 0.2rem;
  position: absolute;
  border-style: dashed solid dashed dashed;
  font-size: 0;
  line-height: 0;
}
.arrow em {
  border-color: transparent #f2f3f3 transparent transparent;
}
.arrow span {
  border-color: transparent #fff transparent transparent;
  left: 1px;
}

.one .dot {
  width: 0.6rem;
  height: 0.6rem;
  background: #f8f8f9;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 111;
}
.z {
  position: relative;
  width: 0.6rem;
  height: 0.6rem;
  margin-right: 0.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dot ul {
  width: 0.42rem;
  height: 0.42rem;
  border-radius: 50%;
  background: #999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dot ul li {
  width: 0.18rem;
  height: 0.18rem;
  background: white;
  border-radius: 50%;
}
.dot > div:nth-child(1) {
  width: 0.26rem;
  height: 0.26rem;
  background: #999;
  border-radius: 0.26rem;
}
.status > div:first-child .dot ul {
  background: #23ac38;
}

.result {
  width: 100%;
  height: 100%;
  padding: 0.2rem 0.3rem;
}
.result ul {
  width: 100%;
}
.result ul li:nth-child(1) {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
}
.result ul li:nth-child(1) > p {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #b1b1b1;
  font-size: 0.24rem;
}
.result ul li:nth-child(1) > p > i {
  width: 0.3rem;
  height: 0.3rem;
  margin-right: 0.1rem;
}
.result ul li:nth-child(1) > p > i > img {
  height: 100%;
  width: 100%;
}
.result ul li:nth-child(1) > span {
  font-weight: 600;
  margin-bottom: 0.1rem;
  font-size: 0.3rem;
}
.result ul li:nth-child(2),
.result ul li:nth-child(3) {
  font-size: 0.28rem;
  color: #8a8a8a;
  margin-bottom: 0.05rem;
}

.wire {
  width: 0.04rem;
  height: 2rem;
  background: #b1b1b1;
  position: absolute;
  z-index: 110;
  top: -2rem;
}
.status > div:nth-child(1) > .z > .wire {
  display: none;
}
</style>
