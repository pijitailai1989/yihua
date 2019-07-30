<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" v-title="'发布'" title="发布" :bgcolor="mainColor" color="#fff">
      <span slot="left" @click="cancel()" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
      <span slot="right" @click="chooseSuccess()" style="color: #fff;">

      </span>
    </yd-navbar>
    <div class="top-write">
      <input class="top-write-input" v-model="title" placeholder="请输入" type="text">
      <yd-checkbox class="topCheck" v-model="checkbox" size="15">急</yd-checkbox>
    </div>
    <div class="post-textarea">
      <textarea name="" id="" v-model="text" cols="10" placeholder="请输入帖子详情" maxlength="600" rows="5">

      </textarea>
      <div class="text-right">{{text.length}}/600</div>
    </div>
    <div class="important-input-div">
      <input type="text" v-model="keyword[0]" placeholder="输入关键词">
      <input placeholder="输入关键词" v-model="keyword[1]" type="text">
      <input placeholder="输入关键词" v-model="keyword[2]" type="text">
    </div>
    <div style="width: 100%;background:#fff ">
      <div class="show-send-pic">
        <div class="logo-img-div">
          <img src="../../../../assets/images/rent/my/admin/add-logo.png" alt="" class="fileImg add-logo-img">
          <input class="file hid-input" name="file[]" type="file" accept="image/*" @change="update" multiple="multiple">
        </div>
        <div class="logo-img-div" v-for="(item,index ) in uploadPreviewList" v-bind:key="index">
          <img :src="item" alt="" class="fileImg">
          <a @click="delThisPic(index)">
            <yd-icon name="delete" custom color='#000' size='.6rem'></yd-icon>
          </a>
        </div>
      </div>
    </div>
    <!-- 折叠面板 -->
    <!-- 圈子类型 -->

    <yd-accordion accordion style="background:none;">
      <!-- <yd-accordion-item title="圈子类型" style="margin-bottom:.2rem;background:#fff;" open>
        <div style="padding: .24rem;">
          <yd-radio-group v-model="TypeListCircle">
              <yd-radio class="choose_item" v-for="(item,index) in circleType" :key="index" :val="item.value" :color='mainColor'>{{item.name}}</yd-radio>              
          </yd-radio-group>
        </div>
      </yd-accordion-item> -->
      <yd-accordion-item title="帖子类型" style="margin-bottom:.2rem;background:#fff;" open>
        <div style="padding: .24rem;">
          <yd-radio-group v-model="TypeList" v-for="(item,index) in bbsList" :key="index">
            <yd-radio class="choose_item" @click.native="chooseBbsType(item)" :val="item.guid">
              {{item.dictDataValue}}
            </yd-radio>
            <yd-radio v-if="item.childDictData.length>0" @click.native="chooseBbsType(el)" class="er choose_item" v-for="(el,index) in item.childDictData" :key="index" :val="el.guid">
              {{el.dictDataValue}}
            </yd-radio>
         </yd-radio-group>
        </div>
      </yd-accordion-item>
      <!-- 发布范围 -->
      <yd-accordion-item title="发布范围" style="margin-bottom:.2rem;background:#fff;" open>
        <div style="padding: .24rem;">
          <yd-radio-group v-model="TypeList1">
            <yd-radio class="choose_item" v-for="(item,index) in pianList" :key="index" :val="index" :color='mainColor'>
              <span class="scope">{{item.name}}</span>
              <span>{{item.scopeName}}</span>
            </yd-radio>
          </yd-radio-group>
        </div>
      </yd-accordion-item>  
      <!-- 有效期 -->
      <yd-accordion-item title="期限" style="margin-bottom:.2rem;background:#fff;" open>
        <yd-cell-group title="" style="margin:0">
          <yd-cell-item type="radio">
            <span slot="left">永久</span>
            <input slot="right" type="radio" value="1" v-model="TypeList2" />
          </yd-cell-item>
          <yd-cell-item type="radio">
            <span slot="left">截止日期</span>
            <yd-datetime slot='left' type="date" class="endTime" v-model="endTime" start-date="2017-01-01"></yd-datetime>
            <input slot="right" type="radio" value="2" v-model="TypeList2" />
          </yd-cell-item>
        </yd-cell-group>

      </yd-accordion-item>
      <!-- 报名人数 -->
      <yd-accordion-item title="报名人数" style="margin-bottom:.2rem; background:#fff;" open>
        <div style="padding: .24rem;">
          <yd-checkbox-group v-model="TypeList3">
            <div class="getDate">
              <yd-checkbox class="choose_item" val="1" shape="circle">人数</yd-checkbox>
              <yd-input class="people" :max='12' v-model="peopleNum" regex="^\d{1,12}$"></yd-input>
            </div>

          </yd-checkbox-group>
        </div>
      </yd-accordion-item>

    </yd-accordion>
    <div class="to-select">
      <div class="agreement">
        <yd-checkbox class="agree" v-model="agree">同意平台圈子服务</yd-checkbox>
      </div>
      <div class="buttonBox">
        <yd-button size="large" class="send" @click.native="sendPost" :bgcolor="mainColor" color='#fff' type="primary">立即发布</yd-button>
      </div>
    </div>
  </yd-layout>
</template>
<script>
  import fn from "@/assets/js/product";
  import qs from "qs";
  import InfiniteScroll from "vue-infinite-scroll";
  import Vue from "vue";
  import { CellGroup, CellItem } from "vue-ydui/dist/lib.rem/cell";
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
        circleType: [
          {
            name: "企业八爪圈",
            value: 1
          },
          {
            name: "个人八爪圈",
            value: 2
          },
          {
            name: "物业八爪圈",
            value: 3
          }
        ],
        imageUrl: "",
        TypeList: "",
        TypeList1: -1,
        TypeList2: "",
        TypeList3: [],
        endTime,
        bbsType:"",
      };
    },
    methods: {
      chooseBbsType(item){
        console.log(item)
        this.bbsType = item;
      },
      // 发帖
      sendPost() {
        console.log(this.TypeList);
        if (!this.agree) {
          return this.$dialog.toast({ mes: "请勾选平台圈子服务", timeout: 400 });
        }
        var data = {
          token: this.getkey,
          userId: this.userInfo.guid
        };
        if (this.title == "") {
          return this.$dialog.toast({ mes: "请输入标题", timeout: 400 });
        } else if (this.text == "") {
          return this.$dialog.toast({ mes: "请输入内容", timeout: 400 });
        } else if (!this.keyword[0] && !this.keyword[1] && !this.keyword[2]) {
          return this.$dialog.toast({ mes: "请输入关键词", timeout: 400 });
        } else if (this.uploadPreviewList.length == 0) {
          this.$dialog.toast({ mes: "请添加图片", timeout: 400 });
          return;
        }
        else if (this.TypeList == "") {
          return this.$dialog.toast({ mes: "请选择帖子类型", timeout: 400 });
        } else if (this.TypeList1 === -1) {
          console.log(this.TypeList1)
          return this.$dialog.toast({ mes: "请选择发布范围", timeout: 400 });
        } else if (this.TypeList2 == "") {
          return this.$dialog.toast({ mes: "请选择截止时间", timeout: 400 });
        }
        data.title = this.title;
        data.isUrgency = this.checkbox ? 1 : 0;
        data.content = this.text;
        data.keyword = this.keyword.join(",");
        data.organId = this.organInfo.guid;
        // console.log(this.organInfo);
        // 帖子id
        data.type = this.TypeList;
        data.typePid = this.bbsType.pId;
        
        console.log(JSON.stringify(this.bbsType))
        data.circleType = 2;

        // 发布范围
        data.scope = this.pianList[this.TypeList1].scope;
        data.scopeValue = this.pianList[this.TypeList1].scopeValue;
        // data.releaseRange = this.TypeList1;
        //截止时间
        if (this.TypeList2 == 1) {
          data.deadline = "9999-12-31 00:00:00";
        } else if (this.TypeList2 == 2) {
          data.deadline = this.endTime + " 23:59:59";
        }
        //报名人数
        console.log(this.TypeList3);
        if (this.TypeList3.length >= 1) {
          if (this.peopleNum == "") {
            return this.$dialog.toast({ mes: "请输入报名人数", timeout: 400 });
          } else if (!/\d{1,12}/.test(this.peopleNum)) {
            return this.$dialog.toast({ mes: "报名人数输入格式错误", timeout: 400 });
          } else {
            data.applicantNum = this.peopleNum;
          }
        }
        this.imgLength = this.uploadFileList.length;
        this.imgIndex = 0;
        this.$dialog.loading.open("发布中");
        setTimeout(() => {
          this.$dialog.loading.close();
        }, 3000)
        this.uploadImg(length, res => {
          console.log(this.imageKeyList);
          data.imageNames = this.imageKeyList.join(",");
          this.imageKeyList = [];
          this.imageUrlList = [];
          this.imageKeyList = [];
          this.uploadFileList = [];
          this.uploadPreviewList = [];
          this.$ajax(
            `${this.subUrl.sc}/bbs/saveBbs`,
            data,
            res => {
              console.log('发帖状态')
              this.$dialog.loading.close();
              this.$dialog.toast({ mes: "发布成功", timeout: 1500, icon: "success" });
              this.imageKeyList = [];
              this.imageUrlList = [];
              this.imageKeyList = [];
              this.uploadFileList = [];
              this.uploadPreviewList = [];
              setTimeout(() => {
                this.$router.go(-1)
              }, 1500)
            },
            this
          );
        });
      },
      // 获取帖子类型
      getbbsType(data) {
        data = data ? data : {};
        // if(this.userInfo.organType==1){
        //   data.circleType=1
        // }else if(this.userInfo.organType==5){
        //   data.circleType=2
        // }else{
        //   data.circleType=3
        // }
         data.circleType=2
        data.token = this.getkey;
        this.$ajax(
          `${this.subUrl.sc}/bbs/getBBsType`,
          data,
          res => {
            console.log(res,11111111111111)
            this.bbsList = res.data;
          },
          this
        );
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
      // 删除帖子
      delThisPic(index) {
        this.uploadPreviewList.splice(index, 1);
        this.uploadFileList.splice(index, 1);
      },
      // 生成预览图片
      setImgPreview() {
        this.uploadPreviewList = [];
        for (var i = 0; i < this.uploadFileList.length; i++) {
          this.uploadPreviewList.push(this.$getImgUrl(this.uploadFileList[i]));
        }
        console.log(this.uploadPreviewList);
      },
      update(e) {
        this.imageUrl = this.getData.imageUrl;
        for (var i = 0; i < e.target.files.length; i++) {
          let file = e.target.files[i];
          this.uploadFileList.push(file);
        }
        console.log(this.uploadFileList);
        this.setImgPreview();
        return;
        //先从自己的服务端拿到token
      },
      uploadImg(length, cb) {
        let d = new Date();
        this.token = this.getLogoMsg.token;
        this.imageUrl = this.getLogoMsg.domain;
        let tokenParem = {
          putPolicy:
            '{"name":"$(fname)","size":"$(fsize)","w":"$(imageInfo.width)","h":"$(imageInfo.height)","hash":"$(etag)"}',
          key:
            "orderReview/" +
            d.getFullYear() +
            "/" +
            (d.getMonth() + 1) +
            "/" +
            d.getDate() +
            "/" +
            d.valueOf() +
            ".png",
          bucket: this.imageUrl //七牛的地址，这个是你自己配置的（变量）
        };
        let param = new FormData(); //创建form对象
        param.append("chunk", "0"); //断点传输
        param.append("chunks", "1");
        var file = this.uploadFileList[this.imgIndex];
        console.log(file);
        param.append(`file`, file, file.name);
        let config = {
          headers: { "Content-Type": "multipart/form-data" }
        };
        param.append("token", this.token);
        this.uploading(param, config, file.name, res => {
          this.imgIndex = parseInt(this.imgIndex) + 1;
          if (this.imgIndex < this.imgLength) {
            this.uploadImg(length, function () {
              cb && cb();
            });
          } else {
            cb && cb();
          }
        }); //然后将参数上传七牛
      },
      getQiniuMsg() {
        var data = {
          organId: this.organInfo.guid,
          token: this.getkey,
          pageNo: 1,
          pageSeze: 15
        };
        this.xhr
          .post(`${this.subUrl.user}/qiniu/getInfo?token=` + data.token)
          .then(res => {
            if (res.data.code == 1) {
              this.getLogoMsg = res.data.data;
            } else if (res.data.code == "-902") {
              // fn.re_login(this);
            } else {
              this.$dialog.toast({ mes: res.data.msg });
            }
          });
      },
      uploading(param, config, pathName, cb) {
        this.xhr.post("http://up-z2.qiniu.com", param, config).then(response => {
          this.organLogo = response.data.key;
          this.imageKeyList.push(this.organLogo);
          this.imageUrlList.push(this.imageUrl + "/" + response.data.key);
          this.showLogo = true;
          cb && cb(response.data);
        });
      },
      loadList() { },
      selectTab(index) {
        this.showTab = index;
      },
      cancel() {
        this.$router.go(-1);
      }
    },
    mounted() {

      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      console.log(this.userInfo.organType);
      this.getQiniuMsg();
      this.getbbsType();
      this.getPlace();
    }
  };
</script>
<style scoped>
  .people {
    width: 60%;
    margin-left: 0.3rem;
    border: 1px solid #ddd;
    padding: 0 0.1rem;
    height: 0.5rem;
  }

  .getDate {
    display: flex;
    align-items: center;
    line-height: 0.6rem;
  }

  .endTime {
    text-align: left;
    text-indent: 3em;
  }

  /* 同意协议 */

  .agreement {
    display: flex;
    height: 0.9rem;
    align-items: center;
    justify-content: center;
  }

  .agreement .agree {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

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

  .top-write {
    width: 100%;
    background: #fff;
    padding-bottom: 0;
    height: 0.84rem;
    border-bottom: 1px solid #ddd;
    display: flex;
    align-items: center;
  }

  .topCheck {
    display: flex;
    align-items: center;
  }

  .top-write>div {
    display: flex;
    width: 100%;
    margin-left: 0.5em;
    border-bottom: 1px solid #e6e6e6;
  }

  .top-write-input {
    flex: 1;
    height: 2.3em;
    font-size: 0.3rem;
    color: #333;
    border: none;
    padding: 0.3rem;
    background: #fff;
  }

  .post-textarea {
    padding: 1em;
    width: 100%;
    background: #fff;
  }

  .post-textarea textarea {
    width: 100%;
    background: #fff;
    border: none;
    font-size: 14px;
  }

  .post-textarea div {
    color: #999999;
    padding-bottom: 0.3em;
    border-bottom: 1px dashed #e6e6e6;
  }

  .important-input-div {
    width: 100%;
    background: #ffffff;
    padding-bottom: 0.5em;
    display: flex;
    flex-wrap: wrap;
    padding: 0 0.3rem;
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

  .show-send-pic {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    padding-bottom: 2em;
    padding: 0 0.2rem;
  }

  .logo-img-div {
    width: 1.56rem;
    height: 1.56rem;
    /* margin: 1%; */
    border: 1px solid #e6e6e6;
    margin-top: .1rem;
    border-radius: 6px;
    position: relative;
    background: #fff;
    margin-right: .2rem;
    margin-bottom: .2rem;
    overflow: hidden;
    padding: 0;
    display: inline-block;
  }

  .logo-img-div img {
    width: 100%;
    height: 100%;
    margin: 0;
  }

  .logo-img-div a {
    display: block;
    position: absolute;
    right: -0.1rem;
    top: -0.1rem;
  }

  .hid-input {
    opacity: 0;
    position: absolute;
    width: 5em;
    height: 5em;
  }

  .add-logo-img {
    width: 2em !important;
    height: 2em !important;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -1em !important;
    margin-top: -1em !important;
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
</style>