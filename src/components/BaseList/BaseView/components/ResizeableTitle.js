import React from 'react'
import { Resizable } from 'react-resizable'
import PropTypes from 'prop-types'
import 'react-resizable/css/styles.css'

const ResizeableTitle = props => {
  const { onResize, width, ...restProps } = props

  if (!width) {
    return <th {...restProps} />
  }

  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      resizeHandles={['e']}
    >
      <th {...restProps} />
    </Resizable>
  )
}

ResizeableTitle.propTypes = {
  onResize: PropTypes.func,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

ResizeableTitle.defaultProps = {
  onResize: () => {},
  width: 0
}

export default ResizeableTitle
