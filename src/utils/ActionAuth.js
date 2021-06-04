/**
 * 按钮等Action校验
 *
 * @author: GlenZhao
 * @created: 2018/1/29
 */
import React from 'react'
import PropTypes from 'prop-types'
import * as cache from './cache'
/**
 * [description]
 * @param  {node} ComposedComponent 组件
 * @param  {object} props 属性：{role, license, show}
 */
const ActionAuth = (ComposedComponent, props) => {
    class Wrapper extends React.Component {
        static propTypes = {
            show: PropTypes.bool, // 无权限时是否显示
            scope: PropTypes.string, // 权限类型，System or Project
            actions: PropTypes.array, // 要判断权限的操作，即表示具体权限的url，可以1个，也可以多个
            emptyContent: PropTypes.string, // 当没有权限时显示的内容，若不提供，则什么都不显示
            projectId: PropTypes.string, // 如果项目级权限，需要提供项目ID
            options: PropTypes.array // 如果是dropdown，则options为dropdown的原始属性, 每个option增加一个action属性，说明对应的权限
        };

        static defaultProps = {
            show: false,
            scope: 'System',
            actions: null,
            projectId: null,
            emptyContent: null,
            options: null
        }

        render() {
            const { show, scope, options, actions, projectId, emptyContent, ...others } = this.props
            const permissions = [...cache.getPermissions(), ...cache.getAuthenticatedLicenseData()]
            let valid = false
            if (options) {
                // 处理Dropdown的情况
                let allowOptions = options.filter(item => {
                    let subOptions = item.subOptions
                    if (subOptions && subOptions.length > 0) {
                        let allowSubOptions = subOptions.filter(subitem => {
                            let subAction = subitem.action
                            if (!subAction) {
                                return true
                            }
                            if (permissions.indexOf(subAction) > -1) {
                                return true
                            }
                            return false
                        })
                        if (allowSubOptions.length > 0) {
                            item.subOptions = allowSubOptions
                            return true
                        } else { // 有suboptions，但是subOptions里一个权限也没有
                            return false
                        }
                    } else {
                        let action = item.action
                        if (!action) {
                            return true
                        }
                        // 此操作在允许的action中则返回true
                        if (permissions.indexOf(action) > -1) {
                            return true
                        }
                        return false
                    }
                })
                if (allowOptions.length > 0) {
                    return (
                        <ComposedComponent
                            // ref={(node) => { this.main = node }}
                            {...others}
                            options={allowOptions}
                        />
                    )
                }
            } else if (actions) {
                for (var index in actions) {
                    let validateAction = actions[index]
                    if (permissions.indexOf(validateAction) > -1) {
                        valid = true
                        break
                    }
                }
            }
            if (valid) {
                return (
                    <ComposedComponent
                        // ref={(node) => { this.main = node }}
                        {...others}
                    />
                )
            } else {
                if (show) {
                    return (
                        <ComposedComponent
                            // ref={(node) => { this.main = node }}
                            {...others}
                            disabled
                        />
                    )
                } else {
                    if (emptyContent) {
                        return <span>{emptyContent}</span>
                    }
                    return null
                }
            }
        }
    }

    return Wrapper
}
export default ActionAuth

export const authActionShow = (actions) => {
    const permissions = [...cache.getPermissions(), ...cache.getAuthenticatedLicenseData()]
    for (var index in actions) {
        let validateAction = actions[index]
        if (permissions.indexOf(validateAction) >= 0) {
            return true
        }
    }
    return false
}
