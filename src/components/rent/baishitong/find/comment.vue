<template>
   <yd-layout>
        <yd-navbar style="height:0.88rem" slot="navbar" :bgcolor="mainColor" color="#fff" :title="titleT" v-show="!userAgent.isWX"  v-title="titleT">
            <span class="spanLeft" @click="back" slot="left">
                <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
            </span>
        </yd-navbar>
        <div class="comment">
            <ul>
                <li><span>给他打分</span></li>
                <li><yd-rate v-model="parameter.rate"></yd-rate></li>
                <li>
                   <yd-textarea style="width:100%;height:2rem" v-model="parameter.content" slot="right" placeholder="请输入..." maxlength="100"></yd-textarea>
                </li>
                <li><button @click="comment" :style="{background:mainColor,fontSize:'.32rem'}">提 交</button></li>
            </ul>
        </div>
</yd-layout>
</template>
<script>
  import Vue from 'vue';
  import fn from '@/assets/js/product'
  import qs from 'qs'
  import {Rate} from 'vue-ydui/dist/lib.rem/rate';
  Vue.component(Rate.name, Rate);
  import {TextArea} from 'vue-ydui/dist/lib.rem/textarea';
  Vue.component(TextArea.name, TextArea);

  export default {
    data() {
      return {
        mainColor: "",
        organInfo:'',
        userInfo:'',
        titleT:'评论',
        

        parameter:{
          rate:0,
          token:'',
          userId:null,
          kaId:null,
          content:'',
        },

      }

    },
    methods: {
      turnTo(url) {
        this.$router.push(url)
      },
      back(){
        this.$router.go(-1)
      },
      toggle(){
          this.show=!this.show;
      },
      comment(){
         if(this.parameter.content!=''&&this.parameter.rate!=0){
           
           var data={
             userId:this.parameter.userId,
             token:this.parameter.getkey,
             kaId:this.parameter.kaId,
             grade:this.parameter.rate,
             content:this.parameter.content
             }
            this.xhr.post(`${this.subUrl.bd}/knowAll/comment`, qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
              this.$dialog.toast({mes: "评论成功！",icon: 'success'});
              this.$router.go(-1)
          } else if (res.data.code == '-902'){
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
         }else{
            this.$dialog.toast({mes: "评分和内容必填！",icon: 'error'});
         }
       },

          


    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = localStorage.getItem('mainColor');
      this.parameter.userId = this.userInfo.guid;
      this.parameter.getkey = fn.getIng();
      this.parameter.kaId = this.$route.params.kaId;

    },
    beforeUpdate(){

    }
  }
</script>
<style scoped>
  .comment{width: 100%;height:calc(100vh - 1rem);background: white;padding:1rem .5rem;}
  .comment ul{width:100%;}
  .comment ul li{padding:.2rem 0;display: flex;justify-content: center;align-items: center;color:#9A9A9A;}
  .comment ul li:nth-child(3){width: 100%;height:2.4rem;border:1px solid #9A9A9A;
  border-radius: .1rem;padding:.1rem .1rem;margin-top:.2rem;}
  .comment ul li:nth-child(4){margin-top:.7rem;}
  .comment ul li:nth-child(4)>button{width:2rem;height:.7rem;color:white;border-radius: .1rem;border:none;}
</style>
