<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" v-title="'我的供应商'" title="我的供应商"
               :bgcolor="mainColor" color="#fff">
      <span class="addClickArea" slot="left" @click="back" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
      <span class="addClickArea" v-show="!(type=='yb')" @click="turnTo('/supply/purchase/blacklist#1')" slot="right"
            style="color:#fff">黑名单</span>
    </yd-navbar>
    <div class="search">
      <ul>
        <li @click="toggle"><span style="color:#999;margin-right:.1rem;">全部</span>
          <yd-icon name='toDown' size='.2rem' custom color="#999"></yd-icon>
        </li>
        <li>
          <yd-search placeholder="输入搜索关键词" v-model="value" :on-submit="submitHandler"></yd-search>
        </li>
      </ul>
      <div v-show="show1" class="screen">
        <ul>
          <li @click="toggle(4)"><p>金牌供应商</p></li>
          <li @click="toggle(3)"><p>高级供应商</p></li>
          <li @click="toggle(2)"><p>中级供应商</p></li>
          <li @click="toggle(1)"><p>基础供应商</p></li>
        </ul>
      </div>
    </div>

    <div class="lists" @scroll="scrollHandler" ref="listDom">
      <ul class="libList" v-for="(item,index) in libraryList" :key="index">
        <li @click="checks(index)">
          <i v-if="item.clickImg"><img src="../../../../assets/images/rent/baishitong/select_active.png" alt=""></i>
          <i v-else><img src="../../../../assets/images/rent/baishitong/select.png" alt=""></i>
        </li>
        <li @click="turnTo1('/supply/purchase/supplier_details',index)">
          <p>
            <span class="font32 textHidden" style="width:6rem">{{item.organName}}</span>
          </p>
          <p>
            <span v-show="item.vipType!=''" style="background:#C8E7FF;color:#61BBFF;">{{item.vipType}}</span>
            <span style="background:#FFE7C8;color:#FFB454;">{{item.years}}年</span>
          </p>
          <span class="font24" style="color:#A7A7A7;margin-left:.2rem;">
                        <i><img src="../../../../assets/images/rent/supply/ding.png" alt=""></i>
						           {{item.organAddress}}
						         </span>
        </li>
      </ul>
      <div class="Section">
        <div v-if="parameter.pageNo <= parameter.pageCount">
          <div class="a b1">
            <ul>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>

        </div>
        <div v-else>啦啦啦，啦啦啦，没有数据啦~~</div>
      </div>
    </div>
    <div class="checkAll">
      <ul>
        <li @click="checkAll">
          <i v-if="checkAllImg"><img src="../../../../assets/images/rent/baishitong/select_active.png" alt=""></i>
          <i v-else><img src="../../../../assets/images/rent/baishitong/select.png" alt=""></i>
        </li>
        <li>
          <p class="font32 font600">全选</p>
        </li>
        <!-- <li @click="addInvitedMark" v-show="type=='yb'">邀标</li> -->
        <li v-show="!(type=='yb')" @click="delOrblackSupplier(1)">加黑</li>
        <li>
          <span v-if="type=='yb'" class="font30" @click="addInvitedMark">邀标</span>
          <span v-else class="font30" @click="delOrblackSupplier(2)">删除</span>
        </li>
      </ul>
    </div>

  </yd-layout>
</template>
<script>
  import fn from "@/assets/js/product";
  import qs from "qs";
  import InfiniteScroll from "vue-infinite-scroll";
  import Vue from "vue";
  import store from '@/store'
  import {CellGroup, CellItem} from "vue-ydui/dist/lib.rem/cell";
  import {Confirm, Alert, Toast, Notify, Loading} from 'vue-ydui/dist/lib.rem/dialog';

  Vue.prototype.$dialog = {
    confirm: Confirm,
    alert: Alert,
    toast: Toast,
    notify: Notify,
    loading: Loading,
  };
  Vue.component(CellGroup.name, CellGroup);
  Vue.component(CellItem.name, CellItem);
  export default {
    data() {
      let userInfo, organInfo,mainColor;
      if (!this.$route.query.token) {
        userInfo = JSON.parse(
          decodeURIComponent(localStorage.getItem("userInfo"))
        );
        mainColor = this.$color[userInfo.organType];
        organInfo = JSON.parse(
          decodeURIComponent(localStorage.getItem("organInfo"))
        );
      }
      return {
        organInfo,
        mainColor,
        userInfo,
        screen: {
          startTime: this.$today(),
          entTime: this.$today()
        },
        show1: false,
        checkAllImg: false,
        parameter: {
          token: '',
          userId: null,
          type: null,
          pageNo: 1,
          pageSize: 12,
          pageCount: 0,
          kaIds: '',
          businessName: '',
          guidList: '',
          guidList1: '',
          type1: '',
          supplierOrganId: '',
          supplierId: '',
        },
        value: '',
        libraryList: [],
        libraryList1: [],
        guid: '',
        type: ''
      };
    },
    methods: {
      back() {
        this.$back(this);
      },
      turnTo1(url, index) {
        this.$router.push(url)
        this.libraryList[index].titleText = "供应商详情"
        localStorage.setItem('libraryList', encodeURIComponent(JSON.stringify(this.libraryList[index])));

      },
      turnTo(url) {
        this.$router.push(url)
      },
      confirm() {
        this.parameter.startDate = this.screen.startTime;
        this.parameter.endDate = this.screen.entTime;
        this.parameter.pageNo = 1;
        this.libraryList = []
        this.mySupplierList();
        this.parameter.endDate = ''
        this.parameter.startDate = ''
        this.show1 = !this.show1
      },
      toggle(type) {
        this.parameter.type = type
        this.libraryList = []
        this.mySupplierList();
        this.parameter.type = null
        this.show1 = !this.show1
      },
      submitHandler(value) {
        this.$dialog.toast({mes: `产品关键字：${value}`});
        this.parameter.pageNo = 1;
        this.parameter.businessName = value;
        this.libraryList = []
        this.mySupplierList()
        this.parameter.businessName = ''

      },
      scrollHandler() {

        if (store.loading || this.parameter.pageNo > this.parameter.pageCount) {
          return
        }

        let listDom = this.$refs.listDom;
        if (listDom.scrollHeight - listDom.scrollTop - listDom.clientHeight < 100) {
          this.mySupplierList()
        }

      },
      checks(index) {
        let arr1 = []
        let arr2 = []
        let arr3 = []
        this.libraryList[index].clickImg = !this.libraryList[index].clickImg
        let arr = this.libraryList.filter((item, index) => {
          return item.clickImg == true
        })
        this.libraryList1 = this.libraryList.filter(item => {
          return item.clickImg == false
        })

        arr.forEach(element => {
          arr1.push(element.optUserId)
          arr2.push(element.organId)
          arr3.push(element.guid)
        })
        if (this.libraryList.length > arr.length) {
          this.checkAllImg = false;
        } else if (this.libraryList.length == arr.length) {
          this.checkAllImg = true;
        }

        this.parameter.guidList = arr3.join(',')
        this.parameter.supplierId = arr1.join(',')
        this.parameter.supplierOrganId = arr2.join(',')
        console.log(this.parameter.supplierOrganId)

      },
      checkAll() {
        this.checkAllImg = !this.checkAllImg;
        this.libraryList.forEach(element => {
          element.clickImg = this.checkAllImg
        });
        let arr1 = []
        let arr2 = []
        let arr3 = []
        this.libraryList1 = this.libraryList.filter(item => {
          return item.clickImg == false
        })
        let arr = this.libraryList.filter((item, index) => {
          return item.clickImg == true
        })
        arr.forEach(element => {
          arr1.push(element.optUserId)
          arr2.push(element.organId)
          arr3.push(element.guid)
        })
        this.parameter.guidList = arr3.join(',')
        this.parameter.supplierId = arr1.join(',')
        this.parameter.supplierOrganId = arr2.join(',')
        console.log(this.parameter.supplierOrganId)
      },
      callback(val, guid) {
        this.parameter.pageNo = 1;
        this.parameter.pageSize = 6;
        this.parameter.type = guid;
        this.checkAllImg = false;
        // let that=this;
        // that.$dialog.loading.open('加载中..');
      },
      mySupplierList() {
        let data = {}
        data.state = 0;
        data.token = this.parameter.token;
        if (this.parameter.type != null) data.type = this.parameter.type;
        if (this.parameter.businessName != '') data.businessName = this.parameter.businessName;
        data.type = this.parameter.type;
        data.pageNo = this.parameter.pageNo;
        data.pageSize = this.parameter.pageSize;

        this.xhr.post(`${this.subUrl.bd}/purchase/mySupplierList`, qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
            this.$dialog.loading.close();
            if (res.data.data.list != null) {
              res.data.data.list.forEach(element => {
                //  element.createDate=element.createDate.split(' ')[0]
                element.clickImg = false;
                if (element.vipType == 1) {
                  element.vipType = '基础'
                } else if (element.vipType == 2) {
                  element.vipType = '中级'
                } else if (element.vipType == 3) {
                  element.vipType = '高级'
                } else if (element.vipType == 4) {
                  element.vipType = '金牌'
                } else if (element.vipType == 0) {
                  element.vipType = '';
                }
              });
            }
            this.parameter.pageCount = res.data.data.pageCount;

            if (this.parameter.pageNo >= 2) {
              this.libraryList = this.libraryList.concat(res.data.data.list);
            } else {
              this.libraryList = res.data.data.list;
            }

            this.parameter.pageNo++;
            console.log(this.parameter.pageCount)
          } else if (res.data.code == '-902') {
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      },
      delOrblackSupplier(type) {
        if (this.parameter.guidList == '') {
          this.$dialog.toast({mes: '请选择操作对象！'});
          return
        }
        this.checkAllImg = false;
        var data = {
          token: this.parameter.token,
          guidList: this.parameter.guidList,
          type: type
        }
        this.xhr.post(`${this.subUrl.bd}/purchase/delOrblackSupplier`, qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
            this.libraryList = this.libraryList1
            this.$dialog.toast({mes: '操作成功！'});
            this.parameter.pageNo = 1
            this.mySupplierList()
          } else if (res.data.code == '-902') {
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      },
      //邀标
      addInvitedMark() {
        if (this.parameter.supplierId == '') {
          this.$dialog.toast({mes: '请选择操作对象！'});
          return
        }
        this.checkAllImg = false;
        var data = {
          token: this.parameter.token,
          supplierId: this.parameter.supplierId,
          supplierOrganId: this.parameter.supplierOrganId,
          guid: this.guid
        }
        this.xhr.post(`${this.subUrl.bd}/purchase/addInvitedMark`, qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
            this.$dialog.toast({mes: '邀标成功！'});
            this.$router.go(-1)
          } else if (res.data.code == '-902') {
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      }
    },
    mounted() {
      if (this.$route.query.token) {
        this.parameter.userId = this.$route.query.userId;
        this.parameter.token = this.$route.query.token;
        this.parameter.token = fn.getIng();
        this.$getUserInfo(res => {
          this.mySupplierList();
          this.type = this.$route.query.type
          this.guid = this.$route.query.guid
        }, this)
      } else {
        this.parameter.userId = this.userInfo.guid;
        this.parameter.token = fn.getIng();
        this.mySupplierList();
        this.type = this.$route.query.type
        this.guid = this.$route.query.guid
      }
    }
  };
</script>
<style scoped>
  .search {
    width: 100%;
    background: #F7F7F9;
    position: relative;
    margin-bottom: .2rem;
  }

  .search > ul {
    width: 100%;
    display: flex;
    align-items: center;
  }

  .search > ul li:nth-child(2) {
    flex: 1;
  }

  .search > ul li:nth-child(1) {
    width: 1.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .screen {
    width: 100%;
    position: absolute;
    height: calc(100vh - 1.88rem);
    background: rgba(0, 0, 0, 0.1);
    z-index: 999;
    left: 0;
    border-top: 1px solid #D9D9D9;
  }

  .screen ul {
    background: #f6f6f6;
  }

  .screen ul li {
    height: .8rem;
    border-bottom: 1px solid #D9D9D9;
    padding: 0 .4rem;
    display: flex;
    align-items: center;
    font-size: .32rem;
  }

  .lists {
    overflow-y: scroll;
    height: calc(100vh - 2.8rem);
  }

  .libList {
    width: 100%;
    display: flex;
    background: white;
    border-bottom: 1px solid #D9D9D9;
  }

  .libList li {
    display: flex;
    height: 2rem;
  }

  .libList li:nth-child(1) {
    width: .7rem;
    justify-content: center;
    align-items: center;
  }

  .libList li:nth-child(1) > i {
    width: .35rem;
    height: .35rem;
  }

  .libList li:nth-child(1) > i > img {
    width: 100%;
    height: 100%;
  }

  .libList li:nth-child(2) {
    flex: 1;
    flex-flow: column;
    justify-content: center;
  }

  .libList li:nth-child(2) > p {
    margin-bottom: .1rem;
    display: flex;
    align-items: center;
  }

  .libList li:nth-child(2) > p:nth-child(2) > span {
    padding: .02rem .2rem;
    margin-left: .2rem;
    font-size: .24rem;
  }

  .libList li:nth-child(2) > span {
    display: flex;
  }

  .libList li:nth-child(2) > span > i {
    display: flex;
    width: .35rem;
    height: .35rem;
    margin-right: .1rem;
  }

  .libList li:nth-child(2) > span > i > img {
    width: 100%;
    height: 100%;
  }

  .libList li:nth-child(3) {
    width: 2.2rem;
    justify-content: center;
    align-items: center;
  }

  .libList li:nth-child(3) > p {
    display: flex;
  }

  .libList li:nth-child(3) > p > i {
    width: .35rem;
    height: .35rem;
    margin-right: .1rem;
  }

  .libList li:nth-child(3) > p > i > img {
    width: 100%;
    height: 100%;
  }

  .checkAll {
    position: absolute;
    width: 100%;
    background: white;
    height: .8rem;
    bottom: 0;
    left: 0;
    z-index: 998;
  }

  .checkAll ul li {
    width: 100%;
    height: 100%;
  }

  .checkAll ul {
    display: flex;
    height: 100%;
  }

  .checkAll ul li:nth-child(1) {
    width: .8rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .checkAll ul li:nth-child(1) > i {
    width: .35rem;
    height: .35rem;
  }

  .checkAll ul li:nth-child(1) > i > img {
    width: 100%;
    height: 100%;
  }

  .checkAll ul li:nth-child(2) {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .checkAll ul li:nth-child(3) {
    width: 1.5rem;
    height: .8rem;;
    display: flex;
    align-items: center;
  }

  .checkAll ul li:nth-child(4) {
    width: 1.5rem;
    height: .8rem;;
    display: flex;
    align-items: center;
  }

  .checkAll ul li:last-child {
    width: 1.5rem;
    height: .8rem;
    background: #FF5A5A;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
