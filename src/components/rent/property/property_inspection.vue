<template>
  <yd-layout class="layout_my">
      <yd-navbar class="header" slot="navbar" v-show="!userAgent.isWX" v-title="'物业稽查'" title="物业稽查" color="#fff" :bgcolor="mainColor" height=".88rem">
      <span @click="back" slot="left">
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </span>
         <span @click="turnTo('/property/audit_report')" slot="right" class="edit spanRight addRightClickArea" style="color: #fff;font-size:.6rem;">+</span>
      </yd-navbar>
     <div class="headTab" slot="top">
      <div class="flex-row h9">
        <div :class='["flex1","jusCenter" ,{active:currentIndex == 0}]' :style="currentIndex == 0?`color:${mainColor};border-bottom:2px solid ${mainColor}`:``" @click="chooseIndex(0)">
          <span>起止日期</span>
           <yd-icon name='toDown' v-if="currentIndex != 0" size='.2rem' color='#444' custom></yd-icon>
           <yd-icon name='shangla' v-if="currentIndex == 0" :color='mainColor' size='.2rem' custom></yd-icon>
        </div>
        <div :class='["flex1","jusCenter" ,{active:currentIndex == 1}]' :style="currentIndex == 1?`color:${mainColor};border-bottom:2px solid ${mainColor}`:``" @click="chooseIndex(1)">
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
           <yd-button v-for="(item,index) in statusArr" :key="index" @click.native="currentIndex1 == index?currentIndex1= -1:currentIndex1 = index" type='hollow' :style="currentIndex1 == index?`border:1px solid ${mainColor};color:${mainColor}`:``" :class="['myButton',{active:index == currentIndex1}]" >
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
    <yd-infinitescroll :callback="loadList" ref="infinitescrollDemo">
         <div class="contentList" slot="list">
          <div class="list bgwhite pdlr2 mt2" v-for="(item,index) in contentList" :key="index">
            <ul class="font26 flex-row" style="color:#333;border-bottom:1px dashed #ddd;justify-content:space-between">
              <li class="flex-row foCo6">
                <img style="width:.5rem;height:.4rem;" class="mr1" src="../../../assets/images/rent/estate/leibie.png" alt="">
                {{item.guid}}
                </li>
              <li>
                <span class="pdlr1 state state0" v-if="item.status == 0">草稿</span>
                <span class="pdlr1 state state1" v-if="item.status == 1">已下发</span>
                <span class="pdlr1 state state2" v-if="item.status == 2">已回复</span>
                <span class="pdlr1 state state3" v-if="item.status == 3">关闭</span>
              </li>
            </ul>
            <div class="flex-row-nowrap" style="padding:.2rem 0;" @click="turnTo('/property/inspection_details?guid=' + item.guid)">
              <img  class="document" src="../../../assets/images/rent/estate/document.png" alt="">
              <div style="flex:1;">
                <div class="font30"><span class="nowrap">{{item.title.length > 20?item.title.substr(0,20) + '...':item.title}}</span></div>
                <div class="flex font26 foCo9 mt1">
                  <span class="textHidden" style="width:4rem;">{{item.examineObjName}}</span>
                  <span class="flex" v-if="item.createDate"><yd-icon name='rili' custom size='.4rem'></yd-icon>{{item.createDate.split(' ')[0]}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <span slot="doneTip">啦啦啦，啦啦啦，没有数据啦~~</span>
        <!-- <img slot="loadingTip" src="http://static.ydcss.com/uploads/ydui/loading/loading10.svg"/> -->
    </yd-infinitescroll>
  </yd-layout>
</template>
<script>
import Vue from "vue";
import fn from "@/assets/js/product";
import qs from "qs";
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
          name: "草稿",
          value: 0
        },
        {
          name: "已下发",
          value: 1
        },
        {
          name: "已回复",
          value: 2
        },
        {
          name: "关闭",
          value: 3
        },
      ],
      contentList: [],
      pageNo: 1,
      pageSize:6,
      organId:'',
      userInfo:{},
    };
  },

  methods: {
    loadList() {
      this.listProExamine();
    },
    confirm() {
      this.pageNo = 1;
      this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
      this.contentList = [];
      this.listProExamine();
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
    // 获取信息列表
    listProExamine() {
      var data = { userId: this.userId, token: this.$getkey(),pageNo:this.pageNo,pageSize:this.pageSize,organId:this.organId};
      if (this.startTime) data.startDate = this.startTime + ' 00:00:00';
      if (this.endTime) data.endDate = this.endTime  + ' 23:59:59';
      if(this.currentIndex1 > -1) data.status = this.statusArr[this.currentIndex1].value;
      this.xhr.post(`${this.subUrl.activity}/propertyExamine/listProExamine`,
          qs.stringify(data)
        )
        .then(res => {
          if (res.data.code == 1) {
            this.pageCount = res.data.data.pageCount;

            console.log(this.pageCount)
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
    this.organId = this.organInfo.guid;
    this.userId = this.userInfo.guid;
    this.getkey = fn.getIng();
    this.listProExamine();
  }
};
</script>
<style scoped>
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
  padding: 0.1rem 0.2rem;
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