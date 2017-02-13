import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";

import ActionButton from "metabase/components/ActionButton.jsx";
import ModalContent from "metabase/components/ModalContent.jsx";

import { capitalize } from "metabase/lib/formatting";
import cx from "classnames";

export default class ObjectRetireModal extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            valid: false
        };
    }

    async handleSubmit() {
        const { object, objectType } = this.props;
        let payload = {
            revision_message: ReactDOM.findDOMNode(this.refs.revision_message).value
        };
        payload[objectType+"Id"] = object.id;

        await this.props.onRetire(payload);
        this.props.onClose();
    }

    render() {
        const { objectType } = this.props;
        const { valid } = this.state;
        return (
            <ModalContent
                title={"撤销"}
                onClose={this.props.onClose}
            >
                <form className="flex flex-column flex-full">
                    <div className="Form-inputs pb4">
                        <p>基于它的查询依然可以使用，但您下次创建查询时，它将不在可用。</p>
                        <p>如果您确认撤销此, 请简要描述撤销原因:</p>
                        <textarea
                            ref="revision_message"
                            className="input full"
                            placeholder={"撤销原因将显示在修改记录中，并将发送邮件通知其他使用此服务的用户。 "}
                            onChange={(e) => this.setState({ valid: !!e.target.value })}
                        />
                    </div>

                    <div className="Form-actions">
                        <ActionButton
                            actionFn={this.handleSubmit.bind(this)}
                            className={cx("Button", { "Button--primary": valid, "disabled": !valid })}
                            normalText="撤销"
                            activeText="撤销中..."
                            failedText="F撤销失败"
                            successText="撤销成功"
                        />
                        <a className="Button Button--borderless" onClick={this.props.onClose}>
                            取消
                        </a>
                    </div>
                </form>
            </ModalContent>
        );
    }
}




