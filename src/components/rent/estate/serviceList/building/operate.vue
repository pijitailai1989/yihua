<template>
  <yd-layout>
      <yd-navbar title="合作楼盘" slot="navbar" :bgcolor='mainColor' color='#fff' height='.88rem'>
          <yd-navbar-back-icon slot="left" @click.native="$router.go(-1)" color='#fff' class="addClickArea"></yd-navbar-back-icon>
          <!-- <div class="edit addRightClickArea"  @click="$router.push('/estate/serviceList/building/operate')"  slot="right" style="color: #fff;font-size:.28rem;">合作楼盘</div> -->
          <!-- <div @click="turnTo('/estate/serviceList/renovation/declares')" class="" style="color: #fff;font-size:.6rem;">+</span> -->
      </yd-navbar>
    <div class="mask" style="top:1.78rem" v-if="isFilter" @click="cancelIndex()">
      <div class="filter bgwhite" @click.stop="''">
        <!-- 筛选时间 -->
        <div class="timeFilter" v-show="currentIndex == 0">
					<div class="flex h8 pdlr2">
          	<span>当前选择:{{current.dictDataName}}</span>
						<div class="flex">
							<yd-button class="mr2" type='hollow' @click.native="cancelIndex()">取消</yd-button>
							<yd-button  class="mr2"  type='hollow' @click.native="confirmFn(0)">确定</yd-button>
						</div>
        	</div>
          <div class="myList">
            <div v-for="(item,index) in  areaList" style="flex:1" v-show="!item.show" v-if="item.length>0" :key="index">
              <div :class="['flex_list','flex1']"  v-for="(item1,index1) in item"  @click="setList(item1,index,index1)" :key="index1">
                <span :style="item1.selected?`color:${mainColor}`:''">{{item1.dictDataName}}</span> 
                <yd-icon size='.4rem' name='you' custom :color='item1.selected?mainColor:""'></yd-icon>
              </div>
            </div>
          </div>
        </div>
         <!-- 筛选状态 -->
         <div class="timeFilter" v-show="currentIndex == 1">
           <div class="flex h8 pdlr2">
          	<span>当前选择:{{current1.dictDataName}}</span>
						<div class="flex">
							<yd-button class="mr2" type='hollow' @click.native="cancelIndex()">取消</yd-button>
							<yd-button  class="mr2"  type='hollow' @click.native="confirmFn(1)">确定</yd-button>
						</div>
        	</div>
          <div class="myList">
            <!-- {{hangyeList[0]}} -->
            <div v-for="(item,index) in hangyeList" style="flex:1" :key="index">
              <div :class="['flex_list','flex1']"  v-for="(item1,index1) in item"  @click="setList1(item1,index,index1)" :key="index1">
                <span :style="item1.selected?`color:${mainColor}`:''">{{item1.name}}</span> 
                <yd-icon size='.4rem' name='you' custom :color='item1.selected?mainColor:""'></yd-icon>
              </div>
            </div>
          </div>
         </div>
         <!-- 筛选类型 -->
         <div class="flex-row statusFilte flex-start" v-show="currentIndex == 2">

         </div>
        </div>
        
    </div>
    <yd-infinitescroll style="margin-top:.2rem;" :callback="loadList" ref="infinitescrollDemo">
			<div style="padding:0;" class="" slot="list">
				<div class="list flex1" v-for="(item,index) in list" @click="toDetail(item)" :key="index">
					<div class="list_item flex-row-nowrap bgwhite">
						<!-- :style="`background:${item.bgColor}`" -->
							<div class="icon mr3">
									<!-- {{'财'}} -->
                  <img style="width:.8rem;height:.8rem;" :src="item.logo" alt="">
							</div>
							<!-- 左2 -->
							<div style="flex:1">
									<div class="font32 foCo0 mb1">{{item.buildingName}}</div>
							</div>
					</div>
          <div class="flex flex-end center" style="width:2rem;height:100%">
              <!-- <div class="contact" :style="{border:'1px solid ' + mainColor,color:mainColor}" @click="contact(item.account)">联系客服</div> -->
              <span class="state state1" v-if="item.isBuy == 0">已签</span>
              <span class="state state0" v-if="item.isBuy == 1">已签</span>
          </div>
			</div>
			</div>
			<!-- 数据全部加载完毕显示 -->
			<span slot="doneTip">啦啦啦，啦啦啦，没有数据啦~~</span>
    </yd-infinitescroll>
      
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
      current1: {}
    };
  },
  methods: {
    toDetail(e) {
      this.$router.push(
        `/estate/serviceList/building/detail?${this.$qs.stringify(e)}`
      );
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
    // 筛选地区
    setList(val, i, j) {
      if (i < 3) {
        this.getDistrict(val.guid, res => {
          this.$set(this.areaList, i * 1 + 1, res);
        });
      }
      for (var a = i; a < this.areaList.length; a++) {
        for (var b = 0; b < this.areaList[a].length; b++) {
          if (i == a && b == j) {
            this.$set(this.areaList[i][j], "selected", true);
            this.current = Object.assign({}, this.areaList[i][j]);
          } else {
            this.$set(this.areaList[a][b], "selected", false);
          }
        }
      }
      if (i == 0) {
        this.$set(this.areaList, 1, []);
        this.$set(this.areaList, 2, []);
        this.$set(this.areaList, 3, []);
        this.$set(this.areaList[0], "show", false);
      } else if (i == 1) {
        this.$set(this.areaList, 2, []);
        this.$set(this.areaList, 3, []);
        this.$set(this.areaList[0], "show", false);
      } else if (i == 2) {
        this.$set(this.areaList, 3, []);
        this.$set(this.areaList[0], "show", true);
      } else if (i == 3) {
      }
    },
    //筛选分类
    setList1(val, i, j) {
      if (i == 0) {
        var arr = this.hangyeList[i][j].subclass
          ? this.hangyeList[i][j].subclass
          : [];
        this.hangyeList[1] = arr;
      }
      for (var a = i; a < this.hangyeList.length; a++) {
        for (var b = 0; b < this.hangyeList[a].length; b++) {
          if (i == a && b == j) {
            this.$set(this.hangyeList[i][j], "selected", true);
            this.current1 = Object.assign({}, this.hangyeList[i][j]);
          } else {
            this.$set(this.hangyeList[a][b], "selected", false);
          }
        }
      }
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
      console.log(this.current,'1-1-1-1-1-1-')
      if (this.current.guid) {
        data.scopeValue = this.current.guid;
      }
      this.$ajax(
        `${this.subUrl.activity}/sob/myCooSobList`,
        data,
        res => {
          this.list = this.list.concat(res.data.list);
          console.log(this.list[0], "-----------------------");
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
    // this.getDistrict(0, res => {
    //   this.areaList[0] = res;
    //   this.$set(this.areaList, 0, res);
    // });
    // this.gethangye();
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
  border-bottom: 1px solid #ddd;
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


