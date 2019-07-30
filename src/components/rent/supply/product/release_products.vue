<template>
 <div style="height:100vh">
  <Set v-show="!showshow" @bmData='bmData'></Set>
  <Class v-show="!showshow1" @bmData1='bmData1'></Class>
  <yd-layout v-show="showshow||showshow1" class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" v-title="'发布产品'" title="发布产品" :bgcolor="mainColor" color="#fff">
      <span class="addClickArea" slot="left" @click="back" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
    </yd-navbar>

    <yd-cell-group>
            <yd-cell-item arrow type="link" href="" @click.native="open1">
              <span class="font30" slot="left">选择产品/服务分类</span>
              <span class="yd_bu font28" slot="right">{{bm.className==null?'请选择':bm.className}}</span>
            </yd-cell-item>
    </yd-cell-group>

    <div class="declares">
        <ul>
            <li><p>标题</p><span><input v-model="bm.title" type="text"></span></li>
            <li><p style="border:none;height:.4rem;"></p><span style="border:none;height:.4rem;">
                建议标题:品牌+型号+具体参数+卖点特征+商品名称</span></li>
                <li><p style="border:none;height:.4rem;"></p><span style="border:none;height:.4rem;">
                示例:供应厂家直销夏季新款运动衫</span></li>
        </ul>
    </div>

    <div class="declares" style="margin:.2rem 0">
        <ol>
            <li><p>服务内容</p></li>
        </ol>
        <div class="textar">
          <span style="padding:0 .1rem;">
            <yd-textarea slot="right" v-model="bm.serviceContent" placeholder="说明/附言" maxlength="100"></yd-textarea>
          </span>
        </div>
        <div class="important-input-div">
          <input type="text" @blur="pmLists" v-model="bm.productParameterList[0].parameterName" placeholder="参数名">
          <input @blur="pmLists" placeholder="参数值" v-model="bm.productParameterList[0].parameterValue" type="text">
        </div>
        <div class="important-input-div">
          <input @blur="pmLists" type="text" v-model="bm.productParameterList[1].parameterName" placeholder="参数名">
          <input @blur="pmLists" placeholder="参数值" v-model="bm.productParameterList[1].parameterValue" type="text">
        </div>
        <div class="important-input-div">
          <input @blur="pmLists" type="text" v-model="bm.productParameterList[2].parameterName" placeholder="参数名">
          <input @blur="pmLists" placeholder="参数值" v-model="bm.productParameterList[2].parameterValue" type="text">
        </div>
        <p>可添加更多产品参数，最多3条，参数名不能为纯数字。</p><p>示例：颜色:红色</p>
    </div>

    <div class="declares" style="margin:.2rem 0">
        <ol>
            <li><p>产品图片</p></li>
        </ol>
        <div class="details">
          <div class="text" style="font-size:.26rem;">最多可上传4张，严禁图片有水印,联系方式等影响观看</div>
          <div class="images">
            <ul>
              <li v-for="(item,index) in imgUrl" :key="index"><img :src="item" alt=""></li>
            </ul>
            <p v-show="imgUrl.length<4"  @click="addImg"><img src="../../../../assets/images/rent/estate/search.png" alt="">
             <input class="file" name="file" type="file" accept="image/*" @change="update"/></p>
          </div>
          <div class="text" style="font-size:.26rem;">上传图片/拍照</div>
        </div>
    </div>

    <div class="declares" style="margin:.2rem 0">
        <ol>
            <li><p>产品详情</p></li>
        </ol>
        <div class="textar">
          <span style="padding:0 .1rem;">
            <yd-textarea slot="right" v-model="bm.explains" placeholder="说明/附言" maxlength="100"></yd-textarea>
          </span>
        </div>
        <div class="important-input-div">
          <input type="text" @blur="keywordS" v-model="keyword[0]" placeholder="输入关键词">
          <input @blur="keywordS" placeholder="输入关键词" v-model="keyword[1]" type="text">
          <input @blur="keywordS" placeholder="输入关键词" v-model="keyword[2]" type="text">
        </div>
        <p>产品关键词将用于商机匹配</p>
    </div>

    <div class="declares">
        <ul>
            <li><p style="width:1.6rem;font-size:.26rem;">商品售价</p>
            <span style="margin-right:.1rem;"><input type="number" v-model="bm.price"></span>元</li>
            <li><p style="width:1.6rem;font-size:.26rem;">最小采购量</p>
            <span style="margin-right:.3rem;">
              <input v-model="bm.minNumber" type="number" v-if="!minNumber">
              <input v-model="bm.minNumber" type="number" disabled="disabled" v-else>
              </span>
            <yd-checkbox v-model="minNumber" size="16">不限</yd-checkbox>
            </li>
        </ul>
    </div>
    <yd-accordion accordion style="background:none;margin-top:.2rem;">
      <!-- 发布范围 -->
      <yd-accordion-item title="发布范围" style="margin-bottom:.2rem;background:#fff;" open>
        <div style="padding: .24rem;">
          <yd-radio-group v-model="bm.groupArea">
            <yd-radio class="choose_item" v-for="(item,index) in pianList" :key="index" :val="index" :color='mainColor'>
              <span class="scope">{{item.name}}</span>
              <span>{{item.scopeName}}</span>
            </yd-radio>
          </yd-radio-group>
        </div>
      </yd-accordion-item>
    </yd-accordion>

    <yd-cell-group style="margin-top:.2rem;">
        <yd-cell-item  type="label">
            <span slot="left">预约服务</span>
            <yd-switch :color="mainColor" slot="right" v-model="isBespeak"></yd-switch>
        </yd-cell-item>
        <yd-cell-item  type="label">
            <span slot="left">团购服务</span>
            <yd-switch :color="mainColor" slot="right" v-model="isGroup"></yd-switch>
        </yd-cell-item>
        <yd-cell-item v-if="isGroup" arrow  type="label">
            <span slot="left">团购设置</span>
            <span slot="right" @click="open">(团购服务打开才有设置,关闭没有这项)</span>
        </yd-cell-item>
    </yd-cell-group>

    <div class="to-select">
      <div class="buttonBox">
        <yd-button size="large" class="send" @click.native="openConfrim"
         :bgcolor="mainColor" color='#fff' type="primary">同意协议并发布</yd-button>
      </div>
    </div>

    <div class="bottomss">
        <a>平台产品发布协议</a>
        <a>客服：400-000-00000</a>
    </div>
  </yd-layout>
</div>
</template>
<script>
  import Set from "./group_set.vue"
  import Class from "./classification.vue"
  import fn from "@/assets/js/product";
  import qs from "qs";
  import InfiniteScroll from "vue-infinite-scroll";
  import Vue from "vue";
  import store from '@/store'
  import { CellGroup, CellItem } from "vue-ydui/dist/lib.rem/cell";
  import {CheckBox, CheckBoxGroup} from 'vue-ydui/dist/lib.rem/checkbox';
  import {TextArea} from 'vue-ydui/dist/lib.rem/textarea';
  import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog';
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
  import {Switch} from 'vue-ydui/dist/lib.rem/switch';
  Vue.component(Switch.name, Switch);
  export default {
    components: {
      Set,
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
      } else{
        TypeListCircle = 3
      }
      return {
        showshow:true,
        showshow1:true,
        ssss:true,
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
          className:'',
          token:'',
          title:'',
          serviceContent:'',
          fatherClassId:null,
          classId	:null,
          productImg:'',
          keyword:'',
          price:null,
          company:'',
          minNumber:0,
          isBespeak:0,
          isGroup:0,
          payType:2,
          explains:'',
          groupNumber:0,
          groupArea:0,
          startTime:this.$today(),
          endTime:this.$today(),
          priceSectionDescribe:'',
          productParameterList:[
            {
            parameterName:'',
            parameterValue:'',
          },
          {
            parameterName:'',
            parameterValue:'',
          },
          {
            parameterName:'',
            parameterValue:'',
          },
          ]
          ,
        },
        isBespeak:false,
        isGroup:false,
        minNumber:false,
        pianList:[],
        para:{
          value:''
        }
      };
    },
    watch: {
      'isBespeak':'bespeak',
      'isGroup':'group',
      'minNumber':'mNumber'
    },
    methods: {
      lookPhonePara() {
        let data={};
        data.token = this.getkey;
        data.type='releaseProduct';
        this.$ajax(
          `${this.subUrl.bd}/purchase/lookPhonePara`,
          data,
          res => {
            this.para=res.data.para
            console.log(this.para.value)
          },
          this
        );
      },
      openConfrim() {
                this.$dialog.confirm({
                    mes: '此次需支付'+this.para.value+'商机点！',
                    opts: () => {
                        this.addProduct();
                    }
                });
      },
      bmData(e){
        this.showshow = true;
        if(e){
          console.log(e);
          this.bm.groupNumbe=e.groupNumber
          this.bm.startTime=e.startTime+':00'
          this.bm.endTime=e.endTime+':00'
          this.bm.priceSectionDescribe=e.priceSectionDescribe
        }
      },
      bmData1(e){
        this.showshow1 = true;
        if(e){

        }
      },
      open(){
         this.showshow=false;
      },
      open1(){
         this.showshow1=false;
      },
      //发布产品
      addProduct() {
          if(this.bm.classId==null||this.bm.fatherClassId==null){
              this.$dialog.toast({mes: '请选择分类！'});
              return;
          }
          if(this.bm.title==''){
            this.$dialog.toast({mes: '标题不能为空！'});
              return;
          }

          let data = {};
          data.token = this.getkey;
          data.title=this.bm.title;
          data.serviceContent=this.bm.serviceContent;
          data.fatherClassId=this.bm.fatherClassId;
          data.classId=this.bm.classId;
          data.productImg=this.bm.productImg;
          data.keyword=this.bm.keyword;
          data.price=this.bm.price;
          data.minNumber=this.bm.minNumber;
          data.company='元';
          data.isBespeak=this.bm.isBespeak;
          data.isGroup=this.bm.isGroup;
          data.payType=this.bm.payType;
          data.explains=this.bm.explains;
          data.groupArea=this.bm.groupArea;
          if(this.bm.isGroup==1){
          data.groupNumber=this.bm.groupNumber;
          data.startTime=this.bm.startTime;
          data.endTime=this.bm.endTime;
          data.priceSectionDescribe=this.bm.priceSectionDescribe;
          }

          // data.purchaseDetailsList=this.bm.purchaseDetailsList;


        this.$ajax1(
          `${this.subUrl.bd}/product/addProduct?${this.$qs.stringify(data)}`,
          this.bm.productParameterList,
          res => {
            this.$dialog.toast({mes: '发布成功！'});
            this.back();
          },
          this
        );
          store.guid=null;
          store.name=null;
          store.fguid=null;
      },
      pmLists(){
        console.log(this.pmList)
      },
      keywordS(){
        this.bm.keyword=this.keyword.join(',')
        console.log(this.bm.keyword)
      },
    mNumber(){
        this.bm.minNumber=0
     },
    bespeak(){
      if(this.isBespeak){
        this.bm.isBespeak=1
      }else{
        this.bm.isBespeak=0
      }
    },
    group(){
      if(this.isGroup){
        this.bm.isGroup=1
      }else{
        this.bm.isGroup=0
      }
    },
    update(e){
    let file = e.target.files[0];
    let d = new Date();
    let type = file.name.split('.');
    let tokenParem = {
      'putPolicy':'{\"name\":\"$(fname)\",\"size\":\"$(fsize)\",\"w\":\"$(imageInfo.width)\",\"h\":\"$(imageInfo.height)\",\"hash\":\"$(etag)\"}',
      'key':'orderReview/'+d.getFullYear()+'/'+(d.getMonth()+1)+'/'+d.getDate()+'/'+d.valueOf()+'.'+type[type.length-1],
      'bucket':this.getHearLog.domain,//七牛的地址，这个是你自己配置的（变量）
      };
    let param = new FormData(); //创建form对象
    param.append('chunk','0');//断点传输
    param.append('chunks','1');
    param.append('file',file,file.name)
    // console.log(param.get('file')); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
    let config = {
     headers:{'Content-Type':'multipart/form-data'}
    };
   //先从自己的服务端拿到token

       this.token = this.getHearLog.token;
       param.append('token',this.token);
      //  if(this.images.length>1){
      //    alert('不能超过1张');
      //    return;
      //  }
       this.uploading(param,config,file.name);//然后将参数上传七牛
       return;

  },
  uploading(param,config,pathName){
   this.xhr.post('http://up-z2.qiniu.com',param,config)
    .then(response=>{
    //  console.log(response.data);
     this.getHearLog.name=response.data.key;
     if(this.imgName.length<4){
        this.imgName.push(this.getHearLog.name)
        this.imgUrl.push(this.getHearLog.domain+'/'+this.getHearLog.name)
     }
      this.bm.productImg=this.imgUrl.join(',')
      console.log(this.bm.productImg)
     let localArr = this.images.map((val,index,arr)=>{
      return arr[index].localSrc;
     })
    //  console.log(this.imgName)
     if(!~localArr.indexOf(pathName)){
      this.images.push({'src':this.showUrl+response.data.key,'localSrc':pathName});
     }else{
       alert('已上传该图片');
     }
    })
    },
   getQiniuInfo(){
      this.xhr.post(`${this.subUrl.user}/qiniu/getInfo?token=`+this.getkey).then(res=>{
         if (res.data.code == 1) {
              // console.log(res)
              this.getHearLog=res.data.data;
          } else{
            this.$dialog.toast({mes: res.data.msg});
          }
      })
   },
   addImg(){
     this.getQiniuInfo();
   },
      add(){
        this.alertT=true;
      },
      confirm(){

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
        this.$back(this);
        store.guid=null;
          store.name=null;
          store.fguid=null;
      }
    },
    mounted() {
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      this.getPlace();
      this.lookPhonePara()
      console.log(this.$route.params)
    },
    beforeUpdate () {
      this.bm.className=store.name;
      this.bm.classId=store.guid;
      this.bm.fatherClassId=store.fguid;
    }
  };
</script>
<style scoped>
  .bottomss{display: flex;justify-content: space-between;padding:0 .3rem .2rem;}
  .bottomss>a{color:#999;}

  .send {
    margin: 0;
  }

  .buttonBox {
    padding: 0 0.2rem 0.3rem;
  }
  .declares>p{padding:.1rem .3rem;font-size: .24rem;color:#999;}
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

  .important-input-div {
    width: 100%;
    background: #ffffff;
    display: flex;
    flex-wrap: wrap;
    padding: .1rem 0.3rem;
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
  width: 100%;background: white;
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
  width: 1rem;
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
  line-height: .4rem;
  font-size:.24rem;
  color:#999;
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
  color: #333;
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
