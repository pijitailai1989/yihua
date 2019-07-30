<template>
  <yd-layout class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'积分明细'" title="积分明细" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span class="spanLeft" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
      </yd-navbar>
    </div>


   <div class="news" @scroll="scrollHandler" ref="listDom">

       <ul>
         <li v-for="(item,index) in news" :key="index">
             <p>
                <span class="font28">{{item.explains}}</span>
                <span class="font24">{{item.createTime}}</span>
             </p>
             <p class="font32 font600"><a v-show="item.consumeType==1">+</a><a v-show="item.consumeType==2">-</a>{{item.integral}}</p>
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
        <div v-show="news.length==0" style="width:100%;height:3rem;display:flex;
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
        news:[],
        userInfo:'',
        organInfo:'',
        userId:'',
        getkey:'',
        pageNo:1,
        pageSize:12,
        pageCount:null,
        rowCount:null
      }
    },
    methods: {
      turnTo(url) {
        this.$router.push(url)
      },
      back(){
          history.back()
      },
      scrollHandler(){

        if(store.loading||this.pageNo > this.pageCount){
            return
         }
        let listDom = this.$refs.listDom;
        if(listDom.scrollHeight - listDom.scrollTop - listDom.clientHeight < 100){
               this.getIntegralLog()
        }

      },
      getIntegralLog(){
        var data = {userId: this.userId,
        token:this.getkey,
        pageNo:this.pageNo,
        pageSize:this.pageSize,};
        this.xhr.post(`${this.subUrl.user}/asset/getIntegralLog`, qs.stringify(data)).then((res) => {

          if (res.data.code == 1) {
              this.pageCount=res.data.data.pageCount;
              this.rowCount=res.data.data.rowCount;
            if(res.data.data.list!=null){
               if(this.pageNo>=2){
                this.news=this.news.concat(res.data.data.list);
               }else{
               this.news=res.data.data.list;
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
      this.getIntegralLog()
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


  .news{width:100%;background:white;
  border-bottom:1px solid #F3F3F4;height:calc( 100vh - .88rem );overflow-y: scroll;}
  .news>ul{width:100%;padding:0 .2rem}
  .news>ul li{display:flex;flex-direction:row;padding:.2rem 0;border-bottom:1px solid #F8F8F8;}
  .news>ul li p:nth-child(1){flex:8;display:flex;flex-direction:column;}
  .news>ul li p:nth-child(1) span{margin:.05rem 0;}
  .news>ul li p:nth-child(1) span:nth-child(2){margin:.05rem 0;color:#A3A3A3;}
  .news>ul li p:nth-child(2){flex:2;display:flex;justify-content:center;align-items:center;color:#333;}
</style>
