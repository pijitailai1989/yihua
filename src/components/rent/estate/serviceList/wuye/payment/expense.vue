<template>
  <yd-layout class="layout_my">
    <yd-navbar class="header" slot='navbar' v-title="titleT" v-show="!userAgent.isWX" :title="titleT" color="#fff"
               :bgcolor="mainColor"
               height=".88rem">
      <span @click="back" class="spanLeft" slot="left">
        <span>
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </span>
      </span>

    </yd-navbar>

    <div class="organInfos" v-if="propertyServicePay.createDate">
      <div class="name">
        <p class="font32 font600">{{propertyServicePay.type==1?propertyServicePay.organResult.organName:propertyServicePay.userName}}</p>
        <!-- state (integer, optional): 状态（0：未缴，1：租户公司确定缴费，2：客服确定已缴，3：催缴） , -->

        <span class="state0 state" v-if='propertyServicePay.state==0'>未缴</span>
        <span class="state1 state" v-if='propertyServicePay.state==1'>已缴</span>
        <span class="state2 state" v-if='propertyServicePay.state==2'>催缴</span>
        <!-- <span class="font22" :style="{border:'1px solid '+mainColor,color:mainColor,padding:'.03rem .1rem'}">{{propertyServicePay.state}}</span> -->
      </div>
      <div class="info" v-if="show">
        <ul>
          <li>
            <span>经办人：</span>
            <p>{{propertyServicePay.userName}}</p>
          </li>
        </ul>
        <p @click="toggle" :style="{color:mainColor}">展开</p>
      </div>

      <div class="info" v-else>
        <ul>
          <li>
            <span>地址：</span>
            <p>{{propertyServicePay.organResult.ridName}}{{propertyServicePay.organResult.unitName}}</p>
          </li>
          <li>
            <span>费用时间：</span>
            <p>{{propertyServicePay.startPayDate}} - {{propertyServicePay.endPayDate}}</p>
          </li>
          <li>
            <span>经办人：</span>
            <p>{{propertyServicePay.userName}}</p>
          </li>
          <li>
            <span>信息日期：</span>
            <p>{{propertyServicePay.createDate}}</p>
          </li>
          <li>
            <span>单号：</span>
            <p>{{propertyServicePay.guid}}</p>
          </li>
        </ul>
        <p @click="toggle" :style="{color:mainColor}">隐藏</p>
      </div>
    </div>

    <!-- <div class="tables" v-show="p">
      <ul class="font28 font600">
        <li>项目名称</li>
        <li>用量计量</li>
        <li>计费单价</li>
        <li>本月费用</li>
        <li>往月欠缴</li>
      </ul>
      <ul class="font26 a" v-for="(item,index) in payProject" :key="index">
        <li>{{item.projectName}}</li>
        <li>{{item.consumption}}</li>
        <li>{{item.chargeUnit}}</li>
        <li>{{item.thisMonthMoney}}</li>
        <li>{{item.lastMonthMoney}}</li>
      </ul>
    </div> -->
    <!-- 物业费 -->
    <div class="tableBox" v-if="propertyServicePay && propertyServicePay.type == 1">
      <div class="table">
        <!-- 标题 -->
        <div class="table_title">
          <span>项目名称</span>
          <span>用量计量</span>
          <span>计费单价</span>
          <span>本月费用</span>
          <span>往月欠缴</span>
          <span>滞纳金</span>
          <span>应交合计</span>
          <span>备注</span>
        </div>
        <div class="table_content" >
          <div class="colomn" v-for='item in payProject'>
            <span>{{item.projectName}}</span>
            <span>{{item.consumption}}</span>
            <span>{{item.chargeStandard}}</span>
            <span>{{item.thisMonthMoney}}</span>
            <span>{{item.lastMonthMoney}}</span>
            <span>{{item.lateFee}}</span>
            <span>{{item.totalMoney}}</span>
            <span>{{item.remarks}}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="tabless"  v-if="propertyServicePay && propertyServicePay.type == 2">
      <ul class="font28 font600">
        <li class="b">项目名称</li>
        <li>计费标准</li>
        <li>备注</li>
        <li>小计(元)</li>
      </ul>
      <ul class="font26 a" v-for="(item,index) in payProject" :key="index">
        <li class="b">{{item.projectName}}</li>
        <li>{{item.thisMonthMoney}}</li>
        <li>{{item.remarks}}</li>
        <li>{{item.totalMoney}}</li>
      </ul>

    </div>

    <div class="totals">
      <ul>
        <li class="font26">
          <p>合计</p>
          <span>{{propertyServicePay.sumMoney}}</span>
        </li>
        <li class="font26">
          <p>大写金额</p>
          <span>{{propertyServicePay.sumMoneyStr}}</span>
        </li>
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
      <div class="foCo9">{{propertyServicePay.des}}</div>
    </div>
    <!--<div class="buttons">-->
      <!--<button :style="{background:mainColor}" @click="affirm">确定</button>-->
    <!--</div>-->

    <div class="flex-row jusCenter h9 bgwhite bt foCo9" slot='bottom'>
      <div class="flex1 flex-row jusCenter br" @click='remind' v-if='userInfo.organType==3'>
        <img src="../../../../../../assets/images/rent/estate/cuijiao.png" class="mr1" style="width:.5rem;height:.5rem;"
             alt="">
        <span>催缴</span>
      </div>
      <div class="flex1 flex-row jusCenter" @click='compelete'>
        <img style="width:.4rem;height:.4rem;" class="mr2"
             src="../../../../../../assets/images/rent/estate/select_active.png" alt="">
        <span>已完成</span>
      </div>
    </div>
  </yd-layout>
</template>
<script>
  import Vue from 'vue';
  import fn from '@/assets/js/product'
  import qs from 'qs'

  export default {
    data() {
      return {
        mainColor: "",
        titleT: '',
        userInfo:{},
        show: true,
        s: true,
        p: true,
        getkey: '',
        payAccount: {

        },
        propertyServicePay: {

        },
        payProject: [],
        btn: false,
      }
    },
    methods: {
      // 已完成
      compelete() {
        this.$dialog.confirm({
          title: "",
          mes: "是否确定已完成",
          opts: () => {
            var data = {
              token: this.$getkey(),
              payId: this.propertyServicePay.guid,
            }
            this.$ajax(`${this.subUrl.activity}/pay/affirm`, data, res => {
              this.$dialog.toast({mes: "已确定完成", icon: "success"})
              this.paydetail();
            }, this)
          }
        })
      },
      // 催缴
      remind() {
        console.log();
        this.$dialog.confirm({
          title: "",
          mes: "是否催缴",
          opts: () => {
            var data = {
              token: this.$getkey(),
              payId: this.propertyServicePay.guid,
            }
            this.$ajax(`${this.subUrl.activity}/pay/callPay`, data, res => {
              this.$dialog.toast({mes: "催缴成功", icon: "success"});
              this.paydetail();
            }, this)
          }
        })
      },
      // 确定缴费成功

      toggle() {
        this.show = !this.show;
      },
      turnTo(url) {
        this.$router.push(url)
      },
      back() {
        this.$router.go(-1)
      },
      // 获取邀请信息列表
      paydetail() {
        var data = {userId: this.userId, token: this.getkey, payId: this.$route.params.guid};
        this.xhr.post(`${this.subUrl.activity}/pay/detail`, qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
            console.log(res.data.data)
            if (res.data.data.payAccount) {
              let arr = res.data.data.payAccount.payeeAccount.split('');
              arr.splice(4, 0, ' ')
              arr.splice(9, 0, ' ')
              arr.splice(14, 0, ' ')
              let str = arr.join('')
              res.data.data.payAccount.payeeAccount = str;
              this.payAccount = res.data.data.payAccount;
              res.data.data.propertyServicePay.createDate = res.data.data.propertyServicePay.createDate.split(' ')[0]
              res.data.data.propertyServicePay.endPayDate = res.data.data.propertyServicePay.endPayDate.split(' ')[0]
              res.data.data.propertyServicePay.startPayDate = res.data.data.propertyServicePay.startPayDate.split(' ')[0]
            }

            this.propertyServicePay = res.data.data.propertyServicePay;
            this.payProject = res.data.data.payProject;
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      },
      affirm() {
        var data = {userId: this.userId, token: this.getkey, payId: this.$route.params.guid};
        this.xhr.post(`${this.subUrl.activity}/pay/affirm`, qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
            this.propertyServicePay.state = '确定缴费';
            this.btn = false;
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
      }


    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = this.$color[this.userInfo.organType]
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();

      this.paydetail();

      if (this.$route.hash == '#1') {
        this.titleT = '物业缴费单'
        this.s = false;
      } else if (this.$route.hash == '#2') {
        this.titleT = '专项缴费单'
        this.p = false;
      }
    }
  }
</script>
<style scoped>
  .state {
    border-radius: .05rem;
    border: 1px solid #ddd;
    padding: .03rem .1rem;
    height: .5rem;
    box-sizing: border-box;
  }

  .state0 {
    color: #fab23e;
    border-color: #fab23e;
  }

  .state1 {
    color: #3eb7e6;
    border-color: #3eb7e6;
  }

  .state2 {
    color: #fa697c;
    border-color: #fa697c;
  }

  .tableBox {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    white-space: nowrap;
    margin-top: .4rem;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    background: #fff;
    min-height: 3rem;
  }

  .table {
    width: 12.6rem;
    text-align: center;
  }

  .table_title {
    height: .8rem;
    display: flex;
    align-items: center;
  }

  .colomn {
    height: .6rem;
    display: flex;
    align-items: center;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    margin-top: -1px;
  }

  .table_title span {
    display: block;
    width: 1.8rem;
  }

  .table_content span {
    display: block;
    width: 1.8rem;
    max-width: 1.8rem;
    text-overflow: ellipsis;
    overflow: hidden;
  }

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

  .organInfos {
    width: 100%;
  }

  .name {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: .3rem .3rem;
    background: white;
    border-bottom: 1px solid #F3F6F5;
  }

  /* .name>span {
    border-radius: .05rem;
    border: 1px solid #2D88D4;
    color: #2D88D4;
    padding: .05rem .1rem;
  } */

  .info {
    width: 100%;
    background: white;
    padding: .1rem .3rem;
    font-size: .24rem;
    position: relative;
  }

  .info ul li {
    display: flex;
    height: .4rem;
  }

  .info ul li > span {
    width: 1.3rem;
    text-align: right;
    color: #9D9E9D;
  }

  .info ul li > p {
    flex: 1;
    margin-left: .2rem;
  }

  .info > p {
    font-size: .28rem;
    color: #2D88D4;
    position: absolute;
    bottom: .15rem;
    right: .3rem
  }

  .tables {
    width: 100%;
    margin-top: .3rem;
    background: white;
  }

  .tables ul {
    display: flex;
    width: 100%;
    height: .8rem;
    justify-content: space-around;
    align-items: center;
  }

  .tables ul li {
    height: .8rem;
    width: 25%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #E8E8E8;
  }

  .tables ul:nth-child(1) {
    background: #FAFAFA;
  }

  .a {
    color: #8D8D8D;
  }

  .tabless {
    width: 100%;
    margin-top: .3rem;
    background: white;
  }

  .tabless ul {
    display: flex;
    width: 100%;
    height: .8rem;
    align-items: center;
    padding: 0 .2rem;
  }

  .tabless ul:nth-child(1) {
    background: #FAFAFA;
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
    margin-top: .2rem;
    background: white;
  }

  .totals ul {
    width: 100%;
  }

  .totals ul li {
    width: 100%;
    height: .8rem;
    padding: 0 .3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #E8E8E8;
  }

  .infoText {
    margin-top: .2rem;
    background: white;
    padding: .2rem .2rem;
  }

  .infoText ul {
    width: 100%;
  }

  .infoText ul li {
    padding: .1rem .25rem;
  }

  .text {
    margin-top: .2rem;
    background: white;
    padding: .2rem .2rem;
  }

  .text ul {
    margin-top: .1rem;
  }

  .buttons {
    width: 100%;
    padding: 0 .3rem;
    height: .9rem;
    margin: .6rem 0;
  }

  .buttons button {
    width: 100%;
    height: 100%;
    border: none;
    color: white;
    font-size: .32rem;
    font-weight: 600;
    border-radius: .1rem;
  }
</style>
