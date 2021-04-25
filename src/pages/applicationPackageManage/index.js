import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'

const ApplicationPackageManage = props => {
    let { prefixCls = 'ult' } = props
    const intl = useIntl()
    return 'ApplicationPackageManage'
}

ApplicationManage.propTypes = {
    prefixCls: PropTypes.string
}

export default ApplicationManage
