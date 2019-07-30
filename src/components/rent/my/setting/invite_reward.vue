<template>
  <yd-layout class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'邀请奖励'" title="邀请奖励" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span class="spanLeft" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>

      </yd-navbar>
    </div>
    <div class="reward_i" @scroll="scrollHandler" ref="listDom">
        <div class="points">
           <p class="font24">提示：不同等级付费会员，佣金不同；</p>
           <span class="font24">预估佣金为最低等级起，无付费只有积分奖励</span>
        </div>
        <div class="reward_list">
            <ul v-for="(item,index) in userL" :key="index">
               <li>
                  <p class="font32 font600">{{item.organName}}</p>
                  <span class="font24">{{item.payDate}}</span>
               </li>
               <li class="text_r">
                  <p class="font32 font700">+{{item.estimateReward}}</p>
                  <span class="font24">预估奖励</span>
               </li>
               <li class="text_r rr">
                  <p class="font32 font700">+{{item.actualReward}}</p>
                  <span class="font24">实际奖励</span>
               </li>
            </ul>
        </div>
        <div  class="Section" v-show="pageSize<rowCount">
            <div v-if="pageNo <= pageCount">
              <div class="a b1">
                <ul>
               <li></li>
               <li></li>
               <li></li>
                </ul></div>

            </div>
            <div v-else>啦啦啦，啦啦啦，没有数据啦~~</div>
        </div>
        <div v-show="userL.length==0" style="width:100%;height:3rem;display:flex;
        justify-content:center;align-items:center;color:#999;">~~暂无相关数据~~</div>
    </div>
  </yd-layout>
</template>
<script>
  import Vue from 'vue';
  import fn from '@/assets/js/product'
  import qs from 'qs'
  import store from '@/store'
  export default {
    data() {
      return {
        mainColor: "",
        userL:[],
        userId:'',
        getkey:'',
        pageNo:1,
        pageSize:9,
        pageCount:null,
        rowCount:null
      }
    },
    methods: {
      scrollHandler(){

        if(store.loading||this.pageNo > this.pageCount){
            return
         }
        let listDom = this.$refs.listDom;
        if(listDom.scrollHeight - listDom.scrollTop - listDom.clientHeight < 100){
        this.inviteRewards()
        }

      },
      turnTo(url) {
        this.$router.push(url)
      },
      back(){
        this.$router.go(-1)
      },
      inviteRewards(){
        var data = {userId: this.userId,
        token:this.getkey,
        pageNo:this.pageNo,
        pageSize:this.pageSize,};
        this.xhr.post(`${this.subUrl.user}/user/inviteRewards`, qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
            
            this.pageCount=res.data.data.pageCount;
            this.rowCount=res.data.data.rowCount;
            if(res.data.data.list!=null){
               if(this.pageNo>=2){
                this.userL=this.userL.concat(res.data.data.list);
               }else{
               this.userL=res.data.data.list;
              }
            }else{

            }
            this.pageNo++;
             
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      },

    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = localStorage.getItem('mainColor');
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      this.inviteRewards()
    }
  }
</script>
<style scoped>
  .layout_my .header:after {
    display: none;

  }
  .layout_my{
background:#F7F7F9;
  }

  .layout_my .blue_box {
    height: 0.88rem;
    background: #0093D2;
    background-size: 100% 100%;
  }
  .reward_i{width:100%;height:calc( 100vh - .88rem );overflow-y: scroll;}
  .points{width:100%;padding:.2rem .2rem;color:#9C9C9D;}
  .reward_list{width:100%;padding:0 .3rem;border-top:1px solid #F1F1F2;border-bottom:1px solid #F1F1F2;background:white;}
  .reward_list ul{display:flex;flex-direction:row;border-bottom:1px solid #F6F6F6;padding:.2rem 0;}
  .reward_list ul:last-child{border:none;}
  .reward_list ul li:nth-child(1){flex:6;}
  .reward_list ul li:nth-child(2),.reward_list ul li:nth-child(3){flex:2;}
  .reward_list ul li p{margin-bottom:.2rem;}
  .reward_list ul li span{color:#AFAFAF;}
  .text_r{display:flex;flex-direction:column;align-items:flex-end;}
  .text_r.rr p{color:#FF3232;}

  /*消息列表结束*/
</style>
