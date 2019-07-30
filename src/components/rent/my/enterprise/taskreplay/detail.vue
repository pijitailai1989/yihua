<template>
  <div style="height:100vh">
    <yd-layout v-show="showReplay">
      <yd-navbar slot="navbar" :title="mTitle" height=".88rem" color="#fff" :bgcolor="mainColor">
        <div class="addClickArea" slot="left" @click="$router.go(-1)">
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </div>
        <!--<div class="addRightClickArea" style="color:#fff" slot="right">提交</div>-->
      </yd-navbar>
      <div v-if="result.workReport" class="foCo6">
        <div class="flex-row-nowarp list_item h9 bgwhite bb font30 font600" style="padding: 0.2rem 0.26rem;">
          <div class="label">标题</div>
          <div class="flex1">{{result.workReport.title}}</div>
        </div>
        <!--信息-->
        <div class="bgwhite relative showAll" :style="showAll?`height:auto`:`height:.65rem`" v-if="result.workReport">
          <!--<div class="flex-row-nowrap h8 list_item" v-if="result.workReport.type">-->
          <!--<div class="label">申请类型</div>-->
          <!--<div class="flex1">{{result.workReport.type==1?"采购":"供应"}}</div>-->
          <!--</div>-->
          <div class="flex-row-nowrap h8 list_item">
            <div class="label">汇报人</div>
            <div class="flex1">{{result.workReport.userName}}</div>
          </div>
          <div class="flex-row-nowrap h8 list_item">
            <div class="label">部门</div>
            <div class="flex1">{{result.workReport.deptName}}</div>
          </div>
          <div class="flex-row-nowrap h8 list_item">
            <div class="label">收件人</div>
            <div class="flex1">{{result.workReport.accepterName}}</div>
          </div>
          <div class="flex-row-nowrap h8 list_item" v-if="type == 2">
            <div class="label">起止日期</div>
            <div class="flex1">{{result.workReport.startTime.substr(0,10)}}~{{result.workReport.endTime.substr(0,10)}}
            </div>
          </div>
          <div class="flex-row-nowrap h8 list_item" v-if="result.workReport.type">
            <div class="label">创建时间</div>
            <div class="flex1">{{result.workReport.reportTime}}</div>
          </div>
          <div class="flex-row-nowrap h8 list_item" v-if="result.workReport.type">
            <div class="label">申请单号</div>
            <div class="flex1">{{result.workReport.guid}}</div>
          </div>
          <div class="showButton" :style="{color:mainColor}" @click="showAll = !showAll">{{showAll?"隐藏":"显示"}}</div>
        </div>
        <!--批复内容-->
        <div class="bgwhite relative showAll bt bb" v-if="result.workReport && result.workReport.eply"
             :style="`margin:.25rem 0`">
          <div class="pdlr25 h8 bb font600 flex-row">回复内容：</div>
          <div class="flex-row pdlr25">{{result.workReport.eply}}</div>
        </div>
        <!--工作内容-->
        <div class="bgwhite relative showAll bt bb" v-if="result.reportDetailList" :style="`margin:.25rem 0`">
          <div class="pdlr25 h8 bb font600 flex-row">工作内容：</div>
          <div class="foCo6 bb" style="padding:.2rem .25rem;line-height: .5rem;"
               v-for="item,index in result.reportDetailList">
            <div><span class="font600">{{index + 1}}、工作内容：</span>{{item.workContent}}</div>
            <div><span class="font600">工作措施：</span>
              {{item.workMeasure}}
            </div>
            <div class="flex1 foCo9 font26" v-if="type!=1" style="justify-content: space-between">
              <div>
                <span class="foCoF">{{index + 1}}、</span>
                <span v-if="type == 2">执行人：</span>{{item.executorName}}
                <span v-if="type == 2">责任人：</span>{{item.executorName}}
              </div>
              <div>
                <span>完成情况：</span>
                <span>{{item.progress}}%</span>
              </div>
            </div>
          </div>
        </div>
        <!--详情描述-->
        <div v-if="result.workReport" style="padding: .3rem;" class="bgwhite mt3">
          <div class="border radius" style="padding:.1rem">{{result.workReport.summarize}}</div>
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

      </div>
      <div class="h9 flex-row bt bgwhite jusCenter font32" @click="showReplay = false" :style="{color:mainColor}"
           slot="bottom" v-if="$route.query.isApply && this.result.workReport&&this.result.workReport.isEply == 0">
        <yd-icon name="pinglun" size=".46rem" class="mr1 mt1" custom></yd-icon>
        <span>回复</span>
      </div>
    </yd-layout>
    <replay v-if="!showReplay" @operate="confirm" :type='replayType'></replay>
  </div>
</template>

<script>

  import replay from '../../../estate/serviceList/wuye/rectification/replay'

  export default {
    components: {
      replay
    },
    data() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = this.$color[this.userInfo.organType];
      this.type = this.$route.query.type;
      switch (this.type * 1) {
        case 1:
          this.mTitle = "日报详情";
          break;
        case 2:
          this.mTitle = "周报详情";
          break;
        case 3:
          this.mTitle = "月报详情";
          break;
        default:
          console.log(this.$route);
      }
      return {
        result: {},
        showAll: true,
        showReplay: true,
        replayType: "",
      }
    }, methods: {
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
            reportId: this.result.workReport.guid,
            eply: e,
          };
          this.$ajax(`${this.subUrl.activity}/workbench/workReport/myReport/eplyReportDetail`, data, res => {
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
          reportId: this.$route.params.id,
        };
        this.$ajax(`${this.subUrl.activity}/workbench/workReport/myReport/detail`, data, res => {
          this.result = res.data;
        }, this)
      }
    }, mounted() {
      this.getDetail();
    }
  }
</script>

<style scoped>
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
