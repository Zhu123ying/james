/* eslint-disable react/no-danger */
/*
 * @Author: huang min
 * @Date: 2017-07-19 15:32:52
 * @Last Modified by: wuxiaotian
 * @Last Modified time: 2018-06-15 14:58:30
 */

/* eslint react/no-multi-comp: 0 */
import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Panel, Dropdown, Icon, Button, TooltipAlign, Dialog } from 'ultraui'
import DetailList from './detailList'
import './detail.less'
// import ActionAuth, { authActionShow } from '../../utils/ActionAuth'

const ActionAuth = (comment) => comment
const authActionShow = () => true

const PanelTitle = Panel.PanelTitle
const _ = window._
const AuthDropdown = ActionAuth(Dropdown)
const AuthButton = ActionAuth(Button)

let timer

class Detail extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        operate: PropTypes.object,
        options: PropTypes.array.isRequired,
        actions: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.bool
        ]),
        prefixCls: PropTypes.string,
        buttons: PropTypes.array
    };

    static defaultProps = {
        prefixCls: 'ult',
        operate: {},
        actions: false,
        buttons: []
    }

    state = {
        operateExpanded: true
    }

    optionRef = React.createRef()

    getComponetWrappedByTooltip(comp, tooltip) {
        if (_.isEmpty(tooltip)) {
            return comp
        } else {
            const { placement, trigger, tips } = tooltip
            return (
                <TooltipAlign style={{ display: 'inline' }} key={tooltip} placement={placement || 'left'} tips={tips} trigger={trigger || 'hover'}>
                    {comp}
                </TooltipAlign>
            )
        }
    }

    handleRenderOperate = (title, auth) => {
        const { operateExpanded } = this.state
        if (auth) {
            if (auth.allActionAuthed) {
                return (
                    <>
                        <Button size="small" type="text" name={title} icon={operateExpanded ? 'up' : 'down'} iconRight onClick={this.handleDropOperateChange} />
                    </>
                )
            } else {
                return null
            }
        }
        return (
            <>
                <Button size="small" type="text" name={title} icon={operateExpanded ? 'up' : 'down'} iconRight onClick={this.handleDropOperateChange} />
            </>
        )
    }

    handleGetShowIcon = (option) => {
        if (_.isEmpty(option.action)) {
            return option.operateIcon
        } else {
            return authActionShow([option.action]) && option.operateIcon
        }
    }

    handleRenderOptions = (options = []) => {
        const opts = options.map(item => item.action)
        const allActionAuthed = authActionShow(opts)
        if (!allActionAuthed && !opts.includes(undefined)) {
            return null
        }
        return (
            <div ref={this.optionRef} className={classnames('basedetail-operations-options', { 'is-operate-expand': this.state.operateExpanded })}>
                {
                    options.map(option => (
                        <span key={option.id}>
                            {
                                _.isEmpty(option.action) ? (
                                    <Button
                                        name={option.name}
                                        icon={option.icon}
                                        onClick={option.callback}
                                        disabled={option.disabled}
                                        type="text"
                                        size="small"
                                    />
                                ) : (
                                    <AuthButton
                                        name={option.name}
                                        icon={option.icon}
                                        actions={[option.action]}
                                        onClick={option.callback}
                                        disabled={option.disabled}
                                        type="text"
                                        size="small"
                                    />
                                )
                            }
                            {
                                this.handleGetShowIcon(option) ? (
                                    option.operateIcon.mode === 'tooltip' ? (
                                        <TooltipAlign
                                            scrollContainer={option.operateIcon.scrollContainer || ".content-wrapper"}
                                            placement="topRight"
                                            tips={
                                                <p
                                                    dangerouslySetInnerHTML={{
                                                        __html: option.operateIcon.tips
                                                    }}
                                                />
                                            }
                                        >
                                            <i className={`iconfont ${option.operateIcon.name}`} />
                                        </TooltipAlign>
                                    ) : (
                                        <i className={`iconfont ${option.operateIcon.name}`} onClick={this.handleClickOperateIcon.bind(this, { ...option.operateIcon, title: option.name })} />
                                    )
                                ) : null
                            }
                        </span>
                    ))
                }
            </div>
        )
    }

    handleClickOperateIcon = (icon) => {
        if (icon) {
            Dialog(
                <div dangerouslySetInnerHTML={{ __html: icon.tips }} />
                , {
                    title: icon.title,
                    confirmTitle: '检查详情',
                    style: {width: '400px'},
                    confirm: () => {
                        window.open(icon.uri, '_blank')
                    }
            })
        }
    }

    handleDropOperateChange = () => {
        const { operateExpanded } = this.state
        this.setState({
            operateExpanded: !operateExpanded
        })
        this.handleHeightWhenOperateExpandedChange()
    }
    handleHeightWhenOperateExpandedChange() {
        if (this.optionRef.current) {
            this.optionRef.current.style.height = this.optionRef.current.scrollHeight + 'px'
            timer = setTimeout(() => {
                this.optionRef.current.style.height = null
                if (timer) {
                    clearTimeout(timer)
                }
            })
        }
    }

    componentWillUnmount() {
        if (timer) {
            clearTimeout(timer)
        }
    }
    detailTitle() {
        /* eslint react/jsx-handler-names: 0 */
        const { operate, prefixCls, title, buttons = [] } = this.props
        const { actions } = operate
        const options = operate.options || []
        const allActionAuthed = authActionShow(options.map(item => item.action))
        if (actions) {
            return (
                <PanelTitle>
                    <h4 className={classnames(`${prefixCls}-panel-title`)}>{title}</h4>
                    <div className="basedetail-operations">
                        {
                            !_.isEmpty(buttons) && buttons.map(button => button)
                        }
                        {
                            !_.isArray(operate)
                                ? !_.isEmpty(operate.options)
                                    ? this.getComponetWrappedByTooltip(this.handleRenderOperate(operate.title, { allActionAuthed }), operate.tooltip)
                                    : this.getComponetWrappedByTooltip(<AuthButton
                                                                            {...operate}
                                                                            type="text"
                                                                            onClick={operate.callback}
                                                                            className="single-operation-button"
                                                                       >
                                                                            { operate.name }
                                                                       </AuthButton>, operate.tooltip)
                                : null
                        }
                    </div>
                </PanelTitle>
            )
        }
        return (
            <PanelTitle>
                <h4 className={classnames(`${prefixCls}-panel-title`)}>{title}</h4>
                <div className="basedetail-operations">
                    {
                        !_.isEmpty(buttons) && buttons.map(button => button)
                    }
                    {
                        !_.isArray(operate)
                            ? !_.isEmpty(operate.options)
                                ? this.handleRenderOperate(operate.title)
                                : <Button type="text" onClick={operate.callback} className="single-operation-button" >
                                    { operate.icon ? <Icon type={operate.icon} /> : null }
                                    { operate.name }
                                  </Button>
                            : null
                    }
                </div>
            </PanelTitle>
        )
    }

    render() {
        const { prefixCls, options, operate } = this.props
        return (
            <Panel title={this.detailTitle()} className="m-b" >
                {
                    !_.isEmpty(operate.options) ? this.handleRenderOptions(operate.options) : null
                }
                <DetailList options={options} prefixCls={prefixCls} />
            </Panel>
        )
    }
}

const WrappedDetailComponent = (props) => {
    const {data, prefixCls, className, slot} = props
    return (
        <div className={classnames(`${prefixCls}-detail-panel`, className)}>
            {
                data.map(({ id, name, operate, options, buttons }) => (<Detail key={id} title={name} buttons={buttons} operate={operate} options={options} prefixCls={prefixCls} />))
            }
            {slot}
        </div>
    )
}

WrappedDetailComponent.propTypes = {
    data: PropTypes.array.isRequired,
    prefixCls: PropTypes.string.isRequired,
    className: PropTypes.string,
    slot: PropTypes.any
}

WrappedDetailComponent.defaultProps = {
    className: '',
    slot: null
}

export default WrappedDetailComponent
