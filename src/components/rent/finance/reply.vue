<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" title="批复" :bgcolor="mainColor" color="#fff">
      <span class="addClickArea" slot="left" @click="back" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
      <span slot="right" style="color: #fff;" @click="replyFn">发送</span>
    </yd-navbar>
   
    <div class="quick">
        <p>快捷回复</p>
        <yd-radio-group v-model="reply" :color="mainColor">
           <ul>
               <li v-for="(item,index) in getFrList" :key="index"><yd-radio :val="item.content"></yd-radio>
               <span @click="add(item.guid,item.content)">编辑</span></li>
           </ul>
        </yd-radio-group>
    </div>
    
    <div class="declares" style="margin:.2rem 0">
        <div class="textar">
          <span>
            <yd-textarea v-model="reply" slot="right" placeholder="说明/附言" maxlength="100"></yd-textarea>
          </span>
        </div>
        <div class="details">
          <div class="images">
            <ul>
              <li v-show="imgUrl.length>0" v-for="(item,index) in imgUrl" :key="index"><img :src="item" alt=""></li>
            </ul>
            <p v-show="imgUrl.length<4" @click="addImg"><img src="../../../assets/images/rent/estate/search.png" alt="">
             <input class="file" name="file" type="file" accept="image/*" @change="update"/></p>
          </div>
        </div>
    </div>

    <div class="alertText" v-show="alertT">
      <ul>
          <li class="a"><p class="font32 font600">修改快捷回复</p></li>
          <li class="a"><span><input v-model="content" type="text" placeholder="请填写"></span></li>
          <li><button @click="cancel" :style="{background:mainColor}">取 消</button>
          <button @click="editFr" :style="{background:mainColor}">保存</button></li>
      </ul>
    </div>

  </yd-layout>
</template>
<script>
  import fn from "@/assets/js/product";
  import qs from "qs";
  import InfiniteScroll from "vue-infinite-scroll";
  import Vue from "vue";
  import { CellGroup, CellItem } from "vue-ydui/dist/lib.rem/cell";
  import {CheckBox, CheckBoxGroup} from 'vue-ydui/dist/lib.rem/checkbox';
  import {TextArea} from 'vue-ydui/dist/lib.rem/textarea';
  import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog';
  import {TimeLine, TimeLineItem} from 'vue-ydui/dist/lib.rem/timeline';
  Vue.component(TimeLine.name, TimeLine);
  Vue.component(TimeLineItem.name, TimeLineItem);
  Vue.prototype.$dialog = {
    confirm: Confirm,
    alert: Alert,
    toast: Toast,
    notify: Notify,
    loading: Loading,
  };
  Vue.component(TextArea.name, TextArea);
  Vue.component(CheckBox.name, CheckBox);
  Vue.component(CheckBoxGroup.name, CheckBoxGroup);
  Vue.component(CellGroup.name, CellGroup);
  Vue.component(CellItem.name, CellItem);
  import { Radio, RadioGroup } from "vue-ydui/dist/lib.rem/radio";
  Vue.component(Radio.name, Radio);
  Vue.component(RadioGroup.name, RadioGroup);
  export default {
    data() {
      let userInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("userInfo"))
      );
      let mainColor = this.$color[userInfo.organType];
      let endTime = this.$today();
      var organInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("organInfo"))
      );
      // 圈子类型 1企业 2 个人 3 物业
      //用户类型 1:租户；2:商家；3:管理处；4:物业公司；5:其他（个人）；6：业主 0为空
      // 根据用户类型判断
      var userType = userInfo.organType
      let TypeListCircle;
      if (userType == 1) {
        TypeListCircle = 1;
      } else if (userType == 5) {
        TypeListCircle = 2;
      } else{
        TypeListCircle = 3
      }
      return {
        picked: false,
        peopleNum: "",
        organInfo:{},
        mainColor:'',
        userInfo:{},
        userId:'',
        organId:'',
        getkey:'',
        getHearLog:{
          domain:'',
          token:'',
          name:''
        },
        imgName:[],
        imgUrl:[],
        images:[],
        radio2:'',
        alertT:false,
        reply:'',
        accessorys:'',
        getFrList:[],
        content:'',
      };
    },
    methods: {
        update(e){
    let file = e.target.files[0];
    let d = new Date();
    let type = file.name.split('.');
    let tokenParem = {
      'putPolicy':'{\"name\":\"$(fname)\",\"size\":\"$(fsize)\",\"w\":\"$(imageInfo.width)\",\"h\":\"$(imageInfo.height)\",\"hash\":\"$(etag)\"}',
      'key':'orderReview/'+d.getFullYear()+'/'+(d.getMonth()+1)+'/'+d.getDate()+'/'+d.valueOf()+'.'+type[type.length-1],
      'bucket':this.getHearLog.domain,//七牛的地址，这个是你自己配置的（变量）
    };
    let param = new FormData(); //创建form对象
    param.append('chunk','0');//断点传输
    param.append('chunks','1');
    param.append('file',file,file.name)
    // console.log(param.get('file')); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
    let config = {
     headers:{'Content-Type':'multipart/form-data'}
    };
   //先从自己的服务端拿到token

       this.token = this.getHearLog.token;
       param.append('token',this.token);
      //  if(this.images.length>1){
      //    alert('不能超过1张');
      //    return;
      //  }
       this.uploading(param,config,file.name);//然后将参数上传七牛
       return;

  },
  uploading(param,config,pathName){
   this.xhr.post('http://up-z2.qiniu.com',param,config)
    .then(response=>{
     this.getHearLog.name=response.data.key;
     if(this.imgName.length<5){
        this.imgName.push(this.getHearLog.name)
        this.imgUrl.push(this.getHearLog.domain+'/'+this.getHearLog.name)
     }
     this.accessorys=this.imgName.join(',');
     let localArr = this.images.map((val,index,arr)=>{
      return arr[index].localSrc;
     })
     if(!~localArr.indexOf(pathName)){
      this.images.push({'src':this.showUrl+response.data.key,'localSrc':pathName});
     }else{
       alert('已上传该图片');
     }
    })
    },
   getQiniuInfo(){
      this.xhr.post(`${this.subUrl.user}/qiniu/getInfo?token=`+this.getkey).then(res=>{
         if (res.data.code == 1) {
              this.getHearLog=res.data.data;
          } else{
            this.$dialog.toast({mes: res.data.msg});
          }
      })
   },
   editFr(){
     let data={}
     data.frId=this.frId;
     if(this.content==''){
       return
       this.$dialog.toast({mes: '请填写内容！'});
     }
     data.content=this.content;
      this.xhr.post(`${this.subUrl.user}/user/editFr?token=`+this.getkey+'&userId='+this.userId,qs.stringify(data)).then(res=>{
        console.log(res)
         if (res.data.code == 1) {
           this.alertT=false;
           this.$dialog.toast({mes: '编辑成功！'});
           this.getFr();
          } else{
            this.$dialog.toast({mes: res.data.msg});
          }
      })
   },
   //快捷回复
   getFr(){
      this.xhr.post(`${this.subUrl.user}/user/getFr?token=`+this.getkey+'&userId='+this.userId).then(res=>{
        console.log(res)
         if (res.data.code == 1) {
           this.getFrList=res.data.data;
          } else{
            this.$dialog.toast({mes: res.data.msg});
          }
      })
   },
   replyFn(){
        let data = {token:this.getkey,userId:this.userId,orId:this.$route.query.orId,type:this.$route.query.type};
        data.reply=this.reply;
        data.accessorys=this.accessorys;
        this.xhr.post(`${this.subUrl.activity}/ownersCom/ocReport/reply`,qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
             this.$dialog.toast({mes: '批复成功'});
             this.$router.go(-1)
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      },
   addImg(){
     this.getQiniuInfo();
   },
      add(guid,content){
        this.alertT=true;
        this.frId=guid;
        this.content=content;
      },
      confirm(){

      },
      turnTo(url){
          this.$router.push(url)
      },
      selectTab(index) {
        this.showTab = index;
      },
      cancel() {
        this.alertT=false;
      },
      back() {
        this.$router.go(-1);
      }
    },
    mounted() {
      this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.organType = JSON.parse(
      decodeURIComponent(localStorage.getItem("organType"))
    );
    this.mainColor = this.$color[this.organType];
    this.userId = this.userInfo.guid;
    this.organId = this.organInfo.guid;
    this.getkey = fn.getIng();
    this.getFr()
    }
  };
</script>
<style scoped>
.quick{background: white;width:100%;}
.quick p{background: #F5F5F5;padding:.1rem .3rem;}
.quick ul{width: 100%;}
.quick ul li{width:100%;display: flex;justify-content: space-between;padding:.2rem .3rem;border-bottom:1px solid #ECECEC;}


.declares .yd-timeline:after{border-top:none;}
.yd-scrollview .yd-cell-box{margin-bottom: 0;}
.declares {
  width: 100%;background: white;padding:.2rem 0;
}
.declares>ul>li>span>i{padding:.02rem .02rem;color:#F2725E;border:1px solid #F2725E;
margin-left:.2rem;border-radius: .1rem;}
.declares>ul {
  width: 100%;
  padding: 0.1rem 0.3rem;
}
.declares>ul li {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
}
.declares>ul li > p {
  width: 2.4rem;
  display: flex;
  height: 0.6rem;
  justify-content: flex-end;
  align-items: center;
  font-size: 0.28rem;
  color: #777;
}
.declares>ul li > span {
  flex: 1;
  height: 0.6rem;
  display: flex;
  align-items: center;
  border-radius: 0.05rem;
  margin-left:.2rem;
}
.declares>ul li > span > input {
  width: 100%;
  height: 100%;
  border: none;
  margin-left: 0.1rem;
}

.declares>ol {
  width: 100%;
}
.declares>ol li{
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  height:.8rem;
  color: #777;
  padding:0 .4rem;
  align-items: center;
}
.declares>ol li>p{flex:1;height: .8rem;line-height: .8rem;}
.declares>ol li>span{width:1.5rem;height: .8rem;line-height: .8rem;}
.declares>ol li:nth-child(1){
  border-bottom:1px solid #ECECEC;
}
.declares ol li > a > i {
  border-radius: 50%;
  width: 0.4rem;
  height: 0.4rem;
  background: #0093d2;
  font-size: 0.4rem;
  display: flex;
  margin-right: 0.2rem;
  color: white;
  justify-content: center;
  align-items: center;
}

  .details{width:100%;background: white;}
  .text{width:100%;padding:.1rem .3rem;color:#999;}
  .images{display: flex;width:100%;padding:.1rem .3rem;}
  .images>p{border:2px dashed #B6CEEC;width:1.2rem;height:1.2rem;display: flex;
  justify-content:center;align-items:center;border-radius:.1rem;position:relative;}
  .images>p>img{width:.6rem;height:.6rem;}
  .images>ul{display: flex;flex-flow:row;justify-content:center;align-items:center;}
  .images>ul>li{width:1.2rem;height:1.2rem;margin:0 .1rem;}
  .images>ul>li>img{width:1.2rem;height:1.2rem;border-radius:.1rem;}
  .images>p>input{width:100%;height:.9rem;opacity: 0;position: absolute;left:0;top:0;}

  .textar{display: flex;padding:.1rem .3rem;}
.textar>span{width:100%;height:100%;border:1px solid #d9d9d9;padding:0 .2rem;}

.alertText{z-index:999;width:100%;position:fixed;height:100vh;background: rgba(0,0,0,.2);top:0;left:0;display: flex;justify-content: center;align-items: center;}
  .alertText>ul{width:6.5rem;height:3rem;background: white;padding:.2rem .3rem;
  border-radius: .2rem;display: flex;flex-flow: column;justify-content: center;}
  .alertText ul li.a{width:100%;display:flex;flex-flow:row; align-items:center;padding:.1rem 0;}
  .alertText ul li.a>span{border-radius:.05rem;flex:1;border:1px solid #E6E7E7;height:.7rem;display: flex;align-items:center;}
  .alertText ul li.a>p{flex:1;text-align: center;}
  .alertText ul li.a>span>input{border:none;margin-left:.2rem;height: 100%;width:100%;}
  .alertText ul li:last-child{margin-top:.2rem;display: flex;justify-content: space-around;}
  .alertText ul li:last-child>button{font-size:.32rem;font-weight:600;color:white;
  padding:.2rem .5rem;border:none;border-radius: .1rem;}
</style>