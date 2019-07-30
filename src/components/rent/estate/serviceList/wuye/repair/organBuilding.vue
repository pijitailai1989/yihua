<template>
  <yd-layout>
      <yd-navbar title="选择写字楼" slot="navbar" :bgcolor='mainColor' color='#fff' height='.88rem'>
          <yd-navbar-back-icon slot="left" @click.native="mClose" color='#fff' class="addClickArea"></yd-navbar-back-icon>
      </yd-navbar>
    
      <yd-infinitescroll style="margin-top:.2rem;" :callback="loadList" ref="infinitescrollDemo">
			<div style="padding:0;" class="" slot="list">
        <div class="flex-row-nowrap pdlr2 bgwhite flex-start">
          <div class="flex flex-end center" style="width:.6rem">
          </div>
          <div class="list_item flex-row-nowrap bgwhite">
              <div class="font32 foCo0 mb1 nowrap" style="max-width:3.5rem;width:3.5rem">管理处名称</div>
          </div>
         <div>评分</div>
            
          <div class="flex1 flex-end">
            <span>距离</span>
          </div>
        </div>
				<div class="list flex1 pdlr2 flex-start" v-for="(item,index) in list" @click="toDetail(item,index)" :key="index">
            <div class="flex flex-end center" style="width:.6rem">
                <yd-icon name='selected' custom size='.46rem' :color='mainColor' v-if="item.selected" ></yd-icon>
                <yd-icon name='select' custom  size='.4rem' v-else ></yd-icon>
            </div>
            <div class="list_item flex-row-nowrap bgwhite">
                <div class="font32 foCo0 mb1 nowrap" style="max-width:3.5rem;width:3.5rem">{{item.organName}}</div>
            </div>
            <div>{{item.grade}}</div>
            
            <div class="flex1 flex-end">
              <span>{{item.distance}}km</span>
            </div>
			</div>
			</div>
			<!-- 数据全部加载完毕显示 -->
			<span slot="doneTip">啦啦啦，啦啦啦，没有数据啦~~</span>
        </yd-infinitescroll>
      <div class="flex-row jusCenter h8 bt bgwhite" @click="confirm" slot="bottom">确定</div>
  </yd-layout>
</template>
<script>
export default {
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
      currentIndex: -1,
      currentIndex1: -1,
      isFilter: false,
      current: {},
      pageNo: 1,
      areaList: [[], [], [], []],
      hangyeList: [[], []],
      current1: {},
      selectIndex: -1
    };
  },
  methods: {
    confirm() {
      var flag = false;
      var arr = [];
      for (var a of this.list) {
        console.log(a);
        if(a.selected){
          arr.push(JSON.parse(JSON.stringify(a)));
          flag = true;
        }
      }
      if (!flag) {
        return this.$dialog.toast({ mes: "请选择楼宇", timeout: "1000" });
      }else{
        this.$emit("getBuilding",arr);
      }


    },
    mClose() {
      this.$emit("getBuilding");
    },
    toDetail(e, index) {
      this.selectIndex = index;
      for (var [i, val] of this.list.entries()) {
        if (i == index) {
          if (this.list[i].selected) {
            this.$set(this.list[i], "selected", false);
          } else {
            this.$set(this.list[i], "selected", true);
          }
        }
      }
    },
    randomColor: function() {
      var i = Math.round(Math.random() * 4);
      var colorArr = ["#3eb7e6", "#62c88c", "#fab23e", "#fa697c", "#adb8c0"];
      return colorArr[i];
    },
    cancelIndex() {
      this.currentIndex = -1;
      this.isFilter = false;
    },
    chooseIndex(e) {
      this.currentIndex = e;
      this.isFilter = true;
    },
    confirmFn(e) {
      if (e == 0) {
        // this.$dialog.toast({ mes: "您选择的是" + this.current.dictDataName });
        this.list = [];
        this.pageNo = 1;
        this.getList();
        this.$refs.infinitescrollDemo.$emit("ydui.infinitescroll.loadedDone");
      }
      this.currentIndex = -1;
      this.isFilter = false;
    },
    gethangye() {
      this.$ajax(
        `${this.subUrl.user}/comm/getIndustryCategory`,
        {},
        res => {
          this.hangyeList[0] = this.hangyeList[0]
            .concat(res.data.pmc)
            .concat(res.data.icc);
        },
        this
      );
    },
    getDistrict(id, cb) {
      let data = {
        id
      };
      this.$ajax(
        `${this.subUrl.user}/comm/getDistrictList`,
        data,
        res => {
          cb && cb(res.data);
        },
        this
      );
    },
    contact(e) {
      e = e ? e : "15707973128";
      this.$dialog.alert({
        mes: "请联系客服" + e
      });
    },
    loadList() {
      this.getList();
    },
    getList() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        organId: this.organInfo.guid,
        pageNo: this.pageNo
      };
      if (this.current.guid) {
        data.scopeValue = this.current.guid;
      }
      this.$ajax(
        `${this.subUrl.activity}/sob/getBuySobList`,
        data,
        res => {
          this.list = this.list.concat(res.data);
          for (var val of this.list) {
            var distance = (val.distance + "").split(".");
            if (distance[1]) {
              val.distance = distance[0] + "." + distance[1].substring(0, 2);
            } else {
              val.distance = distance[0];
            }
          }
          if (res.data.pageCount <= this.pageNo) {
            this.$refs.infinitescrollDemo.$emit(
              "ydui.infinitescroll.loadedDone"
            );
          } else {
            this.$refs.infinitescrollDemo.$emit(
              "ydui.infinitescroll.finishLoad"
            );
          }
          this.pageNo++;
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
  justify-content: space-between;
  padding-right: 0.2rem;
}
.list_item {
  margin-left: 0.45rem;
  padding: 0.2rem 0.3rem 0.2rem 0;
  /* border-bottom: 1px solid #ddd; */
}
.list_item:last-child {
  margin-bottom: -1px;
}
.list_item .icon {
  width: 0.8rem;
  height: 0.8rem;
  /* border-radius: 50%; */
  /* border: 1px solid #ddd; */
  text-align: center;
  line-height: 0.8rem;
  font-size: 0.4rem;
  color: #fff;
}
.contact {
  line-height: 0.6rem;
  padding: 0 0.1rem;
  border-radius: 0.1rem;
}
.myButton {
  width: 1.56rem;
  border: 1px solid #fff;
}
.timeFilter {
  /* display: flex; */
  /* flex-flow: row nowrap; */
  padding: 0;
}
.flex_list {
  padding: 0 0.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 0.7rem;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  margin-bottom: -1px;
}
.myList {
  display: flex;
}
.myList > div {
  max-height: 5rem;
  overflow-y: auto;
  overflow-x: hidden;
}
.myList span {
  width: 1.5rem;
}
/*  */
.statusFilte {
  padding: 0.24rem 0.42rem;
  padding-bottom: 0;
}
.myButton {
  margin-right: 0.2rem;
  margin-bottom: 0.2rem;
}
.filter {
  top: 0;
  left: 0;
  right: 0;
  top: 0;
  width: 100%;
  box-sizing: border-box;
  /* padding: 0 0 0.5rem; */
  transform: translate(0, 0);
  background: #fff;
  border-radius: 0;
}
.layout_my .header:after {
  display: none;
}

.layout_my {
  background: #f7f7f9;
}

.layout_my .blue_box {
  height: 0.88rem;
  background: #0093d2;
  background-size: 100% 100%;
}

.headTab {
  width: 100%;
  height: 0.9rem;
  background: white;
}
.headTab .flex1 {
  border-bottom: 2px solid #fff;
}
.headTab .flex1.active {
  color: rgb(30, 130, 210);
  border-color: rgb(30, 130, 210);
}
.headTab ul {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row;
}

.headTab ul li {
  width: 25%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.32rem;
}
</style>


