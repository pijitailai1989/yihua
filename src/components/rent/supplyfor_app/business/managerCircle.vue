<template>
  <div style="height:100vh">
    <yd-layout>
      <yd-navbar slot="navbar" title="租赁问询" height=".88rem" color="#fff" :bgcolor="mainColor">
        <div class="addClickArea" slot="left" @click="$router.go(-1)">
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </div>
        <div class="addRightClickArea" style="color:#fff" slot="right">提交</div>
      </yd-navbar>
    </yd-layout>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    }, methods: {
      getUserInfo(cb) {
        let data = {
          token: this.$route.query.token
            ? this.$route.query.token
            : this.$getkey(),
          userId: this.$route.query.userId
            ? this.$route.query.userId
            : this.userInfo.guid
        };
        this.$ajax(
          `${this.subUrl.user}/user/getUserInfo`,
          data,
          res => {
            this.userInfo = res.data.userInfo;
            this.organInfo = res.data.organInfo;
            localStorage.setItem(
              "userInfo",
              encodeURIComponent(JSON.stringify(res.data.userInfo))
            );
            localStorage.setItem(
              "organInfo",
              encodeURIComponent(JSON.stringify(res.data.organInfo))
            );
            localStorage.setItem("to", encodeURIComponent(res.data.token));
            fn.setIng(this.$route.query.token);
            var a = res.data.userInfo.organType;
            var b = res.data.userInfo.admin ? 1 : 0;
            localStorage.setItem("organType", a);
            localStorage.setItem("isManger", b);
            localStorage.setItem("user_Id", res.data.userInfo.guid);
            cb && cb(res.data);
          },
          this
        );
      },
    }, mounted() {
      this.getUserInfo(res => {

      })
    },
  }
</script>

<style scoped>

</style>
