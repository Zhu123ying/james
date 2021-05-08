/* eslint-disable */
import { getDataKey, compositeStateColor } from './index'
import { Tooltip, Dropdown } from 'ultraui'

const _ = window._

export default (intl, data, this_) => {
    const { expandedRowKeysObj } = this_.state
    return {
        columns: [
            {
                title: '',
                key: 'expand',
                width: 32,
                render: (val, row) => {
                    return ''
                }
            },
            {
                title: intl.formatMessage({ id: 'ComprehensiveState' }),
                dataIndex: 'runInfo',
                key: 'compositeState',
                render(runInfo, row) {
                    const state = _.get(row, `${getDataKey(row)}compositeState`, '')
                    return <div className="compositeStateDot" style={{ backgroundColor: compositeStateColor[state] }} />
                }
            },
            {
                title: intl.formatMessage({ id: 'Name' }),
                dataIndex: 'runInfo',
                key: 'name',
                render(runInfo, row) {
                    return _.get(row, `${getDataKey(row)}metadata.name`, '')
                }
            },
            {
                title: 'Request',
                dataIndex: 'runInfo',
                key: 'Request',
                render(runInfo, row) {
                    const cpu_hard =  _.get(row, `${getDataKey(row)}status.hard.cpu`, '-')
                    const cpu_used =  _.get(row, `${getDataKey(row)}status.used.cpu`, '-')
                    const memory_hard =  _.get(row, `${getDataKey(row)}status.hard.memory`, '-')
                    const memory_used =  _.get(row, `${getDataKey(row)}status.hard.memory`, '-')
                    return `cpu: ${cpu_used}/${cpu_hard}, memory: ${memory_used}/${memory_hard}`

                }
            },
            {
                title: intl.formatMessage({ id: 'Operate' }),
                key: 'Operate',
                render: (id, row) => {
                    const options = [
                        {
                            name: intl.formatMessage({ id: 'ReadStatementInfor' }),
                            callback: () => {
                                this_.readStatementInfor(row)
                            }
                        }
                    ]
                    return (
                        <Dropdown title="" icon="more" btnSize="small" options={options} btnType="text" placement='bottomRight' />
                    )
                }
            }
        ],
        rowKey: (row) => row.id,
        data
    }
}