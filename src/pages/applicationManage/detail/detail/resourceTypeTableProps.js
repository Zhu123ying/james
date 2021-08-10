
import ConfigMap from './constant/ConfigMap'
import CronJob from './constant/CronJob'
import DaemonSet from './constant/DaemonSet'
import Deployment from './constant/Deployment'
import Job from './constant/Job'
import Other from './constant/Other'
import PersistentVolumeClaim from './constant/PersistentVolumeClaim'
import Pod from './constant/Pod'
import ReplicaSet from './constant/ReplicaSet'
import ReplicationController from './constant/ReplicationController'
import Secret from './constant/Secret'
import StatefulSet from './constant/StatefulSet'
import Service from './constant/Service'
import Ingress from './constant/Ingress'
import Limitrange from './constant/Limitrange'
import Resourcequota from './constant/Resourcequota'
import ServiceAccount from './constant/ServiceAccount'

// 资源类型表格的相关属性
// intl是国际化，this_是组件实例，key是用来判断是否可展开，以及展开的行，data是列表数据
// zIndex是指明第几层资源对象，第一层资源对象可以查看申明，最底层pod能查看日志
const resourceTypeTableProps = (intl, key, this_, type) => {
    const data = this_.state.tableDataObj[key] || []
    return {
        ConfigMap: ConfigMap(intl, data, this_, key),
        CronJob: CronJob(intl, data, this_, key),
        DaemonSet: DaemonSet(intl, data, this_, key),
        Deployment: Deployment(intl, data, this_, key),
        Job: Job(intl, data, this_, key),
        Other: Other(intl, data, this_, key),
        PersistentVolumeClaim: PersistentVolumeClaim(intl, data, this_, key, type),
        Pod: Pod(intl, data, this_, key),
        ReplicaSet: ReplicaSet(intl, data, this_, key),
        ReplicationController: ReplicationController(intl, data, this_, key),
        Secret: Secret(intl, data, this_, key),
        StatefulSet: StatefulSet(intl, data, this_, key),
        Service: Service(intl, data, this_, key),
        Ingress: Ingress(intl, data, this_, key),
        LimitRange: Limitrange(intl, data, this_, key),
        Resourcequota: Resourcequota(intl, data, this_, key),
        ServiceAccount: ServiceAccount(intl, data, this_, key)
    }
}

export default (intl, key, this_, type) => {
    return resourceTypeTableProps(intl, key, this_, type)[key]
}