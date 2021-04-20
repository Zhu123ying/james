/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-comment-textnodes */
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import _ from 'lodash'
import PopupMask from './popupMask'
import './popMenu.less'

const menuHeight = 32

class PopMenu extends React.Component {
  static propTypes = {
    menus: PropTypes.array,
    activeKey: PropTypes.string,
    className: PropTypes.string,
    prefixCls: PropTypes.string,
    theme: PropTypes.string,
    collapsed: PropTypes.bool,
    history: PropTypes.object.isRequired,
    defaultOption: PropTypes.object,
    handleMenuClick: PropTypes.func
  };

  static defaultProps = {
    menus: [],
    activeKey: '',
    className: '',
    prefixCls: 'ult',
    theme: 'dark',
    collapsed: false,
    defaultOption: {
      accordion: false,
      openAll: true
    },
    handleMenuClick: () => {}
  };
  constructor(props) {
    super(props)
    this.state = {
      menus: [],
      openMenu: {},
      openPopMenu: {},
      openSubMenu: [],
      openSubMenuOffset: {},
      activeKey: ''
    }
  }

  componentWillMount() {
    const { activeKey, menus } = this.props
    this.setState({ activeKey, menus })
  }

  componentWillReceiveProps(nextProps) {
    const { activeKey, menus } = nextProps
    if (!_.isEmpty(menus) && this.state.menus !== menus) {
      this.setState({ menus })
    }
  }

  initMenu = (menu = {}) => {
    const { menus } = this.state
    const list = menus
      .filter(({ hidden = '' }) => !hidden)
      .map((item, index) => {
        if (menu.id === item.id) {
          item.close = !item.close
        }
        return item
      })
    this.setState({ menus: list })
  };

  handleClick = (item) => {
    const {handleMenuClick} = this.props
    handleMenuClick({activeKey: item.id})
    this.setState({ activeKey: item.id }, () => {
      this.handleOpenMenuMouseLeave()
      this.props.history.push(item.path)
    })
  };

  hasActiveKey = (data) => {
    const { activeKey } = this.props
    return JSON.stringify(data).includes(`"id":"${activeKey}"`)
  };

  getSViewportOffset() {
    if (window.innerWidth) {
      return {
        w: window.innerWidth,
        h: window.innerHeight
      }
    } else {
      if (document.compatMode === 'BackCompat') {
        return {
          w: document.body.clienWidth,
          h: document.body.clientHeight
        }
      } else {
        return {
          w: document.documentElement.clientWidth,
          h: document.documrntElement.clientHeight
        }
      }
    }
  }

  renderSubMenu = (list, show) => {
    const { prefixCls, collapsed } = this.props
    const { activeKey } = this.props
    if (_.isEmpty(list)) {
      return null
    }
    const subMenus = list
      .filter(({ hidden = '' }) => !hidden)
      .map((item, index) => {
        return (
          <li
            key={item.id}
            className={classnames(`${prefixCls}-sider-submenu-item`, {
              active: activeKey === item.id
            })}
            style={{
              height: menuHeight,
              lineHeight: `${menuHeight}px`
            }}
          >
            {/* // eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a onClick={() => this.handleClick(item)}>
              {!collapsed ? (
                <i className={`iconfont icon-${item.icon}`} />
              ) : null}
              <span>{item.name}</span>
            </a>
          </li>
        )
      })
    return (
      <ul
        onMouseLeave={(e) => this.handleOpenMenuMouseLeave()}
        // onMouseEnter={this.handleOpenMenuMouseEnter}
        className={`${prefixCls}-sider-submenu ${
          collapsed ? 'collapsed' : ''
        } ${!show ? 'hidden' : ''}`}
      >
        {subMenus}
      </ul>
    )
  };

  renderMenu = (list) => {
    const { className, prefixCls, collapsed } = this.props
    const { openPopMenu } = this.state
    const menus = list
      .filter(({ hidden = '' }) => !hidden)
      .map((item, index) => {
        const res = this.hasActiveKey(item)
        const content = (
          <div
            onClick={(e) => this.handleMenuClick(e, item)}
            className={classnames(
              `${prefixCls}-sider-menu-item`,
              { open: openPopMenu.id === item.id },
              { oneline: _.isEmpty(item.subMenus) && !collapsed },
              { active: res && (_.isEmpty(item.subMenus) || collapsed) }
            )}
          >
            {collapsed || _.isEmpty(item.subMenus) ? (
              <i className={`iconfont icon-${item.icon}`} />
            ) : null}
            <span className={`${prefixCls}-sider-menu-item-title`}>
              {item.name}
            </span>
            {!_.isEmpty(item.subMenus) ? (
              <i
                className={`iconfont icon-down ${!item.close ? 'close' : ''}`}
              />
            ) : null}
          </div>
        )
        return (
          <li
            key={item.id}
            onMouseEnter={(e) => this.handleMouseEnter(e, item)}
            onMouseLeave={(e) => this.handleMouseLeave(e, item)}
          >
            {_.isEmpty(item.subMenus) ? (
              <a
                onClick={(e) => {
                  this.handleMenuClick(e, item)
                  this.props.history.push(item.path)
                }}
              >
                {content}
              </a>
            ) : (
              content
            )}
            {this.renderSubMenu(
              item.subMenus,
              !_.isEmpty(item.subMenus) && !collapsed && !item.close
            )}
          </li>
        )
      })
    return (
      <ul
        className={classnames(`${prefixCls}-sider-menu`, `${className}`, {
          [`${prefixCls}-sider-menu-collapsed`]: collapsed
        })}
      >
        {menus}
      </ul>
    )
  };

  handleMenuClick = (e, item) => {
    const { collapsed } = this.props
    if (collapsed) {
      return
    }
    if (_.isEmpty(item.subMenus)) {
      this.setState({ activeKey: item.id })
    }
    this.initMenu(item)
  };

  handleMouseEnter = (e, item) => {
    const { collapsed } = this.props
    if (!collapsed) {
      return
    }
    const eventSize = e.currentTarget.getBoundingClientRect()
    const viewPort = this.getSViewportOffset()
    let openSubMenuOffset = {
      left: `${eventSize.left + eventSize.width}px`
    }

    let count = _.get(item, 'subMenu.length', 0)
    if (count > 0) {
      item.subMenus.foreach((sub) => {
        count += _.get(sub, 'subMenu.length', 0)
      })
    }

    if (count * menuHeight + eventSize.top > viewPort.h) {
      openSubMenuOffset.bottom = 0
    } else {
      openSubMenuOffset.top = `${eventSize.top}px`
    }
    this.setState({
      openSubMenu: item.subMenus,
      openPopMenu: item,
      openSubMenuOffset
    })
  };

  handleMouseLeave = (e, item) => {
    const { collapsed } = this.props
    if (!collapsed) {
      return
    }
    const div = ReactDOM.findDOMNode(this._pop)
    const x = e.clientX
    const y = e.clientY
    const divx1 = div.offsetLeft
    const divy1 = div.offsetTop
    const divx2 = div.offsetLeft + div.offsetWidth
    const divy2 = div.offsetTop + div.offsetHeight
    if (x < divx1 || x > divx2 || y < divy1 || y > divy2) {
      this.handleOpenMenuMouseLeave()
    }
  };

  handleOpenMenuMouseLeave = () => {
    const { collapsed } = this.props
    if (collapsed) {
      this.setState({ openSubMenu: [], openPopMenu: {} })
    }
  };

  refContent = (e) => {
    this._pop = e
  };

  renderPopMenu = () => {
    const { openSubMenu, openSubMenuOffset } = this.state
    return (
      <PopupMask
        refContent={(e) => this.refContent(e)}
        style={{ position: 'absolute', zIndex: 999999, ...openSubMenuOffset }}
      >
        {this.renderSubMenu(openSubMenu, true)}
      </PopupMask>
    )
  };

  render() {
    const { menus } = this.state
    return (
      <div>
        {this.renderMenu(menus)}
        {this.renderPopMenu()}
      </div>
    )
  }
}

export default PopMenu
