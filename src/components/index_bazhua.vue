<template>
   <yd-layout class="layout" v-title="'我的'">
     <router-view></router-view>
     <!-- 其他 -->
     <!-- <personal class="footer" slot="tabbar" v-show="rParams.type == 5" :activeIndex="rParams"></personal> -->
     <!-- 商家 -->
     <!-- <business class="footer" slot="tabbar" v-show="rParams.type == 2" :activeIndex="rParams"></business> -->
     <!--租户-->
     <!-- <rent class="footer" slot="tabbar" v-show="rParams.type == 1" :activeIndex="rParams"></rent> -->
   </yd-layout>
</template>
<script>
  import personal from './index/personal_footer.vue'
  import rent from './index/rent.vue'
  import business from './index/business.vue'

  export default {
    name: 'index',
    data() {
      return {
        rParams: ""
      }
    },
    components: {
      rent,
      personal,
      business
    },
    mounted() {
      //类型(1，租户；2，商家；3，管理处；4，物业公司；5，其他);
      this.rParams = this.$route.params;
      // console.log(this.rParams.type, 'rparams');
//      location.href = '#/index/' + this.rParams.type + '/' + this.rParams.isManger + '/3/rent/my';

    }
  }
</script>
<style scoped>
  .layout{
    height: 100%;
  }
  .footer {
    position: absolute;
    bottom: 0;
    right: 0;
    max-width: 750px;
    left: 50%;
    transform: translateX(-50%);
  }
</style>
