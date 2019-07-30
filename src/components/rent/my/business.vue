<template>
<div style="height: 100vh;">
  <yd-layout class="layout_my"  v-show="showMember">
    <div class="blue_box" :class="{blue:userInfo.organType == 4,green:userInfo.organType == 1,orange:userInfo.organType == 2}">
      <yd-navbar class="header" v-show="!userAgent.isWX" v-title="'管理员'" title="管理员" color="#fff" :bgcolor="mainColor" height=".88rem">
        <div @click="back()" slot="left">
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </div>
        <!--<div slot="right" class="edit" style="color: #fff;" @click="turnTo('/my/change_manager')">编辑</div>-->
      </yd-navbar>
      <div class="center_info">
        <div class="logo"><img :src="userInfo.headPortrait"></div>
        <div class="my_info">
          <div class="m-name">{{userInfo.name}}</div>
          <div class="m-account">手机:{{userInfo.account}}</div>
          <div class="m-account" v-if="(userInfo.organType!=5)">岗位:{{userInfo.postName?userInfo.postName:"暂无"}}</div>
        </div>
      </div>
      <!--<div class="bottom" :class="{bottom1:userInfo.organType == 5}">-->
        <!--<div class="bumenBox" v-if="!(userInfo.organType == 5)">-->
          <!--<img v-if="userInfo.organType == 1" src="../../../assets/images/rent/my/orang_green.png" class="bumen">-->
          <!--<img v-else-if="userInfo.organType == 2"-->
               <!--src="../../../assets/images/rent/my/organ_orange.png" class="bumen">-->
          <!--<img v-else src="../../../assets/images/rent/my/orange_blue.png" class="bumen">-->
          <!--<span v-if="userInfo.deptName&&userInfo.deptName!=''">{{userInfo.deptName}}</span>-->
          <!--<span v-if="!userInfo.deptName||userInfo.deptName==''">{{userInfo.postName}}</span>-->
        <!--</div>-->
      <!--</div>-->
    </div>
    <div class="content">
      <div class="eidt_code">
        <div class="left">
          <img src="../../../assets/images/rent/my/invite_code.png">
          邀请码
        </div>
        <div class="edit_content">
          <input type="text" maxlength="20" v-model="organInfo.inviteCode">
          <img @click="changeInviteCode" src="../../../assets/images/rent/my/change_gray.png">
        </div>
        <div class="send" @click="toSendInviteCode">
          <yd-button type="hollow" color="#0093d2">发送</yd-button>
        </div>
      </div>
      <!--消息界面-->
      <div class="message">
        <div v-for="(item,index) in company" @click="turnTo(item.path)" :class="[{'m-top':index==0,
      'm-center':index > 0 && index < (company.length-1),
        'm-bottom':index == (company.length-1)},{hasMessage:index==0 && hasMessage.new}]" :key="index">
          <img class="m-icon" :src="item.img">
          <div class="m-content">{{item.name}}</div>
          <div class="newMessage" v-if="index==0 && hasMessage.new">{{hasMessage.count}}未读</div>
          <img class="m-right" src="../../../assets/images/rent/my/enter.png">
        </div>
        <!--人员信息-->
        <div class="m-list" @click.stop.prevent="turnTo(member.path)">
          <img class="m-icon" :src="member.img">
          <div class="m-content">{{member.name}}</div>
          <img class="m-right" src="../../../assets/images/rent/my/enter.png">
        </div>
        <!--关于--><!--@click="turnTo(url)"-->
        <div class="m-list" @click.stop.prevent="turnTo(about.path)">
          <img class="m-icon" :src="about.img">
          <div class="m-content">{{about.name}}</div>
          <img class="m-right" src="../../../assets/images/rent/my/enter.png">
        </div>

      </div>
    </div>
  </yd-layout>
  <menber v-if="!showMember" @sendCode="sendCode"></menber>
</div>
</template>
<script>
  import fn from '@/assets/js/product'
  import qs from 'qs'
  import menber from '../supplyfor_app/memberModel'
  export default {
    components:{
      menber
    },
    data() {
      return {
        showMember:true,
        organInfo: "",
        hasMessage: {
          count: 99,
          new: true,
        },
        url: this.fromRoute ? this.fromRoute : '',
        userInfo: "",
        mainColor: "",
        invide_code: "",
        company: [
        //   {
        //   name: "最新消息",
        //   img: require('../../../assets/images/rent/my/message.png'),
        //   path: '/my/manager/new_message'
        // },
        //   {
        //   name: "岗位管理",
        //   img: require('../../../assets/images/rent/my/job.png'),
        //   path: '/my/manager/job_manager'
        // },
        //   {
        //   name: "部门管理",
        //   img: require('../../../assets/images/rent/my/bumen.png'),
        //   path: '/my/manager/department'
        // },
        //   {
        //   name: "账户管理",
        //   img: require('../../../assets/images/rent/my/account.png'),
        //   path: "/my/manager/account"
        // }
        ],
        member:{
          name: "人员信息",
          img: require('../../../assets/images/rent/my/admin/icon_03.png'),
          path: "/business/member"
        },
        about: {
          name: "修改密码",
          img: require('../../../assets/images/rent/my/admin/icon_06.png'),
          path: "/my/change_manager"
        },
        local:{
          a:0,
          b:0
        }
      }
    },
    methods: {
      back(){
        this.$back(this);
      },
      sendCode(e){
        console.log(this.organInfo)
        this.showMember = true;
        if(e){
          let data = {
            token:this.$getkey(),
            userIds:e.join(','),
            organId:this.organInfo.guid,
          };
          this.$ajax(`${this.subUrl.user}/admin/resendInvite`,data,res=>{
            this.$dialog.toast({mes:"重发邀请码成功",icon:"success"})
          },this)
        }
      },
      toSendInviteCode(){
        // this.$router.push({path: '/my/manager/send_inviteCode'})
        this.showMember = false;
      },
      turnTo(url) {
        this.$router.push(url)
      },
      /*获取最新消息*/
      getNewmessage() {
        var data = {token: this.getkey,organId:this.organInfo.guid};
        // console.log(data)
        this.xhr.post(`${this.subUrl.admin}/latestNews/organNews`, qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
            console.log(res.data.data)
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
      },
      /*获取用户信息*/
      getUserInfo(cb) {
        var data = {userId: this.userId, token: this.getkey};
        this.xhr.post(`${this.subUrl.user}/user/getUserInfo`, qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
            this.userInfo = res.data.data.userInfo;
            this.organInfo = res.data.data.organInfo;
            cb&&cb();
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
      },
      changeInviteCode(){
        var data = {userId: this.userId, token: this.getkey};
        this.xhr.post(`${this.subUrl.user}/admin/editShibboleth?token=` + data.token + '&organId=' + this.organInfo.guid +'&inviteCode='+this.organInfo.inviteCode).then((res) => {
          if (res.data.code == 1) {
            this.$dialog.toast({mes:"修改邀请码成功"});
            cb&&cb();
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
      },
    },
    mounted() {
      if(this.$route.query.token){
        this.$getUserInfo(res=>{
          this.userId = this.userInfo.guid;
          this.getkey = fn.getIng();
          this.userId = this.userInfo.guid;
          this.local.b = localStorage.getItem('isManger');
          this.local.a = localStorage.getItem('organType');
          // this.getNewmessage();
        },this)
      }else {
        this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
        this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
        this.mainColor = localStorage.getItem('mainColor');
        this.userId = this.userInfo.guid;
        this.getkey = fn.getIng();
        this.userId = this.userInfo.guid;
        this.local.b = localStorage.getItem('isManger');
        this.local.a = localStorage.getItem('organType');
        var that = this;
        this.getUserInfo(function () {
          that.getNewmessage();
        });
      }
    }
  }
</script>
<style scoped>
  .layout_my .header:after {
    display: none;
  }

  .layout_my .blue_box {
    height: 3.8rem;
    background: url("../../../assets/images/rent/my/my_blue.png");
    background-size: 100% 100%;
  }

  .layout_my .blue > div > div {
    display: flex;
  }

  /*头像*/
  .layout_my .center_info {
    display: flex;
    justify-content: space-between;
    padding: 0 .32rem;
    margin-bottom: .4rem;
    color: #fff;
  }

  .layout_my .center_info .my_info {
    flex: 1;
    padding: 0.1rem .2rem;
  }

  .layout_my .center_info .my_info > div {
    margin-bottom: .07rem;
    font-size: .24rem;
  }

  .layout_my .center_info .my_info .m-name {
    font-size: .36rem;
  }

  .layout_my .center_info .logo {
    width: 1.38rem;
    height: 1.38rem;
    border-radius: 50%;
    overflow: hidden;
    background: url("../../../assets/images/rent/my/default_header_circle.png") left top no-repeat cover;
    vertical-align: middle;
    padding: .1rem;
  }

  .layout_my .center_info .code {
    align-self: center;
    margin-right: .45rem;
  }

  .layout_my .center_info .code img {
    width: .6rem;
    height: .6rem;
  }

  .layout_my .center_info .logo img {
    vertical-align: middle;
    width: 100%;
    height:100%;
    border-radius: 50%;
  }

  .layout_my .green {
    background: url("../../../assets/images/rent/my/my_green.png");
    background-size: 100% 100%;
  }

  .layout_my .orange {
    background: url("../../../assets/images/rent/my/my_orange.png");
    background-size: 100% 100%;
  }

  /*签到*/
  .layout_my .bottom {
    padding: 0 .32rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .hasMessage {
    position: relative;
    margin-bottom: 1px;
  }

  .hasMessage:after {
    position: absolute;
    display: none;
    content: '';
    right: .2rem;
    top: .1rem;
    /* display: block; */
    width: .2rem;
    height: .2rem;
    background: #f00;
    -webkit-border-radius: 100%;
    -moz-border-radius: 100%;
    border-radius: 100%;
  }

  .layout_my .bottom > div {
    height: .6rem;
    background: #fff;
    display: flex;
    align-items: center;
    min-width: 1.8rem;
    padding: 0 .2rem;
    border-radius: .1rem;
    background: #fff;
  }

  .layout_my .bottom > div img {
    margin-right: .1rem;
    width: .5rem;
  }

  /*邀请码*/
  .eidt_code {
    display: flex;
    flex-flow: row nowrap;
    height: 1rem;
    padding: .15rem .24rem;
    align-items: center;
    background: #fff;
  }

  .eidt_code > div {
    display: flex;
    align-items: center;
    height: 100%;
    text-align: center;
  }

  .eidt_code .left {
    width: 1.6rem;
    border: 1px solid #ddd;
    background: #f4f4f4;
    justify-content: center;
    color: #666;
  }

  .eidt_code img {
    width: .32rem;
    height: .32rem;
    margin-right: .1rem;
  }

  .eidt_code .edit_content {
    flex: 1;
    margin: 0 .2rem;
    -webkit-border-radius: .1rem;
    -moz-border-radius: .1rem;
    border-radius: .1rem;
    background: #ebf3f3;
  }

  .eidt_code .edit_content img {

  }

  .eidt_code .edit_content input {
    padding: 0 .1rem;
    outline: none;
    background: none;
    border: none;
  }

  .eidt_code .send {
    width: 1rem;
    justify-content: center;
  }

  /**/
  .message {
    margin: .36rem .24rem;
    color: #333;
  }

  .newMessage {
    margin-right: .2rem;
    display: none;
  }

  .message > div {
    display: flex;
    align-items: center;
    height: 1rem;
    margin-top: -1px;
    padding: 0 .32rem;
  }

  .message > div .m-icon {
    width: .52rem;
    height: .52rem;
  }

  .message > div .m-right {
    width: .32rem;
  }

  .message > div .m-content {
    flex: 1;
    padding: 0 .2rem;
  }

  .message .m-center {
    background: url("../../../assets/images/rent/my/list_center.png") no-repeat left top;
    background-size: 100% 100%;
  }

  .message .m-top {
    background: url("../../../assets/images/rent/my/list_top.png") no-repeat left top;
    background-size: 100% 100%;
  }

  .message .m-bottom {
    background: url("../../../assets/images/rent/my/list_bottom.png") no-repeat left top;
    background-size: 100% 100%;
  }

  .message > .m-list {
    margin: .2rem 0;
    background: url("../../../assets/images/rent/my/list.png") no-repeat left top;
    background-size: 100% 100%;
  }

  /*消息列表结束*/
</style>
