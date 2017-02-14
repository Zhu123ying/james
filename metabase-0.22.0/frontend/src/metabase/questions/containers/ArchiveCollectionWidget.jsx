import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

import ModalWithTrigger from "metabase/components/ModalWithTrigger";
import Button from "metabase/components/Button";
import Icon from "metabase/components/Icon";
import Tooltip from "metabase/components/Tooltip";

import { setCollectionArchived } from "../collections";

const mapStateToProps = (state, props) => ({
})

const mapDispatchToProps = {
    setCollectionArchived
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ArchiveCollectionWidget extends Component {
    _onArchive = async () => {
        try {
            await this.props.setCollectionArchived(this.props.collectionId, true);
            this._onClose();
            if (this.props.onArchived) {
                this.props.onArchived();
            }
        } catch (error) {
            console.error(error)
            this.setState({ error })
        }
    }

    _onClose = () => {
        if (this.refs.modal) {
            this.refs.modal.close();
        }
    }

    render() {
        return (
            <ModalWithTrigger
                {...this.props}
                ref="modal"
                triggerElement={
                    <Tooltip tooltip="归档">
                        <Icon name="archive" />
                    </Tooltip>
                }
                title="确认归档此分类？"
                footer={[
                    <Button onClick={this._onClose}>取消</Button>,
                    <Button warning onClick={this._onArchive}>确认</Button>
                ]}
            >
                <div className="px4 pb4">当前分类中的查询也会被归档。</div>
            </ModalWithTrigger>
        );
    }
}
