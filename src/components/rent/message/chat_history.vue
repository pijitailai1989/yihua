<template>
  <!--<div class="template" v-title="'企信'">-->
  <yd-layout class="edit" style="background: #f9fcff">
    <yd-navbar height=".88rem" v-show="!userAgent.isWX" :title="title" bgcolor="#0093d2" color="#fff">
      <span slot="left" @click="back" color="#fff;padding-right:.2rem" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
      <span slot="right" @click="chooseSuccess()" v-if="teamId&&teamId!=''&&!isHistory" color="#fff;padding-right:.2rem"
            style="color: #fff;">
        <yd-icon color="#fff;margin-top:-1em" name="search"></yd-icon>
        详情
      </span>
      <span slot="right" @click="toHistory()" v-if="type.split('-')[0]=='p2p'&&!isHistory" color="#fff;padding-right:.2rem"
            style="color: #fff;">
        <yd-icon color="#fff;margin-top:-1em" name="search"></yd-icon>
        历史记录
      </span>
    </yd-navbar>
    <div class="chatItem" v-if="data.msgs&&data.msgs!=''&&!isHistory">
      <div class="chat-msg text-left" v-for="item,index in data.msgs[type]">
        <div v-if="item.type=='text'" style="width: 100%;float: left;margin: 0.5em">
          <img class="chat-msg-img" v-bind:class="item.from*1!=data.myInfo.account*1?'pull-left':'pull-right'"
               v-bind:style="item.from*1!=data.myInfo.account*1?'':'margin-left:0.5em'"
               :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">
          <div v-if="item.from*1!=data.myInfo.account*1&&type.split('-')[0]!='p2p'" style="margin-bottom: -1.5em">
            {{item.fromNick}}
          </div>
          <span v-bind:class="item.from*1!=data.myInfo.account*1?'pull-left':'pull-right'"
                v-bind:style="item.from*1!=data.myInfo.account*1?'background-color: #5cacde;color: #fff;'
              :'color: #666;background-color: #e5f4ff;'" v-emoji>{{item.text}}</span>
        </div>
        <div v-if="item.type=='image'&&data" style="width: 100%;float: left;margin: 0.5em">
          <img class="chat-msg-img pull-left" v-if="item.from*1!=data.myInfo.account*1"
               :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">
          <div v-if="item.from*1!=data.myInfo.account*1&&type.split('-')[0]!='p2p'" style="margin-bottom: -1.5em">
            {{item.fromNick}}
          </div>
          <a :href="item.file.url">
            <img class="recieve-img pull-left" v-if="item.from*1!=data.myInfo.account*1" :src="item.file.url" alt="321">
          </a>
          <img class="chat-msg-img pull-right" style="margin-left:0.5em" v-if="item.from*1==data.myInfo.account*1"
               :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">
          <a :href="item.file.url" download="">
            <img class="recieve-img pull-right" v-if="item.from*1==data.myInfo.account*1" :src="item.file.url"
                 alt="321">
          </a>
        </div>
        <div v-if="item.type=='file'&&data" style="width: 100%;float: left;margin: 0.5em">
          <img class="chat-msg-img pull-left" v-if="item.from*1!=data.myInfo.account*1"
               :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">
          <span v-if="item.from*1!=data.myInfo.account*1"
                v-bind:class="item.from*1!=data.myInfo.account*1?'pull-left':'pull-right'"
                v-bind:style="item.from*1!=data.myInfo.account*1?'background-color: #5cacde;color: #fff;'
              :'color: #666;background-color: #e5f4ff;'" v-emoji>
          <a class="pull-left" :href="item.file.url">{{item.file.name}}<br>
            <div class="text-center" style="width: 100%">点击下载</div></a></span>

          <img class="chat-msg-img pull-right" style="margin-left:0.5em" v-if="item.from*1==data.myInfo.account*1"
               :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">

          <span v-if="item.from*1==data.myInfo.account*1"
                v-bind:class="item.from*1!=data.myInfo.account*1?'pull-left':'pull-right'"
                v-bind:style="item.from*1!=data.myInfo.account*1?'background-color: #5cacde;color: #fff;'
              :'color: #666;background-color: #e5f4ff;'" v-emoji><a class="pull-right" :href="item.file.url">
               {{item.file.name}}<br><div class="text-center" style="width: 100%">点击下载</div></a></span>
        </div>
      </div>
    </div>
    <div class="chatItem" v-if="historyList&&historyList!=''&&isHistory">
      <div class="chat-msg text-left" v-for="item,index in historyList">
        <div v-if="item.type=='text'" style="width: 100%;float: left;margin: 0.5em">
          <img class="chat-msg-img" v-bind:class="item.from*1!=data.myInfo.account*1?'pull-left':'pull-right'"
               v-bind:style="item.from*1!=data.myInfo.account*1?'':'margin-left:0.5em'"
               :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">
          <div v-if="item.from*1!=data.myInfo.account*1&&type.split('-')[0]!='p2p'" style="margin-bottom: -1.5em">
            {{item.fromNick}}
          </div>
          <span v-bind:class="item.from*1!=data.myInfo.account*1?'pull-left':'pull-right'"
                v-bind:style="item.from*1!=data.myInfo.account*1?'background-color: #5cacde;color: #fff;'
              :'color: #666;background-color: #e5f4ff;'" v-emoji>{{item.text}}</span>
        </div>
        <div v-if="item.type=='image'&&data" style="width: 100%;float: left;margin: 0.5em">
          <img class="chat-msg-img pull-left" v-if="item.from*1!=data.myInfo.account*1"
               :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">
          <div v-if="item.from*1!=data.myInfo.account*1&&type.split('-')[0]!='p2p'" style="margin-bottom: -1.5em">
            {{item.fromNick}}
          </div>
          <a :href="item.file.url">
            <img class="recieve-img pull-left" v-if="item.from*1!=data.myInfo.account*1" :src="item.file.url" alt="321">
          </a>
          <img class="chat-msg-img pull-right" style="margin-left:0.5em" v-if="item.from*1==data.myInfo.account*1"
               :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">
          <a :href="item.file.url" download="">
            <img class="recieve-img pull-right" v-if="item.from*1==data.myInfo.account*1" :src="item.file.url"
                 alt="321">
          </a>
        </div>
        <div v-if="item.type=='file'&&data" style="width: 100%;float: left;margin: 0.5em">
          <img class="chat-msg-img pull-left" v-if="item.from*1!=data.myInfo.account*1"
               :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">
          <span v-if="item.from*1!=data.myInfo.account*1"
                v-bind:class="item.from*1!=data.myInfo.account*1?'pull-left':'pull-right'"
                v-bind:style="item.from*1!=data.myInfo.account*1?'background-color: #5cacde;color: #fff;'
              :'color: #666;background-color: #e5f4ff;'" v-emoji>
          <a class="pull-left" :href="item.file.url">{{item.file.name}}<br>
            <div class="text-center" style="width: 100%">点击下载</div></a></span>

          <img class="chat-msg-img pull-right" style="margin-left:0.5em" v-if="item.from*1==data.myInfo.account*1"
               :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">

          <span v-if="item.from*1==data.myInfo.account*1"
                v-bind:class="item.from*1!=data.myInfo.account*1?'pull-left':'pull-right'"
                v-bind:style="item.from*1!=data.myInfo.account*1?'background-color: #5cacde;color: #fff;'
              :'color: #666;background-color: #e5f4ff;'" v-emoji><a class="pull-right" :href="item.file.url">
               {{item.file.name}}<br><div class="text-center" style="width: 100%">点击下载</div></a></span>
        </div>
      </div>
    </div>
    <input style="opacity: 0;margin-top: 2em" id="txt" type="tel" autofocus="autofocus">
    <div class="bottom-emoji" v-if="showEmojiList">
      <div v-for="item,index in emojiUrl" :key="index">
        <img :src="item" @click="selectThisEmoji(item)" alt="">
        <!--<br v-if="(index+1)%8==0">-->
      </div>
    </div>
    <div class="bottom-input" v-if="!isHistory">
      <!--<textarea v-model='sendMsg' type="text">-->
      <!--</textarea>-->
      <p id="p" class="needsclick"  contenteditable="true"></p>
      <img @click="toSelectEmoji" class="emoji-select-pic"
           src="http://yx-web.nos.netease.com/webdoc/h5/im/chat-editor-1.png" alt="">
      <span data-v-477b3f6c="" class="u-editor-icon">
          <img class="selectPic" data-v-477b3f6c="" src="http://yx-web.nos.netease.com/webdoc/h5/im/chat-editor-2.png">
      <input class="file" name="file" type="file" ref="fileToSent" accept="" @change="update"/>
      </span>
      <a class="pull-right send-btn" @click="send">发送</a></div>
  </yd-layout>
  <!--</div>-->
</template>
<script>
  import Vue from 'vue'
  import '@/assets/css/manager.css';
  //  import {getSession} from '../../../lib/utils'
  //  Vue.directive('emoji', {
  //    inserted: function (el, binding) {
  //      console.log(el);
  //      if(el.split('[').length>0&&el.split(']').length>0){
  //        var newEl=el.split('[')[0]
  //        for(var i=1;i<el.split('[').length-1;i++){
  //          for( var j=0;j<<el.split('[')[i]){
  //
  //          }
  //        }
  //        el.innerHTML=123
  //      }
  //    }
  //  });
  export default {
    data() {
      return {
        showEmojiList: false,
        isHistory:false,
        userInfo: {},
        organInfo: {},
        chatList: {},
        data: {},
        nim: '',
        msg: '',
        title: '',
        isChat: true,
        id: '',
        teamId: '',
        sendMsg: '',
        emojiList: {
          "[大笑]": {file: "emoji_0.png"},
          "[可爱]": {file: "emoji_01.png"},
          "[色]": {file: "emoji_02.png"},
          "[嘘]": {file: "emoji_03.png"},
          "[亲]": {file: "emoji_04.png"},
          "[呆]": {file: "emoji_05.png"},
          "[口水]": {file: "emoji_06.png"},
          "[汗]": {file: "emoji_145.png"},
          "[呲牙]": {file: "emoji_07.png"},
          "[鬼脸]": {file: "emoji_08.png"},
          "[害羞]": {file: "emoji_09.png"},
          "[偷笑]": {file: "emoji_10.png"},
          "[调皮]": {file: "emoji_11.png"},
          "[可怜]": {file: "emoji_12.png"},
          "[敲]": {file: "emoji_13.png"},
          "[惊讶]": {file: "emoji_14.png"},
          "[流感]": {file: "emoji_15.png"},
          "[委屈]": {file: "emoji_16.png"},
          "[流泪]": {file: "emoji_17.png"},
          "[嚎哭]": {file: "emoji_18.png"},
          "[惊恐]": {file: "emoji_19.png"},
          "[怒]": {file: "emoji_20.png"},
          "[酷]": {file: "emoji_21.png"},
          "[不说]": {file: "emoji_22.png"},
          "[鄙视]": {file: "emoji_23.png"},
          "[阿弥陀佛]": {file: "emoji_24.png"},
          "[奸笑]": {file: "emoji_25.png"},
          "[睡着]": {file: "emoji_26.png"},
          "[口罩]": {file: "emoji_27.png"},
          "[努力]": {file: "emoji_28.png"},
          "[抠鼻孔]": {file: "emoji_29.png"},
          "[疑问]": {file: "emoji_30.png"},
          "[怒骂]": {file: "emoji_31.png"},
          "[晕]": {file: "emoji_32.png"},
          "[呕吐]": {file: "emoji_33.png"},
          "[拜一拜]": {file: "emoji_160.png"},
          "[惊喜]": {file: "emoji_161.png"},
          "[流汗]": {file: "emoji_162.png"},
          "[卖萌]": {file: "emoji_163.png"},
          "[默契眨眼]": {file: "emoji_164.png"},
          "[烧香拜佛]": {file: "emoji_165.png"},
          "[晚安]": {file: "emoji_166.png"},
          "[强]": {file: "emoji_34.png"},
          "[弱]": {file: "emoji_35.png"},
          "[OK]": {file: "emoji_36.png"},
          "[拳头]": {file: "emoji_37.png"},
          "[胜利]": {file: "emoji_38.png"},
          "[鼓掌]": {file: "emoji_39.png"},
          "[握手]": {file: "emoji_200.png"},
          "[发怒]": {file: "emoji_40.png"},
          "[骷髅]": {file: "emoji_41.png"},
          "[便便]": {file: "emoji_42.png"},
          "[火]": {file: "emoji_43.png"},
          "[溜]": {file: "emoji_44.png"},
          "[爱心]": {file: "emoji_45.png"},
          "[心碎]": {file: "emoji_46.png"},
          "[钟情]": {file: "emoji_47.png"},
          "[唇]": {file: "emoji_48.png"},
          "[戒指]": {file: "emoji_49.png"},
          "[钻石]": {file: "emoji_50.png"},
          "[太阳]": {file: "emoji_51.png"},
          "[有时晴]": {file: "emoji_52.png"},
          "[多云]": {file: "emoji_53.png"},
          "[雷]": {file: "emoji_54.png"},
          "[雨]": {file: "emoji_55.png"},
          "[雪花]": {file: "emoji_56.png"},
          "[爱人]": {file: "emoji_57.png"},
          "[帽子]": {file: "emoji_58.png"},
          "[皇冠]": {file: "emoji_59.png"},
          "[篮球]": {file: "emoji_60.png"},
          "[足球]": {file: "emoji_61.png"},
          "[垒球]": {file: "emoji_62.png"},
          "[网球]": {file: "emoji_63.png"},
          "[台球]": {file: "emoji_64.png"},
          "[咖啡]": {file: "emoji_65.png"},
          "[啤酒]": {file: "emoji_66.png"},
          "[干杯]": {file: "emoji_67.png"},
          "[柠檬汁]": {file: "emoji_68.png"},
          "[餐具]": {file: "emoji_69.png"},
          "[汉堡]": {file: "emoji_70.png"},
          "[鸡腿]": {file: "emoji_71.png"},
          "[面条]": {file: "emoji_72.png"},
          "[冰淇淋]": {file: "emoji_73.png"},
          "[沙冰]": {file: "emoji_74.png"},
          "[生日蛋糕]": {file: "emoji_75.png"},
          "[蛋糕]": {file: "emoji_76.png"},
          "[糖果]": {file: "emoji_77.png"},
          "[葡萄]": {file: "emoji_78.png"},
          "[西瓜]": {file: "emoji_79.png"},
          "[光碟]": {file: "emoji_80.png"},
          "[手机]": {file: "emoji_81.png"},
          "[电话]": {file: "emoji_82.png"},
          "[电视]": {file: "emoji_83.png"},
          "[声音开启]": {file: "emoji_84.png"},
          "[声音关闭]": {file: "emoji_85.png"},
          "[铃铛]": {file: "emoji_86.png"},
          "[锁头]": {file: "emoji_87.png"},
          "[放大镜]": {file: "emoji_88.png"},
          "[灯泡]": {file: "emoji_89.png"},
          "[锤头]": {file: "emoji_90.png"},
          "[烟]": {file: "emoji_91.png"},
          "[炸弹]": {file: "emoji_92.png"},
          "[枪]": {file: "emoji_93.png"},
          "[刀]": {file: "emoji_94.png"},
          "[药]": {file: "emoji_95.png"},
          "[打针]": {file: "emoji_96.png"},
          "[钱袋]": {file: "emoji_97.png"},
          "[钞票]": {file: "emoji_98.png"},
          "[银行卡]": {file: "emoji_99.png"},
          "[手柄]": {file: "emoji_100.png"},
          "[麻将]": {file: "emoji_101.png"},
          "[调色板]": {file: "emoji_102.png"},
          "[电影]": {file: "emoji_103.png"},
          "[麦克风]": {file: "emoji_104.png"},
          "[耳机]": {file: "emoji_105.png"},
          "[音乐]": {file: "emoji_106.png"},
          "[吉他]": {file: "emoji_107.png"},
          "[火箭]": {file: "emoji_108.png"},
          "[飞机]": {file: "emoji_109.png"},
          "[火车]": {file: "emoji_110.png"},
          "[公交]": {file: "emoji_111.png"},
          "[轿车]": {file: "emoji_112.png"},
          "[出租车]": {file: "emoji_113.png"},
          "[警车]": {file: "emoji_114.png"},
          "[自行车]": {file: "emoji_115.png"}
        },
        getEmoji: [],
        emojiBaseUrl: `http://yx-web.nosdn.127.net/webdoc/h5/emoji`,
        emojiUrl: [],
        count: 123,
        type: '',
        historyList:[],
      }
    },
    directives: {
      emoji: {
        inserted: function (el, binding) {
          let emojiList = {
            "[大笑]": {file: "emoji_0.png"},
            "[可爱]": {file: "emoji_01.png"},
            "[色]": {file: "emoji_02.png"},
            "[嘘]": {file: "emoji_03.png"},
            "[亲]": {file: "emoji_04.png"},
            "[呆]": {file: "emoji_05.png"},
            "[口水]": {file: "emoji_06.png"},
            "[汗]": {file: "emoji_145.png"},
            "[呲牙]": {file: "emoji_07.png"},
            "[鬼脸]": {file: "emoji_08.png"},
            "[害羞]": {file: "emoji_09.png"},
            "[偷笑]": {file: "emoji_10.png"},
            "[调皮]": {file: "emoji_11.png"},
            "[可怜]": {file: "emoji_12.png"},
            "[敲]": {file: "emoji_13.png"},
            "[惊讶]": {file: "emoji_14.png"},
            "[流感]": {file: "emoji_15.png"},
            "[委屈]": {file: "emoji_16.png"},
            "[流泪]": {file: "emoji_17.png"},
            "[嚎哭]": {file: "emoji_18.png"},
            "[惊恐]": {file: "emoji_19.png"},
            "[怒]": {file: "emoji_20.png"},
            "[酷]": {file: "emoji_21.png"},
            "[不说]": {file: "emoji_22.png"},
            "[鄙视]": {file: "emoji_23.png"},
            "[阿弥陀佛]": {file: "emoji_24.png"},
            "[奸笑]": {file: "emoji_25.png"},
            "[睡着]": {file: "emoji_26.png"},
            "[口罩]": {file: "emoji_27.png"},
            "[努力]": {file: "emoji_28.png"},
            "[抠鼻孔]": {file: "emoji_29.png"},
            "[疑问]": {file: "emoji_30.png"},
            "[怒骂]": {file: "emoji_31.png"},
            "[晕]": {file: "emoji_32.png"},
            "[呕吐]": {file: "emoji_33.png"},
            "[拜一拜]": {file: "emoji_160.png"},
            "[惊喜]": {file: "emoji_161.png"},
            "[流汗]": {file: "emoji_162.png"},
            "[卖萌]": {file: "emoji_163.png"},
            "[默契眨眼]": {file: "emoji_164.png"},
            "[烧香拜佛]": {file: "emoji_165.png"},
            "[晚安]": {file: "emoji_166.png"},
            "[强]": {file: "emoji_34.png"},
            "[弱]": {file: "emoji_35.png"},
            "[OK]": {file: "emoji_36.png"},
            "[拳头]": {file: "emoji_37.png"},
            "[胜利]": {file: "emoji_38.png"},
            "[鼓掌]": {file: "emoji_39.png"},
            "[握手]": {file: "emoji_200.png"},
            "[发怒]": {file: "emoji_40.png"},
            "[骷髅]": {file: "emoji_41.png"},
            "[便便]": {file: "emoji_42.png"},
            "[火]": {file: "emoji_43.png"},
            "[溜]": {file: "emoji_44.png"},
            "[爱心]": {file: "emoji_45.png"},
            "[心碎]": {file: "emoji_46.png"},
            "[钟情]": {file: "emoji_47.png"},
            "[唇]": {file: "emoji_48.png"},
            "[戒指]": {file: "emoji_49.png"},
            "[钻石]": {file: "emoji_50.png"},
            "[太阳]": {file: "emoji_51.png"},
            "[有时晴]": {file: "emoji_52.png"},
            "[多云]": {file: "emoji_53.png"},
            "[雷]": {file: "emoji_54.png"},
            "[雨]": {file: "emoji_55.png"},
            "[雪花]": {file: "emoji_56.png"},
            "[爱人]": {file: "emoji_57.png"},
            "[帽子]": {file: "emoji_58.png"},
            "[皇冠]": {file: "emoji_59.png"},
            "[篮球]": {file: "emoji_60.png"},
            "[足球]": {file: "emoji_61.png"},
            "[垒球]": {file: "emoji_62.png"},
            "[网球]": {file: "emoji_63.png"},
            "[台球]": {file: "emoji_64.png"},
            "[咖啡]": {file: "emoji_65.png"},
            "[啤酒]": {file: "emoji_66.png"},
            "[干杯]": {file: "emoji_67.png"},
            "[柠檬汁]": {file: "emoji_68.png"},
            "[餐具]": {file: "emoji_69.png"},
            "[汉堡]": {file: "emoji_70.png"},
            "[鸡腿]": {file: "emoji_71.png"},
            "[面条]": {file: "emoji_72.png"},
            "[冰淇淋]": {file: "emoji_73.png"},
            "[沙冰]": {file: "emoji_74.png"},
            "[生日蛋糕]": {file: "emoji_75.png"},
            "[蛋糕]": {file: "emoji_76.png"},
            "[糖果]": {file: "emoji_77.png"},
            "[葡萄]": {file: "emoji_78.png"},
            "[西瓜]": {file: "emoji_79.png"},
            "[光碟]": {file: "emoji_80.png"},
            "[手机]": {file: "emoji_81.png"},
            "[电话]": {file: "emoji_82.png"},
            "[电视]": {file: "emoji_83.png"},
            "[声音开启]": {file: "emoji_84.png"},
            "[声音关闭]": {file: "emoji_85.png"},
            "[铃铛]": {file: "emoji_86.png"},
            "[锁头]": {file: "emoji_87.png"},
            "[放大镜]": {file: "emoji_88.png"},
            "[灯泡]": {file: "emoji_89.png"},
            "[锤头]": {file: "emoji_90.png"},
            "[烟]": {file: "emoji_91.png"},
            "[炸弹]": {file: "emoji_92.png"},
            "[枪]": {file: "emoji_93.png"},
            "[刀]": {file: "emoji_94.png"},
            "[药]": {file: "emoji_95.png"},
            "[打针]": {file: "emoji_96.png"},
            "[钱袋]": {file: "emoji_97.png"},
            "[钞票]": {file: "emoji_98.png"},
            "[银行卡]": {file: "emoji_99.png"},
            "[手柄]": {file: "emoji_100.png"},
            "[麻将]": {file: "emoji_101.png"},
            "[调色板]": {file: "emoji_102.png"},
            "[电影]": {file: "emoji_103.png"},
            "[麦克风]": {file: "emoji_104.png"},
            "[耳机]": {file: "emoji_105.png"},
            "[音乐]": {file: "emoji_106.png"},
            "[吉他]": {file: "emoji_107.png"},
            "[火箭]": {file: "emoji_108.png"},
            "[飞机]": {file: "emoji_109.png"},
            "[火车]": {file: "emoji_110.png"},
            "[公交]": {file: "emoji_111.png"},
            "[轿车]": {file: "emoji_112.png"},
            "[出租车]": {file: "emoji_113.png"},
            "[警车]": {file: "emoji_114.png"},
            "[自行车]": {file: "emoji_115.png"}
          };
          var getEmoji = [];
          var emojiUrl = [];
          for (let emoji in emojiList) {
            let emojiItem = emojiList[emoji]
            getEmoji.push(emoji)
            for (let key in emojiItem) {
              let item = emojiItem[key];
              emojiUrl.push('http://yx-web.nosdn.127.net/webdoc/h5/emoji/emoji/' + item)
            }
          }
          var object = el.innerHTML;
          if (object.split('[').length > 0 && object.split(']').length > 0) {
            var newEl = object.split('[')[0]
            for (var i = 1; i < object.split('[').length; i++) {
              for (var j = 0; j < getEmoji.length; j++) {
                if (getEmoji[j] == '[' + object.split('[')[i].split(']')[0] + ']') {
                  newEl = newEl + '<img style="margin: 0;margin-bottom: -0.4em" src="' + emojiUrl[j] + '" alt="">' + object.split('[')[i].split(']')[1]
                }
              }
            }
            el.innerHTML = newEl
          }
        }
      }
    },
    methods: {
      getHistory() {
        this.nim.getHistoryMsgs({
          scene: 'team',
          to: this.type.split('-')[1],
          done: this.getHistoryMsgsDone
        });
      },
      toHistory(){
        this.$router.push('/message/chat_history?id='+this.type);
        this.getHistory();
      },
      getHistoryMsgsDone(error, obj) {
        console.log('获取p2p历史消息' + (!error?'成功':'失败'));
        console.log(error);
        console.log(obj);
        if (!error) {
          this.historyList=obj.msgs;
        }
      },
      chooseSuccess(){
        this.$router.push('/message/team_detail?id='+this.type);
        this.data.nowMenber=[];
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)))
      },
      friendImg(data) {
        var img = ''
        for (var i = 0; i < this.data.users.length; i++) {
          if (this.data.users[i].account * 1 == data) {
            img = this.data.users[i].avatar
          }
        }
        return img
      },
      hasRead() {
        var session = ''
//        console.log(this.data.sessions);
//        console.log(this.type);
        for (var i = 0; i < this.data.sessions.length; i++) {
          if (this.data.sessions[i].id == this.type) {
            session = this.data.sessions[i];
            console.log(session.lastMsg)
          }
        }
        this.nim.resetSessionUnread(session.id)
        this.nim.sendMsgReceipt({
          msg: session.lastMsg,
          done: this.sendMsgReceiptDone,
        });
        console.log(this.nim.isMsgRemoteRead(session.lastMsg))
      },
      sendMsgReceiptDone(error, obj) {
        console.log('发送消息已读回执' + (!error ? '成功' : '失败'), error, obj);
      },
      update(e) {
        console.log(this.$refs.fileToSent)
        let file = e.target.files[0];
        console.log(file)
        if (file.type.split('image')) {

        }
        var toType = file.type.split('image').length > 1 ? 'image' : 'file'
        let d = new Date();
        let type = file.name.split('.');
//        let tokenParem = {
//          'putPolicy':'{\"name\":\"$(fname)\",\"size\":\"$(fsize)\",\"w\":\"$(imageInfo.width)\",\"h\":\"$(imageInfo.height)\",\"hash\":\"$(etag)\"}',
//          'key':'orderReview/'+d.getFullYear()+'/'+(d.getMonth()+1)+'/'+d.getDate()+'/'+d.valueOf()+'.'+type[type.length-1],
//          'bucket':this.getHearLog.domain,//七牛的地址，这个是你自己配置的（变量）
//        };
        let param = new FormData(); //创建form对象
        param.append('chunk', '0');//断点传输
        param.append('chunks', '1');
        param.append('file', file, file.name);
        var goType = this.teamId ? 'team' : 'p2p';
        this.nim.sendFile({
          scene: goType,
          to: this.type.split('-')[this.type.split('-').length - 1],
          type: toType,
          fileInput: this.$refs.fileToSent,
          beginupload: this.beginupload,
          uploadprogress: this.uploadprogress,
          uploaddone: this.uploaddone,
          beforesend: this.beforesend,
          done: this.sendMsgDone
        });
      },
      back() {
        this.$router.go(-1)
      },
      beginupload(upload) {
        // - 如果开发者传入 fileInput, 在此回调之前不能修改 fileInput
        // - 在此回调之后可以取消图片上传, 此回调会接收一个参数 `upload`, 调用 `upload.abort();` 来取消文件上传
      },
      uploadprogress: function (obj) {
        console.log('文件总大小: ' + obj.total + 'bytes');
        console.log('已经上传的大小: ' + obj.loaded + 'bytes');
        console.log('上传进度: ' + obj.percentage);
        console.log('上传进度文本: ' + obj.percentageText);
      },
      uploaddone(error, file) {
        console.log(error);
        console.log(file);
        console.log('上传' + (!error ? '成功' : '失败'));
      },
      beforesend(msg) {
        console.log('正在发送p2p image消息, id=' + msg.idClient);
        this.pushMsg(msg);
      },
      toSelectEmoji() {
        this.showEmojiList = !this.showEmojiList
      },
      selectThisEmoji(item) {
        var obj = document.getElementById("p");
        this.sendMsg = obj.innerHTML;
        obj.innerHTML = this.sendMsg + '<img style="width: 1.8em;height: 1.8em" src="' + item + '" alt="">';
      },
      loseBlur(){
        document.getElementById("txt").blur();
      },
      send() {
        document.getElementById('txt').focus();
        document.getElementById("txt").blur();
        var obj = document.getElementById("p");
        this.showEmojiList = false;
        this.sendMsg = '';
        if (obj.innerHTML.split('emoji_').length > 0) {
          var sendMsg = '';
          for (var i = 0; i < obj.innerHTML.split('alt="">').length; i++) {
            if (i == obj.innerHTML.split('alt="">').length - 1) {
              if (obj.innerHTML.split(' alt="">')[i]) {
                sendMsg = sendMsg + obj.innerHTML.split('alt="">')[i];
                console.log(sendMsg)
              }
            } else {
              sendMsg = sendMsg + obj.innerHTML.split('alt="">')[i].split('<img')[0];

              for (var j = 0; j < this.getEmoji.length; j++) {
                if (obj.innerHTML.split('alt="">')[i].split('emoji_')[1].split('.png')[0] * 1 == this.emojiUrl[j].split('emoji_')[1].split('.png')[0] * 1) {
                  sendMsg = sendMsg + this.getEmoji[j];
                }

              }
            }
//            sendMsg=sendMsg+ obj.innerHTML.split('emoji_')[i].split('alt="">')[1];
          }
          console.log(this.sendMsg + '1234')
          this.sendMsg = sendMsg;
          var lastMsg = ''
          for (var i = 0; i < this.sendMsg.split('<br>').length; i++) {
            lastMsg = lastMsg + this.sendMsg.split('<br>')[i];
          }
          this.sendMsg = lastMsg
          var clearMsg = '';
          console.log(this.sendMsg)
          if (this.sendMsg.split('&nbsp;').length > 0) {
            for (var i = 0; i < this.sendMsg.split('&nbsp;').length; i++) {
              console.log(this.sendMsg.split('&nbsp;')[i])
              clearMsg = clearMsg + this.sendMsg.split('&nbsp;')[i];
            }
            this.sendMsg = clearMsg
          }
          console.log(this.sendMsg + '1111')
        }
        else {
          this.sendMsg = obj.innerHTML
        }
        this.getFriendList();
        if (this.sendMsg && this.sendMsg != '' && !this.teamId) {
          console.log(this.sendMsg);
          var msg = this.nim.sendText({
            scene: 'p2p',
            to: this.id.split('-')[this.id.split('-').length - 1],
            text: this.sendMsg,
            done: this.sendMsgDone
          });
          obj.innerHTML = '';
          console.log('正在发送p2p text消息, id=' + msg.idClient);
          this.pushMsg(msg);
        } else if (this.sendMsg && this.sendMsg != '' && this.teamId) {
          console.log(this.teamId * 1)
          var msg = this.nim.sendText({
            scene: 'team',
            to: this.type.split('-')[this.type.split('-').length - 1],
            text: this.sendMsg,
            done: this.sendMsgDone
          });
          obj.innerHTML = '';
          console.log(msg)
          console.log('正在发送p2p text消息, id=' + msg.idClient);
          this.pushMsg(msg);
        }
      },
      sendMsgDone(error, msg) {
        console.log(error);
        console.log(msg);
        console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error ? '成功' : '失败') + ', id=' + msg.idClient);
        this.pushMsg(msg);
      },
      selectList() {
        this.isChat = !this.isChat
      },
      getFriendList() {
        this.nim = NIM.getInstance({
          // 初始化SDK
          debug: false,
//        appKey: 'appKey',
//        account: 'account',
//        token: 'token',
          appKey: '0b6aba3c2b82dedab966de3264037804',
          account: JSON.parse(decodeURIComponent(localStorage.getItem('userInfo'))).guid,
          token: JSON.parse(decodeURIComponent(localStorage.getItem('userInfo'))).imToken,
          onconnect: this.onConnect,
          onerror: this.onError,
          onwillreconnect: this.onWillReconnect,
          ondisconnect: this.onDisconnect,
          // 多端登录
          onloginportschange: this.onLoginPortsChange,
          // 用户关系
          onblacklist: this.onBlacklist,
          onsyncmarkinblacklist: this.onMarkInBlacklist,
          onmutelist: this.onMutelist,
          onsyncmarkinmutelist: this.onMarkInMutelist,
          // 好友关系
          onfriends: this.onFriends,
          onsyncfriendaction: this.onSyncFriendAction,
          // 用户名片
          onmyinfo: this.onMyInfo,
          onupdatemyinfo: this.onUpdateMyInfo,
          onusers: this.onUsers,
          onupdateuser: this.onUpdateUser,
          onrobots: this.onRobots,
          // 群组
          onteams: this.onTeams,
          onsynccreateteam: this.onCreateTeam,
          onteammembers: this.onTeamMembers,
          onsyncteammembersdone: this.onSyncTeamMembersDone,
          onupdateteammember: this.onUpdateTeamMember,
          // 会话
          onsessions: this.onSessions,
          onupdatesession: this.onUpdateSession,
          // 消息
          onroamingmsgs: this.onRoamingMsgs,
          onofflinemsgs: this.onOfflineMsgs,
          onmsg: this.onMsg,
          // 系统通知
          onofflinesysmsgs: this.onOfflineSysMsgs,
          onsysmsg: this.onSysMsg,
          onupdatesysmsg: this.onUpdateSysMsg,
          onsysmsgunread: this.onSysMsgUnread,
          onupdatesysmsgunread: this.onUpdateSysMsgUnread,
          onofflinecustomsysmsgs: this.onOfflineCustomSysMsgs,
          oncustomsysmsg: this.onCustomSysMsg,
          onbroadcastmsg: this.onBroadcastMsg,
          onbroadcastmsgs: this.onBroadcastMsgs,
          // 同步完成
          onsyncdone: this.onSyncDone
        })

      },
      onConnect() {
        console.log('连接成功');
      },
      onWillReconnect(obj) {
        // 此时说明 `SDK` 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
        console.log('即将重连');
        console.log(obj.retryCount);
        console.log(obj.duration);
      },
      onDisconnect(error) {
        // 此时说明 `SDK` 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
        console.log('丢失连接');
        console.log(error);
        if (error) {
          switch (error.code) {
            // 账号或者密码错误, 请跳转到登录页面并提示错误
            case 302:
              break;
            // 被踢, 请提示错误后跳转到登录页面
            case 'kicked':
              break;
            default:
              break;
          }
        }
      },
      onError(error) {
        console.log(error);
      },

      onLoginPortsChange(loginPorts) {
        console.log('当前登录帐号在其它端的状态发生改变了', loginPorts);
      },

      onBlacklist(blacklist) {
        console.log('收到黑名单', blacklist);
        this.data.blacklist = this.nim.mergeRelations(this.data.blacklist, blacklist);
        this.data.blacklist = this.nim.cutRelations(this.data.blacklist, blacklist.invalid);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.refreshBlacklistUI();
      },
      onMarkInBlacklist(obj) {
        console.log(obj);
        console.log(obj.account + '被你在其它端' + (obj.isAdd ? '加入' : '移除') + '黑名单');
        if (obj.isAdd) {
          addToBlacklist(obj);
        } else {
          removeFromBlacklist(obj);
        }
      },
      addToBlacklist(obj) {
        this.data.blacklist = this.nim.mergeRelations(this.data.blacklist, obj.record);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.refreshBlacklistUI();
      },
      removeFromBlacklist(obj) {
        this.data.blacklist = this.nim.cutRelations(this.data.blacklist, obj.record);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.refreshBlacklistUI();
      },
      refreshBlacklistUI() {
        // 刷新界面
      },
      onMutelist(mutelist) {
        console.log('收到静音列表', mutelist);
        this.data.mutelist = this.nim.mergeRelations(this.data.mutelist, mutelist);
        this.data.mutelist = this.nim.cutRelations(this.data.mutelist, mutelist.invalid);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.refreshMutelistUI();
      },
      onMarkInMutelist(obj) {
        console.log(obj);
        console.log(obj.account + '被你' + (obj.isAdd ? '加入' : '移除') + '静音列表');
        if (obj.isAdd) {
          addToMutelist(obj);
        } else {
          removeFromMutelist(obj);
        }
      },
      addToMutelist(obj) {
        this.data.mutelist = this.nim.mergeRelations(this.data.mutelist, obj.record);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.refreshMutelistUI();
      },
      removeFromMutelist(obj) {
        this.data.mutelist = this.nim.cutRelations(this.data.mutelist, obj.record);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.refreshMutelistUI();
      },
      refreshMutelistUI() {
        // 刷新界面
      },

      onFriends(friends) {
        console.log('收到好友列表', friends);
        this.data.friends = this.nim.mergeFriends(this.data.friends, friends);
        this.data.friends = this.nim.cutFriends(this.data.friends, friends.invalid);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.refreshFriendsUI();
      },
      onSyncFriendAction(obj) {
        console.log(obj);
        switch (obj.type) {
          case 'addFriend':
            console.log('你在其它端直接加了一个好友' + obj.account + ', 附言' + obj.ps);
            this.onAddFriend(obj.friend);
            break;
          case 'applyFriend':
            console.log('你在其它端申请加了一个好友' + obj.account + ', 附言' + obj.ps);
            break;
          case 'passFriendApply':
            console.log('你在其它端通过了一个好友申请' + obj.account + ', 附言' + obj.ps);
            this.onAddFriend(obj.friend);
            break;
          case 'rejectFriendApply':
            console.log('你在其它端拒绝了一个好友申请' + obj.account + ', 附言' + obj.ps);
            break;
          case 'deleteFriend':
            console.log('你在其它端删了一个好友' + obj.account);
            onDeleteFriend(obj.account);
            break;
          case 'updateFriend':
            console.log('你在其它端更新了一个好友', obj.friend);
            onUpdateFriend(obj.friend);
            break;
        }
      },
      onAddFriend(friend) {
        this.data.friends = this.nim.mergeFriends(this.data.friends, friend);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.refreshFriendsUI();
      },
      onDeleteFriend(account) {
        this.data.friends = this.nim.cutFriendsByAccounts(this.data.friends, account);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.refreshFriendsUI();
      },
      onUpdateFriend(friend) {
        this.data.friends = this.nim.mergeFriends(this.data.friends, friend);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.refreshFriendsUI();
      },
      refreshFriendsUI() {
        // 刷新界面
      },

      onMyInfo(user) {
        console.log('收到我的名片', user);
        this.data.myInfo = user;
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.updateMyInfoUI();
      },
      onUpdateMyInfo(user) {
        console.log('我的名片更新了', user);
        this.data.myInfo = this.nim.util.merge(this.data.myInfo, user);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.updateMyInfoUI();
      },
      updateMyInfoUI() {
        // 刷新界面
      },
      onUsers(users) {
        console.log('收到用户名片列表', users);
        this.data.users = this.nim.mergeUsers(this.data.users, users);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
      },
      onUpdateUser(user) {
        console.log('用户名片更新了', user);
        this.data.users = this.nim.mergeUsers(this.data.users, user);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
      },
      onRobots(robots) {
        console.log('收到机器人列表', robots);
        this.data.robots = robots;
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
      },
      onTeams(teams) {
//        this.friendList = teams
//        console.log('群列表', teams);
//        localStorage.setItem('friendList', encodeURIComponent(JSON.stringify(this.friendList)));
        this.data.teams = this.nim.mergeTeams(this.data.teams, teams);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.onInvalidTeams(teams.invalid);
      },
      onInvalidTeams(teams) {
        this.data.teams = this.nim.cutTeams(this.data.teams, teams);
        this.data.invalidTeams = this.nim.mergeTeams(this.data.invalidTeams, teams);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.refreshTeamsUI();
      },
      onCreateTeam(team) {
        console.log('你创建了一个群', team);
        this.data.teams = this.nim.mergeTeams(this.data.teams, team);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.refreshTeamsUI();
        onTeamMembers({
          teamId: team.teamId,
          members: owner
        });
      },
      refreshTeamsUI() {
        // 刷新界面
      },
      onTeamMembers(teamId, members) {
        console.log('群id', teamId, '群成员', members);
//        var teamId = obj.teamId;
//        var members = obj.members;
//         this.data.teamMembers =  this.data.teamMembers || {};
//         this.data.teamMembers[teamId] = this.nim.mergeTeamMembers( this.data.teamMembers[teamId], members);
//         this.data.teamMembers[teamId] = this.nim.cutTeamMembers( this.data.teamMembers[teamId], members.invalid);
        this.refreshTeamMembersUI();
      },
      onSyncTeamMembersDone() {
        console.log('同步群列表完成');
      },
      onUpdateTeamMember(teamMember) {
        console.log('群成员信息更新了', teamMember);
        onTeamMembers({
          teamId: teamMember.teamId,
          members: teamMember
        });
      },
      refreshTeamMembersUI() {
        // 刷新界面
      },

      onSessions(sessions) {
        this.friendList = sessions;
        console.log('群列表', sessions);
        console.log('收到会话列表', sessions);
        this.data.sessions = this.nim.mergeSessions(this.data.sessions, sessions);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.updateSessionsUI();
      },
      onUpdateSession(session) {
        console.log('会话更新了', session);
        this.data.sessions = this.nim.mergeSessions(this.data.sessions, session);
        console.log(this.data.sessions);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.updateSessionsUI();
      },
      updateSessionsUI() {
        // 刷新界面
      },

      onRoamingMsgs(obj) {
        console.log('漫游消息', obj);
        this.pushMsg(obj.msgs);
      },
      onOfflineMsgs(obj) {
        console.log('离线消息', obj);
        this.pushMsg(obj.msgs);
      },
      onMsg(msg) {
        console.log(msg)
        console.log('收到消息', msg.scene, msg.type, msg);
        this.pushMsg(msg);
      },
      onBroadcastMsg(msg) {
        console.log('收到广播消息', msg);
      },
      onBroadcastMsgs(msgs) {
        console.log('收到广播消息', msgs);
      },
      pushMsg(msgs) {
        if (!Array.isArray(msgs)) {
          msgs = [msgs];
        }
        var sessionId = msgs[0].sessionId;
        var data = this.data;
        this.data = '';
        this.data = data;
        this.data.msgs = this.data.msgs || {};
        document.getElementById('txt').focus();
        document.getElementById("txt").blur();
        this.data.msgs[sessionId] = this.nim.mergeMsgs(this.data.msgs[sessionId], msgs);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
      },

      onOfflineSysMsgs(sysMsgs) {
        console.log('收到离线系统通知', sysMsgs);
        this.pushSysMsgs(sysMsgs);
      },
      onSysMsg(sysMsg) {
        console.log('收到系统通知', sysMsg)
        this.pushSysMsgs(sysMsg);
      },
      onUpdateSysMsg(sysMsg) {
        this.pushSysMsgs(sysMsg);
      },
      pushSysMsgs(sysMsgs) {
        this.data.sysMsgs = this.nim.mergeSysMsgs(this.data.sysMsgs, sysMsgs);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.refreshSysMsgsUI();
      },
      onSysMsgUnread(obj) {
        console.log('收到系统通知未读数', obj);
        this.data.sysMsgUnread = obj;
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.refreshSysMsgsUI();
      },
      onUpdateSysMsgUnread(obj) {
        console.log('系统通知未读数更新了', obj);
        this.data.sysMsgUnread = obj;
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.refreshSysMsgsUI();
      },
      refreshSysMsgsUI() {
        // 刷新界面
      },
      onOfflineCustomSysMsgs(sysMsgs) {
        console.log('收到离线自定义系统通知', sysMsgs);
      },
      onCustomSysMsg(sysMsg) {
        console.log('收到自定义系统通知', sysMsg);
      },

      onSyncDone() {
        console.log('同步完成');
      }
    },
    mounted() {
      for (let emoji in this.emojiList) {
        let emojiItem = this.emojiList[emoji]
//        console.log(this.emoji)
        this.getEmoji.push(emoji)
        for (let key in emojiItem) {
          let item = emojiItem[key];
          this.emojiUrl.push('http://yx-web.nosdn.127.net/webdoc/h5/emoji/emoji/' + item)
//          item.img = `${emojiBaseUrl}/${emoji}/${item.file}`
        }
      }
      this.data = JSON.parse(decodeURIComponent(localStorage.getItem('chatData')));
      if (this.$route.query.id) {
        this.id = this.$route.query.id;
        this.type = this.id;
      }
      if (this.$route.query.teamId) {
        this.teamId = this.$route.query.teamId;
        this.type = 'team-' + this.teamId
      }
      if (this.data.users) {
        for (var i = 0; i < this.data.users.length; i++) {
          if (this.data.users[i].account * 1 == this.type.split('-')[1] * 1) {
            this.title = this.data.users[i].nick;
//            this.friendImg = this.data.users[i].avatar
          }
        }
      }
      if (this.teamId) {
        for (var i = 0; i < this.data.users.length; i++) {
          if (this.data.teams[i].teamId == this.teamId) {
            this.title = this.data.teams[i].name;
          }
        }
      }
      this.getFriendList();
      if (this.title) {
        document.title = this.title;
      }
      console.log(this.type);
      if (this.$route.path=='/message/chat_history') {
        this.isHistory=true;
        this.getHistory();
      }
      this.hasRead();
      this.loseBlur();
    },
  }
</script>
<style scoped>

</style>
