<template>
  <yd-layout>
    <yd-navbar :title="title" slot='navbar' :bgcolor='mainColor' height='.88rem' color='#fff'>
      <span slot="left" @click='$router.go(-1)'>
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
    </yd-navbar>
    <div v-show='father'>
      <div class="chooseTimer">
        <div class="item">
          <div class="label">客户名称：</div>
          <div class="input_content icon" @click="chooseDong">
            <input type="text" placeholder="栋" readonly v-model="dong.text">
          </div>
          <div class="input_content icon" @click="chooseUnit">
            <input type="text" placeholder="单元号" readonly v-model="unit.text">
          </div>
        </div>
        <!-- 选择时间 -->
        <div class="item">
          <div class="label">费用时间：</div>
          <div class="input_content">
            <yd-icon name='rili' style="margin-top:.05rem;margin-left:.2rem" custom color='#999' size='.45rem'></yd-icon>
            <yd-datetime type="date" style="flex:1;width:auto;text-align:left" v-model="submitData.startTime"></yd-datetime>
          </div>
          <div class="input_content">
            <yd-icon name='rili' style="margin-top:.05rem;margin-left:.2rem" color='#999' custom size='.45rem'></yd-icon>
            <yd-datetime type="date" style="flex:1;width:auto;text-align:left" v-model="submitData.endTime"></yd-datetime>
          </div>
        </div>
      </div>
      <!-- 项目单 -->
      <div class="tableBox">
        <div class="table">
          <!-- 标题 -->
          <div class="table_title" v-show='submitData.payProject.length > 0'>
            <span>项目名称</span>
            <span>用量计量</span>
            <span>计费单价</span>
            <span>本月费用</span>
            <span>往月欠缴</span>
            <span>滞纳金</span>
            <span>应交合计</span>
            <span>备注</span>
          </div>
          <div class="table_content">
            <div class="colomn" v-for='item in submitData.payProject'>
              <span>{{item.projectName}}</span>
              <span>{{item.consumption}}</span>
              <span>{{item.chargeStandard}}</span>
              <span>{{item.thisMonthMoney}}</span>
              <span>{{item.lastMonthMoney}}</span>
              <span>{{item.lateFee}}</span>
              <span>{{item.totalMoney}}</span>
              <span>{{item.remarks}}</span>
            </div>
          </div>
        </div>
        <div class="flex-row flex-start pd3" @click='showEdit' :style="{color:mainColor}">
          <div class="icon mr1" :style="{background:mainColor}">+</div>
          <span>新增</span>
        </div>
      </div>
      <!-- 备注 -->
      <div class="remarks mt2">
        <div class="pd3 flex-row">备注</div>
        <yd-textarea slot="right" class="pd3 bgwhite" style="height:2rem;line-height:.5rem;" placeholder="请输入备注" v-model='submitData.explain'
          maxlength="100"></yd-textarea>
      </div>
      <!-- 添加图片 -->
      <div style="width: 100%;background:#fff ">
        <div class="show-send-pic">
          <div class="logo-img-div">
            <img src="../../../../../../assets/images/rent/estate/photo.png" alt="" class="fileImg add-logo-img">
            <input class="file hid-input" name="file[]" type="file" accept="image/*" @change="update" multiple="multiple">
          </div>
          <div class="logo-img-div" v-for="(item,index ) in uploadPreviewList" v-bind:key="index">
            <img :src="item" alt="" class="fileImg">
            <a @click="delThisPic(index)">
              <yd-icon name="delete" custom color='#000' size='.6rem'></yd-icon>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="bgwhite jiaofei" v-show='!father && $route.params.id == 1'>
      <div class="flex-row h7">
        <span class="label">项目名称</span>
        <input class="myInput flex1" v-model="obj.projectName" type="text">
      </div>
      <div class="flex-row h7">
        <span class="label">计费用量</span>
        <input class="myInput flex1" type='number' v-model="obj.consumption">
      </div>
      <div class="flex-row h7">
        <span class="label">计费单价</span>
        <input class="myInput flex1" type='number' v-model="obj.chargeStandard">
      </div>
      <div class="flex-row h7">
        <span class="label">本月费用</span>
        <input class="myInput flex1" type='number' v-model="obj.thisMonthMoney">
      </div>
      <div class="flex-row h7">
        <span class="label">往月欠交</span>
        <input class="myInput flex1" type='number' v-model="obj.lastMonthMoney">
      </div>
      <div class="flex-row h7">
        <span class="label">滞纳金</span>
        <input class="myInput flex1" type='number' v-model="obj.lateFee">
      </div>
      <div class="flex-row h7">
        <span class="label">应交合计</span>
        <input class="myInput flex1" v-model="obj.totalMoney" type="text">
      </div>
      <div class="flex-row h7">
        <span class="label">备注</span>
        <input class="myInput flex1" v-model="obj.remarks" type="text">
      </div>
      <div class="flex-row flex-start h7" size='large'>
        <!-- <yd-button>保存</yd-button> -->
        <div class="label"></div>
        <yd-button class="h7 mr3" type="hollow" @click.native='cancel'>取消</yd-button>
        <yd-button class="h7" type="hollow" @click.native='savePay'>保存</yd-button>
      </div>
    </div>
    <div class="bgwhite jiaofei" v-show='!father && $route.params.id == 2'>
      <div class="flex-row h7">
        <span class="label">项目名称</span>
        <input class="myInput flex1" v-model="obj.projectName" type="text">
      </div>
      <div class="flex-row h7">
        <span class="label">计费标准</span>
        <input class="myInput flex1" type='number' v-model="obj.chargeStandard">
      </div>
      <div class="flex-row h7">
        <span class="label">小计</span>
        <input class="myInput flex1" v-model="obj.totalMoney" type="text">
      </div>
      <div class="flex-row h7">
        <span class="label">备注</span>
        <input class="myInput flex1" v-model="obj.remarks" type="text">
      </div>
      <div class="flex-row flex-start h7" size='large'>
        <!-- <yd-button>保存</yd-button> -->
        <div class="label"></div>
        <yd-button class="h7 mr3" type="hollow" @click.native='cancel'>取消</yd-button>
        <yd-button class="h7" type="hollow" @click.native='savePay'>保存</yd-button>
      </div>
    </div>
    <div class="buttons" v-show='father' slot='bottom'>
      <yd-button type='hollow' class="button" @click.native='submit' style="margin:0; height:.8rem;line-height:.8rem;font-size:.32rem">提交</yd-button>
    </div>
    <vue-pickers v-show="show1" slot="bottom" class="slideBox" :selectData="pickData1" v-on:cancel="close" v-on:confirm="confirmFn"></vue-pickers>
    <vue-pickers v-show="show2" slot="bottom" class="slideBox" :selectData="pickData2" v-on:cancel="close" v-on:confirm="confirmFn1"></vue-pickers>
  </yd-layout>
</template>
<script>
import VuePickers from "vue-pickers";
import qs from "qs";
export default {
  data() {
    console.log(this.$route.params);
    if (this.$route.params.id == 1) {
      this.title = "物业管理费";
    } else {
      this.title = "专项管理费";
    }
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    console.log(this.userInfo, "userInfo");
    this.mainColor = this.$color[this.userInfo.organType];
    console.log(this.mainColor);
    return {
      father: true,
      list: [],
      remarks: "",
      submitData: {
        acceptOrgId: this.organInfo.guid,
        buildingId: this.userInfo.buildingId,
        buildingRidId: "",
        roomNumber: "",
        startTime: this.$addDay(this.$today(), -30),
        endTime: this.$today(),
        type: this.$route.params.id,
        explain: "",
        payProject: [],
        accessorys: []
      },
      uploadFileList: [],
      uploadPreviewList: [],
      selectList: [],
      imageKeyList: [],
      imageUrlList: [],
      imgIndex: 0,
      getData: "",
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
      obj: {
        chargeStandard: "",
        chargeUnit: "",
        consumption: "",
        projectName: "",
        thisMonthMoney: "",
        lastMonthMoney: "",
        lateFee: "",
        remarks: "",
        totalMoney: ""
      },
      show1: false,
      show2: false,
      dong: {},
      unit: {}
    };
  },
  components: {
    VuePickers
  },
  methods: {
    resetRequest(a) {
      this.isRequset = true;
      // 防止网络中断后不可发起请求
      setTimeout(() => {
        this.isRequset = false;
      }, 3000);
      if (a) {
        this.isRequset = false;
      }
    },
    // 重置图片
    resetImg() {
      this.uploadFileList = [];
      this.uploadPreviewList = [];
      this.selectList = [];
      this.imageKeyList = [];
      this.imageUrlList = [];
    },
    submit() {
      // 防止重复点击；
      if (this.isRequset) {
        return;
      }
      this.resetRequest();
      console.log(this.submitData);
      this.imgIndex = 0;
      var data = JSON.parse(JSON.stringify(this.submitData));
      data.startTime = data.startTime + " 00:00:00";
      data.endTime = data.endTime + " 23:59:59";
      data.token = this.$getkey();
      if (data.buildingRidId == "") {
        return this.$dialog.toast({ mes: "请选择栋", timeout: 1000 });
      } else if (data.roomNumber == "") {
        return this.$dialog.toast({ mes: "请选择单元id", timeout: 1000 });
      } else if (data.payProject.length == 0) {
        return this.$dialog.toast({ mes: "请填写至少新增一个项目", timeout: 1000 });
      } else if (data.explain == "") {
        return this.$dialog.toast({ mes: "请输入项目说明", timeout: 1000 });
      } else {
        this.$dialog.loading.open("提交中");
        setTimeout(() => {
          this.$dialog.loading.close();
        }, 10000);
        console.log("图片", this.uploadFileList);
        if (this.uploadFileList.length == 0) {
          this.generate(data);
        } else {
          this.uploadImg(length, res => {
            console.log(this.imageKeyList);
            data.accessorys = this.imageKeyList;
            this.resetImg();
            // 此时设置可以点击
            this.resetRequest(1);
            console.log(data);
            // 请求生成缴费单
            this.generate(data);
          });
        }
      }
      console.log(data);
    },
    // 保存
    generate(data, cb) {
      this.$ajax1(
        `${this.subUrl.activity}/pay/addPay`,
        data,
        res => {
          this.$dialog.toast({
            mes: "生成缴费单成功",
            timeout: 1500,
            icon: "success"
          });
          this.$router.go(-1);
          cb && cb(res);
        },
        this
      );
    },
    savePay() {
      var obj = this.obj;
      this.obj.chargeUnit = this.obj.chargeStandard;
      if (this.$route.params.id == 1) {
        if (obj.projectName == "") {
          return this.$dialog.toast({ mes: "请输入项目名称", timeout: 1000 });
        } else if (obj.consumption == "") {
          return this.$dialog.toast({ mes: "请输入计费用量", timeout: 1000 });
        } else if (obj.chargeStandard == "") {
          return this.$dialog.toast({ mes: "请输入计费单价", timeout: 1000 });
        } else if (obj.thisMonthMoney == "") {
          return this.$dialog.toast({ mes: "请输入本月费用", timeout: 1000 });
        } else if (obj.lastMonthMoney == "") {
          return this.$dialog.toast({ mes: "请输入往月欠交", timeout: 1000 });
        } else if (obj.lastMonthMoney == "") {
          return this.$dialog.toast({ mes: "请输入滞纳金", timeout: 1000 });
        } else if (obj.totalMoney == "") {
          return this.$dialog.toast({ mes: "请输入应交合计", timeout: 1000 });
        }
      } else {
        console.log(obj);
        if (obj.projectName == "") {
          return this.$dialog.toast({ mes: "请输入项目名称", timeout: 1000 });
        } else if (obj.chargeStandard == "") {
          return this.$dialog.toast({ mes: "请输入计费标准", timeout: 1000 });
        } else if (obj.totalMoney == "") {
          return this.$dialog.toast({ mes: "请输入计费小计", timeout: 1000 });
        }
      }
      obj.chargeStandard = obj.chargeStandard * 1;
      obj.chargeUnit = obj.chargeUnit * 1;
      obj.consumption = obj.consumption * 1;
      obj.thisMonthMoney = obj.thisMonthMoney * 1;
      obj.lastMonthMoney = obj.lastMonthMoney * 1;
      obj.lateFee = obj.lateFee * 1;
      obj.totalMoney = obj.totalMoney * 1;
      this.submitData.payProject.push(obj);
      this.obj = {
        chargeStandard: "",
        chargeUnit: "",
        consumption: "",
        projectName: "",
        thisMonthMoney: "",
        lastMonthMoney: "",
        lateFee: "",
        remarks: "",
        totalMoney: ""
      };
      this.father = true;
      console.log(this.submitData);
    },
    //取消
    cancel() {
      this.father = true;
    },

    getDong(id) {
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
    
    close: function() {
      this.show1 = false;
      this.show2 = false;
    },
    showEdit() {
      this.father = false;
    },
    chooseDong() {
      if (this.pickData1.pData1.length == 0) {
        return this.$dialog.toast({ mes: "数据为空", timeout: 1000 });
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
    confirmFn(e) {
      this.dong = e.select1;
      console.log(JSON.stringify(e.select1));
      this.show1 = false;
      this.submitData.buildingRidId = e.select1.guid;
      this.getUnit(this.dong.guid);
    },
    confirmFn1(e) {
      JSON.stringify(e.select1);
      this.unit = e.select1;
      console.log(e.select1);
      this.submitData.roomNumber = e.select1.guid;
      this.submitData.acceptOrgId = e.select1.organId;
      this.show2 = false;
    },
    // 删除帖子
    delThisPic(index) {
      this.uploadPreviewList.splice(index, 1);
      this.uploadFileList.splice(index, 1);
    },
    // 生成预览图片
    setImgPreview() {
      this.uploadPreviewList = [];
      for (var i = 0; i < this.uploadFileList.length; i++) {
        this.uploadPreviewList.push(this.$getImgUrl(this.uploadFileList[i]));
      }
      console.log(this.uploadPreviewList);
    },
    update(e) {
      console.log(this.uploadFileList);

      this.imageUrl = this.getData.imageUrl;
      for (var i = 0; i < e.target.files.length; i++) {
        let file = e.target.files[i];
        this.uploadFileList.push(file);
      }
      this.setImgPreview();
      return;
      //先从自己的服务端拿到token
    },
    uploadImg(length, cb) {
      console.log(length);
      let d = new Date();
      this.token = this.getLogoMsg.token;
      this.imageUrl = this.getLogoMsg.domain;
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
          ".png",
        bucket: this.imageUrl //七牛的地址，这个是你自己配置的（变量）
      };
      let param = new FormData(); //创建form对象
      param.append("chunk", "0"); //断点传输
      param.append("chunks", "1");
      console.log(this.imgIndex);
      var file = this.uploadFileList[this.imgIndex];
      console.log(this.uploadFileList);
      console.log(file, this.imgIndex);
      param.append(`file`, file, file.name);
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      param.append("token", this.token);
      this.uploading(param, config, file.name, res => {
        this.imgIndex = parseInt(this.imgIndex) + 1;
        if (this.imgIndex < this.imgLength) {
          this.uploadImg(length, function() {
            cb && cb();
          });
        } else {
          cb && cb();
        }
      }); //然后将参数上传七牛
    },
    getQiniuMsg() {
      var data = {
        organId: this.organInfo.guid,
        token: this.$getkey(),
        pageNo: 1,
        pageSeze: 15
      };
      this.xhr
        .post(`${this.subUrl.user}/qiniu/getInfo?token=` + data.token)
        .then(res => {
          if (res.data.code == 1) {
            console.log(res.data.getLogoMsg);
            this.getLogoMsg = res.data.data;
          } else if (res.data.code == "-902") {
            // fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        });
    },
    uploading(param, config, pathName, cb) {
      this.xhr.post("http://up-z2.qiniu.com", param, config).then(response => {
        this.organLogo = response.data.key;
        this.imageKeyList.push(this.organLogo);
        this.imageUrlList.push(this.imageUrl + "/" + response.data.key);
        this.showLogo = true;
        cb && cb(response.data);
      });
    }
  },
  mounted() {
    this.getDong(this.userInfo.buildingId);
    this.getQiniuMsg();
  }
};
import "@/assets/css/wuye.css";
</script>
<style scoped>
.icon {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  text-align: center;
  line-height: 0.4rem;
  color: #fff;
}

.buttons {
  display: flex;
  height: 0.8rem;
  justify-content: space-between;
  border-top: 1px solid #ddd;
}

.show-send-pic {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  padding-bottom: 2em;
  padding: 0 0.2rem;
}

.logo-img-div {
  width: 23%;
  margin: 1%;
  /* border: 1px solid #e6e6e6; */
  min-height: 6em;
  padding: 0.5em;
  margin-top: 0.5em;
  border-radius: 6px;
  position: relative;
  background: #fff;
  display: inline-block;
}

.logo-img-div img {
  width: 100%;
  height: 100%;
  margin: 0;
}

.logo-img-div a {
  display: block;
  position: absolute;
  right: -0.1rem;
  top: -0.1rem;
}

.hid-input {
  opacity: 0;
  position: absolute;
  width: 5em;
  height: 5em;
}

.add-logo-img {
  width: 1.5rem !important;
  height: 1.5rem !important;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.buttons .button {
  flex: 1;
  border: none;
}

.tableBox {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  white-space: nowrap;
  margin-top: 0.4rem;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  background: #fff;
  min-height: 3rem;
}

.table {
  width: 12.6rem;
  text-align: center;
}

.table_title {
  height: 0.8rem;
  display: flex;
  align-items: center;
}

.colomn {
  height: 0.6rem;
  display: flex;
  align-items: center;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  margin-top: -1px;
}

.table_title span {
  display: block;
  width: 1.8rem;
}

.table_content span {
  display: block;
  width: 1.8rem;
  max-width: 1.8rem;
  text-overflow: ellipsis;
  overflow: hidden;
}

.chooseTimer {
  background: #fff;
  border-bottom: 1px solid #ddd;
}

.item {
  display: flex;
  height: 1rem;
  flex-flow: row nowrap;
  overflow: hidden;
  align-items: center;
  border-top: 1px solid #ddd;
  margin-top: -1px;
  padding: 0 0.24rem;
}

.item .input_content {
  height: 0.64rem;
  flex: 1;
  box-sizing: border-box;
  border: 1px solid #ddd;
  margin-right: 0.16rem;
  border-radius: 0.15rem;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-start;
}

.item .input_content input {
  height: 100%;
  width: 100%;
  border: none;
  text-align: center;
  outline: none;
  color: #666;
  padding: 0 0.2rem;
}

.item .input_content.code {
  margin-right: 0.1rem;
}

.item .input_content.icon {
  background: url("../../../../../../assets/images/register/right.png")
    no-repeat calc(100% - 0.2rem) center;
  background-size: 0.12rem;
  padding-right: 0.2rem;
}
</style>