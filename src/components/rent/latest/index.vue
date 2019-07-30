<template>
  <yd-layout class="layout_my">
      <yd-navbar class="header" v-show="!userAgent.isWX"  slot="navbar" v-title="'最新消息'" title="最新消息" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span class="spanLeft" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
        <span class="spanRight" slot="right" style="color:white;font-size:.28rem" @click="turnTo('/latest/setLatest')">设置</span>
      </yd-navbar>
   <yd-search v-model="value" :on-submit="submitHandler"></yd-search>

   <div class="latest" @scroll="scrollHandler" ref="listDom">
       <ul>
           <li v-for="(item,index) in list" :key="index" @click="toggle(index)">
               <i><img :src="item.img" alt=""></i>
               <span class="font28" :style="{color:item.pid==index?mainColor:'#666'}">{{item.type}}</span>
           </li>
       </ul>
       <ol>
           <li v-for="(item,index) in contentList" :key="index" @click="turnTo('/latest/details/'+item.guid)">
               <p class="p1">
                   <i><img src="../../../assets/images/rent/my/system.png" alt=""></i>
               </p>
               <p class="p2" style="flex:1;">
                   <a>{{item.title}}</a>
                   <span style="width:4rem;" class="textHidden">{{item.content}}</span>
               </p>
               <p class="p3">
                   <a>{{item.messageDateT}}</a>
                   <span>{{item.messageDateB}}</span>
               </p>
           </li>
           
       </ol>
       <div class="Section" v-show="pm.pageSize<pm.rowCount">
            <div v-if="pm.pageNo <= pm.pageCount">
              <div class="a b1">
                <ul>
               <li></li>
               <li></li>
               <li></li>
                </ul></div>

            </div>
            <div v-else>啦啦啦，啦啦啦，我是有底线的啦~~</div>
      </div>
      <div v-show="contentList.length==0" style="width:100%;height:3rem;display:flex;
        justify-content:center;align-items:center;color:#999;">~~暂无相关数据~~</div>

   </div>
  </yd-layout>
</template>
<script>
  import Vue from 'vue';
  import {CellGroup, CellItem} from 'vue-ydui/dist/lib.rem/cell';
  import {Search} from 'vue-ydui/dist/lib.rem/search';

  Vue.component(Search.name, Search);
  Vue.component(CellGroup.name, CellGroup);
  Vue.component(CellItem.name, CellItem);

  import fn from '@/assets/js/product'
  import qs from 'qs'
  import store from '@/store'

  export default {
    data() {
      return {
        mainColor: "",
        value: '',
        list:[
            {pid:0,type:'物业消息',img:require('../../../assets/images/rent/my/l1.png')},
            {pid:0,type:'电商消息',img:require('../../../assets/images/rent/my/l2.png')},
            {pid:0,type:'圈子消息',img:require('../../../assets/images/rent/my/l3.png')},
            {pid:0,type:'平台消息',img:require('../../../assets/images/rent/my/l4.png')},
            {pid:0,type:'推送消息',img:require('../../../assets/images/rent/my/l5.png')},
        ],
        contentList:[],
        pm:{
          userId:'',
          getkey:'',
          keyword:null,
          type:1,
          pageNo:1,
          pageSize:7,
          rowCount:null,
        }
        
      }
    },
    methods: {
      scrollHandler(){
          if(store.loading||this.pm.pageNo > this.pm.pageCount){return }
          let listDom = this.$refs.listDom;
          if(listDom.scrollHeight - listDom.scrollTop - listDom.clientHeight < 100){this.listCommMessage(); }
      },
      toggle(index){
         this.pm.pageNo=1;
         this.pm.keyword=null;
         this.list[index].pid=index;
         this.pm.type=index+1;
         this.listCommMessage();
         for(let i=0;i<5;i++){
           if(index!=i){
            this.list[i].pid=null;
           }
         }
        let that=this
        that.$dialog.loading.open('加载中..');
        setTimeout(() => {
          that.$dialog.loading.close();
        }, 1000);
      },
      turnTo(url) {
        this.$router.push(url)
      },
      back(){
          history.back()
      },
      submitHandler(value) {
                this.$dialog.toast({mes: `搜索：${value}`});
                this.pm.keyword=value;
                this.pm.pageNo=1;
                this.listCommMessage();
            },
      // 获取邀请信息列表
      listCommMessage(){
        
        var data = {
          userId: this.pm.userId,
          token:this.pm.getkey,
          type:this.pm.type,
          pageNo:this.pm.pageNo,
          pageSize:this.pm.pageSize
          };
          if(this.pm.keyword!=null){
            data.keyword=this.pm.keyword
          }
        this.xhr.post(`${this.subUrl.user}/commMessage/listCommMessage`, qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
            this.$dialog.loading.close();
             if(res.data.data.list!=null){
                res.data.data.list.forEach(item=>{
                  item.messageDateT=item.messageDate.split(' ')[0]
                  item.messageDateB=item.messageDate.split(' ')[1]
                  item.messageDateB=item.messageDateB.substring(0,5)
                })
              this.pm.pageCount=res.data.data.pageCount;
              this.pm.rowCount=res.data.data.rowCount;
              if(this.pm.pageNo>=2){
                this.contentList =this.contentList.concat(res.data.data.list);
              }else{
                this.contentList=res.data.data.list;
              }
              this.pm.pageNo++;
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

 .yd-search>.yd-search-input{background-color:#fff;}
 .yd-search>.yd-search-input>.search-input{background-color:#ccc;}
 .yd-cell-right i{display:block;color:#989998;margin:.05rem 0;}

 .latest{width:100%;height:calc( 100vh - 1.8rem );overflow-y:scroll}
 .latest ul{width:100%;display: flex;justify-content: space-around;align-items:center;margin-top:.3rem;
  border-top:1px solid #EAEAEB;border-bottom:1px solid #EAEAEB;height:2rem;background: white;}
 .latest ul li{display: flex;flex-flow:column;justify-content: center;align-items:center;}
 .latest ul li>i{width:1rem;height:1rem;margin-bottom:.1rem;}
 .latest ul li>i>img{width:100%;height:100%;}

 .latest ol{width:100%;margin-top:.2rem;background: white;
 border-top:1px solid #EAEAEB;}
 .latest ol li{width:100%;display: flex;flex-flow:row;align-items:center;height:1.4rem;
 border-bottom:1px solid #EAEAEB;}
 .latest ol li>p{display: flex;flex-flow:column;}
 
 .latest .p1{margin:0 .3rem;}
 .latest .p1>i{width:.65rem;height:.65rem;}
 .latest .p1>i>img{width:100%;height:100%;}
 .latest .p2>a{font-size:.29rem;font-weight: 600;margin-bottom:.1rem;}
 .latest .p2>span{font-size:.26rem;color:#999;}
 .latest .p3>span{font-size:.26rem;color:#999;}
 .latest .p3>a{font-size:.26rem;color:#999;margin-bottom:.1rem;}
 .latest .p3{align-items: center;margin:0 .1rem;}

</style>
