<template>
 <div style="height:100vh;width:100%;">
   <Kai v-show="!showshow" @pushSet="pushSet1"></Kai>
  <yd-layout v-show="showshow" class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" v-title="'推送设置'" title="推送设置" :bgcolor="mainColor" color="#fff">
      <span class="addClickArea" slot="left" @click="back" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
    </yd-navbar>
    
    <yd-cell-group>
        <yd-cell-item type="label">
            <div slot="left">每月1次(免费)</div>
            <span slot="right" @click="toggle" style="padding:.15rem .15rem;color:#fff;border-radius:.1rem;" :style="{background:mainColor}">开通业务</span>
        </yd-cell-item>
    </yd-cell-group>
    
    <div class="push">
        <ul>
            <li  v-for="(item,index) in pianList" :key="index">
                <p>{{item.createTime}}</p>
                <span>{{item.pushPackage}}</span>
                <span>开通</span>
            </li>
        </ul>
    </div>

  </yd-layout>
  </div>
</template>
<script>
  import fn from "@/assets/js/product";
  import qs from "qs";
  import InfiniteScroll from "vue-infinite-scroll";
  import Vue from "vue";
  import Kai from "./kaiTong.vue"
  import {CellGroup, CellItem} from 'vue-ydui/dist/lib.rem/cell';
  import {Switch} from 'vue-ydui/dist/lib.rem/switch';
  Vue.component(Switch.name, Switch);

  Vue.component(CellGroup.name, CellGroup);
  Vue.component(CellItem.name, CellItem);
  export default {
    components:{
      Kai
    },
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
        showshow:true,
        picked: false,
        peopleNum: "",
        organInfo,
        mainColor,
        userInfo,
        imgLength: 0,
        imgIndex: 0,
        TypeListCircle,
        bbsList: [],
        pianList: [],
        uploadFileList: [],
        uploadPreviewList: [],
        selectList: [],
        keyword: [],
        checkbox: false,
        agree: false,
        title: "",
        showTab: 0,
        text: "",
        getData: "",
        getLogoMsg: "",
        imageUrlList: [],
        imageKeyList: [],
        imageUrl: "",
        TypeList: "",
        TypeList1: -1,
        TypeList2: "",
        TypeList3: [],
        endTime,
        alertT:false,
        info:{
          name:'',mobile:null,decorationId:null,type:''
        },
        regId:/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
        regName:/^[a-zA-Z\u4e00-\u9fa5]+$/,
        regPhone:/^1[3578]\d{9}$/,
        getHearLog:{
          domain:'',
          token:'',
          name:''
        },
        imgName:[],
        imgUrl:[],
        show1:true,
        images:[],
        datetime2:this.$today(),
        datetime1:this.$today(),
        pageNo:1,
        pageSize:100
      };
    },
    methods: {
      pushSet1(e){
        this.showshow=true;
        if(e){}
      },
      pushSet() {
        let data={}
        data.token = this.getkey;
        data.pageNo=this.pageNo;
        data.pageSize=this.pageSize;
        this.$ajax(
          `${this.subUrl.bd}/opportunity/pushSet`,
          data,
          res => {

            if(res.data.list.length>0){
              res.data.list.forEach(element => {
                element.createTime=element.createTime.split(' ')[0]
              });
              this.pianList = res.data.list;
            }
            

          },
          this
        );
      },
      selectTab(index) {
        this.showTab = index;
      },
      toggle() {
        this.showshow=false;
      },
      back() {
        this.$router.go(-1);
      },
      turnTo(url){
          this.$router.push(url)
      }
    },
    mounted() {
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      this.pushSet();
    }
  };
</script>
<style scoped>
  .push{width:100%;margin-top:.2rem;background: white;}
  .push>ul{width:100%;border-top:1px solid #E5E5E4;}
  .push>ul>li{width:100%;display: flex;color:#888;height:.8rem;align-items: center;border-bottom:1px solid #E5E5E4;}
  .push>ul>li>p{flex:1;padding:0 .4rem;}
  .push>ul>li>span{width:1.4rem;text-align: center;}



</style>