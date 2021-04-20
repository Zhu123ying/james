/* eslint jsx-a11y/label-has-for: 0 */
/*
 * @Author: huang min
 * @Date: 2017-07-19 15:32:57
 * @Last Modified by: hao wang
 * @Last Modified time: 2019-06-27 10:20:09
 */
import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import { Switch, Static, Tags, EditableTextField, EditableTextarea } from 'ultraui'
import Copy from 'components/Copy/index'

import { EDITABLE, getStatusDot, BarePowerStatus, BareStatus } from './utils'
import regex from 'utils/regex'

const _ = window._

class DetailItem extends React.Component {
    static propTypes = {
        prefixCls: PropTypes.string,
        name: PropTypes.string,
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array,
            PropTypes.object,
            PropTypes.bool,
            PropTypes.number
        ]),
        extraOptions: PropTypes.object,
        intl: PropTypes.object.isRequired
    }

    static defaultProps = {
        prefixCls: 'ult',
        name: '',
        value: '',
        extraOptions: {}
    }

    state = {
        arrayLoadMore: false
    }

    renderStatic(value) {
        return <span title={value}>{value}</span>
    }

    renderEditable(value, name, editable, onUpdate) {
        const { prefixCls, intl } = this.props
        let _regex = regex.isName
        let _invalidMessage = ''
        if (typeof (this.props.extraOptions.regex) !== 'undefined') {
            _regex = this.props.extraOptions.regex

            _invalidMessage = ''

            if (typeof (this.props.extraOptions.invalid) !== 'undefined') {
                _invalidMessage = this.props.extraOptions.invalid
            } else {
                if (typeof (this.props.extraOptions.env) !== 'undefined') {
                    // if (this.props.extraOptions.env === ENV_ID.ALIYUN) {
                    //     _invalidMessage = window.LanguageData[window.LangCode]['AliyunVMNamePlaceHolder']
                    // }
                }
            }
        }

        return <div>111</div>
        // switch (editable) {
        //     case EDITABLE.NAME:
        //         return (<EditableTextField
        //             name={name}
        //             value={value}
        //             onUpdate={onUpdate}
        //             prefixCls={prefixCls}
        //             validRegex={_regex}
        //             defaultText={'-'}
        //             invalidMessage={_invalidMessage}
        //             isRequired
        //                 />)
        //     case EDITABLE.DESC:
        //         return (<EditableTextarea
        //             name={name}
        //             value={value}
        //             onUpdate={onUpdate}
        //             prefixCls={prefixCls}
        //             minLength={0}
        //             defaultText={'-'}
        //             maxLength={200}
        //             addon={''}
        //                 />)
        //     case 'DESC_PRO':
        //         return (<EditableTextarea
        //             name={name}
        //             value={value}
        //             onUpdate={onUpdate}
        //             prefixCls={prefixCls}
        //             minLength={0}
        //             defaultText={'-'}
        //             // invalidMessage={_invalidMessage}
        //             addon={intl.formatMessage({ id: 'DescriptionError' })}
        //             maxLength={200}
        //                 />
        //         )
        //     case 'DESC_64':
        //         return (<EditableTextarea
        //             name={name}
        //             value={value}
        //             onUpdate={onUpdate}
        //             prefixCls={prefixCls}
        //             minLength={0}
        //             defaultText={'-'}
        //             addon={intl.formatMessage({ id: 'DescriptionErrorSixty' })}
        //             maxLength={64}
        //                 />
        //         )
        //     case 'DESC_100':
        //         return (<EditableTextarea
        //             name={name}
        //             value={value}
        //             onUpdate={onUpdate}
        //             prefixCls={prefixCls}
        //             minLength={0}
        //             defaultText={'-'}
        //             addon={intl.formatMessage({ id: 'DescriptionError100' })}
        //             maxLength={100}
        //                 />
        //         )
        // }
    }
    renderDeleteable(component) {
        return component
    }
    renderDot(value, dot) {
        const { intl } = this.props
        let staticType = null
        let intlKey, type
        switch (dot) {
            case 'STATUS':
                staticType = getStatusDot(value)
                break
            // 裸机相关状态, value:状态值，intlKey可国际化的Id，type颜色值
            case 'BARE_STATUS':
            case 'LOCKED_STATUS':
                ({ intlKey, type } = BareStatus(value))
                value = intl.formatMessage({ id: intlKey })
                staticType = type
                break
            case 'POWER_STATUS':
                ({ intlKey, type } = BarePowerStatus(value))
                value = intl.formatMessage({ id: intlKey })
                staticType = type
                break
            default:
                break
        }

        return <Static value={value} staticType={staticType} />
    }

    renderAsyncSwitch(value, asyncSwitch, onUpdate) {
        const { intl, prefixCls } = this.props
        return (
            <Switch
                name={asyncSwitch}
                checked={value}
                onChange={(item) => { onUpdate(item) }}
                prefixCls={prefixCls}
                size='small'
                options={[intl.formatMessage({ id: 'Enabled' }), intl.formatMessage({ id: 'Disable' })]}
            />
        )
    }

    /**
     * value为列表时，作为Tag渲染
     * @param {Array} value
     */
    renderList(value) {
        return (
            <Tags>
                {
                    value.map(({ id, name }, idx) => {
                        if (this.state.arrayLoadMore || idx < 3) {
                            return (
                                <span className={"ult-tag-item ult-tag-item-small"}>
                                    <span className="tag-item-title" title={name}>{name}</span>
                                </span>
                            )
                        } else {
                            return null
                        }
                    })
                }
                {
                    value.length > 3
                    ? <div className='tags-div'>
                        <p onClick={() => this.loadMore()}>
                            <span className={this.state.arrayLoadMore ? 'arrow up' : 'arrow down'} />
                        </p>
                      </div>
                    : null
                }
            </Tags>
        )
    }

    loadMore() {
        this.setState({arrayLoadMore: !this.state.arrayLoadMore})
    }

    /**
     * value为对象，直接返回
     * @param {Object} value
     */
    renderObj(value) {
        return value
    }

    renderCopy(value) {
        return (
            <Copy text={`${value}`} copyText={`${value}`} style={{ display: 'inline-block' }} />
        )
    }
    /**
     * value为字面值时，检查extraOptions
     */
    renderComplex(value, name) {
        const { extraOptions } = this.props
        if (!_.isEmpty(extraOptions)) {
            const { editable, dot, asyncSwitch, onUpdate, component, copy, isDelete } = extraOptions

            // 可编辑
            if (editable && _.isFunction(onUpdate)) {
                return this.renderEditable(value, name, editable, onUpdate)
            }

            // 带圆点的
            if (dot) {
                return this.renderDot(value, dot)
            }
            if (isDelete) {
                return this.renderDeleteable(component)
            }

            // 开关
            if (asyncSwitch && _.isFunction(onUpdate)) {
                return this.renderAsyncSwitch(value, asyncSwitch, onUpdate)
            }

            // 复制
            if (copy) {
                return this.renderCopy(value)
            }
        }

        // 字面值
        return this.renderStatic(value)
    }

    renderValue(value, name) {
        if (value instanceof Array) {
            return this.renderList(value)
        } else if (value instanceof Object) {
            return this.renderObj(value)
        }

        return this.renderComplex(value, name)
    }

    render() {
        const { name, value, prefixCls } = this.props

        return (
            <tr>
                <td className={`${prefixCls}-detail-label`} title={name}>{name}</td>
                <td className={`${prefixCls}-detail-content`}>
                    {this.renderValue(value, name)}
                </td>
            </tr>
        )
    }
}

export default injectIntl(DetailItem)
