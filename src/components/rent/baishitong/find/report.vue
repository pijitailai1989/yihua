<template>
   <yd-layout>
        <yd-navbar style="height:0.88rem" slot="navbar" :bgcolor="mainColor" color="#fff" :title="titleT"  v-title="titleT"  v-show="!userAgent.isWX">
            <span class="spanLeft" @click="back" slot="left">
                <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
            </span>
        </yd-navbar>
        <div class="reportContent">
            <ul>
                <li><span class="font30">举报内容:</span></li>
                <li>
                    <p>{{text}}</p>
                    <!-- <i><img :src="urlImg" alt=""></i> -->
                </li>
                <li>
                    <p>
                       <yd-radio-group size='15' v-model="parameter.content" :color="mainColor">
                        <yd-radio class="ab" val="盗版或侵权"></yd-radio>
                        <yd-radio class="ab" val="广告或垃圾信息"></yd-radio>
                       </yd-radio-group>
                    </p>
                    <p>
                       <yd-radio-group size='15' v-model="parameter.content" :color="mainColor">
                        <yd-radio class="ab" val="黄,赌,毒,诽谤,暴力等信息"></yd-radio>
                        <yd-radio class="ab" val="反政府,反人类等反动信息"></yd-radio>
                       </yd-radio-group>
                    </p>
                </li>
            </ul>
        </div>

        <div class="upload">
            <ul v-show="parameter.type==1">
                <li><span>上传身份证或营业执照 <a style="color:#999">(加盖单位公章)</a></span></li>
                <li>
                    <p @click="addImg(1)">
                        <i><img src="../../../../assets/images/rent/baishitong/add-item.png" alt=""></i>
                        <span class="font22" style="color:#787879;">选择图片</span>
                        <input class="file" name="file" type="file" accept="image/*" @change="update"/>
                    </p>
                    <i v-show="show"><img :src="imgUrl" alt=""></i>
                </li>
            </ul>

            <ul v-show="parameter.type==1">
                <li><span>上传书面函 <a style="color:#999">(加盖单位公章)</a></span></li>
                <li>
                    <p @click="addImg(2)">
                        <i><img src="../../../../assets/images/rent/baishitong/add-item.png" alt=""></i>
                        <span class="font22" style="color:#787879;">选择图片</span>
                        <input class="file" name="file" type="file" accept="image/*" @change="update"/>
                    </p>
                    <i v-show="show1"><img :src="imgUrl1" alt=""></i>
                    <a @click="toggle" class="font24" style="color:#729AC7">书面函格式</a>
                </li>
            </ul>

            <p><button @click="report" :style="{background:mainColor}">举报</button></p>
        </div>

        <div class="written" v-show="show2">
             <ul>
                 <li><i @click="toggle"><yd-icon name="delete1" color="#8B8B8B" slot="icon" custom size=".4rem"></yd-icon></i>
                     <p style="color:black;" class="font30 font600">书面函格式</p></li>
                 <li><p>本人/本单位承诺，对所举报本平台的信息内容中侵犯本人/本单位合法权利的指控真实、正确、完整，并愿意对
                     要求所删除相关涉嫌侵权内容的行为承担一切法律责任和后果。</p></li>
                 <li class="aa"><p>签字(单位加盖公章):XX</p></li>
                 <li class="aa"><p>X年X月X日</p></li>
                 <li class="aa"><p>联系人：</p></li>
                 <li class="aa"><p>电子邮箱：</p></li>
                 <li class="aa"><p>地址：</p></li>
             </ul>
        </div>
    </yd-layout>
</template>
<script>
  import Vue from 'vue';
  import fn from '@/assets/js/product'
  import qs from 'qs'
  import {Radio, RadioGroup} from 'vue-ydui/dist/lib.rem/radio';
  Vue.component(Radio.name, Radio);
  Vue.component(RadioGroup.name, RadioGroup);

  export default {
    data() {
      return {
        mainColor: "",
        organInfo:'',
        userInfo:'',
        titleT:'举报',
        text:'',
        radio1:null,
        imgName:'',
        images:[],
        token:'',
        getHearLog:{
          domain:'',
          token:'',
          name:'',
          pid:null,
        },
        imgUrl:'',
        imgUrl1:'',
        show:false,
        show1:false,
        show2:false,
        parameter:{
          token:'',
          userId:null,
          kaId:null,
          type:0,
          content:'广告或垃圾信息',
          license:null,
          written:null
        },
        urlImg:''
      }

    },
    methods: {
      turnTo(url) {
        this.$router.push(url)
      },
      back(){
        this.$router.go(-1)
      },
      toggle(){
          this.show2=!this.show2;
      },
      report(){
          
         if(this.parameter.type==0){
             var data={
             userId:this.parameter.userId,
             token:this.parameter.getkey,
             kaId:this.parameter.kaId,
             content:this.parameter.content,
             type:this.parameter.type
             }
         }else if(this.parameter.type==1){

             if(this.parameter.license!=null&&this.parameter.written!=null){
                  var data={
               userId:this.parameter.userId,
               token:this.parameter.getkey,
               kaId:this.parameter.kaId,
               content:this.parameter.content,
               type:this.parameter.type,
               license:this.parameter.license,
               written:this.parameter.written,
               }
             }else{
                 
                 this.$dialog.toast({mes: '需上传身份和书面函！'});
                 return
             }

             

         }

          
          this.xhr.post(`${this.subUrl.bd}/knowAll/report`, qs.stringify(data)).then((res) => {
          
          if (res.data.code == 1) {
              this.$dialog.toast({mes: "举报成功!",icon: 'success'});
              this.$router.go(-1)
          } else if (res.data.code == '-902'){
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
       

      },
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
     console.log(response.data);
     this.getHearLog.name=response.data.key;
       if(this.getHearLog.name!=''){
           if(this.getHearLog.pid==1){
             this.imgUrl=this.getHearLog.domain+'/'+this.getHearLog.name;
             this.parameter.license=this.getHearLog.name;
             this.show=true;
           }else if(this.getHearLog.pid==2){
             this.imgUrl1=this.getHearLog.domain+'/'+this.getHearLog.name;
             this.parameter.written=this.getHearLog.name;
             this.show1=true;
           }

       }

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
   getQiniuInfo(pid){
      this.xhr.post(`${this.subUrl.user}/qiniu/getInfo?token=`+this.parameter.getkey).then(res=>{
         if (res.data.code == 1) {
              
              this.getHearLog=res.data.data;
              this.getHearLog.pid=pid;
              console.log(this.getHearLog)
          } else{
            this.$dialog.toast({mes: res.data.msg});
          }
      })
   },
   addImg(pid){
     this.getQiniuInfo(pid);
   },


    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = localStorage.getItem('mainColor');
      this.parameter.userId = this.userInfo.guid;
      this.parameter.getkey = fn.getIng();
      this.parameter.kaId = this.$route.query.kaId;
      this.text = this.$route.query.text;
      console.log(this.$route)

    },
    beforeUpdate(){
         if(this.parameter.content=='盗版或侵权'){
             this.parameter.type=1;
         }else{
             this.parameter.type=0;
         }
    }
  }
</script>
<style scoped>
   .reportContent{width:100%;padding:.2rem .2rem;background: white;}
   .reportContent ul{width:100%;}
   .reportContent ul li{display: flex;}
   .reportContent ul li:nth-child(2){width:100%;height:1rem;background: #F7F7F7;padding:.1rem .2rem;
   justify-content: space-between;align-items: center;margin-top:.1rem;}
   .reportContent ul li:nth-child(2)>i{width: 1rem;height:.8rem;}
   .reportContent ul li:nth-child(2)>i>img{height:100%;width:100%;}
   .reportContent ul li:nth-child(3)>p{margin-top:.2rem;}
   .reportContent ul li:nth-child(3)>p .ab{margin:.1rem .1rem;display: flex;align-items:center;}

   .upload{width:100%;}
   .upload ul{width:100%;background: white;padding:.3rem .3rem;margin-top:.2rem;}
   .upload ul>li:nth-child(1){width:100%;height:.6rem;display: flex;}
   .upload ul>li:nth-child(2){display: flex;}
   .upload ul>li:nth-child(2)>p{display:flex;flex-flow:column;justify-content:center;align-items:center;
   width:1.6rem;height:1.6rem;background: #F3F5F9;margin-right:.6rem;position: relative;}
   .upload ul>li:nth-child(2)>p>i{width: .5rem;height: .5rem}

   .upload ul>li:nth-child(2)>p>input{width:100%;height:.9rem;opacity: 0;position: absolute;left:0;top:0;}
   .upload ul>li:nth-child(2)>p>i>img{width:100%;height:100%;}
   .upload ul>li:nth-child(2)>i{width:1.6rem;height:1.6rem;background: red;}
   .upload ul>li:nth-child(2)>i>img{width:100%;height:100%;}
   .upload ul>li:nth-child(2)>a{margin-left:.2rem;height: 1.6rem;display: flex;align-items:flex-end;}

   .upload>p{margin-top:.3rem;display: flex;width:100%;justify-content: center;align-items:center;}
   .upload>p>button{width:90%;height:.8rem;color:white;font-size:.3rem;border:none;}

   .written{width:100%;height:100vh;position:fixed;left:0;top:0;background: rgba(0,0,0,.2);
   display: flex;justify-content: center;align-items:center;z-index: 999;}
   .written ul{background: white;width:80%;height:6rem;border-radius: .2rem;padding:.1rem .4rem;color:#696969;}
   .written ul li:nth-child(1){padding:.2rem 0;display: flex;position: relative;
   justify-content: center;border-bottom:1px solid #FAFAFA;}
   .written ul li:nth-child(2){line-height: .45rem;text-indent:.6rem;padding:.1rem 0;}
   .written ul li:nth-child(3){display: flex;justify-content: flex-end;}
   .written ul li:nth-child(4){display: flex;justify-content: flex-end;}
   .aa{height:.5rem}

   .written i{display:flex;position: absolute;width: .4rem;height:.4rem;top:0;right:-.1rem;}
   .written i>img{width: 100%;height:100%;}</style>
