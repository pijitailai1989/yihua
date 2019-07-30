<template>
  <div>
    <yd-layout class="layout_my">
      <yd-navbar class="header" slot="navbar" v-show="!userAgent.isWX" v-title="'选择岗位'" title="选择岗位" color="#fff" :bgcolor="mainColor" height=".88rem">
        <a @click="back" slot="left"><!--url[url.length-1]-->
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </a>
        <div slot="right" class="edit" style="color: #fff;">
          <!--<router-link :to="'/my/manager/department/add_people?guid='+this.guid+'&deptName='+this.deptName+'&userName='+this.userName+'&phoneNum='+this.phoneNum+'&jobId='+jobIdArr" slot="left">&lt;!&ndash;url[url.length-1]&ndash;&gt;-->
            <!--确定-->
          <!--</router-link>-->
          <a @click="selectedJob">确定</a>
        </div>
      </yd-navbar>
    </yd-layout>
    <div>
      <div class="top_title">固定岗位</div>
      <ul class="oul">
        <li v-for="(item,index) in addPassW" :key="index" v-if="item.type*1==2||item.type*1==3||item.type*1==4">
          <img v-if="!item.isSelected&&!isAllSelected" class="l-left"
               src="../../../../assets/images/rent/my/unselected_pic.png" alt="" @click="selected(index)">
          <img v-if="item.isSelected||isAllSelected" class="l-left"
               src="../../../../assets/images/rent/my/job_selected.png" alt="" @click="selected(index)">
          <span class="l-center">{{item.postName}}</span>
        </li>
      </ul>
      <div class="top_title" v-if="addPassW.length">新增岗位</div>
      <ul class="oul">
        <li v-for="(item,index) in addPassW" :key="index" v-if="item.type*1!=2&&item.type*1!=3&&item.type*1!=4">
          <img v-if="!item.isSelected&&!isAllSelected" class="l-left"
               src="../../../../assets/images/rent/my/unselected_pic.png" alt="" @click="selected(index)">
          <img v-if="item.isSelected||isAllSelected" class="l-left"
               src="../../../../assets/images/rent/my/job_selected.png" alt="" @click="selected(index)">
          <span class="l-center">{{item.postName}}</span>
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
        value2: "",
        result: [],
        url: this.fromRoute ? this.fromRoute : '',
        userInfo: "",
        mainColor: "",
        userName:'',
        phoneNum:'',
        guid:'',
        deptName:'',
        addPassW: [],
        jobIdArr:[],
        passW: [],
        isAllSelected: false,
        delJobArr: []
      }
    },
    methods: {
      back(){
        this.$router.go(-1)
      },
      selectedJob(){
        for (var i = 0; i < this.addPassW.length; i++) {
          if(this.addPassW[i].isSelected){
            this.delJobArr.push(this.addPassW[i].guid)
          }
        };
        var url='/my/manager/department/add_people?guid=';
        if(this.$route.path!='/my/manager/department/select_job'){
          url='/my/manager/department/edit_people?guid='
        }
        this.$router.push(url+this.guid+'&deptName='+this.deptName+'&userName='+this.userName+'&phoneNum='+this.phoneNum+'&jobId='+this.delJobArr)
      },
      singSelect(){
        for (var i = 0; i < this.addPassW.length; i++) {
          if(this.addPassW[i].isfix){
            this.addPassW[i].isSelected=false;
          }
        }
      },
      selected(index) {
        if(this.addPassW[index].isfix){
          this.singSelect();
        }
        if (this.addPassW[index].isSelected) {
          this.addPassW[index].isSelected = false;
        } else {
          this.addPassW[index].isSelected = true;
        }
        var arr=this.addPassW
        this.addPassW = [];
        this.addPassW=arr;
      },
      getJobInfo(cb) {
        var data = {organId: this.organInfo.guid, token: this.getkey, pageNo: 1, pageSeze: 15};
        this.xhr.post(`${this.subUrl.user}/admin/postManage/postList?token=` + data.token + '&organId=' + data.organId).then((res) => {
          if (res.data.code == 1) {
            this.passW = res.data.data.fixedPost;
            for (var j = 0; j < this.passW.length; j++) {
              this.passW[j].isfix = true
            };
            this.addPassW = res.data.data.dynamicPost;
            this.addPassW=[...this.passW,...this.addPassW];
            for (var i = 0; i < this.addPassW.length; i++) {
                this.addPassW[i].isSelected = false
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
      this.userId = this.userInfo.guid;
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
    position: absolute;
  }
</style>
