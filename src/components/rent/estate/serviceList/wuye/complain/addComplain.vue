<template>
  <div style="height:100vh">
    <yd-layout class="layout_my" v-if="showUser && showAssign">
      <yd-navbar class="header" slot="navbar" v-show="!userAgent.isWX" v-title="'投诉建议上报'" title="投诉建议上报" color="#fff" :bgcolor="mainColor" height=".88rem">
        <a @click="back" slot="left"><!--url[url.length-1]-->
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </a>
        <div slot="right" class="edit" style="color: #fff;">
          <a @click="sureToRepair">
            提交
          </a>
        </div>
      </yd-navbar>
      <div class="top-select-type">
        <span>类型&nbsp;</span>
          <!--<input class="clear-input" v-bind:placeholder=typeName type="text">-->
        <yd-radio-group  v-model="typeNo" :color="mainColor">
          <yd-radio val="1">投诉</yd-radio>
          <yd-radio val="2">建议</yd-radio>
        </yd-radio-group>
      </div>
      <div class="top-select-type">
        地点位置&nbsp;
        <input v-model="location" class="clear-input" type="text">
      </div>
      <div class="flex-row-nowrap bgwhite h8 pdlr2 mt2">
        <input type="text" class="flex1 border mr2 pdlr1" @click="chooseDong" v-model="dong.text" placeholder="选择栋" readonly style="height:.68rem;width:40%">
        <input type="text" class="flex1 border pdlr1"  @click="chooseUnit"  v-model="unit.text" placeholder="选择单元" readonly style="height:.68rem;width:40%">
      </div>
      <div class="flex-row-nowrap bgwhite h8 pdlr2">
        <input type="text" class="flex1 border pdlr1" style="height:.68rem" v-model="rentUserName" @click="chooseUser" placeholder="选择用户" readonly>
      </div>
      <!-- 选择审批人 -->
      <div class="flex-row-nowrap bgwhite h8 pdlr2">
        <input type="text" class="flex1 border pdlr1" style="height:.68rem" v-model="assignName" @click="chooseAssign" placeholder="选择处理人(部门经理)" readonly>
      </div>
      <div class="text-more">
        <textarea v-model="whyToRepair" maxlength="200" placeholder="详情描述">
      </textarea>
        <div class="show-send-pic">
          <div class="logo-img-div">
            <!--<img v-if="showLogo"  :src="imageUrl" alt="" class="fileImg">-->
            <!--<img v-if="" :src="mechanismMsg.organLogo" alt="" class="fileImg">-->
            <img style="width:1.6rem;height:1.6rem" src="../../../../../../assets/images/rent/estate/photo.png" alt="" class="fileImg add-logo-img">
            <input class="file hid-input" name="file[]" type="file" accept="image/*"
                   @change="update" multiple/>
             </div>
          <div v-if="imageUrlList&&imageUrlList.length==0" style="border: none" class="logo-img-div"></div>
          <div v-if="imageUrlList&&imageUrlList.length==0" style="border: none" class="logo-img-div"></div>
          <div class="logo-img-div" v-for="(item,index) in imageUrlList" :key="index">
            <img v-if="showLogo" :src="item" alt="" class="fileImg">
            <a @click="delThisPic(index)"><yd-icon name="error" class="del-this-pic"></yd-icon></a>
            <!--<img v-if="" :src="mechanismMsg.organLogo" alt="" class="fileImg">-->
            <!--<img v-if="!showLogo" src="../../../../../assets/images/rent/my/admin/add-logo.png" alt="" class="fileImg add-logo-img">-->
            <!--<input class="file hid-input"  name="file[]" type="file" accept="image/png,image/gif,image/jpeg" @change="update"multiple/>-->
          </div>
          <div v-if="imageUrlList&&imageUrlList.length>0&&((imageUrlList.length+1)%3!=0)" style="border: none"
               class="logo-img-div"></div>
          <div v-if="imageUrlList&&imageUrlList.length>0&&(imageUrlList.length+1)%3==1" style="border: none"
               class="logo-img-div"></div>
        </div>
      </div>
      <vue-pickers v-show="showDong" slot="bottom" class="slideBox" :selectData="pickData1" v-on:cancel="close" v-on:confirm="confirmFn"></vue-pickers>
      <vue-pickers v-show="showUnit" slot="bottom" class="slideBox" :selectData="pickData2" v-on:cancel="close" v-on:confirm="confirmFn1"></vue-pickers>
    </yd-layout>
    <departMent v-if='!showUser' :organId='rentOrganId' @setUserId='setUserId'></departMent>
    <departMent1 v-if='!showAssign' :organId='organInfo.guid' @setAssignId='setAssignId'></departMent1>
  </div>
</template>
<script>
import fn from "@/assets/js/product";
import qs from "qs";
import Vue from "vue";
import { Radio, RadioGroup } from "vue-ydui/dist/lib.rem/radio";
import { Icons } from "vue-ydui/dist/lib.rem/icons";
/* 使用px：import {Radio, RadioGroup} from 'vue-ydui/dist/lib.px/radio'; */

Vue.component(Radio.name, Radio);
Vue.component(RadioGroup.name, RadioGroup);
import departMent from "../renovation/department_manager";
import departMent1 from "./department_manager";
import VuePickers from "vue-pickers";

export default {
  components: {
    departMent,
    departMent1,
    VuePickers
  },
  data() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    return {
      organInfo: "",
      pickData1: {
        columns: 1,
        isChange: false,
        pData1: []
      },
      pickData2: {
        columns: 1,
        isChange: false,
        pData1: []
      },
      showDong: false,
      showUnit: false,
      dong: {},
      unit: {},
      rentUserName: "",
      rentUserId: "",
      assignName: "",
      assignId: "",
      showUser: true,
      showAssign: true,
      hasMessage: {
        count: 99,
        new: true
      },
      value2: "",
      result: [],
      url: this.fromRoute ? this.fromRoute : "",
      userInfo: "",
      mainColor: "",
      getLogoMsg: {},
      getData: "",
      imageUrl: "",
      imageUrlList: [],
      imageKeyList: [],
      showLogo: false,
      whyToRepair: "",
      typeNo: 0,
      typeGuid: "",
      location: ""
    };
  },
  methods: {
    setUserId(e) {
      console.log(111);
      this.showUser = true;
      if (e) {
        this.rentUserId = e.userId;
        this.rentUserName = e.userName;
      }
    },
    setAssignId(e) {
      this.showAssign = true;
      console.log(this.showAssign);
      if (e) {
        this.assignId = e.userId;
        this.assignName = e.userName;
      }
    },
    chooseUser() {
      console.log(this.unit.organId, this.unit, this.unit.organId == "");
      if (!this.unit.organId) {
        return this.$dialog.toast({ mes: "请选择单元号" });
      } else {
        this.showUser = false;
      }
      this.rentOrganId = this.unit.organId;
    },
    chooseAssign() {
      console.log(111);
      this.showAssign = false;
    },
    close() {
      this.showDong = false;
      this.showUnit = false;
    },
    confirmFn(e) {
      this.dong = e.select1;
      console.log(JSON.stringify(e.select1));
      this.showDong = false;
      this.unit = {};
      this.getUnit(this.dong.guid);
    },
    confirmFn1(e) {
      JSON.stringify(e.select1);
      this.unit = e.select1;
      console.log(this.unit.guid);
      console.log(e.select1);
      this.rentUserId = "";
      this.rentUser = "";
      this.showUnit = false;
    },
    chooseDong() {
      if (this.pickData1.pData1.length == 0) {
        return this.$dialog.toast({ mes: "数据为空", timeout: 1000 });
      } else {
        this.showDong = true;
        console.log(this.showDong);
      }
    },
    chooseUnit() {
      if (this.pickData2.pData1.length == 0) {
        return this.$dialog.toast({ mes: "数据为空", timeout: 1000 });
      } else {
        this.showUnit = true;
      }
    },
    getDong(id) {
      console.log(this.userInfo);
      console.log(id);
      this.xhr
        .post(
          `${this.subUrl.common}/comm/getBuildingRid`,
          qs.stringify({
            buildingId: id
          })
        )
        .then(res => {
          if (res.data.code == 1) {
            let len = res.data.data.length;
            let arr = [];
            for (var i = 0; i < len; i++) {
              var obj = res.data.data[i];
              obj.value = res.data.data[i].guid;
              obj.text = res.data.data[i].ridName;
              arr.push(obj);
            }
            this.pickData1.pData1 = arr;
          } else {
            this.$dialog.alert({
              mes: res.data.msg
            });
            this.pickData2.pData1 = [];
            this.pickData3.pData1 = [];
          }
        });
    },
    getUnit(id) {
      this.xhr
        .post(
          `${this.subUrl.common}/comm/getEnterUnit`,
          qs.stringify({
            ridId: id
          })
        )
        .then(res => {
          if (res.data.code == 1) {
            let len = res.data.data.length;
            let arr = [];
            for (var i = 0; i < len; i++) {
              var obj = res.data.data[i];
              console.log();
              obj.value = res.data.data[i].ridId;
              obj.text = res.data.data[i].unitName;
              arr.push(obj);
            }
            this.pickData2.pData1 = arr;
          } else {
            this.$dialog.alert({
              mes: res.data.msg
            });
          }
        });
    },
    back() {
      this.$router.go(-1);
    },
    delThisPic(index) {
      this.imageKeyList.splice(index, 1);
      this.imageUrlList.splice(index, 1);
    },
    update(e) {
      this.imageUrl = this.getData.imageUrl;
      for (var i = 0; i < e.target.files.length; i++) {
        let file = e.target.files[i];
        let d = new Date();
        let type = file.name.split(".");
        let tokenParem = {
          putPolicy:
            '{"name":"$(fname)","size":"$(fsize)","w":"$(imageInfo.width)","h":"$(imageInfo.height)","hash":"$(etag)"}',
          key:
            "orderReview/" +
            d.getFullYear() +
            "/" +
            (d.getMonth() + 1) +
            "/" +
            d.getDate() +
            "/" +
            d.valueOf() +
            "." +
            type[type.length - 1],
          bucket: "http://oysfye6yt.bkt.clouddn.com" //七牛的地址，这个是你自己配置的（变量）
        };
        let param = new FormData(); //创建form对象
        param.append("chunk", "0"); //断点传输
        param.append("chunks", "1");
        param.append("file", file, file.name);
        let config = {
          headers: { "Content-Type": "multipart/form-data" }
        };
        this.token = this.getLogoMsg.token;
        this.imageUrl = this.getLogoMsg.domain;
        param.append("token", this.token);
        //            if(this.images.length>8){
        //              alert('不能超过9张');
        //              return;
        //            }
        this.uploading(param, config, file.name); //然后将参数上传七牛
      }
      return;

      //先从自己的服务端拿到token
    },
    getQiniuMsg() {
      var data = {
        organId: this.organInfo.guid,
        token: this.getkey,
        pageNo: 1,
        pageSeze: 15
      };
      this.xhr
        .post(`${this.subUrl.user}/qiniu/getInfo?token=` + data.token)
        .then(res => {
          if (res.data.code == 1) {
            //            console.log(res.data.data.token)
            this.getLogoMsg = res.data.data;
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            // fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        });
    },
    uploading(param, config, pathName) {
      this.xhr.post("http://up-z2.qiniu.com", param, config).then(response => {
        this.organLogo = response.data.key;
        this.imageKeyList.push(this.organLogo);
        this.imageUrlList.push(this.imageUrl + "/" + response.data.key);
        this.showLogo = true;
      });
    },
    itemClickHandler() {},
    itemClickHandler() {},
    sureToRepair() {
      var accessorys = this.imageKeyList[0];
      for (var i = 1; i < this.imageKeyList.length; i++) {
        accessorys = accessorys + "," + this.imageKeyList[i];
      }
      if (!this.assignId) {
        return this.$dialog.toast({ mes: "请选择审批人" });
      }
      var data = {
        token: this.getkey,
        userId: this.userInfo.guid,
        unitId: this.unit.guid,
        organId: this.organInfo.guid,
        location: this.location,
        description: this.whyToRepair,
        type: this.typeNo,
        imageNames: accessorys,
        applyUserId: this.rentUserId,
        assignee: this.assignId
      };
      // {params: {type: 'pulldown', page: this.page}
      this.xhr
        .post(
          `${this.subUrl.activity}/complaint/submitComplaint?` +
            qs.stringify(data)
        )
        .then(res => {
          if (res.data.code == 1) {
            this.$router.go(-1);
            this.$dialog.toast({ mes: "申请成功" });
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        });
    },
    getJobInfo(cb) {
      var data = {
        organId: this.organInfo.guid,
        token: this.getkey,
        pageNo: 1,
        pageSeze: 15
      };
      this.xhr
        .post(
          `${this.subUrl.user}/admin/postManage/postList?token=` +
            data.token +
            "&organId=" +
            data.organId
        )
        .then(res => {
          if (res.data.code == 1) {
            cb && cb();
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            // fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        });
    },
    clearLoacl() {
      this.alertS = true;
    },
    quit() {
      this.alertS = false;
    },
    getUserInfo(cb) {
      var data = { userId: this.userId, token: this.getkey };
      this.xhr
        .post(`${this.subUrl.user}/user/getUserInfo`, qs.stringify(data))
        .then(res => {
          if (res.data.code == 1) {
            this.userInfo = res.data.data.userInfo;
            this.organInfo = res.data.data.organInfo;
            cb && cb();
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        });
    }
  },
  mounted() {
    if (this.$route.query.type) {
      this.typeGuid = this.$route.query.type;
    }
    if (this.$route.query.typeName) {
      this.typeName = this.$route.query.typeName;
    }
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.mainColor = this.$color[this.userInfo.organType];
    this.userId = this.userInfo.guid;
    this.getkey = fn.getIng();
    this.userId = this.userInfo.guid;
    this.getQiniuMsg();
    var that = this;
    this.getUserInfo(function() {
      that.getJobInfo();
    });
    this.getDong(this.userInfo.buildingId);
  }
};
</script>
<style scoped>
.top-select-type {
  width: 100%;
  padding-left: 2.5em;
  padding-right: 1.5em;
  padding-top: 1em;
  padding-bottom: 0.5em;
  background: #ffffff;
  /*line-height: 3.5em;*/
}

.top-select-type div {
  display: inline-block;
}
/*.top-select-type :after {*/

/*}*/

/*.top-select-type div {*/
/*display: inline-block;*/
/*width: 75%;*/
/*padding: 0 1em;*/
/*border-radius: 0.4em;*/
/*background: #fff;*/
/*border: 1px solid #e6e6e6;*/
/*color: #999999;*/
/*position: relative;*/
/*}*/

/*.top-select-type img {*/
/*position: absolute;*/
/*right: 0.6em;*/
/*top: 0.7em;*/
/*width: 1.5em;*/
/*height: auto;*/
/*}*/

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
  /* flex: 30%; */
  width: 1.6rem;
  height: 1.6rem;
  margin: 0.1rem;
  /* border: 1px solid #e6e6e6; */
  /* min-height: 7em; */
  padding: 0.5em;
  margin-top: 0.1rem;
  border-radius: 0.1rem;
  position: relative;
  background: #fafefd;
  /* display: inline-block; */
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
  /* width: 2em !important; */
  /* height: 2em !important; */
  position: absolute;
  left: 0;
  top: 0;
  /* left: 50%; */
  /* top: 50%; */
  /* margin-left: -1em !important; */
  /* margin-top: -1em !important; */
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
  padding: 0.3em 0.5em;
}
.del-this-pic {
  position: absolute;
  color: #22ac38;
  top: -8px !important;
  right: -6px !important;
  font-size: 18px !important;
}
</style>
