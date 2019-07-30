<template>
   <yd-layout>
     <yd-navbar  height=".88rem" v-show="!userAgent.isWX" v-title="'所属行业'" title="所属行业" bgcolor="#0093d2" color="#fff">
       <div slot="left" @click="cancel()" :to="url">
         <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
       </div>
       <span slot="right" @click="chooseSuccess()" color="#fff;padding-right:.2rem" style="color: #fff;">确定</span>
     </yd-navbar>
     <div class="content">
       <div class="tips"><b>可选</b>（从以下类目选择一项）</div>
       <div class="choose_free" v-for="(item,key) in options_free"  :key="key">
         <div class="list">
           <div class="item" @click="showFree(key)">
             <span class="icon" :class="{green:key%4==0,red:key%4==1,blue:key%4==2,yellow:key%4==3}"></span>
             <div class="item-title">{{item.name}}</div>
             <div class="arrow">
               <img v-show="!item.show" src="../../assets/images/register/right.png">
               <img v-show="item.show" src="../../assets/images/register/bottom.png">
             </div>
           </div>
           <div class="subContent" v-show="item.show">
             <yd-button class="buttonChoose" v-for="(item1,key1) in item.subclass" :key="key1"
                        :type="item1.show?'primary':'hollow'" @click.native="choose_free(key,key1)">{{item1.name}}
             </yd-button>
           </div>
         </div>
       </div>
       <div class="tips"><b>必选</b>（从以下类目选择一项）</div>
       <div class="choose_require" v-for="(item,key) in options_require"  :key="key">
         <div class="list">
           <div class="item" @click="showRequire(key)">
             <span class="icon" :class="{green:key%4==0,red:key%4==1,blue:key%4==2,yellow:key%4==3}"></span>
             <div class="item-title">{{item.name}}</div>
             <div class="arrow">
               <img v-show="!item.show" src="../../assets/images/register/right.png">
               <img v-show="item.show" src="../../assets/images/register/bottom.png">
             </div>
           </div>
           <div class="subContent" v-show="item.show">
             <yd-button class="buttonChoose" shape="circle" v-for="(item1,key1) in item.subclass"
                        :key="key1"
                        :type="item1.show?'primary':'hollow'" @click.native="choose_require(key,key1)">{{item1.name}}
             </yd-button>
           </div>
         </div>
       </div>
     </div>

   </yd-layout>
</template>
<script>
  import Vue from 'vue';
	export default {
		name: '',
    props:["url"],
		data() {
			return {
        options_free:[],
        options_require:[],
        freeIndex:-1,
        requireIndex:-1,
      }
		},
		methods: {
      chooseSuccess(){
        console.log(this.freeObj,this.requireObj);
        if(this.requireObj){
          let obj = {};
          if(this.options_require[this.requireObj.a].subclass[this.requireObj.b].show){
            if(this.freeObj && this.options_free[this.freeObj.a].subclass[this.freeObj.b].show){
              obj.free = this.freeObj && this.options_free[this.freeObj.a].subclass[this.freeObj.b];
            }
            obj.require = this.options_require[this.requireObj.a].subclass[this.requireObj.b];
            console.log(obj)
            this.$emit('chooseSuccess',obj);
          }else{
            this.$dialog.alert({mes:"请选择必选行业"});
          }
        }else{
          this.$dialog.alert({mes:"请选择必选行业"});
        }
      },
      getHangye(){
        this.xhr.post(`${this.subUrl.user}/comm/getIndustryCategory`).then(res=>{
          if(res.data.code == 1){
            console.log(res.data)
            this.options_free = res.data.data.pmc;
            this.options_require = res.data.data.icc;
          }
        })
      },
      cancel(){
        this.$emit('cancel');
        return false;
      },
      showFree(e){
        if(this.options_free[e].show){
          this.$set(this.options_free[e],"show",false);
        }else{
          this.$set(this.options_free[e],"show",true);
        }
      },
      showRequire(e){
        if(this.options_require[e].show){
          this.$set(this.options_require[e],"show",false);
        }else{
          this.$set(this.options_require[e],"show",true);
        }
      },
      choose_free(a,b){
        if(this.options_free[a].subclass[b].show){
          if(!this.freeObj){
            this.freeObj = {};
          }else{
            this.$set(this.options_free[this.freeObj.a].subclass[this.freeObj.b],"show",false);
          }
          this.$set(this.options_free[a].subclass[b],"show",false);
          this.freeObj = {a,b};
        }else{
          if(!this.freeObj){
            this.freeObj = {};
          }else{
            this.$set(this.options_free[this.freeObj.a].subclass[this.freeObj.b],"show",false);
          }
          this.$set(this.options_free[a].subclass[b],"show",true);
          this.freeObj = {a,b};
        }
      },
      choose_require(a,b){
        if(this.options_require[a].subclass[b].show){
          if(!this.requireObj){
            this.requireObj = {};
          }else{
            this.$set(this.options_require[this.requireObj.a].subclass[this.requireObj.b],"show",false);
          }
          this.$set(this.options_require[a].subclass[b],"show",false);
          this.requireObj = {a,b};
        }else{
          if(!this.requireObj){
            this.requireObj = {};
          }else{
            this.$set(this.options_require[this.requireObj.a].subclass[this.requireObj.b],"show",false);
          }
          this.$set(this.options_require[a].subclass[b],"show",true);
          this.requireObj = {a,b};
        }
      }
    },
    mounted(){
      this.getHangye();
      console.log(11)
    }
	}
</script>
<style scoped>
  .item{
    display: flex;
    align-items: center;
    height: .64rem;
    padding: 0 .2rem;
    background: #fff;
    border-top:1px solid #ddd;
    border-bottom:1px solid #ddd;
    margin-top:-1px;
  }
  .arrow img:nth-child(1){
    width: .12rem;
  }
  .arrow img:nth-child(2){
    height: .12rem;
  }
  .item-title{
    flex:1;
  }
  .subContent{
    padding: .2rem .2rem 0;
  }
  .buttonChoose{
    height: .58rem;
    margin:0 .2rem .2rem 0;
    border-radius: .18rem;
  }
  .tips{
    font-size: .24rem;
    color: #777;
    padding: 0 .24rem;
    height: .6rem;
    line-height: .6rem;
  }
  .tips b{
    font-size: .28rem;
    font-weight:400;
  }
  .icon{
    display: inline-block;
    width: .2rem;
    height:.2rem;
    border-radius: .1rem;
    margin-right: .1rem;
  }
  .green{
    background: #52d4e4;
  }
  .blue{
    background: #3eb7e6;
  }
  .red{
    background: #fa697c;
  }
</style>
