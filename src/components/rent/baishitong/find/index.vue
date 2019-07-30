<template>
  <div class="find" v-title="'百事通'">
    <div class="search">
      <ul>
        <li>
          <yd-search v-model="value" :on-submit="submitHandler"></yd-search>
        </li>
        <li>
          <span @click="toggle">筛选</span>
        </li>
      </ul>
      <ol v-show="show">
        <li>
          <span class="font24">日期</span>
        </li>
        <li>
          <p>
            <span>
              <yd-datetime type="date" v-model="datetime0" slot="right"></yd-datetime>
            </span>
            -
            <span>
              <yd-datetime type="date" v-model="datetime1" slot="right"></yd-datetime>
            </span>
          </p>
        </li>
        <li>
          <span @click="toggle" class="font26">取消</span>
          <span class="font26" @click="clickTime">确定</span>
        </li>
      </ol>
      <div v-show="show" class="fixed"></div>
    </div>
    <yd-tab :active-color="mainColor" :callback="callback">
      <yd-tab-panel label="全部" tabkey='' active style="background:#EFEFEF">
        <div class="bb" @scroll="scrollHandler" ref="listDom">
          <ul @click="turnTo('/baishitong/find/details/'+item.guid)" v-for="(item,index) in contentList" :key="index" class="findList">
            <li>
              <p class="textHidden">{{item.title}}</p>
              <span>评分：
                <a style="color:#FFB03E;font-size:.3rem">{{item.grade}}</a>
              </span>
            </li>
            <li>
              <p class="textHidden2">{{item.content}}</p>
            </li>
            <li>
              <p>
                <a>{{item.bp}}商机点</a>
                <p class="aa" v-show="todo!=''" v-for="(todo,index) in item.keyword" :key="index">{{todo}}</p>
              </p>
              <span>{{item.createDate}}</span>
            </li>
          </ul>
          <div  class="Section">
            <div v-if="parameter.pageNo <= parameter.pageCount">
              <div class="a b1">
                <ul>
               <li></li>
               <li></li>
               <li></li>
                </ul></div>

            </div>
            <div v-else>啦啦啦，啦啦啦，没有数据啦~~</div>
          </div>
        </div>
      </yd-tab-panel>
      <yd-tab-panel :label="kaType1.dictDataName" :tabkey='kaType1.guid' style="background:#EFEFEF" >
        <div class="bb" @scroll="scrollHandler" ref="listDom1">
          <ul @click="turnTo('/baishitong/find/details/'+item.guid)" v-for="(item,index) in contentList" :key="index" class="findList">
            <li>
              <p class="textHidden">{{item.title}}</p>
              <span>评分：
                <a style="color:#FFB03E;font-size:.3rem">{{item.grade}}</a>
              </span>
            </li>
            <li>
              <p class="textHidden2">{{item.content}}</p>
            </li>
            <li>
              <p>
                <a>{{item.bp}}商机点</a>
                <p class="aa" v-show="todo!=''" v-for="(todo,index) in item.keyword" :key="index">{{todo}}</p>
              </p>
              <span>{{item.createDate}}</span>
            </li>
          </ul>
          <div  class="Section">
            <div v-if="parameter.pageNo <= parameter.pageCount">
              <div class="a b1">
                <ul>
               <li></li>
               <li></li>
               <li></li>
                </ul></div>

            </div>
            <div v-else>啦啦啦，啦啦啦，没有数据啦~~</div>
          </div>
        </div>
      </yd-tab-panel>
      <yd-tab-panel :label="kaType2.dictDataName" :tabkey='kaType2.guid' style="background:#EFEFEF">
        <div class="bb" @scroll="scrollHandler" ref="listDom2">
          <ul @click="turnTo('/baishitong/find/details/'+item.guid)" v-for="(item,index) in contentList" :key="index" class="findList">
            <li>
              <p class="textHidden">{{item.title}}</p>
              <span>评分：
                <a style="color:#FFB03E;font-size:.3rem">{{item.grade}}</a>
              </span>
            </li>
            <li>
              <p class="textHidden2">{{item.content}}</p>
            </li>
            <li>
              <p>
                <a>{{item.bp}}商机点</a>
                <p class="aa" v-show="todo!=''" v-for="(todo,index) in item.keyword" :key="index">{{todo}}</p>
              </p>
              <span>{{item.createDate}}</span>
            </li>
          </ul>
          <div  class="Section">
            <div v-if="parameter.pageNo <= parameter.pageCount">
              <div class="a b1">
                <ul>
               <li></li>
               <li></li>
               <li></li>
                </ul></div>

            </div>
            <div v-else>啦啦啦，啦啦啦，没有数据啦~~</div>
          </div>
        </div>
      </yd-tab-panel>
      <yd-tab-panel :label="kaType3.dictDataName" :tabkey='kaType3.guid' style="background:#EFEFEF">
        <div class="bb" @scroll="scrollHandler" ref="listDom3">
          <ul @click="turnTo('/baishitong/find/details/'+item.guid)" v-for="(item,index) in contentList" :key="index" class="findList">
            <li>
              <p class="textHidden">{{item.title}}</p>
              <span>评分：
                <a style="color:#FFB03E;font-size:.3rem">{{item.grade}}</a>
              </span>
            </li>
            <li>
              <p class="textHidden2">{{item.content}}</p>
            </li>
            <li>
              <p>
                <a>{{item.bp}}个商机点</a>
                <p class="aa" v-show="todo!=''" v-for="(todo,index) in item.keyword" :key="index">{{todo}}</p>
              </p>
              <span>{{item.createDate}}</span>
            </li>
          </ul>
          <div class="Section">
            <div v-if="parameter.pageNo <= parameter.pageCount">
              <div class="a b1">
                <ul>
               <li></li>
               <li></li>
               <li></li>
                </ul></div>

            </div>
            <div v-else>啦啦啦，啦啦啦，没有数据啦~~</div>
          </div>
        </div>
      </yd-tab-panel>
    </yd-tab>
  </div>
</template>
<script>
import Vue from "vue";
import fn from "@/assets/js/product";
import qs from "qs";
import { Search } from "vue-ydui/dist/lib.rem/search";
Vue.component(Search.name, Search);
import { DateTime } from "vue-ydui/dist/lib.rem/datetime";
Vue.component(DateTime.name, DateTime);
import { Tab, TabPanel } from "vue-ydui/dist/lib.rem/tab";
Vue.component(Tab.name, Tab);
Vue.component(TabPanel.name, TabPanel);
import {
  Confirm,
  Alert,
  Toast,
  Notify,
  Loading
} from "vue-ydui/dist/lib.rem/dialog";
Vue.prototype.$dialog = {
  confirm: Confirm,
  alert: Alert,
  toast: Toast,
  notify: Notify,
  loading: Loading
};
import store from "@/store";

export default {
  data() {
    var userInfo = {},
      mainColor;
    var para = this.$route.query;
    if (para.token) {
      localStorage.setItem("app",true)
      this.getUserInfo(
        {
          token: para.token,
          userId: para.userId
        },
        res => {
          this.parameter.userId = para.userId;
          this.getkey = para.token;
          this.getknowAllList();
          this.getKaType();
        }
      );
    }
    return {
      mainColor: "",
      organInfo: "",
      userInfo: "",
      value: "",
      datetime0: this.$today(),
      datetime1: this.$today(),
      show: false,
      show1: true,
      contentList: [],
      parameter: {
        token: "",
        userId: null,
        typeId: null,
        pageNo: 1,
        pageSize: 4,
        pageCount: null,
        guid: null,
        keyword: "",
        startDate: "",
        endDate: ""
      },
      kaType: [],
      kaType1: {},
      kaType2: {},
      kaType3: {},
      guid: null
    };
  },
  computed: {},
  watch: {
    "parameter.guid": "getknowAllList"
  },
  methods: {
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
            localStorage.setItem(
              "app",true
            );
            this.parameter.userId = this.$route.query.userId;
            fn.setIng(this.$route.query.token);
            console.log(this.$getkey())
            var a = res.data.data.userInfo.organType;
            var b = res.data.data.userInfo.admin ? 1 : 0;
            localStorage.setItem("organType", a);
            localStorage.setItem("isManger", b);
            localStorage.setItem("user_Id", res.data.data.userInfo.guid);
            this.mainColor=this.$color[a]
            this.$emit("mainColor", this.$color[a]);
            this.$emit("organType", a);
            cb && cb(res.data);
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        });
    },
    clickTime() {
      this.parameter.pageNo = 1;
      this.parameter.startDate = this.datetime0;
      this.parameter.endDate = this.datetime1;
      this.getknowAllList();
      this.show = false;
      this.parameter.startDate=''
      this.parameter.endDate=''

    },
    scrollHandler() {
      if (store.loading || this.parameter.pageNo > this.parameter.pageCount) {
        return;
      }
      let listDom = this.$refs.listDom;
      if (
        listDom.scrollHeight - listDom.scrollTop - listDom.clientHeight <
        100
      ) {
        this.getknowAllList();
      }
      let listDom1 = this.$refs.listDom1;
      if (
        listDom1.scrollHeight - listDom1.scrollTop - listDom1.clientHeight <
        100
      ) {
        this.getknowAllList();
      }
      let listDom2 = this.$refs.listDom2;
      if (
        listDom2.scrollHeight - listDom2.scrollTop - listDom2.clientHeight <
        100
      ) {
        this.getknowAllList();
      }
      let listDom3 = this.$refs.listDom3;
      if (
        listDom3.scrollHeight - listDom3.scrollTop - listDom3.clientHeight <
        100
      ) {
        this.getknowAllList();
      }
    },
    callback(val, guid) {
      this.parameter.guid = guid;
      this.parameter.pageNo = 1;
      this.parameter.pageSize = 4;
      this.guid = guid;
      this.contentList = [];
      console.log(val);
      // this.getknowAllList();
    },
    toggle() {
      this.show = !this.show;
    },
    turnTo(url) {
      this.$router.push(url);
    },
    submitHandler(value) {
      this.parameter.pageNo = 1;
      this.$dialog.toast({ mes: `搜索：${value}` });
      this.getknowAllList();
    },
    getKaType(){
        this.xhr.post(`${this.subUrl.user}/comm/getKaType`).then((res) => {
          if (res.data.code == 1) {
            // this.kaType=res.data.data;
            this.kaType1=res.data.data[0];
            this.kaType2=res.data.data[1];
            this.kaType3=res.data.data[2];
            console.log(this.kaType)
          } else if (res.data.code == '-902'){
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      },
    getknowAllList() {
      var data = {
        userId: this.parameter.userId,
        pageNo: this.parameter.pageNo,
        pageSize: this.parameter.pageSize
      };
      if(this.$route.query.userId){
         data.userId = this.$route.query.userId
      }
      if(this.$route.query.token){
        data.token = this.$route.query.token
      }else{
        data.token = this.$getkey();
      }
      console.log(data)
      if (this.parameter.guid != null) {
        data.typeId = this.parameter.guid;
      }
      if (this.value != "") {
        data.keyword = this.value;
      }
      if (this.parameter.startDate != "") {
        data.startDate = this.parameter.startDate + " 00:00:00";
      }
      if (this.parameter.endDate != "") {
        data.endDate = this.parameter.endDate + " 23:59:59";
      }

      this.xhr
        .post(`${this.subUrl.bd}/knowAll/getknowAllList`, qs.stringify(data))
        .then(res => {
          if (res.data.code == 1) {
            this.$dialog.loading.close();
            if (res.data.data.list != null) {
              res.data.data.list.forEach(element => {
                element.createDate = element.createDate.split(" ")[0];
                element.keyword = element.keyword.split(",");
              });
            }

            this.parameter.pageCount = res.data.data.pageCount;

            if (this.parameter.pageNo >= 2) {
              this.contentList = this.contentList.concat(res.data.data.list);
            } else {
              this.contentList = res.data.data.list;
            }
            this.parameter.pageNo++;
          } else if (res.data.code == "-902") {
            fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        });
    }
  },
  mounted() {
    if (!this.$route.query.token) {
      this.userInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("userInfo"))
      );
      this.organInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("organInfo"))
      );
      this.mainColor = this.$color[this.userInfo.organType];
      this.parameter.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      this.getKaType();
    }
  },
  beforeUpdate() {}
};
</script>
<style scoped>
.find {
  width: 100%;
}

.search {
  width: 100%;
  height: 0.95rem;
  background: #f7f7f9;
  position: relative;
}

.search ul {
  width: 100%;
  height: 0.95rem;
  display: flex;
  align-items: center;
}

.search ul li:nth-child(1) {
  flex: 1;
  height: 0.95rem;
}

.search ul li:nth-child(2) {
  width: 1.2rem;
  display: flex;
  justify-content: center;
  height: 0.95rem;
  align-items: center;
}

.search ol {
  width: 100%;
  background: white;
  z-index: 999;
  position: absolute;
}

.search ol li {
  width: 100%;
  display: flex;
  flex-flow: row;
  align-items: center;
}

.search ol li:nth-child(1) {
  padding: 0.1rem 0.2rem;
}

.search ol li:nth-child(2) {
  justify-content: center;
}

.search ol li:nth-child(2) p {
  display: flex;
  align-items: center;
  background: #f4f4f4;
  padding: 0.1rem;
}

.search ol li:nth-child(2) p span {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 0.5rem;
  border-radius: 0.05rem;
  background: white;
  margin: 0 0.2rem;
}

.search ol li:nth-child(3) {
  justify-content: space-between;
  padding: 0.2rem 0.2rem;
}

.search ol li:nth-child(3) span {
  border-radius: 0.05rem;
  border: 2px solid #e9e9e9;
  width: 1.2rem;
  height: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.fixed {
  position: fixed;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.1);
  z-index: 888;
}

.bb {
  overflow-y: scroll;
  height: calc(100vh - 3.75rem);
}

.findList {
  width: 100%;
  padding: 0.1rem 0.18rem;
  margin-bottom: 0.2rem;
  background: white;
  display: flex;
  flex-flow: column;
}

.findList > li {
  width: 100%;
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.1rem;
}

.findList > li:nth-child(1) {
  border-bottom: 1px dashed #d4d5d5;
  height: 0.8rem;
}

.findList > li:nth-child(1) > p {
  flex: 1;
  font-size: 0.3rem;
  font-weight: 600;
}

.findList > li:nth-child(1) > span {
  width: 1.6rem;
  font-size: 0.24rem;
  color: #8e8e8e;
  text-align: right;
}

.findList > li:nth-child(2) {
  height: 1.2rem;
}

.findList > li:nth-child(2) > p {
  text-indent: 0.6rem;
  line-height: 0.4rem;
  color: #5d5d5d;
}

.findList > li:nth-child(3) > p {
  flex: 1;
  display: flex;
  align-items: center;
}

.findList > li:nth-child(3) > p > a {
  width: 1.8rem;
  color: #ff900b;
  font-size: 0.3rem;
  text-align: center;
}

.aa {
  width: 1.8rem;
  color: #2bbaff;
  font-size: 0.25rem;
  height: 0.4rem;
  background: #e9f8ff;
  margin-left: 0.1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.findList > li:nth-child(3) > span {
  width: 1.5rem;
  font-size: 0.24rem;
  color: #8e8e8e;
  text-align: right;
}
</style>
