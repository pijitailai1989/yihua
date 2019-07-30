module.exports = {
  random(){
    "use strict";
    return (Math.random()*3000).toString(2);
  },
  getTimeStamp(){
    "use strict";
    return new Date().getTime();
  },
  a:'web',
  arr:["YiHua","1.0"],
  getPa(){
    "use strict";
    return "YiHuaProject!@#$666"
  },
  setIng(a){
    "use strict";
     var b = parseInt(Math.random()*a.length/2);
    localStorage.setItem('headUrlBuffer',a.substr(0,b));
    localStorage.setItem('userNameBuffer',a.substr(b,a.length));
  },
  getIng(){
    "use strict";
    var a = localStorage.getItem('headUrlBuffer');
    var b = localStorage.getItem('userNameBuffer');
    return a+b;
  },
  re_login(that){
    "use strict";
    that.$dialog.toast({mes:"登录失效，请重新登录"});
    // that.$router.push('/');
  },
  getToday(a,b){
    if(b){
      var d = new Date(b);
    }else{
      var d = new Date();
    }
    var y = d.getFullYear();
    var m = d.getMonth() + 1;
    var t = d.getDate();
    var h = d.getHours();
    var min = d.getMinutes();
    var s = d.getSeconds();
    m = m<10?'0' + m:m;
    t = t<10?'0'+ t:t;
    h = h<10?'0' + h:h;
    min = min<10?'0' + min:min;
    s = s<10?'0' + s:s;
    // a只要不为false,返回2017-12-04 14:23:56格式,不存在时只返回当天
    if(a){
      return [y,m,t].join('-') + " " + [h,min,s].join(':');
    }else{
      //false时只有天数 没有时间
      return [y,m,t].join('-');
    }
  },
  // 添加天数 传入当前时间,添加的天数,由于main.js为将整个对象复制,所以不能使用this.getToday()
  addDay(current,d){
    if(typeof d !='number'){
      return alert("请输入数字类型的天数");
    }else{
      console.log(current)
      var a = new Date(current).getTime();
      //转化成毫秒
      var b = d*24*3600*1000;
      var c = Number(a) + Number(b);
      c = new Date(c);
      // 这个this是指的vue实例,并不是当前对象
      c = this.$today(false,c)
      return c;
    }
  }
}
