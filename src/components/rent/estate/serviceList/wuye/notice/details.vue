<template>
  <yd-layout class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'通知详情'" title="通知详情" color="#fff" :bgcolor="mainColor" height=".88rem">
         <router-link to="#" slot="left">
            <span @click="back"><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </router-link>

      </yd-navbar>
    </div>

    <div class="organInfos">
      <div class="name">
        <p class="font32 font600">深圳市高伟达科技有限公司</p>
        <span class="font22">未缴</span>
      </div>
      <div class="info" v-if="show">
         <ul>
           <li><span>经办人：</span><p>马小云</p></li>
         </ul>
         <p @click="toggle">展开</p>
      </div>

      <div class="info" v-else>
         <ul>
           <li><span>地址：</span><p>A栋301</p></li>
           <li><span>单号：</span><p>2017101000001</p></li>
           <li><span>费用时间：</span><p>2017/11/01-2017/11/30</p></li>
           <li><span>经办人：</span><p>马小云</p></li>
           <li><span>信息日期：</span><p>2017/10/10</p></li>
         </ul>
         <p @click="toggle">隐藏</p>
      </div>
    </div>

    <div class="text">
      <p>限贵司于2017年03月21日16时前进行整改，如我司人员在限期后仍发现贵司未整改的，我司将采取相关措施，
        并根据你我双方之约定处罚违约金3000元。
      </p>
      <span>深圳市高伟达管理处</span>
      <a>2017年03月09日</a>
    </div>

    <div class="feedback">
       <span>经理/主任意见</span>
       <p><textarea name="" id=""></textarea></p>
       <button :style="{background:mainColor}">确 定</button>
    </div>

  </yd-layout>
</template>
<script>
  import Vue from 'vue';
  import fn from '@/assets/js/product'
  import qs from 'qs'

  export default {
    data() {
      return {
       mainColor: "",
       titleT:'',
       show:true,
       s:true,
       p:true,
       d:true,
       statusList:[
         {status:1,result:'已巡检',name:'王晶晶',text:'已按要求解决',data:'2017-11-17'},
         {status:1,result:'已巡检',name:'王晶晶',text:'已按要求解决',data:'2017-11-17'},
         {status:1,result:'已巡检',name:'王晶晶',text:'已按要求解决',data:'2017-11-17'},
         {status:1,result:'已巡检',name:'王晶晶',text:'已按要求解决',data:'2017-11-17'},
         ]
      }
    },
    methods: {
     toggle(){
       this.show=!this.show;
     },
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
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = this.$color[this.userInfo.organType]
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();

      if(this.$route.hash=='#p'){
        this.titleT='物业缴费单'
        this.s=false;
      }else if(this.$route.hash=='#s'){
        this.titleT='专项缴费单'
        this.p=false;
      }

    }
  }
</script>
<style scoped>
  .layout_my .header:after {
    display: none;

  }
  .layout_my{
background:#EEF3FA;
  }

  .layout_my .blue_box {
    height: 0.88rem;
    background-size: 100% 100%;
  }
  .organInfos{width:100%;}
  .name{width:100%;display: flex;justify-content:space-between;padding:.3rem .3rem;
  background: white;border-bottom:1px solid #F3F6F5;}
  .name>span{border-radius:.05rem;border:1px solid #2D88D4;color:#2D88D4;}

  .info{width:100%;background: white;padding:.1rem .3rem;font-size:.24rem;position:relative;}
  .info ul li{display: flex;height:.4rem;}
  .info ul li>span{width:1.3rem;text-align: right;color:#9D9E9D;}
  .info ul li>p{flex:1;margin-left:.2rem;}
  .info>p{font-size:.28rem;color:#2D88D4;position:absolute;bottom:.15rem;right:.3rem}

  .text{width:100%;padding:.2rem .4rem;background: white;margin-top:.3rem;display: flex;
  flex-flow:column;}
  .text>p{text-indent:.6rem;line-height:.6rem;font-size:.3rem;font-weight:600;color:#5A5B5A;}
  .text>span{margin:.5rem 0 .1rem;width:100%;display: flex;justify-content: flex-end;}
  .text>a{width: 100%;display: flex;justify-content: flex-end;}

  .feedback{width:100%;display: flex;flex-flow:column;background: #FAFAFA;margin-top:.2rem;}
  .feedback>span{width:100%;height: .7rem;color:#C5C5C5;font-size:.24rem;display: flex;
  align-items:center;padding:0 .3rem;}
  .feedback>p{width:100%;padding:0 .3rem;}
  .feedback>p>textarea{width:100%;height:1rem;padding:.1rem .2rem;}
  .feedback>button{width:90%;height:.8rem;border-radius: .1rem;margin:.2rem auto;
  border:none;color:white;font-size:.3rem;font-weight: 600;}


 .status{width: 100%;background: #FAFEFD;margin-top:.3rem;height: 8rem;}
 .one{width:100%;height:2rem;display: flex;flex-flow:row;justify-content: center;align-items:center;
 border-bottom:1px solid #F2F3F3;border-left:.1rem solid #23AC38}
 .tag{ width:70%; height:1.7rem; border:1px solid #F2F3F3; position:relative; background-color:#FFF;border-radius: .1rem;}
.arrow{ position:absolute; width:.3rem; height:.3rem; top:.6rem; left:-0.4rem; }
.arrow *{ display:block; border-width:.2rem; position:absolute; border-style:dashed solid dashed dashed; font-size:0; line-height:0; }
.arrow em{border-color:transparent #F2F3F3 transparent transparent;}
.arrow span{border-color: transparent #FFF transparent transparent; left:1px;}

.one .dot{width: .6rem;height:.6rem;background: #FAFEFD;display: flex;justify-content:center;
align-items:center;z-index:889;}
.z{position:relative;width: .6rem;height:.6rem;margin-right:.4rem;display: flex;justify-content:center;
align-items:center;}
.dot ul{width:.42rem;height:.42rem;border-radius:50%;background: #23AC38;display: flex;justify-content:center;align-items:center;}
.dot ul li{width:.16rem;height:.16rem;background: white;border-radius:50%;}
.dot>div:nth-child(1){width:.26rem;height:.26rem;background: #999;border-radius:.26rem;}

.result{width:100%;height:100%;padding:.2rem .3rem;}
.result ul{width: 100%;}
.result ul li:nth-child(1){display: flex;flex-flow:row;justify-content:space-between}
.result ul li:nth-child(1)>p{display: flex;justify-content:center;align-items:center;color:#B1B1B1;font-size:.24rem;}
.result ul li:nth-child(1)>p>i{width:.3rem;height:.3rem;margin-right:.1rem;}
.result ul li:nth-child(1)>p>i>img{height:100%;width:100%;}
.result ul li:nth-child(1)>span{font-weight: 600;margin-bottom:.1rem;font-size:.3rem;}
.result ul li:nth-child(2),.result ul li:nth-child(3){font-size:.28rem;color:#8A8A8A;margin-bottom:.05rem}

.wire{width:.04rem;height:2rem;background: #B1B1B1;position:absolute;z-index:888;top:-2rem;}
.status>div:nth-child(1)>.z>.wire{display: none;}
</style>
