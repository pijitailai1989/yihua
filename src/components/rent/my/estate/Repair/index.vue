<template>
  <!--<div>-->
    <yd-layout class="layout_my">
      <div v-if="showSearch">
        <div class="search-top">
          <img @click="cancelSearch" style="width: 1em;height: auto;float: left"
               src="../../../../../assets/images/rent/my/add_new_job.png"
               alt="">
          <input placeholder="输入查询内容" style="text-align: center" v-model="data.keyword" @keyup.enter="getSerch">
        </div>

        <div class="time-title"><img class="left-img" src="../../../../../assets/images/rent/my/add_new_job.png"
                                     alt="">时间
        </div>
        <div class="select-date-div">
          <span class="pull-left">开始时间:</span>
          <span class="pull-left show-this-date">{{data.startDate}}
          <img src="../../../../../assets/images/rent/my/add_new_job.png"
               alt="">
          <input v-model="data.startDate" class="date-select" type="date" placeholder="撒旦" name="user_date"/><br>
          </span><br>
        </div>
        <div class="select-date-div">
          <span class="pull-left">结束时间:</span>
          <span class="pull-left show-this-date">{{data.endDate}}
          <img src="../../../../../assets/images/rent/my/add_new_job.png"
               alt="">
          <input v-model="data.endDate" class="date-select" type="date" placeholder="撒旦" name="user_date"/><br>
          </span>
        </div>
        <div class="time-title">状态</div>
        <div class="type-this">
          <div v-for="(item,index) in qsStatus" :key="index" @click="searchStatus(item.guid)">
            <div>{{item}}</div>
          </div>
          <div v-if="qsStatus.length%3!=0"></div>
          <div v-if="qsStatus.length%3==1"></div>
        </div>
        <div class="time-title">分类</div>
        <div class="type-this">
          <div v-for="(item,index) in qsTypes" :key="index" @click="searchType(item.guid)">
            <div>{{item.dictDataName}}</div>
          </div>
          <div v-if="qsTypes.length%3!=0"></div>
          <div v-if="qsTypes.length%3==1"></div>
        </div>
      </div>


      <div v-if="!showSearch">
        <div class="black-bg" v-if="showTypes" @click="cancel"></div>
        <yd-navbar class="header" slot="navbar" title="报修处理" color="#fff" :bgcolor="mainColor" height=".88rem">
          <router-link :to="'/my/manager'" slot="left"><!--url[url.length-1]-->
            <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
          </router-link>
          <div slot="right" class="edit" style="color: #fff;">
            <a @click="toSearch">
              <img src="../../../../../assets/images/rent/my/add_new_job.png" alt="">
            </a>
            <router-link :to="'/estate/to_repair'">
              <img src="../../../../../assets/images/rent/my/add_new_job.png" alt="">
            </router-link>
          </div>
        </yd-navbar>
        <div class="list-filter">
          <div class="first-child" @click="selectShow(1)"
               v-bind:class="showTypes&&statusType==1?'select-type-status':''">全部类别
          </div>
          <div @click="selectShow(2)" v-bind:class="showTypes&&statusType==2?'select-type-status':''">全部状态</div>
        </div>
        <div class="type-this type-this-fix" v-if="showTypes&&statusType==1">
          <div v-for="(item,index) in qsTypes" :key="index" @click="getTypeList(item.guid)">
            <div>{{item.dictDataName}}</div>
          </div>
          <div v-if="qsTypes.length%3==1||qsTypes.length%3==2"></div>
          <div v-if="qsTypes.length%3==1"></div>
        </div>
        <div class="type-this type-this-fix" v-if="showTypes&&statusType==2">
          <div v-for="(item,index) in qsStatus" :key="index">
            <div>{{item}}</div>
          </div>
          <div v-if="qsStatus.length%3==1||qsTypes.length%3==2"></div>
          <div v-if="qsStatus.length%3==1"></div>
        </div>
      <div v-infinite-scroll="loadList" infinite-scroll-disabled="busy" infinite-scroll-distance="0"
           infinite-scroll-immediate-check="false" style="background: #f5f5f5;">
        <div class="order-msg" v-for="(item,index) in orderList">
          <div :key="index">
            <div class="list-content" style="">

              <span class="list-content-first"><router-link :to="'/estate/order_detail?guid='+item.guid">{{item.guid}}</router-link></span>
              <span><router-link :to="'/estate/order_detail?guid='+item.guid">{{item.typeName}}</router-link></span>
              <span class="pull-right">评价</span>
            </div>
            <router-link :to="'/estate/order_detail?guid='+item.guid">
            <div class="list-intro-top">
              <div class="this-list-question">{{item.remark}}<br>
                <span style="font-size: 13px;font-weight: 500;color: #999999">{{item.location}}</span>
              </div>
              <div class="this-list-question-status">处理中{{item.statusName}}</div>
            </div>
            <div class="list-bottom" style="display: flex;padding-bottom: 5px">
              <span class="list-bottom-first">{{item.userName}}</span>
              <span>15212345678</span>
              <span class="pull-right">{{item.createDate.split(' ')[0]}}</span>
            </div>
            </router-link>
          </div>
        </div>
      </div>
      <!--</div>-->
      </div>
    </yd-layout>
    <!--<p>-->
      <!--<input type="button" v-model="thisContent" id="bBtn" value="B" style="font-weight:bold" onclick="setBold();"/>-->
    <!--</p>-->
  <!--</div>-->
</template>
<script>
  import fn from '@/assets/js/product'
  import qs from 'qs'
  import InfiniteScroll from 'vue-infinite-scroll';

  export default {
    data() {
      return {
        organInfo: "",
        hasMessage: {
          count: 99,
          new: true,
        },
        qsTypes: [
          '断电', '漏水', '电灯', '打孔', '开锁', '照明', '马桶', '吊顶', '墙', '门'
        ],
        qsStatus: [
          '上报中', '处理中', '已分单', '已接单', '已完成', '已关闭'
        ],
        result: [],
        url: this.fromRoute ? this.fromRoute : '',
        userInfo: "",
        mainColor: "",
        showTypes: false,
        statusType: 1,
        data: {
          startDate: '请选择',
          endDate: '请选择'
        },
        page:1,
        orderList:[],
        thisContent:'',
        showSearch: false
      }
    },
    directives : {
      run (el, binding) {
        console.log()
      }
    },
    methods: {
      //设置选定的文本为粗体/正常
      loadList(){
        this.page++;
        this.getQuestionInfo();
      },
      searchType(guid) {
        this.data.typeId = guid;
        this.getSerch
      },
      searchStatus(status) {
        this.data.status = status
      },
      toSearch() {
        this.showSearch = true
      },
      cancelSearch() {
        this.showSearch = false
      },
      selectShow(num) {
        if (!this.showTypes) {
          this.showTypes = true;
          this.statusType = num;
        } else {
          if (this.statusType == num) {
            this.showTypes = false
          } else {
            this.statusType = num;
          }
        }
      },
      cancel() {
        this.showTypes = false
      },
      itemClickHandler() {
      },
      submitHandler(value) {
        this.arr = [];
        this.selectTab = 4;
        this.page = 1;
        this.$dialog.toast({mes: `搜索：${value}`});
        var data = {token: this.getkey, organId: this.organInfo.guid};
        data.page = this.page;
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
      getQuestionInfo(cb) {
        var data = {organId: this.organInfo.guid, token: this.getkey, pageNo: this.page, pageSeze: 3};
        this.xhr.post(`${this.subUrl.activity}/repairs/getRepairsList?token=` + data.token + '&userId=' + this.userId + '&pageNo='+this.page + '&pageSize=6').then((res) => {
          if (res.data.code == 1) {
            if(res.data.data.list.length>0){
              this.orderList.push(...res.data.data.list);
              for(var i=0;i<this.orderList.length;i++){
                for(var j=0;j<this.qsTypes.length;j++){
                  if(this.orderList[i].maintainId*1==this.qsTypes[j].guid*1){
                    this.orderList[i].typeName=this.qsTypes[j].dictDataName
                  }
                }
              }
            }
            cb && cb();
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            // fn.re_login(this);
          } else {
//            this.$dialog.toast({mes: res.data.msg});
          }
        })
      },
      getSerch() {
        this.data.userId = this.userId;
        this.data.token = this.getkey;
        this.data.pageNo = 1;
        this.data.pageSize = 15;
        if (this.data.startDate == '请选择') {
          this.data.startDate = ''
        }
        if (this.data.endDate == '请选择') {
          this.data.endDate = ''
        }
        var data = {organId: this.organInfo.guid, token: this.getkey, pageNo: 1, pageSeze: 15};
        this.xhr.post(`${this.subUrl.activity}/repairs/getRepairsList?` + qs.stringify(this.data)).then((res) => {
          if (res.data.code == 1) {
            this.cancelSearch()
//            cb && cb();
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            // fn.re_login(this);
          } else {
//            this.$dialog.toast({mes: res.data.msg});
          }
          this.cancelSearch()
        })
      },
      clearLoacl() {
        this.alertS = true;
      },
      quit() {
        this.alertS = false;
      },
      getTypeList(type) {
        var data = {userId: this.userId, token: this.getkey, pageNo: 1, pageSize: 15, typeId: type};
        this.xhr.post(`${this.subUrl.activity}/repairs/getRepairsList`, qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
      },
      getUserInfo() {
        var data = {userId: this.userId, token: this.getkey};

        this.xhr.post(`${this.subUrl.user}/user/getUserInfo`, qs.stringify(data)).then((res) => {

          if (res.data.code == 1) {
            this.userInfo = res.data.data.userInfo;
            this.organInfo = res.data.data.organInfo;

          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
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
      submit() {
        console.log(this.value1)
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
      that.getQuestionInfo();
      this.getType();
      this.getUserInfo(function () {
        that.getQuestionInfo();
        this.getType();
      });
    }
  }
</script>
<style scoped>
  .top_title {
    width: 100%;
    line-height: 0.8rem;
    font-size: 0.18rem;
    padding: 0 0.3rem;
  }

  .layout_my {
    background: #f7f7f9;
  }

  .layout_my .header:after {
    display: none;
  }

  .list-filter {
    display: flex;
    background: #ffffff;
    line-height: 1.5em;
    padding: 1em 0;
  }

  .list-filter div {
    flex: 1;
    text-align: center
  }

  .list-filter .first-child {
    border-right: 1px solid #e6e6e6;
  }

  .list-content {
    padding-left: 20px;
    border-bottom: 1px dashed #e6e6e6;
    display: flex;
    text-align: center;
    line-height: 2.5em
  }

  .list-content span {
    flex: 1;
  }

  .list-content-first {
    text-align: left;
  }

  .list-intro-top {
    position: relative;
    margin: 10px 0px;
  }

  .this-list-question {
    margin-left: 20px;
    font-weight: 600;
    font-size: 16px;
    color: rgb(68, 68, 68);
    line-height: 1.6em;
  }

  .this-list-question span {
    font-size: 13px;
    font-weight: 500;
    color: rgb(153, 153, 153);
  }

  .this-list-question-status {
    position: absolute;
    top: 0px;
    right: 20px;
    border: 1px solid red;
    font-size: 12px;
    color: red;
    padding: 2px 4px;
    border-radius: 3px;
  }

  .list-bottom {
    display: flex;
    padding-bottom: 5px;
  }

  .list-bottom span {
    flex: 1;
  }

  .list-bottom-first {
    flex: 1;
    text-align: left;
    padding-left: 20px;
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

  .black-bg {
    background: black;
    width: 100%;
    height: 100%;
    opacity: 0.3;
    position: fixed;
    top: 8em;
    z-index: 99;
  }

  .order-msg {
    width: 100%;
    background: #ffffff;
    margin-top: 1em
  }

  .select-type-status {
    color: #5881ff;
  }

  .pull-right {
    padding-right: 1.6em;
    text-align: right;
  }

  .search-top {
    background: #0093d2;
    text-align: center;
    line-height: 3.5em;
  }

  .search-top img {
    width: 1.3em;
    height: auto;
    float: left;
    margin: 1em;
  }

  .search-top input {
    width: 70%;
    color: #ffffff;
    font-size: 14px;
    line-height: 1.8em;
    border: 1px solid #ffffff;
    border-radius: 10px;
    background: #21a1d8;
    margin-left: -2em;
  }

  .search-top input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #fff;
    opacity: 1;
  }

  .search-top input::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #fff;
    opacity: 1;
  }

  .search-top input:-ms-input-placeholder {
    color: #fff;
    opacity: 1;
  }

  .search-top input::-webkit-input-placeholder {
    color: #fff;
    opacity: 1;
  }

  .pull-left {
    float: left;
  }

  .date-select {
    background: red;
    opacity: 0;
    position: absolute;
    right: 6px;
    top: 0px;
    height: 100%;
  }

  .show-this-date {
    background: rgb(230, 230, 230);
    float: left;
    color: #999999;
    text-align: right;
    width: 68%;
    line-height: 1em;
    height: 2.5em;
    font-size: 14px;
    padding: 0.8em;
    position: relative;
    margin-left: 1em;
    border-radius: 0.4em;
  }

  .show-this-date img {
    width: 1em;
    height: auto;
    float: right
  }

  .select-date-div {
    width: 100%;
    line-height: 2em;
    height: 4em;
    background: #ffffff;
    padding-top: 1em;
    padding-bottom: 1em;
    padding-left: 1.5em;
  }

  .left-img {
    margin-top: 0.4em;
    width: 1em;
    height: auto;
    float: left;
  }

  .time-title {
    padding-left: 1em;
    line-height: 2em;
  }
</style>
