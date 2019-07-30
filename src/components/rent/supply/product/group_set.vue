<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" title="团购设置" :bgcolor="mainColor" color="#fff">
      <span class="addClickArea" slot="left" @click="back" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
      <span slot="right" style="color:white" @click="confirm"  class="addClickArea font30 spanRight">确定</span>
    </yd-navbar>
  
    <div class="declares">
        <ol>
            <li sytle="color:#666"><p>数量限制</p></li>          
        </ol>
        <ul>
            <li>
            <span style="margin-right:.3rem;">
              <input v-model="bm.groupNumber" type="number" v-if="!groupNumber">
              <input v-model="bm.groupNumber" type="number" disabled="disabled" v-else>
            </span>
            <yd-checkbox  v-model="groupNumber" size="16">不限</yd-checkbox>
            </li>
        </ul>
    </div>


    <div class="declares">
        <ol>
            <li sytle="color:#666"><p>起止日期</p></li>          
        </ol>
        <ul>
            <li><p>开始日期</p><span>
                <yd-datetime type="datetime" v-model="bm.startTime" slot="right"></yd-datetime>
                </span></li>
            <li><p>截止日期</p><span>
                <yd-datetime type="datetime" v-model="bm.endTime" slot="right"></yd-datetime>
                </span></li>
        </ul>
    </div>

   <div class="declares">
        <ol>
            <li sytle="color:#666"><p>描述</p></li>          
        </ol>
        <ul>
            <li style="flex-flow:column;align-items:flex-start;">
                <span style="width:100%;"><input type="text" @blur="ps" v-model="priceSection[0]"></span>
                <p style="font-size:.24rem;justify-content:flex-start;height:.5rem;width:100%">
                    示例: <=10 980元/台</p></li>
            <li style="flex-flow:column;align-items:flex-start;">
                <span style="width:100%;"><input type="text" @blur="ps" v-model="priceSection[1]"></span>
                <p style="font-size:.24rem;justify-content:flex-start;height:.5rem;width:100%">
                    示例: >10 900元/台</p></li>
        </ul>
    </div>

  </yd-layout>
</template>
<script>
  import fn from "@/assets/js/product";
  import qs from "qs";
  import InfiniteScroll from "vue-infinite-scroll";
  import Vue from "vue";
  import { CellGroup, CellItem } from "vue-ydui/dist/lib.rem/cell";
  import {CheckBox, CheckBoxGroup} from 'vue-ydui/dist/lib.rem/checkbox';
  import {TextArea} from 'vue-ydui/dist/lib.rem/textarea';
  import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog';
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
  import { Radio, RadioGroup } from "vue-ydui/dist/lib.rem/radio";
  Vue.component(Radio.name, Radio);
  Vue.component(RadioGroup.name, RadioGroup);
  export default {
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
      } else{
        TypeListCircle = 3
      }
      return {
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
        alertT:false,
        info:{
          name:'',mobile:null,decorationId:null,type:''
        },
        regId:/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
        regName:/^[a-zA-Z\u4e00-\u9fa5]+$/,
        regPhone:/^1[3578]\d{9}$/,
        getHearLog:{
          domain:'',
          token:'',
          name:''
        },
        imgName:[],
        imgUrl:[],
        show1:true,
        images:[],
        datetime2:this.$today(),
        datetime1:this.$today(),
        bm:{
          groupNumber:0,
          startTime:this.$today()+' 00:00',
          endTime:this.$today()+' 23:59',
          priceSectionDescribe:'',
        },
        priceSection:[],
        groupNumber:false,
        
      };
    },
    watch:{
      'groupNumber':'gNumber'
    },
    methods: {
      ps(){
        this.bm.priceSectionDescribe=this.priceSection.join(',')
        console.log(this.bm.priceSectionDescribe,this.priceSection)
      },
      gNumber(){
        this.bm.groupNumber=0
      },
      add(){
        this.alertT=true;
      },
      confirm(){
        if(this.priceSection.length!=2){
            this.$dialog.toast({mes: '描述不能有空！'});
        }else{
            this.$emit('bmData',this.bm)

        }
      },
      nameBlur(){
        if(!this.regName.test(this.info.name)){
          this.$dialog.toast({mes: '请输入规范名字'});
          this.info.name=""
        }else if(this.info.name==null){
          this.$dialog.toast({mes: '名字不能为空'});
        }
      },
      idBlur(){
         if(!this.regId.test(this.info.decorationId)){
          this.$dialog.toast({mes: '身份号码格式错误'});
          this.info.decorationId=""
        }else if(this.info.decorationId==null){
          this.$dialog.toast({mes: '身份号码不能为空'});
        }
      },
      phoneBlur(){
         if(!this.regPhone.test(this.info.mobile)){
          this.$dialog.toast({mes: '手机号格式错误'});
          this.info.mobile=""
        }else if(this.info.mobile==null){
          this.$dialog.toast({mes: '手机号码不能为空'});
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
            this.pianList = res.data;
          },
          this
        );
      },
      selectTab(index) {
        this.showTab = index;
      },
      cancel() {
        this.alertT=false;
      },
      back() {
        // this.$router.go(-1);
        this.$emit('bmData')
      }
    },
    mounted() {
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      this.getPlace();
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
    border-bottom:1px solid #ECECEC;
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
    background: #fff;
    margin-top: 1em;
    border-bottom: 1px solid #e6e6e6;
  }

  .to-select>div>span {
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
  .er{margin-left:.4rem;border-bottom:1px solid #ECECEC;}

  .declares {
  width: 100%;background: white;margin-bottom: .2rem;
}
.declares>ul {
  width: 100%;
  padding: 0.2rem 0.4rem;
}
.declares>ul li {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
  margin: 0.2rem 0;
}
.declares>ul li > p {
  width: 1.6rem;
  display: flex;
  justify-content: center;
  height: 0.7rem;
  align-items: center;
  font-size: 0.3rem;
  color: #777;
}
.declares>ul li > span {
  flex: 1;
  height: 0.7rem;
  border: 1px solid #d9d9d9;
  border-radius: 0.05rem;
  margin-right:.2rem;
  display: flex;align-items: center;
}
.declares>ul li > span > input {
  width: 100%;
  height: 100%;
  border: none;
  margin-left: 0.1rem;
}

.declares>ol {
  width: 100%;
}
.declares>ol li{
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  height:.8rem;
  color: #777;
  padding:0 .4rem;
  align-items: center;
}
.declares>ol li>p{flex:1;}
.declares>ol li>span{width:1.5rem;}
.declares>ol li:nth-child(1){
  border-bottom:1px solid #ECECEC;
}
.textar{display: flex;padding:.1rem .3rem;}
.textar>span{width:100%;height:100%;border:1px solid #d9d9d9;}

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

.declares>ol li > a {
  width: 2rem;
  display: flex;
  flex-flow: row;
  align-items: center;
  color: #0093d2;
}
.declares>ol li > a > i {
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
  .alertText{width:100%;position:fixed;height:100vh;background: rgba(0,0,0,.2);top:0;left:0;display: flex;justify-content: center;align-items: center;}
  .alertText>ul{width:6.5rem;height:5rem;background: white;padding:.2rem .3rem;
  border-radius: .2rem;display: flex;flex-flow: column;justify-content: center;}
  .alertText ul li.a{width:100%;display:flex;flex-flow:row; align-items:center;padding:.1rem 0;}
  .alertText ul li.a>span{border-radius:.05rem;flex:1;border:1px solid #E6E7E7;height:.7rem;display: flex;align-items:center;}
  .alertText ul li.a>p{width:1.8rem;text-align: right;}
  .alertText ul li.a>span>input{border:none;margin-left:.2rem;height: 100%;width:100%;}
  .alertText ul li:nth-child(4){margin-top:.2rem;display: flex;justify-content: space-around;}
  .alertText ul li:nth-child(4)>button{font-size:.32rem;font-weight:600;color:white;
  padding:.2rem .5rem;border:none;border-radius: .1rem;}

  .details{width:100%;background: white;}
  .text{width:100%;padding:.1rem .3rem;color:#999;}
  .images{display: flex;width:100%;padding:.1rem .3rem;}
  .images>p{border:2px dashed #B6CEEC;width:1.2rem;height:1.2rem;display: flex;
  justify-content:center;align-items:center;border-radius:.1rem;position:relative;}
  .images>p>img{width:.6rem;height:.6rem;}
  .images>ul{display: flex;flex-flow:row;justify-content:center;align-items:center;}
  .images>ul>li{width:1.2rem;height:1.2rem;margin:0 .1rem;}
  .images>ul>li>img{width:1.2rem;height:1.2rem;border-radius:.1rem;}
  .images>p>input{width:100%;height:.9rem;opacity: 0;position: absolute;left:0;top:0;}
</style>