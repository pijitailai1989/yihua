<template>
  <div>
    <yd-layout class="layout_my">
      <yd-navbar class="header" slot="navbar" v-show="!userAgent.isWX" v-title="'岗位管理'" title="岗位管理" color="#fff" :bgcolor="mainColor" height=".88rem">
        <div class="addClickArea" @click="$router.go(-1)" slot="left"><!--url[url.length-1]-->
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </div>
        <div slot="right" class="edit" style="color: #fff;">
          <router-link :to="'/my/manager/job_manager/add'">
            <img src="../../../../assets/images/rent/my/add_new_job.png" alt="">
          </router-link>
        </div>
      </yd-navbar>
    </yd-layout>
    <div>
      <div class="top_title">固定岗位</div>
      <ul class="oul">
        <li v-for="(item,index) in passW" :key="index" v-if="item.type*1!=99">
          <img class="l-left" src="../../../../assets/images/rent/my/left_job_list.png" alt="">
          <span class="l-center">{{item.postName}}</span>
        </li>
      </ul>
      <div class="top_title" v-if="addPassW.length">新增岗位</div>
      <ul class="oul">
        <li v-for="(item,index) in addPassW" :key="index" v-if="item.type*1==99">
          <img v-if="!item.isSelected&&!isAllSelected" class="l-left"
               src="../../../../assets/images/rent/my/unselected_pic.png" alt="" @click="selected(index)">
          <img v-if="item.isSelected||isAllSelected" class="l-left"
               src="../../../../assets/images/rent/my/job_selected.png" alt="" @click="selected(index)">
          <span class="l-center">{{item.postName}}</span>
          <router-link :to="'/my/manager/job_manager/add?jobName='+item.postName+'&guid='+item.guid">
            <img class="l-right l-right-change" src="../../../../assets/images/rent/my/add_job.png" alt="">
          </router-link>
        </li>
      </ul>
      <ul class="oul selected_footer">
        <li>
          <img v-if="!isAllSelected" class="l-left" src="../../../../assets/images/rent/my/unselected_pic.png" alt=""
               @click="selectAll">
          <img v-if="isAllSelected" class="l-left" src="../../../../assets/images/rent/my/job_selected.png" alt=""
               @click="selectAll">
          <span class="l-center">全部</span>
          <div class="bottom-del" @click="clearJob()">删除</div>
          <img @click="clearJob()" class="del-right" src="../../../../assets/images/rent/my/del-gray.png" alt="">
        </li>
      </ul>
    </div>
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
        arr: [],
        url: this.fromRoute ? this.fromRoute : '',
        userInfo: "",
        mainColor: "",
        invide_code: "",
        addPassW: [],
        passW: [],
        isAllSelected: false,
        delJobArr: []
      }
    },
    methods: {
      selected(index) {
        if ((this.addPassW[index].isSelected && this.addPassW[index].isSelected == true) || this.isAllSelected == true) {
          this.isAllSelected = false;
          this.addPassW[index].isSelected = false;
          let _datas = this.addPassW;
          this.addPassW = [];
          for (let i = 0; i < _datas.length; i++) {
            this.addPassW.push(_datas[i]);
          }
        } else {
          this.addPassW[index].isSelected = true;
          let _datas = this.addPassW;
          this.addPassW = [];
          for (let i = 0; i < _datas.length; i++) {
            this.addPassW.push(_datas[i]);
          }
          this.arr.push(index)
        }
      },
      selectAll() {
        if (!this.isAllSelected && this.addPassW.length > 0) {
          this.isAllSelected = true;
          for (var i = 0; i < this.addPassW.length; i++) {
            this.addPassW[i].isSelected = true;
            this.arr.push(i)
          }
        } else {
          this.isAllSelected = false;
          for (var i = 0; i < this.addPassW.length; i++) {
            this.addPassW[i].isSelected = false;
          }
        }

      },
      update() {
        this.xhr.post(`${this.subUrl.user}/admin/postManage/postList?token=` + data.token + '&organId=' + data.organId).then((res) => {
          if (res.data.code == 1) {
            this.passW = res.data.data.fixedPost;
            this.addPassW = res.data.data.dynamicPost;
            for (var i = 0; i < this.addPassW.length; i++) {
              this.passW.push(this.addPassW[i]);
            }
            this.addPassW = [];
            for (var i = 0; i < this.passW.length; i++) {
              if (this.passW[i].type * 1 == 99) {
                this.addPassW.push(this.passW[i]);
                this.passW[i].isSelected = false
              }
            }
            this.userInfo = res.data.data.userInfo;
            this.organInfo = res.data.data.organInfo;
            cb && cb();
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            // fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
      },
      delSelectedJob(arr) {
        var data = {postId: this.guid, token: this.getkey};
        this.xhr.post(`${this.subUrl.user}/admin/postManage/batchDelPost?token=` + this.getkey + '&postIds=' + arr).then((res) => {
          if (res.data.code == 1) {
            var that = this;
            this.$dialog.toast({mes:"删除成功",timeout:400,icon:"success"})
            this.getUserInfo(function () {
              that.getJobInfo();
            });
          } else {
            // this.$dialog.toast({mes: res.data.msg});
          }
        })

      },
      clearJob() {
        this.delJobArr = [];
        for (var i = 0; i < this.addPassW.length; i++) {
          if (this.addPassW[i].isSelected) {
            this.delJobArr.push(this.addPassW[i].guid);
          }
        }
        if (this.delJobArr.length > 0) {
          this.delSelectedJob(this.delJobArr)
        }else{
          this.$dialog.toast({mes:"请选择要删除的岗位",timeout:400})
        }

      },
      getJobInfo(cb) {
        var data = {organId: this.organInfo.guid, token: this.getkey, pageNo: 1, pageSeze: 15};
        this.xhr.post(`${this.subUrl.user}/admin/postManage/postList?token=` + data.token + '&organId=' + data.organId).then((res) => {
          if (res.data.code == 1) {
            this.addPassW.splice(0, this.addPassW.length);
            this.passW = res.data.data.fixedPost;
            this.addPassW = res.data.data.dynamicPost;
            for (var i = 0; i < this.addPassW.length; i++) {
              this.passW.push(this.addPassW[i]);
            }
            this.addPassW = [];
            for (var i = 0; i < this.passW.length; i++) {
              if (this.passW[i].type * 1 == 99) {
                this.addPassW.push(this.passW[i]);
                this.passW[i].isSelected = false
              }
            }
            this.userInfo = res.data.data.userInfo;
            this.organInfo = res.data.data.organInfo;
            cb && cb();
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            // fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
      },
      clearLoacl() {
        this.alertS = true;
      },
      quit() {
        this.alertS = false;
      },
      getUserInfo(cb) {
        var data = {userId: this.userId, token: this.getkey};
        this.xhr.post(`${this.subUrl.user}/user/getUserInfo`, qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
            this.userInfo = res.data.data.userInfo;
            this.organInfo = res.data.data.organInfo;
            cb && cb();
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
      this.mainColor = localStorage.getItem('mainColor');
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
  .top_title {
    width: 100%;
    line-height: 0.8rem;
    font-size: 12px;
    padding: 0 0.3rem;
  }

  .layout_my {
    background: #f7f7f9;
  }

  .layout_my .header:after {
    display: none;

  }

  /*消息列表结束*/
  li {
    height: 0.9rem;
    background: white;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    padding: 0 0.3rem;
    position: relative;
    border-bottom: 1px solid #F0F0F0;
  }

  .l-right-change {
    top: 35%
  }

  .selected_footer {
    position: fixed;
    width: 100%;
    bottom: 0;
  }

  .l-left {
    height: 0.4rem;
    width: 0.4rem;
  }

  .edit img {
    width: 1em
  }

  .l-center {
    margin: 0 0.3rem;
  }

  .l-right {
    height: 0.3rem;
    width: 0.3rem;
    right: 0.5rem;
    position: absolute;
  }

  .bottom-del {
    background: red;
    color: #ffffff;
    line-height: 3.2em;
    height: 100%;
    width: 6em;
    padding-left: 1.6em;
    right: 0em;
    position: absolute;
    text-align: center;
  }

  .bottom-del img {
    height: 0.3rem;
    width: 0.3rem;
  }

  .del-right {
    height: 0.3rem;
    width: 0.3rem;
    right: 0.9rem;
    top: 50%;
    margin-top: -0.5em;
    position: absolute;
  }
</style>
