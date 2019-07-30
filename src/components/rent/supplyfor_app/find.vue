<template>
  <div class="template">
    <yd-layout class="find">
      <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" title="供求" :bgcolor="mainColor" color="#fff">
      </yd-navbar>
      <yd-slider autoplay="3000" style="height:2.4rem" :loop="false">
        <!-- 对数据进行筛选 -->
        <yd-slider-item v-for="(item,index) in imgList" :key="index">
          <a><img :src="item.banner"></a>
        </yd-slider-item>

      </yd-slider>

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
      <div class="show" v-if="show">
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
                  :key="index" :style="{color:index1==index?mainColor:'#999',background:index1==index?'#F8F9FA':'#fff'}"
                  @click="getDistrictList(index,item.guid,1,item.dictDataName)">{{item.dictDataName}}
                <i v-if="index1==index">></i></li>
            </ul>
            <ul v-if="districtList1.length>0" style="background:#F8F9FA;">
              <li v-for="(item,index) in districtList1"
                  :key="index" :style="{color:index2==index?mainColor:'#999',background:index2==index?'#F8F9FA':'#fff'}"
                  @click="getDistrictList(index,item.guid,2,item.dictDataName)">{{item.dictDataName}}
                <i v-if="index2==index">></i></li>
            </ul>
            <ul v-if="districtList2.length>0" style="background:#F8F9FA;">
              <li v-for="(item,index) in districtList2"
                  :key="index" :style="{color:index3==index?mainColor:'#999',background:index3==index?'#F8F9FA':'#fff'}"
                  @click="getDistrictList(index,item.guid,3,item.dictDataName)">{{item.dictDataName}}
                <i v-if="index3==index">></i></li>
            </ul>
            <ul v-if="districtList3.length>0" style="background:#F8F9FA;">
              <li v-for="(item,index) in districtList3"
                  :key="index" :style="{color:index4==index?mainColor:'#999',background:index4==index?'#F8F9FA':''}"
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
                  @click="getIndustryCategory(1,index,item.name,item.guid)">{{item.name}}
                <i v-if="index5==index">></i></li>
            </ul>
            <ul v-if="classifyList1.length>0" style="background:#F8F9FA;">
              <li v-for="(item,index) in classifyList1" :key="index" :style="{color:index6==index?mainColor:'#999'}"
                  @click="getIndustryCategory(2,index,item.name,item.guid)">{{item.name}}
              </li>
            </ul>

          </div>
        </div>
        <div v-if="show2">
          <div class="hierarchy">
            <ul>
              <li @click="clickSort(1)">综合排序</li>
              <li @click="clickSort(2)">最新发布</li>
              <li @click="clickSort(3)">人气最高</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="content" @scroll="scrollHandler" ref="listDom">
        <ul v-for="(item,index) in list" :key="index" style="border-bottom:1px solid #ddd;">
          <li>
            <i v-if="item.type==1"><img src="../../../assets/images/rent/supply/gou.png" alt=""></i>
            <i v-if="item.type==2"><img src="../../../assets/images/rent/supply/biao.png" alt=""></i>
            <i v-if="item.type==3"><img src="../../../assets/images/rent/supply/chan.png" alt=""></i>
          </li>
          <li v-if="item.type==3" @click="turnTo('/supply/find/details/'+item.guid)">
            <p class="textHidden1">【{{item.type2}}】{{item.title}}</p>
            <p class="textHidden1">{{item.organName}}</p>
            <p><span style="background:#C8E7FF;color:#61BBFF;" v-show="item.organLevel!=''">{{item.organLevel}}</span>
              <span style="background:#FFE7C8;color:#FFB454;">{{item.day}}年</span></p>
            <p><i><img src="../../../assets/images/rent/supply/ding.png" alt=""></i>{{item.address}}</p>
          </li>
          <li v-else @click="turnTo('/supply/purchase/details/'+item.type+'/'+item.guid)">
            <p class="textHidden1">【{{item.type2}}】{{item.title}}</p>
            <p class="textHidden1">{{item.organName}}</p>
            <p><span style="background:#C8E7FF;color:#61BBFF;" v-show="item.organLevel!=''">{{item.organLevel}}</span>
              <span style="background:#FFE7C8;color:#FFB454;">{{item.day}}年</span></p>
            <p><i><img src="../../../assets/images/rent/supply/ding.png" alt=""></i>{{item.address}}</p>
          </li>
          <li>
            <i v-if="item.isCollection==1" @click="cancelCollection(item.type,item.guid,index)"><img
              src="../../../assets/images/rent/supply/shou1.png" alt=""></i>
            <i v-else @click="collection(item.type,item.guid,index)"><img
              src="../../../assets/images/rent/supply/shou2.png" alt=""></i>
          </li>
        </ul>
        <div class="Section">
          <div v-if="parameter.pageNo <= parameter.pageCount">
            <div class="a b1">
              <ul>
                <li></li>
                <li></li>
                <li></li>
              </ul>
            </div>

          </div>
          <div v-else>啦啦啦，啦啦啦，没有数据啦~~</div>
        </div>
      </div>

    </yd-layout>
  </div>
</template>
<script>
  function toIOSApp(callback) {
    if (window.WebViewJavascriptBridge) {
      return callback(WebViewJavascriptBridge);
    }
    if (window.WVJBCallbacks) {
      return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'https://__bridge_loaded__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () {
      document.documentElement.removeChild(WVJBIframe)
    }, 0)
  }
  import Vue from "vue";
  import BScroll from "better-scroll";
  import fn from '@/assets/js/product.js'
  import qs from "qs";
  import axios from "axios";
  import store from '@/store'
  import {Slider, SliderItem} from "vue-ydui/dist/lib.rem/slider";

  Vue.component(Slider.name, Slider);
  Vue.component(SliderItem.name, SliderItem);
  export default {
    data() {
      var userInfo = {},
        mainColor;
      var para = this.$route.query;
      if (para.token) {
        this.getUserInfo(
          {
            token: para.token,
            userId: para.userId
          },
          res => {
            this.mainColor =  this.$color[this.userInfo.organType];
            this.parameter.token = para.token;
            this.marketIndex();
          }
        );
      }
      return {
        imgList: [],
        userInfo: '',
        mainColor: '',
        allActive: [false, false, false],
        circleType: null,
        districtList: [],
        districtList1: [],
        districtList2: [],
        districtList3: [],
        classify: '',
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
        region: '',
        city: '',
        bbsType: null,
        bbsType1: null,
        list: [],
        parameter: {
          token: '',
          title: '',
          state: 3,
          startData: '',
          endData: '',
          pageNo: 1,
          pageSize: 5,
          pageCount: null,
          sortRule: null,
          positionCondition: null,
          scopeValue: null,
          classType: null,
          classId: null,
        },
      }
    },
    methods: {
      clickSort(n) {
        this.parameter.sortRule = n;
        this.parameter.pageNo = 1;
        this.list = [];
        this.marketIndex()
        this.show = false;
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
              localStorage.setItem("app", true)
              this.parameter.userId = this.$route.query.userId;
              console.log(this.$route.query, '-=-=-=-=-=--')
              fn.setIng(this.$route.query.token);
              console.log(this.$getkey())
              var a = res.data.data.userInfo.organType;
              var b = res.data.data.userInfo.admin ? 1 : 0;
              localStorage.setItem("organType", a);
              localStorage.setItem("isManger", b);
              localStorage.setItem("user_Id", res.data.data.userInfo.guid);
              this.$emit("mainColor", this.$color[a]);
              this.$emit("organType", a);

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
      scrollHandler() {
        if (store.loading || this.parameter.pageNo > this.parameter.pageCount) {
          return
        }
        let listDom = this.$refs.listDom;
        if (listDom.scrollHeight - listDom.scrollTop - listDom.clientHeight < 50) {
          this.marketIndex()
        }
      },
      marketIndex() {
        let data = {}
        data.token = this.$route.query.token ? this.$route.query.token : this.$getkey();
        if (this.parameter.sortRule) data.sortRule = this.parameter.sortRule;
        if (this.parameter.positionCondition) data.positionCondition = this.parameter.positionCondition
        if (this.parameter.scopeValue) data.scopeValue = this.parameter.scopeValue;
        if (this.parameter.classType) data.classType = this.parameter.classType
        if (this.parameter.classId) data.classId = this.parameter.classId
        data.pageNo = this.parameter.pageNo,
          data.pageSize = this.parameter.pageSize,
          this.xhr.post(`${this.subUrl.bd}/market/marketIndex`, qs.stringify(data)).then((res) => {
            console.log(res)
            if (res.data.code == 1) {
              this.$dialog.loading.close();
              if (res.data.data.list != null) {
                res.data.data.list.forEach(element => {
                  if (element.type == 1) {
                    element.type2 = '招标'
                  } else if (element.type == 2) {
                    element.type2 = "采购"
                  } else if (element.type == 3) {
                    element.type2 = "产品服务"
                  }
                  if (element.organLevel == 1) {
                    element.organLevel = '基础'
                  } else if (element.organLevel == 2) {
                    element.organLevel = '中级'
                  } else if (element.organLevel == 3) {
                    element.organLevel = '高级'
                  } else if (element.organLevel == 4) {
                    element.organLevel = '金牌'
                  } else if (element.organLevel == 0) {
                    element.organLevel = '';
                  }
                });
              }
              this.parameter.pageCount = res.data.data.pageCount;
              if (this.parameter.pageNo >= 2) {
                this.list = this.list.concat(res.data.data.list);
              } else {
                this.list = res.data.data.list;
              }

              this.parameter.pageNo++;
              console.log(this.libraryList)
            } else if (res.data.code == '-902') {
              fn.re_login(this);
            } else {
              this.$dialog.toast({mes: res.data.msg});
            }
          })

      },
      // 取消收藏
      cancelCollection(type, guid, index) {
        console.log(type, guid)
        let data = {}
        data.token = this.parameter.token;
        data.guid = guid;
        this.$ajax(
          `${this.subUrl.bd}/market/cancelCollection`,
          data,
          res => {
            this.$dialog.toast({mes: '收藏取消！'});
            this.list[index].isCollection = 0;
          },
          this
        );
      },


      marketIndexBanner() {
        let data = {}
        this.$ajax(
          `${this.subUrl.bd}/market/marketIndexBanner`, data,
          res => {
            //  console.log(res)
            this.imgList = res.data
          },
          this
        );
      },
      // 收藏
      collection(type, guid, index) {
        // console.log(type,guid)
        let data = {}
        data.token = this.parameter.token;
        data.type = type;
        data.guid = guid;
        this.$ajax(
          `${this.subUrl.bd}/market/collection`,
          data,
          res => {
            this.$dialog.toast({mes: '收藏成功！'});
            this.list[index].isCollection = 1;
          },
          this
        );
      },
      turnTo(url) {
        console.log(`/#${url}`);
        if (!this.userInfo.isEnabled)
          return this.$dialog.alert({ mes: "账号审核中，通过审核后才可体验完整功能" });
        console.log('执行了');
        if(this.userAgent.isAndroid){
          console.log('执行安卓的跳转');
          window.WebViewJavascriptBridge.callHandler(
            "jumpTo",
            {param:`/#${url}` },
            function () {

            }
          );
        }else{
          console.log('执行ios的跳转');
          toIOSApp(function (bridge) {
            /* Initialize your app here */
            bridge.registerHandler('reciveCircle', function (data, responseCallback) {
              console.log("reciviceDate", data);
              responseCallback(data)
            });
            bridge.callHandler('circleLink', {'service':`/#${url}`}, function responseCallback(responseData) {
              console.log("JS received response:", responseData)
            })
            // alert(`${this.appLink}#/rent/circle/article/${guid}`)
          })
        }
        // this.$router.push(url)
      },
      setActive(e) {
        if (e == 0) {
          this.show0 = true;
          this.show1 = false;
          this.show2 = false;
          this.parameter.sortRule = null
          this.parameter.classType = null
          this.parameter.classId = null
          this.getDistrictList(0, 0, e)
        } else if (e == 1) {
          this.getIndustryCategory()
          this.show0 = false;
          this.show1 = true;
          this.show2 = false;
          this.parameter.sortRule = null
          this.parameter.positionCondition = null
          this.parameter.scopeValue = null
        } else if (e == 2) {
          this.show0 = false;
          this.show1 = false;
          this.show2 = true;
          this.parameter.positionCondition = null
          this.parameter.scopeValue = null
          this.parameter.classType = null
          this.parameter.classId = null
        }
        this.show = true;
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
      },
      getIndustryCategory(type, index, name, id, data) {
        this.$ajax(
          `${this.subUrl.user}/comm/getIndustryCategory`,
          data, res => {
            console.log(res)
            let arr = res.data.icc
            let arr1 = res.data.pmc
            this.classifyList = arr.concat(arr1)
            if (type == 1) {
              this.classifyList1 = this.classifyList[index].subclass
              this.classify = name;
              this.index5 = index;
              this.bbsType1 = id;
            } else if (type == 2) {
              this.classify = name;
              this.index6 = index;
              this.bbsType1 = id;
            }
            this.parameter.classType = type;
            this.parameter.classId = id;
            console.log(this.classType, this.classId)
          },
          this
        );
      },
      getDistrictList(index, id, type, name) {
        let data = {id: id}
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
              //  console.log(res.data);
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
            } else if (type = 4) {
              this.city = name;
              this.index4 = index;
            }
            this.parameter.positionCondition = type;
            this.parameter.scopeValue = id;

          },
          this
        );
      },
      determine(e) {
        if (e == 0) {
          this.region = this.city;
          // console.log(this.parameter.positionCondition,this.parameter.scopeValue)

          if (this.parameter.positionCondition == 1) {
            this.$dialog.toast({mes: "请选择市！"});
          } else {
            this.show = false;
            this.parameter.pageNo = 1;
            this.list = [];
            this.marketIndex()
            this.$dialog.toast({mes: "您选择了" + this.region, timeout: 1000});
          }
          this.allActive = [false, false, false];
        } else if (e == 1) {
          this.show = false;
          this.parameter.pageNo = 1;
          this.list = [];
          this.marketIndex()
          this.$dialog.toast({mes: "您选择了" + this.classify, timeout: 1000});
          this.allActive = [false, false, false];
        }


      },
      cancel() {
        this.show = false;
      },
      submitHandler(value) {
        this.$dialog.toast({mes: `产品关键字：${value}`});
        this.parameter.pageNo = 1;
        this.marketIndex()

      },
      toggle() {
        this.show = !this.show
      }
    },
    mounted() {
      if (!this.$route.query.token) {
        this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
        this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
        this.mainColor = localStorage.getItem('mainColor');
        if (this.userInfo.organType == 1) {
          this.circleType = 1;
        } else if (this.userInfo.organType == 5) {
          this.circleType = 2;
        } else {
          this.circleType = 3
        }
        this.parameter.userId = this.userInfo.guid;
        this.parameter.token = fn.getIng();
        this.marketIndex();
        this.$emit("organType", this.userInfo.organType);
      } else {
        // console.log(this.$route.query.token)
      }
      this.marketIndexBanner()
    }
  }

</script>
<style scoped>
  .template, .find {
    width: 100%;
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

  .show {
    position: fixed;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    z-index: 999;
  }

  .show > div {
    width: 100%;
    height: 6rem;
    background: white;
    color: #999;
  }

  .show .navigation {
    height: .72rem;
    display: flex;
    justify-content: space-between;
    padding: 0 .2rem;
    align-items: center;
    border-bottom: 1px solid #ddd;
  }

  .show .navigation > p:nth-child(1) > span:last-child {
    color: #000;
  }

  .show .navigation > p:nth-child(2) > span:last-child {
    margin-left: .5rem;
  }

  .show .hierarchy {
    width: 100%;
    height: 5.28rem;
    display: flex;
  }

  .show .hierarchy > ul {
    flex: 1;
    height: 5.28rem;
    overflow-y: scroll;
    border-right: 1px solid #ddd;
  }

  .show .hierarchy li {
    height: .7rem;
    padding: 0 .1rem;
    line-height: .7rem;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
  }

  .content {
    width: 100%;
    height: calc(100vh - 4rem);
    overflow-y: scroll;
  }

  .content > ul {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: white;
    margin-bottom: .3rem;
  }

  .content > ul > li {
    display: flex;
    flex-flow: column;
  }

  .content > ul > li:nth-child(1) {
    width: 2rem;
    height: 2rem;
    justify-content: center;
    align-items: center;
  }

  .content > ul > li:nth-child(1) > i {
    width: 1.6rem;
    height: 1.6rem;
  }

  .content > ul > li:nth-child(1) > i > img {
    width: 100%;;
    height: 100%;
  }

  .content > ul > li:nth-child(2) {
    height: 2rem;
    flex: 1;
    justify-content: center;
  }

  .content > ul > li:nth-child(2) > p {
  }

  .content > ul > li:nth-child(2) > p:nth-child(1) {
    font-weight: 600;
    font-size: .3rem
  }

  .content > ul > li:nth-child(2) > p:nth-child(2) {
    color: #999;
    font-size: .26rem;
    margin: .05rem 0;
  }

  .content > ul > li:nth-child(2) > p:nth-child(3) {
    font-size: .24rem;
    margin: .05rem 0;
    display: flex;
  }

  .content > ul > li:nth-child(2) > p:nth-child(3) > span {
    display: flex;
    margin-right: .2rem;
    width: .8rem;
    height: .3rem;
    justify-content: center;
    align-items: center;
  }

  .content > ul > li:nth-child(2) > p:nth-child(4) {
    color: #999;
    font-size: .24rem;
    display: flex;
    flex-flow: row;
    align-items: center;
    margin-top: .05rem;
  }

  .content > ul > li:nth-child(2) > p:nth-child(4) > i {
    width: .3rem;
    height: .3rem;
    margin-right: .1rem;
  }

  .content > ul > li:nth-child(2) > p:nth-child(4) > i > img {
    width: 100%;
    height: 100%;
  }

  .content > ul > li:nth-child(3) {
    width: 1.4rem;
    height: 2rem;
    align-items: center;
    justify-content: center;
  }

  .content > ul > li:nth-child(3) > i:nth-child(1) {
    width: 1.2rem;
    height: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-left: 1px solid #F1F1F1;
  }

  .content > ul > li:nth-child(3) > i:nth-child(1) > img {
    width: .7rem;
    height: .7rem;
  }

  /* .content>ul>li:nth-child(3)>i:nth-child(2){width:.3rem;height:.3rem;background: red;}
  .content>ul>li:nth-child(3)>i:nth-child(2)>img{width:100%;height:100%;} */
</style>
