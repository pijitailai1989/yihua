<template>
  <yd-layout v-show="showshow" class="edit" style="background:white;">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" v-title="'业务开通'" title="业务开通" :bgcolor="mainColor" color="#fff">
      <span class="addClickArea" slot="left" @click="back" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
    </yd-navbar>
    <div class="kaitong">
          <p>选择购买类型</p>
          <ul>
              <li v-for="(item,index) in kaiList" :key="index">
                  <p @click="clickS(index,item.guid)">
                      <i v-if="item.clickImg"><img src="../../../../assets/images/rent/baishitong/select_active.png" alt=""></i>
                      <i v-else><img src="../../../../assets/images/rent/baishitong/select.png" alt=""></i>
                  </p>
                  <p>
                      <span class="font28 font600">{{item.name}}</span>
                      <span style="color:#999;">推送次数{{item.num}}</span>
                  </p>
                  <p>
                      <span class="font32 font600" style="color:#DE2931;">{{item.bp}}</span>
                      <span style="color:#999;">商机点</span>
                  </p>
              </li>
          </ul>
    </div>

    <yd-button-group slot="tabbar" style="margin-bottom:.2rem;">
        <yd-button @click.native="buyPushPlan" :bgcolor="mainColor" color="#fff" size="large" type="primary">确定</yd-button>
    </yd-button-group>

  </yd-layout>
</template>
<script>
  import fn from "@/assets/js/product";
  import qs from "qs";
  import InfiniteScroll from "vue-infinite-scroll";
  import Vue from "vue";
  import Kai from "./kaiTong"
  import {CellGroup, CellItem} from 'vue-ydui/dist/lib.rem/cell';
  import {Switch} from 'vue-ydui/dist/lib.rem/switch';
  import {Radio, RadioGroup} from 'vue-ydui/dist/lib.rem/radio';
  Vue.component(Radio.name, Radio);
  Vue.component(RadioGroup.name, RadioGroup);
  Vue.component(Switch.name, Switch);

  Vue.component(CellGroup.name, CellGroup);
  Vue.component(CellItem.name, CellItem);
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
        kaiList:[
            {id:1,num:3,nums:10,price:300,clickImg:false},
            {id:2,num:6,nums:20,price:500,clickImg:false},
            {id:3,num:12,nums:30,price:800,clickImg:false}
        ],
        radio:'',
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
        pageSize:500,
        guid:''
      };
    },
    methods: {
      clickS(index,guid){
         this.kaiList[index].clickImg=true;
         this.kaiList.forEach( (el,i)=>{
           if(i!=index){
             el.clickImg=false;
           }
         } )

         this.guid=guid
      },
      buyPushPlan() {
        let data={}
        if(this.guid==''){ return this.$dialog.toast({mes: '请选择套餐！'}); }
        data.token = this.getkey;
        data.guid=this.guid;
        data.payType=2
        this.$ajax(
          `${this.subUrl.bd}/opportunity/buyPushPlan`,
          data,
          res => {
            this.$dialog.toast({mes: '购买成功！'});
            this.$emit('pushSet')
          },
          this
        );
        this.guid=''
      },
      pushPlanList() {
        let data={}
        data.token = this.getkey;
        this.$ajax(
          `${this.subUrl.bd}/opportunity/pushPlanList`,
          data,
          res => {
            
            if(res.data.pushPlanList!=null){
              res.data.pushPlanList.forEach(element => {
                element.clickImg=false;
              });
              this.kaiList = res.data.pushPlanList ;
            }
          },
          this
        );
      },
      selectTab(index) {
        this.showTab = index;
      },
      kaiOk() {
        this.$emit('pushSet')
      },
      back() {
        this.$emit('pushSet')
      },
      turnTo(url){
          this.$router.push(url)
      }
    },
    mounted() {
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      this.pushPlanList()

    }
  };
</script>
<style scoped>
.kaitong{width:100%;}
.kaitong>p{width:100%;padding:.2rem .4rem;color:#999;
font-size: .26rem;border-bottom: 1px solid #ddd;}
.kaitong>ul{width:100%;}
.kaitong>ul>li{width:100%;display: flex;align-items: center;height: 1rem;
border-bottom: 1px solid #ddd;}
.kaitong>ul>li>p{display: flex;}
.kaitong>ul>li>p:nth-child(1){width: 1rem;display: flex;justify-content: center;}
.kaitong>ul>li>p:nth-child(1)>i{width:.4rem;height:.4rem;}
.kaitong>ul>li>p:nth-child(1)>i>img{width:100%;height:100%;}
.kaitong>ul>li>p:nth-child(2){flex:1;flex-flow:column;}
.kaitong>ul>li>p:nth-child(3){width: 2rem;flex-flow:column;}

</style>