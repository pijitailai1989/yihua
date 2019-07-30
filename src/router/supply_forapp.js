export default [
  //商家管理员
  {
    path: '/mechant_service',
    component: find => require(['@/components/rent/localService/mechant_service'], find)
  },
  {
    path: '/business_manager',
    component: find => require(['@/components/rent/my/business'], find)
  },
  {
    path: '/business/member',
    component: member => require(['@/components/rent/supplyfor_app/member'], member)
  },
  //八爪圈帖子审核
  {
    path: '/supply_app/article/:id',
    component: article => require(['@/components/rent/supplyfor_app/article'], article)
  },
  //我的产品审核/supplyfor_app/find/details/
  {
    path: '/supplyfor_app/find/details/:guid',
    component: article => require(['@/components/rent/supplyfor_app/sub/find_detail'], article)
  },
  //采购招标/supply/purchase/details/:type/:guid'
  {
    path: '/supplyfor_app/purchase/details/:type/:guid',
    component: article => require(['@/components/rent/supplyfor_app/sub/purchase_detail'], article)
  },
  //圈子管理
  {
    path: '/supply_app/bbsmanager',
    component: find => require(['@/components/rent/supplyfor_app/business/managerCircle'], find)
  },
  {
    path: '/supply_app/find',
    component: find => require(['@/components/rent/supplyfor_app/find'], find)
  },
  //供求市场
  {
    path: '/supply_app/find',
    component: find => require(['@/components/rent/supplyfor_app/find'], find)
  },//我的采购
  {
    path: '/supply_app/purchase',
    component: purchase  => require(['@/components/rent/supplyfor_app/purchase'], purchase)
  },
  //我的产品
  {
    path: '/supply_app/product',
    component: product => require(['@/components/rent/supplyfor_app/product'], product)
  },{
    path: '/supply_app/my_card',
    component: my_card => require(['@/components/rent/supplyfor_app/business/card'], my_card)
  },];
