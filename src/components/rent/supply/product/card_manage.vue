<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" v-title="'名片管理'" title="名片管理" :bgcolor="mainColor" color="#fff">
      <span class="addClickArea" slot="left" @click="back" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
      <span class="addClickArea" @click="addOrEditShopCard" slot="right" style="color:white">保存</span>
    </yd-navbar>
<!-- 
    <div class="declares">
        <ul>
            <li><p>项目名称</p><span><input type="text"></span></li>
            <li><p>招标金额</p><span><input type="text"></span></li>
            <li><p>截止日期</p><span>
                <yd-datetime type="date" v-model="datetime1" slot="right"></yd-datetime>
                </span></li>
            <li><p>买家地址</p><span><input type="text"></span></li>
            <li><p>交货日期</p><span>
                <yd-datetime type="date" v-model="datetime2" slot="right"></yd-datetime>
                </span></li>
            <li><p>交货地址</p><span><input type="text"></span></li>
        </ul>
    </div> -->

    <div class="declares" style="margin-bottom:.2rem;">
        <ol>
            <li sytle="color:#666"><p>名称:{{organName}}</p></li>          
        </ol>
        <ul>
            <!-- <li>
                <p>头像</p>
                <div class="images">
                  <ul>
                   <li v-for="(item,index) in imgUrl" :key="index"><img :src="item" alt=""></li>
                  </ul>
                  <p v-show="show1" @click="addImg"><img src="../../../../assets/images/rent/estate/search.png" alt="">
                  <input class="file" name="file" type="file" accept="image/*" @change="update"/></p>
                </div>
            </li> -->
            <li><p>联系人</p><span><input v-model="pm.name" type="text"></span></li>
            <li><p>手机号码</p><span><input v-model="pm.phone" type="number"></span></li>
            <li><p>联系QQ</p><span><input v-model="pm.qq" type="number"></span></li>
            <li><p>联系邮箱</p><span><input v-model="pm.email" type="text"></span></li>
            <li><p>固定电话</p><span><input v-model="pm.telePhone" type="text"></span></li>
            <li><p>详情地址</p><span><input v-model="pm.address" type="text"></span></li>
            <li><p>所在大厦</p><span><input v-model="pm.building" type="text"></span></li>
        </ul>
    </div>
    
    <div class="declares">
        <ol>
            <li sytle="color:#666"><p>企业介绍</p><span>
                <a style="padding:.07rem .2rem;border-radius:.05rem;font-size:.24rem;color:white;" :style="{background:mainColor}">未认证</a></span></li>          
        </ol>
        <ul style="border-bottom:1px dashed #D9D9D9;">
            <li>
                <p>LOGO</p>
                <div class="images">
                  <ul>
                   <li v-show="imgUrl1!=''"><img :onerror="logo" :src="imgUrl1" alt=""></li>
                  </ul>
                  <p @click="addImg(1)"><img src="../../../../assets/images/rent/supply/shangchuan.png" alt="">
                  <input class="file" name="file" type="file" accept="image/*" @change="update"/></p>
                </div>
            </li>
            <li><p>成立时间</p><span><yd-datetime type="date" v-model="pm.foundinTime" slot="right"></yd-datetime></span></li>
            <li><p>注册资本</p><span><input v-model="pm.capital" type="text"></span></li>
            <li><p>所属行业</p><span><input v-model="pm.industry" type="text"></span></li>
            <li><p>法人代表</p><span><input v-model="pm.representative" type="text"></span></li>
            <li><p>经营模式</p><span><input v-model="pm.pattern" type="text"></span></li>
            <li><p>员工人数</p><span><input v-model="pm.peopleNum" type="text"></span></li>
            <li><p>年营业额</p><span><input v-model="pm.turnover" type="text"></span></li>
            <li><p>企业官网</p><span><input v-model="pm.website" type="text"></span></li>
            <li><p>微信号</p><span><input v-model="pm.weChat" type="text"></span></li>
        </ul>
        
    </div>
    <div class="text" style="margin-bottom:.2rem;">
      <div class="ttt">资质证照</div>
      <div class="images">
                  <ul>
                   <li v-for="(item,index) in imgUrl2" :key="index" style="margin:0;margin-right:.1rem;">
                     <img :src="item" alt="">
                     <span @click="delImg(index)">x</span>
                   </li>
                  </ul>
                  <p v-show="imgUrl2.length<5" @click="addImg(2)"><img src="../../../../assets/images/rent/supply/shangchuan.png" alt="">
                  <input class="file" name="file" type="file" accept="image/*" @change="update"/></p>
      </div>
    </div>

    <div class="declares" style="margin-bottom:.2rem;">
        <ol>
            <li sytle="color:#666">商家介绍</li>      
        </ol>
        <div class="textar" style="margin-top:.2rem;">
          <span>
            <yd-textarea slot="right" v-model="pm.describes" :placeholder="pm.describes" maxlength="100"></yd-textarea>
          </span>
        </div>
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
  import {DateTime} from 'vue-ydui/dist/lib.rem/datetime';
  Vue.component(DateTime.name, DateTime);
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
        logo: 'this.src="' + require('../../../../assets/images/rent/supply/photo.png') + '"',
        picked: false,
        peopleNum: "",
        organInfo,
        mainColor,
        userInfo,
        imgLength: 0,
        imgIndex: 0,
        TypeListCircle,
        bbsList: [],
        pianList: [],
        uploadFileList: [],
        uploadPreviewList: [],
        selectList: [],
        keyword: [],
        checkbox: false,
        agree: false,
        title: "",
        showTab: 0,
        text: "",
        getData: "",
        getLogoMsg: "",
        imageUrlList: [],
        imageKeyList: [],
        imageUrl: "",
        TypeList: "",
        TypeList1: -1,
        TypeList2: "",
        TypeList3: [],
        endTime,
        alertT:false,
        info:{
          name:'',mobile:null,decorationId:null,type:''
        },
        regId:/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
        regName:/^[a-zA-Z\u4e00-\u9fa5]+$/,
        regPhone:/^1[3578]\d{9}$/,
        getHearLog:{
          domain:'',
          token:'',
          name:''
        },
        imgName:[],
        imgUrl1:'',
        imgUrl2:[],
        imgUrl3:[],
        show1:true,
        images:[],
        datetime2:this.$today(),
        datetime1:this.$today(),
        type:null,
        shopCard:{},
        organName:'',
        pm:{
          guid:'',
          userId:'',
          organId:'',
          name:'',
          phone:'',
          qq:'',
          email:'',
          telePhone:'',
          address:'',
          building:'',
          logo:'',
          foundinTime:this.$today(),
          capital:'',
          industry:'',
          representative:'',
          pattern:'',
          peopleNum:'',
          turnover:'',
          website:'',
          weChat:'',
          describes:'',
          state:'',
          accessorys:[]
        }
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
    //  console.log(response.data);
     this.getHearLog.name=response.data.key;
     if(this.type==1){
        this.imgUrl1=this.getHearLog.domain+'/'+this.getHearLog.name
        this.pm.logo=this.getHearLog.domain+'/'+this.getHearLog.name;
     }
     if(this.type==2){
        if(this.imgUrl3.length<5){
          this.imgUrl3.push(this.getHearLog.name)
          this.imgUrl2.push(this.getHearLog.domain+'/'+this.getHearLog.name)
        }
       
        console.log(this.imgUrl3,this.imgurl2)
     }
     
     let localArr = this.images.map((val,index,arr)=>{
      return arr[index].localSrc;
     })
    //  console.log(this.imgName)
     if(!~localArr.indexOf(pathName)){
      this.images.push({'src':this.showUrl+response.data.key,'localSrc':pathName});
     }else{
       alert('已上传该图片');
     }
    })
    },
    delImg(index){
       this.imgUrl3.splice(index,1)
       this.imgUrl2.splice(index,1)
    },
   getQiniuInfo(){
      this.xhr.post(`${this.subUrl.user}/qiniu/getInfo?token=`+this.getkey).then(res=>{
         if (res.data.code == 1) {
              // console.log(res)
              this.getHearLog=res.data.data;
              
          } else{
            this.$dialog.toast({mes: res.data.msg});
          }
      })
   },
   addImg(type){
     this.type=type;
     
     this.getQiniuInfo();
   },
      add(){
        this.alertT=true;
      },
      confirm(){

      },
      nameBlur(){
        if(!this.regName.test(this.info.name)){
          this.$dialog.toast({mes: '请输入规范名字'});
          this.info.name=""
        }else if(this.info.name==null){
          this.$dialog.toast({mes: '名字不能为空'});
        }
      },
      idBlur(){
         if(!this.regId.test(this.info.decorationId)){
          this.$dialog.toast({mes: '身份号码格式错误'});
          this.info.decorationId=""
        }else if(this.info.decorationId==null){
          this.$dialog.toast({mes: '身份号码不能为空'});
        }
      },
      phoneBlur(){
         if(!this.regPhone.test(this.info.mobile)){
          this.$dialog.toast({mes: '手机号格式错误'});
          this.info.mobile=""
        }else if(this.info.mobile==null){
          this.$dialog.toast({mes: '手机号码不能为空'});
        }
      },
      // 
      addOrEditShopCard() {
        if(this.pm.name!=''&&this.pm.phone!=''&&this.pm.qq!=''&&
        this.pm.email!=''&&this.pm.telePhone!=''&&this.pm.address!=''&&
        this.pm.address!=''){
        this.pm.accessorys=this.imgUrl3;
        let data={}
        data={
          // userId:this.pm.userId,
          // organId:this.pm.organId,
          name:this.pm.name,
          phone:this.pm.phone,
          qq:this.pm.qq,
          email:this.pm.email,
          telePhone:this.pm.telePhone,
          address:this.pm.address,
          building:this.pm.building,
          logo:this.pm.logo,
          foundinTime:this.pm.foundinTime+' 00:00:00',
          capital:this.pm.capital,
          industry:this.pm.industry,
          representative:this.pm.representative,
          pattern:this.pm.pattern,
          peopleNum:this.pm.peopleNum,
          turnover:this.pm.turnover,
          website:this.pm.website,
          weChat:this.pm.weChat,
          describes:this.pm.describes,
          accessorys:this.pm.accessorys,
          state:0
        }
        if(this.pm.guid!=''){
          data.guid=this.pm.guid
        }
        if(this.pm.userId!=''){
          data.userId=this.pm.userId
        }
        if(this.pm.organId!=''){
          data.organId=this.pm.organId
        }
        this.$ajax1(
          `${this.subUrl.bd}/opportunity/addOrEditShopCard?token=`+this.getkey,
          data,
          res => {
            if(res.code==1){
              this.$router.go(-1);
              this.$dialog.toast({mes: '保存成功！'});
            }
            
          },
          this
        );
        }else{
          this.$dialog.toast({mes: '基本信息不能为空！'});
        }
      },
      getShopCard() {
        let data={}
        data.token=this.getkey
        this.$ajax(
          `${this.subUrl.bd}/opportunity/getShopCard`,
          data,
          res => {
           if(res.data!=null){
              this.pm=res.data
              this.imgUrl1=res.data.logo
              res.data.accessoryList.forEach(el=>{
                 this.imgUrl2.push(el.path)
                 this.imgUrl3.push(el.fileName)
              })
           } 
            
          },
          this
        );
      },
      selectTab(index) {
        this.showTab = index;
      },
      cancel() {
        this.alertT=false;
      },
      back() {
        this.$router.go(-1);
      },
      turnTo(url){
          this.$router.push(url)
      }
    },
    mounted() {
      // this.pm.userId = this.userInfo.guid;
      // this.pm.organId=this.organInfo.guid;
      this.getkey = fn.getIng();
      this.getShopCard();
      this.organName=this.organInfo.organName
      console.log(this.organInfo)
    }
  };
</script>
<style scoped>

  .send {
    margin: 0;
  }

  .choose_item {
    height: 0.6rem;
    white-space: nowrap;
    display: flex;
    align-items: center;
    border-bottom:1px solid #ECECEC;
  }

  .choose_item span {
    margin-right: 0.2rem;
  }

  .buttonBox {
    padding: 0 0.2rem 0.3rem;
  }



  .important-input-div {
    width: 100%;
    background: #ffffff;
    padding-bottom: 0.5em;
    display: flex;
    flex-wrap: wrap;
    padding: .2rem 0.3rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .important-input-div input {
    width: 1.45rem;
    font-size: 0.26rem;
    color: #999999;
    line-height: 0.38rem;
    border: none;
    border: 1px solid #ddd;
    border-radius: 0.05rem;
    text-align: center;
    margin-right: 0.2rem;
  }

  .to-select {
    width: 100%;
    background: #fff;
    margin-top: 1em;
    border-bottom: 1px solid #e6e6e6;
  }

  .to-select>div>span {
    transform: rotate(90deg);
  }

  /*transform:rotate(45deg)*/

  .important-input-div input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    font-size: 0.24rem;
    color: #999999;
    opacity: 1;
  }

  .important-input-div input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    font-size: 0.24rem;
    color: #999999;
    opacity: 1;
  }

  .important-input-div input:-ms-input-placeholder {
    font-size: 0.24rem;
    color: #999999;
    opacity: 1;
  }

  .important-input-div input::-webkit-input-placeholder {
    font-size: 0.24rem;
    color: #999999;
    opacity: 1;
  }
  .er{margin-left:.4rem;border-bottom:1px solid #ECECEC;}

  .declares {
  width: 100%;background: white;
}
.declares>ul {
  width: 100%;
  padding: 0.1rem 0.4rem;
}
.declares>ul li {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
  margin: 0.2rem 0;
}
.declares>ul li > p {
  width: 1.6rem;
  display: flex;
  justify-content: center;
  height: 0.7rem;
  align-items: center;
  font-size: 0.3rem;
  color: #777;
}
.declares>ul li > span {
  flex: 1;
  height: 0.7rem;
  border: 1px solid #d9d9d9;
  border-radius: 0.05rem;
  margin-right:.2rem;
  display: flex;align-items: center;
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
.declares>ol li>p{flex:1;}
.declares>ol li>span{width:1.5rem;}
.declares>ol li:nth-child(1){
  border-bottom:1px solid #ECECEC;
}
.textar{display: flex;padding:.1rem .3rem;}
.textar>span{width:100%;height:100%;border:1px solid #d9d9d9;}

.imgas.a > a {
  display: flex;
  height: 1rem;
  width: 1rem;
  margin-top: 0.2rem;
}
.imgas.a > a > img {
  height: 1rem;
  width: 1rem;
  border-radius: 0.1rem;
  margin-right: 0.3rem;
}
.imgas.a {
  display: flex;
  flex-flow: column;
}

.declares>ol li > a {
  width: 2rem;
  display: flex;
  flex-flow: row;
  align-items: center;
  color: #0093d2;
}
.declares>ol li > a > i {
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
  .alertText{width:100%;position:fixed;height:100vh;background: rgba(0,0,0,.2);top:0;left:0;display: flex;justify-content: center;align-items: center;}
  .alertText>ul{width:6.5rem;height:5rem;background: white;padding:.2rem .3rem;
  border-radius: .2rem;display: flex;flex-flow: column;justify-content: center;}
  .alertText ul li.a{width:100%;display:flex;flex-flow:row; align-items:center;padding:.1rem 0;}
  .alertText ul li.a>span{border-radius:.05rem;flex:1;border:1px solid #E6E7E7;height:.7rem;display: flex;align-items:center;}
  .alertText ul li.a>p{width:1.8rem;text-align: right;}
  .alertText ul li.a>span>input{border:none;margin-left:.2rem;height: 100%;width:100%;}
  .alertText ul li:nth-child(4){margin-top:.2rem;display: flex;justify-content: space-around;}
  .alertText ul li:nth-child(4)>button{font-size:.32rem;font-weight:600;color:white;
  padding:.2rem .5rem;border:none;border-radius: .1rem;}

  .details{width:100%;background: white;}
  .text{width:100%;padding:.1rem .3rem;color:#999;}
  .images{display: flex;width:100%;padding:.1rem .3rem;}
  .images>p{border:2px dashed #B6CEEC;width:1.2rem;height:1.2rem;display: flex;
  justify-content:center;align-items:center;border-radius:.1rem;position:relative;}
  .images>p>img{width:.6rem;height:.6rem;}
  .images>ul{display: flex;flex-flow:row;justify-content:center;align-items:center;}
  .images>ul>li{width:1.2rem;height:1.2rem;margin:0 .1rem;position: relative;}
  .images>ul>li>span{width: .3rem;height:.3rem;background: rgba(0,0,0,.5);border-radius: 50%;position: absolute;right: 0;top:0;
  display: flex;font-size:.3rem;justify-content: center;align-items: center;color:#fff;}
  .images>ul>li>img{width:1.2rem;height:1.2rem;border-radius:.1rem;}
  .images>p>input{width:100%;height:.9rem;opacity: 0;position: absolute;left:0;top:0;}

  .text{width:100%;background: white;display: flex;flex-flow: column;align-items: center;}
  .text>.ttt{width:100%; padding:.1rem .3rem;font-size: .28rem;}
  .text>ul{width:100%;}
  .text>ul>li{padding:.1rem .4rem;}
  .text>p{width:90%;border:1px solid #EFF1F1;text-indent:.5rem;line-height:.5rem;font-size:.3rem;
  font-weight:600;color:#5A5B5A;padding:.1rem .2rem;}
  .images1{width:90%;margin-top:.1rem;display: flex;margin-bottom:.1rem;}
  .images1>ul{width:100%;display: flex;flex-flow:row;justify-content:flex-start;align-items:center;}
  .images1>ul>li{width:1.2rem;height:1.2rem;border-radius:.1rem;margin-right: .2rem;background: RED;}
  .images1>ul>li>img{width:100%;height:100%;border-radius:.1rem;}
</style>