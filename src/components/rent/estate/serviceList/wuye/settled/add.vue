<template>
    <div style='height:100vh'>
        <yd-layout v-show='!showUser'>
            <yd-navbar height='.88rem' :bgcolor='mainColor' color='#fff' slot='navbar' title="办理入驻">
                <yd-navbar-back-icon slot="left" @click.native='$router.go(-1)' color="#fff"></yd-navbar-back-icon>
            </yd-navbar>
            <div class="flex-box">
                <div class="flex-row h7">
                    <span class="label font30">企业名称</span>
                    <input type="text"  @click="showList" placeholder="请选择入驻企业" readonly class="flex1 font28 foCo6 pdlr1" maxlength='100' v-model='currentCompany.organName'>
                   
                    <div class="mylist" v-if="showFlag.organShow == 1">
                        <div v-for="(item,index) in list" @click="chooseCompany(index)" :key="index">
                            <span>{{item.organName}}</span>
                        </div>
                    </div>
                </div>
                <!--  -->
                <div class="flex-row h7">
                    <span class="label font30">所在行业</span>
                    <input type="text" class="flex1 font28 foCo6 pdlr1" readonly v-model='currentCompany.industry'>
                </div>
                <!--  -->
                <div class="flex-row-nowarp h7">
                    <span class="label font30">租用单元</span>
                    <input type="text" class="flex1 font28 foCo6 pdlr1 mr1" @click="chooseDong" placeholder="选择栋" readonly v-model='currentCompany.ridName'>
                    <input type="text" class="flex1 font28 foCo6 pdlr1" @click="chooseUnit" placeholder="选择单元" readonly  v-model='currentCompany.unitName'>
                </div>
                <!--  -->
                <div class="flex-row h7">
                    <span class="label font30">合同编号</span>
                    <input type="text" class="flex1 font28 foCo6 pdlr1" maxlength='100' v-model='submitData.contractNo'>
                </div>
                <!--  -->
                <div class="flex-row h7">
                    <span class="label font30">开始日期</span>
                    <yd-datetime type="date" class="flex1 font28 foCo6 pdlr1 border" v-model="submitData.startTime" slot="right"></yd-datetime>
                    <!-- <input type="text" class="flex1 font28 foCo6 pdlr1" readonly v-model='submitData.companyName'> -->
                </div>
                <!--  -->
                <div class="flex-row h7">
                    <span class="label font30">结束日期</span>
                    <yd-datetime type="date" class="flex1 font28 foCo6 pdlr1 border" v-model="submitData.endTime" slot="right"></yd-datetime>
                    <!-- <input type="text" class="flex1 font28 foCo6 pdlr1" readonly v-model='submitData.companyName'> -->
                </div>
                <div class="flex-row h7">
                    <span class="label font30">缴费日期</span>
                    <yd-datetime type="date" class="flex1 font28 foCo6 pdlr1 border" v-model="submitData.paymentDate" slot="right"></yd-datetime>

                </div>
                <!--  -->
                <div class="flex-row">
                    <span class="label font30">备注信息</span>
                    <textarea class="flex1 font28 foCo6 pdlr1 border" maxlength='200' style='height:2rem;' v-model="submitData.remark"></textarea>
                    <!-- <input type="text" class="flex1 font28 foCo6 pdlr1" readonly v-model='submitData.companyName'> -->
                </div>
            </div>
            <!-- 通信 -->
            <div class="flex-box">
                <div class="flex-row h7">
                    <span class="label font30">通信地址</span>
                    <input type="text" class="flex1 font28 foCo6 pdlr1" maxlength='100' v-model='submitData.contactAddress'>
                </div>
                <div class="flex-row h7">
                    <span class="label font30">联系人</span>
                    <input type="text" class="flex1 font28 foCo6 pdlr1" maxlength='20' v-model='submitData.contactName'>
                </div>
                <div class="flex-row h7">
                    <span class="label font30">联系电话</span>
                    <input type="text" maxlength="11" class="flex1 font28 foCo6 pdlr1" v-model='submitData.contactPhone'>
                </div>
            </div>
            <div class="flex-row bgwhite h9" style='padding:.1rem .2rem;margin-bottom:.3rem'>
                <span class="label font30 ">收件人</span> 
                <input type="text" maxlength="20" placeholder="请选择（默认为直属领导" readonly @click="showUser = true" class="flex1 font28 foCo6 pdlr1" style='text-align:right' v-model='settled.userName'>
            </div>
            <div class="flex-row h8 bgwhite jusCenter bt font32" @click="submit" :style='{color:mainColor,margin:"0 0 .2rem;"}'>提交</div>
            <vue-pickers v-show="show1" slot="bottom" class="slideBox" :selectData="pickData1" v-on:cancel="close" v-on:confirm="confirmFn"></vue-pickers>
            <vue-pickers v-show="show2" slot="bottom" class="slideBox" :selectData="pickData2" v-on:cancel="close" v-on:confirm="confirmFn1"></vue-pickers>
        </yd-layout>
        <departMent v-if='showUser' @setUserId='setUserId'></departMent>
        
    </div>
</template>
<script>
import VuePickers from "vue-pickers";
import departMent from "../repair/department_manager";

import qs from "qs";
export default {
  components: {
    VuePickers,
    departMent
  },
  data() {
    var userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    var organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    var mainColor = this.$color[userInfo.organType];
    console.log(this.$addDay(this.$today(), 365));
    return {
      showUser: false,
      userInfo: userInfo,
      organInfo: organInfo,
      currentCompany: {},
      mainColor: mainColor,
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
      show1: false,
      show2: false,
      dong: {},
      unit: {},
      settled: {},
      submitData: {
        token: this.$getkey(),
        userId: userInfo.guid,
        startTime: this.$today(),
        endTime: this.$addDay(this.$today(), 365),
        paymentDate: this.$today()
        // settledOrganId:''
      },
      showFlag: {
        organShow: 0
      },

      dong: {},
      unit: {},
      list: []
    };
  },
  methods: {
    setUserId(e) {
      console.log(e);
      this.showUser = false;
      console.log(this.result);
      if (e) {
        this.settled.userName = e.userName;
        this.submitData.principalId = e.userId;
      }
    },
    submit() {
      console.log(this.submitData);
      var reg = /^1[3578]\d{9}$/;
      var data = Object.assign({}, this.submitData);
      data.startTime = data.startTime + " 00:00:00";
      data.endtime = data.endTime + " 00:00:00";
      data.paymentDate = data.paymentDate + " 00:00:00";
      data.settledOrganId = this.currentCompany.guid;
      data.ridId = this.currentCompany.ridId;
      data.unitId = this.currentCompany.unitId;
      //   直系领导
      data.principalId = data.principalId ? data.principalId : "0";
      console.log(data.principalId);
      if (!data.settledOrganId) {
        return this.$dialog.toast({ mes: "请选择公司", timeout: 400 });
      } else if (!data.ridId) {
        return this.$dialog.toast({ mes: "请选择栋", timeout: 400 });
      } else if (!data.unitId) {
        return this.$dialog.toast({ mes: "请选择单元", timeout: 400 });
      } else if (!data.contactAddress) {
        return this.$dialog.toast({ mes: "请输入联系地址", timeout: 400 });
      } else if (!data.contractNo) {
        return this.$dialog.toast({ mes: "请输入合同编号", timeout: 400 });
      } else if (!data.contactName) {
        return this.$dialog.toast({ mes: "请输入联系人", timeout: 400 });
      } else if (data.contactPhone == "") {
        return this.$dialog.toast({ mes: "请输入手机号", timeout: 400 });
      } else if (!reg.test(data.contactPhone)) {
        return this.$dialog.toast({ mes: "请输入正确的手机号", timeout: 400 });
      }
      delete data.ridId;
      console.log("guding", JSON.stringify(data));
      this.$ajax(
        `${this.subUrl.activity}/caa/addSettled`,
        data,
        res => {
          this.$dialog.toast({ mes: "已提交办理", timeout: 400, icon: "success" });
          this.$router.go(-1);
        },
        this
      );
    },
    showList() {
      this.$set(this.showFlag, "organShow", 1);
    },
    chooseCompany(index) {
      this.currentCompany = this.list[index];
      console.log(JSON.stringify(this.currentCompany));
      this.getUnit(this.currentCompany.ridId);
      this.$set(this.showFlag, "organShow", 0);
    },
    //获取当前管理处下的入驻
    getlist() {
      var data = {
        token: this.$getkey(),
        organId: this.organInfo.guid
      };
      this.$ajax(
        `${this.subUrl.activity}/caa/getTenement`,
        data,
        res => {
          this.list = res.data;
        },
        this
      );
    },
    // 选择行业
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
          `${this.subUrl.common}/comm/getBuildingUnit`,
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
    confirmFn(e) {
      this.dong = e.select1;
      console.log(JSON.stringify(e.select1));
      this.show1 = false;
      //改变当前的栋和单元号
      this.currentCompany.ridId = e.select1.guid;
      this.currentCompany.ridName = e.select1.text;
      this.currentCompany.unitId = "";
      this.currentCompany.unitName = "";
      this.getUnit(this.dong.guid);
    },
    confirmFn1(e) {
      JSON.stringify(e.select1);
      this.unit = e.select1;
      console.log(e.select1);
      this.currentCompany.unitId = e.select1.guid;
      this.currentCompany.unitName = e.select1.text;
      this.currentCompany.organId = e.organId;

      this.show2 = false;
    }
  },
  mounted() {
    this.getlist();
    this.getDong(this.userInfo.buildingId);
  }
};
</script>
<style scoped>
.mylist {
  position: absolute;
  top: 0.8rem;
  background: #fff;
  left: 1.9rem;
  right: 0.3rem;
  border: 1px solid #ddd;
  padding: 0.2rem;
}
.mylist > div {
  padding: 0 0.2rem;
  height: 0.6rem;
  line-height: 0.6rem;
}
.label {
  width: 1.6rem;
  text-align: right;
  padding-right: 0.2rem;
  color: #333;
}

.flex-box {
  padding: 0.2rem 0.3rem;
  background: #fafefd;
  margin-bottom: 0.2rem;
  position: relative;
}

.flex-box > div {
  margin-bottom: 0.2rem;
}

.flex-row-nowarp input {
  width: 2rem;
}

.flex-box input {
  border-radius: 0.05rem;
  background: #fff;
}
</style>