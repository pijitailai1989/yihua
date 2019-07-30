<template>
  <yd-layout class="template">
    <yd-navbar v-show="!rentShow&&!userAgent.isWX && !show_job" slot="navbar" height=".88rem" v-title="'物业公司注册'"
               title="物业公司注册" bgcolor="#0093d2" color="#fff">
      <div class="addClickArea" @click="$router.go(-1)" slot="left">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </div>
    </yd-navbar>
    <div v-show="!rentShow && !show_job">
      <div class="content" ref="register">
        <div>
          <div class="list">
            <div class="item">
              <div class="label">公司名称:</div>
              <div class="input_content">
                <input type="text" placeholder="请输入公司名" v-model="registerData.companyName" maxlength="20">
              </div>
            </div>
            <div class="item">
              <div class="label">所在位置:</div>
              <div class="input_content icon" @click="chooseLocation()">
                <input type="text" readonly v-model="registerData.address" placeholder="请选择位置">
              </div>
            </div>
            <div class="item">
              <div class="label">详细地址:</div>
              <div class="input_content">
                <input type="text" placeholder="街道" v-model="registerData.det_address">
              </div>
            </div>
            <div class="item">
              <div class="label">所属行业:</div>
              <div class="input_content icon" @click="chooseJob()">
                <input type="text" readonly v-model="registerData.hangyeName" placeholder="请选择所属行业">
              </div>
            </div>
            <!--选择省-->
            <div class="item">
              <div class="label">选择省:</div>
              <div class="input_content icon" @click="chooseProvince()">
                <input type="text" readonly v-model="provice.text" placeholder="请选择省">
              </div>
            </div>
            <!--选择市-->
            <div class="item">
              <div class="label">选择市:</div>
              <div class="input_content icon" @click="chooseCity()">
                <input type="text" readonly v-model="mCity.text" placeholder="请选择市">
              </div>
            </div>
            <!--选择区/县-->
            <div class="item">
              <div class="label">选择区/县:</div>
              <div class="input_content icon" @click="chooseDistrict()">
                <input type="text" readonly v-model="district.text" placeholder="请选择区/县">
              </div>
            </div>
            <!--选择片区-->
            <div class="item">
              <div class="label">选择片区:</div>
              <div class="input_content icon" @click="choosePianqu()">
                <input type="text" readonly v-model="pianqu.text" placeholder="请选择片区">
              </div>
            </div>

            <img class="left_icon ding" src="../../assets/images/register/dingding.png" width="8">
            <img class="right_icon ding" src="../../assets/images/register/dingding.png" width="8">
          </div>
          <!--用户信息-->
          <div class="list">
            <div class="tips" v-show="isShowTip">{{tips}}</div>
            <div class="item">
              <div class="label">用户名:</div>
              <div class="input_content">
                <input type="text" placeholder="请输入用户名" v-model="registerData.userName" maxlength="20">
              </div>
            </div>
            <div class="item">
              <div class="label">手机号码:</div>
              <div class="input_content">
                <input type="text" placeholder="请输入手机号" maxlength="11" v-model="registerData.phone">
              </div>
            </div>
            <div class="item get_code">
              <div class="label">验证码:</div>
              <div class="input_content code">
                <input type="text" maxlength="6" placeholder="验证码" v-model="registerData.code">
              </div>
              <yd-sendcode slot="right" v-model="start1" init-str="获取验证码" @click.native="sendCode1" class="get-code"
                           type="primary"></yd-sendcode>
            </div>
            <div class="item">
              <div class="label">设置密码:</div>
              <div class="input_content code">
                <input :type="inputType?'text':'password'" v-model="registerData.password" placeholder="6-12数字+字母组合"
                       maxlength="12">
              </div>
              <div class="eyes get-code" @click="openEyes">
                <img v-if="inputType" src="../../assets/images/register/openeye.png" alt="">
                <img v-else="inputType" src="../../assets/images/register/closeeye.png" alt="">
              </div>
            </div>
          </div>
          <div class="button_register">
            <yd-button size="large" type="primary" @click.native="register">同意协议并注册</yd-button>
          </div>
        </div>
      </div>
    </div>
    <choose v-if="rentShow" @chooseSuccess="chooseSuccess" @cancel="cancel" :url="url"></choose>
    <job v-if="show_job" @chooseSuccess="chooseSuccess1" @cancel="cancel" :url="url"></job>
    <vue-pickers v-show="show_1" slot="bottom" class="slideBox" :selectData="pickData1" v-on:cancel="mClose"
                 v-on:confirm="confirmFn1"></vue-pickers>
    <vue-pickers v-show="show_2" slot="bottom" class="slideBox" :selectData="pickData2" v-on:cancel="mClose"
                 v-on:confirm="confirmFn2"></vue-pickers>
    <vue-pickers v-show="show_3" slot="bottom" class="slideBox" :selectData="pickData3" v-on:cancel="mClose"
                 v-on:confirm="confirmFn3"></vue-pickers>
    <vue-pickers v-show="show_4" slot="bottom" class="slideBox" :selectData="pickData4" v-on:cancel="mClose"
                 v-on:confirm="confirmFn4"></vue-pickers>
  </yd-layout>
</template>
<script>
  import Vue from "vue";
  import qs from "qs";
  import choose from "./map.vue";
  import job from "./hangye.vue";
  import VuePickers from "vue-pickers";

  export default {
    name: "",
    data() {
      return {
        url: "/register/rent",
        tips: "",
        show_job: false,
        rentShow: false,
        isShowTip: "false",
        regPass: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
        regPhone: /^1[3578]\d{9}$/,
        show1: false,
        registerData: {
          companyName: "",
          address: "",
          det_address: "",
          userName: "",
          phone: "",
          code: "",
          password: "",
          hangyeName: ""
        },
        rentShow1: false,
        provice: {},
        mCity: {},
        district: {},
        pianqu: {},
        pickData1: {
          columns: 1, // picker的列数
          // 第一列的数据结构
          pData1: []
        },
        pickData2: {
          columns: 1, // picker的列数
          // 第一列的数据结构
          pData1: []
        },
        pickData3: {
          columns: 1, // picker的列数
          // 第一列的数据结构
          pData1: []
        },
        pickData4: {
          columns: 1, // picker的列数
          // 第一列的数据结构
          pData1: []
        },
        inputType: false,
        start1: false,
        show_1:false,
        show_2:false,
        show_3:false,
        show_4:false,
      };
    },
    components: {
      choose,
      VuePickers,
      job
    },
    methods: {
      getCity(data, cb) {
        this.$ajax(`${this.subUrl.user}/comm/getDistrictList`, data, res => {
          console.log(res.data);
          var arr = [];
          for(var i of res.data){
            i.text = i.dictDataName;
            i.value = i.guid;
          }
          cb&&cb(res.data)

        }, this);
      },
      chooseProvince() {
        if (this.pickData1.pData1.length == 0) {
          return this.$dialog.toast({mes: "暂无数据"});
        }
        this.show_1 = true;
      },
      chooseCity() {
        if (this.pickData2.pData1.length == 0) {
          return this.$dialog.toast({mes: "请选择省"});
        }
        this.show_2 = true;
      },
      chooseDistrict() {
        if (this.pickData3.pData1.length == 0) {
          return this.$dialog.toast({mes: "请选择市"});
        }
        this.show_3 = true;
      },
      choosePianqu() {
        if (this.pickData4.pData1.length == 0) {
          return this.$dialog.toast({mes: "请选择区县"});
        }
        this.show_4 = true;
      },
      confirmFn1(e){
        this.provice = e.select1;
        this.show_1 = false;
        this.pickData2.pData1 = [];
        this.pickData3.pData1 = [];
        this.pickData4.pData1 = [];
        this.getCity({id:e.select1.value},res=>{
          this.pickData2.pData1 = res;
        })
      },
      confirmFn2(e){
        this.mCity = e.select1;
        this.show_2 = false;
        this.pickData3.pData1 = [];
        this.pickData4.pData1 = [];
        this.getCity({id:e.select1.value},res=>{
          this.pickData3.pData1 = res;
        })
      },
      confirmFn3(e){
        this.district = e.select1;
        this.show_3 = false;
        this.pickData4.pData1 = [];
        this.getCity({id:e.select1.value},res=>{
          this.pickData4.pData1 = res;
        })
      },
      confirmFn4(e){
        this.pianqu = e.select1;
        this.show_4 = false;
      },
      mClose(){
        this.show_1 = false;
        this.show_2 = false;
        this.show_3 = false;
        this.show_4 = false;
      },
      /*选择行业*/
      chooseJob() {
        this.rentShow1 = true;
        this.show_job = true;
      },
      sendCode1() {
        var that = this;
        if (
          this.registerData.phone == "" ||
          typeof this.registerData.phone == "undefined"
        ) {
          this.$dialog.alert({mes: "手机号不能为空"});
          return;
        } else if (!this.regPhone.test(this.registerData.phone)) {
          this.$dialog.alert({mes: "手机号格式错误"});
          return;
        }
        that.$dialog.loading.open("发送中...");
        setTimeout(() => {
          that.$dialog.loading.close();
        }, 3000);
        that.xhr
          .post(
            this.subUrl.user + "/user/getVerificationCode",
            qs.stringify({mobile: that.registerData.phone})
          )
          .then(function (res) {
            console.log(res.data);
            if (res.data.code == 1) {
              that.$dialog.loading.close();
              that.start1 = true;
              that.$dialog.toast({
                mes: "已发送",
                icon: "success",
                timeout: 1500
              });
            } else {
              that.$dialog.toast({mes: res.data.msg});
            }
          });
      },
      chooseLocation() {
        this.show1 = false;
        this.rentShow = true;
      },
      openEyes() {
        console.log(this.inputType);
        if (this.inputType) {
          this.inputType = false;
        } else {
          this.inputType = true;
        }
      },
      verify(phone, data) {
        console.log(phone, data);
        this.xhr
          .post(
            `${this.subUrl.user}/user/accountVerify`,
            qs.stringify({account: phone})
          )
          .then(res => {
            console.log(res);
            if (res.data.code == "-903") {
              this.xhr
                .post(`${this.subUrl.user}/user/register`, qs.stringify(data))
                .then(res1 => {
                  console.log(res1);
                  if (res1.data.code == 1) {
                    console.log(res1.data);
                    location.href = "#/register_success/4";
                  }
                  this.$dialog.alert({mes: res1.data.msg});
                });
            } else if (res.data.code == 1 || res.data.code == -1) {
              this.$dialog.alert({mes: "账号已注册"});
            }
          });
      },
      //注册
      register() {
        if (this.registerData.companyName == "") {
          return this.$dialog.alert({mes: "请输入公司名"});
        } else if (this.registerData.address == "") {
          return this.$dialog.alert({mes: "请选择地址"});
        } else if (this.registerData.det_address == "") {
          return this.$dialog.alert({mes: "请输入详细地址"});
        } else if (this.registerData.hangyeName == "") {
          return this.$dialog.alert({
            mes: "请选择行业"
          });
        }else if(!this.pianqu.value){
          return this.$dialog.alert({
            mes: "请选择片区"
          });
        } else if (this.registerData.userName == "") {
          return this.$dialog.alert({mes: "请输入用户名"});
        } else if (this.registerData.phone == "") {
          return this.$dialog.alert({mes: "手机号"});
        } else if (!this.regPhone.test(this.registerData.phone)) {
          return this.$dialog.alert({mes: "请输入正确的手机号"});
        } else if (this.registerData.password == "") {
          return this.$dialog.alert({mes: "请输入密码"});
        } else if (!this.regPass.test(this.registerData.password)) {
          return this.$dialog.alert({mes: "密码格式不正确"});
        }

        var data = {
          organName: this.registerData.companyName,
          address: this.registerData.address,
          lng: this.registerData.location.lng,
          lat: this.registerData.location.lat,
          type: 4,
          industryType: this.registerData.hangye.join(","),
          district:`${this.provice.guid},${this.mCity.guid},${this.district.guid},${this.pianqu.guid}`,
          userName: this.registerData.userName,
          mobile: this.registerData.phone,
          verificationCode: this.registerData.code,
          password: this.registerData.password,
        };
        console.log(data);
        this.registerData.isManager = true;
        this.verify(this.registerData.phone, data);
      },
      /*获取楼宇信息*/
      getLouyu() {
        this.xhr.post(`${this.subUrl.user}/comm/officeBuildingList`).then(res => {
          if (res.data.code == 1) {
            var arr = [];
            let l = res.data.data.length;
            for (let i = 0; i < l; i++) {
              let obj = res.data.data[i];
              obj.text = obj.buildingName;
              obj.value = obj.buildingAddress;
              arr.push(obj);
            }
            this.pickData1.pData1 = arr;
            /*返回错误信息*/
          } else {
          }
        });
      },
      //子组件选择行业成功
      chooseSuccess(e) {
        this.rentShow = false;
        this.requireObj = e;
        console.log(e, "地图信息");
        this.registerData.address = e.address;
        this.registerData.location = e.location;
      },
      //选择行业类型
      chooseSuccess1(e) {
        this.rentShow1 = false;
        this.show_job = false;
        console.log(e, "行业类型");
        this.requireObj = e;
        if (e.free) {
          this.registerData.hangyeName = e.require.name + " " + e.free.name;
          this.registerData.hangye = [e.require.guid, e.free.guid];
        } else {
          this.registerData.hangyeName = e.require.name;
          this.registerData.hangye = [e.require.guid];
        }
      },

      //选择楼宇取消
      cancel() {
        this.rentShow = false;
        this.show_job = false;
      },
      //子组件行业关闭
      close(e) {
        this.show1 = false;
      },
      //确定选择行业
      confirmFn(e) {
        this.show1 = false;
        this.registerData.louyuName = e.select1.text;
        this.registerData.buildingId = e.select1.guid;
      }
    },
    mounted() {
      this.getLouyu();
      this.getCity({id: 0},res=>{
        this.pickData1.pData1 = res;
      });
    }
  };
</script>
<style scoped>
  .button_register {
    margin-top: 0.8rem;
    padding: 0 0.3rem 1rem;
  }

  .list {
    padding-top: 0.25rem;
    margin: 0.25rem 0.3rem;
    border-radius: 0.2rem;
    background: #fff;
    padding-bottom: 0.32rem;
    border: 1px solid #ddd;
    z-index: 10;
    overflow: visible;
  }

  .list:nth-child(1) {
    position: relative;
  }

  .list:nth-child(2) {
    padding-top: 0.5rem;
  }

  .content {
    position: absolute;
    top: 0rem;
    bottom: 0;
  }

  .list .ding {
    position: absolute;
    bottom: -0.7rem;
    z-index: 20;
  }

  .list .ding.left_icon {
    left: 0.22rem;
  }

  .list .ding.right_icon {
    right: 0.22rem;
  }

  .list .item {
    display: flex;
    margin-bottom: 0.36rem;
    height: 0.64rem;
    flex-flow: row nowrap;
    overflow: hidden;
    align-items: center;
    margin-bottom: 0.36rem;
  }

  .eyes img {
    width: 0.4rem;
    background: #fff;
  }

  .list .item .label {
    color: #999;
    width: 1.6rem;
    text-align: right;
    line-height: 0.64rem;
    padding-right: 0.1rem;
  }

  .list .item .input_content {
    height: 100%;
    flex: 1;
    box-sizing: border-box;
    border: 1px solid #ddd;
    margin-right: 0.46rem;
    border-radius: 0.15rem;
  }

  .list .item .input_content.code {
    margin-right: 0.1rem;
  }

  .list .item .get-code {
    margin-right: 0.5rem;
  }

  .list .item .input_content.icon {
    background: url("../../assets/images/register/right.png") no-repeat calc(100% - 0.2rem) center;
    background-size: 0.12rem;
    padding-right: 0.2rem;
  }

  .list .item .input_content input {
    height: 100%;
    width: 100%;
    border: none;
    outline: none;
    color: #666;
    padding: 0 0.2rem;
  }

  .list .eyes .input_content.code {
    display: flex;
  }
</style>
