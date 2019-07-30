<template>
  <div style="height:100vh">
      <yd-layout>
        <yd-navbar title="业务办理" slot="navbar" :bgcolor='mainColor' color='#fff' height='.88rem'>
            <yd-navbar-back-icon slot="left" @click.native="mClose" color='#fff' class="addClickArea"></yd-navbar-back-icon>
        </yd-navbar>
        <div class="list">
            <div class="list_item flex-row-nowrap bgwhite">
                <div class="flex">
                        <!-- 左1 -->
                    <div class="icon mr3" :style="`background:${sobObj.bgColor}`" >
                      <!--  -->
                        {{sobObj.typeName?sobObj.typeName[0]:"无"}}
                    </div>
                    <!-- 左2 -->
                    <div>
                        <div class="font32 foCo0">{{sobObj.typeName?sobObj.typeName:"无数据"}}</div>
                        <div class="font24 foCo9">{{info.buildingName}}</div>
                    </div>
                </div>
            </div>
            <div v-if="info.info" style="margin:.2rem;padding:.1rem;"  class="bgwhite">
              <div class="font32">温馨提示</div>
              <div class="font26 foCo6 mt2">{{info.info}}</div>
            </div>
            <div v-else style="margin:.2rem;padding:.1rem;"  class="bgwhite">
              <div class="font32">温馨提示</div>
              <div class="font26 foCo6 mt2">1.开通该写字楼室内维修业务将自动获取所有租户的室内维修订单。</div>
              <div class="font26 foCo6">2.如果你在10分钟内不接单或接单后不联系客户，不派单上门服务按相关规定处理，以保证客户的良好服务体验</div>
            </div>
        </div>
        <!-- 开通周期 -->
        <div class="mt2 bt bb bgwhite center flex-start pdlr2">
            <div class="flex h8 flex-start">
                <img class="chooseIcon" src="../../../../../assets/images/rent/estate/order.png" alt="">
                <span>开通周期</span>
            </div>
            <div class="flex">
              <div style="width:50%;margin:.2rem" v-for="(item,index) in couponList" :style="activeIndex==index?`border-color:${mainColor};color:${mainColor}`:``" :key="index" class="flex h7 chooseCoupon jusCenter border" @click="chooseCoupon(index)">{{item.name}}</div>
            </div>
            <div class="flex h8 flex-start">
                <img class="chooseIcon" src="../../../../../assets/images/rent/estate/money.png" alt="">
                <div class="fuColor3">{{cost*10}}</div>
                <span>商机点</span>
            </div>
            <yd-cell-group>
                <yd-cell-item type="radio" v-for="(item,index) in payWay"  v-if="index==0" :key="index">
                    <img :src="item.icon" slot="icon" alt="">
                    <span slot="left">{{item.name}}</span>
                    <input slot="right" type="radio" :value="item.value" v-model="picked"/>
                </yd-cell-item>
                </yd-cell-group>
          <div class="h7 pdlr2">有效期至：{{deadline}}</div>
        </div> 
        <div class="flex h9 jusCenter radius" @click="confirm" style="margin:.8rem .4rem" :style="{color:'#fff',background:mainColor}">确定开通</div> 
    </yd-layout>
  </div>
</template>
<script>
import Vue from "vue";
import { CellGroup, CellItem } from "vue-ydui/dist/lib.rem/cell";
Vue.component(CellGroup.name, CellGroup);
Vue.component(CellItem.name, CellItem);
export default {
  props: ["sobObj"],
  data() {
    let userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    let organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.mainColor = this.$color[userInfo.organType];
    return {
      userInfo,
      organInfo,
      list: [],
      cost: "",
      picked: "4",
      info: {},
      activeIndex: 0,
      deadline: this.$addDay(this.$today(), 180),
      couponList: [
        {
          name: "6个月",
          value: 180,
          month: 6
        },
        {
          name: "12个月",
          value: 365,
          month: 12
        }
      ],
      //支付类型，1微信，2支付宝 3银行 4商机点
      payWay: [
        {
          name: "商机点支付",
          value: 4,
          icon: require("../../../../../assets/images/rent/estate/shangjidian.png")
        },
        {
          name: "支付宝支付",
          value: 2,
          icon: require("../../../../../assets/images/rent/estate/zhifubao.png")
        },
        {
          name: "微信支付",
          value: 1,
          icon: require("../../../../../assets/images/rent/estate/wechat.png")
        }
      ]
    };
  },
  methods: {
    randomColor: function() {
      var i = Math.round(Math.random() * 4);
      var colorArr = ["#3eb7e6", "#62c88c", "#fab23e", "#fa697c", "#adb8c0"];
      return colorArr[i];
    },
    chooseCoupon(e) {
      this.activeIndex = e;
      console.log(this.couponList[e].value);
      this.deadline = this.$addDay(this.$today(), this.couponList[e].value);
      this.cost = this.couponList[this.activeIndex].month * this.info.cost;
    },
    // 返回不传数据
    mClose() {
      this.$emit("mClose");
    },
    // 返回传数据一般执行完了，主组件需要的数据
    mainColor1() {
      this.$emit("mClose", this.payWay);
    },
    confirm() {
      this.$dialog.confirm({
        mes: "是否花费" + this.cost * 10 + "商机点购买" + this.sobObj.typeName + "业务",
        opts: res => {
          let data = {
            token: this.$getkey(),
            sobId: this.sobObj.guid,
            num: this.couponList[this.activeIndex].month,
            payType: this.picked
          };
          this.$ajax(
            `${this.subUrl.activity}/sob/traSob`,
            data,
            res => {
              this.$dialog.toast({ mes: "办理成功", icon: "sucess" });
              this.$emit("mClose",'1');
            },
            this
          );
        }
      });
    },
    getList() {
      var data = {
        token: this.$getkey(),
        sobId: this.sobObj.guid
      };
      this.$ajax(
        `${this.subUrl.activity}/sob/traSobDetail`,
        data,
        res => {
          this.info = res.data;
          this.cost = this.couponList[this.activeIndex].month * this.info.cost;
        },
        this
      );
    }
  },
  mounted() {
    this.getList();
  }
};
</script>
<style scoped>
.list {
  background: #fff;
  border-bottom: 1px solid #ddd;
}
.list_item {
  margin-left: 0.45rem;
  padding: 0.2rem 0.3rem 0.2rem 0;
}
.list_item:last-child {
  margin-bottom: -1px;
}
.list_item .icon {
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  text-align: center;
  line-height: 0.8rem;
  font-size: 0.4rem;
  color: #fff;
}
</style>


