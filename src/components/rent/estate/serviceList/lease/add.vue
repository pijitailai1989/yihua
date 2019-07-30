<template>
  <div style="height:100vh">
    <yd-layout v-if="showBuilding">
      <yd-navbar slot="navbar" title="租赁问询" height=".88rem" color="#fff" :bgcolor="mainColor">
        <div class="addClickArea" slot="left" @click="$router.go(-1)">
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </div>
        <div class="addRightClickArea" style="color:#fff" @click="mSubmit" slot="right">提交</div>
      </yd-navbar>
      <div class="bgwhite usuallyBox bb" style="padding:.1rem 0rem .3rem;">
        <div class="list_item" @click="showBuilding = false">
          <div class="label">写字楼</div>
          <input type="text" class="flex1" readonly placeholder="请选择" maxlength="30" v-model="buildingName">
        </div>

        <div class="list_item">
          <div class="label">面积需求</div>
          <input type="text" class="flex1" placeholder="" maxlength="30" v-model="area">
        </div>
        <div class="list_item">
          <div class="label">何时入驻</div>
          <input type="text" class="flex1" placeholder="" maxlength="30" v-model="settledTime">
        </div>
        <div class="list_item">
          <div class="label">主要用途</div>
          <input type="text" class="flex1" placeholder="" maxlength="30" v-model="muse">
        </div>
      </div>
      <div class="bgwhite usuallyBox bb mt3 bt" style="padding:.1rem 0rem .3rem;">
        <div class="list_item"><span class="label">其它备注</span></div>
        <div style="padding:0 .5rem;">
          <yd-textarea class="border" v-model="remark" maxlength="100"
                       style="height:2rem;padding:0.1rem .1rem .4rem"></yd-textarea>
        </div>
      </div>
    </yd-layout>
    <chooseBuilding v-show="!showBuilding" @receive="setBuilding"></chooseBuilding>
  </div>
</template>

<script>
  import chooseBuilding from './building'

  export default {
    components: {
      chooseBuilding,
    },
    data() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.buildingId = this.userInfo.buildingId;
      this.buildingName = this.userInfo.buildingName;
      this.mainColor = this.$color[this.userInfo.organType];
      return {
        showBuilding: true,
        area: "",
        muse: "",
        settledTime: this.$today(),
        remark: "",
      }
    }, methods: {
      setBuilding(e) {
        this.showBuilding = true;
        if (e) {
          console.log(JSON.stringify(e))
          this.buildingId = e.guid;
          this.buildingName = e.buildingName;
        }
      },
      mSubmit() {
        console.log(this.remark, '111s')
        if (this.buildingId == "") {
          return this.$dialog.toast({mes: "请选择写字楼", timeout: 800});
        } else if (this.area == "") {
          return this.$dialog.toast({mes: "请输入面积需求", timeout: 800});
        } else if (this.muse == "") {
          return this.$dialog.toast({mes: "请输入主要用途", timeout: 800});
        } else if (this.remark == "") {
          return this.$dialog.toast({mes: "请输入其它备注", timeout: 800})
        }
        let data = {
          token: this.$getkey(),
          userId: this.userInfo.guid,
          buildingId: this.buildingId,
          muse: this.muse,
          area: this.area,
          settledTime: this.settledTime + ' 00:00:00',
          remark: this.remark
        }
        this.$ajax(`${this.subUrl.activity}/lease/leaseAsk`, data, res => {
          this.$dialog.toast({mes: "提交成功", icon: "success", timeout: 800});
          this.$router.go(-1);
        }, this)
      },
    }
  }
</script>

<style scoped>

</style>
