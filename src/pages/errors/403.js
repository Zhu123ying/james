import PropTypes from 'prop-types'
import { Row, Col } from '@huayun/ultraui'
import { useIntl } from 'react-intl'

const NoPrivilege = props => {
    const { prefixCls = 'ult' } = props

    const intl = useIntl()
    return (
        <div className={`${prefixCls}-error-page`} >
            <Row style={{width: '100%'}}>
                <Col span={6}>
                    <div className="error-page-image page-not-found" />
                </Col>
                <Col span={6}>
                    <div className="error-page-detail">
                        <p className="error-page-detail-message">{intl.formatMessage({id: 'NoPrivilegeMessage'})}</p>
                        <p className="error-page-detail-submessage">
                            {intl.formatMessage({id: 'NoPrivilegeSubMessage'})}
                        </p>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

NoPrivilege.propTypes = {
    prefixCls: PropTypes.string.isRequired
}

export default NoPrivilege
