/* eslint-disable */
import React from 'react'
import { RcForm, Icon, Loading, SortTable, Dialog, Radio, Input, Button as UltrauiButton, KeyValue, TagItem, InlineInput, Notification } from 'ultraui'
import './index.less'
import moment from 'moment'
import HuayunRequest from '~/http/request'
import { image as api } from '~/http/api'
import DetailDrawer from '~/components/DetailDrawer'
import { Collapse, Select, Button, Popover, Modal, Tabs, Table } from 'huayunui'
import { Row, Col } from 'antd'
import { DEFAULT_EMPTY_LABEL } from '~/constants'
import EditInputInline from '~/components/EditInputInline'
import MaintenanceRecord from './maintenanceRecord'
import PushImage from './pushImage'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'
import { checkUserAuth } from '~/utils/cache'

const _ = window._
const { Panel } = Collapse
const { TabPane } = Tabs
const notification = Notification.newInstance()
const severityObj = {
    Negligible: '可忽略',
    low: '较低',
    Medium: '中等',
    High: '严重',
    Unknown: '未知',
    Low: '较低',
    Critical: '危急'
}
const actionObj = {
    platformPublic: actions.AdminApplicationCenterImagePublicImageOperate,
    project: actions.AdminApplicationCenterImagePrivateImageOperate
}
class Detail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            basicInfo: {}, // 基础信息
            buildHistory: [], // 分层信息
            tableData: [], // 漏洞信息
            tabSubmitting: false,
            isMaintenanceRecordModalVisible: false, // 查看维护记录
            isPushImageModalVisible: false, // 推送
            scanState: false, // 扫描状态，true是正在扫描，false是扫描完成 
        }
    }
    componentWillReceiveProps({ currentImageInstance }) {
        const { id } = currentImageInstance
        id && id !== this.props.currentImageInstance.id && this.getDetailData(id)
    }
    // 获取基础信息、分层信息、漏洞信息
    getDetailData = (id) => {
        this.getImageInstanceBasicInfo(id)
        this.getImageArtifactBuildHistory(id)
        this.getImageArtifactVulnerabilities(id)
    }
    // 漏洞信息
    getImageArtifactVulnerabilities = (id = this.props.currentImageInstance.id) => {
        HuayunRequest(api.getImageArtifactVulnerabilities, { id }, {
            success: (res) => {
                this.setState({
                    tableData: res.data
                })
            }
        })
    }
    // 分层信息
    getImageArtifactBuildHistory = (id = this.props.currentImageInstance.id) => {
        HuayunRequest(api.getImageArtifactBuildHistory, { id }, {
            success: (res) => {
                this.setState({
                    buildHistory: res.data
                })
            }
        })
    }
    // 基础信息
    getImageInstanceBasicInfo = (id = this.props.currentImageInstance.id) => {
        HuayunRequest(api.getImageArtifactInfo, { id }, {
            success: (res) => {
                this.setState({
                    basicInfo: res.data
                })
            }
        })
    }
    handleScan = (id = this.props.currentImageInstance.id) => {
        HuayunRequest(api.scanImageById, { id }, {
            success: (res) => {
                const loop = () => {
                    HuayunRequest(api.getImageArtifactScanStatus, { id }, {
                        success: (res) => {
                            const { isRunning } = res.data
                            this.setState({
                                scanState: isRunning
                            }, () => {
                                // 如果正在扫描，则需要定时去获取状态，当状态为false的时候，去掉漏洞列表的接口
                                if (isRunning) {
                                    setTimeout(() => {
                                        loop()
                                    }, 1000)
                                } else {
                                    this.getImageArtifactVulnerabilities(id)
                                }
                            })
                        }
                    })
                }
                loop()
            }
        })
    }
    handleChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        })
    }
    handleTagLineSubmit = (tag) => {
        const { currentImageInstance: { id } } = this.props
        let params = {
            id,
            tag
        }
        this.setState({
            tabSubmitting: true
        })
        HuayunRequest(api.createImageTag, params, {
            success: (res) => {
                this.getImageInstanceBasicInfo(id)
                this.$EditInputInline.handleOnchange()
            },
            complete: () => {
                this.setState({
                    tabSubmitting: false
                })
            }
        })
    }
    renderTagLine = (tags) => {
        const { tagSubmitting } = this.state
        const { intl, repoType } = this.props
        const isChecked = checkUserAuth(actionObj[repoType])
        return (
            <div className='tagLine'>
                <div className='opera'>
                    {
                        repoType === 'applicationStore' || !isChecked ? (
                            <div className='labelList'>
                                {
                                    tags.map(({ name, id }) => {
                                        return (
                                            <TagItem
                                                size='small'
                                                key={id}
                                                name={name}
                                                className='tagWithoutClose'
                                            />
                                        )
                                    })
                                }
                            </div>
                        ) : (
                            <>
                                <Popover
                                    placement="top"
                                    content={
                                        <EditInputInline
                                            handleCorrectClick={this.handleTagLineSubmit}
                                            submitting={tagSubmitting}
                                            ref={node => this.$EditInputInline = node}
                                        />
                                    }
                                    trigger="click"
                                    destroyTooltipOnHide={true}
                                >
                                    <Button
                                        type="primary"
                                        size="small"
                                        icon="icon-add"
                                    />
                                </Popover>
                                <div className='labelList'>
                                    {
                                        tags.map(({ name, id }) => {
                                            return (
                                                <TagItem
                                                    size='small'
                                                    key={id}
                                                    name={name}
                                                    icon="error"
                                                    onClick={() => this.handleRemoveTag(name)}
                                                    className='tagWithClose'
                                                />
                                            )
                                        })
                                    }
                                </div>
                            </>
                        )
                    }
                </div>
                <ActionAuth action={actionObj[repoType]}>
                    <UltrauiButton
                        type="text"
                        onClick={() => this.handleChange('isMaintenanceRecordModalVisible', true)}
                        className='br'
                    >
                        <Icon type="Willdo" />&nbsp;维护记录
                    </UltrauiButton>
                </ActionAuth>
            </div>
        )
    }
    // 删除tag
    handleRemoveTag = (tag) => {
        const { currentImageInstance: { id } } = this.props
        let params = {
            id,
            tag
        }
        HuayunRequest(api.deleteImageTag, params, {
            success: (res) => {
                this.getImageInstanceBasicInfo(id)
            }
        })
    }
    // 确认推送镜像
    handleConfirmPushImage = () => {
        const { intl, currentImageInstance: { id: sourceImageId } } = this.props
        this.$PushImage.props.form.validateFields((error, values) => {
            if (error) {
                return
            }
            const { type, projectId, targetImage, targetRepo } = this.$PushImage.state
            const params = Object.assign(
                {
                    sourceImageId,
                    targetImage,
                    targetRepo
                }, type === 'projectRepo' ? {
                    projectId
                } : {}
            )
            const url = type === 'projectRepo' ? 'createImageByPushToProject' : 'createImageByPushToPubRepo'
            HuayunRequest(api[url], params, {
                success: (res) => {
                    this.setState({
                        isPushImageModalVisible: false
                    })
                    this.getDetailData(sourceImageId)
                    notification.notice({
                        id: new Date(),
                        type: 'success',
                        title: intl.formatMessage({ id: 'Success' }),
                        content: `推送镜像${intl.formatMessage({ id: 'Success' })}`,
                        iconNode: 'icon-success-o',
                        duration: 5,
                        closable: true
                    })
                }
            })
        })
    }
    getTableColumns = () => {
        const { intl } = this.props
        const columns = [ // 表格的列数组配置
            {
                key: 'id',
                dataIndex: 'id',
                title: '缺陷码'
            },
            {
                key: 'severity',
                dataIndex: 'severity',
                title: '严重程度',
                render(key) {
                    return severityObj[key] || DEFAULT_EMPTY_LABEL
                }
            },
            {
                key: 'package',
                dataIndex: 'package',
                title: '组件'
            },
            {
                key: 'version',
                dataIndex: 'version',
                title: '当前版本'
            },
            {
                key: 'fix_version',
                dataIndex: 'fix_version',
                title: '修复版本'
            },
        ]
        return columns
    }
    render() {
        // repoType为applicationStore的时候，是没有推送，删除，tag的增删操作的
        const { intl, onClose, visible, currentImageInstance, handleDelete, repoType } = this.props
        const { basicInfo, buildHistory, isMaintenanceRecordModalVisible, isPushImageModalVisible, tableData, scanState } = this.state
        const { repoName, tags, digest, os, architecture, imageSize, createTime, createByName, imageSource } = basicInfo
        const basicKeyValue = [
            {
                label: 'Repo',
                value: repoName || DEFAULT_EMPTY_LABEL
            },
            {
                label: 'Tag',
                value: this.renderTagLine(tags || [])
            },
            {
                label: 'ID',
                value: digest || DEFAULT_EMPTY_LABEL
            },
            {
                label: 'OS/ARCH',
                value: `${os}/${architecture}`
            },
            {
                label: '体积',
                value: imageSize
            },
            {
                label: '获取时间',
                value: createTime
            },
            {
                label: '创建人',
                value: createByName
            },
            {
                label: '来源',
                value: imageSource
            }
        ]
        return (
            <DetailDrawer
                name={currentImageInstance.digest}
                icon='log-1'
                onRefresh={this.getDetailData}
                onClose={onClose}
                visible={visible}
                className='imageInstanceDetailDrawer'
            >
                {
                    repoType === 'applicationStore' ? null : (
                        <ActionAuth action={actionObj[repoType]}>
                            <div className='operaBar'>
                                <UltrauiButton
                                    type="text"
                                    onClick={() => this.handleChange('isPushImageModalVisible', true)}
                                    className='br'
                                >
                                    <Icon type="release" />&nbsp;{intl.formatMessage({ id: 'Push' })}
                                </UltrauiButton>
                                <UltrauiButton
                                    type="text"
                                    onClick={handleDelete}
                                >
                                    <Icon type="empty" />&nbsp;{intl.formatMessage({ id: 'Delete' })}
                                </UltrauiButton>
                            </div>
                        </ActionAuth>
                    )
                }
                <Tabs defaultActiveKey="1">
                    <TabPane tab={intl.formatMessage({ id: 'Detail' })} key="1">
                        <Collapse defaultActiveKey={['1']} className='basicInforCollapse'>
                            <Panel header={intl.formatMessage({ id: 'BasicInfo' })} key='1'>
                                <KeyValue values={basicKeyValue} className='basicKeyValue' />
                            </Panel>
                        </Collapse>
                    </TabPane>
                    <TabPane tab={intl.formatMessage({ id: 'ImageLayerInformation' })} key="2">
                        <Collapse defaultActiveKey={['1']} className='imageLayerInfoCollapse'>
                            <Panel header={intl.formatMessage({ id: 'ImageLayerInformation' })} key='1'>
                                {
                                    buildHistory.map(({ created, created_by, comment }) => {
                                        return (
                                            <div className='historyItem'>
                                                <div className='createdBy'>{created_by || comment}</div>
                                                <div className='createdItem'>{moment(created).format("YYYY-MM-DD HH:mm:ss")}</div>
                                            </div>
                                        )
                                    })
                                }
                            </Panel>
                        </Collapse>
                    </TabPane>
                    <TabPane tab={intl.formatMessage({ id: 'VulnerabilityInformation' })} key="3" className='vulnerabilityInfoPanel'>
                        <ActionAuth action={actionObj[repoType]}>
                            <Button
                                type={scanState ? 'default' : 'operate'}
                                icon={<Icon type={scanState ? 'loading' : 'xunjian'} />}
                                onClick={() => this.handleScan()}
                                name={scanState ? `扫描中` : `扫描`}
                                className='scanBtn'
                            />
                        </ActionAuth>
                        <Table
                            columns={this.getTableColumns()}
                            dataSource={tableData}
                            pagination={false}
                        // expandable={{}}
                        />
                    </TabPane>
                </Tabs>
                <Modal
                    title='维护记录'
                    visible={isMaintenanceRecordModalVisible}
                    onCancel={() => this.handleChange('isMaintenanceRecordModalVisible', false)}
                    destroyOnClose={true}
                    className='ImageManage_pullRecordModal'
                    width={800}
                    footer={null}
                    zIndex={9999}
                >
                    <MaintenanceRecord
                        intl={intl}
                        id={currentImageInstance.id}
                        wrappedComponentRef={node => this.$MaintenanceRecord = node} />
                </Modal>
                <Modal
                    title='镜像推送'
                    visible={isPushImageModalVisible}
                    onOk={this.handleConfirmPushImage}
                    onCancel={() => this.handleChange('isPushImageModalVisible', false)}
                    destroyOnClose={true}
                    className='ImageManage_addPullModal'
                    zIndex={9999}
                >
                    <PushImage
                        intl={intl}
                        wrappedComponentRef={node => this.$PushImage = node} />
                </Modal>
            </DetailDrawer >
        )
    }
}

export default Detail
