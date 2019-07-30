<template>
  <div style="height:100vh">
    <yd-layout v-show="showUser">
      <yd-navbar slot="navbar" title="添加内容" height=".88rem" color="#fff" :bgcolor="mainColor">
        <div class="addClickArea" slot="left" @click="addList(0)">
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </div>
        <div class="addRightClickArea" style="color:#fff" slot="right" @click="addList(1)">保存</div>
      </yd-navbar>
      <!--日报-->
      <div v-if="type == 1" class="bgwhite" style="padding:.2rem">
        <div class="font28 flex-row-nowarp">工作内容</div>
        <yd-textarea class="border" v-model="obj.workContent" maxlength="100"
                     style="padding:.1rem .1rem .3rem;height: 1.8rem;"></yd-textarea>
        <div class="font28">工作措施</div>
        <yd-textarea v-model="obj.workMeasure" class="border mt2" maxlength="100"
                     style="padding:.1rem .1rem .3rem;height: 1.8rem;"></yd-textarea>

        <div class="flex-row-nowarp">执行人</div>
        <div class="flex-row-nowarp" @click="showUser=false">
          <input type="text" placeholder="请选择" v-model="executorName" readonly class="pdlr1 flex1 radius"
                 style="height: .6rem;">
        </div>
        <div class="flex-row-nowarp">完成情况</div>
        <div class="flex-row-nowarp">
          <input type="text" placeholder="请选择" v-model="obj.progress" class="pdlr1 flex1 radius" style="height: .6rem;">
        </div>
      </div>
      <!--周报-->
      <div v-if="type == 2" class="bgwhite" style="padding:.2rem">
        <div class="font28 flex-row-nowarp">工作内容</div>
        <yd-textarea class="border" maxlength="100" v-model="obj.workContent"
                     style="padding:.1rem .1rem .3rem;height: 1.8rem;"></yd-textarea>
        <div class="font28">工作措施</div>
        <yd-textarea class="border mt2" maxlength="100" v-model="obj.workMeasure"
                     style="padding:.1rem .1rem .3rem;height: 1.8rem;"></yd-textarea>
        <div class="flex-row-nowarp">开始时间</div>
        <div class="flex-row-nowarp">
          <yd-datetime v-model="obj.startTime" type="date" class="pdlr1 border flex1 radius"
                       style="height: .6rem;"></yd-datetime>
        </div>
        <div class="flex-row-nowarp">结束时间</div>
        <div class="flex-row-nowarp">
          <yd-datetime v-model="obj.endTime" type="date" class="pdlr1 border flex1 radius"
                       style="height: .6rem;"></yd-datetime>
        </div>
        <div class="flex-row-nowarp">执行人</div>
        <div class="flex-row-nowarp" @click="showUser=false">
          <input type="text" placeholder="请选择" v-model="executorName" readonly class="pdlr1 flex1 radius"
                 style="height: .6rem;">
        </div>

        <div class="flex-row-nowarp">完成情况</div>
        <div class="flex-row-nowarp">
          <input type="text" placeholder="请选择" v-model="obj.progress" class="pdlr1 flex1 radius" style="height: .6rem;">
        </div>
      </div>
      <!--月报-->
      <div v-if="type == 3" class="bgwhite" style="padding:.2rem">
        <div class="font28">工作内容</div>
        <yd-textarea class="border mt2" v-model="obj.workContent" maxlength="100"
                     style="padding:.1rem .1rem .3rem;height: 1.8rem;"></yd-textarea>
        <div class="font28 flex-row-nowarp">标准细化点</div>
        <yd-textarea class="border" v-model="obj.workMeasure" maxlength="100"
                     style="padding:.1rem .1rem .3rem;height: 1.8rem;"></yd-textarea>
        <div class="flex-row-nowarp">结束时间</div>
        <div class="flex-row-nowarp">
          <yd-datetime v-model="obj.endTime" type="date"  class="pdlr1 border flex1 radius"
                       style="height: .6rem;"></yd-datetime>
        </div>
        <div class="flex-row-nowarp">责任人</div>
        <div class="flex-row-nowarp" @click="showUser=false">
          <input type="text" placeholder="请选择" v-model="executorName" readonly class="pdlr1 flex1 radius"
                 style="height: .6rem;">
        </div>

        <div class="flex-row-nowarp">进度结论</div>
        <div class="flex-row-nowarp">
          <input type="text" placeholder="请选择" v-model="obj.progress" class="pdlr1 flex1 radius" style="height: .6rem;">
        </div>
      </div>
    </yd-layout>
    <departMent v-if='!showUser' :organId='organInfo.guid' @setUserId='setUserId'></departMent>
  </div>
</template>
<script>
  import departMent from "@/components/rent/estate/serviceList/renovation/department_manager";

  export default {
    components: {
      departMent
    },
    props: ['type'],
    data() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = this.$color[this.userInfo.organType];
      return {
        chooseUser: true,
        showUser: true,
        obj: {
          "workContent": "",
          "workMeasure": "",
          "startTime": this.$today(),
          "endTime": this.$today(),
          "executor": '',
          "progress": "",
        },
        executorName: '',
      }
    },
    methods: {
      addList(e) {
        var reg = /\d{1,}/

        if (e) {
          var data = {};
          var obj = this.obj;
          if (this.type == 1) {
            if (obj.workContent == "") return this.$dialog.toast({mes: "请输入工作内容", timeout: 1000});
            if (obj.workMeasure == "") return this.$dialog.toast({mes: "请输入工作措施", timeout: 1000});
            if (obj.executor == "") return this.$dialog.toast({mes: "请选择执行人", timeout: 1000});
            if (obj.progress == "") return this.$dialog.toast({mes: "请输入完成情况", timeout: 1000});
            if ((!reg.test(obj.progress)) || (obj.progress * 1 > 100 || obj.progress * 1 < 0)) {
              return this.$dialog.toast({mes: "请输入1-100之间的数字", timeout: 1000});
            }

          } else if (this.type == 2) {
            if (obj.workContent == "") return this.$dialog.toast({mes: "请输入工作内容", timeout: 1000});
            if (obj.workMeasure == "") return this.$dialog.toast({mes: "请输入工作措施", timeout: 1000});
            if (obj.executor == "") return this.$dialog.toast({mes: "请选择执行人", timeout: 1000});
            if (obj.progress == "") return this.$dialog.toast({mes: "请输入进度结论", timeout: 1000});
            if ((!reg.test(obj.progress)) || (obj.progress * 1 > 100 || obj.progress * 1 < 0)) {
              return this.$dialog.toast({mes: "请输入1-100之间的数字", timeout: 1000});
            }
          } else if (this.type == 3) {
            if (obj.workContent == "") return this.$dialog.toast({mes: "请输入工作内容", timeout: 1000});
            if (obj.workMeasure == "") return this.$dialog.toast({mes: "请输入标准细化点", timeout: 1000});
            if (obj.executor == "") return this.$dialog.toast({mes: "请输入选择执行人", timeout: 1000});
            if (obj.progress == "") return this.$dialog.toast({mes: "请输入完成情况", timeout: 1000});
            if ((!reg.test(obj.progress)) || (obj.progress * 1 > 100 || obj.progress * 1 < 0)) {
              return this.$dialog.toast({mes: "请输入1-100之间的数字", timeout: 1000});
            }
          }
          data = JSON.parse(JSON.stringify(this.obj));
          data.startTime = data.startTime + ' 00:00:00'
          data.endTime = data.endTime + ' 23:59:59'
          this.$emit('addList', data);
        } else {
          this.$emit('addList');
        }
      },
      setUserId(e) {
        this.showUser = true;
        if (e) {
          this.obj.executor = e.userId;
          this.executorName = e.userName;
        }
      },
    },


  }
</script>

<style scoped>

</style>
