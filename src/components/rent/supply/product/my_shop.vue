<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" v-title="'我的店铺'" title="我的店铺" :bgcolor="mainColor" color="#fff">
      <span class="addClickArea" slot="left" @click="back" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
    </yd-navbar>

    <div class="headers">
        <p><img :onerror="logo" :src="organInfoDto4.logo" alt=""></p>
        <div>
            <span>{{organInfoDto4.organName}}店铺</span>
            <p style="margin-top:.1rem;">
                <a style="background:#C8E7FF;color:#37A8FF;" v-show="organInfoDto4.vipType!=''">{{organInfoDto4.vipType}}</a>
                <a style="background:#FFE7C8;color:#FFB04A">{{organInfoDto4.years}}年</a>
            </p>
        </div>
    </div>
    
    <div class="declares">
        <ol>
            <li sytle="color:#666"><p>商家介绍</p>
            <!-- <span @click="turnTo('/supply/product/my_card?oName='+organInfo.organName)">商家名片 ></span> -->
            </li>          
        </ol>
        <div style="border-bottom:1px dashed #D9D9D9;">
            <span style="text-indent:.6rem;line-height:.5rem;">
                {{shopCard.describes}}
            </span>
        </div>
    </div>
    <div class="text" style="margin-bottom:.2rem;">
      <div class="ttt" style="color:#999;">资质证照</div>
      <div class="images1">
          <p v-if='accessoryList.length==0'>暂未上传证照</p>
          <yd-lightbox v-else :num="accessoryList.length">
              <yd-lightbox-img v-for="(item,index) in accessoryList" :onerror="logo" :key="index" :src="item.path"></yd-lightbox-img>
          </yd-lightbox>
      </div>
    </div>

    <div class="declares" style="margin-bottom:.2rem;">
        <ol>
            <li sytle="color:#666"><p>产品中心</p>
            <span @click="turnTo('/supply/product/product_center?userId='+userId1)">更多 ></span>
            </li>          
        </ol>
        <div>
            
            <ul v-if="productOrderDtoList.length>0">
                <li v-for="(item,index) in productOrderDtoList" :key="index">
                    <!-- <i><img src="../../../../assets/images/rent/supply/photo.png" alt=""></i> -->
                    <yd-lightbox :num="item.img.length">
                        <yd-lightbox-img v-for="(todo,index) in item.img" :key="index" :onerror="logo" :src="todo"></yd-lightbox-img>
                    </yd-lightbox>
                    <a class="textHidden1">{{item.title}}</a>
                </li>
            </ul>
            <p v-else>暂无产品</p>
        </div>
    </div>
    <div class="declares" style="margin-bottom:.2rem;">
        <ol>
            <li sytle="color:#666"><p>案例介绍</p>
            <!-- <span @click="turnTo('/supply/product/case_management')">更多 ></span> -->
            </li>          
        </ol>
        <div>
            <ol v-if="casesList.length>0">
                <li v-for="(item,index) in casesList" :key="index" @click="turnTo('/supply/product/add_case_details?title='+item.title+'&contents='+item.contents+'#details')">
                    <p>{{item.title}}</p>
                    <span><i><img src="../../../../assets/images/rent/supply/riqi.png" alt=""></i>{{item.createTime}}</span>
                </li>
            </ol>
            <p v-else>暂无案例</p>
        </div>
    </div>
    
    <div class="declares">
        <ol>
            <li sytle="color:#666"><p>联系我们</p></li>          
        </ol>
        <ul>
            <li><p>联系人</p><span>{{shopCard.name?shopCard.name:'无'}}</span></li>
            <li><p>手机号码</p><span>{{shopCard.phone?shopCard.phone:'无'}}</span></li>
            <li><p>联系QQ</p><span>{{shopCard.qq?shopCard.qq:'无'}}</span></li>
            <li><p>联系邮箱</p><span>{{shopCard.email?shopCard.email:'无'}}</span></li>
            <li><p>固定电话</p><span>{{shopCard.telePhone?shopCard.telePhone:'无'}}</span></li>
            <li><p>详细地址</p><span>{{shopCard.address?shopCard.address:'无'}}</span></li>
        </ul>
        
    </div>

    <!-- <yd-tabbar slot="tabbar" :color="mainColor" v-show="shopCard.userId!=userId">
            <yd-tabbar-item title="收藏" link="#">
                <yd-icon name="home" slot="icon"></yd-icon>
            </yd-tabbar-item>
            <yd-tabbar-item title="邀我投标" link="#">
                <yd-icon name="shopcart-outline" slot="icon"></yd-icon>
            </yd-tabbar-item>
    </yd-tabbar> -->

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
  import {DateTime} from 'vue-ydui/dist/lib.rem/datetime';
  import {TabBar, TabBarItem} from 'vue-ydui/dist/lib.rem/tabbar';
  import {Icons} from 'vue-ydui/dist/lib.rem/icons';

  Vue.component(Icons.name, Icons);
  Vue.component(TabBar.name, TabBar);
  Vue.component(TabBarItem.name, TabBarItem);
  Vue.component(DateTime.name, DateTime);
 
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
        userId:'',
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
        casesList:[],
        organInfoDto4:{},
        productOrderDtoList:[],
        shopCard:{},
        accessoryList:[],
        userId1:''
      };
    },
    methods: {
      add(){
        this.alertT=true;
      },
      confirm(){

      },
      myShop() {
        let data={}
        data.userId=this.userId1;
        data.token=this.getkey
        this.$ajax(
          `${this.subUrl.bd}/opportunity/myShop`,
          data,
          res => {
            if(res.data!=null){
              this.organInfoDto4=res.data.organInfoDto4;
              if(this.organInfoDto4.vipType==1){
                 this.organInfoDto4.vipType='基础'
               }else if(this.organInfoDto4.vipType==2){
                 this.organInfoDto4.vipType='中级'
               }else if(this.organInfoDto4.vipType==3){
                 this.organInfoDto4.vipType='高级'
               }else if(this.organInfoDto4.vipType==4){
                 this.organInfoDto4.vipType='金牌'
               }else if(this.organInfoDto4.vipType==0){
                 this.organInfoDto4.vipType='';
               }
              this.casesList=res.data.casesList;
              this.casesList.forEach(el=>{
                el.createTime=el.createTime.split(' ')[0]
              })
              this.productOrderDtoList=res.data.productOrderDtoList;
              this.productOrderDtoList.forEach(el=>{
                el.img=el.img.split(',')
              })
              this.shopCard=res.data.shopCard;
              this.accessoryList=res.data.shopCard.accessoryList;
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
      this.getkey = fn.getIng();
      this.userId1=this.$route.query.userId;
      console.log(this.userId1)
      this.myShop();
    }
  };
</script>
<style scoped>

.headers{width:100%;margin-bottom:.2rem;background: white;height:1.2rem;padding:.1rem .4rem;display: flex;}
.headers>p{width:1rem;height:1rem;}
.headers>p>img{width:100%;height:100%;}
.headers>div{flex:1;padding:.1rem .2rem;}
.headers>div>p>a{padding:.02rem .15rem;font-size:.24rem;margin-right:.1rem;}

  .declares {
  width: 100%;background: white;
}
.declares>ul {
  width: 100%;
  padding: 0.1rem 0.4rem;
}
.declares>ul li {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
  margin: 0.2rem 0;
}
.declares>ul li > p {
  width: 1.6rem;
  display: flex;
  justify-content: center;
  height: 0.5rem;
  align-items: center;
  font-size: 0.3rem;
  color: #777;
}
.declares>ul li > span {
  flex: 1;
  height: 0.5rem;
  /* border: 1px solid #d9d9d9; */
  border-radius: 0.05rem;
  margin-right:.2rem;
  display: flex;align-items: center;
}
.declares>ul li > span > input {
  width: 100%;
  height: 100%;
  border: none;
  margin-left: 0.1rem;
}
.declares>div{width: 100%;padding:.1rem .4rem;display: flex;}
.declares>div>ul{width:100%;display: flex;justify-content: space-between;
align-items: center;height:2rem;}
.declares>div>ul>li{width:1.8rem;height:1.8rem;display: flex;flex-flow:column;
justify-content: center;align-items: center;}
.declares>div>ul>li>div{width:1.8rem;height:1.2rem;position: relative;border-radius: .1rem;}
.declares>div>ul>li>div>img{width:100%;height:100%;position: absolute;border-radius: .1rem;}
.declares>div>ul>li>div>img:first-child{z-index: 999;}
.declares>div>ul>li>a{margin-top:.1rem;}

.declares>div>ol{width:100%;}
.declares>div>ol>li{width:100%;border-bottom:1px solid #E4E4E4;height:1.4rem;
display: flex;flex-flow: column;justify-content: center;}
.declares>div>ol>li>span{display: flex;margin-top:.2rem;color:#999;align-items: center;font-size: .24rem;}
.declares>div>ol>li>span>i{width:.35rem;height:.35rem;margin-right:.1rem;
 }
 .declares>div>ol>li>span>i>img{width:100%;height:100%;}
 .declares>div>ol>li>p{font-weight: 600;font-size: .3rem;}


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
.declares>ol li>p{flex:1;}
.declares>ol li>span{width:1.5rem;text-align: right}
.declares>ol li:nth-child(1){
  border-bottom:1px solid #ECECEC;
}
.textar{display: flex;padding:.1rem .3rem;}
.textar>span{width:100%;height:100%;border:1px solid #d9d9d9;}

.declares>ol li > a {
  width: 2rem;
  display: flex;
  flex-flow: row;
  align-items: center;
  color: #0093d2;
}
.declares>ol li > a > i {
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
  .text{width:100%;background: white;display: flex;flex-flow: column;align-items: center;}
  .text>.ttt{width:100%; padding:.1rem .3rem;font-size: .28rem;}
  .text>ul{width:100%;}
  .text>ul>li{padding:.1rem .4rem;}
  .text>p{width:90%;border:1px solid #EFF1F1;text-indent:.5rem;line-height:.5rem;font-size:.3rem;
  font-weight:600;color:#5A5B5A;padding:.1rem .2rem;}
  .images1{width:90%;margin-top:.1rem;display: flex;margin-bottom:.1rem;}
  .images1>div{width:100%;display: flex;flex-flow:row;justify-content:flex-start;align-items:center;}
  .images1>div>img{width:1.2rem;height:1.2rem;border-radius:.1rem;margin-right: .2rem;}
</style>