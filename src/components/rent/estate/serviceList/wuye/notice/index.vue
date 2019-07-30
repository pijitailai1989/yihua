<template>
  <yd-layout class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'通知'" title="通知" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span to="#" slot="left" @click="back">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
        <div slot="right" v-if="userInfo.organType == 3" class="edit" style="color: #fff;font-size:.6rem;">+</div>
      </yd-navbar>
    </div>
    <div class="search">
        <div>
            <i><img src="../../../../../../assets/images/rent/my/search.png" alt=""></i>
            <span><input type="text" placeholder="请输入关键字或编码"></span>
        </div>
        <div>筛选</div>
    </div>
    <div class="contentList">
        <div class="content" v-for="(item,index) in contentList" :key="index">
              <div class="top">
                    <p><i><img src="../../../../../../assets/images/rent/estate/search.png" alt=""></i>{{item.list}}</p>
                    <span>单号：{{item.guid}}</span>
              </div>
              <div class="bottom">
                   <i><img src="../../../../../../assets/images/rent/estate/search.png" alt=""></i>
                   <p @click="turnTo('/estate/serviceList/notice/details')"><span>{{item.msg}}</span><a>关键字：{{item.ress}}</a></p>
                   <span>
                      <span :style="{color:item.status?'':'#FAB648',border:'1px solid #FAB648'}">{{item.status?'':'处理中'}}</span>
                      <p><i><img src="../../../../../../assets/images/rent/estate/search.png" alt=""></i>{{item.data}}</p>
                   </span>
              </div>
        </div>
    </div>
  </yd-layout>
</template>
<script>
  import Vue from 'vue';
  import fn from '@/assets/js/product'
  import qs from 'qs'

  export default {
    data() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = this.$color[this.userInfo.organType]
      console.log(this.mainColor)
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      return {
        contentList:[
            {list:'维修',guid:201700001,msg:'维修大门损坏',status:0,ress:'1栋203单元',data:'2017-10-10'},
            {list:'维修',guid:201700001,msg:'维修大门损坏',status:0,ress:'1栋203单元',data:'2017-10-10'},
            {list:'维修',guid:201700001,msg:'维修大门损坏',status:0,ress:'1栋203单元',data:'2017-10-10'},
            {list:'维修',guid:201700001,msg:'维修大门损坏',status:0,ress:'1栋203单元',data:'2017-10-10'},
        ]

      }
    },
    methods: {
      turnTo(url) {
        this.$router.push(url)
      },
      back(){
        this.$router.go(-1)
      },
      // 获取邀请信息列表
      getMyInvitation(){
        var data = {userId: this.userId};
        this.xhr.post(`${this.subUrl.user}/user/myInvitation`, qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
            res.data.data.list.forEach(item=>{
              if(item.type==1){
                item.type='企业'
              }else if(item.type==2){
                item.type='供应商'
              }

            })
             this.userL=res.data.data.list;
             localStorage.setItem('userL',encodeURIComponent(JSON.stringify(res.data.data.list) ) );
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

 .search{width:100%;height:.85rem;background:white;display:flex;flex-flow:row;padding:.15rem .3rem;}
 .search>div:nth-child(1){flex:1;background:#EBEBED;border-radius:.6rem;display:flex;justify-content:center;
 align-items:center;}
 .search>div:nth-child(1)>i{width:.35rem;height:.35rem;margin-right:.1rem;}
 .search>div:nth-child(1)>i>img{width:100%;height:100%;}
 .search>div:nth-child(1)>span{width:2.4rem;}
 .search>div:nth-child(1)>span>input{width:100%;font-size:.24rem;color:#A2A1A6;border:none;}
 .search>div:nth-child(2){width:1.6rem;display:flex;justify-content:center;align-items:center;}


 .contentList{width:100%;}
 .content{width:100%;display:flex;flex-flow:column;padding:.1rem .2rem;background:white;margin-top:.2rem;}
 .top{border-bottom:1px dashed #AAAAAA;color:#747474;display:flex;flex-flow:row;
 justify-content:space-between;align-items:center;font-size:.24rem;}
 .top>p{height:.6rem;display:flex;justify-content:center;align-items:center;}
 .top>p>i{height:.3rem;width:.3rem;margin-right:.1rem;}
 .top>p>i>img{width:100%;height:100%;}

 .bottom{display:flex;flex-flow:row;padding:.1rem 0 .1rem .1rem;}
.bottom>i{width:1rem;height:1.2rem;}
.bottom>i>img{width:100%;height:100%;}

.bottom>p{flex:1;display:flex;flex-flow:column;justify-content:center;padding:0 .2rem;}
.bottom>p>a{font-size:.24rem;color:#747474;}
.bottom>p>span{font-size:.32rem;color:#000;margin:.1rem 0}

.bottom>span{width:2rem;height:1.2rem;display:flex;flex-flow:column;justify-content:center;align-items:flex-end;}
.bottom>span>span{margin-bottom:.3rem;border-radius:.04rem;font-size:.22rem;}
.bottom>span>p{display:flex;font-size:.24rem;color:#747474;}
.bottom>span>p>i{height:.3rem;width:.3rem;margin-right:.1rem;}
.bottom>span>p>i>img{width:100%;height:100%;}





</style>
