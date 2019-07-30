<template>
    <yd-layout>
        <yd-navbar title="缴费设置" slot='navbar' :bgcolor='mainColor' height='.88rem' color='#fff'>
            <span slot="left" @click='$router.go(-1)'>
                <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
            </span>
        </yd-navbar>
        <div class="bgwhite jiaofei">
            <div class="flex-row h7">
                <span class="label">收款人</span>
                <input class="myInput flex1" v-model="obj.payee" type="text">
            </div>
            <div class="flex-row h7">
                <span class="label">账号</span>
                <input class="myInput flex1" type='number' v-model="obj.payeeAccount">
            </div>
            <div class="flex-row h7">
                <span class="label">开户行</span>
                <input class="myInput flex1" type='text' v-model="obj.payeeAccountBank">
            </div>
        </div>
        <div class="flex-row center jusCenter h8 radius" @click="changeInfo" :style="{margin:'1rem .5rem 1rem',background:mainColor,color:'#fff'}">保存</div>
    </yd-layout>
</template>
<script>
    export default {
        data() {
            this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem("userInfo")))
            this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem("organInfo")))
            return {
                mainColor: this.$color[this.userInfo.organType],
                obj: {
                    ppa_id: "",
                    payee: "",
                    payeeAccount: "",
                    payeeAccountBank: "",
                },
              isChange:false,
            }
        },
        methods: {
            changeInfo() {
              if(this.isChange){
                var obj = this.obj;
                if (obj.payee == "") {
                  return this.$dialog.toast({ mes: "请输入收款人" })
                } else if (obj.payeeAccount == "") {
                  return this.$dialog.toast({ mes: "请输入账号" })
                } else if (obj.payeeAccountBank == "") {
                  return this.$dialog.toast({ mes: "请输入开户行" })
                }
                this.$dialog.confirm({
                  title: '',
                  mes: '是否保存修改',
                  opts: () => {
                    this.changeBankInfo();
                  }
                });
              }else{
                this.addCard();
              }

            },
            getUserInfo() {
                var data = {
                    token: this.$getkey(),
                    orgId: this.organInfo.guid,
                }
                this.$ajax(`${this.subUrl.activity}/payAccount/detail`, data, res => {
                    console.log(res);
                    if(res.data){
                      this.obj = res.data;
                      this.isChange = true;
                    }
                }, this)
            },
            changeBankInfo() {
                this.obj.token = this.$getkey();
                this.obj.ppa_id = this.obj.guid;
                this.$ajax(`${this.subUrl.activity}/payAccount/editPayAccount`, this.obj, res => {
                    return this.$dialog.toast({ mes: "修改成功" })
                }, this)
            },
            addCard() {
                console.log(this.userInfo)
                var data = {
                    token: this.$getkey(),
                    orgId: this.organInfo.guid,
                }
                data = Object.assign({}, data, this.obj)
                console.log(data);
                this.$ajax(`${this.subUrl.activity}/payAccount/addPayAccount`, data, res => {
                    this.$dialog.toast({ mes: res.msg, 'icon': 'success', timeout: 1500 })
                }, this)
            },
        }, mounted() {
            this.getUserInfo();
        }
    }
</script>
