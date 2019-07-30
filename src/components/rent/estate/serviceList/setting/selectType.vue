<template>
  <div>
    <yd-layout class="layout_my">
      <yd-navbar class="header" slot="navbar" v-show="!userAgent.isWX" v-title="'报修类型'" title="报修类型" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span @click="back()" slot="left"><!--url[url.length-1]-->
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </span>
      </yd-navbar>
      <div class="top_title"><div class="time-title"><img src="../../../../../../assets/images/rent/my/add_new_job.png" alt="">请选择</div></div>
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
import fn from "@/assets/js/product";
import qs from "qs";
export default {
  data() {
    return {
      organInfo: "",
      hasMessage: {
        count: 99,
        new: true
      },
      value2: "",
      result: [],
      url: this.fromRoute ? this.fromRoute : "",
      userInfo: "",
      mainColor: "",
      qsTypes: []
    };
  },
  methods: {
    itemClickHandler() {},

    submitHandler(value) {
      this.arr = [];
      this.selectTab = 4;
      this.page = 1;
      this.$dialog.toast({ mes: `搜索：${value}` });
      var data = { token: this.getkey, organId: this.organInfo.guid };
      // {params: {type: 'pulldown', page: this.page}
      this.xhr
        .post(
          `${this.subUrl.admin}/latestNews/organNews?token=` +
            this.getkey +
            "&keyword=" +
            `${value}` +
            "&organId=" +
            this.organInfo.guid +
            "&pageNo=" +
            this.page +
            "&pageSize=10"
        )
        .then(res => {
          if (res.data.code == 1) {
            this.arr = [...res.data.data.list, ...this.arr];
            if (res.data.data.list.length == 0) {
              this.showErr = true;
            } else {
              this.showErr = false;
            }
            this.page++;
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        });
    },
    getJobInfo(cb) {
      var data = {
        organId: this.organInfo.guid,
        token: this.getkey,
        pageNo: 1,
        pageSeze: 15
      };
      this.xhr
        .post(
          `${this.subUrl.user}/admin/postManage/postList?token=` +
            data.token +
            "&organId=" +
            data.organId
        )
        .then(res => {
          if (res.data.code == 1) {
            cb && cb();
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            // fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        });
    },
    searchType(name, guid) {
      console.log(11);
      // this.$router.push('/estate/to_repair?type='+guid+'&typeName='+name);
      this.$emit("getParams", {
        type: guid,
        typeName: name
      });
    },
    back() {
      this.$emit("myCancel");
    },
    clearLoacl() {
      this.alertS = true;
    },
    quit() {
      this.alertS = false;
    },
    getType() {
      var data = {
        userId: this.userId,
        token: this.getkey,
        pageNo: 1,
        pageSeze: 15
      };
      this.xhr.post(`${this.subUrl.user}/comm/getMt`).then(res => {
        if (res.data.code == 1) {
          this.qsTypes = res.data.data;
        } else if (res.data.code == "-902") {
          //-902
          /*重新登录*/
          fn.re_login(this);
        } else {
          this.$dialog.toast({ mes: res.data.msg });
        }
      });
    },
    getUserInfo(cb) {
      var data = { userId: this.userId, token: this.getkey };
      this.xhr
        .post(`${this.subUrl.user}/user/getUserInfo`, qs.stringify(data))
        .then(res => {
          if (res.data.code == 1) {
            this.userInfo = res.data.data.userInfo;
            this.organInfo = res.data.data.organInfo;
            cb && cb();
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
    this.mainColor = this.$color[this.userInfo.organType];
    this.userId = this.userInfo.guid;
    this.getkey = fn.getIng();
    this.userId = this.userInfo.guid;
    var that = this;
    this.getUserInfo(function() {
      that.getJobInfo();
      that.getType();
    });
  }
};
</script>
<style scoped>
.top_title {
  width: 100%;
  background: #ffffff;
  padding-bottom: 0.5em;
}
.top_title img {
  width: 1em;
  margin-top: 0.5em;
  height: auto;
  float: left;
}
.time-title {
  width: 100%;
  color: #999999;
  margin: 0 1em;
  line-height: 2em;
}
.layout_my {
  background: #f7f7f9;
}
.layout_my .header:after {
  display: none;
}
.type-this {
  z-index: 100;
  display: flex;
  flex-flow: row wrap;
  background: #fff;
  padding: 0 0.3rem;
}

.type-this-fix {
  position: fixed;
  padding-bottom: 30%;
}

.type-this div {
  width: 33.33%;
  margin: 0;
  text-align: center;
  box-sizing: border-box;
  padding: 0.1rem;
}

.type-this div > div {
  width: 100%;
  border: 1px solid #9999;
  border-radius: 4px;
  line-height: 0.6rem;
  padding: 0;
}
</style>
