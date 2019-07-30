<template>
  <yd-layout class="layout_my">
      <yd-navbar class="header" v-title="titleT" slot="navbar" v-show="!userAgent.isWX" :title="titleT" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span @click="back" class="spanLeft" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
      </yd-navbar>

    <div class="organInfos">
      <div class="name">
        <p class="font32 font600">{{organResult.organName}}</p>
        <!--<span class="font22" :style="{border:'1px solid '+mainColor,color:mainColor,padding:'.03rem .1rem'}">{{propertyServicePay.state}}</span>-->

        <span class="state0 state" v-if='propertyServicePay.state==0'>未缴</span>
        <span class="state1 state" v-if='propertyServicePay.state==1'>已缴</span>
        <span class="state2 state" v-if='propertyServicePay.state==2'>催缴</span>
      </div>
      <div class="info" v-if="show">
         <ul>
           <li><span>经办人：</span><p>{{propertyServicePay.userName}}</p></li>
         </ul>
         <p @click="toggle" :style="{color:mainColor}">展开</p>
      </div>

      <div class="info" v-else>
         <ul>
           <li><span>地址：</span><p>{{organResult.ridName}}{{organResult.unitName}}</p></li>
           <li><span>单号：</span><p>{{propertyServicePay.guid}}</p></li>
           <li><span>费用时间：</span><p>{{propertyServicePay.startPayDate}} - {{propertyServicePay.endPayDate}}</p></li>
           <li><span>经办人：</span><p>{{propertyServicePay.userName}}</p></li>
           <li><span>信息日期：</span><p>{{propertyServicePay.createDate}}</p></li>
         </ul>
         <p @click="toggle" :style="{color:mainColor}">隐藏</p>
      </div>
    </div>

    <div class="tables" v-show="p">
           <ul class="font28 font600">
             <li>项目名称</li>
             <li>用量计量</li>
             <li>计费单价</li>
             <li>本月费用</li>
             <li>往月欠缴</li>
           </ul>
           <ul class="font26 a" v-for="(item,index) in payProject" :key="index">
             <li class="textHidden" style="width:2rem;">{{item.projectName}}</li>
             <li>{{item.consumption}}</li>
             <li>{{item.chargeUnit}}</li>
             <li>{{item.thisMonthMoney}}</li>
             <li>{{item.lastMonthMoney}}</li>
           </ul>
    </div>

    <div class="tabless" v-show="s">
           <ul class="font28 font600">
             <li class="b">项目名称</li>
             <li>计费标准</li>
             <li>备注</li>
             <li>小计(元)</li>
           </ul>
           <ul class="font26 a" v-for="(item,index) in payProject" :key="index">
             <li class="b textHidden">{{item.projectName}}</li>
             <li>{{item.thisMonthMoney}}</li>
             <li>{{item.remarks}}</li>
             <li>{{item.totalMoney}}</li>
           </ul>

    </div>

    <div class="totals">
      <ul>
        <li class="font26"><p>合计</p><span>{{propertyServicePay.sumMoney}}</span></li>
        <li class="font26"><p>大写金额</p><span>{{propertyServicePay.sumMoneyStr}}</span></li>
      </ul>
    </div>

    <div class="infoText" v-if="payAccount.payee">
         <p class="font30">缴费账户信息</p>
         <ul class="font28">
             <li>收款人：{{payAccount.payee}}</li>
             <li>开户行：{{payAccount.payeeAccountBank}}</li>
             <li>帐&nbsp;&nbsp;&nbsp;号：{{payAccount.payeeAccount}}</li>
         </ul>
    </div>
    <div class="text" v-show="p">
         <p class="font30">备注</p>
         <ul class="font24" style="line-height:.4rem;">
           <li>{{propertyServicePay.des}}</li>
         </ul>
    </div>
    <div class="buttons" v-if="propertyServicePay.state!=1">
        <button :style="{background:mainColor}"  @click="affirm">确定</button>
    </div>


  </yd-layout>
</template>
<script>
import Vue from "vue";
import fn from "@/assets/js/product";
import qs from "qs";

export default {
  data() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.mainColor = this.$color[this.userInfo.organType];
    this.userId = this.userInfo.guid;
    this.getkey = fn.getIng();
    return {
      titleT: "",
      show: true,
      s: true,
      p: true,
      getkey: "",
      payAccount: {},
      propertyServicePay: {},
      payProject: [],
      btn: false,
      organResult: {}
    };
  },
  methods: {
    toggle() {
      this.show = !this.show;
    },
    turnTo(url) {
      this.$router.push(url);
    },
    back() {
      this.$router.go(-1);
    },
    // 获取邀请信息列表
    paydetail() {
      var data = {
        userId: this.userId,
        token: this.$getkey(),
        payId: this.$route.params.guid
      };
      this.xhr
        .post(`${this.subUrl.activity}/pay/detail`, qs.stringify(data))
        .then(res => {
          if (res.data.code == 1) {
            console.log(res.data.data);

            if(res.data.data.payAccount){
              let arr = res.data.data.payAccount.payeeAccount.split("");
              arr.splice(4, 0, " ");
              arr.splice(9, 0, " ");
              arr.splice(14, 0, " ");
              let str = arr.join("");
              res.data.data.payAccount.payeeAccount = str;
              this.payAccount = res.data.data.payAccount;
              // if (res.data.data.propertyServicePay.state == 0) {
              //   res.data.data.propertyServicePay.state = "未缴";
              //   this.btn = true;
              // } else if (res.data.data.propertyServicePay.state == 1) {
              //   res.data.data.propertyServicePay.state = "已缴";
              // } else if (res.data.data.propertyServicePay.state == 2) {
              //   res.data.data.propertyServicePay.state = "催缴";
              // }
            }

            res.data.data.propertyServicePay.createDate = res.data.data.propertyServicePay.createDate.split(
              " "
            )[0];
            res.data.data.propertyServicePay.endPayDate = res.data.data.propertyServicePay.endPayDate.split(
              " "
            )[0];
            res.data.data.propertyServicePay.startPayDate = res.data.data.propertyServicePay.startPayDate.split(
              " "
            )[0];
            this.propertyServicePay = res.data.data.propertyServicePay;
            this.organResult = this.propertyServicePay.organResult;
            this.payProject = res.data.data.payProject;
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        });
    },
    affirm() {
      var data = {
        userId: this.userId,
        token: this.$getkey(),
        payId: this.$route.params.guid
      };
      this.xhr
        .post(`${this.subUrl.activity}/pay/affirm`, qs.stringify(data))
        .then(res => {
          if (res.data.code == 1) {
            this.paydetail();
            this.$dialog.toast({mes:'已确定缴费',icon:"success"})
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
    this.paydetail();

    if (this.$route.hash == "#1") {
      this.titleT = "物业缴费单";
      this.s = false;
    } else if (this.$route.hash == "#2") {
      this.titleT = "专项缴费单";
      this.p = false;
    }
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
}
.name {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0.3rem;
  background: white;
  border-bottom: 1px solid #f3f6f5;
}
.name > span {
  border-radius: 0.05rem;
  /*border: 1px solid #2d88d4;*/
  /*color: #2d88d4;*/
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
  height: 0.4rem;
}
.info ul li > span {
  width: 1.3rem;
  text-align: right;
  color: #9d9e9d;
}
.info ul li > p {
  flex: 1;
  margin-left: 0.2rem;
}
.info > p {
  font-size: 0.28rem;
  color: #2d88d4;
  position: absolute;
  bottom: 0.15rem;
  right: 0.3rem;
}

.tables {
  width: 100%;
  margin-top: 0.3rem;
  background: white;
}
.tables ul {
  display: flex;
  width: 100%;
  height: 0.8rem;
  justify-content: space-around;
  align-items: center;
}
.tables ul li {
  height: 0.8rem;
  width: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #e8e8e8;
}
.tables ul:nth-child(1) {
  background: #fafafa;
}
.a {
  color: #8d8d8d;
}

.tabless {
  width: 100%;
  margin-top: 0.3rem;
  background: white;
}
.tabless ul {
  display: flex;
  width: 100%;
  height: 0.8rem;
  align-items: center;
  padding: 0 0.2rem;
}
.tabless ul:nth-child(1) {
  background: #fafafa;
}
.tabless ul li:nth-child(1) {
  width: 3rem;
}
.tabless ul li:nth-child(2) {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.tabless ul li:nth-child(3) {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.tabless ul li:nth-child(4) {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.totals {
  width: 100%;
  margin-top: 0.2rem;
  background: white;
}
.totals ul {
  width: 100%;
}
.totals ul li {
  width: 100%;
  height: 0.8rem;
  padding: 0 0.3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e8e8e8;
}

.infoText {
  margin-top: 0.2rem;
  background: white;
  padding: 0.2rem 0.2rem;
}
.infoText ul {
  width: 100%;
}
.infoText ul li {
  padding: 0.1rem 0.25rem;
}

.text {
  margin-top: 0.2rem;
  background: white;
  padding: 0.2rem 0.2rem;
}
.text ul {
  margin-top: 0.1rem;
}

.buttons {
  width: 100%;
  padding: 0 0.3rem;
  height: 0.9rem;
  margin: 0.6rem 0;
}
.buttons button {
  width: 100%;
  height: 100%;
  border: none;
  color: white;
  font-size: 0.32rem;
  font-weight: 600;
  border-radius: 0.1rem;
}
</style>
