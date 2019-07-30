<template>
  <yd-layout class="layout_my">
    <yd-navbar class="header" slot="navbar" title="工作例报" color="#fff" :bgcolor="mainColor" height=".88rem">
      <router-link :to="'/my/manager'" slot="left"><!--url[url.length-1]-->
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </router-link>
      <div slot="right" class="edit" style="color: #fff;">
        <router-link :to="'/estate/add_work'">
          <img style="width: 1.3em" src="../../../../../assets/images/rent/my/add_new_job.png" alt="">
        </router-link>
      </div>
    </yd-navbar>
    <div class="search">
      <div>
        <i><img src="../../../../../assets/images/rent/my/search.png" alt=""></i>
        <span><input type="text" placeholder="请输入关键字或编码"></span>
      </div>
      <div @click="clickShowSearch">筛选</div>
    </div>
    <div class="black-bg" v-if="showSearch"></div>
    <div class="repair-search" v-if="showSearch">
      <div class="repair-search-div">起止时间<br>
        <div class="absolute-time absolute-time-left">{{data.startDate}}</div>
        <div class="absolute-time-center"></div>
        <div class="absolute-time absolute-time-right">{{data.endDate}}</div>
        <div style="width:100%;display: flex;opacity: 0">
          <div style="flex: 1">
            <yd-cell-item arrow>
              <yd-datetime type="date" v-model="data.startDate" slot="right"></yd-datetime>
            </yd-cell-item>
          </div>
          <div style="flex: 1;opacity: 0">
            <yd-cell-item arrow>
              <yd-datetime type="date" v-model="data.endDate" slot="right"></yd-datetime>
            </yd-cell-item>
          </div>
        </div>
      </div>
      <div class="repair-search-div" style="margin-top: 1em">状态<br>
        <div class="div-flex">
          <div v-for="item,index in qsStatus">
            <div style="width: 100%">
              <span class="status-item" v-bind:class="getStatus-1==index?'status-active':''" @click="selectStatus(index)">{{item}}</span></div></div>
        </div>
      </div>
      <div class="div-flex" style="margin-top: 1em">
        <div class="text-center select-bottom-btn" @click="cancel">取消</div>
        <div class="text-center select-bottom-btn select-bottom-btn-right" @click="getSearch">确定</div>
      </div>
    </div>
    <div class="select-tab">
      <div @click="select('全部')" v-bind:class="selectTab=='全部'?'select-tab-active':''">全部</div>
      <div @click="select('未阅')" v-bind:class="selectTab=='未阅'?'select-tab-active':''">未阅</div>
      <div @click="select('已阅')" v-bind:class="selectTab=='已阅'?'select-tab-active':''">已阅</div>
    </div>
    <div v-infinite-scroll="loadList" infinite-scroll-disabled="busy" infinite-scroll-distance="0"
         infinite-scroll-immediate-check="false" style="background: #f5f5f5;padding-top: 1.3em">
      <div class="item-model" v-for="item, index in arr" v-bind:class="index==0?'top-line':''"
           @click="showDel(index,item.content)">
        <div class="show-send-pic list-item-first">
          <div style="text-align: left">{{item.guid}}</div>
          <div style="text-align: center" v-if="item.type*1==1">日报</div>
          <div style="text-align: center" v-if="item.type*1==2">周报</div>
          <div style="text-align: center" v-if="item.type*1==3">月报</div>
        </div>
        <div class="show-send-pic show-list-center">
          <div style="text-align: left">{{item.summarize}}</div>
          <div style="text-align: center"></div>
          <div style="text-align: right" v-if="item.status*1==1">未阅</div>
          <div style="text-align: right" v-if="item.status*1==2">已阅</div>
          <div style="text-align: right" v-if="item.type*1==3">不同意</div>
          <div style="text-align: right" v-if="item.type*1==4">关闭</div>
        </div>
        <div class="show-send-pic show-list-last">
          <div style="text-align: left">{{item.deptId}}</div>
          <div style="text-align: center">{{item.userId}}</div>
          <div style="text-align: right">{{item.reportTime.split(' ')[0]}}</div>
        </div>
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
        hasMessage: {
          count: 99,
          new: true,
        },
        isShowDel: '',
        showErr: true,
        page: 1,
        url: this.fromRoute ? this.fromRoute : '',
        userInfo: "",
        mainColor: "",
        invide_code: "",
        selectTab:'全部',
        showSearch:false,
        getStatus:0,
        data: {
          startDate: '',
          endDate: ''
        },
        qsStatus: [
          '日报', '周报', '月报'
        ],
      }
    },
    directives: {InfiniteScroll},
    methods: {
      selectStatus(num){
        this.getStatus=num+1
      },
      cancel() {
        this.showSearch = false
        this.thisType = ''
      },
      finished() {
        this.show1 = false;
        for (var i = 0; i < this.qsTypes.length; i++) {
          if (this.qsTypes[i].dictDataName == this.thisType) {
            this.data.typeId = this.qsTypes[i].guid;
          }
        }
      },
      clickShowSearch(){
        this.showSearch=this.showSearch?false:true
      },
      /*搜索提交*/
//      submitHandler() {
//
//      },
      /*搜索历史点击*/
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
      getSearch() {
        this.showSearch=false;
        this.data.userId = this.userId;
        this.data.token = this.getkey;
        if(this.getStatus!=0){
          this.data.status = this.getStatus;
        }
        this.data.pageNo = 1;
        this.data.pageSize = 15;
        if (this.data.startDate == '请选择') {
          this.data.startDate = ''
        }
        if (this.data.endDate == '请选择') {
          this.data.endDate = ''
        }
        delete this.data.endDate;
        var data = {organId: this.organInfo.guid, token: this.getkey, pageNo: 1, pageSeze: 15};
        this.xhr.post(`${this.subUrl.activity}/workbench/workReport/myReport/getWorkReport?` + qs.stringify(this.data)).then((res) => {
          if (res.data.code == 1) {
            if (res.data.data.list.length > 0) {
              this.arr = [...res.data.data.list, ...this.arr]
              this.orderList.push(...res.data.data.list);
              this.data.endDate = ''
              for (var i = 0; i < this.orderList.length; i++) {
                for (var j = 0; j < this.qsTypes.length; j++) {
                  if (this.orderList[i].maintainId * 1 == this.qsTypes[j].guid * 1) {
                    this.orderList[i].typeName = this.qsTypes[j].dictDataName
                    this.orderList[i].select = false
                  }
                }
              }
            }
//            cb && cb();
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            // fn.re_login(this);
          } else {
//            this.$dialog.toast({mes: res.data.msg});
          }
        })
      },
      itemClickHandler() {
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
        this.xhr.post(`${this.subUrl.activity}/pasa/applyList?token=` + this.getkey + '&keyword=' + `${value}` +'&pageNo=' + this.page + '&pageSize=10').then((res) => {
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
      getAllArr() {
        var data = {token: this.getkey, organId: this.organInfo.guid};
        // {params: {type: 'pulldown', page: this.page}
        this.xhr.post(`${this.subUrl.activity}/workbench/workReport/myReport/getWorkReport?`+qs.stringify(data)).then((res) => {
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
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
      },
      singleArr(type) {
        var data = {token: this.getkey, organId: this.organInfo.guid};
        if(type!='全部'){
          data.status=type
        }
        // {params: {type: 'pulldown', page: this.page}
        this.xhr.post(`${this.subUrl.activity}/workbench/workReport/myReport/getWorkReport?`+qs.stringify(data)).then((res) => {
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
      this.mainColor = this.$color[this.userInfo.organType]
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
  .list-item-first{
    background: rgb(250, 250, 250);
    margin: -0.7em -1em;
    margin-bottom: 0;
    padding: 0.5em 1em;
    border-bottom: 1px dashed #e6e6e6
  }

  .item-model {
    font-size: 15px;
    padding: 0 15px 5px;
    color: #333;
    width: 100%;
    padding-top: 10px;
    position: relative;
    background: white;
    border-bottom: 1px solid #e6e6e6;
    -webkit-transition: 0.2s;
    transition: 0.2s;
    margin-bottom: 0.8em;
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
    display: flex;margin-top: 1em;
  }

  .select-tab div {
    width: 33.3%;
    text-align: center;
    background: #ffffff;
    line-height: 3em;
    border-bottom: 1px solid #E6E6E6;
  }

  .select-tab-active {
    color: #5881FF;
    border-bottom: 2px solid #5881ff !important;
  }

  .show-send-pic{
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    font-size: 13px;
    color: #6b6b6b;
  }

  .show-send-pic div{
    width: 33%;
  }
  .show-list-center{
    line-height: 2em;
    font-size: 16px;
    color: #333333;
  }

  .show-list-last{
    line-height: 1.8em;
    font-size: 12px;
    color: #999999;
  }

  .search > div:nth-child(1) {
    flex: 1;
    background: #EBEBED;
    border-radius: .6rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .search > div:nth-child(1) > i {
    width: .35rem;
    height: .35rem;
    margin-right: .1rem;
  }

  .search > div:nth-child(1) > i > img {
    width: 100%;
    height: 100%;
  }

  .search > div:nth-child(1) > span {
    width: 2.4rem;
  }

  .search > div:nth-child(1) > span > input {
    width: 100%;
    font-size: .24rem;
    color: #A2A1A6;
    border: none;
  }

  .search > div:nth-child(2) {
    width: 1.6rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .search {
    width: 100%;
    height: .85rem;
    background: white;
    display: flex;
    flex-flow: row;
    padding: .15rem .3rem;
  }
  .repair-search{position: fixed;background: #f6f6f6;width: 100%;top: 6.3em;z-index: 99}
  .repair-search-div{padding: 0 1em;line-height: 2.3em;position: relative}
  .absolute-time{
    position: absolute;
    width: 40%;
    background: #fff;
    line-height: 3em;
    padding-left: 0.8em;
    height: 3em;
  }
  .absolute-time-left{
    left:4%
  }
  .absolute-time-right{
    right:4%
  }
  .absolute-time-center{
    position: absolute;
    width: 1.8em;
    top: 80%;
    left: 50%;
    margin-left: -0.9em;
    background: #999999;
    height: 2px;
  }
  .div-flex div{
    flex: 33.3%;
    height: 3em;
  }
  .status-item{
    border: 1px solid #cccccc;
    color: #999999;
    padding: 0.5em 1.5em;
    border-radius: 2px;
    background: #ffffff;
  }
  .status-active{
    border: 1px solid #5881ff!important;
    color: #5881ff;
  }
  .div-flex{
    display: flex;
    flex-wrap: wrap;
  }
  .select-bottom-btn{
    background: #fff;
    border: 1px solid #cccccc;
    border-left: none;
    line-height: 3em;
  }
  .black-bg {
    position: fixed;
    background: black;
    opacity: 0.3;
    width: 100%;
    top: 6.3em;
    height: 100%;
  }
  /*消息列表结束*/
</style>
