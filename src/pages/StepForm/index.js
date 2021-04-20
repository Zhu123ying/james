import React, { useState } from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import { RcForm } from '@huayun/ultraui'
import MultiLineMessage from 'components/MultiLineMessage'
import { getStepComponent } from './Step'
import BasicConfig from './BasicConfig'
import DiskConfig from './DiskConfig'
import { ENUM } from '~/constants/enum/resource'
import './style.less'
import styled from 'styled-components'

const Step = getStepComponent([
    { title: '基本配置' },
    { title: '磁盘配置' }
])
const { Form, FormRow } = RcForm

const StyledTitle = styled.b`
    margin-bottom: 8px;
    display: block;
    font-size: 16px;
    font-weight: bolder;
`

function ARCHCreate({ envId, history, availableZoneId, form }) {
    const intl = useIntl()
    const { formatMessage } = intl
    const [formDataParams, setFormDataParams] = useState({}) // 表单
    const [dataDisks, setDataDisks] = useState([]) // 数据盘数据与系统盘数据
    const [currentStep, setCurrentStep] = useState(0) // 创建桌面步骤
    const [netConfigParams, setNetConfigParams] = useState({})

    const handleSubmit = ({ userIds, policyGroupId }) => {
        const { name, defaultType, cpuDefault, ramDefault, instanceCount, defaultProject, defaultImage, defaultWay, defaultHost, slotCount, gpuData, gpuDefault, defaultOs, diskSize, systemDiskAttribute, imageType, cluster } = formDataParams
        const { loginWay, loginPass, sshKey, initScript, selectedNetList, defaultSecurityGroup, curSubnetId, ipAddress, ipAddressType, curIPv4SubnetId, curIPv6SubnetId, dualStackIPv4IpAddress, dualStackIPv6IpAddress } = netConfigParams
        const postParam = {
            environmentId: envId,
            name,
            type: defaultType,
            availableZoneId,
            count: +instanceCount,
            ownerId: defaultProject,
            imageId: defaultImage,
            createVmType: defaultWay,
            hostId: defaultWay === ENUM.MANUAL ? defaultHost : null,
            flavor: {
                cpu: cpuDefault,
                memory: ramDefault,
                sockets: slotCount
            },
            userIds,
            policyGroupId
        }
        if (cluster !== 'auto') {
            postParam.zoneId = cluster
        }
        postParam.disk = dataDisks.map(item => ({
            ...item,
            name: undefined
        }))

        if (!_.isEmpty(gpuData)) {
            const { productId = '', vendorId = '' } = gpuData
            postParam.gpu = {
                count: gpuDefault,
                vendorId,
                productId
            }
        }

        if (imageType === ENUM.ISO) {
            postParam.os = defaultOs
            postParam.disk.push({
                size: diskSize,
                isSystem: true,
                mirroringNumber: systemDiskAttribute.mirroring,
                rebuildPriority: systemDiskAttribute.rebuildPriority,
                pageSize: systemDiskAttribute.pageSize,
                compression: systemDiskAttribute.compressionAlgorithm,
                readCache: systemDiskAttribute.readCache
            })
        } else {
            // 判断登录方式选择的是密码登录 还是密钥登录
            if (loginWay === ENUM.PASSWORD_LOGIN) {
                // 如果是密码登录
                postParam.password = loginPass
            } else {
                postParam.keypair = [sshKey]
            }
            postParam.script = [initScript]
        }
        // 处理选择的网络信息
        // 根据选择的桌面数量获取不同的网络信息
        if (instanceCount > 1) {
            if (!_.isEmpty(selectedNetList)) {
                postParam.interface = selectedNetList.map(item => ({
                    subnet: {
                        id: item.value
                    },
                    securityGroupId: defaultSecurityGroup
                }))
            }
        } else {
            // 单栈网络
            if (ipAddressType === ENUM.NORMAL) {
                if (curSubnetId) {
                    postParam.interface = [{
                        ip: imageType === ENUM.ISO ? undefined : ipAddress,
                        subnet: {
                            id: curSubnetId
                        },
                        securityGroupId: defaultSecurityGroup
                    }]
                }
            }
            // 双栈网络
            if (ipAddressType === ENUM.DUALSTACK) {
                postParam.interface = [{
                    ip: imageType === ENUM.ISO ? undefined : dualStackIPv4IpAddress,
                    ipDualStack: dualStackIPv6IpAddress,
                    subnet: {
                        id: curIPv4SubnetId
                    },
                    subnetDualStack: {
                        id: curIPv6SubnetId
                    },
                    securityGroupId: defaultSecurityGroup
                }]
            }
        }
    }

    const handleBasicConfigNext = (params) => {
        setFormDataParams(params)
        setCurrentStep(1)
    }

    const handleNetConfigNext = (params) => {
        setNetConfigParams(params)
        setCurrentStep(currentStep + 1)
    }

    const handleChangeDisks = (val) => {
        setDataDisks(val)
    }

    const handleReset = () => {
        history.goBack()
    }

    // 基本配置
    const handleRenderStepOne = () => {
        return (
            <BasicConfig
                form={form}
                onReset={handleReset}
                onNext={handleBasicConfigNext}
            />
        )
    }

    // 磁盘配置
    const handleRenderStepTwo = () => {
        return (
            <DiskConfig
                form={form}
                formDataParams={formDataParams}
                onChangeDisks={handleChangeDisks}
                onReset={handleReset}
                onPrev={() => setCurrentStep(currentStep - 1)}
                onNext={() => setCurrentStep(currentStep + 1)}
            />
        )
    }

    // 网络配置
    // const handleRenderStepThree = () => {
    //     return (
    //         <NetConfig
    //             form={form}
    //             formDataParams={formDataParams}
    //             onReset={handleReset}
    //             onPrev={() => setCurrentStep(currentStep - 1)}
    //             onNext={handleNetConfigNext}
    //         />
    //     )
    // }

    // 访问控制
    // const handleRenderStepFour = () => {
    //     return (
    //         <VisitConfig
    //             form={form}
    //             onReset={handleReset}
    //             instanceCount={formDataParams.instanceCount || 1}
    //             onPrev={() => setCurrentStep(currentStep - 1)}
    //             onSubmit={handleSubmit}
    //         />
    //     )
    // }

    return (
        <Form
            form={form}
            subMessage
            className="create_step create_vm_archer"
        >
            <FormRow
                mainStyle={{ paddingRight: '10%' }}
            >
                <div>
                    <StyledTitle>{formatMessage({ id: 'SettingBaseInfo' })}</StyledTitle>
                    <div className="details">
                        <MultiLineMessage id="ArcherCreateBaseInfo" />
                    </div>
                </div>
                <div>
                    <Step visible={currentStep === 0} currentStep={0}>
                        {handleRenderStepOne()}
                    </Step>
                    <Step visible={currentStep === 1} currentStep={1}>
                        {handleRenderStepTwo()}
                    </Step>
                    {/* <Step visible={currentStep === 2} currentStep={2}>
                        {handleRenderStepThree()}
                    </Step>
                    <Step visible={currentStep === 3} currentStep={3}>
                        {handleRenderStepFour()}
                    </Step> */}
                </div>
            </FormRow>
        </Form>
    )
}

ARCHCreate.propTypes = {
    envId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    availableZoneId: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired
}

export default RcForm.create()(ARCHCreate)
