/* eslint-disable quotes */
import React from 'react'
import PropTypes from 'prop-types'

/**
 * 「true/false」逻辑判断组件 注意children无论如何都会校验变量取值
 * @param {*} param0
 */
export default function IFRender({ judge, children, elseRender }) {
  if (!judge) {
    return elseRender
  } else {
    return <>{children}</>
  }
}

IFRender.propTypes = {
  elseRender: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ]),
  judge: PropTypes.any,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ]).isRequired
}

IFRender.defaultProps = {
  elseRender: null,
  judge: false
}
