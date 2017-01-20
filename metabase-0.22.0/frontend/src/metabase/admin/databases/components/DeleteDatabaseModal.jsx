import React, { Component, PropTypes } from "react";

import ModalContent from "metabase/components/ModalContent.jsx";

import cx from "classnames";

export default class DeleteDatabaseModal extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            confirmValue: "",
            error: null
        };
    }

    static propTypes = {
        database: PropTypes.object.isRequired,
        onClose: PropTypes.func,
        onDelete: PropTypes.func
    };

    async deleteDatabase() {
        try {
            this.props.onDelete(this.props.database);
        } catch (error) {
            this.setState({ error });
        }
    }

    render() {
        const { database } = this.props;

        var formError;
        if (this.state.error) {
            var errorMessage = "Server error encountered";
            if (this.state.error.data &&
                this.state.error.data.message) {
                errorMessage = this.state.error.data.message;
            } else {
                errorMessage = this.state.error.message;
            }

            // TODO: timeout display?
            formError = (
                <span className="text-error px2">{errorMessage}</span>
            );
        }

        let confirmed = this.state.confirmValue.toUpperCase() === "DELETE";

        return (
            <ModalContent
                title="Delete Database"
                onClose={this.props.onClose}
            >
                <div className="Form-inputs mb4">
                    { database.is_sample &&
                        <p><strong>提示:</strong> 当删除测试数据后, 教学案例将无法使用。 当然您也可以恢复测试数据。</p>
                    }
                    <p>
                        确认删除此数据库? 所有基于此数据库的查询均会被删除。 <strong>这个操作无法撤销</strong>。 确认删除？
                    </p>
                    <input className="Form-input" type="text" onChange={(e) => this.setState({ confirmValue: e.target.value })} autoFocus />
                </div>

                <div className="Form-actions">
                    <button className={cx("Button Button--danger", { "disabled": !confirmed })} onClick={() => this.deleteDatabase()}>删除</button>
                    <button className="Button Button--primary ml1" onClick={this.props.onClose}>取消</button>
                    {formError}
                </div>
            </ModalContent>
        );
    }
}
