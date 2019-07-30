<template>
<div style="height:100vh">
    <yd-layout class="layout_my" v-if="!showReplay">
      <yd-navbar class="header" slot="navbar" v-show="!userAgent.isWX" title="违规整改详情" color="#fff" :bgcolor="mainColor" height=".88rem">
         <div slot="left" @click="back">
            <span ><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
         </div>
      </yd-navbar>
      <div class="organInfos" v-if="info">
        <div class="name">
          <p class="font32 font600">{{info.rectificationBill.customerInfo.ridName}}{{info.rectificationBill.customerInfo.unitName}}</p>
          <span class="pdlr1 state state0" v-if="info.rectificationBill.status == 0">关闭</span>
            <span class="pdlr1 state state1" v-if="info.rectificationBill.status == 1">完成</span>
            <span class="pdlr1 state state2" v-if="info.rectificationBill.status == 2">经理审批</span>
            <span class="pdlr1 state state3" v-if="info.rectificationBill.status == 3">客服发布</span>
            <span class="pdlr1 state state4" v-if="info.rectificationBill.status == 4">租户处理</span>
            <span class="pdlr1 state state5" v-if="info.rectificationBill.status == 5">复查</span>
            <span class="pdlr1 state state6" v-if="info.rectificationBill.status == 6">客服关闭 </span>
        </div>
        <div class="info">
          <ul>
            <li><span>报告人：</span><p>{{info.rectificationBill.customerInfo.name}}</p></li>
            <li><span>上报时间：</span><p>{{info.rectificationBill.createTime.substr(0,10).replace(/-/g,"/")}}</p></li>
            <li><span>单号：</span><p>{{info.rectificationBill.guid}}</p></li>
          </ul>
        </div>
        <div class="contacts">
           <ul>
              <li><img style="width:.7rem;height:.7rem;" src="../../../../../../assets/images/rent/estate/rent.png" alt=""></li>
              <li>
                  <p>{{info.rectificationBill.customerInfo.name}}</p>
                  <span>{{info.rectificationBill.customerInfo.account}}</span>
              </li>
           </ul>
           <ul>
              <li><img style="width:.7rem;height:.7rem;" src="../../../../../../assets/images/rent/estate/yezhu.png" alt=""></li>
              
              <li>
                  <p>{{info.rectificationBill.ownerInfo.name}}</p>
                  <span>{{info.rectificationBill.ownerInfo.account}}</span>
              </li>
           </ul>
      </div>
    
    <div class="text">
      <span>违规内容</span>
      <p>{{info.rectificationBill.content}}</p>
    </div>
    </div>
    <div class="feedback" v-if="info && info.feedback">
       <span>整改结果</span>
       <p>限贵司于2017年03月21日16时前进行整改，如我司人员在限期后仍发现贵司未整改的，我司将采取相关措施，
        并根据你我双方之约定处罚违约金3000元。</p>
    </div>
     <div class="feedback" v-if="info && info.rectificationBill.status == 3 && info.tasks">
       <span>整改结果</span>
       <p class="flex-row flex-start">限你单位于<yd-datetime type='datetime' class="border" style="dispaly:inline-block;width:3rem" v-model="endTime"></yd-datetime>时前进行整改，如我司人员在限期后仍发现贵司未整改的，我司将采取相关措施，
        并根据你我双方之约定处罚违约金<input class="border" v-model="money" style="width:2rem;display:inline"/>元。</p>
    </div>
    <!-- 记录 -->
    <yd-timeline v-if="info" class="mt2">
        <yd-timeline-item  v-for='(item,index) in info.tasksRecordList' :key='index'>
          <img style="width:.4rem;height:.4rem" src="../../../../../../assets/images/rent/estate/chooseSelected.png" slot="icon" v-if='index==0'
            alt="">
          <div class="font32 mb2" :style="`color:${mainColor}`">{{item.title}}</div>
          <div class="font28 flex-start">
            <span>操作人:</span>
            <span>{{item.usetName}}</span>
          </div>
          <div class="font28 flex-start" v-if='item.remark'>
            <span>备注:</span>
            <span>{{item.remark}}</span>
          </div>
          <p class="flex-row">{{item.createTime}}</p>
        </yd-timeline-item>
      </yd-timeline>
    <!-- 租户确定 -->
    <div class='buttons'  v-if="info && info.rectificationBill.status == 4 && info.tasks"><button  @click="rentConfirm" :style="{background:mainColor}">确 定</button></div>
    <!-- <div class='buttons' v-if="info"><button @click="rentConfirm" :style="{background:mainColor}">确 定</button></div> -->
    <!-- 经理审批 -->
    <div class="flex-row h9 bgwhite bt font32" v-if='(info && info.rectificationBill.status==2) && info.tasks' slot='bottom'>
      <div class="flex1 jusCenter br" @click="disagree1">
        <img style="width:.4rem;height:.4rem;" class="mr1" src="../../../../../../assets/images/rent/estate/disagree.png" alt="">
        <span style='color:#ff483f;'>不同意</span>
      </div>
      <div class="flex1 jusCenter" @click='agree1'>
        <img style="width:.4rem;height:.4rem;" class="mr1" src="../../../../../../assets/images/rent/estate/select_active.png" alt="">
        <span :style='{color:mainColor}'>同意</span>
      </div>
    </div>
    <!-- 客服审批 -->
    <div class="flex-row h9 bgwhite bt font32" v-if='(info && info.rectificationBill.status==3) && info.tasks' slot='bottom'>
      <div class="flex1 jusCenter br" @click="disagree2">
        <img style="width:.4rem;height:.4rem;" class="mr1" src="../../../../../../assets/images/rent/estate/disagree.png" alt="">
        <span style='color:#ff483f;'>关闭任务</span>
      </div>
      <div class="flex1 jusCenter" @click='agree'>
        <img style="width:.4rem;height:.4rem;" class="mr1" src="../../../../../../assets/images/rent/estate/select_active.png" alt="">
        <span :style='{color:mainColor}'>发送</span>
      </div>
    </div>
    <!-- 复查！ -->
     <div class="flex-row h9 bgwhite bt font32" v-if='(info && info.rectificationBill.status==5) && info.tasks' slot='bottom'>
      <div class="flex1 jusCenter br" @click="disagree3">
        <img style="width:.4rem;height:.4rem;" class="mr1" src="../../../../../../assets/images/rent/estate/disagree.png" alt="">
        <span style='color:#ff483f;'>复查未完成</span>
      </div>
      <div class="flex1 jusCenter" @click='agree3'>
        <img style="width:.4rem;height:.4rem;" class="mr1" src="../../../../../../assets/images/rent/estate/select_active.png" alt="">
        <span :style='{color:mainColor}'>复查完成</span>
      </div>
    </div>
  </yd-layout>
  <replay v-if="showReplay" @operate="operate" :type='type'></replay>
</div>
  
</template>
<script>
import Vue from "vue";
import fn from "@/assets/js/product";
import qs from "qs";
import replay from "./replay";
import { TimeLine, TimeLineItem } from "vue-ydui/dist/lib.rem/timeline";

Vue.component(TimeLine.name, TimeLine);
Vue.component(TimeLineItem.name, TimeLineItem);

export default {
  components: {
    replay
  },
  data() {
    return {
      type: -1,
      showAgree: false,
      showDisagree: false,
      showReplay: false,
      info: null,
      money: "",
      mainColor: "",
      titleT: "",
      show: true,
      s: true,
      p: true,
      d: true,
      endTime: this.$today() + " 00:00",
      statusList: []
    };
  },
  methods: {
    // 经理不同意
    disagree1() {
      this.type = 1;
      this.showReplay = true;
    },
    // 客服不同意
    disagree2() {
      this.type = 3;
      this.showReplay = true;
    },
    // 复查未完成
    disagree3() {
      this.type = 4;
      this.showReplay = true;
    },
    // 复查完成
    agree3() {
      this.type = 5;
      this.showReplay = true;
    },
    // 经理同意!
    agree1() {
      this.type = 2;
      this.showReplay = true;
    },
    operate(e) {
      this.showReplay = false;
      if (e) {
        var data = {
          token: this.$getkey(),
          userId: this.userInfo.guid,
          rectificationId: this.info.rectificationBill.guid,
          opinionContent: e
        };
        console.log(this.type);
        // 经理拒绝
        if (this.type == 1) {
          data.opinion = 0;
          this.$ajax(
            `${this.subUrl.activity}/rectification/managerCheck`,
            data,
            res => {
              this.$dialog.toast({
                mes: "已拒绝",
                icon: "success",
                timeout: 1000
              });
              this.getMyInvitation();
            },
            this
          );
          // 经理同意!
        } else if (this.type == 2) {
          data.opinion = 1;
          this.$ajax(
            `${this.subUrl.activity}/rectification/managerCheck`,
            data,
            res => {
              this.$dialog.toast({
                mes: "已同意",
                icon: "success",
                timeout: 1000
              });
              this.getMyInvitation();
            },
            this
          );
          // 客服关闭
        } else if (this.type == 3) {
          data.opinion = 0;
          this.$ajax(
            // 需补充接口
            `${this.subUrl.activity}/rectification/csClose`,
            data,
            res => {
              this.$dialog.toast({
                mes: "已拒绝",
                icon: "success",
                timeout: 1000
              });
              this.getMyInvitation();
            },
            this
          );
          // 复查未完成
        } else if (this.type == 4) {
          data.opinion = 0;
          this.$ajax(
            // 需补充接口
            `${this.subUrl.activity}/rectification/review`,
            data,
            res => {
              this.$dialog.toast({
                mes: "复查整改未完成!",
                icon: "success",
                timeout: 1000
              });
              this.getMyInvitation();
            },
            this
          );
          // 复查完成！
        } else if (this.type == 5) {
          data.opinion = 1;
          this.$ajax(
            // 需补充接口
            `${this.subUrl.activity}/rectification/csClose`,
            data,
            res => {
              this.$dialog.toast({
                mes: "已整改完成！",
                icon: "success",
                timeout: 1000
              });
              this.getMyInvitation();
            },
            this
          );
        }
      }
    },
    // 客服同意
    agree() {
      if (this.money == "") {
        return this.$dialog.toast({ mes: "请输入罚金" });
      } else if (!/^[1-9]\d{0,}$/.test(this.money)) {
        return this.$dialog.toast({ mes: "罚金格式不正确" });
      }
      var data = {
        token: this.$getkey(),
        reslut: `限你单位于${this.endTime}:09时前进行整改，如我司人员在限期后仍发现贵司未整改的，我司将采取相关措施，
        并根据你我双方之约定处罚违约金${this.money}元。`,
        rectificationId: this.info.rectificationBill.guid,
        opinion: 1,
        userId: this.userInfo.guid
      };
      this.$ajax(
        `${this.subUrl.activity}/rectification/csConfirm`,
        data,
        res => {
          this.$dialog.toast({ mes: "已同意", icon: "success" });
          this.$router.go(-1);
        },
        this
      );
    },
    // 租户确定
    rentConfirm() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        rectificationId: this.info.rectificationBill.guid,
        opinion: 1
      };
      this.$ajax(
        `${this.subUrl.activity}/rectification/customerProcessing`,
        data,
        res => {
          this.$dialog.toast({ mes: "已确定整改完成" });
          this.getMyInvitation();
        },
        this
      );
    },
    toggle() {
      this.show = !this.show;
    },
    turnTo(url) {
      this.$router.push(url);
    },
    back() {
      history.back();
    },
    // 获取邀请信息列表
    getMyInvitation() {
      var data = {
        userId: this.userId,
        rectificationId: this.$route.query.id,
        token: this.$getkey()
      };
      this.xhr
        .post(
          `${this.subUrl.activity}/rectification/detail`,
          qs.stringify(data)
        )
        .then(res => {
          if (res.data.code == 1) {
            this.info = res.data.data;
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
    this.getMyInvitation();
  }
};
</script>
<style scoped>
.layout_my .header:after {
  display: none;
}
.layout_my {
  background: #eef3fa;
}

.layout_my .blue_box {
  height: 0.88rem;
  background-size: 100% 100%;
}
.organInfos {
  width: 100%;
  background: white;
}
.name {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0.3rem;
  background: white;
  border-bottom: 1px solid #f3f6f5;
}
/* .name > span {
  border-radius: 0.05rem;
  border: 1px solid #2d88d4;
  color: #2d88d4;
} */

.info {
  width: 100%;
  background: white;
  border-bottom: 1px solid #f3f6f5;
  padding: 0.1rem 0.3rem;
  font-size: 0.24rem;
  position: relative;
}
.info ul li {
  display: flex;
  height: 0.4rem;
}
.info ul li > span {
  width: 1.3rem;
  text-align: right;
  color: #9d9e9d;
}

.contacts {
  width: 100%;
  padding: 0.1rem 0.3rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.contacts ul {
  width: 50%;
  display: flex;
  flex-flow: row;
  align-items: center;
}
/* .contacts ul li:nth-child(1) {
  width: 0.7rem;
  height: 0.7rem;
  background: red;
  border-radius: 50%;
} */
.contacts ul li > img {
  border-radius: 50%;
}
.contacts ul li:nth-child(2) {
  flex: 1;
  padding: 0 0.1rem;
  color: #6f6f6f;
}
.contacts ul li:nth-child(2) > p {
  margin-bottom: 0.05rem;
}

.text {
  display: flex;
  flex-flow: column;
  width: 100%;
  padding: 0 0.4rem;
  background: white;
  margin-top: 0.3rem;
}
.text > p {
  padding: 0.2rem 0;
  font-size: 0.3rem;
  color: #5a5b5a;
  border-bottom: 1px solid #e5e8e8;
}
.text > span {
  width: 100%;
  height: 0.7rem;
  background: #fafcfb;
  line-height: 0.7rem;
  color: #9f9f9f;
}

.feedback {
  width: 100%;
  display: flex;
  flex-flow: column;
  background: white;
  margin-top: 0.3rem;
}
.feedback > span {
  width: 100%;
  height: 0.6rem;
  color: #c5c5c5;
  font-size: 0.24rem;
  display: flex;
  align-items: center;
  padding: 0 0.3rem;
}
.feedback > p {
  width: 94%;
  padding: 0.3rem 0.3rem;
  font-size: 0.28rem;
  text-indent: 0.2rem;
  color: #202121;
  border: 1px solid #e7e7e7;
  margin: 0 auto 0.3rem;
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
</style>
