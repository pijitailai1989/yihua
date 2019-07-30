<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" slot="navbar" v-show="!userAgent.isWX" v-title="'修改备注'" title="修改备注" :bgcolor="mainColor" color="#fff">
      <span slot="left" @click="cancel()" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
      <span slot="right" style="color: #fff;">
        <a @click="toChangeRemarks" slot="left">
          完成
        </a>
      </span>
    </yd-navbar>
    <div class="remark-content">
      <div class="border-line">
        <div class="left-div">备注名</div>
        <input maxlength="28" type="text" class="right-input" placeholder="请输入备注名" v-model="remarkName">
      </div>
      <div class="border-line">
        <div class="left-div ">描述</div>
        <input type="text" class="right-input" placeholder="填写描述" v-model="remarkDes">
      </div>
      <div class="button" style="padding:0 .2rem;">
        <yd-button type='hollow' @click.native="toChangeRemarks"  style="width:100%;height:.8rem;margin:.2rem 0" :bgcolor='mainColor' color='#fff'>完成</yd-button>
      </div>
    </div>
  </yd-layout>
</template>
<script>
import fn from "@/assets/js/product";
import qs from "qs";
import Vue from "vue";
import "@/assets/css/manager.css";
export default {
  data() {
    let userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    let organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    let mainColor = this.$color[userInfo.organType];
    let userId = userInfo.guid;
    let getkey = fn.getIng();
    return {
      userInfo,
      organInfo,
      mainColor,
      userId,
      getkey,
      remarkName: "",
      remarkDes: ""
    };
  },
  methods: {
    toChangeRemarks() {
      if (this.remarkName == "") {
        return this.$dialog.toast({ mes: "请输入备注名", timeout: 1000 });
      } else if (this.remarkDes == "") {
        return this.$dialog.toast({ mes: "请输入描述", timeout: 1000 });
      }
      var data = {
        token:this.$getkey(),
        userId2:this.$route.query.userId,
        userId:this.userInfo.guid,
        remark:this.remarkName,
        desc:this.remarkDes,
      }
      console.log(data);
      this.$ajax(`${this.subUrl.sc}/friend/updateRemark`,data,res=>{
        this.$dialog.toast({ mes: "修改成功", timeout: 1000,icon:"success"});
        this.$router.go(-1);
      },this)
      
    },
    cancel() {
      history.back();
    }
  }
};
</script>
<style scoped>
.remark-content {
  padding: 0 0.3rem;
  line-height: 3em;
  background: #fff;
  margin-top: 1em;
  font-size: 15px;
}

.remark-content div {
  width: 100%;
  display: flex;
}

.remark-content > div .left-div {
  width: 18%;
}

.remark-content > div .right-input {
  width: 80%;
  line-height: 3em;
  background: #ffffff;
  border: none;
  font-size: 0.26rem;
}

.border-line {
  border-bottom: 1px solid #e6e6e6;
  overflow: hidden;
}

:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  font-size: 0.26rem;
  color: #999999;
  opacity: 1;
}

::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  font-size: 0.26rem;
  color: #999999;
  opacity: 1;
}

input:-ms-input-placeholder {
  font-size: 0.26rem;
  color: #999999;
  opacity: 1;
}

input::-webkit-input-placeholder {
  font-size: 0.26rem;
  color: #999999;
  opacity: 1;
}
</style>