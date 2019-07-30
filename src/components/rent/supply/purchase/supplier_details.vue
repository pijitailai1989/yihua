<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" :title="details.titleText" :bgcolor="mainColor" color="#fff">
      <span class="addClickArea" slot="left" @click="back" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
    </yd-navbar>
    
    <div class="info">
         <ul>
           <li><span>供应商</span><p>{{details.organName}}</p></li>
           <li><span></span><p><i v-show="details.vipType!=''" style="background:#C8E7FF;color:#61BBFF;">{{details.vipType}}</i>
           <i style="background:#FFE7C8;color:#FFB454;">{{details.years}}年</i></p></li>
           <li><span>公司地址</span><p>{{details.organAddress}}</p></li>
           <li><span>联系人</span><p>{{details.userName}}</p></li>
           <li><span>联系电话</span><p>{{details.phone}}</p></li>
           
         </ul>
    </div>

    <div class="declares">
        <ol>
            <li style="color:#666;"><p>我的备注</p><span style="text-align:right;font-size:.28rem;"><span @click="supplierRemarks">保存</span></span></li>  
        </ol>
        <div class="textar">
          <span>
            <yd-textarea slot="right" v-model="details.remarks" placeholder="赞无消息" maxlength="100"></yd-textarea>
          </span>
        </div>
    </div>
    
    <div class="declares">
        <ol>
            <li style="color:#666;"><p>往来记录</p></li>  
            <li v-for="(item,index) in details.myInquiryListDto" :key="index"><p class="textHidden1" style="border-bottom:1px solid #ECECEC;">【{{item.type}}】{{item.title}}</p>
            <span style="border-bottom:1px solid #ECECEC;">{{item.createTime}}</span></li>       
        </ol>
    </div>
    
    <yd-cell-group>
        <yd-cell-item arrow type="link" :href="'/supply/product/my_card?userId='+details.optUserId+'&oName='+details.organName">
            <span slot="left">商家名片</span>
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
        details:{
          remarks:''
        },
        remarks:''
      };
    },
    methods: {
      supplierRemarks(){
        let data={token:this.getkey,guid:this.details.guid,remarks:this.details.remarks}
        this.xhr.post(`${this.subUrl.bd}/opportunity/supplierRemarks`, qs.stringify(data) ).then((res) => {
          if (res.data.code == 1) {
            this.$dialog.toast({mes: '保存成功！'});
          } else if (res.data.code == '-902'){
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      },
      turnTo(url){
        this.$router.push(url)
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
        localStorage.setItem('libraryList',null);
      }
    },
    mounted() {
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      this.details = JSON.parse(decodeURIComponent(localStorage.getItem('libraryList')));
      console.log(this.details)
      if(this.details.vipType==1){
                 this.details.vipType='基础'
               }else if(this.details.vipType==2){
                 this.details.vipType='中级'
               }else if(this.details.vipType==3){
                 this.details.vipType='高级'
               }else if(this.details.vipType==4){
                 this.details.vipType='金牌'
               }else if(this.details.vipType==0){
                 this.details.vipType='';
               }

               if(this.details.myInquiryListDto.length>0){
                 this.details.myInquiryListDto.forEach(element => {
                   if(element.type==1){
                     element.type="预约"
                   }else if(element.type==2){
                     element.type="团购"
                   }else if(element.type==3){
                     element.type="询价"
                   }else if(element.type==4){
                     element.type="邀联"
                   }else if(element.type==5){
                     element.type="邀标"
                   }
                   element.createTime=element.createTime.split(' ')[0]

                 });
               }

               console.log(this.details)
    }
  };
</script>
<style scoped>
 
  .declares {
  width: 100%;background: white;margin-top:.2rem;
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
.declares>ol li>p{width: 70%;height: .8rem;line-height: .8rem;color:#333;font-size:.3rem;}
.declares>ol li>span{width:30%;height: .8rem;line-height: .8rem;width:2rem;color:#333;font-size:.24rem;}
.declares>ol li>span>span{padding:.1rem .3rem;}
.declares>ol li:nth-child(1){
  border-bottom:1px solid #ECECEC;
}
.textar{display: flex;padding:.1rem .3rem;flex-flow:column;}
.textar>span{width:100%;height:100%;border:1px solid #d9d9d9;padding:.1rem .1rem;}


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
  .alertText{width:100%;position:fixed;height:100vh;background: rgba(0,0,0,.2);top:0;left:0;display: flex;justify-content: center;align-items: center;}
  .alertText>ul{width:6.5rem;height:5rem;background: white;padding:.2rem .3rem;
  border-radius: .2rem;display: flex;flex-flow: column;justify-content: center;}
  .alertText ul li.a{width:100%;display:flex;flex-flow:row; align-items:center;padding:.1rem 0;}
  .alertText ul li.a>span{border-radius:.05rem;flex:1;border:1px solid #E6E7E7;height:.7rem;display: flex;align-items:center;}
  .alertText ul li.a>p{width:1.8rem;text-align: right;}
  .alertText ul li.a>span>input{border:none;margin-left:.2rem;height: 100%;width:100%;}
  .alertText ul li:nth-child(4){margin-top:.2rem;display: flex;justify-content: space-around;}
  .alertText ul li:nth-child(4)>button{font-size:.32rem;font-weight:600;color:white;
  padding:.2rem .5rem;border:none;border-radius: .1rem;}

  .info{width:100%;background: white;border-bottom:1px solid #F3F6F5;
  font-size:.28rem;padding:.1rem 0;margin-bottom:.2rem;}
  .info ul li{display: flex;padding:.1rem .2rem;}
  .info ul li>span{width:1.3rem;text-align: right;color:#9D9E9D;}
  .info ul li>p{flex:1;padding:0 .2rem;display: flex;}
  .info ul li>a{text-align: right;display: flex;padding:.03rem .05rem;
  border-radius: .05rem;font-size: .24rem;align-items: center;}
  .info ul li>a>i{display: flex;width: .3rem;height:.3rem;
  background: red;margin-right:.05rem;}
  .info ul li>a>i>img{width:100%;height:100%;}
  .info ul li>p>i{width:.8rem;height:.35rem;font-size:.24rem;display: flex;justify-content: center;
  align-items: center;margin-right: .2rem;}
</style>