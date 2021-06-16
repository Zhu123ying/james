/* eslint-disable */
import ApplicationCenter from '~/container/content'
import ApplicationManage from '~/pages/applicationManage'
import CreateApplication from '~/pages/applicationManage/create'
import ApplicationPackageManage from '~/pages/applicationPackageManage'
import ContainerManage from '~/pages/containerManage'
import CreateContainerGroup from '~/pages/containerManage/create'
import CredentialManage from '~/pages/imageRepositoryCredentialManage'
import ImageManage from '~/pages/imageManage'
import ApplicationStoreManage from '~/pages/applicationStoreManage'
import ManageApplicationStore from '~/pages/applicationStoreManage/manage'
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
        path: "/applicationCenter/containerManage",  // 容器管理
        component: ContainerManage,
        name: 'ContainerManage',
        key: 'ContainerManage',
        exact: true,
        langCode: 'ContainerManage',
        descLangCode: 'DesContainerManage',
      },
      {
        path: "/applicationCenter/containerManage/create", // 容器创建
        component: CreateContainerGroup,
        name: 'CreateContainerGroup',
        key: 'CreateContainerGroup',
        exact: true,
        langCode: 'CreateContainerGroup',
        descLangCode: 'DesCreateContainerGroup'
      },
      {
        path: "/applicationCenter/containerManage/create/:id/:type", // 容器复制
        component: CreateContainerGroup,
        name: 'CreateContainerGroup',
        key: 'CreateContainerGroup',
        exact: true,
        langCode: 'CreateContainerGroup',
        descLangCode: 'DesCreateContainerGroup'
      },
      {
        path: "/applicationCenter/containerManage/edit/:id", // 容器编辑
        component: CreateContainerGroup,
        name: 'CreateContainerGroup',
        key: 'CreateContainerGroup',
        exact: true,
        langCode: 'CreateContainerGroup',
        descLangCode: 'DesCreateContainerGroup'
      },
      {
        path: "/applicationCenter/imageManage",
        component: ImageManage,
        name: 'ImageManage',
        key: 'ImageManage',
        exact: true,
        langCode: 'ImageManage',
        descLangCode: 'DesImageManage',
      },
      {
        path: "/applicationCenter/credentialManage",
        component: CredentialManage,
        name: 'CredentialManage',
        key: 'CredentialManage',
        exact: true,
        langCode: 'CredentialManage',
        descLangCode: 'DesCredentialManage',
      },
      {
        path: "/applicationCenter/applicationStoreManage",
        component: ApplicationStoreManage,
        name: 'ApplicationStoreManage',
        key: 'ApplicationStoreManage',
        exact: true,
        langCode: 'ApplicationStoreManage',
        descLangCode: 'DesApplicationStoreManage',
      },
      {
        path: "/applicationCenter/applicationStoreManage/create",
        component: ManageApplicationStore,
        name: 'CreateApplicationStore',
        key: 'CreateApplicationStore',
        exact: true,
        langCode: 'CreateApplicationStore',
        descLangCode: 'DesCreateApplicationStore',
      },
      {
        path: "/applicationCenter/applicationStoreManage/edit/:id",
        component: ManageApplicationStore,
        name: 'EditApplicationStore',
        key: 'EditApplicationStore',
        exact: true,
        langCode: 'EditApplicationStore',
        descLangCode: 'DesEditApplicationStore',
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