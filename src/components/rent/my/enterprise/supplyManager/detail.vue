<template>
  <div style="height:100vh">
    <yd-layout v-show="showReplay">
      <yd-navbar slot="navbar" title="详情" height=".88rem" color="#fff" :bgcolor="mainColor">
        <div class="addClickArea" slot="left" @click="$router.go(-1)">
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </div>
        <!--<div class="addRightClickArea" style="color:#fff" slot="right">提交</div>-->
      </yd-navbar>
      <div v-if="result.pasa" class="foCo6">
        <div class="flex-row-nowarp h9 bgwhite bb" style="padding: 0 0.26rem 0 0.5rem;">
          <span class="font34">{{result.pasa.title}}</span>
          <!--<span class="pdlr1 state stateClose" v-if="item.status == 0">关闭</span>-->
          <!--<span class="pdlr1 state state1" v-if="item.status == 1">完成</span>-->
          <!--<span class="pdlr1 state state2" v-if="item.status == 2">草稿</span>-->
          <!--<span class="pdlr1 state state2" v-if="item.status == 3">待审批</span>-->
          <!--<span class="pdlr1 state state1" v-if="item.status == 4">同意</span>-->
          <!--<span class="pdlr1 state state0" v-if="item.status == 5">不同意</span>-->
          <!--0:关闭, 1:完成, 2:草稿 3:待批 4:同意 5:不同意 ,-->
          <span class="state stateClose" v-if="result.pasa.status == 0">关闭</span>
          <span class="state state1" v-if="result.pasa.status == 1">完成</span>
          <span class="state state2" v-if="result.pasa.status == 2">草稿</span>
          <span class="state state2" v-if="result.pasa.status == 3">待审批</span>
          <span class="state state1" v-if="result.pasa.status == 4">同意</span>
          <span class="state state0" v-if="result.pasa.status == 5">不同意</span>
        </div>
        <!--信息-->
        <div class="bgwhite relative showAll" :style="showAll?`height:auto`:`height:.65rem`" v-if="result.pasa">
          <div class="flex-row-nowrap h8 list_item" v-if="result.pasa.type">
            <div class="label">申请类型</div>
            <div class="flex1">{{result.pasa.type==1?"采购":"供应"}}</div>
          </div>
          <div class="flex-row-nowrap h8 list_item">
            <div class="label">申请人</div>
            <div class="flex1">{{result.pasa.userInfo.name}}</div>
          </div>
          <div class="flex-row-nowrap h8 list_item">
            <div class="label">开始时间</div>
            <div class="flex1">{{result.pasa.startTime.substr(0,10)}}</div>
          </div>
          <div class="flex-row-nowrap h8 list_item" v-if="result.pasa.type">
            <div class="label">结束时间</div>
            <div class="flex1">{{result.pasa.completionDate.substr(0,10)}}</div>
          </div>
          <div class="flex-row-nowrap h8 list_item" v-if="result.pasa.type">
            <div class="label">创建时间</div>
            <div class="flex1">{{result.pasa.createTime}}</div>
          </div>
          <div class="flex-row-nowrap h8 list_item" v-if="result.pasa.type">
            <div class="label">申请单号</div>
            <div class="flex1">{{result.pasa.guid}}</div>
          </div>
          <div class="showButton" :style="{color:mainColor}" @click="showAll = !showAll">{{showAll?"隐藏":"显示"}}</div>
        </div>
        <!--详情描述-->
        <div v-if="result.pasa" style="padding: .3rem;" class="bgwhite mt3">
          <div class="border radius" style="padding:.1rem">{{result.pasa.detail}}</div>
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
      <div class="flex-row-nowarp h9 bgwhite bt" v-if="result.tasks && result.pasa.status == 3" slot="bottom">
        <div class="flex1 jusCenter br" @click="setReplay(0)">
          <yd-icon name="disagree" class="mr1" color="#f00" custom size=".4rem"></yd-icon>
          <span style="color:#f00">不同意</span>
        </div>
        <div class="flex1 jusCenter" @click="setReplay(1)">
          <yd-icon name="agree" class="mr1" :color="mainColor" custom size=".4rem"></yd-icon>
          <span :style="{color:mainColor}">同意</span>
        </div>
      </div>
    </yd-layout>
    <replay v-if="!showReplay" @operate="confirm" :type='replayType'></replay>
  </div>
</template>

<script>
  import replay from '../../../estate/serviceList/wuye/rectification/replay'
  export default {
    components:{
      replay
    },
    data() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = this.$color[this.userInfo.organType];
      return {
        result: {},
        showAll: true,
        showReplay:true,
        replayType:"",
      }
    }, methods: {
      setReplay(e){
        this.showReplay = false;
        this.replayType = e;
      },
      confirm(e) {
        this.showReplay = true;
        if(e) {
          console.log(e)
          let data = {
            token: this.$getkey(),
            userId: this.userInfo.guid,
            pasaId: this.result.pasa.guid,
            approvalInfo: e,
            result: this.replayType,
          };
          this.$ajax(`${this.subUrl.activity}/pasa/myReport/approval`, data, res => {
            let txt = this.replayType?"已同意":"已拒绝"
            this.$dialog.toast({mes:"成功",icon:"success"});
            this.getDetail();
          }, this)
        }
      },
      getDetail() {
        let data = {
          token: this.$getkey(),
          userId: this.userInfo.guid,
          pasaId: this.$route.query.guid,
        };
        this.$ajax(`${this.subUrl.activity}/pasa/detail`, data, res => {
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
