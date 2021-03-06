/* eslint-disable */
import { API_Prefix as prefix } from '~/constants'

const api = {
    listNode: `${prefix}listNode`, // 获取node列表；
    listClusterPVInfo: `${prefix}listClusterPVInfo`, // 获取PV列表；
    listClusterResourceStorageClass: `${prefix}listClusterResourceStorageClass`, // 获取集群的storageclass信息
    getNodeDetail: `${prefix}getNodeDetail`, // 获取App包详情
    updateLabels: `${prefix}updateLabels`, // 获取node节点的标签
    updateAnnotations: `${prefix}updateAnnotations`, // 获取node节点的Annotations
    updateTaints: `${prefix}updateTaints`, // 获取node节点的污点
    listNodeContainerMirrors: `${prefix}listNodeContainerMirrors`, // 获取node节点的镜像信息
    queryNodeResource: `${prefix}queryNodeResource`, // 获取node节点的资源监控信息
    listEvents: `${prefix}listEvents`, // 获取node节点的事件信息
    listNodePods: `${prefix}listNodePods`, // 获取node节点的pods信息
    queryNodeNetMonitorData: `${prefix}queryNodeNetMonitorData`, // 获取node的网络上传下载情况
    queryNodeResourcStatus: `${prefix}queryNodeResourcStatus`, // 获取node的节点资源状态信息
    queryResourcePermissions: `${prefix}queryResourcePermissions`, // 查询平台执行k8s资源权限
    modifyResourcePermissions: `${prefix}modifyResourcePermissions`, // 修改平台的资源执行权限
    querylistSdnNetwork: `${prefix}querylistSdnNetwork`, // 获取网络资源
    queryNodePortRange: `${prefix}queryNodePortRange`, // 获取节点的nodeport范围
}

export default api