<template>
  <!--<div>-->
  <yd-layout class="layout_my">
    <yd-navbar class="header" slot="navbar" v-show="!userAgent.isWX" v-title="'报修处理'" title="报修处理" color="#fff" :bgcolor="mainColor"
      height=".88rem">
      <a @click="back" slot="left">
        <!--url[url.length-1]-->
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </a>
      <div slot="right" class="edit addRightClickArea" style="color: #fff;font-size: .6rem;" @click="$router.push('/estate/wuye/to_repair')">+</div>
      <!--<div slot="right" class="edit" style="color: #fff;">-->
        <!--<router-link :to="'/estate/wuye/to_repair'">-->
          <!--<img style="width: 1.3em" src="../../../../../../assets/images/rent/my/add_new_job.png" alt="">-->
        <!--</router-link>-->
      <!--</div>-->
    </yd-navbar>
    <div class="search" slot='top'>
      <div>
        <i>
          <img @click='searchFn' src="../../../../../../assets/images/rent/my/search.png" alt="">
        </i>
        <span>
          <input type="text" v-model='keyword' placeholder="请输入关键字或编码">
        </span>
      </div>
      <div @click="clickShowSearch">筛选</div>
    </div>
    <div>
      <div class="black-bg" v-if="showTypes" @click="cancel"></div>

      <div>
        <div class="black-bg" v-if="showSearch"></div>
        <div class="repair-search" v-if="showSearch">
          <div class="repair-search-div">起止时间
            <br>
            <div class="absolute-time absolute-time-left">{{data.startDate}}</div>
            <div class="absolute-time-center"></div>
            <div class="absolute-time absolute-time-right">{{data.endDate}}</div>
            <div style="width:100%;display: flex;opacity: 0">
              <div style="flex: 1">
                <yd-cell-item arrow>
                  <yd-datetime start-date="2010-01-01" end-date="2022-12-12" type="date" v-model="data.startDate" slot="right"></yd-datetime>
                </yd-cell-item>
              </div>
              <div style="flex: 1;opacity: 0">
                <yd-cell-item arrow>
                  <yd-datetime start-date="2010-01-01" end-date="2022-12-12" type="date" v-model="data.endDate" slot="right"></yd-datetime>
                </yd-cell-item>
              </div>
            </div>
          </div>
          <div class="repair-search-div">类型
            <br>
            <div @click="showSelectType" class="repair-btn">
              <span v-if="thisType">{{thisType}}</span>
              <span v-if="!thisType||thisType==''">请选择</span>
            </div>
          </div>
          <div class="repair-search-div">状态
            <br>
            <div class="div-flex">
              <div class="" v-for="item in qsStatus">
                <span class="status-item" v-bind:class="nowStatus==item.value?'status-active':''" @click="selectStatus(item)">{{item.name}}</span>
                <span></span>
              </div>
            </div>
          </div>
          <div class="div-flex chooseBtn" style="margin-top: 1em">
            <div class="text-center select-bottom-btn" @click="clickShowSearch">取消</div>
            <div class="text-center select-bottom-btn select-bottom-btn-right" @click="getSearch">确定</div>
          </div>
        </div>

        <div class="birthplace" v-if="show1">
          <ul>
            <li>
              <a class="font30 font600" :style="{color:mainColor}" @click="cancel1">取消</a>
              <a class="font30 font600"></a>
              <a class="font30 font600" :style="{color:mainColor}" @click="finished">完成</a>
            </li>
            <li>
              <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
            </li>
          </ul>
        </div>
      </div>
      <!--<vue-pickers v-show="true" slot="bottom" class="slideBox" :selectData="qsStatus" v-on:cancel="" v-on:confirm=""></vue-pickers>-->

      <div class="type-this type-this-fix" v-if="showTypes&&statusType==1">
        <div v-for="(item,index) in qsTypes" :key="index" @click="getTypeList(item.guid)">
          <div>{{item.dictDataName}}</div>
        </div>
        <div v-if="qsTypes.length%3==1||qsTypes.length%3==2"></div>
        <div v-if="qsTypes.length%3==1"></div>
      </div>
      <div class="type-this type-this-fix" v-if="showTypes&&statusType==2">
        <div v-for="(item,index) in qsStatus" :key="index">
          <div>{{item}}</div>
        </div>
        <div v-if="qsStatus.length%3==1||qsTypes.length%3==2"></div>
        <div v-if="qsStatus.length%3==1"></div>
      </div>
      <div v-infinite-scroll="loadList" infinite-scroll-disabled="busy" infinite-scroll-distance="0" infinite-scroll-immediate-check="false"
        style="background: #f5f5f5;">
        <div class="repair-list" v-for="item,index in orderList">
          <router-link :to="'/estate/wuye/order_detail?guid='+item.guid" slot="left">
            <!--url[url.length-1]-->
            <div class="first-div flex-row">
              <span class="flex">
                <img src="../../../../../../assets/images/rent/estate/leibie.png" class="mr1" style="width:.5rem;height:.4rem" alt=""> {{item.name}} {{item.typeName}}
              </span>
              <span class="pull-right">
                <span class="pull-right state state1" v-if="item.status==0">完成</span>
                <span class="pull-right state stateClose" v-if="item.status==1">关闭</span>
                <span class="pull-right  state state2" v-if="item.status==2">草稿</span>
                <span class="pull-right  state state2" v-if="item.status==3">客服分配</span>
                <span class="pull-right  state state2" v-if="item.status==4">经理分配</span>
                <span class="pull-right  state state2" v-if="item.status==5">派单</span>
                <span class="pull-right  state state2" v-if="item.status==6">抢单</span>
                <span class="pull-right  state state2" v-if="item.status==7">分单</span>
                <span class="pull-right  state state2" v-if="item.status==8">处理中</span>
                <span class="pull-right  state state2" v-if="item.status==9">用户评价</span>
                <span class="pull-right state state2" v-if="item.status==10">客服评价关闭</span>
              </span>
            </div>
            <div class="flex-row-nowrap">
              <img style="width:.65rem;height:.85rem;" src="../../../../../../assets/images/rent/estate/document.png"
                alt="">
              <!-- <img  src="../../../../../../assets/images/rent/my/search.png" alt=""> -->
              <div class="flex1" style="width:auto;flex-wrap: wrap;">
                <div class="oneline font32" style="height:.5rem;margin:0;color:#333;">{{item.remark.length > 20?item.remark.substr(0,18)+'...':item.remark}}</div>
                <div class="flex-row" style="height:.3rem;margin-top:-.1rem;">
                  <span>{{item.customerInfo.ridName}}{{item.customerInfo.unitName}}</span>
                  <span>{{item.createDate.split(' ')[0]}}</span>
                </div>
                <!-- <div style="width:auto;line-height:.5rem;margin:0;height:.5rem;justify-content:space-between" class="flex1 center">
                  <span v-if="userInfo.organType*1 ==3">{{item.customerInfo.ridName}}{{item.customerInfo.unitName}}</span>
                  <span class="pull-right" v-if="item.createDate && userInfo.organType*1 ==3">{{item.createDate.split(' ')[0]}}</span>
                  <span style="margin-top:-.2rem;display:inline-block" v-if="userInfo.organType*1 ==1">{{item.createDate.split(' ')[0]}} </span>
                  <span class="pull-right" v-if="userInfo.organType*1 ==1">{{item.customerInfo.ridName}}{{item.customerInfo.unitName}}</span>
                </div>
              </div>-->
              </div>
            </div>
          </router-link>
        </div>
        <div class="bgwhite flex-row foCo9 jusCenter h8" style="margin:.2rem 0" v-if="page>=pageCount">没有更多数据了！</div>
      </div>
      <!--</div>-->
    </div>
  </yd-layout>
  <!--<p>-->
  <!--<input type="button" v-model="thisContent" id="bBtn" value="B" style="font-weight:bold" onclick="setBold();"/>-->
  <!--</p>-->
  <!--</div>-->
</template>
<script>
import fn from "@/assets/js/product";
import qs from "qs";
import InfiniteScroll from "vue-infinite-scroll";
import choose from "@/components/login/hangye.vue";

import {
  Confirm,
  Alert,
  Toast,
  Notify,
  Loading
} from "vue-ydui/dist/lib.rem/dialog";
import { Picker } from "mint-ui";
import District from "ydui-district/dist/jd_province_city_area_id";
import Vue from "vue";
import { ProgressBar } from "vue-ydui/dist/lib.rem/progressbar";
import { CellGroup, CellItem } from "vue-ydui/dist/lib.rem/cell";
import { Switch } from "vue-ydui/dist/lib.rem/switch";

import { Actionsheet } from "mint-ui";
import { CitySelect } from "vue-ydui/dist/lib.rem/cityselect";

Vue.component(CitySelect.name, CitySelect);
Vue.component(Picker.name, Picker);
export default {
  data() {
    return {
      name: "mt-picker",
      keyword: "",
      slots: [
        {
          flex: 1,
          values: [],
          className: "slot2"
        }
      ],
      busy: false,
      thisType: "",
      show1: false,
      componentName: "picker",
      organInfo: "",
      datetime0: "",
      hasMessage: {
        count: 99,
        new: true
      },
      nowStatus: "",
      // qsStatus: ["上报中", "处理中", "已分单", "已接单", "已完成", "已关闭"],
      qsStatus: [
        { name: "已完成", value: "0" },
        { name: "已关闭", value: "1" },
        { name: "草稿", value: "2" },
        { name: "客服分配", value: "3" },
        { name: "经理分配", value: "4" },
        { name: "派单", value: "5" },
        { name: "抢单", value: "6" },
        { name: "分单", value: "7" },
        { name: "处理中", value: "8" },
        { name: "用户评价", value: "9" },
        { name: "关闭评价", value: "10" }
      ],
      result: [],
      url: this.fromRoute ? this.fromRoute : "",
      userInfo: "",
      mainColor: "",
      showTypes: false,
      statusType: 1,
      data: {
        startDate: this.$addDay(this.$today(), -30),
        endDate: this.$today()
      },
      page: 1,
      orderList: [],
      thisContent: "",
      showSearch: false,
      pageCount: 2
    };
  },
  directives: {
    run(el, binding) {
      console.log();
    }
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    searchFn() {
      this.page = 1;

      this.getQuestionInfo();
    },
    selectStatus(status, index) {
      console.log(status);
      this.nowStatus = status.value;
      this.data.status = status.value;
    },
    //设置选定的文本为粗体/正常
    loadList() {
      this.page++;
      this.getQuestionInfo();
    },
    clickShowSearch() {
      this.showSearch = this.showSearch ? false : true;
    },
    showSelectType() {
      this.show1 = this.show1 ? false : true;
    },
    searchType(guid) {
      this.data.typeId = guid;
      this.getSerch;
    },
    searchStatus(status) {
      this.data.status = status;
    },
    cancel1() {
      this.show1 = false;
      this.thisType = "";
    },
    finished() {
      this.show1 = false;
      for (var i = 0; i < this.qsTypes.length; i++) {
        if (this.qsTypes[i].dictDataName == this.thisType) {
          this.data.typeId = this.qsTypes[i].guid;
        }
      }
    },
    selectShow(num) {
      if (!this.showTypes) {
        this.showTypes = true;
        this.statusType = num;
      } else {
        if (this.statusType == num) {
          this.showTypes = false;
        } else {
          this.statusType = num;
        }
      }
    },
    onValuesChange(picker, values) {
      this.thisType = values[0];
      var data = this.data;
      this.data = {};
      this.data = data;
    },
    cancel() {
      this.showTypes = false;
    },
    itemClickHandler() {},
    getQuestionInfo(cb) {
      if (this.page > this.pageCount) {
        return;
      }
      this.$dialog.loading.open("加载中");
      setTimeout(res => {
        this.$dialog.loading.close();
      }, 3000);
      var data = {
        organId: this.organInfo.guid,
        token: this.getkey,
        pageNo: this.page,
        userId: this.userId
      };
      if (this.keyword) data.keyword = this.keyword;
      this.xhr
        .post(
          `${this.subUrl.activity}/repairs/getRepairsList`,
          this.$qs.stringify(data)
        )
        .then(res => {
          this.$dialog.loading.close();
          if (res.data.code == 1) {
            if (res.data.data.list.length > 0) {
              this.pageCount = res.data.data.pageCount;
              this.orderList.push(...res.data.data.list);
              for (var i = 0; i < this.orderList.length; i++) {
                this.orderList[i].select = false;
                for (var j = 0; j < this.qsTypes.length; j++) {
                  if (
                    this.orderList[i].maintainId * 1 ==
                    this.qsTypes[j].guid * 1
                  ) {
                    this.orderList[i].typeName = this.qsTypes[j].dictDataName;
                  }
                }
              }
              cb && cb();
            } else if (res.data.code == "-902") {
              //-902
              /*重新登录*/
              // fn.re_login(this);
            } else {
              //            this.$dialog.toast({mes: res.data.msg});
            }
            cb && cb();
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            // fn.re_login(this);
          } else {
            //            this.$dialog.toast({mes: res.data.msg});
          }
        });
    },
    getSearch() {
      this.showSearch = false;
      this.data.userId = this.userId;
      this.data.token = this.getkey;
      this.data.pageNo = 1;
      this.data.pageSize = 15;
      this.orderList = [];
      if (this.data.startDate == "请选择") {
        this.data.startDate = "";
      } else {
        this.data.startDate = this.data.startDate + " 00:00:00";
      }
      if (this.data.endDate == "请选择") {
        this.data.endDate = "";
      } else {
        this.data.endDate = this.data.endDate + " 00:00:00";
      }
      var data = {
        organId: this.organInfo.guid,
        token: this.getkey,
        pageNo: 1,
        pageSeze: 15
      };
      this.xhr
        .post(
          `${this.subUrl.activity}/repairs/getRepairsList?` +
            qs.stringify(this.data)
        )
        .then(res => {
          if (res.data.code == 1) {
            this.pageCount = res.data.data.pageCount;
            if (res.data.data.list.length > 0) {
              this.orderList.push(...res.data.data.list);
              for (var i = 0; i < this.orderList.length; i++) {
                for (var j = 0; j < this.qsTypes.length; j++) {
                  if (
                    this.orderList[i].maintainId * 1 ==
                    this.qsTypes[j].guid * 1
                  ) {
                    this.orderList[i].typeName = this.qsTypes[j].dictDataName;
                    this.orderList[i].select = false;
                  }
                }
              }
            }
            //            cb && cb();
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            // fn.re_login(this);
          } else {
            //            this.$dialog.toast({mes: res.data.msg});
          }
        });
    },
    clearLoacl() {
      this.alertS = true;
    },
    quit() {
      this.alertS = false;
    },
    getTypeList(type) {
      var data = {
        userId: this.userId,
        token: this.getkey,
        pageNo: 1,
        pageSize: 15,
        typeId: type
      };
      this.xhr
        .post(
          `${this.subUrl.activity}/repairs/getRepairsList`,
          qs.stringify(data)
        )
        .then(res => {
          if (res.data.code == 1) {
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        });
    },
    getUserInfo() {
      var data = { userId: this.userId, token: this.getkey };

      this.xhr
        .post(`${this.subUrl.user}/user/getUserInfo`, qs.stringify(data))
        .then(res => {
          if (res.data.code == 1) {
            this.userInfo = res.data.data.userInfo;
            this.organInfo = res.data.data.organInfo;
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        });
    },
    getType() {
      var data = {
        userId: this.userId,
        token: this.getkey,
        pageNo: 1,
        pageSeze: 15
      };
      this.xhr.post(`${this.subUrl.user}/comm/getMt`).then(res => {
        if (res.data.code == 1) {
          this.qsTypes = res.data.data;
          this.slots[0].values = [];
          for (var i = 0; i < this.qsTypes.length; i++) {
            this.slots[0].values.push(this.qsTypes[i].dictDataName);
          }
        } else if (res.data.code == "-902") {
          //-902
          /*重新登录*/
          fn.re_login(this);
        } else {
          this.$dialog.toast({ mes: res.data.msg });
        }
      });
    },
    submit() {
      console.log(this.value1);
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
    this.userId = this.userInfo.guid;
    var that = this;
    that.getQuestionInfo();
    this.getType();
    this.getUserInfo(function() {
      that.getQuestionInfo();
      this.getType();
    });
  }
};
</script>
<style scoped>
.search {
  width: 100%;
  height: 0.85rem;
  background: white;
  display: flex;
  flex-flow: row;
  padding: 0.15rem 0.3rem;
}
body .chooseBtn div {
  flex: 1;
  margin: 0;
}

/* .status-type01 {
  font-size: .24rem;
  border: 1px solid #5881ff;
  line-height: 1.2em;
  color: #5881ff;
  padding: .03rem .05rem;

}

.status-type02 {
  font-size: .24rem;
  padding: .03rem .05rem;
  border: 1px solid orange;
  line-height: 1.2em;
  color: orange;
}
.status-type03 {
  font-size: .24rem;
  padding: .03rem .05rem;
  border: 1px solid #999999;
  line-height: 1.2em;
  color: #999999;
} */

.div-flex {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.select-bottom-btn {
  background: #fff;
  border: 1px solid #cccccc;
  border-left: none;
  line-height: 3em;
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

.repair-list {
  width: 100%;
  background: #ffffff;
  padding: 0.2em 1em;
  margin-top: 1em;
}

.repair-list div {
  width: 100%;
  /* line-height: 2em; */
  color: #999999;
  /* margin-top: 0.6em; */
  margin-top: 0.1rem;
  height: 56px;
}

.repair-list .first-div {
  border-bottom: 1px dashed #999999;
  color: #6b6b6b;
  height: 30px;
}

.repair-list div > img {
  margin-right: 0.2rem;
}

.bold-span {
  font-size: 16px;
  color: black;
  max-width: 7rem;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.birthplace {
  width: 100vw;
  height: 50%;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 999;
}

.birthplace ul {
  width: 100%;
  /* height: 4.5rem; */
  background: white;
  position: absolute;
  bottom: 0;
  left: 0;
}

.birthplace ul li:nth-child(1) {
  width: 100%;
  height: 0.9rem;
  background: #f0f0f0;
  display: flex;
  flex-flow: row;
}

.div-flex div {
  height: 3em;
  margin-right: 0.2rem;
}
.status-item {
  width: 2rem;
  display: block;
  border: 1px solid #cccccc;
  color: #999999;
  text-align: center;
  border-radius: 2px;
  background: #ffffff;
}
.birthplace ul li:nth-child(1) > a {
  display: flex;
  justify-content: center;
  align-items: center;
}

.birthplace ul li:nth-child(1) > a:nth-child(1) {
  width: 18%;
  height: 100%;
}

.birthplace ul li:nth-child(1) > a:nth-child(2) {
  flex: 1;
  height: 100%;
}

.birthplace ul li:nth-child(1) > a:nth-child(3) {
  width: 18%;
  height: 100%;
}

.birthplace ul li:nth-child(2) {
  width: 100%;
  background: #e4eae8;
}

.black-bg {
  position: fixed;
  background: black;
  opacity: 0.3;
  width: 100%;
  top: 6.3em;
  height: 100%;
}
.repair-search {
  position: fixed;
  background: #f6f6f6;
  width: 100%;
  top: 6.3em;
  z-index: 99;
}
.repair-search-div {
  padding: 0 1em;
  line-height: 2.3em;
  position: relative;
}
.repair-btn {
  background: #fff;
  line-height: 3em;
  padding: 0 0.5em;
  margin: 0 0.3em;
}
.absolute-time {
  position: absolute;
  width: 40%;
  background: #fff;
  line-height: 3em;
  padding-left: 0.8em;
  height: 3em;
}
.absolute-time-left {
  left: 4%;
}
.absolute-time-right {
  right: 4%;
}
.absolute-time-center {
  position: absolute;
  width: 1.8em;
  top: 60%;
  left: 50%;
  margin-left: -0.9em;
  background: #999999;
  height: 2px;
}
.status-active {
  border: 1px solid #5881ff !important;
  color: #5881ff;
}
.select-bottom-btn-right {
  border-right: none;
  color: #5881ff;
}
.birthplace ul li:nth-child(1) > a:nth-child(1) {
  width: 18%;
  height: 100%;
}

.birthplace ul li:nth-child(1) > a:nth-child(2) {
  flex: 1;
  height: 100%;
}

.birthplace ul li:nth-child(1) > a:nth-child(3) {
  width: 18%;
  height: 100%;
}

.birthplace ul li:nth-child(2) {
  width: 100%;
  background: #e4eae8;
}

.black-bg {
  position: fixed;
  background: black;
  opacity: 0.3;
  width: 100%;
  top: 6.3em;
  height: 100%;
}

.repair-search {
  position: fixed;
  background: #f6f6f6;
  width: 100%;
  top: 6.3em;
  z-index: 99;
}

.repair-search-div {
  padding: 0 1em;
  line-height: 2.3em;
  position: relative;
}

.repair-btn {
  background: #fff;
  line-height: 3em;
  padding: 0 0.5em;
  margin: 0 0.3em;
}

.absolute-time {
  position: absolute;
  width: 40%;
  background: #fff;
  line-height: 3em;
  padding-left: 0.8em;
  height: 3em;
}

.absolute-time-left {
  left: 4%;
}

.absolute-time-right {
  right: 4%;
}

.absolute-time-center {
  position: absolute;
  width: 1.8em;
  top: 60%;
  left: 50%;
  margin-left: -0.9em;
  background: #999999;
  height: 2px;
}

.status-active {
  border: 1px solid #5881ff !important;
  color: #5881ff;
}

.select-bottom-btn-right {
  border-right: none;
  color: #5881ff;
}
</style>
