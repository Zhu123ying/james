/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, TagItem, Icon, KeyValue } from 'ultraui'
import { Button as HuayunButton, Modal, Popover } from 'huayunui'
import Regex from '~/utils/regex'
import '../index.less'
import ManageConfigFile from './operateConfigFile'
const _ = window._
class ConfigFileManage extends React.Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        intl: PropTypes.object.isRequired
    }
    constructor(props) {
        super(props)
        this.state = {
            isManageConfigFileModalVisible: false,
            currentConfigFileIndex: -1 // 当前选中的配置文件的索引
        }
    }
    handleChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        })
    }
    handleConfirmManage = () => {
        let { handleFormChange, formData: { configurations }, intl } = this.props
        const { name, labels, type, subType, data } = this.$ManageConfigFile.state
        const { currentConfigFileIndex } = this.state
        this.$ManageConfigFile.props.form.validateFields((error, values) => {
            // 验证标签和数据
            const LabelPanelErrorMessage = Object.keys(labels).length === 0 ? intl.formatMessage({ id: 'LabelPanelIsRequired' }) : ''
            const DataPanelErrorMessage = Object.keys(data).length === 0 ? intl.formatMessage({ id: 'DataPanelIsRequired' }) : ''
            if (LabelPanelErrorMessage || DataPanelErrorMessage) {
                this.$ManageConfigFile.setState({
                    LabelPanelErrorMessage, DataPanelErrorMessage
                })
            }
            if (error || LabelPanelErrorMessage || DataPanelErrorMessage) {
                return
            }
            this.setState({
                isManageConfigFileModalVisible: false,
                currentConfigFileIndex: -1
            })
            let item = {
                name, labels, type, subType, data
            }
            if (currentConfigFileIndex > -1) {
                // 编辑类提交
                configurations[currentConfigFileIndex] = item
                handleFormChange('configurations', [...configurations])
            } else {
                // 添加类提交
                handleFormChange('configurations', [...configurations, item])
            }
        })
    }
    handleEdit = (e, index) => {
        e.stopPropagation()
        this.setState({
            currentConfigFileIndex: index,
            isManageConfigFileModalVisible: true
        })
    }
    handleDelete = (e, index) => {
        e.stopPropagation()
        let { handleFormChange, formData: { configurations } } = this.props
        configurations.splice(index, 1)
        handleFormChange('configurations', [...configurations])
    }
    renderConfigDetail = (item) => {
        const { intl } = this.props
        const { name, labels, type, subType, data } = item
        const infor = [
            {
                label: intl.formatMessage({ id: 'Name' }),
                value: name
            },
            {
                label: intl.formatMessage({ id: 'Tag' }),
                value: (
                    <div className='labelList'>
                        {
                            labels && Object.keys(labels).map((key, index) => {
                                return (
                                    <TagItem
                                        size='medium'
                                        key={key}
                                        name={
                                            <div className='labelItem'>
                                                <span className='key'>{key}</span>
                                                <span className='splitLine'>|</span>
                                                <span className='value'>{labels[key]}</span>
                                            </div>
                                        }
                                    />
                                )
                            })
                        }
                    </div>
                )
            },
            {
                label: intl.formatMessage({ id: 'Type' }),
                value: type
            },
            {
                label: intl.formatMessage({ id: 'SubType' }),
                value: subType
            },
            {
                label: intl.formatMessage({ id: 'Data' }),
                value: (
                    <div className='labelList'>
                        {
                            data && Object.keys(data).map((key, index) => {
                                return (
                                    <TagItem
                                        size='medium'
                                        key={key}
                                        name={
                                            <div className='labelItem'>
                                                <span className='key'>{key}</span>
                                                <span className='splitLine'>|</span>
                                                <span className='value'>{data[key]}</span>
                                            </div>
                                        }
                                    />
                                )
                            })
                        }
                    </div>
                )
            },
        ]
        return (
            <div className='configDetail'>
                <div className='title'>配置文件</div>
                <KeyValue values={infor} />
            </div>
        )
    }
    render() {
        const { form, intl, formData: { configurations }, handleFormChange } = this.props
        const { isManageConfigFileModalVisible, currentConfigFileIndex } = this.state
        return (
            <div className='ConfigFileManage rightItem'>
                <div className='header'>
                    <div className='title activeBefore'>配置文件管理</div>
                    <Button type='text' onClick={() => this.handleChange('isManageConfigFileModalVisible', true)}>
                        <Icon type="add" />&nbsp;{intl.formatMessage({ id: 'Add' })}
                    </Button>
                </div>
                <div className='dataList'>
                    {
                        configurations && configurations.map((item, index) => {
                            return (
                                <Popover
                                    placement="right"
                                    content={this.renderConfigDetail(item)}
                                    trigger="click"
                                    type="text"
                                    id='detailPopover'
                                    getPopupContainer={() => document.getElementById('ManageContainerItem')}
                                    key={index}>
                                    <div className='dataItem'>
                                        <span className='title'>{intl.formatMessage({ id: 'Name' })}</span>
                                        <span className='value'>{item.name}</span>
                                        <div className='operaGroup'>
                                            <Icon type='edit-o' onClick={(e) => this.handleEdit(e, index)}></Icon>
                                            <Icon type='empty' onClick={(e) => this.handleDelete(e, index)}></Icon>
                                        </div>
                                    </div>
                                </Popover>
                            )
                        })
                    }
                </div>
                {
                    configurations ? (
                        <Modal
                            title={currentConfigFileIndex > -1 ? '编辑配置文件' : '添加配置文件'}
                            visible={isManageConfigFileModalVisible}
                            onOk={this.handleConfirmManage}
                            onCancel={() => this.handleChange('isManageConfigFileModalVisible', false)}
                            className='ManageContainerModalItem'
                            destroyOnClose={true}
                        >
                            <ManageConfigFile
                                intl={intl}
                                handleFormChange={handleFormChange}
                                currentConfigFile={configurations[currentConfigFileIndex]}
                                wrappedComponentRef={node => this.$ManageConfigFile = node} />
                        </Modal>
                    ) : null
                }
            </div>
        )
    }
}

export default ConfigFileManage
