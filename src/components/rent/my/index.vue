<template>
  <yd-layout class="layout_my" v-title="'我的'">
    <div v-show="show1" class="sign_popup_box" @click="hideIntegral">
      <div class="abc">
      <div class="back_icon">
           <img src="../../../assets/images/rent/my/qd.png" alt="">
      </div>
      <div class="box">
        
        <div class="font30">当前积分{{integral.currentIntegral}}</div>
        <div>
          <span class="font80">+{{integral.signInIntegral}}</span>
          <span class="font24">（第{{integral.days}}天）</span>
        </div>
        <div class="font24">连续签到7天可额外获得20积分</div>
      </div>
      </div>
    </div>

    <div class="blue_box" :class="{green:rParams.type == 1,orange:rParams.type == 2}">
      <div class="title">
        <div class="t-title">
          <div class="organName" v-if="!(rParams.type==5)">{{organInfo.organName}}</div>
          <div class="organName" v-if="rParams.type==5" style="text-align: center;flex: 1;font-size: .36rem;text-indent: 2em">我的
          </div>
          <div class="t-scan_code">
            <!-- <img src="../../../assets/images/rent/my/scan_code.png"> -->
          </div>
        </div>
        <div class="center_info">
          <div class="logo" @click.stop.prevent="$router.push('/my/setting/user_info')">
            <img :src="userInfo.headPortrait">
          </div>
          <div class="my_info">
            <div class="m-name">{{userInfo.name}}</div>
            <div class="m-account">手机:{{userInfo.account}}</div>
            <div class="m-account" v-if="(rParams.type!=5)">岗位:{{userInfo.postName}}</div>
          </div>
          <div class="code" @click="turnTo('/my/setting/my_code#myCode')">
            <img src="../../../assets/images/rent/my/default_code.png">
          </div>
        </div>
        <div class="bottom" :class="{bottom1:rParams.type == 5}">
          <!--部门信息-->
          <div class="bumenBox" v-if="!(rParams.type == 5)">
            <img v-if="rParams.type == 1" src="../../../assets/images/rent/my/orang_green.png" class="bumen">
            <img v-else-if="rParams.type == 2" if="rParams.type == 2" src="../../../assets/images/rent/my/organ_orange.png" class="bumen">
            <img v-else src="../../../assets/images/rent/my/orange_blue.png" class="bumen">

            <span style="color:#333">{{userInfo.deptName?userInfo.deptName:"暂无"}}</span>
          </div>

          <!--签到-->
          <div v-if="userInfo.signIn" class="signBox">
            <img v-if="rParams.type == 1" src="../../../assets/images/rent/my/sign_green.png" class="bumen">
            <img v-else-if="rParams.type == 2" src="../../../assets/images/rent/my/sign_orange.png" class="bumen">
            <img v-else src="../../../assets/images/rent/my/sign_blue.png" class="bumen">
            <span :style="'color:'+ mainColor">已签到</span>
          </div>
          <div v-else class="signBox" @click.stop.prevent="signSuccess()">
            <img v-if="rParams.type == 1" src="../../../assets/images/rent/my/sign_green.png" class="bumen">
            <img v-else-if="rParams.type == 2" src="../../../assets/images/rent/my/sign_orange.png" class="bumen">
            <img v-else src="../../../assets/images/rent/my/sign_blue.png" class="bumen">
            <span :style="'color:'+ mainColor">签到</span>
          </div>


        </div>
      </div>
    </div>
    <!--最新消息-->
    <div class="new_message" v-if="!(rParams.type == 5)" :style="{boxShadow:'2px 2px 3px #ccc'}">
      <div @click.stop.prevent="turnTo('/latest')">
        <img src="../../../assets/images/rent/my/newMessage.png">
        <div>最新消息</div>
      </div>
      <!--租户-->
      <div v-if="rParams.type == 1" @click.stop.prevent="turnTo('/estate/serviceList')">
        <img src="../../../assets/images/rent/my/property.png">
        <div>物业服务</div>
      </div>
      <!--物业公司-->
      <div v-if="rParams.type == 4" @click.stop.prevent="turnTo('/property')">
        <img src="../../../assets/images/rent/my/property.png">
        <div>物业管理</div>
      </div>
      <!--商家处理-->
      <div v-if="rParams.type == 2" @click.stop.prevent="turnTo('/my/business')">
        <img src="../../../assets/images/rent/my/property.png">
        <div>业务模块</div>
      </div>
      <div v-if="rParams.type == 2" @click.stop.prevent="turnTo('/my/service_order')">
        <img src="../../../assets/images/rent/my/operate.png">
        <div>服务订单</div>
      </div>
      <div v-show="!(rParams.type==2)&&!(rParams.type==6)&&!(rParams.type==7)" @click.stop.prevent="turnTo('/baishitong/find')">
        <img src="../../../assets/images/rent/my/baishitong.png">
        <div>百事通</div>
      </div>

      <!--房屋管理-->
      <div v-if="rParams.type == 6||rParams.type == 7" @click.stop.prevent="turnTo('/house')">
        <img src="../../../assets/images/rent/my/property.png">
        <div>房屋管理</div>
      </div>
      <!--财务管理-->
      <div v-if="rParams.type == 7" @click.stop.prevent="turnTo('/finance')">
        <img src="../../../assets/images/rent/my/operate.png">
        <div>财务管理</div>
      </div>
      <!--商家特殊处理-->
      <!--商家本地服务-->
      <div v-if="rParams.type == 6||rParams.type == 7" @click.stop.prevent="turnTo('/supply/find')">
        <img src="../../../assets/images/rent/my/house.png">
        <div>物业市场</div>
      </div>
      <!--物业供求-->
      <div v-if="rParams.type == 4" @click.stop.prevent="turnTo('/supply/find')">
        <img src="../../../assets/images/rent/my/local_service.png">
        <div>物业供求</div>
      </div>
      <!--租户本地服务-->
      <!-- <div v-if="rParams.type == 1" @click.stop.prevent="turnTo('/my/local_service')"> -->
      <!-- 改为供求 -->
      <div v-if="rParams.type == 1" @click.stop.prevent="turnTo('/supply/find')">
        <img src="../../../assets/images/rent/my/local_service.png">
        <div>供求</div>
      </div>
      <!--商家本地服务-->
      <div v-if="rParams.type == 2" @click.stop.prevent="turnTo('/my/local_service')">
        <img src="../../../assets/images/rent/my/local_service.png">
        <div>本地服务</div>
      </div>
    </div>
    <!--其他/个人-->
    <div class="message" v-if="rParams.type == 5">
      <div class="m-list" @click.stop.prevent="turnTo(newMessage.path)">
        <img class="m-icon" :src="newMessage.img">
        <div class="m-content">{{newMessage.name}}</div>
        <img class="m-right" src="../../../assets/images/rent/my/enter.png">
      </div>
      <div v-for="(item,index) in personal" @click.stop.prevent="turnTo(item.path)" :class="{'m-top':index==0,'m-center':index>0 && index < (personal.length-1),
        'm-bottom':index == (personal.length-1)}" :key="index">
        <img class="m-icon" :src="item.img">
        <div class="m-content">{{item.name}}</div>
        <img class="m-right" src="../../../assets/images/rent/my/enter.png">
      </div>
      <div class="m-list" @click.stop.prevent="$router.push(setting.path)">
        <img class="m-icon" :src="setting.img">
        <div class="m-content">{{setting.name}}</div>
        <img class="m-right" src="../../../assets/images/rent/my/enter.png">
      </div>
    </div>
    <!--租户-->
    <div class="message" v-if="rParams.type == 1">
      <!--管理员-->
      <div class="m-list" v-if="userInfo.isAdmin" @click.stop.prevent="turnTo(Manager.path)">
        <img class="m-icon" :src="Manager.img">
        <div class="m-content">{{Manager.name}}</div>
        <img class="m-right" src="../../../assets/images/rent/my/enter.png">
      </div>
      <!--企业服务-->
      <div class="m-list" v-if="rParams.type==1" @click.stop.prevent="turnTo(enterprise.path)">
        <img class="m-icon" :src="enterprise.img">
        <div class="m-content">{{enterprise.name}}</div>
        <img class="m-right" src="../../../assets/images/rent/my/enter.png">
      </div>
      <!--列表循环-->
      <div v-for="(item,index) in rent" v-if="!(index == 0 && userInfo.postType == 4)" :class="[{'m-top':index==0,
      'm-center':index> 0 && index < (personal.length),
        'm-bottom':index == (personal.length)},userInfo.postType == 4 && index == 1?'m-top':'']" :key="index" @click.stop.prevent="turnTo(item.path)">
        <img class="m-icon" :src="item.img">
        <div class="m-content">{{item.name}}</div>
        <img class="m-right" src="../../../assets/images/rent/my/enter.png">
      </div>
      <div class="m-list" @click.stop.prevent="$router.push(setting.path)">
        <img class="m-icon" :src="setting.img">
        <div class="m-content">{{setting.name}}</div>
        <img class="m-right" src="../../../assets/images/rent/my/enter.png">
      </div>
    </div>
    <!--物业公司-->
    <div class="message" v-if="rParams.type == 4">
      <!--管理员-->
      <div class="m-list" v-if="userInfo.isAdmin" @click.stop.prevent="turnTo(Manager.path)">
        <img class="m-icon" :src="Manager.img">
        <div class="m-content">{{Manager.name}}</div>
        <img class="m-right" src="../../../assets/images/rent/my/enter.png">
      </div>
      <!--列表循环-->
      <div v-for="(item,index) in owner" @click.stop.prevent="turnTo(item.path)" v-if="!(index == 0 && userInfo.postType == 4)"
        :class="[{'m-top':index==0,
      'm-center':index> 0 && index < (owner.length),
        'm-bottom':index == (owner.length)},userInfo.postType == 4 && index == 1?'m-top':'']" :key="index">
        <img class="m-icon" :src="item.img">
        <div class="m-content">{{item.name}}</div>
        <img class="m-right" src="../../../assets/images/rent/my/enter.png">
      </div>
      <div class="m-list" @click.stop.prevent="$router.push(setting.path)">
        <img class="m-icon" :src="setting.img">
        <div class="m-content">{{setting.name}}</div>
        <img class="m-right" src="../../../assets/images/rent/my/enter.png">
      </div>
    </div>
    <!--业主-->
    <div class="message" v-if="rParams.type == 6">
      <!--管理处月报-->
      <!-- <div class="m-list" @click.stop.prevent="turnTo(report.path)">
        <img class="m-icon" :src="report.img">
        <div class="m-content">{{report.name}}</div>
        <img class="m-right" src="../../../assets/images/rent/my/enter.png">
      </div> -->
      <!--列表循环-->
      <div v-for="(item,index) in owner" @click.stop.prevent="turnTo(item.path)" v-if="!(index == 0 && userInfo.postType == 4)"
        :class="[{'m-top':index==0,
      'm-center':index> 0 && index < (owner.length),
        'm-bottom':index == (owner.length)},userInfo.postType == 4 && index == 1?'m-top':'']" :key="index">
        <img class="m-icon" :src="item.img">
        <div class="m-content">{{item.name}}</div>
        <img class="m-right" src="../../../assets/images/rent/my/enter.png">
      </div>
      <div class="m-list" @click.stop.prevent="$router.push(setting.path)">
        <img class="m-icon" :src="setting.img">
        <div class="m-content">{{setting.name}}</div>
        <img class="m-right" src="../../../assets/images/rent/my/enter.png">
      </div>
    </div>
    <!--业主委员会-->
    <div class="message" v-if="rParams.type == 7">
      <!--管理处月报-->
      <!-- <div class="m-list" @click.stop.prevent="turnTo(report.path)">
        <img class="m-icon" :src="report.img">
        <div class="m-content">{{report.name}}</div>
        <img class="m-right" src="../../../assets/images/rent/my/enter.png">
      </div> -->
      <!--关系管理-->
      <div class="m-list" @click.stop.prevent="turnTo(relationship.path)">
        <img class="m-icon" :src="relationship.img">
        <div class="m-content">{{relationship.name}}</div>
        <img class="m-right" src="../../../assets/images/rent/my/enter.png">
      </div>
      <!--列表循环-->
      <div v-for="(item,index) in owner" @click.stop.prevent="turnTo(item.path)" v-if="!(index == 0 && userInfo.postType == 4)"
        :class="[{'m-top':index==0,
      'm-center':index> 0 && index < (owner.length),
        'm-bottom':index == (owner.length)},userInfo.postType == 4 && index == 1?'m-top':'']" :key="index">
        <img class="m-icon" :src="item.img">
        <div class="m-content">{{item.name}}</div>
        <img class="m-right" src="../../../assets/images/rent/my/enter.png">
      </div>
      <div class="m-list" @click.stop.prevent="$router.push(setting.path)">
        <img class="m-icon" :src="setting.img">
        <div class="m-content">{{setting.name}}</div>
        <img class="m-right" src="../../../assets/images/rent/my/enter.png">
      </div>
    </div>
    <!--商家-->
    <!-- <div class="message" v-if="rParams.type == 2"> -->
      <!--管理员-->
      <!-- <div class="m-list" @click.stop.prevent="turnTo(Manager.path)" v-if="!userInfo.isAdmin">
        <img class="m-icon" :src="Manager.img">
        <div class="m-content">{{Manager.name}}</div>
        <img class="m-right" src="../../../assets/images/rent/my/enter.png">
      </div> -->
      <!--列表循环-->
      <!-- <div v-for="(item,index) in company" @click.stop.prevent="turnTo(item.path)" v-if="!(index == 0 && userInfo.postType == 4)"
        :class="[{'m-top':index==0,
      'm-center':index> 0 && index < (personal.length),
        'm-bottom':index == (personal.length)},userInfo.postType == 4 && index == 1?'m-top':'']" :key="index">
        <img class="m-icon" :src="item.img">
        <div class="m-content">{{item.name}}</div>
        <img class="m-right" src="../../../assets/images/rent/my/enter.png">
      </div>
      <div class="m-list" @click.stop.prevent="turnTo(setting.path)">
        <img class="m-icon" :src="setting.img">
        <div class="m-content">{{setting.name}}</div>
        <img class="m-right" src="../../../assets/images/rent/my/enter.png">
      </div>
    </div> -->
  </yd-layout>
</template>
<script>
import fn from "../../../assets/js/product";
import qs from "qs";
import Vue from "vue";
import store from "@/store/index.js";
export default {
  data() {
    return {
      newMessage: {
        name: "最新消息",
        img: require("../../../assets/images/rent/my/newMessage.png"),
        path: "/latest",
        isManage: false
      },
      relationship: {
        name: "关系管理",
        img: require("../../../assets/images/rent/my/service_order.png"),
        isManage: false,
        path: "/relation/details"
      },
      report: {
        name: "管理处月报",
        img: require("../../../assets/images/rent/my/enterprse.png"),
        isManage: false,
        path: "/monthly"
      },
      Manager: {
        name: "管理员",
        img: require("../../../assets/images/rent/my/manager.png"),
        isManage: false,
        path: "/my/manager"
      },
      enterprise: {
        name: "企业服务",
        img: require("../../../assets/images/rent/my/enterprse.png"),
        isManage: false,
        path: "/enterprise"
      },
      setting: {
        name: "设置",
        img: require("../../../assets/images/rent/my/setting.png"),
        path: "/my/setting"
      },
      personal: [
        {
          name: "我的圈子",
          img: require("../../../assets/images/rent/my/mycircle.png"),
          isManage: false
        },
        {
          name: "我的资产",
          img: require("../../../assets/images/rent/my/my_money.png"),
          path: "/my/my_asset"
        },
        {
          name: "我的卡券",
          img: require("../../../assets/images/rent/my/mycard.png"),
          path: "/my/card/coupon"
        }
      ],
      rent: [
        {
          name: "企业财富",
          img: require("../../../assets/images/rent/my/enterprice_money.png"),
          path: "/my/my_asset#enterprise"
        },
        {
          name: "我的圈子",
          img: require("../../../assets/images/rent/my/mycircle.png"),
          path: "/my/circle"
        },
        {
          name: "我的资产",
          img: require("../../../assets/images/rent/my/my_money.png"),
          path: "/my/my_asset"
        },
        {
          name: "我的卡券",
          img: require("../../../assets/images/rent/my/mycard.png"),
          path: "/my/card/coupon"
        }
      ],
      company: [
        {
          name: "我的圈子",
          img: require("../../../assets/images/rent/my/mycircle.png"),
          path: "/my/circle"
        },
        {
          name: "我的资产",
          img: require("../../../assets/images/rent/my/my_money.png"),
          path: "/my/my_asset"
        },
        {
          name: "我的卡券",
          img: require("../../../assets/images/rent/my/mycard.png"),
          path: "/my/card/coupon"
        }
      ],
      owner: [
        {
          name: "我的资产",
          img: require("../../../assets/images/rent/my/my_money.png"),
          path: "/my/my_asset"
        },
        {
          name: "我的卡券",
          img: require("../../../assets/images/rent/my/mycard.png"),
          path: "/my/card/coupon"
        }
      ],
      business: [
        {
          name: "我的圈子",
          img: require("../../../assets/images/rent/my/mycircle.png"),
          path: "/my/circle"
        },
        {
          name: "我的资产",
          img: require("../../../assets/images/rent/my/my_money.png"),
          path: "/my/my_asset"
        },
        {
          name: "我的卡券",
          img: require("../../../assets/images/rent/my/mycard.png"),
          path: "/my/card/coupon"
        }
      ],
      show1: false,
      show3: true,
      signIn: true,
      count: "",
      colorArr: ["#1ed28c", "#0093d2", "#fab23e"], //绿色，蓝色，橙色
      mainColor: "",
      rParams: "",
      style_title: "",
      organInfo: "",
      userInfo: "",
      integral: {
        currentIntegral: 0,
        signInIntegral: 0,
        days: 0,
        msg: ""
      }
    };
  },
  methods: {
    hideIntegral() {
      this.show1 = false;
    },
    turnTo(url) {
      if (!this.userInfo.isEnabled) {
        this.$dialog.alert({ mes: "账号审核中，通过审核后才可体验完整功能" });
      } else {
        this.$router.push(url);
      }
    },
    /*获取账户信息*/
    getUserInfo() {
      var data = { userId: this.userId, token: this.getkey };
      this.xhr
        .post(`${this.subUrl.user}/user/getUserInfo`, qs.stringify(data))
        .then(res => {
          if (res.data.code == 1) {
            this.userInfo = JSON.parse(JSON.stringify(res.data.data.userInfo));
            this.organInfo = res.data.data.organInfo;
            localStorage.setItem(
              "userInfo",
              encodeURIComponent(JSON.stringify(res.data.data.userInfo))
            );
            this.$set(this.userInfo, "depName", res.data.data.userInfo.depName);
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        });
    },
    signSuccess() {
      this.xhr
        .post(`${this.subUrl.user}/user/signIn?token=` + this.getkey)
        .then(res => {
          // console.log(res)
          if (res.data.code == 1) {
            this.integral = res.data.data;
            this.userInfo.signIn = 1;
            this.show1 = true;
          }else{
            this.$dialog.toast({mes:res.data.msg})
          }
        });
    }
  },
  mounted() {
    this.rParams = this.$route.params;
    console.log(this.$route);
    this.getkey = fn.getIng();
    this.userInfo = null;
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    var mainColor = this.$color[this.userInfo.organType];
    this.mainColor = mainColor;
    localStorage.setItem("mainColor", mainColor);
    this.style_title = `background:${mainColor}`;
    console.log(this.userInfo);
    this.userId = this.userInfo.guid;
    this.getUserInfo();
    this.signIn = JSON.parse(
      decodeURIComponent(localStorage.getItem("signIn"))
    );
  }
};
</script>
<style scoped>
.back_icon > img {
  width: 100%;
  height: 100%;
}

.message {
  margin: 0.2rem 0.25rem 0.5rem;
}
.abc{
  position: relative;
  width:5.5rem;
  display: flex;
  flex-flow:column;
  justify-content: center;
  align-items: center;
  }
.back_icon {
  width: 5.5rem;
  position: absolute;
  top:-2.3rem;
}

.sign_popup_box {
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
}

.box {
  width: 4.5rem;
  height: 2.8rem;
  background: white;
  border-radius: 0.2rem;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}

.font30 {
  font-size: 0.3rem;
  color: #333;
  margin: 0.1rem 0;
}

.font80 {
  font-size: 0.8rem;
  color: #ffc80b;
}

.box > div:nth-child(2) {
  margin: 0.1rem 0 0.2rem;
}

.font24 {
  color: #999;
}

.font60 {
  font-size: 0.6rem;
  color: #fa697c;
  margin: 0.6rem 0 0.1rem;
}



.message > div {
  display: flex;
  align-items: center;
  height: 1rem;
  margin-top: -1px;
  padding: 0 0.32rem;
}

.message > div .m-icon {
  width: 0.52rem;
  height: 0.52rem;
}

.message > div .m-right {
  width: 0.32rem;
}

.message > div .m-content {
  flex: 1;
  padding: 0 0.2rem;
}

.message .m-center {
  background: url("../../../assets/images/rent/my/list_center.png") no-repeat
    left top;
  background-size: 100% 100%;
}

.message .m-top {
  background: url("../../../assets/images/rent/my/list_top.png") no-repeat left
    top;
  background-size: 100% 100%;
}

.message .m-bottom {
  background: url("../../../assets/images/rent/my/list_bottom.png") no-repeat
    left top;
  background-size: 100% 100%;
}

.message > .m-list {
  margin: 0.2rem 0;
  background: url("../../../assets/images/rent/my/list.png") no-repeat left top;
  background-size: 100% 100%;
}

/*消息结束*/

.layout_my {
  padding-bottom: 1rem;
}

.layout_my .blue_box {
  height: 4.6rem;
  background: url("../../../assets/images/rent/my/my_blue.png");
  background-size: 100% 100%;
}

.layout_my .blue > div > div {
  display: flex;
}

.layout_my .green {
  background: url("../../../assets/images/rent/my/my_green.png");
  background-size: 100% 100%;
}

.layout_my .orange {
  background: url("../../../assets/images/rent/my/my_orange.png");
  background-size: 100% 100%;
}

.layout_my .title {
  height: 100%;
  overflow: hidden;
  color: #fff;
}

.layout_my .title .t-title {
  margin-top: 0.4rem;
  height: 1rem;
  font-size: 0.32rem;
  padding: 0 0.32rem;
  vertical-align: middle;
  overflow: hidden;
}

.layout_my .title .t-title > .organName {
  width: 90%;
  float: left;
}

.layout_my .title .t-title > .t-scan_code {
  float: right;
}

.layout_my .title .t-title .t-scan_code img {
  width: 0.6rem;
  height: 0.6rem;
}

.layout_my .title .center_info {
  display: flex;
  justify-content: space-between;
  padding: 0 0.32rem;
  margin-bottom: 0.4rem;
}

.layout_my .title .center_info .my_info {
  flex: 1;
  padding: 0.1rem 0.2rem;
}

.layout_my .title .center_info .my_info > div {
  margin-bottom: 0.07rem;
  font-size: 0.24rem;
}

.layout_my .title .center_info .my_info .m-name {
  font-size: 0.36rem;
}

.layout_my .title .center_info .logo {
  width: 1.38rem;
  height: 1.38rem;

  overflow: hidden;
  background: url("../../../assets/images/rent/my/default_header_circle.png")
    left top no-repeat cover;
  vertical-align: middle;
  padding: 0.1rem;
}

.layout_my .title .center_info .code {
  align-self: center;
  margin-right: 0.45rem;
}

.layout_my .title .center_info .code img {
  width: 0.6rem;
  height: 0.6rem;
}

.layout_my .title .center_info .logo img {
  vertical-align: middle;
  border-radius: 50%;
  width: 100%;
  height: 100%;
}

/*签到*/

.layout_my .title .bottom {
  padding: 0 0.32rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.layout_my .title .bottom1 {
  justify-content: flex-end;
}

.layout_my .title .bottom > div {
  height: 0.6rem;
  background: #fff;
  display: flex;
  align-items: center;
  min-width: 1.8rem;
  padding: 0 0.2rem;
  border-radius: 0.1rem;
  background: #fff;
}

.layout_my .title .bottom > div img {
  margin-right: 0.1rem;
  width: 0.5rem;
}

.layout_my .title .bottom .signBox {
  float: right;
  background: #fff;
  justify-content: center;
}

/*其它时覆盖*/

/*最新消息*/

.new_message {
  display: flex;
  margin: -0.4rem 0.25rem 0;
  padding: 0.4rem;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-radius: 0.2rem;
}

.new_message > div {
  text-align: center;
}

.new_message > div > img {
  margin-bottom: 0.1rem;
  width: 1rem;
  height: 1rem;
}
</style>
