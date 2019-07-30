<template>
  <yd-layout>
       <yd-navbar class="header" v-show="!userAgent.isWX" title="" color="#fff" :bgcolor="mainColor" height=".88rem">
         <div slot="left" @click="disagree">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
         </div>
      </yd-navbar>
  </yd-layout>
</template>
<script>
export default {
  data() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.mainColor = this.$color[this.userInfo.organType];
    return {};
  }
};
</script>

