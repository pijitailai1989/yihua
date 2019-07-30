<template>
 <div style="height:100vh">
  <Customer v-show="!showshow" @bmData='bmData'></Customer>
  <yd-layout v-show="showshow" class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" v-title="'推送信息'" title="推送信息" :bgcolor="mainColor" color="#fff">
      <span class="addClickArea" slot="left" @click="back" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
    </yd-navbar>

    <div></div>

    <div class="declares" style="margin-bottom:.2rem;">
        <ol>
            <li sytle="color:#666"><p>商家经营信息</p></li>          
        </ol>
        <ul>
            <li>
                <p>商家LOGO</p>
                <div class="images">
                  <ul>
                   <li v-show="imgUrl!=''"><img :src="imgUrl" alt=""></li>
                  </ul>
                  <p v-show="show1" @click="addImg"><img src="../../../../assets/images/rent/supply/shangchuan.png" alt="">
                  <input class="file" name="file" type="file" accept="image/*" @change="update"/></p>
                </div>
            </li>
            <li><p>店铺名称</p><span><input v-model="pm.shopName" type="text"></span></li>
            <li><p>营销标语</p><span><input v-model="pm.slogan" type="text"></span></li>
            <li><p>店铺地址</p><span><input v-model="pm.shopAddress" type="text"></span></li>
            <li><p>服务电话</p><span><input v-model="pm.servicePhone" type="text"></span></li>
            <li><p>公众号</p><span><input v-model="pm.publicNum" type="text"></span></li>
        </ul>
    </div>

    <div class="declares" style="margin:.2rem 0">
        <ol>
            <li style="color:#333;">填写营销信息</li>
        </ol>
        
        <div style="height:.8rem;display:flex;justify-content: space-around;border-bottom:1px solid #F3F3F2;align-items:center;">
            <yd-radio-group v-model="pm.type">
              <yd-radio val="2" style="margin-right:1rem;">会员卡</yd-radio>
              <yd-radio val="1">优惠劵</yd-radio>
           </yd-radio-group>
        </div>
        <div class="textar">
          <div><p>标题</p><span class="bb"><input v-model="pm.expandTitle" placeholder="推广" type="text"></span></div>
          <div>
           <p>规则介绍</p>
           <i class="bb">
            <yd-textarea slot="right" v-model="pm.ruleIntroduction" placeholder="文本内容" maxlength="100"></yd-textarea>
           </i>
          </div>
        </div>
    </div>

    <div class="declares" style="margin:.2rem 0">
        <ol>
            <li style="color:#333;">设置有效时间</li>
        </ol>
        <div class="textar">
          <div><p>开始时间</p><span class="bb" style="display:flex;align-items:center;">
          <yd-datetime v-if="toggle" type="datetime" readonly slot="right"></yd-datetime>
          <yd-datetime v-else type="datetime" v-model="pm.startDate" slot="right"></yd-datetime>
          </span></div>
          <div><p>结束时间</p><span class="bb" style="display:flex;align-items:center;">
          <yd-datetime v-if="toggle" type="datetime" readonly slot="right"></yd-datetime>
          <yd-datetime v-else type="datetime" v-model="pm.endDate" slot="right"></yd-datetime>
          </span></div>
        </div>
        <yd-cell-group style="border-top:1px solid #F3F3F2;">
          <yd-cell-item type="label">
            <div slot="left">长期有效</div>
            <yd-switch v-model="toggle" :color="mainColor" slot="right"></yd-switch>
          </yd-cell-item>
        </yd-cell-group>
        <yd-accordion>
         <yd-accordion-item title="使用时间">
         <yd-cell-group>
              <yd-cell-group>
                <yd-cell-item type="checkbox">
                    <span slot="left">周一</span>
                    <input slot="right" type="checkbox" value="周一" v-model="checkedNames"/>
                </yd-cell-item>
                <yd-cell-item type="checkbox">
                    <span slot="left">周二</span>
                    <input slot="right" type="checkbox" value="周二" v-model="checkedNames"/>
                </yd-cell-item>
                <yd-cell-item type="checkbox">
                    <span slot="left">周三</span>
                    <input slot="right" type="checkbox" value="周三" v-model="checkedNames"/>
                </yd-cell-item>
                <yd-cell-item type="checkbox">
                    <span slot="left">周四</span>
                    <input slot="right" type="checkbox" value="周四" v-model="checkedNames"/>
                </yd-cell-item>
                <yd-cell-item type="checkbox">
                    <span slot="left">周五</span>
                    <input slot="right" type="checkbox" value="周五" v-model="checkedNames"/>
                </yd-cell-item>
                <yd-cell-item type="checkbox">
                    <span slot="left">周六</span>
                    <input slot="right" type="checkbox" value="周六" v-model="checkedNames"/>
                </yd-cell-item>
                <yd-cell-item type="checkbox">
                    <span slot="left">周日</span>
                    <input slot="right" type="checkbox" value="周日" v-model="checkedNames"/>
                </yd-cell-item>
            </yd-cell-group>
         </yd-cell-group>
         </yd-accordion-item>
       </yd-accordion>
        <yd-cell-group>
          <yd-cell-item type="label">
            <div slot="left">全天</div>
            <yd-switch v-model="toggle1" :color="mainColor" slot="right"></yd-switch>
          </yd-cell-item>
        </yd-cell-group>
        <div class="textar">
          <div><p>其他时间</p><span class="bb">
          <input v-if="toggle1" type="text" disabled="disabled">
          <input v-else v-model="other" type="text">
          </span></div>
        </div>
    </div>
    
    <div class="declares" style="margin:.2rem 0">
        <ol>
            <li style="color:#333;">推送对象</li>
        </ol>
        <yd-cell-group>
          <yd-radio-group v-model="pm.userList" class="groups">
              <yd-radio class="g" val="1">公司</yd-radio>
              <yd-radio style="margin-left:2rem;" val="2">管理层</yd-radio>
           </yd-radio-group>
        </yd-cell-group>
    </div>

    <div class="declares" style="margin:.2rem 0">
        <ol>
            <li style="color:#333;">推送范围</li>
        </ol>
        <div class="bottoms">
          <ul v-for="(item,index) in typeList" :key="index">
            <li @click="checks(index)">
              <i v-if="item.clickImg"><img src="../../../../assets/images/rent/baishitong/select_active.png" alt=""></i>
              <i v-else><img src="../../../../assets/images/rent/baishitong/select.png" alt=""></i>
            </li>
            <li><span class="font30">{{item.type}}</span></li>
            <li>
              <span v-if="index==0" style="color:#999;">{{buildingName}}</span>
              <p v-if="index==1&&pm.organIdList==''" class="textHidden" style="color:#999;" @click="toggleH">点击选择客户</p>
              <p v-if="index==1&&pm.organIdList!=''" class="textHidden" style="color:#999;" @click="toggleH">{{pm.organIdList}}</p>
              <p v-if="index==2">
                <input type="text" v-model="pm.phoneList" placeholder="点击输入公司或客户电话">
              </p>
            </li>
          </ul>
        </div>
    </div>

    <!-- <div class="declares" style="margin:.2rem 0">
        <ol>
            <li style="color:#333;">推送范围</li>
        </ol>
        <div class="bottoms">
          <ul v-for="(item,index) in typeList" :key="index">
            <li @click="checks(index)">
              <i v-if="item.clickImg"><img src="../../../../assets/images/rent/baishitong/select_active.png" alt=""></i>
              <i v-else><img src="../../../../assets/images/rent/baishitong/select.png" alt=""></i>
            </li>
            <li><span class="font30">{{item.type}}</span></li>
            <li>
              <span v-if="index==0||index==1" style="color:#999;">{{item.name}}</span>
              <p v-if="index==2&&pm.organIdList==''" class="textHidden" style="color:#999;" @click="toggleH">点击选择客户</p>
              <p v-if="index==2&&pm.organIdList!=''" class="textHidden" style="color:#999;" @click="toggleH">{{pm.organIdList}}</p>
              <p v-if="index==3">
                <input type="text" v-model="pm.phoneList" placeholder="点击输入公司或客户电话">
              </p>
            </li>
          </ul>
        </div>
    </div> -->
    
    <div class="to-select">
      <div class="buttonBox">
        <yd-button size="large" class="send" @click.native="addPushInfo" :bgcolor="mainColor" color='#fff' type="primary">
            立即推送</yd-button>
      </div>
    </div>
    
   </yd-layout>
  </div>
</template>
<script>
  import Customer from "./my_customers.vue"
  import fn from "@/assets/js/product";
  import qs from "qs";
  import InfiniteScroll from "vue-infinite-scroll";
  import Vue from "vue";
  import {CheckBox, CheckBoxGroup} from 'vue-ydui/dist/lib.rem/checkbox';
  import {TextArea} from 'vue-ydui/dist/lib.rem/textarea';
  import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog';
  import {DateTime} from 'vue-ydui/dist/lib.rem/datetime';
  import {Layout} from 'vue-ydui/dist/lib.rem/layout';
  import {Icons} from 'vue-ydui/dist/lib.rem/icons';
  import {Radio, RadioGroup} from 'vue-ydui/dist/lib.rem/radio';
  import {CellGroup, CellItem} from 'vue-ydui/dist/lib.rem/cell';
  import {Switch} from 'vue-ydui/dist/lib.rem/switch';
  import {Accordion, AccordionItem} from 'vue-ydui/dist/lib.rem/accordion';

Vue.component(Accordion.name, Accordion);
Vue.component(AccordionItem.name, AccordionItem);
  Vue.component(Switch.name, Switch);

  Vue.component(CellGroup.name, CellGroup);
  Vue.component(CellItem.name, CellItem);
  Vue.component(Radio.name, Radio);
  Vue.component(RadioGroup.name, RadioGroup);
  Vue.component(Icons.name, Icons);
  Vue.component(Layout.name, Layout);

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
  export default {
    components: {
      Customer
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
        typeList:[
          // {id:1,type:'周边3KM片区',clickImg:false,name:'南山区'},
          {id:2,type:'本楼大厦',clickImg:false},
          {id:3,type:'我的客户',clickImg:false},
          {id:4,type:'特定客人',clickImg:false}
        ],
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
        imgName:'',
        imgUrl:'',
        show1:true,
        images:[],
        datetime2:this.$today(),
        datetime1:this.$today(),
        radio1:'',
        clickId:'',
        checkedNames:[],
        other:'',
        pm:{
          token:'',
          type:1,
          organIdList:'',
          phoneList:'',
          createDate: '',
          endDate: this.$today()+' 23:59',
          expandTitle: '',
          guid: '',
          logoUrl: '',
          organId: '',
          publicNum: '',
          ruleIntroduction: '',
          servicePhone: '',
          shopAddress: '',
          shopName: '',
          slogan: '',
          startDate: this.$today()+' 00:00',
          state: 0,
          usableTime: '',
          userId: 0,
          userList: 1,
          vipImage: ''
        },
        toggle:false,
        toggle1:false,
        toggle2:false,
        toggle3:false,
        buildingName:'',
      };
    },
    methods: {
      bmData(e){
        this.showshow = !this.showshow;
        if(e){
          console.log(e);
          this.pm.organIdList=e
        }
      },
      toggleH(){
         this.showshow=!this.showshow
      },
      checks(index){
         this.typeList[index].clickImg=!this.typeList[index].clickImg;
         let arr1=[]
         let arr=this.typeList.filter(el=>{
           return el.clickImg==true;
         })
         arr.forEach(el=>{
           arr1.push(el.id)
         })
         this.clickId=arr1.join(',')
         console.log(index,11111111111111111)
         if(index==1){
           this.pm.organIdList=''
         }
         if(index==2){
           this.pm.phoneList=''
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
     
        this.imgName=this.getHearLog.name
        this.imgUrl=this.getHearLog.domain+'/'+this.getHearLog.name
        this.pm.logoUrl=this.getHearLog.domain+'/'+this.getHearLog.name
     

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
      // 发布
      addPushInfo() {
        if(this.pm.logoUrl==''){
          this.$dialog.toast({mes: '须上传商家LOGO!'});
          return
        }
        if(this.pm.shopName==''){
          this.$dialog.toast({mes: '需填写店铺名称!'});
          return
        }
        if(this.pm.slogan==''){
          this.$dialog.toast({mes: '需填写营销标语!'});
          return
        }
        if(this.pm.shopAddress==''){
          this.$dialog.toast({mes: '需填写店铺地址!'});
          return
        }
        if(this.pm.servicePhone==''){
          this.$dialog.toast({mes: '需填写服务电话!'});
          return
        }
        if(this.pm.expandTitle==''){
          this.$dialog.toast({mes: '需填写标题!'});
          return
        }
        if(this.pm.ruleIntroduction==''){
          this.$dialog.toast({mes: '需填写规则介绍!'});
          return
        }
        let data={}
        data={
          expandTitle: this.pm.expandTitle,
          logoUrl: this.pm.logoUrl,
          publicNum: this.pm.publicNum,
          ruleIntroduction: this.pm.ruleIntroduction,
          servicePhone: this.pm.servicePhone,
          shopAddress: this.pm.shopAddress,
          shopName: this.pm.shopName,
          slogan: this.pm.slogan,
          type: this.pm.type,
          userId: this.pm.userId,
          userList:this.pm.userList,
          usableTime:this.pm.usableTime?this.pm.usableTime+','+this.other:this.other
          }
          if(!this.toggle){
            data.endDate=this.pm.endDate+':00';
            data.startDate=this.pm.startDate+':00';
          }
          
        this.$ajax1(
          `${this.subUrl.bd}/opportunity/addPushInfo?token=`+this.pm.token+'&type='+this.clickId+
          '&organIdList='+this.pm.organIdList+'&phoneList='+this.pm.phoneList,
          data,
          res => {
            this.$dialog.toast({mes: '成功推送( '+res.data.num+' 张)！'});
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
        this.$router.go(-1);
      },
      turnTo(url){
          this.$router.push(url)
      }
    },
    mounted() {
      this.pm.userId = this.userInfo.guid;
      this.buildingName=this.userInfo.buildingName;
      this.getkey= fn.getIng();
      this.pm.token = fn.getIng();

      
    },
    beforeUpdate(){
      this.pm.usableTime = this.checkedNames.join(',');
      if(this.toggle1==true){
        this.other='全天'
      }
      if(this.pm.phoneList==''){
        this.typeList[2].clickImg=false;
      }else{
        this.typeList[2].clickImg=true;
      }
      if(this.pm.organIdList==''){
        this.typeList[1].clickImg=false;
      }else{
        this.typeList[1].clickImg=true;
      }
 
    }
  };
</script>
<style scoped>
.groups{padding:.2rem .4rem;display: flex;justify-content: center;}

.bottoms{width:100%;}
.bottoms>ul{width:100%;display: flex;border-bottom:1px solid #ECECEC;}
.bottoms>ul>li{height:1rem;}
.bottoms>ul>li:nth-child(1){width:1rem;display:flex;justify-content: center;align-items:center;}
.bottoms>ul>li:nth-child(1)>i{width:.4rem;height:.4rem;}
.bottoms>ul>li:nth-child(1)>i>img{width:100%;height:100%;}
.bottoms>ul>li:nth-child(2){width:2rem;display:flex;align-items:center;}
.bottoms>ul>li:nth-child(3){flex:1;display:flex;align-items:center;justify-content: flex-end;
padding:.2rem .2rem;}
.bottoms>ul>li:nth-child(3)>p{border:1px solid #ECECEC;width: 3.6rem;height:100%;display: flex;align-items: center;}
.bottoms>ul>li:nth-child(3)>p>input{border:none;width: 100%;height:100%;}

.declares {
  width: 100%;background: white;
}
.declares>ul {
  width: 100%;
  padding: 0.1rem 0.4rem;
}
.declares>ul li {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
  margin: 0.2rem 0;
}
.declares>ul li > p {
  width: 1.8rem;
  display: flex;
  justify-content: center;
  height: 0.7rem;
  align-items: center;
  font-size: 0.26rem;
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
  .images{display: flex;width:100%;padding:.1rem .3rem;}
  .images>p{border:2px dashed #B6CEEC;width:1.2rem;height:1.2rem;display: flex;
  justify-content:center;align-items:center;border-radius:.1rem;position:relative;}
  .images>p>img{width:.6rem;height:.6rem;}
  .images>ul{display: flex;flex-flow:row;justify-content:center;align-items:center;}
  .images>ul>li{width:1.2rem;height:1.2rem;margin:0 .1rem;}
  .images>ul>li>img{width:1.2rem;height:1.2rem;border-radius:.1rem;}
  .images>p>input{width:100%;height:.9rem;opacity: 0;position: absolute;left:0;top:0;}

.textar{display: flex;padding:.1rem .3rem;flex-flow:column;}
.textar>div{display: flex;
  flex-flow: row;
  align-items: center;
 
  margin: 0.1rem 0;}
  .textar>div>p{width: 1.6rem;
  display: flex;
  justify-content: center;
  height: 0.7rem;
  align-items: center;
  font-size: 0.3rem;
  color: #777;}
  .textar>div>span.bb{flex: 1;
  height: 0.7rem;
  border: 1px solid #d9d9d9;
  border-radius: 0.05rem;}
  .textar>div>span.aa{
  flex: 1;
  height: 0.7rem;
  line-height: .7rem;
  }
  .textar>div>span>input{
  width: 100%;
  height: 100%;
  border: none;
  margin-left: 0.1rem;}

.textar>span{width:100%;height:100%;border:1px solid #d9d9d9;}
.textar>div>i.bb{flex:1;border:1px solid #d9d9d9;padding:0 .1rem;}
.textar>div>i.aa{flex:1;}

.to-select {
    width: 100%;
    margin-top: 1em;
    border-bottom: 1px solid #e6e6e6;
  }

  .to-select>div>span {
    transform: rotate(90deg);
  }
    .buttonBox {
    padding: 0 0.2rem 0.3rem;
  }
  .send {
    margin: 0;
  }
  .yd-scrollview .yd-cell-box{margin-bottom:0; }
</style>