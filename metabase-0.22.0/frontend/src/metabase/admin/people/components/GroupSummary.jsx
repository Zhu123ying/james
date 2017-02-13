import React, { Component, PropTypes } from "react";

import _ from "underscore";

import { inflect } from "metabase/lib/formatting";
import { isAdminGroup, isDefaultGroup } from "metabase/lib/groups";

const GroupSummary = ({ groups, selectedGroups }) => {
    let adminGroup = _.find(groups, isAdminGroup);
    let otherGroups = groups.filter(g => selectedGroups[g.id] && !isAdminGroup(g) && !isDefaultGroup(g));
    if (selectedGroups[adminGroup.id]) {
        return (
            <span>
                <span className="text-purple">Administrators组</span>
                { otherGroups.length > 0 && " + " }
                { otherGroups.length > 0 && <span className="text-brand">{" 其他 " + otherGroups.length + "组"}</span> }
            </span>
        );
    } else if (otherGroups.length === 1) {
        return <span className="text-brand">{otherGroups[0].name}</span>;
    } else if (otherGroups.length > 1) {
        return <span className="text-brand">{otherGroups.length + " " + "组"}</span>;
    } else {
        return <span>默认</span>;
    }
}

export default GroupSummary;
