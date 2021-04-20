import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

class PopupMask extends Component {
  static propTypes = {
    style: PropTypes.object,
    onMouseLeave: PropTypes.func
  };

  static defaultProps = {
    style: {},
    onMouseLeave: () => {}
  };

  retContainer() {
    if (!this.popupNode) {
      const popupNode = document.createElement('div')
      popupNode.setAttribute('id', 'popup_mask')
      this.popupNode = popupNode
      document.body.appendChild(popupNode)
    }
    return this.popupNode
  }

  refContent = (e) => {
    this.props.refContent(e)
  };

  retContent() {
    const { style, onMouseLeave } = this.props
    return (
      <div
        className="popup_content"
        ref={(e) => this.refContent(e)}
        style={style}
        onMouseLeave={onMouseLeave}
      >
        {this.props.children}
      </div>
    )
  }

  componentDidUpdate() {
    // 当父级模块更新时，直接粗暴地执行渲染，该api跨节点渲染，理同ReactDOM.render
    ReactDOM.unstable_renderSubtreeIntoContainer(
      this,
      this.retContent(),
      this.retContainer()
    )
  }

  render() {
    // 此处需返回null 避免报错
    return null
  }
}

export default PopupMask
