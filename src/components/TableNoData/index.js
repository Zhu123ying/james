/**
 * 列表暂无数据显示组件
 *
 * @author: chenbin
 * @created: /2018/11/21
 */
import classnames from 'classnames'
import React from 'react'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import './index.less'
import defaultSVG from './svg/defaultSVG.svg'

function TableNoData({ prefixCls, className, style, title, desc, img }) {
  const intl = useIntl()
  const classes = classnames(`${prefixCls}-tablenodata`, className)
  return (
    <div className={classes} style={style}>
      <img className={`${prefixCls}-tablenodata-img`} src={img} alt="" />
      <div className={`${prefixCls}-tablenodata-text`}>
        <div className={`${prefixCls}-tablenodata-text-title`}>
          {title + intl.formatMessage({ id: 'TableNoDataTitle' })}
        </div>
        <div className={`${prefixCls}-tablenodata-text-desc`}>
          {desc || intl.formatMessage({ id: 'TableNoDataDesc' })}
        </div>
      </div>
    </div>
  )
}

TableNoData.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  img: PropTypes.string,
  title: PropTypes.string,
  desc: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.element
  ])
}

TableNoData.defaultProps = {
  prefixCls: 'ult',
  className: '',
  style: null,
  img: defaultSVG,
  title: '',
  desc: ''
}

export default TableNoData
