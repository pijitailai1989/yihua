<template>
  <yd-layout class="layout_my">
    <div class="blue_box">
      <yd-navbar class="header" v-show="!userAgent.isWX" v-title="'物业服务单'" title="物业服务单" color="#fff" :bgcolor="mainColor" height=".88rem">
         <router-link to="#" slot="left">
            <span @click="back"><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </router-link>
         <div slot="right" class="edit" style="color: #fff;font-size:.6rem;">+</div>
      </yd-navbar>
    </div>

    <div class="search">
        <div>
            <i><img src="../../../../assets/images/rent/my/search.png" alt=""></i>
            <span><input type="text" placeholder="请输入关键字或编码"></span>
            </div>
        <div>筛选</div>
    </div>

    <div class="set_service">
            <ul>
                <li>
                    <p>外勤服务</p>
                    <i></i>
                </li>
                <li>
                    <p>业务信息设置</p>
                    <i></i>
                </li>
            </ul>
    </div>

    <div>


    </div>

    <div></div>


  </yd-layout>
</template>
<script>
import Vue from "vue";
import fn from "@/assets/js/product";
import qs from "qs";

export default {
  data() {
    return {
      mainColor: "",
      serviceList: [
        { name: "缴费", img: "../../../../assets/images/rent/", path: "" }
      ]
    };
  },
  methods: {
    turnTo(url) {
      this.$router.push(url);
    },
    back() {
      this.$router.go(-1);
    },
    // 获取邀请信息列表
    getMyInvitation() {
      var data = { userId: this.userId };
      this.xhr
        .post(`${this.subUrl.user}/user/myInvitation`, qs.stringify(data))
        .then(res => {
          if (res.data.code == 1) {
            res.data.data.list.forEach(item => {
              if (item.type == 1) {
                item.type = "企业";
              } else if (item.type == 2) {
                item.type = "供应商";
              }
            });
            this.userL = res.data.data.list;
            localStorage.setItem(
              "userL",
              encodeURIComponent(JSON.stringify(res.data.data.list))
            );
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
    this.mainColor = localStorage.getItem("mainColor");
    this.userId = this.userInfo.guid;
    this.getkey = fn.getIng();
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

.layout_my .blue_box {
  height: 0.88rem;
  background: #0093d2;
  background-size: 100% 100%;
}

.search {
  width: 100%;
  height: 0.85rem;
  background: white;
  display: flex;
  flex-flow: row;
  padding: 0.15rem 0.3rem;
}
.search > div:nth-child(1) {
  flex: 1;
  background: #ebebed;
  border-radius: 0.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.search > div:nth-child(1) > i {
  width: 0.35rem;
  height: 0.35rem;
  margin-right: 0.1rem;
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
  font-size: 0.22rem;
  color: #a2a1a6;
  border: none;
}
.search > div:nth-child(2) {
  width: 1.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.set_service {
  width: 100%;
  height: 1.2rem;
  background: white;
  margin: 0.3rem 0;
}
.set_service > ul {
  width: 100%;
  height: 100%;
  display: flex;
  border-bottom: 1px solid #e4e6e6;
  border-top: 1px solid #e4e6e6;
}
.set_service > ul > li {
  flex: 1;
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
}
.set_service > ul > li > p {
  font-size: 30;
  margin-right: 0.3rem;
}
.set_service > ul > li:nth-child(1) {
  border-right: 1px solid #e4e6e6;
}
.set_service > ul > li > i {
  width: 0.9rem;
  height: 0.9rem;
  background: red;
  border-radius: 50%;
}
</style>
