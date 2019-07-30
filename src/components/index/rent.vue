<template>
  <yd-tabbar slot="tabbar" :activeColor='mainColor'>
    <yd-tabbar-item @click.native="chooseTab(0)" title="企信" :link="''"
                    :active="activeIdx==0">
      <img v-if="activeIdx==0" slot="icon" src="../../assets/images/index/message_active3.png">
      <img v-else slot="icon" src="../../assets/images/index/message.png">
    </yd-tabbar-item>
    <yd-tabbar-item @click.native="chooseTab(1)" title="八爪圈" link="''" :active="activeIdx==1">
      <img v-if="activeIdx==1" slot="icon" src="../../assets/images/index/circle_active3.png">
      <img v-else slot="icon" src="../../assets/images/index/circle.png">
    </yd-tabbar-item>
    <yd-tabbar-item @click.native="chooseTab(2)" title="本地服务" link="''"
                    :active="activeIdx==2">
      <img v-if="activeIdx==2" slot="icon" src="../../assets/images/index/gongqiu_active3.png">
      <img v-else slot="icon" src="../../assets/images/index/gongqiu.png">
    </yd-tabbar-item>
    <yd-tabbar-item @click.native="chooseTab(3)" title="我的" :link="''"
                    :active="activeIdx==3">
      <img v-if="activeIdx==3" slot="icon" src="../../assets/images/index/personal_active3.png">
      <img v-else slot="icon" src="../../assets/images/index/personal.png">
    </yd-tabbar-item>
  </yd-tabbar>
</template>
<script>
  import Vue from 'vue';
  import {TabBar, TabBarItem} from 'vue-ydui/dist/lib.rem/tabbar';
  import {Badge} from 'vue-ydui/dist/lib.rem/badge';

  Vue.component(Badge.name, Badge);
  Vue.component(TabBar.name, TabBar);
  Vue.component(TabBarItem.name, TabBarItem);
  export default {
    data() {
      var userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      var mainColor = this.$color[userInfo.organType]
      // 设置主色
      return {
        mainColor,
        userInfo,
        activeIdx: "",
        activeIndex: {},
      }
    },
    methods: {
      chooseTab(e) {
        this.activeIdx = e;
        // :link="'/index/'+activeIndex.type + '/'+ activeIndex.isManger +'/3/rent/circle'
        //  '/index/'+activeIndex.type + '/'+ activeIndex.isManger +'/3/rent/my'
        let url = ''
        switch (e * 1) {
          case 0:
            url = '/index/' + this.activeIndex.type + '/' + this.activeIndex.isManger + '/3/rent/message';
            break;
          case 1:
            url = '/index/' + this.activeIndex.type + '/' + this.activeIndex.isManger + '/3/rent/circle';
            break;
          case 2:
            url = '/index/' + this.activeIndex.type + '/' + this.activeIndex.isManger + '/3/rent/local';
            break;
          case 3:
            url = '/index/' + this.activeIndex.type + '/' + this.activeIndex.isManger + '/3/rent/my';
            break;
        }
        this.$router.replace(url);

      }
    },
    mounted() {
      this.activeIndex = this.$route.params;
      this.activeIdx = this.activeIndex.tabIndex;
      var path = this.$route.path.split('/');
      var path = this.$route.path.split('/');
      path = path[path.length - 1];
      switch (path) {
        case 'message':
          this.chooseTab(0);
          break;
        case 'circle':
          this.chooseTab(1);
          break;
        case 'local':
          this.chooseTab(2);
          break;
        case 'my':
          this.chooseTab(3);
          break;
      }
    }
  }
</script>
