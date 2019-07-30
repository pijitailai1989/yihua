<template>
  <div>
    <yd-layout class="layout_my">
      <yd-navbar class="header" slot="navbar" v-show="!userAgent.isWX" v-title="'账户管理'" title="账户管理" color="#fff" :bgcolor="mainColor" height=".88rem">
        <router-link :to="'/my/manager'" slot="left"><!--url[url.length-1]-->
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </router-link>
        <div slot="right" class="edit" style="color: #fff;">
          <!--<router-link :to="'/my/manager/job_manager/add'">-->
            <!--<img src="../../../../assets/images/rent/my/add_new_job.png" alt="">-->
          <!--</router-link>-->
        </div>
      </yd-navbar>
      <router-link :to="'/my/setting/set_pass'">
      <div class="top-password" style="width: 100%;background: #ffffff;line-height: 3em">
        <div>管理员密码设置</div>
        <img src="../../../../assets/images/rent/my/enter.png" alt="">
      </div>
      </router-link>
      <div class="top-password mechanism-msg" style="width: 100%;background: #ffffff;line-height: 3em">
        <div>管理处信息</div>
        <router-link :to="'/my/manager/edit'">
          <img src="../../../../assets/images/rent/my/add_job.png" alt="">
        </router-link>
      </div>
      <div class="top-password">
        <div class="item-left">管理处名称：</div>
        <div>{{mechanismMsg.organName}}</div>
      </div>
      <div class="top-password">
        <div class="item-left">楼宇名称：</div>
        <div>{{mechanismMsg.buildingName}}</div>
      </div>
      <div class="top-password">
        <div class="item-left" style="float: left">所在地址：</div>
        <div style="width: 70%"><span>{{mechanismMsg.buildingAddress}}</span></div>
      </div>
      <div class="top-password">
        <div class="item-left" style="float: left">企业logo：</div>
        <div class="logo-img-div"><img :src="mechanismMsg.organLogo" alt="321"></div>
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
        mechanismMsg:{},
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
        this.xhr.post(`${this.subUrl.user}/admin/accountManage/organInfo?token=`+data.token+'&organId='+data.organId).then((res) => {
          if (res.data.code == 1) {
            this.mechanismMsg=res.data.data;
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
  .top-password{
    width: 100%;
    background: #ffffff;
    line-height: 3em;
    padding-left: 1.3em;
  }
  .mechanism-msg{
    line-height: 2em;
    font-size: 12px;
    color: #999999;
    margin-top: 2em;
    border: 1px solid #e6e6e6;
  }
  .top-password img{
    float: right;
    width: 1.3em;
    height: 1.3em;
    margin-top: 0.8em;
    margin-right: 1.3em
  }
  .top-password div{
    display: inline-block;
  }
  .layout_my{
    background: #f7f7f9;
  }
  .layout_my .header:after {
    display: none;
  }
  .top-password .item-left{
    width: 25%;
    text-align: right;
    font-size: 12px;
    color: #999999;
  }
  .logo-img-div{
    width: 6em;
    height: 6em;
    border: 1px solid #e6e6e6;
    padding: 0.5em;
    margin-top: 0.5em;
    position: relative;
    border-radius: 6px;
    background: #fafefd;
  }
  .logo-img-div img{
    width: 100%;
    height: 100%;
    margin: 0!important;
  }
</style>
