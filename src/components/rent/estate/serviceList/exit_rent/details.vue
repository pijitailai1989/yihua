<template>
  <div style="height: 100vh;">
    <yd-layout class="layout_my" v-if="showUser && showTable">
      <yd-navbar class="header" v-title="'退租详情'" slot="navbar" title="退租详情" color="#fff" :bgcolor="mainColor"
                 height=".88rem">
         <span class="spanLeft" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
      </yd-navbar>

      <div v-if="result.surrender && result.surrender.guid">
        <div class="organInfos">
          <div class="info">
            <ul>
              <li><span>租用单元：</span>
                <p>{{result.surrender.clientInfo.ridName}}{{result.surrender.clientInfo.unitName}}</p>
                <!--状态 0:关闭 1:完成 2:客服处理 3:经理指派 4:待抄表 5:已抄表-->
                <i v-if="result.surrender.status == 0" class="state stateClose">关闭</i>
                <i v-if="result.surrender.status == 1" class="state state1">完成</i>
                <i v-if="result.surrender.status == 2" class="state state2">客服处理</i>
                <i v-if="result.surrender.status == 3" class="state state2">经理指派</i>
                <i v-if="result.surrender.status == 4" class="state state2">待抄表</i>
                <i v-if="result.surrender.status == 5" class="state state2">已抄表</i>
              </li>
              <li><span>租户单位：</span>
                <p>{{result.surrender.clientInfo.organName}}</p></li>
              <li><span>起止日期：</span>
                <p>{{result.surrender.createTime.substr(0,10).replace(/-/g,'/')}}-{{result.surrender.endtime.substr(0,10).replace(/-/g,'/')}}</p></li>
              <li><span>迁出原因：</span>
                <p>{{result.surrender.cause}}</p></li>
              <li><span>迁出日期：</span>
                <p>{{result.surrender.applyLeaveTime.split(' ')[0].replace(/-/g,'/')}}</p></li>
            </ul>
          </div>
          <div class="contacts">
            <ul>
              <li><img width="100%" src="../../../../../assets/images/rent/estate/rent.png" alt=""></li>
              <li>
                <p>{{result.surrender.clientInfo.name}}</p>
                <span>{{result.surrender.clientInfo.account}}</span>
              </li>
            </ul>
            <ul>
              <li><img width="100%" src="../../../../../assets/images/rent/estate/yezhu.png"></li>
              <li>
                <p>{{result.surrender.ownerInfo.name}}</p>
                <span>{{result.surrender.ownerInfo.account}}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="text" v-if="result.surrender">
          <ul>
            <li><p>业主意见</p><span>{{result.surrender.ownerOpinion}}</span></li>
            <li><p>物业情况</p><span>{{result.surrender.proOpinion}}</span></li>
            <li><p>客服部意见</p><span>{{result.surrender.csOpinion}}</span></li>
          </ul>
        </div>

        <div class="staff" v-if="result.meterReadList.length > 0">
          <p class="font28">工程部意见</p>
            <ul>
              <li v-for="item,index in result.meterReadList">
                <p>{{item.project}}</p>
                <p>
                  <span>上期读数：{{item.ppReading}}</span>
                  <i  class="nowrap" style="width:2rem">抄表人：{{item.meterReadUsername}}</i>
                </p>
                <p>
                  <span>本期读数：{{item.reading}}</span>
                  <i>时间：{{item.meterRead.substr(0,10)}}</i>
                </p>
              </li>
            </ul>
        </div>

        <div class="aaa">
          <p>
            <span>放行条</span>
            <i>已发放</i>
          </p>
          <a :style="{background:mainColor}">生成放行条</a>
        </div>

        <div class="status">
          <div class="one" v-for="(item,index) in statusList" :key="index">
            <div class="z">
              <div class="dot">
                <ul>
                  <li></li>
                </ul>
              </div>
              <div class="wire"></div>
            </div>
            <div class="tag">
              <div class="result">
                <ul>
                  <li>
                    <span :style="{color:mainColor}">{{item.title}}</span>
                    <p><i><img src="../../../../../assets/images/rent/estate/search.png" alt=""></i>{{item.createTime}}
                    </p>
                  </li>
                  <li>处理人：{{item.usetName}}</li>
                  <li>备注：{{item.remark}}</li>
                </ul>
              </div>
              <div class="arrow">
                <em></em><span></span>
              </div>

            </div>
          </div>
        </div>
        <yd-timeline style="margin-top:.2rem;">
          <yd-timeline-item v-for='(item,index) in result.tasksRecordList'
                            v-if="result.tasksRecordList && result.tasksRecordList.length > 0" :key='index'>
            <!--<img style="width:.4rem;height:.4rem" src="../../../../../assets/images/rent/estate/chooseSelected.png" slot="icon" v-if='index==0'-->
            <!--alt="">-->
            <yd-icon v-if='index==0' name="tongxinyuan" custom size=".5rem" :color="mainColor" slot="icon"></yd-icon>
            <div class="font32" :style="`color:${mainColor}`">{{item.title}}</div>
            <div class="font28 flex-row  flex-start">
              <span v-if='1'>操作人:</span>
              <span>{{item.usetName}}</span>
            </div>
            <div class="font28 flex-row flex-start" v-if='item.remark'>
              <span>备注:</span>
              <span>{{item.remark}}</span>
            </div>
            <p>{{item.createTime}}</p>
          </yd-timeline-item>
        </yd-timeline>
      </div>

      <!--table:{-->
      <!--"project": "",-->
      <!--"ppReading": "",-->
      <!--"reading": "",-->
      <!--"dosage": "",-->
      <!--"meterReadUsername": "",-->
      <!--"meterRead": this.$today(),-->
      <!--},-->
      <!--抄表弹窗-->
      <div class="mask" v-if="show1" @click="show1 = false">
        <div class="bgwhite foCo6" style="padding: .5rem .3rem;" @click.stop="''">
          <div class="flex-row-nowarp h8">
            <div class="label" style="width:1.6rem">客服部意见</div>
            <input type="text" class="flex1 border" maxlength="30" v-model="advice.csOpinion" style="height:.68rem;"
                   placeholder="请输入">
          </div>
          <div class="flex-row-nowarp h8">
            <div class="label" style="width:1.6rem">业主意见</div>
            <input type="text" class="flex1 border" maxlength="30" v-model="advice.ownerOpinion" style="height:.68rem;"
                   placeholder="请输入">
          </div>
          <div class="flex-row-nowarp h8">
            <div class="label" style="width:1.6rem">物业意见</div>
            <input type="text" class="flex1 border" maxlength="30" v-model="advice.proOpinion" style="height:.68rem;"
                   placeholder="请输入">
          </div>
          <div class="flex-row-nowarp h8">
            <div class="label" style="width:1.6rem">经理</div>
            <input type="text" class="flex1 border" maxlength="30" @click="showUser=false" placeholder="请选择经理" readonly
                   v-model="rentUserName"
                   style="height:.68rem;">
          </div>
          <div class="flex h8 jusCenter mt3 radius" @click="csConfirm" :style="{color:'#fff',background:mainColor}">
            确定
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
      <!--客服处理-->
      <div class="flex-row-nowarp h9 jusCenter font32 bgwhite bt" v-if="result.tasks && result.surrender.status == 2"
           @click="show1=true" slot="bottom">
        <yd-icon name="selected" custom class="mt1" :color="mainColor" size=".4rem"></yd-icon>
        <span :style="{color:mainColor}">客服处理</span>
      </div>
      <!--经理处理-->
      <div class="flex-row-nowarp h9 jusCenter font32 bgwhite bt" v-if="result.tasks && result.surrender.status == 3"
           @click="agree1" slot="bottom">
        <yd-icon name="selected" custom class="mt1" :color="mainColor" size=".4rem"></yd-icon>
        <span :style="{color:mainColor}">同意指派</span>
      </div>
      <!--抄表-->
      <div class="flex-row-nowarp h9 jusCenter font32 bgwhite bt" v-if="result.tasks && result.surrender.status == 4"
           @click="showList=true" slot="bottom">
        <!--<yd-icon name="selected" custom class="mt1" :color="mainColor" size=".4rem"></yd-icon>-->
        <span :style="{color:mainColor}">抄表</span>
      </div>
      <!--客服确认完成-->
      <div class="flex-row-nowarp h9 jusCenter font32 bgwhite bt" v-if="result.tasks && result.surrender.status == 5"
           @click="confirmComplete" slot="bottom">
        <yd-icon name="selected" custom class="mt1" :color="mainColor" size=".4rem"></yd-icon>
        <span :style="{color:mainColor}">确认完成</span>
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
  import departMent from "../wuye/repair/department_manager";
  import mTable from './table'
  import {TimeLine, TimeLineItem} from "vue-ydui/dist/lib.rem/timeline";

  Vue.component(TimeLine.name, TimeLine);
  Vue.component(TimeLineItem.name, TimeLineItem);
  export default {
    components: {
      mTable,
      departMent,
    },
    data() {
      return {
        show1: false,
        showTable: true,
        showList: false,
        showUser: true,
        rentUserName: "",
        rentUserId: '',
        organInfo: {},
        userInfo: {},
        getkey: "",
        mainColor: "",
        advice: {},
        result: {},
        titleT: "",
        show: true,
        s: true,
        p: true,
        tableList: [],
        decorationId: null,
        statusList: [],
        lists: [],
        decoration: {},
        decorationRowList: [],
        accessoryFiles: [],
        table: {
          "project": "",
          "ppReading": "",
          "reading": "",
          "dosage": "",
          "meterReadUsername": "",
          "meterRead": this.$today(),
        },
        //  lineType用来做个标志  选择指派人完成的时候可用
        lineType: -1,
      };
    },
    methods: {
      confirmComplete(){
        this.$dialog.confirm({mes:"是否确认完成",opts:()=>{
            var data = {
              token:this.$getkey(),
              userId:this.userInfo.guid,
              surrenderId:this.result.surrender.guid,
            };
            this.$ajax(`${this.subUrl.activity}/surrender/complete`,data,res=> {
              this.getDetail();
              this.$dialog.toast({mes:'已同意退租'})
            },this)
          }})
      },
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
          surrenderId:this.result.surrender.guid,
        };
        this.$ajax1(`${this.subUrl.activity}/surrender/meterRead?${this.$qs.stringify(data)}`,this.tableList,res=>{
          this.showList = false;
          this.getDetail();
          return this.$dialog.toast({mes: "已抄表",'icon':"success"});
        },this)
      },
      /*客服确认*/
      csConfirm() {
        console.log(this.advice.csOpinion)
        if (!this.advice.csOpinion) {
          return this.$dialog.toast({mes: "请输入客服部意见", timeout: 600})
        } else if (!this.advice.ownerOpinion) {
          return this.$dialog.toast({mes: "请输入业主意见", timeout: 600})
        } else if (!this.advice.proOpinion) {
          return this.$dialog.toast({mes: "请输入物业意见", timeout: 600})
        } else if (!this.rentUserId) {
          return this.$dialog.toast({mes: "请选择经理", timeout: 600});
        } else {
          let data = this.advice;
          data.token = this.$getkey();
          data.surrenderId = this.result.surrender.guid,
            data.managerUserId = this.rentUserId;
          data.userId = this.userInfo.guid;
          this.$ajax(`${this.subUrl.activity}/surrender/csOpinion`, data, res => {
            this.$dialog.toast({mes: "提交成功", icon: "success"})
            this.getDetail();
            this.show1 = false;
          }, this)
        }
      },
      agree1() {
        this.showUser = false;
        this.lineType = 1;
      },
      setUserId(e) {
        this.showUser = true;
        if (e) {
          this.rentUserName = e.userName;
          this.rentUserId = e.userId;
          if (this.lineType == 1) {
            console.log('1111111111111999999')
            let data = {
              token: this.$getkey(),
              userId: this.userInfo.guid,
              surrenderId: this.result.surrender.guid,
              meterReadId: e.userId,
            }
            this.$ajax(`${this.subUrl.activity}/surrender/edOpinion`, data, res => {
              this.$dialog.toast({mes: "已指派抄表人", icon: "success"})
              this.getDetail();
            }, this)
          }
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
      getDetail() {
        let data = {
          token: this.$getkey(),
          userId: this.userInfo.guid,
          surrenderId: this.$route.query.id,
        }
        this.$ajax(`${this.subUrl.activity}/surrender/getSurrenderDetail`, data, res => {
          this.result = res.data;
        }, this)
      },
    },
    mounted() {
      this.userInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("userInfo"))
      );
      this.organInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("organInfo"))
      );
      this.mainColor = this.$color[this.userInfo.organType];
      this.getDetail();

      // this.getDecoration()
    }
  };
</script>
<style scoped>
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
    height: 0.5rem;
    position: relative;
  }

  .info ul li > span {
    width: 1.6rem;
    text-align: right;
    color: #9d9e9d;
  }

  .info ul li > i {
    padding: 0.02rem 0.05rem;
    font-size: 0.22rem;
    position: absolute;
    right: 0;
    top: 0;
    border-radius: 0.05rem;
  }

  .contacts {
    width: 100%;
    padding: 0.2rem 0.3rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .contacts ul {
    width: 50%;
    display: flex;
    flex-flow: row;
    align-items: center;
  }

  .contacts ul li:nth-child(1) {
    width: 0.7rem;
    height: 0.7rem;
    border-radius: 50%;
  }

  .contacts ul li > img {
    border-radius: 50%;
  }

  .contacts ul li:nth-child(2) {
    flex: 1;
    padding: 0 0.1rem;
    color: #6f6f6f;
  }

  .contacts ul li:nth-child(2) > p {
    margin-bottom: 0.05rem;
  }

  .text {
    width: 100%;
    background: white;
    margin-top: 0.3rem;
  }

  .text ul {
    width: 100%;
  }

  .text ul > li {
    height: 0.8rem;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f8f8f8;
  }

  .text ul > li > p {
    width: 1.6rem;
    text-align: right;
    color: #9d9e9d;
  }

  .text ul > li > span {
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
    justify-content: space-around;
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
</style>
