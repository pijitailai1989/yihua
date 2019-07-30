<template>
   <div class="myLibrary" v-title="'我的文库'">
       <div class="search">
             <ul>
               <li><yd-search v-model="value" :on-submit="submitHandler"></yd-search></li>             
             </ul>
        </div>
        <yd-tab :active-color="mainColor" :callback="callback">
          <yd-tab-panel :label="'我的收藏('+countNum.collectNum+')'" style="background:#EFEFEF" tabkey='1'>
            <div class="aa" @scroll="scrollHandler" ref="listDom">
             <ul class="libList" v-for="(item,index) in libraryList" :key="index">
                <li @click="checks(index)">
                  <i v-if="item.clickImg"><img src="../../../../assets/images/rent/baishitong/select_active.png" alt=""></i>
                  <i v-else><img src="../../../../assets/images/rent/baishitong/select.png" alt=""></i>
                </li>
                <li v-if="item.title!=null" @click="turnTo('/baishitong/find/details/'+item.kaId)">
                     <p>
                       <span class="font32 textHidden" style="width:3rem">{{item.title}}</span>
                       <a style="color:#FF9D2F;font-size:.25rem">{{item.bp}}商机点</a>
                     </p>
                     <span class="font24" style="color:#A7A7A7;">{{item.createDate}}</span>
                </li>
                <li v-else>
                     <p>
                       <span class="font32 textHidden" style="width:3rem">该收藏已被删！</span>
                       <a style="color:#FF9D2F;font-size:.25rem"></a>
                     </p>
                     <span class="font24" style="color:#A7A7A7;"></span>
                </li>
                <li>
                    <p class="font26" style="color:#0093D2;">{{item.status}}</p>
                </li>
                <li><p class="font26"></p></li>
             </ul>
             <div  class="Section">
              <div v-if="parameter.pageNo <= parameter.pageCount">
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
          </yd-tab-panel>
          <yd-tab-panel :label="'我的下载('+countNum.downloadNum+')'" style="background:#EFEFEF" tabkey='2'>
            <div class="aa" @scroll="scrollHandler" ref="listDom1">
             <ul class="libList" v-for="(item,index) in libraryList" :key="index">
                <li @click="checks(index)">
                  <i v-if="item.clickImg"><img src="../../../../assets/images/rent/baishitong/select_active.png" alt=""></i>
                  <i v-else><img src="../../../../assets/images/rent/baishitong/select.png" alt=""></i>
                </li>
                <li v-if="item.title!=null" @click="turnTo('/baishitong/find/details/'+item.kaId)">
                     <p>
                       <span class="font32 textHidden" style="width:3rem">{{item.title}}</span>
                       <a style="color:#FF9D2F;font-size:.25rem">{{item.bp}}商机点</a>
                     </p>
                     <span class="font24" style="color:#A7A7A7;">{{item.createDate}}</span>
                </li>
                <li v-else>
                     <p>
                       <span class="font32 textHidden" style="width:3rem">该收藏已被删！</span>
                       <a style="color:#FF9D2F;font-size:.25rem"></a>
                     </p>
                     <span class="font24" style="color:#A7A7A7;"></span>
                </li>
                <li>
                    <p class="font26" style="color:#0093D2;"></p>
                </li>
                <li><p class="font26"></p></li>
             </ul>
             

             <div  class="Section">
              <div v-if="parameter.pageNo <= parameter.pageCount">
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
          </yd-tab-panel>
          <yd-tab-panel :label="'我的上传('+countNum.uploadNum+')'" active style="background:#EFEFEF" tabkey='3'>
            <div class="aa" @scroll="scrollHandler" ref="listDom2">
             <ul class="libList" v-for="(item,index) in libraryList" :key="index">
                <li @click="checks(index)">
                  <i v-if="item.clickImg"><img src="../../../../assets/images/rent/baishitong/select_active.png" alt=""></i>
                  <i v-else><img src="../../../../assets/images/rent/baishitong/select.png" alt=""></i>
                </li>
                <li @click="turnTo('/baishitong/find/details/'+item.kaId)">
                     <p>
                       <span class="font32 textHidden" style="width:3rem">{{item.title}}</span>
                       <a style="color:#FF9D2F;font-size:.25rem">{{item.bp}}商机点</a>
                     </p>
                     <span class="font24" style="color:#A7A7A7;">{{item.createDate}}</span>
                </li>
                <li>
                    <p class="font26" style="color:#0093D2;">{{item.status}}</p>
                </li>
                <li @click="turnTo('/baishitong/myLibrary/upload#'+item.guid)"><p class="font26">编辑</p></li>
             </ul>
             <div  class="Section">
              <div v-if="parameter.pageNo <= parameter.pageCount">
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
          </yd-tab-panel>
        </yd-tab>
        <div class="checkAll">
           <ul>
              <li @click="checkAll">
                <i v-if="checkAllImg"><img src="../../../../assets/images/rent/baishitong/select_active.png" alt=""></i>
                <i v-else><img src="../../../../assets/images/rent/baishitong/select.png" alt=""></i>
              </li>
              <li>
                <p class="font32 font600">全选</p>
              </li>
              <li>
                <span class="font30" @click="del">删除</span>
              </li>
           </ul>
        </div>
   </div>
</template>
<script type="template/vue">
  import Vue from 'vue';
  import fn from '@/assets/js/product'
  import qs from 'qs'
  import {Search} from 'vue-ydui/dist/lib.rem/search';
  Vue.component(Search.name, Search);
  import {Tab, TabPanel} from 'vue-ydui/dist/lib.rem/tab';
  Vue.component(Tab.name, Tab);
  Vue.component(TabPanel.name, TabPanel);
  import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog';

Vue.prototype.$dialog = {
    confirm: Confirm,
    alert: Alert,
    toast: Toast,
    notify: Notify,
    loading: Loading,
};
  import store from '@/store'
  export default {
    data() {
      return {
        mainColor: "",
        organInfo:'',
        userInfo:'',
        value:'',
        libraryList:[],
        libraryList1:[],
        checkAllImg:false,
        parameter:{
          token:'',
          userId:null,
          type:3,
          pageNo:1,
          pageSize:6,
          pageCount:null,
          kaIds:'',
          keyword:''
        },
        countNum:{
          fineNum:0,
          uploadNum:0,
          downloadNum:0,
          collectNum:0
        },
      }

    },
    watch:{
       'parameter.type':'myLib'
    },
    methods: {
      checks(index){
         let arr1=[]
         this.libraryList[index].clickImg=!this.libraryList[index].clickImg
         let arr=this.libraryList.filter((item,index)=>{
            return item.clickImg==true
         })
         this.libraryList1=this.libraryList.filter(item=>{
           return item.clickImg==false
         })
         
         arr.forEach(element=>{
            arr1.push(element.kaId)
         })
         if(this.libraryList.length>arr.length){
           this.checkAllImg=false;
         }else if(this.libraryList.length==arr.length){
           this.checkAllImg=true;
         }

         this.parameter.kaIds=arr1.join(',')

         
      },
      checkAll(){
         this.checkAllImg=!this.checkAllImg;
         this.libraryList.forEach(element => {
           element.clickImg=this.checkAllImg
         });
         let arr1=[]
         this.libraryList1=this.libraryList.filter(item=>{
           return item.clickImg==false
         })
         let arr=this.libraryList.filter((item,index)=>{
            return item.clickImg==true
         })
         arr.forEach(element=>{
            arr1.push(element.kaId)
         })
         this.parameter.kaIds=arr1.join(',')
         console.log(this.parameter.kaIds)
      },
      turnTo(url) {
        this.$router.push(url)
      },
      submitHandler(value) {
                this.$dialog.toast({mes: `搜索：${value}`});
                this.parameter.pageNo=1;
                this.myLib()
                
      },
      count(){
        var data={
          userId:this.parameter.userId,
          token:this.parameter.token,
        }
        this.xhr.post(`${this.subUrl.bd}/knowAll/count`, qs.stringify(data) ).then((res) => {
          if (res.data.code == 1) {
            if(res.data.data!=null){
              this.countNum.collectNum=res.data.data.collectNum
              this.countNum.downloadNum=res.data.data.downloadNum
              this.countNum.fineNum=res.data.data.fineNum
              this.countNum.uploadNum=res.data.data.uploadNum
            }
            
          //  console.log(res.data)
          } else if (res.data.code == '-902'){
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      },
      scrollHandler(){

        if(store.loading||this.parameter.pageNo > this.parameter.pageCount){
            return
         }
          
          let listDom = this.$refs.listDom;
          if(listDom.scrollHeight - listDom.scrollTop - listDom.clientHeight < 100){
              this.myLib() }

          let listDom1 = this.$refs.listDom1;
          if(listDom1.scrollHeight - listDom1.scrollTop - listDom1.clientHeight < 100){
              this.myLib() }
                    
          let listDom2 = this.$refs.listDom2;
          if(listDom2.scrollHeight - listDom2.scrollTop - listDom2.clientHeight < 100){
              this.myLib() }
 
      },
      callback(val,guid){
        this.parameter.pageNo=1;
        this.parameter.pageSize=6;
        this.parameter.type=guid;
        this.checkAllImg=false;
        // let that=this;
        // that.$dialog.loading.open('加载中..');
      },
      myLib(){
        if(this.value==''){
          var data={
          userId:this.parameter.userId,
          token:this.parameter.token,
          type:this.parameter.type,
          pageNo:this.parameter.pageNo,
          pageSize:this.parameter.pageSize
          }
        }else{
           var data={
          userId:this.parameter.userId,
          token:this.parameter.token,
          type:this.parameter.type,
          pageNo:this.parameter.pageNo,
          pageSize:this.parameter.pageSize,
          keyword:this.value,
         }
        }
        
        this.xhr.post(`${this.subUrl.bd}/knowAll/myLib`, qs.stringify(data) ).then((res) => {
          if (res.data.code == 1) {
            this.$dialog.loading.close();
            if(res.data.data.list!=null){
            res.data.data.list.forEach(element => {
               element.createDate=element.createDate.split(' ')[0]
               element.clickImg=false;
               if(element.status==0){
                 element.status='不通过'
               }else if(element.status==1){
                 element.status="正常"
               }else if(element.status==2){
                 element.status="关闭"
               }
            });
            }
            this.parameter.pageCount=res.data.data.pageCount;
            if(this.parameter.pageNo>=2){
              this.libraryList=this.libraryList.concat(res.data.data.list);
            }else{
              this.libraryList = res.data.data.list;
            }
            
           this.parameter.pageNo++;
            console.log(this.libraryList)
          } else if (res.data.code == '-902'){
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      },
      del(){
        this.checkAllImg=false;
        var data={
          userId:this.parameter.userId,
          token:this.parameter.token,
          kaIds:this.parameter.kaIds,
          type:this.parameter.type
        }
        this.xhr.post(`${this.subUrl.bd}/knowAll/delLib`, qs.stringify(data) ).then((res) => {
          if (res.data.code == 1) {
            this.libraryList=this.libraryList1
            this.$dialog.toast({mes: '删除成功！'});
            this.myLib()
            this.count();
          } else if (res.data.code == '-902'){
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
      this.parameter.userId = this.userInfo.guid;
      this.parameter.token = fn.getIng();
      this.count();
      
    },
    created(){

    },
    beforeUpdate(){
    }
  }
</script>
<style scoped>
  .myLibrary{width:100%;position: relative;}
  .search{width:100%;height:.95rem;background:#F7F7F9;position: relative}
  .search ul{width:100%;height:.95rem;display: flex;align-items:center;}
  .search ul li:nth-child(1){flex:1;}
  .search ul li:nth-child(2){width:1.2rem;display: flex;justify-content:center;}
  
  .aa{padding:.2rem 0;margin-bottom: .8rem;overflow-y: scroll;height:calc( 100vh - 4.58rem );}
  .libList{width:100%;display:flex;margin-bottom:.2rem;background: white;;}
  .libList li{display:flex;height:1.5rem;}
  .libList li:nth-child(1){width:.7rem;justify-content: center;align-items:center;}
  .libList li:nth-child(1)>i{width:.35rem;height:.35rem;}
  .libList li:nth-child(1)>i>img{width:100%;height:100%;}
  .libList li:nth-child(2){flex:1;flex-flow:column;justify-content: center;}
  .libList li:nth-child(2)>p{margin-bottom:.1rem;display: flex;align-items: center;}
  .libList li:nth-child(2)>p>a{margin-left:.2rem;}
  .libList li:nth-child(3){width:1.2rem;justify-content:center;align-items: center;}
  .libList li:nth-child(4){width:1rem;justify-content:center;align-items: center;}


  .checkAll{position: absolute;;width:100%;background: white;height:.8rem;
  bottom:0;left:0;z-index:999;}
  .checkAll ul li{width: 100%;height:100%;}
  .checkAll ul{display: flex;height:100%;}
  .checkAll ul li:nth-child(1){width:.8rem;display: flex;justify-content: center;align-items:center;}
  .checkAll ul li:nth-child(1)>i{width:.35rem;height:.35rem;}
  .checkAll ul li:nth-child(1)>i>img{width:100%;height:100%;}
  .checkAll ul li:nth-child(2){flex:1;display: flex;align-items: center;}
  .checkAll ul li:nth-child(3){width:1.5rem;height:.8rem;background: #FF5A5A;color:white;display: flex;
  justify-content: center;align-items: center;}
</style>