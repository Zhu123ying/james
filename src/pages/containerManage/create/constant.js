/* eslint-disable */
import { Popover } from 'huayunui'

export const containerConfig_containerItem = {
    name: '',
    type: '',
    image: {   // 镜像
        project: '',
        repo: '',
        tag: '',
        pullStrategy: ''
    },
    runVar: {
        workDir: '', // 工作目录
        command: [], // 启动命令
        args: [], // 启动参数
        privileged: false, // 特权
    },
    envs: [], // 环境变量
    probe: {  // 健康检测
        type: '', // Liveness只有这个选项
        manner: '', // exec只有这个选项
        command: '', // 指令
        initialDelaySeconds: 0, // 初始化等待
        periodSeconds: 10, // 检测间隔
        timeoutSeconds: 1, // 检测超时
        failureThreshold: 3 // 失败重复
    }, // 监看检测
    ports: [], // 端口
    mounts: [], // 挂载
}

export const affinityConfig_matchFieldItem = {
    key: '',
    operator: '',
    values: []
}

export const affinityConfig_matchExpressionItem = {
    key: '',
    operator: '',
    values: []
}

export const affinityConfig_matchLabelItem = {
    labelKey: '',
    labelValue: []
}

export const affinityConfigInitData = {            // 亲和性
    nodeAffinity: {
        prefers: [
            {
                weight: '',
                matchFields: [{ ...affinityConfig_matchFieldItem }],
                matchExpressions: [{ ...affinityConfig_matchExpressionItem }]
            }
        ],
        require: {
            matchTerms: [
                {
                    matchFields: [{ ...affinityConfig_matchFieldItem }],
                    matchExpressions: [{ ...affinityConfig_matchExpressionItem }]
                }
            ]
        }
    },
    platformContainerAffinity: {
        prefers: [
            {
                weight: '',
                namespaces: [],
                topologyKey: '',
                matchLabels: [{ ...affinityConfig_matchLabelItem }],
                matchExpressions: [{ ...affinityConfig_matchExpressionItem }]
            }
        ],
        requires: [
            {
                namespaces: [],
                topologyKey: '',
                matchLabels: [{ ...affinityConfig_matchLabelItem }],
                matchExpressions: [{ ...affinityConfig_matchExpressionItem }]
            }
        ]
    },
    platformContainerAntiAffinity: {
        prefers: [
            {
                weight: '',
                namespaces: [],
                topologyKey: '',
                matchLabels: [{ ...affinityConfig_matchLabelItem }],
                matchExpressions: [{ ...affinityConfig_matchExpressionItem }]
            }
        ],
        requires: [
            {
                namespaces: [],
                topologyKey: '',
                matchLabels: [{ ...affinityConfig_matchLabelItem }],
                matchExpressions: [{ ...affinityConfig_matchExpressionItem }]
            }
        ]
    }
}

export const networkInitData = { // 容器网络
    containerNetworks: [
        {
            name: '',
            ports: [
                {
                    containerPort: '',
                    port: 0
                }
            ]
        }
    ],
    nodeNetworks: [
        {
            name: '',
            ports: [
                {
                    containerPort: '',
                    manner: 'random',
                    port: 0
                }
            ]
        }
    ], // 节点网络
}

// 持久化日志
export const containerLogItem = {
    containerName: '',
    stdoutLogEnabled: true,
    stdoutLogConfig: {
        expireTime: 0,
        maxSize: 0
    },
    fileLogEnabled: true,
    fileLogConfig: {
        expireTime: 0,
        maxSize: 0,
        path: ''
    }
}

// 创建容器所有标签的key的正则
export const LabelKeyRegex = /^([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]$/

export const ValidLabelKeyProps = {
    validRegex: LabelKeyRegex,
    invalidMessage: (
        <div>
            不符合规范&nbsp;
            <Popover
                placement="top"
                content={<div>{`正则：${LabelKeyRegex}`}</div>}
                trigger="hover"
                type="text"
            >
                <i className='iconfont icon-info-o'></i>
            </Popover>
        </div>
    )
}

// 创建容器所有标签的value的正则
export const LabelValueRegex = /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/

export const ValidLabelValueProps = {
    validRegex: LabelValueRegex,
    invalidMessage: (
        <div>
            不符合规范&nbsp;
            <Popover
                placement="top"
                content={<div>{`正则：${LabelKeyRegex}`}</div>}
                trigger="hover"
                type="text"
            >
                <i className='iconfont icon-info-o'></i>
            </Popover>
        </div>
    )
}

// 创建容器，除了容器组名称，其他所有的名称输入的正则
export const CommonNameRegex = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/

export const ValidCommonNameProps = {
    validRegex: CommonNameRegex,
    invalidMessage: (
        <div>
            不符合规范&nbsp;
            <Popover
                placement="top"
                content={<div>{`正则：${LabelKeyRegex}`}</div>}
                trigger="hover"
                type="text"
            >
                <i className='iconfont icon-info-o'></i>
            </Popover>
        </div>
    )
    // invalidMessage: `不符合规范${CommonNameRegex}`
}

