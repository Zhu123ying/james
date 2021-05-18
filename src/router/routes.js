/* eslint-disable */
import ApplicationCenter from '~/container/content'
import ApplicationManage from '~/pages/applicationManage'
import CreateApplication from '~/pages/applicationManage/create'
import ApplicationPackageManage from '~/pages/applicationPackageManage'
import ContainerManage from '~/pages/containerManage'
import CreateContainerGroup from '~/pages/containerManage/create'
import PageNotFound from '~/container/error'

const routers = [
  {
    path: '',
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
        path: "/applicationCenter/applicationManage/create",
        component: CreateApplication,
        name: 'CreateApplication',
        key: 'CreateApplication',
        exact: true,
        langCode: 'CreateApplication',
        descLangCode: 'DesCreateApplication',
      },
      {
        path: "/applicationCenter/applicationManage/edit/:id",
        component: CreateApplication,
        name: 'EditApplication',
        key: 'EditApplication',
        exact: true,
        langCode: 'EditApplication',
        descLangCode: 'DesEditApplication',
      },
      {
        path: "/applicationCenter/applicationPackageManage",
        component: ApplicationPackageManage,
        name: 'ApplicationPackageManage',
        key: 'ApplicationPackageManage',
        exact: true,
        langCode: 'ApplicationPackageManage',
        descLangCode: 'DesApplicationPackageManage',
      },
      {
        path: "/applicationCenter/containerManage",
        component:  ContainerManage,
        name: 'ContainerManage',
        key: 'ContainerManage',
        exact: true,
        langCode: 'ContainerManage',
        descLangCode: 'DesContainerManage',
      },
      {
        path: "/applicationCenter/containerManage/create",
        component: CreateContainerGroup,
        name: 'CreateContainerGroup',
        key: 'CreateContainerGroup',
        exact: true,
        langCode: 'CreateContainerGroup',
        descLangCode: 'DesCreateContainerGroup'
      },
    ]
  },
  {
    path: '/',
    key: 'e404',
    component: PageNotFound
  }
]

export default routers