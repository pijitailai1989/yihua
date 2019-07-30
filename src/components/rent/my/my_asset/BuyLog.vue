<template>
  <yd-layout class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'充值记录'" title="充值记录" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span class="spanLeft" @click="back" slot="left">
            <span ><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
      </yd-navbar>
    </div>

   <div class="news" @scroll="scrollHandler" ref="listDom">

       <ul>
         <li v-for="(item,index) in takes" :key="index">
             <div>
                <p class="font28">{{item.explains}}</p>
                <span class="font22">{{item.createTime}}</span>
             </div>
             <div>
                <p class="font28">{{item.puyType?'微信支付':''}}</p>
             </div>
             <div>
                <p class="font28">{{item.totalFee}}元</p>
                <span class="font22">{{item.source?'交易成功':'交易失败'}}</span>
             </div>
         </li>
       </ul>
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
        <div v-show="takes.length==0" style="width:100%;height:3rem;display:flex;
        justify-content:center;align-items:center;color:#999;">~~暂无相关数据~~</div>

   </div>

  </yd-layout>
</template>
<script>
  import Vue from 'vue';
  import store from '@/store'
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
        takes:[],
        organAccount:'',
        enterprise:false,
        userId:'',
        getkey:'',
        pageNo:1,
        pageSize:14,
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
                if(this.enterprise==true){
             this.getBuyLog(this.organAccount);
               }else{
              this.getBuyLog(this.userId)
                }
        }

      },
      turnTo(url) {
        this.$router.push(url)
      },
      back(){
          history.back()
      },
      getBuyLog(value){
        var data = {userId: this.userId,
        token:this.getkey,
        pageNo:this.pageNo,
        pageSize:this.pageSize,};
        this.xhr.post(`${this.subUrl.user}/asset/getBuyLog`, qs.stringify(data)).then((res) => {

          if (res.data.code == 1) {
              this.pageCount=res.data.data.pageCount;
              this.rowCount=res.data.data.rowCount;
            if(res.data.data.list!=null){
               if(this.pageNo>=2){
                this.takes=this.takes.concat(res.data.data.list);
               }else{
               this.takes=res.data.data.list;
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
      }
    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = localStorage.getItem('mainColor');
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();

      this.organAccount = this.organInfo.organAccount;
      this.enterprise =  JSON.parse(decodeURIComponent(localStorage.getItem('enterprise')));

      if(this.enterprise==true){
        this.getBuyLog(this.organAccount);
      }else{
        this.getBuyLog(this.userId)
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
    background: #0093D2;
    background-size: 100% 100%;
  }
.news{width:100%;padding:0 .2rem;background:white;
height:calc( 100vh - .88rem );border-bottom:1px solid #EDEDEE;
overflow-y: scroll;}
.news>ul{width:100%;}
.news>ul li{width:100%;display:flex;flex-flow:row wrap;border-bottom:1px solid #F1F1F1;}
.news>ul li>div{display:flex;flex-flow:column wrap;justify-content:center;padding:.1rem 0;}
.news>ul li>div p{margin-bottom:.05rem;}
.news>ul li>div:nth-child(1){flex:5;}
.news>ul li>div:nth-child(2){flex:3;}
.news>ul li>div:nth-child(3){flex:2;}
.font22{color:#B1B1B1;}

</style>
