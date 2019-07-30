<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" title="管理处详情" :bgcolor="mainColor" color="#fff">
      <span class="addClickArea" slot="left" @click="back" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
    </yd-navbar>
    <div class="declares">
        <ul>
            <li><p>状态</p>
            <span v-if="status==0">未绑定</span>
            <span v-if="status==1">已绑定</span>
            <span v-if="status==2">待确定</span>
            </li>
        </ul>
    </div>

    <div class="declares" v-if="status!=0">
        <ol>
            <li style="color:#333;"><p>管理处信息</p></li>
        </ol>
        <ul>
            <li><p>管理处名称</p><span>{{managementInfo.organName}}</span></li>
            <li><p>写字楼名称</p><span>{{managementInfo.buildingName}}</span></li>
            <li><p>管理处地址</p><span>{{managementInfo.address}}</span></li>
            <li><p>建筑面积</p><span>{{managementInfo.area?managementInfo.area:'暂无'}}</span></li>
            <li><p>写字楼主任</p><span>{{ownersComInfo.name}}</span></li>
            <li><p>管理处主任</p><span>{{managementInfo.name}}</span></li>
            <li><p>手机号码</p><span>{{managementInfo.account}}</span></li>
        </ul>
    </div>

    <yd-button-group slot="tabbar" style="margin-bottom:.2rem;">
        <yd-button v-if="status==2" size="large" type="primary" @click.native="bind" :bgcolor="mainColor" color="#fff">绑定</yd-button>
        <yd-button v-if="status==1" size="large" type="primary" @click.native="unbind" :bgcolor="mainColor" color="#fff">解绑</yd-button>
    </yd-button-group>
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
      confirm(){

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
    this.info()
    }
  };
</script>
<style scoped>
.declares .yd-timeline:after{border-top:none;}
.declares>div{width:100%;padding:.1rem .3rem;}
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
  width: 2rem;
  display: flex;
  height: 0.6rem;
  justify-content: flex-end;
  align-items: center;
  font-size: 0.3rem;
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