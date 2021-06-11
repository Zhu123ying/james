/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import { RcForm, Timeline, Panel, NoData, Static, Button, Tooltip, Loading } from 'ultraui'
import './index.less'
import { DEFAULT_EMPTY_LABEL } from 'Cnst/config'
import Action from 'Cnst/action'
import { ActionAuth } from 'Utils'
import Detail from 'BCmpt/Detail'
import moment from 'moment'
import { formatChartValues } from '../../utils'

const _ = window._

const ActionButton = ActionAuth(Button)

class AppStoreAppDetail extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    modelDetail: PropTypes.object.isRequired,
    baseFetch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.baseAction = {
      app: 'appCenter',
      model: 'appStore.detail',
      method: 'post',
      data: {
        id: props.match.params.id
      }
    }
    this.state = {
      appDetail: {}, // 应用的详情
      versionDetail: {}, // 版本的详情
      versionList: [], // 版本列表
      chartType: 'chartValues'
    }
  }

  componentDidMount() {
    this.getDetail()
  }

  getDetail = () => {
    const { app, model, method, data } = this.baseAction
    this.props.baseFetch(app, model, method, data, {}, {
      callback: (res) => {
        const { name, projectName, tags, createTime, createByName, description, applicationPackageVersionStoreList: versionList, packageVersionPojo: versionDetail } = res
        this.setState({
          appDetail: {
            name, tags, createTime, createByName, description, projectName
          },
          versionDetail,
          versionList
        })
      }
    })
  }

  getAppDetail() {
    const { intl } = this.props
    const { appDetail: { name, tags, createTime, createByName, description, projectName } } = this.state
    const infoOptions = [
      {
        id: 'Name',
        name: intl.formatMessage({ id: 'Name' }),
        value: name || DEFAULT_EMPTY_LABEL
      }, {
        id: 'projectName',
        name: intl.formatMessage({ id: 'ProjectBelongTo' }),
        value: projectName || DEFAULT_EMPTY_LABEL
      }, {
        id: 'Description',
        name: intl.formatMessage({ id: 'Description' }),
        value: (
          <Tooltip tips={description || DEFAULT_EMPTY_LABEL} placement="bottom">
            <div>{description || DEFAULT_EMPTY_LABEL}</div>
          </Tooltip>
        )
      }, {
        id: 'AppTag',
        name: intl.formatMessage({ id: 'AppTag' }),
        value: (tags || []).join('、') || DEFAULT_EMPTY_LABEL
      }, {
        id: 'createByName',
        name: intl.formatMessage({ id: 'Creator' }),
        value: createByName || DEFAULT_EMPTY_LABEL
      }, {
        id: 'CreateTime',
        name: intl.formatMessage({ id: 'CreateTime' }),
        value: createTime || DEFAULT_EMPTY_LABEL
      }
    ]
    return [{
      id: 'BaseInfo',
      name: intl.formatMessage({ id: 'BaseInfo' }),
      options: infoOptions,
      buttons: [
        <ActionButton actions={[Action.AdminApplicationCenterApplicationCenterApplicationCreate]} type="primary" onClick={this.toCreateApp} >{intl.formatMessage({ id: 'CreateAppTitle' })}</ActionButton>
      ]
    }]
  }

  getVersionDetail() {
    const { intl } = this.props
    const { versionDetail: { name, createTime, description, createByName, quota, id } } = this.state
    const cpu = _.get(quota, 'cpu', 0)
    const memory = _.get(quota, 'memory', 0)
    const storage = _.get(quota, 'storage', {})

    const infoOptions = [
      {
        id: 'Name',
        name: intl.formatMessage({ id: 'Name' }),
        value: name || DEFAULT_EMPTY_LABEL
      }, {
        id: 'Description',
        name: intl.formatMessage({ id: 'Description' }),
        value: (
          <Tooltip tips={description || DEFAULT_EMPTY_LABEL} placement="bottom">
            <div>{description || DEFAULT_EMPTY_LABEL}</div>
          </Tooltip>
        )
      }, {
        id: 'CreateTime',
        name: intl.formatMessage({ id: 'CreateTime' }),
        value: createTime || DEFAULT_EMPTY_LABEL
      }, {
        id: 'createByName',
        name: intl.formatMessage({ id: 'Creator' }),
        value: createByName || DEFAULT_EMPTY_LABEL
      }, {
        id: 'Recommended Configuration',
        name: intl.formatMessage({ id: 'Recommended Configuration' }),
        value: (
          <div className="recommendConfig">
            <span>CPU&nbsp;:&nbsp;{cpu}m</span>
            <span>Memory&nbsp;:&nbsp;{memory}Mi</span>
            <span style={{ display: 'flex' }}>
              Storage&nbsp;:&nbsp;
              <span>
                {
                  Object.keys(storage).map(key => {
                    return (
                      <React.Fragment>
                        <span>{`${key}: ${storage[key]}`}</span>
                        <br></br>
                      </React.Fragment>
                    )
                  })
                }
              </span>
            </span>
          </div>
        )
      }
    ]
    return [{
      id: 'VersionManage',
      name: intl.formatMessage({ id: 'VersionManage' }),
      options: id ? infoOptions : []
    }]
  }

  toCreateApp = () => {
    const { versionDetail: { id: applicationPackageVersionId } } = this.state
    this.props.history.push(`/appCenter/appManage/create?id=${this.props.match.params.id}&applicationPackageVersionId=${applicationPackageVersionId}`)
  }

  handleChoseVersion = (id) => {
    this.props.baseFetch('appCenter', 'appStore.appVersionDetail', 'post', { id }, {}, {
      callback: (res) => {
        this.setState({
          versionDetail: res,
          chartType: 'chartValues'
        })
      }
    })
  }

  choseChartType = (key) => {
    this.setState({
      chartType: key
    })
  }

  render() {
    const { modelDetail, modelVersionDetail, prefixCls, intl } = this.props
    const { versionList, versionDetail, chartType } = this.state

    return (
      modelDetail.isFetching || modelVersionDetail.isFetching
        ? <Loading /> : (
          <div id="AppStoreAppDetail">
            <Detail className='appDetail' data={this.getAppDetail()} prefixCls={prefixCls} />
            <div className="versionManage">
              <div className="versionDetail">
                <Detail data={this.getVersionDetail()} prefixCls={prefixCls} />
                {
                  versionDetail && versionDetail.id ? (
                    <div className="values_template">
                      <div className="label">
                        <span className={`chartTypeItem ${chartType === 'chartValues' ? 'activeItem' : ''}`} onClick={() => this.choseChartType('chartValues')}>Values</span>
                      &nbsp;/&nbsp;
                      <span className={`chartTypeItem ${chartType === 'chartTemplate' ? 'activeItem' : ''}`} onClick={() => this.choseChartType('chartTemplate')}>Template</span>
                      </div>
                      <div className="content" dangerouslySetInnerHTML={{ __html: formatChartValues(versionDetail[chartType]) }}></div>
                    </div>
                  ) : null
                }
              </div>
              <div className="versionList">
                <div className="label">{intl.formatMessage({ id: 'VersionList' })}</div>
                {
                  versionList.map(item => {
                    return (
                      <div
                        className={`versionItem ${item.id === versionDetail.id ? 'activeItem' : ''}`}
                        key={item.id}
                        onClick={() => this.handleChoseVersion(item.id)}>
                        <span className='versionName'>{item.name}</span>
                        <span className='versionCreateTime'>{item.createTime}</span>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        )
    )
  }

}

const mapStateToProps = state => ({
  modelDetail: state.baseModel.appCenter.appStore.detail.post,
  modelVersionDetail: state.baseModel.appCenter.appStore.appVersionDetail.post,
})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(AppStoreAppDetail))
