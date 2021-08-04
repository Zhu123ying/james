/* eslint-disable */
import React from 'react'
import { RcForm, Icon, Loading, SortTable, Dialog, Radio, Input, Button as UltrauiButton, KeyValue, TagItem, InlineInput, Notification } from 'ultraui'
import './index.less'
import moment from 'moment'
import HuayunRequest from '~/http/request'
import { applicationPackage as api } from '~/http/api'
import DetailDrawer from '~/components/DetailDrawer'
import { Collapse, Select, Button, Popover, Modal, Tabs, Table } from 'huayunui'
import { Row, Col } from 'antd'
import { DEFAULT_EMPTY_LABEL } from '~/constants'
import VersionManage from './versionManage'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'
import ShareAppPackage from './shareAppPackage'

const _ = window._
const { Panel } = Collapse
const { TabPane } = Tabs
const notification = Notification.newInstance()
class Detail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            detail: {},
            isShareAppPackageModalVisible: false,
            isShareAppPackageSubmitting: false, // 分享提交状态，防止重复点击
        }
    }
    componentWillReceiveProps({ currentDataItem }) {
        const { id } = currentDataItem
        id && id !== this.props.currentDataItem.id && this.getDetailData(id)
    }
    getDetailData = (id = this.props.currentDataItem.id) => {
        HuayunRequest(api.getApplicationPackage, { id }, {
            success: (res) => {
                this.setState({
                    detail: res.data
                })
            }
        })
    }
    handleChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        })
    }
    handleManage = (id) => {
        this.props.history.push(`${this.props.match.path}/edit/${id}`)
    }
    renderRecommendConfig = (quota) => {
        const { memory, cpu, storage } = quota || {}
        const storageLine = Object.keys(storage || {}).map(key => {
            return `${key}:${storage[key]}`
        })
        const array = [`CPU:${cpu} `, `Memory:${memory}`, ...storageLine]
        return <div className='quotaRecommand'>{array.join('|')}</div>
    }
    handleShareAppPackageModalConfirm = () => {
        const { intl, currentDataItem } = this.props
        this.$ShareAppPackage.props.form.validateFields((errs, values) => {
            if (!errs) {
                const { name, applicationPackageVersionIds: ids, projectId } = this.$ShareAppPackage.state
                let params = {
                    name,
                    applicationPackageId: currentDataItem.id,
                    ids,
                    projectId
                }
                this.setState({
                    isShareAppPackageSubmitting: true
                })
                HuayunRequest(api.createApplicationPackageAndVersionByShare, params, {
                    success: (res) => {
                        const { retCode, retInfo } = res.data
                        if (retCode) {
                            notification.notice({
                                id: new Date(),
                                type: 'danger',
                                title: intl.formatMessage({ id: 'Error' }),
                                content: retInfo,
                                iconNode: 'icon-error-o',
                                duration: 5,
                                closable: true
                            })
                        } else {
                            notification.notice({
                                id: new Date(),
                                type: 'success',
                                title: intl.formatMessage({ id: 'Success' }),
                                content: `${intl.formatMessage({ id: 'ShareApplicationPackage' })}${intl.formatMessage({ id: 'Success' })}`,
                                iconNode: 'icon-success-o',
                                duration: 5,
                                closable: true
                            })
                            this.setState({
                                isShareAppPackageModalVisible: false
                            })
                        }
                    },
                    complete: () => {
                        this.setState({
                            isShareAppPackageSubmitting: false
                        })
                    }
                })
            }
        })
    }
    render() {
        const { intl, onClose, visible, currentDataItem, handleDelete } = this.props
        const { detail, isShareAppPackageModalVisible, isShareAppPackageSubmitting } = this.state
        const { id, name, projectName, tags, versionCount, updateTime, createTime, createByName, description, applicationPackageVersionList } = detail || {}
        const basicKeyValue = [
            {
                label: intl.formatMessage({ id: 'Name' }),
                value: name || DEFAULT_EMPTY_LABEL
            },
            {
                label: intl.formatMessage({ id: 'ProjectBelongTo' }),
                value: projectName || DEFAULT_EMPTY_LABEL
            },
            {
                label: intl.formatMessage({ id: 'Tag' }),
                value: (
                    <div className='labelList'>
                        {
                            (tags || []).map((item) => {
                                return (
                                    <TagItem
                                        size='small'
                                        key={item}
                                        name={item}
                                        className='tagWithoutClose'
                                    />
                                )
                            })
                        }
                    </div>
                )
            },
            {
                label: intl.formatMessage({ id: 'VersionCount' }),
                value: versionCount || DEFAULT_EMPTY_LABEL
            },
            {
                label: intl.formatMessage({ id: 'UpdateTime' }),
                value: updateTime || DEFAULT_EMPTY_LABEL
            },
            {
                label: intl.formatMessage({ id: 'CreaterName' }),
                value: createByName || DEFAULT_EMPTY_LABEL
            },
            {
                label: intl.formatMessage({ id: 'CreateTime' }),
                value: createTime || DEFAULT_EMPTY_LABEL
            },
            {
                label: intl.formatMessage({ id: 'Description' }),
                value: description || DEFAULT_EMPTY_LABEL
            }
        ]
        return (
            <>
                <DetailDrawer
                    name={name}
                    icon='log-1'
                    onRefresh={this.getDetailData}
                    onClose={onClose}
                    visible={visible}
                    className='applicationPackageDetailDrawer'
                >
                    <div className='operaBar'>
                        <ActionAuth action={actions.AdminApplicationCenterApplicationPackageOperate}>
                            <UltrauiButton
                                type="text"
                                onClick={() => this.handleManage(id)}
                                className='br'
                            >
                                <Icon type="edit" />&nbsp;{intl.formatMessage({ id: 'UpdateApplicationPackage' })}
                            </UltrauiButton>
                        </ActionAuth>
                        <ActionAuth action={actions.AdminApplicationCenterApplicationPackageOperate}>
                            <UltrauiButton
                                type="text"
                                onClick={() => this.handleChange('isShareAppPackageModalVisible', true)}
                            >
                                <Icon type="release" />&nbsp;{intl.formatMessage({ id: 'ShareApplicationPackage' })}
                            </UltrauiButton>
                        </ActionAuth>
                    </div>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab={intl.formatMessage({ id: 'Detail' })} key="1">
                            <Collapse defaultActiveKey={['1']} className='basicInforCollapse'>
                                <Panel header={intl.formatMessage({ id: 'BasicInfo' })} key='1'>
                                    <KeyValue values={basicKeyValue} className='basicKeyValue' />
                                </Panel>
                            </Collapse>
                        </TabPane>
                        <TabPane tab={intl.formatMessage({ id: 'VersionManage' })} key="2">
                            <VersionManage
                                {...this.props}
                                getDetailData={this.getDetailData}
                                applicationPackageVersionList={applicationPackageVersionList}
                            />
                        </TabPane>
                    </Tabs>
                </DetailDrawer >
                <Modal
                    title={intl.formatMessage({ id: 'ShareApplicationPackage' })}
                    visible={isShareAppPackageModalVisible}
                    onOk={this.handleShareAppPackageModalConfirm}
                    onCancel={() => this.handleChange('isShareAppPackageModalVisible', false)}
                    className='shareAppPackageModal'
                    destroyOnClose={true}
                    width={440}
                    okButtonProps={{
                        disabled: isShareAppPackageSubmitting,
                        loading: isShareAppPackageSubmitting
                    }}
                >
                    <ShareAppPackage
                        {...this.props}
                        applicationPackageId={currentDataItem.id}
                        currentPorjectId={currentDataItem.projectId}
                        wrappedComponentRef={node => this.$ShareAppPackage = node} />
                </Modal>
            </>
        )
    }
}

export default Detail
