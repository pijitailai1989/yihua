<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" :title="title" :bgcolor="mainColor" color="#fff">
      <span class="addClickArea" slot="left" @click="back" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
      <span class="addClickArea" v-if="show" slot="right" @click="turnTo('/supply/product/card_manage')" style="color:white">名片管理</span>

    </yd-navbar>

    <div class="declares" style="margin-bottom:.2rem;">
      <ol>
        <li sytle="color:#666"><p>名称:{{organName}}</p>
          <!--<span @click="turnTo('/supply/product/my_shop')" :style="{color:mainColor,border:'1px solid '+mainColor}">进入店铺</span>-->
        </li>
      </ol>
      <ul>
        <!-- <li>
            <p>头像</p>
            <div class="images">
              <ul>
               <li v-for="(item,index) in imgUrl" :key="index"><img :src="item" alt=""></li>
              </ul>
              <p v-show="show1" @click="addImg"><img src="../../../../assets/images/rent/estate/search.png" alt="">
              <input class="file" name="file" type="file" accept="image/*" @change="update"/></p>
            </div>
        </li> -->
        <li><p>联系人</p><span>{{pm.name?pm.name:'无'}}</span></li>
        <li><p>手机号码</p><span>{{pm.phone?pm.phone:'无'}}</span></li>
        <li><p>联系QQ</p><span>{{pm.qq?pm.qq:'无'}}</span></li>
        <li><p>联系邮箱</p><span>{{pm.email?pm.email:'无'}}</span></li>
        <li><p>固定电话</p><span>{{pm.telePhone?pm.telePhone:'无'}}</span></li>
        <li><p>详情地址</p><span>{{pm.address?pm.address:'无'}}</span></li>
        <li><p>所在大厦</p><span>{{pm.building?pm.building:'无'}}</span></li>
      </ul>
    </div>

    <div class="declares">
      <ol>
        <li sytle="color:#666"><p>企业介绍</p><span>
                <a style="padding:.07rem .2rem;border-radius:.05rem;font-size:.24rem;color:white;" :style="{background:mainColor}">未认证</a></span></li>
      </ol>
      <ul style="border-bottom:1px dashed #D9D9D9;">
        <li>
          <p>LOGO</p>
          <div class="images">
            <ul>
              <li><img :onerror="logo" :src="imgUrl1" alt=""></li>
            </ul>
          </div>
        </li>
        <li><p>成立时间</p><span>{{pm.foundinTime?pm.foundinTime.split(' ')[0]:'无'}}</span></li>
        <li><p>注册资本</p><span>{{pm.capital?pm.capital:'无'}}</span></li>
        <li><p>所属行业</p><span>{{pm.industry?pm.industry:'无'}}</span></li>
        <li><p>法人代表</p><span>{{pm.representative?pm.representative:'无'}}</span></li>
        <li><p>经营模式</p><span>{{pm.pattern?pm.pattern:'无'}}</span></li>
        <li><p>员工人数</p><span>{{pm.peopleNum?pm.peopleNum:'无'}}</span></li>
        <li><p>年营业额</p><span>{{pm.turnover?pm.turnover:'无'}}</span></li>
        <li><p>企业官网</p><span>{{pm.website?pm.website:'无'}}</span></li>
        <li><p>微信号</p><span>{{pm.weChat?pm.weChat:'无'}}</span></li>
      </ul>

    </div>
    <div class="text" style="margin-bottom:.2rem;">
      <div class="ttt">资质证照</div>
      <div class="images1">
        <p v-if='imgUrl2.length==0'>暂未上传证照</p>
        <yd-lightbox v-else>
          <yd-lightbox-img v-for="(item,index) in imgUrl2"  :key="index" :src="item.path"></yd-lightbox-img>
        </yd-lightbox>
      </div>
    </div>

    <!--<yd-cell-group>-->
      <!--<yd-cell-item arrow href="/supply/product/case_management" type="link">-->
        <!--<span slot="left">案例介绍</span>-->
      <!--</yd-cell-item>-->
    <!--</yd-cell-group>-->

    <div class="declares" style="margin-bottom:.2rem;" v-show="2==1">
      <ol>
        <li sytle="color:#666">最新活动</li>
      </ol>
      <div class="activity">
        <ul>
          <li><img src="../../../../assets/images/rent/supply/photo.png" alt=""></li>
          <li>
            <p>活动名称：abc造型套餐</p>
            <span>20元代金劵</span>
          </li>
          <li><i><img src="../../../../assets/images/rent/supply/photo.png" alt=""></i></li>
        </ul>
        <div>
          <p>深圳市携程网络技术有限公司</p>
          <span><i><img src="../../../../assets/images/rent/supply/ding.png" alt=""></i>深圳-南山</span>
        </div>
      </div>
    </div>

    <!-- <yd-tabbar slot="tabbar" :color="mainColor">
            <yd-tabbar-item title="收藏" link="#">
                <yd-icon name="home" slot="icon"></yd-icon>
            </yd-tabbar-item>
            <yd-tabbar-item title="店铺" link="/supply/product/my_shop">
                <yd-icon name="shopcart-outline" slot="icon"></yd-icon>
            </yd-tabbar-item>
    </yd-tabbar> -->


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
  import {Layout} from 'vue-ydui/dist/lib.rem/layout';
  import {Icons} from 'vue-ydui/dist/lib.rem/icons';
  import {LightBox, LightBoxImg, LightBoxTxt} from 'vue-ydui/dist/lib.rem/lightbox';

  Vue.component(LightBox.name, LightBox);
  Vue.component(LightBoxImg.name, LightBoxImg);
  Vue.component(LightBoxTxt.name, LightBoxTxt);
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
        logo: 'this.src="' + require('../../../../assets/images/rent/supply/photo.png') + '"',
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
        imgUrl1:'',
        imgUrl2:[],
        show1:true,
        show:false,
        images:[],
        datetime2:this.$today(),
        datetime1:this.$today(),
        organName:'',
        pm:{
          guid:'',
          userId:'',
          organId:'',
          name:'',
          phone:'',
          qq:'',
          email:'',
          telePhone:'',
          address:'',
          building:'',
          logo:'',
          foundinTime:this.$today(),
          capital:'',
          industry:'',
          representative:'',
          pattern:'',
          peopleNum:'',
          turnover:'',
          website:'',
          weChat:'',
          describes:'',
          state:'',
          accessorys:[]
        }
      };
    },
    methods: {
      getShopCard() {
        let data={}
        data.userId=this.guid;
        data.token=this.getkey
        this.$ajax(
          `${this.subUrl.bd}/opportunity/getShopCard`,
          data,
          res => {
            if(res.data!=null){
              this.pm=res.data
              this.imgUrl1=res.data.logo
              this.imgUrl2=res.data.accessoryList
              console.log(this.imgUrl2)
            }
          },
          this
        );
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
      // ?token=fffe745a532640808deeddbe83a8fe22&guid=396066442610475008&userId=396066442610475008

      uploading(param,config,pathName){
        this.xhr.post('http://up-z2.qiniu.com',param,config)
          .then(response=>{
            //  console.log(response.data);
            this.getHearLog.name=response.data.key;
            if(this.imgName.length<5){
              this.imgName.push(this.getHearLog.name)
              this.imgUrl.push(this.getHearLog.domain+'/'+this.getHearLog.name)
            }

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
      selectTab(index) {
        this.showTab = index;
      },
      cancel() {
        this.alertT=false;
      },
      back() {
        this.$back(this);
      },
      turnTo(url){
        this.$router.push(url)
      } ,getUserInfo(cb) {
        let data = {
          token: this.$route.query.token
            ? this.$route.query.token
            : this.$getkey(),
          userId: this.$route.query.userId
            ? this.$route.query.userId
            : this.userInfo.guid
        };
        this.$ajax(
          `${this.subUrl.user}/user/getUserInfo`,
          data,
          res => {
            this.userInfo = res.data.userInfo;
            this.organInfo = res.data.organInfo;
            localStorage.setItem(
              "userInfo",
              encodeURIComponent(JSON.stringify(res.data.userInfo))
            );
            localStorage.setItem(
              "organInfo",
              encodeURIComponent(JSON.stringify(res.data.organInfo))
            );
            localStorage.setItem("to", encodeURIComponent(res.data.token));
            fn.setIng(this.$route.query.token);
            var a = res.data.userInfo.organType;
            var b = res.data.userInfo.admin ? 1 : 0;
            localStorage.setItem("organType", a);
            localStorage.setItem("isManger", b);
            localStorage.setItem("user_Id", res.data.userInfo.guid);
            cb && cb(res.data);
          },
          this
        );
      },
    },
    mounted() {
      if (this.$route.query.userId) {
        console.log(111)
        this.getUserInfo(res=>{
          this.userId = this.userInfo.guid;
          this.getkey = fn.getIng();
          this.guid = this.$route.query.guid;
          this.organName = this.organInfo.organName;
          if (this.$route.query.a == 1) {
            this.show = true;
            this.title = '我的名片'
          } else {
            this.show = false;
            this.title = '商家名片'
          }
          this.getShopCard();
        })
      } else {
        this.userId = this.userInfo.guid;
        this.getkey = fn.getIng();
        this.guid = this.$route.query.guid;
        this.organName = this.organInfo.organName;
        if (this.$route.query.a == 1) {
          this.show = true;
          this.title = '我的名片'
        } else {
          this.show = false;
          this.title = '商家名片'
        }
        this.getShopCard();
      }
    }
  };
</script>
<style scoped>
  .activity{width:100%;padding:.1rem .3rem;}
  .activity>ul{width:100%;display: flex;}
  .activity>ul>li{display: flex;flex-flow:column;}
  .activity>ul>li:first-child{width:1.6rem;height:1.6rem;}
  .activity>ul>li:nth-child(2){flex:1;height:1.6rem;justify-content: center;
    padding:0 .2rem;}
  .activity>ul>li:last-child{width:1rem;height:1.6rem;display: flex;
    justify-content: center;align-items: center;}
  .activity>ul>li img{width: 100%;height:100%;}
  .activity>ul>li>i{width:1rem;height:1rem;}
  .activity>div{display: flex;justify-content: space-between;padding:.2rem 0 0;}
  .activity>div>span{display: flex;align-items: center;}
  .activity>div>span>i{width:.35rem;height:.35rem;
    margin-right: .1rem;}
  .activity>div>span>i>img{width:100%;height:100%;}


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
    /* border: 1px solid #d9d9d9; */
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
  .declares>ol li>span{border-radius: .05rem;padding:.05rem .05rem;}
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

  .text{width:100%;background: white;display: flex;flex-flow: column;align-items: center;}
  .text>.ttt{width:100%; padding:.1rem .3rem;font-size: .28rem;}
  .text>ul{width:100%;}
  .text>ul>li{padding:.1rem .4rem;}
  .imges1>p{padding:0 .4rem;}
  .images1{width:100%;margin-top:.1rem;display: flex;margin-bottom:.1rem;}
  .images1>div{width: 100%;display: flex;align-items: center;}
  .images1>div>img{width:1.2rem;height:1.2rem;border-radius:.1rem;margin-right: .2rem;}
</style>
