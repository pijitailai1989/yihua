<template>
  <yd-layout class="layout_my">
    <yd-navbar class="header" v-title="'添加物品'" slot="nabvar" v-show="!userAgent.isWX" title="添加物品" color="#fff"
               :bgcolor="mainColor" height=".88rem">
        <span class="spanLeft" @click="back" slot="left">
          <span>
            <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
          </span>
        </span>
      <span slot="right" class="edit spanRight" style="color: #fff;font-size:.3rem;" @click="add">保存</span>
    </yd-navbar>

    <div class="add">
      <p>
        <span>物品名称</span>
        <input type="text" v-model="bm.itemName">
      </p>
      <p>
        <span>数量</span>
        <input type="number" v-model="bm.amount">
      </p>
    </div>
    <div class="details">
      <div class="images">
        <ul v-show="imgUrl!=''">
          <li><img :src="imgUrl" alt=""></li>
        </ul>
        <p v-show="show2" @click="addImg"><img src="../../../../../../assets/images/rent/estate/photo.png" alt="">
          <input class="file" name="file" type="file" accept="image/*" @change="update"/></p>
      </div>
    </div>

  </yd-layout>
</template>
<script>
  import Vue from 'vue';
  import fn from '@/assets/js/product'
  import qs from 'qs'
  import {DateTime} from 'vue-ydui/dist/lib.rem/datetime';
  import store from '@/store'

  Vue.component(DateTime.name, DateTime);
  export default {
    data() {
      return {
        mainColor: "",
        userId: '',
        getkey: '',
        organId: '',
        organType: '',
        show2: true,
        getHearLog: {
          domain: '',
          token: '',
          name: ''
        },
        images: [],
        rows: [],
        bm: {
          amount: 1,
          images: '',
          itemName: '',
        },
        imgUrl: '',
        imgUrls: []
      }
    },
    methods: {
      add() {
        if (this.bm.amount > 0 && this.bm.images != '' && this.bm.itemName != '') {

          this.imgUrls.push(this.imgUrl)
          this.rows.push(this.bm)
          console.log(typeof(this.rows))
          localStorage.setItem('rows', encodeURIComponent(JSON.stringify(this.rows)));
          localStorage.setItem('imgUrls', encodeURIComponent(JSON.stringify(this.imgUrls)));
          this.$dialog.toast({mes: '物品添加成功！'});
          history.back()
        } else {
          this.$dialog.toast({mes: '以上内容皆不能为空！'});
        }

      },
      turnTo(url) {
        this.$router.push(url)
      },
      back() {
        history.back()
      },
      update(e) {
        let file = e.target.files[0];
        let d = new Date();
        let type = file.name.split('.');
        let tokenParem = {
          'putPolicy': '{\"name\":\"$(fname)\",\"size\":\"$(fsize)\",\"w\":\"$(imageInfo.width)\",\"h\":\"$(imageInfo.height)\",\"hash\":\"$(etag)\"}',
          'key': 'orderReview/' + d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.valueOf() + '.' + type[type.length - 1],
          'bucket': this.getHearLog.domain,//七牛的地址，这个是你自己配置的（变量）
        };
        let param = new FormData(); //创建form对象
        param.append('chunk', '0');//断点传输
        param.append('chunks', '1');
        param.append('file', file, file.name)
        // console.log(param.get('file')); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
        let config = {
          headers: {'Content-Type': 'multipart/form-data'}
        };
        //先从自己的服务端拿到token

        this.token = this.getHearLog.token;
        param.append('token', this.token);
        //  if(this.images.length>1){
        //    alert('不能超过1张');
        //    return;
        //  }
        this.uploading(param, config, file.name);//然后将参数上传七牛
        return;

      },
      uploading(param, config, pathName) {
        this.xhr.post('http://up-z2.qiniu.com', param, config)
          .then(response => {
            //  console.log(response.data);
            this.getHearLog.name = response.data.key;
            this.bm.images = this.getHearLog.name
            this.imgUrl = this.getHearLog.domain + '/' + this.getHearLog.name


            let localArr = this.images.map((val, index, arr) => {
              return arr[index].localSrc;
            })
            //  console.log(this.imgName)
            if (!~localArr.indexOf(pathName)) {
              this.images.push({'src': this.showUrl + response.data.key, 'localSrc': pathName});
            } else {
              alert('已上传该图片');
            }
          })
      },
      getQiniuInfo() {
        this.xhr.post(`${this.subUrl.user}/qiniu/getInfo?token=` + this.getkey).then(res => {
          if (res.data.code == 1) {
            // console.log(res)
            this.getHearLog = res.data.data;
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
      },
      addImg() {
        this.getQiniuInfo();
      },


    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = this.$color[this.userInfo.organType]
      this.userId = this.userInfo.guid;
      this.organId = this.organInfo.guid;
      this.organType = this.organInfo.organType;
      this.getkey = fn.getIng();
      if (JSON.parse(decodeURIComponent(localStorage.getItem('rows'))) != null) {
        this.rows = JSON.parse(decodeURIComponent(localStorage.getItem('rows')));
      }
      if (JSON.parse(decodeURIComponent(localStorage.getItem('imgUrls'))) != null) {
        this.imgUrls = JSON.parse(decodeURIComponent(localStorage.getItem('imgUrls')));
      }

    }
  }
</script>
<style scoped>
  .layout_my .header:after {
    display: none;

  }

  .layout_my {
    background: #F7F7F9;
  }

  .layout_my .blue_box {
    height: 0.88rem;
    background: #0093D2;
    background-size: 100% 100%;
  }

  .add {
    width: 100%;
    padding: .2rem .4rem;
    background: white;
  }

  .add > p {
    display: flex;
    flex-flow: row;
    height: .8rem;
    border: 1px solid #ccc;
    margin-bottom: .2rem;
  }

  .add > p > span {
    width: 1.6rem;
    display: flex;
    color: #999;
    justify-content: center;
    align-items: center;
    height: .7rem;
  }

  .add > p > input {
    border: none;
    flex: 1;
    height: 100%;
  }

  .details {
    width: 100%;
    margin-top: .2rem;
    background: white;
    padding: .2rem .4rem;;
    border-bottom: 1px solid #E5E5E5;
  }

  .images {
    margin-top: .2rem;
    display: flex;
  }

  .images > p {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: .1rem;
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
    margin: 0 .1rem;
  }

  .images > ul > li > img {
    width: 1.2rem;
    height: 1.2rem;
    border-radius: .1rem;
  }

  .images > p > input {
    width: 100%;
    height: .9rem;
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
  }
</style>
