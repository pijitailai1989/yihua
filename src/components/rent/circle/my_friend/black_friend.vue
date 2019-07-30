<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" v-title="'黑名单'" title="黑名单" :bgcolor="mainColor" color="#fff">
      <span slot="left" @click="cancel()" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
      <span slot="right" style="color: #fff;">
        <!--黑名单-->
      </span>
    </yd-navbar>
   
     <yd-infinitescroll :callback="loadList" ref="infinitescrollDemo">
        <yd-list theme="1" slot="list">
         <div class="show-friend" v-for="(item,index) in list" :key="index">
        <div class="img-div">
          <img @click="thisFriendDetail(item.userId2)" style="width:1.28rem;height:1.28rem;" :src="item.headPortrait" alt="">
        </div>
        <div class="this-friend">
          <div class="this-friend-name">{{item.nickname}}&nbsp;</div>
          <div class="this-friend-content">&nbsp;</div>
          <div class="this-friend-location" :style="`color:${mainColor}`">{{item.createDate}}</div>
        </div>
        <div class="black-this-friend text-right">
          <div class="addBlack" @click='removeBlack(index,item)'>
            <img src="../../../../assets/images/rent/circle/remove_black.png" alt="">
            <div class="font26 foCo9">移除</div>
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
      userId: "",
      getkey: "",
      selectedIndex: -1,
      showPeopleList: false,
      showWordList: false,
      showSelectItem: false,
      startDate: "2017-01-01",
      endDate: "2022-12-30",
      list: [],
      pageNo:1,
      pageCount:1,

    };
  },
  methods: {
    //跳转到详情
    thisFriendDetail(index) {
      this.$router.push(`/circle/my_circle/friend_detail/${index}`);
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
    // 移除黑名单
    removeBlack(i,item) {
      this.$dialog.confirm({
        title: "",
        mes: `是否将 ${item.nickname} 移除黑名单`,
        opts: () => {
          var data = {};
          data.userId = this.userInfo.guid;
          data.userId2 = item.userId2;
          data.token = this.$getkey();
          data.status = 1;
          this.$ajax(`${this.subUrl.sc}/friend/blacklist`,data,res=>{
             this.$dialog.toast({ mes: `您已成功将好友 ${item.nickname} 移除黑名单`, timeout: 1000,icon:'success' });
             this.list.splice(i, 1);
          },this)
        }
      });

      // this.$dialog.confirm({
      //   mes: "是否将当前好友移除黑名单",
      //   opts: () => {
      //     this.$dialog.toast({ mes: "成功移除黑名单", timeout: 200 });
      //     this.list.splice(index, 1);
      //   }
      // });
    },
     filterFn(){
      this.pageNo = 1;
      this.pageCount = 1;
      this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
      this.list = [];
      this.getList();
    },
    getList(data, cb) {
      data = data ? data : {};
      data.token = this.$getkey();
      data.userId = this.userInfo.guid;
      data.pageSize = this.pageSize ? this.pageSize : 15;
      data.status = 2; //拉黑列表
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
          if(res.data.list.length>0){
            res.data.list.forEach(element => {
              element.createDate=element.createDate.split(' ')[0]
            });
          }
          if (this.keyword) {
            this.list = this.list.concat(this.setData(res.data.list));
          } else {
            this.list = this.list.concat(res.data.list);
          }
          console.log(this.list)
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
      this.$router.go(-1);
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
}

.addBlack img {
  width: 0.4rem;
  height: 0.4rem;
  margin-bottom: 0.1rem;
}

.search-div {
  margin-left: 5%;
  margin-top: 0.5em;
  background: #fff;
  width: 90%;
  line-height: 2.5em;
}

.search-div input {
  line-height: 2em;
  margin-left: 1em;
  margin-bottom: 0.5em;
  margin-top: 0.5em;
  background: #fff;
  border: none;
}

.search-div img {
  float: right;
  margin-top: 0.6em;
  width: 1.8em;
  margin-right: 0.8em;
}

.search-by {
  width: 20%;
  margin-top: 0.5em;
  line-height: 2.5em;
  font-size: 16px;
  text-align: center;
}
</style>