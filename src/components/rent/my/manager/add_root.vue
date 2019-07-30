<template>
  <yd-layout class="layout_my">
      <yd-navbar class="header" slot="navbar" v-show="!userAgent.isWX" v-title="'分配权限'" title="分配权限" color="#fff" :bgcolor="mainColor" height=".88rem">
        <router-link :to="'/my/manager/job_manager/add?jobName='+jobName+'&guid='+guid" slot="left">
          <!--url[url.length-1]-->
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </router-link>
        <div slot="right" class="edit" style="color: #fff;">
          <a @click="goAddJob">
            确定
          </a>
        </div>
      </yd-navbar>
      <div class="add_top edit_code">
        <div class="list-left">全部权限</div>
        <img v-if="!isGiveAllRoot" class="m-right l-right" src="../../../../assets/images/rent/my/root-have.png"
             @click="giveAllRoot">
        <img v-if="isGiveAllRoot||isGiveAllRoot" class="m-right l-right"
             src="../../../../assets/images/rent/my/root-haved.png" @click="giveAllRoot">
      </div>
      <ul class="oul" v-for="(it,index1) in passW" :key="index1" v-if="it.depth*1==1&&it.depth*1==1">
        <li v-bind:class="!it.hasChild?'child-bottom':''">
          <img v-if="it.hasChild" v-bind:class="it.isShowList?'l-left l-click':'l-left'"
               src="../../../../assets/images/rent/my/root-list.png" alt="" @click="showThisList(index1)">
          <img class="l-left-child " v-if="!it.hasChild" v-bind:class="it.isShowList?'l-click':''"
               src="../../../../assets/images/rent/my/root-list-child.png" alt="">
          <span class="l-center">{{it.name}}</span>
          <img v-if="!it.isSelected" class="m-right l-right"
               src="../../../../assets/images/rent/my/root-have.png" @click="giveThisRoot(index1)">
          <img v-if="it.isSelected" class="m-right l-right" src="../../../../assets/images/rent/my/root-haved.png"
               @click="giveThisRoot(index1)">
        </li>
        <ul v-for="(item,index2) in passW" :key="index2" style="background: #ffffff;padding-left: 1em"
            v-if="item.depth*1==2&&it.hasChild&&item.depth*1==2&&it.guid==item.pid">
          <li v-show="it.isShowList" v-bind:class="!item.hasChild?'child-bottom':''">
            <img v-if="item.hasChild" v-bind:class="item.isShowList?'l-left l-click':'l-left'"
                 src="../../../../assets/images/rent/my/root-list.png" alt="" @click="showThisList(index2)">
            <img class="l-left-child " v-if="!item.hasChild" v-bind:class="item.isShowList?'l-click':''"
                 src="../../../../assets/images/rent/my/root-list-child.png" alt="">
            <span class="l-center">{{item.name}}</span>
            <img v-if="!item.isSelected" class="m-right l-right"
                 src="../../../../assets/images/rent/my/root-have.png" @click="giveThisRoot(index2)">
            <img v-if="item.isSelected" class="m-right l-right"
                 src="../../../../assets/images/rent/my/root-haved.png" @click="giveThisRoot(index2)">
          </li>
          <ul v-for="(item3,index3) in passW" :key="index3" style="background: #ffffff;padding-left: 2em"
              v-if="item3.depth*1==3&&item.hasChild&&item3.depth*1==3&&item3.pid==item.guid">
            <li v-show="item.isShowList" v-bind:class="!item3.hasChild?'child-bottom':''">
              <img v-if="item3.hasChild" v-bind:class="item3.isShowList?'l-left l-click':'l-left'"
                   src="../../../../assets/images/rent/my/root-list.png" alt="" @click="showThisList(index3)">
              <img class="l-left-child " v-if="!item3.hasChild" v-bind:class="item.isShowList?'l-click':''"
                   src="../../../../assets/images/rent/my/root-list-child.png" alt="">
              <span class="l-center">{{item3.name}}</span>
              <img v-if="!item3.isSelected" class="m-right l-right"
                   src="../../../../assets/images/rent/my/root-have.png"
                   @click="giveThisRoot(index3)">
              <img v-if="item3.isSelected" class="m-right l-right"
                   src="../../../../assets/images/rent/my/root-haved.png" @click="giveThisRoot(index3)">
            </li>
            <ul v-for="(item4,index4) in passW" :key="index4" style="background: #ffffff;padding-left: 3em"
                v-if="item4.depth*1==4&&item.hasChild">
              <li
                v-if="item4.depth*1==3&&item4.pid==item3.guid"
                v-show="item.isShowList" v-bind:class="!item3.hasChild?'child-bottom':''">
                <img v-if="item4.hasChild" v-bind:class="item4.isShowList?'l-left l-click':'l-left'"
                     src="../../../../assets/images/rent/my/root-list.png" alt="" @click="showThisList(index4)">
                <img class="l-left-child " v-if="!item4.hasChild" v-bind:class="item.isShowList?'l-click':''"
                     src="../../../../assets/images/rent/my/root-list-child.png" alt="">
                <span class="l-center">{{item4.name}}</span>
                <img v-if="!item4.isSelected" class="m-right l-right"
                     src="../../../../assets/images/rent/my/root-have.png"
                     @click="giveThisRoot(index4)">
                <img v-if="item4.isSelected" class="m-right l-right"
                     src="../../../../assets/images/rent/my/root-haved.png" @click="giveThisRoot(index4)">
              </li>
            </ul>
          </ul>
        </ul>
      </ul>
      <div class="clear-last-line"></div>
  </yd-layout>
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
        jobName: '',
        guid: '',
        passW: [],
        url: this.fromRoute ? this.fromRoute : '',
        userInfo: "",
        mainColor: "",
        invide_code: "",
        isGiveAllRoot: false,
        showRootChild: '',
        num: 0,
        ids: [],
        rootList: [],
        allRootList: [],
        havedRoot: [],
      }
    },
    methods: {
      removeByValue(arr, val) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] == val) {
            arr.splice(i, 1);
            break;
          }
        }
      },
      clearListShow(index, depth) {
        for (var i = 0; i < this.passW.length; i++) {
          if (this.passW[i].isShowList && this.passW[i].depth * 1 == depth+1 && this.passW[i].pid == this.passW[index].guid) {
            this.passW[i].isShowList = false;
            if(this.passW[i].depth * 1<this.num){
              this.clearListShow(i,this.passW[i].depth*1)
            }
          }
        }
        this.updateArr()
      },
      showThisList(index) {
        if (this.passW[index].isShowList) {
          this.passW[index].isShowList = false;
          if (this.passW[index].depth * 1 < this.num && !this.passW[index].isShowList) {
            this.clearListShow(index, this.passW[index].depth * 1);
          }
        } else {
          this.passW[index].isShowList = true;
        }
        this.updateArr()
      },
      updateArr() {
        var arr = this.passW;
        this.passW = [];
        this.passW = arr;
      },
      giveAllRoot() {
        if (this.isGiveAllRoot) {
          this.isGiveAllRoot = false;
          for (var i = 0; i < this.passW.length; i++) {
            this.passW[i].isSelected = false
          }
        } else {
          this.isGiveAllRoot = true;
          for (var i = 0; i < this.passW.length; i++) {
            this.passW[i].isSelected = true
          }
        }
        this.updateArr();
      },
      keepListClear(guid) {
        var isHave = false;
        for (var i = 0; i < this.rootList.length; i++) {
          if (guid == this.rootList[i]) {
            isHave = true;
          }
        }
        if (!isHave) {
          this.rootList.push(guid);
        }
      },
      selectedAllChild(index) {
        for (var i = 0; i < this.passW.length; i++) {
          if (this.passW[i].depth==this.passW[index].depth+1&&this.passW[i].pid==this.passW[index].guid) {
            this.passW[i].isSelected = true;
            if(this.passW[i].hasChild){
              this.selectedAllChild(i);
            }
          }
          //  if(this.passW[i].hasChild){
          //    this.selectedAllChild(i)
          //  }
        }
      },
      isAllCancel(index) {
        var flag = true;
        for (var i = 0; i < this.passW.length; i++) {
          if (this.passW[i].isSelected && this.passW[i].depth * 1 == this.passW[index].depth * 1 && this.passW[i].pid == this.passW[index].pid) {
            flag = false;
          }
        }
        if (flag) {
          for (var j = 0; j < this.passW.length; j++) {
            if (this.passW[j].depth * 1 == this.passW[index].depth * 1 - 1 && this.passW[j].guid == this.passW[index].pid) {
              this.passW[j].isSelected = false;
              if (this.passW[j].depth * 1 > 1) {
                this.isAllCancel(j)
              }
            }
          }
        }
        this.updateArr;
      },
      isAllSubmit(index) {
        for (var j = 0; j < this.passW.length; j++) {
          if (this.passW[j].depth * 1 == this.passW[index].depth * 1 - 1 && this.passW[j].guid == this.passW[index].pid) {
            this.passW[j].isSelected = true;
            if (this.passW[j].depth * 1 > 1) {
              this.isAllSubmit(j);
            }
          }
        }
        this.updateArr;
      },
      checkAll(index) {
        for (var i = index+1; i < this.passW.length; i++) {
          if (this.passW[i].depth * 1 == this.passW[index].depth * 1+1 &&
            this.passW[index].guid == this.passW[i].pid) {
            this.passW[i].isSelected = false;
            if(this.passW[i].hasChild){
              this.checkAll(i)
            }
            if (this.passW[i].depth * 1 > 1) {
              this.isAllCancel(i)
            }
          }
        }
        this.updateArr;
      },
      isOrAllSelected() {
        var flag = true;
        for (var i = 0; i < this.passW.length; i++) {
          if (!this.passW[i].isSelected) {
            flag = false;
          }
        }
        if (flag) {
          this.isGiveAllRoot = true;
        }
        this.updateArr;
      },
      giveThisRoot(index) {
        if (this.passW[index].isSelected) {
          this.passW[index].isSelected = false;
          if (this.passW[index].hasChild) {
            this.checkAll(index)
          }
          this.isGiveAllRoot = false;
          if (this.passW[index].depth * 1 > 1) {
            this.isAllCancel(index)
          }
        } else {
          this.passW[index].isSelected = true;
          if (this.passW[index].hasChild) {
            this.selectedAllChild(index)
          }
          if (this.passW[index].depth * 1 > 1) {
            this.isAllSubmit(index);
          }
          this.isOrAllSelected();
        }
        this.updateArr();
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
      toTree(data) {
        var getpassw = data;
        // this.rootArr=this.passW;
        // var num=this.num
        for (var i = 0; i < getpassw.length; i++) {
          var leg = getpassw[i].depth;
          if (leg > this.num) {
            this.num = leg;
          }
        }
        var num = this.num;
//        for (var j = 0; j < num; j++) {
//          var arr = [];
//          for (var i = 0; i < getpassw.length; i++) {
//            var leg = getpassw[i].functionUrl.split('/').length;
//            if (leg == j + 2) {
//              arr.push(getpassw[i])
//            }
//          }
//          this.allRootList.push(arr)
//        }
      },
      getIsHaveChild(data) {
        return data.functionUrl.split('/')
      },
      isHaveChild() {
        for (var i = 1; i <= this.num - 1; i++) {
          for (var j = 0; j < this.passW.length; j++) {
            for (var k = 0; k < this.passW.length; k++) {
              if (this.passW[j].depth * 1 == i && this.passW[k].depth * 1 == i + 1 && this.passW[j].guid == this.passW[k].pid) {
                  this.passW[j].hasChild = true;
                  this.passW[i].isShowList = false;
              }
            }
          }
        }
      },
      getThisJobRoot() {
        var data = {postId: this.guid, token: this.getkey};
        this.xhr.post(`${this.subUrl.user}/admin/postManage/allocate?token=` + this.getkey + '&postId=' + this.guid).then((res) => {
          if (res.data.code == 1) {
            this.havedRoot = res.data.data;
//            this.isOrAllSelected();
          } else {
            // this.$dialog.toast({mes: res.data.msg});
          }
        })
        // this.$router.push({path:'/my/manager/job_manager'})
      },
      getRootInfo(cb) {
        var data = {organId: this.organInfo.guid, token: this.getkey, pageNo: 1, pageSeze: 15};
        this.xhr.post(`${this.subUrl.user}/admin/postManage/permissionNodes?organType=` + this.organInfo.organType).then((res) => {
          if (res.data.code == 1) {
            this.passW = res.data.data;
            for (var i = 0; i < this.passW.length; i++) {
              this.passW[i].isSelected = false;
              for (var j = 0; j < this.havedRoot.length; j++) {
                if (this.passW[i].guid == this.havedRoot[j].functionId) {
                  this.passW[i].isSelected = true;
                }
              }
              this.passW[i].hasChild = false;
            }
            this.isOrAllSelected();
            if (this.ids && this.ids.length > 0) {
              for (var i = 0; i < this.passW.length; i++) {
                this.passW[i].isSelected = false;
                for (var j = 0; j < this.ids.split(',').length; j++) {
                  if (this.passW[i].guid * 1 == this.ids.split(',')[j] * 1) {
                    this.passW[i].isSelected = true;
                  }
                }
                this.passW[i].hasChild = false;
              }
            }
            this.toTree(this.passW)
            this.isHaveChild();
            cb && cb();
          } else if (res.data.code == '-902') {//-902
            /*重新登录*/
            // fn.re_login(this);
          } else {
            // this.$dialog.toast({mes: res.data.msg});
          }
        })
      },
      goAddJob() {
        var arr = [];
        for (var i = 0; i < this.passW.length; i++) {
          if (this.passW[i].isSelected) {
            arr.push(this.passW[i].guid)
          }
        }
        this.$router.push({path: '/my/manager/job_manager/add?jobName=' + this.jobName + '&guid=' + this.guid + '&ids=' + arr})
      }

    },
    mounted() {
      var num = 0;
      if (this.$route.query.jobName) {
        this.jobName = this.$route.query.jobName
      }
      ;
      if (this.$route.query.guid) {
        this.guid = this.$route.query.guid
        console.log(this.guid)
      }
      if (this.$route.query.ids) {
        this.ids = this.$route.query.ids;
      }
      // console.log(this.$route.query.rootList)
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      this.mainColor = localStorage.getItem('mainColor');
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      if (this.$route.query.guid) {
        this.getThisJobRoot();
      }
      this.userId = this.userInfo.guid;
      var that = this;
      this.getUserInfo(function () {
        that.getRootInfo();
      });
    }
  }
</script>
<style scoped>
  .top_title {
    width: 100%;
    line-height: 0.8rem;
    font-size: 0.18rem;
    padding: 0 0.3rem;
  }

  .clear-last-line {
    width: 100%;
    height: 2px;
    margin-top: -2px;
    background: white;
    position: relative;
  }

  .layout_my {
    overflow-y: auto;
    background: #f7f7f9;
  }

  .layout_my .header:after {
    display: none;

  }

  .oul {
    overflow-y: auto;
    overflow-x: hidden;
  }

  .edit img {
    width: 1em
  }

  .add_top {
    width: 100%;
    line-height: 0.9rem;
    background: #ffffff
  }

  .add_top input {
    line-height: 2.3em;
    width: 100%;
  }

  .add_input {
    padding: 0 .1rem;
    outline: none;
    background: none;
    border: none;
  }

  .edit_content {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    margin: 0 .2rem;
    border-radius: .1rem;
    background: #ebf3f3;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    line-height: 2.3em;
    text-align: center;
  }

  .edit_code {
    margin-top: 1em;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-flow: row nowrap;
    flex-flow: row nowrap;
    height: 1rem;
    padding: .15rem 1em;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    background: #fff;
  }

  .m-right {
    width: .32rem;
  }

  .l-right {
    height: 0.4rem;
    width: 0.7rem;
    right: 0.5rem;
    position: absolute;
  }

  .l-left {
    height: 0.3rem;
    width: 0.3rem;
    transform: rotate(-90deg);
    -ms-transform: rotate(-90deg); /* IE 9 */
    -moz-transform: rotate(-90deg); /* Firefox */
    -webkit-transform: rotate(-90deg); /* Safari 和 Chrome */
    -o-transform: rotate(-90deg);
    -webkit-transition: 0.2s ease-in;
    transition: 0.2s ease-in;
  }

  .l-left-child {
    height: 0.3rem;
    width: 0.3rem;
  }

  .l-click {
    transform: rotate(0deg);
    -ms-transform: rotate(0deg); /* IE 9 */
    -moz-transform: rotate(0deg); /* Firefox */
    -webkit-transform: rotate(0deg); /* Safari 和 Chrome */
    -o-transform: rotate(0deg);
  }

  .newMessage {
    margin-right: 2.3em;
    flex: 1;
    color: #cccccc;
    text-align: right;
  }

  .yd-flexview {
    height: 100%;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    margin: 0 auto;
    max-width: 750px;
    min-width: 300px;
  }

  .list-left {
    flex: 1
  }

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

  .child-bottom {
    border-bottom: 1px;
  }

  .child-bottom:before {
    content: '';
    position: absolute;
    right: -91%;
    bottom: -1%;
    width: 178%;
    /* height: 200%; */
    border-bottom: 2px solid #F0F0F0;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scale(0.5, 0.5);
    transform: scale(0.5, 0.5);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .selected_footer {
    position: fixed;
    width: 100%;
    bottom: 0;
  }

  .edit img {
    width: 1em
  }

  .l-center {
    margin: 0 0.3rem;
  }
</style>
