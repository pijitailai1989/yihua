import Vue from 'vue'
import Router from 'vue-router'
import indexChild from './indexChild'
import supply_forapp from './supply_forapp'
import wuye from './wuye'
import enterprise from './enterprise'
// import login from '@/components/login/login'
import index from '@/components/index'
import register from '@/components/login/register'
import chooseplatform from '@/components/login/chooseplatform'
import personal from '@/components/login/personal'
import rent from '@/components/login/rent'
import company from '@/components/login/company'
import register_success from '@/components/login/register_success'
import forget from '@/components/login/forget'
//租户部分
import rentMy from '@/components/rent/my/index'
import circle from '@/components/rent/circle/index'
// import message from '@/components/rent/message/index'
import supply from '@/components/rent/supply/index'
// 租户编辑页面
//八爪圈文章
import article from '@/components/rent/circle/article'
import rent_edit from '@/components/rent/circle/rent_edit'
import add_activity from '@/components/rent/circle/add_activity'
import call from '@/components/rent/my/card/call'
import mem from '@/components/rent/my/card/mem'
import coupon from '@/components/rent/my/card/coupon'

//测试
// import test from '@/components/test'
Vue.use(Router);
const route = new Router({
  routes: [
    ...indexChild,
    ...enterprise,
    ...supply_forapp,
    {
      path: "/",
      redirect: '/login'
    },
    {
      name: "index",
      path: "/index/:type/:isManger/:tabIndex",
      component: index => require(['@/components/index'], index),
      leaf: true,
      children: [{
        name: "我的",
        path: "/index/:type/:isManger/:tabIndex/rent/my",
        component: rentMy
      }, {
        name: "八爪圈",
        path: "/index/:type/:isManger/:tabIndex/rent/circle",
        component: circle
      }, {
        name: "本地服务",
        path: "/index/:type/:isManger/:tabIndex/rent/local",
        component: localService => require(['@/components/rent/local/index'], localService)
      },
        {
          name: "消息",
          path: "/index/:type/:isManger/:tabIndex/rent/message",
          component: message => require(['@/components/rent/message/index'], message)
        }]
    },
    // {
    //   path: '*',
    //   redirect: '/login'
    // },
    {
      path: "/localService",
      component: localService => require(['@/components/rent/localService/index'], localService)
    },
    {
      path: '/login',
      name: "login",
      component: login => require(['@/components/login/login'], login)
    }, {
      path: '/register',
      name: 'register',
      component: register,
      children: [
        {path: '/register/chooseplatform', component: chooseplatform, name: '选择平台'},
        {path: '/register/personal', component: personal, name: '个人'},
        {path: '/register/rent', component: rent, name: '写字楼租户'},
        {path: '/register/company', component: company, name: '物业公司'},
      ]
    }, {
      name: "article",
      path: "/rent/circle/article/:id",
      component: article
    }, {
      name: "rent_edit",
      path: "/rent/circle/rent_edit",
      component: rent_edit
    },
    {
      name: "add_activity",
      path: "/rent/circle/add_activity",
      component: add_activity
    },
    {
      path: '/register_success/:id',
      component: register_success
    }, {
      path: '/forget',
      component: forget
    },
    // 我的部分
    {
      path: '/my/manager',
      component: manager => require(['@/components/rent/my/manager'], manager)
    }, {
      path: '/my/setting',
      component: setting => require(['@/components/rent/my/setting'], setting)
    },
    {
      path: '/my/card/details', name: 'coupon_details',
      component: details => require(['@/components/rent/my/card/details'], details)
    }, {
      path: '/my/card',
      component: card => require(['@/components/rent/my/card'], card),
      children: [
        {
          path: '/my/card/call',
          name: 'call',
          component: call => require(['@/components/rent/my/card/call'], call)
        },
        {
          path: '/my/card/coupon',
          name: 'coupon',
          component: coupon => require(['@/components/rent/my/card/coupon'], coupon)
        },
        {
          path: '/my/card/mem', name: 'mem', component: mem => require(['@/components/rent/my/card/mem'], mem)
        }
      ]
    }, {
      path: '/my/change_manager',
      component: change_manager => require(['@/components/rent/my/changemanager'], change_manager)
    }, {
      path: '/my/new_message',
      name: '最新消息',
      component: new_message => require(['@/components/rent/my/new_message/new_message'], new_message)
      //  我的管理员部分
    }, {
      path: '/my/manager/new_message',
      component: new_message => require(['@/components/rent/my/new_message/new_message'], new_message)
    }, {
      path: '/my/my_asset',
      component: my_asset => require(['@/components/rent/my/my_asset'], my_asset)
    }, {
      path: '/my/my_asset/BpLog',
      component: BpLog => require(['@/components/rent/my/my_asset/BpLog'], BpLog)
    }
    , {
      path: '/my/my_asset/IntegralLog',
      component: IntegralLog => require(['@/components/rent/my/my_asset/IntegralLog'], IntegralLog)
    }
    , {
      path: '/my/my_asset/BuyLog',
      component: BuyLog => require(['@/components/rent/my/my_asset/BuyLog'], BuyLog)
    }
    , {
      path: '/my/my_asset/ExchangeLog',
      component: ExchangeLog => require(['@/components/rent/my/my_asset/ExchangeLog'], ExchangeLog)
    }, {
      path: '/my/my_asset/buy_mem',
      component: buy_mem => require(['@/components/rent/my/my_asset/buy_mem'], buy_mem)
    }, {
      path: '/my/my_asset/bm_ConPay',
      component: bm_ConPay => require(['@/components/rent/my/my_asset/bm_ConPay'], bm_ConPay)
    }, {
      path: '/my/my_asset/bm_ConPay1',
      component: bm_ConPay1 => require(['@/components/rent/my/my_asset/bm_ConPay1'], bm_ConPay1)
    }, {
      path: '/my/my_asset/recharge',
      component: recharge => require(['@/components/rent/my/my_asset/recharge'], recharge)
    }, {
      path: '/my/my_asset/confirm_Payment',
      component: confirm_Payment => require(['@/components/rent/my/my_asset/confirm_Payment'], confirm_Payment)
    }, {
      path: '/my/my_asset/exchange',
      component: exchange => require(['@/components/rent/my/my_asset/exchange'], exchange)
    }, {
      path: '/my/my_asset/getSanList',
      component: getSanList => require(['@/components/rent/my/my_asset/getSanList'], getSanList)
    }, {
      path: '/my/my_asset/addSan',
      component: addSan => require(['@/components/rent/my/my_asset/addSan'], addSan)
    }, {
      path: '/my/my_asset/invite_bus',
      component: invite_bus => require(['@/components/rent/my/my_asset/invite_bus'], invite_bus)
    }, {
      path: '/my/my_asset/baiShiTong',
      component: baiShiTong => require(['@/components/rent/my/my_asset/baiShiTong'], baiShiTong)
    }, {
      path: '/my/my_asset/see_niche',
      component: see_niche => require(['@/components/rent/my/my_asset/see_niche'], see_niche)
    }, {
      path: '/my/my_asset/voc_work',
      component: voc_work => require(['@/components/rent/my/my_asset/voc_work'], voc_work)
    },
    //岗位管理
    {
      path: '/my/manager/job_manager',
      component: job_manager => require(['@/components/rent/my/manager/job_manager'], job_manager)
    }, {
      path: '/my/manager/job_manager/add',
      component: add_job => require(['@/components/rent/my/manager/add_job'], add_job)
    }, {
      path: '/my/manager/job_manager/add_root',
      component: add_root => require(['@/components/rent/my/manager/add_root'], add_root)
    },
    //部门管理
    {
      path: '/my/manager/department',
      component: department_manager => require(['@/components/rent/my/department/department_manager'], department_manager)
    },
    {
      path: '/my/manager/send_inviteCode',
      component: department_manager => require(['@/components/rent/my/department/department_manager'], department_manager)
    },
    {
      path: '/my/manager/department/add_people',
      component: department_manager => require(['@/components/rent/my/department/add_people'], department_manager)
    },
    {
      path: '/my/manager/department/edit_people',
      component: department_manager => require(['@/components/rent/my/department/add_people'], department_manager)
    },
    {
      path: '/my/manager/department/select_job',
      component: department_manager => require(['@/components/rent/my/department/select_job'], department_manager)
    },
    {
      path: '/my/manager/department/change_job',
      component: department_manager => require(['@/components/rent/my/department/select_job'], department_manager)
    },
    {
      path: '/my/manager/account',
      component: account => require(['@/components/rent/my/profile/profile_manager'], account)
    }, {
      path: '/my/manager/edit',
      component: edit_company => require(['@/components/rent/my/profile/edit_company'], edit_company)
    }

    //  分割一下,设置
    , {
      path: '/my/setting/set_pass',
      component: set_pass => require(['@/components/rent/my/setting/set_pass'], set_pass)
    }, {
      path: '/my/setting/set_pass/phone_pass',
      component: phone_pass => require(['@/components/rent/my/setting/set_pass/phone_pass'], phone_pass)
    }, {
      path: '/my/setting/set_pass/raw_pass',
      component: raw_pass => require(['@/components/rent/my/setting/set_pass/raw_pass'], raw_pass)
    }, {
      path: '/my/setting/user_info',
      component: user_info => require(['@/components/rent/my/setting/user_info'], user_info)
    }, {
      path: '/my/setting/user_write',
      component: user_write => require(['@/components/rent/my/setting/user_write'], user_write)
    }, {
      path: '/my/setting/my_code',
      component: my_code => require(['@/components/rent/my/setting/my_code'], my_code)
    }, {
      path: '/my/setting/invite_reward',
      component: invite_reward => require(['@/components/rent/my/setting/invite_reward'], invite_reward)
    }, {
      path: '/my/setting/my_about',
      component: my_about => require(['@/components/rent/my/setting/my_about'], my_about)
    }, {
      path: '/my/setting/my_foot',
      component: my_foot => require(['@/components/rent/my/setting/my_foot'], my_foot)
    }, {
      path: '/my/setting/my_invite',
      component: my_invite => require(['@/components/rent/my/setting/my_invite'], my_invite)
    }, {
      path: '/estate/serviceList',
      component: serviceList => require(['@/components/rent/estate/serviceList/index'], serviceList)
    }
    , {
      path: '/estate/repair',
      component: repair => require(['@/components/rent/estate/serviceList/repair/index'], repair)
    }, {
      path: '/estate/wuye/repair',
      component: repair => require(['@/components/rent/estate/serviceList/wuye/repair/index'], repair)
    }
    , {
      path: '/estate/to_repair',
      component: repair => require(['@/components/rent/estate/serviceList/repair/toRepair'], repair)
    }, {
      path: '/estate/wuye/to_repair',
      component: repair => require(['@/components/rent/estate/serviceList/wuye/repair/toRepair'], repair)
    }
    , {
      path: '/estate/select_type',
      component: selectType => require(['@/components/rent/estate/serviceList/repair/selectType'], selectType)
    }, {
      path: '/estate/wuye/select_type',
      component: selectType => require(['@/components/rent/estate/serviceList/wuye/repair/selectType'], selectType)
    }
    , {
      path: '/estate/order_submit',
      component: order_submit => require(['@/components/rent/estate/serviceList/repair/orderSubmit'], order_submit)
    }, {
      path: '/estate//wuye/order_submit',
      component: order_submit => require(['@/components/rent/estate/serviceList/wuye/repair/orderSubmit'], order_submit)
    }
    , {
      path: '/estate/order_detail',
      component: order_submit => require(['@/components/rent/estate/serviceList/repair/order_details'], order_submit)
    }, {
      path: '/estate/wuye/order_detail',
      component: order_submit => require(['@/components/rent/estate/serviceList/wuye/repair/order_details'], order_submit)
    }

    , {
      path: '/estate/serviceList/complain',
      component: complain => require(['@/components/rent/estate/serviceList/complain/model'], complain)
    },
    , {
      path: '/estate/serviceList/wuye/add_complain',
      component: add_complain => require(['@/components/rent/estate/serviceList/wuye/complain/addComplain'], add_complain)
    }
    , {
      path: '/estate/serviceList/complain/add_complain',
      component: add_complain => require(['@/components/rent/estate/serviceList/complain/addComplain'], add_complain)
    }
    , {
      path: '/estate/serviceList/complain/complain_detail',
      component: complain_detail => require(['@/components/rent/estate/serviceList/complain/order_details'], complain_detail)
    }, {
      path: '/estate/serviceList/wuye/complain_detail',
      component: complain_detail => require(['@/components/rent/estate/serviceList/wuye/complain/order_details'], complain_detail)
    }
    // 入驻
    , {
      path: '/estate/serviceList/settled',
      component: settled => require(['@/components/rent/estate/serviceList/settled/model'], settled)
    }, {
      path: '/estate/serviceList/wuye/settled',
      component: settled => require(['@/components/rent/estate/serviceList/wuye/settled/list'], settled)
    }, {
      path: '/estate/serviceList/wuye/settled/add',
      component: settled => require(['@/components/rent/estate/serviceList/wuye/settled/add'], settled)
    }
    , {
      path: '/estate/serviceList/settle_detail',
      component: settle_detail => require(['@/components/rent/estate/serviceList/settled/order_details'], settle_detail)
    }, {
      path: '/estate/serviceList/wuye/settle_detail',
      component: settle_detail => require(['@/components/rent/estate/serviceList/wuye/settled/order_details'], settle_detail)
    },
    // 八爪圈
    , {
      path: '/circle/my_circle',
      component: my_circle => require(['@/components/rent/circle/my_circle'], my_circle)
    }, {
      path: '/circle/my_circle/my_post',
      component: my_post => require(['@/components/rent/circle/my_circle/my_post'], my_post)
    }, {
      path: '/circle/my_circle/new_post',
      component: new_post => require(['@/components/rent/circle/my_circle/new_post'], new_post)
    }, {
      path: '/circle/my_circle/post_detail/:guid',
      component: post_detail => require(['@/components/rent/circle/my_circle/post_detail'], post_detail)
    }, {
      path: '/circle/my_circle/my_join',
      component: my_join => require(['@/components/rent/circle/my_join/index'], my_join)
    }, {
      path: '/circle/my_circle/my_comment',
      component: my_comment => require(['@/components/rent/circle/my_comment/index'], my_comment)
    }, {
      path: '/circle/my_circle/my_reply',
      component: my_reply => require(['@/components/rent/circle/my_reply/index'], my_reply)
    }, {
      path: '/circle/my_circle/my_friend',
      component: my_friend => require(['@/components/rent/circle/my_friend/index'], my_friend)
    }, {
      path: '/circle/my_circle/black_friend',
      component: black_friend => require(['@/components/rent/circle/my_friend/black_friend'], black_friend)
    }, {
      path: '/circle/my_circle/friend_detail/:userId',
      component: friend_detail => require(['@/components/rent/circle/my_friend/friend_detail'], friend_detail)
    }, {
      path: '/circle/my_circle/friend_remarks',
      component: friend_remarks => require(['@/components/rent/circle/my_friend/friend_remarks'], friend_remarks)
    }
    // 企信
    , {
      path: '/message/sessions',
      component: sessions => require(['@/components/rent/message/chatTable'], sessions)
    }, {
      path: '/message/friends',
      component: chat_friend => require(['@/components/rent/message/chatFriend'], chat_friend)
    }, {
      path: '/message/create_team',
      component: create_team => require(['@/components/rent/message/chatFriend'], create_team)
    }, {
      path: '/message/team_detail',
      component: team_detail => require(['@/components/rent/message/teamDetail'], team_detail)
    }, {
      path: '/message/chat_history',
      component: chat_history => require(['@/components/rent/message/chat_history'], chat_history)
    },
    ...wuye
  ]
});

export default route
