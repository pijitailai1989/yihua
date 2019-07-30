<template>
  <div class="circle" v-title="'八爪圈'">
    <header slot="top" class="searchTitle" :style="'background-color:' + mainColor">
      <yd-search class="searchBox" v-model="keyword" :on-submit="submit"></yd-search>
      <div class="header_icon">
        <!--/circle/my_circle-->
        <router-link to="/circle/my_circle" slot="left">
          <img :src="userInfo.headPortrait?userInfo.headPortrait:listItemArr[0].headerUrl" />
        </router-link>
      </div>
    </header>
    <yd-layout class="layout">
      <div>
        <div class="circle_session" ref="circle_session">
          <!--下拉刷新-->
          <!-- <yd-pullrefresh :callback.stop.prevent="loadList" ref="pullrefreshDemo"> -->
          <yd-slider autoplay="3000" v-show="!isFilter" :loop="false">
            <!-- 对数据进行筛选 -->
            <yd-slider-item v-for='(item,i) in bbsList' v-bind:key='i'>
              <yd-grids-group :rows="4">
                <yd-grids-item class="items_navbar" v-for="(item1,j) in item" :key="j">
                  <img slot="icon" v-if='item.imgPath' :src="item.imgPath">
                  <span slot='icon' :style="{background:item1.color}" v-if='!item.imgPath' class="myIcon">{{item1.dictDataName[0]}}</span>
                  <span slot="text">{{item1.dictDataName}}</span>
                </yd-grids-item>
              </yd-grids-group>
            </yd-slider-item>
          </yd-slider>
          <!-- 筛选 -->
          <div class="flex_row" ontouchmove='return false'>
            <div class="flex_row_item" :class="{allActive:allActive[0]}" :style="allActive[0]?`color:${mainColor}`:``" @click="setActive(0)">全部
              <yd-icon name='toDown' v-if="!allActive[0]" size='.2rem' custom :color="'#999'"></yd-icon>
              <yd-icon name='shangla' v-if="allActive[0]" size='.2rem' custom :color='mainColor'></yd-icon>
            </div>
            <div class="flex_row_item" :class="{allActive:allActive[1]}" :style="allActive[1]?`color:${mainColor}`:``" @click="setActive(1)">附近
              <yd-icon name='toDown' v-if="!allActive[1]" size='.2rem' custom :color="'#999'"></yd-icon>
              <yd-icon name='shangla' v-if="allActive[1]" size='.2rem' custom :color='mainColor'></yd-icon>
            </div>
            <div class="flex_row_item" :class="{allActive:allActive[2]}" :style="allActive[2]?`color:${mainColor}`:``" @click="setActive(2)">综合排序
              <yd-icon name='toDown' v-if="!allActive[2]" size='.2rem' custom :color="'#999'"></yd-icon>
              <yd-icon name='shangla' v-if="allActive[2]" size='.2rem' custom :color='mainColor'></yd-icon>
            </div>
          </div>
          <!-- 公告 -->
          <div class="announce">
            <div v-for="(item,key) in announce" :key="key">
              <b :style="item.style">{{item.title}}</b>
              <span>{{item.content}}</span>
              <yd-button class="toTop" @click.native="toTop(key)" type="warning">置顶</yd-button>
            </div>
          </div>
          <!---->
          <yd-infinitescroll :callback="loadListTop" ref="infinitescrollDemo">
            <div class="content_list" slot="list">
              <card :listItem='listItem' v-for="(listItem,key) in listItemArr" :keyIndex="key" :key="key"></card>
            </div>
            <!-- 数据全部加载完毕显示 -->
            <span slot="doneTip">啦啦啦，啦啦啦，没有数据啦~~</span>
            <!-- 加载中提示，不指定，将显示默认加载中图标 -->
          </yd-infinitescroll>
          <!-- </yd-pullrefresh> -->
        </div>
      </div>
      <router-link to="/circle/my_circle/new_post" slot="bottom" class="toEdit">
        <img src="../../../assets/images/rent/circle/edit.png">
      </router-link>
    </yd-layout>

    <!--实际筛选内容-->
    <div class="filterOuter" ontouchmove='return false' v-on:click="closeFilter" v-show="isFilter">
      <div class="filterBox" v-on:click.stop.prevent='prevent()' ontouchmove="return true">
        <!--全部筛选部分-->
        <div class="allActive1" v-show="allActive[0]">
          <div class="left">
            <div v-for="(item,key) in filterAllData[0][0]" :key="item.guid" v-bind:style="showLeftSelected==key?`background:#f5f5f5;color:${mainColor}`:''"
              @click="showThis(key)">{{item.dictDataName}}</div>
          </div>
          <div class="right">
            <yd-radio-group v-model="filter1">
              <yd-radio class="yd-radio" :style="key1==filter1?`background:#f1f1f1`:'background:#fff'" v-for="(item1,key1) in filterList"
                @click.native="choose(key1,item1)" :key="item1.guid" :val="key1">
                <span class="yd_title">{{item1.dictDataName}}</span>
                <span class="yd_text">{{item1.guid}}</span>
              </yd-radio>
            </yd-radio-group>
          </div>
        </div>
        <!--附近一百米-->
        <div class="allActive1" v-show="allActive[1]">
          <div class="left">
            <div v-for="(item,key) in filterAllData[0][1]" v-if="key<1" :key="item.id" v-bind:style="showLeftSelected==key?`background:#f5f5f5;color:${mainColor}`:''"
              @click="showThis1(key,item)">{{item.title}}</div>
            <div v-for="(item,key) in filterAllData[0][1]" v-if="key>=1" :key="item.id" v-bind:style="showLeftSelected==key?`background:#f5f5f5;color:${mainColor}`:''"
              @click="showThis1(key,item.name)">{{item.name}}</div>
          </div>
          <div class="right">
            <yd-radio-group v-model="filter1">
              <yd-radio class="yd-radio" :style="key1==filter1?`background:#f1f1f1`:'background:#fff'" v-for="(item1,key1) in filterList1"
                @click.native="choose(key1,item1)" :key="item1.id" :val="key1">
                <span class="yd_title">{{item1.title}}</span>
                <span class="yd_text">{{item1.count}}</span>
              </yd-radio>
            </yd-radio-group>
          </div>
        </div>
        <!--综合排序-->
        <div class="allActive3" v-show="allActive[2]">
          <div class="main" @click="showThis2()" :style="`text-align:center;color:${mainColor};margin-top:1rem;`"> 综合排序</div>
        </div>
      </div>
    </div>
    <el-amap vid="amapDemo" :plugin="plugins" class="amap-demo">
    </el-amap>
  </div>
</template>
<script>
  import Vue from "vue";
  import BScroll from "better-scroll";
  import card from "./card.vue";
  import fn from '@/assets/js/product.js'
  import qs from "qs";
  import axios from "axios";
  //下拉刷新组件
  import { PullRefresh } from "vue-ydui/dist/lib.rem/pullrefresh";
  Vue.component(PullRefresh.name, PullRefresh);
  import { InfiniteScroll } from "vue-ydui/dist/lib.rem/infinitescroll";
  Vue.component(InfiniteScroll.name, InfiniteScroll);
  //搜索组件
  import { Search } from "vue-ydui/dist/lib.rem/search";
  //栅格系统
  import { GridsGroup, GridsItem } from "vue-ydui/dist/lib.rem/grids";
  Vue.component(GridsGroup.name, GridsGroup);
  Vue.component(GridsItem.name, GridsItem);
  Vue.component(Search.name, Search);
  import { Slider, SliderItem } from "vue-ydui/dist/lib.rem/slider";
  Vue.component(Slider.name, Slider);

  Vue.component(SliderItem.name, SliderItem);
  import { Radio, RadioGroup } from "vue-ydui/dist/lib.rem/radio";

  Vue.component(Radio.name, Radio);
  Vue.component(RadioGroup.name, RadioGroup);
  import VueAMap from "vue-amap";
  Vue.use(VueAMap);
  VueAMap.initAMapApiLoader({
    key: "8a460d7bfd797e46302bd627782d7f2e",
    plugin: [
      "Autocomplete",
      "PlaceSearch",
      "Scale",
      "Geocoder",
      "OverView",
      "ToolBar",
      "MapType",
      "PolyEditor",
      "Geolocation"
    ]
  });
  function getDistrict(keyword, cb) {
    axios
      .post(
      "http://restapi.amap.com/v3/config/district",
      qs.stringify({
        keywords: keyword,
        district: 2,
        key: "b2ef2ca03fdd7aea944a43551b5f0462"
      })
      )
      .then(res => {
        cb && cb(res.data.districts[0].districts);
      });
  }
  export default {
    components: {
      card
    },
    data() {
      var mainColor = '';
      var userInfo = {}
      let TypeListCircle;
      console.log();
      var info = this.$route.query;
      if (info.userId) {
        this.$ajax(`${this.subUrl.user}/user/getUserInfo`, { userId: info.userId, token: info.token }, res => {
          console.log(res);
          localStorage.setItem('userInfo', encodeURIComponent(JSON.stringify(res.data.userInfo)));
          localStorage.setItem('organInfo', encodeURIComponent(JSON.stringify(res.data.organInfo)));
          localStorage.setItem('to', encodeURIComponent(res.data.token));
          fn.setIng(info.token);
          this.userInfo = res.data.userInfo;
          this.organInfo = res.data.organInfo;
          this.mainColor = this.$color[this.userInfo.organType]
          var a = res.data.userInfo.organType;
          var b = res.data.userInfo.admin ? 1 : 0;
          localStorage.setItem('organType', a);
          localStorage.setItem('isManger', b);
          localStorage.setItem('user_Id', res.data.userInfo.guid);
          localStorage.setItem('mainColor', that.$color[res.data.userInfo.organType])
          var userType = this.userInfo.organType;
          if (userType == 1) {
            TypeListCircle = 1;
          } else if (userType == 4) {
            TypeListCircle = 3;
          } else if (userType == 5) {
            TypeListCircle = 2
          }
          this.circleType = TypeListCircle;
        })
      } else {
        userInfo = JSON.parse(
          decodeURIComponent(localStorage.getItem("userInfo"))
        );
        mainColor = this.$color[userInfo.organType];
        var userType = userInfo.organType;
        if (userType == 1) {
          TypeListCircle = 1;
        } else if (userType == 4) {
          TypeListCircle = 3;
        } else if (userType == 5) {
          TypeListCircle = 2
        }
        this.circleType = TypeListCircle;
      }

      var that = this;
      var key = info.token ? info.token : this.$getkey();
      // 设置主色
      return {
        info,
        mainColor,
        userInfo,
        filter1: 1,
        radio2: "1",
        getkey: key,
        plugins: [
          {
            pName: "Geolocation",
            events: {
              init(o) {
                // o 是高德地图定位插件实例
                o.getCurrentPosition((status, result) => {
                  if (result && result.position) {
                    console.log(result);
                    getDistrict(
                      result.addressComponent.city.replace(/省|市|区/, ""),
                      function (res) {
                        that.cityList = res;
                        var arr = that.filterAllData[0][1];
                        arr = arr.concat(res);
                        that.$set(that.filterAllData[0], 1, arr);
                        console.log(that.filterAllData);
                      }
                    );
                  }
                });
              }
            }
          }
        ],
        page: 1,
        cityList: [],
        pageSize: 15,
        keyword: "",
        isFilter: false,
        allActive: [false, false, false],
        checkbox6: [1],
        style_title: "",
        acIdx: 1,
        listItemArr: [],
        pageNo: 1,
        pageCount: 1,
        pageSize: 15,
        filterList: [],
        filterList1: [],
        userInfo: userInfo,
        filterAllData: [
          [
            [
              {
                title: "全部",
                style: "",
                subArr: [
                  {
                    title: "全部1",
                    count: "87",
                    style: ""
                  },
                  {
                    title: "求助类1",
                    count: "87",
                    style: ""
                  },
                  {
                    title: "求租1",
                    style: "",
                    count: "87"
                  },
                  {
                    title: "求购1",
                    style: "",
                    count: "87"
                  }
                ]
              },
              {
                title: "求助类",
                style: "",
                subArr: [
                  {
                    title: "全部求助",
                    style: ""
                  },
                  {
                    title: "求助类2",
                    count: "87",
                    style: ""
                  },
                  {
                    title: "求租2",
                    style: "",
                    count: "87"
                  },
                  {
                    title: "求购2",
                    style: "",
                    count: "87"
                  }
                ]
              },
              {
                title: "服务类",
                style: "",
                subArr: [
                  {
                    title: "全部服务",
                    count: "87",
                    style: ""
                  },
                  {
                    title: "服务1",
                    count: "87",
                    style: ""
                  },
                  {
                    title: "服务2",
                    style: "",
                    count: "87"
                  },
                  {
                    title: "服务3",
                    style: "",
                    count: "87"
                  }
                ]
              },
              {
                title: "其它",
                style: "",
                subArr: [
                  {
                    title: "其它1",
                    count: "87",
                    style: ""
                  },
                  {
                    title: "求助类4",
                    count: "87",
                    style: ""
                  }
                ]
              }
            ],
            [
              {
                title: "附近",
                style: "",
                subArr: [
                  {
                    title: "1000米内",
                    count: "87",
                    style: ""
                  },
                  {
                    title: "3000米内",
                    count: "87",
                    style: ""
                  },
                  {
                    title: "5000米以内",
                    count: "87",
                    style: ""
                  }
                ]
              }
            ]
          ]
        ],

        announce: [
          {
            title: "[企业活动]",
            content: "五一集体活动招募中",
            isTop: false,
            style: "color:#fab23e"
          },
          {
            title: "[招兵买马]",
            content: "五一集体活动招募中",
            isTop: false,
            style: "color:#ef6a6f"
          },
          {
            title: "[产品发布]",
            content: "五一集体活动招募中",
            isTop: false,
            style: "color:#0093d2"
          }
        ],
        bbsList: [[]],
        showLeftSelected: 1
      };
    },
    methods: {
      // getbbsType(data) {
      //   data = data ? data : {};
      //   if(this.userInfo.organType==5){
      //     data.circleType=2
      //   }else if(this.userInfo.organType==4){
      //     data.circleType=3
      //   }else{
      //     data.circleType=1
      //   }
      //   data.token = this.getkey;
      //   this.$ajax(
      //     `${this.subUrl.sc}/bbs/getBBsType`,
      //     data,
      //     res => {
      //       console.log(res,11111111111111)
      //       this.bbsList = res.data;
      //     },
      //     this
      //   );
      // },
      randomColor: function () {
        var i = Math.round(Math.random() * 4);
        var colorArr = ['#3eb7e6', '#62c88c', '#fab23e', '#fa697c', '#adb8c0']
        return colorArr[i];
      },
      setArr(arr, num) {
        console.log(arr, num)
        var count = 0;
        var new_arr = [];
        var new_arr_child = [];
        count = i % num;
        for (var i in arr) {
          arr[i].color = this.randomColor();
          new_arr_child.push(arr[i]);
          if (i % num == (num - 1)) {
            new_arr.push(new_arr_child);
            new_arr_child = [];
          }
        }
        //最后一次也要加上去
        if (count != num) {
          new_arr.push(new_arr_child);
        }
        return new_arr;
      },
      // 获取帖子类型
      getbbsType(data) {
        data = data ? data : {};
        if(this.userInfo.organType==5){
          data.circleType=2
        }else if(this.userInfo.organType==4){
          data.circleType=3
        }else{
          data.circleType=1
        }
        data.token = this.getkey;

        this.$ajax(
          `${this.subUrl.sc}/bbs/getBBsType`,
          data,
          res => {
            this.filterAllData[0][0]=res.data;
            this.filterAllData[0][0].unshift({dictDataName:'全部'})
            // 将数组拆分为每次3个
            var arr = res.data;
            var newArr = [];
            for (var i in arr) {
              for (var j in arr[i].childDictData) {
                newArr.push(arr[i].childDictData[j])
              }
              newArr.push(arr[i])
            }
            
            this.bbsList = this.setArr(newArr, 8);
            
          },
          this
        );
      },
      showThis(index) {
        if (index > 0) {
          this.filterList = [];
          this.showLeftSelected = index;
          this.filterList = this.filterAllData[0][0][index].childDictData;
        } else {
          this.$dialog.toast({ mes: "您选择了全部", timeout: 1000 });
          this.closeFilter();
        }
      },
      showThis1(index, item) {
        if (index < 1) {
          this.filterList = [];
          this.showLeftSelected = index;
          this.filterList = this.filterAllData[0][1][index].subArr;
        } else {
          this.filterList = [];
          this.showLeftSelected = index;
          this.filterList = [];
          this.$dialog.toast({ mes: "你选择了" + item, timeout: 1000 });
          this.closeFilter();
        }
      },
      showThis2() {
        this.$dialog.toast({ mes: "你选择了综合排序", timeout: 1000 });
        this.closeFilter();
      },
      choose(i, item) {
        this.filter1 = i;
        this.$dialog.toast({ mes: `您选择了${item.dictDataName}`, timeout: 1000 });
        this.closeFilter();
      },
      // 获取消息
      getList(data, cb) {
        data = data ? data : {};
        data.token = this.getkey;
        data.userId = this.userInfo.guid;
        data.pageSize = this.pageSize ? this.pageSize : 15;
        data.circleType = this.circleType;
        console.log(data.circleType,222222222222222222);
        // console.log(data);
        this.$ajax(
          `${this.subUrl.sc}/bbs/queryBycircleType`,
          data,
          res => {
            cb && cb(res);
            console.log(res);
            this.listItemArr = this.listItemArr.concat(res.data.list)
            if (
              this.pageNo >= this.pageCount ||
              res.data.list.length < this.pageSize
            ) {
              this.$refs.infinitescrollDemo.$emit(
                "ydui.infinitescroll.loadedDone"
              );
            }
            this.pageNo = this.pageNo * 1 + 1;
          },
          this
        );
      },
      loadList() {
        const url = "http://list.ydui.org/getdata.php";
        let listItemArr = this.listItemArr;
        if (this.listItemArr.length < 60) {
          this.listItemArr = [...listItemArr, ...this.listItemArr];
          setTimeout(() => {
            // this.scroll.refresh();
          }, 30);
        }
        setTimeout(() => {
          this.$refs.pullrefreshDemo.$emit("ydui.pullrefresh.finishLoad");
          let len = listItemArr.length;
          let txt = this.listItemArr.length < 60 ? "为" + len + "条内容" : "已经是最新内容";
          this.$dialog.toast({
            mes: txt
          });
          this.page++;
        }, 1000);
      },
      loadListTop() {
        console.log(111);
        const _list = this.list;
        const listItemArr = this.listItemArr;
        if (this.page == 3) {
          /* 所有数据加载完毕 */
          this.$refs.infinitescrollDemo.$emit("ydui.infinitescroll.loadedDone");
          return;
        }
        /* 单次请求数据完毕 */
        setTimeout(() => {
          this.listItemArr = [...this.listItemArr, ...listItemArr];
          this.$refs.infinitescrollDemo.$emit("ydui.infinitescroll.finishLoad");
          this.page++;
        }, 2000);
      },
      submit() {
        console.log(this.keyword);
      },
      prevent() { },
      toTop(i) {
        var temp = this.announce.splice(i, 1);
        this.announce.unshift(temp[0]);
      },
      filter(p) {
        this.setActive(p);
      },
      closeFilter() {
        this.setActive(-1);
        this.isFilter = false;
      },
      setActive(e) {
        this.isFilter = true;
        if (e == 1) {
        }
        for (var i = 0; i < this.allActive.length; i++) {
          if (i == e) {
            this.$set(this.allActive, i, true);
          } else {
            this.$set(this.allActive, i, false);
          }
        }
      }
    },
    mounted() {
      this.rParams = this.$route.params;
      this.filterList = this.filterAllData[0][0][1].childDictData;
      this.filterList1 = this.filterAllData[0][1][0].subArr;
      
      this.getList();
      this.getbbsType();
      console.log(this.listItemArr)
    }
  };
</script>
<style scoped>
  /* 文字图标 */

  .myIcon {
    display: block;
    width: .92rem;
    height: .92rem;
    border-radius: 50%;
    text-align: center;
    line-height: .92rem;
    color: #fff;
    font-size: .4rem;
    background: #5ac5fc;
  }

  .yd-radio {
    display: flex;
    align-items: center;
    background: #fff;
    padding: 0 0.2rem;
  }

  .yd-radio .yd-radio-text {
    display: flex;
  }

  .layout {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 1.1rem;
    z-index: 1;
    height: auto;
  }

  .circle {
    min-height: 100%;
  }

  /* 跳转到编辑页面 */

  .toEdit {
    position: absolute;
    right: 0.3rem;
    bottom: 1.75rem;
    z-index: 11;
  }

  .toEdit img {
    width: 0.6rem;
    height: 0.6rem;
  }

  /*筛选部分*/

  .filterBox {
    background: #fff;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    margin-top: -1px;
  }

  /*筛选部分结束*/

  .header_icon {
    width: 0.6rem;
    height: 0.6rem;
    margin-right: 0.24rem;
    background: #fff;
    border-radius: 50%;
    overflow: hidden;
  }

  .announce {
    border-bottom: 1px solid #ddd;
  }

  .announce>div {
    display: flex;
    padding: 0 0.24rem;
    background: #fff;
    height: 0.8rem;
    align-items: center;
    border-bottom: 1px dashed #ddd;
  }

  .announce>div:last-child {
    border: none;
  }

  .announce>div span {
    flex: 1;
    padding: 0 0.2rem;
  }

  .announce .toTop {
    background: #b2b2b2;
    height: 0.48rem;
  }

  .circle_session {
    position: absolute;
    top: 1rem;
    right: 0;
    left: 0;
  }

  .header_icon img {
    width: 100%;
    height: 100%;
  }

  .searchTitle {
    position: absolute;
    align-items: center;
    width: 100%;
    z-index: 10;
  }

  .searchTitle {
    display: flex;
    height: 1rem;
  }

  .searchTitle .searchBox {
    display: flex;
    height: 1rem;
    flex: 1;
    align-items: center;
  }

  .items_navbar img {
    width: 0.92rem;
    height: 0.92rem;
  }

  .flex_row {
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    box-sizing: border-box;
    overflow: hidden;
  }

  .flex_row,
  .flex_row_item {
    display: flex;
    align-items: center;
    height: 0.72rem;
    background: #fff;
  }

  .flex_row_item {
    flex: 1;
    justify-content: center;
  }

  .flex_row_item img:nth-child(1) {
    width: 0.13rem;
    height: 0.09rem;
    margin-left: 0.15rem;
  }

  .filterOuter {
    position: absolute;
    left: 0;
    right: 0;
    top: 1.72rem;
    bottom: 0;
    background: rgba(0, 0, 0, 0.15);
    z-index: 1;
  }

  .allActive {
    color: #5ac5fc;
  }

  .filterOuter .filterBox {
    overflow: hidden;
    height: 3.2rem;
    position: relative;
    border-bottom: 1px solid #ddd;
  }

  .filterOuter .filterBox .allActive1 .left {
    position: absolute;
    left: 0;
    width: 2.2rem;
    height: 100%;
    overflow: auto;
  }

  .filterOuter .filterBox .allActive1 .right {
    position: absolute;
    left: 2.2rem;
    right: 0rem;
    height: 100%;
    overflow: auto;
  }

  .filterOuter .filterBox .allActive1 .right>div>div {
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    margin-top: -1px;
    height: 0.72rem;
  }

  .filterOuter .filterBox>div>div>div {
    height: 0.72rem;
    text-align: center;
    line-height: 0.72rem;
    margin-top: -1px;
  }

  .filterOuter .left>div {
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
  }

  .filterOuter .checkBox {
    display: flex;
    align-items: center;
    margin-left: 0.2rem;
  }

  .filterOuter .count {
    padding-right: 0.25rem;
  }

  .filterOuter .checkBox .title {
    padding-left: 0.2rem;
  }
</style>