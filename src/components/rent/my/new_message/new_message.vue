<template>
  <yd-layout class="layout_my">
    <yd-navbar class="header" slot="navbar" v-show="!userAgent.isWX" v-title="'最新消息'" title="最新消息" color="#fff" :bgcolor="mainColor" height=".88rem">
      <a @click="back" slot="left"><!--url[url.length-1]-->
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </a>
      <div slot="right" class="edit" style="color: #fff;" @click="emptyMessage('/my/change_manager')">清空</div>
    </yd-navbar>
    <yd-search class="search" :result="result" fullpage v-model="value2" :item-click="itemClickHandler"
               :on-submit="submitHandler"></yd-search>
    <div class="select-tab">
      <div @click="select(0)" v-bind:class="selectTab==0?'select-tab-active':''">全部</div>
      <div @click="select(1)" v-bind:class="selectTab==1?'select-tab-active':''">系统消息</div>
      <div @click="select(2)" v-bind:class="selectTab==2?'select-tab-active':''">加入消息</div>
    </div>
    <div v-infinite-scroll="loadList" infinite-scroll-disabled="busy" infinite-scroll-distance="0"
         infinite-scroll-immediate-check="false" style="background: #f5f5f5;padding-top: 1.3em">
      <div class="item-model" v-for="item, index in arr" v-bind:class="index==0?'top-line':''"
           @click="showDel(index,item.content)"
           v-bind:style="index==indexShowDel&&isShowDel==item.content?'margin-left:-22%':''">
                    <span class="pull-left">
                    <img v-if="item.type*1==1" slot="img"
                         src="../../../../assets/images/rent/my/admin/call-sys-msg.png">
                      <img v-if="item.type*1==2" slot="img"
                           src="../../../../assets/images/rent/my/admin/call-more-msg.png">
                    <span v-if="item.type*1==1">系统消息</span><span v-if="item.type*1==2">加入消息</span><br><span
                      class="left-span">{{item.content}}</span></span>
        <div class="hid-del" @click="delThisMsg(index,item.guid)">删除</div>
        <span
          class="pull-right">{{item.createDate.split(' ')[0]}}<br><span>{{item.createDate.split(' ')[1]}}</span></span>
      </div>
    </div>
    <div style="text-align: center;line-height: 3em;width: 100%" v-if="showErr">
      没有数据了~
    </div>
  </yd-layout>
</template>
<script>
  import fn from '@/assets/js/product'
  import qs from 'qs'
  import Vue from 'vue'
  import {Tab, TabPanel} from 'vue-ydui/dist/lib.rem/tab';
  import InfiniteScroll from 'vue-infinite-scroll';

  Vue.component(Tab.name, Tab);
  Vue.component(TabPanel.name, TabPanel);

  export default {
    data() {
      return {
        result: [],
        organInfo: "",
        value2: "",
        arr: [],
        indexShowDel: 0,
        type: 0,
        selectTab: 0,
        hasMessage: {
          count: 99,
          new: true,
        },
        isShowDel: '',
        showErr: true,
        page: 1,
        busy:false,
        url: this.fromRoute ? this.fromRoute : '',
        userInfo: "",
        mainColor: "",
        invide_code: "",
      }
    },
    directives: {InfiniteScroll},
    methods: {
      /*搜索提交*/
//      submitHandler() {
//
//      },
      /*搜索历史点击*/
      back(){
        this.$router.go(-1)
      },
      showDel(index, content) {
        if(this.indexShowDel == index&& this.isShowDel == content){
          this.isShowDel = '';
        }else{
          this.indexShowDel = index;
          if (this.isShowDel != '' && this.isShowDel == content) {
            this.isShowDel = '';
          }
          if (this.isShowDel == content) {
            this.isShowDel = '';
          } else {
            this.isShowDel = content
          }
        }
      },
      delThisMsg(index,guid){
        var data = {token: this.getkey, organId: this.organInfo.guid};
        // {params: {type: 'pulldown', page: this.page}
        this.xhr.post(`${this.subUrl.admin}/latestNews/delOrganNews?token=` + this.getkey + '&newsId=' + guid).then((res) => {
          if (res.data.code == 1) {
            this.arr.splice(this.arr[index],1)
            var arr=this.arr;
            this.arr=[];
            this.arr=arr;
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
      },
      itemClickHandler() {
      },
      emptyMessage(url) {
        this.$dialog.confirm({
          mes: '清空所有消息',
          opts: [
            {
              txt: '取消',
              color: false,
              callback: () => {
                this.$dialog.toast({mes: '你点了取消', timeout: 1000});
              }
            },
            {
              txt: '确定',
              color: true,
              callback: () => {
                this.$dialog.toast({mes: '已清空所有消息', timeout: 1000});
                this.arr=[];
                var data = {token: this.getkey, organId: this.organInfo.guid};
                // {params: {type: 'pulldown', page: this.page}
                this.xhr.post(`${this.subUrl.admin}/latestNews/emptyOrganNews?token=` + this.getkey + '&organId=' + this.organInfo.guid).then((res) => {
                  if (res.data.code == 1) {
                    this.arr=[];
                  } else if (res.data.code == '-902') {//-902
                    /*重新登录*/
                    fn.re_login(this);
                  } else {
                    this.$dialog.toast({mes: res.data.msg});
                  }
                })
              }
            }
          ]
        })
      },
      /*获取最新消息*/
      loadList() {
        this.getAllArr();
      },
      select(type) {
        this.arr = [];
        this.selectTab = type;
        this.page = 1;
        if (type == 0) {
          this.loadList();
        } else {
          this.singleArr(type)
        }
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
            if(res.data.data.list.length<10){
              this.busy=true;
              this.showErr=true;
            }
            if (res.data.data.list.length == 0) {
              this.showErr = true;
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
      getAllArr() {
        var data = {token: this.getkey, organId: this.organInfo.guid};
        // {params: {type: 'pulldown', page: this.page}
        this.xhr.post(`${this.subUrl.admin}/latestNews/organNews?token=` + this.getkey + '&organId=' + this.organInfo.guid + '&pageNo=' + this.page + '&pageSize=10').then((res) => {
          if (res.data.code == 1) {
            this.arr = [...res.data.data.list, ...this.arr];
            if(res.data.data.list.length<10){
              this.busy=true;
              this.showErr=true
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
      singleArr(type) {
        var data = {token: this.getkey, organId: this.organInfo.guid};
        // {params: {type: 'pulldown', page: this.page}
        this.xhr.post(`${this.subUrl.admin}/latestNews/organNews?token=` + this.getkey + '&type=' + type + '&organId=' + this.organInfo.guid + '&pageNo=' + this.page + '&pageSize=10').then((res) => {
          if (res.data.code == 1) {
            this.arr = [...res.data.data.list, ...this.arr];
            if (this.arr.length == 0) {
              this.showErr = true;
            } else {
              this.showErr = false;
            }
            this.page++;
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            // fn.re_login(this);
          } else {
            // this.$dialog.toast({mes: res.data.msg});
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
            cb && cb();
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
      }
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
        that.loadList();
      });
    }
  }
</script>
<style scoped>
  .layout_my {
    background: #f7f7f9;
  }

  .layout_my .header:after {
    display: none;

  }

  .item-model {
    font-size: 15px;
    padding: 0 15px 5px;
    color: #333;
    width: 100%;
    height: 4.3em;
    padding-top: 10px;
    position: relative;
    background: white;
    border-bottom: 1px solid #E6E6E6;
    transition: 0.2s;
  }

  .hid-del {
    position: absolute;
    top: 0;
    right: -22%;
    width: 22%;
    height: 100%;
    line-height: 4.3em;
    color: #ffffff;
    background: red;
    text-align: center;
    float: right;
  }

  .pull-left {
    float: left;
    color: #999;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: inline-block;
    font-size: 12px;
  }

  .pull-left span {
    font-size: 15px;
    color: #333;
  }

  .pull-left img {
    float: left;
    width: 2.5em;
    height: 2.5em;
    margin-right: 1em;
    margin-top: 0.5em;
  }

  .top-line {
    border-top: 1px solid #E6E6E6;
  }

  .pull-right {
    float: right;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: inline-block;
    font-size: 12px;
    margin-top: 4px;
    color: #999;
  }

  .pull-right span {
    text-align: center;
    font-size: 12px;
    color: #999;
    line-height: 25px;
  }

  .left-span {
    font-size: 12px !important;
    color: rgb(153, 153, 153) !important;
    line-height: 25px;
  }

  .ul {
    margin-bottom: 2em;
  }

  .msg-top {
    width: 100%;
    height: 1.4em;
    background: aliceblue;
  }

  .select-tab {
    display: flex;
  }

  .select-tab div {
    flex: 1;
    text-align: center;
    background: #ffffff;
    line-height: 3em;
    border-bottom: 1px solid #E6E6E6;
  }

  .select-tab-active {
    color: #5881FF;
    border-bottom: 2px solid #5881ff !important;
  }

  /*消息列表结束*/
</style>
