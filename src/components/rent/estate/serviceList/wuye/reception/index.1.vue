<template>
  <yd-layout class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'接待'" title="接待" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span class="spanLeft" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
         <span @click="turnTo('/estate/serviceList/reception/declares')" slot="right" class="edit spanRight" style="color: #fff;font-size:.6rem;">+</span>
      </yd-navbar>
    </div>

    <div class="search">
        <div>
            <i><img src="../../../../../../assets/images/rent/my/search.png" alt=""></i>
            <span><input type="text" placeholder="请输入关键字或编码" @keyup.enter="search" v-model="keyword"></span>
        </div>
        <div @click="toggle">筛选</div>
    </div>
    <div v-show="show1" class="screen">
          <ul>
            <li><p>起止时间</p></li>
            <li>
              <span><yd-datetime type="date" v-model="startDate" slot="right"></yd-datetime></span>
              <i>-</i>
              <span><yd-datetime type="date" v-model="endDate" slot="right"></yd-datetime></span>
            </li>
            <li><p>状态</p></li>
            <li>
                <a v-for="(item,index) in tabs" :key="index" @click="tabClick(index)" :style="num==index?'border: 1px solid '+mainColor:''">{{item}}</a>
            </li>
            <li>
                <button @click="toggle">取消</button>
                <button class="aa" @click="Determine">确定</button>
            </li>
          </ul>
    </div>

    <div class="contentList" @scroll="scrollHandler" ref="listDom">
       <div class="content" v-for="(item,index) in contentList" :key="index" @click="turnTo('/estate/serviceList/reception/details/888#'+item.guid)">
              <div class="top">
                    <p></p>
                    <span>单号：{{item.guid}}</span>
              </div>
              <div class="bottom">
                   <i><img src="../../../../../../assets/images/rent/estate/search.png" alt=""></i>
                   <p>
                   <span style="width:4rem" class="textHidden">{{item.detailContent}}</span>
                   <a style="width:2rem" class="textHidden">{{item.customerName}}<span class="cc"></span></a>
                   </p>
                   <span>
                      <span v-show="item.status!=null" :style="{border:'1px solid '+mainColor,color:mainColor}">{{item.status}}</span>
                      <p><i><img src="../../../../../../assets/images/rent/estate/search.png" alt=""></i>{{item.createDate}}</p>
                   </span>
              </div>
              
        </div>
        <div  class="Section" v-show="pageSize>=5">
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
    </div>

  </yd-layout>
</template>
<script>
  import Vue from 'vue';
  import fn from '@/assets/js/product'
  import qs from 'qs'
  import store from '@/store'
  import {DateTime} from 'vue-ydui/dist/lib.rem/datetime';
  Vue.component(DateTime.name, DateTime);

  export default {
    data() {
      return {
        num:0,
        mainColor: "",
        organInfo:'',
        userInfo:'',
       contentList:[],
       userId:'',
       organId:'',
       organType:'',
       tabs:['上报中','已接单','处理中','已完成','关闭'],
       active:null,
       show:false,
       show1:false,
       pageNo:1,
       pageSize:5,
       pageCount:null,
       keyword:'',
       startDate:this.$today(0),
       endDate:this.$today(0),
       status:null
      }
    },
    methods: {
      scrollHandler(){

        if(store.loading||this.pageNo > this.pageCount){
            return
         }
        let listDom = this.$refs.listDom;
        if(listDom.scrollHeight - listDom.scrollTop - listDom.clientHeight < 100){
        this.listReceptoin()
        }

      },
      toggle(){
        this.show1=!this.show1;
      },
      turnTo(url) {
        this.$router.push(url)
      },
      back(){
        this.$router.go(-1)
      },
      tabClick(index){
         this.num=index
        this.status=index+1
      },
      // 获取信息列表
      Determine(){
        this.pageNo=1;
        this.listReceptoin()
        this.show1=false;
      },
      search(){
        this.pageNo=1;
        this.listReceptoin()
      },
      listReceptoin(){
       if(this.show1){
           var data = {
        token:this.getkey,
        userId: this.userId,
        organId:this.organId,
        organType:this.organType,
        pageNo:this.pageNo,
        pageSize:this.pageSize,
        startDate:this.startDate+' 00:00:00',
        endDate:this.endDate+' 00:00:00',
        };
        if(this.status!=null){
           data.status=this.status
         }
       }else{
         
        var data = {
        token:this.getkey,
        userId: this.userId,
        organId:this.organId,
        organType:this.organType,
        pageNo:this.pageNo,
        pageSize:this.pageSize,
        };
          if(this.keyword!=null){
          data.keywordOrNo=this.keyword;
         }
         
       }
        
        
        
        this.xhr.post(`${this.subUrl.activity}/reception/listReceptoin?`+ qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
            // console.log(res)
            res.data.data.list.forEach(item=>{
              if(item.createDate!=null){
                 item.createDate=item.createDate.split(' ')[0]
              }
              if(item.status==1){
              item.status='进行中'
            }else if(item.status==1){
              item.status='不同意'
            }else if(item.status==1){
              item.status='完成'
            }else if(item.status==1){
              item.status='关闭'
            }

            })
               this.pageCount=res.data.data.pageCount;
            if(this.pageNo>=2){
               this.contentList = this.contentList.concat(res.data.data.list);
            }else{
              this.contentList=res.data.data.list;
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
      this.mainColor = this.$color[this.userInfo.organType]
      this.userId = this.userInfo.guid;
      this.organId = this.organInfo.guid;
      this.organType = this.organInfo.organType;
      this.getkey = fn.getIng();
      this.listReceptoin()
      


    },
    beforeUpdate(){
      // console.log(this.pageNo)
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


 .search{position: relative;width:100%;height:.85rem;background:white;display:flex;
 flex-flow:row;padding:.15rem .3rem;border-bottom:1px solid #E8E8E8;}
 .search>div:nth-child(1){flex:1;background:#EBEBED;border-radius:.6rem;display:flex;justify-content:center;
 align-items:center;}
 .search>div:nth-child(1)>i{width:.35rem;height:.35rem;margin-right:.1rem;}
 .search>div:nth-child(1)>i>img{width:100%;height:100%;}
 .search>div:nth-child(1)>span{width:2.4rem;}
 .search>div:nth-child(1)>span>input{width:100%;font-size:.24rem;color:#A2A1A6;border:none;}
 .search>div:nth-child(2){width:1.6rem;display:flex;justify-content:center;align-items:center;}

  .screen{width:100%;position:absolute;height:calc( 100vh - .85rem );background: rgba(0,0,0,.1);
  z-index:999;left:0;}
  .screen ul{background:#F6F6F6;height:5rem;}
  .screen ul li{display: flex;flex-flow:row wrap;align-items:center;}
  .screen ul li:nth-child(1){width:100%;padding:.1rem .3rem;}
  .screen ul li:nth-child(2){width:100%;padding:.1rem .3rem;justify-content: center;}
  .screen ul li:nth-child(2)>span{background:white;width:3rem;height:.7rem;border:1px solid #E9E9E9;display: flex;align-items:center;}
  .screen ul li:nth-child(2)>i{margin:0 .3rem;}
  .screen ul li:nth-child(2)>span>input{width:3rem;height:.7rem;border:none;}
  .screen ul li:nth-child(3){width:100%;padding:.1rem .3rem;}
  .screen ul li:nth-child(4){width:100%;padding:.1rem .3rem;justify-content: space-between}
  .screen ul li:nth-child(4)>a{background:white;width:29%;height:.7rem;border:1px solid #F0F0F0;
  display: flex;color:#999;justify-content: center;align-items:center;margin-bottom:.2rem;}
  .screen ul li:nth-child(4)>a.ative{border:1px solid #999;}
  .screen ul li:nth-child(5){width: 100%;height:.95rem;background: white;display: flex;flex-flow:row;
  justify-content: space-around;align-items:center;}
  .screen ul li:nth-child(5) button{width: 50%;height:.95rem;border:none;border-top:1px solid #E4E4E4;
  font-size:.3rem;font-weight: 600;color:#A2A2A2;}
  .screen ul li:nth-child(5) button:hover{color:#1E82D2;}
  .screen ul li:nth-child(5) button.aa{border-left:1px solid #E4E4E4;}

 .contentList{width:100%;height:calc( 100vh - 1.75rem );overflow-y:scroll;}
 .content{width:100%;display:flex;flex-flow:column;padding:.1rem .2rem;background:white;margin-top:.2rem;}
 .top{border-bottom:1px dashed #AAAAAA;color:#747474;display:flex;flex-flow:row;
 justify-content:space-between;align-items:center;font-size:.24rem;}
 .top>p{height:.6rem;display:flex;justify-content:center;align-items:center;}
 .top>p>i{height:.3rem;width:.3rem;margin-right:.1rem;}
 .top>p>i>img{width:100%;height:100%;}

 .cc{margin-left:.8rem}

 .bottom{display:flex;flex-flow:row;padding:.1rem 0 .1rem .1rem;}
.bottom>i{width:1rem;height:1.2rem;}
.bottom>i>img{width:100%;height:100%;}

.bottom>p{flex:1;display:flex;flex-flow:column;justify-content:center;padding:0 .2rem;}
.bottom>p>a{font-size:.24rem;color:#747474;padding:.1rem 0;}
.bottom>p>span{font-size:.32rem;color:#000;padding:.1rem 0;}

.bottom>span{width:2rem;height:1.2rem;display:flex;flex-flow:column;justify-content:center;align-items:flex-end;}
.bottom>span>span{margin-bottom:.3rem;border-radius:.04rem;font-size:.22rem;padding:.02rem .1rem}
.bottom>span>p{display:flex;font-size:.24rem;color:#747474;}
.bottom>span>p>i{height:.3rem;width:.3rem;margin-right:.1rem;}
.bottom>span>p>i>img{width:100%;height:100%;}

</style>
