<template>
  <yd-layout class="edit">
    <yd-navbar :bgcolor="mainColor" height=".88rem" slot="navbar" v-show="!userAgent.isWX" v-title="'详细资料'" title="详细资料"  color="#fff">
      <span slot="left" @click="cancel()"  style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
      <span slot="right" style="color: #fff;">
      <a @click="toChangeRemarks" to="/circle/my_circle/friend_remarks" slot="left">
        备注
      </a>
      </span>
    </yd-navbar>
    <div class="show-friend" style="margin-top:.2rem;">
      <div class="img-div">
        <img style="width:1.28rem;height:1.28rem;border-radius:50%;" :src="account.headPortrait" alt="">
      </div>
      <div class="this-friend">
        <div class="this-friend-name" style="margin-top: .2rem">昵称：{{account.nickname}}&nbsp</div>
        <div class="this-friend-content">Id：{{account.guid}}</div>
      </div>
    </div>
    <div class="friend-intro">
      <div class="friend-intro-title">
        <div :style="`background-color:${mainColor};`">个人信息</div>
      </div>

      <div class="friend-detail-col">
        <div class="left-intro">兴趣爱好：</div>
        <div class="right-intro">
          <div v-for="item,index in user.interestName.split(',')"><span>{{item}}</span></div>
        </div>
      </div>
      <div class="friend-detail-col">
        <div class="left-intro">自我介绍：</div>
        <div class="right-intro-div">{{user.introduceMyself}}</div>
      </div>
      <div class="friend-detail-col">
        <div class="left-intro">出生年月：</div>
        <div class="right-intro">{{user.birthday}}</div>
      </div>
      <div class="friend-detail-col">
        <div class="left-intro">出生地：</div>
        <div class="right-intro">{{user.birthplace}}</div>
      </div>
      <div class="friend-detail-col">
        <div class="left-intro">工作地：</div>
        <div class="right-intro">{{user.workplace}}</div>
      </div>
      <!-- <div class="friend-detail-col">
        <div class="left-intro">血型：</div>
        <div class="right-intro">{{user.bloodType}}</div>
      </div> -->
      <!-- <div class="friend-detail-col">
        <div class="left-intro">星座：</div>
        <div class="right-intro">{{user.constellation}}</div>
      </div> -->
    </div>
    <div class="friend-intro" style="padding-bottom: 3em">
      <div class="friend-intro-title">
        <div :style="`background-color:${mainColor};`">个人信息</div>
      </div>
      <div class="friend-detail-col">
        <div class="left-tel-type">电话：</div>
        <div class="right-intro">{{account.account}}</div>
      </div>
      <div class="friend-detail-col">
        <div class="left-tel-type">微信：</div>
        <div class="right-intro">{{user.wechat}}</div>
      </div>
      <div class="friend-detail-col">
        <div class="left-tel-type">QQ：</div>
        <div class="right-intro">{{user.qq}}</div>
      </div>
    </div>
  </yd-layout>
</template>
<script>
  import Vue from 'vue';
  import {Icons} from 'vue-ydui/dist/lib.rem/icons';
  import '@/assets/css/manager.css';
  import {CheckBox, CheckBoxGroup} from 'vue-ydui/dist/lib.rem/checkbox';
  /* 使用px：import {CheckBox, CheckBoxGroup} from 'vue-ydui/dist/lib.px/checkbox'; */

  Vue.component(CheckBox.name, CheckBox);
  Vue.component(CheckBoxGroup.name, CheckBoxGroup);
  /* 使用px：import {Icons} from 'vue-ydui/dist/lib.px/icons'; */

  import InfiniteScroll from 'vue-infinite-scroll';

  Vue.component(Icons.name, Icons);
  export default {
    data() {
      let userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      let organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      let mainColor = this.$color[userInfo.organType];
      let userId = userInfo.guid;
      let getkey = this.$getkey();
      return {
        userInfo,
        account:{},
        organInfo,
        mainColor,
        userId,
        getkey,
        getkey: '',
        selectedIndex: -1,
        showPeopleList: false,
        showWordList: false,
        showSelectItem: false,
        startDate: '2017-01-01',
        endDate: '2022-12-30',
        friendDetail: {imgUrl: '', name: '一片云', id: '101010101', location: 'Jack高伟达'},
        user: {
          interestName: "",
          intro: '喜欢参加各类社团...',
          bornDate: '19994-01',
          bornPlace: '广东广州',
          workPlace: '广东广州',
          bloodType: 'A',
          constellation: '双鱼座',
          tel: '13312345678',
          weixin: '13312345678',
          qq: '1234898455'
        }
      }
    },
    methods: {
      toChangeRemarks(){
        this.$router.push(`/circle/my_circle/friend_remarks?userId=${this.$route.params.userId}`);
      },
      cancel() {
        this.$router.go(-1);
      },
      getInfo(data){
        data = data?data:{};
        console.log(this.$route)
        data.token = this.$getkey();
        data.userId = this.$route.params.userId;
        this.$ajax(`${this.subUrl.user}/user/accountInfo`,data,res=>{
          this.user = res.data.userInfo;
          this.account = res.data.user;
        },this);
      }
    },
    mounted(){
      this.getInfo();
    }
  }
</script>
<style scoped>
  .search-div {
    margin-left: 5%;
    margin-top: 0.5em;
    background: #fff;
    width: 90%;
    line-height: 2.5em;
  }

  .search-div input {
    line-height: 2em;
    margin-left: 1em;
    margin-bottom: 0.5em;
    margin-top: 0.5em;
    background: #fff;
    border: none;
  }

  .search-div img {
    float: right;
    margin-top: 0.6em;
    width: 1.8em;
    margin-right: 0.8em;
  }

  .search-by {
    width: 20%;
    margin-top: 0.5em;
    line-height: 2.5em;
    font-size: 16px;
    color: #5881ff;
    text-align: center;
  }
</style>
