/* eslint-disable */
import BaseComponent from 'Page/base/BaseComponent'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import { RcForm, Loading, Row, Col, Icon, Notification, Switch } from 'ultraui'
import './index.less'
import { clearNull } from 'Utils/tools/object'

const notification = Notification.newInstance()

const { FormGroup, Form, Input, Button, RadioGroup, Textarea, FormRow, Panel } = RcForm

const _ = window._

class ManagePackageVersion extends BaseComponent {
    static propTypes = {
        intl: PropTypes.object.isRequired,
        baseFetch: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props)
        const { applicationPackageVersionIds, packageVersionsAll } = props
        this.state = {
            applicationPackageVersions: packageVersionsAll || [], // 应用包的版本列表
            applicationPackageVersionIds: applicationPackageVersionIds || []
        }
    }

    componentDidMount() {
        // 如果是编辑，则不能用应用包的id去请求版本数据，必须用props里的packageVersionsAll
        !this.props.id && this.getAppPackageVersionDetail()
    }

    getAppPackageVersionDetail = () => {
        // 获取应用包的版本列表信息
        const { baseFetch, applicationPackageId } = this.props
        baseFetch('appCenter', 'appStore.appPackageVersionDetail', 'post', { applicationPackageId }, {}, {
            callback: (res) => {
                this.setState({
                    applicationPackageVersions: res
                })
            }
        })
    }

    handleSelectVersion = (bool, id) => {
        const { applicationPackageVersionIds } = this.state
        if (bool) {
            applicationPackageVersionIds.push(id)
        } else {
            let index = applicationPackageVersionIds.findIndex(item => item === id)
            applicationPackageVersionIds.splice(index, 1)
        }
        this.setState({
            applicationPackageVersionIds: [...applicationPackageVersionIds]
        })
    }

    isChecked = (id) => {
        const { applicationPackageVersionIds } = this.state
        return applicationPackageVersionIds.some(item => item === id)
    }

    render() {
        const { form, intl } = this.props
        const { applicationPackageVersions, applicationPackageVersionIds } = this.state

        return (
            <div id="manageVersion">
                <div className="tableHeader">
                    <div className="versionName">{intl.formatMessage({ id: 'Name' })}</div>
                    <div className="versionNum">{intl.formatMessage({ id: 'Index of versions' })}</div>
                </div>
                {
                    applicationPackageVersions.map(item => {
                        return (
                            <div className="tableRow" key={item.id}>
                                <div className="versionName">{item.name}</div>
                                <div className="versionNum">{item.packageVersion}</div>
                                <Switch
                                    className='m-t-sm'
                                    checked={this.isChecked(item.id)}
                                    onChange={(val) => this.handleSelectVersion(val, item.id)}
                                />
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default ManagePackageVersion
