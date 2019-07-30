<template>
  <yd-tabbar slot="tabbar" :activeColor="mainColor">
    <yd-tabbar-item @click.native="chooseTab(0)" title="企信" :link="'/index/'+activeIndex.type + '/'+ activeIndex.isManger +'/1/rent/message'"
      :active="activeIdx==0">
      <img v-if="activeIdx==0" slot="icon" src="../../assets/images/index/message_active2.png">
      <img v-else slot="icon" src="../../assets/images/index/message.png">
    </yd-tabbar-item>
    <yd-tabbar-item @click.native="chooseTab(1)" title="八爪圈" :link="'/index/'+activeIndex.type + '/'+ activeIndex.isManger +'/2/rent/circle'"
      :active="activeIdx==1">
      <img v-if="activeIdx==1" slot="icon" src="../../assets/images/index/circle_active2.png">
      <img v-else slot="icon" src="../../assets/images/index/circle.png">
    </yd-tabbar-item>
    <yd-tabbar-item @click.native="chooseTab(2)" title="我的" :link="'/index/'+activeIndex.type + '/'+ activeIndex.isManger +'/3/rent/my'"
      :active="activeIdx==2">
      <img v-if="activeIdx==2" size='.6rem' slot="icon" src="../../assets/images/index/personal_active2.png">
      <img v-else slot="icon" src="../../assets/images/index/personal.png">
    </yd-tabbar-item>
  </yd-tabbar>
</template>
<script>
  import Vue from 'vue';
  import { TabBar, TabBarItem } from 'vue-ydui/dist/lib.rem/tabbar';
  import { Badge } from 'vue-ydui/dist/lib.rem/badge';
  Vue.component(Badge.name, Badge);
  Vue.component(TabBar.name, TabBar);
  Vue.component(TabBarItem.name, TabBarItem);
  export default {
    // props:["activeIdx"],
    data() {
      var userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      var mainColor = this.$color[userInfo.organType]
      // 设置主色
      return {
        activeIdx:"",
        mainColor,
        userInfo,
        activeIndex: {}
      }
    },

    methods: {
      chooseTab(e) {
        console.log(e);
        this.activeIdx = e;
      }
    },
    mounted() {
      this.activeIndex = this.$route.params;
      this.activeIdx = this.activeIndex.tabIndex;
    }
  }
</script>