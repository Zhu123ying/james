/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Loading, Notification, Button, KeyValue, Dialog, TagItem, InputNumber, Icon, Input as UltrauiInput } from 'ultraui'
import { Collapse, Button as HuayunButton, Switch } from 'huayunui'
import Regex from '~/utils/regex'
import '../index.less'
import Card from '~/components/Card'
import { affinityConfigInitData } from '../constant'

const { FormGroup, Form, Input, RadioGroup, Textarea, FormRow, Select, Panel } = RcForm
const _ = window._
const operatorList = ['In', 'NotIn', 'Exists', 'DoesNotExist', 'Gt', 'Lt']
const preferTitle = 'preferredDuringSchedulingIgnoredDuringExecution'
const requireTitle = 'requiredDuringSchedulingIgnoredDuringExecution'
// 添加匹配字段、匹配表达式插入的数据结构（因为是对象，需要解构后再插入）
const matchLineItem = {
    key: '',
    operator: '',
    values: []
}
// 节点prefer对象
const nodePreferItem = {
    weight: '',
    matchFields: [{ ...matchLineItem }],
    matchExpressions: [{ ...matchLineItem }]
}
// 节点require的matchTerm对象
const nodeRequireMatchTermItem = {
    matchFields: [{ ...matchLineItem }],
    matchExpressions: [{ ...matchLineItem }]
}
// 节点require对象
const nodeRequire = {
    matchTerms: [{ ...nodeRequireMatchTermItem }]
}
// 节点对象
const nodeItem = {
    prefers: [nodePreferItem],
    require: { ...nodeRequire }
}
// 标签对象
const matchLabelItem = {
    labelKey: '',
    labelValue: []
}
// 容器的prefree对象
const containerGroupPreferItem = {
    weight: '',
    namespaces: [],
    topologyKey: '',
    matchLabels: [{ ...matchLabelItem }],
    matchExpressions: [{ ...matchLineItem }]
}
// 容器的require对象
const containerGroupRequireItem = {
    namespaces: [],
    topologyKey: '',
    matchLabels: [{ ...matchLabelItem }],
    matchExpressions: [{ ...matchLineItem }]
}
// 容器亲和对象
const platformContainerAffinityItem = {
    prefers: [{ ...containerGroupPreferItem }],
    requires: [{ ...containerGroupRequireItem }]
}
class AffinityConfig extends React.Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        intl: PropTypes.object.isRequired
    }
    constructor(props) {
        super(props)
        this.state = {}
    }
    componentDidMount() {
        // 添加初始值
        this.props.handleFormChange('affinity', { ...affinityConfigInitData })
    }
    // 节点亲和、容器亲和、容器反亲和的总开关
    handleSwitchOnChange = (key, value) => {
        let { formData: { affinity }, handleFormChange } = this.props
        if (value) {
            // 打开开关需要给写默认值
            switch (key) {
                case 'nodeAffinity':
                    affinity.nodeAffinity = { ...nodeItem }
                    break
                case 'platformContainerAffinity':
                    affinity.platformContainerAffinity = { ...platformContainerAffinityItem }
                    break
                case 'platformContainerAntiAffinity':
                    affinity.platformContainerAntiAffinity = { ...platformContainerAffinityItem }
                    break
            }
        } else {
            affinity[key] = null
        }
        handleFormChange('affinity', { ...affinity })
    }
    // 匹配字段、匹配表达式、标签的开关处理(value是switch的值，initValue是打开开关的初始值，加上初始值用户体验好点)
    handlePanelSwitchOnChange = (key, value, initValue) => {
        let { formData: { affinity }, handleFormChange } = this.props
        if (value) {
            _.set(affinity, key, [initValue])
        } else {
            _.set(affinity, key, null)
        }
        handleFormChange('affinity', { ...affinity })
    }
    handleOnChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        let { formData: { affinity }, handleFormChange } = this.props
        _.set(affinity, key, value)
        handleFormChange('affinity', { ...affinity })
    }
    // 通用型删除，只要知道key和index
    handleRemoveFormItem = (key, index) => {
        let { formData: { affinity }, handleFormChange } = this.props
        let keyData = _.get(affinity, key) // 基本是数组，极少数情况是对象(删除node的require)
        if (Array.isArray(keyData)) {
            // 如果是数组，则删除1个元素
            keyData.splice(index, 1)
        } else {
            // 如果是对象，则置为null
            _.set(affinity, key, null)
        }
        handleFormChange('affinity', { ...affinity })
    }
    // 通用型添加，只要知道key和item
    handleAddFormItem = (key, item) => {
        let { formData: { affinity }, handleFormChange } = this.props
        let array = _.get(affinity, key, [])
        array.push(item)
        handleFormChange('affinity', { ...affinity })
    }
    // 匹配标签行
    renderLabelLine = (path, index) => {
        // key为这一行的指针索引
        const { intl, form, formData: { affinity } } = this.props
        const { labelKey, labelValue } = _.get(affinity, `${path}.${index}`, {})
        return (
            <div className='expressionLine'>
                <Input
                    form={form}
                    value={labelKey}
                    name={`${path}${index}Key`}
                    placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: 'Key' })}
                    onChange={(val) => this.handleOnChange(`${path}.${index}.labelKey`, val)}
                    label='Key'
                    isRequired
                    className='w50 pr5'
                />
                <Input
                    form={form}
                    value={labelValue}
                    name={`${path}${index}Value`}
                    placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: 'Value' })}
                    onChange={(val) => this.handleOnChange(`${path}.${index}.labelValue`, val)}
                    label='Value'
                    isRequired
                    className='w50 pl5'
                />
                <Button
                    type='text'
                    onClick={() => this.handleRemoveFormItem(path, index)}>
                    <Icon type="minus-o" />
                </Button>
            </div>
        )
    }
    // 匹配字段和匹配表达式的行
    renderExpressionLine = (path, index) => {
        // key为这一行的指针索引
        const { intl, form, formData: { affinity } } = this.props
        const { key, operator, values } = _.get(affinity, `${path}.${index}`, {})
        return (
            <div className={`expressionLine lineNum${index}`}>
                <Input
                    form={form}
                    value={key}
                    name={`${path}${index}Key`}
                    placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: 'Key' })}
                    onChange={(val) => this.handleOnChange(`${path}.${index}.key`, val)}
                    label='Key'
                    isRequired
                    className='portInput'
                />
                <Panel
                    form={form}
                    value={values}
                    name={`${path}${index}Panel`}
                    label='操作符/Value'
                    isRequired
                    className='selectInput'>
                    <Select
                        form={form}
                        name={`${path}${index}Operator`}
                        value={operator}
                        onChange={(val) => this.handleOnChange(`${path}.${index}.operator`, val)}
                        label='操作符'
                        isRequired
                        options={
                            operatorList.map(item => {
                                return { text: item, value: item }
                            })
                        }
                        optionFilterProp='children'
                        optionLabelProp='children'
                        className='selectItem'
                    />
                    <Input
                        form={form}
                        value={values.join(',')}
                        name={`${path}${index}Value`}
                        placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: 'Value' })}
                        onChange={(val) => this.handleOnChange(`${path}.${index}.values`, val.target.value.split(','))}
                        label='Value'
                        isRequired
                        className='inputItem'
                    />
                </Panel>
                <Button
                    type='text'
                    onClick={() => this.handleRemoveFormItem(path, index)}>
                    <Icon type="minus-o" />
                </Button>
            </div>
        )
    }
    // 渲染节点亲和
    renderNodeAffinity = () => {
        const { intl, form, formData: { affinity } } = this.props
        const { prefers, require } = _.get(affinity, 'nodeAffinity', {}) || {}
        return (
            <div className='nodeAffinity'>
                <div className='lineItem'>
                    <div className='lineTitle'>节点亲和</div>
                    <Switch defaultChecked onChange={(val) => this.handleSwitchOnChange(`nodeAffinity`, val)}></Switch>
                </div>
                {
                    prefers ? (
                        <React.Fragment>
                            <Collapse defaultActiveKey={[0]}>
                                {
                                    prefers.map((item, index) => this.renderNodeAffinityPrefers(index))
                                }
                            </Collapse>
                            <HuayunButton
                                type="operate"
                                icon={<Icon type="add" />}
                                onClick={() => this.handleAddFormItem(`nodeAffinity.prefers`, { ...nodePreferItem })}
                                name={`添加${preferTitle}`}
                                className='addBoxItemBtn'
                            />
                        </React.Fragment>
                    ) : null
                }
                {
                    require ? this.renderNodeAffinityRequire() : (
                        <HuayunButton
                            type="operate"
                            icon={<Icon type="add" />}
                            onClick={() => this.handleOnChange(`nodeAffinity.require`, { ...nodeRequire })}
                            name={`添加${requireTitle}`}
                            className='addBoxItemBtn'
                        />
                    )
                }
            </div>
        )
    }
    // 渲染节点亲和的prefers
    // 对于确定了是亲和节点的prefers，那参数只需要知道该Collapse.Panel的index
    renderNodeAffinityPrefers = (index) => {
        const { intl, form, formData: { affinity } } = this.props
        const { weight, matchFields, matchExpressions } = _.get(affinity, `nodeAffinity.prefers.${index}`, {})
        return (
            <Collapse.Panel header={this.renderPanelHeader(preferTitle, 'nodeAffinity.prefers', index)} key={index}>
                <Input
                    form={form}
                    value={weight}
                    name={`nodeAffinityPrefers${index}Weight`}
                    placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: '权重' })}
                    onChange={(val) => this.handleOnChange(`nodeAffinity.prefers.${index}.weight`, val)}
                    label='权重'
                    type='number'
                    isRequired
                />
                <Panel
                    form={form}
                    value={matchFields}
                    name={`nodeAffinityPrefers${index}MatchFields`}
                    label='匹配字段'
                    inline
                    className='commonPanel'
                >
                    <Switch defaultChecked onChange={(val) => this.handlePanelSwitchOnChange(`nodeAffinity.prefers.${index}.matchFields`, val, { ...matchLineItem })}></Switch>
                    {
                        matchFields ? (
                            <React.Fragment>
                                {
                                    matchFields.map((item_, index_) => {
                                        return this.renderExpressionLine(`nodeAffinity.prefers.${index}.matchFields`, index_)
                                    })
                                }
                                <HuayunButton
                                    type="operate"
                                    icon={<Icon type="add" />}
                                    onClick={() => this.handleAddFormItem(`nodeAffinity.prefers.${index}.matchFields`, { ...matchLineItem })}
                                    name="添加匹配字段"
                                    className='addBoxItemBtn'
                                />
                            </React.Fragment>
                        ) : null
                    }
                </Panel>
                <Panel
                    form={form}
                    value={matchExpressions}
                    name={`nodeAffinityPrefers${index}MatchExpressions`}
                    label='匹配表达式'
                    inline
                    className='commonPanel'
                >
                    <Switch defaultChecked onChange={(val) => this.handlePanelSwitchOnChange(`nodeAffinity.prefers.${index}.matchExpressions`, val, { ...matchLineItem })}></Switch>
                    {
                        matchExpressions ? (
                            <React.Fragment>
                                {
                                    matchExpressions.map((item_, index_) => {
                                        return this.renderExpressionLine(`nodeAffinity.prefers.${index}.matchExpressions`, index_)
                                    })
                                }
                                <HuayunButton
                                    type="operate"
                                    icon={<Icon type="add" />}
                                    onClick={() => this.handleAddFormItem(`nodeAffinity.prefers.${index}.matchExpressions`, { ...matchLineItem })}
                                    name="添加匹配表达式"
                                    className='addBoxItemBtn'
                                />
                            </React.Fragment>
                        ) : null
                    }
                </Panel>
            </Collapse.Panel >
        )
    }
    // 渲染节点亲和require
    renderNodeAffinityRequire = () => {
        const { intl, form, formData: { affinity } } = this.props
        const { matchTerms } = _.get(affinity, `nodeAffinity.require`, [])
        return (
            <Collapse defaultActiveKey={[0]}>
                <Collapse.Panel header={this.renderPanelHeader(requireTitle, 'nodeAffinity.require')}>
                    {
                        matchTerms.map((item, index) => {
                            const { matchFields, matchExpressions } = item
                            return (
                                <Panel
                                    form={form}
                                    value={item}
                                    name={`nodeAffinityRequireMatchTerms${index}`}
                                    label={`匹配项${index + 1}`}
                                    inline
                                    className='commonPanel'
                                    key={index}
                                >
                                    <Card handleDelete={() => this.handleRemoveFormItem(`nodeAffinity.require.matchTerms`, index)}>
                                        <div className='matchFields w100'>
                                            <div className='lineItem'>
                                                <div className='lineTitle'>匹配字段</div>
                                                <Switch defaultChecked onChange={(val) => this.handlePanelSwitchOnChange(`nodeAffinity.require.matchTerms.${index}.matchFields`, val, { ...matchLineItem })}></Switch>
                                            </div>
                                            {
                                                matchFields ? (
                                                    <React.Fragment>
                                                        {
                                                            matchFields.map((item_, index_) => {
                                                                return this.renderExpressionLine(`nodeAffinity.require.matchTerms.${index}.matchFields`, index_)
                                                            })
                                                        }
                                                        <HuayunButton
                                                            type="operate"
                                                            icon={<Icon type="add" />}
                                                            onClick={() => this.handleAddFormItem(`nodeAffinity.require.matchTerms.${index}.matchFields`, { ...matchLineItem })}
                                                            name="添加匹配字段"
                                                            className='addBoxItemBtn'
                                                        />
                                                    </React.Fragment>
                                                ) : null
                                            }
                                        </div>
                                        <div className='matchExpressionsBox w100'>
                                            <div className='lineItem'>
                                                <div className='lineTitle'>匹配表达式</div>
                                                <Switch defaultChecked onChange={(val) => this.handlePanelSwitchOnChange(`nodeAffinity.require.matchTerms.${index}.matchExpressions`, val, { ...matchLineItem })}></Switch>
                                            </div>
                                            {
                                                matchExpressions ? (
                                                    <React.Fragment>
                                                        {
                                                            matchExpressions.map((item_, index_) => {
                                                                return this.renderExpressionLine(`nodeAffinity.require.matchTerms.${index}.matchExpressions`, index_)
                                                            })
                                                        }
                                                        <HuayunButton
                                                            type="operate"
                                                            icon={<Icon type="add" />}
                                                            onClick={() => this.handleAddFormItem(`nodeAffinity.require.matchTerms.${index}.matchExpressions`, { ...matchLineItem })}
                                                            name="添加匹配表达式"
                                                            className='addBoxItemBtn'
                                                        />
                                                    </React.Fragment>
                                                ) : null
                                            }
                                        </div>
                                    </Card>
                                </Panel>
                            )
                        })
                    }
                    <HuayunButton
                        type="operate"
                        icon={<Icon type="add" />}
                        onClick={() => this.handleAddFormItem(`nodeAffinity.require.matchTerms`, _.cloneDeep(nodeRequireMatchTermItem))}
                        name="添加匹配项"
                        className='addBoxItemBtn addMatchTermBtn'
                    />
                </Collapse.Panel >
            </Collapse>
        )
    }
    // 渲染容器组亲和、容器组反亲和(因为两者一样的，所以提取出来，传Key区分)
    renderContainerGroupAffinity = (key) => {
        const { intl, form, formData: { affinity } } = this.props
        const { prefers, requires } = _.get(affinity, key, {}) || {}
        return (
            <div className='nodeAffinity'>
                <div className='lineItem'>
                    <div className='lineTitle'>{key === 'platformContainerAffinity' ? '容器组亲和' : '容器组反亲和'}</div>
                    <Switch defaultChecked onChange={(val) => this.handleSwitchOnChange(key, val)}></Switch>
                </div>
                {
                    prefers ? (
                        <React.Fragment>
                            <Collapse defaultActiveKey={[0]}>
                                {
                                    prefers.map((item, index) => this.renderContainerGroupPreferrs(key, index))
                                }
                            </Collapse>
                            <HuayunButton
                                type="operate"
                                icon={<Icon type="add" />}
                                onClick={() => this.handleAddFormItem(`${key}.prefers`, { ...containerGroupPreferItem })}
                                name={`添加${preferTitle}`}
                                className='addBoxItemBtn'
                            />
                        </React.Fragment>
                    ) : null
                }
                {
                    requires ? (
                        <React.Fragment>
                            <Collapse defaultActiveKey={[0]}>
                                {
                                    requires.map((item, index) => this.renderContainerGroupRequire(key, index))
                                }
                            </Collapse>
                            <HuayunButton
                                type="operate"
                                icon={<Icon type="add" />}
                                onClick={() => this.handleAddFormItem(`${key}.requires`, { ...containerGroupRequireItem })}
                                name={`添加${requireTitle}`}
                                className='addBoxItemBtn'
                            />
                        </React.Fragment>
                    ) : null
                }
            </div>
        )
    }
    // 渲染容器组亲和preferr
    renderContainerGroupPreferrs = (key, index) => {
        const { intl, form, formData: { affinity } } = this.props
        const { weight, namespaces, topologyKey, matchLabels, matchExpressions } = _.get(affinity, `${key}.prefers.${index}`, {})
        return (
            <Collapse.Panel header={this.renderPanelHeader(preferTitle, `${key}.prefers`, index)} key={index}>
                <Panel
                    form={form}
                    name={`${key}Prefers${index}BasicInfo`}
                    label='基本配置'
                    inline
                    isRequired
                    className='basicInfor'
                >
                    <Input
                        form={form}
                        value={weight}
                        name={`${key}Prefers${index}Weight`}
                        placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: '权重' })}
                        onChange={(val) => this.handleOnChange(`${key}.prefers.${index}.weight`, val)}
                        label='权重'
                        type='number'
                        isRequired
                        className='w50'
                    />
                    <Input
                        form={form}
                        value={topologyKey}
                        name={`${key}Prefers${index}TopologyKey`}
                        placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: '拓扑域' })}
                        onChange={(val) => this.handleOnChange(`${key}.prefers.${index}.topologyKey`, val)}
                        label='拓扑域'
                        isRequired
                        className='w50'
                    />
                    <Input
                        form={form}
                        value={namespaces.join(',')}
                        name={`${key}Prefers${index}NameSpaces`}
                        placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: 'NameSpaces' })}
                        onChange={(val) => this.handleOnChange(`${key}.prefers.${index}.namespaces`, val.target.value.split(','))}
                        label='NameSpaces'
                        isRequired
                        className='w100'
                    />
                </Panel>
                <Panel
                    form={form}
                    value={matchLabels}
                    name={`${key}Prefers${index}MatchLabels`}
                    label='匹配标签'
                    inline
                    className='commonPanel'
                >
                    <Switch defaultChecked onChange={(val) => this.handlePanelSwitchOnChange(`${key}.prefers.${index}.matchLabels`, val, { ...matchLabelItem })}></Switch>
                    {
                        matchLabels ? (
                            <React.Fragment>
                                {
                                    matchLabels.map((item_, index_) => {
                                        return this.renderLabelLine(`${key}.prefers.${index}.matchLabels`, index_)
                                    })
                                }
                                <HuayunButton
                                    type="operate"
                                    icon={<Icon type="add" />}
                                    onClick={() => this.handleAddFormItem(`${key}.prefers.${index}.matchLabels`, { ...matchLabelItem })}
                                    name="添加匹配标签"
                                    className='addBoxItemBtn'
                                />
                            </React.Fragment>
                        ) : null
                    }
                </Panel>
                <Panel
                    form={form}
                    value={matchExpressions}
                    name={`${key}Prefers${index}MatchExpressions`}
                    label='匹配表达式'
                    inline
                    className='commonPanel'
                >
                    <Switch defaultChecked onChange={(val) => this.handlePanelSwitchOnChange(`${key}.prefers.${index}.matchExpressions`, val, { ...matchLineItem })}></Switch>
                    {
                        matchExpressions ? (
                            <React.Fragment>
                                {
                                    matchExpressions.map((item_, index_) => {
                                        return this.renderExpressionLine(`${key}.prefers.${index}.matchExpressions`, index_)
                                    })
                                }
                                <HuayunButton
                                    type="operate"
                                    icon={<Icon type="add" />}
                                    onClick={() => this.handleAddFormItem(`${key}.prefers.${index}.matchExpressions`, { ...matchLineItem })}
                                    name="添加匹配表达式"
                                    className='addBoxItemBtn'
                                />
                            </React.Fragment>
                        ) : null
                    }
                </Panel>
            </Collapse.Panel >
        )
    }
    // 渲染容器组亲和require
    renderContainerGroupRequire = (key, index) => {
        const { intl, form, formData: { affinity } } = this.props
        const { namespaces, topologyKey, matchLabels, matchExpressions } = _.get(affinity, `${key}.requires.${index}`, {})
        return (
            <Collapse.Panel header={this.renderPanelHeader(preferTitle, `${key}.requires`, index)} key={index}>
                <Panel
                    form={form}
                    name={`${key}Requires${index}BasicInfo`}
                    label='基本配置'
                    inline
                    isRequired
                    className='basicInfor'
                >
                    <Input
                        form={form}
                        value={topologyKey}
                        name={`${key}Requires${index}TopologyKey`}
                        placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: '拓扑域' })}
                        onChange={(val) => this.handleOnChange(`${key}.requires.${index}.topologyKey`, val)}
                        label='拓扑域'
                        isRequired
                        className='w50'
                    />
                    <Input
                        form={form}
                        value={namespaces.join(',')}
                        name={`${key}Requires${index}NameSpaces`}
                        placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: 'NameSpaces' })}
                        onChange={(val) => this.handleOnChange(`${key}.requires.${index}.namespaces`, val.target.value.split(','))}
                        label='NameSpaces'
                        isRequired
                        className='w50'
                    />
                </Panel>
                <Panel
                    form={form}
                    value={matchLabels}
                    name={`${key}Requires${index}MatchLabels`}
                    label='匹配标签'
                    inline
                    className='commonPanel'
                >
                    <Switch defaultChecked onChange={(val) => this.handlePanelSwitchOnChange(`${key}.requires.${index}.matchLabels`, val, { ...matchLabelItem })}></Switch>
                    {
                        matchLabels ? (
                            <React.Fragment>
                                {
                                    matchLabels.map((item_, index_) => {
                                        return this.renderLabelLine(`${key}.requires.${index}.matchLabels`, index_)
                                    })
                                }
                                <HuayunButton
                                    type="operate"
                                    icon={<Icon type="add" />}
                                    onClick={() => this.handleAddFormItem(`${key}.requires.${index}.matchLabels`, { ...matchLabelItem })}
                                    name="添加匹配标签"
                                    className='addBoxItemBtn'
                                />
                            </React.Fragment>
                        ) : null
                    }
                </Panel>
                <Panel
                    form={form}
                    value={matchExpressions}
                    name={`${key}Requires${index}MatchExpressions`}
                    label='匹配表达式'
                    inline
                    className='commonPanel'
                >
                    <Switch defaultChecked onChange={(val) => this.handlePanelSwitchOnChange(`${key}.requires.${index}.matchExpressions`, val, { ...matchLineItem })}></Switch>
                    {
                        matchExpressions ? (
                            <React.Fragment>
                                {
                                    matchExpressions.map((item_, index_) => {
                                        return this.renderExpressionLine(`${key}.requires.${index}.matchExpressions`, index_)
                                    })
                                }
                                <HuayunButton
                                    type="operate"
                                    icon={<Icon type="add" />}
                                    onClick={() => this.handleAddFormItem(`${key}.requires.${index}.matchExpressions`, { ...matchLineItem })}
                                    name="添加匹配表达式"
                                    className='addBoxItemBtn'
                                />
                            </React.Fragment>
                        ) : null
                    }
                </Panel>
            </Collapse.Panel >
        )
    }
    renderPanelHeader = (title, key, index = -1) => {
        const { intl } = this.props
        return (
            <div className='panelHeader'>
                <div className='panelTitle'>{title}</div>
                <Button type='text' onClick={() => this.handleRemoveFormItem(key, index)}>
                    <Icon type="empty" />&nbsp;{intl.formatMessage({ id: 'Delete' })}
                </Button>
            </div>
        )
    }
    render() {
        const { form, intl, formData: { affinity }, handleFormChange } = this.props
        return (
            <div className='Affinity'>
                {this.renderNodeAffinity()}
                {this.renderContainerGroupAffinity('platformContainerAffinity')}
                {this.renderContainerGroupAffinity('platformContainerAntiAffinity')}
            </div>
        )
    }
}

export default AffinityConfig
