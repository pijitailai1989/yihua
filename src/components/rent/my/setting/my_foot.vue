<template>
  <yd-layout class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'我的足迹'" title="我的足迹" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span class="spanLeft" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
      </yd-navbar>
    </div>
   <yd-search v-model="value" :on-submit="submitHandler"></yd-search>

   <div class="footList" @scroll="scrollHandler" ref="listDom">

      <yd-cell-group>
            <yd-cell-item v-for="(item,index) in m_foot" :key="index">
                <span slot="left" class="font30 font600">{{index+1}}&nbsp;{{item.optName}}</span>
                <span slot="right" class="font24"><i>{{item.data}}</i><i>{{item.time}}</i></span>
            </yd-cell-item>
        </yd-cell-group>
        <div  class="Section" v-show="pageSize<=rowCount">
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
        <div v-show="m_foot.length==0" style="width:100%;height:3rem;display:flex;
        justify-content:center;align-items:center;color:#999;">~~暂无相关数据~~</div>

   </div>
  </yd-layout>
</template>
<script>
  import Vue from 'vue';
  import {CellGroup, CellItem} from 'vue-ydui/dist/lib.rem/cell';
  import {Search} from 'vue-ydui/dist/lib.rem/search';
  import store from '@/store'
  Vue.component(Search.name, Search);
  Vue.component(CellGroup.name, CellGroup);
  Vue.component(CellItem.name, CellItem);

  import fn from '@/assets/js/product'
  import qs from 'qs'

  export default {
    data() {
      return {
        mainColor: "",
        value: '',
        m_foot:[],
        userId:'',
        getkey:'',
        keyword:null,
        pageNo:1,
        pageSize:12,
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
        this.getMyTrack()
        }

      },
      turnTo(url) {
        this.$router.push(url)
      },
      back(){
          history.back()
      },
      submitHandler(value) {
                this.$dialog.toast({mes: `搜索：${value}`});
                this.keyword=this.value;
                this.pageNo=1;
                this.getMyTrack();
            },
      // 获取邀请信息列表
      getMyTrack(){

        var data = {
        userId: this.userId,
        token:this.getkey,
        pageNo:this.pageNo,
        pageSize:this.pageSize,
        };
        if(this.keyword!=null){
          data.keyword=this.keyword
        }
        this.xhr.post(`${this.subUrl.user}/user/myTrack`, qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {

             res.data.data.list.forEach(item=>{
                    let arr=item.createTime.split(' ')
                    let data=arr[0];
                    let time=arr[1]
                   item.data=data;
                   item.time=time;
             })
             this.pageCount=res.data.data.pageCount
             this.rowCount=res.data.data.rowCount
             if(this.pageNo>=2){
               this.m_foot=this.m_foot.concat(res.data.data.list)
             }else{
               this.m_foot=res.data.data.list
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

      this.getMyTrack();

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

 .yd-search>.yd-search-input{background-color:#fff;}
.yd-search>.yd-search-input>.search-input{background-color:#ccc;}
.footList{width:100%;height:calc( 100vh - 1.8rem );overflow-y: scroll;}
.yd-cell-right i{display:block;color:#989998;margin:.05rem 0;}
.font24{display:flex;flex-flow:column;justify-content:center;align-items:center;}
  /*消息列表结束*/
</style>
