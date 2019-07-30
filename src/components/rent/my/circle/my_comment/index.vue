<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" title="我的评论" :bgcolor="mainColor" color="#fff">
      <span slot="left" @click="cancel()" color="#fff;padding-right:.2rem" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
      <span slot="right" @click="chooseSuccess()" color="#fff;padding-right:.2rem" style="color: #fff;">
      </span>
    </yd-navbar>
    <div class="searchBox" slot="top">
      <div class="search-div">
        <input type="text" placeholder="请输入关键字" v-model="keyword">
        <img src="../../../../assets/images/rent/my/search.png" @click='searchFn' alt="">
      </div>
      <div class="search-by" :style="'color:' + mainColor" @click="toSelect">筛选</div>
      <div class="black-bg" v-if="showSelectItem" v-bind:style="showSelectItem?'top:7em':''">
      </div>
      <div class="select-item-search" v-if="showSelectItem">
        <div class="search-item-title">日期</div>
        <div class="select-start-end">
          <yd-datetime type="date" class="date-select" v-model="startDate"></yd-datetime>
          <div class="date-center-line"></div>
          <yd-datetime type="date" class="date-select date-select1" v-model="endDate"></yd-datetime>
        </div>
        <div class="bottom-sure-div">
          <div @click='resetDate()'>重置</div>
          <div class="pull-right div-btn" :style="`background-color:${mainColor};border-radius:.1rem`" @click="overSelect">完成</div>
        </div>
      </div>
    </div>
    <!-- 评论列表 -->
    <!-- 列表 -->
    <yd-infinitescroll :callback="loadList" ref="infinitescrollDemo">
      <yd-list theme="1" slot="list">
        <div class="comment-content" v-if="item.bbs" v-for="(item,index) in list" v-bind:key="item.guid">
          <router-link :to="`/rent/circle/article/${item.bbsId}`" slot="left">
            <div class="comment-title">
              <span>{{item.content}}</span>
              <span class="pull-right right-time">{{item.createDate|times}}</span>
            </div>
            <div class="this-comment-content">
              <img v-if="item.bbs.commAccessoryList.length>0" :src="item.bbs.commAccessoryList[0].path" alt="">
              <div>
                <div class="this-title">{{item.bbs.title}}</div>
                <div class="this-text">
                  {{item.bbs.content}}
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </yd-list>
      <!-- 数据全部加载完毕显示 -->
      <span slot="doneTip">啦啦啦，啦啦啦，没有数据啦~~</span>
      <!-- 加载中提示，不指定，将显示默认加载中图标 -->
    </yd-infinitescroll>

  </yd-layout>
</template>
<script>
  import fn from "@/assets/js/product";
  import qs from "qs";
  import Vue from "vue";
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
      var organInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("organInfo"))
      );
      console.log(userInfo, organInfo);
      var mainColor = this.$color[userInfo.organType];
      var endDate = this.$today();
      // console.log()
      var startDate = this.$addDay(endDate, -30);
      return {
        endDate,
        startDate,
        userInfo,
        organInfo,
        mainColor,
        userId: {},
        getkey: "",
        selectedIndex: -1,
        showSelectItem: false,
        showPeopleList: false,
        showWordList: false,
        list: [],
        pageNo: 1,
        pageCount: 1,
        pageSize: 15,
        statusList: ["正常", "完成", "关闭", "过期", "信息", "好友"],
        keyword: ""
      };
    },
    methods: {
      resetDate() {
        var endDate = this.$today();
        var startDate = this.$addDay(endDate, -30);
        this.startDate = startDate;
        this.endDate = endDate;
      },
      loadList() {
        if (this.timer) {
          clearTimeout(this.timer);
          return;
        } else {
          this.timer = setTimeout(res => {
            let data = {};
            this.getList({}, () => {
              this.$refs.infinitescrollDemo.$emit(
                "ydui.infinitescroll.finishLoad"
              );
            });
          }, 200);
        }
      },
      searchFn() {
        this.pageNo = 1;
        this.list = [];
        this.getList();
      },
      overSelect() {
        var s = new Date(this.startDate).getTime();
        var e = new Date(this.endDate).getTime();
        var t = new Date(new Date().setHours(8, 0, 0, 0)) / 1;
        console.log(s, e, t);
        if (s > t) {
          return this.$dialog.toast({ mes: "开始时间不得大于今天", timeout: 400 });
        } else if (e > t) {
          return this.$dialog.toast({ mes: "结束时间不得大于今天", timeout: 400 });
        } else if (s > e) {
          return this.$dialog.toast({ mes: "开始时间不得大于结束时间", timeout: 400 });
        } else {
          this.showSelectItem = false;
          // 重新初始化
          this.list = [];
          this.pageNo = 1;
          this.$refs.infinitescrollDemo.$emit("ydui.infinitescroll.reInit");
          this.getList();
        }
      },
      toSelect() {
        this.showSelectItem = !this.showSelectItem;
      },
      selectThisStatus(index) {
        this.selectedIndex = index;
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
        if (this.keyword) data.keyword = this.keyword;
        if (this.startDate) {
          data.startDate = this.startDate + " 00:00:00";
          data.endDate = this.endDate + " 23:59:59";
        }
        if (this.selectedIndex > -1) {
          data.status = this.statusList[this.selectedIndex].value;
        }
        this.$ajax(
          `${this.subUrl.sc}/bbsComment/listBbsComment`,
          data,
          res => {
            cb && cb(res.data);
            this.list = this.list.concat(res.data.list);
            // console.log(this.list)
            this.pageCount = res.data.pageCount;
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
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      this.getList();
    }
  };
</script>
<style scoped>
  @import "../../../../assets/css/manager_cover.css";
  .comment-title {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .comment-title .right-time {
    white-space: nowrap;
  }

  .comment-title,
  .this-text {
    word-break: break-all;
  }

  .comment-title span:nth-child(1) {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    padding-bottom: .2rem;
    overflow: hidden;
    padding: 0;
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

  .this-comment-content img {
    width: 1.28rem;
    height: 1.28rem;
    border-radius: 0.1rem;
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
</style>