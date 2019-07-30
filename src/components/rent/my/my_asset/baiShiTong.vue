<template>
  <yd-layout class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'百事通'" title="百事通" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span class="spanLeft" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
      </yd-navbar>
    </div>
   <div class="tab_two">
       <ul>
         <li class="font600 font30" v-for="(item,index) in tabT" :key='index' @click="toggle(index)"
          :style="{background:num==index?mainColor:'',color:num==index?'white':''}">{{item}}</li>
         </ul>
   </div>

   <div class="news" @scroll="scrollHandler" ref="listDom">

       <ul v-if="!num">
         <li v-for="(item,index) in news" :key="index">
             <p>
                <span class="font28">{{item.type}}</span>
                <span class="font24">{{item.data}}&nbsp;{{item.time}}</span>
             </p>
             <p class="font32 font600">+{{item.price}}</p>
         </li>
       </ul>
       <ul v-else>
         <li v-for="(item,index) in news1" :key="index">
             <p>
                <span class="font28">{{item.explains}}</span>
                <span class="font24">{{item.createTime}}</span>
             </p>
             <p class="font32 font600">-{{item.businessPoint}}</p>
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
        <div v-show="show" style="width:100%;height:3rem;display:flex;
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
        tabT:['收入记录','消费记录'],
        num:1,
        news:[],
        news1:[],
        userInfo:'',
        organInfo:'',
        userId:'',
        getkey:'',
        pageNo:1,
        pageSize:10,
        pageCount:null,
        rowCount:null,
        show:false,
      }
    },
    methods: {
      turnTo(url) {
        this.$router.push(url)
      },
      back(){
          history.back()
      },
      submitHandler(value) {
                this.$dialog.toast({mes: `搜索：${value}`});
      },
      toggle(index){
        this.pageNo=1;
         this.num=index;
         this.getBpLog(index+1)
      },
      scrollHandler(){

        if(store.loading||this.pageNo > this.pageCount){
            return
         }
        let listDom = this.$refs.listDom;
        if(listDom.scrollHeight - listDom.scrollTop - listDom.clientHeight < 100){
                this.getBpLog(this.num)
        }

      },
      getBpLog(index){
        console.log(index)
        var data = {userId: this.userId,
        token:this.getkey,
        pageNo:this.pageNo,
        pageSize:this.pageSize, type:4,consumeType:index};
        this.xhr.post(`${this.subUrl.user}/asset/getBpLog`, qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
            this.pageCount=res.data.data.pageCount;
              this.rowCount=res.data.data.rowCount;
            if(index==1){
               if(res.data.data.list.length!=0){
                 this.show=false;
               if(this.pageNo>=2){
                this.news=this.news.concat(res.data.data.list);
               }else{
               this.news=res.data.data.list;
              }
             }else{
               this.show=true;
             }
            }else if(index==2){
               if(res.data.data.list.length!=0){
                 this.show=false;
               if(this.pageNo>=2){
                this.news1=this.news1.concat(res.data.data.list);
               }else{
               this.news1=res.data.data.list;
              }
             }else{
               this.show=true;
             }
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
      this.getBpLog(2)
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
  .tab_two{width:100%;height:1.1rem;padding:0.2rem 1.2rem;background:#F7F7F9;}
  .tab_two ul{width:100%;height:.7rem;display:flex;flex-direction:row;border-radius:.1rem;background:white;}
  .tab_two ul li{width:50%;height:.7rem;text-align:center;line-height:.7rem;}
  .tab_two ul li:nth-child(1){border-radius:.1rem 0 0 .1rem}
  .tab_two ul li:nth-child(2){border-radius:0 .1rem .1rem 0}

  .green {background: #23AC38;color:white;}
  .orange{background: #FAB23E;color:white;}
  .blue{background:#0093D2;color:white;}

  .news{width:100%;background:white;height:calc( 100vh - 1.98rem );overflow-y: scroll;border-bottom:1px solid #F3F3F4;}
  .news>ul{width:100%;padding:0 .2rem}
  .news>ul li{display:flex;flex-direction:row;padding:.2rem 0;border-bottom:1px solid #F8F8F8;}
  .news>ul li p:nth-child(1){flex:8;display:flex;flex-direction:column;}
  .news>ul li p:nth-child(1) span{margin:.05rem 0;}
  .news>ul li p:nth-child(1) span:nth-child(2){margin:.05rem 0;color:#A3A3A3;}
  .news>ul li p:nth-child(2){flex:2;display:flex;justify-content:center;align-items:center;color:#FF3D3D;}
</style>
