<template>
  <div style="height:100vh">
    <yd-layout>
      <yd-navbar slot="navbar" height='.88rem' color='#fff' :bgcolor='mainColor' title='我的助手'>
        <div class="addClickArea" @click="$router.go(-1)" slot="left">
          <yd-navbar-back-icon color='#fff'></yd-navbar-back-icon>
        </div>
        <div class="addRightClickArea font40" style="color:#fff">+</div>
      </yd-navbar>
      <div>

        <yd-infinitescroll :callback="loadList" ref="infinitescrollDemo">
          <div class="list" slot="list">
            <div class="flex-row-nowarp bgwhite bb" v-for="item,index in list" :key="index" style="padding:.2rem .3rem">
              <div class="flex">
                <div style="align-self: flex-start" class="mr2">
                  <img :src="item.headPortrait" width="40" height="40" style="border-radius: 50%;border:2px solid #f2f2f2" alt="">
                </div>
                <div>
                  <div class="font30">{{item.name}}</div>
                  <!--<div class="font24">日期：2017-10-10</div>-->
                </div>
              </div>
              <!--中间-->

              <!--右边-->
              <div>{{item.account}}</div>
              <div style="padding:.2rem;margin-right:-.2rem;" @click="deleteItem(index)">
                <yd-icon name="deleteIcon" custom size=".4rem" color="#666"></yd-icon>
              </div>
            </div>
          </div>
        </yd-infinitescroll>
      </div>
    </yd-layout>
  </div>
</template>
<script>
  import Vue from 'vue';
  import {InfiniteScroll} from 'vue-ydui/dist/lib.rem/infinitescroll';
  Vue.component(InfiniteScroll.name, InfiniteScroll);
  export default {
    data() {
      this.userInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("userInfo"))
      );
      this.organInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("organInfo"))
      );
      this.mainColor = this.$color[this.userInfo.organType];
      console.log(this.mainColor, 1111111111111);
      return {
        pageNo: 1,
        list:[],
      };
    }, methods: {
      loadList() {
        this.getlist();
      },
      deleteItem(i) {
        this.$dialog.confirm({
          mes: `是否删除${this.list[i].name}`, opts: () => {
            let data = {
              token: this.$getkey(),
              userId: this.list[i].guid,
            };
            this.$ajax(`${this.subUrl.activity}/myhelper/applyList`,data,res=>{
              this.list.splice(i,1);
              this.$dialog.toast({mes: "删除成功", icon: "success"})
            },this)
          }
        })
      },
      getlist() {
        let data = {
          token: this.$getkey(),
          userId: this.userInfo.guid,
          pageNo: this.pageNo,
          organId:this.organInfo.guid,
        }
        this.$ajax(`${this.subUrl.activity}/myhelper/myhelperList`, data, res => {
          this.list = this.list.concat(res.data.list);
          if (this.pageNo >= res.data.pageCount) {
            this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
          } else {
            this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');
          }
          this.pageNo++;
        }, this)
      },
    },mounted(){
      this.getlist();
    }
  };
</script>
<style scoped>

</style>

