<template>
  <yd-layout class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="titleText" :title="titleText" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span class="spanLeft" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
        <span slot="right" @click="fillConfirm" class="font30 spanRight">确定</span>
      </yd-navbar>
    </div>

    <div v-if="this.$route.hash == '#nickname'" class="box"><span><input type="text" v-model="user.nickname" maxlength="8"></span></div>

    <div v-else-if="this.$route.hash == '#interest'" class="box1">
        <ul>
          <li v-for="(item,index) in interestList" :key="index" @click="checkBox(index)" :style="{background:addArr.indexOf(item.guid)!=-1?mainColor:'',color:addArr.indexOf(item.guid)!=-1?'white':''}">
               {{item.dictDataName}}
          </li>
        </ul>
    </div>

    <div v-else-if="this.$route.hash== '#introduceMyself'" class="box2">
      <span>
        <textarea v-model="users.introduceMyself"  name="" id="" placeholder="填写内容" maxlength="20"></textarea>
    </span></div>

    <div v-else-if="this.$route.hash== '#workplace'" class="box2">
      <span>
        <textarea v-model="users.workplace"  name="" id="" placeholder="填写内容" maxlength="20"></textarea>
    </span></div>


    <div v-else-if="this.$route.hash == '#valueCenter'" class="box1">
        <ul>
          <li v-for="(item,index) in valueCenterList" :key="index" @click="checkBox1(index)" :style="{background:addArr1.indexOf(item.guid)!=-1?mainColor:'',color:addArr1.indexOf(item.guid)!=-1?'white':''}">
               {{item.dictDataName}}
          </li>
        </ul>
    </div>

    <div v-else-if="this.$route.hash == '#constellatio'" class="box3">
        <label for="" v-for="(item,index) in constellatioList" :key="index" @click="checkBox2(index)" :style="{background:users.constellatio==item.name||num==index?mainColor:''}">
                 <span class="font30 font600" :style="{color:users.constellatio==item.name||num==index?'white':''}">{{item.name}}</span>
                 <a class="font24" :style="{color:users.constellatio==item.name||num==index?'white':''}">{{item.time}}</a>
         </label>
    </div>

    <div v-if="this.$route.hash == '#wechat'" class="box"><span><input type="text" v-model="users.wechat" maxlength="14"></span></div>

    <div v-if="this.$route.hash == '#qq'" class="box"><span><input type="text" v-model="users.qq" maxlength="11"></span></div>

    <div v-else-if="this.$route.hash== '#logisticsAddress'" class="box2">
      <span>
        <textarea v-model="users.logisticsAddress"  name="" id="" placeholder="填写内容" maxlength="20"></textarea>
      </span>
    </div>

  </yd-layout>
</template>
<script>
  import Vue from 'vue';
  import store from '@/store'
  import {Search} from 'vue-ydui/dist/lib.rem/search';

  Vue.component(Search.name, Search);


import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog';

Vue.prototype.$dialog = {
    confirm: Confirm,
    alert: Alert,
    toast: Toast,
    notify: Notify,
    loading: Loading,
};

  import fn from '@/assets/js/product'
  import qs from 'qs'

  export default {
    data() {
      return {
        regName:/^[\u4e00-\u9fa5a-zA-Z0-9_]{1,8}$/,
        regText:/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/,
        regWechat:/^[0-9a-zA_Z]+$/,
        regQq:/^\d{5,11}$/,
        mainColor: "",
        num:null,
        userInfo:'',
        organInfo:'',
        titleText:'',
        user:{

        },
        users:{

        },
        interestList:[],
        valueCenterList:[],
        addArr:[],
        addArr1:[],
        piacked:'',
        constellatioList:[
          {time:'3.12-4.19',name:'白羊座'},
          {time:'4.20-4.5.20',name:'金牛座'},
          {time:'5.21-6.21',name:'双子座'},
          {time:'6.22-7.22',name:'巨蟹座'},
          {time:'7.23-8.22',name:'狮子座'},
          {time:'8.23-9.22',name:'处女座'},
          {time:'9.23-10.23',name:'天枰座'},
          {time:'10.24-11.22',name:'天蝎座'},
          {time:'11.23-12.21',name:'射手座'},
          {time:'12.22-1.19',name:'摩羯座'},
          {time:'1.20-2.28',name:'水瓶座'},
          {time:'2.29-3.20',name:'双鱼座'}
          ]
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
      keepData(key,value){
       this.xhr.post(`${this.subUrl.user}/user/saveUserInfo?userId=`+this.userId+'&token='+this.getkey+'&'+key+'='+value).then((res) => {
          if (res.data.code == 1) {
              this.$dialog.toast({mes: res.data.msg,timeout: 600});
              this.$router.push('/my/setting/user_info')
          }
       })
      },
      fillConfirm(){

       if(this.$route.hash=='#nickname'){
          if(this.user.nickname==null){
            return this.$dialog.toast({mes: '呢称不能为空！',timeout: 600});
            this.$router.push('#')
          }else if(!this.regName.test(this.user.nickname)){
           return this.$dialog.toast({mes: '呢称不规范！',timeout: 600});
          }else{
            this.keepData('nickname',this.user.nickname)
          }
       }else if(this.$route.hash=='#interest'){
            let arrString=this.addArr.join(',')
            this.keepData('interest',arrString)
       }else if(this.$route.hash=='#introduceMyself'){
          if(this.users.introduceMyself==null){
          return this.$dialog.toast({mes: '内容不能为空！',timeout: 600});
          }else if(!this.regText.test(this.users.introduceMyself)){
           return this.$dialog.toast({mes: '内容符合不规范！',timeout: 600});
          }else{
            this.keepData('introduceMyself',this.users.introduceMyself)
          }
       }else if(this.$route.hash=='#workplace'){
          if(this.users.workplace==null){
          return this.$dialog.toast({mes: '内容不能为空！',timeout: 600});
          }else if(!this.regText.test(this.users.workplace)){
           return this.$dialog.toast({mes: '内容符合不规范！',timeout: 600});
          }else{
            this.keepData('workplace',this.users.workplace)
          }
       }else if(this.$route.hash=='#valueCenter'){
            let arrString=this.addArr1.join(',')
            this.keepData('valueCenter',arrString)
       }else if(this.$route.hash== '#constellatio'){
            this.keepData('constellatio',this.piacked)
       }else if(this.$route.hash=='#wechat'){
          if(this.users.wechat==null){
          return this.$dialog.toast({mes: '内容不能为空！',timeout: 600});
          }else if(!this.regWechat.test(this.users.wechat)){
           return this.$dialog.toast({mes: '内容符合不规范！',timeout: 600});
          }else{
            this.keepData('wechat',this.users.wechat)
          }
       }else if(this.$route.hash=='#qq'){
          if(this.users.qq==null){
          return this.$dialog.toast({mes: '内容不能为空！',timeout: 600});
          }else if(!this.regQq.test(this.users.qq)){
           return this.$dialog.toast({mes: '内容符合不规范！',timeout: 600});
          }else{
            this.keepData('QQ',this.users.qq)
          }
       }else if(this.$route.hash=='#logisticsAddress'){
          if(this.users.logisticsAddress==null){
          return this.$dialog.toast({mes: '内容不能为空！',timeout: 600});
          }else if(!this.regText.test(this.users.logisticsAddress)){
           return this.$dialog.toast({mes: '内容符合不规范！',timeout: 600});
          }else{
            this.keepData('logisticsAddress',this.users.logisticsAddress)
          }
       }


      },
      getHobby(){
        this.xhr.post(`${this.subUrl.user}/comm/getHobby`).then((res) => {

          if (res.data.code == 1) {
              this.interestList=res.data.data
          }
       })
       var str=this.users.interest;
       this.addArr=str.split(',')
      },
      getValueCenter(){
        this.xhr.post(`${this.subUrl.user}/comm/getValueCenter`).then((res) => {

          if (res.data.code == 1) {
              this.valueCenterList=res.data.data
          }
       })
       var str=this.users.valueCenter;
       this.addArr1=str.split(',')

      },
      checkBox(index){

          if(this.addArr.indexOf(this.interestList[index].guid)==-1&&this.addArr.length<=5){

          this.addArr.push( this.interestList[index].guid )

         }else if(this.addArr.indexOf(this.interestList[index].guid)!=-1){
          let str=this.interestList[index].guid

          this.addArr.splice(this.addArr.indexOf(str),1)
         }
         this.addArr.sort( (a,b)=>{return a-b} )

       },
       checkBox1(index){
         if(this.addArr1.indexOf(this.valueCenterList[index].guid)==-1&&this.addArr1.length<=5){

          this.addArr1.push( this.valueCenterList[index].guid )

         }else if(this.addArr1.indexOf(this.valueCenterList[index].guid)!=-1){
          let str=this.valueCenterList[index].guid

          this.addArr1.splice(this.addArr1.indexOf(str),1)
         }
         this.addArr1.sort( (a,b)=>{return a-b} )

       },
       checkBox2(index){
          this.num=index;
          this.piacked=this.constellatioList[index].name;
          this.users.constellatio=this.constellatioList[index].name;
       },

    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.user = JSON.parse(decodeURIComponent(localStorage.getItem('user')));
      this.users = JSON.parse(decodeURIComponent(localStorage.getItem('users')));

      this.mainColor = localStorage.getItem('mainColor');
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      this.userId = this.userInfo.guid;

      if(this.$route.hash=='#nickname'){
          this.titleText='呢称'
      }else if(this.$route.hash=='#interest'){
          this.titleText='兴趣爱好'
          this.getHobby()
      }else if(this.$route.hash=='#introduceMyself'){
          this.titleText='自我介绍'
      }else if(this.$route.hash== '#workplace'){
          this.titleText='工作地'
      }else if(this.$route.hash=='#valueCenter'){
          this.titleText='价值中心'
          this.getValueCenter()
      }else if(this.$route.hash== '#wechat'){
          this.titleText='微信'
      }else if(this.$route.hash== '#qq'){
          this.titleText='QQ'
      }else if(this.$route.hash== '#logisticsAddress'){
          this.titleText='物流地址'
      }else if(this.$route.hash== '#constellatio'){
          this.titleText='星座'
      }


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
    background-size: 100% 100%;
    color:white;
  }

  .box{width:100%;display:flex;justify-content:center;align-items:center;height:1.2rem;background:#F3F3F3;padding:.2rem .3rem;border-bottom:1px solid #D8D8D8;}
  .box span{width:100%;height:100%;background:white;border:1px solid #D8D8D8;border-radius:.06rem;padding:.1rem .1rem;}
  .box span>input{width:100%;height:100%;border:none;color:#777;}

  .box1{width:100%;display:flex;padding:.28rem .28rem;}
  .box1 ul{width:100%;display:flex;flex-flow:row wrap;align-items:center;}
  .box1 ul li{width:22%;;height:.75rem;border:1px solid #E6E6E6;display:flex;justify-content:center;align-items:center;border-radius:.8rem;margin:.1rem .1rem;}

  .box2{width:100%;display:flex;padding:.2rem .2rem;}
  .box2 span{width:100%;border:1px solid #D8D8D8;border-radius:.06rem;background:white;}
  .box2 span>textarea{width:100%;height:2rem;border:none;}

  .box3{width:100%;display:flex;flex-flow:row wrap;padding:.1rem .1rem;}
  .box3 label{width:30%;height:.9rem;border:1px solid #E1E1E1;border-radius:.9rem;display:flex;flex-flow:column;
  justify-content:center;align-items:center;margin:.1rem .1rem}
  .box3 label>span{color:#333;letter-spacing:.07rem;}
  .box3 label>a{color:#AAAAAA;}

</style>
