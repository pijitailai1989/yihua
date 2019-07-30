//

export function loginIm() {
  var data = {};

  var nim = SDK.NIM.getInstance({
    // 初始化SDK
    debug: true,
//        appKey: 'appKey',
//        account: 'account',
//        token: 'token',
    appKey: '153515f757d49b6ee524c876482d0a7b',
    account: JSON.parse(decodeURIComponent(localStorage.getItem('userInfo'))).guid,
    token: JSON.parse(decodeURIComponent(localStorage.getItem('userInfo'))).imToken,
  })

}

export function getSession() {
  var data = {}
  var nim = SDK.NIM.getInstance({
    // 初始化SDK
    debug: false,
//        appKey: 'appKey',
//        account: 'account',
//        token: 'token',
    appKey: '153515f757d49b6ee524c876482d0a7b',
    account: JSON.parse(decodeURIComponent(localStorage.getItem('userInfo'))).guid,
    token: JSON.parse(decodeURIComponent(localStorage.getItem('userInfo'))).imToken,
    onconnect: onConnect,
    onerror: onError,
    onwillreconnect: onWillReconnect,
    ondisconnect: onDisconnect,
    // 多端登录
    onloginportschange: onLoginPortsChange,
    // 用户关系
    onblacklist: onBlacklist,
    onsyncmarkinblacklist: onMarkInBlacklist,
    onmutelist: onMutelist,
    onsyncmarkinmutelist: onMarkInMutelist,
    // 好友关系
    onfriends: onFriends,
    onsyncfriendaction: onSyncFriendAction,
    // 用户名片
    onmyinfo: onMyInfo,
    onupdatemyinfo: onUpdateMyInfo,
    onusers: onUsers,
    onupdateuser: onUpdateUser,
    onrobots: onRobots,
    // 群组
    onteams: onTeams,
    onsynccreateteam: onCreateTeam,
    onteammembers: onTeamMembers,
    onsyncteammembersdone: onSyncTeamMembersDone,
    onupdateteammember: onUpdateTeamMember,
    // 会话
    onsessions: onSessions,
    onupdatesession: onUpdateSession,
    // 消息
    onroamingmsgs: onRoamingMsgs,
    onofflinemsgs: onOfflineMsgs,
    onmsg: onMsg,
    // 系统通知
    onofflinesysmsgs: onOfflineSysMsgs,
    onsysmsg: onSysMsg,
    onupdatesysmsg: onUpdateSysMsg,
    onsysmsgunread: onSysMsgUnread,
    onupdatesysmsgunread: onUpdateSysMsgUnread,
    onofflinecustomsysmsgs: onOfflineCustomSysMsgs,
    oncustomsysmsg: onCustomSysMsg,
    onbroadcastmsg: onBroadcastMsg,
    onbroadcastmsgs: onBroadcastMsgs,
    // 同步完成
    onsyncdone: onSyncDone
  });

  var onConnect=function() {
    console.log('连接成功');
  }

   var onWillReconnect=function(obj) {
    // 此时说明 `SDK` 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
    console.log('即将重连');
    console.log(obj.retryCount);
    console.log(obj.duration);
  }

  var onDisconnect=function(error) {
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
  }

  var onError=function(error) {
    console.log(error);
  }

  function onLoginPortsChange(loginPorts) {
    console.log('当前登录帐号在其它端的状态发生改变了', loginPorts);
  }

  function onBlacklist(blacklist) {
    console.log('收到黑名单', blacklist);
    data.blacklist = nim.mergeRelations(data.blacklist, blacklist);
    data.blacklist = nim.cutRelations(data.blacklist, blacklist.invalid);
    refreshBlacklistUI();
  }

  function onMarkInBlacklist(obj) {
    console.log(obj);
    console.log(obj.account + '被你在其它端' + (obj.isAdd ? '加入' : '移除') + '黑名单');
    if (obj.isAdd) {
      addToBlacklist(obj);
    } else {
      removeFromBlacklist(obj);
    }
  }

  function addToBlacklist(obj) {
    data.blacklist = nim.mergeRelations(data.blacklist, obj.record);
    refreshBlacklistUI();
  }

  function removeFromBlacklist(obj) {
    data.blacklist = nim.cutRelations(data.blacklist, obj.record);
    refreshBlacklistUI();
  }

  function refreshBlacklistUI() {
    // 刷新界面
  }

  function onMutelist(mutelist) {
    console.log('收到静音列表', mutelist);
    data.mutelist = nim.mergeRelations(data.mutelist, mutelist);
    data.mutelist = nim.cutRelations(data.mutelist, mutelist.invalid);
    refreshMutelistUI();
  }

  function onMarkInMutelist(obj) {
    console.log(obj);
    console.log(obj.account + '被你' + (obj.isAdd ? '加入' : '移除') + '静音列表');
    if (obj.isAdd) {
      addToMutelist(obj);
    } else {
      removeFromMutelist(obj);
    }
  }

  function addToMutelist(obj) {
    data.mutelist = nim.mergeRelations(data.mutelist, obj.record);
    refreshMutelistUI();
  }

  function removeFromMutelist(obj) {
    data.mutelist = nim.cutRelations(data.mutelist, obj.record);
    refreshMutelistUI();
  }

  function refreshMutelistUI() {
    // 刷新界面
  }

  function onFriends(friends) {
    console.log('收到好友列表', friends);
    data.friends = nim.mergeFriends(data.friends, friends);
    data.friends = nim.cutFriends(data.friends, friends.invalid);
    refreshFriendsUI();
  }

  function onSyncFriendAction(obj) {
    console.log(obj);
    switch (obj.type) {
      case 'addFriend':
        console.log('你在其它端直接加了一个好友' + obj.account + ', 附言' + obj.ps);
        onAddFriend(obj.friend);
        break;
      case 'applyFriend':
        console.log('你在其它端申请加了一个好友' + obj.account + ', 附言' + obj.ps);
        break;
      case 'passFriendApply':
        console.log('你在其它端通过了一个好友申请' + obj.account + ', 附言' + obj.ps);
        onAddFriend(obj.friend);
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
  }

  function onAddFriend(friend) {
    data.friends = nim.mergeFriends(data.friends, friend);
    refreshFriendsUI();
  }

  function onDeleteFriend(account) {
    data.friends = nim.cutFriendsByAccounts(data.friends, account);
    refreshFriendsUI();
  }

  function onUpdateFriend(friend) {
    data.friends = nim.mergeFriends(data.friends, friend);
    refreshFriendsUI();
  }

  function refreshFriendsUI() {
    // 刷新界面
  }

  function onMyInfo(user) {
    console.log('收到我的名片', user);
    data.myInfo = user;
    updateMyInfoUI();
  }

  function onUpdateMyInfo(user) {
    console.log('我的名片更新了', user);
    data.myInfo = NIM.util.merge(data.myInfo, user);
    updateMyInfoUI();
  }

  function updateMyInfoUI() {
    // 刷新界面
  }

  function onUsers(users) {
    console.log('收到用户名片列表', users);
    data.users = nim.mergeUsers(data.users, users);
  }

  function onUpdateUser(user) {
    console.log('用户名片更新了', user);
    data.users = nim.mergeUsers(data.users, user);
  }

  function onRobots(robots) {
    console.log('收到机器人列表', robots);
    data.robots = robots;
  }

  function onTeams(teams) {
    console.log('群列表', teams);
    data.teams = nim.mergeTeams(data.teams, teams);
    onInvalidTeams(teams.invalid);
  }

  function onInvalidTeams(teams) {
    data.teams = nim.cutTeams(data.teams, teams);
    data.invalidTeams = nim.mergeTeams(data.invalidTeams, teams);
    refreshTeamsUI();
  }

  function onCreateTeam(team) {
    console.log('你创建了一个群', team);
    data.teams = nim.mergeTeams(data.teams, team);
    refreshTeamsUI();
    onTeamMembers({
      teamId: team.teamId,
      members: owner
    });
  }

  function refreshTeamsUI() {
    // 刷新界面
  }

  function onTeamMembers(teamId, members) {
    // console.log('群id', teamId, '群成员', members);
    // var teamId = obj.teamId;
    // var members = obj.members;
    // data.teamMembers = data.teamMembers || {};
    // data.teamMembers[teamId] = nim.mergeTeamMembers(data.teamMembers[teamId], members);
    // data.teamMembers[teamId] = nim.cutTeamMembers(data.teamMembers[teamId], members.invalid);
    refreshTeamMembersUI();
  }

  function onSyncTeamMembersDone() {
    console.log('同步群列表完成');
  }

  function onUpdateTeamMember(teamMember) {
    console.log('群成员信息更新了', teamMember);
    onTeamMembers({
      teamId: teamMember.teamId,
      members: teamMember
    });
  }

  function refreshTeamMembersUI() {
    // 刷新界面
  }

  function onSessions(sessions) {
    alert(123);
    console.log(sessions);
    alert(sessions)
    console.log('收到会话列表', sessions);
    data.sessions = nim.mergeSessions(data.sessions, sessions);
    updateSessionsUI();
  }

  function onUpdateSession(session) {
    console.log('会话更新了', session);
    data.sessions = nim.mergeSessions(data.sessions, session);
    updateSessionsUI();
  }

  function updateSessionsUI() {
    // 刷新界面
  }

  function onRoamingMsgs(obj) {
    console.log('漫游消息', obj);
    pushMsg(obj.msgs);
  }

  function onOfflineMsgs(obj) {
    console.log('离线消息', obj);
    pushMsg(obj.msgs);
  }

  function onMsg(msg) {
    console.log('收到消息', msg.scene, msg.type, msg);
    pushMsg(msg);
  }

  function onBroadcastMsg(msg) {
    console.log('收到广播消息', msg);
  }

  function onBroadcastMsgs(msgs) {
    console.log('收到广播消息', msgs);
  }

  function pushMsg(msgs) {
    if (!Array.isArray(msgs)) {
      msgs = [msgs];
    }
    var sessionId = msgs[0].sessionId;
    data.msgs = data.msgs || {};
    data.msgs[sessionId] = nim.mergeMsgs(data.msgs[sessionId], msgs);
  }

  function onOfflineSysMsgs(sysMsgs) {
    console.log('收到离线系统通知', sysMsgs);
    pushSysMsgs(sysMsgs);
  }

  function onSysMsg(sysMsg) {
    console.log('收到系统通知', sysMsg)
    pushSysMsgs(sysMsg);
  }

  function onUpdateSysMsg(sysMsg) {
    pushSysMsgs(sysMsg);
  }

  function pushSysMsgs(sysMsgs) {
    data.sysMsgs = nim.mergeSysMsgs(data.sysMsgs, sysMsgs);
    refreshSysMsgsUI();
  }

  function onSysMsgUnread(obj) {
    console.log('收到系统通知未读数', obj);
    data.sysMsgUnread = obj;
    refreshSysMsgsUI();
  }

  function onUpdateSysMsgUnread(obj) {
    console.log('系统通知未读数更新了', obj);
    data.sysMsgUnread = obj;
    refreshSysMsgsUI();
  }

  function refreshSysMsgsUI() {
    // 刷新界面
  }

  function onOfflineCustomSysMsgs(sysMsgs) {
    console.log('收到离线自定义系统通知', sysMsgs);
  }

  function onCustomSysMsg(sysMsg) {
    console.log('收到自定义系统通知', sysMsg);
  }

  function onSyncDone() {
    console.log('同步完成');
  }
  localStorage.setItem('chat',encodeURIComponent(JSON.stringify(data)));
}


export function sendImgServer(getData, xhr, subUrl, data, e) {
//   getData={};
//   let file = e.target.files[0];
//   let d = new Date();
//   let type = file.name.split('.');
//   let tokenParem = {
//     'putPolicy':'{\"name\":\"$(fname)\",\"size\":\"$(fsize)\",\"w\":\"$(imageInfo.width)\",\"h\":\"$(imageInfo.height)\",\"hash\":\"$(etag)\"}',
//     'key':'orderReview/'+d.getFullYear()+'/'+(d.getMonth()+1)+'/'+d.getDate()+'/'+d.valueOf()+'.'+type[type.length-1],
//     'bucket':'http://oysfye6yt.bkt.clouddn.com',//七牛的地址，这个是你自己配置的（变量）
//   };
//   let param = new FormData(); //创建form对象
//   param.append('chunk','0');//断点传输
//   param.append('chunks','1');
//   param.append('file',file,file.name)
//   let config = {
//     headers:{'Content-Type':'multipart/form-data'}
//   };
//   xhr.post(`${subUrl.user}/qiniu/getInfo?token=`+data.token).then((res) => {
//     if (res.data.code == 1) {
// //            console.log(res.data.data.token)
//       getData.data=res.data.data;
//       param.append('token',getData.data.token);
// //            if(this.images.length>8){
// //              alert('不能超过9张');
// //              return;
// //            }
//       xhr.post('http://up-z2.qiniu.com',param,config)
//         .then(response=>{
//           getData.dataFromQiniu=response.data;
//           getData.imageUrl=getData.data.domain+'/'+response.data.key;
//           console.log(getData.imageUrl)
//           // return getData
//           // let localArr = this.images.map((val,index,arr)=>{
//           //   return arr[index].localSrc;
//           // })
//           // if(!~localArr.indexOf(pathName)){
//           //   this.images.push({'src':this.showUrl+response.data.key,'localSrc':pathName});
//           //   this.showLogo=true;
//           // }else{
//           //   alert('已上传该图片');
//           // }
//         })
//     } else if (res.data.code == '-902') {//-902
//       /*重新登录*/
//       // fn.re_login(this);
//     } else {
//       this.$dialog.toast({mes: res.data.msg});
//     }
//   })
  return getData;
}
