<template>
  <div>
    <yd-layout class="layout_my">
      <yd-navbar class="header" slot="navbar" v-show="!userAgent.isWX" v-title="'新增成员'" title="新增成员" color="#fff" :bgcolor="mainColor" height=".88rem">
        <a @click="back()" slot="left"><!--url[url.length-1]-->
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </a>
        <div slot="right" class="edit" style="color: #fff;">
          <a @click="addPeople">
            保存
          </a>
        </div>
      </yd-navbar>
      <div class="dept-title dept-title-top">{{deptName}}</div>
      <div class="add_top edit_code name-bottom">
        <div class="left-name">姓名</div>
        <div class="edit_content"><input v-model="userName" placeholder="请输入员工名" class="add_input" type="text"></div>
      </div>
      <div class="add_top edit_code" style="margin-top: 0">
        <div class="left-name">手机号码</div>
        <div class="edit_content"><input v-model="phoneNum" maxlength="11" placeholder="请输入员工手机号" class="add_input" type="text"></div>
      </div>
      <div class="add_top edit_code">
        <div class="list-left">分配权限</div>
        <router-link v-if="userName!=''&&phoneNum!=''&&this.$route.path=='/my/manager/department/add_people'" :to="userName&&phoneNum?'/my/manager/department/select_job?guid='+this.guid+'&deptName='+this.deptName+'&userName='+this.userName+'&phoneNum='+this.phoneNum:$route.fullPath"><div class="newMessage">请选择</div></router-link>
        <router-link v-if="userName!=''&&phoneNum!=''&&this.$route.path=='/my/manager/department/edit_people'" :to="userName&&phoneNum?'/my/manager/department/change_job?guid='+this.guid+'&deptName='+this.deptName+'&userName='+this.userName+'&phoneNum='+this.phoneNum:$route.fullPath"><div class="newMessage">请选择</div></router-link>
        <img class="m-right l-right" src="../../../../assets/images/rent/my/enter.png">
      </div>
      <div class="dept-title"></div>
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
        mainColor: "",
        userName:'',
        phoneNum:'',
        guid:'',
        deptName:'',
        jobIdList:[],
      }
    },
    methods: {
      back(){
        this.$router.go(-1)
      },
      itemClickHandler() {
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
      addPeople(){
        var data = {organId:this.organInfo.guid, token: this.getkey,pageNo:1,pageSeze:15};
        if(this.guid&&this.guid!=''){
          if(this.$route.path=='/my/manager/department/add_people'){
            this.xhr.post(`${this.subUrl.user}/admin/deptManage/addStaff?token=`+this.getkey+
              '&organId='+this.organInfo.guid+'&DepartmentId='+this.guid+'&name='+this.userName
              +'&account='+this.phoneNum+'&postIdList='+this.jobIdList).then((res) => {
              if (res.data.code == 1) {
                this.$dialog.toast({mes:"员工添加成功"})
              } else {
                this.$dialog.toast({mes: res.data.msg});
              }
            })
          }else{
            this.xhr.post(`${this.subUrl.user}/admin/deptManage/editStaff?token=`+this.getkey+
              '&organId='+this.organInfo.guid+'&userId='+this.guid+'&name='+this.userName
              +'&account='+this.phoneNum+'&postIdList='+this.jobIdList).then((res) => {
              if (res.data.code == 1) {
                this.$dialog.toast({mes:"员工修改成功"})
              } else {
                this.$dialog.toast({mes: res.data.msg});
              }
            })
          }
          this.$router.go(-3)
        }
      }

    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = localStorage.getItem('mainColor');
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      this.userId = this.userInfo.guid;
      if(this.$route.query.userName!=''){
        this.userName=this.$route.query.userName
      }else{
        this.userName=''
      }
      if(this.$route.query.phoneNum!=''){
        this.phoneNum=this.$route.query.phoneNum
      }else{
        this.phoneNum=''
      }
      if(this.$route.query.guid!=''){
        this.guid=this.$route.query.guid
      }else{
        this.guid=''
      }
      if(this.$route.query.deptName!=''){
        this.deptName=this.$route.query.deptName
      }else{
        this.deptName=''
      }
      if(this.$route.query.jobId!=''){
        this.jobIdList=this.$route.query.jobId
      }else{
        this.jobIdList=[]
      }

      var that = this;
      this.getUserInfo(function () {
        that.getJobInfo();
      });
    }
  }
</script>
<style scoped>
  .top_title{
    width: 100%;
    line-height:0.8rem;
    font-size: 0.18rem;
    padding: 0 0.3rem;
  }
  .layout_my{
    background: #f7f7f9;
  }
  .layout_my .header:after {
    display: none;

  }
  .dept-title{
    width: 100%;
    line-height: 3em;
    background: #fafefd;
  }
  .dept-title-top{
    text-align: right;
    padding-right: 80%;
  }
  .add_top {
    width: 100%;
    line-height: 0.9rem;
    background: #fafefd
  }

    .add_top input{
      line-height: 2.3em;
      width: 100%;
      background: #fff;
      border: 1px solid #e6e6e6;
      border-radius: 3px;
    }
  .add_input{
    padding: 0 .1rem;
    outline: none;
    background: none;
    border: none;
  }
  .edit_content{
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    margin: 0 .2rem;
    border-radius: .1rem;
    background: #ebf3f3;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    line-height: 2.3em;
    text-align: center;
  }
  .edit_code{
    margin-top: 1em;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-flow: row nowrap;
    flex-flow: row nowrap;
    height: 1rem;
    padding: .15rem 1em;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    background: #fafefd;
  }
  .name-bottom{
    border-bottom: 1px solid #e6e6e6;
  }
  .left-name{
    width: 20%;
    text-align: right;
    padding-right: 2%;
  }
  .newMessage {
    margin-right: 2.3em;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    color: #999999;
    text-align: right;
  }
  .list-left{
    flex:1
  }
  .l-right {
    height: 0.3rem;
    width: .3rem;
    right: 0.5rem;
    position: absolute;
  }
</style>
