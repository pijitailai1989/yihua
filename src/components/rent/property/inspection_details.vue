<template>
  <yd-layout class="layout_my">
      <yd-navbar class="header" slot="navbar" v-show="!userAgent.isWX" title="稽查详情" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span @click="back" class="spanLeft" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
         </span>
      </yd-navbar>

    <div class="organInfos">
      <div class="info">
         <ul>
           <li><span>稽查对象：</span><p>{{examineObjName.length > 15?examineObjName.substr(0,15)+'...':examineObjName}}</p></li>
           <li><span>稽查日期：</span><p>{{details.examineDate?details.examineDate.split(' ')[0]:'无数据'}}</p></li>
           <li><span>稽查组长：</span><p>{{details.examineLead}}</p></li>
           <li><span>稽查组员：</span><p class="textHidden">{{details.examineMember}}</p></li>
           <li><span>填写人：</span><p>{{details.userName}}</p></li>
           <li><span>发布日期：</span><p>{{details.createDate}}</p></li>
         </ul>
      </div>
    </div>

    <div class="text">
      <div class="ttt">标题：{{details.title}}</div>
      <p class="textHidden4">{{details.content}}</p>
      <yd-lightbox :num="accessoryList.length" v-if="accessoryList.length>0">
               <yd-lightbox-img v-for="(item, key) in accessoryList" :key="key" :src="item.path"></yd-lightbox-img>
      </yd-lightbox>
    </div>

    <div class="text" v-if="replyAccessoryList.length>0">
      <div class="ttt" style="margin-bottom:.2rem;border-bottom:1px solid #F3F6F5;">管理处改进信息</div>
      <p class="textHidden4">{{details.improveComment}}</p>
      <yd-lightbox :num="replyAccessoryList.length">
               <yd-lightbox-img v-for="(item, key) in replyAccessoryList" :key="key" :src="item.path"></yd-lightbox-img>
      </yd-lightbox>
    </div>

    <yd-tabbar slot="tabbar" class="bottoms" v-show="details.status==2">
        <span @click="closeProExamine"><i><img src="../../../assets/images/rent/supply/disagree.png" alt=""></i>关闭稽查</span>
    </yd-tabbar>
  </yd-layout>
</template>
<script>
import Vue from "vue";
import fn from "@/assets/js/product";
import qs from "qs";
import {LightBox, LightBoxImg, LightBoxTxt} from 'vue-ydui/dist/lib.rem/lightbox';
import {PullRefresh} from 'vue-ydui/dist/lib.rem/pullrefresh';

Vue.component(PullRefresh.name, PullRefresh);
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
      details: {},
      accessoryList:[],
      replyAccessoryList:[],
      examineObjName:''
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
    // 获取详情
    getExamineDetail() {
      var data = {
        userId: this.userId,
        token: this.$getkey(),
        propertyExamineId: this.$route.query.guid,
        organId:this.organId,
        organType:this.organType
      };
      this.xhr
        .post(`${this.subUrl.activity}/propertyExamine/getExamineDetail`, qs.stringify(data))
        .then(res => {
          console.log(res);
          if (res.data.code == 1) {
            this.details=res.data.data;
            this.examineObjName=this.details.examineObjName;
            this.accessoryList=this.details.accessoryList
            this.replyAccessoryList=this.details.replyAccessoryList
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        });
    },
    //关闭
    closeProExamine() {
      var data = {
        token: this.$getkey(),
        propertyExamineId: this.$route.query.guid,
      };
      this.xhr
        .post(`${this.subUrl.activity}/propertyExamine/closeProExamine`, qs.stringify(data))
        .then(res => {
          console.log(res)
          if (res.data.code == 1) {
            this.details.status=3;
            this.$dialog.toast({ mes: '关闭成功！' });
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
    this.getExamineDetail();
  }
};
</script>
<style scoped>

  .bottoms{width:100%;background: white;height:1rem;display: flex;
  justify-content: space-around;}
  .bottoms>span{font-size: .32rem;color: #333;display: flex;
  align-items: center;font-weight: 600;width: 100%;justify-content: center;}
  .bottoms>span>i{display:flex;width: .5rem;height:.5rem;margin-right:.2rem;}
  .bottoms>span>i>img{height:100%;width: 100%;}


  .text{width:100%;background: white;margin:.3rem 0;display: flex;flex-flow: column;align-items: center;}
  .text>.ttt{width:100%;padding:0 .4rem;font-size: .28rem;height:.8rem;line-height:.8rem;}
  .text>p{width:90%;border:1px solid #EFF1F1;text-indent:.5rem;line-height:.4rem;font-size:.3rem;
  font-weight:600;color:#5A5B5A;padding:.2rem .3rem;}
  .text>div:last-child{width:100%;display: flex;padding:.2rem .4rem;}
  .text>div:last-child>img{width:1.2rem;height:1.2rem;border-radius: .1rem;margin-right:.1rem;}


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
  padding: 0.2rem 0.3rem;
  font-size: 0.28rem;
  position: relative;
}
.info ul li {
  display: flex;
  height: 0.6rem;
}
.info ul li > span {
  width: 1.8rem;
  text-align: right;
  color: #9d9e9d;
}
.info ul li > p {
  width:5rem;
  margin-left: 0.1rem;
}

</style>
