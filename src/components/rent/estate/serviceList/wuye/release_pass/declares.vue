<template>
  <div style="height:100vh">
     <yd-layout class="layout_my" v-if="showUser&&showAssign" >
      <yd-navbar class="header" v-title="'办理访客出入'" slot="navbar" v-show="!userAgent.isWX" :title="title" color="#fff" :bgcolor="mainColor" height=".88rem">
        <span class="spanLeft" @click="back" slot="left">
          <span>
            <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
          </span>
        </span>
        <span @click="submitForApprove" slot="right" class="edit spanRight" style="color: #fff;font-size:.28rem;">提交</span>
      </yd-navbar>
      <!-- 选择栋单元号 -->
      <!-- <div class="flex-row-nowrap bgwhite h8 pdlr2 mt2">
        <input type="text" class="flex1 border pdlr1"  @click="chooseUnit"  v-model="unit.text" placeholder="选择单元" readonly style="height:.68rem;width:40%">
      </div>
      <div class="flex-row-nowrap bgwhite h8 pdlr2">
        <input type="text" class="flex1 border pdlr1" style="height:.68rem" v-model="rentUserName" @click="chooseUser" placeholder="选择用户" readonly>
      </div> -->
      <!-- 选择审批人 -->
      <!-- <div class="flex-row-nowrap bgwhite h8 pdlr2">
        <input type="text" class="flex1 border pdlr1" style="height:.68rem" v-model="assignName" @click="chooseAssign" placeholder="选择审批人" readonly>
      </div> -->

      <div class="declares">
          <ul>
              <li v-show="!show"><p>客户姓名</p><span><input type="text" v-model="releasePassDto.releaseName"></span></li>
              <li><p>栋</p>
              <span>
                 <input type="text" class="flex1 border mr2 pdlr1" @click="chooseDong" v-model="dong.text" placeholder="选择栋" readonly>
                </span>
              </li>
              <li><p>单元</p>
              <span>
        <input type="text" class="flex1 border pdlr1"  @click="chooseUnit"  v-model="unit.text" placeholder="选择单元" readonly>

                </span>
              </li>

              <li><p>用户</p>
              <span>
                   <input type="text" class="flex1 border pdlr1" style="height:.68rem" v-model="rentUserName" @click="chooseUser" placeholder="选择用户" readonly>

                </span>
              </li>
              <li v-show="show"><p>携带人</p><span><input type="text" v-model="releasePassDto.releaseName"></span></li>
              <li><p>手机号码</p><span><input type="text" maxlength="11" v-model="releasePassDto.releaseMobile"></span></li>
              <li><p>身份证号</p><span><input type="text" maxlength="18" v-model="releasePassDto.idCard"></span></li>
              <li v-show="!show"><p>车牌号码</p><span><input maxlength="10" type="text" v-model="releasePassDto.noOrDate"></span></li>
              <li v-show="show"><p>搬离时间</p><span style="display:flex;justify-content:center;align-items:center">
                <yd-datetime type="date" v-model="datetime" slot="right"></yd-datetime></span></li>
          </ul>
          <ol>
              <li><p>物品名称</p><span>数量</span></li>
              <li v-for="( item ,index) in releasePassDto.rows" :key="index"><p>{{item.itemName}}</p><span>{{item.amount}}</span></li>
              <li><a @click="turnTo('/estate/serviceList/release_pass/add')"><i>+</i>添加</a></li>
          </ol>

          <div v-show="imgUrls.length>0" class="imgas a">
              <p>物品图片</p>
              <a><img  v-for="(item,index) in imgUrls" :key="index" :src="item" alt=""></a>
          </div>


      </div>
      <div class="details" v-show="show">
        <span>业主签字同意函</span>
        <div class="images">

        <ul v-show="imgUrl!=''">
          <li><img :src="imgUrl" alt=""></li>
        </ul>
        <p @click="addImg"><img src="../../../../../../assets/images/rent/estate/photo.png" alt="">
          <input class="file" name="file" type="file" accept="image/*" @change="update"/></p>
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
import Vue from "vue";
import fn from "@/assets/js/product";
import qs from "qs";
import { DateTime } from "vue-ydui/dist/lib.rem/datetime";
import store from "@/store";
import departMent from "../renovation/department_manager";
import departMent1 from "../complain/department_manager";
import VuePickers from "vue-pickers";
Vue.component(DateTime.name, DateTime);
export default {
  components: {
    departMent,
    departMent1,
    VuePickers
  },
  data() {
    return {
      images: [],
      mainColor: "",
      title: "",
      contentList: [],
      userId: "",
      getkey: "",
      organId: "",
      organType: "",
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
      show: false,
      releasePassDto: {
        token: "",
        userId: 0,
        type: 0,
        releaseName: "",
        releaseMobile: "",
        idCard: "",
        noOrDate: "",
        ownerPs: "",
        rows: [
          {
            amount: 0,
            images: "",
            itemName: ""
          }
        ]
      },
      imgUrls: [],
      datetime: this.$today(),
      getHearLog: {
        domain: "",
        token: "",
        name: ""
      },
      imgUrl: ""
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
        this.releasePassDto.ownerPs = this.getHearLog.name;
        this.imgUrl = this.getHearLog.domain + "/" + this.getHearLog.name;

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
    },
    turnTo(url) {
      store.releasePassDto.releaseName = this.releasePassDto.releaseName;
      store.releasePassDto.releaseMobile = this.releasePassDto.releaseMobile;
      store.releasePassDto.idCard = this.releasePassDto.idCard;
      store.releasePassDto.pData1 = this.pData1;
      store.releasePassDto.pData2 = this.pData2;
      store.releasePassDto.dong = this.dong;
      store.releasePassDto.unit = this.unit;
      store.releasePassDto.rentUserName = this.rentUserName;
      store.releasePassDto.rentUserId = this.rentUserId;
      if (this.$route.hash == "#1") {
        store.releasePassDto.noOrDate = this.releasePassDto.noOrDate;
      }
      store.releasePassDto.ownerPs = this.releasePassDto.ownerPs;
      this.$router.push(url);

    },
    back() {
      history.back();
      console.log(localStorage);
      localStorage.setItem("rows", encodeURIComponent(JSON.stringify([])));
      localStorage.setItem("imgUrls", encodeURIComponent(JSON.stringify([])));
    },

    submitForApprove() {
      if (this.$route.hash == "#1") {
        store.releasePassDto.noOrDate = "";
      }
      store.releasePassDto.releaseName = "";
      store.releasePassDto.releaseMobile = "";
      store.releasePassDto.idCard = "";
      store.releasePassDto.ownerPs = "";
      // this.releasePassDto={}
      // this.imgUrls=[]
      localStorage.setItem("rows", encodeURIComponent(JSON.stringify([])));
      localStorage.setItem("imgUrls", encodeURIComponent(JSON.stringify([])));
      if (this.$route.hash == "#1") {
        if (
          this.releasePassDto.releaseName != "" &&
          this.releasePassDto.releaseMobile != "" &&
          this.releasePassDto.idCard != "" &&
          this.releasePassDto.noOrDate != ""
        ) {
          let data = this.releasePassDto;
          data.userId = this.rentUserId;
          console.log(data);
          if(this.rentUserId == ""){
            return this.$dialog.toast({mes:"请选择租户"})
          }
          data.submitType = this.userInfo.organType == 1?1:2,

            this.$ajax1(
            `${this.subUrl.activity}/releasePass/submitForApprove`,
            data,
            res => {
              this.$dialog.toast({ mes: "申请办理成功" });
              store.releasePassDto = null;
              this.$router.go(-1);
            },
            this
          );
        } else {
          this.$dialog.toast({ mes: "内容不能为空！" });
        }
      } else if (this.$route.hash == "#2") {
        this.releasePassDto.noOrDate = this.datetime;
        if (
          this.releasePassDto.releaseName != "" &&
          this.releasePassDto.releaseMobile != "" &&
          this.releasePassDto.idCard != "" &&
          this.releasePassDto.ownerPs != "" &&
          this.datetime != ""
        ) {
          let data = this.releasePassDto;
          data.userId = this.rentUserId;
          console.log(data,'参数');
           if(this.rentUserId == ""){
            return this.$dialog.toast({mes:"请选择租户"})
          }
          data.submitType = this.userInfo.organType == 1?1:2,
          this.$ajax1(
            `${this.subUrl.activity}/releasePass/submitForApprove`,
            data,
            res => {
              this.$dialog.toast({ mes: "申请办理成功" });
              store.releasePassDto = null;
              this.$router.go(-1)
            },
            this
          );
        } else {
          this.$dialog.toast({ mes: "内容不能为空！！" });
        }
      }
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
    this.releasePassDto.userId = this.userInfo.guid;
    this.organId = this.organInfo.guid;
    this.organType = this.organInfo.organType;
    this.getkey = fn.getIng();
    this.releasePassDto.token = fn.getIng();
    this.releasePassDto.type = this.$route.hash.slice(1);
    this.releasePassDto.rows = JSON.parse(
      decodeURIComponent(localStorage.getItem("rows"))
    );
    this.imgUrls = JSON.parse(
      decodeURIComponent(localStorage.getItem("imgUrls"))
    )?JSON.parse(
      decodeURIComponent(localStorage.getItem("imgUrls"))
      ):[];
    this.getDong(this.userInfo.buildingId);
    console.log(this.imgUrls);
    if (this.$route.hash == "#1") {
      this.show = false;
      this.title = "办理访客出入";
      this.releasePassDto.noOrDate = store.releasePassDto.noOrDate;
    } else if (this.$route.hash == "#2") {
      this.show = true;
      this.title = "办理物品放行";
    }
    console.log(this.releasePassDto);
    this.releasePassDto.releaseName = store.releasePassDto.releaseName;
    this.releasePassDto.releaseMobile = store.releasePassDto.releaseMobile;
    this.releasePassDto.idCard = store.releasePassDto.idCard;
    this.releasePassDto.ownerPs = store.releasePassDto.ownerPs;
    if (store.releasePassDto.rentUserId) {
      this.pData1 = store.releasePassDto.pData1;
      this.pData2 = store.releasePassDto.pData2;
      this.dong = store.releasePassDto.dong;
      this.unit = store.releasePassDto.unit;
      this.rentUserName = store.releasePassDto.rentUserName;
      this.rentUserId = store.releasePassDto.rentUserId;
    }
  },
  beforeUpdate() {
    console.log(this.releasePassDto.ownerPs);
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

.declares {
  width: 100%;
}
.declares ul {
  width: 100%;
  padding: 0.2rem 0.4rem;
  border-bottom: 1px solid #d9d9d9;
}
.declares ul li {
  display: flex;
  flex-flow: row;
  justify-content: center;
  margin: 0.2rem 0;
}
.declares ul li > p {
  width: 1.6rem;
  display: flex;
  justify-content: center;
  height: 0.7rem;
  align-items: center;
  font-size: 0.3rem;
  color: #777;
}
.declares ul li > span {
  flex: 1;
  height: 0.7rem;
  border: 1px solid #d9d9d9;
  border-radius: 0.05rem;
  overflow: hidden;
}
.declares ul li > span > input {
  width: 100%;
  height: 100%;
  border: none;
  /* margin-left: 0.1rem; */
  background: #fff;
  padding: 0 0.1rem;
}

.declares ol {
  width: 100%;
  padding: 0.2rem 0.6rem;
  border-bottom: 1px solid #d9d9d9;
}
.declares ol li {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  margin: 0.2rem 0;
  color: #777;
  align-items: center;
}
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

.declares ol li > a {
  width: 2rem;
  display: flex;
  flex-flow: row;
  align-items: center;
  color: #0093d2;
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

.declares > div {
  width: 100%;
  padding: 0.2rem 0.6rem;
  border-top: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
  margin-top: 0.6rem;
}
.declares > div > p {
  color: #777;
}
.declares > div > i {
  display: flex;
  height: 1rem;
  width: 1rem;
  justify-content: center;
  align-items: center;
  border: 2px dashed #777;
  border-radius: 0.1rem;
  margin-top: 0.3rem;
}
.declares > div > i > img {
  width: 0.5rem;
  height: 0.5rem;
  background: red;
}

.details {
  width: 100%;
  margin-top: 0.2rem;
  display: flex;
  flex-flow: column;
  color: #999;
  padding: 0 0.5rem;
}

.images {
  margin-top: 0.2rem;
  display: flex;
}
.images > p {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.1rem;
  position: relative;
}
.images > p > img {
  width: 1.2rem;
  height: 1.2rem;
}
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
</style>
