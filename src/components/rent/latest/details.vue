<template>
  <yd-layout class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'消息详情'" title="消息详情" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span class="spanLeft" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
        
      </yd-navbar>
    </div>

   <div class="detail">
      <div class="top">
          <i><img :src="detail.img" alt=""></i>
          <p>
              <a class="font30">{{detail.title}}</a>
              <span class="font26" style="color:#999;margin-top:.1rem;">{{detail.messageDate}}</span>
          </p>
      </div>
      <div class="bottom">
          <p class="textHidden">{{detail.title}}</p>
          <span>{{detail.content}}</span>
          <a>消息详情如果有链接，点击右上角打开链接</a>
      </div>

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
        detail:'',
        pm:{
          userId:'',
          getkey:'',

        }
        
      }
    },
    methods: {
      turnTo(url) {
        this.$router.push(url)
      },
      back(){
          history.back()
      },

      listCommMessage(){
        
        var data = {
          userId: this.pm.userId,
          token:this.pm.getkey,
          commMessageId:this.$route.params.guid
          };

        this.xhr.post(`${this.subUrl.user}/commMessage/getCommMessage`, qs.stringify(data)).then((res) => {
            console.log(res)
          if (res.data.code == 1) {
              if(res.data.data!=null){
                 this.detail=res.data.data;
                 this.detail.messageDate=this.detail.messageDate.substring(0,16);
                 if(this.detail.type==1){
                     this.detail.img=require('../../../assets/images/rent/my/l1.png')
                 }else if(this.detail.type==2){
                     this.detail.img=require('../../../assets/images/rent/my/l2.png')
                 }else if(this.detail.type==3){
                     this.detail.img=require('../../../assets/images/rent/my/l3.png')
                 }else if(this.detail.type==4){
                     this.detail.img=require('../../../assets/images/rent/my/l4.png')
                 }else if(this.detail.type==5){
                     this.detail.img=require('../../../assets/images/rent/my/l5.png')
                 }
              }
            
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
      this.pm.userId = this.userInfo.guid;
      this.pm.getkey = fn.getIng();
      this.listCommMessage();

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
  .detail{width:100%;height:calc( 100vh - .88rem );background: white;}
  .detail .top{width:100%;height:1.6rem;display: flex;align-items: center;padding:0 .3rem;}
  .detail .top>i{width:.65rem;height:.65rem;border-radius: 50%;margin-right:.2rem;}
  .detail .top>i>img{width:100%;height:100%;border-radius: 50%;}
  .detail .top>p{display: flex;flex-flow:column;}

  .detail .bottom{width:100%;display: flex;flex-flow:column;padding:0 .3rem;}
  .detail .bottom>p{text-indent: .7rem;padding:.1rem 0 .3rem;font-size:.32rem;font-weight: 600;}
  .detail .bottom>span{text-indent: .7rem;font-size:.28rem;line-height: .5rem;color:#666;}
  .detail .bottom>a{width:100%;font-size:.28rem;color:#666;text-align: center;margin-top:.8rem;text-decoration:underline}
</style>
