<template>
  <yd-layout class="layout_my">
    <yd-navbar class="header" slot="navbar" v-show="!userAgent.isWX" :title="mTitle" color="#fff" :bgcolor="mainColor"
               height=".88rem">
      <span @click="back" slot="left">
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </span>
      <div slot="right" @click="showAdd = true" v-if="userInfo.postType*1 >= 3" class="addRightClickArea"
           style="color: #fff;font-size:.6rem;">
        +
      </div>
    </yd-navbar>
    <div class="mask" slot="top" style="z-index:1003" v-show="showAdd" @click="showAdd=false">
      <div class="list" @click="''">
        <!--类型 1：日报；2：周报；3：月报-->
        <div @click="$router.push('/taskreplay/add?type=1')">新建日报</div>
        <div @click="$router.push('/taskreplay/add?type=2')">新建周报</div>
        <div @click="$router.push('/taskreplay/add?type=3')">新建月报</div>
      </div>
    </div>
    <div class="headTab" slot="top">
      <div class="flex-row h9">
        <div :class='["flex1","jusCenter"]' :style="currentIndex == 0?`border-color:${mainColor};color:${mainColor}`:``"
             @click="chooseIndex(0)">
          <span>起止日期</span>
          <yd-icon name='toDown' v-if="currentIndex != 0" size='.2rem' color='#444' custom></yd-icon>
          <yd-icon name='shangla' v-if="currentIndex == 0" :color='mainColor' size='.2rem' custom></yd-icon>
        </div>
        <div v-if="userInfo.postType == 2" :class='["flex1","jusCenter" ]'
             :style="currentIndex == 1?`border-color:${mainColor};color:${mainColor}`:``" @click="chooseIndex(1)">
          <span>所有部门</span>
          <yd-icon name='toDown' v-if="currentIndex !=1" size='.2rem' color='#444' custom></yd-icon>
          <yd-icon name='shangla' v-if="currentIndex == 1" :color='mainColor' size='.2rem' custom></yd-icon>
        </div>
        <div v-if="userInfo.postType == 3" :class='["flex1","jusCenter" ]'
             :style="currentIndex == 4?`border-color:${mainColor};color:${mainColor}`:``" @click="chooseIndex(4)">
          <span>所有人员</span>
          <yd-icon name='toDown' v-if="currentIndex !=4" size='.2rem' color='#444' custom></yd-icon>
          <yd-icon name='shangla' v-if="currentIndex == 4" :color='mainColor' size='.2rem' custom></yd-icon>
        </div>
        <div :class='["flex1","jusCenter" ]'
             :style="currentIndex == 2?`border-color:${mainColor};color:${mainColor}`:``" @click="chooseIndex(2)">
          <span>所有例报</span>
          <yd-icon name='toDown' v-if="currentIndex !=2" size='.2rem' color='#444' custom></yd-icon>
          <yd-icon name='shangla' v-if="currentIndex ==2" :color='mainColor' size='.2rem' custom></yd-icon>
        </div>
        <div v-if="userInfo.postType == 3" :class='["flex1","jusCenter" ]'
             :style="currentIndex == 3?`border-color:${mainColor};color:${mainColor}`:``" @click="chooseIndex(3)">
          <span>{{currentReport.name}}</span>
          <yd-icon name='toDown' v-if="currentIndex !=3" size='.2rem' color='#444' custom></yd-icon>
          <yd-icon name='shangla' v-if="currentIndex ==3" :color='mainColor' size='.2rem' custom></yd-icon>
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
        <!--所有人员-->
        <div class="filterChild depList" v-show='currentIndex == 4'>
          <div class="flex-row center  pdlr2 h8" style="padding:0 .6rem 0 0.3rem" @click='chooseMenber(index)'
               v-for='item,index in emtList'>
            <span>{{item.name}}</span>
            <yd-icon name='selected' size='.5rem' :color='mainColor' v-show='item.selected' custom></yd-icon>
          </div>
        </div>
        <!--选择汇报或审批-->
        <div class="filterChild" v-show='currentIndex == 3'>
          <div class="flex-row center  pdlr2 h8" style="padding:0 .6rem 0 0.3rem" @click='chooseType2(index)'
               v-for='item,index in dataTypeList'>
            <span>{{item.name}}</span>
            <yd-icon name='selected' size='.5rem' :color='mainColor' v-show='item.selected' custom></yd-icon>
          </div>
        </div>
        <!---->
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
        <div class="list bgwhite pdlr2 mt2"
             @click="turnTo('/taskreplay/detail/' + item.guid + '?type=' + item.type,item)"
             v-for="(item,index) in contentList" :key="index">
          <ul class="font26 flex-row" style="color:#333;border-bottom:1px dashed #ddd;justify-content:space-between">
            <li class="flex-row foCo6">
              <img style="width:.5rem;height:.4rem;" class="mr1"
                   src="../../../../../assets/images/rent/estate/leibie.png" alt="">
              <span v-if="item.type == 1">日报</span>
              <span v-if="item.type == 2">周报</span>
              <span v-if="item.type == 3">月报</span>
            </li>
            <li>
              <!--  0：未阅 1：已阅 2：草稿 ,, , -->
              <span class="pdlr1 state state2" v-if="item.status == 0">未阅</span>
              <span class="pdlr1 state state1" v-if="item.status == 1">已阅</span>
              <span class="pdlr1 state stateClose" v-if="item.status == 2">草稿</span>
            </li>
          </ul>
          <div class="flex-row-nowrap" style="padding:.2rem 0;">
            <img class="document" src="../../../../../assets/images/rent/estate/document.png" alt="">
            <div style="flex:1;">
              <div class="font30"><span class="nowrap">{{item.title.length > 20?item.title.substr(0,20) + '...':item.title}}</span>
              </div>
              <div class="flex font26 foCo9 mt1">
                <div class="flex" v-if="item.userName">
                  <img class="mr1" src="../../../../../assets/images/rent/ent/human.png" width="10"></img>
                  <div>{{item.userName}}</div>
                </div>
                <span class="flex" v-if="item.reportTime"><yd-icon name='rili' custom size='.4rem'></yd-icon>{{item.reportTime.substr(0,10)}}</span>
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
  import {Popup} from 'vue-ydui/dist/lib.rem/popup';

  Vue.component(Popup.name, Popup);
  export default {

    data() {
      this.userInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("userInfo"))
      );
      this.organInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("organInfo"))
      );

      this.mainColor = this.$color[this.userInfo.organType];
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      if(this.$route.query.wrId){
        this.getDetal();
      }
      return {
        dataType: [0, 0],
        showAdd: false,
        currentIndex: -1,
        currentIndex1: -1,
        currentIndex2: -1,
        currentIndex3: -1,
        mTitle: "",
        isFilter: false,
        startTime: this.$addDay(this.$today(), -30),
        endTime: this.$today(),
        currentReport: {
          name: "汇报",
          value: 1,
        },
        dataTypeList: [{
          name: "汇报",
          value: 1,
        }, {
          name: "审批",
          value: 2,
        }],
        emtList: [{
          name: "所有员工",
          value: -1,
        }],
        chooseList: [
          {
            name: "所有部门",
            value: -1,
            selected: false
          }
        ],
        //1日报；2周报；3月报 ,
        allType: [
          {
            name: "全部",
            value: -1,
            selected: false
          },
          {
            name: "日报",
            value: 1,
            selected: false
          },
          {
            name: "周报",
            value: 2,
            selected: false
          },
          {
            name: "月报",
            value: 2,
            selected: false
          }
        ],
        //0：未阅 1：已阅 2：草稿 ,
        statusList: [
          {name: "全部", value: -1},
          {name: "未阅", value: 0},
          {name: "已阅 ", value: 1},
          {name: "草稿", value: 2}
        ],
        contentList: [],
        pageNo: 1,
        currentIndex1: -1,
        currentIndex2: -1,
        currentIndex5: -1,
        showSend: false,
      };
    },
    methods: {

      getUserRoot(cb) {
        this.$ajax(
          `${this.subUrl.user}/user/getPermissions`,
          {userId: this.userInfo.guid, token: this.$getkey()},
          res => {
            console.log(res.data.workbench.subclass);
            this.isShow = true;
            for (var i of res.data.workbench.subclass) {
              if (i.name == "工作汇报") {
                if (i.subclass && i.subclass.length > 0) {
                  for (var j of i.subclass) {
                    this.showSend = true;
                    if (j.name = '我的汇报') {
                      this.dataType[0] = 1;
                      this.applyType = 1;
                      this.mTitle = "汇报"
                    }
                    if (j.name = '我分配的任务') {
                      this.dataType[1] = 1;
                      this.applyType = 2;
                      this.mTitle = "审批"
                    }
                    if (i.subclass.length == 2) {
                      this.applyType = 3;
                      this.dataType = [1, 1];
                    }
                  }
                }
              }
            }
            cb && cb(res);
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
      chooseMenber(e) {
        for (var i in this.emtList) {
          if (e == i) {
            this.$set(this.emtList[i], "selected", true);
          } else {
            this.$set(this.emtList[i], "selected", false);
          }
        }
        console.log(this.emtList);
        this.currentIndex4 = e;
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
      chooseType2(e) {
        for (var i in this.dataTypeList) {
          if (e == i) {
            this.$set(this.dataTypeList[i], "selected", true);
          } else {
            this.$set(this.dataTypeList[i], "selected", false);
          }
        }
        console.log(this.allType);
        this.currentIndex5 = e;
        this.currentReport = this.dataTypeList[this.currentIndex5];
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
      turnTo(url, e) {
        //跳转到草稿
        // 0：未阅 1：已阅 2：草稿
        console.log(url,e)
        if (e.status == 2) {
          this.$router.push(`/taskreplay/add?type=${e.type}&handle=2&wrId=${e.guid}`)
        } else {
          //跳转到详情
          if (this.userInfo.postType == 2) {
            url = url + `&isApply=1`
          } else if (this.userInfo.postType == 3) {
            console.log(JSON.stringify(this.currentReport))
              if (this.currentReport.name == "审批") {
                console.log(this.currentType,'111111111111111111111111111')
                url = url + `&isApply=1`
              }
          }
          this.$router.push(url);
        }

      },
      back() {
        this.$router.go(-1);
      },
      // 获取邀请信息列表
      getMyInvitation() {
        var data = {
          userId: this.userId,
          token: this.$getkey(),
          wrType:this.currentReport.name == "审批"?2:1
          // pageNo: this.pageNo
        };
        // if (this.startTime) data.startDate = this.startTime + " 00:00:00";
        // if (this.endTime) data.endDate = this.endTime + " 23:59:59";
        if (this.currentIndex1 > 0)
          data.deptId = this.chooseList[this.currentIndex1].value;
        if (this.currentIndex2 > 0) {
          data.type = this.allType[this.currentIndex2].value;
        }
        if (this.currentIndex3 > 0) {
          data.status = this.statusList[this.currentIndex3].value;
        }
        //所有人员筛选
        if (this.currentIndex4 > 0) {
          data.queryUserId = this.emtList[this.currentIndex4].value;
        }
        this.xhr
          .post(
            `${this.subUrl.activity}/workbench/workReport/myReport/getWorkReport`,
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
      },
      getMember() {
        let data = {
          token: this.$getkey(),
          userId: this.userInfo.guid,
        }
        this.$ajax(`${this.subUrl.activity}/workbench/workReport/myReport/getEmp`, data, res => {
          console.log(res, '====')
          for (var i of res.data) {
            this.emtList.push({
              name: i.userName,
              value: i.userId,
              selected: false,
            })
          }
          console.log(this.emtList)
        }, this);
      }
    },
    mounted() {

      switch (this.userInfo.postType * 1) {
        case 2:
          this.mTitle = '审批';
          this.dataType = [0, 1];
          this.currentReport = this.dataTypeList[1];
          break;
        case 3:
          this.mTitle = '汇报/审批';
          this.dataType = [1, 1];
          this.currentReport = this.dataTypeList[0];
          break;
        case 4:
          this.mTitle = '汇报';
          this.dataType = [1, 0];
          this.currentReport = this.dataTypeList[0];
          break;
      }
      this.getMyInvitation();
      this.getMember();
      this.getDepartMent();
    }
  };
</script>
<style scoped>

  .mask .list {
    width: 2.4rem;
    background: #fff;
    -webkit-border-radius: .1rem;
    -moz-border-radius: .1rem;
    border-radius: .1rem;
    right: .3rem;
    top: 1rem;
    line-height: .8rem;
    text-align: center;
    transform: translate(0, 0);
    left: auto;
  }

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
