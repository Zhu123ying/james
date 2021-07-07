/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { image as api, application } from '~/http/api'
import HuayunRequest, { HuayunUploadRequest } from '~/http/request'
import { DatePicker, Select, Input, message, Button, Modal } from 'huayunui';
import './index.less'
import { Notification, Loading, Icon } from 'ultraui'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'
import TableCommon from '~/components/TableCommon';
import Create from './create'

const notification = Notification.newInstance()
class ImageRepositoryCredentialManage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            dataList: [], // 列表数据
            pageNumber: 1,
            pageSize: 10,
            total: 0,
            isFetching: false,
            projectList: [], // 项目列表
            currentTableItem: {}, // 当前选中的行，用于编辑
            isModalVisible: false, // 创建和编辑的modal的显示控制
        }
    }
    componentDidMount() {
        this.addCreateApplicationButton()
        this.getProjectList()
        this.handleSearch()
    }
    componentWillUnmount() {
        this.props.handleExtra({
            extraChildren: null
        })
    }
    // 获取项目列表
    getProjectList = () => {
        let params = {
            pageNumber: 1,
            pageSize: 10000
        }
        HuayunRequest(application.listProject, params, {
            success: (res) => {
                this.setState({
                    projectList: res.data
                })
            }
        })
    }
    addCreateApplicationButton = () => {
        const { handleExtra, intl } = this.props
        handleExtra({
            extraChildren: (
                <ActionAuth action={[actions.AdminApplicationCenterCredentialSystemOperate, actions.AdminApplicationCenterCredentialPorjectOperate]}>
                    <Button
                        type="primary"
                        size="large"
                        icon="icon-add"
                        onClick={this.handleCreate}
                        name={`${intl.formatMessage({ id: 'Create' })}${intl.formatMessage({ id: 'CredentialManage' })}`}
                    />
                </ActionAuth>
            ),
            border: false
        })
    }
    handleCreate = () => {
        this.setState({
            currentTableItem: {},
            isModalVisible: true,
        })
    }
    handleEdit = (row) => {
        this.setState({
            currentTableItem: row,
            isModalVisible: true,
        })
    }
    handleDelete = ({ id, repoName }) => {
        const { intl } = this.props
        const content = `${intl.formatMessage({ id: 'Delete' })}${intl.formatMessage({ id: 'ImageVoucher' })}`
        Modal.error({
            content: `${intl.formatMessage({ id: 'IsSureToDelete' }, { name: intl.formatMessage({ id: 'ImageVoucher' }) })}`,
            onOk: () => {
                HuayunRequest(api.deleteRepositoryCredential, { ids: [id] }, {
                    success: () => {
                        notification.notice({
                            id: new Date(),
                            type: 'success',
                            title: intl.formatMessage({ id: 'Success' }),
                            content: `${content}${intl.formatMessage({ id: 'Success' })}`,
                            iconNode: 'icon-success-o',
                            duration: 5,
                            closable: true
                        })
                        this.handleSearch()
                    }
                })
            }
        })
    }
    handleSearch = () => {
        const { name: repoName, pageNumber, pageSize } = this.state
        const params = {
            pageNumber,
            pageSize,
            conditions: {
                repoName
            }
        }
        this.setState({
            isFetching: true
        })
        HuayunRequest(api.getRepositoryCredentialList, params, {
            success: (res) => {
                const { data: { datas, total } } = res
                this.setState({
                    dataList: datas,
                    total
                })
            },
            complete: (res) => {
                this.setState({
                    isFetching: false
                })
            }
        })
    }
    getColums = () => {
        const { intl } = this.props
        return [
            {
                dataIndex: 'repoName',
                key: 'repoName',
                title: intl.formatMessage({ id: 'Name' })
            },
            {
                dataIndex: 'credentialType',
                key: 'credentialType',
                title: intl.formatMessage({ id: 'Type' }),
                render(type){
                    return type ? '项目凭证' : '系统凭证'
                }
            },
            {
                dataIndex: 'projectName',
                key: 'projectName',
                title: intl.formatMessage({ id: 'ProjectBelongTo' })
            },
            {
                dataIndex: 'protocol',
                key: 'protocol',
                title: intl.formatMessage({ id: 'ProtocolType' }),
                render(type){
                    return type ? 'Https' : 'Http'
                }
            },
            {
                dataIndex: 'host',
                key: 'host',
                title: 'Host'
            },
            {
                dataIndex: 'port',
                key: 'port',
                title: 'Port'
            },
            {
                dataIndex: 'userName',
                key: 'userName',
                title: intl.formatMessage({ id: 'UserName' })
            },
            {
                dataIndex: 'updateTime',
                key: 'updateTime',
                title: intl.formatMessage({ id: 'LastUpdateTime' })
            },
            {
                dataIndex: 'action',
                key: 'operate',
                columnType: 'action',
                width: '13%',
                minCalcuWidth: 76,
                title: intl.formatMessage({ id: 'Operate' }),
                render: (value, data) => {
                    return (
                        <div className='operation-column-button-group'>
                            <ActionAuth action={[actions.AdminApplicationCenterCredentialSystemOperate, actions.AdminApplicationCenterCredentialPorjectOperate]}>
                                <Button
                                    type="link"
                                    onClick={() => this.handleEdit(data)}
                                    name={intl.formatMessage({ id: 'Edit' })}
                                />
                            </ActionAuth>
                            <ActionAuth action={[actions.AdminApplicationCenterCredentialSystemOperate, actions.AdminApplicationCenterCredentialPorjectOperate]}>
                                <Button
                                    type="link"
                                    onClick={() => this.handleDelete(data)}
                                    name={intl.formatMessage({ id: 'Delete' })}
                                />
                            </ActionAuth>
                        </div>
                    )
                }
            }
        ]
    }
    handleTableChange = ({ pageNumber, pageSize, name }) => {
        this.setState({
            pageNumber, pageSize, name
        }, () => {
            this.handleSearch()
        })
    }
    handleModalConfirm = () => {
        const { intl } = this.props
        const { currentTableItem } = this.state
        this.$ImageVoucher.props.form.validateFields((error, values) => {
            if (error) {
                return
            }
            const { repoName, credentialType, projectId, protocol, host, port, userName, password, certInfo } = this.$ImageVoucher.state
            const params = {
                repoName, credentialType, projectId, protocol, host, port, userName, password, certInfo, id: currentTableItem.id
            }
            const url = api[currentTableItem.id ? 'updateRepositoryCredential' : 'createRepositoryCredential']
            const action = currentTableItem.id ? intl.formatMessage({ id: 'Update' }) : intl.formatMessage({ id: 'Create' })
            HuayunUploadRequest(url, params, {
                success: (res) => {
                    this.setState({
                        isModalVisible: false
                    })
                    this.handleSearch()
                    notification.notice({
                        id: new Date(),
                        type: 'success',
                        title: intl.formatMessage({ id: 'Success' }),
                        content: `${action}镜像仓库凭证${intl.formatMessage({ id: 'Success' })}`,
                        iconNode: 'icon-success-o',
                        duration: 5,
                        closable: true
                    })
                }
            })
        })
    }
    handleChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        })
    }
    render() {
        const { intl } = this.props
        const { name, pageNumber, pageSize, isFetching, dataList, total, isModalVisible, projectList, currentTableItem } = this.state
        const params = {
            pageNumber,
            pageSize,
            name
        }
        return (
            <div className='ImageRepositoryCredentialManage'>
                <TableCommon
                    searchOption={{
                        key: 'name',
                        title: intl.formatMessage({ id: 'Name' })
                    }}
                    paramsAlias={{
                        name: {
                            title: '名称'
                        }
                    }}
                    uniqueId='applicationCenter_ImageRepositoryCredentialManage'
                    params={params}
                    onRefresh={this.handleSearch}
                    onTableChange={this.handleTableChange}
                    total={total}
                    columns={this.getColums()}
                    loading={isFetching}
                    data={dataList}
                    checkable={false}
                // operationPermissions={operationPermissions}
                />
                <Modal
                    title={`${currentTableItem.id ? '编辑' : '创建'}镜像凭证`}
                    visible={isModalVisible}
                    onOk={this.handleModalConfirm}
                    onCancel={() => this.handleChange('isModalVisible', false)}
                    destroyOnClose={true}
                    className='create_update_ImageVoucher'
                >
                    <Create
                        intl={intl}
                        projectList={projectList}
                        currentTableItem={currentTableItem}
                        wrappedComponentRef={node => this.$ImageVoucher = node} />
                </Modal>
            </div>
        )
    }
}

export default ImageRepositoryCredentialManage
