<template>
  <yd-layout class="layout_my">
      <yd-navbar class="header" slot="navbar" v-title="'放行条'"  v-show="!userAgent.isWX" title="放行条" color="#fff" :bgcolor="mainColor" height=".88rem">
        <span class="spanLeft" @click="back" slot="left">
          <span>
            <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
          </span>
        </span>
        <span @click="addshow" slot="right" class="edit spanRight" style="color: #fff;font-size:.6rem;">+</span>
      </yd-navbar>
    <div class="headTab" slot="top">
        <div class="flex-row h9 bgwhite">
          <div :class='["flex1","jusCenter",{active:currentIndex == 0}]' :style="currentIndex == 0?`color:${mainColor};border-bottom:2px solid ${mainColor}`:`border-bottom:2px solid #fff`" @click="chooseIndex(0)">
            <span>起止日期</span>
            <yd-icon name='toDown' v-if="currentIndex != 0" size='.2rem' color='#444' custom></yd-icon>
            <yd-icon name='shangla' v-if="currentIndex == 0" :color='mainColor' size='.2rem' custom></yd-icon>
          </div>
          <div :class='["flex1","jusCenter",{active:currentIndex == 1}]' :style="currentIndex == 1?`color:${mainColor};border-bottom:2px solid ${mainColor}`:`border-bottom:2px solid #FFF`" @click="chooseIndex(1)">
            <span>全部状态</span>
            <yd-icon name='toDown' v-if="currentIndex !=1" size='.2rem' color='#444' custom></yd-icon>
            <yd-icon name='shangla' v-if="currentIndex == 1" :color='mainColor' size='.2rem' custom></yd-icon>
          </div>
        </div>
       </div>
    <div class="mask" style="top:1.78rem" v-if="isFilter" @click="cancelIndex()">
      <div class="filter" @click.stop="''">
        <!-- 筛选时间 -->
        <div class="timeFilter" v-show="currentIndex == 0">
          <div class="flex-row h8">开始时间</div>
          <div class="flex-row h8">
             <yd-datetime  class="flex1 bgwhite border pdlr2" style="text-align:center" type="date" v-model="startTime"></yd-datetime>

          </div>
          <div class="flex-row h8">结束时间</div>
          <div class="flex-row h8">
             <yd-datetime  class="flex1 bgwhite border pdlr2"  type="date" v-model="endTime"></yd-datetime>
          </div>
        </div>
         <!-- 筛选状态 -->
         <div class="flex-row statusFilte flex-start" v-show="currentIndex == 1">
           <yd-button v-for="(item,index) in statusArr" style="border:1px solid #ddd" :key="index" @click.native="currentIndex1 == index?currentIndex1= -1:currentIndex1 = index" type='hollow' :style="currentIndex1 == index?`border:1px solid ${mainColor};color:${mainColor}`:``" :class="['myButton',{active:index == currentIndex1}]" >
             {{item.name}}
           </yd-button>
         </div>

          <div class="flex-row h9 bgwhite bt font32" style="margin-top:.3rem;">
            <div class="flex1 jusCenter br"  @click="cancelIndex()">取消</div>
            <div class="flex1 jusCenter" @click="confirm()" :style="{color:mainColor}">确定</div>
          </div>
          <!-- <yd-button type='hollow' class="mt2">确定</yd-button> -->
        </div>
    </div>
    <div class="contentList" @scroll="scrollHandler" ref="listDom">
      <div class="content" v-for="(item,index) in contentList" :key="index" @click="turnTo('/estate/serviceList/wuye/release_pass/details?guid='+item.guid)">
        <div class="top">
          <p><img style="width:.4rem;height:.3rem;" class="mr1 flex" src="../../../../../../assets/images/rent/estate/leibie.png" alt="">
          <!-- 类型：{{item.type}} -->
          <span>{{item.type==1?"人员":"物品"}}</span>
          </p>

          <!-- 0:不同意 1:同意 2：经理审批中 3：客服审批中 , -->
          <span class="pdlr1 state state0" v-if="item.status == 0">不同意</span>
          <span class="pdlr1 state state1" v-if="item.status == 1">同意</span>
          <span class="pdlr1 state state2" v-if="item.status == 2">经理审批中</span>
          <span class="pdlr1 state state3" v-if="item.status == 3">客服审批中</span>
        </div>
        <div class="bottom flex">
            <img src="../../../../../../assets/images/rent/estate/document.png" style="width:.65rem;height:.85rem;" alt="">
            <div class="pdlr2" style="flex:1">
              <div class="font30">{{item.releaseName}}</div>
              <div class="font26 foCo9 flex mt1">
                <div class="flex flex-start">
                  <img class="mr2" style="width:.22rem;height:.26rem;" src="../../../../../../assets/images/rent/estate/person.png" alt="">
                  <span>办理人：</span>
                  <span>{{item.clientInfo.name}}</span>
                </div>
                <div class="flex flex-end">
                  <yd-icon name='rili' custom size='.4rem'></yd-icon>
                  <span v-if="item.createDate">{{item.createDate.substr(0,10)}}</span>
                </div>
              </div>
            </div>
        </div>

      </div>
      <div class="Section">
        <div v-if="pageNo <= pageCount">
          <div class="a b1" v-if="pageNo!=1">
            <ul>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>

        </div>
        <div v-else>啦啦啦，啦啦啦，没有数据啦~~</div>
      </div>

      <div class="addSan" v-show="sanShow" @click="toggle2">
       <ul class="font30">
         <li @click="turnTo('/estate/serviceList/wuye/release_pass/declares#1')">办理访客出入</li>
         <li @click="turnTo('/estate/serviceList/wuye/release_pass/declares#2')">办理物品放行</li>
       </ul>
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
      currentIndex: -1,
      currentIndex1: -1,
      isFilter: false,
      startTime: this.$addDay(this.$today(), -30),
      endTime: this.$today(),
      organId: "",
      organType: "",
      show1: false,
      screen: {
        startDate: this.$today(0),
        endDate: this.$today(0),
        status: null
      },
      //  0:不同意 1:同意 2：经理审批中 3：客服审批中 ,
      statusArr: [
        {
          name: "不同意",
          value: 0
        },
        {
          name: "同意",
          value: 1
        },
        {
          name: "经理审批",
          value: 2
        },
        {
          name: "客服审批",
          value: 3
        }
      ],
      // status: [
      //   { id: 1, name: "进行中" },
      //   { id: 2, name: "已完成" },
      //   { id: 3, name: "关闭" }
      // ],
      pageNo: 1,
      pageSize: 6,
      pageCount: 2,
      sanShow: false
    };
  },
  methods: {
    confirm(){
      this.pageNo = 1;
      this.contentList = [];
      this.listReleasePass();
      this.isFilter = false;
      this.currentIndex = -1;

    },
    chooseIndex(e) {
      this.currentIndex = e;
      this.isFilter = true;
    },
    cancelIndex() {
      this.currentIndex = -1;
      this.isFilter = false;
    },
    toggle2() {
      this.sanShow = !this.sanShow;
    },
    addshow() {
      this.sanShow = true;
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
        this.listReleasePass();
      }
    },
    toggle1(index) {
      this.screen.status = this.status[index].id;
    },
    toggle() {
      this.show1 = !this.show1;
      localStorage.setItem("rows", encodeURIComponent(JSON.stringify([])));
      localStorage.setItem("imgUrls", encodeURIComponent(JSON.stringify([])));
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
      this.listReleasePass();
      this.show1 = false;
    },
    search() {
      this.pageNo = 1;
      this.listReleasePass();
    },
    listReleasePass() {
      var data = {
        token: this.getkey,
        userId: this.userId,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };
      if(this.startTime) data.startDate = this.startTime + ' 00:00:00'
      if(this.endTime) data.endDate = this.endTime + ' 23:59:59'
      if(this.currentIndex1 > -1){
        data.status = this.statusArr[this.currentIndex1].value;
      }
      this.xhr
        .post(
          `${this.subUrl.activity}/releasePass/listReleasePass`,
          qs.stringify(data)
        )
        .then(res => {
          if (res.data.code == 1) {
            if (res.data.data.list != null) {
              console.log(res.data.data.list);
              res.data.data.list.forEach(element => {
                element.createDate = element.createDate.split(" ")[0];
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
    this.listReleasePass();

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

.contentList {
  width: 100%;
  height: calc(100vh - 0.88rem);
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
  display: flex;
}

.bottom {
  display: flex;
  flex-flow: row;
  padding: 0.1rem 0;
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
  margin-bottom: 0.3rem;
  border-radius: 0.04rem;
  font-size: 0.22rem;
  padding: 0.02rem 0.1rem;
}

.bottom > span > p {
  display: flex;
  font-size: 0.24rem;
  color: #747474;
}

.cc > i,
.bottom > span > p > i {
  height: 0.3rem;
  width: 0.3rem;
  margin-right: 0.1rem;
}

.cc > i > img,
.bottom > span > p > i > img {
  width: 100%;
  height: 100%;
}

.addSan {
  width: 100vw;
  height: 100vh;
  position: absolute;
  background: rgba(0, 0, 0, 0);
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}
.addSan ul {
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
  z-index: 1001;
}
.addSan ul li:nth-child(1) {
  border-bottom: 1px solid #e5e5e5;
  position: relative;
  z-index: 666;
}
.addSan ul li:nth-child(1) > span {
  display: flex;
  width: 0.25rem;
  height: 0.25rem;
  position: absolute;
  top: -0.25rem;
  z-index: 555;
  right: 0.15rem;
}
.addSan ul li:nth-child(1) > span > img {
  width: 100%;
  height: 100%;
}
.addSan ul li {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 0.8rem;
}
</style>
