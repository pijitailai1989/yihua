<template>
  <div style="height:100vh">
    <yd-layout class="layout_my" v-if="showUser">
        <yd-navbar class="header" v-title="'装修申报'"  slot="navbar"  v-show="!userAgent.isWX" title="装修申报" color="#fff" :bgcolor="mainColor" height=".88rem">
          <span class="spanLeft addClickArea" @click="back" slot="left">
              <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
          </span>
          <span slot="right" @click="submitForApply" class="edit addRightClickArea" style="color: #fff;font-size:.3rem;">提交</span>
        </yd-navbar>
      <div class="inputText">
          <ul>
            <li><p class="font32">开始时间</p><span>
                <yd-datetime type="date" v-model="datetime0" slot="right"></yd-datetime>
              </span></li>
            <li><p class="font32">结束时间</p><span>
                <yd-datetime type="date" v-model="datetime1" slot="right"></yd-datetime>
              </span></li>
          </ul>
      </div>
      <div class="flex-row-nowrap bgwhite h8 pdlr2 mt2">
        <input type="text" class="flex1 border mr2 pdlr1" @click="chooseDong" v-model="dong.text" placeholder="选择栋" readonly style="height:.68rem;width:40%">
        <input type="text" class="flex1 border pdlr1"  @click="chooseUnit"  v-model="unit.text" placeholder="选择单元" readonly style="height:.68rem;width:40%">
      </div>
      <div class="flex-row-nowrap bgwhite h8 pdlr2">
        <input type="text" class="flex1 border pdlr1" style="height:.68rem" v-model="rentUserName" @click="chooseUser" placeholder="选择用户" readonly>
      </div>

      <div class="details">
          <div>
            <yd-cell-item>
              <yd-textarea slot="right" v-model="description" placeholder="详情描述" maxlength="100"></yd-textarea>
            </yd-cell-item>
          </div>
          <div class="images">
              <ul>
                <li v-for="(item,index) in imgUrl" :key="index"><img :src="item" alt=""></li>

              </ul>
              <p v-show="show1" @click="addImg"><img style="width:1.28rem;height:1.28rem;" src="../../../../../../assets/images/rent/estate/photo.png" alt="">
              <input class="file" name="file" type="file" multiple accept="image/*" @change="update"/></p>
          </div>
      </div>

      <div class="staff">
          <p class="font28">施工人员信息</p>
          <ul>
            <li v-for="(item,index) in lists" :key="index">
                <span class="font32"><p>{{item.type==1?"负责人":"主要人员"}}：{{item.name}}</p>{{item.mobile}}</span>
              <p class="font28 flex-row">
                <span>身份证号：{{item.idCard}}</span>
                <span @click="deleteItem(index)">删除</span>
              </p>
            </li>
            <li>
              <img @click="toggle" style="width:.8rem;height:.8rem;" src="../../../../../../assets/images/rent/estate/add_person.png" alt="">
              </li>
          </ul>
      </div>

      <div class="alertText" v-show="alertT">
        <ul>

            <li>
                <a v-for="(item,index) in type" :key="index" @click="clickType(index)">
                <i v-if="active==index"><img src="../../../../../../assets/images/rent/estate/select_active.png" alt=""></i>
                <i v-else><img src="../../../../../../assets/images/rent/estate/select.png" alt=""></i>
                {{item}}</a>
            </li>
            <li class="a"><p class="font28">人员名字：</p><span><input v-model="info.name" type="text" placeholder="请填写"></span></li>
            <li class="a"><p class="font28">手机号码：</p><span><input maxlength="11" v-model="info.mobile" type="number" placeholder="请填写"></span></li>
            <li class="a">
               <p class="font28">身份证号：</p><span><input maxlength="18" v-model="info.decorationId" type="text" placeholder="请填写"></span>
              </li>
            <li><button @click="toggle" :style="{background:mainColor}">取 消</button>
            <button @click="confirm" :style="{background:mainColor}">确 定</button></li>
        </ul>
      </div>
      <vue-pickers v-show="showDong" slot="bottom" class="slideBox" :selectData="pickData1" v-on:cancel="close" v-on:confirm="confirmFn"></vue-pickers>
    <vue-pickers v-show="showUnit" slot="bottom" class="slideBox" :selectData="pickData2" v-on:cancel="close" v-on:confirm="confirmFn1"></vue-pickers>
    </yd-layout>
     <departMent v-if='!showUser' :organId='rentOrganId' @setUserId='setUserId'></departMent>
  </div>
</template>
<script>
import Vue from "vue";
import fn from "@/assets/js/product";
import departMent from "./department_manager";
import VuePickers from "vue-pickers";
import qs from "qs";
import { TextArea } from "vue-ydui/dist/lib.rem/textarea";
import { CellGroup, CellItem } from "vue-ydui/dist/lib.rem/cell";
/* 使用px：import {CellGroup, CellItem} from 'vue-ydui/dist/lib.px/cell'; */

Vue.component(CellGroup.name, CellGroup);
Vue.component(CellItem.name, CellItem);
Vue.component(TextArea.name, TextArea);
import { Input } from "vue-ydui/dist/lib.rem/input";
import {
  Confirm,
  Alert,
  Toast,
  Notify,
  Loading
} from "vue-ydui/dist/lib.rem/dialog";
import { DateTime } from "vue-ydui/dist/lib.rem/datetime";

Vue.component(DateTime.name, DateTime);

Vue.prototype.$dialog = {
  confirm: Confirm,
  alert: Alert,
  toast: Toast,
  notify: Notify,
  loading: Loading
};

Vue.component(Input.name, Input);

Vue.component(TextArea.name, TextArea);

export default {
  components: {
    departMent,
    VuePickers
  },
  data() {
    return {
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
      show1: true,
      images: [],
      showUser: true,
      rentUserId: "",
      userInfo: {},
      organInfo: {},
      getkey: "",
      organId: "",
      unitId: "",
      mainColor: "",
      input8: "",
      alertT: false,
      info: {
        name: "",
        mobile: null,
        decorationId: null,
        type: ""
      },
      list: [],
      getHearLog: {
        domain: "",
        token: "",
        name: ""
      },
      imgName: [],
      rentUserName: "",
      imgUrl: [],
      datetime0: this.$today(),
      datetime1:this.$addDay(this.$today(),30),
      description: "",
      type: ["负责人", "主要人员"],
      active: 0,
      organId: "",
      regId: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
      regName: /^[a-zA-Z\u4e00-\u9fa5]+$/,
      regPhone: /^1[3578]\d{9}$/
    };
  },
  computed: {
    lists() {
      return this.list;
    }
  },
  methods: {
    deleteItem(e){
      this.list.splice(e,1);
      this.$dialog.toast({mes:"删除成功"});
    },
    chooseUser() {
      console.log(111);
      console.log(this.unit.organId, this.unit, this.unit.organId == "");
      if (!this.unit.organId) {
        return this.$dialog.toast({ mes: "请选择单元号" });
      } else {
        this.showUser = false;
      }

      this.rentOrganId = this.unit.organId;
    },
    setUserId(e) {
      this.showUser = true;
      if (e) {
        (this.rentUserId = e.userId), (this.rentUserName = e.userName);
      }
    },
    clickType(index) {
      this.active = index;
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
    confirm() {
      var regId = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (this.info.name == "") {
        return this.$dialog.toast({ mes: "名字不能为空" });
      } else if(this.info.mobile == null){
        return this.$dialog.toast({ mes: "手机号不能为空" });
      }else if (!this.regPhone.test(this.info.mobile)) {
        return this.$dialog.toast({ mes: "手机号格式错误" });
      } else if (this.info.decorationId == null) {
        return this.$dialog.toast({ mes: "身份证号不能为空" });
      }else if(!regId.test(this.info.decorationId)){
        console.log(this.info.decorationId)
        return this.$dialog.toast({ mes: "身份证号格式错误" });
      }
      this.list.push({
        name: this.info.name,
        mobile: this.info.mobile,
        idCard:this.info.decorationId,
        type: this.active + 1
      });
      this.info = {};
      // console.log(this.list)
      this.alertT = !this.alertT;
    },
    toggle() {
      this.alertT = !this.alertT;
    },
    turnTo(url) {
      this.$router.push(url);
    },
    back() {
      history.back();
    },

    submitForApply() {
      console.log(this.userId);
      var data = {
        applyUserId: this.rentUserId,
        decorationRowList: this.list,
        description: this.description,
        endDate: this.datetime1 + " 23:59:59",
        imageNames: this.imgName,
        organId: this.organInfo.guid,
        startDate: this.datetime0 + " 00:00:00",
        token: this.$getkey(),
        unitId: this.unit.guid,
        userId: this.userInfo.guid
      };
      console.log(this.unit.unitId)
      if(!this.unit.guid){
        return this.$dialog.toast('11111')
      }
      if (
        this.description == "" ||
        this.datetime1 == "" ||
        this.datetime0 == ""
      ) {
        this.$dialog.toast({ mes: "相关内容不能为空！" });
      }else if(this.imgName == ""){
        return this.$dialog.toast({ mes: "请选择附件" });
      }else if (this.list.length == 0) {
        return this.$dialog.toast({ mes: "请输入施工人员" });
      }else if(this.rentUserName == ""){
        this.$dialog.toast({ mes: "请选择用户" });
      } else {
        this.$ajax1(
          `${this.subUrl.activity}/decoration/submitForApply?`,
          data,
          res => {
            this.$dialog.toast({ mes: "提交成功", icon: "success" });
            this.$router.go(-1);
          },
          this
        );
      }
    },
    update(e) {
      let file = e.target.files[0];
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
        bucket: this.getHearLog.domain //七牛的地址，这个是你自己配置的（变量）
      };
      let param = new FormData(); //创建form对象
      param.append("chunk", "0"); //断点传输
      param.append("chunks", "1");
      param.append("file", file, file.name);
      // console.log(param.get('file')); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      //先从自己的服务端拿到token

      this.token = this.getHearLog.token;
      param.append("token", this.token);
      //  if(this.images.length>1){
      //    alert('不能超过1张');
      //    return;
      //  }
      this.uploading(param, config, file.name); //然后将参数上传七牛
      return;
    },
    uploading(param, config, pathName) {
      this.xhr.post("http://up-z2.qiniu.com", param, config).then(response => {
        //  console.log(response.data);
        this.getHearLog.name = response.data.key;
        if (this.imgName.length < 5) {
          this.imgName.push(this.getHearLog.name);
          this.imgUrl.push(this.getHearLog.domain + "/" + this.getHearLog.name);
        }

        let localArr = this.images.map((val, index, arr) => {
          return arr[index].localSrc;
        });
        //  console.log(this.imgName)
        if (!~localArr.indexOf(pathName)) {
          this.images.push({
            src: this.showUrl + response.data.key,
            localSrc: pathName
          });
        } else {
          alert("已上传该图片");
        }
      });
    },
    getQiniuInfo() {
      this.xhr
        .post(`${this.subUrl.user}/qiniu/getInfo?token=` + this.getkey)
        .then(res => {
          if (res.data.code == 1) {
            // console.log(res)
            this.getHearLog = res.data.data;
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        });
    },
    addImg() {
      this.getQiniuInfo();
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.mainColor = this.$color[this.userInfo.organType];
    this.userId = this.userInfo.guid;
    this.getkey = fn.getIng();
    this.organId = this.organInfo.guid;
    this.unitId = this.userInfo.unitId;
    this.getDong(this.userInfo.buildingId);
  },
  beforeUpdate() {
    if (this.imgName.length >= 5) {
      this.show1 = false;
    }
  }
};
</script>
<style scoped>
.layout_my .header:after {
  display: none;
}
.layout_my {
  background: #f7f7f9;
}

.layout_my .blue_box {
  height: 0.88rem;
  background: #0093d2;
  background-size: 100% 100%;
}
.inputText {
  width: 100%;
  padding: 0 0.3rem;
  background: white;
  border-bottom: #f3f6f5;
}
.inputText ul {
  width: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}
.inputText ul li {
  width: 100%;
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
  padding: 0.15rem 0;
}
.inputText ul li > span {
  flex: 1;
  border: 1px solid #e6e7e7;
  height: 0.8rem;
  display: flex;
  align-items: center;
}
.inputText ul li > p {
  width: 1.6rem;
}
.inputText ul li > span > input {
  border: none;
  margin-left: 0.2rem;
}

.details {
  width: 100%;
  margin-top: 0.2rem;
  background: white;
  padding: 0.2rem;
  border-bottom: 1px solid #e5e5e5;
}
.details > div:nth-child(1) {
  border: 1px solid #e8e8e8;
  border-radius: 0.05rem;
}

.images {
  margin-top: 0.2rem;
  display: flex;
}
.images > p {
  /* border: 2px dashed #b6ceec; */
  width: 1.2rem;
  height: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.1rem;
  position: relative;
}
/* .images > p > img {
  width: 0.6rem;
  height: 0.6rem;
} */
.images > ul {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
}
.images > ul > li {
  width: 1.2rem;
  height: 1.2rem;
  margin: 0 0.1rem;
}
.images > ul > li > img {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 0.1rem;
}
.images > p > input {
  width: 100%;
  height: 0.9rem;
  opacity: 0;
  position: absolute;
  left: 0;
  top: 0;
}

.staff {
  width: 100%;
  display: flex;
  flex-flow: column;
  background: white;
  margin-top: 0.3rem;
}
.staff > p {
  width: 100%;
  height: 0.8rem;
  padding: 0 0.3rem;
  display: flex;
  align-items: center;
  border-top: 1px solid #d7d7d7;
  border-bottom: 1px solid #d7d7d7;
  color: #b0b0b0;
}
.staff > ul {
  width: 100%;
  padding: 0 0.3rem;
}
.staff > ul > li {
  height: 1.4rem;
  border-bottom: 1px solid #eff2f2;
  display: flex;
  flex-flow: column;
  justify-content: center;
  position: relative;
}
.staff > ul > li > span {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.15rem;
}
.staff > ul > li > p {
  color: #7d7d7d;
}
.staff > ul > li:last-child > i {
  position: absolute;
  width: 0.7rem;
  height: 0.7rem;
  bottom: 0.13rem;
  background: red;
  right: 0.2rem;
  border-radius: 50%;
}
.staff > ul > li:last-child > i > img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.alertText {
  width: 100%;
  position: fixed;
  height: 100vh;
  background: rgba(0, 0, 0, 0.2);
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.alertText > ul {
  width: 6.5rem;
  height: 5rem;
  background: white;
  padding: 0.2rem 0.3rem;
  border-radius: 0.2rem;
}
.alertText ul li:nth-child(1) {
  display: flex;
  flex-flow: row;
  justify-content: space-around;
  align-items: center;
  height: 0.8rem;
}
.alertText ul li:nth-child(1) > a {
  display: flex;
  justify-content: center;
  align-items: center;
}
.alertText ul li:nth-child(1) > a > i {
  width: 0.4rem;
  height: 0.4rem;
  margin-right: 0.1rem;
}
.alertText ul li:nth-child(1) > a > i > img {
  width: 100%;
  height: 100%;
}
.alertText ul li.a {
  width: 100%;
  display: flex;
  flex-flow: row;
  align-items: center;
  padding: 0.1rem 0;
}
.alertText ul li.a > span {
  border-radius: 0.05rem;
  flex: 1;
  border: 1px solid #e6e7e7;
  height: 0.7rem;
  display: flex;
  align-items: center;
}
.alertText ul li.a > p {
  width: 1.4rem;
}
.alertText ul li.a > span > input {
  border: none;
  margin-left: 0.2rem;
  height: 100%;
  width: 100%;
}
.alertText ul li:nth-child(5) {
  margin-top: 0.2rem;
  display: flex;
  justify-content: space-around;
}
.alertText ul li:nth-child(5) > button {
  font-size: 0.32rem;
  color: white;
  padding: 0.1rem 0.3rem;
  border: none;
  border-radius: 0.1rem;
}
</style>
