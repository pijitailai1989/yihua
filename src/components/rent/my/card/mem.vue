<template>

 <div class="coupon" v-title="'会员卡'">
    <ul>
        <li v-for="(item,index) in mems" :key="index">
            <p>
                <i><img :src="item.logoUrl" alt=""></i>
                <span>
                     <a class="font32 font600">{{item.shopName}}</a>
                     <a class="font26" style="color:#8A8A8A;">地址：{{item.shopAddress}}</a>
                </span>
            </p>
            <i><img src="../../../../assets/images/rent/my/vipbj.png" alt=""></i>
        </li>
    </ul>
 
 </div>
</template>
<script>
  import Vue from 'vue';
  import fn from '@/assets/js/product'
  import qs from 'qs'


  export default {
    data() {
      return {
        mems:[]
      }

    },
    methods: {
      listUserCoupon() {
        var data = {userId: this.userId, token: this.getkey,type:2};

        this.xhr.post(`${this.subUrl.user}/userCoupon/listUserCoupon`, qs.stringify(data)).then((res) => {

          if (res.data.code == 1) {
            this.mems=res.data.data.list
            console.log(res)
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })
      }
    
    },
    computed:{
      
    },
    mounted() {
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.getkey = fn.getIng();
      this.userId = this.userInfo.guid;
      this.listUserCoupon();
    }
  }
</script>
<style scoped>
  .coupon{width:100%;padding:0.2rem 0.2rem;background:#E1F2F3;}
  .coupon ul{width:100%;}
  .coupon ul li{width:100%;background:white;border-radius:.12rem;display: flex;flex-flow:column;margin-bottom:.2rem;}
  .coupon ul li>p{width:100%;height:1rem;display: flex;flex-flow:row;padding:.1rem .2rem;}
  .coupon ul li>p>i{width:.8rem;height:.8rem;}
  .coupon ul li>p>i>img{width: 100%;height:100%;}
  .coupon ul li>p>span{display: flex;flex-flow: column;padding:0 .3rem;}
  .coupon ul li>p>span>a:nth-child(2){margin-top:.05rem}
  .coupon ul li>i{width: 100%;height:1.4rem;}
  .coupon ul li>i>img{width: 100%;height:100%;border-radius:0 0 .12rem .12rem;}
  
</style>

