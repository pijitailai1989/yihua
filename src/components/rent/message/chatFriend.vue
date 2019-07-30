<template>
  <!--<div class="template" v-title="'企信'">-->
  <yd-layout class="edit" v-title="'联系人'">
    <yd-navbar height=".88rem" v-show="!userAgent.isWX" title="联系人" bgcolor="#0093d2" color="#fff">
      <span slot="left" @click="back" color="#fff;padding-right:.2rem" style="color: #fff;">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
      <span slot="right" @click="sureAdd()" color="#fff;padding-right:.2rem" style="color: #fff;">
        <yd-icon color="#fff" name="search"></yd-icon>
        确定
      </span>
    </yd-navbar>
    <div>
      <template v-if="this.selectItem">
        <yd-search v-model="value1" :on-submit="submitHandler"></yd-search>
      </template>
      <template v-if="!this.selectItem">
        <input type="text" class="team-name" v-model="teamName" placeholder="请输入群名称">
      </template>
      <div v-if="this.selectItem">
        <div v-if="data.myInfo" style="width: 100%;padding-left: 1em;line-height: 2em">
          {{data.myInfo.custom.split('organName":"')[1].split('","')[0]}}
        </div>
        <div class="chat-list" v-for="item,index in data.users" @click="toChat(item.account)">
          <img class="m-right l-right" :src="item.avatar">
          <div class="get-ms-list">{{item.nick}}<br><span>
          <!--{{item.lastMsg.text}}-->
        </span></div>
          <div class="right-time pull-right">
          </div>
        </div>
      </div>
      <div v-if="!this.selectItem">
        <div v-if="data.myInfo" style="line-height: 3em;padding-left: 1em">
          {{data.myInfo.custom.split('organName":"')[1].split('","')[0]}}
        </div>
        <div class="chat-list" v-for="item,index in data.users" @click="toSelectItem(index)">
          <img v-if="!item.isSelected" style="width: 1.5em;height: 1.5em;margin-top: 1em"
               src="../../../assets/images/rent/my/unselected_pic.png" alt="">
          <img v-if="item.isSelected" style="width: 1.5em;height: 1.5em;margin-top: 1em"
               src="../../../assets/images/rent/my/job_selected.png" alt="">
          <img class="m-right l-right" :src="item.avatar">
          <div class="get-ms-list">{{item.nick}}<br><span>
          <!--{{item.lastMsg.text}}-->
        </span></div>
          <div class="right-time pull-right">
          </div>
        </div>
      </div>
    </div>
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
        friendList: [],
        data: '',
        value1: '',
        selectItem: true,
        nim: '',
        teamName: '',
        list: []
      }
    },
    methods: {
      toUpdateTeam(){
        this.nim.getTeams({
          done: this.getTeamsDone
        });
      },
      getTeamsDone(error, teams) {
        console.log(error);
        console.log(teams);
        this.data.teams=teams;
        console.log('获取群列表' + (!error?'成功':'失败'));
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        if (!error) {
          this.onTeams(teams);
        }
      },
      sureAdd() {
        if (this.teamName && this.teamName != '') {
          this.createTeam();
          setTimeout(() => {
            this.$router.go(-1)
          }, 300);
        } else {
          this.$dialog.toast({
            mes: '请输入群名称'
          });
        }
      },
      createTeam() {
        this.list = []
        for (var i = 0; i < this.data.users.length; i++) {
          console.log(this.data.users);
          if (this.data.users[i].isSelected) {
            this.list.push(this.data.users[i].account)
          }
        }
        this.nim.createTeam({
          debug: false,
          appKey: '0b6aba3c2b82dedab966de3264037804',
          account: JSON.parse(decodeURIComponent(localStorage.getItem('userInfo'))).guid,
          token: JSON.parse(decodeURIComponent(localStorage.getItem('userInfo'))).imToken,
          type: 'normal',
          name: this.teamName,
          avatar: 'avatar',
          accounts: this.list,
          ps: '我建了一个普通群',
          done: this.createTeamDone,
          onteams:this.onTeams
        })
        ;
      },
      createTeamDone(error, obj) {
        console.log(error);
        console.log(obj);
        console.log('创建' + obj + '群' + (!error ? '成功' : '失败'));
        this.nim.onsyncteammembersdone
        if (!error) {
          this.$dialog.toast({
            mes: '创建成功'
          });
          this.toUpdateTeam()
        }
      },
      refreshTeamsUI() {
        // 刷新界面 addNo(){
        this.list = [];
        for (var i = 0; i < this.data.users.length; i++) {
          if (this.data.users[i].isSelected) {
            this.list.push(this.data.users[i].account)
          }
        }
        this.nim.addTeamMembers({
          teamId: '221336667',
          accounts: this.list,
          ps: '加入我们的群吧',
          done: this.addTeamMembersDone
        })
      },
      addTeamMembersDone(error, obj) {
        console.log(error);
        console.log(obj);
        console.log('入群邀请发送' + (!error ? '成功' : '失败'));
      },
      onCreateTeam(team) {
        console.log('你创建了一个群', team);
        this.data.teams = this.nim.mergeTeams(this.data.teams, team);
        var data = this.data;
        this.data = '';
        this.data = data;
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.refreshTeamsUI();
        this.onTeamMembers({
          teamId: team.teamId,
          members: owner
        });
      },
      toSelectItem(index) {
        this.data.users[index].isSelected = !this.data.users[index].isSelected;
        var data = this.data;
        this.data = '';
        this.data = data;
      },
      back() {
        this.$router.go(-1)
      },
      submitHandler(value) {
        this.$dialog.toast({mes: `搜索：${value}`});
      },
      toChat(data) {
        this.$router.push('/message/sessions?id=p2p-' + data)
      },
      getFriendList() {
        this.nim = NIM.getInstance({
          // 初始化SDK
          debug: false,
//        appKey: 'appKey',
//        account: 'account',
//        token: 'token',
          appKey: '153515f757d49b6ee524c876482d0a7b',
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
        localStorage.setItem('nim', this.nim)
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
        console.log(123)
        var data = this.data;
        this.data = '';
        this.data = data;
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.onInvalidTeams(teams.invalid);
      },
      onInvalidTeams(teams) {
        this.data.teams = this.nim.cutTeams(this.data.teams, teams);
        var data = this.data;
        this.data = '';
        this.data = data;
        this.data.invalidTeams = this.nim.mergeTeams(this.data.invalidTeams, teams);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.refreshTeamsUI();
      },
      onCreateTeam(team) {
        console.log('你创建了一个群', team);
        this.data.teams = this.nim.mergeTeams(this.data.teams, team);
        var data = this.data;
        this.data = '';
        this.data = data;
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
        var data = this.data;
        this.data = '';
        this.data = data;
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
        this.friendList = sessions
        console.log('群列表', sessions);
        console.log('收到会话列表', sessions);
        var data = this.data;
        this.data = '';
        this.data = data;
        this.data.sessions = this.nim.mergeSessions(this.data.sessions, sessions);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.updateSessionsUI();
      },
      onUpdateSession(session) {
        var data = this.data;
        this.data = '';
        this.data = data;
        console.log('会话更新了', session);
        this.data.sessions = this.nim.mergeSessions(this.data.sessions, session);
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
        this.data.msgs = this.data.msgs || {};
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
      },
      sendMsg() {
        var msg = this.nim.sendText({
          scene: 'p2p',
          to: '385788811705057280',
          text: 'hello',
          done: this.sendMsgDone
        });
        console.log('正在发送p2p text消息, id=' + msg.idClient);
        this.pushMsg(msg);
      },
      sendMsgDone(error, msg) {
        console.log(error);
        console.log(msg);
        console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error ? '成功' : '失败') + ', id=' + msg.idClient);
        this.pushMsg(msg);
      }
    },
    mounted() {
      this.getFriendList();
      console.log(this.$route.path);
      if (this.$route.path == '/message/create_team') {
        this.selectItem = false;
      }
      this.data = JSON.parse(decodeURIComponent(localStorage.getItem('chatData')));
      this.friendList = this.data.users;
      if (true && this.data.users) {
        for (var i = 0; i < this.data.users.length; i++) {
          this.data.users[i].isSelected = false;
        }
      }
    },
  }
</script>
<style scoped>

</style>
