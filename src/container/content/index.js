import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import { renderRoutes } from 'react-router-config'
import routes from '~/router/routes'

const Container = props => {
    return (
        <div>
            Container
            {
                renderRoutes(routes)
            }
        </div>
    )
}

// Container.propTypes = {
//     prefixCls: PropTypes.string
// }

export default Container
