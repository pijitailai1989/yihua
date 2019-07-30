<template>
  <yd-layout>
    <yd-navbar class="header" slot="navbar" title="抄表" color="#fff" :bgcolor="mainColor"
               height=".88rem">
         <span class="spanLeft" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
    </yd-navbar>
    <div>
      <!--project (string, optional): 抄表项目 ,
      ppReading (string, optional): 上期读数 ,
      reading (string, optional): 本期读数 ,
      dosage (string, optional): 实际用量 ,
      meterReadUsername (string, optional): 抄表人 ,
      meterRead (string, optional): 抄表日期-->
      <div class="bgwhite foCo6" style="padding: .5rem .3rem;" @click.stop="''">
        <div class="flex-row-nowarp h8">
          <div class="label" style="width:1.6rem">项目名称</div>
          <input type="text" class="flex1 border" maxlength="30" v-model="table.project" style="height:.68rem;"
                 placeholder="请输入">
        </div>
        <div class="flex-row-nowarp h8">
          <div class="label" style="width:1.6rem">上期读数</div>
          <input type="number" class="flex1 border" maxlength="30" v-model="table.ppReading" style="height:.68rem;"
                 placeholder="请输入">
        </div>
        <div class="flex-row-nowarp h8">
          <div class="label" style="width:1.6rem">本期读数</div>
          <input type="number" class="flex1 border" maxlength="30" v-model="table.reading" style="height:.68rem;"
                 placeholder="请输入">
        </div>

        <div class="flex-row-nowarp h8">
          <div class="label" style="width:1.6rem">实际用量</div>
          <input type="number" class="flex1 border" maxlength="30" v-model="table.dosage" style="height:.68rem;"
                 placeholder="请输入">
        </div>
        <div class="flex-row-nowarp h8">
          <div class="label" style="width:1.6rem">抄表人</div>
          <input type="text" class="flex1 border" maxlength="30" v-model="table.meterReadUsername" style="height:.68rem;"
                 placeholder="请输入">
        </div>
        <div class="flex-row-nowarp h8">
          <div class="label" style="width:1.6rem">抄表日期</div>
          <!--<input type="text" class="flex1 border" maxlength="30" v-model="table.reading"-->
          <!--placeholder="请输入">-->
          <yd-datetime type="date" class="flex1 border" v-model="table.meterRead" style="height:.68rem;"
                       slot="right"></yd-datetime>
        </div>


        <div class="flex h8 jusCenter mt3 radius" @click="csConfirm" :style="{color:'#fff',background:mainColor}">
          确定
        </div>
      </div>
    </div>
  </yd-layout>
</template>
<script>
  export default ({
    data() {
      this.userInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("userInfo"))
      );
      this.organInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("organInfo"))
      );
      this.mainColor = this.$color[this.userInfo.organType];
      return {
        table: {
          "project": "",
          "ppReading": "",
          "reading": "",
          "dosage": "",
          "meterReadUsername": "",
          "meterRead": this.$today(),
        }
      }
    },
    methods: {
      csConfirm() {
        if (!this.table.project) {
          return this.$dialog.toast({mes: "请输入项目名", timeout: 600})
        } else if (!this.table.ppReading) {
          return this.$dialog.toast({mes: "请输入上期读数", timeout: 600})
        } else if (!this.table.reading) {
          return this.$dialog.toast({mes: "请输入本期读数", timeout: 600})
        } else if (!this.table.dosage) {
          return this.$dialog.toast({mes: "请输入用量", timeout: 600})
        } else if (!this.table.meterReadUsername) {
          return this.$dialog.toast({mes: "请输入抄表人", timeout: 600})
        } else {
          this.$emit('setTable', this.table);
        }
      },
      back() {
        this.$emit('setTable')
      }
    }
  })

</script>
<style scoped>
  .flex-row-nowarp .flex1 {
    padding: 0 .1rem;
  }

</style>
