<template>
  <div style="height:100vh">
    <Class v-show="!showshow" @bmData='bmData'></Class>
    <yd-layout class="edit" v-show="showshow">
      <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" v-title="'发布采购'" title="发布采购"
                 :bgcolor="mainColor" color="#fff">
      <span class="addClickArea" slot="left" @click="back" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
      </yd-navbar>
      <div>
        <yd-cell-group>
          <yd-cell-item arrow type="link" href="" @click.native="open">
            <span class="font30" slot="left">选择产品/服务分类</span>
            <span class="yd_bu font28" slot="right">{{bm.className==null?'请选择':bm.className}}</span>
          </yd-cell-item>
        </yd-cell-group>
      </div>
      <div class="declares">
        <ul>
          <li><p>标题</p><span><input v-model="bm.title" type="text"></span>
            <yd-checkbox v-model="isUrgent" size="16">急</yd-checkbox>
          </li>
          <li><p>采购数量</p><span><input v-model="bm.number" type="number"></span></li>
          <li><p>截至日期</p><span style="display:flex;align-items:center;"><yd-datetime type="date" v-model="bm.endTime"
                                                                                     slot="right"></yd-datetime></span>
          </li>
          <li><p>交货地址</p><span><input v-model="bm.deliveryAddress" type="text"></span></li>
        </ul>
      </div>

      <div class="declares" style="margin:.2rem 0">
        <ol>
          <li style="color:#666;"><p>产品/服务</p><span>数量</span><span>金额</span></li>
          <li v-show="bm.purchaseDetailsList.length>0" v-for="(item,index) in bm.purchaseDetailsList" :key="index">
            <p>{{item.productService}}</p><span>{{item.number}}</span><span>{{item.money}}</span>
          </li>
          <li><a @click="add"><i>+</i>添加</a></li>
        </ol>
        <div class="textar">
          <span>
            <yd-textarea slot="right" placeholder="说明/附言" v-model="bm.explains" maxlength="100"></yd-textarea>
          </span>
        </div>
        <div class="important-input-div">
          <input type="text" v-model="keyword[0]" @blur="keywordS" placeholder="输入关键词">
          <input placeholder="输入关键词" @blur="keywordS" v-model="keyword[1]" type="text">
          <input placeholder="输入关键词" @blur="keywordS" v-model="keyword[2]" type="text">
        </div>
      </div>

      <yd-accordion accordion style="background:none;">
        <yd-accordion-item title="发布范围" style="margin-bottom:.2rem;background:#fff;" open>
          <div style="padding: .24rem;">
            <yd-radio-group v-model="bm.positionCondition">
              <yd-radio class="choose_item" v-for="(item,index) in pianList" :key="index" :val="index"
                        :color='mainColor'>
                <span class="scope">{{item.name}}</span>
                <span>{{item.scopeName}}</span>
              </yd-radio>
            </yd-radio-group>
          </div>
        </yd-accordion-item>

        <yd-accordion-item title="供应商要求" style="margin-bottom:.2rem;background:#fff;" open>
          <div style="padding: .24rem;">
            <yd-radio-group v-model="bm.levelCondition">
              <yd-radio class="choose_item" val="0" :color='mainColor'>
                <span class="scope">不限</span>
              </yd-radio>
              <yd-radio class="choose_item" val="1" :color='mainColor'>
                <span class="scope">基础会员</span>
              </yd-radio>
              <yd-radio class="choose_item" val="2" :color='mainColor'>
                <span class="scope">中级会员</span>
              </yd-radio>
              <yd-radio class="choose_item" val="3" :color='mainColor'>
                <span class="scope">高级会员</span>
              </yd-radio>
              <yd-radio class="choose_item" val="4" :color='mainColor'>
                <span class="scope">金牌会员</span>
              </yd-radio>
            </yd-radio-group>
          </div>
        </yd-accordion-item>
      </yd-accordion>
      <div class="to-select">
        <div class="buttonBox">
          <yd-button size="large" class="send" @click.native="openConfrim" :bgcolor="mainColor" color='#fff'
                     type="primary">立即发布
          </yd-button>
        </div>
      </div>

      <div class="alertText" v-show="alertT">
        <ul>
          <li class="a"><p class="font28">产品/服务：</p><span><input v-model="childs.productService" type="text"
                                                                 placeholder="请填写"></span></li>
          <li class="a"><p class="font28">数量：</p><span><input v-model="childs.number" type="number"
                                                              placeholder="请填写"></span></li>
          <li class="a"><p class="font28">价格：</p><span><input v-model="childs.money" type="number"
                                                              placeholder="请填写"></span></li>
          <li>
            <button @click="cancel" :style="{background:mainColor}">取 消</button>
            <button @click="confirm" :style="{background:mainColor}">确 定</button>
          </li>
        </ul>
      </div>
    </yd-layout>
  </div>
</template>
<script>
  import fn from "@/assets/js/product";
  import qs from "qs";
  import Class from "./classification.vue"
  import InfiniteScroll from "vue-infinite-scroll";
  import Vue from "vue";
  import store from '@/store'
  import {CellGroup, CellItem} from "vue-ydui/dist/lib.rem/cell";
  import {CheckBox, CheckBoxGroup} from 'vue-ydui/dist/lib.rem/checkbox';
  import {TextArea} from 'vue-ydui/dist/lib.rem/textarea';
  import {Confirm, Alert, Toast, Notify, Loading} from 'vue-ydui/dist/lib.rem/dialog';
  import {DateTime} from 'vue-ydui/dist/lib.rem/datetime';

  Vue.component(DateTime.name, DateTime);
  Vue.prototype.$dialog = {
    confirm: Confirm,
    alert: Alert,
    toast: Toast,
    notify: Notify,
    loading: Loading,
  };
  Vue.component(TextArea.name, TextArea);
  Vue.component(CheckBox.name, CheckBox);
  Vue.component(CheckBoxGroup.name, CheckBoxGroup);
  Vue.component(CellGroup.name, CellGroup);
  Vue.component(CellItem.name, CellItem);
  import {Radio, RadioGroup} from "vue-ydui/dist/lib.rem/radio";

  Vue.component(Radio.name, Radio);
  Vue.component(RadioGroup.name, RadioGroup);
  export default {
    components: {
      Class
    },
    data() {
      let userInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("userInfo"))
      );
      let mainColor = this.$color[userInfo.organType];
      let endTime = this.$today();
      var organInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("organInfo"))
      );
      // 圈子类型 1企业 2 个人 3 物业
      //用户类型 1:租户；2:商家；3:管理处；4:物业公司；5:其他（个人）；6：业主 0为空
      // 根据用户类型判断
      var userType = userInfo.organType
      let TypeListCircle;
      if (userType == 1) {
        TypeListCircle = 1;
      } else if (userType == 5) {
        TypeListCircle = 2;
      } else {
        TypeListCircle = 3
      }
      return {
        showshow: true,
        picked: false,
        peopleNum: "",
        organInfo,
        mainColor,
        userInfo,
        imgLength: 0,
        imgIndex: 0,
        TypeListCircle,
        bbsList: [],
        pianList: [],
        uploadFileList: [],
        uploadPreviewList: [],
        selectList: [],
        keyword: [],
        checkbox: false,
        agree: false,
        title: "",
        showTab: 0,
        text: "",
        getData: "",
        getLogoMsg: "",
        imageUrlList: [],
        imageKeyList: [],
        imageUrl: "",
        TypeList: "",
        TypeList1: -1,
        TypeList2: "",
        TypeList3: [],
        endTime,
        alertT: false,
        info: {
          name: '', mobile: null, decorationId: null, type: ''
        },
        regId: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
        regName: /^[a-zA-Z\u4e00-\u9fa5]+$/,
        regPhone: /^1[3578]\d{9}$/,
        bm: {
          className: '',
          token: '',
          title: '',
          number: 1,
          startTime: '',
          endTime: this.$today(),
          deliveryAddress: '',
          explains: '',
          isUrgent: 2,
          keyword: '',
          positionCondition: 0,
          scopeValue: 0,
          levelCondition: 0,
          purchaseDetailsList: [],
          payType: 2,
          fatherClassId: null,
          classId: null,
        },
        isUrgent: false,
        childs: {
          money: null,
          number: null,
          productService: null
        },
        para: {
          value: null
        }

      };
    },
    watch: {
      'isUrgent': 'gent'
    },
    methods: {
      lookPhonePara() {
        let data = {};
        data.token = this.getkey;
        data.type = 'releasePurchase';
        this.$ajax(
          `${this.subUrl.bd}/purchase/lookPhonePara`,
          data,
          res => {
            this.para = res.data.para
            console.log(this.para.value)
          },
          this
        );
      },
      openConfrim() {
        this.$dialog.confirm({
          mes: '此次需支付' + this.para.value + '商机点！',
          opts: () => {
            this.releasePurchasing();
          }
        });
      },
      bmData(e) {
        this.showshow = true;
        if (e) {

        }
      },
      open() {
        this.showshow = false;
      },
      //发布采购
      releasePurchasing() {
        if (this.bm.classId == null || this.bm.fatherClassId == null) {
          this.$dialog.toast({mes: '请选择分类！'});
          return;
        }
        if (this.bm.title == '') {
          this.$dialog.toast({mes: '标题不能为空！'});
          return;
        }
        if (this.bm.deliveryAddress == '') {
          this.$dialog.toast({mes: '请填写交货地址！'});
          return;
        }
        if (this.bm.purchaseDetailsList.length <= 0) {
          this.$dialog.toast({mes: '请添加产品服务！'});
          return;
        }
        if (this.bm.explains == '') {
          this.$dialog.toast({mes: '说明处内容不能为空！'});
          return;
        }


        let data = {};
        data.token = this.getkey;
        data.title = this.bm.title;
        data.number = this.bm.number;
        data.endTime = this.bm.endTime;
        data.deliveryAddress = this.bm.deliveryAddress;
        data.explains = this.bm.explains;
        data.isUrgent = this.bm.isUrgent;
        data.keyword = this.bm.keyword;
        data.positionCondition = this.bm.positionCondition;
        data.scopeValue = this.bm.scopeValue;
        data.levelCondition = this.bm.levelCondition;
        // data.purchaseDetailsList=this.bm.purchaseDetailsList;
        data.payType = this.bm.payType;
        data.fatherClassId = this.bm.fatherClassId;
        data.classId = this.bm.classId;
        this.$ajax1(
          `${this.subUrl.bd}/purchase/releasePurchasing?${this.$qs.stringify(data)}`,
          this.bm.purchaseDetailsList,
          res => {
            this.$dialog.toast({mes: '发布成功！'});
            this.back();
          },
          this
        );
        store.guid = null;
        store.name = null;
        store.fguid = null;
      },
      gent() {
        if (this.isUrgent == false) {
          this.bm.isUrgent = 2;
        } else {
          this.bm.isUrgent = 1;
        }
        console.log(this.bm.isUrgent)
      },
      keywordS() {
        this.bm.keyword = this.keyword.join(',')
      },
      add() {
        this.alertT = true;
      },
      confirm() {
        if (this.childs.productService != null || this.childs.number != null || this.childs.money != null) {
          this.bm.purchaseDetailsList.push(
            {
              money: this.childs.money,
              number: this.childs.number,
              productService: this.childs.productService
            }
          );
          this.childs = {}
          this.alertT = false;
          this.$dialog.toast({mes: '添加成功！'});
          console.log(this.bm.purchaseDetailsList)
        } else {
          this.$dialog.toast({mes: '以上内容皆不能为空！'});
        }
      },
      // 获取发布范围
      getPlace(data) {
        data = data ? data : {};
        data.userId = this.userInfo.guid;
        data.token = this.getkey;
        this.$ajax(
          `${this.subUrl.bd}/knowAll/userDistrict`,
          data,
          res => {
            this.pianList = res.data.reverse();
          },
          this
        );
      },
      selectTab(index) {
        this.showTab = index;
      },
      cancel() {
        this.alertT = false;
      },
      back() {
        this.$back(this);
        store.guid = null;
        store.name = null;
        store.fguid = null;
      }
    },
    mounted() {
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      this.lookPhonePara()
      this.getPlace();
    },
    beforeUpdate() {
      this.bm.className = store.name;
      this.bm.classId = store.guid;
      this.bm.fatherClassId = store.fguid;
    }
  };
</script>
<style scoped>

  .send {
    margin: 0;
  }

  .choose_item {
    height: 0.6rem;
    white-space: nowrap;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ECECEC;
  }

  .choose_item span {
    margin-right: 0.2rem;
  }

  .buttonBox {
    padding: 0 0.2rem 0.3rem;
  }

  .important-input-div {
    width: 100%;
    background: #ffffff;
    padding-bottom: 0.5em;
    display: flex;
    flex-wrap: wrap;
    padding: .2rem 0.3rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .important-input-div input {
    width: 1.45rem;
    font-size: 0.26rem;
    color: #999999;
    line-height: 0.38rem;
    border: none;
    border: 1px solid #ddd;
    border-radius: 0.05rem;
    text-align: center;
    margin-right: 0.2rem;
  }

  .to-select {
    width: 100%;
    margin-top: 1em;
    border-bottom: 1px solid #e6e6e6;
  }

  .to-select > div > span {
    transform: rotate(90deg);
  }

  /*transform:rotate(45deg)*/

  .important-input-div input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    font-size: 0.24rem;
    color: #999999;
    opacity: 1;
  }

  .important-input-div input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    font-size: 0.24rem;
    color: #999999;
    opacity: 1;
  }

  .important-input-div input:-ms-input-placeholder {
    font-size: 0.24rem;
    color: #999999;
    opacity: 1;
  }

  .important-input-div input::-webkit-input-placeholder {
    font-size: 0.24rem;
    color: #999999;
    opacity: 1;
  }

  .er {
    margin-left: .4rem;
    border-bottom: 1px solid #ECECEC;
  }

  .declares {
    width: 100%;
    background: white;
  }

  .declares ul {
    width: 100%;
    padding: 0.2rem 0.4rem;
  }

  .declares ul li {
    display: flex;
    flex-flow: row;
    justify-content: center;
    align-items: center;
    margin: 0.2rem 0;
  }

  .declares ul li > p {
    width: 1.6rem;
    display: flex;
    justify-content: center;
    height: 0.7rem;
    align-items: center;
    font-size: 0.3rem;
    color: #777;
  }

  .declares ul li > span {
    flex: 1;
    height: 0.7rem;
    border: 1px solid #d9d9d9;
    border-radius: 0.05rem;
    margin-right: .2rem;
  }

  .declares ul li > span > input {
    width: 100%;
    height: 100%;
    border: none;
    margin-left: 0.1rem;
  }

  .declares ol {
    width: 100%;
  }

  .declares ol li {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    height: .8rem;
    color: #777;
    padding: 0 .4rem;
    align-items: center;
  }

  .declares ol li > p {
    flex: 1;
  }

  .declares ol li > span {
    width: 1.5rem;
  }

  .declares ol li:nth-child(1) {
    border-bottom: 1px solid #ECECEC;
  }

  .textar {
    display: flex;
    padding: .1rem .3rem;
  }

  .textar > span {
    width: 100%;
    height: 100%;
    border: 1px solid #d9d9d9;
  }

  .imgas.a > a {
    display: flex;
    height: 1rem;
    width: 1rem;
    margin-top: 0.2rem;
  }

  .imgas.a > a > img {
    height: 1rem;
    width: 1rem;
    border-radius: 0.1rem;
    margin-right: 0.3rem;
  }

  .imgas.a {
    display: flex;
    flex-flow: column;
  }

  .declares ol li > a {
    width: 2rem;
    display: flex;
    flex-flow: row;
    align-items: center;
    color: #0093d2;
  }

  .declares ol li > a > i {
    border-radius: 50%;
    width: 0.4rem;
    height: 0.4rem;
    background: #0093d2;
    font-size: 0.4rem;
    display: flex;
    margin-right: 0.2rem;
    color: white;
    justify-content: center;
    align-items: center;
  }

  .alertText {
    z-index: 999;
    width: 100%;
    position: fixed;
    height: 100vh;
    background: rgba(0, 0, 0, .2);
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .alertText > ul {
    width: 6.5rem;
    height: 5rem;
    background: white;
    padding: .2rem .3rem;
    border-radius: .2rem;
    display: flex;
    flex-flow: column;
    justify-content: center;
  }

  .alertText ul li.a {
    width: 100%;
    display: flex;
    flex-flow: row;
    align-items: center;
    padding: .1rem 0;
  }

  .alertText ul li.a > span {
    border-radius: .05rem;
    flex: 1;
    border: 1px solid #E6E7E7;
    height: .7rem;
    display: flex;
    align-items: center;
  }

  .alertText ul li.a > p {
    width: 1.8rem;
    text-align: right;
  }

  .alertText ul li.a > span > input {
    border: none;
    margin-left: .2rem;
    height: 100%;
    width: 100%;
  }

  .alertText ul li:nth-child(4) {
    margin-top: .2rem;
    display: flex;
    justify-content: space-around;
  }

  .alertText ul li:nth-child(4) > button {
    font-size: .32rem;
    font-weight: 600;
    color: white;
    padding: .2rem .5rem;
    border: none;
    border-radius: .1rem;
  }
</style>
