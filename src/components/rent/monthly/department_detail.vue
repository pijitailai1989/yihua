<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" :title="title" :bgcolor="mainColor" color="#fff">
      <span class="addClickArea" slot="left" @click="back" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
    </yd-navbar>

    <yd-cell-group v-if="title=='安保月报明细'">
       <yd-cell-item arrow type="link" href="">
        <span slot="left">安全管理重大事项</span>
       </yd-cell-item>
       <yd-cell-item arrow type="link" href="">
        <span slot="left">消防管理重大事项</span>
       </yd-cell-item>
       <yd-cell-item arrow type="link" href="">
        <span slot="left">装修管理重大事项</span>
       </yd-cell-item>
       <yd-cell-item arrow type="link" href="">
        <span slot="left">培训记录</span>
       </yd-cell-item>
       <yd-cell-item arrow type="link" href="">
        <span slot="left">证件办理</span>
       </yd-cell-item>
       <yd-cell-item arrow type="link" href="">
        <span slot="left">外包项目</span>
       </yd-cell-item>
    </yd-cell-group>

    <yd-cell-group v-if="title=='财务月报明细'">
       <yd-cell-item arrow type="link" href="">
        <span slot="left">资金情况</span>
       </yd-cell-item>
       <yd-cell-item arrow type="link" href="">
        <span slot="left">缴费情况</span>
       </yd-cell-item>
    </yd-cell-group>

    <yd-cell-group v-if="title=='工程月报明细'">
       <yd-cell-item arrow type="link" href="">
        <span slot="left">设备设施管理</span>
       </yd-cell-item>
       <yd-cell-item arrow type="link" href="">
        <span slot="left">维修保养情况</span>
       </yd-cell-item>
       <yd-cell-item arrow type="link" href="">
        <span slot="left">遗留问题管理</span>
       </yd-cell-item>
       <yd-cell-item arrow type="link" href="">
        <span slot="left">工单管理</span>
       </yd-cell-item>
       <yd-cell-item arrow type="link" href="">
        <span slot="left">客户用电统计</span>
       </yd-cell-item>
       <yd-cell-item arrow type="link" href="">
        <span slot="left">公共用电统计</span>
       </yd-cell-item>
       <yd-cell-item arrow type="link" href="">
        <span slot="left">空调用电统计</span>
       </yd-cell-item>
       <yd-cell-item arrow type="link" href="">
        <span slot="left">公共用水统计</span>
       </yd-cell-item>
       <yd-cell-item arrow type="link" href="">
        <span slot="left">外包项目</span>
       </yd-cell-item>
    </yd-cell-group>
    
    <yd-cell-group v-if="title=='行政人事月报明细'">
       <yd-cell-item arrow type="link" href="">
        <span slot="left">人员情况</span>
       </yd-cell-item>
       <yd-cell-item arrow type="link" href="">
        <span slot="left">人员变动</span>
       </yd-cell-item>
       <yd-cell-item arrow type="link" href="">
        <span slot="left">采购管理</span>
       </yd-cell-item>
       <yd-cell-item arrow type="link" href="">
        <span slot="left">内部发文</span>
       </yd-cell-item>
       <yd-cell-item arrow type="link" href="">
        <span slot="left">外部发文</span>
       </yd-cell-item>
       <yd-cell-item arrow type="link" href="">
        <span slot="left">会议记录</span>
       </yd-cell-item>
       <yd-cell-item arrow type="link" href="">
        <span slot="left">培训记录</span>
       </yd-cell-item>
    </yd-cell-group>
    
    <yd-cell-group v-if="title=='客户服务月报明细'">
       <yd-cell-item arrow type="link" href="">
        <span slot="left">客户进驻</span>
       </yd-cell-item>
       <yd-cell-item arrow type="link" href="">
        <span slot="left">客户签约缴费</span>
       </yd-cell-item>
       <yd-cell-item arrow type="link" href="">
        <span slot="left">装修情况</span>
       </yd-cell-item>
       <yd-cell-item arrow type="link" href="">
        <span slot="left">投诉处理情况</span>
       </yd-cell-item>
       <yd-cell-item arrow type="link" href="">
        <span slot="left">客户活动</span>
       </yd-cell-item>
       <yd-cell-item arrow type="link" href="">
        <span slot="left">来访接待统计</span>
       </yd-cell-item>
       <yd-cell-item arrow type="link" href="">
        <span slot="left">保险索赔及诉讼</span>
       </yd-cell-item>
       <yd-cell-item arrow type="link" href="">
        <span slot="left">易耗品统计</span>
       </yd-cell-item>
       <yd-cell-item arrow type="link" href="">
        <span slot="left">垃圾清运情况</span>
       </yd-cell-item>
       <yd-cell-item arrow type="link" href="">
        <span slot="left">外包项目</span>
       </yd-cell-item>
    </yd-cell-group>

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
        title:''
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
    console.log(this.$route)
     if(this.$route.hash=='#1'){
        this.title='工程月报明细'
     }else if(this.$route.hash=='#2'){
        this.title='客户服务月报明细'
     }else if(this.$route.hash=='#3'){
        this.title='安保月报明细'
     }else if(this.$route.hash=='#4'){
        this.title='行政人事月报明细'
     }else if(this.$route.hash=='#5'){
        this.title='财务月报明细'
     }
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