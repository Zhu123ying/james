/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Icon, Loading, SortTable, Dialog, Radio, Input, Button as UltrauiButton, KeyValue, TagItem, InlineInput } from 'ultraui'
import './index.less'
import moment from 'moment'
import HuayunRequest from '~/http/request'
import { image as api } from '~/http/api'
import DetailDrawer from '~/components/DetailDrawer'
import { Collapse, Select, Button, Popover, Modal, Tabs } from 'huayunui'
import { Row, Col } from 'antd'
import { DEFAULT_EMPTY_LABEL } from '~/constants'
import EditInputInline from '~/components/EditInputInline'
import MaintenanceRecord from './maintenanceRecord'

const _ = window._
const { Panel } = Collapse
const { TabPane } = Tabs

class Detail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            detail: {},
            tabSubmitting: false,
            isMaintenanceRecordModalVisible: false, // 查看维护记录
        }
    }
    componentWillReceiveProps({ currentImageInstance }) {
        const { id } = currentImageInstance
        id !== this.props.currentImageInstance.id && this.getImageInstanceDetail(id)
    }
    getImageInstanceDetail = (id = this.props.currentImageInstance.id) => {
        HuayunRequest(api.getImageArtifactInfo, { id }, {
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
    handleDelete = () => {

    }
    handlePush = () => {

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
                this.getImageInstanceDetail(id)
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
        const { intl } = this.props
        return (
            <div className='tagLine'>
                <div className='opera'>
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
                                    />
                                )
                            })
                        }
                    </div>
                </div>
                <UltrauiButton
                    type="text"
                    onClick={() => this.handleChange('isMaintenanceRecordModalVisible', true)}
                    className='br'
                >
                    <Icon type="Willdo" />&nbsp;维护记录
                </UltrauiButton>
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
                this.getImageInstanceDetail(id)
            }
        })
    }
    render() {
        const { intl, onClose, visible, currentImageInstance } = this.props
        const { detail, isMaintenanceRecordModalVisible } = this.state
        const { artifactTagName, tags, digest, os, architecture, imageSize, createTime, createBy, imageSource } = detail
        const basicKeyValue = [
            {
                label: 'Repo',
                value: artifactTagName || DEFAULT_EMPTY_LABEL
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
                value: createBy
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
                onRefresh={this.getImageInstanceDetail}
                onClose={onClose}
                visible={visible}
                className='imageInstanceDetailDrawer'
            >
                <div className='operaBar'>
                    <UltrauiButton
                        type="text"
                        onClick={this.handlePush}
                        className='br'
                    >
                        <Icon type="release" />&nbsp;{intl.formatMessage({ id: 'Push' })}
                    </UltrauiButton>
                    <UltrauiButton
                        type="text"
                        onClick={this.handleDelete}
                    >
                        <Icon type="empty" />&nbsp;{intl.formatMessage({ id: 'Delete' })}
                    </UltrauiButton>
                </div>
                <Tabs defaultActiveKey="1">
                    <TabPane tab={intl.formatMessage({ id: 'Detail' })} key="1">
                        <Collapse defaultActiveKey={['1']}>
                            <Panel header="基础配置" key='1'>
                                <KeyValue values={basicKeyValue} className='basicKeyValue' />
                            </Panel>
                        </Collapse>
                    </TabPane>
                    <TabPane tab={intl.formatMessage({ id: 'ImageLayerInformation' })} key="2">
                        ImageLayerInformation
                    </TabPane>
                    <TabPane tab={intl.formatMessage({ id: 'VulnerabilityInformation' })} key="3">
                        VulnerabilityInformation
                    </TabPane>
                </Tabs>
                <Modal
                    title='维护记录'
                    visible={isMaintenanceRecordModalVisible}
                    onCancel={() => this.handleChange('isMaintenanceRecordModalVisible', false)}
                    getContainer={document.getElementById('ImageManage')}
                    destroyOnClose={true}
                    className='pullRecordModal'
                    width={800}
                    footer={null}
                    zIndex={99999}
                >
                    <MaintenanceRecord
                        intl={intl}
                        id={currentImageInstance.id}
                        wrappedComponentRef={node => this.$MaintenanceRecord = node} />
                </Modal>
            </DetailDrawer >
        )
    }
}

export default Detail
