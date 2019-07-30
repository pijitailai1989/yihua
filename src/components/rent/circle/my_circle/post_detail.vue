<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" slot="navbar" v-show="!userAgent.isWX" title="详情" :bgcolor="mainColor" color="#fff">
      <span slot="left" @click="cancel()" color="#fff;padding-right:.2rem" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
      <span slot="right" @click="chooseSuccess()" color="#fff;padding-right:.2rem" style="color: #fff;">
      </span>
    </yd-navbar>
    <div class="model-dev" @click="$router.push('/rent/circle/article/' + info.bbs.guid)">
      <div class="left-div font32">{{info.bbs.title}}<br>
      <span class="font28 foCo9"><img src="../../../../assets/images/rent/circle/eye.png" width="16"  alt="">{{info.bbs.viewNum?info.bbs.viewNum:0}}</span>
      <span class="font28 foCo9"><img src="../../../../assets/images/rent/circle/good.png" width="16" alt="">{{info.linkNum?info.linkNum:0}}</span>
      </div>
      <div style="width: 30%">
        <img class="pic-user" :src="userInfo.headPortrait">
      </div>
      <div>
        <img class="m-right l-right" src="../../../../assets/images/rent/my/enter.png">
      </div>
    </div>
    <div class="model-dev1"  @click="showPeople">
      <img src="../../../../assets/images/rent/circle/apply_1.png" width="16" height="16" alt="">
      <div class="left-div">报名详情（{{info.bbsApplicantList.length}}/{{info.bbs.applicantNum}}人）</div>
      <div style="width: 30%">
      </div>
      <div>
        <img class="m-right l-right show-icon"
             v-bind:style="showPeopleList?'':'transform: rotate(-90deg)'"
             src="../../../../assets/images/rent/my/enter.png">
      </div>
    </div>
    <div class="list-item" v-bind:style="showPeopleList?'':'height:0'">
      <div v-for="(item,index) in info.bbsApplicantList" v-bind:key="item.id" style="margin:0.5em 0.8em;background: #fff">
        <div class="list-item-top">
          <div>
            <div>{{item.nickname}}</div>
            <div>{{item.account}}</div>
          </div>  
          <div>报名码：{{item.guid}}</div>
        </div>
        <div class="list-item-bottom" v-bind:style="item.status=='过期'?'background:#e6e6e6':''">
          {{item.createDate|times}}
           <span v-if="item.status == 1" :style="{color:mainColor}" class="pull-right">正常</span>
           <span v-if="item.status == 2" :style="{color:mainColor}" class="pull-right">完成</span>
           <span v-if="item.status == 3"  class="pull-right foCo9">关闭</span>
           <span v-if="item.status == 4"  class="pull-right foCo9">过期</span>
        </div>
      </div>
    </div>
    <div class="model-dev1" @click="showWord" style="margin-bottom: 0.5em">
       <img src="../../../../assets/images/rent/circle/component.png" width="16" height="16" alt="">
      <div class="left-div">评论（{{info.bbsCommentList.length?info.bbsCommentList.length:0}}）</div>
      <div style="width: 30%">
      </div>
      <div>
        <img class="m-right l-right show-icon" 
             v-bind:style="showWordList?'':'transform: rotate(-90deg)'"
             src="../../../../assets/images/rent/my/enter.png">
      </div>
    </div>
    <div class="list-item" v-bind:style="showWordList?'':'height:0'">
      <div class="list-user-say" v-for="(item,index) in info.bbsCommentList" v-bind:key="item.guid" style="background: #fff">
        <div><img class="list-user-pic" v-if="item.userPic&&item.userPic!=''" :src="item.userPic" alt="">
          <img class="list-user-pic" v-if="!item.userPic||item.userPic==''"
               :src="item.headPortrait" alt="">
          <span :style="`color:${mainColor}`" class="font32">{{item.nickname}}<br><span style="color: #999;font-size:.28rem">{{item.createDate | times}}</span></span></div>
        <div><br>
          {{item.content}}<br>
          <div class="text-right" style="width: 100%">
            <img @click="showEdit(index,item)" src="../../../../assets/images/rent/circle/component1.png" width="20" alt="">
            </div>
        </div>
        <!-- 二级评论 -->
        <div class="subComponent" v-for="(v,i) in item.childList" :key="i">
          <div class="subName">
            <span :style="{color:mainColor}">{{v.nickname}}</span><span class="foCo9">对{{item.nickname}}回复：</span>
             {{v.content}}
          </div>
        </div>
        <div>

        </div>
      </div>
      
    </div>
     <div class="myComponent" slot="bottom" v-show="showInput">
          <!-- <yd-textarea slot="right"  maxlength=300></yd-textarea> -->
            <div class="myinput" >
                  <yd-textarea slot="right" :show-counter='false' v-model="comment" :placeholder="toUser" maxlength="300"></yd-textarea>
            </div>
            <div class="button">
              <yd-button type="danger" @click.native="sendComponent()"  :bgcolor='mainColor' color='#fff'>发送</yd-button>
            </div>
       
        </div>
  </yd-layout>
</template>
<script>
import fn from "@/assets/js/product.js";
export default {
  data() {
    let userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    let organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    let mainColor = this.$color[userInfo.organType];
    let userId = userInfo.guid;
    let getkey = fn.getIng();
    return {
      comment: "",
      showInput: false,
      toUser: "回复：",
      userInfo,
      organInfo,
      mainColor,
      userId,
      getkey,
      info: {
        bbs: {},
        bbsApplicantList: [],
        bbsCommentList: []
      },
      showPeopleList: false,
      showWordList: false,

      peopleLookThis: [
        {
          userPic: "",
          userName: "我是树枝",
          sayTime: "今天 10:30",
          sayContent: "我也想买"
        },
        { userPic: "", userName: "逗得", sayTime: "今天 10:30", sayContent: "买买买" },
        {
          userPic: "",
          userName: "超人",
          sayTime: "今天 10:30",
          sayContent: "剁剁剁剁"
        },
        { userPic: "", userName: "蝙蝠", sayTime: "今天 10:30", sayContent: "清清清" }
      ]
    };
  },
  methods: {
    showEdit(i, v, sV, sI) {
      console.log(i, v,'succsesese');
      this.toUser = "回复";
      this.bbsId = v.bbsId;
      this.bbsCommentId = v.guid;
      this.showInput = true;
      this.currentIndex = i;
      console.log(this.bbsCommentId)
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
          bbsCommentId: this.bbsCommentId,
          comment: this.comment
        },
        res => {
          this.showInput = false;
          var arr = this.info.bbsCommentList[this.currentIndex].childList;
          arr = arr ? arr : [];
          console.log(this.userInfo.nickname);
          res.data.nickname = this.userInfo.nickname;
          arr.push(res.data);
          this.$set(this.info.bbsCommentList[this.currentIndex], "childList", arr);
          console.log(this.components);
          this.comment = "";
          this.$dialog.toast({ mes: "发送成功", timeout: 1000, icon: "success" });
        },
        this
      );
    },
    showPeople() {
      this.showPeopleList = !this.showPeopleList;
    },
    showWord() {
      this.showWordList = !this.showWordList;
    },
    cancel() {
      this.$router.go(-1);
    },
    getDetail(data, cb) {
      data = data ? data : {};
      data.token = this.$getkey();
      data.bbsId = this.$route.params.guid;
      data.userId = this.userInfo.guid,
      console.log(data);
      this.$ajax(
        `${this.subUrl.sc}/bbs/getBbsDetail`,
        data,
        res => {
          cb && cb(res);
        },
        this
      );
    }
  },
  mounted() {
    this.getDetail({}, res => {
      this.info = res.data;
    });
  }
};
</script>
<style scoped>
.myComponent {
  display: flex;
  width: 100%;
  height: 1.5rem;
  background: #fff;
  align-items: flex-end;
  padding: 0 0.24rem 0.2rem;
}
.myinput {
  flex: 1;
  height: 100%;
  margin-right: 0.2rem;
}
.myinput textarea {
  height: 100%;
}
.subComponent {
  background: #f1f1f1;
  padding: 0.1rem 0.2rem;
  margin-bottom: 0.2rem;
  border-radius: 0.1rem;
  line-height: 2;
  display: flex;
}
.subName{
  word-break: break-all;
}

.model-dev {
  background: #fff;
  width: 100%;
  margin-top: 0.5em;
  line-height: 2.5em;
  display: flex;
  padding-left: 1em;
  padding-top: 1.2em;
  padding-bottom: 1.2em;
  position: relative;
}

.model-dev1 {
  background: #fff;
  width: 100%;
  margin-top: 0.5em;
  line-height: 2.5em;
  display: flex;
  align-items: center;
  padding-left: 1em;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  position: relative;
}
.model-dev1 > img {
  margin-right: 0.1rem;
}

.left-div {
  width: 55%;
}
.left-div span {
  vertical-align: baseline;
  margin-right: 0.2rem;
}
.left-div span > * {
  vertical-align: baseline;
  margin-right: 0.1rem;
}

.l-right {
  height: 0.3rem;
  width: 0.3rem;
  right: 0.3rem;
  top: 50%;
  margin-top: -0.5em;
  position: absolute;
}

.show-icon {
  transform: rotate(90deg);
  transition: 0.3s;
}

.list-item {
  width: 100%;
  overflow: hidden;
  transition: 0.3s;
  border-radius: 3px;
}

.list-item-top {
  width: 100%;
  background: #fff;
  line-height: 2;
  padding: 0.15rem 0.24rem;
}

.list-item-top > div {
  display: flex;
  white-space: nowrap;
}
.list-item-top > div:nth-child(1) > div {
  margin-right: 0.2rem;
}
.list-item-top > div:nth-child(2) {
  white-space: nowrap;
}

.list-item-bottom {
  width: 100%;
  background: #f6f6f6;
  color: #999999;
  line-height: 2.5em;
  padding: 0 0.5em;
  font-size: 13px;
}

.pic-user {
  width: 3.5em;
  height: 3.5em;
  border-radius: 50%;
  float: right;
  margin-top: 0.4em;
}

.list-user-pic {
  float: left;
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  margin: 0.5em;
}
.list-user-say {
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  padding: 0.5em 1em;
}

/*transform:rotate(45deg)*/
</style>
