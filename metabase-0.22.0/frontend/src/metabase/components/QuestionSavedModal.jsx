import React, { Component, PropTypes } from "react";

import ModalContent from "metabase/components/ModalContent.jsx";


export default class QuestionSavedModal extends Component {
    static propTypes = {
        addToDashboardFn: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired
    };

    render() {
        return (
            <ModalContent
                id="QuestionSavedModal"
                title="已保存! 要添加到数据面板吗?"
                onClose={this.props.onClose}
                className="Modal-content Modal-content--small NewForm"
            >
                <div className="Form-inputs mb4">
                    <button className="Button Button--primary" onClick={this.props.addToDashboardFn}>立即加入!</button>
                    <button className="Button ml3" onClick={this.props.onClose}>稍后加入</button>
                </div>
            </ModalContent>
        );
    }
}
