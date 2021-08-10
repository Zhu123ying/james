/* eslint-disable */
import React, { useState, useEffect, useCallback, useMemo, memo, useContext } from 'react'
// eslint-disable-next-line import/named
import { SearchBar, Table, Button, Popover, Checkbox, Row, Col, Tooltip } from 'huayunui'
import Dropdown from '~/components/Dropdown'
import { DEFAULT_EMPTY_LABEL } from '~/constants'
import { Divider } from 'antd'
import { useIntl } from 'react-intl'
import { clearEmpty } from '~/utils/object'
import { parseSearchToObject, parseObjectToSearch } from '~/utils/url'
import * as storage from '~/utils/storage'
import ActionAuth, { authActionShow } from '~/utils/ActionAuth'
import { STORAGE_KEYS } from '~/constants/storageTypes'
import { useHistory } from 'react-router-dom'
import './index.less'

const AuthButton = ActionAuth(Button)
const AuthDropdown = ActionAuth(Dropdown)

const TooltipRow = memo(({
    children,
    rowTips,
    ...restProps
}) => {
    const rowKey = _.get(restProps, 'data-row-key')
    if (rowTips.some(tip => tip.rowKey === rowKey)) {
        const tip = rowTips.find(tip => tip.rowKey === rowKey)
        return (
            <Tooltip placement="topLeft" getPopupContainer={() => document.querySelector('.scroll-content')} title={_.get(tip, 'title')}>
                <tr {...restProps}>
                    {children}
                </tr>
            </Tooltip>
        )
    } else {
        return (
            <tr {...restProps}>
                {children}
            </tr>
        )
    }
})

/**
 * 列表组件
 * 大部分属性都可直接参考antd https://ant-design.gitee.io/components/table-cn/
 * @param {*} param0
 */
const TableCommon = ({
    // 模糊搜索，如不需要可传null
    searchOption = {},
    // 列表接口查询条件
    params = {},
    // 刷新回调
    onRefresh = () => { },
    // 列表参数变化回调
    onTableChange = () => { },
    // 总条目数
    total = 0,
    // 列配置
    columns = [],
    // loading状态
    loading = false,
    // 列表数据源
    data = [],
    // 有checkbox情况下check回调
    onChecked = () => { },
    // 列表checkbox属性控制
    getCheckboxProps = () => { },
    /**
     * 批量操作按钮和表头按钮
        eg: [{
            isBatch: true, // 是否是批量操作按钮（即和checkbox关联）
            icon: 'empty', // 按钮icon
            type: 'default', // 按钮类型
            name: '删除', // 按钮标题（非批量操作按钮时tooltip展示）
            text: '删除', // 按钮标题
            disabled: false, // 按钮是否置灰
            actions: [Action.XXX], // 按钮权限
            onClick: () => { } // 按钮点击回调
            options: [{
                key: '',
                name: '',
                callback: () => {},
                disabled: false,
                action: Action.XXX
            }] // 支持dropdown(仅非批量操作支持isBatch不能为true)
        }]
     */
    operateButtons = [],
    // 按钮批量操作权限列表（会据此判断是否不显示checkbox）
    titleOperationPermissions = [],
    // 列表操作权限列表（会据此判断是否不显示操作列）
    operationPermissions = [],
    // 行点击回调
    onRowClick = () => { },
    // 有详情抽屉时需要传，用来显示选中行高亮
    selectedDrawerKey = '',
    // 列表总宽
    width = null,
    // 不需要显示在表头搜索中的参数，请求仍会带上，只是不显示
    extraParams = [],
    // 默认隐藏的列的key
    defaultHideKey = [],
    /**
     * 需要显示行tooltip时配置
     eg: [{
         rowKey: '', // 需要显示tooltip的行的rowKey(需要与rowKey属性定义一致)
         title: '' // tooltip显示内容
     }]
     */
    rowTips = [],
    // 组件唯一id, 用来处理缓存及推送， 需要确保唯一性，建议使用文件路径层级
    uniqueId = '',
    // searchBar左侧插槽
    slotLeft = '',
    // 是否需要checkbox
    checkable = true,
    // 是否隐藏分页
    noPage = false,
    // searchBar额外参数，如果默认配置不满足需求，可用此参数自行覆盖
    searchProps = {},
    // 如果行选择参数不满足，可用此参数自行覆盖
    rowSelectionProps = {},
    // url中不需要进入查询参数的参数
    extraURIParams = [],
    // 是否把请求参数拼接到url上
    doChangeURI = false,
    // 刷新时是否显示loading
    slient = true,
    // 其他参数支持antd table原生参数
    ...other
}) => {
    const intl = useIntl()
    const history = useHistory()

    // 不显示的查询参数
    const untreatedParamKeys = [
        'pageNumber',
        'pageSize',
        'sortOrder',
        'sortKey',
        'logicalZoneId',
        ...extraParams
    ]
    const handleAppendDefaultRender = (columns) => {
        return columns.map(item => ({
            ...item,
            render: item.render || function (val, data) {
                return val || DEFAULT_EMPTY_LABEL
            }
        }))
    }
    /** 列隐藏设置start **/
    const [finalColumns, setFinalColumns] = useState(() => handleAppendDefaultRender(columns))
    const tableColumnsStorage = _.get(storage.get(STORAGE_KEYS.TABLE_COLUMNS), uniqueId)
    const [tableColumnsStorageState, setTableColumnsStorageState] = useState(tableColumnsStorage)
    const [totalWidth, setTotalWidth] = useState(width)
    const [cacheData, setCacheData] = useState([])

    const handleRefresh = () => {
        if (slient) {
            setCacheData([])
        }
        onRefresh()
    }
    useEffect(() => {
        setCacheData(data)
    }, [data])

    useEffect(() => {
        if (tableColumnsStorageState && _.isArray(tableColumnsStorageState)) {
            // 预留列排序
            setFinalColumns(tableColumnsStorageState.filter(item => !item.hide).map(item => handleAppendDefaultRender(columns).find(col => col.key === item.key)).filter(item => !!item))
            if (totalWidth && _.isNumber(totalWidth)) {
                setTotalWidth(width - _.sum(tableColumnsStorageState.filter(item => item.hide).map(item => _.get(columns.find(col => col.key === item.key), 'width', 0))))
            }
        } else {
            setFinalColumns(handleAppendDefaultRender(columns))
        }
    }, [tableColumnsStorageState, columns])

    // 勾选列隐藏
    const handleColumnChange = useCallback((checkedValues = []) => {
        const tc = columns.map(col => ({
            key: col.key,
            hide: !checkedValues.includes(col.key)
        }))
        storage.set(STORAGE_KEYS.TABLE_COLUMNS, {
            ...storage.get(STORAGE_KEYS.TABLE_COLUMNS),
            [uniqueId]: tc
        })
        setTableColumnsStorageState(tc)
    }, [columns])
    /** 列隐藏设置end **/

    /** 当前页数据删光后，查询上一页数据start **/
    useEffect(() => {
        if (_.isEmpty(data) && !loading && params.pageNumber > 1) {
            onTableChange({
                ...params,
                pageNumber: params.pageNumber - 1
            })
        }
    }, [data, loading])
    /** 当前页数据删光后，查询上一页数据end **/

    /** 查询参数url保留start **/
    // 当发生查询时，append到url上
    const handleUrlChange = (newParams) => {
        // 新增的需要放到url上的参数
        const newShowParams = Object.entries(newParams).filter(([key, val]) => !untreatedParamKeys.includes(key)).reduce((prev, curr) => {
            return {
                ...prev,
                [curr[0]]: curr[1]
            }
        }, {})
        const oldParams = location.search ? parseSearchToObject(location.search) : {}
        const finalParams = clearEmpty({
            ...oldParams,
            ...newShowParams
        })
        history.replace(parseObjectToSearch(finalParams))
    }
    // 当刷新页面时，根据url上的查询参数请求
    useEffect(() => {
        if (doChangeURI) {
            const urlParams = location.search ? parseSearchToObject(location.search) : {}
            const extra = extraURIParams.reduce((p, c) => ({ ...p, [c]: null }), {})
            const queryParams = clearEmpty({ ...params, ...urlParams, ...extra })
            onTableChange(queryParams)
        }
    }, [])
    /** 查询参数url保留end **/

    useEffect(() => {
        const hasNoOperatePermission = !_.isEmpty(operationPermissions) && !authActionShow(operationPermissions)
        const tc = columns.map(col => {
            const hideFlag = tableColumnsStorage ? _.get(tableColumnsStorage.find(item => item.key === col.key), 'hide', false) : defaultHideKey.includes(col.key)
            return {
                key: col.key,
                hide: col.key === 'operate' ? hasNoOperatePermission : hideFlag
            }
        })
        setTableColumnsStorageState(tc)
        storage.set(STORAGE_KEYS.TABLE_COLUMNS, {
            ...storage.get(STORAGE_KEYS.TABLE_COLUMNS),
            [uniqueId]: tc
        })
    }, [])

    const hasCheckBox = () => {
        return checkable && (_.isEmpty(titleOperationPermissions) || authActionShow(titleOperationPermissions))
    }
    // 处理参数与表头筛选的国际化映射
    const getParamsAlias = () => {
        const intl = columns.reduce((prev, curr) => {
            return {
                ...prev,
                [curr.key]: curr.title
            }
        }, {
            [searchOption.key]: searchOption.title
        })
        const filterOptions = columns.filter(item => item.filter).reduce((prev, curr) => {
            return {
                ...prev,
                [curr.key]: _.get(curr, 'filter.options', [])
            }
        }, {})

        const target = _.cloneDeep(params)
        return Object.keys(target).reduce((prev, item) => {
            const options = _.get(filterOptions, item, [])
            const col = columns.find(c => c.key === item)
            if (_.get(col, 'filter.type') === 'Cascader') {
                const firstItem = options.find(v => v.value === params[item][0])
                const secondItem = _.get(firstItem, 'children', []).find(v => v.value === params[item][1])
                return {
                    ...prev,
                    [item]: {
                        title: intl[item] || '',
                        value: `${_.get(firstItem, 'label', '')}${secondItem ? '/' : ''}${_.get(secondItem, 'label', '')}`
                    }
                }
            }
            if (_.get(col, 'filter.type') === 'Checkbox') {
                return {
                    ...prev,
                    [item]: {
                        title: intl[item] || '',
                        value: params[item].map(ch => _.get(options.find(o => o.value === ch), 'title', '')).join('/')
                    }
                }
            }
            return {
                ...prev,
                [item]: {
                    title: intl[item] || '',
                    value: _.get(options.find(v => params[item] === v.value), 'title', '')
                }
            }
        }, {})
    }
    const handleChange = useCallback((type, newParams) => {
        const queryParams = clearEmpty({ ...params, ...newParams })
        if (!noPage && type !== 'pagination') {
            // 查询列表时页码重置为1
            queryParams.pageNumber = 1
            if (doChangeURI) {
                handleUrlChange(newParams)
            }
        }
        if (slient) {
            setCacheData([])
        }
        onTableChange(queryParams)
    }, [params])
    const batchRowOperateButtons = useMemo(() => operateButtons.filter(item => item.isBatch).map(({ isBatch, ...item }) => item), [operateButtons])
    const otherOperateButtons = useMemo(() => operateButtons.filter(item => !item.isBatch), [operateButtons])
    // 列隐藏设置
    const getColumnSetting = () => {
        const cols = tableColumnsStorageState || columns
        const options = columns.map(item => ({
            label: item.title,
            value: item.key
        }))

        const defValue = cols.filter(item => !item.hide).map(item => item.key)

        return (
            <div style={{ width: '150px' }}>
                <Checkbox.Group defaultValue={defValue} onChange={handleColumnChange}>
                    <Row gutter={[0, 8]}>
                        {options.map((item, i) => (
                            <Col key={i} span={24}>
                                <Checkbox
                                    disabled={
                                        defValue.length < 5 && defValue.includes(item.value)
                                    }
                                    value={item.value}
                                >
                                    {item.label}
                                </Checkbox>
                            </Col>
                        ))}
                    </Row>
                </Checkbox.Group>
            </div>
        )
    }
    return (
        <div className="table-common-wrapper">
            <SearchBar
                slot={() => (
                    <div className="other-operate-btns">
                        {
                            otherOperateButtons.map((button, index) => {
                                return button
                                // return (
                                //     <Tooltip title={button.name} key={index}>
                                //         {
                                //             button.options ? (
                                //                 <AuthDropdown
                                //                     options={button.options}
                                //                     disabled={button.disabled}
                                //                     className="other-operate-dropdown"
                                //                     btnProps={{
                                //                         type: "operate",
                                //                         size: "middle-s",
                                //                         ...button,
                                //                         options: undefined,
                                //                         icon: `icon-${button.icon}`,
                                //                         onClick: undefined,
                                //                         className: undefined,
                                //                         name: button.text
                                //                     }}
                                //                 />
                                //             ) : (
                                //                 <AuthButton
                                //                     type="operate"
                                //                     size="middle-s"
                                //                     {...button}
                                //                     icon={`icon-${button.icon}`}
                                //                     onClick={e => button.onClick(finalColumns)}
                                //                     name={button.text}
                                //                 />
                                //             )
                                //         }
                                //     </Tooltip>
                                // )
                            })
                        }
                        <Popover
                            placement="bottomRight"
                            content={getColumnSetting()}
                            overlayClassName="columns-setting-pop"
                            trigger="click"
                            type="detail"
                        >
                            <Tooltip placement="topRight" title={intl.formatMessage({ id: 'DiyColumnSetting' })}>
                                <Button size="middle-s" type="operate" icon="icon-setting" />
                            </Tooltip>
                        </Popover>
                    </div>
                )}
                slotLeft={() => (slotLeft)}
                searchOption={searchOption}
                params={params}
                paramsAlias={getParamsAlias()}
                untreatedParamKeys={untreatedParamKeys}
                onRefresh={handleRefresh}
                onChange={handleChange}
                {...searchProps}
            />
            <Table
                key={finalColumns.length}
                pagination={noPage === true ? false : {
                    pageNumber: params.pageNumber,
                    pageSize: params.pageSize,
                    totalCount: total
                }}
                rowKey={row => row.id}
                columns={selectedDrawerKey ? finalColumns.map(item => ({
                    ...item,
                    filter: null
                })) : finalColumns}
                loading={slient && !_.isEmpty(cacheData) ? false : loading}
                dataSource={cacheData}
                components={{
                    body: {
                        row: (rowProps) => {
                            return <TooltipRow {...rowProps} rowTips={rowTips} />
                        }
                    }
                }}
                rowSelection={hasCheckBox() ? {
                    onChange: onChecked,
                    getCheckboxProps: (record) => {
                        const customProps = getCheckboxProps(record) || {}
                        return {
                            ...customProps,
                            disabled: customProps.disabled || !!selectedDrawerKey
                        }
                    },
                    ...rowSelectionProps
                } : null}
                rowClassName={(record) => {
                    if (record.id === selectedDrawerKey) {
                        return 'row-detail-selected'
                    }
                }}
                renderBatchActions={() => {
                    return (
                        <div className="batch-operate-btns">
                            {
                                batchRowOperateButtons.map((item, index) => {
                                    return item
                                    // return (
                                    //     <>
                                    //         <AuthButton
                                    //             key={index}
                                    //             type="text"
                                    //             size="small-s"
                                    //             {...item}
                                    //             icon={`icon-${item.icon}`}
                                    //             disabled={item.disabled || selectedDrawerKey}
                                    //         />
                                    //         {index !== batchRowOperateButtons.length - 1 ? <Divider type="vertical" /> : null}
                                    //     </>
                                    // )
                                })
                            }
                        </div>
                    )
                }}
                batchActionDependent={[selectedDrawerKey]}
                onRow={(record, index) => {
                    return {
                        onClick: () => onRowClick(record)
                    }
                }}
                onChange={handleChange}
                scroll={totalWidth ? { x: totalWidth } : null}
                sticky={{
                    offsetHeader: 0,
                    offsetScroll: 0,
                    getContainer: () => document.querySelector('.scroll-content')
                }}
                {...other}
            />
        </div>
    )
}

export default memo(TableCommon)
