<template>
  <div style="height:100vh">
    <yd-layout v-show="showUser">
      <yd-navbar slot="navbar" title="采购申请" height=".88rem" color="#fff" :bgcolor="mainColor">
        <div class="addClickArea" slot="left" @click="$router.go(-1)">
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </div>
        <!--<div class="addRightClickArea" style="color:#fff" slot="right">提交</div>-->
      </yd-navbar>
      <yd-radio-group v-model="type" class="flex-row-nowarp jusCenter bgwhite h8 bb" :color="mainColor">
        <span class="mr3">类型</span>
        <yd-radio val="1" style="width: 2rem;">采购</yd-radio>
        <yd-radio val="2" style="width: 2rem;">供应</yd-radio>
      </yd-radio-group>
      <div class="mt2 bgwhite bt bb tableList" style="padding: .1rem 0;">
        <div class="flex-row-nowarp list_item  h8">
          <div class="label">标题</div>
          <input type="text" class="flex1" placeholder="请输入标题" v-model="title" maxlength="30">
        </div>
        <div class="flex-row-nowarp list_item  h8">
          <div class="label">开始时间</div>
          <yd-datetime type="date" class="flex1  foCo6 border" v-model="startDate" slot="right"></yd-datetime>
        </div>
        <div class="flex-row-nowarp list_item  h8">
          <div class="label">结束时间</div>
          <yd-datetime type="date" class="flex1  foCo6 border" v-model="completionDate" slot="right"></yd-datetime>
        </div>
      </div>
      <div class="mt2 bgwhite bt bb" style="padding: .3rem .24rem;">
        <yd-textarea maxlength="100" class="border radius" v-model="detail"
                     style="height: 1.6rem;padding:0.1rem 0.1rem .3rem"></yd-textarea>
        <div style="width: 100%;background:#fff ">
          <yd-lightbox :num="uploadPreviewList.length">
            <div class="logo-img-div" v-for="(item,index ) in uploadPreviewList" :key="index">
              <yd-lightbox-img class="fileImg" :src="item"></yd-lightbox-img>
              <a @click.stop="delThisPic(index)">
                <yd-icon name="delete" custom color='#000' size='.6rem'></yd-icon>
              </a>
            </div>
          </yd-lightbox>
          <div class="show-send-pic">
            <div class="logo-img-div">
              <img src="../../../../../assets/images/rent/estate/photo.png" alt="" class="fileImg add-logo-img">
              <input class="file hid-input" name="file[]" type="file" accept="image/*" @change="update"
                     multiple="multiple">
            </div>
          </div>
        </div>

      </div>
      <div class="mt3 flex-row-nowarp list_item h9 bgwhite" @click="showUser=false">
        <div class="label">收件人</div>
        <input type="text" readonly style="text-align: right;" placeholder="默认为直属领导" v-model="rentUserName"
               class="flex1">
      </div>
      <div class="flex-row-nowarp h9 bt jusCenter bgwhite font30" @click="confirm" slot="bottom"
           :style="{color:mainColor}">
        <yd-icon name="selected" size=".4rem" class="mr1" style="margin-top:.05rem;" :color="mainColor"
                 custom></yd-icon>
        提交
      </div>
    </yd-layout>
    <departMent v-if='!showUser' :organId='organInfo.guid' @setUserId='setUserId'></departMent>
  </div>
</template>
<script>
  import departMent from "@/components/rent/estate/serviceList/renovation/department_manager";
  export default {
    components: {
      departMent,
    },
    data() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = this.$color[this.userInfo.organType];
      return {
        completionDate: this.$addDay(this.$today(), 30),
        startDate: this.$today(),
        type: 1,
        title: "",
        showUser: true,
        uploadFileList: [],
        uploadPreviewList: [],
        imageUrlList: [],
        imageKeyList: [],
        imageUrl: "",
        getLogoMsg: "",
        detail: "",
        rentUserId: '',
        rentUserName: '',
      }
    }, methods: {
      setUserId(e) {
        this.showUser = true;
        if (e) {
          this.rentUserId = e.userId;
          this.rentUserName = e.userName;
        }
      },
      confirm() {
        // this.$dialog.confirm({
        //   mes: "是否提交", opts: () => {
        //
        //   }
        // })
        if (this.title == "") {
          return this.$dialog.toast({mes: "请输入标题", timeout: "1000"});
        } else if (this.detail == "") {
          return this.$dialog.toast({mes: "请输入详情", timeout: "1000"});
        } else if (this.uploadFileList.length == 0) {
          return this.$dialog.toast({mes: "请上传图片", timeout: "1000"});
        } else {
          this.imgLength = this.uploadFileList.length;
          this.imgIndex = 0;
          this.$dialog.loading.open("发布中");
          setTimeout(() => {
            this.$dialog.loading.close();
          }, 3000);
          this.uploadImg(length, res => {
            console.log(this.imageKeyList);
            this.imageKeyList.length = this.uploadFileList.length;
            let data = {
              token: this.$getkey(),
              startDate: this.startDate + ' 00:00:00',
              type: this.type,
              accessory: this.imageKeyList.join(','),
              status: 3,
              completionDate: this.completionDate + ' 23:59:59',
              reportId: this.rentUserId ? this.rentUserId : 0,
              detail: this.detail,
              title: this.title,
              organId: this.organInfo.guid,
              userId: this.userInfo.guid,
              deptId: this.userInfo.deptId,
            };
              this.imageKeyList = [];
              this.uploadFileList = [],
              this.uploadPreviewList = [],
              this.imageUrlList = [],
              this.$ajax(`${this.subUrl.activity}/pasa/myReport/addWorkReport`, data, res => {
                this.$router.go(-1);
                this.$dialog.toast({mes:"提交成功",icon:"success"})
              }, this);
          })
        }
      },
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
          headers: {"Content-Type": "multipart/form-data"}
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
          token: this.$getkey(),
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
              this.$dialog.toast({mes: res.data.msg});
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
    }, mounted() {
      this.getQiniuMsg();
    }
  }
</script>

<style scoped>
  .list_item {
    background: #fff;
    padding-right: .3rem;
  }

   .list_item .label {
    width: 1.6rem;
    text-align: right;
  }

  .list_item .flex1 {
    height: .68rem;
    margin-left: .2rem;
    padding: 0 .1rem;
    color: #666;
    -webkit-border-radius: .1rem;
    -moz-border-radius: .1rem;
    border-radius: .1rem;
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
  }

  .logo-img-div {
    width: 1.4rem;
    height: 1.4rem;
    /* margin: 1%; */
    /*border: 1px solid #e6e6e6;*/
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
    width: 1.2rem;
    height: 1.2rem;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

</style>
