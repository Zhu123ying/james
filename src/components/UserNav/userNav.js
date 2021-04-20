/*
 * @Author: SiMeiyu
 * @Date: 2017-07-28 11:46:31
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import classnames from 'classnames'
import './userNav.less'

class UserNav extends React.Component {
    static propTypes = {
        prefixCls: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object,
        username: PropTypes.string.isRequired,
        photo: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        menu: PropTypes.array,
        logoutRequest: PropTypes.func
    }

    static defaultProps = {
        prefixCls: 'ult',
        className: '',
        style: null,
        menu: [],
        logoutRequest: undefined
    }

    constructor(props) {
        super(props)
        this.state = {
            isFlag: false
        }
        this.handleLogout = this.handleLogout.bind(this)
        this.handleToggle = this.handleToggle.bind(this)
        this.handleHidden = this.handleHidden.bind(this)
    }

    componentDidMount() {
        document.addEventListener('click', this.handleHidden)
    };

    componentWillUnmount() {
        document.removeEventListener('click', this.handleHidden)
    };

    handleLogout() {
        const {
            logoutRequest
        } = this.props
        if (logoutRequest) {
            logoutRequest()
        }
    }

    handleToggle(e) {
        e.nativeEvent.stopImmediatePropagation()

        // 代码取自dropdown组件，确保页面只有一个dropdown弹出
        const evt = document.createEvent('Event')
        evt.id = this.id
        evt.initEvent('click', true, true)
        document.dispatchEvent(evt)

        const isFlag = !this.state.isFlag
        this.setState({
            isFlag
        })
    }

    handleHidden(e) {
        if (this.state && this.state.isFlag) {
            this.setState({
                isFlag: false
            })
        }
    }

    handleClick(callback, name, e) {
        if (typeof callback === 'function') {
            callback(e, name)
        }
    }

    renderMenu() {
        const {
            prefixCls, menu
        } = this.props
        const menuLen = menu.length
        const isFlag = this.state.isFlag
        if (!isFlag) {
            return null
        }
        return (
            <div className={`${prefixCls}-usernav-panel`}>
                <ul className={
                    classnames(`${prefixCls}-usernav-menu`,
                        {[`${prefixCls}-usernav-menu-row`]: menuLen <= 3,
                            [`${prefixCls}-usernav-menu-col`]: menuLen > 3}
                    )
                }
                >
                    {
                        menu.map((item, idx) => (
                            item.url
                            ? <li key={idx}>
                                <Link to={item.url} >
                                    <i className={`iconfont icon-${item.icon}`} />
                                    <span>{item.name}</span>
                                    {' '}
                                </Link>
                              </li>
                            : <li key={idx} onClick={this.handleClick.bind(null, item.callback, item.name)}>
                                <button>
                                    <i className={`iconfont icon-${item.icon}`} />
                                    <span>{item.name}</span>
                                    {' '}
                                </button>
                              </li>
                        ))
                    }
                </ul>
                <button className={`${prefixCls}-usernav-logout`} onClick={this.handleLogout} >
                    <i className="iconfont icon-signout" />
                    <FormattedMessage id="SignOut" />
                </button>
            </div>
        )
    }

    render() {
        const {
            prefixCls, className, style, username, photo, role
        } = this.props
        const {
            isFlag
        } = this.state
        const classes = classnames(`${prefixCls}-usernav`, className)

        return (
            <div className={classes} style={style}>
                <div className={`${prefixCls}-usernav-toggle`} onClick={this.handleToggle} >
                    {
                        photo ? <img alt="avatar" className={`${prefixCls}-usernav-photo`} src={photo} /> : null
                    }
                    <ul className={`${prefixCls}-usernav-info`}>
                        <li className={`${prefixCls}-usernav-info-name`}>
                            {' '}
                            {username}
                            {' '}
                        </li>
                        {
                            role ? (
                                <li className={`${prefixCls}-usernav-info-role`}>
                                    {' '}
                                    {role}
                                    {' '}
                                </li>
                            ) : null
                        }
                    </ul>
                    <i className={`${prefixCls}-usernav-icon iconfont icon-${!isFlag ? 'down' : 'up'}`} />
                </div>
                {this.renderMenu()}
            </div>
        )
    }
}

export default UserNav
