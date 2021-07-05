/* eslint-disable */
import React from 'react'
import { applicationPackage as api, image } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, SearchBar, Button, Table, Modal, Space, Checkbox, Popover, Tooltip } from 'huayunui';
import { Icon, NoData, Notification } from 'ultraui'
import './index.less'
import { DEFAULT_EMPTY_LABEL } from '~/constants'
import TableCommon from '~/components/TableCommon'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'
import Dropdown from '~/components/Dropdown'
import DetailIcon from '~/components/DetailIcon'
import Detail from './detail'

const notification = Notification.newInstance()

class ApplicationPackageList extends React.Component {
    constructor(props) {
        super(props)
        const { intl } = props
        this.state = {
            name: '',
            pageNumber: 1,
            pageSize: 10,
            total: 0,
            isFetching: false,
            tableData: [],
            currentDataItem: {},
            isDetailModalVisible: false
        }
        this.operationTarget = intl.formatMessage({ id: 'AppPackage' })
    }
    componentDidMount() {
        const { projectInitState, projectId } = this.props
        projectId && this.handleProjectChange(projectInitState, projectId)
    }
    componentWillReceiveProps({ projectInitState, projectId }) {
        projectId && projectId !== this.props.projectId && this.handleProjectChange(projectInitState, projectId)
    }
    // 切换项目
    handleProjectChange = (projectInitState, projectId) => {
        // 如果未初始化，直接tableData设为空数组
        if (projectInitState) {
            this.handleSearch(projectId)
        } else {
            this.setState({
                tableData: [],
                total: 0
            })
        }
    }
    handleSearch = (projectId = this.props.projectId) => {
        const { name, pageNumber, pageSize } = this.state
        const params = {
            pageNumber,
            pageSize,
            conditions: {
                name,
                projectId
            }
        }
        this.setState({
            isFetching: true
        })
        HuayunRequest(api.getApplicationPackageList, params, {
            success: (res) => {
                this.setState({
                    tableData: res.data.datas,
                    total: res.data.total
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
                dataIndex: 'name',
                key: 'name',
                title: intl.formatMessage({ id: 'Name' }),
                render: (val, row) => {
                    return (
                        <>
                            <DetailIcon iconType="done" className="m-r-sm" />
                            <a onClick={() => this.handleSeeDetail(row)}>{val}</a>
                        </>
                    )
                }
            },
            {
                dataIndex: 'projectName',
                key: 'projectName',
                title: intl.formatMessage({ id: 'ProjectBelongTo' })
            },
            {
                dataIndex: 'versionCount',
                key: 'versionCount',
                title: intl.formatMessage({ id: 'VersionCount' })
            },
            {
                dataIndex: 'createByName',
                key: 'createByName',
                title: intl.formatMessage({ id: 'CreaterName' })
            },
            {
                dataIndex: 'tags',
                key: 'tags',
                title: intl.formatMessage({ id: 'Tag' }),
                render: (tags) => {
                    return (tags || []).join('、')
                }
            },
            {
                dataIndex: 'updateTime',
                key: 'updateTime',
                title: intl.formatMessage({ id: 'UpdateTime' })
            },
            {
                dataIndex: 'action',
                key: 'operate',
                width: '13%',
                minCalcuWidth: 76,
                title: intl.formatMessage({ id: 'Operate' }),
                render: (value, data) => {
                    const options = [
                        {
                            name: intl.formatMessage({ id: 'Manage' }),
                            callback: () => {
                                this.handleManageApplicationPackage(data.id)
                            }
                        },
                        {
                            name: intl.formatMessage({ id: 'Delete' }),
                            callback: () => {
                                this.handleDelete([data.id])
                            }
                        }
                    ]
                    return (
                        <ActionAuth action={actions.AdminApplicationCenterApplicationPackageOperate}>
                            <Dropdown options={options} placement='bottomRight' />
                        </ActionAuth>
                    )
                }
            }
        ]
    }
    handleDelete = (ids) => {
        const { intl, projectId } = this.props
        const action = intl.formatMessage({ id: 'Delete' })
        Modal.error({
            content: `${intl.formatMessage({ id: 'IsSureToDelete' }, { name: this.operationTarget })}`,
            onOk: () => {
                HuayunRequest(api.deleteApplicationPackage, { ids }, {
                    success: (res) => {
                        this.handleSearch()
                        notification.notice({
                            id: new Date(),
                            type: 'success',
                            title: intl.formatMessage({ id: 'Success' }),
                            content: `${action}${this.operationTarget}${intl.formatMessage({ id: 'Success' })}`,
                            iconNode: 'icon-success-o',
                            duration: 5,
                            closable: true
                        })
                    }
                })
            }
        })
    }
    handleTableChange = ({ pageNumber, pageSize, name }) => {
        this.setState({
            pageNumber, pageSize, name
        }, () => {
            this.handleSearch()
        })
    }
    handleChange = (key, value) => {
        this.setState({
            [key]: value
        })
    }
    handleInitPorject = () => {
        const { projectId, refreshTableList } = this.props
        HuayunRequest(image.createProjectRepository, { projectId }, {
            success: (res) => {
                refreshTableList()
            },
        })
    }
    handleAddApplicationPackage = () => {
        this.props.history.push(`${this.props.match.path}/create`)
    }
    handleManageApplicationPackage = (id) => {
        this.props.history.push(`${this.props.match.path}/edit/${id}`)
    }
    handleSeeDetail = (item) => {
        this.setState({
          currentDataItem: item,
          isDetailModalVisible: true
        })
      }
    render() {
        const { intl, projectInitState, projectId } = this.props
        const { name, pageNumber, pageSize, total, tableData, isFetching, currentDataItem, isDetailModalVisible } = this.state
        const noDataProps = projectInitState ? {} : {
            emptyText: (
                <NoData
                    className='noDataTable'
                    name={
                        <div div className='noDataTitle' >
                            <div className='des'>该项目暂无应用包数据，请先初始化！</div>
                            <Button
                                type="primary"
                                name="初始化"
                                icon={<Icon type="point" />}
                                onClick={this.handleInitPorject}
                            />
                        </div>
                    }
                />
            )
        }
        return (
            <div className='ApplicationPackageList'>
                <TableCommon
                    searchOption={{
                        key: 'name',
                        title: intl.formatMessage({ id: 'Name' })
                    }}
                    params={{
                        pageNumber, pageSize, name
                    }}
                    paramsAlias={{
                        name: {
                            title: '名称'
                        }
                    }}
                    uniqueId='ApplicationCenter_Image_ApplicationPackageList'
                    onRefresh={this.handleSearch}
                    columns={this.getColums()}
                    data={tableData}
                    checkable={false}
                    total={total}
                    onTableChange={this.handleTableChange}
                    loading={isFetching}
                    operateButtons={[
                        <ActionAuth action={actions.AdminApplicationCenterApplicationPackageOperate}>
                            <Tooltip title='新增应用包'>
                                <Button
                                    disabled={!projectInitState}
                                    className='mr8'
                                    size="middle-s"
                                    type='operate'
                                    name='新增应用包'
                                    icon={<Icon type="add" />}
                                    onClick={() => this.handleAddApplicationPackage()} />
                            </Tooltip>
                        </ActionAuth>
                    ]}
                    {
                    ...noDataProps
                    }
                />
                <Detail
                    {...this.props}
                    currentDataItem={currentDataItem}
                    visible={isDetailModalVisible}
                    onClose={() => this.handleChange('isDetailModalVisible', false)}
                    // handleDelete={() => this.handleDelete([currentDataItem.id], true)}
                ></Detail>
            </div>
        )
    }
}

export default ApplicationPackageList
