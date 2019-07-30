<template>
  <div>
    <yd-layout class="layout_my" v-show='isShow'>
      <yd-navbar class="header" slot="navbar" v-show="!userAgent.isWX" v-title="'报修单'" title="报修单" color="#fff" :bgcolor="mainColor"
        height=".88rem">
        <span @click="$router.go(-1)" class="addClickArea" slot="left">
          <!--url[url.length-1]-->
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </span>
        <div slot="right" class="edit addRightClickArea" style="color: #fff;">
          <a @click="sureToRepair">
            提交
          </a>
        </div>
      </yd-navbar>
      <div class="flex-row-nowarp bgwhite h8 flex-start" style="padding-right:.6rem" @click='setShow()'>
        <div style="width:1.7rem;text-align:right;" class="mr2">报修类型</div>
        <input class="clear-input" style="height:.65rem" readonly v-bind:placeholder=typeName type="text">
        <!-- </router-link> -->
      </div>
      <!-- <div class="flex-row-nowarp bgwhite h8 flex-start" style="padding-right:.6rem">
        <div style="width:1.68rem" class="mr2"></div>
        <input type="text" @click='chooseDong' placeholder="栋" v-model='dong.text' class="clear-input flex1 mr1" style="border-radius:.1rem;width:1.8rem;height:.65rem"
          readonly>
        <input type="text" @click='chooseUnit' placeholder="单元号" v-model='unit.text' class="clear-input flex1" style="border-radius:.1rem;width:1.8rem;height:.65rem"
          readonly>
        <div></div>
      </div> -->
      <div class="flex-row-nowarp bgwhite h8 flex-start" style="padding-right:.6rem">
        <div style="width:1.7rem;text-align:right;" class="mr2">维修位置</div>
        <input class="clear-input" v-model="location" style="height:.65rem" type="text">
      </div>

      <div class="text-more">
        <textarea v-model="whyToRepair" placeholder="详情描述">
      </textarea>
        <div class="show-send-pic">
          <div class="logo-img-div">
            <!--<img v-if="showLogo"  :src="imageUrl" alt="" class="fileImg">-->
            <!--<img v-if="" :src="mechanismMsg.organLogo" alt="" class="fileImg">-->
            <img src="../../../../../assets/images/rent/estate/photo.png" alt="" class="fileImg add-logo-img">
            <!-- <img src="../../../../../assets/images/rent/my/admin/add-logo.png" alt="" class="fileImg add-logo-img"> -->
            <input class="file hid-input" name="file[]" type="file" accept="image/jpeg,image/png,image/jpg" @change="update" multiple/>
          </div>
          <div v-if="imageUrlList&&imageUrlList.length==0" style="border: none" class="logo-img-div"></div>
          <div v-if="imageUrlList&&imageUrlList.length==0" style="border: none" class="logo-img-div"></div>
          <div class="logo-img-div" v-for="item,index in imageUrlList">
            <img v-if="showLogo" :src="item" alt="" class="fileImg">
            <a @click="delThisPic(index)">
              <yd-icon name="error" class="del-this-pic"></yd-icon>
            </a>
            <!--<img v-if="" :src="mechanismMsg.organLogo" alt="" class="fileImg">-->
            <!--<img v-if="!showLogo" src="../../../../../assets/images/rent/my/admin/add-logo.png" alt="" class="fileImg add-logo-img">-->
            <!--<input class="file hid-input"  name="file[]" type="file" accept="image/png,image/gif,image/jpeg" @change="update"multiple/>-->
          </div>
          <div v-if="imageUrlList&&imageUrlList.length>0&&((imageUrlList.length+1)%3!=0)" style="border: none" class="logo-img-div"></div>
          <div v-if="imageUrlList&&imageUrlList.length>0&&(imageUrlList.length+1)%3==1" style="border: none" class="logo-img-div"></div>
        </div>
      </div>
      <vue-pickers v-show="show1" slot="bottom" class="slideBox" :selectData="pickData1" v-on:cancel="close" v-on:confirm="confirmFn"></vue-pickers>
      <vue-pickers v-show="show2" slot="bottom" class="slideBox" :selectData="pickData2" v-on:cancel="close" v-on:confirm="confirmFn1"></vue-pickers>
    </yd-layout>
    <!-- 选择类型 -->
    <seleceType v-show='!isShow' @getParams='getParams' @myCancel='myCancel'></seleceType>

  </div>
</template>
<script>
  import fn from '@/assets/js/product'
  import qs from 'qs'
  import { Icons } from 'vue-ydui/dist/lib.rem/icons';
  import seleceType from './selectType'
  import VuePickers from 'vue-pickers'
  export default {
    components: {
      seleceType,
      VuePickers
    },
    data() {
      return {
        isShow: true,
        organInfo: "",
        hasMessage: {
          count: 99,
          new: true,
        },
        pickData1: {
          columns: 1,
          isChange: false,
          pData1: [],
        },
        pickData2: {
          columns: 1,
          isChange: false,
          pData1: [],
        },
        dong:{},
        unit:{},
        show1:false,
        show2:false,
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
        location: ''
      }
    },
    methods: {
      setShow() {
        console.log(111);
        this.isShow = false;
      },
      getParams(data) {
        console.log(data);
        this.typeGuid = data.type
        this.typeName = data.typeName
        this.isShow = true;
      },
      chooseDong() {
        if (this.pickData1.pData1.length == 0) {
          return this.$dialog.toast({ mes: "数据为空", timeout: 1000 })
        } else {
          this.show1 = true;
        }
      },
      chooseUnit() {
        if (this.pickData2.pData1.length == 0) {
          return this.$dialog.toast({ mes: "数据为空", timeout: 1000 });
        } else {
          this.show2 = true;
        }
      },
      getDong(id) {
        this.xhr.post(`${this.subUrl.common}/comm/getBuildingRid`, qs.stringify({
          buildingId: id
        })).then(res => {
          if (res.data.code == 1) {
            let len = res.data.data.length;
            let arr = [];
            for (var i = 0; i < len; i++) {
              var obj = res.data.data[i];
              obj.value = res.data.data[i].guid;
              obj.text = res.data.data[i].ridName;
              arr.push(obj)
            }
            this.pickData1.pData1 = arr;
          } else {
            this.$dialog.alert({
              mes: res.data.msg
            });
            this.pickData2.pData1 = [];
            this.pickData3.pData1 = [];
          }
        })
      },
      getUnit(id) {
        this.xhr.post(`${this.subUrl.common}/comm/getBuildingUnit`, qs.stringify({
          ridId: id
        })).then(res => {
          if (res.data.code == 1) {
            let len = res.data.data.length;
            let arr = [];
            for (var i = 0; i < len; i++) {
              var obj = res.data.data[i];
              console.log()
              obj.value = res.data.data[i].ridId;
              obj.text = res.data.data[i].unitName;
              arr.push(obj)
            }
            this.pickData2.pData1 = arr;
          } else {
            this.$dialog.alert({
              mes: res.data.msg
            })
          }
        })
      },
      close: function () {
        this.show1 = false;
        this.show2 = false;
      },
      confirmFn(e) {
        this.dong = e.select1;
        console.log(JSON.stringify(e.select1));
        this.show1 = false;
        this.buildingRidId = e.select1.guid;
        this.getUnit(this.dong.guid);
        this.unit = {};
        this.roomNumber = "";
        this.acceptOrgId = "";
      },
      confirmFn1(e) {
        console.log(JSON.stringify(e.select1));
        this.unit = e.select1;
        console.log(e.select1);
        this.roomNumber = e.select1.guid;
        this.acceptOrgId = e.select1.organId;
        this.show2 = false;
      },
      myCancel() {
        this.isShow = true;
      },
      delThisPic(index) {
        this.imageKeyList.splice(index, 1);
        this.imageUrlList.splice(index, 1);
      },
      update(e) {
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
            headers: { 'Content-Type': 'multipart/form-data' }
          };
          this.token = this.getLogoMsg.token;
          this.imageUrl = this.getLogoMsg.domain;
          param.append('token', this.token);
          this.uploading(param, config, file.name);//然后将参数上传七牛
        }
        return;

        //先从自己的服务端拿到token
      },
      getQiniuMsg() {
        var data = { organId: this.organInfo.guid, token: this.getkey, pageNo: 1, pageSeze: 15 };
        this.xhr.post(`${this.subUrl.user}/qiniu/getInfo?token=` + data.token).then((res) => {
          if (res.data.code == 1) {
            //            console.log(res.data.data.token)
            this.getLogoMsg = res.data.data
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            // fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        })
      },
      uploading(param, config, pathName) {
        this.xhr.post('http://up-z2.qiniu.com', param, config)
          .then(response => {
            this.organLogo = response.data.key;
            this.imageKeyList.push(this.organLogo);
            this.imageUrlList.push(this.imageUrl + '/' + response.data.key);
            this.showLogo = true;
          })
      },
      itemClickHandler() {
      },
      itemClickHandler() {
      },
      sureToRepair() {
        var accessorys = this.imageKeyList.join(',')
        var data = {
          token: this.getkey, userId: this.userId, typeId: this.typeGuid,
          location: this.location, remark: this.whyToRepair, accessorys: accessorys
        };
        if (!this.typeGuid) {
          return this.$dialog.toast({ mes: "请选择保修类型" });
        }else if (!data.remark) {
          return this.$dialog.toast({ mes: "请输入详情描述" });
        }
        if (this.typeGuid && this.typeGuid != '') {
          this.xhr.post(`${this.subUrl.activity}/repairs/subRepairsBill?` + qs.stringify(data)).then((res) => {
            if (res.data.code == 1) {
              // this.$router.push('/estate/order_submit')
              this.$router.go(-1);
            } else if (res.data.code == '-902') {//-902
              /*重新登录*/
              fn.re_login(this);
            } else {
              this.$dialog.toast({ mes: res.data.msg });
            }
          })
        }
      },
      getJobInfo(cb) {
        var data = { organId: this.organInfo.guid, token: this.getkey, pageNo: 1, pageSeze: 15 };
        this.xhr.post(`${this.subUrl.user}/admin/postManage/postList?token=` + data.token + '&organId=' + data.organId).then((res) => {
          if (res.data.code == 1) {
            cb && cb();
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            // fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
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
        var data = { userId: this.userId, token: this.getkey };
        this.xhr.post(`${this.subUrl.user}/user/getUserInfo`, qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
            this.userInfo = res.data.data.userInfo;
            this.organInfo = res.data.data.organInfo;
            cb && cb();
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        })
      },

    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = this.$color[this.userInfo.organType]
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      this.userId = this.userInfo.guid;
      this.getQiniuMsg();
      this.getDong(this.userInfo.buildingId);
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

  .top-select-type :after {}

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
    position: absolute;
    right: 0.6em;
    top: 0.7em;
    width: 1.5em;
    height: auto;
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
    background: #fafefd;
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
    width: 2rem;
    height: 2rem;
    margin: 1%;
    border-radius: .1rem;
    /* border: 1px solid #e6e6e6; */
    /* min-height: 7em; */
    padding: 0.5em;
    margin-top: 0.5em;
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
    width: 1.5rem!important;
    height: 1.5rem!important;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%)
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

  .del-this-pic {
    position: absolute;
    color: #22ac38;
    top: -8px!important;
    right: -6px!important;
    font-size: 18px!important;
  }
</style>
