<template>
  <yd-layout class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'账户资料'" slot="navbar" title="账户资料" color="#fff" :bgcolor="mainColor" height=".88rem">
        <!-- <router-link :to="'/index/'+local.a+'/'+local.b+'/3/rent/my'" slot="left"> -->
        <span @click="toBack" class="spanLeft" slot="left">
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </span>
        <!-- </router-link> -->
      </yd-navbar>
    </div>
    <div class="user_logn" :class="{green:userInfo.organType == 1,orange:userInfo.organType == 2}">
      <ul>
        <li @click="headPortrait">
          <img :class="{green:userInfo.organType == 1,orange:userInfo.organType == 2}" :src="clients.headPortrait">
        </li>
        <li>
          <p class="font24">资料完成度</p>
          <div>
            <yd-progressbar type="line" stroke-color="#eee" :progress="clientss.dataPerfection" trail-width="8" :trail-color="mainColor">
            </yd-progressbar>
          </div>
          <p class="font24">{{parseInt(clientss.dataPerfection*100)}}%</p>
        </li>
      </ul>

    </div>

    <div>
      <ul>
        <li>
          <yd-cell-group>

            <yd-cell-item type="label">
              <div class="font30" slot="left">基本资料</div>
              <div @click="BasicsInfo" class="yd_bu font28" slot="right">
                <p>{{clientss.enabledBasicsInfo?'公开':'不公开'}}</p>
                <yd-switch :color="mainColor" slot="right" v-model="clientss.enabledBasicsInfo"></yd-switch>
              </div>
            </yd-cell-item>
            <yd-cell-item arrow type="link" href="/my/setting/user_write#nickname">
              <span class="font30" slot="left">呢称</span>
              <span class="yd_bu font28" slot="right">{{clients.nickname}}</span>
            </yd-cell-item>
            <yd-cell-item>
              <span class="font30" slot="left">ID</span>
              <span class="yd_bu font28" slot="right">{{clients.guid}}</span>
            </yd-cell-item>


          </yd-cell-group>
        </li>
        <li>

          <yd-cell-group>

            <yd-cell-item>
              <div class="font30" slot="left">姓名</div>
              <div class="yd_bu font28" slot="right">{{clients.name}}</div>
            </yd-cell-item>
            <yd-cell-item>
              <div class="font30" slot="left">手机</div>
              <div class="yd_bu font28" slot="right">{{clients.account}}</div>
            </yd-cell-item>
            <yd-cell-item>
              <div class="font30" slot="left">写字楼</div>
              <div class="yd_bu font28" slot="right">{{clients.buildingName}}</div>
            </yd-cell-item>
            <yd-cell-item>
              <div class="font30" slot="left">所属企业</div>
              <div class="yd_bu font28" slot="right">{{clients.organName}}</div>
            </yd-cell-item>
            <yd-cell-item>
              <div class="font30" slot="left">部门</div>
              <div class="yd_bu font28" slot="right">{{clients.deptName}}</div>
            </yd-cell-item>
            <yd-cell-item>
              <div class="font30" slot="left">岗位</div>
              <div class="yd_bu font28" slot="right">{{clients.postName}}</div>
            </yd-cell-item>


          </yd-cell-group>

        </li>
        <li>

          <yd-cell-group>

            <yd-cell-item type="label">
              <div class="font30" slot="left">个性资料</div>
              <div @click="IndInfo" class="yd_bu font28" slot="right">
                <p>{{clientss.enabledIndInfo?'公开':'不公开'}}</p>
                <yd-switch :color="mainColor" slot="right" v-model="clientss.enabledIndInfo"></yd-switch>
              </div>
            </yd-cell-item>
            <yd-cell-item arrow type="link" href="/my/setting/user_write#interest">
              <span class="font30" slot="left">兴趣爱好</span>
              <span class="yd_bu font28" slot="right">{{clientss.interestName}}</span>
            </yd-cell-item>
            <yd-cell-item arrow type="link" href="/my/setting/user_write#introduceMyself">
              <span class="font30" slot="left">自我介绍</span>
              <span class="yd_bu c font28" slot="right">{{clientss.introduceMyself}}</span>
            </yd-cell-item>



          </yd-cell-group>

        </li>
        <li>

          <yd-cell-group>

            <yd-cell-item type="label">
              <div class="font30" slot="left">圈子资料</div>
              <div @click="CircleInfo" class="yd_bu font28" slot="right">
                <p>{{clientss.enabledCircleInfo?'公开':'不公开'}}</p>
                <yd-switch :color="mainColor" slot="right" v-model="clientss.enabledCircleInfo"></yd-switch>
              </div>
            </yd-cell-item>
            <yd-cell-item arrow @click.native="sexChoose">
              <span class="font30" slot="left">性别</span>
              <span class="yd_bu font28" slot="right">{{clientss.sex?'男':'女'}}</span>
            </yd-cell-item>
            <yd-cell-item arrow @click.native="birthdayChoose">
              <span class="font30" slot="left">出生年月</span>
              <span class="yd_bu font28" slot="right">{{clientss.birthday}}</span>
            </yd-cell-item>
            <yd-cell-item arrow class="birthplaces">
              <span class="font30" slot="left" style="width:3.2rem;">出生地</span>
              <input slot="right" style="font-size:.28rem;color:#A7A7A7;text-align:right" type="text" @click.stop="user_s.show4 = true"
                v-model="clientss.birthplace" readonly placeholder="请选择地址">
            </yd-cell-item>
            <yd-cell-item arrow type="link" href="/my/setting/user_write#workplace">
              <span class="font30" slot="left">工作地</span>
              <span class="yd_bu font28" slot="right">{{clientss.workplace}}</span>
            </yd-cell-item>
            <yd-cell-item arrow type="link" href="/my/setting/user_write#valueCenter">
              <span class="font30" slot="left">价值中心</span>
              <span class="yd_bu font28" slot="right">{{clientss.valueCenterName}}</span>
            </yd-cell-item>
            <yd-cell-item arrow type="link" href="/my/setting/user_write#constellatio">
              <span class="font30" slot="left">星座</span>
              <span class="yd_bu font28" slot="right">{{clientss.constellatio}}</span>
            </yd-cell-item>
          </yd-cell-group>

        </li>
        <li>

          <yd-cell-group>

            <yd-cell-item type="label">
              <div class="font30" slot="left">联系方式</div>
              <div @click="Contact" class="yd_bu font28" slot="right">
                <p>{{clientss.enabledContact?'公开':'不公开'}}</p>
                <yd-switch :color="mainColor" slot="right" v-model="clientss.enabledContact"></yd-switch>
              </div>
            </yd-cell-item>
            <yd-cell-item arrow type="link" href="/my/setting/user_write#wechat">
              <span class="font30" slot="left">微信</span>
              <span class="yd_bu font28" slot="right">{{clientss.wechat}}</span>
            </yd-cell-item>
            <yd-cell-item arrow type="link" href="/my/setting/user_write#qq">
              <span class="font30" slot="left">QQ</span>
              <span class="yd_bu c font28" slot="right">{{clientss.qq}}</span>
            </yd-cell-item>
            <yd-cell-item arrow type="link" href="/my/setting/user_write#logisticsAddress">
              <span class="font30" slot="left">物流地址</span>
              <span class="yd_bu c font28" slot="right">{{clientss.logisticsAddress}}</span>
            </yd-cell-item>
          </yd-cell-group>
        </li>
      </ul>
    </div>
    <div class="headPortrait" v-show="user_s.show1">
      <ul>
        <li v-if="confirms" @click="edit_hearLog">
          <span class="font32">确定</span>
        </li>
        <li v-else>
          <span class="font32">确定</span>
        </li>
        
        <li>
          <span class="font32">从手机相册选择</span>
          <input class="file" name="file" type="file" accept="image/*" @change="update" />
        </li>
        <li @click="cancel">
          <span class="font32">取消</span>
        </li>
      </ul>
    </div>
    <div class="sex" v-show="user_s.show2">
      <ul>
        <li>请 选 择</li>
        <li></li>
        <li>
          <span :class="{active:local.active1,'aa':true}" @click="sexSelect(1)">
            <img src="../../../../assets/images/rent/my/sex1.png">
            <a :style="{color:mainColor}">{{local.sex1?'男':'女'}}</a>
          </span>
          <span></span>
          <span :class="{active:local.active2,'aa':true}" @click="sexSelect(0)">
            <img src="../../../../assets/images/rent/my/sex0.png">
            <a :style="{color:mainColor}">{{local.sex0?'男':'女'}}</a>
          </span>
        </li>
        <li>
          <button @click="bt_sex" :style="{background:mainColor}">确 定</button>
        </li>
      </ul>
    </div>
    <div class="birthplace" v-show="user_s.show3">
      <ul>
        <li>
          <a class="font30 font600" :style="{color:mainColor}" @click="cancel">取消</a>
          <a class="font30 font600">出生日期</a>
          <a class="font30 font600" :style="{color:mainColor}" @click="finished">完成</a>
        </li>
        <li>
          <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
        </li>
      </ul>
    </div>
    <yd-cityselect v-model="user_s.show4" :callback="result1" :items="district"></yd-cityselect>
  </yd-layout>
</template>
<script>
  import Vue from 'vue';
  import store from '../../../../store'
  import fn from '@/assets/js/product'
  import qs from 'qs'
  import { ProgressBar } from 'vue-ydui/dist/lib.rem/progressbar';
  import { CellGroup, CellItem } from 'vue-ydui/dist/lib.rem/cell';
  import { Switch } from 'vue-ydui/dist/lib.rem/switch';

  import { Actionsheet } from 'mint-ui';
  import { CitySelect } from 'vue-ydui/dist/lib.rem/cityselect';


  Vue.component(CitySelect.name, CitySelect);

  import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog';
  import { Picker } from 'mint-ui';
  import District from 'ydui-district/dist/jd_province_city_area_id';

  Vue.component(Picker.name, Picker);

  Vue.prototype.$dialog = {
    confirm: Confirm,
    alert: Alert,
    toast: Toast,
    notify: Notify,
    loading: Loading,
  };


  Vue.component(Switch.name, Switch);
  Vue.component(CellGroup.name, CellGroup);
  Vue.component(CellItem.name, CellItem);


  Vue.component(ProgressBar.name, ProgressBar);

  export default {

    data() {
      const url = this.$formPath;
      console.log(url);
      return {
        url: url,
        confirms:false,
        slots: [
          {
            flex: 1,
            values: [
              '1910年', '1911年', '1912年', '1913年', '1914年', '1915年', '1916年', '1917年', '1918年', '1919年',
              '1920年', '1921年', '1922年', '1923年', '1924年', '1925年', '1926年', '1927年', '1928年', '1929年',
              '1930年', '1931年', '1932年', '1933年', '1934年', '1935年', '1936年', '1937年', '1938年', '1939年',
              '1940年', '1941年', '1942年', '1943年', '1944年', '1945年', '1946年', '1947年', '1948年', '1949年',
              '1950年', '1951年', '1952年', '1953年', '1954年', '1955年', '1956年', '1957年', '1958年', '1959年',
              '1960年', '1961年', '1962年', '1963年', '1964年', '1965年', '1966年', '1967年', '1968年', '1969年',
              '1970年', '1971年', '1972年', '1973年', '1974年', '1975年', '1976年', '1977年', '1978年', '1979年',
              '1980年', '1981年', '1982年', '1983年', '1984年', '1985年', '1986年', '1987年', '1988年', '1989年',
              '1990年', '1991年', '1992年', '1993年', '1994年', '1995年', '1996年', '1997年', '1998年', '1999年',
              '2000年', '2001年', '2002年', '2003年', '2004年', '2005年', '2006年', '2007年', '2008年', '2009年',
              '2010年', '2011年', '2012年', '2013年', '2014年', '2015年', '2016年', '2017年'
            ],
            className: 'slot1',
            textAlign: 'right'
          }, {
            divider: true,
            content: '-',
            className: 'slot2'
          }, {
            flex: 1,
            values: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            className: 'slot3',
            textAlign: 'left'
          }
        ],
        mainColor: "",
        organInfo: '',
        userInfo: '',
        head_po: [
          { name: '从手机相册选择', methods: '' }, { name: '拍照', methods: '' }
        ],
        user_s: {
          show1: false,
          show2: false,
          show3: false,
          show4: false,
        },
        userId: '',
        getkey: '',
        local: {
          a: 0,
          b: 0,
          sex1: 1,
          sex0: 0,
          sex: null,
          active1: false,
          active2: false,
        },
        getHearLog: {
          domain: '',
          token: '',
          name: null
        },
        images: [],

        model1: '',
        district: District
      }
    },
    computed: {
      clients() {
        return store.user
      },
      clientss() {
        return store.userInfo
      }
    },
    methods: {
      toBack() {
        console.log(this.url)
        if (this.url == '/circle/my_circle') {
          this.$router.go(-1);
        }else{
          this.$router.push('/index/'+this.local.a+'/'+this.local.b+'/3/rent/my');
        }
      },
      result1(ret) {
        this.clientss.birthplace = ret.itemName1 + ' ' + ret.itemName2 + ' ' + ret.itemName3;
        this.keepData('birthplace', this.clientss.birthplace)
      },
      finished() {
        this.user_s.show3 = false;
        this.keepData('birthday', this.clientss.birthday)
      },
      birthdayChoose() {
        this.user_s.show3 = true;
      },
      cancel() {
        this.user_s.show3 = false;
        this.user_s.show1 = false;
      },
      onValuesChange(picker, values) {
        if (values[0] != null && values[1] != null) {

          this.clientss.birthday = values.join(',')
        }

      },
      turnTo(url) {
        this.$router.push(url)
      },
      back() {
        this.$router.go(-1)
      },
      // 获取用户资料
      getAccountInfo() {

        var data = { userId: this.userId, token: this.getkey };
        this.xhr.post(`${this.subUrl.user}/user/accountInfo`, qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
            localStorage.setItem('user', encodeURIComponent(JSON.stringify(res.data.data.user)));
            localStorage.setItem('users', encodeURIComponent(JSON.stringify(res.data.data.userInfo)));
            store.user = res.data.data.user
            // console.log(res.data.data.user)
            res.data.data.userInfo.enabledBasicsInfo=res.data.data.userInfo.enabledBasicsInfo?true:false
            res.data.data.userInfo.enabledIndInfo=res.data.data.userInfo.enabledIndInfo?true:false
            res.data.data.userInfo.enabledCircleInfo=res.data.data.userInfo.enabledCircleInfo?true:false
            res.data.data.userInfo.enabledContact=res.data.data.userInfo.enabledContact?true:false
            store.userInfo = res.data.data.userInfo
          } else if (res.data.code == '-902') {
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        })

      },
      /*获取用户信息*/
      getUserInfo(cb) {
        var data = { userId: this.userId, token: this.getkey };
        this.xhr.post(`${this.subUrl.user}/user/getUserInfo`, qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
            this.userInfo = res.data.data.userInfo;
            this.organInfo = res.data.data.organInfo;
            cb && cb();
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        })
      },
      headPortrait() {
        this.user_s.show1 = true;
        this.confirms=false;
        this.getQiniuInfo()
      },
      BasicsInfo() {
        this.keepData('enabledBasicsInfo', this.clientss.enabledBasicsInfo ? 0 : 1)
        this.clientss.enabledBasicsInfo = !this.clientss.enabledBasicsInfo;
      },
      IndInfo() {
        this.keepData('enabledIndInfo', this.clientss.enabledIndInfo ? 0 : 1)
        this.clientss.enabledIndInfo = !this.clientss.enabledIndInfo;
      },
      CircleInfo() {
        this.keepData('enabledCircleInfo', this.clientss.enabledCircleInfo ? 0 : 1)
        this.clientss.enabledCircleInfo = !this.clientss.enabledCircleInfo;
      },
      Contact() {
        this.keepData('enabledContact', this.clientss.enabledContact ? 0 : 1)
        this.clientss.enabledContact = !this.clientss.enabledContact;
      },
      keepData(key, value) {
        this.xhr.post(`${this.subUrl.user}/user/saveUserInfo?userId=` + this.userId + '&token=' + this.getkey + '&' + key + '=' + value).then((res) => {
          if (res.data.code == 1) {
            this.$dialog.toast({ mes: res.data.msg, timeout: 600 });
          }
        })
      },
      sexChoose() {
        this.user_s.show2 = true;
      },
      bt_sex() {
        this.user_s.show2 = false;
        if (this.local.sex == null) { return }
        this.keepData('sex', this.local.sex)
        store.userInfo.sex = this.local.sex
      },
      sexSelect(num) {
        if (num == 1) {
          this.local.active1 = true;
          this.local.active2 = false;
        } else if (num == 0) {
          this.local.active1 = false;
          this.local.active2 = true;
        }
        this.local.sex = num;
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
          headers: { 'Content-Type': 'multipart/form-data' }
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
             if(response.data.key!=null){
                this.getHearLog.name = response.data.key;
                this.confirms=true;
             }
            let localArr = this.images.map((val, index, arr) => {
              return arr[index].localSrc;
            })
            if (!~localArr.indexOf(pathName)) {
              this.images.push({ 'src': this.showUrl + response.data.key, 'localSrc': pathName });
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
            this.$dialog.toast({ mes: res.data.msg });
          }
        })
      },
      edit_hearLog() {
        this.user_s.show1 = false;
        this.keepData('headPortrait', this.getHearLog.name);
        store.user.headPortrait = this.getHearLog.domain + '/' + this.getHearLog.name;
        // console.log(this.getHearLog.name)

      },

    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = localStorage.getItem('mainColor');
      this.userId = this.userInfo.guid;
      this.local.b = localStorage.getItem('isManger');
      this.local.a = localStorage.getItem('organType');
      this.getkey = fn.getIng();
      var that = this;
      this.getUserInfo(function () {
        that.getAccountInfo();
      });
      this.slots[0].values.reverse()
      // console.log(this.getHearLog.name);
    },
    beforeUpdate () {

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

  .user_logn {
    width: 100%;
    height: 3rem;
    background: url("../../../../assets/images/rent/my/my_blue.png");
    background-size: 100% 100%;
  }

  .user_logn.green {
    width: 100%;
    height: 3rem;
    background: url("../../../../assets/images/rent/my/my_green.png");
    background-size: 100% 100%;
  }


  .user_logn.orange {
    width: 100%;
    height: 3rem;
    background: url("../../../../assets/images/rent/my/my_orange.png");
    background-size: 100% 100%;
  }

  .user_logn ul {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    justify-content: center;
  }

  .user_logn ul li:nth-child(1) {
    width: 1.5rem;
    height: 1.5rem;
    margin-bottom: .5rem;
  }

  .user_logn ul li img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    border: .1rem solid #28B1E0;
  }

  .user_logn ul li .green {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    border: .1rem solid #008B15;
  }

  .user_logn ul li .orange {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    border: .1rem solid #B66F00;
  }

  .user_logn ul li:nth-child(2) {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .user_logn ul li:nth-child(2) div {
    width: 2rem;
    margin-left: 0.2rem;
    margin-right: 0.4rem
  }

  .user_logn ul li:nth-child(2) p {
    color: white;
    margin-top: .05rem;
  }

  .yd_bu {
    width: 70%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    color: #A7A7A7;
  }

  .yd_bu p {
    margin-right: .1rem;
  }

  .yd_bu.c {
    width: 5rem;
  }

  .sex {
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, .3);
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items:center;
  }

  .sex ul {
    width: 6rem;
    height: 5rem;
    background: white;
    border-radius: .2rem;
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    align-items: center;
    padding: 0 .2rem;
  }

  .sex ul li {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .sex ul li:nth-child(1) {
    width: 100%;
    font-size: .5rem;
    padding: .1rem 0;
  }

  .sex ul li:nth-child(2) {
    width: 100%;
    font-size: .28rem;
    padding: .1rem 0;
    color: #727272;
  }

  .sex ul li:nth-child(3) {
    width: 100%;
    font-size: .26rem;
    display: flex;
    justify-content: center;
    border-top: 1px solid #F0F0F0;
    border-bottom: 1px solid #F0F0F0;
    margin: .1rem 0 .3rem;
    padding: .2rem 0
  }

  .sex ul li:nth-child(3)>span {
    display: flex;
    flex-flow: column;
    align-items: center;
  }

  .sex ul li:nth-child(3)>span>img {
    width: 50%;
    height: 50%;
    margin: .2rem 0;
  }

  .sex ul li:nth-child(3)>span.active {
    border: 1px solid #ccc;
    border-radius: .2rem;
  }

  .aa {
    border: 1px solid white;
  }

  .sex ul li:nth-child(3)>span:nth-child(2) {
    width: 1px;
    height: .7rem;
    background: #EAEAEA;
    margin: 0 .5rem;
  }

  .sex ul li:nth-child(4) {
    width: 100%;
    font-size: .30rem;
  }

  .sex ul li:nth-child(4)>button {
    width: 90%;
    height: .9rem;
    border: none;
    border-radius: .1rem;
    color: white;
    font-weight: 600;
  }

  .birthplace {
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, .3);
    z-index: 999;
  }

  .birthplace ul {
    width: 100%;
    height: 4.5rem;
    background: white;
    position: absolute;
    bottom: 0;
    left: 0;
  }

  .birthplace ul li:nth-child(1) {
    width: 100%;
    height: .9rem;
    background: #F0F0F0;
    display: flex;
    flex-flow: row;
  }

  .birthplace ul li:nth-child(1)>a {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .birthplace ul li:nth-child(1)>a:nth-child(1) {
    width: 18%;
    height: 100%;
  }

  .birthplace ul li:nth-child(1)>a:nth-child(2) {
    flex: 1;
    height: 100%;
  }

  .birthplace ul li:nth-child(1)>a:nth-child(3) {
    width: 18%;
    height: 100%;
  }

  .birthplace ul li:nth-child(2) {
    width: 100%;
    background: #E4EAE8;
  }

  .headPortrait {
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, .4);
    z-index: 999;
  }

  .headPortrait ul {
    width: 100%;
    height: 3rem;
    position: absolute;
    left: 0;
    bottom: 0;
  }

  .headPortrait ul li {
    width: 100%;
    height: .9rem;
    background: white;
    border-bottom: 1px solid #D6D6D6;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .headPortrait ul li:nth-child(2) {
    margin-bottom: .3rem;
    position: relative;
  }

  .headPortrait ul li input {
    width: 100%;
    height: .9rem;
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
  }

  .headPortrait ul li span {
    color: #373737;
  }
</style>