/* eslint-disable */
import ApplicationCenter from '~/container/content'
import ApplicationManage from '~/pages/applicationManage'
import ApplicationPackageManage from '~/pages/applicationPackageManage'
import PageNotFound from '~/container/error'

const routers = [
  {
    path: '/applicationCenter',
    key: 'applicationCenter',
    name: 'ApplicationCenter',
    component: ApplicationCenter,
    langCode: 'ApplicationCenter',
    descLangCode: 'DesApplicationCenter',
    routes: [
      {
        path: "/applicationCenter/applicationManage",
        component: ApplicationManage,
        name: 'ApplicationManage',
        key: 'applicationManage',
        exact: true,
        langCode: 'ApplicationManage',
        descLangCode: 'DesApplicationManage',
      },
      {
        path: "/applicationCenter/applicationPackageManage",
        component: ApplicationPackageManage,
        name: 'ApplicationPackageManage',
        key: 'ApplicationPackageManage',
        exact: true,
        langCode: 'ApplicationPackageManage',
        descLangCode: 'DesApplicationPackageManage',
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