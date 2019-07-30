<template>
  <yd-layout class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="titleT" :title="titleT" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span class="spanLeft" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
         </span>
      </yd-navbar>
    </div>

   <div class="details">

       <ul v-if='show'>
           <li><p class="font26">奖励商机点</p><span>{{date.businessPoint}}</span></li>
           <li class="font26"><p>会员名称</p><span>{{date.explains}}</span></li>
           <li class="font26"><p>邀请时间</p><span>{{date.createTime}}</span></li>
       </ul>
          <ul v-else>
              <li><p class="font26">消费商机点</p><span>- {{date.businessPoint}}</span></li>
              <li class="font26"><p>商家名称</p><span>{{date.explains}}</span></li>
              <li class="font26"><p>邀付费时间</p><span>{{date.createTime}}</span></li>
          </ul>
          
   </div>

  </yd-layout>
</template>
<script>
  import Vue from 'vue';
  import fn from '@/assets/js/product'
  import qs from 'qs'

  export default {
    data() {
      return {
        mainColor: "",
        value1: '',
        num:0,
        userInfo:'',
        organInfo:'',
        show:true,
        titleT:'',
        date:{
          businessPoint:'',
          explains:'',
          createTime:''
        }
      }
    },
    computed:{
        
    },
    methods: {
      
      turnTo(url) {
        this.$router.push(url)
      },
      back(){
          history.back()
      },
      
    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = localStorage.getItem('mainColor');
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      console.log(this.$route)
         if(this.$route.query.type==3){
                this.show=true;
                this.titleT="邀请商家明细"
         }else if(this.$route.query.type==5){
               this.show=false;
               this.titleT="查看商机明细"
         }
         this.date.businessPoint=this.$route.query.businessPoint
         this.date.explains=this.$route.query.explains
         this.date.createTime=this.$route.query.createTime

    },
    beforeUpdate(){

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

 .details{width:100%;}
 .details ul{width:100%;background: white;}
 .details ul li{display: flex;align-items: center;padding:0 .3rem;height:.6rem;}
 .details ul li>p{width:1.5rem;color:#999;}
 .details ul li:nth-child(1){height:1.4rem;border-bottom:1px solid #F1F1F1;justify-content: space-between}
 .details ul li:nth-child(1)>span{font-size:.6rem;}
</style>
