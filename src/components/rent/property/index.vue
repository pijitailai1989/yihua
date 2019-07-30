<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" title="物业管理" :bgcolor="mainColor" color="#fff">
      <span class="addClickArea" slot="left" @click="back" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
    </yd-navbar>

    <div class="catalog">
         <ul>
             <li @click="turnTo('/monthly')">
                <i><img src="../../../assets/images/rent/ent/icon_01.png" alt=""></i>
                <span>项目月报</span>
             </li>
             <li @click="turnTo('/property/property_notice')">
                <i><img src="../../../assets/images/rent/my/newMessage.png" alt=""></i>
                <span>物业通知</span>
             </li>
             <li @click="turnTo('/property/property_inspection')">
                <i><img src="../../../assets/images/rent/ent/icon00.png" alt=""></i>
                <span>物业稽查</span>
             </li>
             <li @click="turnTo('/property/project_management')">
                <i><img src="../../../assets/images/rent/my/l3.png" alt=""></i>
                <span>项目管理</span>
             </li>
         </ul>
         <ul>
             <li>
                <i><img src="../../../assets/images/rent/ent/icon_05.png" alt=""></i>
                <span>高级查询</span>
             </li>
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
  import {Button, ButtonGroup} from 'vue-ydui/dist/lib.rem/button';

  Vue.component(Button.name, Button);
  Vue.component(ButtonGroup.name, ButtonGroup);
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
        managementInfo:{},
        ownersComInfo:{},
        status:0,

      };
    },
    methods: {
      
      info(){
        var data = {token:this.getkey,userId:this.userId};
        this.xhr.post(`${this.subUrl.activity}/ownersCom/relation/info`,qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
             this.managementInfo=res.data.data.managementInfo;
             this.ownersComInfo=res.data.data.ownersComInfo;
             this.status=res.data.data.status;
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      },
     //解除绑定
      unbind(){
        let data = {token:this.getkey,organId:this.organId};
        this.xhr.post(`${this.subUrl.activity}/ownersCom/relation/unbind`,qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
             this.$dialog.toast({mes: '解绑成功！'});
             this.status=0
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      },
      //绑定
      bind(){
        let data = {token:this.getkey,organId:this.organId};
        this.xhr.post(`${this.subUrl.activity}/ownersCom/relation/bind`,qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
             this.$dialog.toast({mes: '绑定成功！'});
             this.status=1
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      },
      add(){
        this.alertT=true;
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
   .catalog{width:100%;}
   .catalog>ul{width:100%;display:flex;flex-flow:row wrap;padding:.4rem .4rem 0;justify-content:space-between;}
   .catalog>ul>li{display:flex;flex-flow:column;width:1.2rem;}
   .catalog>ul>li>i{width:1.2rem;height:1.2rem;border-radius:50%;}
   .catalog>ul>li>i>img{width:100%;height:100%;border-radius:50%;}
   .catalog>ul>li>span{width:1.2rem;height:.6rem;line-height:.6rem;}
</style>