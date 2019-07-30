<template>
  <yd-layout class="edit">
     <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" :bgcolor="mainColor"  v-title="'我的报名'" title="我的报名" color="#fff">
      <span slot="left" @click="cancel()" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
    </yd-navbar>
    <div class="searchBox" slot='top'>
      <div class="search-div">
        <input type="text" placeholder="请输入关键字" @input="searchFn1" v-model="keyword">
        <img src="../../../../assets/images/rent/my/search.png" @click='searchFn' alt="">
      </div>
      <div class="search-by" :style="'color:' + mainColor" @click="toSelect">筛选</div>
      <div class="black-bg" slot="bottom" v-if="showSelectItem" v-bind:style="showSelectItem?'top:7em':''">
      </div>
      <div class="select-item-search" v-if="showSelectItem">
        <div class="search-item-title">日期</div>
        <div class="select-start-end">
          <yd-datetime type="date"  class="date-select" v-model="startDate"></yd-datetime>
          <div class="date-center-line"></div>
          <yd-datetime type="date" class="date-select date-select1" v-model="endDate"></yd-datetime>
        </div>
        <div class="search-item-title1">状态</div>
        <div class="select-item-status">
          <div v-for="(item,index) in statusList" :key="index" @click="selectThisStatus(index)" class="text-center">
            <span v-bind:style="selectedIndex==index?'background:'+ mainColor +';color:#fff;border-radius:.1rem':''">{{item.text}}</span>
          </div>
        </div>
        <div class="bottom-sure-div">
          <div @click="resetValue">重置</div>
          <div class="pull-right div-btn" :style="`background-color:${mainColor};border-radius:.1rem`" @click="overSelect">完成</div>
        </div>
      </div>
    </div>

    <!-- 列表 -->
    <yd-infinitescroll :callback="loadList" ref="infinitescrollDemo">
        <yd-list theme="1" slot="list">
             <div class="list-top-div" v-for="(item,index) in list" :key="index">
              <div class="list-left-div">
                <img v-if="item.bbs.commAccessoryList.length>0" :src="item.bbs.commAccessoryList[0].path" alt="">
              </div>
              <div class="list-center-div" @click="$router.push(`/rent/circle/article/${item.bbsId}`)">
                <span style="font-size:.32rem" v-html="item.bbs.title&&item.bbs.title.replace(keyword,`<b style=color:${mainColor}>${keyword}</b>`)"></span>
                <br>
                <span class="fuColor2">{{item.nickname}}</span>
                <br>
                <span style="color: #999999;font-size: .24rem">{{item.createDate|times}}</span>
              </div>
              <div class="list-right-div">
                <div class="text-center" v-if="item.status==1" :style="{color:mainColor}">正常</div>
                <div class="text-center" v-if="item.status==2" :style="{color:mainColor}">完成</div>
                <div class="text-center foCo9" v-if="item.status==3">过期</div>
                <div class="text-center foCo9" v-if="item.status==4">关闭</div>
                <img style="width:.64rem;height:.64rem;" @click="showQrcode(index)" src="../../../../assets/images/rent/circle/qr_bg.png">
              </div>
            </div>
        </yd-list>
        <!-- 数据全部加载完毕显示 -->
        <span slot="doneTip">啦啦啦，啦啦啦，没有数据啦~~</span>
        <!-- 加载中提示，不指定，将显示默认加载中图标 -->
    </yd-infinitescroll>
      <div class="black-bg" slot="bottom" v-if="showQrcodePic" @click="noShow"></div>
        <div class="show-now-qrcode" slot="bottom" v-if="showQrcodePic">
          <div class="show-qrcode-cancel">
            <img @click="noShow" src="../../../../assets/images/rent/circle/close.png">
          </div>
          <div>
            <div class="list-top-div">
              <div class="list-left-div list-left-bg-div">
                <img v-if="qrcodeShow.bbs.commAccessoryList.length>0" :src="qrcodeShow.bbs.commAccessoryList[0].path" alt="">
              </div>
              <div class="list-center-div list-center-bg-div">
                <span style="font-size:.32rem">{{qrcodeShow.bbs.title}}</span>
                <br>
                <span class="fuColor2">{{qrcodeShow.nickname}}</span>
                <br>
                <span style="color: #999999;font-size: 12px">{{qrcodeShow.createDate|times}}</span>
              </div>
            </div>
          </div>
          <div class="list-bottom-div">
            <img :src="qrcodeShow.src" style="width:3.6rem;height:3.6rem" alt="">
            <div class="text-center foCo9 font32">扫一扫二维码查看详情</div>
          </div>
      </div>
  </yd-layout>
</template>
<script>
import fn from "@/assets/js/product";
import qs from "qs";
import Vue from "vue";
import "@/assets/css/manager.css";
import { Icons } from "vue-ydui/dist/lib.rem/icons";
import { CheckBox, CheckBoxGroup } from "vue-ydui/dist/lib.rem/checkbox";
/* 使用px：import {CheckBox, CheckBoxGroup} from 'vue-ydui/dist/lib.px/checkbox'; */

Vue.component(CheckBox.name, CheckBox);
Vue.component(CheckBoxGroup.name, CheckBoxGroup);
/* 使用px：import {Icons} from 'vue-ydui/dist/lib.px/icons'; */

import InfiniteScroll from "vue-infinite-scroll";

Vue.component(Icons.name, Icons);
export default {
  data() {
    var userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    var mainColor = this.$color[userInfo.organType];
    // 设置主色
    var endDate = this.$today();
    // console.log()
    var startDate = this.$addDay(endDate, -30);
    return {
      mainColor,
      userInfo,
      keyword: "",
      showSelectItem: false,
      organInfo: {},
      startDate,
      endDate,
      userId: {},
      qrcodeShow: {},
      getkey: "",
      showPeopleList: false,
      showWordList: false,
      showQrcodePic: false,
      statusList: [
        {
          text: "正常",
          value: 1
        },
        {
          text: "完成",
          value: 2
        },
        {
          text: "关闭",
          value: 3
        },
        {
          text: "过期",
          value: 4
        }
      ],
      currentObj: {},
      selectedIndex: -1,
      list: [],
     
      pageNo: 1,
      pageCount: 1
    };
  },
  methods: {
    // 搜素
    searchFn() {
      this.pageNo = 1;
      // 重新初始化
      this.$refs.infinitescrollDemo.$emit("ydui.infinitescroll.reInit");
      this.list = [];
      this.getList();
    },
    searchFn1() {
      console.log(this.keyword);
      if (this.keyword == "") {
        console.log(this.timer1);
        if (this.timer1) {
          clearTimeout(this.timer1);
          return;
        }
        this.timer1 = setTimeout(() => {
          this.pageNo = 1;
          // 重新初始化
          this.$refs.infinitescrollDemo.$emit("ydui.infinitescroll.reInit");
          this.list = [];
          this.getList(() => {
            this.timer1 = null;
          });
        }, 200);
      }
    },
    loadList() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
        return;
      } else {
        console.log(111);
        this.timer = setTimeout(res => {
          let data = {};
          this.getList();
        }, 200);
      }
    },
    // 筛选
    overSelect() {
      var s = new Date(this.startDate).getTime();
      var e = new Date(this.endDate).getTime();
      var t = new Date(new Date().setHours(8, 0, 0, 0));
      if (s > t) {
        return this.$dialog.toast({ mes: "开始时间不得大于今天", timeout: 400 });
      } else if (e > t) {
        return this.$dialog.toast({ mes: "结束时间不得大于今天", timeout: 400 });
      } else if (s > e) {
        return this.$dialog.toast({ mes: "开始时间不得大于结束时间", timeout: 400 });
      } else {
        this.showSelectItem = false;
        // 重新初始化
        this.$refs.infinitescrollDemo.$emit("ydui.infinitescroll.reInit");
        this.list = [];
        this.pageNo = 1;
        this.getList();
      }
    },
    resetValue() {
      this.selectedIndex = -1;
      this.endDate = this.$today();
      this.startDate = this.$addDay(this.endDate, -30);
    },
    toSelect() {
      this.showSelectItem = !this.showSelectItem;
    },
    noShow() {
      this.showQrcodePic = false;
    },
    selectThisStatus(index) {
      this.selectedIndex = index;
    },
    showQrcode(index) {
      this.showQrcodePic = true;
      this.qrcodeShow = this.list[index];
      console.log(this.qrcodeShow);
      this.qrcodeShow.src = `${this.baseUrl}${this.subUrl
        .sc}/bbsApplicant/getApplicantCode?userId=${this.qrcodeShow
        .userId}&token=${this.$getkey()}&guid=${this.qrcodeShow.guid}`;
      console.log(this.qrcodeShow.src);
    },
    showPeople() {
      this.showPeopleList = !this.showPeopleList;
    },
    showWord() {
      this.showWordList = !this.showWordList;
    },
    cancel() {
      this.$router.go(-1);
    },
    getList(data, cb) {
      data = data ? data : {};
      data.token = this.$getkey();
      data.userId = this.userInfo.guid;
      data.pageSize = this.pageSize ? this.pageSize : 15;
      data.pageNo = this.pageNo;
      // 关键字搜索时不筛选
      let url;
      if (this.keyword) {
        data.keyword = this.keyword;
        url = `${this.subUrl.sc}/bbsApplicant/queryByKeyword`;
      } else {
        // if (this.startDate) {
        //   data.startDate = this.startDate + " 00:00:00";
        //   data.endDate = this.endDate + " 23:59:59";
        // }
        if (this.selectedIndex > -1) {
          data.status = this.statusList[this.selectedIndex].value;
        }
        url = `${this.subUrl.sc}/bbsApplicant/listBbsApplicant`;
      }
      this.$ajax(
        url,
        data,
        res => {
          cb && cb(res.data);
          this.list = this.list.concat(res.data.list);
          this.pageCount = res.data.pageCount;
          this.timer = null;
          if (res.data.pageCount == this.pageNo || res.data.list.length == 0) {
            this.$refs.infinitescrollDemo.$emit(
              "ydui.infinitescroll.loadedDone"
            );
          } else {
            this.$refs.infinitescrollDemo.$emit(
              "ydui.infinitescroll.finishLoad"
            );
          }
          this.pageNo = this.pageNo + 1;
        },
        this
      );
    }
  },
  mounted() {
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.userId = this.userInfo.guid;
    this.getkey = fn.getIng();
    this.getList();
  }
};
</script>
<style scoped>
.select-item-search {
  top: 1.88rem;
}
.searchBox {
  display: flex;
  position: relative;
  align-items: center;
  padding: 0.18rem 0.24rem;
  justify-content: space-between;
  height: 1.04rem;
}
.search-div {
  background: #fff;
  display: flex;
  align-items: center;
  flex: 1;
  height: 100%;
  justify-content: space-between;
  padding: 0 0.24rem;
  border-radius: 0.05rem;
}
.search-div input {
  background: #fff;
  border: none;
  width: 100%;
  height: 100%;
  padding: 0 0.2rem;
}

.search-div img {
  float: right;
  width: 0.5rem;
}
.black-bg {
  left: 0;
  right: 0;
  top: 1.04rem;
  bottom: 0;
}
.search-by {
  width: 1.2rem;
  line-height: 2.5em;
  font-size: 16px;
  height: 100%;
  line-height: 0.68rem;
  text-align: center;
}

.list-top-div {
  background: #fff;
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.2rem;
  padding: 0;
}

.list-left-div {
  width: 25%;
  padding: 0.24rem 0 0.24rem 0.24rem;
}

.list-left-bg-div {
  width: 35% !important;
  padding: 0.5em;
}

.list-left-div img {
  width: 100%;
}

.list-center-div {
  width: 55%;
  padding: 0.5em;
}

.list-center-bg-div {
  width: 65% !important;
}

.list-center-div span {
  line-height: 1.8em;
}

.list-right-div {
  width: 15%;
  padding: 0.5em;
  position: relative;
}

.list-right-div img {
  position: absolute;
  bottom: 0.5em;
  width: 70%;
  margin-right: 15%;
  right: 0;
  padding: 0.5em;
}

.list-right-div div {
  line-height: 2em;
  width: 100%;
}

.show-now-qrcode {
  position: absolute;
  padding: 0 1em;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 84%;
  background: #fff;
  z-index: 99;
  border-radius: 0.03rem;
}

.show-qrcode-cancel {
  width: 100%;
  text-align: right;
  height: 0.6rem;
  padding: 0.3rem;
  margin: 0 -0.3rem 0.2rem 0;
}
.show-qrcode-cancel img {
  width: 0.6rem;
  margin-right: -0.5rem;
  margin-top: -0.1rem;
  padding: 0.1rem;
}
.list-bottom-div {
  width: 70%;
  margin-left: 15%;
  margin-bottom: 10%;
}

.list-bottom-div img {
  width: 100%;
}
</style>