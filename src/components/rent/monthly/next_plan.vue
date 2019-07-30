<template>
  <yd-layout class="layout_my">
      <yd-navbar class="header" slot="navbar" v-show="!userAgent.isWX" title="管理处月度报告" color="#fff" :bgcolor="mainColor" height=".88rem">
        <span @click="back" slot="left">
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </span>
      </yd-navbar>
      <div class="tabState">
           <ul>
               <li>
                   <span>工程部</span>
               </li>
               <li>
                   <span>安保部</span>
               </li>
               <li>
                   <span>客服部</span>
               </li>
               <li>
                   <span>财务部</span>
               </li>
               <li>
                   <span>财政人事</span>
               </li>
           </ul>
      </div>
      <yd-infinitescroll :callback="loadList" ref="infinitescrollDemo">
         <div class="contentList" slot="list">
          <!-- <div class="list bgwhite pdlr2 mt2" v-for="(item,index) in contentList" :key="index"> -->
          <div class="list bgwhite pdlr2 mt2" style="border-top:1px solid #E4E5E5;" >
            
            <div class="flex-row-nowrap" style="padding:.2rem 0;" @click="turnTo('/monthly/details')">
              <img  class="document" src="../../../assets/images/rent/estate/document.png" alt="">
              <div style="flex:1;">
                <div class="font30"><span class="nowrap">000000000000000000000000000</span></div>
                <div class="flex font26 foCo9 mt1">
                  <span class="flex" style="align-items:center;"><yd-icon name='rili' custom size='.4rem'></yd-icon>上报时间:2018-1-19</span>
                </div>
              </div>
            </div>
            <!-- <div class="flex-row-nowrap" style="padding:.2rem 0;" @click="turnTo('/estate/serviceList/rectification/details?id=' + item.guid)">
              <img  class="document" src="../../../assets/images/rent/estate/document.png" alt="">
              <div style="flex:1;">
                <div class="font30"><span class="nowrap">{{item.content.length > 20?item.content.substr(0,20) + '...':item.content}}</span></div>
                <div class="flex font26 foCo9 mt1">
                  <span>{{item.customerInfo.buildingName}}</span>
                  <span class="flex"><yd-icon name='rili' custom size='.4rem'></yd-icon>{{item.createTime.substr(0,10)}}</span>
                </div>
              </div>
            </div> -->
          </div>
        </div>
        <span slot="doneTip">啦啦啦，啦啦啦，没有数据啦~~</span>
      </yd-infinitescroll>
  </yd-layout>
</template>
<script>
import Vue from "vue";
import fn from "@/assets/js/product";
import qs from "qs";
import {Tab, TabPanel} from 'vue-ydui/dist/lib.rem/tab';

Vue.component(Tab.name, Tab);
Vue.component(TabPanel.name, TabPanel);
export default {
  data() {
    return {
      currentIndex: -1,
      currentIndex1: -1,
      isFilter: false,
      mainColor: "",
      startTime: this.$addDay(this.$today(), -30),
      endTime: this.$today(),
      // 0关闭 1完成 2经理审批 3客服发布 4客户处理 5复查 6客服关闭 ,
      statusArr: [
        {
          name: "关闭",
          value: 0
        },
        {
          name: "完成",
          value: 1
        },
        {
          name: "经理审批",
          value: 2
        },
        {
          name: "客服发布",
          value: 3
        },
        {
          name: "客户处理",
          value: 4
        },
        {
          name: "复查",
          value: 5
        },
        {
          name: "客服关闭",
          value: 6
        }
      ],
      contentList: [],
      pageNo: 1,
      userInfo:{},
    };
  },

  methods: {
    loadList() {
      this.getMyInvitation();
    },
    confirm() {
      this.pageNo = 1;
      this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
      this.contentList = [];
      this.getMyInvitation();
      this.currentIndex = -1;
      this.isFilter = false;
    },
    chooseIndex(e) {
      this.currentIndex = e;
      this.isFilter = true;
    },
    cancelIndex() {
      this.currentIndex = -1;
      this.isFilter = false;
    },
    turnTo(url) {
      this.$router.push(url);
    },
    back() {
      this.$router.go(-1);
    },
    // 获取邀请信息列表
    getMyInvitation() {
      var data = { userId: this.userId, token: this.$getkey(),pageNo:this.pageNo};
      if (this.startTime) data.startDate = this.startTime + ' 00:00:00';
      if (this.endTime) data.endDate = this.endTime  + ' 23:59:59';
      if(this.currentIndex1 > -1) data.status = this.statusArr[this.currentIndex1].value;
      this.xhr
        .post(
          `${this.subUrl.activity}/rectification/getRectificationList`,
          qs.stringify(data)
        )
        .then(res => {
          if (res.data.code == 1) {
            this.contentList = this.contentList.concat(res.data.data.list);
            this.pageCount = res.data.data.pageCount;
            console.log(this.pageCount,this.pageNo)
            if (this.pageCount > this.pageNo) {
              this.$refs.infinitescrollDemo.$emit(
                "ydui.infinitescroll.finishLoad"
              );
            } else {
              this.$refs.infinitescrollDemo.$emit(
                "ydui.infinitescroll.loadedDone"
              );
            }
            this.pageNo++;
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
    this.getkey = fn.getIng();
    this.getMyInvitation();
  }
};
</script>
<style scoped>
.tabState{width:100%;}
.tabState>ul{width:100%;height:.8rem;display: flex;background: white;justify-content: space-around}
.tabState>ul>li{height:.8rem;display: flex;align-items: center;}

/* 状态筛选 */
.myButton {
  width: 1.56rem;
  border: 1px solid #fff;
}
.timeFilter {
  padding: 0 0.8rem;
}
/*  */
.statusFilte {
  padding: 0.24rem 0.42rem;
  padding-bottom: 0;
}
.myButton {
  margin-right: 0.2rem;
  margin-bottom: 0.2rem;
}
.filter {
  top: 0;
  left: 0;
  right: 0;
  top: 0;
  width: 100%;
  box-sizing: border-box;
  /* padding: 0 0 0.5rem; */
  transform: translate(0, 0);
  background: #f6f6f6;
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

.headTab {
  width: 100%;
  height: 0.9rem;
  background: white;
}
.headTab .flex1 {
  border-bottom: 2px solid #fff;
}
.headTab .flex1.active {
  color: rgb(30, 130, 210);
  border-color: rgb(30, 130, 210);
}
.headTab ul {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row;
}

.headTab ul li {
  width: 25%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.32rem;
}

.contentList {
  width: 100%;
}

.contents {
  width: 100%;
  margin-top: 0.2rem;
  background: white;
  padding: 0.2rem 0.3rem;
  position: relative;
}

.contents > ul {
  width: 100%;
  display: flex;
  flex-flow: row;
  justify-content: space-around;
  align-items: center;
  border-bottom: 1px dashed #bfbfbf;
  height: 0.7rem;
}

.contents > ul > li {
  display: flex;
}

.contents > ul > li:nth-child(1) > span {
  border-radius: 0.04rem;
  font-size: 0.24rem;
}

.contents > ul > li > i {
  width: 0.3rem;
  height: 0.3rem;
  margin-left: 0.1rem;
}

.contents > ul > li > i > img {
  width: 100%;
  height: 100%;
}

.contents > div {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
}

.contents > div > i {
  width: 0.6rem;
  height: 0.6rem;
  margin: 0.1rem 0.25rem;
}

.contents > div > i > img {
  width: 100%;
  height: 100%;
}

.contents > ol {
  display: flex;
  flex-flow: column;
  padding: 0.1rem 0.2rem;
}

.contents > ol > li {
  margin: 0.1rem 0;
}
</style>