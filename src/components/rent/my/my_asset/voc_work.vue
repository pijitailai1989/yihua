<template>
  <yd-layout class="layout_my">
    <yd-navbar class="header" v-title="'业务模块'" slot="navbar" title="业务模块" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span class="addClickArea" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
      <div class="addRightClickArea foCoF font28" v-if="$route.query.token" @click="$router.push('/estate/serviceList/building')" slot="right">特约写字楼</div>
    </yd-navbar>
    <div class="voc">
      <ul>
        <li class="font24" style="color:#797C7C;">已启用功能</li>
        <li v-for="(item,index) in enabled" :key="index">
          <div><span style="font-size:.4rem;color:white;">{{item.oneStr}}</span></div>
          <div class="font30 font600" style="color:#696969;">{{item.name}}</div>
          <div class="font26 " v-if="item.type==1">
            <p>永久有效</p>
          </div>
          <div class="font26 " v-else>
            <p>有效期</p>
            <p>{{item.start_time}}</p>
          </div>
        </li>
        <li class="font24" style="color:#797C7C;">添加新功能模块(未启用)</li>
      </ul>
    </div>

    <div class="classify" v-for="(item,index) in not_enabled" :key="index">
      <div class="font30" style="color:#8B8B8B;" @click="toggle(index)">
        <p>{{item.name}}</p>
        <span v-if="hide&&select==index"><img src="../../../../assets/images/rent/my/show.png" alt=""></span>
        <span v-else><img src="../../../../assets/images/rent/my/in.png" alt=""></span>
      </div>
      <ul v-show="index==select">
        <li v-for="(todo,index1) in item.list" :key="index1">
          <div><span style="font-size:.4rem;color:white;">{{todo.oneStr}}</span></div>
          <div class="font30 font600" style="color:#696969;">{{todo.name}}</div>
          <div :style="'border:1px solid '+mainColor" @click="turnTo('/my/my_asset/bm_ConPay1',index,index1)">
            <button class="font28" :style="'color:'+mainColor">开通</button>
          </div>
        </li>
      </ul>
    </div>

  </yd-layout>
</template>
<script>
  import Vue from 'vue';
  import fn from '@/assets/js/product';
  import qs from 'qs'

  export default {
    data() {
      return {
        mainColor: "",
        jNum: 1000,
        sNum: 200,
        userInfo: '',
        organInfo: '',
        organId: '',
        enabled: [],
        not_enabled: [],
        select: 0,
        hide: true
      }
    },
    methods: {
      toggle(index) {
        if (this.select == index) {
          this.select = null
        } else {
          this.select = index;
        }

      },
      turnTo(url, index, index1) {
        this.$router.push(url)
        localStorage.setItem('not_enabled_list', encodeURIComponent(JSON.stringify(this.not_enabled[index].list[index1])))
      },
      back() {
        this.$back(this);
      },
      getBusinessList() {
        var data = {organId: this.organId, token: this.getkey};
        this.xhr.post(`${this.subUrl.user}/asset/getBusinessList`, qs.stringify(data)).then((res) => {

          if (res.data.code == 1) {
            console.log(res)
            if (res.data.data.buyBusiness.length != 0) {
              res.data.data.buyBusiness.forEach(item => {

                item.oneStr = item.name.substring(0, 1)
              })
            }
            if (res.data.data.notBuyBusiness.length != 0) {

              res.data.data.notBuyBusiness.forEach(item => {
                if (item.list != null) {
                  item.list.forEach(todo => {
                    todo.oneStr = todo.name.substring(0, 1)
                  })
                }

              })
            }


            this.enabled = res.data.data.buyBusiness
            this.not_enabled = res.data.data.notBuyBusiness
            // console.log(this.not_enabled)

          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
      }

    },
    mounted() {
      if(this.$route.query.token){
        this.$getUserInfo(res=>{
          this.userId = this.userInfo.guid;
          this.getkey = fn.getIng();
          if (this.organInfo != null) {
            this.organId = this.organInfo.guid;
          }
          this.getBusinessList()
        },this);
      }else{
        this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
        this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
        this.mainColor = localStorage.getItem('mainColor');
        this.userId = this.userInfo.guid;
        this.getkey = fn.getIng();
        if (this.organInfo != null) {
          this.organId = this.organInfo.guid;
        }
        this.getBusinessList()
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

  .voc {
    width: 100%;
  }

  .voc ul {
    width: 100%;
  }

  .voc ul li {
    border-bottom: 1px solid #F4F4F4
  }

  .voc ul li:nth-child(2) {
    background: white;
  }

  .voc ul li:nth-child(3) {
    background: white;
  }

  .voc ul li {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: .2rem .2rem;
  }

  .voc ul li > div:nth-child(1) {
    display: flex;
    flex: 2;
    align-items: center;
  }

  .voc ul li > div:nth-child(1) span {
    width: .9rem;
    height: .9rem;
    border-radius: .2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url('../../../../assets/images/rent/my/bjList.png');
    background-size: 100% 100%;
  }

  .voc ul li > div:nth-child(2) {
    flex: 6;
    padding: 0 .2rem;
  }

  .voc ul li > div:nth-child(3) {
    flex: 4;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .voc ul li > div:nth-child(3) > p {
    margin: .05rem 0;
  }

  .font26 {
    color: #A9A9A9;
  }

  .classify {
    width: 100%;
    background: white;
  }

  .classify > div {
    width: 100%;
    padding: .2rem .2rem;
    border-bottom: 1px solid #F4F4F4;
    display: flex;
    flex-flow: row;
    align-items: center;
  }

  .classify > div > p {
    flex: 1;
  }

  .classify > div > span {
    width: .32rem;
    height: .32rem;
  }

  .classify > div > span img {
    width: 100%;
  }

  .classify ul {
    width: 100%;
  }

  .classify ul li {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: .2rem .2rem;
    border-bottom: 1px solid #F4F4F4;
  }

  .classify ul li > div:nth-child(1) {
    display: flex;
    flex: 2;
  }

  .classify ul li > div:nth-child(1) span {
    width: .9rem;
    height: .9rem;
    border-radius: .2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url('../../../../assets/images/rent/my/bjList.png');
    background-size: 100% 100%;
  }

  .classify ul li > div:nth-child(2) {
    flex: 6;
    padding: 0 .2rem;
  }

  .classify ul li > div:nth-child(3) {
    border-radius: .1rem;
    width: 1.5rem;
    height: .7rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .classify ul li > div:nth-child(3) button {
    background: none;
    border: none;
  }

</style>
