<template>
  <div>
    <yd-layout class="layout_my">
      <yd-navbar class="header" slot="navbar" v-show="!userAgent.isWX" v-title="'添加岗位'" title="添加岗位" color="#fff" :bgcolor="mainColor" height=".88rem">
        <router-link :to="'/my/manager/job_manager'" slot="left"><!--url[url.length-1]-->
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </router-link>
        <div slot="right" class="edit addRightClickArea" style="color: #fff;">
          <a @click="addNewJob">
            保存
          </a>
        </div>
      </yd-navbar>
    </yd-layout>
    <div>
      <div class="add_top edit_code">
        岗位名称
        <div class="edit_content"><input v-model="jobName" placeholder="请输入岗位名" class="add_input" type="text"></div>
      </div>
      <div class="add_top edit_code">
        <div class="list-left">分配权限</div>
        <router-link v-if="!guid||guid==''" :to="'/my/manager/job_manager/add_root?jobName='+jobName+'&ids='+ids">
          <div class="newMessage" v-if="count==0">请选择</div>
          <div class="newMessage" v-if="count>0">您已选择{{count}}种权限</div>
        </router-link>
        <router-link v-if="guid&&guid!=''" :to="jobName&&jobName!=''?'/my/manager/job_manager/add_root?jobName='+jobName+'&guid='+guid+'&ids='+ids:''">
          <div class="newMessage" v-if="count==0">请选择</div>
          <div class="newMessage" v-if="count>0">您已选择{{count}}种权限</div>
        </router-link>
        <img class="m-right l-right" src="../../../../assets/images/rent/my/enter.png">
      </div>
    </div>
  </div>
</template>
<script>
import fn from "@/assets/js/product";
import qs from "qs";

export default {
  data() {
    return {
      organInfo: "",
      hasMessage: {
        count: 99,
        new: true
      },
      ids: [],
      arr: [],
      url: this.fromRoute ? this.fromRoute : "",
      userInfo: "",
      mainColor: "",
      invide_code: "",
      jobName: "",
      guid: "",
      count: 0
    };
  },
  methods: {
    selected(index) {
      if (
        (this.addPassW[index].isSelected &&
          this.addPassW[index].isSelected == true) ||
        this.isAllSelected == true
      ) {
        this.isAllSelected = false;
        this.addPassW[index].isSelected = false;
        for (var i = 0; i < this.arr.length; i++) {
          if (arr[i] == index) {
            this.addPassW.splice(this.arr[i], 1);
            i--;
          }
        }
      } else {
        this.addPassW[index].isSelected = true;
        this.arr.push(index);
      }
    },
    selectAll() {
      if (!this.isAllSelected && this.addPassW.length > 0) {
        this.isAllSelected = true;
        for (var i = 0; i < this.addPassW.length; i++) {
          this.addPassW[i].isSelected = true;
        }
      } else {
        this.isAllSelected = false;
        for (var i = 0; i < this.addPassW.length; i++) {
          this.addPassW[i].isSelected = false;
        }
      }
    },
    clearJob() {
      if (this.isAllSelected) {
        this.addPassW.splice(0, this.addPassW.length);
        this.isAllSelected = false;
      } else {
        var arr = this.arr;
        for (var i = 0; i < arr.length; i++) {
          for (var j = 1; j < arr.length; j++) {
            if (arr[i] < arr[j]) {
              var a = arr[i];
              arr[i] = arr[j];
              arr[j] = a;
            }
          }
        }
        for (var i = 0; i < this.arr.length; i++) {
          if (this.addPassW[this.arr[i]].isSelected) {
            this.addPassW.splice(this.arr[i], 1);
          }
        }
        this.arr.splice(0, this.arr.length);
      }
    },
    clearLoacl() {
      this.alertS = true;
    },
    quit() {
      this.alertS = false;
    },
    getUserInfo(cb) {
      var data = { userId: this.userId, token: this.getkey };
      this.xhr
        .post(`${this.subUrl.user}/user/getUserInfo`, qs.stringify(data))
        .then(res => {
          if (res.data.code == 1) {
            this.userInfo = res.data.data.userInfo;
            this.organInfo = res.data.data.organInfo;
            cb && cb();
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        });
    },
    getThisJobRoot() {
      var data = { postId: this.guid, token: this.getkey };
      this.xhr
        .post(
          `${this.subUrl.user}/admin/postManage/allocate?token=` +
            this.getkey +
            "&postId=" +
            this.guid
        )
        .then(res => {
          if (res.data.code == 1) {
            var haveRoot = res.data.data;
            for (var i = 0; i < haveRoot.length; i++) {
              this.ids.push(haveRoot[i].functionId);
            }
          } else {
            // this.$dialog.toast({mes: res.data.msg});
          }
        });
      // this.$router.push({path:'/my/manager/job_manager'})
    },
    addNewJob() {
      var data = {
        organId: this.organInfo.guid,
        token: this.getkey,
        pageNo: 1,
        pageSeze: 15
      };
      if (this.jobName == "") {
        return this.$dialog.toast({ mes: "请输入岗位名" });
      } else if (this.ids == "") {
        return this.$dialog.toast({ mes: "请选择权限" });
      }
      if (this.guid && this.guid != "") {
        if (this.$route.query.ids && this.$route.query.ids != "") {
        }
        this.xhr
          .post(
            `${this.subUrl.user}/admin/postManage/editPost?token=` +
              this.getkey +
              "&postId=" +
              this.guid +
              "&postName=" +
              this.jobName +
              "&functionIds=" +
              this.ids
          )
          .then(res => {
            if (res.data.code == 1) {
            } else {
              this.$dialog.toast({ mes: res.data.msg });
            }
          });
      } else {
        if (this.jobName == "") {
          return this.$dialog.toast({ mes: "请输入岗位名" });
        } else if (this.ids == "") {
          return this.$dialog.toast({ mes: "请选择权限" });
        }
        this.xhr
          .post(
            `${this.subUrl.user}/admin/postManage/addPost?token=` +
              this.getkey +
              "&organId=" +
              this.organInfo.guid +
              "&postName=" +
              this.jobName +
              "&functionIds=" +
              this.ids
          )
          .then(res => {
            if (res.data.code == 1) {
              return this.$dialog.toast({ mes: "添加"+this.jobName+"成功" });
            } else {
              this.$dialog.toast({ mes: res.data.msg });
            }
          });
      }
      this.$router.push({ path: "/my/manager/job_manager" });
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.mainColor = localStorage.getItem("mainColor");
    this.userId = this.userInfo.guid;
    this.getkey = fn.getIng();
    if (this.$route.query.jobName) {
      this.jobName = this.$route.query.jobName;
    }
    if (this.$route.query.guid) {
      this.guid = this.$route.query.guid;
    }
    if (this.$route.query.ids) {
      this.ids = this.$route.query.ids;
      this.count = this.ids.split(",").length;
    }
    this.userId = this.userInfo.guid;
    if (this.$route.query.ids && this.$route.query.ids.length > 0) {
      this.ids = this.$route.query.ids;
    } else {
      this.getThisJobRoot();
    }
    var that = this;
    this.getUserInfo(function() {});
  }
};
</script>
<style scoped>
.top_title {
  width: 100%;
  line-height: 0.8rem;
  font-size: 0.18rem;
  padding: 0 0.3rem;
}

.layout_my {
  background: #f7f7f9;
}

.layout_my .header:after {
  display: none;
}

.edit img {
  width: 1em;
}

.add_top {
  width: 100%;
  line-height: 0.9rem;
  background: #ffffff;
}

.add_top input {
  line-height: 2.3em;
  width: 100%;
}

.add_input {
  padding: 0 0.1rem;
  outline: none;
  background: none;
  border: none;
}

.edit_content {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  margin: 0 0.2rem;
  border-radius: 0.1rem;
  background: #ebf3f3;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  line-height: 2.3em;
  text-align: center;
}

.edit_code {
  margin-top: 1em;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-flow: row nowrap;
  flex-flow: row nowrap;
  height: 1rem;
  padding: 0.15rem 1em;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  background: #fff;
}

.m-right {
  width: 0.32rem;
}

.l-right {
  height: 0.3rem;
  width: 0.3rem;
  right: 0.5rem;
  position: absolute;
}

.l-left {
  height: 0.4rem;
  width: 0.4rem;
}

.newMessage {
  margin-right: 2.3em;
  flex: 1;
  color: #999999;
  text-align: right;
}

.yd-flexview {
  height: 100%;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  margin: 0 auto;
  max-width: 750px;
  min-width: 300px;
}

.list-left {
  flex: 1;
}
</style>
