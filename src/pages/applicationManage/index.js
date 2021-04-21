import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'

const ApplicationManage = props => {
    let { prefixCls = 'ult' } = props
    const intl = useIntl()
    return 'ApplicationManage'
}

ApplicationManage.propTypes = {
    prefixCls: PropTypes.string
}

export default ApplicationManage
