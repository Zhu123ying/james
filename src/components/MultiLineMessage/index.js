/* eslint-disable */
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'

const MultiLineMessage = (props) => {
    let intl = null
    if (props.intl) {
        intl = props.intl
    } else {
        intl = useIntl()
    }
    const { id, values, ...others } = props
    const message = intl.formatMessage({ id }, values)
    return (
        <p {...others} dangerouslySetInnerHTML={{ __html: message }} />
    )
}

MultiLineMessage.propTypes = {
    id: PropTypes.string.isRequired,
    values: PropTypes.object,
    intl: PropTypes.object
}

MultiLineMessage.defaultProps = {
    values: {},
    intl: null
}

export default MultiLineMessage
