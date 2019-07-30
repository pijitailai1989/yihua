<template>
    <div style="height:100vh">
      <yd-layout>
        <yd-navbar slot="navbar" title="租赁询问" :bgcolor="mainColor">
          <div class="addClickArea" slot="left" @click="$router.go(-1)">
            <yd-navbar-back-icon></yd-navbar-back-icon>
          </div>
        </yd-navbar>
      </yd-layout>
    </div>
</template>

<script>
    export default {
        data(){
          this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
          this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
          // this.mainColor = this.$color[this.userInfo.organType];
          return {

          }
        }
    }
</script>

<style scoped>

</style>
