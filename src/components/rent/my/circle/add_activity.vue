<template>
  <div class="edit">
    <yd-navbar height=".88rem" v-show="!userAgent.isWX" v-title="'发评论'" title="发评论" bgcolor="#0093d2" color="#fff">
      <span slot="left" @click="cancel()" color="#fff;padding-right:.2rem" style="color: #fff;">取消</span>
      <span slot="right" @click="chooseSuccess()" color="#fff;padding-right:.2rem" style="color: #fff;">发送</span>
    </yd-navbar>
  </div>
</template>
<script>
  export default {
    data() {
      return {}
    },
    methods: {
      cancel() {
        this.$router.go(-1)
      }
    }, mounted() {
      console.log(this.$route.query.id)
    }
  }
</script>
<style scoped>

</style>
