/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Loading, Notification, Button, KeyValue, Dialog } from 'ultraui'
import { Collapse } from 'huayunui'
import Regex from '~/utils/regex'
import './index.less'

const { FormGroup, Form, Input, RadioGroup, Textarea, FormRow, Select, Panel } = RcForm
const _ = window._

class ContainerGroupConfig extends React.Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        intl: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props)
        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {
        const { form, intl } = this.props
        return (
            <React.Fragment>
                123
            </React.Fragment>
        )
    }
}


export default RcForm.create()(ContainerGroupConfig)
