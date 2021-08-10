/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Loading, Notification, KeyValue, Dialog, TagItem, InputNumber } from 'ultraui'
import { Collapse, Button, ButtonGroup } from 'huayunui'
import Regex from '~/utils/regex'
import './index.less'
import HuayunRequest from '~/http/request'
import { application } from '~/http/api'

const { FormGroup, Form, Input, RadioGroup, Textarea, FormRow, Select, Panel } = RcForm
const notification = Notification.newInstance()
const _ = window._
class EditApplication extends React.Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        intl: PropTypes.object.isRequired
    }
    constructor(props) {
        super(props)
        const { detail: { name, description, tags } } = props
        this.state = {
            // 表单提交的元素
            name,
            description,
            tags,
            tagInput: ''
        }
    }
    handleChange = (key, val, item) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        })
    }
    handleAddTag = () => {
        const { tagInput, tags } = this.state
        this.setState({
            tags: [...tags, tagInput],
            tagInput: ''
        })
    }
    handleDeleteTag = (index) => {
        const { tags } = this.state
        tags.splice(index, 1)
        this.setState({
            tags
        })
    }
    render() {
        const { form, intl } = this.props
        const { name, description, tags, tagInput } = this.state
        return (
            <Form
                ref={(node) => { this.form = node }}
                form={form}
                style={{ paddingRight: '0' }}
                className="m-b-lg create_step"
                subMessage
            >
                <Input
                    form={form}
                    name='name'
                    value={name}
                    onChange={this.handleChange.bind(this, 'name')}
                    label={intl.formatMessage({ id: 'AppName' })}
                    validRegex={Regex.isName}
                    invalidMessage={intl.formatMessage({ id: 'NameErrorMsg' })}
                    isRequired
                />
                <Textarea
                    form={form}
                    value={description}
                    name='description'
                    onChange={this.handleChange.bind(this, 'description')}
                    label={intl.formatMessage({ id: 'AppDescription' })}
                    minLength={0}
                    maxLength={200}
                />
                <Panel
                    form={form}
                    value={tags}
                    name="tags"
                    label={intl.formatMessage({ id: 'Tag' })}
                    inline
                    className='labelPanel'
                >
                    <div className='labelLine'>
                        <Input
                            form={form}
                            name='tagInput'
                            value={tagInput}
                            onChange={(val) => this.handleChange('tagInput', val)}
                            label=''
                        />
                        <Button
                            disabled={!tagInput}
                            size='small'
                            type="primary"
                            icon="icon-add"
                            onClick={this.handleAddTag} />
                    </div>
                    <div className='labelList'>
                        {
                            tags.map((item, index) => {
                                return (
                                    <TagItem
                                        size='medium'
                                        key={item}
                                        name={item}
                                        icon="error"
                                        onClick={() => this.handleDeleteTag(index)}
                                    />
                                )
                            })
                        }
                    </div>
                </Panel>
            </Form>
        )
    }
}

export default RcForm.create()(EditApplication)
