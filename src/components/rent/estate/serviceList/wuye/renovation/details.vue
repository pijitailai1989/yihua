<template>
<div style="height:100vh" >
  <yd-layout class="layout_my" v-if="showUser && showInput">
      <yd-navbar class="header" slot="navbar" v-title="'装修详情'" v-show="!userAgent.isWX" title="装修详情" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span class="spanLeft" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
      </yd-navbar>
    <div class="organInfos">
      <div class="name">
        <p class="font32 font600">{{decoration.ridName}}{{decoration.unitName}}</p>
        <!-- <span v-show="decoration.status!=null" class="font22" :style="{border:'1px solid '+mainColor,color:mainColor}">{{decoration.status}}</span> -->
        <span v-if="decoration.status == 1" class="pdlr1 state state2">进行中</span>
        <span v-if="decoration.status == 2" class="pdlr1 state state3">经理审批</span>
        <span v-if="decoration.status == 3" class="pdlr1 state state2">处理中</span>
        <span v-if="decoration.status == 4" class="pdlr1 state state2">执行人确认</span>
        <span v-if="decoration.status == 5" class="pdlr1 state state1">完成</span>
        <span v-if="decoration.status == 6" class="pdlr1 state stateClose">关闭</span>
        <span v-if="decoration.status == 7" class="pdlr1 state state2">不同意</span>
      </div>
      <div class="info">
         <ul>
           <li><span>单号：</span><p>{{decoration.guid}}</p></li>
           <li v-if="decoration.startDate"><span>开始时间：</span><p>{{decoration.startDate}}</p></li>
           <li v-if="decoration.endDate"><span>结束时间：</span><p>{{decoration.endDate}}</p></li>
         </ul>
      </div>
      <div class="contacts">
           <ul>
              <li>租</li>
              <li>
                  <p>{{decoration.tenementName}}</p>
                  <span>{{decoration.tenementMobile}}</span>
              </li>
           </ul>
           <ul>
              <li>业</li>
              <li>
                  <p>{{decoration.ownerName}}</p>
                  <span>{{decoration.ownerMobile}}</span>
              </li>
           </ul>
      </div>
    </div>

    <div class="text">
      <p class="textHidden4">{{decoration.description}}</p>
      <div class="images">
            <ul>
              <li v-for="(item,index) in accessoryFiles" :key="index"><img :src="item.path" alt=""></li>
            </ul>
        </div>
    </div>

    <div class="staff">
         <p class="font28">施工人员信息</p>
         <ul>
           <li v-for="(item,index) in lists" :key="index">
               <span class="font32"><p>{{item.type==1?"负责人":"主要人员"}}：{{item.name}}</p>{{item.mobile}}</span>
               <p class="font28">身份证号：{{item.idCard}}</p>
           </li>
         </ul>
    </div>
    <!-- 跟踪记录表 -->
    <div class="staff" v-if="myrowRecordList.length > 0">
         <p class="font28">物业跟踪记录表</p>
         <ul>
           <li v-for="(item,index) in myrowRecordList" :key="index">
               <span class="font30"><p class="nowrap">检查情况：{{item.description}}</p></span>
               <p class="font28 flex">
                 <span style="width:3rem" class="nowrap">检查人:{{item.checkerName}}</span>
                 <span>检查时间:{{item.inspectDate}}</span>
               </p>
           </li>
         </ul>
    </div>

    <div class="status">
      <div class="one" v-for="(item,index) in statusList" :key="index">
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
                       <p><yd-icon custom name='rili' size='.4rem'></yd-icon>{{item.createTime}}</p>
                      </li>
                      <li>处理人：{{item.usetName}}</li>
                      <li v-if='item.remark'>备注：{{item.remark}}</li>
                   </ul>
               </div>
               <div class="arrow">
                <em></em><span></span>
               </div>

            </div>
      </div>
    </div>
    <div class="flex-row jusCenter center bgwhite border h8 foCoF font32" v-if="tasks && decoration.status == 4" style="margin:.3rem .6rem;border-radius:.1rem;" @click="confirmComplete" :style="{background:mainColor}">确定</div>

    <!-- 客服上报 -->
    <div class="mask" v-if='showAgree' @click="showAgree=false">
      <div class="bgwhite" style="padding:.3rem .5rem;" @click.stop="''">
        <yd-textarea maxlength='100' class="border" v-model="remark" placeholder='请输入备注' style='padding:.1rem;'></yd-textarea>
        <div class="flex-row h8 mt2"><input type="text" @click="showUser=false" readonly v-model="assigneeIdName" class="flex1 pdlr1" placeholder="选择执行人"></div>
        <div class="flex-row mt2">
          <yd-button type='hollow' @click.native="confirm">确定</yd-button>
        </div>
      </div>
    </div>
    <!-- 经理选择执行人 -->
    <div class="mask" v-if='showAgree1' @click="showAgree1=false">
      <div class="bgwhite" style="padding:.3rem .5rem;" @click.stop="''">
        <yd-textarea maxlength='100' class="border" v-model="remark" placeholder='请输入备注' style='padding:.1rem;'></yd-textarea>
        <div class="flex-row h8 mt2"><input type="text" @click="showUser=false" readonly v-model="assigneeIdName" class="flex1 pdlr1" placeholder="选择执行人"></div>
        <div class="flex-row mt2">
          <yd-button type='hollow' @click.native="confirm2">确定</yd-button>
        </div>
      </div>
    </div>
    <!-- 执行人记录表单 -->
    <!--  v-if='showAgree1' @click="showAgree1=false" -->
    <div class="mask" v-if="showAgree2" @click="showAgree2 = false">
      <div class="bgwhite" style="padding:.3rem .5rem;" @click.stop="''">
        <div class="flex-row jusCenter">跟踪记录</div>
        <div class="border">
          <div class="flex-row" style='padding:0 .2rem;'>
            <span style="width:1rem">人员</span>
            <span>装修详情</span>
            <span>操作</span>
          </div>
          <div style="max-height:3rem;overflow-y:auto">
            <div class="flex-row bt" v-for="(item,index) in record" :key="index" style='padding:0 .2rem;'>
              <span class="nowrap" style="width:1.2rem;">{{userInfo.name}}</span>
              <span class="nowrap" style="width:1.4rem;">{{item.description}}</span>
              <span style="color:#f00"  @click="deleteItem(index)">删除</span>
            </div>
          </div>
        </div>
        <div class="flex-row mt2 flex-start">
         <yd-button type='hollow' class="mr2" @click.native="showInput=false">新增</yd-button>
          <yd-button type='hollow' @click.native="confirm1">确定</yd-button>
        </div>
      </div>
    </div>
    <!--<div class="flex-row h9 radius jusCenter font32" v-if="tasks && decoration.status == 4" :style="`background:${mainColor};margin:.3rem .5rem;color:#fff`" @click="rentConfirm" >确定</div>-->

    <!-- 客服同意和拒绝 -->
    <div class="flex-row h9 bt bgwhite font30" v-if="tasks && decoration.status == 1" style="overflow:hidden" slot="bottom">
      <div class="flex1 jusCenter br" @click="disagree(1)">
        <img class="chooseIcon" src="../../../../../../assets/images/rent/estate/disagree.png" alt="">
        <span style="color:#ff483f">不同意</span>
      </div>
       <div class="flex1 jusCenter" @click="agree1">
        <img class="chooseIcon" src="../../../../../../assets/images/rent/estate/agree.png" alt="">
        <span :style="{color:mainColor}">同意</span>
      </div>
    </div>
    <!-- 经理同意和拒绝 -->
    <div class="flex-row h9 bt bgwhite font30" v-if="tasks && decoration.status == 2" style="overflow:hidden" slot="bottom">
      <div class="flex1 jusCenter br" @click="disagree(2)">
        <img class="chooseIcon" src="../../../../../../assets/images/rent/estate/disagree.png" alt="">
        <span style="color:#ff483f">不同意</span>
      </div>
       <div class="flex1 jusCenter" @click="showAgree1=true">
        <img class="chooseIcon" src="../../../../../../assets/images/rent/estate/agree.png" alt="">
        <span :style="{color:mainColor}">指派执行人</span>
      </div>
    </div>
    <!-- 执行人进行装修情况抄单 -->
    <div  @click="showAgree2 = true"  class="flex-row h9 bt bgwhite font30" v-if="tasks && decoration.status == 3" style="overflow:hidden" slot="bottom">
      <div class="flex1 jusCenter br" :style="{color:mainColor}">巡检</div>
    </div>
    <!---->
    <div  @click="csClose"  class="flex-row h9 bt bgwhite font30" v-if="tasks && decoration.status == 5" style="overflow:hidden" slot="bottom">
      <div class="flex1 jusCenter br" :style="{color:mainColor}">客服关闭</div>
    </div>
  </yd-layout>
   <yd-layout class="layout_my" v-if="!showInput">
      <yd-navbar class="header" slot="navbar" v-title="'装修详情'" v-show="!userAgent.isWX" title="装修详情" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span class="spanLeft" @click="showInput = true" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
      </yd-navbar>
      <div class="bgwhite record">
        <!-- <div class="flex-row h9">
          <span>巡查人：</span><input class="flex1 border"  type="text" v-model="recordObj.checker">
        </div> -->
        <div class="flex-row h9">
          <span>检查日期：</span>
           <yd-datetime class="flex1 border" type="datetime" v-model="recordObj.inspectDate" slot="right"></yd-datetime>
        </div>
        <div class="flex-row">
          <span>巡查情况：</span><yd-textarea class="flex1 border" maxlength='200' :show-counter='false' style="height:3rem"  type="text" v-model="recordObj.description"></yd-textarea>
        </div>
        <div class="flex-row h9 flex-start">
          <span></span>
          <yd-button @click.native="addLine" type='hollow'>确定</yd-button>
        </div>
      </div>
   </yd-layout>
  <departMent v-if='!showUser' @setUserId='setUserId'></departMent>
  </div>

</template>
<script>
import Vue from "vue";
import fn from "@/assets/js/product";
import qs from "qs";
import departMent from "../repair/department_manager";

export default {
  components: {
    departMent
  },
  data() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );

    return {
      showInput: true,
      showAgree: false,
      showAgree1: false,
      showAgree2: false,
      detailrowRecordList: [],
      assigneeIdName: "",
      assigneeId: "",
      showUser: true,
      organInfo: {},
      userInfo: {},
      myrowRecordList: [],
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
      remark: "",
      tasks: null,
      record: [],
      description: "",
      recordObj: {
        checker: this.userInfo.guid,
        inspectDate: this.$today(true).substr(0, 16)
      }
    };
  },
  methods: {
    confirmComplete() {
      this.$dialog.confirm({
        mes: "是否确认完成",
        opts: () => {
          let data = {
            token: this.$getkey(),
            userId: this.userInfo.guid,
            decorationId: this.decoration.guid
          };
          this.$ajax(
            `${this.subUrl.activity}/decoration/executorConfirm`,
            data,
            res => {
              this.$dialog.toast({ mes: "已确认完成", icon: "success" });
              this.getDecoration();
            },
            this
          );
        }
      });
    },
    agree1() {
      this.$dialog.confirm({
        title: "",
        mes: "是否同意装修",
        opts: res => {
          let data = {
            token: this.$getkey(),
            userId: this.userInfo.guid,
            organId: this.organInfo.guid,
            decorationId: this.decorationId,
            opinion: "同意"
          };
          this.$ajax(
            `${this.subUrl.activity}/decoration/callServiceHandle`,
            data,
            res => {
              this.$dialog.toast({ mes: "已同意" });
              this.getDecoration();
            },
            this
          );
        }
      });
    },
    csClose(){
      this.$dialog.confirm({
        mes:"是否关闭装修",
        opts:res=>{
          let data = {
            token: this.$getkey(),
            userId: this.userInfo.guid,
            decorationI: this.decorationId,
          };
          this.$ajax(`${this.subUrl.activity}/decoration/closeTask`,data,res=>{
            this.$dialog.toast({mes:"已关闭",icon:"success"})
            this.getDecoration()
          },this)

        }
      })
    },
    addLine() {
      console.log(this.recordObj);
      if (this.recordObj.description == "") {
        return this.$dialog.toast({ mes: "请输入检查情况" });
      }
      var data = Object.assign({}, this.recordObj);
      data.inspectDate = data.inspectDate + ":00";
      this.description = "";
      this.record.push(data);
      this.showInput = true;
    },
    setUserId(e) {
      this.showUser = true;
      console.log(this.result);
      if (e) {
        this.assigneeIdName = e.userName;
        this.assigneeId = e.userId;
        console.log(e);
      }
    },
    // 同意和拒绝
    disagree(e) {
      this.$dialog.confirm({
        title: "",
        mes: "是否拒绝",
        opts: res => {
          let url = "";
          if (e == 1) {
            url = `${this.subUrl.activity}/decoration/callServiceHandle`;
            var data = {
              token: this.$getkey(),
              userId: this.userInfo.guid,
              decorationId: this.decoration.guid,
              opinion:"不同意",
              organId:this.organInfo.guid,
            };
          } else if (e == 2) {
            url = `${this.subUrl.activity}/decoration/manageOrganApprove`;
            var data = {
              token: this.$getkey(),
              userId: this.userInfo.guid,
              decorationId: this.decoration.guid,
              opinion: "不同意"
            };
          }
          console.log(url);
          this.$ajax(
            url,
            data,
            res => {
              this.$dialog.toast({
                mes: "已拒绝",
                icon: "success"
              });
              this.getDecoration();
            },
            this
          );
        }
      });
    },
    //客服同意
    confirm(e) {
      if (this.remark == "") {
        return this.$dialog.toast({ mes: "请输入备注" });
      } else if (this.assigneeId == "") {
        return this.$dialog.toast({ mes: "请选择审批人" });
      }
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        decorationId: this.decoration.guid,
        assigneeId: this.assigneeId
      };
      this.$ajax(
        `${this.subUrl.activity}/decoration/callServiceHandle`,
        data,
        res => {
          this.$dialog.toast({
            mes: "已同意",
            icon: "success"
          });
          this.remark = "";
          this.assigneeIdName = "";
          this.assigneeId = "";
          this.getDecoration();
          this.showAgree = false;
        },
        this
      );
    },
    // 经理同意
    confirm1(e) {
      if (this.record.length == 0) {
        return this.$dialog.toast({ mes: "请新增巡检记录！" });
      } else {
        let data = {
          decorationId: this.decorationId,
          rowRecordList: this.record,
          token: this.$getkey(),
          userId: this.userInfo.guid
        };
        this.$ajax1(
          `${this.subUrl.activity}/decoration/inspect`,
          data,
          res => {
            this.$dialog.toast({
              mes: "已记录",
              icon: "success"
            });
            this.getDecoration();
            this.showAgree2 = false;
          },
          this
        );
      }
    },
    //记录表
    confirm2() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        decorationId: this.decoration.guid,
        opinion: "同意",
        comment: this.remark,
        assigneeId: this.assigneeId
      };
      this.$ajax(
        `${this.subUrl.activity}/decoration/manageOrganApprove`,
        data,
        res => {
          this.showAgree1 = false;
          this.getDecoration();
          console.log("执行了什么操作！！！");
          return this.$dialog.toast({ mes: "已指派处理人！", icon: "success" });
        },
        this
      );
    },
    //删除单条记录
    deleteItem(index) {
      this.record.splice(index, 1);
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
    // 获取邀请信息列表
    getDecoration() {
      var data = {
        userId: this.userId,
        token: this.getkey,
        decorationId: this.decorationId
      };
      this.xhr
        .post(
          `${this.subUrl.activity}/decoration/getDecoration?` +
            qs.stringify(data)
        )
        .then(res => {
          console.log(res);
          if (res.data.code == 1) {
            if (res.data.data.decoration != null) {
              this.decoration = res.data.data.decoration;
              if (this.decoration.endDate) {
                this.decoration.endDate = res.data.data.decoration.endDate.substr(
                  0,
                  10
                );
              }
              if (this.decoration.createDate) {
                this.decoration.createDate = res.data.data.decoration.createDate.substr(
                  0,
                  10
                );
              }
              if (this.decoration.startDate) {
                this.decoration.startDate = res.data.data.decoration.startDate.substr(
                  0,
                  10
                );
              }
            }
            this.tasks = res.data.data.tasks;
            this.lists = res.data.data.decorationRowList;
            this.accessoryFiles = res.data.data.accessoryFiles;
            this.myrowRecordList = res.data.data.rowRecordList;

            res.data.data.tasksRecordList.forEach(element => {
              element.createTime = element.createTime.split(" ")[0];
            });
            this.statusList = res.data.data.tasksRecordList;
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
    this.decorationId = this.$route.query.guid;

    this.getDecoration();
  }
};
</script>
<style scoped>
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
  /* border: 1px solid #2d88d4; */
  /* color: #2d88d4; */
  padding: 0.05rem 0.1rem;
  font-size: 0.22rem;
}

.info {
  width: 100%;
  background: white;
  border-bottom: 1px solid #f3f6f5;
  padding: 0.1rem 0.3rem;
  font-size: 0.24rem;
  position: relative;
}
.info ul li {
  display: flex;
  height: 0.4rem;
}
.info ul li > span {
  width: 1.3rem;
  text-align: right;
  color: #9d9e9d;
}

.contacts {
  width: 100%;
  padding: 0.1rem 0.3rem;
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
  border: 2px solid #aaa;
  text-align: center;
  line-height: 0.7rem;
  border-radius: 50%;
  font-weight: 600;
  font-family: "楷体";
  font-size: 0.5rem;
  color: #aaa;
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
  padding: 0.2rem 0.2rem;
  background: white;
  margin-top: 0.3rem;
}
.text > p {
  border: 1px solid #eff1f1;
  text-indent: 0.5rem;
  line-height: 0.5rem;
  font-size: 0.3rem;
  font-weight: 600;
  color: #5a5b5a;
  padding: 0.1rem 0.1rem;
}

.images {
  width: 100%;
  margin-top: 0.2rem;
  display: flex;
}
.images > ul {
  width: 100%;
  display: flex;
  flex-flow: row;
  justify-content: flex-start;
  align-items: center;
}
.images > ul > li {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 0.1rem;
  margin-right: 0.2rem;
}
.images > ul > li > img {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 0.1rem;
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
  flex-flow: column;
  justify-content: center;
  position: relative;
}
.staff > ul > li > span {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.15rem;
}
.staff > ul > li > p {
  color: #7d7d7d;
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
/* .result ul li:nth-child(1) > p > i {
  width: 0.3rem;
  height: 0.3rem;
  margin-right: 0.1rem;
} */
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
.record {
  padding: 0.4rem 0;
}
.record .flex-row {
  padding: 0 0.2rem;
}
.record span {
  width: 1.6rem;
  padding: 0 0.1rem;
  text-align: right;
}
.record .flex1 {
  height: 0.68rem;
  padding: 0 0.1rem;
}
</style>
