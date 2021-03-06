/* eslint "react/prop-types": "warn" */

import React, { PropTypes } from "react";

import Icon from "metabase/components/Icon";
import Tooltip from "metabase/components/Tooltip";

const ArchivedItem = ({ name, type, icon, color = '#DEEAF1', isAdmin = false, onUnarchive }) =>
    <div className="flex align-center p2 hover-parent hover--visibility border-bottom bg-grey-0-hover">
        <Icon
            name={icon}
            className="mr2"
            style={{ color: color }}
            size={20}
        />
        { name }
        { isAdmin &&
            <Tooltip tooltip={`还原当前 ${type === "card" ? "查询" : type}`}>
                <Icon
                    onClick={onUnarchive}
                    className="ml-auto cursor-pointer text-brand-hover hover-child"
                    name="unarchive"
                />
            </Tooltip>
        }
    </div>

ArchivedItem.propTypes = {
    name:        PropTypes.string.isRequired,
    type:        PropTypes.string.isRequired,
    icon:        PropTypes.string.isRequired,
    color:       PropTypes.string,
    isAdmin:     PropTypes.bool,
    onUnarchive: PropTypes.func.isRequired
}

export default ArchivedItem;
