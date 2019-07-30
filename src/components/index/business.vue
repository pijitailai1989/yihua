<template>
  <yd-tabbar slot="tabbar" activeColor='#1ed28c'>
    <yd-tabbar-item @click.native="chooseTab(0)" title="企信" :link="'/index/'+activeIndex.type + '/'+ activeIndex.isManger +'/3/rent/message'"
      :active="activeIdx==0">
      <img v-if="activeIdx==0" slot="icon" src="../../assets/images/index/message_active.png">
      <img v-else slot="icon" src="../../assets/images/index/message.png">
    </yd-tabbar-item>
    <yd-tabbar-item @click.native="chooseTab(1)" title="八爪圈" :link="'/index/'+activeIndex.type + '/'+ activeIndex.isManger +'/3/rent/circle'"
      :active="activeIdx==1">
      <img v-if="activeIdx==1" slot="icon" src="../../assets/images/index/circle_active.png">
      <img v-else slot="icon" src="../../assets/images/index/circle.png">
    </yd-tabbar-item>
    <!-- <yd-tabbar-item @click.native="chooseTab(2)" title="供求" :link="'/index/'+activeIndex.type + '/'+ activeIndex.isManger +'/3/rent/supply'"
      :active="activeIdx==2">
      <img v-if="activeIdx==2" slot="icon" src="../../assets/images/index/gongqiu_active.png">
      <img v-else slot="icon" src="../../assets/images/index/gongqiu.png">
    </yd-tabbar-item> -->
    <yd-tabbar-item @click.native="chooseTab(3)" title="我的" :link="'/index/'+activeIndex.type + '/'+ activeIndex.isManger +'/3/rent/my'"
      :active="activeIdx==3">
      <img v-if="activeIdx==3" slot="icon" src="../../assets/images/index/personal_active.png">
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
    data() {
      var userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      var mainColor = this.$color[userInfo.organType]
      console.log(mainColor)
      // 设置主色
      return {
        mainColor,
        userInfo,
        activeIdx: "",
        activeIndex: ""
      }
    },
    methods: {
      chooseTab(e) {
        this.activeIdx = e;
      }
    },
    mounted() {
      this.activeIndex = this.$route.params;
      this.activeIdx = this.activeIndex.tabIndex;
      var path = this.$route.path.split('/');
      path = path[path.length - 1];
      switch (path) {
        case 'message':
          this.chooseTab(0);
          break;
        case 'circle':
          this.chooseTab(1);
          break;
        case 'supply':
          this.chooseTab(2);
          break;
        case 'my':
          this.chooseTab(3);
          break;
      }
    }
  }
</script>