/* eslint-disable */
import React from 'react'
import { application as api } from '~/http/api'
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
import moment from 'moment'

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
            alarmDetail: {},
            pageNumber: 1,
            pageSize: 20,
            total: 0,
            alarmRecordList: [], // 告警记录
            isAlarmConfigModalVisible: false
        }
    }
    componentDidMount() {
        this.getData()
    }
    componentWillReceiveProps(nextProps) {
        const { currentApplication: { id } } = this.props
        const { currentApplication: { id: nextId } } = nextProps
        if (id !== nextId) {
            this.getData(nextId)
        }
    }
    getData(id = this.props.currentApplication.id) {
        // 因为接口返回有点慢，所以要做loading效果，所以用了promise.all，其实也可以多定义几个loading，然后或一下，但是为了高大上。。。
        const p1 = new Promise((resolve, reject) => {
            this.queryApplicationAlarmConfig(id, resolve, reject)
        })
        const p2 = new Promise((resolve, reject) => {
            this.handleGetAlarmRecord(id, resolve, reject)
        })
        this.setState({
            isFetching: true
        })
        let promiseAll = Promise.all([p1, p2]).then(res => {
            this.setState({
                isFetching: false
            })
        }).catch(res => {
            this.setState({
                isFetching: false
            })
        })
    }
    // 基础信息
    queryApplicationAlarmConfig = (id = this.props.currentApplication.id, resolve, reject) => {
        HuayunRequest(api.queryApplicationAlarmConfig, { id }, {
            success: (res) => {
                this.setState({
                    alarmDetail: res.data
                })
                resolve()
            },
            fail: () => {
                reject()
            }
        })
    }
    // 告警记录
    handleGetAlarmRecord = (applicationId = this.props.currentApplication.id, resolve, reject) => {
        const { pageNumber, pageSize } = this.state
        const params = {
            pageNumber,
            pageSize,
            conditions: {
                applicationId
            }
        }
        HuayunRequest(api.queryApplicationAlarm, params, {
            success: (res) => {
                this.setState({
                    alarmRecordList: res.data.data || [],
                    total: res.totalCount
                })
                resolve()
            },
            fail: () => {
                reject()
            }
        })
    }
    getAlarmRecordColums = () => {
        const { intl } = this.props
        return [
            {
                dataIndex: 'priority',
                key: 'priority',
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
                render(val) {
                    return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : DEFAULT_EMPTY_LABEL
                }
            },
            {
                dataIndex: 'action',
                key: 'operate',
                width: '13%',
                minCalcuWidth: 76,
                title: intl.formatMessage({ id: 'Operate' }),
                render: (value, data) => {
                    return (
                        <ActionAuth action={actions.AdminApplicationCenterApplicationMaintain}>
                            <HuayunButton
                                type="link"
                                name={intl.formatMessage({ id: 'Detail' })}
                                onClick={() => this.handleSeeAlarmDetail([data.id])}
                            />
                        </ActionAuth>
                    )
                }
            }
        ]
    }
    handleSeeAlarmDetail = (id) => {
        this.props.history.push(`/applicationCenter/applicationManage/alarmRecordDetail/${id}`)
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
        const { intl, currentApplication: { id: applicationId } } = this.props
        this.$AlarmConfig.props.form.validateFields((error, values) => {
            if (!error) {
                const { isStart, alarmTemplates, notifyUsers } = this.$AlarmConfig.state
                const params = {
                    applicationId,
                    isStart,
                    alarmTemplates: alarmTemplates.map(id => {
                        return { id }
                    }),
                    notifyUsers: notifyUsers.map(id => {
                        return { id }
                    }),
                }
                HuayunRequest(api.confirmApplicationAlarmConfig, params, {
                    success: (res) => {
                        this.setState({
                            isAlarmConfigModalVisible: false
                        })
                        this.getData()
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
    render() {
        const { intl } = this.props
        const { alarmDetail, alarmRecordList, pageNumber, pageSize, total, isFetching, isAlarmConfigModalVisible } = this.state
        const isStart = _.get(alarmDetail, 'applicationAlarmConfig.isStart', 0) // 是否启用
        const templateName = _.get(alarmDetail, 'applicationAlarmConfig.alarmTemplates.0.name', '') // 模板名称
        const allContacts = _.get(alarmDetail, 'applicationAlarmConfig.notifyUsers', []).map(item => item.name)
        const priority_1 = _.get(alarmDetail, 'priority_1', 0) // 严重
        const priority_5 = _.get(alarmDetail, 'priority_5', 0) // 一般
        return (
            <div className='applicationDetail_alarm'>
                {
                    isFetching ? <Loading /> : (
                        <>
                            <div className='alarmConfig'>
                                <div className='header'>
                                    <div className='title activeBefore'>{intl.formatMessage({ id: 'Alarm' })}</div>
                                    <ActionAuth action={actions.AdminApplicationCenterApplicationMaintain}>
                                        <Button
                                            type='text'
                                            onClick={() => this.handleChange('isAlarmConfigModalVisible', true)}
                                            className='alarmConfig'>
                                            <Icon type='setting2'></Icon>&nbsp;
                                            {intl.formatMessage({ id: 'AlarmConfig' })}
                                        </Button>
                                    </ActionAuth>
                                </div>
                                <div className='detailSummary'>
                                    <div className='summaryItem alarmState'>
                                        <div className='detail-icon-wrapper'><Icon type='alarmsetting' /></div>
                                        <div className='state'>
                                            <div className={`value ${isStart ? 'text-success' : 'text-danger'}`}>{isStart ? '启用' : '未启用'}</div>
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
                                                        <span className='blackColor'>严重</span>&nbsp;{priority_1}
                                                    </span>
                                                } />&nbsp;
                                            <HuayunButton
                                                type='error'
                                                size='small-s'
                                                name={
                                                    <span>
                                                        <span className='blackColor'>一般</span>&nbsp;{priority_5}
                                                    </span>
                                                } />
                                        </div>
                                        <div className='title'>{intl.formatMessage({ id: 'MonitorState' })}</div>
                                    </div>
                                    <div className='summaryItem'>
                                        <div className='value'>{templateName || DEFAULT_EMPTY_LABEL}</div>
                                        <div className='title'>{intl.formatMessage({ id: 'AlarmTemplate' })}</div>
                                    </div>
                                    <div className='summaryItem contactItem'>
                                        <div className='value'>{allContacts.join('、') || DEFAULT_EMPTY_LABEL}</div>
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
                                    alarmDetail={alarmDetail}
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
