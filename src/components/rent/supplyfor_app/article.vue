<template>
  <div style="height:100vh">
    <yd-layout v-if="showMechant">
      <yd-navbar slot="navbar" title="帖子详情" height=".88rem" color="#fff" :bgcolor="mainColor">
        <div class="addClickArea" slot="left" @click="back">
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </div>
      </yd-navbar>
      <div class="usuallyBox">
        <div class="list_item bb">
          <div class="label">状态：</div>
          <div class="flex1">{{result.nickname}}</div>
        </div>
        <div class="list_item">
          <div class="label">联系人：</div>
          <div class="flex1">{{result.nickname}}</div>
        </div>
        <div class="list_item">
          <div class="label">电话：</div>
          <div class="flex1">{{result.phone}}</div>
        </div>
        <div class="list_item">
          <div class="label">企业名称：</div>
          <div class="flex1">{{result.organName}}</div>
        </div>
      </div>
      <div class="usuallyBox mt2 bt bb" style="padding-bottom: .01rem;">
        <div class="list_item bb">
          <div class="label">标题：</div>
          <div class="flex1 font600">{{result.title}}</div>
        </div>
        <div class="list_item">
          <div class="label">类型：</div>
          <div class="flex1">{{result.typeName}}</div>
        </div>
        <div class="list_item" v-if="result.deadline">
          <div class="label">截止日期：</div>
          <div class="flex1" v="">{{result.deadline>'9998'?'永久':(result.deadline.substr(0,10))}}</div>
        </div>
        <div class="list_item">
          <div class="label">买家地址：</div>
          <div class="flex1">{{result.userAddr}}</div>
        </div>
        <div class="border foCo9" style="margin: .3rem;padding: .1rem;">
          <div>详情：</div>
          <div>{{result.content}}</div>
        </div>
      </div>
      <div class="flex-row-nowarp h9 bgwhite bt foCo6" style="color:#f2725e" slot="bottom">
        <div class="flex1 jusCenter" @click="disagree">
          <img src="../../../assets/images/rent/my/admin/disagree.png" style="width: .4rem;margin: .05rem 0.1rem 0 0;" alt="">
          <span>拒绝</span>
        </div>
        <div class="flex1 jusCenter" @click="showMechant=false">
          <img src="../../../assets/images/rent/my/admin/agree.png" style="width: .4rem;margin: .05rem 0.1rem 0 0;" alt="">
          <span>通过并推荐</span>
        </div>
      </div>
    </yd-layout>
    <mechant v-if="!showMechant" @chooseMechant="chooseMechant"></mechant>

  </div>
</template>

<script>
  import mechant from './sub/mechant'

  export default {
    components:{
      mechant
    },

    data() {
      this.$getUserInfo(()=>{},this)
      return {
        result:{
        },
        showMechant:true,
        mainColor:""

      }
    },methods:{
      back(){
        this.$back(this);
      },
      chooseMechant(e){
        this.showMechant = true;
        if(e){
          console.log(JSON.stringify(e));
          let data = {
            token:this.$getkey(),
            type:this.$route.params.type == 1?6:7,
            bbsId:this.$route.params.id,
            userId:this.$route.query.userId,
            bsUserIds:e,
          }
          this.$ajax(`${this.subUrl.bd}/buildingBuy/recommend`,data,res=>{
            this.$dialog.toast({mes:"推荐成功",icon:"success",timeout:1000});
          },this)
        }
      },
      //

      getBbs(){
        this.$ajax(`${this.subUrl.bd}/buildingBuy/getDetail`,{token:this.$route.query.token,bbsId:this.$route.params.id},res=>{
          this.result = res.data.bbs;
        },this)
      },
      disagree(){
        this.$dialog.confirm({mes:"是否下架帖子",opts:()=>{
            let data = {
              token:this.$getkey(),
              bbsId:this.$route.params.id,
              userId:this.$route.query.userId,
            }
            this.$ajax(`${this.subUrl.bd}/buildingBuy/manageAudit`,data,res=>{
              this.$dialog.toast({mes:"下架成功"});
            },this)
        }});

      },
    },mounted(){
      this.$getUserInfo(res=>{
        this.mainColor= this.$color[this.userInfo.organType];
        this.getBbs();
      },this)
    },
  }
</script>

<style scoped>
.usuallyBox .list_item .flex1{
  border: 0;
  color: #333;
}
</style>
