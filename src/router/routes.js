/* eslint-disable */
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
        name: 'ApplicationManage',
        key: 'applicationManage',
        exact: true,
        langCode: 'ApplicationManage',
        descLangCode: 'DesApplicationManage',
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