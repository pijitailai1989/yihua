<template>
  <yd-layout class="layout_my">
    <div class="blue_box" >
      <yd-navbar class="header" v-title="'申报接待配合'" v-show="!userAgent.isWX" title="申报接待配合" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span class="addClickArea" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
         <span slot="right" @click="submitForApply" class="addRightClickArea" style="color: #fff;font-size:.3rem;">提交</span>
      </yd-navbar>
    </div>

    <div class="inputText">
        <ul>
          <li>
            <p class="font30">接待时间</p>
            <span>
              <yd-datetime type="datetime" v-model="datetime0" slot="right"></yd-datetime>
            </span>
          </li>
          <li><p class="font30">接待地点</p><span><input type="text" v-model="receRess" placeholder=""></span></li>
        </ul>
    </div>

    <div class="details">

       <ul>
           <li v-for="(item,index) in typeArr" :key="index" @click="clickType(item)">
               <i v-if="active==item"><img src="../../../../../assets/images/rent/estate/select_active.png" alt=""></i>
               <i v-else><img src="../../../../../assets/images/rent/estate/select.png" alt=""></i>
               <p class="font30">{{item}}</p>
           </li>
       </ul>

        <div class="ss">
            <yd-textarea slot="right" class="pdlr2" v-model="description" placeholder="详情描述" maxlength="100"></yd-textarea>

        </div>
        <div class="images">
            <ul>
              <li v-for="(item,index) in imgUrl" :key="index"><img :src="item" alt=""></li>

            </ul>
            <p v-show="show1" @click="addImg"><img src="../../../../../assets/images/rent/estate/photo.png" alt="">
             <input class="file" name="file" type="file" accept="image/*" @change="update"/></p>
        </div>
    </div>




  </yd-layout>
</template>
<script>
import Vue from "vue";
import fn from "@/assets/js/product";
import qs from "qs";
import { TextArea } from "vue-ydui/dist/lib.rem/textarea";
import { Input } from "vue-ydui/dist/lib.rem/input";
import {
  Confirm,
  Alert,
  Toast,
  Notify,
  Loading
} from "vue-ydui/dist/lib.rem/dialog";
import { DateTime } from "vue-ydui/dist/lib.rem/datetime";

Vue.component(DateTime.name, DateTime);

Vue.prototype.$dialog = {
  confirm: Confirm,
  alert: Alert,
  toast: Toast,
  notify: Notify,
  loading: Loading
};

Vue.component(Input.name, Input);

Vue.component(TextArea.name, TextArea);

export default {
  data() {
    return {
      receRess: "",
      userInfo: "",
      datetime0: this.$today(true).substr(0, 16),
      show1: true,
      images: [],
      getkey: "",
      mainColor: "",
      input8: "",
      alertT: false,
      info: {
        name: "",
        tel: "",
        pid: ""
      },
      list: [],
      getHearLog: {
        domain: "",
        token: "",
        name: ""
      },
      imgName: [],
      imgUrl: [],
      typeArr: ["车位", "横幅", "专用电梯"],
      active: "",
      description: "",
      unitId: ""
    };
  },
  computed: {
    lists() {
      return this.list;
    }
  },
  methods: {
    clickType(item) {
      this.active = item;
      switch (item) {
        case "车位":
          this.type = 1;
          break;
        case "横幅":
          this.type = 2;
          break;
        case "专用电梯":
          this.type = 3;
          break;
      }
    },
    turnTo(url) {
      this.$router.push(url);
    },
    back() {
      history.back();
    },

    submitForApply() {
      var data = {
        userId: this.userId,
        token: this.getkey,
        customerName: this.userInfo.name,
        receptionDate: this.datetime0 + ":00",
        receptionAddr: this.receRess,
        type: this.type,
        organId: this.organInfo.guid,
        description: this.description,
        imageNames: this.imgName.join(","),
        unitId: this.unitId
      };
      if (
        this.datetime0 == "" ||
        this.receRess == "" ||
        this.description == ""
      ) {
        this.$dialog.toast({ mes: "内容不能为空" });
      } else {
        this.xhr
          .post(
            `${this.subUrl.activity}/reception/submitForApply`,
            qs.stringify(data)
          )
          .then(res => {
            if (res.data.code == 1) {
              this.$dialog.toast({ mes: res.data.msg, icon: "success" });
              this.$router.go(-1);
            } else if (res.data.code == "-902") {
              //-902
              /*重新登录*/
              fn.re_login(this);
            } else {
              this.$dialog.toast({ mes: res.data.msg });
            }
          });
      }
    },
    update(e) {
      let file = e.target.files[0];
      let d = new Date();
      let type = file.name.split(".");
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
          "." +
          type[type.length - 1],
        bucket: this.getHearLog.domain //七牛的地址，这个是你自己配置的（变量）
      };
      let param = new FormData(); //创建form对象
      param.append("chunk", "0"); //断点传输
      param.append("chunks", "1");
      param.append("file", file, file.name);
      // console.log(param.get('file')); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      //先从自己的服务端拿到token

      this.token = this.getHearLog.token;
      param.append("token", this.token);
      //  if(this.images.length>1){
      //    alert('不能超过1张');
      //    return;
      //  }
      this.uploading(param, config, file.name); //然后将参数上传七牛
      return;
    },
    uploading(param, config, pathName) {
      this.xhr.post("http://up-z2.qiniu.com", param, config).then(response => {
        //  console.log(response.data);
        this.getHearLog.name = response.data.key;
        if (this.imgName.length < 5) {
          this.imgName.push(this.getHearLog.name);
          this.imgUrl.push(this.getHearLog.domain + "/" + this.getHearLog.name);
        }

        let localArr = this.images.map((val, index, arr) => {
          return arr[index].localSrc;
        });
        //  console.log(this.imgName.join(','))
        if (!~localArr.indexOf(pathName)) {
          this.images.push({
            src: this.showUrl + response.data.key,
            localSrc: pathName
          });
        } else {
          alert("已上传该图片");
        }
      });
    },
    getQiniuInfo() {
      this.xhr
        .post(`${this.subUrl.user}/qiniu/getInfo?token=` + this.getkey)
        .then(res => {
          if (res.data.code == 1) {
            // console.log(res)
            this.getHearLog = res.data.data;
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        });
    },
    addImg() {
      this.getQiniuInfo();
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.mainColor = this.$color[this.userInfo.organType];
    this.userId = this.userInfo.guid;
    this.getkey = fn.getIng();
    console.log(this.$route);
    this.unitId = this.userInfo.unitId;
  },
  beforeUpdate() {
    if (this.imgName.length >= 5) {
      this.show1 = false;
    }
  }
};
</script>
<style scoped>
.layout_my .header:after {
  display: none;
}
.layout_my {
  background: #f7f7f9;
}

.layout_my .blue_box {
  height: 0.88rem;
  background: #0093d2;
  background-size: 100% 100%;
}
.inputText {
  width: 100%;
  padding: 0 0.3rem;
  background: white;
  border-bottom: #f3f6f5;
}
.inputText ul {
  width: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}
.inputText ul li {
  width: 100%;
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
  padding: 0.15rem 0;
}
.inputText ul li > span {
  flex: 1;
  border: 1px solid #e6e7e7;
  height: 0.8rem;
  display: flex;
  align-items: center;
}
.inputText ul li > p {
  width: 1.6rem;
}
.inputText ul li > span > input {
  border: none;
  margin-left: 0.2rem;
}

.details {
  width: 100%;
  margin-top: 0.2rem;
  background: white;
  padding: 0.2rem;
  border-bottom: 1px solid #e5e5e5;
}
.details > ul {
  width: 100%;
  display: flex;
  flex-flow: row;
  justify-content: space-around;
  align-content: center;
}
.details > ul li {
  display: flex;
  margin-bottom: 0.2rem;
  justify-content: center;
  align-items: center;
}
.details > ul li > i {
  margin-right: 0.1rem;
}
.details > ul li > i > img {
  width: 0.4rem;
  height: 0.4rem;
}
.ss {
  border: 1px solid #e8e8e8;
  border-radius: 0.05rem;
}

.images {
  margin-top: 0.2rem;
  display: flex;
}
.images > p {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.1rem;
  position: relative;
}
.images > p > img {
  width: 1.2rem;
  height: 1.2rem;
}
.images > ul {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
}
.images > ul > li {
  width: 1.2rem;
  height: 1.2rem;
  margin: 0 0.1rem;
}
.images > ul > li > img {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 0.1rem;
}
.images > p > input {
  width: 100%;
  height: 0.9rem;
  opacity: 0;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
