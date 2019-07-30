<template>
  <div>
    <yd-layout class="layout_my">
      <yd-navbar class="header" slot="navbar" v-show="!userAgent.isWX" v-title="'报修详情'" title="报修详情" color="#fff" :bgcolor="mainColor" height=".88rem">
        <router-link :to="'/estate/repair'" slot="left"><!--url[url.length-1]-->
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </router-link>
        <div slot="right" class="edit" style="color: #fff;">

        </div>
      </yd-navbar>
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
        guid:''
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
      getOrderDetail(cb) {
        var data = {userId: this.userId, token: this.getkey,repairsId:this.guid};
        this.xhr.post(`${this.subUrl.activity}/repairs/detail?`+ qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
            this.result=res.data.data
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
      if(this.$route.query.guid){
        this.guid=this.$route.query.guid
      }
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = localStorage.getItem('mainColor');
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      this.userId = this.userInfo.guid;
      var that = this;
      this.getUserInfo(function () {
        that.getJobInfo();
        that.getOrderDetail()
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
</style>
