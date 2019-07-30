<template>
  <yd-layout class="layout_my">
      <yd-navbar class="header" slot="navbar" v-show="!userAgent.isWX" v-title="'部门管理'" title="部门管理" color="#fff"
                 :bgcolor="mainColor" height=".88rem">
        <a @click.stop="back()" slot="left"><!--url[url.length-1]-->
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </a>
        <div slot="right" class="edit" style="color: #fff;">
          <a v-if="showRightImg" @click.stop="openAdd">
            添加
          </a>
          <a v-if="!showRightImg" @click.stop="sendToOne">
            发送
          </a>
        </div>
      </yd-navbar>
      <yd-search class="search" :result="result" fullpage v-model="value2" :item-click="itemClickHandler"
                 :on-submit="submitHandler"></yd-search>
      <div class="black-bg" v-if="toAddDept"></div>
      <div class="alert-div" v-if="toAddDept">
        <div class="alert-title" v-if="(!editDeptGuid||editDeptGuid=='')&&!delDeptBg">
          新增部门
        </div>
        <div class="alert-title" v-if="(editDeptGuid&&editDeptGuid!='')&&!delDeptBg">
          编辑部门
        </div>
        <div v-if="delDeptBg" class="alert-title-del">
          确定删除{{delThisDept}}部门
        </div>
        <input v-if="!delDeptBg" placeholder="请填写新增部门" v-model="deptName" type="text">
        <div class="last-btn">
          <div style="flex: 1;text-align: center" @click.stop="cancelAdd">取消</div>
          <div v-if="deptName==''&&(!delDeptBg||delDeptBg=='')" style="flex: 1;text-align: center"
               @click.stop="cancelAdd">确定
          </div>
          <div v-if="deptName!=''&&(!delDeptBg||delDeptBg=='')" style="flex: 1;text-align: center"
               @click.stop="addDEpt()" Disabled>确定
          </div>
          <div v-if="delDeptBg" style="flex: 1;text-align: center" @click.stop="sureDelDept(sureDelGuid)" Disabled>确定
          </div>
        </div>
      </div>
      <div class="list-top">
        <ul class="oul" v-for="(it,index) in passW" :key="index">
          <li @click="showList(index)">
            <img v-show="it.empList.length>0" v-bind:class="it.showList&&it.empList.length>0?'l-left l-click':'l-left'"
                 src="../../../../assets/images/rent/my/root-list.png" alt="">
            <img v-show="it.empList.length==0" style="opacity: 0" class="l-left l-click"
                 src="" alt="">
            <span class="l-center">{{it.deptName}}</span>
            <router-link :to="'/my/manager/department/add_people?guid='+it.guid+'&deptName='+it.deptName" slot="left">
              <img v-if="showRightImg" class="l-right3 l-right-change"
                   src="../../../../assets/images/rent/my/add-item.png" alt="">
            </router-link>
            <img v-if="showRightImg" @click.stop="editDept(it.deptName,it.guid)" class="l-right2 l-right-change"
                 src="../../../../assets/images/rent/my/add_job.png" alt="">
            <img v-if="showRightImg" @click.stop="delDept(it.guid,it.deptName)" class="l-right1 l-right-change"
                 src="../../../../assets/images/rent/my/job-del.png" alt="">
          </li>
          <ul v-show="it.showList">
            <li class="child-bottom" v-for="(item,no) in it.empList" @click="selectThis(index,no)" :key="no"
                v-if="it.empList.length>0">
              <img v-show="!item.isSelect" class="list-item"
                   src="../../../../assets/images/rent/my/unselected_pic.png" alt="">
              <img v-show="item.isSelect" class="list-item"
                   src="../../../../assets/images/rent/my/job_selected.png" alt="">
              <span class="l-center-item">
                {{item.userName}}</span>
              <span class="l-center-span" v-if="item.post">{{item.post}}</span>
              <span class="l-center-span" v-if="!item.post">暂无</span>

              <router-link
                :to="'/my/manager/department/edit_people?guid='+item.userId+'&deptName='+it.deptName+'&userName='+item.userName+'&phoneNum='+item.account"
                slot="left">
                <img v-if="showRightImg" class="l-right1 l-right-change"
                     src="../../../../assets/images/rent/my/add_job.png"
                     alt="">
              </router-link>
            </li>
          </ul>
        </ul>
        <ul v-if="showRightImg" class="oul selected_footer">
          <li>
            <img v-if="!isAllSelected" class="l-left" src="../../../../assets/images/rent/my/unselected_pic.png" alt=""
                 @click.stop="selectAll">
            <img v-if="isAllSelected" class="l-left" src="../../../../assets/images/rent/my/job_selected.png" alt=""
                 @click.stop="selectAll">
            <span class="l-center">全部</span>
            <div class="bottom-del" @click.stop="delPeople()">删除</div>
            <img @click.stop="delPeople()" style="top:0.3rem" class="del-right"
                 src="../../../../assets/images/rent/my/del-gray.png"
                 alt="">
          </li>
        </ul>
      </div>
  </yd-layout>
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
        value2: "",
        result: [],
        url: this.fromRoute ? this.fromRoute : "",
        userInfo: "",
        mainColor: "",
        passW: [],
        deptName: "",
        guid: "",
        toAddDept: false,
        toDel: [],
        isAllSelected: false,
        editDeptGuid: "",
        showRightImg: true,
        delDeptBg: false,
        sureDelGuid: "",
        delThisDept: ""
      };
    },
    methods: {
      back() {
        this.$router.go(-1);
      },
      sendToOne() {
        // alert(1);
        var data = {
          organId: this.organInfo.guid,
          token: this.getkey,
          pageNo: 1,
          pageSeze: 15
        };
        var arr = [];
        for (var i of this.passW) {
          for (var j of i.empList) {
            if (j.isSelect) {
              arr.push(j.userId)
            }
          }
        }
        console.log(arr);
        if (arr.length == 0) {
          return this.$dialog.toast({mes: "请选择用户"});
        }
        let params = {
          token: this.$getkey(),
          organId: this.organInfo.guid,
          userIds: arr.join(',')
        };
        // let data = {
        //   token: this.$getkey(),
        //   organId: this.organInfo.guid,
        //   userIds: arr.join(',')
        // };
        this.$ajax(`${this.subUrl.user}/admin/resendInvite`, params, res => {
          this.$dialog.toast({mes: "发送邀请成功", icon: "success", timeout: 1000})
          this.$router.go(-1);
        }, this)
        /*if (this.editDeptGuid && this.editDeptGuid != "") {
          this.xhr
            .post(
              `${this.subUrl.user}/admin/deptManage/editDepartment?token=` +
                data.token +
                "&organId=" +
                data.organId +
                "&deptId=" +
                this.editDeptGuid +
                "&departmentName=" +
                this.deptName
            )
            .then(res => {
              if (res.data.code == 1) {
                this.getDepartmentInfo();
                this.deptName = "";
                this.editDeptGuid = "";
                this.toAddDept = false;
                this.$router.push({ path: "/my/manager" });
              } else if (res.data.code == "-902") {
                //-902
                /!*重新登录*!/
                // fn.re_login(this);
              } else {
                this.$dialog.toast({ mes: res.data.msg });
              }
            });
        }*/
      },
      delPeople() {
        this.toDel = [];
        var flag = false;
        for (var i = 0; i < this.passW.length; i++) {
          for (var j = 0; j < this.passW[i].empList.length; j++) {
            if (this.passW[i].empList[j].isSelect) {
              this.toDel.push(this.passW[i].empList[j].userId);
              flag = true;
            }
          }
        }
        if (flag) {
          var data = {
            organId: this.organInfo.guid,
            token: this.getkey,
            pageNo: 1,
            pageSeze: 15
          };
          this.xhr
            .post(
              `${this.subUrl.user}/admin/deptManage/batchDelStaff?token=` +
              data.token +
              "&organId=" +
              data.organId +
              "&userIds=" +
              this.toDel
            )
            .then(res => {
              if (res.data.code == 1) {
                var arr = this.passW;
                this.passW = [];
                this.passW = arr;
                this.flag = false;
                for (var i = 0; i < this.passW.length; i++) {
                  for (var j = 0; j < this.passW[i].empList.length; j++) {
                    if (this.passW[i].empList[j].isSelect) {
                      this.passW[i].empList.splice(j, 1);
                    }
                  }
                }
              } else if (res.data.code == "-902") {
                //-902
                /*重新登录*/
                // fn.re_login(this);
              } else {
                this.$dialog.toast({mes: res.data.msg});
              }
            });
        }
      },
      selectAll() {
        if (!this.isAllSelected) {
          for (var i = 0; i < this.passW.length; i++) {
            for (var j = 0; j < this.passW[i].empList.length; j++) {
              this.passW[i].empList[j].isSelect = true;
            }
          }
          this.isAllSelected = true;
        } else {
          for (var i = 0; i < this.passW.length; i++) {
            for (var j = 0; j < this.passW[i].empList.length; j++) {
              this.passW[i].empList[j].isSelect = false;
            }
          }
          this.isAllSelected = false;
        }
        var arr = this.passW;
        this.passW = [];
        this.passW = arr;
      },
      openAdd() {
        this.toAddDept = true;
      },
      editDept(name, guid) {
        this.toAddDept = true;
        this.deptName = this.editDeptName;
        this.editDeptGuid = guid;
      },
      cancelAdd() {
        this.deptName = "";
        this.toAddDept = false;
        this.delDeptBg = false;
        this.sureDelGuid = "";
        this.delThisDept = "";
      },
      selectThis(index, no) {
        this.passW[index].empList[no].isSelect = this.passW[index].empList[no]
          .isSelect
          ? false
          : true;
        if (!this.passW[index].empList[no].isSelect) {
          this.isAllSelected = false;
        } else {
          var flag = true;
          for (var i = 0; i < this.passW.length; i++) {
            for (var j = 0; j < this.passW[i].empList.length; j++) {
              if (!this.passW[i].empList[j].isSelect) {
                flag = false;
              }
            }
          }
          this.isAllSelected = flag ? true : false;
        }
        var arr = this.passW;
        this.passW = [];
        this.passW = arr;
      },
      delDept(guid, name) {
        this.toAddDept = true;
        this.delDeptBg = true;
        this.sureDelGuid = guid;
        this.delThisDept = name;
      },
      sureDelDept(guid) {
        var data = {
          organId: this.organInfo.guid,
          token: this.getkey,
          pageNo: 1,
          pageSeze: 15
        };
        this.xhr
          .post(
            `${this.subUrl.user}/admin/deptManage/delDepartment?token=` +
            data.token +
            "&organId=" +
            data.organId +
            "&DepartmentId=" +
            guid
          )
          .then(res => {
            if (res.data.code == 1) {
              this.getDepartmentInfo();
            } else if (res.data.code == "-902") {
              //-902
              /*重新登录*/
              // fn.re_login(this);
            } else {
              this.$dialog.toast({mes: res.data.msg});
            }
            this.sureDelGuid = "";
          });
        this.cancelAdd();
      },
      addDEpt() {
        var data = {
          organId: this.organInfo.guid,
          token: this.getkey,
          pageNo: 1,
          pageSeze: 15
        };
        if (this.editDeptGuid && this.editDeptGuid != "") {
          this.xhr
            .post(
              `${this.subUrl.user}/admin/deptManage/editDepartment?token=` +
              data.token +
              "&organId=" +
              data.organId +
              "&deptId=" +
              this.editDeptGuid +
              "&departmentName=" +
              this.deptName
            )
            .then(res => {
              if (res.data.code == 1) {
                this.getDepartmentInfo();
                this.deptName = "";
                this.editDeptGuid = "";
                this.toAddDept = false;
              } else if (res.data.code == "-902") {
                //-902
                /*重新登录*/
                // fn.re_login(this);
              } else {
                this.$dialog.toast({mes: res.data.msg});
              }
            });
        } else {
          this.xhr
            .post(
              `${this.subUrl.user}/admin/deptManage/addDepartment?token=` +
              data.token +
              "&organId=" +
              data.organId +
              "&departmentName=" +
              this.deptName
            )
            .then(res => {
              if (res.data.code == 1) {
                this.getDepartmentInfo();
                this.deptName = "";
                this.toAddDept = false;
              } else if (res.data.code == "-902") {
                //-902
                /*重新登录*/
                // fn.re_login(this);
              } else {
                this.$dialog.toast({mes: res.data.msg});
              }
            });
        }
      },
      showList(index) {
        if (this.passW[index].showList) {
          this.passW[index].showList = false;
        } else {
          this.passW[index].showList = true;
        }
        var arr = this.passW;
        this.passW = [];
        this.passW = arr;
      },
      itemClickHandler() {
      },
      submitHandler(value) {
        this.arr = [];
        this.selectTab = 4;
        this.page = 1;
        var flag = true;
        for (var i = 0; i < this.passW.length; i++) {
          for (var j = 0; j < this.passW[i].empList.length; j++) {
            if (this.passW[i].empList[j].userName == `${value}`) {
              this.passW[i].showList = true;
              this.passW[i].empList[j].isSelect = true;
              flag = false;
            }
          }
        }
        if (flag) {
          this.$dialog.toast({mes: `此员工不存在`});
        }
        var arr = this.passW;
        this.passW = [];
        this.passW = arr;
        var data = {token: this.getkey, organId: this.organInfo.guid};
        // {params: {type: 'pulldown', page: this.page}
        this.xhr
          .post(
            `${this.subUrl.admin}/latestNews/organNews?token=` +
            this.getkey +
            "&keyword=" +
            `${value}` +
            "&organId=" +
            this.organInfo.guid +
            "&pageNo=" +
            this.page +
            "&pageSize=10"
          )
          .then(res => {
            if (res.data.code == 1) {
              this.arr = [...res.data.data.list, ...this.arr];
              if (res.data.data.list.length == 0) {
                this.showErr = true;
              } else {
                this.showErr = false;
              }
              this.page++;
            } else if (res.data.code == "-902") {
              //-902
              /*重新登录*/
              fn.re_login(this);
            } else {
              this.$dialog.toast({mes: res.data.msg});
            }
          });
      },
      getDepartmentInfo(cb) {
        var data = {
          organId: this.organInfo.guid,
          token: this.getkey,
          pageNo: 1,
          pageSeze: 15
        };
        this.xhr
          .post(
            `${this.subUrl.user}/admin/deptManage/organDepartmentInfo?token=` +
            data.token +
            "&organId=" +
            data.organId
          )
          .then(res => {
            if (res.data.code == 1) {
              console.log(res);
              this.passW = res.data.data;
              for (var i = 0; i < this.passW.length; i++) {
                this.passW[i].showList = false;
                for (var j = 0; j < this.passW[i].empList; j++) {
                  this.passW[i].empList[j].isSelect = false;
                }
              }
              cb && cb();
            } else if (res.data.code == "-902") {
              //-902
              /*重新登录*/
              // fn.re_login(this);
            } else {
              this.$dialog.toast({mes: res.data.msg});
            }
          });
      },
      clearLoacl() {
        this.alertS = true;
      },
      quit() {
        this.alertS = false;
      },
      getUserInfo(cb) {
        var data = {userId: this.userId, token: this.getkey};
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
              this.$dialog.toast({mes: res.data.msg});
            }
          });
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
      this.userId = this.userInfo.guid;
      if (this.$route.query.update) {
        this.getDepartmentInfo();
      }
      if (
        this.$route.path.split("/")[this.$route.path.split("/").length - 1] ==
        "send_inviteCode"
      ) {
        this.showRightImg = false;
      }
      this.$router.push({path: this.$route.path});
      var that = this;
      this.getUserInfo(function () {
        that.getDepartmentInfo();
      });
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

  .list-top {
    width: 100%;
    height: auto;
    background: #ffffff;
    margin-top: 1.2em;
    margin-bottom: 1rem;
  }

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
    border-bottom: 1px solid #f0f0f0;
  }

  .child-bottom {
    border-bottom: 1px;
  }

  .child-bottom:before {
    content: "";
    position: absolute;
    right: -91%;
    bottom: -1%;
    width: 177%;
    /* height: 200%; */
    border-bottom: 2px solid #f0f0f0;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scale(0.5, 0.5);
    transform: scale(0.5, 0.5);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .m-right {
    width: 0.32rem;
  }
  .yd-scrollview {
    width: 100%;
    height: 100%;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    position: relative;
    margin-bottom: -1px;
  }
  .l-right1 {
    height: 0.3rem;
    width: 0.3rem;
    right: 0.3rem;
    top: 1em;
    position: absolute;
  }

  .l-right2 {
    height: 0.3rem;
    width: 0.3rem;
    right: 1rem;
    top: 1em;
    position: absolute;
  }

  .l-right3 {
    height: 0.3rem;
    width: 0.3rem;
    right: 1.8rem;
    top: 1em;
    position: absolute;
  }

  .l-center {
    margin: 0 0.3rem;
  }

  .l-center-item {
    margin: 0px 0.3rem 0.2rem;
  }

  .l-left {
    height: 0.3rem;
    width: 0.3rem;
    transform: rotate(-90deg);
    -ms-transform: rotate(-90deg); /* IE 9 */
    -moz-transform: rotate(-90deg); /* Firefox */
    -webkit-transform: rotate(-90deg); /* Safari 和 Chrome */
    -o-transform: rotate(-90deg);
    -webkit-transition: 0.2s ease-in;
    transition: 0.2s ease-in;
  }

  .l-click {
    transform: rotate(0deg);
    -ms-transform: rotate(0deg); /* IE 9 */
    -moz-transform: rotate(0deg); /* Firefox */
    -webkit-transform: rotate(0deg); /* Safari 和 Chrome */
    -o-transform: rotate(0deg);
  }

  .black-bg {
    background: black;
    width: 100%;
    height: 100%;
    opacity: 0.3;
    position: fixed;
    z-index: 99;
  }

  .list-item {
    width: 1.5em;
    height: 1.5em;
  }

  /*//弹框*/
  .alert-div {
    position: absolute;
    width: 80%;
    margin-top: 30%;
    margin-left: 10%;
    background: #ffffff;
    border-radius: 6px;
    padding: 0.3em 0 0;
    z-index: 99;
  }

  .alert-div input {
    width: 80%;
    margin-bottom: 1em;
    border: 1px solid #e6e6e6;
    line-height: 3em;
    border-radius: 0.3em;
    padding: 0 0.5em;
    background: #ebf3f3;
    margin-left: 10%;
  }

  .alert-div .alert-title {
    margin-left: 10%;
    line-height: 4em;
    font-size: 12px;
    color: #999999;
  }

  .alert-div .alert-title-del {
    line-height: 4em;
    text-align: center;
    font-size: 15px;
    color: #444444;
  }

  .alert-div .last-btn {
    border-top: 1px solid #ebf3f3;
    width: 100%;
    line-height: 4em;
    display: flex;
  }

  .last-btn :first-child {
    border-right: 1px solid #ebf3f3;
    color: #999999;
  }

  .l-center-span {
    text-align: left;
    left: 13%;
    bottom: 0.1rem;
    position: absolute;
    width: 50%;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #999999;
  }

  .selected_footer {
    position: fixed;
    width: 100%;
    bottom: 0;
  }

  .selected_footer .l-left {
    height: 1.4em;
    width: 1.4em;
    transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    -webkit-transition: 0.2s ease-in;
    transition: 0.2s ease-in;
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

  .del-right {
    height: 0.3rem;
    width: 0.3rem;
    right: 0.9rem;
    position: absolute;
  }
</style>
