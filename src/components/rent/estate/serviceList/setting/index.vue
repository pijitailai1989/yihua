<template>
<div style="height:100vh">
  <yd-layout v-show="showDetail">
      <yd-navbar title="业务信息设置" slot="navbar" :bgcolor='mainColor' color='#fff' height='.88rem'>
          <yd-navbar-back-icon slot="left" @click.native="$router.go(-1)" color='#fff' class="addClickArea"></yd-navbar-back-icon>
          <div class="edit addRightClickArea"  @click="$router.push('/estate/serviceList/setting/add')"  slot="right" style="color: #fff;font-size:.6rem;">+</div>
          <!-- <div @click="turnTo('/estate/serviceList/renovation/declares')" class="" style="color: #fff;font-size:.6rem;">+</span> -->
      </yd-navbar>
      <div style="padding:.2rem 0 .5rem;">
        <div v-for="item1,index1 in list" :key="index1" v-if="item1.subclass.length>0" style="margin-bottom:.2rem;">
          <div class="title foCo9 flex h9 bgwhite bt bb" @click="setClose(index1)" style="padding:0 .24rem;">
            <span>{{item1.typeName}}</span>
            <yd-icon name='xia'  v-if="!item1.selected"  custom size='.4rem' color='#999'></yd-icon>
            <yd-icon name='shang' v-else custom size='.4rem' color='#999'></yd-icon>
          </div>
          <div class="list" v-show="!item1.selected" @click="checkDetail(item)" v-for="item,index in item1.subclass" :key="index">
            <div class="list_item flex-row-nowrap bgwhite">
              <div class="flex">
                  <!-- 左1 -->
                <div class="icon mr3" :style="`background:${item.bgColor}`">
                    {{item.typeName[0]}}
                </div>
                <!-- 左2 -->
                <div>
                  <div class="font32 foCo0">{{item.typeName}}</div>
                  <div class="font24 foCo9">
                    <span>总额/签约:</span>
                    <span>{{item.amount}}/{{item.num?item.num:0}}</span>
                  </div>
                </div>
              </div>
              <div class="flex" style="width:3rem;">
                <!-- 左3 -->
                <div style="margin-right:.6rem;">
                  <div class="font36" style="color:#f2725e">{{item.cost}}</div>
                  <div class="font24 foCo9">元/月</div>
                </div>
                <!-- 左4 -->
                <div>
                  <!--  0未开发；1未满；2已满 , -->
                  <span class="state state2" v-if="item.status == 0">未开发</span>
                  <span class="state state1" v-if="item.status == 1">未满</span>
                  <span class="state state0" v-if="item.status == 2">已满</span>
                </div>
                </div>
            </div>
            
				  </div>
        </div>
        <div class="flex-row bgwhite center jusCenter foCo9 h8" v-if="list.length == 0">暂无数据</div>
        
    </div>
  </yd-layout>
  <Detail v-if="!showDetail" :accessObj = "accessObj" @mClose="mClose"></Detail>
  </div>
</template>
<script>
import Detail from "./detail";
export default {
  components: {
    Detail
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
      userInfo,
      organInfo,
      list: [],
      showDetail: true,
      accessObj: {}
    };
  },
  methods: {
    // 查看详情
    mClose() {
      this.showDetail = true;
    },
    checkDetail(e) {
      this.accessObj = e;
      this.showDetail = false;
    },
    randomColor: function() {
      var i = Math.round(Math.random() * 4);
      var colorArr = ["#3eb7e6", "#62c88c", "#fab23e", "#fa697c", "#adb8c0"];
      return colorArr[i];
    },
    setClose(e) {
      for (let [i, val] of this.list.entries()) {
        if (i == e) {
          if (val.selected) {
            this.$set(this.list[i], "selected", false);
          } else {
            this.$set(this.list[i], "selected", true);
          }
        }
      }
    },
    getList() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        organId: this.organInfo.guid
      };
      this.$ajax(
        `${this.subUrl.activity}/sob/getSetSobList`,
        data,
        res => {
          for (var val of res.data) {
            for (var val1 of val.subclass) {
              val1.bgColor = this.randomColor();
            }
          }
          this.list = res.data;
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
  border-bottom: 1px solid #ddd;
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


