import PropTypes from 'prop-types'
import { Row, Col } from '@huayun/ultraui'

const ShouldSelectCloudEnvFirst = props => {
    const { prefixCls } = props
    return (
        <div className={`${prefixCls}-error-page`} >
            <Row style={{width: '100%'}}>
                <Col span={6}>
                    <div className="error-page-image select-cloud-env" />
                </Col>
                <Col span={6}>
                    <div className="error-page-detail">
                        <p className="error-page-detail-message">{window.LanguageData[window.LangCode]['SelectCloudEnvironmentMessage']}</p>
                        <p className="error-page-detail-submessage">
                            {window.LanguageData[window.LangCode]['SelectCloudEnvironmentSubMessage']}
                            <span className="error-page-detail-strong">{window.LanguageData[window.LangCode]['SelectCloudEnv']}</span>
                            {window.LanguageData[window.LangCode]['S_Period']}
                        </p>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

ShouldSelectCloudEnvFirst.propTypes = {
    prefixCls: PropTypes.string.isRequired
}

export default ShouldSelectCloudEnvFirst
