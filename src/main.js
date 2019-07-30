// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
//基础样式ydUI
import "vue-ydui/dist/ydui.base.css";
import "./assets/css/common.css";
import "./assets/js/rem";
import axios from "axios";
import "./assets/js/md5";
import fn from "./assets/js/product";
import MintUI from "mint-ui";
import "mint-ui/lib/style.css";
import {DateTime} from "vue-ydui/dist/lib.rem/datetime";
import store from "./store";
import "@/assets/font/iconfont.css";
import qs from "qs";

Vue.component(DateTime.name, DateTime);
Vue.use(MintUI);
Vue.prototype.getPa = fn.getPa();
Vue.prototype.re_login = fn.re_login;
Vue.prototype.$getkey = fn.getIng;
Vue.prototype.$qs = qs;
Vue.prototype.$today = fn.getToday;
Vue.prototype.$addDay = fn.addDay;
Vue.config.productionTip = false;
const FastClick = require("fastclick");
document.addEventListener(
  "DOMContentLoaded",
  function () {
    FastClick.attach(document.body);
  },
  false
);
import YDUI from "vue-ydui";

Vue.use(YDUI);

function getPara() {
  var arr = [];
  var a = fn.random();
  var b = fn.getTimeStamp();
  arr = fn.arr;
  arr.push(fn.a);
  arr.push(a);
  arr.push(b);
  var b = arr[1] + a + b + fn.getPa();
  return {
    a: arr.join("/"),
    b: b.MD5(32)
  };
}

var obj = getPara();
Vue.directive("title", {
  inserted: function (el, binding) {
    document.title = binding.value;
  }
});
Vue.prototype.$clear = function (el) {
  setTimeout(res => {
    el.request = false;
  }, 3000);
};
Vue.prototype.subUrl = {
  bd: "bd",
  activity: "/activiti",
  user: "/user",
  login: "/user",
  logout: "/user",
  common: "/user",
  organ: "/user",
  admin: "/user/admin",
  sc: "/sc"
};
Vue.prototype.baseUrl = "http://192.168.3.234:8888";
Vue.prototype.appLink = "http://192.168.3.175:8888/"
Vue.prototype.xhr = axios.create({
  baseURL: "http://192.168.3.234:8888",
  // baseURL: 'http://120.78.155.96:8888',
  timeout: 30000,
  headers: {
    AppToken: obj.a,
    sign: obj.b
  }
});
Vue.prototype.xhr1 = axios.create({
  baseURL: "http://192.168.3.234:8888",
  // baseURL: 'http://120.78.155.96:8888',
  timeout: 30000,
  headers: {
    AppToken: obj.a,
    sign: obj.b,
    "Content-Type": "application/json"
  }
});
import {getToday} from "@/assets/js/product.js";
//自定义date filter
var oneDay = 24 * 3600 * 1000;
Vue.filter("times", function (item) {
  if (item) {
    var myDate = new Date(item).getTime();
    var d = new Date().setHours(0, 0, 0, 0) + oneDay;
    if ((d - myDate) / oneDay < 1) return "今天" + item.substr(11, 18);
    if ((d - myDate) / oneDay < 2) {
      return "昨天" + item.substr(11, 18);
    } else {
      return item;
    }
  }
});
// 将图片或视频生成本地预览地址
Vue.prototype.$getImgUrl = function (file) {
  var url = null;
  if (window.createObjectURL) {
    // basic
    url = window.createObjectURL(file);
  } else if (window.URL && typeof window.URL.createObjectURL == "function") {
    // mozilla(firefox)
    url = window.URL.createObjectURL(file);
  } else if (window.webkitURL) {
    // webkit or chrome
    url = window.webkitURL.createObjectURL(file);
  }
  return url;
};
//表单键值对上传
Vue.prototype.$ajax = function (url, data, cb, el, err) {
  el.$dialog.loading.open('加载中');
  Vue.prototype.xhr.post(url, qs.stringify(data)).then(
    res => {
      console.log(el)
      el.$dialog.loading.close();
      if (res.data.code == 1) {
        console.log(res.data.data);
        cb && cb(res.data);
      } else if (res.data.code == -902) {
        fn.re_login(el);
      } else {
        var txt = res.data.msg ? res.data.msg : "返回错误";
        console.log(txt)
        el && el.$dialog.toast({mes: txt, timeout: 1500});
      }
      el.request = false;
    },
    res => {
      err && err(res);
      el.$dialog.loading.close();
      var txt = res.data.msg ? res.data.msg : "返回错误";
      el.request = false;
      el && el.$dialog.toast({mes: txt, timeout: 1500});
    }
  );
};
// 普通json上传
Vue.prototype.$ajax1 = function (url, data, cb, el, err) {
  el.$dialog.loading.open('加载中');
  Vue.prototype.xhr1.post(url, JSON.stringify(data)).then(
    res => {
      el.$dialog.loading.close();
      if (res.data.code == 1) {
        console.log(res.data.data);
        cb && cb(res.data);
      } else if (res.data.code == -902) {
        fn.re_login(el);
      } else {
        var txt = res.data.msg ? res.data.msg : "返回错误";
        el && el.$dialog.toast({mes: txt, timeout: 1500});
      }
      el.request = false;
    },
    res => {
      err && err(res);
      el.$dialog.loading.close();
      console.log(res.data)
      var txt = res.data.msg ? res.data.msg : "返回错误";
      el && el.$dialog.toast({mes: txt, timeout: 400});
      el.request = false;
    }
  );
};
//1:租户；2:商家；3:管理处；4:物业公司；5:其他（个人）；6：业主 0为空
//根据用户类型设置主色
Vue.prototype.$color = [
  "",
  "#23ac38",
  "#fab23e",
  "#1e82d2",
  "#1e82d2",
  "#1e82d2",
  "#1e82d2",
  "#1e82d2",
];
// 辅助颜色
Vue.prototype.$fuColor = [
  "#3eb7e6",
  "#62c88c",
  "#fab23e",
  "#fa697c",
  "#adb8c0"
];

Vue.prototype.chatList = {};
var ua =
  navigator.userAgent.toLowerCase() || window.navigator.userAgent.toLowerCase();
//判断user-agent
Vue.prototype.userAgent = {
  // isWX : /MicroMessenger/i.test(ua), //微信端
  isWX: false,
  isIOS: /(iPhone|iPad|iPod|iOS)/i.test(ua), //苹果家族
  isAndroid: /(android|nexus)/i.test(ua), //安卓家族
  isWindows: /(Windows Phone|windows[\s+]phone)/i.test(ua), //微软家族
  isBlackBerry: /BlackBerry/i.test(ua) //黑莓家族
};
Vue.prototype.nim = {
  // isWX : /MicroMessenger/i.test(ua), //微信端
  isWX: false,
  isIOS: /(iPhone|iPad|iPod|iOS)/i.test(ua), //苹果家族
  isAndroid: /(android|nexus)/i.test(ua), //安卓家族
  isWindows: /(Windows Phone|windows[\s+]phone)/i.test(ua), //微软家族
  isBlackBerry: /BlackBerry/i.test(ua) //黑莓家族
};

Vue.prototype.xhr.interceptors.request.use(
  function (config) {
    // 处理请求之前的配置
    store.loading = true;
    return config;
  },
  function (error) {
    // 请求失败的处理
    return Promise.reject(error);
  }
);

// 响应拦截（配置请求回来的信息）
Vue.prototype.xhr.interceptors.response.use(
  function (response) {
    // 处理响应数据
    store.loading = false;
    return response;
  },
  function (error) {
    // 处理响应失败
    return Promise.reject(error);
  }
);
Vue.prototype.$getParams = function (url) {
  if (typeof url !== "string") {
    return {};
  } else if (url.indexOf("?") == -1) {
    return {};
  } else {
    console.log(arr, url);
    var arr = url.split("?")[1].split("&");
    var obj = {};
    console.log(arr, url);
    for (var i = 0; i < arr.length; i++) {
      var a = arr[i].split("=");
      obj[a[0]] = a[1];
    }
    return obj;
  }
};
/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  template: "<App/>",
  components: {App}
});

function setupWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(WebViewJavascriptBridge);
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback);
  }
  window.WVJBCallbacks = [callback];
  var WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'https://__bridge_loaded__';
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function () {
    document.documentElement.removeChild(WVJBIframe)
  }, 0)
}

Vue.prototype.$back = function (el) {
  console.log(11)
  if (el.$route.query.token) {
    if (Vue.prototype.userAgent.isAndroid) {
      console.log('执行安卓的方法')
      window.WebViewJavascriptBridge.callHandler(
        "doBack",
        {param: ""},
        function () {
        }
      );
      // 是IOS时那边有监听下列url
    } else if (Vue.prototype.userAgent.isIOS) {
      console.log('执行ios的方法')
      setupWebViewJavascriptBridge(function (bridge) {
        /* Initialize your app here */
        bridge.registerHandler('toIOSApp', function (data, responseCallback) {
          console.log("reciviceDate", data)
          responseCallback(data)
        })
        bridge.callHandler('toNativeApp', {'service': 'el is a test data'}, function responseCallback(responseData) {
          console.log("JS received response:", responseData)
        })
      })
    } else {
      console.log('执行其他的方法')
      // 非这两种机型时退回主页面
      el.$router.go(-1);
    }
  } else {
    console.log('执行微信的方法')
    el.$router.go(-1);
  }
};
//获取用户信息
Vue.prototype.$getUserInfo = function (cb, el) {
  let data = {
    token: el.$route.query.token
      ? el.$route.query.token
      : el.$getkey(),
    userId: el.$route.query.userId
      ? el.$route.query.userId
      : el.userInfo.guid
  };
  el.$ajax(
    `${el.subUrl.user}/user/getUserInfo`,
    data,
    res => {
      el.userInfo = res.data.userInfo;
      el.organInfo = res.data.organInfo;
      localStorage.setItem(
        "userInfo",
        encodeURIComponent(JSON.stringify(res.data.userInfo))
      );
      localStorage.setItem(
        "organInfo",
        encodeURIComponent(JSON.stringify(res.data.organInfo))
      );
      // localStorage.setItem("to", encodeURIComponent(el.$route.query.token));
      fn.setIng(el.$route.query.token);
      var a = res.data.userInfo.organType;
      var b = res.data.userInfo.admin ? 1 : 0;
      localStorage.setItem("organType", a);
      localStorage.setItem("isManger", b);
      localStorage.setItem("user_Id", res.data.userInfo.guid);
      el.mainColor = el.$color[res.data.userInfo.organType];
      localStorage.setItem('mainColor', el.mainColor)
      cb && cb(res.data);
    },
    el
  );
};

//跳转页面
function toIOSApp(callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(WebViewJavascriptBridge);
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback);
  }
  window.WVJBCallbacks = [callback];
  var WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'https://__bridge_loaded__';
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function () {
    document.documentElement.removeChild(WVJBIframe)
  }, 0)
}

Vue.prototype.$turnTo = function (url, el) {
  if (!el.userInfo.isEnabled)
    return el.$dialog.alert({mes: "账号审核中，通过审核后才可体验完整功能"});
  console.log('执行了');
  console.log(`/#${url}`)
  if (el.$route.query.token && this.$route.query.userId) {
    if (el.userAgent.isAndroid) {
      console.log('执行安卓的跳转');
      window.WebViewJavascriptBridge.callHandler(
        "jumpTo",
        {param: `/#${url}`},
        function () {

        }
      );
    } else {
      console.log('执行ios的跳转');
      toIOSApp(function (bridge) {
        /* Initialize your app here */
        bridge.registerHandler('reciveCircle', function (data, responseCallback) {
          console.log("reciviceDate", data);
          responseCallback(data)
        });
        console.log(`/#${url}`)
        bridge.callHandler('circleLink', {'service': `/#${url}`}, function responseCallback(responseData) {
          console.log("JS received response:", responseData)
        })
        // alert(`${el.appLink}#/rent/circle/article/${guid}`)
      })
    }
  }else {
    el.$router.push(url)
  }

};


