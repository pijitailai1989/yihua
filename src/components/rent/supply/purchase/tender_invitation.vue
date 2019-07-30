<template>
 <div style="height:100vh">
  <Class v-show="!showshow" @bmData='bmData'></Class>
  <yd-layout class="edit" v-show="showshow">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" v-title="'发布招标'" title="发布招标" :bgcolor="mainColor" color="#fff">
      <span class="addClickArea" slot="left" @click="back" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
    </yd-navbar>

    <yd-cell-group>
            <yd-cell-item arrow type="link" href="" @click.native="open">
              <span class="font30" slot="left">选择产品/服务分类</span>
              <span class="yd_bu font28" slot="right">{{bm.className==null?'请选择':bm.className}}</span>
            </yd-cell-item>
    </yd-cell-group>

    <div class="declares">
        <ul>
            <li><p>项目名称</p><span><input v-model="bm.title" type="text"></span></li>
            <li><p>招标金额</p><span><input v-model="bm.money" type="number"></span></li>
            <li><p>截止日期</p><span>
                <yd-datetime type="date" v-model="bm.endTime" slot="right"></yd-datetime>
                </span></li>
            <li><p>买家地址</p><span><input v-model="bm.address" type="text"></span></li>
            <li><p>交货日期</p><span>
                <yd-datetime type="date" v-model="bm.deliveryTime" slot="right"></yd-datetime>
                </span></li>
            <li><p>交货地址</p><span><input v-model="bm.deliveryAddress" type="text"></span></li>
        </ul>
    </div>

    <div class="declares" style="margin:.2rem 0">
        <ol>
            <li sytle="color:#666"><p>产品/服务</p><span>数量</span><span>金额</span></li>
            <li v-for="(item,index) in bm.purchaseDetailsList" :key="index">
              <p>{{item.productService}}</p><span>{{item.number}}</span><span>{{item.money}}</span></li>
            <li><a @click="add"><i>+</i>添加</a></li>
        </ol>
        <div class="textar">
          <span>
            <yd-textarea slot="right" v-model="bm.explains" placeholder="说明/附言" maxlength="100"></yd-textarea>
          </span>
        </div>
        <div class="important-input-div">
          <input type="text"  @blur="keywordS" v-model="keyword[0]" placeholder="输入关键词">
          <input  @blur="keywordS" placeholder="输入关键词" v-model="keyword[1]" type="text">
          <input  @blur="keywordS" placeholder="输入关键词" v-model="keyword[2]" type="text">
        </div>
        <div class="details">
          <div class="text">上传图片/拍照</div>
          <div class="images">
            <ul>
              <li v-for="(item,index) in imgUrl" :key="index"><img :src="item" alt=""></li>
            </ul>
            <p v-show="show1" @click="addImg"><img src="../../../../assets/images/rent/estate/search.png" alt="">
             <input class="file" name="file" type="file" accept="image/*" @change="update"/></p>
          </div>
        </div>
    </div>

    <yd-accordion accordion style="background:none;">

      <yd-accordion-item title="投标要求" style="margin-bottom:.2rem;background:#fff;" open>
        <div style="padding: .24rem;">
          <yd-radio-group v-model="bm.seniority">
            <yd-radio class="choose_item" val="0" :color='mainColor'>
              <span class="scope">不限</span>
            </yd-radio>
            <yd-radio class="choose_item" val="1" :color='mainColor'>
              <span class="scope">报价需含税</span>
            </yd-radio>
            <yd-radio class="choose_item" val="2" :color='mainColor'>
              <span class="scope">物流费须由商家承担</span>
            </yd-radio>
          </yd-radio-group>
        </div>
      </yd-accordion-item>

      <yd-accordion-item title="发布范围" style="margin-bottom:.2rem;background:#fff;" open>
        <div style="padding: .24rem;">
          <yd-radio-group v-model="bm.positionCondition">
            <yd-radio class="choose_item" v-for="(item,index) in pianList" :key="index" :val="index" :color='mainColor'>
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

    <div class="declares">
        <ol>
            <li sytle="color:#666">商家资质要求</li>
        </ol>
        <div class="textar" style="margin-top:.2rem;">
          <span>
            <yd-textarea v-model="bm.seniority" slot="right" placeholder="说明/附言" maxlength="100"></yd-textarea>
          </span>
        </div>
        <div class="to-select">
           <div class="buttonBox">
              <yd-button size="large" class="send" @click.native="openConfrim" :bgcolor="mainColor" color='#fff' type="primary">立即发布</yd-button>
           </div>
        </div>
    </div>



    <div class="alertText" v-show="alertT">
      <ul>
          <li class="a"><p class="font28">产品/服务：</p><span><input v-model="childs.productService" type="text" placeholder="请填写"></span></li>
          <li class="a"><p class="font28">数量：</p><span><input v-model="childs.number" type="number" placeholder="请填写"></span></li>
          <li class="a"><p class="font28">价格：</p><span><input v-model="childs.money" type="number" placeholder="请填写"></span></li>
          <li><button @click="cancel" :style="{background:mainColor}">取 消</button>
          <button @click="confirm" :style="{background:mainColor}">确 定</button></li>
      </ul>
    </div>
  </yd-layout>
  </div>
</template>
<script>
  import fn from "@/assets/js/product";
  import qs from "qs";
  import InfiniteScroll from "vue-infinite-scroll";
  import Class from "./classification.vue"
  import Vue from "vue";
  import store from "@/store"
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
      } else{
        TypeListCircle = 3
      }
      return {
        showshow:true,
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
          token:'',
          title:'',
          endTime:this.$today(),
          deliveryTime:this.$today(),
          deliveryAddress:'',
          address:'',
          purchaseDetailsList:[],
          explains:'',
          keyword:'',
          isOffer:0,
          positionCondition:0,
          scopeValue:0,
          isUrgent:2,
          accessory:'',
          payType:2,
          seniority:'',
          money:null,
          classId:null,
          fatherClassId:null,
          className:null,
        },
        childs:{
          money:null,
          number:null,
          productService:null
        },
        para:{
          value:null
        }
      };
    },
    methods: {
      lookPhonePara() {
        let data={};
        data.token = this.getkey;
        data.type='releasePurchase';
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
                        this.releaseTender();
                    }
                });
      },
      bmData(e){
        this.showshow = true;
        if(e){

        }
      },
      open(){
         this.showshow=false;
      },
      //发布招标
      releaseTender() {
          if(this.bm.classId==null||this.bm.fatherClassId==null){
              this.$dialog.toast({mes: '请选择分类！'});
              return;
          }
          if(this.bm.title==''){
            this.$dialog.toast({mes: '标题不能为空！'});
              return;
          }
          if(this.bm.deliveryAddress==''){
            this.$dialog.toast({mes: '请填写交货地址！'});
              return;
          }
          if(this.bm.address==''){
            this.$dialog.toast({mes: '请填写买家地址！'});
              return;
          }
          if(this.bm.purchaseDetailsList.length<=0){
            this.$dialog.toast({mes: '请添加产品服务！'});
              return;
          }
          if(this.bm.explains==''){
            this.$dialog.toast({mes: '说明处内容不能为空！'});
              return;
          }


          let data = {};
          data.token = this.getkey;
          data.title=this.bm.title;
          data.money=this.bm.money;
          data.endTime=this.bm.endTime;
          data.deliveryTime=this.bm.deliveryTime;
          data.deliveryAddress=this.bm.deliveryAddress;
          data.address=this.bm.address;
          data.explains=this.bm.explains;
          data.isOffer=this.bm.isOffer;
          data.isUrgent=this.bm.isUrgent;
          data.keyword=this.bm.keyword;
          data.positionCondition=this.bm.positionCondition;
          data.scopeValue=this.bm.scopeValue;
          data.levelCondition=this.bm.levelCondition;
          // data.purchaseDetailsList=this.bm.purchaseDetailsList;
          data.payType=this.bm.payType;
          data.fatherClassId=this.bm.fatherClassId;
          data.classId=this.bm.classId;
          data.seniority=this.bm.seniority;
          data.accessory=this.bm.accessory
        this.$ajax1(
          `${this.subUrl.bd}/purchase/releaseTender?${this.$qs.stringify(data)}`,
          this.bm.purchaseDetailsList,
          res => {
            this.$dialog.toast({mes: '发布成功！'});
            this.back()
          },
          this
        );
          store.guid=null;
          store.name=null;
          store.fguid=null;
      },
      keywordS(){
        this.bm.keyword=this.keyword.join(',')
        // console.log(this.bm.keyword)
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
     this.getHearLog.name=response.data.key;
     if(this.imgName.length<5){
        this.imgName.push(this.getHearLog.name)
        this.imgUrl.push(this.getHearLog.domain+'/'+this.getHearLog.name)
     }
      this.bm.accessory=this.imgName.join(',')
      console.log(this.bm.accessory)
     let localArr = this.images.map((val,index,arr)=>{
      return arr[index].localSrc;
     })
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
        if(this.childs.productService!=null||this.childs.number!=null||this.childs.money!=null){
           this.bm.purchaseDetailsList.push(
             {
              money:this.childs.money,
              number:this.childs.number,
              productService:this.childs.productService
              }
           );
           this.childs={}
           this.alertT=false;
           console.log(this.bm.purchaseDetailsList)
         }else{
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
        this.$back(this)
        store.guid=null;
          store.name=null;
          store.fguid=null;
      }
    },
    mounted() {
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      this.lookPhonePara()
      this.getPlace();
    },
    beforeUpdate () {
      this.bm.className=store.name;
      this.bm.classId=store.guid;
      this.bm.fatherClassId=store.fguid;
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
  .alertText{z-index:999;width:100%;position:fixed;height:100vh;background: rgba(0,0,0,.2);top:0;left:0;display: flex;justify-content: center;align-items: center;}
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
