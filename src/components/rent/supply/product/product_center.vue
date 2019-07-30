<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" v-title="'产品中心'" title="产品中心" :bgcolor="mainColor" color="#fff">
      <span class="addClickArea" slot="left" @click="back" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
    </yd-navbar>

    <div class="declares" style="margin-bottom:.2rem;">
        <div>
            <ul>
                <li v-for="(item,index) in pianList" :key="index">
                    <!-- <i><img :onerror="logo" src="" alt=""></i> -->
                    <yd-lightbox :num="item.img.length">
                        <yd-lightbox-img v-for="(todo,index) in item.img" :key="index" :onerror="logo" :src="todo"></yd-lightbox-img>
                    </yd-lightbox>
                    <a class="textHidden1">{{item.title}}</a>
                </li>
            </ul>
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
  import {DateTime} from 'vue-ydui/dist/lib.rem/datetime';
  import {TabBar, TabBarItem} from 'vue-ydui/dist/lib.rem/tabbar';
  import {Icons} from 'vue-ydui/dist/lib.rem/icons';

Vue.component(Icons.name, Icons);

Vue.component(TabBar.name, TabBar);
Vue.component(TabBarItem.name, TabBarItem);

  Vue.component(DateTime.name, DateTime);
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
        logo: 'this.src="' + require('../../../../assets/images/rent/supply/photo.png') + '"',
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
        userId1:'',
        pageNo:1,
        pageSize:100
      };
    },
    methods: {

      // 获取发布范围
      moreProduct() {
        let data={}
        data.userId = this.userId1;
        data.token = this.getkey;
        data.pageNo=this.pageNo;
        data.pageSize=this.pageSize;
        this.$ajax(`${this.subUrl.bd}/opportunity/moreProduct`,data,res =>
          {
            if(res.code==1){
             this.pianList = res.data;
             this.pianList.forEach(el=>{
                el.img=el.img.split(',')
              })
            }
          },
          this
        );
      },
      selectTab(index) {
        this.showTab = index;
      },
      cancel() {
        this.alertT=false;
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
      this.userId1=this.$route.query.userId;
      this.getkey = fn.getIng();
      this.moreProduct()
    }
  };
</script>
<style scoped>


  .declares {
  width: 100%;background: white;
}

.declares>div{width: 100%;padding:.2rem .2rem;display: flex;}
.declares>div>ul{width:100%;display: flex;justify-content: flex-start;flex-flow: row wrap;
align-items: center;}
.declares>div>ul>li{width:1.8rem;height:1.8rem;display: flex;flex-flow:column;
justify-content: center;align-items: center;margin:.05rem .27rem;}
.declares>div>ul>li>div{width:1.8rem;height:1.2rem;position: relative;border-radius: .1rem;}
.declares>div>ul>li>div>img{width:100%;height:100%;position: absolute;border-radius: .1rem;}
.declares>div>ul>li>div>img:first-child{z-index:999;}
.declares>div>ul>li>a{margin-top:.1rem;}
</style>