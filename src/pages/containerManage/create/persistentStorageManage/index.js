/* eslint-disable */
import React from 'react'
import { Button, TagItem, Icon, KeyValue } from 'ultraui'
import { Button as HuayunButton, Modal, Popover } from 'huayunui'
import Regex from '~/utils/regex'
import '../index.less'
import ManagePersistentStorage from './operatePersistentStorage'
const _ = window._
class PersistentStorageManage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isManageModalVisible: false,
            currentItemIndex: -1 // 当前选中的配置文件的索引
        }
    }
    handleChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        })
    }
    handleConfirmManage = () => {
        let { handleFormChange, formData: { storages }, intl } = this.props
        const { name, labels, type, typeClass, accessMode, capacity } = this.$ManagePersistentStorage.state
        const { currentItemIndex } = this.state
        this.$ManagePersistentStorage.props.form.validateFields((error, values) => {
            // 验证标签和数据
            const LabelPanelErrorMessage = Object.keys(labels).length === 0 ? intl.formatMessage({ id: 'LabelPanelIsRequired' }) : ''
            if (LabelPanelErrorMessage) {
                this.$ManagePersistentStorage.setState({
                    LabelPanelErrorMessage
                })
            }
            if (error || LabelPanelErrorMessage) {
                return
            }
            this.setState({
                isManageModalVisible: false,
                currentItemIndex: -1
            })
            let item = {
                name, labels, type, typeClass, accessMode, capacity
            }
            if (currentItemIndex > -1) {
                // 编辑类提交
                storages[currentItemIndex] = item
                handleFormChange('storages', [...storages])
            } else {
                // 添加类提交
                handleFormChange('storages', [...storages, item])
            }
        })
    }
    handleEdit = (e, index) => {
        e.stopPropagation()
        this.setState({
            currentItemIndex: index,
            isManageModalVisible: true
        })
    }
    handleDelete = (e, index) => {
        e.stopPropagation()
        let { handleFormChange, formData: { storages } } = this.props
        storages.splice(index, 1)
        handleFormChange('storages', [...storages])
    }
    renderDetail = (item) => {
        const { intl } = this.props
        const { name, labels, type, typeClass, accessMode, capacity } = item
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
                label: intl.formatMessage({ id: 'StorageType' }),
                value: type
            },
            {
                label: intl.formatMessage({ id: 'Capacity' }),
                value: capacity
            },
            {
                label: intl.formatMessage({ id: 'AccessMode' }),
                value: accessMode
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
        const { form, intl, formData: { storages }, handleFormChange, storageClassList } = this.props
        const { isManageModalVisible, currentItemIndex } = this.state
        return (
            <div className='rightItem'>
                <div className='header'>
                    <div className='title activeBefore'>持久存储管理</div>
                    <Button type='text' onClick={() => this.handleChange('isManageModalVisible', true)}>
                        <Icon type="add" />&nbsp;{intl.formatMessage({ id: 'Add' })}
                    </Button>
                </div>
                <div className='dataList'>
                    {
                        storages && storages.map((item, index) => {
                            return (
                                <Popover
                                    placement="right"
                                    content={this.renderDetail(item)}
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
                    storages ? (
                        <Modal
                            title={currentItemIndex > -1 ? '编辑持久存储' : '添加持久存储'}
                            visible={isManageModalVisible}
                            onOk={this.handleConfirmManage}
                            onCancel={() => this.handleChange('isManageModalVisible', false)}
                            getContainer={document.getElementById('ManageContainerItem')}
                            destroyOnClose={true}
                        >
                            <ManagePersistentStorage
                                intl={intl}
                                handleFormChange={handleFormChange}
                                currentItem={storages[currentItemIndex]}
                                storageClassList={storageClassList}
                                wrappedComponentRef={node => this.$ManagePersistentStorage = node} />
                        </Modal>
                    ) : null
                }
            </div>
        )
    }
}

export default PersistentStorageManage
