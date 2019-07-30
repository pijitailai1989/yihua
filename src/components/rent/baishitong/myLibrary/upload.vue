<template>
  <yd-layout>
    <yd-navbar style="height:0.88rem" slot="navbar" :bgcolor="mainColor" color="#fff" v-show="!userAgent.isWX" v-title="titleT"
      :title="titleT">
      <span class="spanLeft" @click="back" slot="left">
        <yd-icon name="error-outline" size=".45rem" color="#fff"></yd-icon>
      </span>
      <router-link to="" slot="right">
        <yd-icon name="phone1" size=".45rem" color="#fff"></yd-icon>
      </router-link>
    </yd-navbar>
    <div class="upload">
      <ul>
        <li>
          <input type="text" placeholder="标题"  maxlength="16" v-model="parameter.title">
        </li>
        <li>

          <textarea placeholder="编辑内容...." maxlength="300" id="texta" v-model="parameter.content"></textarea>

        </li>
        <li>
          <span>
            <input placeholder="输入关键字" v-model="key1" maxlength="4" type="text" @blur="keywordBlur(0)">
          </span>
          <span>
            <input placeholder="输入关键字" v-model="key2" maxlength="4" type="text" @blur="keywordBlur(1)">
          </span>
          <p>*关键字可提高搜索率</p>
        </li>
        <li style="height:.6rem;">

          <p @click="addImg" v-show="imgUrl.length!=4" style="background: #F3F5F9;">
            <!--<input class="file" name="file" type="file"-->
            <!--accept="application/msword,application/msword,application/pdf,application/vnd.ms-powerpoint,-->
            <!--application/vnd.ms-works,aplication/zip,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="update"/>-->
            <input class="file" name="file" type="file" accept="image/png,image/gif,image/jpeg" @change="update"/>
            <span>
              <span class="font22" style="color:#787879;">添加附件</span>
            </span>
          </p>
          <span class="fujian" v-show="nums>0">
            <i><img src="../../../../assets/images/rent/baishitong/fujian.png" alt=""></i>
            <span style="margin-left:.1rem;">附件({{nums}})</span>
          </span>
        </li>

      </ul>
      <ol>
        <li v-for="(item,index) in bp" :key="index" @click="toggle(index)">

          <i v-if="item.clickImg&&index==item.id">
            <img src="../../../../assets/images/rent/baishitong/select_active.png" alt="">
          </i>
          <i v-else>
            <img src="../../../../assets/images/rent/baishitong/select.png" alt="">
          </i>
          <p class="font26">{{item.name}}</p>

        </li>

        <li>
          <span @click="toggle(1)">
            <input type="text" v-model.lazy.number="input1" maxlength="3" @blur="toggle(1)">
          </span>
        </li>
      </ol>
    </div>

    <div class="type">
      <ul>
        <li>
          <span>文库类型</span>
        </li>
        <li v-for="(item,index) in kaType" :key="index" @click="toggle1(index)">
          <i v-if="index==item.pId">
            <img src="../../../../assets/images/rent/baishitong/select_active.png" alt="">
          </i>
          <i v-else>
            <img src="../../../../assets/images/rent/baishitong/select.png" alt="">
          </i>
          <p class="font26">{{item.dictDataName}}</p>
        </li>
      </ul>
    </div>

    <ul class="list">
      <li v-for="(todo,index) in districtList" :key="index" @click="toggle2(index)">
        <span>
          <i v-if="num==index">
            <img src="../../../../assets/images/rent/baishitong/select_active.png" alt="">
          </i>
          <i v-else>
            <img src="../../../../assets/images/rent/baishitong/select.png" alt="">
          </i>
          <p class="font26">{{todo.name}}</p>
        </span>
        <span class="font26">{{todo.scopeName}} </span>
      </li>


    </ul>

    <div class="btn">
      <span>
        <i v-if="clickImg">
          <img src="../../../../assets/images/rent/baishitong/select_active.png" alt="">
        </i>
        <i v-else>
          <img src="../../../../assets/images/rent/baishitong/select.png" alt="">
        </i>
        <p class="font24" :style="{color:mainColor}">同意平台百事通服务协议</p>
        <i>
          <yd-icon name="wen" slot="icon" :color="mainColor" custom size=".25rem"></yd-icon>
        </i>
      </span>
      <button class="font30" v-if="add_edit" @click="addknowAll" :style="{background:mainColor}">立即发布</button>
      <button class="font30" v-else @click="edit" :style="{background:mainColor}">立即发布</button>
    </div>
  </yd-layout>
</template>
<script>
  import Vue from 'vue';
  import fn from '@/assets/js/product'
  import qs from 'qs'
  import { Icons } from 'vue-ydui/dist/lib.rem/icons';
  Vue.component(Icons.name, Icons);
  import { Radio, RadioGroup } from 'vue-ydui/dist/lib.rem/radio';
  Vue.component(Radio.name, Radio);
  Vue.component(RadioGroup.name, RadioGroup);
  import { TextArea } from 'vue-ydui/dist/lib.rem/textarea';
  Vue.component(TextArea.name, TextArea);
  import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog';
Vue.prototype.$dialog = {
    confirm: Confirm,
    alert: Alert,
    toast: Toast,
    notify: Notify,
    loading: Loading,
};
  export default {
    data() {
      return {
        nums:0,
        add_edit:true,
        mainColor: "",
        organInfo: '',
        userInfo: '',
        titleT: '上传文库',
        show: true,
        show1: false,
        num:0,
        radio2: 1,
        clickImg: true,
        input1:null,
        typeId:'',
        parameter:{
          token:'',
          userId:null,
          title:null,
          content:'',
          typeId:this.typeId,
          keyword:'',
          bp:0,
          scope:0,
          scopeValue:0,
          accessorys:'',
          kaId:null
        },
        kaType:[],
        districtList:[],
        key1:null,
        key2:null,
        bp:[
            {name:'免费',id:0,clickImg: true,},
            {name:'商机点',id:0,clickImg: true,}
        ],
        getHearLog:{
          domain:'',
          token:'',
          name:''
        },
        images:[],
        imageName:[],
        imgUrl:'',
        reg:/^[0-9]*$/
      }

    },
    methods: {
      turnTo(url) {
        this.$router.push(url)
      },
      back() {
        this.$router.go(-1)
      },
      toggle(index) {

        this.bp[index].id=index;
        if(index!=0){


          this.bp[0].id=null;

          if(this.input1==null){
            this.input1=0
          }else{
            if(!this.reg.test(this.input1)){
            this.$dialog.toast({mes: '请输入数字!',icon: 'error'});
            this.input1=''
            return
           }
            this.parameter.bp=parseInt( this.input1 );

          }

        }
        if(index!=1){
          this.bp[1].id=null;
          this.parameter.bp=0;
        }
      },
      toggle1(index){
        this.kaType[index].pId=index;
        this.parameter.typeId=this.kaType[index].guid;
        if(index!=0){
          this.kaType[0].pId=null;
        }
        if(index!=1){
          this.kaType[1].pId=null;
        }
        if(index!=2){
          this.kaType[2].pId=null;
        }
        console.log(this.kaType[index].guid)
      },
      toggle2(index){
        this.num=index;
        this.parameter.scope=parseInt( this.districtList[index].scope );
        this.parameter.scopeValue=parseInt( this.districtList[index].scopeValue );
        // console.log(this.parameter.scope)
      },
      addknowAll(){
        if(this.parameter.title!=''&&this.parameter.content!=''){
           var data = {
          token:this.parameter.token,
          userId:this.parameter.userId,
          title:this.parameter.title,
          content:this.parameter.content,
          typeId:this.parameter.typeId,
          keyword:this.parameter.keyword,
          bp:this.parameter.bp,
          scope:this.parameter.scope,
          scopeValue:this.parameter.scopeValue,
          accessorys:this.parameter.accessorys
         };

         this.xhr.post(`${this.subUrl.bd}/knowAll/addknowAll`, qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
            this.$dialog.toast({
                    mes: '上传成功！',
                    timeout: 1500,
                    icon: 'success'
                });
                this.$router.go(-1);
          }else if (res.data.code == '-902'){
            fn.re_login(this);
          }else {
            this.$dialog.toast({
                    mes: '上传失败！',
                    timeout: 1500,
                    icon: 'error'
                });
          }
        })
        }else{
          this.$dialog.toast({
                    mes: '内容不能为空！',
                    timeout: 1500,
                    icon: 'error'
                });
        }



      },
      edit(){
        if(this.parameter.title!=''&&this.parameter.content!=''){
           var data = {
          token:this.parameter.token,
          userId:this.parameter.userId,
          title:this.parameter.title,
          content:this.parameter.content,
          typeId:this.parameter.typeId,
          keyword:this.parameter.keyword,
          bp:this.parameter.bp,
          scope:this.parameter.scope,
          scopeValue:this.parameter.scopeValue,
          accessorys:this.parameter.accessorys,
          kaId:this.parameter.kaId,
         };

         this.xhr.post(`${this.subUrl.bd}/knowAll/edit`, qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
            this.$dialog.toast({
                    mes: '编辑成功！',
                    timeout: 1500,
                    icon: 'success'
                });
                this.$router.go(-1);
          }else if (res.data.code == '-902'){
            fn.re_login(this);
          }else {
            this.$dialog.toast({
                    mes: '编辑失败！',
                    timeout: 1500,
                    icon: 'error'
                });
          }
        })

        }else{
          this.$dialog.toast({
                    mes: '内容不能为空！',
                    timeout: 1500,
                    icon: 'error'
                });
        }



      },
      keywordBlur(num){
        let arr=[]
        if(num==0){
           arr[0]=this.key1;
        }else if(num==1){
           arr[0]=this.key1;
           arr[1]=this.key2;
        }

        this.parameter.keyword=arr.join(',')
      },
      getKaType(){
        this.xhr.post(`${this.subUrl.user}/comm/getKaType`).then((res) => {
          if (res.data.code == 1) {
            this.kaType=res.data.data;
            this.parameter.typeId=this.kaType[0].guid;;
            console.log(this.parameter.typeId)
          } else if (res.data.code == '-902'){
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      },
      userDistrict(){
        var data = {
          token:this.parameter.token,
          userId:this.parameter.userId,
        }
        this.xhr.post(`${this.subUrl.bd}/knowAll/userDistrict`, qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
            // console.log(res.data.data)
            this.districtList=res.data.data;
            this.districtList.reverse();
          } else if (res.data.code == '-902'){
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      },
      detail(){
        var data = {
          token:this.parameter.token,
          userId:this.parameter.userId,
          kaId:this.parameter.kaId,
        }
        this.xhr.post(`${this.subUrl.bd}/knowAll/detail`, qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
            console.log(res.data.data)
            this.input1=res.data.data.knowAll.bp
            if(res.data.data.knowAll.bp==0){
              let index=0;
              this.bp[index].id=index;
              this.bp[1].id=null;
            }else{
              let index=1;
              this.bp[index].id=index;
              this.bp[0].id=null;
            }

            this.parameter.content=res.data.data.knowAll.content
            this.parameter.title=res.data.data.knowAll.title
            this.parameter.scope=res.data.data.knowAll.scope
            this.parameter.scopeValue=res.data.data.knowAll.scopeValue
             if(this.parameter.scope==0){
               this.num=0;
             }else if(this.parameter.scope==1){
               this.num=1;
             }else if(this.parameter.scope==2){
               this.num=2;
             }else if(this.parameter.scope==3){
               this.num=3;
             }else if(this.parameter.scope==4){
               this.num=4;
             }

            let keyword=res.data.data.knowAll.keyword
            this.parameter.keyword=res.data.data.knowAll.keyword;
            this.key1=keyword.split(',')[0]
            this.key2=keyword.split(',')[1]
            this.parameter.typeId=res.data.data.knowAll.typeId
            this.kaType[0].pId=null;
            this.kaType.forEach( (el,index)=>{
                if(el.guid==this.parameter.typeId){
                  el.pId=index;
                }
            })
                  
                  let arr=[]
                  res.data.data.commAccessoryList.forEach(el=>{
                     arr.push(el.fileName)
                  })
                  
            this.imageName=arr;
            this.nums=this.imageName.length
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
    console.log(file.name)
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
    this.$dialog.loading.open('很快上传好！');
   this.xhr.post('http://up-z2.qiniu.com',param,config)
    .then(response=>{
      if(response.status==200){
         console.log(response,1111111111111111)
        this.imageName.push(response.data.key)
        this.nums=this.imageName.length
        this.parameter.accessorys=this.imageName.join(',');
        this.$dialog.loading.close();
      }else{
        this.$dialog.toast({mes: '添加附件失败！'});
        this.$dialog.loading.close();
      }
      
     
     let localArr = this.images.map((val,index,arr)=>{
      return arr[index].localSrc;
     })

     if(!~localArr.indexOf(pathName)){
      this.images.push({'src':this.showUrl+response.data.key,'localSrc':pathName});
     }else{
       this.$dialog.toast({mes: '该文件已上传！'});
     }
    })
    },
   getQiniuInfo(){
      this.xhr.post(`${this.subUrl.user}/qiniu/getInfo?token=`+this.parameter.token).then(res=>{
         if (res.data.code == 1) {

              this.getHearLog=res.data.data;
              // console.log(this.getHearLog)
          } else{
            this.$dialog.toast({mes: res.data.msg});
          }
      })
   },
   addImg(){
     this.getQiniuInfo();
   },

    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = localStorage.getItem('mainColor');
      this.parameter.userId = this.userInfo.guid;
      this.parameter.token = fn.getIng();
      this.getKaType();
      this.userDistrict();
      if(this.$route.hash!=""){
          let puid=this.$route.hash;
          this.parameter.kaId=puid.split('#')[1]
          this.detail();
          this.add_edit=false;
      }else{
          this.add_edit=true;
      }
    },
    beforeUpdate() {
          //  console.log(this.parameter)
    }
  }
</script>
<style scoped>
  .upload {
    width: 100%
  }

  .upload ul {
    width: 100%;
    background: white;
    padding: .3rem .3rem;
  }

  .upload ul li {
    display: flex;
    width: 100%;
  }

  .upload ul li:nth-child(1) {
    height: .6rem;
    border-bottom: 1px solid #ECECEC;
  }

  .upload ul li:nth-child(1)>input {
    width: 100%;
    height: 100%;
    border: none;
    font-size: .3rem;
  }

  .upload ul li:nth-child(2) {
    width: 100%;
    border-bottom: 1px dashed #ECECEC;
  }
  .upload ul li:nth-child(2)>textarea{
    width:100%;height:2rem;border:none;padding:.2rem .1rem;color:#999;
  }

  .upload ul li:nth-child(3) {
    width: 100%;
    height: 1rem;
    align-items: center;
  }

  .upload ul li:nth-child(3)>span {
    height: .45rem;
    width: 1.4rem;
    border-radius: .05rem;
    margin-right: .2rem;
    border: 1px solid #ECECEC;
  }

  .upload ul li:nth-child(3)>span>input {
    width: 100%;
    height: 100%;
    border: none;
    font-size: .22rem;
    text-align: center;
  }

  .upload ul li:nth-child(3)>p {
    font-size: .22rem;
    color: red;
    margin-left: 1.4rem;
  }

  .upload ul>li:nth-child(4) {
    display: flex;
  }
  .fujian{width:3rem;height:.8rem;display:flex;
  justify-content:center;align-items:center;}
  .fujian>i{}
  .fujian>i>img{width:100%;height:100%;}
  .fujian>span{width:5rem;font-size:.24rem;color:#999;}

  .upload ul>li:nth-child(4)>p {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    width: 2rem;
    height: .6rem;
    position: relative;
    margin-right: .2rem;
  }
  .upload ul>li:nth-child(4)>p>i{width:100%;height:100%;}
  .upload ul>li:nth-child(4)>p>i>img{width:100%;height:100%;}

  .upload ul>li:nth-child(4)>p>span {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
  }

  .upload ul>li:nth-child(4)>p>span>i {
    width: .5rem;
    height: .5rem
  }

  .upload ul>li:nth-child(4)>p>input {
    width: 100%;
    height: 100%;
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
  }

  .upload ul>li:nth-child(4)>p>span>i>img {
    width: 100%;
    height: 100%;
  }


  .upload ol {
    display: flex;
    width: 100%;
    background: white;
    height: .8rem;
    padding: 0 .3rem;
    align-items: center;
    border-top: 1px solid #EEEEEE;
  }

  .upload ol>li {
    display: flex;
    margin-right: .1rem;
    color: #9A9A9A;
    align-items: center;
  }

  .upload ol>li>i {
    width: .25rem;
    height: .25rem;
    margin-right: .1rem;
  }
  .upload ol>li:nth-child(1){margin-right:.4rem;}
  .upload ol>li>i>img {
    width: 100%;
    height: 100%;
  }

  .upload ol>li>span {
    width: 1.2rem;
    height: .4rem;
    margin-left: .1rem;
    border: 1px solid #F1F1F1;
    border-radius: .05rem;
  }

  .upload ol>li>span>input {
    width: 100%;
    height: 100%;
    border: none;
  }

  .type {
    width: 100%;
    margin-top: .2rem;
    background: white;
  }

  .type>ul {
    width: 100%
  }

  .type>ul>li {
    display: flex;
    align-items: center;
    height: .8rem;
    border-bottom: 1px solid #F3F3F3;
  }

  .type>ul>li>i {
    color: #9A9A9A;
    width: .25rem;
    height: .25rem;
    margin-left: .3rem;
    margin-right:.1rem;
  }

  .type>ul>li>i>img {
    width: 100%;
    height: 100%;
  }

  .type>ul>li>p {
    color: #9A9A9A;
  }

  .type>ul>li>span {
    font-size: .3rem;
    margin-left: .2rem;
  }

  .list {
    width: 100%;
    background: white;
    margin-top: .2rem;
  }

  .list li {
    height: .7rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #F3F3F3;
    color: #9A9A9A;
  }

  .list li>span {
    display: flex;
    align-items: center;
  }

  .list li>span:nth-child(1)>i {
    width: .25rem;
    height: .25rem;
    margin-left: .3rem;
    margin-right:.1rem;
  }

  .list li>span:nth-child(1)>i>img {
    width: 100%;
    height: 100%;
  }

  .list li>span:nth-child(2) {
    margin-right: .3rem;
  }

  .btn {
    width: 100%;
    padding: .4rem .1rem;
    background: white;
    margin-top: .2rem;
    display: flex;
    flex-flow: column;
  }

  .btn>span {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: .1rem 0;
  }

  .btn>span>i {
    width: .25rem;
    height: .25rem;
    margin-left: .3rem;
    margin-right:.1rem;
  }

  .btn>span>i>img {
    width: 100%;
    height: 100%;
  }

  .btn>button {
    height: .8rem;
    border: none;
    color: white;
    border-radius: .1rem;
  }
</style>
