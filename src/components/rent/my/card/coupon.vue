<template>

 <div class="coupon" v-title="'优惠卷'">
    <ul>
        <li v-for="(item,index) in coupons" :key="index" @click="turnTo(index)">
            <p><img :src="item.logoUrl" alt=""></p>
            <h3 class="font28">{{item.shopName}}&nbsp;{{item.slogan}}</h3>
            <h1 :class="{even:index%2==0,odd:index%2!=0}">{{item.expandTitle}}</h1>
            <span class="font24">使用期限：{{item.startDate}} 至 {{item.endDate}}</span>
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
        coupons:[]
      }

    },
    methods: {
      turnTo(index){
        this.$router.push({
          name:'coupon_details',
          query:{
            guid:this.coupons[index].guid,
          }
        })
      },
      listUserCoupon() {
        var data = {userId: this.userId, token: this.getkey,type:1};

        this.xhr.post(`${this.subUrl.user}/userCoupon/listUserCoupon`, qs.stringify(data)).then((res) => {

          if (res.data.code == 1) {
            res.data.data.list.forEach(item => {
              item.startDate=item.startDate.split(' ')[0]
              item.endDate=item.endDate.split(' ')[0]
            });
            console.log(res.data.data.list)
            this.coupons=res.data.data.list;
 
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
  .coupon ul li{width:100%;height:2.3rem;background:url('../../../../assets/images/rent/my/coupon_bottom.png') no-repeat left top;
  background-size:100% 100%;margin-bottom:.2rem;border-radius:.15rem;}
  .coupon p{width:1.7rem;height:1.7rem;float:left;padding:.2rem;}
  .coupon p img{width:100%;height:100%;}
  .coupon h3{width:5.1rem;height:.9rem;line-height:.9rem;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}
  .coupon h1{width:5.1rem;height:.9rem;padding:0 .3rem;line-height:.5rem;font-size:.4rem}
  .coupon span{display:inline-block;width:100%;height:.5rem;
  padding:0 .3rem;line-height:.5rem;color:#A5A5A5;}
  .even{color:#FC8232;}
  .odd{color:#FD3238;}
</style>
