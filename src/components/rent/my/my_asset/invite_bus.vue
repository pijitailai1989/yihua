<template>
  <yd-layout class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'邀请商家'" title="邀请商家" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span class="spanLeft" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
      </yd-navbar>
    </div>

   <div class="invite" @scroll="scrollHandler" ref="listDom">

       <ul>
         <li v-for="(item,index) in takes" :key="index" @click="turnTo(index)">
             <div>
                  <p class="font28 font600">{{item.explains}}</p>
                  <span class="font24">{{item.createTime}}</span>
             </div>
             <div>
                  <p class="font30 font600">+{{item.businessPoint}}商机点</p>
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
  import fn from '@/assets/js/product'
  import qs from 'qs'
  import store from '@/store'
  export default {
    data() {
      return {
        mainColor: "",
        value1: '',
        num:0,
        userInfo:'',
        organInfo:'',
        takes:[],
        userId:'',
        getkey:'',
        pageNo:1,
        pageSize:14,
        pageCount:null,
        rowCount:null
      }
    },
    methods: {
      turnTo(index) {
        this.$router.push({
          name:'assetDetails',
          query:{
            type:3,
            businessPoint:this.takes[index].businessPoint,
            explains:this.takes[index].explains,
            createTime:this.takes[index].createTime,
          }
        })
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
                this.getBpLog()
        }

      },
      getBpLog(){
        var data = {userId: this.userId,
        token:this.getkey,
        pageNo:this.pageNo,
        pageSize:this.pageSize,type:3,};
        this.xhr.post(`${this.subUrl.user}/asset/getBpLog`, qs.stringify(data)).then((res) => {

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
      this.getBpLog();
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

 .invite{width:100%;padding:.1rem .3rem;height:calc( 100vh - .88rem );overflow-y: scroll;}
 .invite>ul{width:100%;}
 .invite>ul li{display:flex;width:100%;border-bottom:1px solid #F1F1F1;height:1rem;}
 .invite>ul li>div:nth-child(1){display:flex;flex-direction:column;justify-content:center;flex:5;}
 .invite>ul li>div:nth-child(2){flex:2;display:flex;justify-content:center;align-items:center;}
 .invite>ul li>div:nth-child(1)>span{color:#B7B7B7;margin-top:.1rem;}
 .invite>ul li>div>p{color:#414141;}
</style>
