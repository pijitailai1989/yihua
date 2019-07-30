<template>
  <div style="height:100vh">
    <yd-layout v-if="!showHangye">
      <yd-navbar title="设置" :bgcolor='mainColor' color='#fff' height='.88rem'>
          <yd-navbar-back-icon slot="left" @click.native='$router.go(-1)' color='#fff' class="addClickArea"></yd-navbar-back-icon>
          <!-- <div class="edit addRightClickArea"  slot="right" style="color: #fff;font-size:.6rem;">+</div> -->
      </yd-navbar>
      <div style="padding:.2rem 0 .5rem;" class="inputBox">
        <div class="flex-row-nowrap h7" style="padding-right:.4rem;">
          <span class="pdlr foCo6" style="text-align:right;width:1.6rem;padding-right:.2rem;">业务类型</span>
          <input class="flex1 bgwhite border pdlr1" v-model="typeName" readonly @click="showHangye=true" placeholder="请选择行业类型" type="text">
        </div>

        <div class="flex-row-nowrap h7" style="padding-right:.4rem;">
          <span class="pdlr foCo6" style="text-align:right;width:1.6rem;padding-right:.2rem;">上限数量</span>
          <input class="flex1 bgwhite border pdlr1" v-model="amount" maxlength="1" placeholder="默认为0未开放 最多5家" type="number">
        </div>

        <div class="flex-row-nowrap h7 relative" style="padding-right:.4rem;">
          <span class="pdlr foCo6" style="text-align:right;width:1.6rem;padding-right:.2rem;">服务费</span>
          <input class="flex1 bgwhite border pdlr1" v-model="cost" style="padding-right:1.8rem;" type="number" placeholder="由客服设置">
          <span class="shangjidian foCo3 font32">元/月</span>
        </div>
        <div class="flex-row-nowrap h7" style="padding-right:.4rem;">
          <div class="foCo6" style="text-align:right;padding:.5rem;">
            <yd-checkbox v-model="checkbox1" :color='mainColor'> 到期提示（提前一个星期）</yd-checkbox>
          </div>
          <!-- <div class="flex1 pdlr1">
           
          </div> -->
        </div>
        <div class="flex-row h8 jusCenter center" @click="confirm" :style="{background:mainColor,margin:'.8rem .6rem .5rem',color:'#fff',borderRadius:'.1rem'}">确定</div>
      </div>
    </yd-layout>
    <myHangye v-if="showHangye" @chooseSuccess='chooseSuccess'></myHangye>
  </div>
</template>
<script>
import myHangye from "./hangye";

export default {
  components: {
    myHangye
  },
  data() {
    let userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    let organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.mainColor = this.$color[userInfo.organType];
    return {
      showHangye: false,
      userInfo,
      organInfo,
      typeId: "",
      typeName: "",
      amount: "",
      cost: "",
      checkbox1:false,
    };
  },
  methods: {
    confirm() {
      if (this.typeId == "") {
        return this.$dialog.toast({ mes: "请选择行业类型" });
      } else if (this.amount == "" || this.amount * 1 > 5) {
        return this.$dialog.toast({ mes: "请输入正确的上限数量" });
      } else if (this.cost == "") {
        return this.$dialog.toast({ mes: "请输入信息服务费" });
      }
      let data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        organId: this.organInfo.guid,
        typeId: this.typeId,
        amount: this.amount,
        cost: this.cost,
        remind:this.checkbox1?1:0,
      };
      this.$ajax(
        `${this.subUrl.activity}/sob/addSob`,
        data,
        res => {
          this.$dialog.toast({ mes: "添加成功", icon: "success", timeout: 1000 });
          this.$router.go(-1);
        },
        this
      );
    },
    chooseSuccess(e) {
      this.showHangye = false;
      if (e) {
        this.typeId = e.require.guid;
        this.typeName = e.require.name;
        console.log(e);
      }
    }
  }
};
</script>
<style scoped>
input {
  outline: none;
  border-width: 1px;
  color: #666;
}
.inputBox > div {
  margin-bottom: 0.2rem;
}
.shangjidian {
  position: absolute;
  top: 50%;
  right: 0.6rem;
  transform: translateY(-50%);
}
</style>


