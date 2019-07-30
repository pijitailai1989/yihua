<template>
  <yd-layout class="layout_my">
    <yd-navbar class="header" slot="navbar" v-show="!userAgent.isWX" title="供求管理" color="#fff" :bgcolor="mainColor"
               height=".88rem">
      <span @click="back" slot="left">
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </span>
      <div slot="right" @click="$router.push('/supplyManager/add')" v-if="showSend" class="addRightClickArea"
           style="color: #fff;font-size:.6rem;">
        +
      </div>
    </yd-navbar>
    <div class="headTab" slot="top">
      <div class="flex-row h9">
        <div :class='["flex1","jusCenter"]' :style="currentIndex == 0?`border-color:${mainColor};color:${mainColor}`:``"
             @click="chooseIndex(0)">
          <span>起止日期</span>
          <yd-icon name='toDown' v-if="currentIndex != 0" size='.2rem' color='#444' custom></yd-icon>
          <yd-icon name='shangla' v-if="currentIndex == 0" :color='mainColor' size='.2rem' custom></yd-icon>
        </div>
        <div :class='["flex1","jusCenter" ]'
             :style="currentIndex == 1?`border-color:${mainColor};color:${mainColor}`:``" @click="chooseIndex(1)">
          <span>全部状态</span>
          <yd-icon name='toDown' v-if="currentIndex !=1" size='.2rem' color='#444' custom></yd-icon>
          <yd-icon name='shangla' v-if="currentIndex == 1" :color='mainColor' size='.2rem' custom></yd-icon>
        </div>
        <div :class='["flex1","jusCenter" ]'
             :style="currentIndex == 2?`border-color:${mainColor};color:${mainColor}`:``" @click="chooseIndex(2)">
          <span>所有类型</span>
          <yd-icon name='toDown' v-if="currentIndex !=2" size='.2rem' color='#444' custom></yd-icon>
          <yd-icon name='shangla' v-if="currentIndex ==2" :color='mainColor' size='.2rem' custom></yd-icon>
        </div>
      </div>
    </div>
    <div slot="top" class="statusList flex-row-nowrap h8 mt2 center bgwhite">
      <div class="flex1 jusCenter" @click="chooseOrder(index)" v-for="(item,index) in statusList" :key="index"
           style="width:25%">
        <span class="flex"
              :style="currentIndex3 == index?`padding:0 .2rem;color:${mainColor};border-bottom:2px solid ${mainColor};height:100%;`:`padding:0 .2rem;border-bottom:2px solid #fff;height:100%;`">{{item.name}}</span>
      </div>
    </div>
    <div class="mask" style="top:1.78rem" v-if="isFilter" @click="cancelIndex()">
      <div class="filter" @click.stop="''">
        <!-- 筛选时间 -->
        <div class="timeFilter" v-show="currentIndex == 0">
          <div class="flex-row h8">开始时间</div>
          <div class="flex-row h8">
            <yd-datetime class="flex1 bgwhite border pdlr2" style="text-align:center" type="date"
                         v-model="startTime"></yd-datetime>

          </div>
          <div class="flex-row h8">结束时间</div>
          <div class="flex-row h8">
            <yd-datetime class="flex1 bgwhite border pdlr2" type="date" v-model="endTime"></yd-datetime>
          </div>
        </div>
        <div class="filterChild depList" v-show='currentIndex == 1'>
          <div class="flex-row center  pdlr2 h8" style="padding:0 .6rem 0 0.3rem" @click='chooseType(index)'
               v-for='item,index in chooseList'>
            <span>{{item.name}}</span>
            <yd-icon name='selected' size='.5rem' :color='mainColor' v-show='item.selected' custom></yd-icon>
          </div>
        </div>
        <div class="filterChild" v-show='currentIndex == 2'>
          <div class="flex-row center  pdlr2 h8" style="padding:0 .6rem 0 0.3rem" @click='chooseType1(index)'
               v-for='item,index in allType'>
            <span>{{item.name}}</span>
            <yd-icon name='selected' size='.5rem' :color='mainColor' v-show='item.selected' custom></yd-icon>
          </div>
        </div>
        <div class="flex-row h9 bgwhite bt font32" style="margin-top:.3rem;">
          <div class="flex1 jusCenter br" @click="cancelIndex()">取消</div>
          <div class="flex1 jusCenter" @click="confirm()" :style="{color:mainColor}">确定</div>
        </div>
        <!-- <yd-button type='hollow' class="mt2">确定</yd-button> -->
      </div>
    </div>
    <yd-infinitescroll :callback="loadList" ref="infinitescrollDemo">
      <div class="contentList" slot="list">
        <div class="list bgwhite pdlr2 mt2" @click="turnTo('/supplyManager/detail?guid=' + item.guid)"
             v-for="(item,index) in contentList" :key="index">
          <ul class="font26 flex-row" style="color:#333;border-bottom:1px dashed #ddd;justify-content:space-between">
            <li class="flex-row foCo6">
              <img style="width:.5rem;height:.4rem;" class="mr1"
                   src="../../../../../assets/images/rent/estate/leibie.png" alt="">
              {{item.type==1?"采购":"供应"}}
            </li>
            <li>
              <!--  状态 0:关闭, 1:完成, 2:草稿 3:待批 4:同意 5:不同意 , , -->
              <span class="pdlr1 state stateClose" v-if="item.status == 0">关闭</span>
              <span class="pdlr1 state state1" v-if="item.status == 1">完成</span>
              <span class="pdlr1 state state2" v-if="item.status == 2">草稿</span>
              <span class="pdlr1 state state2" v-if="item.status == 3">待审批</span>
              <span class="pdlr1 state state1" v-if="item.status == 4">同意</span>
              <span class="pdlr1 state state0" v-if="item.status == 5">不同意</span>
            </li>
          </ul>
          <div class="flex-row-nowrap" style="padding:.2rem 0;">
            <!--<img  class="document" src="../../../../../assets/images/rent/estate/document.png" alt="">-->
            <div style="flex:1;">
              <div class="font30"><span class="nowrap">{{item.title.length > 20?item.title.substr(0,20) + '...':item.title}}</span>
              </div>
              <div class="flex font26 foCo9 mt1">
                <span class="flex"><yd-icon name="bumen" size=".3rem" color="#999" class="mr1" custom></yd-icon>{{item.userInfo.deptName}}</span>
                <span class="flex" v-if="item.userInfo">
                  <img src="../../../../../assets/images/rent/ent/human.png" width="10"></img>
                  {{item.userInfo.name}}
                </span>
                <span class="flex" v-if="item.createTime"><yd-icon name='rili' custom size='.4rem'></yd-icon>{{item.createTime.substr(0,10)}}</span>
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
        currentIndex2: -1,
        currentIndex3: -1,
        isFilter: false,
        mainColor: "",
        startTime: this.$addDay(this.$today(), -30),
        endTime: this.$today(),
        chooseList: [
          {
            name: "所有部门",
            value: -1,
            selected: false
          },
          // {
          //   name: "总经办",
          //   value: 1,
          //   selected: false
          // },
          // {
          //   name: "行政部",
          //   value: 2,
          //   selected: false
          // },
          // {
          //   name: "工程部",
          //   value: 3,
          //   selected: false
          // },
          // {
          //   name: "客服部",
          //   value: 4,
          //   selected: false
          // }
        ],
        allType: [
          {
            name: "全部",
            value: -1,
            selected: false
          },
          {
            name: "供应",
            value: 1,
            selected: false
          },
          {
            name: "采购",
            value: 2,
            selected: false
          }
        ],
        // 0关闭 1完成 2经理审批 3客服发布 4客户处理 5复查 6客服关闭 ,
        statusList: [
          {name: "全部", value: -1},
          {name: "待审批", value: 3},
          {name: "同意", value: 4},
          {name: "不同意", value: 5}
        ],
        //  0：完成，1:关闭 2:草稿，3:客服分配，4:经理分配，5:派单，6:抢单，7:分单，8:处理，9:用户评价，10:客服评价关闭， ,
        statusArr: [
          {
            name: "完成",
            value: 0
          },
          {
            name: "关闭",
            value: 1
          },
          {
            name: "草稿",
            value: 2
          },
          {
            name: "客服分配",
            value: 3
          },
          {
            name: "经理分配",
            value: 4
          },
          {
            name: "派单",
            value: 5
          },
          {
            name: "抢单",
            value: 6
          },
          {
            name: "分单",
            value: 7
          },
          {
            name: "处理",
            value: 8
          },
          {
            name: "用户评价",
            value: 9
          },
          {
            name: "客服关闭评价",
            value: 10
          }
        ],
        contentList: [],
        pageNo: 1,
        currentIndex1: -1,
        currentIndex2: -1,
        showSend: false,
      };
    },

    methods: {
      getUserRoot() {
        this.$ajax(
          `${this.subUrl.user}/user/getPermissions`,
          {userId: this.userInfo.guid, token: this.$getkey()},
          res => {
            console.log(res.data.workbench.subclass);
            this.isShow = true;
            for (var i of res.data.workbench.subclass) {
              if (i.name == "供求管理") {
                for (var j of i.subclass) {
                  if (j.name == "发布") {
                    this.showSend = true;
                  }
                }
              }
            }
          },
          this
        );
      },
      chooseOrder(index) {
        this.currentIndex3 = index;
        this.pageNo = 1;
        this.$refs.infinitescrollDemo.$emit("ydui.infinitescroll.reInit");
        this.contentList = [];
        this.getMyInvitation();
      },
      chooseType(e) {
        for (var i in this.chooseList) {
          if (e == i) {
            this.$set(this.chooseList[i], "selected", true);
          } else {
            this.$set(this.chooseList[i], "selected", false);
          }
        }
        console.log(this.chooseList);
        this.currentIndex1 = e;
      },
      chooseType1(e) {
        for (var i in this.allType) {
          if (e == i) {
            this.$set(this.allType[i], "selected", true);
          } else {
            this.$set(this.allType[i], "selected", false);
          }
        }
        console.log(this.allType);
        this.currentIndex2 = e;
      },
      loadList() {
        this.getMyInvitation();
      },
      confirm() {
        this.pageNo = 1;
        this.$refs.infinitescrollDemo.$emit("ydui.infinitescroll.reInit");
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
        var data = {
          userId: this.userId,
          token: this.$getkey(),
          aaType: this.userInfo.postType <= 2 ? 2 : 1,
          pageNo: this.pageNo
        };
        if (this.startTime) data.startDate = this.startTime + " 00:00:00";
        if (this.endTime) data.endDate = this.endTime + " 23:59:59";
        if (this.currentIndex1 > 0)
          data.deptId = this.chooseList[this.currentIndex1].value;
        if (this.currentIndex2 > 0) {
          data.type = this.allType[this.currentIndex2].value;
        }
        if (this.currentIndex3 > 0) {
          data.status = this.statusList[this.currentIndex3].value;
        }
        this.xhr
          .post(
            `${this.subUrl.activity}/pasa/pasaList`,
            qs.stringify(data)
          )
          .then(res => {
            if (res.data.code == 1) {
              this.contentList = this.contentList.concat(res.data.data.list);
              this.pageCount = res.data.data.pageCount;
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
              this.$dialog.toast({mes: res.data.msg});
            }
          });
      },
      getDepartMent() {
        let data = {
          token: this.$getkey(),
          userId: this.userInfo.guid,
          organId: this.organInfo.guid,
        }
        this.$ajax(`${this.subUrl.user}/admin/deptManage/organDepartmentInfo`, data, res => {
          console.log(res, '====')
          for (var i of res.data) {
            this.chooseList.push({
              name: i.deptName,
              value: i.guid,
              selected: false,
            })
          }
        }, this);
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
      this.getUserRoot();
      this.getDepartMent();

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

  .depList {
    max-height: 4rem;
    overflow-y: auto;
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
