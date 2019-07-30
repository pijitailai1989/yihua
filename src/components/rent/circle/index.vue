<template>
  <div class="circle" v-title="'八爪圈'" v-if="showContent">
    <yd-navbar class="searchTitle" height=".88rem" v-show="!userAgent.isWX" title="八爪圈" :bgcolor="mainColor"
               color="#fff">
      <div @click='turnTo("/circle/my_circle")' class="addRightClickArea" slot="right">
        <span class="fong28" style="color:white;">我的八爪</span>
      </div>
    </yd-navbar>

    <yd-layout class="layout">
      <div class="show filterContent" slot="top" v-if="show" @click="cancel">
        <div @click.stop="''">
          <div class="flex_row" ontouchmove='return false'>
            <div class="flex_row_item" :class="{allActive:allActive[0]}"
                 :style="allActive[0]?`color:${mainColor}`:``" @click="setActive(0)">
              <span v-show="region==''">区域</span>
              <span v-show="region!=''">{{region}}</span>
              <yd-icon name='toDown' v-if="allActive[0]" size='.2rem' custom :color="mainColor"></yd-icon>
              <yd-icon name='shangla' v-if="!allActive[0]" size='.2rem' custom :color='"#999"'></yd-icon>
            </div>
            <div class="flex_row_item" :class="{allActive:allActive[1]}"
                 :style="allActive[1]?`color:${mainColor}`:``" @click="setActive(1)">全部分类
              <yd-icon name='toDown' v-if="allActive[1]" size='.2rem' custom :color="mainColor"></yd-icon>
              <yd-icon name='shangla' v-if="!allActive[1]" size='.2rem' custom :color='"#999"'></yd-icon>
            </div>
            <div class="flex_row_item" :class="{allActive:allActive[2]}"
                 :style="allActive[2]?`color:${mainColor}`:``" @click="setActive(2)">综合排序
              <yd-icon name='toDown' v-if="allActive[2]" size='.2rem' custom :color="mainColor"></yd-icon>
              <yd-icon name='shangla' v-if="!allActive[2]" size='.2rem' custom :color='"#999"'></yd-icon>
            </div>
          </div>
          <div v-if="show0">
            <div class="navigation">
              <p>
                <span>当前区域</span>
                <span v-if="city!=''">&nbsp;{{city}}</span>
              </p>
              <p>
                <span @click="cancel">取消</span>
                <span @click="determine(0)">确定</span>
              </p>
            </div>
            <div class="hierarchy">
              <ul v-if="districtList.length>0">
                <li v-for="(item,index) in districtList"
                    :key="index"
                    :style="{color:index1==index?mainColor:'#999',background:index1==index?'#F8F9FA':'#fff'}"
                    @click="getDistrictList(index,item.guid,1,item.dictDataName)">{{item.dictDataName}}
                  <i v-if="index1==index">></i></li>
              </ul>
              <ul v-if="districtList1.length>0" style="background:#F8F9FA;">
                <li v-for="(item,index) in districtList1"
                    :key="index"
                    :style="{color:index2==index?mainColor:'#999',background:index2==index?'#F8F9FA':'#fff'}"
                    @click="getDistrictList(index,item.guid,2,item.dictDataName)">{{item.dictDataName}}
                  <i v-if="index2==index">></i></li>
              </ul>
              <ul v-if="districtList2.length>0" style="background:#F8F9FA;">
                <li v-for="(item,index) in districtList2"
                    :key="index"
                    :style="{color:index3==index?mainColor:'#999',background:index3==index?'#F8F9FA':'#fff'}"
                    @click="getDistrictList(index,item.guid,3,item.dictDataName)">{{item.dictDataName}}
                  <i v-if="index3==index">></i></li>
              </ul>
              <ul v-if="districtList3.length>0" style="background:#F8F9FA;">
                <li v-for="(item,index) in districtList3"
                    :key="index"
                    :style="{color:index4==index?mainColor:'#999',background:index4==index?'#F8F9FA':''}"
                    @click="getDistrictList(index,item.guid,4,item.dictDataName)">{{item.dictDataName}}
                </li>
              </ul>
            </div>
          </div>
          <div v-if="show1">
            <div class="navigation">
              <p>
                <span>当前分类</span>
                <span v-if="classify!=''">&nbsp;{{classify}}</span>
              </p>
              <p>
                <span @click="cancel">取消</span>
                <span @click="determine(1)">确定</span>
              </p>
            </div>
            <div class="hierarchy">
              <ul v-if="classifyList.length>0">
                <li v-for="(item,index) in classifyList" :key="index"
                    :style="{color:index5==index?mainColor:'#999',background:index5==index?'#F8F9FA':''}"
                    @click="getbbsType(true,index,item.dictDataName,item.guid)">{{item.dictDataName}}
                  <i v-if="index5==index">></i></li>
              </ul>
              <ul v-if="classifyList1.length>0" style="background:#F8F9FA;">
                <li v-for="(item,index) in classifyList1" :key="index"
                    :style="{color:index6==index?mainColor:'#999'}"
                    @click="getbbsType(false,index,item.dictDataName,item.guid)">{{item.dictDataName}}
                </li>
              </ul>

            </div>
          </div>
          <div v-if="show2">
            <div class="hierarchy">
              <ul>
                <li @click="selectS(1)">最新发布</li>
                <li @click="selectS(2)">人气最高</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="circle_session" ref="circle_session">
          <!--下拉刷新-->
          <!-- <yd-pullrefresh :callback.stop.prevent="loadList" ref="pullrefreshDemo"> -->
          <yd-slider autoplay="3000" style="height:2.4rem" v-show="!imgs" :loop="false">
            <!-- 对数据进行筛选 -->
            <yd-slider-item>
              <a><img src="../../../assets/images/rent/circle/banner.png"></a>
            </yd-slider-item>
            <yd-slider-item>
              <a><img src="../../../assets/images/rent/circle/banner.png"></a>
            </yd-slider-item>
            <yd-slider-item>
              <a><img src="../../../assets/images/rent/circle/banner.png"></a>
            </yd-slider-item>
          </yd-slider>
          <!-- 公告 -->
          <div class="announce" v-show="imgs">
            <div v-for="(item,key) in announce" class="h8" :key="key" @click="goTo(item.guid)">
              <b>【{{item.typeName}}】</b>
              <span>{{item.title}}</span>
              <yd-button class="toTop" @click.native="toTop(key)" type="warning">置顶</yd-button>
            </div>
          </div>
          <!-- 筛选 -->
          <div class="flex_row" ontouchmove='return false'>
            <div class="flex_row_item" :class="{allActive:allActive[0]}" :style="allActive[0]?`color:${mainColor}`:``"
                 @click="setActive(0)">
              <span v-show="region==''">区域</span>
              <span v-show="region!=''">{{region}}</span>
              <yd-icon name='toDown' v-if="allActive[0]" size='.2rem' custom :color="mainColor"></yd-icon>
              <yd-icon name='shangla' v-if="!allActive[0]" size='.2rem' custom :color='"#999"'></yd-icon>
            </div>
            <div class="flex_row_item" :class="{allActive:allActive[1]}" :style="allActive[1]?`color:${mainColor}`:``"
                 @click="setActive(1)">全部分类
              <yd-icon name='toDown' v-if="allActive[1]" size='.2rem' custom :color="mainColor"></yd-icon>
              <yd-icon name='shangla' v-if="!allActive[1]" size='.2rem' custom :color='"#999"'></yd-icon>
            </div>
            <div class="flex_row_item" :class="{allActive:allActive[2]}" :style="allActive[2]?`color:${mainColor}`:``"
                 @click="setActive(2)">综合排序
              <yd-icon name='toDown' v-if="allActive[2]" size='.2rem' custom :color="mainColor"></yd-icon>
              <yd-icon name='shangla' v-if="!allActive[2]" size='.2rem' custom :color='"#999"'></yd-icon>
            </div>
          </div>
            <!---->
          <yd-pullrefresh style="height: 100vh" :callback="loadTop" ref="pullrefreshDemo">

        <yd-infinitescroll :callback="loadListTop" ref="infinitescrollDemo">

              <div class="content_list" slot="list" style="margin-top:.3rem;">
                <card :listItem='listItem' v-for="(listItem,key) in listItemArr" :keyIndex="key" :key="key"></card>
              </div>
              <!-- 数据全部加载完毕显示 -->
              <span slot="doneTip">啦啦啦，啦啦啦，没有数据啦~~</span>

              <!-- 加载中提示，不指定，将显示默认加载中图标 -->
            </yd-infinitescroll>
          </yd-pullrefresh>

          <!-- </yd-pullrefresh> -->
        </div>
      </div>

      <div @click="turnTo('/circle/my_circle/new_post')" slot="bottom" :style="{background:mainColor}" class="toEdit">
        <!-- <span :style="{background:mainColor}" style="">发帖</span> -->
        <yd-icon name='edit' size='.6rem' custom color='#fff'></yd-icon>
      </div>

    </yd-layout>
    <!--实际筛选内容-->
    <!-- <el-amap vid="amapDemo" :plugin="plugins" class="amap-demo"></el-amap> -->

  </div>
</template>
<script>
  import Vue from "vue";
  import BScroll from "better-scroll";
  import card from "./card.vue";
  import fn from "@/assets/js/product.js";
  import qs from "qs";
  import axios from "axios";
  //下拉刷新组件
  import {PullRefresh} from "vue-ydui/dist/lib.rem/pullrefresh";

  Vue.component(PullRefresh.name, PullRefresh);
  import {InfiniteScroll} from "vue-ydui/dist/lib.rem/infinitescroll";

  Vue.component(InfiniteScroll.name, InfiniteScroll);
  //搜索组件
  import {Search} from "vue-ydui/dist/lib.rem/search";
  //栅格系统
  import {GridsGroup, GridsItem} from "vue-ydui/dist/lib.rem/grids";

  Vue.component(GridsGroup.name, GridsGroup);
  Vue.component(GridsItem.name, GridsItem);
  Vue.component(Search.name, Search);
  import {Slider, SliderItem} from "vue-ydui/dist/lib.rem/slider";

  Vue.component(Slider.name, Slider);

  Vue.component(SliderItem.name, SliderItem);
  import {Radio, RadioGroup} from "vue-ydui/dist/lib.rem/radio";

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
      var mainColor = "";
      var userInfo = {};
      let TypeListCircle;

      var info = this.$route.query;
      if (info.userId) {
        this.$ajax(
          `${this.subUrl.user}/user/getUserInfo`,
          {userId: info.userId, token: info.token},
          res => {
            localStorage.setItem(
              "userInfo",
              encodeURIComponent(JSON.stringify(res.data.userInfo))
            );
            localStorage.setItem(
              "organInfo",
              encodeURIComponent(JSON.stringify(res.data.organInfo))
            );
            localStorage.setItem("to", encodeURIComponent(res.data.token));
            fn.setIng(info.token);
            this.userInfo = res.data.userInfo;
            this.organInfo = res.data.organInfo;
            this.mainColor = this.$color[this.userInfo.organType];
            var a = res.data.userInfo.organType;
            var b = res.data.userInfo.admin ? 1 : 0;
            localStorage.setItem("organType", a);
            localStorage.setItem("isManger", b);
            localStorage.setItem("user_Id", res.data.userInfo.guid);
            localStorage.setItem(
              "mainColor",
              that.$color[res.data.userInfo.organType]
            );
            this.circleType = 3;
          }
        );
      } else {
        userInfo = JSON.parse(
          decodeURIComponent(localStorage.getItem("userInfo"))
        );
        mainColor = this.$color[userInfo.organType];
        var userType = userInfo.organType;
        if (userType == 1) {
          TypeListCircle = 1;
        } else if (userType == 5) {
          TypeListCircle = 2;
        } else {
          TypeListCircle = 3;
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
        showContent: false,
        plugins: [
          {
            pName: "Geolocation",
            events: {
              init(o) {
                // o 是高德地图定位插件实例
                o.getCurrentPosition((status, result) => {
                  if (result && result.position) {
                    getDistrict(
                      result.addressComponent.city.replace(/省|市|区/, ""),
                      function (res) {
                        that.cityList = res;
                        var arr = that.filterAllData[0][1];
                        arr = arr.concat(res);
                        that.$set(that.filterAllData[0], 1, arr);
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
        imgs: false,
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
        showLeftSelected: 1,
        districtList: [],
        districtList1: [],
        districtList2: [],
        districtList3: [],
        classify: "",
        classifyList: [],
        classifyList1: [],
        index1: null,
        index2: null,
        index3: null,
        index4: null,
        index5: null,
        index6: null,
        show: false,
        show1: true,
        region: "",
        city: "",
        bbsType: null,
        bbsType1: null,
        sortType: null,
        scope: null,
        scopeValue: null
      };
    },
    methods: {
      selectS(num) {
        this.show = false;
        this.allActive = [false, false, false];
        this.sortType = num;
        this.pageNo = 1;
        this.listItemArr = []
        this.getList();
      },
      turnTo(e) {
        if (!this.userInfo.isEnabled)
          return this.$dialog.alert({mes: "账号审核中，通过审核后才可体验完整功能"});
        this.$router.push(e);
      },
      getUserInfo(data, cb) {
        this.xhr
          .post(`${this.subUrl.user}/user/getUserInfo`, qs.stringify(data))
          .then(res => {
            if (res.data.code == 1) {
              this.userInfo = res.data.data.userInfo;
              this.organInfo = res.data.data.organInfo;
              localStorage.setItem(
                "userInfo",
                encodeURIComponent(JSON.stringify(res.data.data.userInfo))
              );
              localStorage.setItem(
                "organInfo",
                encodeURIComponent(JSON.stringify(res.data.data.organInfo))
              );
              localStorage.setItem(
                "to",
                encodeURIComponent(this.$route.query.token)
              );
              this.parameter.userId = this.$route.query.userId;
              fn.setIng(this.$route.query.token);
              var a = res.data.data.userInfo.organType;
              var b = res.data.data.userInfo.admin ? 1 : 0;
              localStorage.setItem("organType", a);
              localStorage.setItem("isManger", b);
              localStorage.setItem("user_Id", res.data.data.userInfo.guid);
              this.$emit("mainColor", this.$color[a]);
              cb && cb(res.data);
            } else if (res.data.code == "-902") {
              //-902
              /*重新登录*/
              fn.re_login(this);
            } else {
              this.$dialog.toast({mes: res.data.msg});
            }
          });
      },
      goTo(guid) {
        if (!this.userInfo.isEnabled)
          return this.$dialog.alert({mes: "账号审核中，通过审核后才可体验完整功能"});
        this.$router.push(`/rent/circle/article/${guid}`);
      },
      randomColor: function () {
        var i = Math.round(Math.random() * 4);
        var colorArr = ["#3eb7e6", "#62c88c", "#fab23e", "#fa697c", "#adb8c0"];
        return colorArr[i];
      },
      setArr(arr, num) {
        var count = 0;
        var new_arr = [];
        var new_arr_child = [];
        count = i % num;
        for (var i in arr) {
          arr[i].color = this.randomColor();
          new_arr_child.push(arr[i]);
          if (i % num == num - 1) {
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
      getbbsType(type, index, name, id, data) {
        data = data ? data : {};
        data.circleType = this.circleType;
        console.log(this.circleType, 22222222222222222)
        data.token = this.getkey;
        this.$ajax(
          `${this.subUrl.sc}/bbs/getBBsType`,
          data,
          res => {
            this.classifyList = res.data;
            if (type) {
              this.classifyList1 = res.data[index].childDictData;
              this.classify = name;
              this.index5 = index;
              this.bbsType1 = id;
            } else {
              this.classify = name;
              this.index6 = index;
              this.bbsType1 = id;
            }
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
          this.$dialog.toast({mes: "您选择了全部", timeout: 1000});
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
          this.$dialog.toast({mes: "你选择了" + item, timeout: 1000});
          this.closeFilter();
        }
      },
      showThis2() {
        this.$dialog.toast({mes: "你选择了综合排序", timeout: 1000});
        this.closeFilter();
      },
      choose(i, item) {
        this.filter1 = i;
        this.$dialog.toast({mes: `您选择了${item.dictDataName}`, timeout: 1000});
        this.closeFilter();
      },
      // 获取消息
      getList(data, cb) {
        data = data ? data : {};
        data.token = this.getkey;
        // data.userId = this.userInfo.guid;
        data.pageNo = this.pageNo;
        data.pageSize = this.pageSize ? this.pageSize : 15;
        data.circleType = this.circleType;
        if (this.bbsType != null) data.bbsType = this.bbsType;
        if (this.scope != null) data.scope = this.scope;
        if (this.scopeValue != null) data.scopeValue = this.scopeValue;
        if (this.sortType != null) data.sortType = this.sortType;

        this.$ajax(
          `${this.subUrl.sc}/bbs/queryBycircleType`,
          data,
          res => {
            this.showContent = true;
            cb && cb(res);
            this.announce = res.data.bbsTop;
            this.listItemArr = this.listItemArr.concat(res.data.pagination.list);
            if (
              this.pageNo >= this.pageCount ||
              res.data.list.length < this.pageSize
            ) {
              this.$nextTick(() => {
                this.$refs.infinitescrollDemo.$emit(
                  "ydui.infinitescroll.loadedDone"
                );
              });
            }
            this.pageNo = this.pageNo * 1 + 1;
          },
          this
        );
      },
      loadList() {

      },
      loadTop() {
        this.listItemArr = [];
        this.pageNo = 1;
        this.getList({}, res => {
          this.$refs.pullrefreshDemo.$emit('ydui.pullrefresh.finishLoad');
          this.$dialog.toast({mes: "刷新成功", timeout: 1000})
        });
      },

      loadListTop() {
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
      prevent() {
      },
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
        if (e == 0) {
          this.show0 = true;
          this.show1 = false;
          this.show2 = false;
          this.getDistrictList(0, 0, e);
        } else if (e == 1) {
          this.getbbsType();
          this.show0 = false;
          this.show1 = true;
          this.show2 = false;
        } else if (e == 2) {
          // this.getbbsType()
          this.show0 = false;
          this.show1 = false;
          this.show2 = true;
        }
        this.show = true;
        this.isFilter = true;
        for (var i = 0; i < this.allActive.length; i++) {
          if (i == e) {
            if (this.allActive[i]) {
              this.$set(this.allActive, i, false);
              this.cancel();
            } else {
              this.$set(this.allActive, i, true);
            }
          } else {
            this.$set(this.allActive, i, false);
          }
        }

      },
      getDistrictList(index, id, type, name) {
        let data = {id: id};
        this.$ajax(
          `${this.subUrl.user}/comm/getDistrictList`,
          data,
          res => {
            if (type == 0) {
              this.districtList = res.data;
            } else if (type == 1) {
              this.index1 = index;
              this.city = name;
              this.districtList1 = res.data;
              this.districtList2 = [];
              this.districtList3 = [];
            } else if (type == 2) {
              this.districtList2 = res.data;
              this.index2 = index;
              this.city = name;
              this.districtList3 = [];
            } else if (type == 3) {
              this.districtList3 = res.data;
              this.index3 = index;
              this.city = name;
            } else if ((type = 4)) {
              this.city = name;
              this.index4 = index;
            }
            this.scope = type;
            this.scopeValue = id;
          },
          this
        );
      },
      determine(e) {
        if (e == 0) {
          this.region = this.city;
          this.show = false;
          this.pageNo = 1;
          this.listItemArr = []
          this.getList();
          // this.scope=null
          // this.scopeValue=null
          this.$dialog.toast({mes: "您选择了" + this.region, timeout: 1000});
          this.allActive = [false, false, false];
        } else if (e == 1) {
          this.show = false;
          this.listItemArr = [];
          this.bbsType = this.bbsType1;
          this.pageNo = 1;
          this.listItemArr = []
          this.getList();
          // this.bbsType=null
          this.$dialog.toast({mes: "您选择了" + this.classify, timeout: 1000});
          this.allActive = [false, false, false];
        }
      },
      cancel() {
        this.show0 = false;
        this.show1 = false;
        this.show2 = false;
        this.show = false;
        this.isFilter = false;
        this.allActive = [false, false, false];
      }
    },
    mounted() {
      this.rParams = this.$route.params;
      this.filterList = this.filterAllData[0][0][1].childDictData;
      this.filterList1 = this.filterAllData[0][1][0].subArr;
      if (this.$route.params.type == 1) {
        this.imgs = true;
      }
      this.getList();
      this.getbbsType();
    }
  };
</script>
<style scoped>
  /* 文字图标 */
  .show {
    position: fixed;
    width: 100%;
    /* height: calc(100vh - 4rem); */
    background: rgba(0, 0, 0, 0.15);
    z-index: 999;
  }

  .filterContent.show {
    position: absolute;
    position: fixed;
    top: 0.88rem;
    bottom: 0;
  }

  .show > div {
    position: absolute;
    width: 100%;
    height: 6rem;
    top: 0;
    background: white;
    color: #999;
  }

  .show .navigation {
    width: 100;
    height: 0.72rem;
    display: flex;
    justify-content: space-between;
    padding: 0 0.2rem;
    align-items: center;
    border-bottom: 1px solid #ddd;
  }

  .show .navigation > p:nth-child(1) > span:last-child {
    color: #000;
  }

  .show .navigation > p:nth-child(2) > span:last-child {
    margin-left: 0.5rem;
  }

  .show .hierarchy {
    width: 100%;
    height: 5.28rem;
    display: flex;
  }

  .show .hierarchy > ul {
    flex: 1;
    height: 5.28rem;
    overflow-y: auto;
    background: #fff;
    border-right: 1px solid #ddd;
  }

  .show .hierarchy li {
    height: 0.7rem;
    padding: 0 0.1rem;
    line-height: 0.7rem;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
  }

  .myIcon {
    display: block;
    width: 0.92rem;
    height: 0.92rem;
    border-radius: 50%;
    text-align: center;
    line-height: 0.92rem;
    color: #fff;
    font-size: 0.4rem;
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

  .circle .yd-slider {
    margin-bottom: 0;
    border-bottom: none;
  }

  /* 跳转到编辑页面 */

  .toEdit {
    position: fixed;
    right: 0.3rem;
    bottom: 2.75rem;
    z-index: 11;
    width: 0.8rem;
    height: 0.8rem;
    text-align: center;
    line-height: 0.8rem;
    border-radius: 50%;
  }

  .toEdit span {
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.24rem;
    color: white;
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
    /* border-bottom: 1px solid #ddd; */
  }

  .announce > div {
    display: flex;
    padding: 0 0.24rem;
    background: #fff;
    height: 0.8rem;
    align-items: center;
    border-bottom: 1px dashed #ddd;
  }

  .announce > div:last-child {
    border: none;
  }

  .announce > div span {
    flex: 1;
    padding: 0 0.2rem;
  }

  .announce .toTop {
    background: #b2b2b2;
    height: 0.48rem;
  }

  .circle_session {
    position: absolute;
    top: 0.88rem;
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

  .filterOuter .filterBox .allActive1 .right > div > div {
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    margin-top: -1px;
    height: 0.72rem;
  }

  .filterOuter .filterBox > div > div > div {
    height: 0.72rem;
    text-align: center;
    line-height: 0.72rem;
    margin-top: -1px;
  }

  .filterOuter .left > div {
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

  .announce > div:nth-child(1) > b {
    color: #fab23e;
  }

  .announce > div:nth-child(2) > b {
    color: #ef6a6f;
  }

  .announce > div:nth-child(3) > b {
    color: #0093d2;
  }
</style>
