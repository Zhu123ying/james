import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'

const ApplicationPackageManage = props => {
    let { prefixCls = 'ult' } = props
    const intl = useIntl()
    return 'ApplicationPackageManage'
}

ApplicationPackageManage.propTypes = {
    prefixCls: PropTypes.string
}

export default ApplicationPackageManage
