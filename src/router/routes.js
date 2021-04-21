import ApplicationCenter from '~/container/content'
import PageNotFound from '~/container/error'

import ApplicationManage from '~/pages/applicationManage'

const routers = [
  {
    path: "/application/appManage",
    component: ApplicationManage,
    title: '应用管理',
    desc: '这是应用管理的描述',
    key: 'applicationManage'
  },
  // {
  //   path: '/',
  //   key: 'applicationCenter',
  //   name: '应用中心',
  //   component: ApplicationCenter,
  //   routes: [
  //     {
  //       path: "/application/appManage",
  //       component: ApplicationManage,
  //       title: '应用管理',
  //       desc: '这是应用管理的描述',
  //       key: 'applicationManage'
  //     }
  //   ]
  // },
  {
    path: '/error/404',
    key: 'e404',
    component: PageNotFound
  }
]

export default routers
