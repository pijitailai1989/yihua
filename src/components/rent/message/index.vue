<template>
  <div class="template" v-title="'企信'">
    <!--<div class="chat-list">-->
    <!--<div @click="selectList" class="left-div" v-bind:class="isChat?'active':''">会话</div>-->
    <!--<div @click="selectList" v-bind:class="!isChat?'active':''">列表</div>-->
    <!--</div>-->
    <div>
      <div class="chat-list" @click="addTeam">
        <img class="m-right l-right" src="../../../assets/images/rent/my/left_job_list.png">
        <div>创建群聊</div>
      </div>
      <div class="chat-list" @click="lookFriends">
        <img class="m-right l-right" src="../../../assets/images/rent/my/left_job_list.png">
        <div>联系人</div>
      </div>

      <div style="margin-top: 1em">
        <div class="chat-list" v-for="item,index in data.teams" @click="toTeamChat(item.teamId)">
          <img class="m-right l-right" src="http://yx-web.nos.netease.com/webdoc/h5/im/icons.png">
          <div class="get-ms-list">{{item.name}}<br>
            <div class="warn-circle text-center"
                 v-for="it in data.sessions" v-if="data.sessions&&item.teamId==it.id.split('-')[1]&&it.unread*1!=0">{{it.unread}}未读</div>
            <span v-for="it in data.sessions" v-if="it.id.split('-')[1]*1==item.teamId*1">
          {{it.lastMsg.fromNick?it.lastMsg.fromNick+'：'+it.lastMsg.text:''}}
        </span>
          </div>
          <div class="right-time pull-right">
            {{
            (new Date(item.updateTime * 1)).getMinutes() / 10 >= 1 ?
            (new Date(item.updateTime * 1)).getHours() + ":" + (new Date(item.updateTime * 1)).getMinutes() :
            (new Date(item.updateTime * 1)).getHours() + ":" + '0' + (new Date(item.updateTime * 1)).getMinutes()}}
          </div>
        </div>
        <div class="chat-list" v-for="item,index in data.sessions" @click="toChat(item.id)" v-if="item.id&&item.scene!='team'&&!item.teamId">
          <p v-head style="height: 0"><img class="m-right l-right" :src="item.id"></p>
          <div class="get-ms-list" v-for="it in data.users" v-if="item.id.split('-')[1]==it.account">
            {{it.nick}}{{item.from}}<br><div class="warn-circle text-center" v-if="item.unread*1!=0">{{item.unread}}未读</div>
            <span>
          {{item.lastMsg.text ||'文件'||'暂无消息'}}
        </span></div>
          <div class="right-time pull-right">{{
            (new Date(item.updateTime * 1)).getMinutes() / 10 >= 1 ?
              (new Date(item.updateTime * 1)).getHours() + ":" + (new Date(item.updateTime * 1)).getMinutes() :
              (new Date(item.updateTime * 1)).getHours() + ":" + '0' + (new Date(item.updateTime * 1)).getMinutes()}}
          </div>
        </div>
      </div>
      <div v-if="nim.isIOS" style="width: 100%;height: 3em">13</div>
      <!--{{this.data.sessions[1].lastMsg}}-->
      <!--v-for="item,index in friendList"-->
      <div class="chat-lists" v-if="!isChat">

      </div>
    </div>

    <!--企信{{friendList[0]}}<br>-->
    <!--{{hasNewMsg}}-->
  </div>
</template>
<script>
  import '@/assets/css/manager.css';
  //  import {getSession} from '../../../lib/utils'

  export default {
    data() {
      return {
        userInfo: {},
        organInfo: {},
        chatList: {},
        data: {},
        nim: '',
        msg: '',
        isChat: true,
      }
    },
    directives: {
      head: {
        inserted: function (el, binding) {
          var object = el.innerHTML;
          var data = JSON.parse(decodeURIComponent(localStorage.getItem('chatData')));
          for (var i = 0; i < data.users.length; i++) {
            if (object.split('p2p-')[1].split('" class')[0] * 1 == data.users[i].account * 1) {
              el.innerHTML = '<img src="' + data.users[i].avatar + '" class="m-right l-right">'
            } else {
              console.log('没有图片')
            }
          }
        }
      }
    },
    methods: {
      getTeamNum(){
        this.nim.getTeamMembers({
          teamId: '210020969',
          done: this.getTeamMembersDone
        });
      },
      addNo(){
        this.nim.addTeamMembers({
          teamId: '221336667',
          accounts: ['383935200297484288','383935200297484288', '385788811705057280','385788811705057280'],
          ps: '加入我们的群吧',
          done: this.addTeamMembersDone
        })
      },
      addTeamMembersDone(error, obj) {
        console.log(error);
        console.log(obj);
        console.log('入群邀请发送' + (!error?'成功':'失败'));
      },
      getTeamMembersDone(error, obj) {
        console.log(error);
        console.log(obj);
        console.log('获取群成员' + (!error?'成功':'失败'));
        if (!error) {
          this.onTeamMembers(obj);
        }
      },
      createTeam(){
        this.nim.createTeam({
          type: 'normal',
          name: '普通群',
          avatar: 'avatar',
          accounts: ['383935200297484288', '385788811705057280'],
          ps: '我建了一个普通群',
          done: this.createTeamDone
        });
      },
      createTeamDone(error, obj) {
        console.log(error);
        console.log(obj);
        console.log('创建' + obj.team.type + '群' + (!error?'成功':'失败'));
        if (!error) {
          this.onCreateTeam(obj.team, obj.owner);
        }
      },
      toChat(data) {
        this.$router.push('/message/sessions?id=' + data)
      },
      lookFriends() {
        this.$router.push('/message/friends')
      },
      addTeam(){
        this.$router.push('/message/create_team')
      },
      toTeamChat(data) {
        this.$router.push('/message/sessions?teamId=' + data)
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
        localStorage.setItem('nim',this.nim)
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
        this.onTeamMembers({
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
        this.data.sessions=[]
        this.data.sessions = this.nim.mergeSessions(this.data.sessions, sessions);
        var data = this.data;
        this.data = '';
        this.data = data;
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.updateSessionsUI();
      },
      onUpdateSession(session) {
        var data = this.data;
        this.data = '';
        this.data = data;
        console.log('会话更新了', session);
        navigator.vibrate(1000);
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
//      this.sendMsg();
      if (localStorage.getItem('chatData')) {
        this.data = JSON.parse(decodeURIComponent(localStorage.getItem('chatData')));
      }
      console.log(this.data.teams)
      this.getFriendList();
      this.getTeamNum();
//      this.addNo();
//      this.createTeam();
//      console.log(this.data.teams)
//      console.log(this.data.msgs)
    },
  }
</script>
<style scoped>

</style>
