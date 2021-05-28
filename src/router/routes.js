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
    key: 'ApplicationCenter',
    name: 'ApplicationCenter',
    component: ApplicationCenter,
    langCode: 'ApplicationCenter',
    descLangCode: 'DesApplicationCenter',
    routes: [
      {
        path: "/applicationCenter/applicationManage",
        component: ApplicationManage,
        name: 'ApplicationManage',
        key: 'ApplicationManage',
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
      // 补齐路由，先用应用顶一下
      {
        path: "/applicationCenter/applicationStoreManage",
        component: ApplicationManage,
        name: 'ApplicationStoreManage',
        key: 'ApplicationStoreManage',
        exact: true,
        langCode: 'ApplicationStoreManage',
        descLangCode: 'DesApplicationStoreManage',
      },  
      {
        path: "/applicationCenter/applicationResourceManage",
        component: ApplicationManage,
        name: 'ApplicationResourceManage',
        key: 'ApplicationResourceManage',
        exact: true,
        langCode: 'ApplicationResourceManage',
        descLangCode: 'DesApplicationResourceManage',
      },  
      {
        path: "/applicationCenter/imageManage",
        component: ApplicationManage,
        name: 'ImageManage',
        key: 'ImageManage',
        exact: true,
        langCode: 'ImageManage',
        descLangCode: 'DesImageManage',
      }, 
      {
        path: "/applicationCenter/credentialManage",
        component: ApplicationManage,
        name: 'CredentialManage',
        key: 'CredentialManage',
        exact: true,
        langCode: 'CredentialManage',
        descLangCode: 'DesCredentialManage',
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