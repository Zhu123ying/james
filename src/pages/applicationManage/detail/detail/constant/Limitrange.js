/* eslint-disable */
import { getDataKey, compositeStateColor } from './index'
import { Tooltip, Dropdown } from 'ultraui'

const _ = window._

export default (intl, data, this_) => {
    return {
        columns: [
            {
                title: intl.formatMessage({ id: 'ComprehensiveState' }),
                dataIndex: 'runInfo',
                key: 'compositeState',
                width: '90px',
                render(runInfo, row) {
                    const state = _.get(row, `data.runInfo.compositeState`, '')
                    return <div className="compositeStateDot" style={{ backgroundColor: compositeStateColor[state] }} />
                }
            },
            {
                title: intl.formatMessage({ id: 'Type' }),
                dataIndex: 'runInfo',
                key: 'kind',
                render(runInfo, row) {
                    return _.get(row, `${getDataKey(row)}kind`, '')
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
                title: intl.formatMessage({ id: 'Default' }),
                dataIndex: 'runInfo',
                key: 'defaultLimit',
                render(val, row) {
                    const list = _.get(row, `${getDataKey(row)}list`, [])
                    return (
                        <div className='limitRangeCell'>
                            {
                                list.map(item => {
                                    return <span>{item.defaultLimit || '-'}</span>
                                })
                            }
                        </div>
                    )
                }
            },
            {
                title: intl.formatMessage({ id: 'Max' }),
                dataIndex: 'runInfo',
                key: 'max',
                render(val, row) {
                    const list = _.get(row, `${getDataKey(row)}list`, [])
                    return (
                        <div className='limitRangeCell'>
                            {
                                list.map(item => {
                                    return <span>{item.max || '-'}</span>
                                })
                            }
                        </div>
                    )
                }
            },
            {
                title: intl.formatMessage({ id: 'Min' }),
                dataIndex: 'runInfo',
                key: 'min',
                render(val, row) {
                    const list = _.get(row, `${getDataKey(row)}list`, [])
                    return (
                        <div className='limitRangeCell'>
                            {
                                list.map(item => {
                                    return <span>{item.min || '-'}</span>
                                })
                            }
                        </div>
                    )
                }
            },
            {
                title: intl.formatMessage({ id: 'DefaultRequest' }),
                dataIndex: 'runInfo',
                key: 'defaultRequest',
                render(val, row) {
                    const list = _.get(row, `${getDataKey(row)}list`, [])
                    return (
                        <div className='limitRangeCell'>
                            {
                                list.map(item => {
                                    return <span>{item.defaultRequest || '-'}</span>
                                })
                            }
                        </div>
                    )
                }
            },
            {
                title: intl.formatMessage({ id: 'MaxLimitRequestRatio' }),
                dataIndex: 'runInfo',
                key: 'maxLimit',
                render(val, row) {
                    return '-'
                }
            },
            {
                title: intl.formatMessage({ id: 'Operate' }),
                key: 'Operate',
                width: '64px',
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
        rowKey: (row, index) => {
            return index
        },
        data
    }
}