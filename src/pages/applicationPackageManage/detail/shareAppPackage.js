/* eslint-disable */
import BaseComponent from 'Page/base/BaseComponent'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import { RcForm, Loading, Row, Col, Icon, Notification, Switch } from 'ultraui'
import './index.less'

const { FormGroup, Form, Input, Button, RadioGroup, Textarea, FormRow, Panel, Select } = RcForm

const _ = window._

class ShareAppPackage extends BaseComponent {
    static propTypes = {
        intl: PropTypes.object.isRequired,
        baseFetch: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props)
        this.state = {
            applicationPackageVersionIds: [], // check状态的radio的id集合
            projectId: '',
        }
    }

    componentDidMount() {
        this.getProjectList()
        this.getApplicationPackageInfoForShare()
    }

    // 获取项目列表
    getProjectList = () => {
        this.props.baseFetch('enterprise', 'listProject', 'post', { pageNumber: 1, pageSize: 10000 }, {})
    }

    getApplicationPackageInfoForShare = () => {
        // 获取应用包的版本列表信息
        const { id, baseFetch } = this.props
        baseFetch('appCenter', 'appPackage.getApplicationPackageInfoForShare', 'post', { id }, {})
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

    handleChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        })
    }

    render() {
        const { form, intl, listProject, modelVersions, currentPorjectId } = this.props
        const projectList = _.get(listProject, 'data.data', [])
        const versionList = _.get(modelVersions, 'data.data.applicationPackageVersionList', [])
        const { applicationPackageVersionIds, projectId } = this.state

        return (
            <Form
                id='shareVersionForm'
                form={form}
            >
                <Select
                    form={form}
                    name="projectId"
                    value={projectId}
                    placeholder={intl.formatMessage({ id: 'SelectProjectPlaceHolder' })}
                    dropdownMenuStyle={{ maxHeight: '180px' }}
                    onChange={this.handleChange.bind(this, 'projectId')}
                    label={intl.formatMessage({ id: 'ProjectBelongTo' })}
                    isRequired
                    options={
                        projectList.map(item => {
                            return {
                                value: item.id,
                                text: item.name,
                                disabled: item.id === currentPorjectId
                            }
                        })
                    }
                    optionFilterProp='children'
                    optionLabelProp='children'
                />
                <Panel
                    form={form}
                    name="applicationPackageVersionIds"
                    label={intl.formatMessage({ id: 'OR_ApplicationVersion' })}
                >
                    <div className="tableHeader">
                        <div className="versionName">{intl.formatMessage({ id: 'Name' })}</div>
                        <div className="versionNum">{intl.formatMessage({ id: 'Index of versions' })}</div>
                    </div>
                    {
                        versionList.map(item => {
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
                </Panel>
            </Form>
        )
    }
}

const mapStateToProps = state => ({
    listProject: state.baseModel.enterprise.listProject.post,
    modelVersions: state.baseModel.appCenter.appPackage.getApplicationPackageInfoForShare.post,
})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(RcForm.create()(ShareAppPackage)))
