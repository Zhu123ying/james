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
                title: intl.formatMessage({ id: 'Rule' }),
                dataIndex: 'runInfo',
                key: 'rule',
                render(val, row) {
                    const list = _.get(row, `${getDataKey(row)}paths`, [])
                    return (
                        <div className='limitRangeCell'>
                            {
                                list.map(item => {
                                    const { type, address, host, path, backends } = item
                                    return <span>{`${type}  ${address}  ${host}  ${path}  ${backends}`}</span>
                                })
                            }
                        </div>
                    )
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