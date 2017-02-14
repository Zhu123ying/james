/* eslint "react/prop-types": "warn" */
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";

import Icon from 'metabase/components/Icon.jsx';

export default class NewsletterForm extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = { submitted: false };

        this.styles = {
            container: {
                borderWidth: "2px"
            },

            input: {
                fontSize: '1.1rem',
                color: '#676C72',
                width: "350px"
            },

            label: {
                top: "-12px"
            }
        }
    }

    static propTypes = {
        initialEmail: PropTypes.string.isRequired
    };

    subscribeUser(e) {
        e.preventDefault();

        var formData = new FormData();
        formData.append("EMAIL", ReactDOM.findDOMNode(this.refs.email).value);
        formData.append("b_869fec0e4689e8fd1db91e795_b9664113a8", "");

        let req = new XMLHttpRequest();
        req.open("POST", "https://metabase.us10.list-manage.com/subscribe/post?u=869fec0e4689e8fd1db91e795&id=b9664113a8");
        req.send(formData);

        this.setState({submitted: true});
    }

    render() {
        const { initialEmail } = this.props;
        const { submitted } = this.state;

        return (
            " "
        );
    }
}
