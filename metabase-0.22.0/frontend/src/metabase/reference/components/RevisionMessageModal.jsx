/* eslint "react/prop-types": "warn" */
import React, { Component, PropTypes } from "react";

import ModalWithTrigger from "metabase/components/ModalWithTrigger.jsx";
import ModalContent from "metabase/components/ModalContent.jsx";

import S from "./RevisionMessageModal.css";

export default class RevisionMessageModal extends Component {
    static propTypes = {
        action: PropTypes.func.isRequired,
        field: PropTypes.object.isRequired,
        submitting: PropTypes.bool,
        children: PropTypes.any,
    };

    render() {
        const { action, children, field, submitting } = this.props;

        const onClose = () => {
            this.refs.modal.close();
        }

        const onAction = () => {
            onClose();
            action();
        }

        return (
            <ModalWithTrigger ref="modal" triggerElement={children}>
                <ModalContent
                    title="修改原因"
                    onClose={onClose}
                >
                    <div className={S.modalBody}>
                        <textarea
                            className={S.modalTextArea}
                            placeholder="请输入修改原因，方便其他用户知道您这样做的原因"
                            {...field}
                        />
                    </div>

                    <div className="Form-actions">
                        <button type="button" className="Button Button--primary" onClick={onAction} disabled={submitting || field.error}>保存修改</button>
                        <button type="button" className="Button ml1" onClick={onClose}>取消</button>
                    </div>
                </ModalContent>
            </ModalWithTrigger>
        );
    }
}
