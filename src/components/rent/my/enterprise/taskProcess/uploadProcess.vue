<template>
  <div style="height:100vh">
    <yd-layout>
      <yd-navbar slot="navbar" title="进度" height=".88rem" color="#fff" :bgcolor="mainColor">
        <div class="addClickArea" slot="left" @click="$router.go(-1)">
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </div>
        <div class="addRightClickArea" style="color:#fff" slot="right">保存</div>
      </yd-navbar>
    </yd-layout>
  </div>
</template>

<script>
  export default {
    data() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      return {

      }
    }
  }
</script>

<style scoped>

</style>
