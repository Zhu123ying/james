/* eslint-disable */
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
        periodSeconds: 0, // 检测间隔
        timeoutSeconds: 0, // 检测超时
        failureThreshold: 0 // 失败重复
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