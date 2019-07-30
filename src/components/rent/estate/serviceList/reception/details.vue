<template>
  <yd-layout class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'接待详情'" title="接待详情" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span class="spanLeft" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
      </yd-navbar>
    </div>

    <div class="organInfos">
      <div class="name">
        <p class="font32 font600 textHidden">{{dateils.customerName}}</p>
        <span  v-show="dateils.status!=null" class="font22" :style="{border:'1px solid '+mainColor,color:mainColor}">{{dateils.status}}</span>
      </div>
      <div class="info">
         <ul>
           <li><span>报告人：</span><p>{{dateils.applyUserName}}</p></li>
           <li><span>单号：</span><p>{{dateils.guid}}</p></li>
           <li><span>接待时间：</span><p>{{dateils.receptionDate}}</p></li>
           <li><span>接待地点：</span><p>{{dateils.receptionAddr}}</p></li>
           <li><span>填写日期：</span><p>{{dateils.createDate}}</p></li>
         </ul>
      </div>
    </div>

    <div class="details">

       <ul>
           <li v-for="(item,index) in type" :key="index">
                <yd-icon name='selected' v-if="active==item" custom :color='mainColor'></yd-icon>
               <!-- <i v-if="active==item"><img src="../../../../../assets/images/rent/estate/select_active.png" alt=""></i> -->
               <i v-else><img src="../../../../../assets/images/rent/estate/select.png" alt=""></i>
               <p class="font30 font600">{{item}}</p>
           </li>

       </ul>

        <div class="ss">
          <p class="textHidden4">{{dateils.detailContent}}</p>
        </div>
        <div class="images">
            <ul>
              <li v-for="(item,index) in commAccessoryList" :key="index"><img :src="item.path" alt=""></li>
            </ul>
        </div>
    </div>


    <div class='buttons'><button @click="confirm" :style="{background:mainColor}">确定完成</button></div>
    <div v-show="show2" class="evaluate">
        <ul>
          <li>
            <p class="font30">速度</p>
            <span>
               <yd-cell-item>
                <yd-rate slot="left" v-model="rate1"></yd-rate>
               </yd-cell-item>
            </span>
          </li>
          <li>
            <p class="font30">服务</p>
            <span>
                <yd-cell-item>
                <yd-rate slot="left" v-model="rate2"></yd-rate>
               </yd-cell-item>
            </span>
          </li>
          <li>

                 <yd-textarea slot="right" placeholder="说说" maxlength="100"></yd-textarea>

          </li>
          <li @click="release">
            <span class="font30 font600" :style="{color:mainColor}">发布评价</span>
          </li>
        </ul>

    </div>

    <div class="status">
      <div class="one" v-for="(item,index) in tasksRecordList" :key="index">
           <div class="z">
            <div class="dot">
              <ul><li></li></ul>
            </div>
           <div class="wire"></div>
           </div>
           <div class="tag">
               <div class="result">
                   <ul>
                     <li>
                       <span :style="{color:mainColor}">{{item.title}}</span>
                       <p><i><img src="../../../../../assets/images/rent/estate/search.png" alt=""></i>{{item.createTime}}</p>
                      </li>
                      <li>处理人：{{item.usetName}}</li>
                      <li>备注：{{item.remark}}</li>
                   </ul>
               </div>
               <div class="arrow">
                <em></em><span></span>
               </div>

            </div>
      </div>
    </div>
  </yd-layout>
</template>
<script>
  import Vue from 'vue';
  import fn from '@/assets/js/product'
  import qs from 'qs'
  import {TextArea} from 'vue-ydui/dist/lib.rem/textarea';
  import {Input} from 'vue-ydui/dist/lib.rem/input';
  import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog';
  import {Rate} from 'vue-ydui/dist/lib.rem/rate';

  Vue.component(Rate.name, Rate);

  Vue.prototype.$dialog = {
    confirm: Confirm,
    alert: Alert,
    toast: Toast,
    notify: Notify,
    loading: Loading,
  };

Vue.component(Input.name, Input);

  Vue.component(TextArea.name, TextArea);

  export default {
    data() {
      return {
        userInfo:{},
        organInfo:{},
        commAccessoryList:[],
        active:'',
        show1:true,
        show2:false,
        images:[],
        getkey:'',
        mainColor: "",
        input8:'',
        alertT:false,
        info:{
          name:'',tel:'',pid:''
        },
        list:[],
        getHearLog:{
          domain:'',
          token:'',
          name:''
        },
        imgName:[],
        imgUrl:[],
        rate1:0,
        rate2:0,
        statusList:[
         {status:1,result:'已巡检',name:'王晶晶',text:'已按要求解决',data:'2017-11-17'},
         {status:1,result:'已巡检',name:'王晶晶',text:'已按要求解决',data:'2017-11-17'},
         {status:1,result:'已巡检',name:'王晶晶',text:'已按要求解决',data:'2017-11-17'},
         {status:1,result:'已巡检',name:'王晶晶',text:'已按要求解决',data:'2017-11-17'},
         ],
         d:true,
         userId:'',
         receptionId:'',
         dateils:{},
         type:['车位','横幅','专用电梯'],
         statuss:['上报成功','已接单','处理成功','已评价','关闭'],
         tasksRecordList:[],

      }
    },
    computed:{
      lists(){
          return this.list
      }

    },
    methods: {
      release(){
        this.show2=false;
      },
      confirm(){
        this.show2=true;
      },
      turnTo(url) {
        this.$router.push(url)
      },
      back(){
          history.back()
      },
      // 获取邀请信息列表
      getReception(){
        var data = {token:this.getkey,userId: this.userId,receptionId:this.receptionId};
        this.xhr.post(`${this.subUrl.activity}/reception/getReception`, qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
            console.log(res)
            this.dateils=res.data.data.reception;
            if(this.dateils.status==1){
              this.dateils.status='进行中'
            }else if(this.dateils.status==1){
              this.dateils.status='不同意'
            }else if(this.dateils.status==1){
              this.dateils.status='完成'
            }else if(this.dateils.status==1){
              this.dateils.status='关闭'
            }
            res.data.data.tasksRecordList.forEach(element => {
               element.createTime=element.createTime.split(' ')[0]
            });
            this.tasksRecordList=res.data.data.tasksRecordList;
            this.commAccessoryList=res.data.data.commAccessoryList;
            this.active=this.dateils.type;
            // console.log(res)
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

      this.receptionId=this.$route.hash.split('#')[1]
      console.log(this.$route)
      this.getReception()

    },
    beforeUpdate () {
      // this.imgName.forEach(item=>{
      //     this.imgUrl.push(this.getHearLog.domain+'/'+item)
      // })


      if(this.imgName.length>=5){
        this.show1=false;
     }
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
  .organInfos{width:100%;}
  .name{width:100%;display: flex;justify-content:space-between;padding:.3rem .3rem;
  background: white;border-bottom:1px solid #F3F6F5;}
  .name>p{width: 5.5rem;}
  .name>span{border-radius:.05rem;border:1px solid #2D88D4;color:#2D88D4;padding:.05rem .1rem;}

  .info{width:100%;background: white;padding:.1rem .3rem;font-size:.24rem;position:relative;}
  .info ul li{display: flex;height:.5rem;}
  .info ul li>span{width:1.3rem;text-align: right;color:#9D9E9D;}
  .info ul li>p{flex:1;margin-left:.2rem;}
  .info>p{font-size:.28rem;color:#2D88D4;position:absolute;bottom:.15rem;right:.3rem}


  .details{width:100%;margin-top:.2rem;background: white;padding:.2rem;border-bottom:1px solid #E5E5E5;}
  .details>ul{width:100%;display: flex;flex-flow:row;justify-content: space-around;align-content: center;}
  .details>ul li{display: flex;margin-bottom:.2rem;justify-content: center;align-items:center;}
  .details>ul li>i{width:.5rem;height:.5rem;margin-right:.1rem;}
  .details>ul li>i>img{width:100%;height:100%;}
  .ss{border:1px solid #E8E8E8;border-radius:.05rem;padding:.2rem .2rem;line-height: .4rem;}

  .images{margin-top:.2rem;display: flex;}
  .images>p{border:2px dashed #B6CEEC;width:1.2rem;height:1.2rem;display: flex;
  justify-content:center;align-items:center;border-radius:.1rem;position:relative;}
  .images>p>img{width:.6rem;height:.6rem;}
  .images>ul{display: flex;flex-flow:row;justify-content: center;align-items:center;}
  .images>ul>li{width:1.2rem;height:1.2rem;margin:0 .1rem;}
  .images>ul>li>img{width:1.2rem;height:1.2rem;border-radius:.1rem;}
  .images>p>input{width:100%;height:.9rem;opacity: 0;position: absolute;left:0;top:0;}

  .buttons{width:100%;margin:.4rem 0;display: flex;justify-content: center;}
  .buttons>button{width:90%;height:.8rem;color:white;font-size:.3rem;font-weight:600;
  border-radius:.1rem;border:none;}

  .evaluate{width:100%;height:100vh;background: rgba(0,0,0,.3);
  position:fixed;top:0;left:0;padding:3.6rem .4rem;z-index:112;}
  .evaluate ul{width:100%;height:100%;background: #F8F8F9;border-radius:.2rem;display: flex;
  flex-flow:column;align-items:center;}
  .evaluate ul li{display: flex;justify-content: center;align-items:center;}
  .evaluate ul li:nth-child(1){width:100%;height:1rem;margin-top:.2rem;}
  .evaluate ul li:nth-child(1) p{margin-right:.3rem;color:#686868;}
  .evaluate ul li:nth-child(2) p{margin-right:.3rem;color:#686868;}
  .evaluate ul li:nth-child(2){width:100%;height:1rem;}
  .evaluate ul li:nth-child(3){margin-top:.3rem;width:90%;height:2.4rem;border:1px solid #E9E9EA;border-radius:.1rem;}
  .evaluate ul li:nth-child(3) textarea{width:100%;height:2.4rem;border-radius: .1rem;}
  .evaluate ul li:nth-child(4){width:100%;height:1rem;border-top:1px solid #EAEAE9;background: white;
  margin-top:.25rem;border-radius: 0 0 .2rem .2rem;}

.status{width: 100%;background: #FAFEFD;margin-top:.3rem;}
 .one{width:100%;height:2rem;display: flex;flex-flow:row;justify-content: center;align-items:center;
 border-bottom:1px solid #F2F3F3;background: #F8F8F9;}
 .tag{ width:70%; height:1.7rem; border:1px solid #F2F3F3; position:relative; background-color:#FFF;border-radius: .1rem;}
.arrow{ position:absolute; width:.3rem; height:.3rem; top:.6rem; left:-0.4rem; }
.arrow *{ display:block; border-width:.2rem; position:absolute; border-style:dashed solid dashed dashed; font-size:0; line-height:0; }
.arrow em{border-color:transparent #F2F3F3 transparent transparent;}
.arrow span{border-color: transparent #FFF transparent transparent; left:1px;}

.one .dot{width: .6rem;height:.6rem;background: #F8F8F9;display: flex;justify-content:center;
align-items:center;z-index:111;}
.z{position:relative;width: .6rem;height:.6rem;margin-right:.4rem;display: flex;justify-content:center;
align-items:center;}
.dot ul{width:.42rem;height:.42rem;border-radius:50%;background: #999;display: flex;justify-content:center;align-items:center;}
.dot ul li{width:.18rem;height:.18rem;background: white;border-radius:50%;}
.dot>div:nth-child(1){width:.26rem;height:.26rem;background: #999;border-radius:.26rem;}
.status>div:first-child .dot ul{background: #23AC38;}

.result{width:100%;height:100%;padding:.2rem .3rem;}
.result ul{width: 100%;}
.result ul li:nth-child(1){display: flex;flex-flow:row;justify-content:space-between}
.result ul li:nth-child(1)>p{display: flex;justify-content:center;align-items:center;color:#B1B1B1;font-size:.24rem;}
.result ul li:nth-child(1)>p>i{width:.3rem;height:.3rem;margin-right:.1rem;}
.result ul li:nth-child(1)>p>i>img{height:100%;width:100%;}
.result ul li:nth-child(1)>span{font-weight: 600;margin-bottom:.1rem;font-size:.3rem;}
.result ul li:nth-child(2),.result ul li:nth-child(3){font-size:.28rem;color:#8A8A8A;margin-bottom:.05rem}

.wire{width:.04rem;height:2rem;background: #B1B1B1;position:absolute;z-index:110;top:-2rem;}
.status>div:nth-child(1)>.z>.wire{display: none;}
</style>
