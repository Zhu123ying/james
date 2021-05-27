/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Loading, Notification, Button, KeyValue, Dialog, TagItem, InputNumber, Icon, Input as UltrauiInput } from 'ultraui'
import { Collapse, Button as HuayunButton, Switch } from 'huayunui'
import Regex from '~/utils/regex'
import '../index.less'
import Card from '~/components/Card'

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
const nodeRequireMatchTermItem = {
    matchFields: [{ ...matchLineItem }],
    matchExpressions: [{ ...matchLineItem }]
}
// 节点require对象
const nodeRequire = {
    matchTerms: [{...nodeRequireMatchTermItem}]
}
// 节点对象
const nodeItem = {
    prefers: [nodePreferItem],
    require: { ...nodeRequire }
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
    // 节点亲和、容器亲和、容器反亲和的总开关
    handleSwitchOnChange = (key, value) => {
        let { formData: { affinity }, handleFormChange } = this.props
        if (value) {
            // 打开开关需要给写默认值
            switch (key) {
                case 'nodeAffinity':
                    affinity.nodeAffinity = { ...nodeItem }
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
        const { intl, form, formData: { affinity: { nodeAffinity } } } = this.props
        const { prefers, require } = nodeAffinity || {}
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
                                className='addBoxItemBtn mb16'
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
                            className='addBoxItemBtn mb16'
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
                        onClick={() => this.handleAddFormItem(`nodeAffinity.require.matchTerms`, { ...nodeRequireMatchTermItem })}
                        name="添加匹配项"
                        className='addBoxItemBtn addMatchTermBtn'
                    />
                </Collapse.Panel >
            </Collapse>
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
            </div>
        )
    }
}

export default AffinityConfig
