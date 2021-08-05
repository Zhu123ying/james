import { isAdminRoleAtAdminPortal } from '~/utils/cache'
const _ = window._
/**
 * global config
 */
export const LANGUAGE = {
  'zh-cn': 'zh_CN',
  'en': 'en'
}
export const INTL_LOCALE = {
  'en': 'en',
  'zh_CN': 'zh'
}

export const ROOT_VDC_ID = 'root'

export const DSM_URL = '/api/deep-security-gateway/dsmJump?url=home'

// 阿里云相关配置
export const ALIYUN_DISK_MAX_COUNT = 16
export const ALIYUN_ONDEMAND_VM_MAX_VCPU = 16
export const ALIYUN_ONDEMAND_REGION_VM_TOTAL_VCPU = 50

// 内容为空时的显示
export const DEFAULT_EMPTY_LABEL = '-'
export const DEFULT_PAGE_SIZE = 20 // 默认列表分页大小
export const LIST_PAGE_SIZE_UNLIMIT = 999999999 // 必须传分页大小而又要查所有数据时，分页大小
// 前后端分离的菜单URL
export const SEPARATE_URL = [
  // 资源管理
  '/platformoverview/',
  '/neocompute/',
  '/neocompute/images/',
  '/neostorage/',
  // 备份
  '/backup/',
  '/backup/backuptask/',
  // 网络
  '/neonetwork/',
  '/neonetwork/externals/',
  '/neonetwork/routers/',
  '/neonetwork/floating_ips/',
  '/neonetwork/loadbalancers/',
  '/neonetwork/qoses/',
  '/neonetwork/security_groups/',
  // 资源编排
  '/neoapplication/',
  // 监控告警
  '/platformalarm/alarms/',
  '/project/alarm/alarms/',
  '/platformalarm/alarmlogs/',
  '/project/alarm/alarmlogs/',
  '/platformalarm/services/',
  '/platformalarm/drills/',
  // 大屏
  '/largescreen/monitor/',
  '/largescreen/topology/',
  // 工单
  '/project/ticket/',
  '/platformticket/'
]
// error pages
export const ERROR_URL_403 = '/errors/403'
export const LOGIN_URL = '/login' // 登录链接
export const LOGOUT_URL = '/login' // 登出链接
export const SWITCH_REGION_URL = '/auth/switch_services_region/{0}/' // 切换区域的链接
export const PROJECT_SETTINGS_URL = '/setting/personSetting' // 个人设置链接
export const OPERATION_PROJECT_LANGUAGE_SETTING_URL = '/operation/personSetting' // 运维门户——个人设置链接
export const PROJECT_LANGUAGE_SETTING_URL = '/project/settings/user/' // 语言设置链接
// 虚拟机详情页链接
export const INSTANCE_DETAIL_URL = '/neocompute/instances/{0}/?tab={1}'
// overview link
export const USERS_MANAGEMENT_URL = '/platformproject/users/' // 用户管理链接
export const ORCHESTRACTES_URL = '/neoapplication/' // 资源编排链接
export const VM_URL = '/neocompute/' // 虚拟机链接
export const USER_VM_URL = '/neocompute/' // 普通用户虚拟机链接
export const VM_DETAIL_URL = '/neocompute/instances/{id}/' // 虚拟机详情链接
export const VMSNAPSHOTS_URL = '/neocompute/vmsnapshots/' // 虚拟机快照链接
export const HOST_URL = '/platformhost/' // 宿主机链接
export const VOLUMN_URL = '/neostorage/' // 云硬盘链接
export const VOLUMN_DETAIL_URL = '/neostorage/{id}/' // 虚拟磁盘详情链接
export const OPERATION_LOGS_URL = '/platformlog/operationlog/' // 操作日志链接
export const AUTO_SCALING_URL = '/neoapplication/auto_scaling/' // 弹性伸缩链接
export const RECYCLE_URL = '/platformrecycle/' // 回收站链接
export const DRS_SETTINGS_URL = '/platformdrs/' // DRS设置链接S
export const WORKORDER_MANAGE_URL = '/platformticket/' // 工单管理页面
export const VLAN_URL = '/neonetwork/'
export const VLAN_DETAIL_URL = `${VLAN_URL}{id}/`
export const EXTERNAL_DETAIL_URL = `${VLAN_URL}externals/{id}/`
export const ROUTER_DETAIL_URL = `${VLAN_URL}routers/{id}/`
export const PPTP_DETAIL_URL = `${ROUTER_DETAIL_URL}?tab=pptp`
export const OPENVPN_DETAIL_URL = `${ROUTER_DETAIL_URL}?tab=openvpn`
export const BALANCING_DETAIL_URL = `${VLAN_URL}loadbalancers/{id}/`
export const FIREWALL_DETAIL_URL = `${VLAN_URL}security_groups/{id}/`
export const MYSQL_DETAIL_URL = '/platformservice/{id}/'
export const REDIS_DETAIL_URL = '/platformservice/redis_cluster/{id}/'
// 右上角通知类型
// 默认通知类型：成功|信息|警告|错误
export const NotifyTypes = {
  SUCC: { type: 'success', iconNode: 'icon-correct-s', duration: 4 },
  INFO: { type: 'infor', iconNode: 'icon-info-s', duration: 4 },
  WARN: { type: 'warning', iconNode: 'icon-warning-s', duration: 4, closable: true },
  DANGER: { type: 'danger', iconNode: 'icon-error-s', duration: -1, closable: true } // -1表示不会自动关闭
}
export const PATH_ALLOW = ['/', '/login', '/logout', '/errors/403', '/errors/404', '/errors/500', '/errors/10001']
// websocket
export const WEBSOCKET_ALARM_URL = '/websocket/alarm/' // 告警websocket链接
export const WEBSOCKET_KUBER_LOG_URL = '/websocket/kuber/getLog/' // k8s部署日志链接
export const WEBSOCKET = {
  ACTION: {
    GET_ALARM: 'getAlarm',
    CLOSE: 'close'
  },
  RESULT_CODE: {
    SUCCESS: 0,
    FAILED: 1,
    UNLOGIN: 9
  }
}
export const ENV_ID = {}
export const ENV_IDS = [ENV_ID.KVM, ENV_ID.VMWARE, ENV_ID.HUAYUN, ENV_ID.BAREMETAL, ENV_ID.ALIYUN, ENV_ID.POWERVM, ENV_ID.FUSIONCLOUD, ENV_ID.ARCHEROS]
export const ENV_LOCALSTORAGE_KEY = 'environments_list'
export const LICENSE_DATA_KEY = 'licenseData'
export const ZONES_LOCALSTORAGE_KEY = 'zones_list'
export const ENV_COLOR = ['#50c7a7', '#2196f3', '#b48bd7']
export const ENV_TYPE = { PUBLIC_CLOUD: 'PUBLIC_CLOUD', PRIVATE_CLOUD: 'PRIVATE_CLOUD' }
export const ENV_NAME_TYPE = {
    'KVM': 'Feature_KVM',
    'VMware': 'Audit_Feature_VMWare',
    'Huayun': 'HuayunPublicCloud',
    'Baremetal': 'Feature_Baremetal',
    'BAREMETAL': 'Feature_Baremetal',
    'POWERVM': 'POWERVM',
    'PowerVM': 'POWERVM',
    'ArcherOS': 'ArcherOS',
    'Aliyun': 'Feature_Aliyun',
    'FusionCloud': 'Feature_FusionCloud'
}

export const ENVIR_ID = {
  VMWARE: '2',
  ARCHEROS: '8'
}
export const ENV_TO_LICENSE = {
    'ARMP': 'Feature_ArMP',
    'ARCHEROS': 'Feature_ArcherOS',
    'ARSDN': 'Feature_ArSDN',
    'VMWARE': 'Feature_VMWare',
    'BAREMETAL': 'Feature_BareMachine',
    'ARCONTAINER': 'Feature_ArContainer',
    'ORCHESTRATION': 'Feature_Orchestration'

}
const _environmentMapper = ({ id, name, hypervisorType }, portal) => {
  return {
    id: hypervisorType,
    parentId: 1,
    envId: id,
    name: hypervisorType,
    url: `/resource/overview?env=${hypervisorType}`,
    target: undefined,
    link: true,
    icon: undefined
  }
}
export const setEnvDict = (envList) => {
    // 保留POWERVM过滤逻辑
    // environmentList = environmentList.filter(item => {
    //     if (!isAdminRoleAtAdminPortal()) {
    //         return item.hypervisorType.toUpperCase() !== 'POWERVM'
    //     }
    //     return item
    // })
    localStorage[ENV_LOCALSTORAGE_KEY] = JSON.stringify(envList)
    getEnvMenus().map(({ name, id }) => (ENV_ID[name.toUpperCase()] = id))
}
export const getEnvMenus = (portal) => {
  const environments = localStorage[ENV_LOCALSTORAGE_KEY] || '[]'
  return JSON.parse(environments).map(env => _environmentMapper(env, portal))
}
export const getEnvNameByName = (envName) => {
  const env = getEnvMenus().filter(({ name }) => (`${name}`.toLowerCase() === `${envName}`.toLowerCase()))
  return window._.get(env, '[0].id', '')
}
export const getEnvIdByEnvName = (envName) => {
  const env = getEnvMenus().filter(({ name }) => (`${name}`.toLowerCase() === `${envName}`.toLowerCase()))
  return window._.get(env, '[0].envId', -1)
}

const queryParamsToObject = (params = '') => {
  params = params.replace('?', '')
  return params.split('&').reduce((result, str) => {
    const [key, value] = str.split('=')
    if (key) result[key] = value
    return result
  }, {})
}

export const _getCloudEnvFromUrl = () => {
  const search = window.location.search
  if (search) {
    return getEnvNameByName(queryParamsToObject(search)['env'])
  }
  return ''
}

export const PORTAL = {
  ADMIN: 'admin',
  PROJECT: 'project',
  SELFSERVICE: 'selfservice',
  OPERATION: 'operation'
}
export const RESOURCE_UNIT = {
  DISK_SIZE: 'GB',
  DISK_THROUGHPUT: 'MB/s'
}
export const SCOPE_TYPE = {
  SYSTEM: 'System',
  PROJECT: 'Project'
}
export const DISK_TYPE = {
  CAPACITY: 'Capacity' // 容量型
}
export const DISK_LIMIT_CONFIG = {
  //  目前容量型iops限制1-400，吞吐量限制1-40Mb/s
  CAPACITY: {
    iops: {
      regex: /^([1-9]|[1-9]\d|[1-3]\d{2}$|400)$/g,
      tips: '请输入1~400的整数'
    },
    throughput: {
      regex: /^([1-9]|[1-3]\d$|40)$/g,
      tips: '请输入1~40的整数'
    }
  }
}
// 总览数据中心，每个环境下的数据中心默认的最多显示数量
export const DATACENTER_MAX = 4
export const LICENSE_VERSION = {
  TRIAL_VERSION: 1, // 体验版
  STANDARD_EDITION: 2 // 标准版
}
export const ENV_NAME = '云环境'
// AccessKey 公有云类型映射
export const PUBLIC_CLOUD_TYPE = {
  'Huayun': 'HuayunPublicCloud',
  'Aliyun': 'AliyunCloud'
}

export const STATUS_TYPE = {
  'enable': 'normal',
  'disable': 'StatusLoseEfficacy'
}

export const KVM = 'kvm'
export const VMWARE = 'vmware'
export const HUAYUN = 'huayun'
export const BAREMETAL = 'baremetal'
export const ALIYUN = 'aliyun'
export const FUSIONCLOUD = 'fusioncloud'
export const POWERVM = 'powervm'
export const ARCHEROS = 'archeros'
export const ARCHEROS_VERSION = ['Stack V1.1', 'HCI V1.4'] // 安超1.4所有版本

export const IPV4SegmentList = ['192.168.0.0/16', '172.16.0.0/12', '10.0.0.0/8']
// 侧边栏转移到头部的菜单
export const MENU_KEYS = {
  // 费用统计 key -> 国际化key
  'MenuAccounting': 'Accounting',
  // 企业管理
  'MenuEnterpriseManagement': 'EnterpriseManagement',
  // 流程审批
  'MenuWorkflowApproval': 'WorkflowManagement'
}
export const BTN = [{ key: 'table', icon: 'listing' }, { key: 'card', icon: 'manage' }]

export const CARD_BTN = 'card'

export const TABLE_BTN = 'table'

// 创建虚拟磁盘 - 磁盘页面
export const DISK_PAGESIZES = [
  '4K',
  '8K',
  '16K',
  '32K'
]

// 创建虚拟磁盘 - 压缩算法
export const DISK_COMPRESSION = [
  'LZ4',
  'Gzip_opt',
  'Gzip_high',
  'Disabled'
]

export const LICENSE_INVALID_STATUS = {
  'EXTENSION': 'Extension',
  'EXTENSIONWITHMSG': 'ExtensionWithMsg'
}

// 主云平台部署所在CVM
export const cvmNameList = [
  'CloudSuite_CVM1',
  'CloudSuite_CVM2',
  'CloudSuite_CVM3',
  'CloudSuiteV1.1_CVM1',
  'CloudSuiteV1.1_CVM2',
  'CloudSuiteV1.1_CVM3',
  'CloudSuiteV1_2_CVM',
  'CloudSuiteV1_3_CVM_1',
  'CloudSuiteV1_3_CVM_2',
  'CloudSuiteV1_3_CVM_3',
  'CloudSuiteV1_3_ORC_1',
  'CloudSuiteV1_3_ORC_2',
  'CloudSuiteV1_3_ORC_3',
  'CloudSuiteV1_3_CVM',
  'CloudSuiteV1_3_ORC'
]

export const ENV_ICON_TYPE = {
  'ArcherOS': 'Archer-',
  'VMware': 'vMware',
  'BareMetal': 'physicalhost',
  'Default': 'cloudGeneral' // 针对oem的通用图标
}

export const ENV_MENU_ID = 'acbc388f-2caa-4fc1-a4d7-219f75a8e7e6'
export const NETWORK_MENU_ID = '2ef01ba6-f269-4219-b63e-839e0b89c99e'
export const SDN_NETWORK_MENU_ID = '5b45eb9b-5cf6-11ea-9052-fa163e10dd95'

export const SLIDER_PRIORITY_MARK = {1: '1', 50: '50', 100: '100'}

export const PUSH_ENV_ROUTE = {
  '/acos/': 'ArcherOS',
  '/vmware/': 'VMware'
}

export const ACCEPTED_LICENSE_STATUS = ['Activated', 'Expiring', 'CapacityNotEnough']

export const PATH_TYPE = {
  'ArcherOS': 'acos',
  'VMware': 'vmware',
  'BareMetal': 'bare-metal'
}
export const SUB_APP_ROUTES = [
  {
    name: 'applicationCenter',
    path: '/applicationCenter/',
    entry: 'https://178.104.163.154'
  }
  // {
  //   name: 'sdn',
  //   path: '/sdn/',
  //   entry: '//10.51.30.138:7100'
  // }
  // {
  //   name: 'acos',
  //   path: '/acos/',
  //   entry: '//localhost:7200'
  // },
  // {
  //   name: 'vmware',
  //   path: '/vmware/',
  //   entry: '//localhost:7300'
  // }
]
