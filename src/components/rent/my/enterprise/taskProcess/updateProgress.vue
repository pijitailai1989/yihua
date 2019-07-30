<template>
  <div style="height:100vh">
    <yd-layout v-show="showUser && showTable &&showMuti">
      <yd-navbar slot="navbar" :title="mTitle" height=".88rem" color="#fff" :bgcolor="mainColor">
        <div class="addClickArea" slot="left" @click="$router.go(-1)">
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </div>
        <!--<div class="addRightClickArea" style="color:#fff"  slot="right">保存</div>-->
      </yd-navbar>
      <div class="usuallyBox bb" style="padding: .1rem 0 .1rem;">
        <div class="list_item">
          <div class="label">最新进度</div>
          <input type="text" maxlength="3" class="flex1" placeholder="修改百分比" v-model="progress">
        </div>
        <div class="list_item mt2" style="height: auto;align-items: flex-start;padding-bottom: .2rem">
          <div class="label">备注</div>
          <yd-textarea maxlength="100" style="height: 2rem;flex:1;padding:.1rem .1rem .4rem;margin-left:.2rem;"
                       class="border foCo9 radius"
                       placeholder="非必填项" v-model="remark"></yd-textarea>
        </div>
      </div>
      <div class="mt2 bgwhite bt bb" style="padding: .3rem .24rem;">
        <yd-lightbox :num="uploadPreviewList.length + tempArr.length">
          <div class="logo-img-div" v-for="(item,index ) in tempArr" :key="index">
            <yd-lightbox-img class="fileImg" :src="item.path"></yd-lightbox-img>
            <a @click.stop="delThisPic1(index)">
              <yd-icon name="delete" custom color='#000' size='.6rem'></yd-icon>
            </a>
          </div>
          <div class="logo-img-div" v-for="(item,index ) in uploadPreviewList" :key="index">
            <yd-lightbox-img class="fileImg" :src="item"></yd-lightbox-img>
            <a @click.stop="delThisPic(index)">
              <yd-icon name="delete" custom color='#000' size='.6rem'></yd-icon>
            </a>
          </div>
        </yd-lightbox>
        <div class="flex-row foCo9 bgwhite">上传成果</div>
        <div class="show-send-pic ">
          <div class="logo-img-div">
            <img src="../../../../../assets/images/rent/estate/photo.png" alt="" class="fileImg add-logo-img">
            <input class="file hid-input" name="file[]" type="file" accept="image/*" @change="update"
                   multiple="multiple">
          </div>
        </div>
      </div>
      <div class="flex-row-nowarp h9 bgwhite bt " slot="bottom">
        <div class="flex1 jusCenter" @click="confirm(1)">更新进度</div>
        <div class="flex1 jusCenter" @click="confirm(2)">完成</div>
      </div>
    </yd-layout>
  </div>
</template>
<script>
  export default {
    data() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = this.$color[this.userInfo.organType];
      this.type = this.$route.query.type * 1;
      this.mTitle = '更新进度';
      return {
        show1: false,
        progress: "",
        remark: "",
        showType: false,
        pickData1: {
          columns: 1,
          isChange: false,
          pData1: []
        },
        custoMmonth: this.$today().substr(0, 7),//月份
        completionDate: this.$addDay(this.$today(), 30),
        startDate: this.$today(),
        title: "",
        summarize: "",
        executorIdListName: "",
        executorIdList: '',
        identifier: "",
        identifierName: "",
        handle: this.$route.query.handle ? 2 : 0,//1提交2草稿
        wrId: this.$route.query.wrId ? this.$route.query.wrId : 0,
        showUser: true,
        uploadFileList: [],
        uploadPreviewList: [],
        imageUrlList: [],
        imageKeyList: [],
        type: "",
        imageUrl: "",
        getLogoMsg: "",
        tempArr: [],
        showTable: true,
        detail: "",
        rentUserId: '',
        rentUserName: '',
        list: [],
        showDong: false,
        dong: {},
        showMuti: true,
      }
    }, methods: {
      setMuti(e) {
        this.showMuti = true;
        if (e) {
          this.executorIdList = e.userIdArr.join(',')
          this.executorIdListName = e.userArr.join(',');
          console.log(JSON.stringify(e));
        }
      },
      chooseDong() {
        if (this.pickData1.pData1.length == 0) {
          return this.$dialog.toast({mes: "数据为空", timeout: 1000});
        } else {
          this.showDong = true;
          console.log(this.showDong);
        }
      },
      mClose() {
        this.showDong = false;
      },
      //获取草稿详情
      getDetail() {
        let data = {
          token: this.$getkey(),
          userId: this.userInfo.guid,
          reportId: this.$route.query.wrId,
        };
        this.$ajax(`${this.subUrl.activity}/workbench/workReport/myReport/detail`, data, res => {
          console.log(res.data);
          var o = res.data.workReport;
          this.title = o.title;
          this.reportDetailList = o.reportDetailList;
          this.startTime = o.startTime.substr(0, 10);
          this.endTime = o.endTime.substr(0, 10);
          this.custoMmonth = o.custoMmonth;
          this.summarize = o.summarize;
          this.list = res.data.reportDetailList;
          this.tempArr = res.data.commAccessoryList;
          for (var i of res.data.commAccessoryList) {
            this.imageKeyList.push(i.fileName);
          }
        }, this)
      },
      close() {
        this.show1 = false;
      },
      confirmFn(e) {
        this.dong = e.select1;
        console.log(JSON.stringify(e.select1));
        this.showDong = false;
      },
      chooseMonth() {
        this.show1 = true;
      },
      setUserId(e) {
        this.showUser = true;
        if (e) {
          this.rentUserId = e.userId;
          this.rentUserName = e.userName;
        }
      },
      addList(e) {
        this.showTable = true;
        if (e) {
          console.log(JSON.stringify(e))
          this.list.push(e);

        }
      },
      confirm(e) {
        var reg = /\d{1,3}/
        if (this.progress == "") {
          return this.$dialog.toast({mes: "请输入完成进度", timeout: "1000"});
        }else if((!reg.test(this.progress)) || this.progress > 100 && this.progress < 0){
          return this.$dialog.toast({mes:"完成进度为1-100的数字"});
        }else if(this.uploadFileList.length == 0){
          return this.$dialog.toast({mes: "请上传成果", timeout: "1000"});
        }
        this.imgLength = this.uploadFileList.length;
        this.imgIndex = 0;
        this.$dialog.loading.open("更新中");
        let length = this.uploadFileList.length;
        this.uploadImg(length, res => {
          console.log(this.imageKeyList);
          let data = {
            "token": this.$getkey(),
            "userId": this.userInfo.guid,
            taskId: this.$route.params.id,
            remark: this.remark ? this.remark : '',
            progress:this.progress,
            "accessorys": this.imageKeyList.join(','),
          };
          data.type = this.progress == 100 ? 2 : 1;
          this.imageKeyList = [];
          this.uploadFileList = [];
          this.uploadPreviewList = [];
          this.imageUrlList = [];
          this.$ajax(`${this.subUrl.activity}/taskBill/taskProgress/updateProgress`, data, res => {
            this.$dialog.toast({mes: "更新进度成功", icon: "success"})
            this.$router.go(-1);
          }, this);
        })

      },
      delThisPic(index) {
        this.uploadPreviewList.splice(index, 1);
        this.uploadFileList.splice(index, 1);
      },
      delThisPic1(index) {
        this.tempArr.splice(index, 1);
        this.imageKeyList.splice(index, 1);
      },
      // 生成预览图片
      setImgPreview() {
        // this.uploadPreviewList = [];
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
        console.log(this.uploadFileList)
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
      //  查询任务类型
      getTaskType() {
        this.$ajax(`${this.subUrl.user}/comm/getTaskType`, {}, res => {
          let len = res.data.length;
          let arr = [];
          for (var i = 0; i < len; i++) {
            var obj = res.data[i];
            obj.value = res.data[i].guid;
            obj.text = res.data[i].dictDataName;
            arr.push(obj);
          }
          this.pickData1.pData1 = arr;
        }, this);
      },
    }, mounted() {
      this.getQiniuMsg();
      if (this.$route.query.wrId) {
        this.getDetail();
      }
      this.getTaskType();
    }
  }
</script>

<style scoped>
  .chooseIcon {
    width: .5rem;
    height: .5rem;
    font-size: .4rem;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
  }

  .tableBox .flex1 {
    border: 0;
  }

  .list_item {
    background: #fff;
    padding-right: .3rem;
  }

  .list {
    max-height: 2.8rem;
    overflow: auto;
  }

  .list_item .label {
    width: 1.6rem;
    text-align: right;
  }

  .list_item .flex1 {
    border: 0;
  }

  .usuallyBox .list_item .flex1 {
    height: .68rem;
    margin-left: .2rem;
    padding: 0 .1rem;
    color: #666;
    -webkit-border-radius: .1rem;
    -moz-border-radius: .1rem;
    border-radius: .1rem;
    border: 1px solid #ddd;
    /*max-width: 2rem;*/
  }

  .tableBox .list_item .flex1 {
    border: 0;
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
