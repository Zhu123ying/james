/* eslint-disable */
import { getDataKey, compositeStateColor, compositeStateText } from './index'
import { Tooltip, Dropdown } from 'ultraui'
import { DEFAULT_EMPTY_LABEL } from '~/constants'

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
                    const state = _.get(row, `${getDataKey(row)}compositeState`, '')
                    return (
                        <div className='stateLineWithDot'>
                            <div className='stateDot' style={{ backgroundColor: compositeStateColor[state] }}></div>
                            {compositeStateText[state]}
                        </div>
                    )
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
                        <div className='ingressRule'>
                            {
                                list.map(item => {
                                    const { type, address, host, path, backends } = item
                                    return <span>{`${type || DEFAULT_EMPTY_LABEL} | ${address || DEFAULT_EMPTY_LABEL} | [ ${backends || DEFAULT_EMPTY_LABEL} | ${host || DEFAULT_EMPTY_LABEL} | ${path || DEFAULT_EMPTY_LABEL} ]`}</span>
                                })
                            }
                        </div>
                    )
                }
            },
            {
                title: intl.formatMessage({ id: 'LoadBalance' }),
                dataIndex: 'runInfo',
                key: 'loadBalance',
                render(runInfo, row) {
                    const ips = _.get(row, `${getDataKey(row)}loadBalancerIngress`, []) || []
                    return ips.map(item => item.ip).join('、')
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
        rowKey: (row) => row.id,
        data
    }
}