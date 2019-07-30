<template>
  <yd-layout class="layout">
    <yd-navbar v-show="!rentShow&&!userAgent.isWX" slot="navbar" height=".88rem" v-title="'租户注册'" title="租户注册" bgcolor="#0093d2" color="#fff">
      <span @click='$router.go(-1)' slot="left">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
    </yd-navbar>
    <div v-show="!rentShow" id="register">
      <div class="content" ref="register">
        <div>
          <div class="list">
            <div class="item">
              <div class="label">租户名称:</div>
              <div class="input_content">
                <input type="text" placeholder="请输入租户名"
                       v-model="registerData.rentName" maxlength="20">
              </div>
            </div>
            <div class="item">
              <div class="label">楼宇名称:</div>
              <div class="input_content icon" @click="chooseRentName()">
                <input type="text" placeholder="请选择楼宇" readonly v-model="registerData.louyuName">
              </div>
            </div>
            <div class="item">
              <div class="label"></div>
              <div class="input_content icon" @click="chooseDong()">
                <input type="text" placeholder="栋" readonly v-model="registerData.dong">
              </div>
              <div class="input_content icon" @click="chooseUnit()">
                <input type="text" placeholder="单元号" readonly v-model="registerData.unit">
              </div>
            </div>
            <div class="item">
              <div class="label">所属行业:</div>
              <div class="input_content icon" @click="chooseJob()">
                <input type="text" readonly v-model="registerData.hangyeName" placeholder="请选择所属行业">
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
                <input type="text" placeholder="请输入用户名"
                       v-model="registerData.userName" maxlength="20">
              </div>
            </div>
            <div class="item">
              <div class="label">手机号码:</div>
              <div class="input_content">
                <input type="text" placeholder="请输入手机号" maxlength="11"
                       v-model="registerData.phone">
              </div>
            </div>
            <div class="item get_code">
              <div class="label">验证码:</div>
              <div class="input_content code">
                <input type="text" maxlength="6" placeholder="验证码"
                       v-model="registerData.code">
              </div>
              <yd-sendcode slot="right" v-model="start1" init-str="获取验证码" @click.native="sendCode1" class="get-code"
                           type="primary"></yd-sendcode>
            </div>
            <div class="item">
              <div class="label">设置密码:</div>
              <div class="input_content code">
                <input :type="inputType?'text':'password'"
                       v-model="registerData.password" placeholder="6-12数字+字母组合" maxlength="12">
              </div>
              <div class="eyes get-code" @click.stop.prevent="openEyes()">
                <img v-if="inputType" src="../../assets/images/register/openeye.png" alt="">
                <img v-else src="../../assets/images/register/closeeye.png" alt="">
              </div>
            </div>
          </div>
          <div class="button_register">
            <yd-button size="large" type="primary" @click.native="register">同意协议并注册</yd-button>
          </div>
        </div>
      </div>
    </div>
    <vue-pickers v-show="show1" slot="bottom" class="slideBox" :selectData="pickData1" v-on:cancel="close" v-on:confirm="confirmFn"></vue-pickers>
    <vue-pickers v-show="show2" slot="bottom" class="slideBox" :selectData="pickData2" v-on:cancel="close1" v-on:confirm="confirmFn1"></vue-pickers>
    <vue-pickers v-show="show3" slot="bottom" class="slideBox" :selectData="pickData3" v-on:cancel="close2" v-on:confirm="confirmFn2"></vue-pickers>
    <choose v-show="rentShow" @chooseSuccess="chooseSuccess" @cancel="cancel"></choose>
  </yd-layout>
</template>
<script>
  import Vue from 'vue';
  import qs from 'qs';
  import VuePickers from 'vue-pickers'
  import BScroll from 'better-scroll';

  import choose from './hangye.vue';

  export default {
    name: '',
    props: ["tabIndex"],
    data() {
      return {
        url: "/register/rent",
        tips: "",
        rentShow: false,
        isShowTip: "false",
        regPass: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
        regPhone: /^1[3578]\d{9}$/,
        show1: false,
        show2: false,
        show3: false,
        registerData: {
          rentName: "",
          louyuName: "",
          dong: "",
          unit: "",
          hangyeName: "",
          userName: "",
          phone: "",
          code: "",
          password: ""
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
        pickData3: {
          columns: 1,
          isChange: false,
          pData1: [],
        },
        pickData1: {
          columns: 1, // picker的列数
          // 第一列的数据结构
          pData1: [],
        },
        inputType: false,
        start1: false,
      }
    },
    components: {
      choose,
      VuePickers
    },
    methods: {
      //获取焦点或失去焦点均需要刷新BScroll
      refresh() {
        this.$nextTick(() => {
          this.scroll.refresh();
        })
      },
      //选择多少栋
      chooseDong() {
        if (!this.pickData1.isChange) {
          return this.$dialog.toast({
            mes: "请先选择楼宇",
            timeout: "400",
          });
        } else if (this.pickData2.pData1.length == 0) {
          return this.$dialog.toast({mes: "数据为空", timeout: 1000})
        } else {
          this.show1 = false;
          this.show2 = true;
          this.show3 = false;
        }
      },
      chooseUnit() {
        if (!this.pickData1.isChange) {
          return this.$dialog.toast({
            mes: "请先选择楼宇",
            timeout: "400",
          });
        } else if (this.pickData3.pData1.length == 0) {
          return this.$dialog.toast({mes: "数据为空", timeout: 1000})
        } else if (!this.pickData2.isChange) {
          return this.$dialog.toast({
            mes: "请先多少栋",
            timeout: "400",
          });
        } else {
          this.show3 = true;
          this.show1 = false;
          this.show2 = false;
        }
      },
      sendCode1() {
        var that = this;
        if (this.registerData.phone == "" || typeof this.registerData.phone == 'undefined') {
          this.$dialog.alert({
            mes: "手机号不能为空"
          });
          return;
        } else if (!this.regPhone.test(this.registerData.phone)) {
          this.$dialog.alert({
            mes: "手机号格式错误"
          });
          return;
        }
        that.$dialog.loading.open('发送中...');
        setTimeout(() => {
          that.$dialog.loading.close();
        }, 3000);
        that.xhr.post(this.subUrl.user + '/user/getVerificationCode', qs.stringify({
          mobile: that.registerData.phone
        }))
        .then(function (res) {
          if (res.data.code == 1) {
            console.log(res.data)
            that.$dialog.loading.close();
            that.start1 = true;
            that.$dialog.toast({
              mes: '已发送',
              icon: 'success',
              timeout: 1500
            });
          } else {
            that.$dialog.toast({
              mes: res.data.msg
            })
          }
        })
      },
      chooseRentName() {
        if (this.pickData1.pData1.length == 0) {
          return this.$dialog.toast({mes: "数据为空", timeout: 3000})
        }
        this.show1 = true;
        this.show2 = false;
        this.show3 = false;
      },
      chooseJob() {
        this.show1 = false;
        this.show2 = false;
        this.show3 = false;
        this.rentShow = true;
      },
      openEyes() {
        if (this.inputType) {
          this.inputType = false;
        } else {
          this.inputType = true;
        }
      },
      verify(phone, data) {
        this.xhr.post(`${this.subUrl.user}/user/accountVerify`, qs.stringify({
          account: phone
        })).then(res => {
          if (res.data.code == '-903') {
            this.xhr.post(`${this.subUrl.user}/user/register`, qs.stringify(data)).then(res1 => {
              if (res1.data.code == 1) {
                location.href = '#/register_success/1';
              } else {
                this.$dialog.toast({
                  mes: res1.data.msg
                });
              }

            })
          } else if (res.data.code == 1 || res.data.code == -1) {
            this.$dialog.alert({
              mes: "账号已注册"
            });
          }
        })
      },
      //注册
      register() {
        var that = this;
        if (this.registerData.rentName == "") {
          return this.$dialog.alert({
            "mes": "请输入租户名"
          });
        } else if (this.registerData.louyuName == "") {
          return this.$dialog.alert({
            "mes": "请选择楼宇名"
          });
        } else if (this.registerData.dong == "") {
          return this.$dialog.alert({
            "mes": "请输入多少栋"
          });
        }
//        else if (this.registerData.unit == "") {
//          return this.$dialog.alert({
//            "mes": "请输入单元号"
//          });
//        }
        else if (this.registerData.hangyeName == "") {
          return this.$dialog.alert({
            "mes": "请选择行业"
          });
        } else if (this.registerData.userName == "") {
          return this.$dialog.alert({
            "mes": "请输入用户名"
          });
        } else if (this.registerData.phone == "") {
          return this.$dialog.alert({
            "mes": "手机号"
          });
        } else if (!this.regPhone.test(this.registerData.phone)) {
          return this.$dialog.alert({
            "mes": "请输入正确的手机号"
          });
        } else if (this.registerData.password == "") {
          return this.$dialog.alert({
            "mes": "请输入密码"
          });
        } else if (!this.regPass.test(this.registerData.password)) {
          return this.$dialog.alert({
            "mes": "密码格式不正确"
          });
        }
        var data = {
          organName: this.registerData.rentName,
          buildingName: this.registerData.louyuName,
          buildingId: this.registerData.buildingId,
          industryType: this.registerData.hangye.join(","),
          ridgepoleId: this.registerData.ridgepoleId,
          unitId: this.registerData.unitId,
          type: 1,
          userName: this.registerData.userName,
          mobile: this.registerData.phone,
          verificationCode: this.registerData.code,
          password: this.registerData.password
        };
        console.log(data);
        that.$dialog.confirm({
          mes: '是否注册为管理员？',
          opts: [{
            txt: '否',
            color: "#50b9f1",
            callback: () => {
              this.$dialog.toast({
                mes: '否',
                timeout: 1000
              });
              data.isAdmin = 0;
              this.verify(this.registerData.phone, data);
            }
          },
            {
              txt: '是',
              color: "#50b9f1",
              callback: () => {
                this.registerData.isManager = true;
                data.isAdmin = 1;
                this.verify(this.registerData.phone, data);
              }
            }
          ]
        });
      },
      /*获取楼宇信息*/
      getLouyu() {
        this.xhr.post(`${this.subUrl.user}/comm/officeBuildingList`).then(res => {
          if (res.data.code == 1) {
            var arr = [];
            let l = res.data.data.length
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
        })
      },
      //子组件选择行业成功
      chooseSuccess(e) {
        this.rentShow = false;
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
      },
      //子组件行业关闭
      close(e) {
        this.show1 = false;
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
            this.pickData2.pData1 = arr;
          } else {
            this.$dialog.alert({
              mes: res.data.msg
            });
            this.pickData2.pData1 = [];
            this.pickData3.pData1 = [];
          }
        })
      },
      //getUnit获取单元
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
            this.pickData3.pData1 = arr;
          } else {
            this.$dialog.alert({
              mes: res.data.msg
            })
          }
        })
      },
      //确定选择楼宇
      confirmFn(e) {
        this.show1 = false;
        this.registerData.dong = "";
        this.registerData.buildingId = "";
        this.registerData.unit = "";
        this.registerData.unitId = "";
        this.pickData2.isChange = false;
        if (this.pickData1.pData1.length == 0) return this.$dialog.toast({
          mes: "暂无数据",
          timeout: 400
        });
        this.registerData.louyuName = e.select1.text;
        this.registerData.buildingId = e.select1.guid;
        this.buildingId = e.select1.guid;
        this.$set(this.pickData1, "isChange", true);
        this.getDong(e.select1.guid)
      },
      //确定选择栋
      confirmFn1(e) {
        this.show2 = false;
        this.registerData.unit = "";
        this.registerData.unitId = "";
        if (this.pickData2.pData1.length == 0) {
          this.pickData3.pData1 = [];
          return this.$dialog.toast({
            mes: "暂无数据",
            timeout: 400
          });
        }
        this.registerData.dong = e.select1.text;
        this.registerData.ridgepoleId = e.select1.guid;
        this.ridId = e.select1.guid;
        this.$set(this.pickData2, "isChange", true);
        this.getUnit(e.select1.guid);
      },
      //确定选择单元
      confirmFn2(e) {
        this.show3 = false;
        if (this.pickData3.pData1.length == 0) return this.$dialog.toast({
          mes: "暂无数据",
          timeout: 400
        });
        this.registerData.unit = e.select1.text;
        this.registerData.unitId = e.select1.guid;
        this.ridId = e.select1.guid;
        this.$set(this.pickData3, "isChange", true);
      },
      close1() {
        this.show2 = false;
      },
      close2() {
        this.show3 = false;
      }
    },
    mounted() {
      console.log(this.$route.params);
      /*设置用户类型,辨别主颜色*/
      localStorage.setItem('userType', this.$route.params.type);
      this.getLouyu();
    }
  }
</script>
<style scoped>
  .layout{
    height:100%;
  }
  .button_register {
    margin-top: .8rem;
    padding: 0 .3rem .8rem;
  }
  .slideBox{
    position: absolute;
    left:0;
    right:0;
    height:5.6rem;
    bottom: 0;
  }
  .content{
    position: relative;
  }
  .list {
    padding-top: .25rem;
    margin: .25rem .3rem;
    border-radius: .2rem;
    background: #fff;
    padding-bottom: .32rem;
    border: 1px solid #ddd;
    z-index: 10;
    overflow: visible;
  }

  .list:nth-child(1) {
    position: relative;
  }

  .list:nth-child(2) {
    padding-top: .5rem;
  }

  .list .ding {
    position: absolute;
    bottom: -.7rem;
    z-index: 20;
  }

  .list .ding.left_icon {
    left: .22rem;
  }

  .list .ding.right_icon {
    right: .22rem;
  }

  .list .item {
    display: flex;
    margin-bottom: .36rem;
    height: .64rem;
    flex-flow: row nowrap;
    overflow: hidden;
    align-items: center;
    margin-bottom: .36rem;
  }

  .eyes {
    padding: .2rem;
  }

  .eyes img {
    width: .4rem;
    background: #fff;
  }

  .list .item .label {
    color: #999;
    width: 1.6rem;
    text-align: right;
    line-height: .64rem;
    padding-right: .1rem;
  }

  .list .item .input_content {
    height: 100%;
    flex: 1;
    box-sizing: border-box;
    border: 1px solid #ddd;
    margin-right: .46rem;
    border-radius: .15rem;
  }

  .list .item .input_content.code {
    margin-right: .1rem;
  }

  .list .item .get-code {
    margin-right: .5rem;
  }

  .list .item .input_content.icon {
    background: url("../../assets/images/register/right.png") no-repeat calc(100% - .2rem) center;
    background-size: .12rem;
    padding-right: .2rem;
  }

  .list .item .input_content input {
    height: 100%;
    width: 100%;
    border: none;
    outline: none;
    color: #666;
    padding: 0 .2rem;
  }

  .list .eyes .input_content.code {
    display: flex;
  }

  #register {
    width: 100%;
    height: 100%;
  }
</style>