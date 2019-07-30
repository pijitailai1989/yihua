<template>
  <yd-layout>
       <yd-navbar class="header" slot="navbar" v-show="!userAgent.isWX" title="回复" color="#fff" :bgcolor="mainColor" height=".88rem">
         <div slot="left" @click="back">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
         </div>
      </yd-navbar>
      <div>
          <div class="flex-row h8 pdlr2 bgwhite" v-for="(item,index) in list" :key="index">
            <img class="chooseIcon" @click="chooseIndex(index,false)" v-if="item.selected"  src="../../../../../../assets/images/rent/estate/selected_active.png" alt="">
            <img class="chooseIcon" @click="chooseIndex(index,true)" v-else  src="../../../../../../assets/images/rent/estate/selected.png" alt="">
            <div class="flex1">{{item.content}}</div>
          </div>
          <div class="flex-row h8 bgwhite pdlr2">
              <yd-button type='hollow' @click.native='use'>使用</yd-button>
          </div>
          <yd-textarea placeholder='回复内容' maxlength='200' v-model="myCommet" class="border pdlr2 bgwhite" style="height:3rem;margin:.3rem" >

          </yd-textarea>
          <div class="flex-row h8 pdlr2">
              <yd-button type='hollow' @click.native="confirm">确定</yd-button>
          </div>
      </div>
  </yd-layout>
</template>
<script>
export default {
  data() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.mainColor = this.$color[this.userInfo.organType];
    return {
      list: [],
      myCommet: ""
    };
    currentIndex: -1;
  },
  methods: {
    chooseIndex(index, flag) {
      console.log(index, flag);
      for (var i in this.list) {
        if (i == index) {
          this.currentIndex = index;
          this.$set(this.list[i], "selected", true);
        } else {
          this.$set(this.list[i], "selected", false);
        }
      }
    },
    use() {
      console.log(this.list[this.currentIndex].content);
      this.myCommet = this.myCommet + this.list[this.currentIndex].content;
    },
    back() {
      this.$emit("operate");
    },
    confirm() {
      if (this.myCommet == "") {
        return this.$dialog.toast({ mes: "请输入评语!" });
      } else {
        this.$emit("operate", this.myCommet);
      }
    },
    getMessage() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid
      };
      this.$ajax(
        `${this.subUrl.user}/user/getFr`,
        data,
        res => {
          this.list = res.data;
        },
        this
      );
    }
  },
  mounted() {
    this.getMessage();
  }
};
</script>

