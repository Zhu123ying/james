/* eslint "react/prop-types": "warn" */

import React, { Component, PropTypes } from 'react';

import MetabaseSettings from "metabase/lib/settings";
import VisualizationErrorMessage from './VisualizationErrorMessage';

const EmailAdmin = () => {
  const adminEmail = MetabaseSettings.adminEmail()
  return adminEmail && (
      <span className="QueryError-adminEmail">
          <a className="no-decoration" href={`mailto:${adminEmail}`}>
              {adminEmail}
          </a>
      </span>
  )
}

class VisualizationError extends Component {

  constructor(props) {
      super(props);
      this.state = {
          showError: false
      }
  }
  static propTypes = {
      card:     PropTypes.object.isRequired,
      duration: PropTypes.number.isRequired,
      error:    PropTypes.object.isRequired,
  }

  render () {
      const { card, duration, error } = this.props
      if (typeof error.status === "number") {
          // Assume if the request took more than 15 seconds it was due to a timeout
          // Some platforms like Heroku return a 503 for numerous types of errors so we can't use the status code to distinguish between timeouts and other failures.
          if (duration > 15*1000) {
              return <VisualizationErrorMessage
                        type="timeout"
                        title="查询超时"
                        //message="We didn't get an answer back from your database in time, so we had to stop. You can try again in a minute, or if the problem persists, you can email an admin to let them know."
                        message="查询超时，我们不得不暂停这次查询，您可以稍后再试。如果问题依然复现，请联系我们予以，感谢您对DataUlrta BI系统的支持。"

                        action={<EmailAdmin />}
                    />
          } else {
              return <VisualizationErrorMessage
                        type="serverError"
                        title="我们的服务器貌似出了一些小问题"
                        message="请等待一两分钟后刷新页面。如果问题仍然存在，我们建议您联系管理员。 "
                        action={<EmailAdmin />}
                    />
          }
      } else if (card.dataset_query && card.dataset_query.type === 'native') {
          // always show errors for native queries
          return (
              <div className="QueryError flex full align-center text-error">
                  <div className="QueryError-iconWrapper">
                      <svg className="QueryError-icon" viewBox="0 0 32 32" width="64" height="64" fill="currentcolor">
                          <path d="M4 8 L8 4 L16 12 L24 4 L28 8 L20 16 L28 24 L24 28 L16 20 L8 28 L4 24 L12 16 z "></path>
                      </svg>
                  </div>
                  <span className="QueryError-message">{error}</span>
              </div>
          );
      } else {
          return (
              <div className="QueryError2 flex full justify-center">
                  <div className="QueryError-image QueryError-image--queryError mr4"></div>
                  <div className="QueryError2-details">
                      <h1 className="text-bold">当前查询出错</h1>
                      <p className="QueryError-messageText">此问题通常由错误数据或无效选项引起，请在修改后重新尝试提交。</p>
                      <div className="pt2">
                          <a onClick={() => this.setState({ showError: true })} className="link cursor-pointer">显示错误详情</a>
                      </div>
                      <div style={{ display: this.state.showError? 'inherit': 'none'}} className="pt3 text-left">
                          <h2>错误详情</h2>
                          <div style={{fontFamily: "monospace"}} className="QueryError2-detailBody bordered rounded bg-grey-0 text-bold p2 mt1">{error}</div>
                      </div>
                  </div>
              </div>
          );
      }
  }
}

export default VisualizationError
