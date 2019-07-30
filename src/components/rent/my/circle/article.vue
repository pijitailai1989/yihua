<template>
  <div class="templateOuter" v-title="title">
    <yd-layout class="article_tmp">
      <yd-navbar height=".88rem" :bgcolor="mainColor" color="#fff" slot="navbar" title="帖子详情">
      <!-- <yd-navbar height=".88rem" :bgcolor="mainColor" color="#fff" slot="navbar" :title="info.bbs.title"> -->
        <span slot="left" class="addClickArea" @click="back">
          <span ><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
        <!-- <yd-icon slot="right" name="share1" size=".48rem" color="#fff"></yd-icon> -->
      </yd-navbar>
      <div class="session">
          <div class="top">
            <img class="header" :src="info.bbs.headPortrait">
            <div class="t-content">
              <div class="t-c-title">{{info.bbs.title}}</div>
              <div class="t-c-label">
                <div v-for="(item,index) in label" v-if="item" :key="index" :style="{
                  color:colorArr[index],
                  border:'1px solid ' + colorArr[index]
                }">
                  {{item?item.substr(0,4):""}}
                </div>
              </div>
              <!-- <div class="t-c-date">{{info.bbs.createDate | times}}</div> -->
              <div class="t-c-date">{{info.bbs.createDate | times}}</div>
            </div>
            <!--进度条-->
            <yd-progressbar
              class="circle_status"
              :style="'color:'+mainColor"
              :progress="progress.progress"
              trail-width="6"
              stroke-width="6"
              stroke-color="#fff"
              :trail-color="mainColor"
              fill-color="#fff"
            >{{progress.title}}
            </yd-progressbar>
          </div>
          <div class="center">
            <div class="c-content" >{{info.bbs.content}}</div>
            <!-- <div class="c-banner">
              <img v-for="(item,i) in info.bbs.commAccessoryList" :key="item.guid" :src="item.path" alt="">
            </div> -->

            <yd-lightbox class="c-banner" :num='info.bbs.commAccessoryList?info.bbs.commAccessoryList.length:0'>
                <yd-lightbox-img v-for="(item,i) in info.bbs.commAccessoryList" :key="item.guid" :src="item.path"></yd-lightbox-img>
            </yd-lightbox>
            <div class="c-apply">
              <div class="c-a-apply">
                <span style="color: #999;">报名：</span>
                <img v-for="(item,index) in info.bbsApplicantList" v-if="index<=3" :key="index" :src="item.headPortrait" alt="item.name">
                <span v-if="info.bbsApplicantList&&info.bbsApplicantList.length>5">···</span>
              </div>
              <div class="c-a-operate">
                <div @click="addActivity"><img src="../../../../assets/images/rent/circle/apply.png">报名</div>
                <div @click="toShowThink"><img src="../../../../assets/images/rent/circle/coomponet.png">评论</div>
              </div>
              <div class="c-a-operate"></div>
            </div>
          </div>
          <!--评论信息部分-->
          <div class="infinite" >
            <div class="bottom" slot="list">
              <!--循环渲染评论数据-->
              <div class="b-item" v-for="(item,idx) in components" :key="idx">
                <!--上面部分-->
                <div class="c-info">
                  <div class="c-i-header"><img :src="item.headPortrait"></div>
                  <div class="c-i-name">
                    <div class="c-i-n-name" :style="{color:mainColor}">{{item.nickname}}</div>
                    <div class="c-i-n-date">{{item.createDate | times}}</div>
                  </div>
                  <div class="c-i-praise" @click="givePraise(item.guid)" >
                    <!-- <img src="../../../../assets/images/rent/circle/praise.png"> -->
                    <yd-icon name='giveGood' color='#999' custom></yd-icon>
                    <span v-text="item.praise"></span>
                  </div>
                </div>
                <div class="foCo3 font30" style="word-wrap: break-word;">{{item.content}}</div>
                <div class="commoent">
                  <yd-icon name='pinglun'  @click.native='addComponent(idx,item.bbsId,item.guid,item.userId)' custom size='.4rem' color='#999'></yd-icon>
                </div>
                <!--中部评论内容-->
                <div>
                  <div class="sub-item" @click='addComponent(idx,item.bbsId,item.guid,subItem.userId,subIdx)' v-for="(subItem,subIdx) in item.childList" :key="subIdx">
                    <div class="sub-top"><span :style="{color:mainColor}">{{subItem.nickname}}：</span>
                      <!-- {{subItem.userId!=subItem.replyUserId}} -->
                    <span class="foCo9" v-show='subItem.userId != subItem.replyUserId'> 对 <span class="targetUser">{{subItem.replyUserIdName}}</span>回复：</span>
                    <span class="foCo6">{{subItem.createDate | times}}</span>
                    </div>
                    <div class="sub-contenet">"{{subItem.content}}"</div>
                    <!-- <div class="c-i-content">{{item.content}}</div> -->
                  </div>
                </div>
                <!--中部评论内容结束-->
              </div>
              <!--循环渲染评论数据结束-->
            </div>
          </div>
      </div>
        <div class="myComponent" slot="bottom" v-show="isShowinput">
          <yd-textarea slot="right"  v-model="comment" class="myinput" :placeholder="toUser" maxlength=300></yd-textarea>
            <div class="button">
              <yd-button type="danger" @click.native=" isShowinput = false;" bgcolor='#fff' class="border" color='#000'>取消</yd-button>
              <yd-button type="danger" @click.native="sendComponent()" class="mt2"  :bgcolor='mainColor' color='#fff'>发送</yd-button>
            </div>
        </div>
    </yd-layout>
  </div>
</template>
<script>
import Vue from "vue";
import { Layout } from "vue-ydui/dist/lib.rem/layout";
//进度条
import { ProgressBar } from "vue-ydui/dist/lib.rem/progressbar";
Vue.component(ProgressBar.name, ProgressBar);
Vue.component(Layout.name, Layout);

import { TextArea } from "vue-ydui/dist/lib.rem/textarea";
Vue.component(TextArea.name, TextArea);
import {LightBox, LightBoxImg, LightBoxTxt} from 'vue-ydui/dist/lib.rem/lightbox';
/* 使用px：import {Accordion, AccordionItem} from 'vue-ydui/dist/lib.px/accordion'; */

Vue.component(LightBox.name, LightBox);
Vue.component(LightBoxImg.name, LightBoxImg);
Vue.component(LightBoxTxt.name, LightBoxTxt);
import { getToday } from "@/assets/js/product.js";
//自定义date filter
var oneDay = 24 * 3600 * 1000;
Vue.filter("times", function(item) {
  if (item) {
    var myDate = new Date(item).getTime();
    var d = new Date().setHours(0, 0, 0, 0) + oneDay;
    if ((d - myDate) / oneDay < 1) return "今天" + item.substr(11, 18);
    if ((d - myDate) / oneDay < 2) {
      return "昨天" + item.substr(11, 18);
    } else {
      return item;
    }
  }
});
export default {
  data() {
    var that = this;
    var userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    var mainColor = this.$color[userInfo.organType];
    // 设置主色
    return {
      toUser: "回复：",
      isShowinput: false,
      mainColor,
      userInfo,
      page: 0,
      url: that.fromRoute ? that.fromRoute : "/#/index/1/0/1/rent/circle",
      colorArr: ["#74dfa0", "#ff8383", "#ffc664"], //绿色，蓝色，橙色
      title: "2017打码会",
      progress: {
        progress: 0.75,
        title: "进行中"
      },
      info: {
        bbs: {}
      },
      comment: "",
      label: [],
      components: [],
      content: {
        content: ``
      }
    };
  },
  methods: {
    // 评论 第几条评论,帖子id,评论父id
    addComponent(index, bbsId, guid, replyUserId, subIdx) {
      console.log(JSON.stringify(arguments));
      this.bbsId = bbsId;
      this.replyUserId = replyUserId;
      if (index >= 0) {
        this.bbsCommentId = guid;
        if (subIdx) {
          this.subIdx = subIdx;
          this.toUser = `对${this.components[index].childList[subIdx]
            .nickname}回复：`;
          this.replyUserIdName = this.components[index].childList[
            subIdx
          ].nickname;
        } else {
          this.toUser = `对${this.components[index].nickname}回复：`;
          this.replyUserIdName = this.components[index].nickname;
        }
      } else {
        this.bbsCommentId = 0;
        // replyUserIdName = this.components[index].nickname
      }
      this.currentIndex = index;
      this.isShowinput = true;
    },
    myBlur() {
      this.isShowinput = true;
    },
    sendComponent() {
      if (this.comment == "") {
        return this.$dialog.toast({ mes: "请输入评语", timeout: "500" });
      }
      this.$ajax(
        `${this.subUrl.sc}/bbsComment/saveBbsComment`,
        {
          userId: this.userInfo.guid,
          token: this.$getkey(),
          bbsId: this.bbsId,
          replyUserId: this.replyUserId,
          bbsCommentId: this.bbsCommentId,
          comment: this.comment
        },
        res => {
          this.isShowinput = false;
          var arr = this.components[this.currentIndex].childList;
          arr = arr ? arr : [];
          res.data.nickname = this.userInfo.nickname;
          res.data.replyUserIdName = this.replyUserIdName;
          // res.data
          console.log( this.replyUserIdName,'霍夫名')
          console.log(JSON.stringify(res.data),'回复的小心');
          arr.push(res.data);
          console.log(this.toUser);
          this.$set(this.components[this.currentIndex], "childList", arr);
          this.comment = "";
          this.$dialog.toast({ mes: "发送成功", timeout: 1000, icon: "success" });
        },
        this
      );
    },

    // 点赞
    givePraise(guid) {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        likeObjId: guid
      };
      this.$ajax(
        `${this.subUrl.sc}/bbs/saveLike`,
        data,
        res => {
          this.$dialog.toast({ mes: "点赞成功", timeout: 1500 });
        },
        this
      );
    },
    // 报名
    addActivity(i) {
      i = 1;
      if (i == 1) {
        this.$dialog.confirm({
          title: "",
          mes: "是否报名",
          opts: () => {
            this.$ajax(
              `${this.subUrl.sc}/bbsApplicant/saveBbsApplicant`,
              {
                token: this.$getkey(),
                userId: this.userInfo.guid,
                bbsId: this.$route.params.id
              },
              res => {
                this.$dialog.toast({
                  mes: "报名成功",
                  timeout: 1000,
                  icon: "success"
                });
                var arr = this.info.bbsApplicantList;
                arr.unshift({
                  headPortrait: this.userInfo.headPortrait
                });
                console.log(arr);
                this.$set(this.info, "bbsApplicantList", arr);
              },
              this
            );
          }
        });
      }
    },
    toShowThink() {
      this.$router.push(
        "/rent/circle/rent_edit?id=" +
          this.$route.params.id +
          "&userId=" +
          this.info.bbs.userId
      );
    },
    back() {
      this.$router.go(-1);
    },
    submitHandler() {},
    loadList() {},
    getDetail(data, cb) {
      data = data ? data : {};
      data.token = this.$getkey();
      data.userId = this.userId;
      data.bbsId = this.$route.params.id;

      this.$ajax(
        `${this.subUrl.sc}/bbs/getBbsDetail`,
        data,
        res => {
          console.log(res);

          cb && cb(res);
        },
        this
      );
    }
  },
  mounted() {
    // console.log(this.$route)
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.mainColor = this.$color[this.userInfo.organType];
    this.userId = this.userInfo.guid;
    // console.log(this.userInfo);
    this.getDetail({}, res => {
      this.info = res.data;
      if (res.data.bbs.keyword != null) {
        this.label = res.data.bbs.keyword.split(",");
      }
      this.components = res.data.bbsCommentList;
    });
  }
};
</script>
<style scoped>
.t-c-title {
  font-size: 0.32rem;
}
.myComponent {
  display: flex;
  border-top: 1px solid #ddd;
}
.sub-contenet {
  word-break: break-all;
}
.myComponent .button {
  display: flex;
  width: 1.5rem;
  background: #fff;
  flex-flow: column wrap;
  justify-content: space-between;
  padding-top: 0.5rem;
  padding-right: 0.3rem;
  padding-left: 0.2rem;
  padding-bottom: 0.2rem;
}
.myinput {
  border-radius: 0.1rem;
  padding: 0.3rem 0 0 0.2rem;
  flex: 1;
  background: #fff;
  /* background: #f1f1f1; */
}

.commoent {
  display: flex;
  justify-content: flex-end;
  padding-right: 0.1rem;
}
.infinite {
  /* margin-bottom:1rem; */
  padding-bottom: 1rem;
}
.article_tmp .top {
  display: flex;
  flex-flow: row nowrap;
  padding: 0.2rem 0.32rem;
  background: #fff;
}

.article_tmp .top > .header {
  width: 1.28rem;
  height: 1.28rem;
  margin-right: 0.2rem;
  border-radius: 50%;
  border: 1px solid #ddd;
}

.article_tmp .top > .t-content {
  flex: 1;
}

.article_tmp .t-c-label {
  display: flex;
  margin-top: 0.1rem;
}

.article_tmp .t-c-label > div {
  -webkit-border-radius: 0.08rem;
  font-size: 0.24rem;
  -moz-border-radius: 0.08rem;
  border-radius: 0.08rem;
  margin-right: 0.1rem;
  padding: 0.02rem 0.1rem;
}

.article_tmp .top .t-c-date {
  font-size: 0.24rem;
  color: #999;
  line-height: 2;
}

.circle_status {
  width: 1rem;
  height: 1rem;
  white-space: nowrap;
  font-size: 0.24rem;
}

/*中部*/
.article_tmp .center {
  padding: 0 0.32rem;
  background: #fff;
  margin-bottom: 0.2rem;
}

.article_tmp .center .c-content {
  width: 100%;
  line-height: 1.5;
  text-align: justify;
  overflow: hidden;
  word-break: break-all;
  padding: .2rem 0;
  text-indent: 2em;
}

/*大图*/
.article_tmp .center .c-banner img {
  display: block;
  width: 100%;
  margin: 0 auto 0.1rem;
}

/*头像*/
.article_tmp .c-apply .c-a-apply img {
  width: 0.7rem;
  height: 0.7rem;
  -webkit-border-radius: 0.35rem;
  -moz-border-radius: 0.35rem;
  border-radius: 0.35rem;
  border: 1px solid #ddd;
  margin-right: 0.1rem;
}

.article_tmp .c-apply {
  display: flex;
  height: 0.8rem;
}

.article_tmp .c-apply .c-a-apply {
  display: flex;
  flex: 1;
  align-items: center;
  vertical-align: middle;
}

.article_tmp .c-apply .c-a-operate {
  display: flex;
  align-items: center;
  vertical-align: middle;
}

.article_tmp .c-apply .c-a-operate > div {
  display: flex;
  align-items: center;
  vertical-align: middle;
  margin-left: 0.2rem;
  color: #999;
}

.article_tmp .c-apply .c-a-operate img {
  width: 0.34rem;
  margin-right: 0.1rem;
}

.article_tmp .bottom {
  background: #fff;
  padding: 0 0.32rem;
}

.article_tmp .bottom .b-item {
  margin-top: -1px;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  padding: 0.2rem 0;
}

.article_tmp .bottom .b-item .c-info {
  display: flex;
}

.c-info .c-i-header {
  margin-right: 0.2rem;
  margin-top: 0.2rem;
  width: 0.8rem;
  height: 0.8rem;
}

.c-info .c-i-header img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid #ddd;
}

.article_tmp .bottom .c-info .c-i-name {
  flex: 1;
  margin-top: 0.2rem;
}

/*点赞*/
.c-i-praise {
  display: flex;
  align-self: center;
  color: #999;
  align-items: baseline;
}

.c-i-praise img {
  width: 0.32rem;
  height: 0.31rem;
  margin-right: 0.1rem;
}

.c-i-content {
  font-size: 0.32rem;
  margin-top: 0.2rem;
}

.article_tmp .bottom .c-info .c-i-name .c-i-n-name {
  font-size: 0.32rem;
  margin-bottom: 0.1rem;
  color: rgb(0, 147, 210);
}

.article_tmp .bottom .c-info .c-i-name .c-i-n-date {
  font-size: 0.26rem;
  color: #999;
}

/*回复内容部分*/
.sub-item {
  background: #f1f1f1;
  padding: 0.1rem 0.2rem;
  margin-bottom: 0.1rem;
  border-radius: 0.1rem;
}
</style>
