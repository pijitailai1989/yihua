<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" v-title="'我的好友'" title="我的好友" :bgcolor="mainColor" color="#fff">
      <span slot="left" @click="cancel()"  style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
      <span slot="right" @click="showBlacklist()" style="color: #fff;">
        黑名单
      </span>
    </yd-navbar>
    <div class="searchBox" slot='top'>
      <div class="search-div">
        <input type="text" @input="filterFn" v-model="keyword" placeholder="请输入关键字">
        <img @click='filterFn' src="../../../../assets/images/rent/my/search.png" alt="">
      </div>
    </div>
     <yd-infinitescroll :callback="loadList" ref="infinitescrollDemo">
        <yd-list theme="1" slot="list">
           <div class="show-friend" v-for="(item,index) in list" :key='item.guid'>
          <div class="img-div">
            <!--/circle/my_circle/friend_detail-->
            <img @click="thisFriendDetail(item.userId2)" style="width:1.28rem;height:1.28rem;" :src="item.headPortrait" alt="">
          </div>
        <div @click="thisFriendDetail(item.userId2)" class="this-friend">
          <div class="this-friend-name" v-html="item.nickname"></div>
          <div class="this-friend-content">备注：{{item.remark?item.remark:"无"}}</div>
          <div class="this-friend-location" :style="`color:${mainColor}`">{{item.description}}&nbsp;</div>
        </div>
        <div class="black-this-friend text-right">
          <div class="addBlack" @click="addBlack(index,item.userId1,item.userId2)">
            <img src="../../../../assets/images/rent/circle/addblack.png" alt="">
            <div class="font26 foCo9">加黑</div>
          </div>
        </div>
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
import "@/assets/css/manager.css";
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
    var mainColor = this.$color[userInfo.organType];
    return {
      userInfo,
      organInfo,
      mainColor,
      userId: {},
      getkey: "",
      selectedIndex: -1,
      showPeopleList: false,
      showWordList: false,
      showSelectItem: false,
      keyword: "",
      list: [],
      pageNo: 1,
      pageCount: 1,
      friendList: [
        { imgUrl: "", name: "一片云", content: "honey", location: "Jack高伟达" },
        { imgUrl: "", name: "大头", content: "sunday", location: "沛鸿大厦" },
        { imgUrl: "", name: "妹妹", content: "son", location: "平安大厦" },
        { imgUrl: "", name: "杰克", content: "", location: "国际经贸大厦" }
      ],
      startDate: "2017-01-01",
      endDate: "2022-12-30"
    };
  },
  methods: {
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
    // 添加黑名单
    addBlack(index, userId, userId2) {
      console.log(index, userId, userId2);
      this.$dialog.confirm({
        mes: "是否将当前好友加入黑名单",
        opts: () => {
          var data = {
            token: this.$getkey(),
            userId,
            userId2,
            status: 2
          };
          this.$ajax(
            `${this.subUrl.sc}/friend/blacklist`,
            data,
            res => {
              this.list.splice(index, 1);
              console.log(this.list);
              this.$dialog.toast({ mes: "成功加入黑名单", timeout: 1000 });
            },
            this
          );
        }
      });
    },
    setData(arr) {
      var arr1 = [];
      for (var i in arr) {
        var obj = arr[i];
        obj.nickname = obj.nickname.replace(
          this.keyword,
          `<b style="color:${this.mainColor}">${this.keyword}</b>`
        );
        arr1.push(obj);
      }
      return arr1;
    },
    filterFn() {
      console.log(this.timer,111)
      if (this.timer) {
        return;
      }
      this.timer = setTimeout(() => {
        console.log("执行了")
        this.pageNo = 1;
        this.pageCount = 1;
        this.$refs.infinitescrollDemo.$emit("ydui.infinitescroll.reInit");
        this.list = [];
        this.getList({},()=>{
          clearTimeout(this.timer);
          this.timer = null;
        });
      }, 400);
    },
    getList(data, cb) {
      data = data ? data : {};
      data.token = this.$getkey();
      data.userId = this.userInfo.guid;
      data.pageSize = this.pageSize ? this.pageSize : 15;
      data.status = 1; //正常列表
      data.pageNo = this.pageNo;
      if (this.keyword) {
        data.keyword = this.keyword;
      }
      let url = `${this.subUrl.sc}/friend/listFriend`;
      this.$ajax(
        url,
        data,
        res => {
          cb && cb(res.data);
          if (this.keyword) {
            this.list = this.list.concat(this.setData(res.data.list));
          } else {
            this.list = this.list.concat(res.data.list);
          }
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
    },
    //跳转到详情
    thisFriendDetail(index) {
      this.$router.push(`/circle/my_circle/friend_detail/${index}`);
    },
    overSelect() {
      this.showSelectItem = false;
    },
    toSelect() {
      this.showSelectItem = !this.showSelectItem;
    },

    showBlacklist() {
      this.$router.push("/circle/my_circle/black_friend");
    },
    showPeople() {
      this.showPeopleList = !this.showPeopleList;
    },
    showWord() {
      this.showWordList = !this.showWordList;
    },
    selectThisStatus(index) {
      this.selectedIndex = index;
    },
    cancel() {
      history.back();
    }
  },
  mounted() {
    this.userId = this.userInfo.guid;
    this.getkey = fn.getIng();
    this.getList({}, res => {
      console.log(res);
    });
  }
};
</script>
<style scoped>
.show-friend {
  padding: 0.2rem 0.24rem;
}

.black-this-friend {
  width: auto;
}

.addBlack {
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  padding-left: 0.2rem;
  align-items: center;
  height: 100%;
  margin-bottom: 0.1rem;
}

.addBlack img {
  width: 0.42rem;
  height: 0.42rem;
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
</style>