<template>
  <yd-layout class="layout_my">
    <yd-navbar class="header" slot="navbar" :title="title" color="#fff" :bgcolor="mainColor" height=".88rem">
      <a @click="back" class="addClickArea" slot="left"><!--url[url.length-1]-->
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </a>
      <div slot="right" class="edit addRightClickArea" v-if="couldAdd" style="color: #fff;">
        <a @click="addList">
          <img style="width: 1.3em" src="../../../../assets/images/rent/my/add_new_job.png" alt="">
        </a>
      </div>
    </yd-navbar>
    <div class="search" v-if="showTop">
      <div>
        <i><img src="../../../../assets/images/rent/my/search.png" alt=""></i>
        <span><input type="text" placeholder="请输入关键字或编码"></span>
      </div>
      <div @click="clickShowSearch">筛选</div>
    </div>
    <br v-if="false">
    <div class="black-bg" v-if="showSearch"></div>
    <div class="repair-search" v-if="showSearch">
      <div class="repair-search-div">起止时间<br>
        <div class="absolute-time absolute-time-left">{{startDate}}</div>
        <div class="absolute-time-center"></div>
        <div class="absolute-time absolute-time-right">{{endDate}}</div>
        <div style="width:100%;display: flex;opacity: 0">
          <div style="flex: 1">
            <yd-cell-item arrow>
              <yd-datetime  start-date="2010-01-01 15:13" end-date="2022-12-12" type="date" v-model="startDate" slot="right"></yd-datetime>
            </yd-cell-item>
          </div>
          <div style="flex: 1;opacity: 0">
            <yd-cell-item arrow>
              <yd-datetime start-date="2010-01-01 15:13" end-date="2022-12-12" type="date" v-model="endDate" slot="right"></yd-datetime>
            </yd-cell-item>
          </div>
        </div>
      </div>
      <div class="repair-search-div">类型<br>
        <div @click="showSelectType" class="repair-btn">
          <span v-if="thisType">{{thisType}}</span><span v-if="!thisType||thisType==''">请选择</span></div>
      </div>
      <div class="repair-search-div">状态<br>
        <div class="div-flex">
          <div v-for="item,index in qsStatus" @click="selectStatus(index)">
            <div style="width: 100%">
              <span class="status-item" v-bind:class="getStatus-1==index?'status-active':''"
                   >{{item}}</span></div>
          </div>
        </div>
      </div>
      <div class="div-flex" style="margin-top: 1em">
        <div class="text-center select-bottom-btn" @click="cancel">取消</div>
        <div class="text-center select-bottom-btn select-bottom-btn-right" @click="getSearch">确定</div>
      </div>
    </div>
    <div class="select-tab" v-if="showTab">
      <div @click="select(index)" v-bind:class="selectTab==index?'select-tab-active':''" v-for="item,index in tabs">{{item}}</div>

    </div>
    <div class="black-bg" v-if="showSelectTab">
    </div>
    <div class="select-tab-top" v-if="showSelectTab">
      <div><span>采购</span></div>
      <div><span>供应</span></div>
      <div><span>招标</span></div>
    </div>
    <div class="birthplace" v-if="show1">
      <ul>
        <li>
          <a class="font30 font600" :style="{color:mainColor}" @click="cancel1">取消</a>
          <a class="font30 font600"></a>
          <a class="font30 font600" :style="{color:mainColor}" @click="finished">完成</a>
        </li>
        <li>
          <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
        </li>
      </ul>
    </div>
    <div v-infinite-scroll="loadList" infinite-scroll-disabled="busy" infinite-scroll-distance="0"
         infinite-scroll-immediate-check="false" style="background: #f5f5f5;padding-top: 1.3em">
      <div class="item-model" v-for="item, index in arr" v-bind:class="index==0?'top-line':''"
           @click="showDel(index,item.content)">
        <a @click="toItemDetail(item.guid)"><!--url[url.length-1]-->
          <div class="show-send-pic list-item-first">
            <div style="text-align: left">{{item.oneLeft}}</div>
            <div style="text-align: center">{{item.oneCenter}}</div>
            <div style="text-align: right">{{item.oneRight}}</div>
          </div>
          <img class="pull-left" src="../../../../assets/images/rent/my/search.png" alt="">
          <div style="display: inline-block;width: 87%">
            <div class="show-send-pic show-list-center">
              <div style="text-align: left;flex: 70%">{{item.two}}</div>
              <!--<div></div>-->
              <div style="text-align: right;flex: 30%"><span class="status-spam">{{item.twoStatus}}</span></div>
              <!--<div style="text-align: right" v-if="item.status*1==1">待审批</div>-->
              <!--<div style="text-align: right" v-if="item.status*1==2">同意</div>-->
              <!--<div style="text-align: right" v-if="item.status*1==3">不同意</div>-->
              <!--<div style="text-align: right" v-if="item.status*1==4">关闭</div>-->
            </div>
            <div class="show-send-pic show-list-last">
              <div style="text-align: left">{{item.threeLeft}}</div>
              <div style="text-align: center">{{item.threeCenter}}</div>
              <div style="text-align: right">{{item.threeRight}}</div>
            </div>
          </div>
        </a>
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
  import '@/assets/css/manager.css'

  Vue.component(Tab.name, Tab);
  Vue.component(TabPanel.name, TabPanel);

  export default {
    data() {
      return {
        result: [],
        organInfo: "",
        value2: "",
        tabs:['全部','待审批','同意','拒绝'],
        slots: [
          {
            flex: 1,
            values: [],
            className: 'slot2',
          },
        ],
        arr: [
          {
            oneLeft: '工程部', oneCenter: '供应', oneRight: '12132131',
            two: '中央空调', twoStatus: '待审批',
            threeLeft: '行政部', threeCenter: '张三', threeRight: '2017-10-10'
          }, {
            oneLeft: '工程部', oneCenter: '供应', oneRight: '12132131',
            two: '中央空调', twoStatus: '待审批',
            threeLeft: '行政部', threeCenter: '张三', threeRight: '2017-10-10'
          }, {
            oneLeft: '工程部', oneCenter: '供应', oneRight: '12132131',
            two: '中央空调', twoStatus: '待审批',
            threeLeft: '行政部', threeCenter: '张三', threeRight: '2017-10-10'
          }
        ],
        route:'',
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
        url: this.fromRoute ? this.fromRoute : '',
        userInfo: "",
        mainColor: "",
        invide_code: "",
        showSelectTab: false,
        data: {
          pageNo:1,
        },
        startDate: '2010-01-01',
        endDate: '2022-12-12',
        qsStatus: [
          '待批', '同意', '不同意', '关闭'
        ],
        thisType:'',
        showSearch: false,
        getStatus: 0,
        show1:false,
        busy:false,
        reqUrl:'',
        title:'',
        showTop:true,
        showTab:true,
        couldAdd:true
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
      clickShowSearch() {
        this.showSearch = this.showSearch ? false : true
      },
      selectStatus(num) {
        this.getStatus = num + 1
      },
      showDel(index, content) {
        if (this.indexShowDel == index && this.isShowDel == content) {
          this.isShowDel = '';
        } else {
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
      getType() {
        var data = {userId: this.userId, token: this.getkey, pageNo: 1, pageSeze: 15};
        this.xhr.post(`${this.subUrl.user}/comm/getMt`).then((res) => {
          if (res.data.code == 1) {
            this.qsTypes = res.data.data;
            this.slots[0].values = [];
            for (var i = 0; i < this.qsTypes.length; i++) {
              this.slots[0].values.push(this.qsTypes[i].dictDataName)
            }
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
      },
      getSearch() {
        this.arr=[];
        this.busy = false
        this.showSearch = false;
        if (this.getStatus != 0) {
          this.data.status = this.getStatus;
        }
        this.data.pageNo = 1;
        if (this.startDate == '请选择') {
          this.data.startDate = ''
        }else{
          this.data.startDate = this.startDate+' 00:00:00'
        }
        if (this.endDate == '请选择') {
          this.data.endDate = ''
        }else{
          this.data.endDate = this.endDate +' 00:00:00'
        }
        this.getAllArr();
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
      showSelectType() {
        this.show1 = this.show1?false:true;
      },
      delThisMsg(index, guid) {
        var data = {token: this.getkey, organId: this.organInfo.guid};
        // {params: {type: 'pulldown', page: this.page}
        this.xhr.post(`${this.subUrl.admin}/latestNews/delOrganNews?token=` + this.getkey + '&newsId=' + guid).then((res) => {
          if (res.data.code == 1) {
            this.arr.splice(this.arr[index], 1)
            var arr = this.arr;
            this.arr = [];
            this.arr = arr;
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
      /*获取最新消息*/
      loadList() {
        this.getAllArr();
        this.data.pageNo++;
      },
      addList(){
        switch (this.route){
          case 'complain':
                this.$router.push('/estate/serviceList/add_complain');
                break;
          case 'settled':
            this.$router.push('/estate/serviceList/settle_detail');
            break;
        }
      },
      toItemDetail(guid){
        switch (this.route) {
          case 'complain':
            this.$router.push('/estate/serviceList/complain_detail?guid=' + guid);break;
          case 'settled':
            this.$router.push('/estate/serviceList/settle_detail?guid=' + guid);break;
        }
      },
      select(type) {
        this.arr = [];
        this.busy = false;
        this.selectTab = type;
        console.log(type)
        if(type!=0){
          this.data.status=type;
        }else{
          delete this.data.status
        }
        this.data.pageNo=1;
        this.loadList();
      },
//  {
//    oneLeft: '工程部', oneCenter: '供应', oneRight: '单号：12132131',
//    two: '中央空调微信', twoStatus: '待审批',
//    threeLeft: '行政部', threeCenter: '张三', threeRight: '2017-10-10'
//  }
      dataToShow(data){
        for(var i=0;i<data.length;i++){
          var item={}
          switch (this.route){
            case 'model':
              item.guid=data[i].guid
              item.oneLeft=data[i].typeName;
//          item.oneCenter=data[i].oneLeft=data.guid;
              item.oneRight=data[i].guid;
              item.two=data[i].remark;
              item.twoStatus=data[i].status;
              item.threeLeft=data[i].createDate;
              item.threeCenter='';
              item.threeRight='';
              break;
            case 'complain':
              item.guid=data[i].guid
              item.oneLeft=data[i].commentType;
//          item.oneCenter=data[i].oneLeft=data.guid;
              item.oneRight=data[i].guid;
              item.two=data[i].detailContent;
              item.twoStatus=data[i].status;
              item.threeLeft='';
              item.threeCenter='';
              item.threeRight=data[i].createDate.split(' ')[0];
              break;
            case 'settled':
//              item.oneLeft=data[i].guid ;
              item.guid=data[i].contractNo
              item.oneCenter=data[i].oneLeft=data.guid;
              item.oneRight=data[i].contractNo ;
              item.two=data[i].detailContent;
//              item.twoStatus=data[i].status;
              switch (data[i].status*1){
                case 1:
                  item.twoStatus='完成';
                  break;
                case 2:
                  item.twoStatus='待抄表';
                  break;
                case 3:
                  item.twoStatus='已抄表';
                  break;
              }
              item.threeLeft=data[i].contactName ;
              item.threeCenter='';
              item.threeRight=data[i].startTime.split(' ')[0] ;
          }

          this.arr.push(item)
        }
        if (this.arr.length == 0) {
          this.showErr = true;
        } else {
          this.showErr = false;
        }
      },
      getAllArr() {
        // {params: {type: 'pulldown', page: this.page}
        this.xhr.post(`${this.subUrl.activity}`+this.reqUrl + qs.stringify(this.data)).then((res) => {
          if (res.data.code == 1) {
            this.dataToShow(res.data.data.list);
            if(res.data.data.list.length<6){
              this.busy = true;
            }
//            this.busy = true;
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
      },
//      singleArr(type) {
//        var data = {token: this.getkey, organId: this.organInfo.guid};
//        // {params: {type: 'pulldown', page: this.page}
//        this.xhr.post(`${this.subUrl.activity}/pasa/applyList?token=` + this.getkey + '&status=' + type + '&pageNo=' + this.page + '&pageSize=10').then((res) => {
//          if (res.data.code == 1) {
//            this.arr = [...res.data.data.list, ...this.arr];
//            if (this.arr.length == 0) {
//              this.showErr = true;
//            } else {
//              this.showErr = false;
//            }
//            data.page++;
//          } else if (res.data.code == '-902') {//-902
//            /*重新登录*/
//            // fn.re_login(this);
//          } else {
//            // this.$dialog.toast({mes: res.data.msg});
//          }
//        })
//      },
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
      },
      onValuesChange(picker, values) {
        this.thisType = values[0];
        var data = this.data;
        this.data = {}
        this.data = data;
      },
      cancel1() {
        this.show1 = false
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
    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = this.$color[this.userInfo.organType];
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      this.userId = this.userInfo.guid;
      this.data.token=this.getkey;
      this.data.userId=this.userId ;
      this.route=this.$route.path.split('/')[this.$route.path.split('/').length-1];
      switch (this.route){

//        startDate: '',
//          endDate: ''
        case 'model':
          this.reqUrl='/repairs/getRepairsList?';
          this.data.userId = this.userId;
          this.data.token = this.getkey;break;
        case 'purchase':
          this.reqUrl='/pasa/applyList?';break;
        case 'work_report':
          this.reqUrl='/workbench/workReport/myReport/getWorkReport';
          this.data.pageSize=6;break;
        case 'complain':
          this.title='投诉建议';
          this.showTab=false;
          this.reqUrl='/complaint/listComplaint?';
          this.data.organId=this.organInfo.guid;
          this.data.organType=this.organInfo.organType;
          this.data.pageSize=6;
          break
        case 'settled':
          this.showTop=false;
          this.showTab=false;
          this.title='入驻';
          this.couldAdd=false;
          this.reqUrl='/caa/getRectificationList?';
          this.data.organId=this.organInfo.guid;
          this.data.organType=this.organInfo.organType;
          this.data.pageSize=6;
          break
      }
      this.getType();
      var that = this;
      this.getUserInfo(function () {
        delete that.data.startDate;
        delete that.data.endDate
        that.loadList();
      });
    }
  }
</script>
<style scoped>
  .status-spam{
    font-size: 12px;
    border: 1px solid #5881ff;
    color: #5881ff;
  }
  .layout_my {
    background: #f7f7f9;
  }

  .layout_my .header:after {
    display: none;

  }

  .list-item-first {
    background: #fff;
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
    border-bottom: 1px solid #E6E6E6;
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
    width: 25%;
    text-align: center;
    background: #ffffff;
    line-height: 3em;
    border-bottom: 1px solid #E6E6E6;
  }

  .select-tab-active {
    color: #5881FF;
    border-bottom: 2px solid #5881ff !important;
  }

  .show-send-pic {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    font-size: 12px;
  }

  .show-send-pic div {
    width: 33%;
  }

  .right-select-by {
    border-left: 1px solid #e6e6e6;
    width: 18%;
  }

  .show-list-center {
    line-height: 2em;
    font-size: 16px;
    color: #333333;
  }

  .show-list-last {
    line-height: 1.8em;
    font-size: 12px;
    color: #999999;
  }

  .black-bg {
    width: 100%;
    height: 100%;
    background: black;
    opacity: 0.3;
    position: fixed;
    top: 6.3em;
    z-index: 99;
  }

  .select-tab-top {
    display: flex;
    background: rgb(255, 255, 255);
    padding-bottom: 4em;
    position: fixed;
    top: 6.3em;
    width: 100%;
    z-index: 99;
    padding-top: 1em;
  }

  .select-tab-top div {
    text-align: center;
    line-height: 3em;
    width: 33.3%;
    z-index: 99;
  }

  .select-tab-top div > span {
    border: 1px solid #e6e6e6;
    border-radius: 3px;
    padding: 0.5em 3em;
  }

  .div-flex {
    display: flex;
    flex-wrap: wrap;
  }

  .select-bottom-btn {
    background: #fff;
    border: 1px solid #cccccc;
    border-left: none;
    line-height: 3em;
  }

  .search {
    width: 100%;
    height: .85rem;
    background: white;
    display: flex;
    flex-flow: row;
    padding: .15rem .3rem;
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

  .black-bg {
    position: fixed;
    background: black;
    opacity: 0.3;
    width: 100%;
    top: 6.3em;
    height: 100%
  }

  .repair-search {
    position: fixed;
    background: #f6f6f6;
    width: 100%;
    top: 6.3em;
    z-index: 99
  }

  .repair-search-div {
    padding: 0 1em;
    line-height: 2.3em;
    position: relative
  }

  .absolute-time {
    position: absolute;
    width: 40%;
    background: #fff;
    line-height: 3em;
    padding-left: 0.8em;
    height: 3em;
  }

  .absolute-time-left {
    left: 4%
  }

  .absolute-time-right {
    right: 4%
  }

  .absolute-time-center {
    position: absolute;
    width: 1.8em;
    top: 60%;
    left: 50%;
    margin-left: -0.9em;
    background: #999999;
    height: 2px;
  }

  .div-flex div {
    flex: 33.3%;
    height: 3em;
  }

  .status-item {
    border: 1px solid #cccccc;
    color: #999999;
    padding: 0.5em 1.5em;
    border-radius: 2px;
    background: #ffffff;
  }

  .status-active {
    border: 1px solid #5881ff !important;
    color: #5881ff!important;
  }
  .repair-search-div {
    padding: 0 1em;
    line-height: 2.3em;
    min-height: 6em;
    position: relative;
  }
  .repair-btn{
    background: #fff;
    line-height: 3em;
    padding: 0 0.5em;
    margin: 0 0.3em;
  }
  .birthplace {
    width: 100vw;
    height: 50%;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 999;
  }

  .birthplace ul {
    width: 100%;
    height: 4.5rem;
    background: white;
    position: absolute;
    bottom: 0;
    left: 0;
  }

  .birthplace ul li:nth-child(1) {
    width: 100%;
    height: .9rem;
    background: #F0F0F0;
    display: flex;
    flex-flow: row;
  }

  .div-flex div{
    flex: 1 1 33.3%;
    height: 3em;
  }
  .status-item{
    border: 1px solid #cccccc;
    color: #999999;
    padding: 0.5em 1.5em;
    border-radius: 2px;
    background: #ffffff;
  }
  .birthplace ul li:nth-child(1) > a {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .birthplace ul li:nth-child(1) > a:nth-child(1) {
    width: 18%;
    height: 100%;
  }

  .birthplace ul li:nth-child(1) > a:nth-child(2) {
    flex: 1;
    height: 100%;
  }

  .birthplace ul li:nth-child(1) > a:nth-child(3) {
    width: 18%;
    height: 100%;
  }

  .birthplace ul li:nth-child(2) {
    width: 100%;
    background: #E4EAE8;
  }
</style>
