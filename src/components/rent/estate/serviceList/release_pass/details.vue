<template>
  <yd-layout class="layout_my">
      <yd-navbar class="header" :title="titleT" slot="navbar" color="#fff" :bgcolor="mainColor" height=".88rem">
         <div class="addClickArea" @click="back" slot="left">
            <span ><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </div>
      </yd-navbar>
    <div class="out">
     <div class="organInfos">
      <div class="info">
         <ul>
           <li><span>客户单位：</span><p>{{clientInfo.organName}}</p>
           <!-- <i>{{releasePass.status}}</i> -->
            <i class="pdlr1 state state0" v-if="releasePass.status == 0">不同意</i>
            <i class="pdlr1 state state1" v-if="releasePass.status == 1">同意</i>
            <i class="pdlr1 state state2" v-if="releasePass.status == 2">经理审批中</i>
            <i class="pdlr1 state state3" v-if="releasePass.status == 3">客服审批中</i>
           </li>
           <li><span>使用单元：</span><p>{{clientInfo.ridName}}{{clientInfo.unitName}}</p></li>
           <li><span>办理人：</span><p>{{clientInfo.name}}</p></li>
           <li><span>联系电话：</span><p>{{clientInfo.account}}</p></li>
           <li><span>办理时间：</span><p>{{releasePass.createDate}}</p></li>
           <li><span>单号：</span><p>{{releasePass.guid}}</p></li>
         </ul>
      </div>
     </div>

     <div class="text" style="margin-top:.3rem;">
      <p><span style="color:#999">放行信息</span><i style="color:red;font-size:.22rem;">{{releasePass.releaseType==1?"24小时内一次有效":"24小时内多次有效"}}</i></p>
      <ul>
          <li v-show="releasePass.type==1"><p>客户名字</p><span>{{releasePass.releaseName}}</span></li>
          <li v-show="releasePass.type==2"><p>携带人</p><span>{{releasePass.releaseName}}</span></li>
          <li><p>手机号码</p><span>{{releasePass.releaseMobile}}</span></li>
          <li><p>身份证号</p><span>{{releasePass.idCard}}</span></li>
          <li v-show="releasePass.type==1"><p>车牌号码</p><span>{{releasePass.noOrTime}}</span></li>
          <li v-show="releasePass.type==2"><p>搬离时间</p><span>{{releasePass.noOrTime}}</span></li>
      </ul>
      <!-- {{`${imgUrl}/releasePass/QRCode?&token=${token}&releasePassId=${releasePass.guid}`}} -->
      <i><img class="bgwhite" @click="showCode = true" :src="`${imgUrl}/releasePass/QRCode?&token=${token}&releasePassId=${releasePass.guid}`" alt=""></i>
     </div>
    <div class="mask" v-if="showCode" @click="showCode = false">
        <img @click.stop="''" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:#fff;width:4rem;height:4rem;" :src="`${imgUrl}/releasePass/QRCode?&token=${token}&releasePassId=${releasePass.guid}`" alt="">
    </div>
    
     <div class="text" v-show="releasePassRowList.length>0">
      <p><span>物品名称</span><i>数量</i></p>
      <ol>
        <li v-for="(item,index) in releasePassRowList" :key="index"><p>{{item.itemName}}</p><span>{{item.amount}}</span></li>
      </ol>
      <div>
        <i v-for="(item,index) in releasePassRowList" :key="index"><img :src="item.images" alt=""></i>
      </div>
     </div>

     <div v-show="releasePass.type==2&&releasePass.ownerPs!=null" class="feedback">
       <span>业主签字同意函</span>
       <p><img :src="releasePass.ownerPs" alt=""></p>
     </div>
     <div class="text" style="margin-top:.3rem;"  v-if="releasePass.organInfo!=null">
      <p><span style="color:#999">办理信息</span>
      <i style="border-radius:.05rem;padding:.05rem .1rem;border:1px solid red;color:red;font-size:.22rem;" @click="callWaiter(releasePass.organInfo.account)">联系客服</i></p>
      <ul>
          <li><p>物业名称</p><span>{{releasePass.organInfo.organName}}</span></li>
          <li><p>办理日期</p><span>{{releasePass.releaseDate}}</span></li>
          <li><p>办理人</p><span>{{releasePass.organInfo.name}}</span></li>
      </ul>
     </div>
    </div>
    <!-- 租户经理审批 -->
    <!-- {{tasks && releasePass.status==2}} -->
    <div class="flex-row h9 bgwhite bt font32" v-if='tasks && releasePass.status==2' slot='bottom'>
      <!-- 111 -->
      <div class="flex1 jusCenter br" @click="disagree1">
        <yd-icon custom name='delete' color='#f00'></yd-icon>
        <!-- <img style="width:.4rem;height:.4rem;" class="mr1" src="../../../../../../assets/images/rent/estate/disagree.png" alt=""> -->
        <span style='color:#ff483f;'>不同意</span>
      </div>
      <div class="flex1 center jusCenter" @click='agree1'>
        <yd-icon custom name='selected' style="padding-top:.1rem;" class="mr1" size='.4rem' :color='mainColor'></yd-icon>
        <!-- <img style="width:.4rem;height:.4rem;" class="mr1" src="../../../../../../assets/images/rent/estate/select_active.png" alt=""> -->
        <span :style='{color:mainColor}'>同意</span>
      </div>
    </div>
  </yd-layout>
</template>
<script>
import Vue from "vue";
import fn from "@/assets/js/product";
import qs from "qs";

export default {
  data() {
    // console.log(this.subUrl.activity)
    return {
      mainColor: "",
      showCode: false,
      titleT: '放行条详情',
      show: true,
      imgUrl: `${this.baseUrl}${this.subUrl.activity}`,
      s: true,
      p: true,
      d: true,
      token:this.$getkey(),
      statusList: [],
      token: "",
      userId: "",
      releasePassId: null,
      releasePass: {},
      tasks: null,
      releasePassRowList: [],
      clientInfo: {},
      ownerInfo: {}
    };
  },
  methods: {
    callWaiter(e) {
      this.$dialog.alert({ mes: "请联系客服电话" + e });
    },
    disagree1() {
      // 租户拒绝放行
      this.$dialog.confirm({
        mes: "是否拒绝放行",
        opts: () => {
          var data = {
            token: this.$getkey(),
            userId: this.userInfo.guid,
            releasePassId: this.releasePass.guid,
            opinion: 0
          };
          this.$ajax(
            `${this.subUrl.activity}/releasePass/manageApprove`,
            data,
            res => {
              this.$dialog.toast({ mes: "已拒绝放行", icon: "success" });
              this.getReleasePass();
            },
            this
          );
        }
      });
    },
    agree1() {
      // 租户经理同意放行
      this.$dialog.confirm({
        mes: "是否同意放行",
        opts: () => {
          var data = {
            token: this.$getkey(),
            userId: this.userInfo.guid,
            releasePassId: this.releasePass.guid,
            opinion: 1
          };
          this.$ajax(
            `${this.subUrl.activity}/releasePass/manageApprove`,
            data,
            res => {
              this.$dialog.toast({ mes: "已提交管理处客服审批", icon: "success" });
              this.getReleasePass();
            },
            this
          );
        }
      });
    },
    toggle() {
      this.show = !this.show;
    },
    turnTo(url) {
      this.$router.push(url);
    },
    back() {
      history.back();
    },
    // 获取邀请信息列表
    getReleasePass() {
      var data = {
        userId: this.userId,
        token: this.token,
        releasePassId: this.releasePassId
      };
      this.xhr
        .post(
          `${this.subUrl.activity}/releasePass/getReleasePass`,
          qs.stringify(data)
        )
        .then(res => {
          console.log(res);
          if (res.data.code == 1) {
            this.releasePass = res.data.data.releasePass;
            this.clientInfo = res.data.data.releasePass.clientInfo;
            this.ownerInfo = res.data.data.releasePass.ownerInfo;
            this.releasePassRowList = res.data.data.releasePassRowList;
            this.tasks = res.data.data.tasks;
            this.titleT = res.data.data.releasePass.type == 1?"客户放行条":"物品放行条";
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        });
    }
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
    this.token = fn.getIng();
    this.releasePassId = this.$route.query.guid;
    this.getReleasePass();

    console.log(this.$route.query.guid);
  }
};
</script>
<style scoped>
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
.out {
  width: 100%;
  height: calc(100vh - 0.88rem);
  overflow-y: scroll;
}
.organInfos {
  width: 100%;
  background: white;
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
  border: 1px solid #2d88d4;
  color: #2d88d4;
}

.info {
  width: 100%;
  background: white;
  border-bottom: 1px solid #f3f6f5;
  padding: 0.2rem 0.3rem;
  font-size: 0.28rem;
}
.info ul li {
  display: flex;
  height: 0.5rem;
  align-items: center;
  position: relative;
}
.info ul li > span {
  width: 1.6rem;
  text-align: right;
  color: #9d9e9d;
}
.info ul li > i {
  /* padding: 0.02rem 0.05rem;
  border: 1px solid #2d88d4;
  font-size: 0.22rem;
  
  border-radius: 0.05rem;
  color: #2d88d4; */
  position: absolute;
  right: 0;
  top: 0.06rem;
}

.text {
  position: relative;
  display: flex;
  flex-flow: column;
  width: 100%;
  background: white;
  border-top: 1px solid #e6e8e7;
}
.text > p {
  width: 100%;
  height: 0.7rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.4rem;
  border-bottom: 1px solid #e6e8e7;
}
.text > ul {
  width: 100%;
  padding: 0.1rem 0.3rem;
}
.text > ul > li {
  width: 100%;
  height: 0.5rem;
  display: flex;
  align-items: center;
}
.text > ul > li > p {
  width: 1.6rem;
  text-align: center;
}
.text > i {
  width: 1rem;
  height: 1rem;
  position: absolute;
  right: 0.5rem;
  top: 0.8rem;
}
.text > i > img {
  width: 100%;
}
.text > ol {
  width: 100%;
  padding: 0.1rem 0.4rem;
}
.text > ol > li {
  border-bottom: 1px solid #e6e8e7;
  width: 100%;
  justify-content: space-between;
  display: flex;
  align-items: center;
  height: 0.7rem;
}
.text > ol > li:last-child {
  border: none;
}
.text > div {
  width: 100%;
  display: flex;
}
.text > div > i {
  width: 1.4rem;
  height: 1.4rem;
  margin: 0.1rem 0.25rem;
  border-radius: 0.1rem;
}
.text > div > i > img {
  width: 100%;
  height: 100%;
  border-radius: 0.1rem;
}

.feedback {
  width: 100%;
  padding: 0.1rem 0.4rem;
  display: flex;
  flex-flow: column;
  background: white;
  margin-top: 0.3rem;
}
.feedback > span {
  width: 100%;
  height: 0.6rem;
  color: #c5c5c5;
  font-size: 0.24rem;
  display: flex;
  align-items: center;
}
.feedback > p {
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 0.1rem;
}
.feedback > p > img {
  width: 100%;
  height: 100%;
}

.buttons {
  width: 100%;
  margin: 0.4rem 0;
  display: flex;
  justify-content: center;
}
.buttons > button {
  width: 90%;
  height: 0.8rem;
  color: white;
  font-size: 0.3rem;
  font-weight: 600;
  border-radius: 0.1rem;
  border: none;
}
</style>
