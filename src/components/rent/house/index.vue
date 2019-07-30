<template>
  <yd-layout class="layout_my">
      <yd-navbar class="header" slot="navbar" title="房屋管理" v-show="!userAgent.isWX" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span class="spanLeft addClickArea" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
      </yd-navbar>
    <div class="screen">
           <ul>
               <li>选择楼宇</li>
               <li>单元</li>
               <li>状态</li>
           </ul>
    </div>
    <div class="contentList" @scroll="scrollHandler" ref="listDom">
       <div class="content">
            <ul @click="turnTo('/house/details?guid='+item.guid+'&buildingName='+item.buildingName+'&status='+item.status)"
            v-for="(item,index) in contentList" :key="index">
                <li>
                    <span style="color:#333;font-weight:600;font-size:.32rem;">{{item.ownerInfo.name}}</span>
                    <span style="color:#333;font-weight:600;font-size:.32rem;">{{item.ownerInfo.account}}</span>
                    <span>
                        <a v-if="item.status==0" class="font24" :style="{color:mainColor,border:'1px solid '+mainColor}">空置</a>
                        <a v-if="item.status==1" class="font24" :style="{color:mainColor,border:'1px solid '+mainColor}">使用中</a>
                        <a v-if="item.status==2" class="font24" :style="{color:mainColor,border:'1px solid '+mainColor}">装修</a>
                        <a v-if="item.status==3" class="font24" :style="{color:mainColor,border:'1px solid '+mainColor}">欠费</a>
                        <a v-if="item.status==4" class="font24" :style="{color:mainColor,border:'1px solid '+mainColor}">未收楼</a>
                        <a v-if="item.status==5" class="font24" :style="{color:mainColor,border:'1px solid '+mainColor}">出租中</a>
                    </span>
                </li>
                <li>{{item.buildingName}}</li>
                <li>
                    <span>单元:{{item.ridName}}{{item.unitName}}</span>
                    <span v-if="item.areas">面积:{{item.areas}}平米</span>
                    <span v-else>面积:暂无数据</span>
                </li>
            </ul>
        </div>
        <div  class="Section" v-show="pageSize>=5">
            <div v-if="pageNo <= pageCount">
              <div class="a b1">
                <ul>
               <li></li>
               <li></li>
               <li></li>
                </ul></div>

            </div>
            <div v-else>啦啦啦，啦啦啦，没有数据啦~~</div>
        </div>
    </div>

  </yd-layout>
</template>
<script>
import Vue from "vue";
import fn from "@/assets/js/product";
import qs from "qs";
import store from "@/store";
import { DateTime } from "vue-ydui/dist/lib.rem/datetime";
Vue.component(DateTime.name, DateTime);

export default {
  data() {
    return {
      num: 0,
      mainColor: "",
      organInfo: "",
      userInfo: "",
      contentList: [],
      userId: "",
      organId: "",
      organType: "",
      // （上报中：1，已接单：2，处理中：3，待确认：4，已完成：5，关闭：6,不同意：7） ,
      tabs: ["上报中", "已接单", "处理中", "待确认", "已完成", "关闭", "不同意"],
      active: null,
      show: false,
      show1: false,
      pageNo: 1,
      pageSize: 10,
      pageCount: null,
      keyword: "",
      startDate: this.$addDay(this.$today(), -30),
      endDate: this.$today(0),
      status: null
    };
  },
  methods: {
    scrollHandler() {
      if (store.loading || this.pageNo > this.pageCount) {
        return;
      }
      let listDom = this.$refs.listDom;
      if (
        listDom.scrollHeight - listDom.scrollTop - listDom.clientHeight <
        100
      ) {
        this.listReceptoin();
      }
    },
    toggle() {
      this.show1 = !this.show1;
    },
    turnTo(url) {
      this.$router.push(url);
    },
    back() {
      this.$router.go(-1);
    },
    tabClick(index) {
      this.num = index;
      this.status = index + 1;
    },
    // 获取信息列表
    Determine() {
      this.pageNo = 1;
      this.listReceptoin();
      this.show1 = false;
    },
    search() {
      this.pageNo = 1;
      this.listReceptoin();
    },
    getBmList() {
      let data={}
      data.token=this.getkey;
      data.userId=this.userId;
      data.status=this.status;
      data.pageNo=this.pageNo;
      data.pageSize=this.pageSize;

      this.xhr.post(
          `${this.subUrl.activity}/ownersCom/getBmList?`,qs.stringify(data)
        ).then(res => {
          if (res.data.code == 1) {
            // console.log(res)
            res.data.data.list.forEach(item => {
              if (item.createDate != null) {
                item.createDate = item.createDate.split(" ")[0];
              }
            });
            this.pageCount = res.data.data.pageCount;
            if (this.pageNo >= 2) {
              this.contentList = this.contentList.concat(res.data.data.list);
            } else {
              this.contentList = res.data.data.list;
            }
            this.pageNo++;
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        });
    },
    //业主
    getBmList1() {
      let data={}
      data.token=this.getkey;
      data.userId=this.userId;
      data.status=this.status;
      data.pageNo=this.pageNo;
      data.pageSize=this.pageSize;

      this.xhr.post(
          `${this.subUrl.activity}/owner/getBmList?`,qs.stringify(data)
        ).then(res => {
          if (res.data.code == 1) {
            // console.log(res)
            res.data.data.list.forEach(item => {
              if (item.createDate != null) {
                item.createDate = item.createDate.split(" ")[0];
              }
            });
            this.pageCount = res.data.data.pageCount;
            if (this.pageNo >= 2) {
              this.contentList = this.contentList.concat(res.data.data.list);
            } else {
              this.contentList = res.data.data.list;
            }
            this.pageNo++;
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        });
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.organType = JSON.parse(
      decodeURIComponent(localStorage.getItem("organType"))
    );
    this.mainColor = this.$color[this.organType];
    this.userId = this.userInfo.guid;
    this.organId = this.organInfo.guid;
    this.getkey = fn.getIng();
    console.log(this.mainColor)
    if(this.organType==7){
      this.getBmList();
    }else if(this.organType==6){
      this.getBmList1()
    }
    
  },
  beforeUpdate() {
    
  }
};
</script>
<style scoped>
.layout_my .header:after {
  display: none;
}
.layout_my {
  background: #f7f7f9;
}
.screen{width:100%;background: white;margin-bottom:.2rem;}
.screen>ul{width:100%;display: flex;flex-flow: row;
justify-content: space-around;align-items: center;}
.screen>ul>li{height: .8rem;display: flex;align-items: center;font-size:.3rem;color:#999;}


.contentList {
  width: 100%;
  height: calc(100vh - 1.88rem);
  overflow-y: scroll;
}
.content {
  width: 100%;
  background: white;
}
.content>ul{width:100%;padding:.2rem .4rem;margin-bottom:.2rem;}
.content>ul>li{color:#999;width:100%;display: flex;margin:.1rem 0;align-items: center;}
.content>ul>li:nth-child(1){justify-content: space-between}
.content>ul>li:nth-child(3)>span{width:50%;}
.content>ul>li:nth-child(1)>span>a{padding:.05rem .05rem;border-radius: .05rem;}



</style>
