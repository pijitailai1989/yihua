<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" :title="title" :bgcolor="mainColor" color="#fff">
      <span class="addClickArea" slot="left" @click="back" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
    </yd-navbar>
    
    <div class="info">
         <ul>
           <li style="border-bottom:1px solid #ECECEC;"  v-show="bm.type==1||bm.type==3"><span>状态</span><p>{{status}}</p></li>
           <li style="border-bottom:1px solid #ECECEC;" v-show="bm.type==4"><span>邀联时间</span><p>2018-8-8 12:12:12</p></li>
           <li><span>产品名称</span><p>{{titleT}}</p></li>
           <li><span>供应商</span><p>{{organInfo1.organName}}</p></li>
           <li><span></span><p><i v-show="organInfo1.vipType!=''" style="background:#C8E7FF;color:#61BBFF;">{{organInfo1.vipType}}</i>
           <i style="background:#FFE7C8;color:#FFB454;">{{organInfo1.years}}年</i></p></li>
           <li><span>联系人</span><p>{{organInfo1.userName}}</p></li>
           <li v-show="bm.type==3"><span>电话</span><p>{{organInfo1.phone}}</p></li>
           <li><span>地区</span><p>{{organInfo1.organAddress}}</p></li>
         </ul>
    </div>
    <div class="group_buying" v-show="bm.type==2">
          <div>团购进行中</div>
          <div>
              <ul>
                  <li style="height:.8rem;"><p>已参加</p><span style="color:#F2725E;font-size:.8rem;">{{productOrder.paGroupNum}}</span><a>倒计时</a></li>
                  <li><span style="margin-left:.3rem;color:#999">{{priceList[0]}}</span>
                  <a>
                      <template>
                          <yd-countdown slot="right" :time="productOrder.endTime">
                              <em>{%d1}{%d2}</em>天
                              <em>{%h1}{%h2}</em>时
                              <em>{%m1}{%m2}</em>分
                          </yd-countdown>
                      </template>
                  </a>
                  </li>
                  <li><span style="margin-left:.3rem;color:#999">{{priceList[1]}}</span><a>服务区域 {{productOrder.scopeValueStr}}</a></li>
              </ul>
          </div>
      </div>


    <div class="contact" v-show="bm.type==1">
        <ul>
            <li><span style="color:#999;">状态</span><span>{{detail.state1}}</span>
            <span style="color:#999;font-size:.24rem;">{{detail.createTime}}</span></li>
            <li><span style="color:#999;">联系人</span><span>{{detail.name}}</span></li>
            <li><span style="color:#999;">电话</span><span>{{detail.phone}}</span></li>
            <li><span style="color:#999;">预约时间</span><span>{{detail.createTime}}</span></li>
            <li>
                <p>留言</p>
                <i class="bb">
                 <yd-textarea slot="right" readonly :placeholder="detail.remarks" maxlength="100"></yd-textarea>
                </i>
            </li>
            <li style="color:#999;font-size:.24rem;">稍后商家联系您确认</li>
        </ul>
    </div>
    <div class="contact" v-show="bm.type==2">
        <ul>
            <li><span></span>
            <span style="color:#999;font-size:.24rem;">{{detail.createTime}}</span></li>
            <li><span style="color:#999;">联系人</span><span>{{detail.name}}</span></li>
            <li><span style="color:#999;">电话</span><span>{{detail.phone}}</span></li>
            <li><span style="color:#999;">所在地址</span><span>{{detail.address}}</span></li>
            <li>
                <p>备注</p>
                <i class="bb">
                 <yd-textarea slot="right" readonly :placeholder="detail.remarks" maxlength="100"></yd-textarea>
                </i>
            </li>
            <li style="height:0;"></li>
        </ul>
    </div>

    <div class="declares" style="margin:.2rem 0" v-show="bm.type==3">
        <div class="textar">
          <div>
           <p>我的留言</p>
           <i class="bb">
            <yd-textarea slot="right" readonly :placeholder="detail.message" maxlength="100"></yd-textarea>
           </i>
          </div>
          <div style="margin:0 0;"><p></p>
          <span style="text-align: right;height:.4rem;color:#999;" class="aa">{{detail.messageTime}}</span></div>
        </div>
        <!-- <ol>
            <li style="color:#333;">
                <yd-checkbox v-model="checkbox">允许同品类其他优质供应商联系我</yd-checkbox></li>
        </ol> -->
    </div>

    <div class="declares" style="margin:.2rem 0" v-show="bm.type==3">
        <ol>
            <li style="color:#333;">供应商留言</li>
        </ol>
        <div class="textar">
          <div><p>报价</p><span class="bb"><input disabled="disabled" v-model="detail.offer" type="text"></span></div>
          <div>
           <p>附言</p>
           <i class="bb">
            <yd-textarea slot="right" readonly :placeholder="detail.explains" maxlength="100"></yd-textarea>
           </i>
          </div>
          <div style="margin:0 0;"><p></p>
          <span style="text-align: right;height:.4rem;color:#999;" class="aa">2017-12-12 15:30</span></div>
        </div>
    </div>

    
    <yd-tabbar slot="tabbar" class="bottoms" v-show="detail.state==0" v-if="bm.type==1||bm.type==2">
        <span @click="delBespeak" v-show="bm.type==1"><i><img src="../../../../assets/images/rent/supply/disagree.png" alt=""></i>取消预约</span>
        <span @click="delBespeak" v-show="bm.type==2"><i><img src="../../../../assets/images/rent/supply/disagree.png" alt=""></i>取消团购</span>
    </yd-tabbar>
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
        bm:{
          type:1,
          token:'',
          guid:'',
          type1:null,
        },
        detail:{},
        organInfo1:{},
        titleT:'',
        status:'',
        productOrder:{},
        priceList:[],
      };
    },
    methods: {
      cancel() {
        this.alertT=false;
      },
      back() {
        this.$router.go(-1);
      },
      //预约、团购
      aboutInfo() {
        let data={};
        data.guid = this.bm.guid;
        data.token = this.getkey;
        data.type=this.bm.type1
        this.$ajax(
          `${this.subUrl.bd}/purchase/aboutInfo`,
          data,
          res => {
            console.log(res)
           this.organInfo1=res.data.organInfoDto3
           this.detail=res.data;
           this.productOrder=res.data.productOrder;
           this.priceList=this.productOrder.priceSectionDescribe.split(',')
           if(this.organInfo1.vipType==1){
                 this.organInfo1.vipType='基础'
               }else if(this.organInfo1.vipType==2){
                 this.organInfo1.vipType='中级'
               }else if(this.organInfo1.vipType==3){
                 this.organInfo1.vipType='高级'
               }else if(this.organInfo1.vipType==4){
                 this.organInfo1.vipType='金牌'
               }else if(this.organInfo1.vipType==0){
                 this.organInfo1.vipType='';
               }

               if(this.detail.state==0){
                 this.detail.state1='未联'
               }else if(this.detail.state==1){
                 this.detail.state1="已联"
               }else if(this.detail.state==2){
                 this.detail.state1="已取消"
               }
           
          },
          this
        );
      },
      //邀联
      contactInfo() {
        let data={};
        data.guid = this.bm.guid;
        data.token = this.getkey;
        this.$ajax(
          `${this.subUrl.bd}/purchase/contactInfo`,
          data,
          res => {
            this.detail=res.data
            this.organInfo1=res.data.organInfoDto3
            if(this.organInfo1.vipType==1){
                 this.organInfo1.vipType='基础'
               }else if(this.organInfo1.vipType==2){
                 this.organInfo1.vipType='中级'
               }else if(this.organInfo1.vipType==3){
                 this.organInfo1.vipType='高级'
               }else if(this.organInfo1.vipType==4){
                 this.organInfo1.vipType='金牌'
               }else if(this.organInfo1.vipType==0){
                 this.organInfo1.vipType='';
               }
          },
          this
        );
      },
      //询价详情
      inquiryInfo() {
        let data={};
        data.guid = this.bm.guid;
        data.token = this.getkey;
        this.$ajax(
          `${this.subUrl.bd}/purchase/inquiryInfo`,
          data,
          res => {
            this.detail=res.data
            this.organInfo1=res.data.organInfoDto3
            if(this.organInfo1.vipType==1){
                 this.organInfo1.vipType='基础'
               }else if(this.organInfo1.vipType==2){
                 this.organInfo1.vipType='中级'
               }else if(this.organInfo1.vipType==3){
                 this.organInfo1.vipType='高级'
               }else if(this.organInfo1.vipType==4){
                 this.organInfo1.vipType='金牌'
               }else if(this.organInfo1.vipType==0){
                 this.organInfo1.vipType='';
               }
          },
          this
        );
      },
      //取消预约、团购
      delBespeak() {
        let data={};
        data.guid = this.bm.guid;
        data.token = this.getkey;
        this.$ajax(
          `${this.subUrl.bd}/opportunity/delBespeak`,
          data,
          res => {
            this.$dialog.toast({mes: '取消成功！'});
            this.$router.go(-1);
          },
          this
        );
      },
    },
    mounted() {
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      this.bm.guid=this.$route.params.guid;
      if(this.$route.params.type==1){
         this.title='我的预约'
         this.bm.type=1
         this.bm.type1=2
         this.aboutInfo();
      }else if(this.$route.params.type==2){
          this.title='我的团购'
          this.bm.type=2
          this.bm.type1=1
          this.aboutInfo();
      }else if(this.$route.params.type==3){
         this.title='我的询价'
         this.bm.type=3
         this.inquiryInfo();
      }else if(this.$route.params.type==4){
          this.title='我的邀联'
          this.bm.type=4
          this.contactInfo();
      }else if(this.$route.params.type==5){
          
      }
      this.status=this.$route.query.status
      this.titleT=this.$route.query.title
      
      console.log(this.$route)

    }
  };
</script>
<style scoped>
  .contact{
      width:100%;margin-top:.2rem;
      margin-bottom:.2rem;background: white;
  }
  .contact>ul{width:100%;}
  .contact>ul>li:first-child,.contact>ul>li:last-child{border-bottom:1px solid #ECECEC;
  border-top:1px solid #ECECEC;height:.7rem;}
  .contact>ul>li{display: flex;
  align-items: center;padding:0 .3rem;margin:.2rem 0;}
  .contact>ul>li>span:nth-child(1){width:1.4rem;text-align: right}
  .contact>ul>li>span:nth-child(2){flex:1;margin-left:.2rem;}
  .contact>ul>li>span:nth-child(3){flex:1;}
  .contact>ul>li>span:nth-child(3)>a{background: #F2725E;display: flex;height:.6rem;
  justify-content: center;align-items:center;color:white;border-radius: .1rem;}
  .contact>ul>li>span:nth-child(3)>a>i{width:.3rem;height:.3rem;background: white;
  margin-right:.1rem;}
  .contact>ul>li>span:nth-child(3)>a>i>img{width: 100%;height:100%;}
  .contact>ul>li>p{width: 1.4rem;
  display: flex;
  justify-content: flex-end;
  height: 0.7rem;
  align-items: center;
  font-size: 0.3rem;
  color: #777;margin-right:.2rem;}
  .contact>ul>li>i{flex:1;border:1px solid #d9d9d9;padding:0 .1rem;}
  

  .declares {
  width: 100%;background: white;
}
.declares>ol {
  width: 100%;
  margin-bottom:.2rem;
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
  border-top:1px solid #ECECEC;
}
.textar{display: flex;padding:.1rem .3rem;flex-flow:column;}
.textar>div{display: flex;
  flex-flow: row;
  align-items: center;
  margin: 0.1rem 0;}
  .textar>div>p{width: 1.6rem;
  display: flex;
  justify-content: center;
  height: 0.7rem;
  align-items: center;
  font-size: 0.3rem;
  color: #777;}
  .textar>div>span.bb{flex: 1;
  height: 0.7rem;
  border: 1px solid #d9d9d9;
  border-radius: 0.05rem;}
  .textar>div>span.aa{
  flex: 1;
  height: 0.7rem;
  line-height: .7rem;
  
  }
  .textar>div>span>input{
  width: 100%;
  height: 100%;
  border: none;
  margin-left: 0.1rem;}

.textar>span{width:100%;height:100%;border:1px solid #d9d9d9;}
.textar>div>i.bb{flex:1;border:1px solid #d9d9d9;padding:0 .1rem;}
.textar>div>i.aa{flex:1;}

.imgas.a > a {
  display: flex;
  height: 1rem;
  width: 1rem;
  margin-top: 0.2rem;
}
.imgas.a > a > img {
  height: 1rem;
  width: 1rem;
  border-radius: 0.1rem;
  margin-right: 0.3rem;
}
.imgas.a {
  display: flex;
  flex-flow: column;
}

.declares ol li > a {
  width: 2rem;
  display: flex;
  flex-flow: row;
  align-items: center;
  color: #0093d2;
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

  .info{width:100%;background: white;border-bottom:1px solid #F3F6F5;
  font-size:.28rem;padding:.1rem 0;}
  .info ul li{display: flex;padding:.1rem .2rem;align-items: center;}
  .info ul li>span{width:1.3rem;text-align: right;color:#9D9E9D;}
  .info ul li>p{flex:1;padding:0 .2rem;display: flex;}
  .info ul li>a{text-align: right;display: flex;padding:.03rem .05rem;
  border-radius: .05rem;font-size: .24rem;align-items: center;}
  .info ul li>a>i{display: flex;width: .3rem;height:.3rem;
  background: red;margin-right:.05rem;}
  .info ul li>a>i>img{width:100%;height:100%;}
  .info ul li>p>i{width:.8rem;height:.35rem;font-size:.24rem;display: flex;justify-content: center;
  align-items: center;margin-right: .2rem;}
  

  .bottoms{width:100%;background: white;height:1rem;display: flex;
  justify-content: space-around;}
  .bottoms>span{font-size: .32rem;color: #333;display: flex;
  align-items: center;font-weight: 600;}
  .bottoms>span>i{display:flex;width: .5rem;height:.5rem;margin-right:.2rem;}
  .bottoms>span>i>img{height:100%;width: 100%;}

  .group_buying{width:100%;background: white;}
  .group_buying>div:nth-child(1){width:100%;border-bottom:1px solid #F3F6F5;
  border-top:1px solid #F3F6F5;
  padding:.1rem .3rem;color:#F2725E;font-size: .3rem;font-weight: 600;}
  .group_buying>div:nth-child(2)>ul{width:100%;padding:.3rem 0;}
  .group_buying>div:nth-child(2)>ul>li{display: flex;padding:.05rem 0;align-items: center;}
  .group_buying>div:nth-child(2)>ul>li>p{width:1.3rem;text-align: right;color:#9D9E9D;}
  .group_buying>div:nth-child(2)>ul>li>span{flex:1;padding:0 .2rem;}
  .group_buying>div:nth-child(2)>ul>li>a{width:3.6rem;color:#9D9E9D;}
  .group_buying>div:nth-child(2)>ul>li>a em{padding:.1rem .06rem;border:1px solid #F5F5F4;
  margin-right: .05rem;}
</style>