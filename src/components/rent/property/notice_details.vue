<template>
  <yd-layout class="layout_my">
      <yd-navbar class="header" slot="navbar" v-show="!userAgent.isWX" title="通知详情" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span @click="back" class="spanLeft" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
         </span>
      </yd-navbar>

    <div class="organInfos">
      <div class="name">
        <p class="font32 font600">{{details.title}}</p>
      </div>
      <div class="info" v-if="show">
         <ul>
           <li><span>发布人：</span><p>{{details.userName}}</p></li>
         </ul>
         <p @click="toggle" :style="{color:mainColor}">展开</p>
      </div>

      <div class="info" v-else>
         <ul>
           <li><span>关键词：</span><p>{{details.keyword}}</p></li>
           <li><span>通知对象：</span><p>{{details.organName}}</p></li>
           <li><span>发布人：</span><p>{{details.userName}}</p></li>
           <li><span>发布时间：</span><p>{{details.createDate}}</p></li>
           <li><span>单号：</span><p>{{details.guid}}</p></li>
         </ul>
         <p @click="toggle" :style="{color:mainColor}">隐藏</p>
      </div>
    </div>

    <div class="text">
         <p>{{details.noticeContent}}</p>
           <yd-lightbox :num="details.commAccessoryList.length" v-if="details.commAccessoryList">
               <yd-lightbox-img v-for="(item, key) in details.commAccessoryList" :key="key" :src="item.path"></yd-lightbox-img>
           </yd-lightbox>
    </div>
  </yd-layout>
</template>
<script>
import Vue from "vue";
import fn from "@/assets/js/product";
import qs from "qs";
import {LightBox, LightBoxImg, LightBoxTxt} from 'vue-ydui/dist/lib.rem/lightbox';

Vue.component(LightBox.name, LightBox);
Vue.component(LightBoxImg.name, LightBoxImg);
Vue.component(LightBoxTxt.name, LightBoxTxt);

export default {
  data() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.mainColor = this.$color[this.userInfo.organType];
    this.userId = this.userInfo.guid;
    this.getkey = fn.getIng();
    return {
      titleT: "",
      show: false,
      s: true,
      p: true,
      getkey: "",
      payAccount: {},
      propertyServicePay: {},
      payProject: [],
      btn: false,
      details: {}
    };
  },
  methods: {
    toggle() {
      this.show = !this.show;
    },
    turnTo(url) {
      this.$router.push(url);
    },
    back() {
      this.$router.go(-1);
    },
    // 获取信息列表
    getNoticeDetail() {
      var data = {
        userId: this.userId,
        token: this.$getkey(),
        propertyNoticeId: this.$route.query.guid,
        organId:this.organId,
        organType:this.organType
      };
      this.xhr
        .post(`${this.subUrl.activity}/propertyNotice/getNoticeDetail`, qs.stringify(data))
        .then(res => {
          console.log(res);
          if (res.data.code == 1) {
            this.details=res.data.data
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        });
    },
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.mainColor = this.$color[this.userInfo.organType];
    this.userId = this.userInfo.guid;
    this.organId = this.organInfo.guid;
    this.organType = this.organInfo.organType;
    this.getkey = fn.getIng();
    console.log()
    this.getNoticeDetail();
  }
};
</script>
<style scoped>
.text{width:100%;padding:.3rem .3rem;background: white;margin-top:.2rem;}
.text>p{width:100%;text-indent:.6rem;}
.text>div{width:100%;display: flex;margin-top:.2rem;}
.text>div>img{width:1.2rem;height:1.2rem;border-radius: .1rem;margin-right:.1rem;}
.layout_my .header:after {
  display: none;
}
.layout_my {
  background: #eef3fa;
}

.layout_my .blue_box {
  height: 0.88rem;
  background-size: 100% 100%;
}
.organInfos {
  width: 100%;
}
.name {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0.3rem;
  background: white;
  border-bottom: 1px solid #f3f6f5;
}
.name > span {
  border-radius: 0.05rem;
  /*border: 1px solid #2d88d4;*/
  /*color: #2d88d4;*/
  padding: 0.05rem 0.1rem;
}

.info {
  width: 100%;
  background: white;
  padding: 0.1rem 0.3rem;
  font-size: 0.24rem;
  position: relative;
}
.info ul li {
  display: flex;
  height: 0.5rem;
}
.info ul li > span {
  width: 1.3rem;
  text-align: right;
  color: #9d9e9d;
}
.info ul li > p {
  flex: 1;
  margin-left: 0.2rem;
}
.info > p {
  font-size: 0.28rem;
  color: #2d88d4;
  position: absolute;
  bottom: 0.15rem;
  right: 0.3rem;
}

</style>
