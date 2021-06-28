/* eslint-disable */
import React from 'react'
import { container as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, Modal, Button as HuayunButton } from 'huayunui';
import { Icon, Notification, Loading, Button } from 'ultraui'
import './index.less'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'
import { DEFAULT_EMPTY_LABEL } from '~/constants'
import TableCommon from '~/components/TableCommon'
import { renderStateWithDot } from '~/pages/utils'
import AlarmConfig from './alarmConfig'

const notification = Notification.newInstance()
const resolveStateObj = {
    PROBLEM: '待解决',
    OK: '已解决'
}
class Alarm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isFetching: false,
            pageNumber: 1,
            pageSize: 20,
            total: 0,
            alarmRecordList: [], // 告警记录
            seriousRecord: 0, // 严重漏洞
            ordinaryRecord: 0, // 普通漏洞
            isAlarmConfigModalVisible: false,
            userList: [], // 告警联系人列表
            templateList: [], // 告警模板列表
        }
    }
    componentDidMount() {
        this.handleGetAlarmRecord()
        this.listAlertUsers()
        this.listAlertTemplates()
    }
    componentWillReceiveProps(nextProps) {
        const { detail: { id } } = this.props
        const { detail: { id: nextId } } = nextProps
        if (id !== nextId) {
            this.handleGetAlarmRecord(nextId)
        }
    }
    // 告警联系人
    listAlertUsers = () => {
        HuayunRequest(api.listAlertUsers, {}, {
            success: (res) => {
                this.setState({
                    userList: res.data.users
                })
            },
        })
    }
    // 告警模板
    listAlertTemplates = () => {
        HuayunRequest(api.listAlertTemplates, {}, {
            success: (res) => {
                this.setState({
                    templateList: res.data.templates
                })
            },
        })
    }
    // 告警记录
    handleGetAlarmRecord = (platformContainerID = this.props.detail.id) => {
        const { pageNumber, pageSize } = this.state
        const params = {
            pageNumber,
            pageSize,
            platformContainerID
        }
        this.setState({
            isFetching: true
        })
        HuayunRequest(api.listAlertAlarms, params, {
            success: (res) => {
                this.setState({
                    alarmRecordList: res.data.alarms || [],
                    total: res.totalCount
                })
            },
            complete: () => {
                this.setState({
                    isFetching: false
                })
            }
        })
    }
    getAlarmRecordColums = () => {
        const { intl } = this.props
        return [
            {
                dataIndex: 'name',
                key: 'name',
                title: '告警等级',
                render(priority) {
                    const text = priority === 1 ? '严重' : '一般'
                    const color = priority === 1 ? 'bg-danger' : 'bg-warning'
                    return renderStateWithDot(color, text)
                }
            },
            {
                dataIndex: 'metric',
                key: 'metric',
                title: '指标名称',
            },
            {
                dataIndex: 'status',
                key: 'status',
                title: '解决状态',
                render(status) {
                    const color = status === 'PROBLEM' ? 'bg-danger' : 'bg-success'
                    return renderStateWithDot(color, resolveStateObj[status])
                }
            },
            {
                dataIndex: 'datacenter',
                key: 'datacenter',
                title: '来源',
            },
            {
                dataIndex: 'timestamp',
                key: 'timestamp',
                title: '告警时间',
            },
            {
                dataIndex: 'action',
                key: 'operate',
                width: '13%',
                minCalcuWidth: 76,
                title: intl.formatMessage({ id: 'Operate' }),
                render: (value, data) => {
                    return (
                        <ActionAuth action={actions.AdminApplicationCenterApplicationOperate}>
                            <HuayunButton
                                type="link"
                                name={intl.formatMessage({ id: 'Detail' })}
                                onClick={() => this.seeRecordDetail(data.id)}
                            />
                        </ActionAuth>
                    )
                }
            }
        ]
    }
    handleTableChange = ({ pageNumber, pageSize }) => {
        this.setState({
            pageNumber, pageSize
        }, () => {
            this.handleGetAlarmRecord()
        })
    }
    handleChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        })
    }
    handleAlarmConfigModalConfirm = () => {
        const { intl, detail: { id }, getDetail } = this.props
        this.$AlarmConfig.props.form.validateFields((error, values) => {
            if (!error) {
                const { alertEnabled, template, users } = this.$AlarmConfig.state
                const params = {
                    platformContainerId: id,
                    alertEnabled,
                    template,
                    users
                }
                HuayunRequest(api.updateAlert, params, {
                    success: (res) => {
                        this.setState({
                            isAlarmConfigModalVisible: false
                        })
                        getDetail() // 因为告警的信息是从detail接口取的，所以到刷新详情接口
                        notification.notice({
                            id: 'updateSuccess',
                            type: 'success',
                            title: intl.formatMessage({ id: 'Success' }),
                            content: `更新告警配置${intl.formatMessage({ id: 'Success' })}`,
                            iconNode: 'icon-success-o',
                            duration: 5,
                            closable: true
                        })
                    }
                })
            }
        })
    }
    seeRecordDetail = (id) => {
        this.props.history.push(`/applicationCenter/containerManage/alarmRecordDetail/${id}`)
    }
    render() {
        const { intl, detail } = this.props
        const { alarmRecordList, pageNumber, pageSize, total, isFetching, isAlarmConfigModalVisible, userList, templateList, seriousRecord, ordinaryRecord } = this.state
        const enabled = _.get(detail, 'alert.enabled', 0) // 是否启用
        const templateId = _.get(detail, 'alert.template', '') // 模板id
        const userIds = _.get(detail, 'alert.users', []) || []
        const currentTemplate = templateList.find(item => item.id === templateId) || {}
        const currentUsers = userList.filter(item => userIds.indexOf(item.id) > -1) || []

        return (
            <div className='applicationDetail_alarm'>
                {
                    isFetching ? <Loading /> : (
                        <>
                            <div className='alarmConfig'>
                                <div className='header'>
                                    <div className='title activeBefore'>{intl.formatMessage({ id: 'Alarm' })}</div>
                                    <Button
                                        type='text'
                                        onClick={() => this.handleChange('isAlarmConfigModalVisible', true)}
                                        className='alarmConfig'>
                                        <Icon type='setting2'></Icon>&nbsp;
                                        {intl.formatMessage({ id: 'AlarmConfig' })}
                                    </Button>
                                </div>
                                <div className='detailSummary'>
                                    <div className='summaryItem alarmState'>
                                        <div className='detail-icon-wrapper'><Icon type='alarmsetting' /></div>
                                        <div className='state'>
                                            <div className={`value ${enabled ? 'text-success' : 'text-danger'}`}>{enabled ? '启用' : '未启用'}</div>
                                            <div className='title'>{intl.formatMessage({ id: 'Alarm' })}{intl.formatMessage({ id: 'Status' })}</div>
                                        </div>
                                    </div>
                                    <div className='summaryItem'>
                                        <div className='value'>
                                            <HuayunButton
                                                type='error'
                                                size='small-s'
                                                name={
                                                    <span>
                                                        <span className='blackColor'>严重</span>&nbsp;{seriousRecord}
                                                    </span>
                                                } />&nbsp;
                                            <HuayunButton
                                                type='error'
                                                size='small-s'
                                                name={
                                                    <span>
                                                        <span className='blackColor'>一般</span>&nbsp;{seriousRecord}
                                                    </span>
                                                } />
                                        </div>
                                        <div className='title'>{intl.formatMessage({ id: 'MonitorState' })}</div>
                                    </div>
                                    <div className='summaryItem'>
                                        <div className='value'>{currentTemplate.name || DEFAULT_EMPTY_LABEL}</div>
                                        <div className='title'>{intl.formatMessage({ id: 'AlarmTemplate' })}</div>
                                    </div>
                                    <div className='summaryItem contactItem'>
                                        <div className='value'>{
                                            currentUsers.map(item => item.name).join('、') || DEFAULT_EMPTY_LABEL
                                        }</div>
                                        <div className='title'>{`${intl.formatMessage({ id: 'Alarm' })}${intl.formatMessage({ id: 'Contactor' })}`}</div>
                                    </div>
                                </div>
                            </div>
                            <div className='alarmRecord'>
                                <div className='title activeBefore'>{intl.formatMessage({ id: 'AlarmRecord' })}</div>
                                <TableCommon
                                    uniqueId='ApplicationCenter_Application_Detail_AlarmRecord'
                                    onRefresh={this.handleGetAlarmRecord}
                                    columns={this.getAlarmRecordColums()}
                                    data={alarmRecordList}
                                    checkable={false}
                                    total={total}
                                    onTableChange={this.handleTableChange}
                                    params={{
                                        pageNumber, pageSize
                                    }}
                                />
                            </div>
                            <Modal
                                title='告警配置'
                                visible={isAlarmConfigModalVisible}
                                onOk={this.handleAlarmConfigModalConfirm}
                                onCancel={() => this.handleChange('isAlarmConfigModalVisible', false)}
                                className='alarmConfigManageModal'
                                destroyOnClose={true}
                            >
                                <AlarmConfig
                                    intl={intl}
                                    enabled={enabled}
                                    templateId={templateId}
                                    userIds={userIds}
                                    templateList={templateList}
                                    userList={userList}
                                    wrappedComponentRef={node => this.$AlarmConfig = node} />
                            </Modal>
                        </>
                    )
                }
            </div>
        )
    }
}

export default Alarm
