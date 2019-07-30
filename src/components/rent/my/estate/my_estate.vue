<template>
  <div>
    <yd-layout class="layout_my">
      <yd-navbar class="header" v-show="!userAgent.isWX" slot="navbar" v-title="'物业管理'" title="物业管理" color="#fff" :bgcolor="mainColor" height=".88rem">
        <router-link :to="'/my/manager'" slot="left"><!--url[url.length-1]-->
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </router-link>
        <div slot="right" class="edit" style="color: #fff;">
          <router-link :to="'/my/manager/job_manager/add'">
            <img src="../../../../assets/images/rent/my/add_new_job.png" alt="">
          </router-link>
        </div>
      </yd-navbar>
      <div>
        <div class="get-child-list">
          <div class="child-top-title">任务单</div>
          <div class="right-title-content">客服部完成计划最新状态更新至23%
            <img class="m-right" v-bind:class="isImgActive?'img-active':''" src="../../../../assets/images/rent/my/enter.png">
          </div>
        </div>
        <div class="get-child-list get-child-list-top">
          <div class="child-top-title">审批下属</div>
          <div class="right-title-content">
            <img class="m-right" v-bind:class="isImgActive?'img-active':''" src="../../../../assets/images/rent/my/enter.png">
          </div>
        </div>
        <div class="get-child-list get-child-list-top">
          <div class="child-top-title">向上汇报</div>
          <div class="right-title-content">
            <img class="m-right" v-bind:class="isImgActive?'img-active':''" src="../../../../assets/images/rent/my/enter.png">
          </div>
        </div>
        <div class="server-img-all">
          <div class="server-img-list-title">其他</div>
        <div class="server-img-list">
          <div><img src="../../../../assets/images/rent/my/call.png" alt="321">客户服务</div>
          <div><img src="../../../../assets/images/rent/my/call.png" alt="321">客户服务</div>
          <div><img src="../../../../assets/images/rent/my/call.png" alt="321">客户服务</div>
          <div><img src="../../../../assets/images/rent/my/call.png" alt="321">客户服务</div>
        </div>
        </div>
      </div>
    </yd-layout>
  </div>
</template>
<script>
  import fn from '@/assets/js/product'
  import qs from 'qs'
  export default {
    data() {
      return {
        organInfo: "",
        hasMessage: {
          count: 99,
          new: true,
        },
        value2: "",
        result: [],
        url: this.fromRoute ? this.fromRoute : '',
        userInfo: "",
        mainColor: "",
        isImgActive:true,
      }
    },
    methods: {
      itemClickHandler() {
      },
      submitHandler(value) {
        this.arr = [];
        this.selectTab = 4;
        this.page = 1;
        this.$dialog.toast({mes: `搜索：${value}`});
        var data = {token: this.getkey, organId: this.organInfo.guid};
        // {params: {type: 'pulldown', page: this.page}
        this.xhr.post(`${this.subUrl.admin}/latestNews/organNews?token=` + this.getkey + '&keyword=' + `${value}` + '&organId=' + this.organInfo.guid + '&pageNo=' + this.page + '&pageSize=10').then((res) => {
          if (res.data.code == 1) {
            this.arr = [...res.data.data.list, ...this.arr];
            if (res.data.data.list.length == 0) {
              this.showErr = true;
            } else {
              this.showErr = false;
            }
            this.page++;
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
      },
      getJobInfo(cb) {
        var data = {organId:this.organInfo.guid, token: this.getkey,pageNo:1,pageSeze:15};
        this.xhr.post(`${this.subUrl.user}/admin/postManage/postList?token=`+data.token+'&organId='+data.organId).then((res) => {
          if (res.data.code == 1) {
            cb&&cb();
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            // fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
      },
      clearLoacl(){
        this.alertS=true;
      },
      quit(){
        this.alertS=false;
      },
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

    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = localStorage.getItem('mainColor');
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      this.userId = this.userInfo.guid;
      var that = this;
      this.getUserInfo(function () {
        that.getJobInfo();
      });
    }
  }
</script>
<style scoped>
  .top_title{
    width: 100%;
    line-height:0.8rem;
    font-size: 0.18rem;
    padding: 0 0.3rem;
  }
  .layout_my{
    background: #f7f7f9;
  }
  .layout_my .header:after {
    display: none;
  }
  .get-child-list{
    width: 100%;
    position: relative;
    font-size: 14px;
    background: #fefefd;
    color: #0f99d4;
    line-height: 2em;
    padding: 0.5em 0;
  }
  .get-child-list-top{
    margin-top: 1em;
  }
  .child-top-title{
    display: inline-block;
    width: 24%;
    text-align: center;
    border-right: 1px solid #e6e6e6;
  }
  .get-child-list :after{
    position: absolute;
    content: '';
    left: 26%;
    top: 44%;
    display: block;
    width: 6px;
    height: 6px;
    background: #0f99d4;
    border-radius: 100%;
  }
  .right-title-content{
    float: right;
    width: 70%;
    font-size: 12px;
    color: #444444
  }
  .right-title-content img{
    float: right;
    width: 1.5em;
    margin-top: 0.4em;
    margin-right: 1em;
  }
  .right-title-content .img-active{
    transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -webkit-transform: rotate(90deg);
    -o-transform: rotate(90deg);
    transition: 0.2s ease-in;
  }
  .server-img-all{
    background: #fefefd;
    margin-top: 15px;
  }
  .server-img-list{
    /*display: flex;*/
    background: #fefefd;
    text-align: center;
  }
  .server-img-list-title{
    color: #737373;
    width: 100%;
    padding-left: 1em;
    line-height: 2em;
  }
  .server-img-list div{
    width: 24%;
    margin: 0;
    padding: 0;
    display: inline-block;
  }
</style>
