<template>
  <yd-layout class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'我的邀请'" title="我的邀请" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span class="spanLeft" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
         <span slot="right" class="edit spanRight" style="color: #fff;" @click="turnTo('/my/setting/invite_reward')">查看奖励</span>
      </yd-navbar>
    </div>
    <div class="codes">
       <ul>
         <li @click="turnTo('/my/setting/my_code#inviteMerchant')">
             <span><img src="../../../../assets/images/rent/my/a_shang.png" alt=""></span>
             <p>邀请商家</p>
         </li>
         <li @click="turnTo('/my/setting/my_code#inviteLessee')">
             <span><img src="../../../../assets/images/rent/my/a_zhuhu.png" alt=""></span>
             <p>邀请租户</p>
         </li>
       </ul>
    </div>

    <div class="iuser" @scroll="scrollHandler" ref="listDom">
       <div v-for="(item,index) in userL" :key="index" class="i_t">
           <ul>
               <li>
                   <p class="font30 font600"><img src="../../../../assets/images/rent/my/category.png">{{item.type}}</p>
                   <span class="font24">{{item.inviteDate}}</span>
               </li>
               <li>
                   <p class="font30 font600">{{item.organName}}</p>
                   <span class="font24"><img src="../../../../assets/images/rent/my/linkman.png">{{item.contactName}}</span>
               </li>
           </ul>
       </div>
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
        <div v-show="userL.length==0" style="width:100%;height:3rem;display:flex;
        justify-content:center;align-items:center;color:#999;">~~暂无相关数据~~</div>
    </div>

  </yd-layout>
</template>
<script>
  import Vue from 'vue';
  import {GridsGroup, GridsItem} from 'vue-ydui/dist/lib.rem/grids';
  import store from '@/store'

Vue.component(GridsGroup.name, GridsGroup);
Vue.component(GridsItem.name, GridsItem);

  import fn from '@/assets/js/product'
  import qs from 'qs'

  export default {
    data() {
      return {
        mainColor: "",
        userL:[
        ],
        userId:'',
        getkey:'',
        pageNo:1,
        pageSize:9,
        pageCount:null,
        rowCount:null,
      }
    },
    methods: {
      scrollHandler(){

        if(store.loading||this.pageNo > this.pageCount){
            return
         }
        let listDom = this.$refs.listDom;
        if(listDom.scrollHeight - listDom.scrollTop - listDom.clientHeight < 100){
        this.getMyInvitation()
        }

      },
      turnTo(url) {
        this.$router.push(url)
      },
      back(){
        this.$router.go(-1)
      },
      // 获取邀请信息列表
      getMyInvitation(){
        var data = {userId: this.userId,
        token:this.getkey,
        pageNo:this.pageNo,
        pageSize:this.pageSize,};
        this.xhr.post(`${this.subUrl.user}/user/myInvitation`, qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
            res.data.data.list.forEach(item=>{
              if(item.type==1){
                item.type='企业'
              }else if(item.type==2){
                item.type='供应商'
              }

            })
            this.pageCount=res.data.data.pageCount;
            this.rowCount=res.data.data.rowCount;
            if(this.pageNo>=2){
              this.userL=this.userL.concat(res.data.data.list);
            }else{
               this.userL=res.data.data.list;
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

      this.getMyInvitation();

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
  .codes{width:100%;height:1.5rem;background:white;}
  .codes ul{display:flex;justify-content:space-around;height:1.5rem;}
  .codes ul li{display:flex;flex-direction:column;justify-content:center;align-items:center;height:1.5rem;margin:0 .8rem;}
  .codes ul li span{width:.6rem;height:.6rem;margin-bottom:.1rem;}
  .codes ul li p{color:#737373}
  .codes ul li span img{width:100%;height:100%;}


 .iuser{width:100%;margin-top:.3rem;background:white;border-top:1px solid #EFEFF1;
 border-bottom:1px solid #EFEFF1;padding:0 .3rem;height:calc( 100vh - 2.68rem );overflow-y: scroll;}
       .i_t{width:100%;padding:.1rem .2rem;}
       .i_t:last-child{border:none;}
       .i_t ul{display:flex;flex-direction:row;border-bottom:1px dashed #E8E8E8;padding:.2rem 0;}
       .i_t li:nth-child(1){flex:4}
       .i_t li:nth-child(2){flex:6;display:flex;flex-flow:column;align-items:flex-end;}
       .i_t li p{color:#333;margin:.1rem 0;display:flex;flex-direction:row;align-items:center;
       }
       .i_t li p img{width:.3rem;height:.3rem;margin-right:.1rem;}
       .i_t li span{color:#ABABAB;display:flex;flex-direction:row;align-items:center;}
       .i_t li span img{width:.3rem;height:.3rem;margin-right:.1rem;}
</style>
