<template>
  <div>
    <yd-layout class="layout_my">
      <yd-navbar class="header" slot="navbar" v-show="!userAgent.isWX" v-title="'报修单'" title="报修单" color="#fff" :bgcolor="mainColor" height=".88rem">
        <router-link :to="'/estate/repair'" slot="left"><!--url[url.length-1]-->
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </router-link>
        <div slot="right" class="edit" style="color: #fff;">
          <a @click="sureToRepair">
            提交
          </a>
        </div>
      </yd-navbar>
      <div class="top-select-type">
        报修类型<router-link :to="'/estate/select_type'" slot="left">
        <div>{{typeName}}<img src="../../../../../assets/images/rent/my/add_new_job.png"
                     alt=""></div>
      </router-link>
      </div>
      <div class="text-more">
        <textarea v-model="whyToRepair" placeholder="报修内容">
      </textarea>
        <div class="show-send-pic">
          <div class="logo-img-div">
            <!--<img v-if="showLogo"  :src="imageUrl" alt="" class="fileImg">-->
            <!--<img v-if="" :src="mechanismMsg.organLogo" alt="" class="fileImg">-->
            <img src="../../../../../assets/images/rent/my/admin/add-logo.png" alt="" class="fileImg add-logo-img">
            <input class="file hid-input" name="file[]" type="file" accept="image/*" @change="update"multiple/>
             </div>
          <div v-if="imageUrlList&&imageUrlList.length==0" style="border: none" class="logo-img-div"></div>
          <div v-if="imageUrlList&&imageUrlList.length==0" style="border: none" class="logo-img-div"></div>
          <div class="logo-img-div" v-for="item,index in imageUrlList">
            <img v-if="showLogo"  :src="item" alt="" class="fileImg">
            <a @click="delThisPic(index)"><yd-icon name="error" class="del-this-pic"></yd-icon></a>
            <!--<img v-if="" :src="mechanismMsg.organLogo" alt="" class="fileImg">-->
            <!--<img v-if="!showLogo" src="../../../../../assets/images/rent/my/admin/add-logo.png" alt="" class="fileImg add-logo-img">-->
            <!--<input class="file hid-input"  name="file[]" type="file" accept="image/png,image/gif,image/jpeg" @change="update"multiple/>-->
          </div>
          <div v-if="imageUrlList&&imageUrlList.length>0&&((imageUrlList.length+1)%3!=0)" style="border: none" class="logo-img-div"></div>
          <div v-if="imageUrlList&&imageUrlList.length>0&&(imageUrlList.length+1)%3==1" style="border: none" class="logo-img-div"></div>
        </div>
      </div>
    </yd-layout>
  </div>
</template>
<script>
  import fn from '@/assets/js/product'
  import qs from 'qs'
  import {Icons} from 'vue-ydui/dist/lib.rem/icons';
  export default {
    data() {
      return {
        organInfo: "",
        hasMessage: {
          count: 99,
          new: true,
        },
        value2: "",
        result: [],
        url: this.fromRoute ? this.fromRoute : '',
        userInfo: "",
        mainColor: "",
        getLogoMsg:{},
        getData:'',
        imageUrl:'',
        imageUrlList:[],
        imageKeyList:[],
        showLogo:false,
        whyToRepair:'',
        typeName:'请选择',
        typeGuid:'',
      }
    },
    methods: {
      delThisPic(index){
        this.imageKeyList.splice(index,1);
        this.imageUrlList.splice(index,1);
      },
      update(e){
//        var data = {organId:this.organInfo.guid, token: this.getkey,pageNo:1,pageSeze:15};
//        this.getData=sendImgServer(this.getData,this.xhr,this.subUrl,data,e);
//        console.log(this.getData)
//        console.log(json.imageUrl)
//        this.imageUrlList=[];
        this.imageUrl=this.getData.imageUrl
        for(var i=0 ;i<e.target.files.length;i++){
          let file = e.target.files[i];
          let d = new Date();
          let type = file.name.split('.');
          let tokenParem = {
            'putPolicy':'{\"name\":\"$(fname)\",\"size\":\"$(fsize)\",\"w\":\"$(imageInfo.width)\",\"h\":\"$(imageInfo.height)\",\"hash\":\"$(etag)\"}',
            'key':'orderReview/'+d.getFullYear()+'/'+(d.getMonth()+1)+'/'+d.getDate()+'/'+d.valueOf()+'.'+type[type.length-1],
            'bucket':'http://oysfye6yt.bkt.clouddn.com',//七牛的地址，这个是你自己配置的（变量）
          };
          let param = new FormData(); //创建form对象
          param.append('chunk','0');//断点传输
          param.append('chunks','1');
          param.append('file',file,file.name)
          let config = {
            headers:{'Content-Type':'multipart/form-data'}
          };
          this.token=this.getLogoMsg.token;
          this.imageUrl=this.getLogoMsg.domain;
          param.append('token',this.token);
//            if(this.images.length>8){
//              alert('不能超过9张');
//              return;
//            }
          this.uploading(param,config,file.name);//然后将参数上传七牛
        }
        return;

        //先从自己的服务端拿到token
      },
      getQiniuMsg(){
        var data = {organId:this.organInfo.guid, token: this.getkey,pageNo:1,pageSeze:15};
        this.xhr.post(`${this.subUrl.user}/qiniu/getInfo?token=`+data.token).then((res) => {
          if (res.data.code == 1) {
//            console.log(res.data.data.token)
            this.getLogoMsg=res.data.data
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            // fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
      },
      uploading(param,config,pathName){
        this.xhr.post('http://up-z2.qiniu.com',param,config)
          .then(response=>{
            this.organLogo=response.data.key;
            this.imageKeyList.push(this.organLogo);
            this.imageUrlList.push(this.imageUrl+'/'+response.data.key);
            this.showLogo=true;
//            let localArr = this.images.map((val,index,arr)=>{
//              return arr[index].localSrc;
//            })
//            if(!~localArr.indexOf(pathName)){
//              this.images.push({'src':this.showUrl+response.data.key,'localSrc':pathName});
//              this.showLogo=true;
//            }else{
//              alert('已上传该图片');
//            }
          })
      },
      itemClickHandler() {
      },
      itemClickHandler() {
      },
      sureToRepair(){
        var accessorys=this.imageKeyList[0];
        for(var i=1;i<this.imageKeyList.length;i++){
          accessorys=accessorys+','+this.imageKeyList[i]
        }
        var data = {token: this.getkey, userId: this.userId,typeId:this.typeGuid,location:this.typeName,remark:this.whyToRepair,accessorys:accessorys};
        // {params: {type: 'pulldown', page: this.page}
        this.xhr.post(`${this.subUrl.activity}/repairs/subRepairsBill?` +qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
            this.$router.push('/estate/order_submit')
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
      },
      submitHandler(value) {
        this.arr = [];
        this.selectTab = 4;
        this.page = 1;
        this.$dialog.toast({mes: `搜索：${value}`});
        var data = {token: this.getkey, organId: this.organInfo.guid};
        // {params: {type: 'pulldown', page: this.page}
        this.xhr.post(`${this.subUrl.admin}/latestNews/organNews?token=` + this.getkey + '&keyword=' + `${value}` + '&organId=' + this.organInfo.guid + '&pageNo=' + this.page + '&pageSize=10').then((res) => {
          if (res.data.code == 1) {
            this.arr = [...res.data.data.list, ...this.arr];
            if (res.data.data.list.length == 0) {
              this.showErr = true;
            } else {
              this.showErr = false;
            }
            this.page++;
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
      },
      getJobInfo(cb) {
        var data = {organId:this.organInfo.guid, token: this.getkey,pageNo:1,pageSeze:15};
        this.xhr.post(`${this.subUrl.user}/admin/postManage/postList?token=`+data.token+'&organId='+data.organId).then((res) => {
          if (res.data.code == 1) {
            cb&&cb();
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            // fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
      },
      clearLoacl(){
        this.alertS=true;
      },
      quit(){
        this.alertS=false;
      },
      getUserInfo(cb) {
        var data = {userId: this.userId, token: this.getkey};
        this.xhr.post(`${this.subUrl.user}/user/getUserInfo`, qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
            this.userInfo = res.data.data.userInfo;
            this.organInfo = res.data.data.organInfo;
            cb&&cb();
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
      if(this.$route.query.type){
        this.typeGuid=this.$route.query.type
      }
      if(this.$route.query.typeName){
        this.typeName=this.$route.query.typeName
      }
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = localStorage.getItem('mainColor');
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      this.userId = this.userInfo.guid;
      this.getQiniuMsg();
      var that = this;
      this.getUserInfo(function () {
        that.getJobInfo();
      });
    }
  }
</script>
<style scoped>
  .top-select-type{
    width: 100%;
    padding-left: 1.5em;
    padding-right: 1.5em;
    background: #ffffff;
    line-height: 3em;
  }
  .top-select-type :after{

  }
  .top-select-type div{
    display: inline-block;
    width: 75%;
    margin: 0.5em;
    padding: 0 1em;
    border-radius: 0.4em;
    background: #f5f5f5;
    color: #999999;
    position: relative;
  }

  .top-select-type img{
    position: absolute;
    right: 0.6em;
    top: 0.7em;
    width: 1.5em;
    height: auto;
  }

  .layout_my{
    /*background: #f7f7f9;*/
  }
  .layout_my .header:after {
    display: none;

  }
  .text-more{
    width: 90%;
    margin-left: 5%;
    padding: 0.6em;
    background: #ffffff;
    border-radius: 5px;
    margin-top: 6%;
  }
  .text-more textarea{
    width: 100%;
    background: #ebf3f3;
    border-radius: 5px;
    height:10em;
    padding: 0.5em;
    border: none;
  }
  .logo-img-div{
    flex: 30%;
    margin: 1%;
    border: 1px solid #e6e6e6;
    min-height: 7em;
    padding: 0.5em;
    margin-top: 0.5em;
    border-radius: 6px;
    position: relative;
    background: #fafefd;
    display: inline-block;
  }
  .logo-img-div img{
    width: 100%;
    height: 100%;
    margin: 0;
  }
  .hid-input{
    opacity: 0;
    position: absolute;
    width: 5em;
    height: 5em;
  }
  .add-logo-img{
    width: 2em!important;
    height: 2em!important;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -1em!important;
    margin-top: -1em!important;
  }
  .show-send-pic{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
  }
  .del-this-pic{
    position: absolute;
    color: #22ac38;
    top: -8px!important;
    right: -6px!important;
    font-size: 18px!important;
  }
</style>
