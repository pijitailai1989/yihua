<template>
  <yd-layout class="layout_my">
    <yd-navbar class="header" slot="navbar" v-show="!userAgent.isWX" v-title="'采购申请'" title="采购申请" color="#fff" :bgcolor="mainColor" height=".88rem">
      <router-link :to="'/estate/serviceList'" slot="left"><!--url[url.length-1]-->
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </router-link>
      <div slot="right" class="edit" style="color: #fff;">
        <a @click="sureToRepair">
          提交
        </a>
      </div>
    </yd-navbar>
    <div class="top-select-type">
      &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp类型
      <img v-if="type==1" src="../../../../../../assets/images/rent/my/job_selected.png" alt="">
      <img v-if="type!=1" src="../../../../../../assets/images/rent/my/unselected_pic.png" @click="selectType(1)"
           alt=""><span>采购</span>
      <img v-if="type==2" src="../../../../../../assets/images/rent/my/job_selected.png" alt="">
      <img v-if="type!=2" src="../../../../../../assets/images/rent/my/unselected_pic.png" @click="selectType(2)"
           alt=""><span>供应</span>
    </div>
    <br>
    <div class="top-select-type">
      &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp标题
      <input class="clear-input" v-model="data.title" type="text">
    </div>
    <div class="date-select-type">
      开始时间
      <div class="date-div">
        <yd-cell-item arrow>
          <yd-datetime type="date" v-model="data.startDate" slot="right"></yd-datetime>
        </yd-cell-item>
      </div>
    </div>
    <div class="date-select-type">
      结束时间
      <div class="date-div">
        <yd-cell-item arrow>
          <yd-datetime type="date" v-model="data.completionDate" slot="right"></yd-datetime>
        </yd-cell-item>
      </div>
    </div>
    <div class="text-more">
        <textarea v-model="data.detail" placeholder="详情描述">
      </textarea>
      <div class="show-send-pic">
        <div class="logo-img-div">
          <!--<img v-if="showLogo"  :src="imageUrl" alt="" class="fileImg">-->
          <!--<img v-if="" :src="mechanismMsg.organLogo" alt="" class="fileImg">-->
          <img src="../../../../../../assets/images/rent/my/admin/add-logo.png" alt="" class="fileImg add-logo-img">
          <input class="file hid-input" name="file[]" type="file" accept="image/*"
                 @change="update" multiple/>
        </div>
        <div class="logo-img-div" v-for="item,index in imageUrlList">
          <img v-if="showLogo" :src="item" alt="" class="fileImg">
          <a @click="delThisPic(index)"><yd-icon name="error" class="del-this-pic"></yd-icon></a>
          <!--<img v-if="" :src="mechanismMsg.organLogo" alt="" class="fileImg">-->
          <!--<img v-if="!showLogo" src="../../../../../assets/images/rent/my/admin/add-logo.png" alt="" class="fileImg add-logo-img">-->
          <!--<input class="file hid-input"  name="file[]" type="file" accept="image/png,image/gif,image/jpeg" @change="update"multiple/>-->
        </div>
      </div>
    </div>
    <br>
    <div class="add_top edit_code">
      <div class="list-left">汇报人</div>
      <a @click="toSelect">
        <div class="newMessage">默认为直属领导</div>
      </a>
      <img class="m-right l-right" src="../../../../../../assets/images/rent/my/enter.png">
    </div>

  </yd-layout>
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
        getLogoMsg: {},
        getData: '',
        imageUrl: '',
        imageUrlList: [],
        imageKeyList: [],
        showLogo: false,
        whyToRepair: '',
        typeName: '请选择',
        typeGuid: '',
        location: '',
        data: {
          startDate: '',
          completionDate: ''
        },
        selectImg: '../../../../assets/images/rent/my/job_selected.png',
        unSelectImg: '../../../../assets/images/rent/my/unselected_pic.png',
        type: ''
      }
    },
    methods: {
      delThisPic(index){
        this.imageKeyList.splice(index,1);
        this.imageUrlList.splice(index,1);
      },
      selectType(num) {
        this.type = num;
        this.data.type = num
      },
      toSelect() {
        localStorage.setItem('purchaseData', encodeURIComponent(JSON.stringify(this.data)));
        this.$router.push('/my/manager/select_boss')
      },
      update(e) {
//        var data = {organId:this.organInfo.guid, token: this.getkey,pageNo:1,pageSeze:15};
//        this.getData=sendImgServer(this.getData,this.xhr,this.subUrl,data,e);
//        console.log(this.getData)
//        console.log(json.imageUrl)
//        this.imageUrlList = [];
        this.imageUrl = this.getData.imageUrl
        for (var i = 0; i < e.target.files.length; i++) {
          let file = e.target.files[i];
          let d = new Date();
          let type = file.name.split('.');
          let tokenParem = {
            'putPolicy': '{\"name\":\"$(fname)\",\"size\":\"$(fsize)\",\"w\":\"$(imageInfo.width)\",\"h\":\"$(imageInfo.height)\",\"hash\":\"$(etag)\"}',
            'key': 'orderReview/' + d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.valueOf() + '.' + type[type.length - 1],
            'bucket': 'http://oysfye6yt.bkt.clouddn.com',//七牛的地址，这个是你自己配置的（变量）
          };
          let param = new FormData(); //创建form对象
          param.append('chunk', '0');//断点传输
          param.append('chunks', '1');
          param.append('file', file, file.name)
          let config = {
            headers: {'Content-Type': 'multipart/form-data'}
          };
          this.token = this.getLogoMsg.token;
          this.imageUrl = this.getLogoMsg.domain;
          param.append('token', this.token);
//            if(this.images.length>8){
//              alert('不能超过9张');
//              return;
//            }
          this.uploading(param, config, file.name);//然后将参数上传七牛
        }
        return;

        //先从自己的服务端拿到token
      },
      getQiniuMsg() {
        var data = {organId: this.organInfo.guid, token: this.getkey, pageNo: 1, pageSeze: 15};
        this.xhr.post(`${this.subUrl.user}/qiniu/getInfo?token=` + data.token).then((res) => {
          if (res.data.code == 1) {
//            console.log(res.data.data.token)
            this.getLogoMsg = res.data.data
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            // fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
      },
      uploading(param, config, pathName) {
        this.xhr.post('http://up-z2.qiniu.com', param, config)
          .then(response => {
            this.organLogo = response.data.key;
            this.imageKeyList.push(this.organLogo);
            this.data.AccessoryFiles = this.imageKeyList
            this.imageUrlList.push(this.imageUrl + '/' + response.data.key);
            this.data.imageUrlList = this.imageUrlList
            this.showLogo = true;
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
      sureToRepair() {
        if (this.data.imageUrlList) {
          delete this.data.imageUrlList
        }
        var accessorys = this.imageKeyList[0];
        for (var i = 1; i < this.imageKeyList.length; i++) {
          accessorys = accessorys + ',' + this.imageKeyList[i]
        }
        this.data.accessorys = accessorys

        // {params: {type: 'pulldown', page: this.page}
        this.xhr.post(`${this.subUrl.activity}/myReport/addWorkReport?` + qs.stringify(this.data)).then((res) => {
          if (res.data.code == 1) {
            localStorage.removeItem('purchaseData')
            console.log(110)
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      },
      getJobInfo(cb) {
        var data = {organId: this.organInfo.guid, token: this.getkey, pageNo: 1, pageSeze: 15};
        this.xhr.post(`${this.subUrl.user}/admin/postManage/postList?token=` + data.token + '&organId=' + data.organId).then((res) => {
          if (res.data.code == 1) {
            cb && cb();
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            // fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
      },
      clearLoacl() {
        this.alertS = true;
      },
      quit() {
        this.alertS = false;
      },
      getUserInfo(cb) {
        var data = {userId: this.userId, token: this.getkey};
        this.xhr.post(`${this.subUrl.user}/user/getUserInfo`, qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
            this.userInfo = res.data.data.userInfo;
            this.organInfo = res.data.data.organInfo;
            cb && cb();
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
      if (JSON.parse(decodeURIComponent(localStorage.getItem('purchaseData')))) {
        this.data = JSON.parse(decodeURIComponent(localStorage.getItem('purchaseData')));
        this.type = this.data.type;
        this.imageUrlList = this.data.imageUrlList;
        this.showLogo = true
      }
      console.log()

      if (this.$route.query.type) {
        this.typeGuid = this.$route.query.type
      }
      if (this.$route.query.typeName) {
        this.typeName = this.$route.query.typeName
      }
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = this.$color[this.userInfo.organType]
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
  .top-select-type {
    width: 100%;
    padding-left: 1.5em;
    padding-right: 1.5em;
    background: #ffffff;
    line-height: 3.5em;
  }

  .date-select-type {
    width: 100%;
    padding-left: 1.5em;
    padding-right: 1.5em;
    background: #ffffff;
    line-height: 3.5em;
  }

  .top-select-type :after {

  }

  .top-select-type div {
    display: inline-block;
    width: 75%;
    padding: 0 1em;
    border-radius: 0.4em;
    background: #fff;
    border: 1px solid #e6e6e6;
    color: #999999;
    position: relative;
  }

  .top-select-type img {
    width: 1.5em;
    height: auto;
    margin-bottom: -1.5%;
    margin-left: 13%;
    margin-right: 2%;
  }

  .layout_my {
    /*background: #f7f7f9;*/
  }

  .layout_my .header:after {
    display: none;

  }

  .text-more {
    width: 100%;
    padding: 0.6em;
    background: #f5f5f5;
    border-radius: 5px;
    margin-top: 6%;
  }

  .text-more textarea {
    width: 100%;
    border: 1px solid #e6e6e6;
    background: #ffffff;
    border-radius: 5px;
    height: 10em;
    padding: 0.5em;
  }

  .logo-img-div {
    width: 18%;
    margin: 1%;
    border: 1px solid #e6e6e6;
    min-height: 4em;
    padding: 0.5em;
    margin-top: 0.5em;
    border-radius: 6px;
    position: relative;
    background: #fafefd;
    display: inline-block;
  }

  .logo-img-div img {
    width: 100%;
    height: 100%;
    margin: 0;
  }

  .hid-input {
    opacity: 0;
    position: absolute;
    width: 5em;
    height: 5em;
  }

  .add-logo-img {
    width: 2em !important;
    height: 2em !important;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -1em !important;
    margin-top: -1em !important;
  }

  .show-send-pic {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
  }

  .clear-input {
    width: 75%;
    border-radius: 3px;
    border: 1px solid #e6e6e6;
    background: #ffffff;
    line-height: 1.8em;
    padding: 0.3em 0.5em
  }

  .date-div {
    display: inline-block;
    line-height: 1.4em;
    width: 75%;
    padding: 0.5em;
    border: 1px solid #e6e6e6;
    border-radius: 3px;
  }
  .add_top {
    width: 100%;
    line-height: 0.9rem;
    background: #ffffff
  }

  .add_top input {
    line-height: 2.3em;
    width: 100%;
  }
  .newMessage {
    margin-right: 2.3em;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    color: #999999;
    text-align: right;
  }
  .list-left {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }
  .edit_code {
    margin-top: 1em;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-flow: row nowrap;
    flex-flow: row nowrap;
    height: 1rem;
    padding: .15rem 1em;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    background: #fafefd;
  }
  .l-right {
    height: 0.3rem;
    width: .3rem;
    right: 0.5rem;
    position: absolute;
  }
  .del-this-pic{
    position: absolute;
    color: #22ac38;
    top: -8px!important;
    right: -6px!important;
    font-size: 18px!important;
  }
</style>
