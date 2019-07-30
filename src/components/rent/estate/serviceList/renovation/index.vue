<template>
  <yd-layout class="layout_my">
      <yd-navbar class="header" slot="navbar" v-title="'装修管理'" v-show="!userAgent.isWX" title="装修管理" color="#fff" :bgcolor="mainColor" height=".88rem">
        <span class="spanLeft" @click="back" slot="left">
          <span>
            <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
          </span>
        </span>
        <span @click="turnTo('/estate/serviceList/renovation/declares')" slot="right" class="edit spanRight" style="color: #fff;font-size:.6rem;">+</span>
      </yd-navbar>
    <div class="search">
      <div>
        <i @click="searchFn">
          <img src="../../../../../assets/images/rent/my/search.png" alt="">
        </i>
        <span>
          <input type="foCo3 " placeholder="请输入关键字或编码" v-model="screen.content" @keyup.enter="search">
        </span>
      </div>
      <div @click="toggle">筛选</div>
    </div>
    <div v-show="show1" class="screen">
      <ul>
        <li>
          <p>起止时间</p>
        </li>
        <li>
          <span>
            <yd-datetime type="date" v-model="screen.startDate" slot="right"></yd-datetime>
          </span>
          <i>-</i>
          <span>
            <yd-datetime type="date" v-model="screen.endDate" slot="right"></yd-datetime>
          </span>
        </li>
        <li>
          <p>状态</p>
        </li>
        <li>
          <a v-for="(item,index) in status" :key="index" @click="toggle1(index)" :style="screen.status==item.id?'border:1px solid '+mainColor:''">{{item.name}}</a>
        </li>
        <li>
          <button @click="toggle">取消</button>
          <button @click="Determine" class="aa">确定</button>
        </li>
      </ul>
    </div>

    <div class="contentList" @scroll="scrollHandler" ref="listDom">
      <div class="content" v-for="(item,index) in contentList" :key="index" @click="turnTo('/estate/serviceList/renovation/details?guid='+item.guid)">
        <div class="top">
          <p>{{item.startDate?item.startDate.replace(/-/g,"/"):""}}-{{item.endDate?item.endDate.replace(/-/g,"/"):""}}</p>
          <!-- <span>单号：{{item.guid}}</span> -->
          <!-- <span v-show="item.status!=null" :style="{border:'1px solid '+mainColor,color:mainColor}">{{item.statusName}}</span> -->
          <!-- <span v-show="item.status!=null" :style="{border:'1px solid '+mainColor,color:mainColor}">{{item.statusName}}</span> -->
          <!-- 进行中，2:经理审批，3：处理中，4：待执行人确认:5：完成，6：关闭，7：不同意 -->
          <span v-if="item.status == 1" class="pdlr1 state state2">进行中</span>
          <span v-if="item.status == 2" class="pdlr1 state state3">经理审批</span>
          <span v-if="item.status == 3" class="pdlr1 state state2">处理中</span>
          <span v-if="item.status == 4" class="pdlr1 state state2">执行人确认</span>
          <span v-if="item.status == 5" class="pdlr1 state state1">完成</span>
          <span v-if="item.status == 6" class="pdlr1 state stateClose">关闭</span>
          <span v-if="item.status == 7" class="pdlr1 state state2">不同意</span>
          <!-- <span v-if="item.status == 1" class="state state5">进行中</span> -->
        </div>
        <div class="bottom">
          <img src="../../../../../assets/images/rent/estate/document.png"  style="margin-top:.2rem;width:.65rem;height:.85rem;" alt="">
          <p>
            <span style="width:6rem" class="textHidden">{{item.description}}</span>
            <a style="display:flex;align-items:center;width:100%;justify-content:space-between">{{item.ridName}}{{item.unitName}}
              <span class="">{{item.tenementName}}</span>
              <span style="float:right;display:flex;align-items:center">
                <yd-icon name='rili' custom size='.4rem' class="mr1"></yd-icon>
               {{item.createDate}}
              </span>
            </a>
          </p>
        </div>

      </div>
      <div class="Section">
        <div v-if="pageNo <= pageCount">
          <div class="a b1">
            <ul>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>
        <div v-else>啦啦啦，啦啦啦，没有数据啦~~</div>
      </div>
    </div>
  </yd-layout>
</template>
<script>
import Vue from "vue";
import fn from "@/assets/js/product";
import qs from "qs";
import { DateTime } from "vue-ydui/dist/lib.rem/datetime";
import store from "@/store";
Vue.component(DateTime.name, DateTime);
export default {
  data() {
    return {
      mainColor: "",
      contentList: [],
      userId: "",
      getkey: "",
      organId: "",
      organType: "",
      show1: false,
      screen: {
        startDate: this.$addDay(this.$today(), -30),
        endDate: this.$today(0),
        content: "",
        status: null
      },
      // 1：进行中，2:经理审批，3：处理中，4：完成，5：关闭，6：不同意
      status: [
        { id: 1, name: "进行中" },
        { id: 2, name: "经理审批" },
        { id: 3, name: "处理中" },
        { id: 4, name: "执行人确认" },
        { id: 5, name: "完成" },
        { id: 6, name: "关闭" },
        { id: 7, name: "不同意" },
      ],
      pageNo: 1,
      pageSize: 5,
      pageCount: null
    };
  },
  methods: {
    // 搜索
    searchFn() {
      console.log("搜索");
    },
    scrollHandler() {
      if (store.loading || this.pageNo > this.pageCount) {
        return;
      }
      let listDom = this.$refs.listDom;
      if (
        listDom.scrollHeight - listDom.scrollTop - listDom.clientHeight <
        100
      ) {
        this.listDecoration();
      }
    },
    toggle1(index) {
      this.screen.status = this.status[index].id;
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
    // 获取信息列表
    Determine() {
      this.pageNo = 1;
      this.listDecoration();
      this.show1 = false;
    },
    search() {
      this.pageNo = 1;
      this.listDecoration();
    },
    listDecoration() {
      if (this.show1) {
        var data = {
          token: this.getkey,
          userId: this.userId,
          organId: this.organId,
          organType: this.organType,
          startDate: this.screen.startDate + " 00:00:00",
          endDate: this.screen.endDate + " 23:59:59",
          pageNo: this.pageNo,
          pageSize: this.pageSize
        };
        if (this.screen.status != null) {
          data.status = this.screen.status;
        }
      } else {
        var data = {
          token: this.getkey,
          userId: this.userId,
          organId: this.organId,
          organType: this.organType,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        };
        if (this.screen.content != null) {
          data.content = this.screen.content;
        }
      }

      this.xhr
        .post(
          `${this.subUrl.activity}/decoration/listDecoration`,
          qs.stringify(data)
        )
        .then(res => {
          if (res.data.code == 1) {
            if (res.data.data.list != null) {
              res.data.data.list.forEach(element => {
                if(element.startDate){
                  element.startDate = element.startDate.split(" ")[0];
                }
                if (element.endDate) {
                  element.endDate = element.endDate.split(" ")[0];
                }
                if (element.createDate) {
                  element.createDate = element.createDate.split(" ")[0];
                }
                if (element.status == 1) {
                  element.statusName = "进行中";
                } else if (element.status == 2) {
                  element.statusName = "经理审批";
                } else if (element.status == 3) {
                  element.statusName = "处理中";
                } else if (element.status == 4) {
                  element.statusName = "完成";
                } else if (element.status == 5) {
                  element.statusName = "关闭";
                } else if (element.status == 6) {
                  element.statusName = "不同意";
                }
              });
              this.pageCount = res.data.data.pageCount;
              if (this.pageNo >= 2) {
                this.contentList = this.contentList.concat(res.data.data.list);
              } else {
                this.contentList = res.data.data.list;
              }

              this.pageNo++;
            }
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
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.mainColor = this.$color[this.userInfo.organType];
    this.userId = this.userInfo.guid;
    this.organId = this.organInfo.guid;
    this.organType = this.organInfo.organType;
    this.getkey = fn.getIng();
    this.listDecoration();

    let listDom = this.$refs.listDom;
    console.log(listDom.scrollHeight, listDom.scrollTop, listDom.clientHeight);
  }
};
</script>
<style scoped>
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
  height: calc(100vh - 1.85rem);
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
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  font-size: 0.24rem;
}

.top > p {
  height: 0.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
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

.cc {
  margin-left: 0.8rem;
}

.bottom {
  display: flex;
  flex-flow: row;
  padding: 0.1rem 0 0.1rem 0.1rem;
}

.bottom > i {
  width: 1rem;
  height: 1.2rem;
}

.bottom > i > img {
  width: 100%;
  height: 100%;
}

.bottom > p {
  flex: 1;
  display: flex;
  flex-flow: column;
  justify-content: center;
  padding: 0 0.2rem;
}

.bottom > p > a {
  font-size: 0.24rem;
  color: #747474;
  padding: 0.1rem 0;
}

.bottom > p > span {
  font-size: 0.32rem;
  color: #000;
  padding: 0.1rem 0;
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
  border-radius: 0.04rem;
  font-size: 0.22rem;
  padding: 0.02rem 0.1rem;
}

.bottom > span > p {
  display: flex;
  font-size: 0.24rem;
  height: 0.5rem;
  color: #747474;
}
</style>
