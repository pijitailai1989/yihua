export default [{
    path: "/estate/serviceList/rectification/add",
    component: outPut =>
      require([
        "@/components/rent/estate/serviceList/rectification/add"
      ], outPut)
  },
  {
    path: "/estate/serviceList/wuye/rectification/add",
    component: outPut =>
      require([
        "@/components/rent/estate/serviceList/wuye/rectification/add"
      ], outPut)
  },
  {
    path: "/estate/serviceList/wuye/complain",
    component: complain =>
      require([
        "@/components/rent/estate/serviceList/wuye/complain/index"
      ], complain)
  },
  // 退租
  {
    path: "/estate/serviceList/wuye/exit_rent",
    component: output =>
      require([
        "@/components/rent/estate/serviceList/wuye/exit_rent/index"
      ], output)
  },
  // 放行条
  {
    path: '/estate/serviceList/wuye/release_pass',
    component: release_pass => require(['@/components/rent/estate/serviceList/wuye/release_pass/index'], release_pass)
  },
  {
    path: '/estate/serviceList/wuye/release_pass/declares',
    component: declares => require(['@/components/rent/estate/serviceList/wuye/release_pass/declares'], declares)
  },
  {
    path: '/estate/serviceList/wuye/release_pass/details',
    component: details => require(['@/components/rent/estate/serviceList/wuye/release_pass/details'], details)
  },
  {
    path: '/estate/serviceList/wuye/release_pass/add',
    component: add => require(['@/components/rent/estate/serviceList/wuye/release_pass/add'], add)
  },
  //租赁询问
  {
    path: '/estate/serviceList/wuye/lease',
    component: lease => require(['@/components/rent/estate/serviceList/wuye/lease/index'], lease)
  },
  {
    path: '/estate/serviceList/lease/add',
    component: lease => require(['@/components/rent/estate/serviceList/lease/add'], lease)
  }, {
    path: '/estate/serviceList/wuye/lease/add',
    component: lease => require(['@/components/rent/estate/serviceList/wuye/lease/add'], lease)
  },
  // 外勤服务
  {
    path: "/estate/serviceList/waiqing",
    component: output => require(['@/components/rent/estate/serviceList/waiqing/index'], output)
  },
  {
    path: "/estate/serviceList/waiqing/detail",
    component: output => require(['@/components/rent/estate/serviceList/waiqing/order_details'], output)
  },
  {
    path: "/estate/serviceList/waiqing/setting",
    component: output => require(['@/components/rent/estate/serviceList/waiqing/setting'], output)
  },
  // 特约写字楼
  {
    path: "/estate/serviceList/building",
    component: output => require(['@/components/rent/estate/serviceList/building/index'], output)
  }, {
    path: "/estate/serviceList/building/operate",
    component: output => require(['@/components/rent/estate/serviceList/building/operate'], output)
  },
  {
    path: "/estate/serviceList/building/detail",
    component: output => require(['@/components/rent/estate/serviceList/building/detail'], output)
  },
  // 入驻
  {
    path: "/estate/serviceList/setting",
    component: output => require(['@/components/rent/estate/serviceList/setting/index'], output)
  }, {
    path: "/estate/serviceList/setting/add",
    component: output => require(['@/components/rent/estate/serviceList/setting/add'], output)
  },{
    path: "/estate/serviceList/setting/add",
    component: output => require(['@/components/rent/estate/serviceList/setting/add'], output)
  },{
    path: "/estate/serviceList/wuye/lease/details",
    component: output => require(['@/components/rent/estate/serviceList/wuye/lease/detail'], output)
  }
];
