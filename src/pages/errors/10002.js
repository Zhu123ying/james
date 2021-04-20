import PropTypes from 'prop-types'
import { Row, Col } from '@huayun/ultraui'

const VdcManagerHasNoVdc = props => {
    const { prefixCls } = props
    return (
        <div className={`${prefixCls}-error-page`} >
            <Row style={{width: '100%'}}>
                <Col span={6}>
                    <div className="error-page-image has-no-vdc" />
                </Col>
                <Col span={6}>
                    <div className="error-page-detail">
                        <p className="error-page-detail-message">{window.LanguageData[window.LangCode]['HasNoVdcMessage']}</p>
                        <p className="error-page-detail-submessage">{window.LanguageData[window.LangCode]['HasNoVdcSubMessage']}</p>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

VdcManagerHasNoVdc.propTypes = {
    prefixCls: PropTypes.string.isRequired
}

export default VdcManagerHasNoVdc
