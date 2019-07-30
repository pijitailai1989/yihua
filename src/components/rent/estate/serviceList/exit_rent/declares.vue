<template>
  <yd-layout class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'办理退租'" title="办理退租" color="#fff" :bgcolor="mainColor" height=".88rem">
        <span class="spanLeft" @click="back" slot="left">
          <span>
            <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
          </span>
        </span>
        <span @click="addSurrender" slot="right" class="addRightClickArea" style="color: #fff;font-size:.28rem;">提交</span>
      </yd-navbar>
    </div>

    <div class="declares">
        <ul class="bgwhite">
            <li><p>租用单元</p><i>{{userInfo.ridName}}{{userInfo.unitName}}</i></li>
            <li><p>租户名称</p><i>{{userInfo.organName}}</i></li>
            <li v-if="info.startTime"><p>起止时间:</p><i>{{info.startTime.replace(/-/g,'/').split(' ')[0]}}-{{info.endtime.replace(/-/g,'/').split(' ')[0]}}</i></li>
          <li><p style="height:.7rem;">迁出原因</p><span><input type="text" maxlength="40" v-model="bm.cause"></span></li>
            <li><p style="height:.7rem;">迁出时间</p><span style="display:flex;justify-content:center;align-items:center;">
              <yd-datetime type="date" v-model="bm.applyLeaveTime" slot="right"></yd-datetime></span></li>
        </ul>
        <div v-if="info.ownerInfo" class="bgwhite">
            <p>业主信息</p>
            <ol>
            <li><p>业主</p><i>{{info.ownerInfo.name}}</i></li>
            <li><p>手机号</p><i>{{info.ownerInfo.account}}</i></li>
            </ol>
        </div>
    </div>


  </yd-layout>
</template>
<script>
  import Vue from 'vue';
  import fn from '@/assets/js/product'
  import qs from 'qs'
  import { DateTime } from 'vue-ydui/dist/lib.rem/datetime';
  import store from '@/store'
  Vue.component(DateTime.name, DateTime);
  export default {
    data() {
      return {
        info:{},
        mainColor: "",
        userInfo:{},
        organInfo:{},
        title:'',
        contentList: [],
        show: false,
        bm:{
          token:'',
          userId:'',
          surrenderOrganId:'',
          unitId:'',
          cause:'',
          applyLeaveTime:this.$today()
        }
      }
    },
    methods: {

      turnTo(url) {
        this.$router.push(url)
      },
      back() {
        history.back()
      },
      addSurrender() {
        let data={
          token:this.bm.token,
          userId:this.bm.userId,
          surrenderOrganId:this.bm.surrenderOrganId,
          cause:this.bm.cause,
          applyLeaveTime:this.bm.applyLeaveTime+' 00:00:00',
          endtime:this.info.endtime,
          startTime:this.info.startTime
        };
        if(this.bm.cause == ""){
          return this.$dialog.toast({mes:"请输入迁出原因"});
        }
        this.xhr.post(`${this.subUrl.activity}/surrender/addSurrender`, qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
            this.$dialog.toast({mes:"申请成功",icon:"success"});
            this.$router.go(-1);
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        })
      },
      getSettleInfo(){
        let data = {
          token:this.$getkey(),
          userId:this.userInfo.guid,
        }
        this.$ajax(`${this.subUrl.activity}/surrender/surrenderInfo`,data,res=>{
          this.info = res.data;
        },this)
      }
    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = this.$color[this.userInfo.organType]
      this.getSettleInfo();
      this.bm.userId = this.userInfo.guid;
      this.bm.surrenderOrganId = this.organInfo.guid;
      this.bm.unitId = this.userInfo.unitId;
      this.bm.token = fn.getIng();
      console.log(this.organInfo,this.userInfo)
      if(this.$route.hash=='#1'){
           this.show=false;
           this.title='办理访客出入'
      }else if(this.$route.hash=='#2'){
           this.show=true;
           this.title='办理物品放行'
      }
    }
  }
</script>
<style scoped>
  .layout_my .header:after {
    display: none;

  }

  .layout_my {
    background: #F7F7F9;
  }

  .layout_my .blue_box {
    height: 0.88rem;
    background: #0093D2;
    background-size: 100% 100%;
  }

  .declares{width:100%;}
  .declares ul{width:100%;padding:.2rem .4rem;border-bottom:1px solid #D9D9D9;}
  .declares ul li{display: flex;flex-flow:row;justify-content: center;margin:.2rem 0;}
  .declares ul li>p{width:1.6rem;display: flex;justify-content: center;height:.5rem;align-items: center;font-size: .3rem;color:#777;}
  .declares ul li>span{flex:1;height:.7rem;border:1px solid #D9D9D9;border-radius: .05rem;}
  .declares ul li>i{flex:1;height:.5rem;display: flex;align-items: center;}
  .declares ul li>span>input{width:100%;height:100%;border:none;margin-left:.1rem;}
  .declares>div{margin-top:.2rem;border-top:1px solid #D9D9D9;}
  .declares>div>p{padding:.2rem .3rem;border-bottom:1px solid #D9D9D9;}
  .declares>div ol{width:100%;padding:.1rem 0;border-bottom:1px solid #D9D9D9;}
  .declares>div ol li{display: flex;flex-flow:row;justify-content: center;margin:.2rem 0;}
  .declares>div ol li>p{width:1.6rem;display: flex;justify-content: center;height:.5rem;align-items: center;font-size: .3rem;color:#777;}
  .declares>div ol li>i{flex:1;height:.5rem;display: flex;align-items: center;}
  .declares>div ol li>span>input{width:100%;height:100%;border:none;margin-left:.1rem;}

</style>
