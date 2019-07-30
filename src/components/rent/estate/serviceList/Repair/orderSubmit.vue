<template>
  <div>
    <yd-layout class="layout_my">
      <div class="all-background">
        <div class="call-msg">
          <img style="width: 100%" src="../../../../../assets/images/rent/estate/repair/submitBack.png" alt="">
          <div style="font-size: 20px;margin-bottom: 0.8em;font-weight: 600">提交成功！</div>
          <div>报修单已成功提交，请耐心等待，<br>工作人员将尽快为你处理。</div>
        </div>
      <img style="width: 100%" src="../../../../../assets/images/rent/estate/repair/submitBack.png" alt="">
      <div class="call-btn" @click="knowIt">确定</div>
      </div>
    </yd-layout>
  </div>
</template>
<script>
  import fn from '@/assets/js/product'
  import qs from 'qs'
  export default {
    data() {
      return {
        organInfo: "",
        hasMessage: {
          count: 99,
          new: true,
        },
        value2: "",
        result: [],
        url: this.fromRoute ? this.fromRoute : '',
        userInfo: "",
        mainColor: ""
      }
    },
    methods: {
      itemClickHandler() {
      },
      knowIt(){
        this.$router.push('/estate/repair')
      },
      submitHandler(value) {
        this.arr = [];
        this.selectTab = 4;
        this.page = 1;
        this.$dialog.toast({mes: `搜索：${value}`});
        var data = {token: this.getkey, organId: this.organInfo.guid};
        // {params: {type: 'pulldown', page: this.page}
        this.xhr.post(`${this.subUrl.admin}/latestNews/organNews?token=` + this.getkey + '&keyword=' + `${value}` + '&organId=' + this.organInfo.guid + '&pageNo=' + this.page + '&pageSize=10').then((res) => {
          if (res.data.code == 1) {
            this.arr = [...res.data.data.list, ...this.arr];
            if (res.data.data.list.length == 0) {
              this.showErr = true;
            } else {
              this.showErr = false;
            }
            this.page++;
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
      },
      getJobInfo(cb) {
        var data = {organId:this.organInfo.guid, token: this.getkey,pageNo:1,pageSeze:15};
        this.xhr.post(`${this.subUrl.user}/admin/postManage/postList?token=`+data.token+'&organId='+data.organId).then((res) => {
          if (res.data.code == 1) {
            cb&&cb();
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            // fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
      },
      clearLoacl(){
        this.alertS=true;
      },
      quit(){
        this.alertS=false;
      },
      getUserInfo(cb) {
        var data = {userId: this.userId, token: this.getkey};
        this.xhr.post(`${this.subUrl.user}/user/getUserInfo`, qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
            this.userInfo = res.data.data.userInfo;
            this.organInfo = res.data.data.organInfo;
            cb&&cb();
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
      },

    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = this.$color[this.userInfo.organType]
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      this.userId = this.userInfo.guid;
      var that = this;
      this.getUserInfo(function () {
        that.getJobInfo();
      });
    }
  }
</script>
<style scoped>
  .all-background{
    background: #b4dff1;
    width: 100%;
    height: 1000em;
  }
  .layout_my{
    background: #f7f7f9;
  }
  .layout_my .header:after {
    display: none;
  }
  .call-msg{
    width: 100%;
    height: 16em;
    background: #34a9da
  }
  .call-msg div{
    text-align: center;
    color: #ffffff;
    font-size: 13px;
    line-height: 1.6em;
  }
  .call-btn{
    background: #0093d2;
    color: #ffffff;
    line-height: 2.5em;
    font-size: 15px;
    border-radius: 5px;
    margin-top: 0.8em;
    width: 80%;
    margin-left: 10%;
    text-align: center;
  }
</style>
