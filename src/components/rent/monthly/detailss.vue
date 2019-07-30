<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" title="详情" :bgcolor="mainColor" color="#fff">
      <span class="addClickArea" slot="left" @click="back" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
    </yd-navbar>
   
   <div class="explain">
       <ul>
           <li style="color:#777;">事项</li>
           <li style="border-bottom:1px solid #999;">工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容</li>
           <li style="color:#777;">进度情况</li>
           <li style="border-bottom:1px solid #999;">100%</li>
           <li style="color:#777;">说明</li>
           <li style="border-bottom:1px solid #999;">说明说明说明说明说明说明说明说明说明说明说明说明说明说明说明说明说明说明说明说明说明说明说明说明说明说明说明说明说明说明说明</li>
       </ul>
   </div>

   

  </yd-layout>
</template>
<script>
  import fn from "@/assets/js/product";
  import qs from "qs";
  import InfiniteScroll from "vue-infinite-scroll";
  import Vue from "vue";
  export default {
    data() {
      let userInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("userInfo"))
      );
      let mainColor = this.$color[userInfo.organType];
      let endTime = this.$today();
      var organInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("organInfo"))
      );
      // 圈子类型 1企业 2 个人 3 物业
      //用户类型 1:租户；2:商家；3:管理处；4:物业公司；5:其他（个人）；6：业主 0为空
      // 根据用户类型判断
      var userType = userInfo.organType
      let TypeListCircle;
      if (userType == 1) {
        TypeListCircle = 1;
      } else if (userType == 5) {
        TypeListCircle = 2;
      } else{
        TypeListCircle = 3
      }
      return {
        picked: false,
        peopleNum: "",
        organInfo:{},
        mainColor:'',
        userInfo:{},
        userId:'',
        organId:'',
        getkey:'',
      };
    },
    methods: {
      add(){
        this.alertT=true;
      },
      confirm(){

      },
      selectTab(index) {
        this.showTab = index;
      },
      cancel() {
        this.alertT=false;
      },
      back() {
        this.$router.go(-1);
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
    }
  };
</script>
<style scoped>
.explain{width:100%}
.explain>ul{width:100%;padding:.1rem .3rem;background: white;}
.explain>ul>li{width:100%;padding:.1rem 0;line-height: .4rem;}
</style>