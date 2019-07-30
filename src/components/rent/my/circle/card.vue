<template>
  <div class="item" @click="goTo(listItem.guid)">
    <div class="top">
      <div class="title">【{{listItem.typeName}}】{{listItem.title}}</div>
      <!-- <div class="date"><span>昨天</span><span>12:13</span></div> -->
      <div class="date">{{listItem.createDate|times}}</div>
    </div>
    <div class="center">{{listItem.content}}</div>
    <div class="bottom">
      <div>
        <img class="header" :src="listItem.headPortrait?listItem.headPortrait:'http://oysfye6yt.bkt.clouddn.com/FrL_s80s2v-QQCw30uvFfSGve1K8'"/>
        <span class="userName">{{listItem.nickname}}</span>
      </div>
      <div>
        <div class="watch">
          <img src="../../../../assets/images/rent/circle/eye_24.png" alt="">
          <span>{{listItem.commentNum?listItem.commentNum:0}}</span>
        </div>
        <div class="compenents">
          <img src="../../../../assets/images/rent/circle/eye_27.png" alt="">
          <span>{{listItem.viewNum?listItem.viewNum:0}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ["listItem", "keyIndex"],
    methods: {
      goTo(guid) {
        this.$router.push(`/my/circle/article/${guid}`)
      }
    },
    mounted() {

    }
  }
</script>
<style scoped>
  .item {
    background: #fff;
    padding: 0 .24rem;
  }

  .item .top {
    overflow: hidden;
    height: .7rem;
    line-height: .7rem
  }

  .item .top .title {
    width: 60%;
    color: #333;
    font-weight: 600;
    font-size: .32rem;
    float: left;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .item .top .date {
    float: right;
    text-align: right;
    width: 39%;
    font-size: .26rem;
    color: #aaa;
  }

  .item .center {
    width: 88%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: .6rem;
  }

  .item .bottom > div:nth-child(1) {
    float: left;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }

  .item .bottom > div:nth-child(2) {
    float: right;
    text-align: right;
    font-size: .26rem;
    color: #aaa;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    height: .62rem;
  }

  .item .bottom > div:nth-child(2) > div {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    margin-left: .2rem;
  }

  .item .bottom > div:nth-child(2) .watch img {
    width: .28rem;
    margin-right: .1rem;
  }

  .item .bottom > div:nth-child(2) .compenents img {
    width: .32rem;
    margin-right: .1rem;
  }

  .item .bottom .header {
    width: .62rem;
    height: .62rem;
    border-radius: 50%;
    border: 1px solid #ddd;
    margin-right: .2rem;

  }

  .item .bottom {
    padding-top: .2rem;
    padding-bottom: .2rem;
    overflow: hidden;
    border-bottom: 1px solid #ddd;
  }

  .item .bottom .userName {
    font-size: .28rem;
    line-height: .62rem;
  }
</style>
