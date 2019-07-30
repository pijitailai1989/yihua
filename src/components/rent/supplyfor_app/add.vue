<template>
  <div style="height:100vh">
    <yd-layout>
      <yd-navbar slot="navbar" :title="mTitle" height=".88rem" color="#fff" :bgcolor="mainColor">
        <div class="addClickArea" slot="left" @click="back()">
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </div>
        <div class="addRightClickArea" @click="addMember" style="color:#fff" slot="right">保存</div>
      </yd-navbar>
      <div class="usuallyBox bb" style="padding: .2rem 0 .3rem;">
        <div class="list_item">
          <div class="label">姓名</div>
          <input class="flex1" maxlength="10" type="text" v-model="name">
        </div>
        <div class="list_item">
          <div class="label">手机号码</div>
          <input class="flex1" maxlength="11" type="text" v-model="account">
        </div>
        <div class="list_item">
          <div class="label">岗位名称</div>
          <input   class="flex1" maxlength="10" type="text" v-model="postName">
        </div>
      </div>
    </yd-layout>
  </div>
</template>
<script>
  var reg = /1[356789]\d{9}/;
  export default {
    props:['userId','otherUser'],
    data() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = this.$color[this.userInfo.organType];
      return {
        mTitle:"",
        name:"",
        account:"",
        postName:""
      }
    },methods:{
      back(){
        this.$emit('getMenber');
      },
      addMember(){
        if(this.name == ""){
          return this.$dialog.toast({mes:"请输入姓名"})
        }else if(this.account == ""){
          return this.$dialog.toast({mes:"请输入手机号",timeout:"800"})
        }else if(!reg.test(this.account)){
          return this.$dialog.toast({mes:"请输入正确的手机号",timeout:"800"})
        }else {
          var data = {
            token:this.$getkey(),
            organId:this.organInfo.guid,
            name:this.name,
            account:this.account,
            postName:this.postName,
          };
          if(!this.userId){
            this.$ajax(`${this.subUrl.user}/admin/merchant/addMember`,data,res=>{
              this.$dialog.toast({mes:"添加成功",icon:"success"});
              let obj = {};
              this.$emit('getMenber',obj);
            },this)
          }else{
            data.userId = this.userId;
            this.$ajax(`${this.subUrl.user}/admin/merchant/editMember`,data,res=>{
              this.$dialog.toast({mes:"修改成功",icon:"success"});
              let obj = {};
              this.$emit('getMenber',obj);
            },this)
          }

        }
      },
    },mounted(){
      this.mTitle = this.userId?"编辑员工":"添加员工";
      if(this.userId){
        this.name = this.otherUser.userName;
        this.account = this.otherUser.account;
        this.postName = this.otherUser.postName;
      }
    }
  }
</script>

<style scoped>

</style>
