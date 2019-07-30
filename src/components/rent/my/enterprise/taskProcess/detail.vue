<template>
  <div style="height:100vh">
    <yd-layout v-show="showReplay && showMuti">
      <yd-navbar slot="navbar" :title="mTitle" height=".88rem" color="#fff" :bgcolor="mainColor">
        <div class="addClickArea" slot="left" @click="$router.go(-1)">
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </div>
        <div class="addRightClickArea font26"
             v-if="result.tasks && result.taskBill.status == 4 && result.tasks.status == 2"
             @click="$router.push(`/taskProcess/update/${result.taskBill.guid}`);" style="color:#fff" slot="right">更新进度
        </div>
      </yd-navbar>
      <div v-if="result.taskBill" class="foCo6">
        <div class="flex-row-nowarp list_item  bgwhite bb" style="padding: 0.2rem 0.26rem;height:.9rem">
          <div class="label">状态</div>
          <div class="flex1">
            <!--   状态 0关闭，1完成，2草稿，3未启动，4进行中，5验收,6超时未完成，7超时完成 ,, -->
            <span v-if="result.taskBill.status == 0">关闭</span>
            <span v-if="result.taskBill.status == 1">完成</span>
            <span v-if="result.taskBill.status == 2">草稿</span>
            <span v-if="result.taskBill.status == 3">未启动</span>
            <span v-if="result.taskBill.status == 4">进行中{{result.taskBill.progress}}%</span>
            <span v-if="result.taskBill.status == 5">验收</span>
            <span v-if="result.taskBill.status == 6">超时未完成</span>
            <span v-if="result.taskBill.status == 7">超时完成</span>
          </div>
        </div>
        <!--信息-->
        <div class="bgwhite relative showAll" :style="showAll?`height:auto`:`height:.65rem`" v-if="result.taskBill">
          <div class="flex-row-nowrap h8 list_item">
            <div class="label">标题</div>
            <div class="flex1">{{result.taskBill.taskName}}</div>
          </div>
          <div class="flex-row-nowrap h8 list_item">
            <div class="label">类型</div>
            <div class="flex1">{{result.taskBill.typeName}}</div>
          </div>
          <div class="flex-row-nowrap h8 list_item">
            <div class="label">起止日期</div>
            <div class="flex1">
              {{result.taskBill.startDate.substr(0,10).replace(/-/g,'/')}}-{{result.taskBill.completionDate.substr(0,10).replace(/-/g,'/')}}
            </div>
          </div>
          <div class="flex-row-nowrap h8 list_item" v-if="result.taskBill.type">
            <div class="label">创建时间</div>
            <div class="flex1">{{result.taskBill.createDate.replace(/-/g,'/')}}</div>
          </div>
          <div class="flex-row-nowrap h8 list_item" v-if="result.taskBill.type">
            <div class="label">单号</div>
            <div class="flex1">{{result.taskBill.guid}}</div>
          </div>
          <div class="showButton" :style="{color:mainColor}" @click="showAll = !showAll">{{showAll?"隐藏":"显示"}}</div>
        </div>
        <!--详情描述-->
        <div v-if="result.taskBill" style="padding: .3rem;" class="bgwhite mt3">
          <div class="border radius" style="padding:.1rem">{{result.taskBill.taskDetail}}</div>
        </div>
        <!--测试-->
        <!--"-->
        <yd-lightbox class="bgwhite"
                     style="display: flex;justify-content: flex-start;flex-flow: row wrap;padding:.2rem .3rem;"
                     v-if="result.commAccessoryList && (result.commAccessoryList.length >0)"
                     :num="result.commAccessoryList.length">
          <div v-for="item, key  in result.commAccessoryList" style="width: 25%;padding:.1rem;" :key="key">
            <yd-lightbox-img :src="item.path" style="width:1.6rem;height:1.6rem;"></yd-lightbox-img>
          </div>
        </yd-lightbox>
        <div class="bgwhite bb bt" style="margin-bottom:.2rem;">
          <div class="flex-row pdlr25 bb">执行人信息</div>
          <div class="usuallyBox">
            <div class="list_item flex-start">
              <div class="label">创建人</div>
              <div class="flex">{{result.taskBill.userName}}</div>
            </div>
            <div class="list_item flex-start">
              <div class="label">执行人</div>
              <div class="flex" style="flex-flow: column wrap;align-items: flex-start;width:4.5rem">{{username}}</div>
            </div>
            <div class="list_item flex-start">
              <div class="label">验证人</div>
              <div class="flex">{{result.taskBill.identifierInfo.name}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="usuallyBox boxList bt" v-if="result.taskProgressList && result.taskProgressList.length > 0">
        <div class="list_item pdlr25 bb">
          <div>指派人</div>
          <div style="width: 1rem">完成度</div>
          <div  style="width:3rem;text-align: center">更新时间</div>
        </div>
        <div class="list_item pdlr25" @click="$router.push(`/taskProcess/updateDetail/${item.guid}`)" v-for="item,index in result.taskProgressList">
          <div>{{item.userName}}</div>
          <div  style="width: 1rem">{{item.progress?item.progress:0}}%</div>
          <div style="width:3rem;text-align: right">{{item.updataTime?item.updataTime:$today()}}</div>
        </div>
      </div>
      <yd-timeline style="margin-top:.2rem;">
        <yd-timeline-item v-for='(item,index) in result.tasksRecordList'
                          v-if="result.tasksRecordList && result.tasksRecordList.length > 0" :key='index'>

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
      <div class="h9 flex-row bt bgwhite jusCenter font32" :style="{color:mainColor}"
           slot="bottom"
           v-if="result.tasks&&result.taskBill.status == 4&&result.tasks.status == 1 && userInfo.organType < 4">
        <div class="flex1 jusCenter br" style="color:#f00" @click="disagree">
          <yd-icon name="disagree1" class="mr1 mt1" size=".4rem" custom></yd-icon>
          <span>驳回</span>
        </div>
        <div class="flex1 jusCenter br" style="color:#999" @click="showMuti=false">
          <!--<yd-icon name="selected" size=".46rem" class="mr1 mt1" custom></yd-icon>-->
          <img style="width:.4rem;height:.4rem" src="../../../../../assets/images/rent/ent/share.png" width="18" slot="icon"  alt="">
          <span>指派执行人</span>
        </div>
        <div class="flex1 jusCenter br" @click="startTask" :style="{color:mainColor}">
          <yd-icon name="selected" size=".46rem" class="mr1 mt1" custom></yd-icon>
          <span>确定</span>
        </div>
      </div>
      <div class="flex-row-nowarp h9 bt bgwhite" slot="bottom" v-if="result.tasks&&result.taskBill.status == 5">
        <div class="flex1 jusCenter br" @click="endTask" :style="{color:mainColor}">
          <yd-icon name="selected" size=".46rem" class="mr1 mt1" custom></yd-icon>
          <span>验收任务</span>
        </div>
      </div>
    </yd-layout>
    <replay v-if="!showReplay" @operate="confirm" :type='replayType'></replay>
    <muDepart v-if='!showMuti' :type="1" :deptId="userInfo.deptId" :organId='organInfo.guid'
              @setUserId='setMuti'></muDepart>

  </div>
</template>

<script>

  import replay from '../../../estate/serviceList/wuye/rectification/replay'
  import Vue from 'vue'
  import muDepart from './mutiDep'
  import {TimeLine, TimeLineItem} from "vue-ydui/dist/lib.rem/timeline";

  Vue.component(TimeLine.name, TimeLine);
  Vue.component(TimeLineItem.name, TimeLineItem);
  export default {
    components: {
      replay,
      muDepart
    },
    data() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = this.$color[this.userInfo.organType];
      this.type = this.$route.query.type;
      this.mTitle = "任务详情";
      return {
        showMuti: true,
        result: {},
        showAll: true,
        showReplay: true,
        replayType: "",
        username: "",
        executorIdList: "",
        executorIdListName: ""
      }
    }, methods: {
      setMuti(e) {
        this.showMuti = true;
        if (e) {
          this.executorIdList = e.userIdArr.join(',')
          this.executorIdListName = e.userArr.join(',');
          console.log(JSON.stringify(e));
          let data = {
            token: this.$getkey(),
            userId: this.userInfo.guid,
            idList: this.executorIdList,
            taskBillId: this.result.taskBill.guid,
            type: 2,
          };
          this.$ajax(`${this.subUrl.activity}/taskBill/allocationTask/assignedExecutor`, data, res => {
            this.$dialog.toast({mes: "已指派执行人", icon: "success"});
            this.getDetail();
          }, this)
        }
      },
      disagree() {
        this.$dialog.confirm({
          mes: "是否驳回任务", opts: () => {
            let data = {
              token: this.$getkey(),
              userId: this.userInfo.guid,
              taskBillId: this.result.taskBill.guid,
              type: 0,
            };
            this.$ajax(`${this.subUrl.activity}/taskBill/allocationTask/assignedExecutor`, data, res => {
              this.$dialog.toast({mes: "驳回成功", icon: "success"});
              this.getDetail();
            }, this)
          }
        })
      },
      startTask() {
        this.$dialog.confirm({
          mes: "是否启动任务", opts: () => {
            let data = {
              token: this.$getkey(),
              userId: this.userInfo.guid,
              taskBillId: this.result.taskBill.guid,
              type: 1,
            };
            this.$ajax(`${this.subUrl.activity}/taskBill/allocationTask/assignedExecutor`, data, res => {
              this.$dialog.toast({mes: "启动成功", icon: "success"});
              this.getDetail();
            }, this)
          }
        })
      },
      endTask(){
        this.$dialog.confirm({
          mes: "是否验收任务", opts: () => {
            let data = {
              token: this.$getkey(),
              userId: this.userInfo.guid,
              taskId: this.result.taskBill.guid,
            };
            this.$ajax(`${this.subUrl.activity}/taskBill/taskProgress/completeIdentify`, data, res => {
              this.getDetail();
              this.$dialog.toast({mes: "验收成功", icon: "success"});
            }, this)
          }
        })
      },
      setReplay(e) {
        this.showReplay = false;
        this.replayType = e;
      },
      confirm(e) {
        this.showReplay = true;
        if (e) {
          console.log(e)
          let data = {
            token: this.$getkey(),
            reportId: this.result.taskBill.guid,
            eply: e,
          };
          this.$ajax(`${this.subUrl.activity}/workbench/taskBill/myReport/eplyReportDetail`, data, res => {
            let txt = this.replayType ? "已同意" : "已拒绝"
            this.$dialog.toast({mes: "已回复", icon: "success"});
            this.getDetail();
          }, this)
        }
      },
      getDetail() {
        let data = {
          token: this.$getkey(),
          userId: this.userInfo.guid,
          taskId: this.$route.params.id,
        };
        this.$ajax(`${this.subUrl.activity}/taskBill/taskProgress/taskBillDetail`, data, res => {
          if (res.data) {
            this.result = res.data;
            var arr = [];
            for (var i of res.data.taskBill.executorInfo) {
              arr.push(i.name)
            }
            this.username = arr.join(',')
          }

        }, this)
      }
    }, mounted() {
      this.getDetail();
    }
  }
</script>

<style scoped>
  .boxList .list_item > div {
    width: 2rem;
    overflow: hidden;
  }

  .list_item {
    padding: 0 .3rem;
    height: .65rem;
  }

  .showAll {
    overflow: hidden;
    border-bottom: 1px solid #ddd;
  }

  .showButton {
    position: absolute;
    right: .5rem;
    bottom: .2rem;
  }

  .list_item .label {
    width: 2rem;
    text-align: right;
    padding-right: .3rem;
  }
</style>
