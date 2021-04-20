import PropTypes from 'prop-types'
import { Tooltip, Icon } from '@huayun/ultraui'
import './tableheadertip.less'

TableHeaderTip.propTypes = {
  prefixCls: PropTypes.string,
  title: PropTypes.string,
  tips: PropTypes.string
}

TableHeaderTip.defaultProps = {
  prefixCls: 'ult',
  title: '',
  tips: ''
}

function TableHeaderTip({ title, tips, prefixCls }) {
  return (
    <div className={`${prefixCls}-table-header-tip`}>
      <div className="table-header-tip-title">{title}</div>
      <Tooltip className="table-header-tip-tip" tips={tips}>
        <Icon type="c_question-s" />
      </Tooltip>
    </div>
  )
}

export default TableHeaderTip
