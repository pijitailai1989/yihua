<template>
  <yd-layout class="layout_my">
    <yd-navbar class="header" slot="navbar" v-show="!userAgent.isWX" title="缴费管理" color="#fff" :bgcolor="mainColor"
               height=".88rem">
      <span @click="back" class="addClickArea" slot="left">
        <span>
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </span>
      </span>
      <!-- <yd-icon custom @click.native='$router.push("/estate/serviceList/payment/moneyset")' slot='right' color='#fff' class="mr3"
        size='.5rem' name='setting'></yd-icon>
      <div slot="right" @click="show2 = true" class="edit" style="color: #fff;font-size:.6rem;">+</div> -->
    </yd-navbar>
    <div class="flex-row h9 bgwhite mylabel" slot="top">
      <div :class="[{active:tabindex==0},'flex1','jusCenter']"
           :style="tabindex==0?`color:${mainColor};border-color:${mainColor}`:``" @click='callback(0)'><span class="br"
                                                                                                             style="width:100%">起止日期</span>
      </div>
      <div :class="[{active:tabindex==1},'flex1','jusCenter']"
           :style="tabindex==1?`color:${mainColor};border-color:${mainColor}`:``" @click='callback(1)'><span class="br"
                                                                                                             style="width:100%">全部类型</span>
      </div>
      <div :class="[{active:tabindex==2},'flex1','jusCenter']"
           :style="tabindex==2?`color:${mainColor};border-color:${mainColor}`:``" @click='callback(2)'><span class="br"
                                                                                                             style="width:100%">所有状态</span>
      </div>
    </div>
    <!-- <yd-tab class="tabGroup" style="height:.84rem;" :active-color='mainColor' :callback="callback" slot="top">
      <yd-tab-panel  label="起止日期" @click.native='callback(0)' tabindex="0">
      </yd-tab-panel>
      <yd-tab-panel :active="true" label="全部类型"  @click.native='callback(1)' tabindex="1"></yd-tab-panel>
      <yd-tab-panel label="所有状态"  @click.native='callback(2)' tabindex="2"></yd-tab-panel>
    </yd-tab> -->
    <!-- 筛选 -->
    <div slot="top" v-show="filter" class="filter foCo9 bgwhite"
         style="position:absolute;top:1.75rem;left:0;right:0;z-index:2">
      <!-- 筛选时间 -->
      <div class="filterChild" v-show='tabindex == 0&&filter'>
        <div class="flex-row center h7">开始时间：</div>
        <div class="flex-row center h7">
          <yd-datetime type="date" class="border pd3 flex1" v-model="screen.startTime" slot="right"></yd-datetime>
        </div>
        <div class="flex-row center h7">结束时间：</div>
        <div class="flex-row center h7">
          <yd-datetime type="date" class="border pd3 flex1" v-model="screen.endTime" slot="right"></yd-datetime>
        </div>
      </div>
      <!-- 筛选类型 -->
      <div class="filterChild" v-show='tabindex == 1&&filter'>
        <div class="flex-row center h9" @click='chooseType(index)' v-for='item,index in chooseList'>
          <span>{{item.name}}</span>
          <yd-icon name='selected' size='.5rem' :color='mainColor' v-show='item.selected' custom></yd-icon>
        </div>
      </div>
      <!-- 筛选状态 -->
      <div class="filterChild" v-show='tabindex == 2&&filter'>
        <div class="flex-row center h9" @click='chooseStatus(index)' v-for='item,index in statusList'>
          <span>{{item.name}}</span>
          <yd-icon name='selected' size='.5rem' :color='mainColor' v-show='item.selected' custom></yd-icon>
        </div>
      </div>
      <!-- 确定 -->
      <div class="flex-row h8 bt bb font32">
        <div class="flex1 jusCenter br" @click='cancel'>取消</div>
        <div class="flex1 jusCenter" @click='confirm' :style="{color:mainColor}">确定</div>
      </div>
    </div>
    <div class="mask" v-if='filter' @click="cancelFilter" style="top:1.88rem;z-index:1" slot="bottom"></div>
    <yd-infinitescroll :callback="loadList" ref="infinitescrollDemo">
      <!-- <div class="contentList" @scroll="scrollHandler" ref="listDom"> -->
      <div slot="list">
        <div class="content" v-for="(item,index) in contentList" :key="index"
             @click="turnTo('/estate/serviceList/payment/expense/'+item.guid+'#'+item.type)">
          <div class="top">
            <div class="flex-row">
              <img src="../../../../../assets/images/rent/estate/leibie.png" class="mr1"
                   style="width:.5rem;height:.4rem" alt=""> {{item.name}}
            </div>
            <!-- state (integer, optional): 状态（0：未缴，1：租户公司确定缴费，2：客服确定已缴，3：催缴） , -->
            <span class="state2 state" v-if='item.state==0'>未缴</span>
            <span class="state1 state" v-if='item.state==1'>已缴</span>
            <span class="state2 state" v-if='item.state==2'>催缴</span>
          </div>
          <div class="bottom">
            <p>
              <span style="width:5rem" class="textHidden" v-if="item.organResult">{{item.organResult.organName}} {{item.name}}</span>
              <a style="width:3rem" class="textHidden" v-if="item.organResult">{{item.organResult.ridName}}{{item.organResult.unitName}}
                <span>{{item.organResult.organName}}</span>
              </a>
            </p>
            <span>
            <p>
              <i>
                <img src="../../../../../assets/images/rent/estate/date.png" alt="">
              </i>{{item.createDate}}</p>
          </span>
          </div>
        </div>

      </div>
      <span slot="doneTip">啦啦啦，啦啦啦，没有数据啦~~</span>
    </yd-infinitescroll>


    <yd-actionsheet slot="bottom" :items="myItems2" v-model="show2"></yd-actionsheet>
  </yd-layout>

</template>
<script>
  import Vue from "vue";
  import fn from "@/assets/js/product";
  import qs from "qs";
  import store from "@/store";
  import {DateTime} from "vue-ydui/dist/lib.rem/datetime";
  import {Tab, TabPanel} from "vue-ydui/dist/lib.rem/tab";

  Vue.component(Tab.name, Tab);
  Vue.component(TabPanel.name, TabPanel);
  Vue.component(DateTime.name, DateTime);
  import {ActionSheet} from "vue-ydui/dist/lib.rem/actionsheet";
  /* 使用px：import {ActionSheet} from 'vue-ydui/dist/lib.px/actionsheet'; */

  Vue.component(ActionSheet.name, ActionSheet);
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
        filter: false,
        chooseList: [
          {
            name: "物业费",
            value: 1,
            selected: true
          },
          {
            name: "专项费",
            value: 2
          }
        ],
        statusList: [
          {
            name: "未缴",
            value: 1,
            selected: true
          },
          {
            name: "已缴",
            value: 2
          },
          {
            name: "催缴",
            value: 3
          }
        ],
        currentIndex: 1,
        serviceList: [
          {
            name: "缴费",
            img: "../../../../assets/images/rent/estate/search.png",
            path: "/estate/serviceList/wuye/payment"
          }
        ],
        show2: false,
        myItems2: [
          {
            label: "物业缴费单",
            callback: () => {
              this.$router.push("/estate/serviceList/wuye/newPayment/1");
            }
          },
          {
            label: "专项缴费单",
            callback: () => {
              this.$router.push("/estate/serviceList/wuye/newPayment/2");
            }
          }
        ],
        myColor: ["#fab23e", "#3eb7e6", "#3eb7e6", "#fa697c"],
        contentList: [],
        show: false,
        show1: false,
        types: [{id: 1, name: "物业费"}, {id: 2, name: "专项费"}],
        screen: {
          startTime: this.$addDay(this.$today(), -30),
          endTime: this.$addDay(this.$today(), 1),
          content: "",
          type: null
        },
        pageNo: 1,
        pageSize: 5,
        pageCount: null,
        keyword: "",
        tabindex: -1,
        currentStatus: -1,
        currentIndex: -1
      };
    },
    methods: {
      // 催缴
      reminder(i, val) {
        console.log(i, val);
        this.$ajax(`${this.subUrl.activity}`);
      },
      cancelFilter() {
        this.tabindex = -1;
        this.filter = false;
        console.log(this.tabIndex, 11111)
      },
      chooseType(e) {
        for (var i in this.chooseList) {
          if (e == i) {
            this.$set(this.chooseList[i], "selected", true);
          } else {
            this.$set(this.chooseList[i], "selected", false);
          }
        }
        console.log(this.chooseList);
        this.currentIndex = e;
      },
      chooseStatus(e) {
        for (var i in this.statusList) {
          if (e == i) {
            this.$set(this.statusList[i], "selected", true);
          } else {
            this.$set(this.statusList[i], "selected", false);
          }
        }
        console.log(this.statusList);
        this.currentStatus = e;
      },
      //点击筛选
      callback(e) {
        console.log(e);
        this.filter = true;
        this.tabindex = e;
      },
      scrollHandler() {
        // if (store.loading || this.pageNo > this.pageCount) {
        //   return;
        // }
        // let listDom = this.$refs.listDom;
        // if (
        //   listDom.scrollHeight - listDom.scrollTop - listDom.clientHeight <
        //   100
        // ) {
        //   this.payList();
        // }
      },
      loadList() {
        this.payList();
      },
      toggle1(index) {
        this.screen.type = this.types[index].id;
      },
      toggle() {
        this.show1 = !this.show1;
      },
      turnTo(url) {
        this.$router.push(url);
      },
      back() {
        history.back();
      },
      filterSccess() {
        this.pageCount = null;
        this.pageNo = 1;
        this.payList();
      },
      // 获取信息列表
      confirm() {
        console.log(this.currentIndex, this.currentStatus);
        this.$refs.infinitescrollDemo.$emit("ydui.infinitescroll.reInit");
        this.contentList = [];
        this.pageNo = 1;
        this.payList();
        this.filter = false;
        this.tabindex = -1;
      },
      cancel() {
        this.filter = false;
        this.tabindex = -1;
      },
      payList() {
        var data = {
          userId: this.userId,
          token: this.getkey,
          startTime: this.screen.startTime + " 00:00:00",
          entTime: this.screen.endTime + " 23:59:59",
          pageNo: this.pageNo,
          pageSize: this.pageSize
        };
        if (this.currentIndex * 1 > -1) {
          data.type = this.chooseList[this.currentIndex].value;
        }
        if (this.currentStatus * 1 > -1) {
          data.state = this.statusList[this.currentStatus].value - 1;
        }
        this.xhr
          .post(`${this.subUrl.activity}/pay/payList`, qs.stringify(data))
          .then(res => {
            if (res.data.code == 1) {
              res.data.data.list.forEach(element => {
                if (element.type == 1) {
                  element.name = "物业费";
                } else {
                  element.name = "专项费";
                }
                element.createDate = element.createDate.split(" ")[0];
              });
              this.pageCount = res.data.data.pageCount;
              if (this.pageCount > this.pageNo) {
                this.$refs.infinitescrollDemo.$emit(
                  "ydui.infinitescroll.finishLoad"
                );
              } else {
                this.$refs.infinitescrollDemo.$emit(
                  "ydui.infinitescroll.loadedDone"
                );
              }
              this.contentList = this.contentList.concat(res.data.data.list);
              this.pageNo++;
              this.show1 = false;
            } else if (res.data.code == "-902") {
              //-902
              /*重新登录*/
              fn.re_login(this);
            } else {
              this.$dialog.toast({mes: res.data.msg});
            }
          });
      }
    },
    mounted() {
      this.payList();
    }
  };
  import "@/assets/css/wuye.css";
</script>
<style scoped>
  .mylabel > .flex1 {
    margin-bottom: 2px;
    border-bottom: 2px solid #fff;
  }

  .active.flex1 {
    border-bottom: 2px solid rgb(30, 130, 210);
    color: rgb(30, 130, 210);
  }

  .state {
    border-radius: 0.05rem;
    border: 1px solid #ddd;
    padding: 0.03rem 0.1rem;
    line-height: 0.5rem;
    height: 0.5rem;
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

  .filterChild {
    padding: 0 1rem 0.45rem;
  }

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

  .search {
    position: relative;
    width: 100%;
    height: 0.85rem;
    background: white;
    display: flex;
    flex-flow: row;
    padding: 0.15rem 0.3rem;
    border-bottom: 1px solid #e8e8e8;
  }

  .search > div:nth-child(1) {
    flex: 1;
    background: #ebebed;
    border-radius: 0.6rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .search > div:nth-child(1) > i {
    width: 0.35rem;
    height: 0.35rem;
    margin-right: 0.1rem;
  }

  .search > div:nth-child(1) > i > img {
    width: 100%;
    height: 100%;
  }

  .search > div:nth-child(1) > span {
    width: 2.4rem;
  }

  .search > div:nth-child(1) > span > input {
    width: 100%;
    font-size: 0.24rem;
    color: #a2a1a6;
    border: none;
  }

  .search > div:nth-child(2) {
    width: 1.6rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .screen {
    width: 100%;
    position: absolute;
    height: calc(100vh - 0.85rem);
    background: rgba(0, 0, 0, 0.3);
    z-index: 999;
    left: 0;
  }

  .screen ul {
    background: #f6f6f6;
  }

  .screen ul li {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
  }

  .screen ul li:nth-child(1) {
    width: 100%;
    padding: 0.1rem 0.3rem;
  }

  .screen ul li:nth-child(2) {
    width: 100%;
    padding: 0.1rem 0.3rem;
    justify-content: center;
  }

  .screen ul li:nth-child(2) > span {
    background: white;
    width: 3rem;
    height: 0.7rem;
    border: 1px solid #e9e9e9;
    display: flex;
    align-items: center;
  }

  .screen ul li:nth-child(2) > i {
    margin: 0 0.3rem;
  }

  .screen ul li:nth-child(2) > span > input {
    width: 3rem;
    height: 0.7rem;
    border: none;
  }

  .screen ul li:nth-child(3) {
    width: 100%;
    padding: 0.1rem 0.3rem;
  }

  .screen ul li:nth-child(4) {
    width: 100%;
    padding: 0.1rem 0.3rem;
    justify-content: space-between;
  }

  .screen ul li:nth-child(4) > a {
    background: white;
    width: 29%;
    height: 0.7rem;
    border: 1px solid #f0f0f0;
    display: flex;
    color: #999;
    justify-content: center;
    align-items: center;
    margin-bottom: 0.2rem;
  }

  .screen ul li:nth-child(5) {
    width: 100%;
    height: 0.95rem;
    background: white;
    display: flex;
    flex-flow: row;
    justify-content: space-around;
    align-items: center;
  }

  .screen ul li:nth-child(5) button {
    width: 50%;
    height: 0.95rem;
    border: none;
    border-top: 1px solid #e4e4e4;
    font-size: 0.3rem;
    font-weight: 600;
    color: #a2a2a2;
  }

  .screen ul li:nth-child(5) button:hover {
    color: #1e82d2;
  }

  .screen ul li:nth-child(5) button.aa {
    border-left: 1px solid #e4e4e4;
  }

  .contentList {
    width: 100%;
    height: calc(100vh - 1.75rem);
    overflow-y: scroll;
  }

  .content {
    width: 100%;
    display: flex;
    flex-flow: column;
    padding: 0.1rem 0.2rem;
    background: white;
    margin-top: 0.2rem;
  }

  .top {
    border-bottom: 1px dashed #aaaaaa;
    color: #747474;
    display: flex;
    align-content: center;
    font-size: 0.24rem;
    justify-content: space-between;
  }

  .top > p {
    height: 0.6rem;
    display: flex;
    align-items: center;
    flex: 1;
  }

  .top > p > i {
    height: 0.3rem;
    width: 0.3rem;
    margin-right: 0.1rem;
  }

  .top > p > i > img {
    width: 100%;
    height: 100%;
  }

  .bottom {
    display: flex;
    flex-flow: row;
    padding: 0.1rem 0 0.1rem 0.1rem;
  }

  .bottom > p {
    flex: 1;
    display: flex;
    flex-flow: column;
    justify-content: center;
  }

  .bottom > p > a {
    font-size: 0.26rem;
    color: #747474;
    margin-top: 0.2rem;
  }

  .bottom > p > span {
    font-size: 0.32rem;
    color: #000;
    margin: 0.1rem 0;
    font-weight: 600;
  }

  .bottom > span {
    width: 2rem;
    height: 1.2rem;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: flex-end;
  }

  .bottom > span > span {
    margin-bottom: 0.4rem;
    border-radius: 0.04rem;
    font-size: 0.22rem;
  }

  .bottom > span > p {
    display: flex;
    font-size: 0.26rem;
    color: #747474;
  }

  .bottom > span > p > i {
    height: 0.3rem;
    width: 0.3rem;
    margin-right: 0.1rem;
  }

  .bottom > span > p > i > img {
    width: 100%;
    height: 100%;
  }

  .add {
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0);
    position: fixed;
    left: 0;
    top: -0.05rem;
  }

  .add ul {
    width: 3rem;
    height: 1.6rem;
    background: white;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    border: 1px solid #e5e5e5;
    border-radius: 0.1rem;
    position: absolute;
    right: 0.1rem;
    top: 1rem;
  }

  .add ul li:nth-child(1) {
    border-bottom: 1px solid #e5e5e5;
    position: relative;
    z-index: 666;
  }

  .add ul li:nth-child(1) > span {
    display: flex;
    width: 0.25rem;
    height: 0.25rem;
    position: absolute;
    top: -0.25rem;
    z-index: 555;
    right: 0.15rem;
  }

  .add ul li:nth-child(1) > span > img {
    width: 100%;
    height: 100%;
  }

  .add ul li {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 0.8rem;
  }
</style>
