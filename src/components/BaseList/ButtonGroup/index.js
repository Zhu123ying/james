import React, { useState, useEffect } from 'react'
import {
  Search,
  Panel,
  confirmForm,
  AlertBox,
  Button,
  Loading,
  Tooltip
} from 'ultraui'
import PropTypes from 'prop-types'
import './index.less'

const ButtonGroup = ({ option, render }) => {
  useEffect(() => {}, [])

  const renderButtons = () => {
    if (render) {
      return render()
    }
    return option.map((item, index) => {
      if (!item.hasOwnProperty('auth') || item.auth) {
        return <Button key={index} {...item} />
      }
    })
  }

  return <div className="ult-list-btn-group">{renderButtons()}</div>
}

ButtonGroup.propTypes = {
  option: PropTypes.array,
  render: PropTypes.func
}

ButtonGroup.defaultProps = {
  option: [],
  render: null
}

export default ButtonGroup
