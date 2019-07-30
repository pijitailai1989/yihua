<template>
  <div>
    <yd-layout class="layout_my">
      <yd-navbar class="header" slot="navbar" v-show="!userAgent.isWX" v-title="'报修类型'" title="报修类型" color="#fff" :bgcolor="mainColor" height=".88rem">
        <router-link :to="'/estate/to_repair'" slot="left"><!--url[url.length-1]-->
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </router-link>
        <div slot="right" class="edit" style="color: #fff;">
          <router-link :to="'/estate/to_repair'">
            <img src="../../../../../assets/images/rent/my/add_new_job.png" alt="">
          </router-link>
        </div>
      </yd-navbar>
      <div class="top_title"><div class="time-title"><img src="../../../../../assets/images/rent/my/add_new_job.png" alt="">请选择</div></div>
      <div class="type-this">
        <div v-for="(item,index) in qsTypes" :key="index" @click="searchType(item.dictDataName,item.guid)">
          <div>{{item.dictDataName}}</div>
        </div>
        <div v-if="qsTypes.length%3!=0"></div>
        <div v-if="qsTypes.length%3==1"></div>
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
        qsTypes:[]
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
      searchType(name,guid){
        this.$router.push('/estate/to_repair?type='+guid+'&typeName='+name)
      },
      clearLoacl(){
        this.alertS=true;
      },
      quit(){
        this.alertS=false;
      },
      getType() {
        var data = {userId: this.userId, token: this.getkey, pageNo: 1, pageSeze: 15};
        this.xhr.post(`${this.subUrl.user}/comm/getMt`).then((res) => {
          if (res.data.code == 1) {
            this.qsTypes = res.data.data
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
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
        that.getType();
      });
    }
  }
</script>
<style scoped>
  .top_title{
    width: 100%;
    background: #ffffff;
    padding-bottom: 0.5em;
  }
  .top_title img{
    width: 1em;
    margin-top: 0.5em;
    height: auto;
    float: left;
  }
  .time-title{
    width: 100%;
    color: #999999;
    margin:0 1em;
    line-height: 2em;
  }
  .layout_my{
    background: #f7f7f9;
  }
  .layout_my .header:after {
    display: none;
  }
  .type-this {
    z-index: 100;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    background: #ffffff;
    width: 100%;
  }

  .type-this-fix {
    position: fixed;
    padding-bottom: 30%;
  }

  .type-this div {
    -webkit-box-flex: 33.3333333%;
    -ms-flex: 33.3333333%;
    flex: 33.3333333%;
    text-align: center;
    height: 3.3em;
    margin-bottom: 1em;
  }

  .type-this div > div {
    margin: 5px 10px;
    width: 80%;
    /* padding: 10px 30px; */
    border: 1px solid #9999;
    border-radius: 4px;
    line-height: 3em;
  }
</style>
