import React, { Component, PropTypes } from "react";

import MetabaseAnalytics from "metabase/lib/analytics";
import ModalContent from "metabase/components/ModalContent.jsx";
import Toggle from 'metabase/components/Toggle.jsx';


export default class RemoveFromDashboardModal extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = { deleteCard: false };
    }

    static propTypes = {
        dashcard: PropTypes.object.isRequired,
        dashboard: PropTypes.object.isRequired,
        removeCardFromDashboard: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired
    };

    onRemove() {
        this.props.removeCardFromDashboard({
            dashId: this.props.dashboard.id,
            dashcardId: this.props.dashcard.id
        });
        if (this.state.deleteCard) {
            // this.props.dispatch(deleteCard(this.props.dashcard.card_id))
            // this.props.dispatch(markCardForDeletion(this.props.dashcard.card_id))
        }
        this.props.onClose();

        MetabaseAnalytics.trackEvent("Dashboard", "Remove Card");
    }

    render() {
        var removeWarning;
        if (this.state.deleteCard) {
            removeWarning = (
                <div>
                    <p>此查询将从当前数据面板移除:</p>
                    <ul>
                        <li></li>
                    </ul>
                </div>
            )
        }

        var deleteCardOption;
        if (this.props.enableDeleteCardOption) {
            deleteCardOption = (
                <div className="flex pt1">
                    <Toggle className="text-warning mr2 mt1" value={this.state.deleteCard} onChange={() => this.setState({ deleteCard: !this.state.deleteCard })}/>
                    <div>
                        <p>依然选择删除此查询</p>
                        {removeWarning}
                    </div>
                </div>
            );
        }

        return (
            <ModalContent
                title="Remove from Dashboard"
                onClose={() => this.props.onClose()}
            >
                <div className="flex-full px4 pb3 text-grey-4">
                    <p>确认此操作？</p>
                    {deleteCardOption}
                </div>

                <div className="Form-actions">
                    <button className="Button Button--danger" onClick={() => this.onRemove()}>确认</button>
                    <button className="Button Button--primary ml1" onClick={this.props.onClose}>取消</button>
                </div>
            </ModalContent>
        );
    }
}
