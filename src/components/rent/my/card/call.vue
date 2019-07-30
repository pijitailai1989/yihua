<template>

 <div class="coupon" v-title="'名片'">
    <ul>
        <li v-for="(item,index) in calls" style="clear:both;" :key="index">
            <p><img :src="item.logoUrl" alt=""></p>
            <h3 class="font30">{{item.shopName}}</h3>
            <h3 class="font30 font500 imgs" style="color:#747474;"><img src="../../../../assets/images/rent/my/iphone.png" alt="">{{item.servicePhone}}</h3>
            <span class="font24 imgs"><img src="../../../../assets/images/rent/my/ress.png" alt="">{{item.shopAddress}}</span>
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
        calls:[]
      }

    },
    methods: {
      listUserCoupon() {
        var data = {userId: this.userId, token: this.getkey,type:3};

        this.xhr.post(`${this.subUrl.user}/userCoupon/listUserCoupon`, qs.stringify(data)).then((res) => {

          if (res.data.code == 1) {
            res.data.data.list.forEach(item => {
              if(item.shopAddress==null){
              item.shopAddress='暂无'
              }
              if(item.servicePhone==null){
               item.servicePhone='暂无'
               }
            });
            
            

            this.calls=res.data.data.list

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
  .coupon ul li{width:100%;height:2rem;background:white;margin-bottom:.2rem;border-radius:.12rem;}
  .coupon p{width:2rem;height:2rem;float:left;padding:.2rem;}
  .coupon p img{width:100%;height:100%;}
  .coupon h3{width:100%;height:.7rem;padding:0 .3rem;line-height:.7rem;}
  .coupon span{display:block;width:100%;height:.6rem;
  padding:0 .3rem;line-height:.6rem;color:#A5A5A5;}
 
  .imgs>img{width:.26rem;height:.26rem;margin-right:.1rem;}
</style>

