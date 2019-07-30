<template>
  <div style="height:100vh">
    <yd-layout class="layout_my"  v-if='settled.status && showUser && showTable'>
      <yd-navbar class="header" slot="navbar" v-title="'入驻详情'" v-show="!userAgent.isWX" title="入驻详情" color="#fff" :bgcolor="mainColor" height=".88rem">
          <span class="spanLeft" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
      </yd-navbar>
        <div class="flex-row flex-end bgwhite " style="position: absolute;right: .2rem" >
          <span class="state state0" v-if="settled.status == 1">完成</span>
          <span class="state state1" v-if="settled.status == 2">经理指派 </span>
          <span class="state state2" v-if="settled.status == 3">待抄表</span>
          <span class="state state3" v-if="settled.status == 4">已抄表</span>
        </div>
      <div class="organInfos">
        <div class="info">
          <ul>
            <li><span>企业名称：</span><p>{{settled.clientInfo.organName}}</p></li>
            <li><span>所在行业：</span><p>{{settled.clientInfo.industry}}</p></li>
            <li><span>租用单元：</span><p>{{settled.clientInfo.ridName}}{{settled.clientInfo.unitName}}</p></li>
            <li><span>合同编号：</span><p>{{settled.contractNo}}</p></li>
            <li><span>开始日期：</span><p>{{settled.startTime.substr(0,10)}}</p></li>
            <li><span>结束日期：</span><p>{{settled.endtime.substr(0,10)}}</p></li>
            <li><span>缴费日期：</span><p>{{settled.paymentDate.substr(0,10)}}</p></li>
            <li><span>备注信息：</span><p class="" style="max-width:70%;word-break:break-all;">{{settled.remark}}</p></li>
          </ul>
        </div>
      </div>

      <div class="text1">
        <ul>
          <li><p>通信地址</p><span>{{settled.contactAddress}}</span></li>
          <li><p>联系人</p><span>{{settled.contactName}}</span></li>
          <li><p>联系电话</p><span>{{settled.contactPhone}}</span></li>
        </ul>
      </div>
      <div class="staff" v-if='meterReadList'>
          <p class="font28">抄表信息</p>
          <div class="bb" v-for="item,index in meterReadList">
            <div class="flex-row foCo9 pdlr25" style="line-height: .65rem">
              <span  style="width: 50%" class="nowrap"><span>抄表人:</span><span>{{item.meterReadUsername}}</span></span>
              <span  style="width: 50%" class="nowrap"><span>抄表时间:</span><span>{{item.meterRead.substr(0,10)}}</span></span>
            </div>
            <div class="flex-row foCo9 pdlr25" style="line-height: .65rem">
              <span style="width: 50%"><span>本期读数:</span><span>{{item.reading}}</span></span>
              <span style="width: 50%"><span>上期读数:</span><span>{{item.ppReading}}</span></span>
              <span style="width: 50%"><span>使用情况:</span><span>{{item.dosage}}</span></span>
            </div>
          </div>
          <!--<ul>-->
            <!--<li>-->
                <!--<p>-->
                  <!--<span>{{meterRead.project}}</span>-->
                    <!--<i>抄表人：{{meterRead.meterReadUsername}}</i>-->
                <!--</p>-->
                <!--<p>-->
                    <!--<span>本期读数：{{meterRead.reading}}</span>-->
                    <!--<i>时间：2017-10-10</i>-->
                <!--</p>-->
            <!--</li>-->
          <!--</ul>-->
      </div>
      <div class="status">
        <div class="one" v-for="(item,index) in tasksRecordList" :key="index">
            <div class="z">
              <div class="dot">
                <ul :style="{background:mainColor}"><li></li></ul>
              </div>
            <div class="wire"></div>
            </div>
            <div class="tag">
                <div class="result">
                    <ul>
                      <li>
                        <span :style="{color:mainColor}">{{item.title}}</span>
                        <p>{{item.createTime}}</p>
                        </li>
                        <li>处理人：{{item.usetName}}</li>
                        <li v-if='item.ramrk'>备注：{{item.remark}}</li>
                    </ul>
                </div>
                <div class="arrow">
                  <em></em><span></span>
                </div>

              </div>
        </div>
      </div>
      <!--客服处理弹窗-->
      <div class="mask" v-if="showList" @click="showList = false">
        <div class="bgwhite foCo6" style="padding: .5rem .3rem;" @click.stop="''">
          <div class="listBox">
            <div class="list_item">
              <div class="list_sigle">操作</div>
              <div class="list_sigle">项目名</div>
              <div class="list_sigle">上期读数</div>
              <div class="list_sigle">本期读数</div>
              <div class="list_sigle">实际用量</div>
              <div class="list_sigle">抄表人</div>
              <div class="list_sigle">抄表时间</div>
            </div>

            <div class="list_item" v-for="item,index in tableList" :key="index">
              <div @click="deleteItem(index)" class="list_sigle fuColor3">删除</div>
              <div class="list_sigle">{{item.project}}</div>
              <div class="list_sigle">{{item.ppReading}}</div>
              <div class="list_sigle">{{item.reading}}</div>
              <div class="list_sigle">{{item.dosage}}</div>
              <div class="list_sigle">{{item.meterReadUsername}}</div>
              <div class="list_sigle">{{item.meterRead.split(' ')[0]}}</div>
            </div>
          </div>
          <div class="flex-row mt3">
            <yd-button type="hollow" @click.native="showTable = false">新增</yd-button>
          </div>
          <div class="flex h8 jusCenter mt3 radius" @click="zhiConfirm" :style="{color:'#fff',background:mainColor}">
            确定
          </div>
        </div>
      </div>
      <!--<div class="mask" @click="toChaobiao = false" v-if='toChaobiao'>-->
        <!--&lt;!&ndash; 阻止冒泡 &ndash;&gt;-->
        <!--<div class="bgwhite chaobiao" @click.stop="">-->
          <!--<div class="add">-->
            <!--<div class="flex-row h7">-->
              <!--<span class="label">项目名称</span>-->
              <!--<input class="myInput flex1" v-model="obj.project" type="text">-->
            <!--</div>-->
            <!--<div class="flex-row h7">-->
              <!--<span class="label">上期读数</span>-->
              <!--<input class="myInput flex1" type='number' v-model="obj.ppReading">-->
            <!--</div>-->
            <!--<div class="flex-row h7">-->
              <!--<span class="label">本期读数</span>-->
              <!--<input class="myInput flex1" v-model="obj.reading" type="text">-->
            <!--</div>-->
            <!--<div class="flex-row h7">-->
              <!--<span class="label">实际用量</span>-->
              <!--<input class="myInput flex1" v-model="obj.dosage" type="text">-->
            <!--</div>-->
            <!--<yd-button type='hollow' size='large' class="h7 font32" :style="{color:mainColor}" @click.native="addList">确定</yd-button>-->
          <!--</div>-->

        <!--</div>-->
      <!--</div>-->
      <!--<div class="flex-row h8 bgwhite jusCenter" @click="toChaobiao=true" v-if='settled.status == 3 && tasks' slot="bottom">-->
        <div class="flex-row h8 bgwhite jusCenter" @click="showList=true" v-if='settled.status == 3 && tasks' slot="bottom">
          <img src="../../../../../../assets/images/rent/estate/select_active.png" class="chooseIcon" alt="">
          <span :style="{color:mainColor}">抄表</span>
      </div>
      <div class="flex-row h8 bgwhite jusCenter" @click="agreeRuZhu" v-if='settled.status == 4 && tasks' slot="bottom">
        <img src="../../../../../../assets/images/rent/estate/select_active.png" class="chooseIcon" alt="">
        <span :style="{color:mainColor}">同意入驻</span>
      </div>
      <div class="flex-row h8 bgwhite jusCenter"  @click="showUser = false" v-if='settled.status == 2 && tasks' slot="bottom">
        <img src="../../../../../../assets/images/rent/estate/select_active.png" class="chooseIcon" alt="">
        <span :style="{color:mainColor}">指派抄表人</span>
      </div>
    </yd-layout>
    <departMent v-if='!showUser' @setUserId='setUserId'></departMent>
    <mTable v-if="!showTable" @setTable="setTable"></mTable>

  </div>
</template>
<script>
import Vue from "vue";
import fn from "@/assets/js/product";
import qs from "qs";
import departMent from "../repair/department_manager";
import mTable from  "../../exit_rent/table"
import { TimeLine, TimeLineItem } from "vue-ydui/dist/lib.rem/timeline";
import {
  Confirm,
  Alert,
  Toast,
  Notify,
  Loading
} from "vue-ydui/dist/lib.rem/dialog";
/* 使用px：import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.px/dialog'; */

Vue.prototype.$dialog = {
  confirm: Confirm,
  alert: Alert,
  toast: Toast,
  notify: Notify,
  loading: Loading
};

import "@/assets/css/wuye.css";
/* 使用px：import {TimeLine, TimeLineItem} from 'vue-ydui/dist/lib.px/timeline'; */

Vue.component(TimeLine.name, TimeLine);
Vue.component(TimeLineItem.name, TimeLineItem);

export default {
  components: {
    departMent,
    mTable
  },
  data() {
    return {
      showUser: true,
      toChaobiao: false,
      showList:false,
      showTable:true,
      tableList:[],
      add: false,
      organInfo: {},
      userInfo: {},
      getkey: "",
      mainColor: "",
      titleT: "",
      show: true,
      s: true,
      p: true,
      decorationId: null,
      statusList: [],
      lists: [],
      decoration: {},
      decorationRowList: [],
      accessoryFiles: [],
      settled: {},
      tasks: null,
      tasksRecordList: [],
      meterRead: [],
      obj: {
        project: "",
        ppReading: "",
        reading: "",
        dosage: ""
      }
    };
  },
  methods: {
    deleteItem(e) {
      this.tableList.splice(e, 1);
      this.$dialog.toast({mes: '删除成功', timeout: 500})
    },
    setTable(e) {
      this.showTable = true;
      if (e) {
        e.meterRead = e.meterRead + ' 00:00:00'
        this.tableList.push(e);
      }
    },
    zhiConfirm() {
      if (this.tableList.length == 0) {
        return this.$dialog.toast({mes: "请添加抄表记录"});
      }
      let data = {
        token:this.$getkey(),
        userId:this.userInfo.guid,
        settledId:this.settled.guid,
      };
      this.$ajax1(`${this.subUrl.activity}/caa/meterRead?${this.$qs.stringify(data)}`,this.tableList,res=>{
        this.showList = false;
        this.getDetail();
        return this.$dialog.toast({mes: "已抄表",'icon':"success"});
      },this)
    },
    agreeRuZhu() {
      this.$dialog.confirm({
        title: "",
        mes: "是否同意入驻",
        opts: res => {
          var data = {
            token: this.$getkey(),
            userId: this.userInfo.guid,
            settledId: this.settled.guid
          };
          this.$ajax(
            `${this.subUrl.activity}/caa/complete`,
            data,
            res => {
              this.$dialog.toast({
                mes: "已同意入驻",
                icon: "success"
              });
              this.getDetail();
            },
            this
          );
        }
      });
    },
    // 添加
    setUserId(e) {
      console.log(e);
      this.showUser = true;
      if (e) {
        console.log(JSON.stringify(e));
        var data = {
          token: this.$getkey(),
          userId: this.userInfo.guid,
          settledId: this.settled.guid,
          meterReadId: e.userId
        };
        this.$ajax(
          `${this.subUrl.activity}/caa/assign`,
          data,
          res => {
            this.$dialog.toast({
              mes: "已指派抄表人",
              icon: "success",
              timeout: 400
            });
            this.getDetail();
            // this.$router.go(-1);
          },
          this
        );
      }
    },
    toggle() {
      this.show = !this.show;
    },
    turnTo(url) {
      this.$router.push(url);
    },
    back() {
      history.back();
    },
    // 详情
    getDetail() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        settledId: this.$route.query.guid
      };
      this.$ajax(
        `${this.subUrl.activity}/caa/settledDetail`,
        data,
        res => {
          this.detail = res.data;
          this.settled = res.data.settled;
          this.tasks = res.data.tasks;
          this.tasksRecordList = res.data.tasksRecordList;
          this.meterReadList = res.data.meterReadList;
        },
        this
      );
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
    this.decorationId = this.$route.query.guid;

    this.getDetail();
  }
};
</script>
<style scoped>
/* 抄表 */
/*列表*/
.list_item {
  height: .7rem;
  overflow-x: auto;
  white-space: nowrap;
  align-items: center;
  /*margin-top: -1px;*/
  display: flex;
  width: 12rem;
  border-top: 1px solid #ddd;
}

.list_item:last-child {
  border-bottom: 1px solid #ddd;
}

.listBox {
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  max-height: 2.84rem;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.list_item .list_sigle {
  width: 2rem;
  padding: 0 .1rem;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
}

.flex-row-nowarp .label {
  text-align: right;
  padding-right: .1rem;
}

.flex-row-nowarp input {
  padding: 0 .1rem;
  box-sizing: border-box;
  width: 3.4rem;
}

.state {
  border: 1px solid #2d88d4;
  padding: 0.02rem 0.05rem;
  color: #2d88d4;
  margin: 0.3rem 0.3rem 0 0.3rem;
}
.layout_my .header:after {
  display: none;
}
.layout_my {
  background: #eef3fa;
}

.layout_my .blue_box {
  height: 0.88rem;
  background-size: 100% 100%;
}
.organInfos {
  width: 100%;
  background: white;
}
.name {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0.3rem;
  background: white;
  border-bottom: 1px solid #f3f6f5;
}
.name span {
  display: flex;
  border-radius: 0.05rem;
  border: 1px solid #2d88d4;
  color: #2d88d4;
  padding: 0.05rem 0.1rem;
  font-size: 0.22rem;
}

.info {
  width: 100%;
  background: white;
  border-bottom: 1px solid #f3f6f5;
  padding: 0.2rem 0.4rem;
  font-size: 0.28rem;
}
.info ul li {
  display: flex;
  height: 0.6rem;
  position: relative;
}
.info ul li > span {
  width: 1.6rem;
  text-align: right;
  color: #9d9e9d;
}
.info ul li > i {
  padding: 0.02rem 0.05rem;
  border: 1px solid #2d88d4;
  font-size: 0.22rem;
  position: absolute;
  right: 0;
  top: 0;
  border-radius: 0.05rem;
  color: #2d88d4;
}

.out {
  width: 100%;
  height: calc(100vh - 0.88rem);
  overflow-y: scroll;
}
.text1 {
  width: 100%;
  background: white;
  margin-top: 0.3rem;
}
.text1 ul {
  width: 100%;
  padding: 0.1rem 0.1rem;
}
.text1 ul > li {
  height: 0.6rem;
  display: flex;
  align-items: center;
}
.text1 ul > li > p {
  width: 1.6rem;
  text-align: right;
  color: #9d9e9d;
}
.text1 ul > li > span {
  flex: 1;
  padding: 0 0.2rem;
}

.staff {
  width: 100%;
  display: flex;
  flex-flow: column;
  background: white;
  margin-top: 0.3rem;
}
.staff > p {
  width: 100%;
  height: 0.8rem;
  padding: 0 0.3rem;
  display: flex;
  align-items: center;
  border-top: 1px solid #d7d7d7;
  border-bottom: 1px solid #d7d7d7;
  color: #b0b0b0;
}
.staff > ul {
  width: 100%;
  padding: 0 0.3rem;
}
.staff > ul > li {
  height: 1.4rem;
  border-bottom: 1px solid #eff2f2;
  display: flex;
  justify-content: space-between;
  position: relative;
  align-items: center;
}
.staff > ul > li > p {
  padding: 0.1rem 0.1rem;
  display: flex;
  flex-flow: column;
}
.staff > ul > li > p > i {
  font-size: 0.24rem;
  color: #999;
  margin-top: 0.1rem;
}

.aaa {
  height: 0.8rem;
  display: flex;
  justify-content: space-between;
  padding: 0 0.4rem;
  align-items: center;
  background: white;
  margin-top: 0.3rem;
}
.aaa > a {
  width: 1.6rem;
  height: 0.6rem;
  border-radius: 0.04rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
.aaa > p > span {
  margin-right: 0.2rem;
}

.status {
  width: 100%;
  background: #fafefd;
  margin-top: 0.3rem;
}
.one {
  width: 100%;
  height: 2rem;
  background: #f8f8f9;
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #f2f3f3;
}
.tag {
  width: 70%;
  height: 1.7rem;
  border: 1px solid #f2f3f3;
  position: relative;
  background-color: #fff;
  border-radius: 0.1rem;
}
.arrow {
  position: absolute;
  width: 0.3rem;
  height: 0.3rem;
  top: 0.6rem;
  left: -0.4rem;
}
.arrow * {
  display: block;
  border-width: 0.2rem;
  position: absolute;
  border-style: dashed solid dashed dashed;
  font-size: 0;
  line-height: 0;
}
.arrow em {
  border-color: transparent #f2f3f3 transparent transparent;
}
.arrow span {
  border-color: transparent #fff transparent transparent;
  left: 1px;
}

.one .dot {
  width: 0.6rem;
  height: 0.6rem;
  background: #f8f8f9;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 889;
}
.z {
  position: relative;
  width: 0.6rem;
  height: 0.6rem;
  margin-right: 0.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dot ul {
  width: 0.42rem;
  height: 0.42rem;
  border-radius: 50%;
  background: #999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dot ul li {
  width: 0.16rem;
  height: 0.16rem;
  background: white;
  border-radius: 50%;
}
.dot > div:nth-child(1) {
  width: 0.26rem;
  height: 0.26rem;
  background: #999;
  border-radius: 0.26rem;
}
.status > div:first-child .dot ul {
  background: #23ac38;
}

.result {
  width: 100%;
  height: 100%;
  padding: 0.2rem 0.3rem;
}
.result ul {
  width: 100%;
}
.result ul li:nth-child(1) {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
}
.result ul li:nth-child(1) > p {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #b1b1b1;
  font-size: 0.24rem;
}
.result ul li:nth-child(1) > p > i {
  width: 0.3rem;
  height: 0.3rem;
  margin-right: 0.1rem;
}
.result ul li:nth-child(1) > p > i > img {
  height: 100%;
  width: 100%;
}
.result ul li:nth-child(1) > span {
  font-weight: 600;
  margin-bottom: 0.1rem;
  font-size: 0.3rem;
}
.result ul li:nth-child(2),
.result ul li:nth-child(3) {
  font-size: 0.28rem;
  color: #8a8a8a;
  margin-bottom: 0.05rem;
}

.wire {
  width: 0.04rem;
  height: 2rem;
  background: #b1b1b1;
  position: absolute;
  z-index: 888;
  top: -2rem;
}
.status > div:nth-child(1) > .z > .wire {
  display: none;
}

.text {
  position: relative;
  display: flex;
  flex-flow: column;
  width: 100%;
  background: white;
  border-top: 1px solid #e6e8e7;
}
.text > p {
  width: 100%;
  height: 0.7rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.4rem;
  border-bottom: 1px solid #e6e8e7;
}
.text > ul {
  width: 100%;
  padding: 0.1rem 0.3rem;
}
.text > ul > li {
  width: 100%;
  height: 0.5rem;
  display: flex;
  align-items: center;
}
.text > ul > li > p {
  width: 1.6rem;
  text-align: center;
}
.text > i {
  width: 1rem;
  height: 1rem;
  background: red;
  position: absolute;
  right: 0.5rem;
  top: 0.8rem;
}
.text > ol {
  width: 100%;
  padding: 0.1rem 0.4rem;
}
.text > ol > li {
  border-bottom: 1px solid #e6e8e7;
  width: 100%;
  justify-content: space-between;
  display: flex;
  align-items: center;
  height: 0.7rem;
}
.text > ol > li:last-child {
  border: none;
}
.text > div {
  width: 100%;
  display: flex;
}
.text > div > i {
  width: 1.4rem;
  height: 1.4rem;
  margin: 0.1rem 0.25rem;
  border-radius: 0.1rem;
}
.text > div > i > img {
  width: 100%;
  height: 100%;
  border-radius: 0.1rem;
}

.feedback {
  width: 100%;
  padding: 0.1rem 0.4rem;
  display: flex;
  flex-flow: column;
  background: white;
  margin-top: 0.3rem;
}
.feedback > span {
  width: 100%;
  height: 0.6rem;
  color: #c5c5c5;
  font-size: 0.24rem;
  display: flex;
  align-items: center;
}
.feedback > p {
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 0.1rem;
}
.feedback > p > img {
  width: 100%;
  height: 100%;
}

.buttons {
  width: 100%;
  margin: 0.4rem 0;
  display: flex;
  justify-content: center;
}
.buttons > button {
  width: 90%;
  height: 0.8rem;
  color: white;
  font-size: 0.3rem;
  font-weight: 600;
  border-radius: 0.1rem;
  border: none;
}
</style>
