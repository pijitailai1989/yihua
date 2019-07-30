<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" title="详情" :bgcolor="mainColor" color="#fff">
      <span class="addClickArea" slot="left" @click="back" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
    </yd-navbar>
    <div class="declares">
        <ul>
            <li><p>房屋状态</p>
            <span v-if="details.status==0">空置</span>
            <span v-if="details.status==1">使用中</span>
            <span v-if="details.status==2">装修</span>
            <span v-if="details.status==3">欠费</span>
            <span v-if="details.status==4">未收楼</span>
            <span v-if="details.status==5">出租中</span>
            </li>
        </ul>
    </div>

    <div class="declares">
        <ol>
            <li style="color:#333;"><p>房屋信息</p></li>
        </ol>
        <ul>
            <li><p>楼盘名称</p><span>{{details.buildingName}}</span></li>
            <li><p>房屋单元</p><span>{{details.ridName}}{{details.unitName}}</span></li>
            <li><p>建筑面积</p><span>{{details.area}}</span></li>
            <li><p>业主姓名</p><span>{{userInfos.name}}</span></li>
            <li><p>联系电话</p><span>{{userInfos.account}}</span></li>
        </ul>
    </div>
    <div class="declares">
        <ol>
            <li style="color:#333;"><p>租户信息</p></li>
        </ol>
        <ul v-for="(item,index) in lesseeLogList" :key="index" style="border-bottom:1px dashed #ddd">
            <li><p>客户名称</p><span>{{item.organName}}</span></li>
            <li><p>入驻日期</p><span v-if="item.startDate">{{item.startDate.split(' ')[0]}}</span></li>
            <li><p>退租日期</p><span v-if="item.endDate">{{item.endDate.split(' ')[0]}}</span></li>
            <li><p>联系人</p><span>{{item.contacts}}</span></li>
            <li><p>联系电话</p><span>{{item.tel}}</span></li>
            <li><p>从事行业</p><span>{{item.industry }}</span></li>
            <li><p>是否续签</p>
            <span>{{item.renew?'是':'否'}}</span>
            </li>
        </ul>
    </div>
    <div class="declares">
        <ol>
            <li style="color:#333;"><p>抄表信息</p></li>
        </ol>
        <ul v-for="(item,index) in meterReadList" :key="index" style="border-bottom:1px dashed #ddd">
            <li><p>抄表日期</p><span v-if="item.meterRead">{{item.meterRead.split(' ')[0]}}</span></li>
            <li><p>抄表项目</p><span>{{item.project}}</span></li>
            <li><p>计量</p><span>{{item.dosage}}</span></li>
            <li><p>抄表人</p><span>{{item.meterReadUsername}}</span></li>
        </ul>
    </div>
    <yd-cell-group>
        <yd-cell-item arrow type="link" href="/house/explain">
            <span slot="left">设备维护明细说明</span>
        </yd-cell-item>
    </yd-cell-group>
    <div class="declares">
        <ol>
            <li style="color:#333;"><p>其他信息</p></li>
        </ol>
        <div>
        <yd-timeline >
             <yd-timeline-item>
                 <p>【完成】 退租</p>
                 <p style="margin-top: 10px;">2017-08-18 08:24:18</p>
             </yd-timeline-item>
             <yd-timeline-item>
                 <p>【马桶】 报修</p>
                 <p style="margin-top: 10px;">2017-08-18 07:25:08</p>
             </yd-timeline-item>
             <yd-timeline-item>
                 <p>【办理完毕】 入驻</p>
                 <p style="margin-top: 10px;">2017-08-17 21:44:08</p>
             </yd-timeline-item>
        </yd-timeline>
        </div>
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
        lesseeLogList:[],
        meterReadList:[],
        details:{},
        userInfos:{},
        buildingName:'',
        status:null,
      };
    },
    methods: {
      detail() {
      let data={}
      data.token=this.getkey;
      data.unitId=this.$route.query.guid;
      this.xhr.post(
          `${this.subUrl.activity}/ownersCom/detail?`,qs.stringify(data)
        ).then(res => {
          console.log(res)
          if (res.data.code == 1) {
             this.details=res.data.data;
             this.userInfos=res.data.data.userInfo;
             this.lesseeLogList=res.data.data.lesseeLogList;
             this.meterReadList=res.data.data.meterReadList;
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        });
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
    this.detail();
    console.log(this.$route.query.status,this.$route.query.buildingName)
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
  width: 1.4rem;
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