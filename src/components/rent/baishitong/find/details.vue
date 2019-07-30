<template>
   <yd-layout>
        <yd-navbar style="height:0.88rem" slot="navbar" :bgcolor="mainColor" color="#fff" v-show="!userAgent.isWX" v-title="'详情'" :title="titleT">
            <span class="spanLeft" @click="back" slot="left">
                <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
            </span>
            <span class="spanRight" @click="report" slot="right" style="color:white;font-size:.26rem;">举报</span>
        </yd-navbar>
        <div class="details" @scroll="scrollHandler" ref="listDom">
             <div>
                 <ul>
                     <li><i><img :src="knowAll.userInfo.headPortrait" alt=""></i></li>
                     <li>
                         <span class="p1 font28" >{{knowAll.userInfo.nickname}}</span>
                         <span class="p2"><a v-show="keyword.length>0" v-for="(item,index) in keyword" :key="index"
                          :style="{color:mainColor,border:'1px solid '+mainColor}">{{item}}</a></span>
                         <span class="p3">
                             <i><img src="../../../../assets/images/rent/circle/eye_27.png" alt=""></i>
                             <a class="font24" style="margin-right:.2rem;">{{knowAll.browseNum}}</a>
                             <span class="font24">{{createDate}}</span>
                         </span>
                     </li>
                     <li>
                         <span class="font26">评分：<a style="color:#FFAD31;font-size:.5rem">{{knowAll.grade}}</a></span>
                     </li>
                 </ul>
             </div>
             <div>
                 <ul>
                     <li><p class="textHidden8">{{knowAll.content}}</p></li>
                     <li style="padding:0 .3rem;">
                             <i style="width:.8rem;height:.8rem;" v-if="commAccessoryList.length>0">
                             <img style="width:100%;height:100%;" src="../../../../assets/images/rent/baishitong/fujian.png" alt=""></i>
                             <span style="margin-left:.1rem;color:#999;" v-if="commAccessoryList.length>0">附件({{commAccessoryList.length}})</span>
                     </li>
                     <li>
                         <span>{{knowAll.bp}}商机点</span>
                         <p> 
                             <a v-show="userFalse" class="clickA" v-if="commAccessoryList.length==0"><i>
                                 <yd-icon name="xiazai" slot="icon" custom size=".35rem"></yd-icon></i>暂无下载</a>

                            <a v-show="userFalse" class="clickA" @click="toggle" v-else-if="knowAll.isDownload==0"><i>
                                 <yd-icon name="xiazai" slot="icon" custom size=".35rem"></yd-icon></i>下载</a>
                             <a v-show="userFalse" class="clickA" v-else :style="{color:mainColor}" download="yihua">
                                 <yd-lightbox>
                                     <yd-lightbox-img v-for="(item, key) in commAccessoryList" :key="key" :src="item.path"></yd-lightbox-img>
                                 </yd-lightbox>
                                 <i><yd-icon name="xiazai" slot="icon" custom size=".35rem"></yd-icon></i>已购买下载
                             </a>

                             <!-- <a v-show="userFalse" class="clickA" @click="toggle" v-else-if="knowAll.isDownload==0"><i>
                                 <yd-icon name="xiazai" slot="icon" custom size=".35rem"></yd-icon></i>下载</a>
                             <a v-show="userFalse" class="clickA" @click="url()" v-else :style="{color:mainColor}" download="yihua">
                                 <i><yd-icon name="xiazai" slot="icon" custom size=".35rem"></yd-icon></i>已购买下载</a> -->

                             <a v-show="userFalse" class="clickA" v-if="knowAll.isCollect"><i>
                                 <yd-icon name="shoucang" slot="icon" custom size=".35rem"></yd-icon></i>已收藏</a>
                             <a v-show="userFalse" class="clickA" v-else @click="collect"><i>
                                 <yd-icon name="shoucang" slot="icon" custom size=".35rem"></yd-icon></i>收藏</a>
                             <a class="clickA" @click="turnTo('/baishitong/find/comment/'+parameter.kaId)"><i>
                                 <yd-icon name="pinglun" slot="icon" custom size=".35rem"></yd-icon></i>评论</a>
                         </p>
                     </li>
                 </ul>
             </div>
             <div v-show="list.length!=0">
                 <ul v-for="(item,index) in list" :key="index">
                     <li>
                         <i><img :src="item.userInfo.headPortrait" alt=""></i>
                         <span><a class="font28" style="color:#438CD5;">{{item.userInfo.nickname}}</a><a class="font24" style="color:#D7D7D7;">{{item.createDate}}</a></span>
                     </li>
                     <li>
                         <span class="font3 textHidden2" style="color:#333;">{{item.content}}</span>
                     </li>
                 </ul>
             </div>
            <div  class="Section" v-show="parameter.pageSize<parameter.rowCount">
             <div v-if="parameter.pageNo <= parameter.pageCount">
              <div class="a b1">
                <ul>
               <li></li>
               <li></li>
               <li></li>
                </ul></div>

            </div>
            <div v-else>啦啦啦，啦啦啦，全部评论啦~~</div>
            
            </div>
          <div v-show="list.length==0" style="width:100%;height:3rem;display:flex;
        justify-content:center;align-items:center;color:#999;">~~暂无相关评论~~</div>
        </div>
        
        <div class="pay" v-show="show">
            <ul>
                <li class="font26"><span @click="toggle">x</span>需支付：</li>
                <li>{{knowAll.bp}}个商机点</li>
                <li v-show="knowAll.bp!=0" class="font26">请选择支付帐号:</li>
 
                <li v-show="knowAll.bp!=0" v-for="(item,index) in buyType" :key="index" @click="toggle1(index)">
                    <i><img :src="item.img" alt=""></i>
                    <p>{{item.type}}</p>
                    <i v-if="item.id==index"><img src="../../../../assets/images/rent/baishitong/select_active.png" alt=""></i>
                    <i v-else><img src="../../../../assets/images/rent/baishitong/select.png" alt=""></i>
                </li>

                <li><button @click="buy()" :style="{background:mainColor,color:'white'}">确定</button></li>
            </ul>

        </div>
        
    </yd-layout>
</template>
<script>
  import Vue from 'vue';
  import fn from '@/assets/js/product'
  import qs from 'qs'
  import {Layout} from 'vue-ydui/dist/lib.rem/layout';
  import {TabBar, TabBarItem} from 'vue-ydui/dist/lib.rem/tabbar';
  import {Badge} from 'vue-ydui/dist/lib.rem/badge';
  import store from '@/store'
  import {LightBox, LightBoxImg, LightBoxTxt} from 'vue-ydui/dist/lib.rem/lightbox';

Vue.component(LightBox.name, LightBox);
Vue.component(LightBoxImg.name, LightBoxImg);
Vue.component(LightBoxTxt.name, LightBoxTxt);
  Vue.component(Badge.name, Badge);
  Vue.component(TabBar.name, TabBar);
  Vue.component(TabBarItem.name, TabBarItem);
  Vue.component(Layout.name, Layout);


  export default {
    data() {
      return {
        userFalse:true,
        mainColor: "",
        organInfo:'',
        userInfo:'',
        titleT:'',
        show:false,
        parameter:{
          token:'',
          userId:null,
          kaId:null,
          pageNo:1,
          pageSize:6,
          rowCount:null,
          type:2,
          payType:1
        },
        knowAll:{
            userInfo:{
                headPortrait:'',
                nickname:''
            },
            isCollect:0
            
        },
        keyword:[],
        createDate:'',
        commAccessoryList:null,
        isCollect:'',
        list:[],
        buyType:[
            {id:0,img:'',type:'个人账户'},
            {id:0,img:'',type:'企业账户'}
        ]
      }

    },
    methods: {
        url(){
                this.commAccessoryList.forEach(el=>{
                  window.location.href=el.path;
                })
        },
        scrollHandler(){

        if(store.loading||this.parameter.pageNo > this.parameter.pageCount){
            return
         }   
         let listDom = this.$refs.listDom;
          if(listDom.scrollHeight - listDom.scrollTop - listDom.clientHeight < 100){
                    this.getComment()
                    }


      },
      report(){
          this.$router.push({
              name:'report',
              query:{
                  kaId:this.parameter.kaId,
                  text:this.titleT,
              }
          })
      },
      turnTo(url) {
        this.$router.push(url)
      },
      back(){
        history.back()
      },
      toggle(){
          this.show=!this.show;
      },
      toggle1(index){
          this.buyType[index].id=index;
          this.parameter.payType=parseInt(index+1)
          if(index!=0){
              this.buyType[0].id=null;
          }else if(index!=1){
              this.buyType[1].id=null;
          }
        //   console.log(this.parameter.payType)
      },
     detail(){
         var data={
             userId:this.parameter.userId,
             token:this.parameter.getkey,
             kaId:this.parameter.kaId,

             }
      this.xhr.post(`${this.subUrl.bd}/knowAll/detail`, qs.stringify(data)).then((res) => {
          
          if (res.data.code == 1) {
              let data=res.data.data.knowAll;
              if(data.keyword!=''){
                  let arr=[]
                arr=data.keyword.split(',')
                this.keyword=arr.filter(element => {
                    return element!=''
                 });
                //  this.keyword=arr;
                
              }else{
                this.keyword=data.keyword
              }
              

              this.createDate=data.createDate.split(' ')[0]
              this.titleT=data.title;
              this.knowAll=data;
              console.log(this.knowAll.userId)
              this.commAccessoryList=res.data.data.commAccessoryList;
              if(this.parameter.userId==this.knowAll.userId){
                 this.userFalse=false;
                 }else{
               this.userFalse=true;
              }
              
            
          } else if (res.data.code == '-902'){
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      },
      collect(){
          var data={
             userId:this.parameter.userId,
             token:this.parameter.getkey,
             kaId:this.parameter.kaId
             }
      this.xhr.post(`${this.subUrl.bd}/knowAll/collect`, qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
              this.$dialog.toast({mes: "收藏成功！"});
              this.knowAll.isCollect=1;
          } else if (res.data.code == '-902'){
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
      },
     getComment(){
         var data={
             userId:this.parameter.userId,
             token:this.parameter.getkey,
             kaId:this.parameter.kaId,
             pageNo:this.parameter.pageNo,
             pageSize:this.parameter.pageSize
             }
      this.xhr.post(`${this.subUrl.bd}/knowAll/getComment`, qs.stringify(data)).then((res) => {
          
          if (res.data.code == 1) {
            //   console.log(res.data.data)
              res.data.data.list.forEach(element => {
                  element.createDate=element.createDate.split(' ')[0]
              });
            //   this.list=res.data.data.list;
              this.parameter.pageCount=res.data.data.pageCount;
              this.parameter.rowCount=res.data.data.rowCount;
              this.list=this.list.concat(res.data.data.list)
              this.parameter.pageNo++;
          } else if (res.data.code == '-902'){
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      },
      buy(){
          
          var data={
             userId:this.parameter.userId,
             token:this.parameter.getkey,
             kaId:this.parameter.kaId,
             type:this.parameter.type,
             payType:this.parameter.payType
             }
      this.xhr.post(`${this.subUrl.bd}/knowAll/buy`, qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
              this.$dialog.toast({mes: "购买成功！"});
              this.knowAll.isDownload=1;
            //   this.commAccessoryList.forEach(el=>{
            //       window.location.href=el.path;
            //   })
          } else if (res.data.code == '-902'){
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
        this.show=false;
      },


    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = localStorage.getItem('mainColor');
      this.parameter.userId = this.userInfo.guid;
      this.parameter.getkey = fn.getIng();
      this.parameter.kaId = this.$route.params.kaId;
      this.detail();
      this.getComment();

    },
    beforeUpdate(){

    }
  }
</script>
<style scoped>
  .details{width:100%;background: #F1F1F1;overflow-y: scroll;height:calc(100vh - .88rem);}
  .details>div:nth-child(1){width:100%;background: white;padding:.2rem .2rem;}
  .details>div:nth-child(1)>ul{width:100%;display: flex;height:1.2rem;}
  .details>div:nth-child(1)>ul>li{display: flex;}
  .details>div:nth-child(1)>ul>li:nth-child(1){width:1.2rem;}
  .details>div:nth-child(1)>ul>li:nth-child(1)>i{width:1.2rem;height:1.2rem;border-radius: 50%;}
  .details>div:nth-child(1)>ul>li:nth-child(1)>i>img{width:100%;height:100%;border-radius: 50%;}
  .details>div:nth-child(1)>ul>li:nth-child(2){flex:1;flex-flow:column;justify-content: center;padding:0 .2rem;}
  .details>div:nth-child(1)>ul>li:nth-child(2)>span{display: flex;align-items:center}
  .details>div:nth-child(1)>ul>li:nth-child(2)>span.p2{margin:.05rem 0;}
  .details>div:nth-child(1)>ul>li:nth-child(2)>span.p2>a{padding:.02rem .05rem;font-size:.22rem;border-radius: .05rem;margin-right:.1rem;}
  .details>div:nth-child(1)>ul>li:nth-child(2)>span.p3{color:#7A7A7A;}
  .details>div:nth-child(1)>ul>li:nth-child(2)>span.p3>i{width:.35rem;height:.27rem;margin-right:.1rem;}
  .details>div:nth-child(1)>ul>li:nth-child(2)>span.p3>i>img{width:100%;height:100%;}
  .details>div:nth-child(1)>ul>li:nth-child(3){width:1.8rem;}
  .details>div:nth-child(1)>ul>li:nth-child(3)>span{color:#7A7A7A;width:100%;display: flex;justify-content:flex-end;align-items:center;}

  /* .details>div:nth-child(2){width:100%;background: white;padding:.1rem .2rem;}
  .details>div:nth-child(2) ul{width:100%;}
  .details>div:nth-child(2) ul>li{display: flex;}
  .details>div:nth-child(2) ul>li:nth-child(1)>p{text-indent: .6rem;line-height: .4rem;width:100%;}
  .details>div:nth-child(2) ul>li:nth-child(2){margin-top:.1rem;flex-flow:column;}
  .details>div:nth-child(2) ul>li:nth-child(2)>i{margin-bottom:.1rem}
  .details>div:nth-child(2) ul>li:nth-child(2)>i>img{height:4rem;}
  .details>div:nth-child(2) ul>li:nth-child(3){align-items:center;margin-top:.2rem;border-top:1px solid #E4E4E4;
  height:.9rem;}
  .details>div:nth-child(2) ul>li:nth-child(3)>span{width: 1.6rem;border:1px solid #FFB052;height:.5rem;
  display: flex;justify-content: center;align-items:center;border-radius:.05rem;color:#FFB052;}
  .details>div:nth-child(2) ul>li:nth-child(3)>p{flex:1;display: flex;justify-content: flex-end;align-items:center;
  color:#B9B9B9;font-size:.28rem;}
  .details>div:nth-child(2) ul>li:nth-child(3)>p>a{display: flex;align-items: center;height:.8rem;padding:0 .15rem;}
  .details>div:nth-child(2) ul>li:nth-child(3)>p>a>i{width:.4rem;height:.3rem;margin-right:.1rem;} */
    .details>div:nth-child(2){width:100%;background: white;padding:.1rem .2rem;}
  .details>div:nth-child(2) ul{width:100%;}
  .details>div:nth-child(2) ul>li{display: flex;}
  .details>div:nth-child(2) ul>li:nth-child(1)>p{text-indent: .6rem;line-height: .4rem;width:100%;}
  .details>div:nth-child(2) ul>li:nth-child(2){margin-top:.1rem;flex-flow:column;}
  .details>div:nth-child(2) ul>li:nth-child(2)>i{margin-bottom:.1rem}
  .details>div:nth-child(2) ul>li:nth-child(2)>i>img{height:4rem;}
  .details>div:nth-child(2) ul>li:nth-child(3){align-items:center;margin-top:.2rem;border-top:1px solid #E4E4E4;
  height:.9rem;}
  .details>div:nth-child(2) ul>li:nth-child(3)>span{width: 1.6rem;border:1px solid #FFB052;height:.5rem;
  display: flex;justify-content: center;align-items:center;border-radius:.05rem;color:#FFB052;}
  .details>div:nth-child(2) ul>li:nth-child(3)>p{flex:1;display: flex;justify-content: flex-end;align-items:center;
  color:#B9B9B9;font-size:.28rem;}
  .details>div:nth-child(2) ul>li:nth-child(3)>p>a{display: flex;align-items: center;height:.8rem;padding:0 .15rem;position: relative}
  .details>div:nth-child(2) ul>li:nth-child(3)>p>a>div{width:100%;height:100%;position: absolute;opacity: 0;z-index: 999;background: rgba(0,0,0,0)}
  .details>div:nth-child(2) ul>li:nth-child(3)>p>a>div>img{width:100%;height:100%;position: absolute;background: rgba(0,0,0,0)}
  .details>div:nth-child(2) ul>li:nth-child(3)>p>a>div>img:first-child{z-index: 1000;}
  .details>div:nth-child(2) ul>li:nth-child(3)>p>a>i{width:.4rem;height:.3rem;margin-right:.1rem;}


  .details>div:nth-child(3){width:100%;margin-top:.2rem;background: white;padding:.2rem .2rem;}
  .details>div:nth-child(3) ul{width:100%;border-bottom:1px solid #F8F8F8;padding:.1rem 0;}
  .details>div:nth-child(3) ul>li:nth-child(1){width:100%;display: flex;}
  .details>div:nth-child(3) ul>li:nth-child(1)>i{width:.8rem;height:.8rem;background: red;border-radius: 50%;
  margin-right:.2rem;}
  .details>div:nth-child(3) ul>li:nth-child(1)>i>img{width:100%;height:100%;border-radius: 50%;}
  .details>div:nth-child(3) ul>li:nth-child(1)>span{display: flex;flex-flow:column;justify-content: center;}
  .details>div:nth-child(3) ul>li:nth-child(1)>span>a{padding:.05rem 0;}
  .details>div:nth-child(3) ul>li:nth-child(2){margin:.2rem;display: flex;}
  .details>div:nth-child(3) ul>li:nth-child(2)>span{width:100%;}

  .pay{position: fixed;width:100%;height:100vh;background: rgba(0,0,0,.2);top:0;left:0;
  display: flex;justify-content: center;align-items:center;}
  .pay ul li:nth-child(1){position: relative;}
  .pay ul li:nth-child(1)>span{width:.4rem;height:.4rem;border:1px solid #999;border-radius: 50%;display: flex;justify-content: center;
  position: absolute;top:-.2rem;right:-.1rem;align-items: center;font-size: .3rem;color:#999;}
  .pay ul{width:5rem;background: white;border-radius: .2rem;padding:.4rem .3rem;}
  .pay ul li:nth-child(2){padding:.1rem 0;display: flex;justify-content: center;font-size:.4rem;color:#FF8B00;}
  .pay ul li:nth-child(4){display: flex;align-items:center;padding:.3rem 0;border-bottom:1px solid #E9E9E9;}
  .pay ul li:nth-child(4)>i{width:.3rem;height:.3rem;border-radius: 50%;margin:0 .3rem;}
  .pay ul li:nth-child(4)>i>img{width:100%;height:100%;}
  .pay ul li:nth-child(4)>p{flex:1;}
  .pay ul li:nth-child(5){display: flex;align-items:center;padding:.3rem 0;}
  .pay ul li:nth-child(5)>i{width:.3rem;height:.3rem;border-radius: 50%;margin:0 .3rem;}
  .pay ul li:nth-child(5)>i>img{width:100%;height:100%;}
  .pay ul li:nth-child(5)>p{flex:1;}
  .pay ul li:nth-child(6){margin-top:.4rem;display: flex;justify-content:center;align-items:center;}
  .pay ul li:nth-child(6)>button{width: 2.2rem;height:.65rem;border:none;border-radius:.1rem;font-weight: 600;}
</style>
