/* eslint-disable */
import PageNotFound from '~/container/error'
import ApplicationCenter from '~/container/content'
import ApplicationManage from '~/pages/applicationManage'
import CreateApplication from '~/pages/applicationManage/create'
import ApplicationPackageManage from '~/pages/applicationPackageManage'
import CreateApplicationPackage from '~/pages/applicationPackageManage/create'
import ContainerManage from '~/pages/containerManage'
import ContainerAlarmDetail from '~/pages/containerManage/detail/alarm/detail'
import CreateContainerGroup from '~/pages/containerManage/create'
import CredentialManage from '~/pages/imageRepositoryCredentialManage'
import ImageManage from '~/pages/imageManage'
import ApplicationStoreManage from '~/pages/applicationStoreManage'
import ManageApplicationStore from '~/pages/applicationStoreManage/manage'
import NodeManage from '~/pages/nodeManage'
import ResourceTypeManage from '~/pages/resourceTypeManage'
import NetworkResourceManage from '~/pages/networkResourceManage'
import StorageResource from '~/pages/storageResource'

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
        path: "/applicationCenter/applicationPackageManage/create",
        component: CreateApplicationPackage,
        name: 'CreateApplicationPackage',
        key: 'CreateApplicationPackage',
        exact: true,
        langCode: 'CreateApplicationPackage',
        descLangCode: 'DesCreateApplicationPackage'
      },
      {
        path: "/applicationCenter/applicationPackageManage/edit/:id",
        component: CreateApplicationPackage,
        name: 'EditApplicationPackage',
        key: 'EditApplicationPackage',
        exact: true,
        langCode: 'EditApplicationPackage',
        descLangCode: 'DesEditApplicationPackage'
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
        path: "/applicationCenter/containerManage/alarmRecordDetail/:id",  // 容器管理-告警详情
        component: ContainerAlarmDetail,
        name: 'AlarmDetail',
        key: 'AlarmDetail',
        exact: true,
        langCode: 'AlarmDetail',
        descLangCode: 'DesAlarmDetail',
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
      {
        path: "/applicationCenter/nodeResource",
        component: NodeManage,
        name: 'NodeManage',
        key: 'NodeManage',
        exact: true,
        langCode: 'NodeManage',
        descLangCode: 'DesNodeManage',
      },
      {
        path: "/applicationCenter/resourceObjectType",
        component: ResourceTypeManage,
        name: 'ResourceTypeManage',
        key: 'ResourceTypeManage',
        exact: true,
        langCode: 'ResourceTypeManage',
        descLangCode: 'DesResourceTypeManage',
      },
      {
        path: "/applicationCenter/networkResource",
        component: NetworkResourceManage,
        name: 'NetworkResourceManage',
        key: 'NetworkResourceManage',
        exact: true,
        langCode: 'NetworkResourceManage',
        descLangCode: 'DesNetworkResourceManage',
      },
      {
        path: "/applicationCenter/storageResource",
        component: StorageResource,
        name: 'StorageResource',
        key: 'StorageResource',
        exact: true,
        langCode: 'StorageResource',
        descLangCode: 'DesStorageResource',
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