import ApplicationCenter from '~/container/content'
import ApplicationManage from '~/pages/applicationManage'
import PageNotFound from '~/container/error'

const routers = [
  {
    path: '/applicationCenter',
    key: 'applicationCenter',
    name: '应用中心',
    component: ApplicationCenter,
    routes: [
      {
        path: "/applicationCenter/appManage",
        component: ApplicationManage,
        title: '应用管理',
        desc: '这是应用管理的描述',
        key: 'applicationManage',
        exact: true
      }
    ]
  },
  {
    path: '/',
    key: 'e404',
    component: PageNotFound
  }
]

export default routers
