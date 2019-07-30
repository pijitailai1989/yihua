export default [{
  path: "/enterprise",
  component: outPut =>
    require([
      "@/components/rent/my/enterprise/index"
    ], outPut)
}, {
  path: "/taskProcess",
  component: outPut =>
    require([
      "@/components/rent/my/enterprise/taskProcess/index"
    ], outPut)
},
  {
    path: "/taskProcess/add",
    component: outPut =>
      require([
        "@/components/rent/my/enterprise/taskProcess/add"

      ], outPut)
  }, {
    path: "/taskProcess/detail/:id",
    component: outPut =>
      require([
        "@/components/rent/my/enterprise/taskProcess/detail"
      ], outPut)
  }, {
    path: "/taskProcess/tongzhi",
    component: outPut =>
      require([
        "@/components/rent/my/enterprise/taskProcess/tongzhi"
      ], outPut)
  }, {
    path: "/taskProcess/update/:id",
    component: outPut =>
      require([
        "@/components/rent/my/enterprise/taskProcess/updateProgress"
      ], outPut)
  }, {
    path: "/taskProcess/updateDetail/:id",
    component: outPut =>
      require([
        "@/components/rent/my/enterprise/taskProcess/updateDetail"
      ], outPut)
  },
  //人员管理
  {
    path: "/personManger",
    component: outPut =>
      require([
        "@/components/rent/my/enterprise/personManger/index"
      ], outPut)
  },

  //汇报进度
  {
    path: "/taskreplay",
    component: outPut =>
      require([
        "@/components/rent/my/enterprise/taskreplay/index"
      ], outPut)
  }, {
    path: "/taskreplay/add",
    component: outPut =>
      require([
        "@/components/rent/my/enterprise/taskreplay/add"

      ], outPut)
  }, {
    path: "/taskreplay/detail/:id",
    component: outPut =>
      require([
        "@/components/rent/my/enterprise/taskreplay/detail"
      ], outPut)
  }, {
    path: "/myassistant",
    component: outPut =>
      require([
        "@/components/rent/my/enterprise/myassistant/index"
      ], outPut)
  }, {
    path: "/supplyManager",
    component: outPut =>
      require([
        "@/components/rent/my/enterprise/supplyManager/index"
      ], outPut)
  }, {
    path: "/supplyManager/add",
    component: outPut =>
      require([
        "@/components/rent/my/enterprise/supplyManager/add"
      ], outPut)
  }, {
    path: "/supplyManager/detail",
    component: outPut =>
      require([
        "@/components/rent/my/enterprise/supplyManager/detail"
      ], outPut)
  }];

