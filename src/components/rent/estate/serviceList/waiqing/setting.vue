<template>
  <div style="height:100vh">
    <yd-layout>
      <yd-navbar slot="navbar" height='.88rem' color='#fff' :bgcolor='mainColor' title='服务设置'>
          <div class="addClickArea" @click="$router.go(-1)" slot="left">
              <yd-navbar-back-icon color='#fff'></yd-navbar-back-icon>
          </div>
          <div class="addRightClickArea font40" style="color:#fff">+</div>
      </yd-navbar>
      <div class="list">
				<yd-cell-group v-for="(item,index) in list" :style="index<=3?'margin-bottom:.2rem':'margin:0'" :key="index">
					<yd-cell-item type="label">
							<div slot="left" class="font32">{{item.name}}</div>
							<div slot="right" class="mr3">接受外勤</div>
							<yd-switch @click.native="setWaiqing(index)" slot="right" :color='mainColor' v-model="item.enabled"></yd-switch>
					</yd-cell-item>
					<div class="flex-row-nowrap h7 bgwhite" v-if="item.startTime" style="padding:.2rem .5rem;box-sizing:content-box;">
						<yd-datetime type="time"  class="border h7 flex jusCenter" style="margin:0 .1rem" v-model="item.startTime"></yd-datetime>
						<yd-datetime type="time"  class="border h7 flex jusCenter"  style="margin:0 .1rem" v-model="item.endTime"></yd-datetime>
					</div>
				</yd-cell-group>
      </div>
    </yd-layout>
  </div>
</template>
<script>
import Vue from "vue";
import { CellGroup, CellItem } from "vue-ydui/dist/lib.rem/cell";
Vue.component(CellGroup.name, CellGroup);
Vue.component(CellItem.name, CellItem);
import { Switch } from "vue-ydui/dist/lib.rem/switch";
Vue.component(Switch.name, Switch);
import { FlexBox, FlexBoxItem } from "vue-ydui/dist/lib.rem/flexbox";
Vue.component(FlexBox.name, FlexBox);
Vue.component(FlexBoxItem.name, FlexBoxItem);
export default {
  data() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.mainColor = this.$color[this.userInfo.organType];
    console.log(this.mainColor, 1111111111111);
    return {
      list: [
        // {
        //   name: "周一",
        //   value: true,
        //   startTime: "09:00",
        //   endTime: "17:00"
        // },
        // {
        //   name: "周二",
        //   value: true,
        //   startTime: "09:00",
        //   endTime: "17:00"
        // },
        // {
        //   name: "周三",
        //   value: true,
        //   startTime: "09:00",
        //   endTime: "17:00"
        // },
        // {
        //   name: "周四",
        //   value: true,
        //   startTime: "09:00",
        //   endTime: "17:00"
        // },
        // {
        //   name: "周五",
        //   value: true,
        //   startTime: "09:00",
        //   endTime: "17:00"
        // },
        // {
        //   name: "周六",
        //   value: true,
        //   startTime: "09:00",
        //   endTime: "17:00"
        // },
        // {
        //   name: "周日",
        //   value: true,
        //   startTime: "09:00",
        //   endTime: "17:00"
        // }
      ]
    };
  },
  methods: {
    setWaiqing(i) {
      console.log(JSON.stringify(this.list[i]));
      var obj = JSON.parse(JSON.stringify(this.list[i]));
      let data = {
        token:this.$getkey(),
        list:[{
          type:obj.type,
          startTime:obj.startTime + ':00',
          endTime:obj.endTime + ':00',
          enabled:obj.enabled?0:1,
        }]
      }
      this.$ajax1(`${this.subUrl.activity}/serviceOrder/settings`,data,res=>{
        this.$dialog.toast({mes:"设置成功",icon:"success",timeout:400})
      },this)
    },getSetting(){
      this.$ajax(`${this.subUrl.activity}/serviceOrder/getServiceSetting`,{token:this.$getkey()},res=>{
      //   this.$ajax(`${this.subUrl.activity}/serviceOrder/getServiceSetting`,{token:'30d790f914124cb488a5e51488b1ce80'},res=>{
          for(var a of res.data){
            switch (Number(a.type)){
              case 1:a.name='星期一';break;
              case 2:a.name='星期二';break;
              case 3:a.name='星期三';break;
              case 4:a.name='星期四';break;
              case 5:a.name='星期五';break;
              case 6:a.name='星期六';break;
              case 7:a.name='星期日';break;
              default:console.log(a,typeof a);
            }
            a.startTime = a.startTime.substr(0,5);
            a.endTime = a.endTime.substr(0,5);
            a.enabled = a.enabled == 1?true:false;
          }
        this.list = res.data;
          console.log(this.list)
      },this)
    }
  },
  watch: {
    list: res => {
      console.log(res);
    }
  },mounted(){
    this.getSetting();
  },
};
</script>
<style scoped>

</style>

