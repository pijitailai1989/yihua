<template>
  <yd-layout class="editBox">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" v-title="'我的帖子'" title="我的帖子" :bgcolor="mainColor" color="#fff">
      <span slot="left" @click="cancel()">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
      <span slot="right" @click="chooseSuccess()" style="color: #fff;">
        <yd-icon color="#fff" size="20px" name="search"></yd-icon>
        <!--circle/my_circle/new_post-->
        <router-link :to="'/circle/my_circle/new_post'" slot="left">
          <img style="width: 1.3em;margin-top: 0.3em" src="../../../../assets/images/rent/my/add_new_job.png" alt="">
        </router-link>
      </span>
    </yd-navbar>
    <ul slot='top'>
      <li v-for="(item,index) in tabs" @click="selectTab(index)" :key="index" :style="`color:${mainColor};border-color:${showTab==index?mainColor:'transparent'}`" v-bind:class="showTab==index?'li-active':''">{{item}}
      </li>
    </ul>
    <div v-infinite-scroll="loadList" infinite-scroll-disabled="busy" infinite-scroll-distance="0" infinite-scroll-immediate-check="false"
      style="padding-bottom:.2rem">
      <yd-checkbox-group v-model="selectList">
        <div v-for="(item,index) in listArr" class="list-div" v-bind:key="index">
          <div class="first-div">
            <div class="full" @click="toDetail(item.guid)" ></div>
            <yd-checkbox :val="index" class="myCheckBox" shape="circle">&nbsp;</yd-checkbox>
            <a style="display:inline-block" slot="left">
              <span class="bold-span" :style="item.status == 1?`color:#333`:`color:#999`">{{item.title}}</span>
            </a>
            <span class="pull-right" :style="`color:${mainColor}`" v-if="item.status == 1">正常</span>
            <span class="pull-right" :style="`color:${mainColor}`" v-if="item.status == 2">关闭</span>
            <span class="pull-right" :style="`color:${mainColor}`" v-if="item.status == 3">过期</span>
          </div>
          <div class="second-div">
            <span class="pull-left first-span">{{item.createDate.substr(0,10)}}至{{item.deadline.indexOf('9999')!=-1?"永久":item.deadline.substr(0,10)}}</span>
            <span class="pull-right operate">
              <!-- <span class="edit"  @click="toEdit(index)">
                <img src="../../../../assets/images/rent/circle/eidt.png" alt="">编辑
              </span> -->
              <span class="delete" @click="deleteItem(index,item.guid)">
                <img src="../../../../assets/images/rent/circle/delete.png" alt="">删除
              </span>
            </span>
          </div>
        </div>
      </yd-checkbox-group>
      <!-- 数据加载中提示 -->
      <!-- 数据全部加载完毕显示 -->
      <span v-show="listArr.length == 0" class="noData">暂无数据</span>
      <span slot="doneTip" v-show="loaded && (listArr.length > 0) && busy" class="doneTip">啦啦啦，啦啦啦，没有数据啦~~</span>
    </div>
    <div class="del-post" slot="bottom">
      <img v-if="!allSelected" class="l-left" src="../../../../assets/images/rent/my/unselected_pic.png" alt="" @click="selectAll">
      <img v-if="allSelected" class="l-left" src="../../../../assets/images/rent/my/job_selected.png" alt="" @click="selectAll"> 全选
      <div class="del-btn text-center" @click="deleteItem(-1)">
        删除
      </div>
    </div>
  </yd-layout>
</template>
<script>
import Vue from "vue";
import { Icons } from "vue-ydui/dist/lib.rem/icons";
import { CheckBox, CheckBoxGroup } from "vue-ydui/dist/lib.rem/checkbox";
import "@/assets/css/manager.css";
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
    return {
      userInfo,
      getkey: this.$getkey(),
      pageSize: 15,
      mainColor,
      selectList: [],
      loading: false,
      loaded: false,
      pageCount: 1,
      pageNum: 1,
      tabs: ["全部", "正常", "关闭", "过期"],
      allSelected: false,
      listArr: [],
      showTab: 0,
      busy: false
    };
  },
  methods: {
    // 删除数据
    deleteItem(i, guid) {
      console.log(this.selectList);
      if (i == -1) {
        if (this.selectList && this.selectList.length == 0) {
          return this.$dialog.toast({ mes: "请选择需要删除的列表" });
        }
        if (this.allSelected) {
          this.$dialog.confirm({
            title: "选填标题",
            mes: "是否删除所有帖子",
            opts: () => {
              this.deleteOperate({ bbsIdList: this.getSelectList() }, res => {
                this.$dialog.toast({ mes: "删除成功", timeout: 1000 });
                this.listArr = [];
                this.selectList = [];
                this.allSelected = false;
              });
            }
          });
        } else {
          this.$dialog.confirm({
            title: "选填标题",
            mes: "是否删除选中的帖子",
            opts: () => {
              this.deleteOperate({ bbsIdList: this.getSelectList() }, res => {
                this.$dialog.toast({ mes: "删除成功", timeout: 1000 });
                for (let j = this.selectList.length-1; j>=0; j--) {
                  this.listArr.splice(this.selectList[j], 1);
                }
                this.selectList = [];
                this.allSelected = false;
              });
            }
          });
        }
      } else {
        this.$dialog.confirm({
          title: "选填标题",
          mes: "是否删除当前帖子",
          opts: () => {
            this.deleteOperate({ bbsIdList: guid }, res => {
              this.listArr.splice(i, 1);
              this.$dialog.toast({ mes: "删除成功", timeout: 1000 });
              this.selectList = [];
            });
          }
        });
      }
    },
    getSelectList() {
      let arr = this.selectList;
      let arr1 = [];
      for (let i = 0; i < arr.length; i++) {
       arr1.push(this.listArr[arr[i]].guid);
      }
      return arr1.join(",");
    },
    // 删除帖子
    deleteOperate(data, cb) {
      data = data ? data : {};
      data.token = this.getkey;
      data.userId = this.userInfo.guid;
      this.$ajax(
        `${this.subUrl.sc}/bbs/deleteBBsList`,
        data,
        res => {
          cb && cb();
        },
        this
      );
    },
    // 编辑详情
    toDetail(index) {
      console.log(index);
      this.$router.push(`/circle/my_circle/post_detail/${index}`);
    },
    chooseSuccess() {},
    getList(data, cb) {
      data = data ? data : {};
      data.token = this.getkey;
      data.userId = this.userInfo.guid;
      data.pageSize = this.pageSize ? this.pageSize : 15;
      this.$ajax(
        `${this.subUrl.sc}/bbs/listBbs`,
        data,
        function(res) {
          cb && cb(res);
        },
        this
      );
    },
    selectAll() {
      this.allSelected = !this.allSelected;
      if (this.allSelected) {
        for (var i = 0; i < this.listArr.length; i++) {
          this.selectList.push(i);
        }
      } else {
        this.selectList = [];
      }
    },
    loadList() {
      this.busy = true;
      this.loading = true;
      if (this.timer) {
        clearTimeout(this.timer);
      }
      console.log(this.loaded);
      console.log(this.pageNum >= this.pageCount, this.pageNum, this.pageCount);
      if (this.pageNum >= this.pageCount) {
        this.loaded = true;
        this.$dialog.loading.close();
        this.busy = true;
      } else {
        this.$dialog.loading.open("加载中");
        this.timer = setTimeout(() => {
          this.pageNum = Number(this.pageNum) + 1;
          console.log(this.pageNum, this.pageCount);
          var data = {};
          if (this.showTab > 0) {
            data.status = this.showTab;
          }
          data.pageNo = this.pageNum;
          this.getList(data, res => {
            this.$dialog.loading.close();
            this.$dialog.toast({
              mes: "加载成功",
              timeout: 400,
              icon: "success"
            });
            console.log(this.pageNum, this.pageCount);
            if (this.pageNum >= this.pageCount) {
              this.loaded = true;
            }
            this.listArr = this.listArr.concat(res.data.list);
            console.log(res.data.list);
            // this.listArr = this.listArr.concat(this.listArr.slice(0, 5));
          });
        }, 2000);
      }
    },
    selectTab(index) {
      if (this.showTab == index) {
        return;
      }
      this.showTab = index;
      this.loaded = false;
      this.busy = true;
      this.pageNum = 1;
      this.$dialog.loading.open("加载中");
      this.allSelected = false;
      setTimeout(() => {
        this.$dialog.loading.close();
      }, 3000);
      this.listArr = [];
      var data = {};
      if (index > 0) {
        data.status = index;
      }
      console.log(index);
      data.pageNo = this.pageNum;
      console.log(data);
      this.getList(data, res => {
        this.$dialog.loading.close();
        this.listArr = res.data.list;
        this.pageCount = res.data.pageCount;
        if (this.pageCount == this.pageNum || res.data.list.length == 0) {
          // this.loaded = true;
        }
        this.busy = false;
      });
    },
    cancel() {
      this.$router.go(-1);
    }
  },
  mounted() {
    this.listArrBackUp = this.listArr;
    this.getList({}, res => {
      this.listArr = res.data.list;
      this.pageCount = res.data.pageCount;
    });
    console.log(this.userInfo);
  }
};
</script>
<style scoped>
.l-left {
  height: 0.4rem;
  width: 0.4rem;
}

.editBox {
  /* margin-bottom: 1rem; */
  padding-bottom: 1rem;
}

.lds-ellipsis {
  width: 100%;
  background: #fff;
  height: 0.8rem;
  /* margin-bottom: 1rem!important; */
}

.doneTip {
  display: block;
  text-align: center;
  background: #fff;
  line-height: 0.6rem;
  border-bottom: 1px solid #ddd;
  border-top: 1px solid #ddd;
  margin-top: 0.2rem;
}

ul {
  display: flex;
}

.operate {
  display: flex;
  color: #666;
  font-size: 0.26rem;
}

.operate span {
  display: flex;
  align-items: center;
  margin-left: 0.2rem;
}

.operate img {
  width: 0.33rem;
  height: 0.33rem;
  margin-right: 0.05rem;
}

li {
  font-size: 15px;
  height: 0.9rem;
  background: white;
  line-height: 3em;
  text-align: center;
  flex: 1;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding: 0 0.3rem;
  position: relative;
  border-bottom: 1px solid #ddd;
}

.li-active {
  border-bottom: 3px solid #1ed28c;
  color: #1ed28c;
}

.list-div {
  background: #fff;
  margin-top: 1em;
  min-height: 6em;
}

.list-div .first-div {
  min-height: 4em;
  padding: 1em;
  border-bottom: 1px solid #ddd;
  position: relative;
}
.list-div .first-div .full{
  position: absolute;
  left:1rem;
  right: 0;
  top: 0;
  bottom: 0;
}

.bold-span {
  font-size: 0.32rem;
  color: #333;
}

.list-div .second-div {
  padding-bottom: 2em;
  padding-left: 3em;
  padding-right: 1em;
  padding-top: 0.5em;
}

.second-div .first-span {
  font-size: 0.24rem;
  color: #999999;
}

.l-left {
  height: 0.5rem;
  width: 0.5rem;
}
</style>