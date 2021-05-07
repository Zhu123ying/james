import PubSub from 'pubsub-js'
import GlobalEventHandlers from '../../eventHandlers'

const _ = window._

class EventHandler {
    constructor() {
        this.handlers = GlobalEventHandlers.map(handler => ({ func: handler, ctx: null }))
    }

    contains(handler, context) {
        let contains = false
        this.handlers.map(({ func, ctx }) => {
            if (_.isEqual(_.toString(handler), _.toString(func)) && context === ctx) {
                contains = true
            }
        })

        return contains
    }

    register({ handler, context = null }) {
        if (handler) {
            if (_.isFunction(handler)) {
                if (!this.contains(handler, context)) {
                    this.handlers.push({ func: handler, ctx: context })
                }
            }
        }
    }

    remove({ handler, context = null }) {
        this.handlers = this.handlers.filter(({ func, ctx }) => (!_.isEqual(_.toString(handler), _.toString(func)) || context !== ctx))
    }

    handleEvent(...params) {
        this.handlers.map(({ func, ctx }) => {
            func.call(ctx, ...params)
        })
    }

    trigger(type, message) {
        // 发布消息
        PubSub.publish(type, message)
    }
}

// 不需要特殊处理的事件类型，只是弹出全局提示
const BYPASS_EVENT_LIST = {
    'resource.vm.create': 'resource.vm.create',
    'resource.vm.updateAdminPassword': 'resource.vm.updateAdminPassword',
    'resource.vm.start': 'resource.vm.start',
    'resource.vm.placeVmInRecycleBin': 'resource.vm.placeVmInRecycleBin',
    'resource.vm.stop': 'resource.vm.stop',
    'resource.vm.pause': 'resource.vm.pause',
    'resource.vm.recover': 'resource.vm.recover',
    'resource.vm.recoverVmFromRecycleBin': 'resource.vm.recoverVmFromRecycleBin',
    'resource.vm.reboot': 'resource.vm.reboot',
    'resource.vm.migrate': 'resource.vm.migrate',
    'resource.vm.resize': 'resource.vm.resize',
    'resource.vm.resizeHot': 'resource.vm.resizeHot',
    'resource.environment.sync': 'resource.environment.sync', // 系统设置同步
    'resource.project.allocate': 'resource.project.allocate', // 分配至项目
    'resource.project.allocateVirtualMachine': 'resource.project.allocateVirtualMachine',
    'resource.vm.delete': 'resource.vm.delete',
    'resource.vm.attachDisk': 'resource.vm.attachDisk',
    'resource.vm.detachDisk': 'resource.vm.detachDisk',
    'resource.vm.copy': 'resource.vm.copy',
    'resource.vm.clone': 'resource.vm.clone',
    'resource.vm.attachInterface': 'resource.vm.attachInterface',
    'resource.vm.detachInterface': 'resource.vm.detachInterface',
    'resource.vmSnapshot.create': 'resource.vmSnapshot.create',
    'resource.vmSnapshot.apply': 'resource.vmSnapshot.apply',
    'resource.vmSnapshot.delete': 'resource.vmSnapshot.delete',
    'resource.image.create': 'resource.image.create',
    'resource.image.delete': 'resource.image.delete',
    'resource.image.upload': 'resource.image.upload',
    'resource.image.customclone': 'resource.image.customclone',
    'resource.image.systemclone': 'resource.image.systemclone',
    'resource.image.systemissued': 'resource.image.systemissued',
    'resource.image.customissued': 'resource.image.customissued',
    'resource.image.isoissued': 'resource.image.isoissued',
    'resource.disk.create': 'resource.disk.create',
    'resource.disk.delete': 'resource.disk.delete',
    'resource.disk.resize': 'resource.disk.resize',
    'resource.disk.createAndAttachDisk': 'resource.disk.createAndAttachDisk',
    'resource.disk.detachAndRemoveDisk': 'resource.disk.detachAndRemoveDisk',
    'resource.disk.createAndAttach': 'resource.disk.createAndAttach',
    'resource.disk.detachAndRemove': 'resource.disk.detachAndRemove',
    'resource.disk.createBySnapshot': 'resource.disk.createBySnapshot',
    'resource.diskSnapshot.create': 'resource.diskSnapshot.create',
    'resource.diskSnapshot.apply': 'resource.diskSnapshot.apply',
    'resource.diskSnapshot.delete': 'resource.diskSnapshot.delete',
    'resource.keypair.sync': 'resource.keypair.sync',
    'resource.vpc.sync': 'resource.vpc.sync',
    'resource.elasticip.sync': 'resource.elasticip.sync',
    'resource.publicnetworkip.sync': 'resource.publicnetworkip.sync',
    'resource.network.sync': 'resource.network.sync',
    'resource.router.sync': 'resource.router.sync',
    'resource.firewall.sync': 'resource.firewall.sync',
    'resource.floatingip.sync': 'resource.floatingip.sync',
    'resource.disk.sync': 'resource.disk.sync',
    'resource.vm.sync': 'resource.vm.sync',
    'resource.vm.changeInterface': 'resource.vm.changeInterface',
    'resource.disk.migrateStorage': 'resource.disk.migrateStorage',
    'resource.vm.migrateStorage': 'resource.vm.migrateStorage',
    'resource.zone.sync': 'resource.zone.sync',
    'resource.vm.attachGpu': 'resource.vm.attachGpu',
    'resource.vm.detachGpu': 'resource.vm.detachGpu',
    'resource.vm.attachVgpu': 'resource.vm.attachVgpu',
    'resource.vm.detachVgpu': 'resource.vm.detachVgpu',
    'identity.project.reviseQuota': 'identity.project.reviseQuota', // 配额校准

    // 资源编排
    'orchestration.blueprint.create': 'orchestration.blueprint.create',
    'orchestration.blueprint.delete': 'orchestration.blueprint.delete',
    'orchestration.blueprintVersion.create': 'orchestration.blueprintVersion.create',
    'orchestration.blueprintVersion.delete': 'orchestration.blueprintVersion.delete',
    'orchestration.deployment.create': 'orchestration.deployment.create',
    'orchestration.deployment.delete': 'orchestration.deployment.delete',

    // 负载均衡器
    'resource.loadbalancer.create': 'resource.loadbalancer.create',
    'resource.loadbalancer.delete': 'resource.loadbalancer.delete',
    'resource.loadbalancer.update': 'resource.loadbalancer.update',
    'resource.loadbalancer.repair': 'resource.loadbalancer.repair',
    'resource.loadbalancer.enable': 'resource.loadbalancer.enable',
    'resource.loadbalancer.disable': 'resource.loadbalancer.disable',
    'resource.loadbalancer.detachFloatingIp': 'resource.loadbalancer.detachFloatingIp',
    'resource.listener.create': 'resource.listener.create',
    'resource.listener.update': 'resource.listener.update',
    'resource.listener.delete': 'resource.listener.delete',
    'resource.pool.create': 'resource.pool.create',
    'resource.pool.update': 'resource.pool.update',
    'resource.pool.delete': 'resource.pool.delete',
    'resource.backend.create': 'resource.backend.create',
    'resource.backend.update': 'resource.backend.update',
    'resource.backend.delete': 'resource.backend.delete',
    'resource.policy.create': 'resource.policy.create',
    'resource.policy.update': 'resource.policy.update',
    'resource.policy.delete': 'resource.policy.delete',
    'resource.cert.create': 'resource.cert.create',
    'resource.cert.delete': 'resource.cert.delete',

    // 虚机
    'resource.vm.update': 'resource.vm.update',
    'resource.vm.updateVirtualMachinePolicy': 'resource.vm.updateVirtualMachinePolicy',
    'resource.vm.attachUsb': 'resource.vm.attachUsb',
    'resource.vm.detachUsb': 'resource.vm.detachUsb',
    'resource.vm.attachIso': 'resource.vm.attachIso',
    'resource.vm.detachIso': 'resource.vm.detachIso',
    'resource.vm.attachKeypair': 'resource.vm.attachKeypair',
    'resource.vm.detachKeypair': 'resource.vm.detachKeypair',
    'resource.vm.updateDefaultRoute': '',
    'resource.gpu.attach': 'resource.gpu.attach',
    'resource.gpu.detac': 'resource.gpu.detac',
    'resource.disk.updateQos': 'resource.disk.updateQos',
    'resource.disk.update': 'resource.disk.update',
    'resource.interface.updateSecurityGroup': 'resource.interface.updateSecurityGroup',
    'resource.interface.updateInterfaceSecurityGroup': 'resource.interface.updateInterfaceSecurityGroup',

    // 回收站
    'resource.recycleBin.recover': 'resource.recycleBin.recover',
    'resource.recycleBin.placeIn': 'resource.recycleBin.placeIn',

    // 镜像
    'resource.image.update': 'resource.image.update',
    'resource.image.clone': 'resource.image.clone',
    'resource.image.enable': 'resource.image.enable',
    'resource.image.disable': 'resource.image.disable',

    // 密钥对
    'resource.keypair.create': 'resource.keypair.create',
    'resource.keypair.delete': 'resource.keypair.delete',

    // 安全组
    'resource.securityGroup.create': 'resource.securityGroup.create',
    'resource.securityGroup.update': 'resource.securityGroup.update',
    'resource.securityGroup.delete': 'resource.securityGroup.delete',
    'resource.securityGroup.createRule': 'resource.securityGroup.createRule',
    'resource.securityGroup.disableRule': 'resource.securityGroup.disableRule',
    'resource.securityGroup.enableRule': 'resource.securityGroup.enableRule',
    'resource.securityGroup.deleteRule': 'resource.securityGroup.deleteRule',

    // 网络
    'resource.network.create': 'resource.network.create',
    'resource.network.update': 'resource.network.update',
    'resource.network.delete': 'resource.network.delete',
    'resource.subnet.create': 'resource.subnet.create',
    'resource.subnet.update': 'resource.subnet.update',
    'resource.subnet.delete': 'resource.subnet.delete',

    // 容器集群
    'kuber.kubernetes.create': 'kuber.kubernetes.create',
    'kuber.kubernetes.rebuild': 'kuber.kubernetes.rebuild',
    'kuber.kubernetes.removeNode': 'kuber.kubernetes.removeNode',
    'kuber.kubernetes.addNode': 'kuber.kubernetes.addNode',
    'kuber.kubernetes.reBuildNode': 'kuber.kubernetes.reBuildNode',
    'kuber.kubernetes.evictWorker': 'kuber.kubernetes.evictWorker',
    'kuber.kubernetes.upgrade': 'kuber.kubernetes.upgrade',
    'kuber.kubernetes.delete': 'kuber.kubernetes.delete',

    // 裸机
    'resource.bareMetal.createNode': 'resource.bareMetal.createNode',
    'resource.bareMetal.turnOnNode': 'resource.bareMetal.turnOnNode',
    'resource.bareMetal.turnOffNode': 'resource.bareMetal.turnOffNode',
    'resource.bareMetal.rebootNode': 'resource.bareMetal.rebootNode',
    'resource.bareMetal.removeNode': 'resource.bareMetal.removeNode',
    'resource.bareMetal.changeNodeSystem': 'resource.bareMetal.changeNodeSystem',
    'resource.bareMetal.establishNode': 'resource.bareMetal.establishNode',
    'resource.bareMetal.deleteNode': 'resource.bareMetal.deleteNode',
    'resource.bareMetal.attachNetwork': 'resource.bareMetal.attachNetwork',
    'resource.bareMetal.detachNetwork': 'resource.bareMetal.detachNetwork',
    'resource.bareMetal.uploadSystemImage': 'resource.bareMetal.uploadSystemImage',
    'resource.bareMetal.deleteSystemImage': 'resource.bareMetal.deleteSystemImage',
    'resource.bareMetal.createSwitch': 'resource.bareMetal.createSwitch',
    'resource.bareMetal.updateSwitch': 'resource.bareMetal.updateSwitch'
}

// 资源类型
const RESOURCE_EVENT_LIST = {
    'resource.vm.create': 'resource.vm.create',
    'resource.vm.updateAdminPassword': 'resource.vm.updateAdminPassword',
    'resource.vm.placeVmInRecycleBin': 'resource.vm.placeVmInRecycleBin',
    'resource.vm.start': 'resource.vm.start',
    'resource.vm.stop': 'resource.vm.stop',
    'resource.vm.pause': 'resource.vm.pause',
    'resource.vm.recover': 'resource.vm.recover',
    'resource.vm.recoverVmFromRecycleBin': 'resource.vm.recoverVmFromRecycleBin',
    'resource.vm.reboot': 'resource.vm.reboot',
    'resource.vm.migrate': 'resource.vm.migrate',
    'resource.vm.resize': 'resource.vm.resize',
    'resource.vm.resizeHot': 'resource.vm.resizeHot',
    'resource.environment.sync': 'resource.environment.sync', // 系统设置同步
    'resource.vm.delete': 'resource.vm.delete',
    'resource.vm.attachDisk': 'resource.vm.attachDisk',
    'resource.vm.detachDisk': 'resource.vm.detachDisk',
    'resource.vm.copy': 'resource.vm.copy',
    'resource.vm.clone': 'resource.vm.clone',
    'resource.vm.attachInterface': 'resource.vm.attachInterface',
    'resource.vmSnapshot.create': 'resource.vmSnapshot.create',
    'resource.vmSnapshot.apply': 'resource.vmSnapshot.apply',
    'resource.vmSnapshot.delete': 'resource.vmSnapshot.delete',
    'resource.image.upload': 'resource.image.upload',
    'resource.image.customclone': 'resource.image.customclone',
    'resource.image.systemclone': 'resource.image.systemclone',
    'resource.image.systemissued': 'resource.image.systemissued',
    'resource.image.customissued': 'resource.image.customissued',
    'resource.image.isoissued': 'resource.image.isoissued',
    'resource.image.create': 'resource.image.create',
    'resource.image.delete': 'resource.image.delete',
    'resource.disk.create': 'resource.disk.create',
    'resource.disk.delete': 'resource.disk.delete',
    'resource.disk.createAndAttachDisk': 'resource.disk.createAndAttachDisk',
    'resource.disk.detachAndRemoveDisk': 'resource.disk.detachAndRemoveDisk',
    'resource.disk.resize': 'resource.disk.resize',
    'resource.disk.createBySnapshot': 'resource.disk.createBySnapshot',
    'resource.diskSnapshot.create': 'resource.diskSnapshot.create',
    'resource.diskSnapshot.apply': 'resource.diskSnapshot.apply',
    'resource.diskSnapshot.delete': 'resource.diskSnapshot.delete',
    'resource.vm.changeInterface': 'resource.vm.changeInterface',

    // 负载均衡器
    'resource.loadbalancer.create': 'resource.loadbalancer.create',
    'resource.loadbalancer.delete': 'resource.loadbalancer.delete',
    'resource.loadbalancer.update': 'resource.loadbalancer.update',
    'resource.loadbalancer.repair': 'resource.loadbalancer.repair',
    'resource.loadbalancer.enable': 'resource.loadbalancer.enable',
    'resource.loadbalancer.disable': 'resource.loadbalancer.disable',
    'resource.loadbalancer.detachFloatingIp': 'resource.loadbalancer.detachFloatingIp',
    'resource.listener.create': 'resource.listener.create',
    'resource.listener.update': 'resource.listener.update',
    'resource.listener.delete': 'resource.listener.delete',
    'resource.pool.create': 'resource.pool.create',
    'resource.pool.update': 'resource.pool.update',
    'resource.pool.delete': 'resource.pool.delete',
    'resource.backend.create': 'resource.backend.create',
    'resource.backend.update': 'resource.backend.update',
    'resource.backend.delete': 'resource.backend.delete',
    'resource.policy.create': 'resource.policy.create',
    'resource.policy.update': 'resource.policy.update',
    'resource.policy.delete': 'resource.policy.delete',
    'resource.cert.create': 'resource.cert.create',
    'resource.cert.delete': 'resource.cert.delete',

    // 配额校准
    'identity.project.reviseQuota': 'identity.project.reviseQuota',

    // 虚机
    'resource.vm.detachInterface': 'resource.vm.detachInterface',
    'resource.disk.migrateStorage': 'resource.disk.migrateStorage',
    'resource.vm.migrateStorage': 'resource.vm.migrateStorage',
    'resource.project.allocate': 'resource.project.allocate',
    'resource.project.allocateVirtualMachine': 'resource.project.allocateVirtualMachine',
    'resource.vm.update': 'resource.vm.update',
    'resource.vm.updateVirtualMachinePolicy': 'resource.vm.updateVirtualMachinePolicy',
    'resource.vm.attachGpu': 'resource.vm.attachGpu',
    'resource.vm.detachGpu': 'resource.vm.detachGpu',
    'resource.vm.attachVgpu': 'resource.vm.attachVgpu',
    'resource.vm.detachVgpu': 'resource.vm.detachVgpu',
    'resource.disk.createAndAttach': 'resource.disk.createAndAttach',
    'resource.disk.detachAndRemove': 'resource.disk.detachAndRemove',
    'resource.vm.attachUsb': 'resource.vm.attachUsb',
    'resource.vm.detachUsb': 'resource.vm.detachUsb',
    'resource.vm.attachIso': 'resource.vm.attachIso',
    'resource.vm.detachIso': 'resource.vm.detachIso',
    'resource.vm.attachKeypair': 'resource.vm.attachKeypair',
    'resource.vm.detachKeypair': 'resource.vm.detachKeypair',
    'resource.vm.updateDefaultRoute': 'resource.vm.updateDefaultRoute',
    'resource.gpu.attach': 'resource.gpu.attach',
    'resource.gpu.detac': 'resource.gpu.detac',
    'resource.disk.updateQos': 'resource.disk.updateQos',
    'resource.disk.update': 'resource.disk.update',
    'resource.interface.updateSecurityGroup': 'resource.interface.updateSecurityGroup',
    'resource.interface.updateInterfaceSecurityGroup': 'resource.interface.updateInterfaceSecurityGroup',

    // 回收站
    'resource.recycleBin.recover': 'resource.recycleBin.recover',
    'resource.recycleBin.placeIn': 'resource.recycleBin.placeIn',

    // 镜像
    'resource.image.update': 'resource.image.update',
    'resource.image.clone': 'resource.image.clone',
    'resource.image.enable': 'resource.image.enable',
    'resource.image.disable': 'resource.image.disable',

    // 密钥对
    'resource.keypair.create': 'resource.keypair.create',
    'resource.keypair.delete': 'resource.keypair.delete',

    // 安全组
    'resource.securityGroup.create': 'resource.securityGroup.create',
    'resource.securityGroup.update': 'resource.securityGroup.update',
    'resource.securityGroup.delete': 'resource.securityGroup.delete',
    'resource.securityGroup.createRule': 'resource.securityGroup.createRule',
    'resource.securityGroup.disableRule': 'resource.securityGroup.disableRule',
    'resource.securityGroup.enableRule': 'resource.securityGroup.enableRule',
    'resource.securityGroup.deleteRule': 'resource.securityGroup.deleteRule',

    // 网络
    'resource.network.create': 'resource.network.create',
    'resource.network.update': 'resource.network.update',
    'resource.network.delete': 'resource.network.delete',
    'resource.subnet.create': 'resource.subnet.create',
    'resource.subnet.update': 'resource.subnet.update',
    'resource.subnet.delete': 'resource.subnet.delete',

    // 裸机
    'resource.bareMetal.createNode': 'resource.bareMetal.createNode',
    'resource.bareMetal.turnOnNode': 'resource.bareMetal.turnOnNode',
    'resource.bareMetal.turnOffNode': 'resource.bareMetal.turnOffNode',
    'resource.bareMetal.rebootNode': 'resource.bareMetal.rebootNode',
    'resource.bareMetal.removeNode': 'resource.bareMetal.removeNode',
    'resource.bareMetal.changeNodeSystem': 'resource.bareMetal.changeNodeSystem',
    'resource.bareMetal.establishNode': 'resource.bareMetal.establishNode',
    'resource.bareMetal.deleteNode': 'resource.bareMetal.deleteNode',
    'resource.bareMetal.attachNetwork': 'resource.bareMetal.attachNetwork',
    'resource.bareMetal.detachNetwork': 'resource.bareMetal.detachNetwork',
    'resource.bareMetal.uploadSystemImage': 'resource.bareMetal.uploadSystemImage',
    'resource.bareMetal.deleteSystemImage': 'resource.bareMetal.deleteSystemImage',
    'resource.bareMetal.createSwitch': 'resource.bareMetal.createSwitch',
    'resource.bareMetal.updateSwitch': 'resource.bareMetal.updateSwitch',

    // 容器集群
    'kuber.kubernetes.create': 'kuber.kubernetes.create',
    'kuber.kubernetes.rebuild': 'kuber.kubernetes.rebuild',
    'kuber.kubernetes.removeNode': 'kuber.kubernetes.removeNode',
    'kuber.kubernetes.addNode': 'kuber.kubernetes.addNode',
    'kuber.kubernetes.reBuildNode': 'kuber.kubernetes.reBuildNode',
    'kuber.kubernetes.evictWorker': 'kuber.kubernetes.evictWorker',
    'kuber.kubernetes.upgrade': 'kuber.kubernetes.upgrade',
    'kuber.kubernetes.delete': 'kuber.kubernetes.delete'
}

// 授权变更
const LICENSE_EVENT_LIST = {
    'platform.license.import': 'platform.license.import',
    'platform.license.update': 'platform.license.update'
}

// 系统设置相关事件（只推送平台管理员）
const SETTING_EVENT_LIST = {
    // NTP服务器配置
    'platform.ntp.delete': 'platform.ntp.delete',
    'platform.ntp.switch': 'platform.ntp.switch',

    // 域服务器
    'identity-engine.domainServer.sync': 'identity-engine.domainServer.sync',

    // SSL证书
    'platform.sslCert.update': 'platform.sslCert.update',

    // SSH配置
    'platform.sshConfig.update': 'platform.sshConfig.update'
}

const SYNC_EVENT_SPEC = {
    'resource.elasticip.sync': {
        unit: '个',
        resourceName: '虚拟磁盘'
    },
    'resource.publicnetworkip.sync': {
        unit: '个',
        resourceName: '公网IP'
    },
    'resource.network.sync': {
        unit: '个',
        resourceName: '私有网络'
    },
    'resource.router.sync': {
        unit: '个',
        resourceName: '路由器'
    },
    'resource.firewall.sync': {
        unit: '个',
        resourceName: '防火墙'
    },
    'resource.floatingip.sync': {
        unit: '个',
        resourceName: '浮动IP'
    },
    'resource.vpc.sync': {
        unit: '个',
        resourceName: '专有网络VPC'
    },
    'resource.disk.sync': {
        unit: '个',
        resourceName: '虚拟磁盘'
    },
    'resource.vm.sync': {
        unit: '台',
        resourceName: '虚拟机'
    },
    'resource.keypair.sync': {
        unit: '个',
        resourceName: '密钥度'
    }
}

// 特殊处理的事件类型，仅订阅的组件弹出提示
const SPECIAL_EVENT_LIST = {
    RESOURCE_ENVIRONMENT_SYNC: 'resource.environment.sync',
    RESOURCE_VM_DETACHVGPU: 'resource.vm.detachvGpu',
    RESOURCE_VM_ATTACHVGPU: 'resource.vm.attachvGpu',
    OPSCUBE_MAINTENANCE: 'opscube.maintenance',
    OPSCUBE_INSPECT: 'opscube.inspect',
    LBAAS_LOADBALANCER_ACTIVE: 'lbaas.loadbalancer.active',
    MONITOR_ALARM_EVENT: 'monitor.alarm.event'
}

const eventHandler = new EventHandler()

export default eventHandler
export {
    BYPASS_EVENT_LIST,
    SPECIAL_EVENT_LIST,
    LICENSE_EVENT_LIST,
    SETTING_EVENT_LIST,
    RESOURCE_EVENT_LIST,
    SYNC_EVENT_SPEC
}
