<template>
  <yd-layout class="edit">
    <yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" v-title="'发评论'" title="发评论" :bgcolor="mainColor" color="#fff">
      <span slot="left" @click="cancel()" color="#fff;padding-right:.2rem" style="color: #fff;">取消</span>
      <span slot="right" @click="chooseSuccess()" color="#fff;padding-right:.2rem" style="color: #fff;">发送</span>
    </yd-navbar>
    <div>
      <!--<div style="width: 100%;height: 60%;background: #fff">-->
      <!--<textarea name="" id="" style="width: 100%;height: 100%;background: #fff" maxlength="300" cols="30" rows="10"></textarea>-->
      <!--</div>-->
      <!--<yd-cell-group>-->
      <!--<yd-cell-item>-->
        <!--<yd-textarea class="edit_comment" slot="right" placeholder="写评论" maxlength="300"></yd-textarea>-->
      <!--</yd-cell-item></yd-cell-group>-->
      <div class="write-complain" style="width: 100%;background: white;padding: 0.3em 0.5em">
        <textarea placeholder="写评论..." style="width: 100%;border: none" v-model="text" maxlength="300" name="" id="" cols="50" rows="20">
        </textarea>
        <div class="text-right">{{text.length}}/300</div>
      </div>
    </div>
    <div class="commonet_template">
      <div class="operate">
        <yd-button class="usetemplate" @click.native="userMoel" :style="{background:mainColor}" type="primary">使用模板</yd-button>
        <div class="padding"></div>
        <!-- <div class="image_emoj">
          <img src="../../../assets/images/rent/circle/emoj_03.png" @click="bindAdd()">
          <img src="../../../assets/images/rent/circle/emoj_05.png" @click="emoj()">
        </div> -->
      </div>
      <div class="choose_check" ref="tempEdit">
        <div>
          <yd-checkbox-group class="checkgroup" v-model="checkOptions">
            <div class="checkItem needsclick"  v-for="(item,key) in checkContent" :key="key">
              <yd-checkbox :val="item.text" shape="circle" class="font28">{{item.text}}</yd-checkbox>
              <!-- <yd-icon class="delete" name='delete1' color='#999' size='.4rem' custom @click.native='deleteTemp(key)'></yd-icon> -->
            </div>
          </yd-checkbox-group>
        </div>
      </div>
    </div>
  </yd-layout>
</template>
<script>
import Vue from "vue";
import { TextArea } from "vue-ydui/dist/lib.rem/textarea";
import { CheckBox, CheckBoxGroup } from "vue-ydui/dist/lib.rem/checkbox";
Vue.component(CheckBox.name, CheckBox);
Vue.component(CheckBoxGroup.name, CheckBoxGroup);
Vue.component(TextArea.name, TextArea);
import {
  Confirm,
  Alert,
  Toast,
  Notify,
  Loading
} from "vue-ydui/dist/lib.rem/dialog";
Vue.prototype.$dialog = {
  confirm: Confirm,
  alert: Alert,
  toast: Toast,
  notify: Notify,
  loading: Loading
};
export default {
  data() {
    var userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    var mainColor = this.$color[userInfo["organType"]];
    return {
      mainColor,
      userInfo,
      text: "",
      url: "#",
      checkOptions: [],
      checkContent: [
        {
          text: "谢谢",
          guid: 1
        },
        {
          text: "看着不错",
          guid: 2
        },
        {
          text: "还有其他的吗",
          guid: 3
        },
        {
          text: "我想了解更多的消息，有详细的参数说明吗",
          guid: 4
        },
        {
          text: "还有其它的吗",
          guid: 5
        },
        {
          text: "型号是什么",
          guid: 6
        }
      ]
    };
  },
  methods: {
    chooseSuccess() {
      if(this.text == ""){
        return  this.$dialog.toast({ mes: "请输入评论", timeout: 1000 });
      }
      this.$dialog.confirm({
        title: "",
        mes: "是否发送评论？",
        opts: () => {
          this.$ajax(`${this.subUrl.sc}/bbsComment/saveBbsComment`,{
            userId:this.userInfo.guid,
            token:this.$getkey(),
            replyUserId:this.$route.query.userId,
            bbsId:this.$route.query.id,
            bbsCommentId:0,
            comment:this.text,
          },res=>{
          this.$dialog.toast({ mes: "发送成功", timeout: 1000,icon:"success" });
          this.$router.go(-1);
          },this)
        }
      });
      // location.href = '#/index/1/0/2/rent/circle'
    },
    userMoel() {
      this.text = this.text + this.checkOptions.join(",");
      console.log(this.checkOptions);
      this.checkOptions = [];
    },
    cancel() {
      this.$router.go(-1);
    },
    bindAdd() {
      this.$dialog.alert({ mes: "点击了添加" });
    },
    emoj() {
      this.$dialog.alert({ mes: "点击了表情" });
    },
    // 删除当前模板
    deleteTemp(key) {
      this.$dialog.confirm({
        mes: "是否删除该条模板",
        opts: () => {
          this.checkContent.splice(key, 1);
          this.$dialog.toast({ mes: "删除成功", timeout: 1000 });
        }
      });
    }
  },
  mounted() {
    console.log(this.$route.query.id);
  }
};
</script>
<style scoped>
.usetemplate {
  width: 1.54rem;
  border-radius: 0;
  background: #0e89f1;
  height: 0.83rem;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}

.usetemplate.yd-btn-primary:active {
  background: #0e89f1;
}

.edit_comment {
  height: 8rem;
  width: 100%;
}

.image_emoj {
  display: flex;
  align-items: center;
  padding-right: 0.25rem;
}

.image_emoj img {
  width: 0.6rem;
  height: 0.6rem;
  margin-left: 0.2rem;
}

.operate {
  display: flex;
  background: #fff;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  height: 0.83rem;
}

.operate .padding {
  flex: 1;
}

.commonet_template {
  width: 100%;
  background: #fff;
  position: absolute;
  top: 8.88rem;
  bottom: 0;
}

.choose_check {
  position: absolute;
  width: 100%;
  top: 1rem;
  bottom: 0;
  overflow: auto;
  padding: 0 0.25rem;
  -webkit-overflow-scrolling: touch;
}

.choose_check .checkItem {
  width: 100%;
  /* height: .6rem; */
  display: flex;
  margin-bottom: 0.1rem;
}

.choose_check .checkItem label {
  flex: 1;
}

.delete {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  text-align: center;
  line-height: 0.6rem;
}
.write-complain {
  width: 100%;
  background: white;
  padding: 0.3em 0.5em;
}
.write-complain textarea {
  width: 100%;
  border: none;
}
.write-complain div {
  color: #999999;
}
</style>
