<template>
  <yd-layout class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'消息设置'" title="消息设置" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span class="spanLeft" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
        
      </yd-navbar>
    </div>

   <div class="setLatest">
       <span>提醒设置</span>
       <yd-cell-group>
          <yd-cell-item type="label">
            <div slot="left">物业消息</div>
            <span class="right" slot="right">
            <p>{{pm.enabledPropertyNews?'开启':'关闭'}}</p>
            <yd-switch :color="mainColor" v-model="pm.enabledPropertyNews"></yd-switch>
            </span>
          </yd-cell-item>
          <yd-cell-item type="label">
            <div slot="left">电商消息</div>
            <span class="right" slot="right">
            <p>{{pm.enabledEBNews?'开启':'关闭'}}</p>
            <yd-switch :color="mainColor" v-model="pm.enabledEBNews"></yd-switch>
            </span>
          </yd-cell-item>
          <yd-cell-item type="label">
            <div slot="left">圈子消息</div>
            <span class="right" slot="right">
            <p>{{pm.enabledCircleNews?'开启':'关闭'}}</p>
            <yd-switch :color="mainColor" v-model="pm.enabledCircleNews"></yd-switch>
            </span>
          </yd-cell-item>
          <yd-cell-item type="label">
            <div slot="left">平台消息</div>
            <span class="right" slot="right">
            <p>{{pm.enabledTerraceNews?'开启':'关闭'}}</p>
            <yd-switch :color="mainColor" v-model="pm.enabledTerraceNews"></yd-switch>
            </span>
          </yd-cell-item>
          <yd-cell-item type="label">
            <div slot="left">推送消息</div>
            <span class="right" slot="right">
            <p>{{pm.enabledPushNews?'开启':'关闭'}}</p>
            <yd-switch :color="mainColor" v-model="pm.enabledPushNews"></yd-switch>
            </span>
          </yd-cell-item>
       </yd-cell-group>
       <yd-button-group>
          <yd-button @click.native="settingCommMessage" action-type="submit" size="large" type="primary" :bgcolor="mainColor" color="#fff">
              确 定</yd-button>
       </yd-button-group>

   </div>
  </yd-layout>
</template>
<script>
  import Vue from 'vue';
  import fn from '@/assets/js/product'
  import qs from 'qs'
  import store from '@/store'
  import {CellGroup, CellItem} from 'vue-ydui/dist/lib.rem/cell';
  Vue.component(CellGroup.name, CellGroup);
  Vue.component(CellItem.name, CellItem);
  import {Switch} from 'vue-ydui/dist/lib.rem/switch';
  Vue.component(Switch.name, Switch);
  import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog';
  Vue.prototype.$dialog = {
    confirm: Confirm,
    alert: Alert,
    toast: Toast,
    notify: Notify,
    loading: Loading,
  };

  export default {
    data() {
      return {
        mainColor: "",
        detail:'',
        pm:{
          userId:'',
          getkey:'',
          enabledPropertyNews:false,
          enabledEBNews:false,
          enabledCircleNews:false,
          enabledTerraceNews:false,
          enabledPushNews:false
        },
        
      }
    },
    methods: {
      turnTo(url) {
        this.$router.push(url)
      },
      back(){
          history.back()
      },

      settingCommMessage(){
        
        var data = {
          userId: this.pm.userId,
          token:this.pm.getkey,
          enabledPropertyNews:this.pm.enabledPropertyNews?1:0,
          enabledEBNews:this.pm.enabledEBNews?1:0,
          enabledCircleNews:this.pm.enabledCircleNews?1:0,
          enabledTerraceNews:this.pm.enabledTerraceNews?1:0,
          enabledPushNews:this.pm.enabledPushNews?1:0
          };

        this.xhr.post(`${this.subUrl.user}/commMessage/settingCommMessage`, qs.stringify(data)).then((res) => {
            console.log(res)
          if (res.data.code == 1) {
             this.$dialog.toast({
                    mes: '设置成功！',
                    icon: 'success'
                });
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({mes: res.data.msg});
          }
        })

      },
      getSetting(){
        var data = {
          userId: this.pm.userId,
          token:this.pm.getkey,
          };
        this.xhr.post(`${this.subUrl.user}/commMessage/getSetting`, qs.stringify(data)).then((res) => {
            console.log(res)
          if (res.data.code == 1) {
               if(res.data.data!=null){
                   this.pm.enabledPropertyNews=res.data.data.enabledPropertyNews?true:false;
                   this.pm.enabledEBNews=res.data.data.enabledEBNews?true:false;
                   this.pm.enabledCircleNews=res.data.data.enabledCircleNews?true:false;
                   this.pm.enabledTerraceNews=res.data.data.enabledTerraceNews?true:false;
                   this.pm.enabledPushNews=res.data.data.enabledPushNews?true:false;
               }
            
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
      this.pm.userId = this.userInfo.guid;
      this.pm.getkey = fn.getIng();
      this.getSetting();
     
    }
  }
</script>
<style scoped>
  .layout_my .header:after {
    display: none;

  }
  .layout_my{
background:#F7F7F9;
  }

  .layout_my .blue_box {
    height: 0.88rem;
    background: #0093D2;
    background-size: 100% 100%;
  }
  .setLatest{width:100%;}
  .setLatest>span{display: flex;width:100%;height:.6rem;line-height:.6rem;padding:0 .3rem;
  color:#999;font-size:.28rem;}
  .right{display: flex;align-items:center;}
  .right>p{margin-right:.1rem;font-size: .26rem;color:#999;}
</style>
