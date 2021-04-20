
import imgEntityHost from './svg/entityHost.svg'
import imgImage from './svg/image.svg'
import imgVolumeType from './svg/volumeType.svg'
import imgInstance from './svg/instance.svg'
import imgVolume from './svg/volume.svg'
import imgVolumeRecycle from './svg/volumeRecycle.svg'
import imgWorkFlow from './svg/workFlowDone.svg'
import imgWorkFlowContinue from './svg/workFlowContinue.svg'
import imgWorkFlowFinish from './svg/workFlowFinish.svg'
import imgWorkFlowTemplate from './svg/workFlowTemplate.svg'
import imgNetworks from './svg/networks.svg'
import imgExtNetworks from './svg/extNetworks.svg'
import imgRecovery from './svg/recovery.svg'
import imgBare from './svg/bare.svg'
import imgKeypair from './svg/keypair.svg'
import imgRouter from './svg/router.svg'
import imgFirewall from './svg/firewall.svg'
import imgPublicIP from './svg/IP.svg'
import imgQoS from './svg/QoS.svg'
import imgLog from './svg/log.svg'
import imgProject from './svg/project.svg'
import imgRoles from './svg/roles.svg'
import imgRole from './svg/role.svg'
import imgUser from './svg/user.svg'
import imgMachineManagement from './svg/machineManagement.svg'
import imgOperationTemplate from './svg/operationTemplate.svg'
import imgMonitorProject from './svg/monitorProject.svg'
import imgAlarmRecord from './svg/alarmRecord.svg'
import imgOperationLog from './svg/operationLog.svg'
import imgBareSwitch from './svg/bareSwitch.svg'
import imgScaling from './svg/scaling.svg'
import imgLoadBalancer from './svg/loadBalancer.svg'
import imgOrchestration from './svg/orchestration.svg'
import imgBackup from './svg/backup.svg'
import imgTask from './svg/task.svg'
import imgServiceTemplate from './svg/serviceTemplate.svg'
import imgServiceInstance from './svg/serviceInstance.svg'
import imgDepartment from './svg/department.svg'

export const noDataInfo = {
  '/admin/resource/entity': {
    noDataDesc: 'NoDataHost',
    noDataImg: imgEntityHost
  },
  '/resource/management/image': {
    noDataDesc: 'NoDataSystemImage',
    noDataImg: imgImage
  },
  '/admin/resource/volumetype': {
    noDataDesc: 'NoDataVolumeType',
    noDataImg: imgVolumeType
  },
  '/resource/compute/instance': {
    noDataImg: imgInstance
  },
  '/resource/compute/volume': {
    noDataImg: imgVolume
  },
  '/resource/compute/recycle': {
    noDataDesc: 'NoDataRecycle',
    noDataImg: imgVolumeRecycle
  },
  '/admin/approval/workflow': {
    noDataDesc: 'NoDataWorkFlowDone',
    noDataImg: imgWorkFlow
  },
  '/admin/approval/workflowContinue': {
    noDataDesc: 'NoDataWorkFlowContinue',
    noDataImg: imgWorkFlowContinue
  },
  '/admin/approval/workflowTemplate': {
    noDataImg: imgWorkFlowTemplate
  },
  '/admin/approval/workflowFinish': {
    noDataDesc: 'NoDataWorkFlowFinish',
    noDataImg: imgWorkFlowFinish
  },
  '/resource/network/ext-networks': {
    noDataDesc: 'NoDataExtNetworks',
    noDataImg: imgExtNetworks
  },
  '/resource/network/networks': {
    noDataDesc: 'NoDataNetworks',
    noDataImg: imgNetworks
  },
  '/resource/network/securityGroups': {
    noDataDesc: 'NoDataFirewall',
    noDataImg: imgFirewall
  },
  '/admin/resource/recovery': {
    noDataDesc: 'NoDataRecovery',
    noDataImg: imgRecovery
  },
  '/admin/resource/bare': {
    noDataImg: imgBare
  },
  '/resource/compute/keypair': {
    noDataDesc: 'NoDataKeypair',
    noDataImg: imgKeypair
  },
  '/admin/resource/router': {
    noDataImg: imgRouter
  },
  '/admin/resource/firewall': {
    noDataDesc: 'NoDataFirewall',
    noDataImg: imgFirewall
  },
  '/admin/resource/publicip': {
    noDataDesc: 'NoDataPublicIP',
    noDataImg: imgPublicIP
  },
  '/admin/resource/elasticip': {
    noDataImg: imgPublicIP
  },
  '/admin/resource/qoses': {
    noDataImg: imgQoS
  },
  '/admin/resource/scaling': {
    noDataImg: imgScaling
  },
  '/admin/resource/loadbalancer': {
    noDataDesc: 'NoDataLB',
    noDataImg: imgLoadBalancer
  },
  '/admin/orchestration/customtemplate': {
    noDataImg: imgOrchestration
  },
  '/admin/orchestration/instance': {
    noDataImg: imgOrchestration
  },
  '/admin/audit/resourcelog': {
    noDataDesc: 'NoDataResourcelog',
    noDataImg: imgLog
  },
  '/log/resourcelog': {
    noDataDesc: 'NoDataResourcelog',
    noDataImg: imgLog
  },
  '/admin/audit/businesslog': {
    noDataDesc: 'NoDataBusinesslog',
    noDataImg: imgLog
  },
  '/log/businesslog': {
    noDataDesc: 'NoDataBusinesslog',
    noDataImg: imgLog
  },
  '/log/loginlog': {
    noDataDesc: 'NoDataLoginlog',
    noDataImg: imgLog
  },
  '/admin/audit/halog': {
    noDataDesc: 'NoDataHalog',
    noDataImg: imgLog
  },
  '/admin/project/project': {
    noDataDesc: 'NoDataProject',
    noDataImg: imgProject
  },
  '/admin/project/roles': {
    noDataDesc: 'NoDataRoles',
    noDataImg: imgRoles
  },
  '/admin/enterprise/user': {
    noDataDesc: 'NoDataUser',
    noDataImg: imgUser
  },
  '/admin/enterprise/role': {
    noDataDesc: 'NoDataRole',
    noDataImg: imgRole
  },
  '/admin/setting/accessKey': {
    noDataDesc: 'NoDataAccessKey',
    noDataImg: imgKeypair
  },
  '/admin/setting/backupmanagement/backuppolicy': {
    noDataImg: imgBackup
  },
  '/admin/setting/backupmanagement/backupdata': {
    noDataDesc: 'NoDataBackUpdata',
    noDataImg: imgBackup
  },
  '/admin/timerservice/task': {
    noDataDesc: 'NoDataTask',
    noDataImg: imgTask
  },
  '/operation/machineManagement/': {
    noDataDesc: 'NoDataMachineManagement',
    noDataImg: imgMachineManagement
  },
  '/operation/template': {
    noDataDesc: 'NoDataOperationTemplate',
    noDataImg: imgOperationTemplate
  },
  '/operation/template/more': {
    noDataDesc: 'NoDataOperationTemplate',
    noDataImg: imgOperationTemplate
  },
  '/operation/monitorManagement/monitorProject': {
    noDataDesc: 'NoDataMonitorProject',
    noDataImg: imgMonitorProject
  },
  '/operation/monitorManagement/platMonitor/': {
    noDataDesc: 'NoDataMonitorProject',
    noDataImg: imgMonitorProject
  },
  '/operation/monitorManagement/alarmRecord/': {
    noDataDesc: 'NoDataAlarmRecord',
    noDataImg: imgAlarmRecord
  },
  '/operation/operationLog/': {
    noDataDesc: 'NoDataOperationLog',
    noDataImg: imgOperationLog
  },
  '/operation/baremanagement/baremachine': {
    noDataDesc: 'NoDataBareMachine',
    noDataImg: imgBare
  },
  '/operation/baremanagement/baremetal': {
    noDataDesc: 'emptyText',
    noDataImg: imgBare
  },
  '/operation/baremanagement/switch': {
    noDataDesc: 'NoDataBareSwitch',
    noDataImg: imgBareSwitch
  },
  '/project/resource/image': {
    noDataDesc: 'NoDataSystemImage',
    noDataImg: imgImage
  },
  '/project/resource/instance': {
    noDataImg: imgInstance
  },
  '/project/resource/bare': {
    noDataImg: imgBare
  },
  '/project/resource/volume': {
    noDataImg: imgVolume
  },
  '/project/resource/keypair': {
    noDataDesc: 'NoDataKeypair',
    noDataImg: imgKeypair
  },
  '/project/resource/volumeRecycle': {
    noDataDesc: 'NoDataRecycle',
    noDataImg: imgVolumeRecycle
  },
  '/project/resource/networks': {
    noDataImg: imgNetworks
  },
  '/project/resource/router': {
    noDataImg: imgRouter
  },
  '/project/resource/elasticip': {
    noDataImg: imgPublicIP
  },
  '/project/resource/qoses': {
    noDataImg: imgQoS
  },
  '/project/project/project': {
    noDataDesc: 'NoDataProject',
    noDataImg: imgProject
  },
  '/project/approval/workflow': {
    noDataDesc: 'NoDataWorkFlowDone',
    noDataImg: imgWorkFlow
  },
  '/approval/myWorkflow': {
    noDataDesc: 'NoDataWorkFlowDone',
    noDataImg: imgWorkFlow
  },
  '/project/approval/workflowContinue': {
    noDataDesc: 'NoDataWorkFlowContinue',
    noDataImg: imgWorkFlowContinue
  },
  '/project/approval/workflowFinish': {
    noDataDesc: 'NoDataWorkFlowFinish',
    noDataImg: imgWorkFlowFinish
  },
  '/operate/deptManagement': {
    noDataDesc: 'NoDataDepartmentManagement',
    noDataImg: imgDepartment
  },
  '/project/audit/resourcelog': {
    noDataDesc: 'NoDataResourcelog',
    noDataImg: imgLog
  },
  '/project/audit/businesslog': {
    noDataDesc: 'NoDataBusinesslog',
    noDataImg: imgLog
  },
  '/project/service/template': {
    noDataImg: imgServiceTemplate
  },
  '/project/service/instance': {
    noDataImg: imgServiceInstance
  }
}
