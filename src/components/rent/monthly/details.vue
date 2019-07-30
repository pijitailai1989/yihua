<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" title="管理处月报详情" :bgcolor="mainColor" color="#fff">
      <span class="addClickArea" slot="left" @click="back" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
    </yd-navbar>

    <div class="declares">
        <ol>
            <li style="color:#333;"><p>状态：已上报</p></li>
        </ol>
        <ul>
            <li><p>项目名称</p><span>0000000000000</span></li>
            <li><p>月份</p><span>0000000000000</span></li>
            <li><p>管理处</p><span>0000000000000</span></li>
            <li><p>汇报周期</p><span>0000000000000</span></li>
            <li><p>上报日期</p><span>0000000000000</span></li>
        </ul>
    </div>
    <div class="declares">
        <ol>
            <li style="color:#333;"><p>管理处基本信息</p></li>
        </ol>
        <ul>
            <li><p>地址</p><span>0000000000000</span></li>
            <li><p>管理关系</p><span>0000000000000</span></li>
            <li><p>建筑面积</p><span>0000000000000</span></li>
            <li><p>已出租面积</p><span>0000000000000</span></li>
            <li><p>入住率</p><span>0000000000000</span></li>
            <li><p>办公收费标准</p><span>0000000000000</span></li>
            <li><p>商业收费管理费</p><span>0000000000000</span></li>
            <li><p>当月应收费管理费</p><span>0000000000000</span></li>
            <li><p>当月实收费管理费</p><span>0000000000000</span></li>
            <li><p>当月收缴率</p><span>0000000000000</span></li>
            <li><p>当月员工数</p><span>0000000000000</span></li>
        </ul>
    </div>
    <div class="declares">
        <ol>
            <li style="color:#333;"><p>1、工程管理</p></li>
        </ol>
        <ul style="background:#FAFAFA;border-bottom:1px solid #ECECEC;" @click="turnTo('/monthly/detailss')">
            <li><p style="width:1rem;">事项</p><span>0000000000000</span></li>
            <li><p style="width:1rem;">说明</p><span>0000000000000</span></li>
            <li><p style="width:1rem;">进度</p><span>0000000000000</span></li>
        </ul>
        <yd-cell-group>
           <yd-cell-item arrow type="link" href="/monthly/department_detail#1">
            <span slot="left">工程管理明细</span>
           </yd-cell-item>
           <yd-cell-item arrow type="link" href="/monthly/next_plan">
            <span slot="left">下月计划</span>
           </yd-cell-item>
        </yd-cell-group>
    </div>
    <div class="declares">
        <ol>
            <li style="color:#333;"><p>2、客服管理</p></li>
        </ol>
        <ul style="background:#FAFAFA;border-bottom:1px solid #ECECEC;" @click="turnTo('/monthly/detailss')">
            <li><p style="width:1rem;">事项</p><span>0000000000000</span></li>
            <li><p style="width:1rem;">说明</p><span>0000000000000</span></li>
            <li><p style="width:1rem;">进度</p><span>0000000000000</span></li>
        </ul>
        <yd-cell-group>
           <yd-cell-item arrow type="link" href="/monthly/department_detail#2">
            <span slot="left">客服管理明细</span>
           </yd-cell-item>
           <yd-cell-item arrow type="link" href="/monthly/next_plan">
            <span slot="left">下月计划</span>
           </yd-cell-item>
        </yd-cell-group>
    </div>
    <div class="declares">
        <ol>
            <li style="color:#333;"><p>3、安保管理</p></li>
        </ol>
        <ul style="background:#FAFAFA;border-bottom:1px solid #ECECEC;" @click="turnTo('/monthly/detailss')">
            <li><p style="width:1rem;">事项</p><span>0000000000000</span></li>
            <li><p style="width:1rem;">说明</p><span>0000000000000</span></li>
            <li><p style="width:1rem;">进度</p><span>0000000000000</span></li>
        </ul>
        <yd-cell-group>
           <yd-cell-item arrow type="link" href="/monthly/department_detail#3">
            <span slot="left">安保管理明细</span>
           </yd-cell-item>
           <yd-cell-item arrow type="link" href="/monthly/next_plan">
            <span slot="left">下月计划</span>
           </yd-cell-item>
        </yd-cell-group>
    </div>
    <div class="declares">
        <ol>
            <li style="color:#333;"><p>4、行政人事管理</p></li>
        </ol>
        <ul style="background:#FAFAFA;border-bottom:1px solid #ECECEC;" @click="turnTo('/monthly/detailss')">
            <li><p style="width:1rem;">事项</p><span>0000000000000</span></li>
            <li><p style="width:1rem;">说明</p><span>0000000000000</span></li>
            <li><p style="width:1rem;">进度</p><span>0000000000000</span></li>
        </ul>
        <yd-cell-group>
           <yd-cell-item arrow type="link" href="/monthly/department_detail#4">
            <span slot="left">行政人事管理明细</span>
           </yd-cell-item>
           <yd-cell-item arrow type="link" href="/monthly/next_plan">
            <span slot="left">下月计划</span>
           </yd-cell-item>
        </yd-cell-group>
    </div>
    <div class="declares">
        <ol>
            <li style="color:#333;"><p>5、财务管理</p></li>
        </ol>
        <ul style="background:#FAFAFA;border-bottom:1px solid #ECECEC;" @click="turnTo('/monthly/detailss')">
            <li><p style="width:1rem;">事项</p><span>0000000000000</span></li>
            <li><p style="width:1rem;">说明</p><span>0000000000000</span></li>
            <li><p style="width:1rem;">进度</p><span>0000000000000</span></li>
        </ul>
        <yd-cell-group>
           <yd-cell-item arrow type="link" href="/monthly/department_detail#5">
            <span slot="left">财务管理明细</span>
           </yd-cell-item>
           <yd-cell-item arrow type="link" href="/monthly/next_plan">
            <span slot="left">下月计划</span>
           </yd-cell-item>
        </yd-cell-group>
    </div>
    <div class="declares">
        <ol>
            <li style="color:#333;"><p>6、突发事件</p></li>
        </ol>
        <ul style="background:#FAFAFA;border-bottom:1px solid #ECECEC;" @click="turnTo('/monthly/detailss')">
            <li><p style="width:1rem;">事项</p><span>0000000000000</span></li>
            <li><p style="width:1rem;">说明</p><span>0000000000000</span></li>
            <li><p style="width:1rem;">进度</p><span>0000000000000</span></li>
        </ul>
    </div>
    

  </yd-layout>
</template>
<script>
  import fn from "@/assets/js/product";
  import qs from "qs";
  import InfiniteScroll from "vue-infinite-scroll";
  import Vue from "vue";
  import { CellGroup, CellItem } from "vue-ydui/dist/lib.rem/cell";
  import {CheckBox, CheckBoxGroup} from 'vue-ydui/dist/lib.rem/checkbox';
  import {TextArea} from 'vue-ydui/dist/lib.rem/textarea';
  import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog';
  import {TimeLine, TimeLineItem} from 'vue-ydui/dist/lib.rem/timeline';
  Vue.component(TimeLine.name, TimeLine);
  Vue.component(TimeLineItem.name, TimeLineItem);
  Vue.prototype.$dialog = {
    confirm: Confirm,
    alert: Alert,
    toast: Toast,
    notify: Notify,
    loading: Loading,
  };
  Vue.component(TextArea.name, TextArea);
  Vue.component(CheckBox.name, CheckBox);
  Vue.component(CheckBoxGroup.name, CheckBoxGroup);
  Vue.component(CellGroup.name, CellGroup);
  Vue.component(CellItem.name, CellItem);
  import { Radio, RadioGroup } from "vue-ydui/dist/lib.rem/radio";
  Vue.component(Radio.name, Radio);
  Vue.component(RadioGroup.name, RadioGroup);
  export default {
    data() {
      let userInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("userInfo"))
      );
      let mainColor = this.$color[userInfo.organType];
      let endTime = this.$today();
      var organInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("organInfo"))
      );
      // 圈子类型 1企业 2 个人 3 物业
      //用户类型 1:租户；2:商家；3:管理处；4:物业公司；5:其他（个人）；6：业主 0为空
      // 根据用户类型判断
      var userType = userInfo.organType
      let TypeListCircle;
      if (userType == 1) {
        TypeListCircle = 1;
      } else if (userType == 5) {
        TypeListCircle = 2;
      } else{
        TypeListCircle = 3
      }
      return {
        picked: false,
        peopleNum: "",
        organInfo:{},
        mainColor:'',
        userInfo:{},
        userId:'',
        organId:'',
        getkey:'',
      };
    },
    methods: {
      add(){
        this.alertT=true;
      },
      confirm(){

      },
      turnTo(url){
          this.$router.push(url)
      },
      selectTab(index) {
        this.showTab = index;
      },
      cancel() {
        this.alertT=false;
      },
      back() {
        this.$router.go(-1);
      }
    },
    mounted() {
      this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.organType = JSON.parse(
      decodeURIComponent(localStorage.getItem("organType"))
    );
    this.mainColor = this.$color[this.organType];
    this.userId = this.userInfo.guid;
    this.organId = this.organInfo.guid;
    this.getkey = fn.getIng();
    }
  };
</script>
<style scoped>
.declares .yd-timeline:after{border-top:none;}
.yd-scrollview .yd-cell-box{margin-bottom: 0;}
.declares {
  width: 100%;background: white;margin-bottom:.2rem;
}
.declares>ul>li>span>i{padding:.02rem .02rem;color:#F2725E;border:1px solid #F2725E;
margin-left:.2rem;border-radius: .1rem;}
.declares>ul {
  width: 100%;
  padding: 0.1rem 0.3rem;
}
.declares>ul li {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
}
.declares>ul li > p {
  width: 2.4rem;
  display: flex;
  height: 0.6rem;
  justify-content: flex-end;
  align-items: center;
  font-size: 0.28rem;
  color: #777;
}
.declares>ul li > span {
  flex: 1;
  height: 0.6rem;
  display: flex;
  align-items: center;
  border-radius: 0.05rem;
  margin-left:.2rem;
}
.declares>ul li > span > input {
  width: 100%;
  height: 100%;
  border: none;
  margin-left: 0.1rem;
}

.declares>ol {
  width: 100%;
}
.declares>ol li{
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  height:.8rem;
  color: #777;
  padding:0 .4rem;
  align-items: center;
}
.declares>ol li>p{flex:1;height: .8rem;line-height: .8rem;}
.declares>ol li>span{width:1.5rem;height: .8rem;line-height: .8rem;}
.declares>ol li:nth-child(1){
  border-bottom:1px solid #ECECEC;
}
.declares ol li > a > i {
  border-radius: 50%;
  width: 0.4rem;
  height: 0.4rem;
  background: #0093d2;
  font-size: 0.4rem;
  display: flex;
  margin-right: 0.2rem;
  color: white;
  justify-content: center;
  align-items: center;
}
</style>