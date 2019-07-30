<template>
  <yd-layout class="layout_my">
    <yd-navbar v-show="!userAgent.isWX" class="header" height=".88rem" slot="navbar" :bgcolor="mainColor"
               color="#fff" title="本地服务">
            <!--<span class="addClickArea" @click="back" slot="left">-->
                <!--<yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>-->
            <!--</span>-->
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
        <span v-show="region==''">本市</span>
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
      <!-- <div v-if="show1" v-show="!abc">
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
                      @click="getIndustryCategory(2,index,item.name,item.guid)">{{item.name}}</li>
                   </ul>

                 </div>
        </div> -->
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
        <div class="hierarchy" v-if="!abc">
                   <ul v-if="classifyList.length>0">
                       <li v-for="(item,index) in classifyList" :key="index" 
                       :style="{color:index5==index?mainColor:'#999',background:index5==index?'#F8F9FA':''}"
                        @click="getIndustryCategory(1,index,item.name,item.guid)">{{item.name}}
                        <i v-if="index5==index">></i></li>
                   </ul>
                   <ul v-if="classifyList1.length>0" style="background:#F8F9FA;">
                       <li v-for="(item,index) in classifyList1" :key="index" :style="{color:index6==index?mainColor:'#999'}"
                      @click="getIndustryCategory(2,index,item.name,item.guid)">{{item.name}}</li>
                   </ul>
        </div>
        <div class="hierarchy" v-if="abc">
          <ul v-if="classifyList.length>0">
            <li v-for="(item,index) in classifyList" :key="index"
                :style="{color:index5==index?mainColor:'#999',background:index5==index?'#F8F9FA':''}"
                @click="getbbsType(true,index,item.dictDataName,item.guid)">{{item.dictDataName}}
              <i v-if="index5==index">></i></li>
          </ul>
          <ul v-if="classifyList1.length>0" style="background:#F8F9FA;">
            <li v-for="(item,index) in classifyList1" :key="index" :style="{color:index6==index?mainColor:'#999'}"
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
    <div class="tabType">
      <ul>
        <li v-if="abc"><span :style="{borderBottom:'2px solid '+mainColor}">八爪圈</span></li>
        <li v-else><span @click="tabs(1)">八爪圈</span></li>

        <li v-if="abc"><span @click="tabs(2)">供求市场</span></li>
        <li v-else><span :style="{borderBottom:'2px solid '+mainColor}">供求市场</span></li>

      </ul>
    </div>
    <div class="bazhua" v-if="abc" @scroll="scrollHandler" ref="listDom1">
      <ul v-for="(item,index) in list1" :key="index" @click="turnTo('/rent/circle/article/'+item.guid)">
        <li>
          <span><img :src="item.headPortrait" alt=""></span>
          <span style="color:#888;width:1.6rem;" class="textHidden">{{item.nickname}}</span>
        </li>
        <li>
          <span class="font32 font600 textHidden" style="width:4.5rem;">【{{item.typeName}}】{{item.title}}</span>
          <span style="color:#888" class="">{{item.content}}</span>
          <span class="font26" style="color:#888" v-if="item.createDate"><i><img
            src="../../../assets/images/rent/supply/riqi.png" alt=""></i>{{item.createDate.split(' ')[0]}}</span>
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
    <div class="content" @scroll="scrollHandler" ref="listDom" v-else>
      <ul v-for="(item,index) in list" :key="index" style="border-top:1px solid #ddd;">
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
</template>
<script>
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
            this.parameter.token = para.token;

            this.marketIndex();
          }
        );
      }
      return {
        abc: true,
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
        scope:null,
        positionCondition:null,
        scopeValue:null,
        sortType:null,
        cityId:'',
        list: [],
        list1: [],
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
          circleType: '',
          classType:null,
          classId:null,
        },
      }

    },
    methods: {
      selectS(num){
        this.show = false;
        this.allActive = [false, false, false];
        this.parameter.pageNo=1;
        if(this.abc){
          this.sortType=num;
            this.list1=[]
            this.getList();
          }else{
            this.parameter.sortRule=num+1
            this.list=[]
            this.marketIndex();
          }
      },
      determine(e) {
        if (e == 0) {
          this.region = this.city;
          this.show = false;
          this.parameter.pageNo=1;
          
          if(this.abc){
            this.list1=[]
            this.getList();
          }else{
            this.list=[]
            this.marketIndex();
          }
          this.$dialog.toast({mes: "您选择了" + this.region, timeout: 1000});
          this.allActive = [false, false, false];
        } else if (e == 1) {
          this.positionCondition=null
          this.show = false;
          this.parameter.pageNo=1;
          if(this.abc){
            this.bbsType = this.bbsType1;
            this.list1=[]
            this.getList();
          }else{
            this.list=[]
            this.marketIndex();
          }
          this.$dialog.toast({mes: "您选择了" + this.classify, timeout: 1000});
          this.allActive = [false, false, false];
        }
      },
      getUserInfo(data, cb) {
        this.xhr.post(`${this.subUrl.user}/user/getUserInfo`, qs.stringify(data))
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
              this.cityId=res.data.data.organInfo.city;
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
        if (this.abc) {
          let listDom1 = this.$refs.listDom1;
          if (listDom1.scrollHeight - listDom1.scrollTop - listDom1.clientHeight < 50) {
            this.getList()
          }
        } else {
          let listDom = this.$refs.listDom;
          if (listDom.scrollHeight - listDom.scrollTop - listDom.clientHeight < 50) {
            this.marketIndex()
          }
        }


      },
      marketIndex() {
        let data = {}
        data.token = this.$route.query.token ? this.$route.query.token : this.$getkey();
        data.pageNo = this.parameter.pageNo;
        data.pageSize = this.parameter.pageSize;
        if(this.positionCondition!=null) data.positionCondition = this.positionCondition;
        if(this.scopeValue!=null) data.scopeValue = this.scopeValue;
        if(this.parameter.sortRule!=null) data.sortRule = this.parameter.sortRule;
        if(this.parameter.classType!=null) data.classType = this.parameter.classType;
        if(this.parameter.classId!=null) data.classId = this.parameter.classId;
        
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
            console.log(res)
            this.imgList = res.data
          },
          this
        );
      },
      // 收藏
      collection(type, guid, index) {
        console.log(type, guid)
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
        this.$router.push(url)
      },
      setActive(e) {
        if(e==0){
          this.scopeValue=null;
          this.show0=true;
          this.show1=false;
          this.show2=false;
          this.getDistrictList(0,this.cityId,e,null)
        }else if(e==1){
          this.scopeValue=null;
          if(this.abc){
            this.getbbsType()
          }else{
            this.getIndustryCategory()
          }
          
          this.show0=false;
          this.show1=true;
          this.show2=false;
        }else if(e==2){
          // this.getbbsType()
          this.show0=false;
          this.show1=false;
          this.show2=true;
        }

        this.show=true;
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
      getIndustryCategory(type,index,name,id,data) {
        this.$ajax(
          `${this.subUrl.user}/comm/getIndustryCategory`,
          data,res => {
             console.log(res)
            let arr=res.data.icc
            let arr1=res.data.pmc
            this.classifyList=arr.concat(arr1)
            if(type==1){
              this.classifyList1=this.classifyList[index].subclass
              this.classify=name;
              this.index5=index;
              this.bbsType1=id;
            }else if(type==2){
              this.classify=name;
              this.index6=index;
              this.bbsType1=id;
            }
            this.parameter.classType=type;
            this.parameter.classId=id;
            console.log(this.classType,this.classId)
          },
          this
        );
      },
      getbbsType(type, index, name, id) {
        let data={};
        data.circleType = this.circleType;
        data.token = this.parameter.token;
        this.$ajax(
          `${this.subUrl.sc}/bbs/getBBsType`,
          data,
          res => {
            this.classifyList = res.data
            if (type) {
              this.classifyList1 = res.data[index].childDictData
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
      getDistrictList(index, id, type, name) {
        let data = {id: id}
        this.$ajax(
          `${this.subUrl.user}/comm/getDistrictList`,
          data,
          res => {
            
            if(type==3){
              this.index3 = index;
              this.city = name;
              this.districtList3 = res.data;
            }else if(type==4){
              this.index4 = index;
              this.city = name;
            }else{
              this.districtList2 = res.data;
            }
            if(this.abc){
             this.scope=type;
            }else{
            this.positionCondition=type;
            }
            this.scopeValue=id;

          },
          this
        );
      },

      back() {
        this.$router.go(-1)
      },
      cancel() {
        this.show = false;
      },
      submitHandler(value) {
        this.$dialog.toast({mes: `产品关键字：${value}`});
        this.parameter.pageNo = 1;
        this.marketIndex()

      },
      getList() {
        let data = {}
        data.token = this.parameter.token;
        data.pageNo = this.parameter.pageNo;
        data.pageSize = this.parameter.pageSize ? this.parameter.pageSize : 15;
        data.circleType = this.circleType;
        if(this.bbsType!=null) data.bbsType = this.bbsType;
        if(this.scope!=null) data.scope = this.scope;
        if(this.scopeValue!=null) data.scopeValue = this.scopeValue;
        if(this.sortType!=null) data.sortType = this.sortType;
        this.$ajax(`${this.subUrl.sc}/bbs/queryBycircleType`, data,
          res => {
            // this.list = res.data.pagination.list;
            // this.pageCount=res.data.pagination.pageCount;
            // this.pageNo++;
            this.parameter.pageCount = res.data.pagination.pageCount;
            if (this.parameter.pageNo >= 2) {
              this.list1 = this.list1.concat(res.data.pagination.list);
            } else {
              this.list1 = res.data.pagination.list;
            }

            this.parameter.pageNo++;
          },
          this
        );
      },
      tabs(type) {
        if (type == 1) {
          this.abc = true;
          this.parameter.pageNo = 1
          this.parameter.pageSize = 5
          this.list1 = []
          this.getList()
        } else if (type == 2) {
          this.abc = false;
          this.parameter.pageNo = 1
          this.parameter.pageSize = 5
          this.list = []
          this.marketIndex();
        }
      }
    },
    mounted() {
      if (!this.$route.query.token) {
        this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
        this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
        this.mainColor = localStorage.getItem('mainColor');
        console.log(this.organInfo,111111111111111)
        this.cityId=this.organInfo.city;
        if (this.userInfo.organType == 1) {
          this.circleType = 1;
        } else if (this.userInfo.organType == 5) {
          this.circleType = 2;
        } else {
          this.circleType = 3
        }
        if (this.abc == true) {

        }
        this.parameter.userId = this.userInfo.guid;
        this.parameter.token = fn.getIng();

        this.$emit("organType", this.userInfo.organType);

      } else {
        console.log(this.$route.query.token)
      }
      this.marketIndexBanner()
      this.getList()
    },
    beforeUpdate() {

    }
  }

</script>
<style scoped>
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
    background: rgba(0, 0, 0, 0.15);
    z-index: 999;
  }

  .show > div {
    width: 100%;
    height: 6rem;
    background: white;
    color: #999;
  }

  .show .navigation {
    width: 100;
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
    height: calc(100vh - 6rem);
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
    width: .4rem;
    height: .4rem;
  }

  /* .content>ul>li:nth-child(3)>i:nth-child(2){width:.3rem;height:.3rem;background: red;}
  .content>ul>li:nth-child(3)>i:nth-child(2)>img{width:100%;height:100%;} */
  .tabType {
    width: 100%;
    height: .8rem;
    margin-top: .2rem;
    background: #FCFCFC;
    border-top: 1px solid #ddd;
  }

  .tabType > ul {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: .8rem;
  }

  .tabType > ul > li {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: .8rem;
  }

  .tabType > ul > li > span {
    padding: .16rem .2rem;
    display: flex;
    align-items: center;
    font-size: .3rem;
    font-weight: 600;
    box-sizing: border;
  }

  .bazhua {
    width: 100%;
    height: calc(100vh - 6rem);
    overflow-y: scroll;
  }

  .bazhua > ul {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: .1rem 0;
    background: white;
    border-top: 1px solid #ddd;
    margin-bottom: .2rem;
  }

  .bazhua > ul > li:nth-child(1) {
    width: 2rem;
    display: flex;
    flex-flow: column;
    align-items: center;
  }

  .bazhua > ul > li:nth-child(1) > span:nth-child(1) {
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 50%;
  }

  .bazhua > ul > li:nth-child(1) > span:nth-child(1) > img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .bazhua > ul > li:nth-child(2) {
    flex: 1;
    display: flex;
    flex-flow: column;
  }

  .bazhua > ul > li:nth-child(2) > span {
    width: 5rem;
    padding: .1rem .1rem;
  }

  .bazhua > ul > li:nth-child(2) > span:last-child {
    display: flex;
    align-items: center;
  }

  .bazhua > ul > li:nth-child(2) > span:last-child > i {
    width: .35rem;
    height: .35rem;
  }

  .bazhua > ul > li:nth-child(2) > span:last-child > i > img {
    width: 100%;
    height: 100%;
  }

</style>
