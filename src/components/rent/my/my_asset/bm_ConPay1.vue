<template>
  <div class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'功能介绍'" title="功能介绍" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span class="spanLeft" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
         </span>
      </yd-navbar>
    </div>
    <div class="wai">
      <div class="recom">
        <div class="men_list">
          <span style="color:white;font-size:.4rem;">{{not_enabled_list.oneStr}}</span>
          <p class="font32 font600">{{not_enabled_list.name}}</p>
        </div>
        <ul class="font26">
          <li>{{not_enabled_list.describes}}</li>
        </ul>
      </div>

      <div class="cycle">
        <ul>
          <li>
            <span><img src="../../../../assets/images/rent/my/time.png" alt=""></span>
            <p>开通周期</p>
          </li>
          <li>
            <button class='font28' :class="{active:num1==index}"
                    :style="'background:'+(num1==index?mainColor:'#F6F6F6')"
                    v-for="(item,index) in cycles" @click="toggle1(index)" :key="index">{{item.str}}
            </button>
            <!--<span @click="toggle2"><input @blur="toggle3" v-model.lazy.number="input1" type="text"></span>-->
          </li>
          <li>
            <span><img src="../../../../assets/images/rent/my/price.png" alt=""></span>
            <p><span style="color:#DD2C33;" class="font600 font32">{{total}}</span>&nbsp;元</p>
          </li>
          <li>
            <span class="font26"></span>
          </li>
        </ul>
      </div>

      <div class="conpay">
        <ul>
          <li>
            <span class="font24">支付方式</span>
          </li>
          <li class="payType" v-for="(item,index) in radios" :key="index" @click="toggle(index)">
            <span><img :src="item.icon" alt=""></span>
            <p class="font30 font600">{{item.name}}</p>
            <i v-show="num==index"><img src="../../../../assets/images/rent/my/select_active.png" alt=""></i>
          </li>

        </ul>

        <div class="buttonp">
          <button class="font30 font600" :style="'background:'+mainColor" @click="payVip">立即开通</button>
          <p class="font24">会员服务条款 | 会员特权说明</p>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
  import Vue from 'vue';
  import fn from '@/assets/js/product'
  import qs from 'qs'
  import {Confirm, Alert, Toast, Notify, Loading} from 'vue-ydui/dist/lib.rem/dialog';

  Vue.prototype.$dialog = {
    confirm: Confirm,
    alert: Alert,
    toast: Toast,
    notify: Notify,
    loading: Loading,
  };
  export default {
    data() {
      return {
        mainColor: "",
        num: 0,
        num1: null,
        userInfo: '',
        organInfo: '',
        radios: [
          {icon: require('../../../../assets/images/rent/estate/shangjidian.png'), type: '1', name: "商机点支付"},
          // {icon: require('../../../../assets/images/rent/my/wei.png'), type: '1',name:"微信支付"}
        ],
        cycles: [
          {ui: 6, str: '6个月'},
          {ui: 12, str: '12个月'},
        ],
        totals: 0,
        index1: 0,
        input1: 0,
        total: 0,
        not_enabled_list: {}
      }
    },
    computed: {
      nums() {
        return parseInt(this.total / this.not_enabled_list.price)
      }
    },
    methods: {
      turnTo(url) {
        this.$router.push(url)
      },
      back() {
        this.$router.go(-1)
      },
      toggle(index) {
        this.num = index;
      },
      toggle1(index) {
        this.num1 = index;
        this.total = this.cycles[index].ui * this.not_enabled_list.price
        this.input1 = null;
      },
      toggle2() {
        this.num1 = null;
      },
      toggle3() {
        if (this.input1 == null) {
          this.$dialog.toast({mes: '内容不能为空！'});
          this.total = 0
        } else {
          this.total = parseInt(this.input1) * this.not_enabled_list.price;
        }

      },
      payVip() {
        if (this.nums != null && this.nums != 0) {
          //为企业购买传organInfo.organAccount 自己购买传userId;
          var data = {
            userId: this.organInfo.organAccount,
            token: this.$getkey(),
            busId: this.not_enabled_list.guid,
            num: this.nums,
            payType: 4
          };
          this.xhr.post(`${this.subUrl.user}/asset/payBusiness`, qs.stringify(data)).then((res) => {
            if (res.data.code == 1) {
              this.$dialog.toast({mes: '开通成功!', icon: 'success'});
              this.$router.go(-1)
            } else if (res.data.code == '-902') {//-902
              /*重新登录*/
              fn.re_login(this);
            } else {
              this.$dialog.toast({mes: res.data.msg});
            }
          })
        } else {
          this.$dialog.toast({mes: '请选择开通月数'});
        }

      },

    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = localStorage.getItem('mainColor');
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      this.not_enabled_list = JSON.parse(decodeURIComponent(localStorage.getItem('not_enabled_list')));
      console.log(JSON.stringify(this.not_enabled_list))
    },
    beforeUpdate() {
      this.num = this.num;
    }
  }
</script>
<style scoped>
  .layout_my .header:after {
    display: none;

  }

  .layout_my {
    background: #F7F7F9;
    width: 100 mv;
    height: 100vh;
  }

  .layout_my .blue_box {
    height: 0.88rem;
    background-size: 100% 100%;
  }

  .cycle {
    width: 100%;
    background: white;
    margin-top: .3rem;
  }

  .cycle ul {
    width: 100%;
  }

  .cycle ul li {
    padding: .2rem 0;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .cycle ul li:nth-child(1) > span {
    width: .4rem;
    height: .4rem;
  }

  .cycle ul li > span > img {
    width: 100%;
    height: 100%;
  }

  .cycle ul li:nth-child(3) > span {
    width: .4rem;
    height: .4rem;
  }

  .cycle ul li p {
    border-bottom: 1px solid #F8F8F8;
    flex: 1;
    padding: .2rem;
    color: #5C5C5C;
  }

  .cycle ul li span {
    margin-left: .3rem;
  }

  .cycle ul li:nth-child(4) {
    height: .5rem;
    color: #7D7D7D;
  }

  .cycle ul li:nth-child(4) > span {
    margin-top: -.2rem;
  }

  .cycle ul li:nth-child(2) > button {
    border: none;
    border-radius: .1rem;
    padding: .1rem .3rem;
    margin: 0 .1rem;
    color: #737373;
  }

  .cycle ul li:nth-child(2) > button:nth-child(1) {
    margin-left: 1rem;
  }

  .cycle ul li:nth-child(2) .active {
    color: white;
  }

  .cycle ul li:nth-child(2) > span {
    width: 1rem;
    height: .57rem;
    border-radius: .1rem;
    border: 1px solid #ccc;
  }

  .cycle ul li:nth-child(2) > span > input {
    width: 100%;
    height: 100%;
    border: none;
  }

  .wai {
    width: 100%;
    height: calc(100vh - .88rem);
    overflow-y: scroll;
  }

  .recom {
    width: 100%;
    padding: .2rem;
    background: white;
  }

  .men_list {
    display: flex;
    flex-direction: row;
  }

  .men_list span {
    width: .8rem;
    height: .8rem;
    border-radius: 50%;
    background: url('../../../../assets/images/rent/my/bjList.png');
    display: flex;
    justify-content: center;
    align-items: center;
    background-size: 100% 100%;
  }

  .men_list > span > img {
    width: 100%;
    height: 100%;
  }

  .men_list p {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 0 0.2rem
  }

  .font32 {
    color: #333333;
  }

  .recom ul {
    border: 1px solid #F8F8F8;
    margin-top: .2rem;
    border-radius: .1rem;
    color: #6E6E6E;
    padding: 0 .2rem;
  }

  .recom ul li {
    padding: .05rem 0;
    width: 100%;
    height: 2rem;
  }

  .conpay {
    width: 100%;
  }

  .conpay ul {
    width: 100%;
  }

  .conpay ul li {
    background: white;
    width: 100%;
    display: flex;
    flex-direction: row;
    height: .9rem;
    align-items: center;
    border-bottom: 1px solid #EFEFF0;
    padding: 0 .3rem
  }

  .conpay ul li img {
    width: 100%;
    height: 100%;
  }

  .conpay ul li:nth-child(1) {
    background: none;
    height: .8rem;
  }

  .conpay ul li:nth-child(2) > span {
    width: .6rem;
    height: .6rem;
    margin-right: 0.2rem;
  }

  .payType > span {
    width: .6rem;
    height: .6rem;
    margin-right: .2rem;
  }

  .payType > p {
    flex: 1;
    margin-right: 0.2rem;
  }

  .payType > p {
    flex: 1;
    margin-right: .2rem;
  }

  .payType > i {
    width: .5rem;
    height: .5rem;
    border-radius: 50%;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .payType > i {
    width: .5rem;
    height: .5rem;
    border-radius: 50%;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .font24 {
    color: #727272;
  }

  .buttonp {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: .4rem;
  }

  .buttonp button {
    width: 80%;
    border: none;
    height: .8rem;
    color: white;
    margin-bottom: .1rem;
    border-radius: 0.1rem;
  }

</style>
