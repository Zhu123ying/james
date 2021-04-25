import PropTypes from 'prop-types'
import { Row, Col } from '@huayun/ultraui'
import { useIntl } from 'react-intl'
import './index.less'

const PageNotFound = props => {
    let { prefixCls = 'ult' } = props
    const intl = useIntl()
    return (
        <div className={`${prefixCls}-error-page`} style={{height: 'calc(100vh - 204px)'}}>
            <Row style={{width: '100%'}}>
                <Col span={6}>
                    <div className="error-page-image page-not-found" />
                </Col>
                <Col span={6}>
                    <div className="error-page-detail">
                        <p className="error-page-detail-message">{intl.formatMessage({id: 'PageNotFoundMessage'})}</p>
                        <p className="error-page-detail-submessage">
                            &nbsp;{intl.formatMessage({id: 'PageNotFoundSubMessage'})}&nbsp;
                            <a href="#!" onClick={() => { window.location.reload() }} >{intl.formatMessage({id: 'Refresh'})}</a>
                            &nbsp;{intl.formatMessage({id: 'Or'})}&nbsp;
                        </p>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

PageNotFound.propTypes = {
    prefixCls: PropTypes.string
}

export default PageNotFound
