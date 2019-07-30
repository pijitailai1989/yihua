<template>
  <div style="height:100vh">
    <yd-layout>
      <yd-navbar slot="navbar" title="通知" height=".88rem" color="#fff" :bgcolor="mainColor">
        <div class="addClickArea" slot="left" @click="$router.go(-1)">
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </div>
        <!--<div class="addRightClickArea" style="color:#fff" slot="right">提交</div>-->
      </yd-navbar>
      <div class=" message bgwhite bt">
        <div class="flex-row-nowarp h9 bb foCo3">即将启动提醒</div>
        <div class="flex-row-nowarp h8 bb foCo6" @click="chooseList(0,index)" v-for="item,index in list0">
          <div>{{item.name}}</div>
          <div>
            <yd-icon name="selected" :color="mainColor" custom size=".45rem" v-if="item.selected"></yd-icon>
            <yd-icon name="select" custom size=".4rem" v-else></yd-icon>
          </div>
        </div>
      </div>
      <div class="message bgwhite">
        <div class="flex-row-nowarp h9 bb foCo3">未按时启动提醒</div>
        <div class="flex-row-nowarp h8 bb foCo6" @click="chooseList(1,index)" v-for="item,index in list1">
          <div>{{item.name}}</div>
          <div>
            <yd-icon name="selected" :color="mainColor" custom size=".45rem" v-if="item.selected"></yd-icon>
            <yd-icon name="select"  custom size=".4rem" v-else></yd-icon>
          </div>
        </div>
      </div>
    </yd-layout>
  </div>
</template>

<script>
  export default {
    data() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = this.$color[this.userInfo.organType];
      return {
        radio1: 1,
        list0: [{
          name: "10分钟",
          value: 1,
        }, {
          name: "30分钟",
          value: 1,
        }, {
          name: "1小时",
          value: 1,
        }],
        list1: [{
          name: "1小时",
          value: 1,
        }, {
          name: "1天",
          value: 1,
        }]
      }
    }, methods: {
      chooseList(e, index) {
        console.log('list' + e);
        var key = 'list' + e;
        var curData = this[key] ;
        console.log(curData);
        for(var i of curData.keys()){
          if(index == i){
            this.$set(curData[i],'selected',true);
          }else{
            this.$set(curData[i],'selected',false)
          }
        }
        let data = {
          token:this.$getkey(),
          userId:this.userInfo.guid,
          sr10m:this.list0[0].selected?1:0,
          sr30m:this.list0[1].selected?1:0,
          sr1h:this.list0[2].selected?1:0,
          nsr1h:this.list1[0].selected?1:0,
          nsr1d:this.list1[1].selected?1:0,
        };
        this.$ajax(`${this.subUrl.activity}/taskRemind/setting`,data,res=>{
          return this.$dialog.toast({mes:"设置成功",icon:"success"});
        },this)
      },
      getInfo() {
        let data = {
          token: this.$getkey(),
          userId: this.userInfo.guid,
        };
        this.$ajax(`${this.subUrl.activity}/taskRemind/getTaskRemind`,data,res=>{
          this.$set(this.list0[0],'selected',res.data.sr10m);
          this.$set(this.list0[1],'selected',res.data.sr30m);
          this.$set(this.list0[2],'selected',res.data.sr1h);
          this.$set(this.list1[0],'selected',res.data.nsr1h);
          this.$set(this.list1[1],'selected',res.data.nsr1d);
        },this)
      }
    },mounted(){
      this.getInfo();
    },
  }
</script>

<style scoped>
  .message {
    color: #333;
  }

  .message .flex-row-nowarp {
    padding-left: 1.5rem;
    padding-right: .6rem;
  }

  .message .flex-row-nowarp:first-child {
    padding-left: 1rem;
  }
</style>
