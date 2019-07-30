<template>
  <div>
    <yd-layout class="layout_my">
      <yd-navbar class="header" slot="navbar" v-show="!userAgent.isWX" v-title="'账户管理'" title="账户管理" color="#fff" :bgcolor="mainColor" height=".88rem">
        <router-link :to="'/my/manager/account'" slot="left"><!--url[url.length-1]-->
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </router-link>
        <div slot="right" class="edit" style="color: #fff;">
          <a @click="editCompany">
            确定
          </a>
        </div>
      </yd-navbar>
      <div class="top-password mechanism-msg" style="width: 100%;background: #ffffff;line-height: 3em">
        <div>管理处信息</div>
        <router-link :to="'/my/manager/edit'">
          <img src="../../../../assets/images/rent/my/add_job.png" alt="">
        </router-link>
      </div>
      <div class="top-password">
        <div class="item-left">管理处名称：</div>
        <input v-model="mechanismMsg.organName" placeholder="请输入" type="text">
      </div>
      <div class="top-password">
        <div class="item-left">楼宇名称：</div>
        <input v-model="mechanismMsg.buildingName" placeholder="请输入" type="text">
      </div>
      <div class="top-password">
        <div class="item-left">所在地址：</div>
        <input v-model="mechanismMsg.buildingAddress" placeholder="请输入" type="text">
      </div>
      <div class="top-password">
        <div class="item-left" style="float: left">企业logo：</div>
        <div class="logo-img-div">
          <img v-if="showLogo" :src="imageUrl" alt="" class="fileImg">
          <img v-if="!showLogo&&mechanismMsg.organLogo" :src="mechanismMsg.organLogo" alt="" class="fileImg">
          <img v-if="!showLogo&&!mechanismMsg.organLogo" src="../../../../assets/images/rent/my/admin/add-logo.png" alt="" class="fileImg add-logo-img">
          <input class="file hid-input"  name="file" type="file" accept="image/png,image/gif,image/jpeg" @change="update"/>
        </div>
      </div>
    </yd-layout>
  </div>
</template>
<script>
  import {sendImgServer} from '../../../../lib/utils'
  import fn from '@/assets/js/product'
  import qs from 'qs'
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
        mechanismMsg:{},
        qiniutoke:[],
        imageUrl:'',
        images:[],
        showLogo:false,
        organLogo:'',
        getLogoMsg:{},
        getData:''
      }
    },
    methods: {
      editCompany(){
        if(!this.organLogo||this.organLogo==''){
          this.organLogo=this.mechanismMsg.organLogo
        }
        var data = {organId:this.organInfo.guid, token: this.getkey,pageNo:1,pageSeze:15};
        this.xhr.post(`${this.subUrl.user}/admin/accountManage/editOrganInfo?token=`+data.token+'&organId='+data.organId
        +'&organName='+this.mechanismMsg.organName+'&buildingName='+this.mechanismMsg.buildingName+'&address='+this.mechanismMsg.buildingAddress
        +'&organLogo='+this.organLogo).then((res) => {
          if (res.data.code == 1) {
            this.$router.push('/my/manager/account')
//            cb&&cb();
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            // fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
      },
      update(e){
//        var data = {organId:this.organInfo.guid, token: this.getkey,pageNo:1,pageSeze:15};
//        this.getData=sendImgServer(this.getData,this.xhr,this.subUrl,data,e);
//        console.log(this.getData)
//        console.log(json.imageUrl)
        this.imageUrl=this.getData.imageUrl
        let file = e.target.files[0];
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
            this.imageUrl=this.imageUrl+'/'+response.data.key
            let localArr = this.images.map((val,index,arr)=>{
              return arr[index].localSrc;
            })
            if(!~localArr.indexOf(pathName)){
              this.images.push({'src':this.showUrl+response.data.key,'localSrc':pathName});
              this.showLogo=true;
            }else{
              alert('已上传该图片');
            }
          })
      },
      itemClickHandler() {
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
        this.xhr.post(`${this.subUrl.user}/admin/accountManage/organInfo?token=`+data.token+'&organId='+data.organId).then((res) => {
          if (res.data.code == 1) {
            this.mechanismMsg=res.data.data;
            this.organLogo=this.mechanismMsg.organLogo.split('/')[this.mechanismMsg.organLogo.split('/').length-1]
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
      }
    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = localStorage.getItem('mainColor');
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      this.getQiniuMsg();
      this.userId = this.userInfo.guid;
      var that = this;
      this.getUserInfo(function () {
        that.getJobInfo();
      });
    }
  }
</script>
<style scoped>
  .top-password{
    width: 100%;
    background: #ffffff;
    line-height: 3em;
    padding-left: 1.3em;
  }
  .mechanism-msg{
    line-height: 2em;
    font-size: 12px;
    color: #999999;
    border: 1px solid #e6e6e6;
  }
  .top-password img{
    float: right;
    width: 1.3em;
    height: 1.3em;
    margin-top: 0.8em;
    margin-right: 1.3em
  }
  .top-password div{
    display: inline-block;
  }
  .layout_my{
    background: #f7f7f9;
  }
  .layout_my .header:after {
    display: none;
  }
  .top-password .item-left{
    width: 25%;
    text-align: right;
    font-size: 12px;
    color: #999999;
  }
  .logo-img-div{
    width: 6em;
    height: 6em;
    border: 1px solid #e6e6e6;
    padding: 0.5em;
    margin-top: 0.5em;
    border-radius: 6px;
    position: relative;
    background: #fafefd;
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
  .top-password input{
    width: 70%;
    line-height: 1.6em;
    border: 1px solid #e6e6e6;
    border-radius: 2px;
    font-size: 14px;
    padding: 2px 8px;
  }
</style>
