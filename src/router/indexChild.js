export default [
  //物业管理
  {
    path: '/property',
    component: property => require(['@/components/rent/property/index'], property)
  },
  //项目管理
  {
    path: '/property/project_management',
    component: project_management => require(['@/components/rent/property/project_management'], project_management)
  },
  {
    path: '/property/management_details',
    component: management_details => require(['@/components/rent/property/management_details'], management_details)
  },
  {
    path: '/property/search',
    component: search => require(['@/components/rent/property/search'], search)
  },
  //物业通知
  {
    path: '/property/property_notice',
    component: property_notice => require(['@/components/rent/property/property_notice'], property_notice)
  },
  {
    path: '/property/release_notice1',
    component: release_notice1 => require(['@/components/rent/property/release_notice1'], release_notice1)
  },
  {
    path: '/property/objectList',
    component: objectList => require(['@/components/rent/property/objectList'], objectList)
  },
  {
    path: '/property/notice_details',
    component: notice_details => require(['@/components/rent/property/notice_details'], notice_details)
  },
  //物业稽查
  {
    path: '/property/property_inspection',
    component: property_inspection => require(['@/components/rent/property/property_inspection'], property_inspection)
  },
  {
    path: '/property/audit_report',
    component: audit_report => require(['@/components/rent/property/audit_report'], audit_report)
  },
  {
    path: '/property/inspection_details',
    component: inspection_details => require(['@/components/rent/property/inspection_details'], inspection_details)
  },
  //本地服务
  {
    path: '/local',
    component: local => require(['@/components/rent/local/index'], local)
  },
 //业主
  {
    path: '/house',
    component: house => require(['@/components/rent/house/index'], house)
  },
  {
    path: '/house/details',
    component: details => require(['@/components/rent/house/details'], details)
  },
  {
    path: '/house/explain',
    component: explain => require(['@/components/rent/house/explain'], explain)
  },
  //管理处月报
  {
    path: '/monthly',
    component: monthly => require(['@/components/rent/monthly/index'], monthly)
  },
  {
    path: '/monthly/details',
    component: details => require(['@/components/rent/monthly/details'], details)
  },
  {
    path: '/monthly/detailss',
    component: detailss => require(['@/components/rent/monthly/detailss'], detailss)
  },
  {
    path: '/monthly/next_plan',
    component: next_plan => require(['@/components/rent/monthly/next_plan'], next_plan)
  },
  {
    path: '/monthly/department_detail',
    component: department_detail => require(['@/components/rent/monthly/department_detail'], department_detail)
  },
  //财务审批
  {
    path: '/finance/reply',
    component: reply => require(['@/components/rent/finance/reply'], reply)
  },
  {
    path: '/finance/details',
    component: details => require(['@/components/rent/finance/details'], details)
  },
  {
    path: '/finance',
    component: finance => require(['@/components/rent/finance/index'], finance)
  },
  //关系管理
  {
    path: '/relation',
    component: relation => require(['@/components/rent/relation/index'], relation)
  },
  {
    path: '/relation/details',
    component: details => require(['@/components/rent/relation/details'], details)
  },
  //供求市场部分；
  {
    path: '/supplys',
    component: supply_demand => require(['@/components/rent/supply/supply_demand'], supply_demand),
    children: [
      {
        path: '/supply/find',
        name: 'supply_find',
        component: find => require(['@/components/rent/supply/find/index'], find)
      },
      {
        path: '/supply/product',
        name: 'product',
        component: product => require(['@/components/rent/supply/product/index'], product)
      },
      {
        path: '/supply/purchase',
        name: 'purchase',
        component: purchase => require(['@/components/rent/supply/purchase/index'], purchase)
      },
    ]
  },
  //app需要返回
  {
    path: '/supply/find/details/:guid',
    component: details => require(['@/components/rent/supply/find/details'], details)
  },
  {
    path: '/supply/purchase/release_purchase',
    component: release_purchase => require(['@/components/rent/supply/purchase/release_purchase'], release_purchase)
  },
  {
    path: '/supply/purchase/tender_invitation',
    component: tender_invitation => require(['@/components/rent/supply/purchase/tender_invitation'], tender_invitation)
  },
  {
    path: '/supply/purchase/merchant_quotation',
    component: merchant_quotation => require(['@/components/rent/supply/purchase/merchant_quotation'], merchant_quotation)
  },
  {
    path: '/supply/purchase/classification',
    component: classification => require(['@/components/rent/supply/purchase/classification'], classification)
  },
  //报价列表
  {
    path: '/supply/purchase/quote_list/:type/:guid',
    component: quote_list => require(['@/components/rent/supply/purchase/quote_list'], quote_list)
  },
  //产品收藏
  {
    path: '/supply/purchase/product_collection',
    component: product_collection => require(['@/components/rent/supply/purchase/product_collection'], product_collection)
  },
  //我的详情
  {
    path: '/supply/purchase/my_details/:type/:guid',
    component: my_details => require(['@/components/rent/supply/purchase/my_details'], my_details)
  },
  {
    path: '/supply/product/my_details1/:type/:guid',
    component: my_details1 => require(['@/components/rent/supply/product/my_details1'], my_details1)
  },
  //供应商详情
  {
    path: '/supply/purchase/supplier_details',
    component: supplier_details => require(['@/components/rent/supply/purchase/supplier_details'], supplier_details)
  },
  //黑名单
  {
    path: '/supply/purchase/blacklist',
    component: blacklist => require(['@/components/rent/supply/purchase/blacklist'], blacklist)
  },
  {
    path: '/supply/purchase/my_supplier',
    component: my_supplier => require(['@/components/rent/supply/purchase/my_supplier'], my_supplier)
  },
  {
    path: '/supply/purchase/my_inquiry',
    component: my_inquiry => require(['@/components/rent/supply/purchase/my_inquiry'], my_inquiry)
  },
  //app需要返回跳转
  {
    path: '/supply/purchase/details/:type/:guid',
    component: details => require(['@/components/rent/supply/purchase/details'], details)
  },
  //
  //发布产品
  {
    path: '/supply/product/release_products',name:'release_products',
    component: release_products => require(['@/components/rent/supply/product/release_products'], release_products)
  },
  {
    path: '/supply/product/classification',
    component: classification => require(['@/components/rent/supply/product/classification'], classification)
  },
  //团购设置
  {
    path: '/supply/product/group_set',
    component: group_set => require(['@/components/rent/supply/product/group_set'], group_set)
  },
  //我的商机
  {
    path: '/supply/product/my_business',
    component: my_business => require(['@/components/rent/supply/product/my_business'], my_business)
  },
  {
    path: '/supply/product/my_businesss',
    component: my_businesss => require(['@/components/rent/supply/product/my_businesss'], my_businesss)
  },
  //层级列表
  {
    path: '/supply/product/level_list/:type/:guid',
    component: level_list => require(['@/components/rent/supply/product/level_list'], level_list)
  },
  //客户详情
  {
    path: '/supply/product/customer_details',
    component: customer_details => require(['@/components/rent/supply/product/customer_details'], customer_details)
  },
  {
    path: '/supply/product/purchase_collection',
    component: purchase_collection => require(['@/components/rent/supply/product/purchase_collection'], purchase_collection)
  },
  // 我的客户
   {
    path: '/supply/product/my_customer',
    component: my_customer => require(['@/components/rent/supply/product/my_customer'], my_customer)
  },
  // 我的名片
  {
    path: '/supply/product/my_card',
    component: my_card => require(['@/components/rent/supply/product/my_card'], my_card)
  },
  {
    path: '/supply/product/card_manage',
    component: card_manage => require(['@/components/rent/supply/product/card_manage'], card_manage)
  },
  //案例管理
  {
    path: '/supply/product/case_management',
    component: case_management => require(['@/components/rent/supply/product/case_management'], case_management)
  },
  {
    path: '/supply/product/add_case_details',
    component: add_case_details => require(['@/components/rent/supply/product/add_case_details'], add_case_details)
  },
  //我的店铺
  {
    path: '/supply/product/my_shop',
    component: my_shop => require(['@/components/rent/supply/product/my_shop'], my_shop)
  },
  {
    path: '/supply/product/product_center',
    component: product_center => require(['@/components/rent/supply/product/product_center'], product_center)
  },
  //推送管理
  {
    path: '/supply/product/push_management',
    component: push_management => require(['@/components/rent/supply/product/push_management'], push_management)
  },
  {
    path: '/supply/product/push_set',
    component: push_set => require(['@/components/rent/supply/product/push_set'], push_set)
  },
  {
    path: '/supply/product/push_information',
    component: push_information => require(['@/components/rent/supply/product/push_information'], push_information)
  },

  //服务单
  {
    path: '/estate/serviceList',
    component: serviceList => require(['@/components/rent/estate/serviceList/index'], serviceList)
  },

  // 兑换提示
  {
    path: '/my/my_asset/prompt', name: 'prompt',
    component: prompt => require(['@/components/rent/my/my_asset/prompt'], prompt)
  },
  //商机详情
  {
    path: '/my/my_asset/details', name: 'assetDetails',
    component: details => require(['@/components/rent/my/my_asset/details'], details)
  },
  {
    path: '/my/local_service',
    component: local_service => require(['@/components/rent/my/local_service'], local_service)
  },
  {
    path: '/my/enterprise',
    component: enterprise => require(['@/components/rent/my/enterprise'], enterprise)
  },
  //我的圈子
  {
    path: '/rent/circle/indexApp',
    component: indexApp => require(['@/components/rent/circle/indexApp'], indexApp)
  },
  {
    path: '/my/circle',
    component: circle => require(['@/components/rent/my/circle/index'], circle)
  },
  {
    path: '/my/circle/newActivity',
    component: newActivity => require(['@/components/rent/my/circle/newActivity'], newActivity)
  },
  {
    path: '/my/circle/article/:id',
    component: article => require(['@/components/rent/my/circle/article'], article)
  },
  // 租户部分
  {
    path: '/estate/serviceList/payment',
    component: payment => require(['@/components/rent/estate/serviceList/payment/index'], payment)
  },
  {
    path: '/estate/serviceList/payment/expense/:guid',
    component: expense => require(['@/components/rent/estate/serviceList/payment/expense'], expense)
  },{
    path: '/estate/serviceList/payment/moneyset',
    component: expense => require(['@/components/rent/estate/serviceList/wuye/payment/moneySet'], expense)
  },{
    path: '/estate/serviceList/newPayment/:id',
    component: expense => require(['@/components/rent/estate/serviceList/payment/add'], expense)
  },


  {
    path: '/estate/serviceList/rectification',
    component: rectification => require(['@/components/rent/estate/serviceList/rectification/index'], rectification)
  },
  {
    path: '/estate/serviceList/rectification/details',
    component: details => require(['@/components/rent/estate/serviceList/rectification/details'], details)
  },

  {
    path: '/estate/serviceList/notice',
    component: notice => require(['@/components/rent/estate/serviceList/notice/index'], notice)
  },
  {
    path: '/estate/serviceList/notice/details',
    component: details => require(['@/components/rent/estate/serviceList/notice/details'], details)
  },

  {
    path: '/estate/serviceList/reception',
    component: reception => require(['@/components/rent/estate/serviceList/reception/index'], reception)
  },
  {
    path: '/estate/serviceList/reception/declares',
    component: declares => require(['@/components/rent/estate/serviceList/reception/declares'], declares)
  },
  {
    path: '/estate/serviceList/reception/details/:id',
    component: details => require(['@/components/rent/estate/serviceList/reception/details'], details)
  },

  {
    path: '/estate/serviceList/renovation',
    component: renovation => require(['@/components/rent/estate/serviceList/renovation/index'], renovation)
  },
  {
    path: '/estate/serviceList/renovation/declares',
    component: declares => require(['@/components/rent/estate/serviceList/renovation/declares'], declares)
  },
  {
    path: '/estate/serviceList/renovation/details',
    component: details => require(['@/components/rent/estate/serviceList/renovation/details'], details)
  },
  {
    path: '/estate/serviceList/release_pass',
    component: release_pass => require(['@/components/rent/estate/serviceList/release_pass/index'], release_pass)
  },
  {
    path: '/estate/serviceList/release_pass/declares',
    component: declares => require(['@/components/rent/estate/serviceList/release_pass/declares'], declares)
  },
  {
    path: '/estate/serviceList/release_pass/details',
    component: details => require(['@/components/rent/estate/serviceList/release_pass/details'], details)
  },
  {
    path: '/estate/serviceList/release_pass/add',
    component: add => require(['@/components/rent/estate/serviceList/release_pass/add'], add)
  },
  {
    path: '/estate/serviceList/lease',
    component: lease => require(['@/components/rent/estate/serviceList/lease/index'], lease)
  },
  {
    path: '/estate/serviceList/exit_rent',
    component: exit_rent => require(['@/components/rent/estate/serviceList/exit_rent/index'], exit_rent)
  },
  {
    path: '/estate/serviceList/exit_rent/declares',
    component: declares => require(['@/components/rent/estate/serviceList/exit_rent/declares'], declares)
  },
  {
    path: '/estate/serviceList/exit_rent/details',
    component: details => require(['@/components/rent/estate/serviceList/exit_rent/details'], details)
  },
  // 管理处部分
  {
    path: '/estate/serviceList/wuye/payment',
    component: payment => require(['@/components/rent/estate/serviceList/wuye/payment/index'], payment)
  },
  {
    path: '/estate/serviceList/wuye/payment/expense/:guid',
    component: expense => require(['@/components/rent/estate/serviceList/wuye/payment/expense'], expense)
  },{
    path: '/estate/serviceList/wuye/newPayment/:id',
    component: expense => require(['@/components/rent/estate/serviceList/wuye/payment/add'], expense)
  },


  {
    path: '/estate/serviceList/wuye/rectification',
    component: rectification => require(['@/components/rent/estate/serviceList/wuye/rectification/index'], rectification)
  },
  {
    path: '/estate/serviceList/wuye/rectification/details',
    component: details => require(['@/components/rent/estate/serviceList/wuye/rectification/details'], details)
  },

  {
    path: '/estate/serviceList/wuye/notice',
    component: notice => require(['@/components/rent/estate/serviceList/wuye/notice/index'], notice)
  },
  {
    path: '/estate/serviceList/wuye/notice/details',
    component: details => require(['@/components/rent/estate/serviceList/wuye/notice/details'], details)
  },

  {
    path: '/estate/serviceList/wuye/reception',
    component: reception => require(['@/components/rent/estate/serviceList/wuye/reception/index'], reception)
  },
  {
    path: '/estate/serviceList/wuye/reception/declares',
    component: declares => require(['@/components/rent/estate/serviceList/wuye/reception/declares'], declares)
  },
  {
    path: '/estate/serviceList/wuye/reception/details/:id',
    component: details => require(['@/components/rent/estate/serviceList/wuye/reception/details'], details)
  },

  {
    path: '/estate/serviceList/wuye/renovation',
    component: renovation => require(['@/components/rent/estate/serviceList/wuye/renovation/index'], renovation)
  },
  {
    path: '/estate/serviceList/wuye/renovation/declares',
    component: declares => require(['@/components/rent/estate/serviceList/wuye/renovation/declares'], declares)
  },
  {
    path: '/estate/serviceList/wuye/renovation/details',
    component: details => require(['@/components/rent/estate/serviceList/wuye/renovation/details'], details)
  },


  //百事通部分；
  {
    path: '/baishitong',
    component: baishitong => require(['@/components/rent/baishitong/index'], baishitong),
    children: [
      {
        path: '/baishitong/find',
        name: 'find',
        component: find => require(['@/components/rent/baishitong/find/index'], find)
      },
      {
        path: '/baishitong/myLibrary',
        name: 'myLibrary',
        component: myLibrary => require(['@/components/rent/baishitong/myLibrary/index'], myLibrary)
      },
      {
        path: '/baishitong/myWealth',
        name: 'myWealth',
        component: myWealth => require(['@/components/rent/baishitong/myWealth/index'], myWealth)
      },
    ]
  },
  {
    path: '/baishitong/find/details/:kaId',
    component: details => require(['@/components/rent/baishitong/find/details'], details)
  },
  {
    path: '/baishitong/find/comment/:kaId',
    component: comment => require(['@/components/rent/baishitong/find/comment'], comment)
  },
  {
    path: '/baishitong/find/report', name: 'report',
    component: report => require(['@/components/rent/baishitong/find/report'], report)
  },
  {
    path: '/baishitong/myLibrary/upload',
    component: upload => require(['@/components/rent/baishitong/myLibrary/upload'], upload)
  },
  //最新消息
  {
    path: '/latest',
    component: latest => require(['@/components/rent/latest/index'], latest)
  },
  {
    path: '/latest/details/:guid',
    component: details => require(['@/components/rent/latest/details'], details)
  },
  {
    path: '/latest/setLatest',
    component: setLatest => require(['@/components/rent/latest/setLatest'], setLatest)
  },

]
