<template>
    <yd-layout class="layout">
      <yd-navbar class="header" v-show="!userAgent.isWX" v-title="'修改管理员'" title="修改管理员" color="#fff" :bgcolor="mainColor" height=".88rem">
        <a @click="back" slot="left">
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </a>
        <div slot="right" class="edit" style="color: #fff;" @click="confirm()">确定</div>
      </yd-navbar>
      <div class="form">
        <!--{{url.length-1}}-->
        <div class="input_box"><input type="password" placeholder="请输入原密码"></div>
        <div class="change">修改管理员信息</div>
        <div class="input_box">
          <label for="userName">姓名</label>
          <input type="text" id="userName" >
        </div>
        <div class="input_box">
          <label for="phone">手机号码</label>
          <input type="text" id="phone" >
        </div>
      </div>
    </yd-layout>
</template>
<script>
  import qs from 'qs'
  import fn from '@/assets/js/product'
	export default {
		data() {
		  console.log(this.fromRoute)
			return {
        mainColor:"",
        url:this.fromRoute?this.fromRoute:''
      }
		},
		methods: {
		  back(){
        this.$router.go(-1)
      },
		  getNewmessage(data){
        this.xhr.post(`${this.subUrl.manager}/admin/latestNews/organNews`,qs.stringify(data)).then((res)=>{
          console.log(res);
        })
      },confirm(){

      }
    },
    mounted(){
		  this.mainColor = localStorage.getItem('mainColor');
      this.userId = localStorage.getItem('user_Id');
    },
	}
</script>
<style scoped>
.input_box{
  display: flex;
  padding:.15rem .24rem;
  flex-flow: row nowrap;
  align-items: center;
  color: #333;
  background: #fff;
}
.input_box label{
  width: 1.6rem;
  text-align: right;
  padding-right:.3rem;
}
.change{
  line-height: .65rem;
  color: #666;
  padding-left:.3rem;
}
.input_box input{
  flex:1;
  padding: 0 .2rem;
  height:.68rem;
  -webkit-border-radius: .1rem;
  -moz-border-radius: .1rem;
  border-radius: .1rem;
  outline: none;
  border: none;
  background: none;
  background: #ebf3f3;
}
</style>
