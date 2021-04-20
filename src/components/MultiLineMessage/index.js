/*
 * @Author: wuxiaotian
 * @Date: 2018-05-04 17:37:17
 * @Last Modified by: wuxiaotian
 * @Last Modified time: 2018-05-12 11:39:06
 */

/* eslint react/no-danger: 0 */

import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'

const MultiLineMessage = (props) => {
  const intl = useIntl()
  const { id, values, ...others } = props
  const message = intl.formatMessage({ id }, values)
  return <p {...others} dangerouslySetInnerHTML={{ __html: message }} />
}

MultiLineMessage.propTypes = {
  id: PropTypes.string.isRequired,
  values: PropTypes.object
}

MultiLineMessage.defaultProps = {
  values: {}
}

export default MultiLineMessage
