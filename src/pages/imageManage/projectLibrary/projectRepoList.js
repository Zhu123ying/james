/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { image as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, SearchBar, Button, Table, Modal, Space, Checkbox, Popover, Tooltip } from 'huayunui';
import { Icon, NoData, Notification } from 'ultraui'
import './index.less'
import { DEFAULT_EMPTY_LABEL } from '~/constants'
import TableCommon from '~/components/TableCommon'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'
import DetailIcon from '~/components/DetailIcon'
import ImageInstanceList from './imageInstanceList'
import AddPullModal from './addPullModal'
import PullRecord from './pullRecord'

const notification = Notification.newInstance()
class ProjectRepoList extends React.Component {
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
            tableType: 0,  // 用于区分是镜像仓库列表还是镜像实例列表，0和1
            currentTableItem: {},  // 仓库列表当前操作的行数据
            isAddPullModalVisible: false,
            isPullRecordModalVisible: false
        }
        this.operationTarget = intl.formatMessage({ id: 'ProjectLibrary' })
    }
    componentDidMount() {
        const { projectInitState, projectId } = this.props
        this.handleProjectChange(projectInitState, projectId)
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
        // 切换了项目还要把tableType重置为0
        this.setState({
            tableType: 0
        })
    }
    handleSearch = (projectId = this.props.projectId) => {
        const { name: imageRepoName, pageNumber, pageSize } = this.state
        const params = {
            pageNumber,
            pageSize,
            conditions: {
                imageRepoName,
                projectId
            }
        }
        this.setState({
            isFetching: true
        })
        HuayunRequest(api.getProjectImageRepoList, params, {
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
                dataIndex: 'repoName',
                key: 'repoName',
                title: intl.formatMessage({ id: 'Name' }),
                render: (value, row) => {
                    return (
                        <>
                            <DetailIcon iconType="warehouse" className="m-r-sm" />
                            <a onClick={() => this.handleChangeTableType(row, 1)}>{value}</a>
                        </>
                    )
                }
            },
            {
                dataIndex: 'imageCount',
                key: 'imageCount',
                title: intl.formatMessage({ id: 'ImageCount' })
            },
            {
                dataIndex: 'pullCount',
                key: 'pullCount',
                title: intl.formatMessage({ id: 'PullCount' })
            },
            {
                dataIndex: 'updateTime',
                key: 'updateTime',
                title: intl.formatMessage({ id: 'LastUpdateTime' })
            },
            {
                dataIndex: 'action',
                key: 'operate',
                width: '13%',
                minCalcuWidth: 76,
                title: intl.formatMessage({ id: 'Operate' }),
                render: (value, data) => {
                    return (
                        <ActionAuth action={actions.AdminApplicationCenterImagePrivateImageOperate}>
                            <Button
                                type="link"
                                name={intl.formatMessage({ id: 'Delete' })}
                                onClick={() => this.handleDelete(data.repoName)}
                            />
                        </ActionAuth>
                    )
                }
            }
        ]
    }
    handleDelete = (imageRepoName) => {
        const { intl, projectId } = this.props
        const action = intl.formatMessage({ id: 'Delete' })
        Modal.error({
            content: `${intl.formatMessage({ id: 'IsSureToDelete' }, { name: `${this.operationTarget}-${imageRepoName}` })}`,
            onOk: () => {
                HuayunRequest(api.deleteProjectImageRepositoryByRepoName, { imageRepoName, projectId }, {
                    success: (res) => {
                        this.handleSearch()
                        notification.notice({
                            id: new Date(),
                            type: 'success',
                            title: intl.formatMessage({ id: 'Success' }),
                            content: `${action}${this.operationTarget}'${imageRepoName}'${intl.formatMessage({ id: 'Success' })}`,
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
    handleChangeTableType = (row, type) => {
        this.setState({
            tableType: type,
            currentTableItem: row
        }, () => {
            if (type == 0) {
                this.handleSearch()
            }
        })
    }
    handleChange = (key, value) => {
        this.setState({
            [key]: value
        })
    }
    handleConfirmManage = () => {
        const { intl } = this.props
        this.$AddPullModal.props.form.validateFields((error, values) => {
            if (error) {
                return
            }
            const { type, sourceProjectId, sourceImageId, repositoryCredentialId, sourceImage, projectId, targetImage, targetRepo } = this.$AddPullModal.state
            let url, params
            switch (type) {
                case 1:
                    params = { projectId, repositoryCredentialId, sourceImage, targetImage, targetRepo }
                    url = 'createImageByPullFromExternalRepo'
                    break
                case 2:
                    params = { projectId, sourceProjectId, sourceImageId, targetImage, targetRepo }
                    url = 'createImageByPullFromProject'
                    break
                case 3:
                    params = { projectId, sourceImageId, targetImage, targetRepo }
                    url = 'createImageByPullFromPublicRepo'
                    break
            }
            HuayunRequest(api[url], params, {
                success: (res) => {
                    this.setState({
                        isAddPullModalVisible: false
                    })
                    this.handleSearch()
                    notification.notice({
                        id: new Date(),
                        type: 'success',
                        title: intl.formatMessage({ id: 'Success' }),
                        content: `拉取镜像${intl.formatMessage({ id: 'Success' })}`,
                        iconNode: 'icon-success-o',
                        duration: 5,
                        closable: true
                    })
                }
            })
        })
    }
    handleInitPorject = () => {
        const { projectId, refreshTableList } = this.props
        HuayunRequest(api.createProjectRepository, { projectId }, {
            success: (res) => {
                refreshTableList()
            },
        })
    }
    render() {
        const { intl, projectInitState, projectId } = this.props
        const { name, pageNumber, pageSize, total, tableData, isFetching, tableType, currentTableItem, isAddPullModalVisible, isPullRecordModalVisible } = this.state
        const noDataProps = projectId && !projectInitState ? {
            emptyText: (
                <ActionAuth action={actions.AdminApplicationCenterImagePrivateRepoOperate}>
                    <NoData
                        className='noDataTable'
                        name={
                            <div div className='noDataTitle' >
                                <div className='des'>该项目暂无镜像数据，请先初始化！</div>
                                <Button
                                    type="primary"
                                    name="初始化"
                                    icon={<Icon type="point" />}
                                    onClick={this.handleInitPorject}
                                />
                            </div>
                        }
                    />
                </ActionAuth>
            )
        } : {}
        return (
            <div className='ProjectRepoList'>
                {
                    tableType === 0 ? (
                        <>
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
                                uniqueId='ApplicationCenter_Image_PlatformPublicLibrary'
                                onRefresh={this.handleSearch}
                                columns={this.getColums()}
                                data={tableData}
                                checkable={false}
                                total={total}
                                onTableChange={this.handleTableChange}
                                loading={isFetching}
                                operateButtons={[
                                    <ActionAuth action={actions.AdminApplicationCenterImagePrivateImageOperate}>
                                        <Tooltip title='新增拉取'>
                                            <Button
                                                disabled={!projectInitState}
                                                className='mr8'
                                                size="middle-s"
                                                type='operate'
                                                name='新增拉取'
                                                icon={<Icon type="add" />}
                                                onClick={() => this.handleChange('isAddPullModalVisible', true)} />
                                        </Tooltip>
                                    </ActionAuth>,
                                    <ActionAuth action={actions.AdminApplicationCenterImagePrivateImageOperate}>
                                        <Tooltip title='拉取记录'>
                                            <Button
                                                disabled={!projectInitState}
                                                className='mr8'
                                                size="middle-s"
                                                type='operate'
                                                name=''
                                                icon={<Icon type="Willdo" />}
                                                onClick={() => this.handleChange('isPullRecordModalVisible', true)} />
                                        </Tooltip>
                                    </ActionAuth>
                                ]}
                                {
                                ...noDataProps
                                }
                            />
                            <Modal
                                title='新增拉取'
                                visible={isAddPullModalVisible}
                                onOk={this.handleConfirmManage}
                                onCancel={() => this.handleChange('isAddPullModalVisible', false)}
                                destroyOnClose={true}
                                className='ImageManage_addPullModal'
                            >
                                <AddPullModal
                                    intl={intl}
                                    projectId={projectId}
                                    wrappedComponentRef={node => this.$AddPullModal = node} />
                            </Modal>
                            <Modal
                                title='拉取记录'
                                visible={isPullRecordModalVisible}
                                onCancel={() => this.handleChange('isPullRecordModalVisible', false)}
                                destroyOnClose={true}
                                className='ImageManage_pullRecordModal'
                                width={800}
                                footer={null}
                            >
                                <PullRecord
                                    intl={intl}
                                    projectId={projectId}
                                    wrappedComponentRef={node => this.$PullRecord = node} />
                            </Modal>
                        </>
                    ) : <ImageInstanceList
                        currentTableItem={currentTableItem}
                        handleChangeTableType={this.handleChangeTableType}
                        intl={intl} />
                }
            </div>
        )
    }
}

export default ProjectRepoList
