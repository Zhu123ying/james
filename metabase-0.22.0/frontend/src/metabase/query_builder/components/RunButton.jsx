import React, { Component, PropTypes } from "react";

import Icon from "metabase/components/Icon.jsx";

import cx from "classnames";

export default class RunButton extends Component {
    static propTypes = {
        canRun: PropTypes.bool.isRequired,
        isRunning: PropTypes.bool.isRequired,
        isDirty: PropTypes.bool.isRequired,
        runFn: PropTypes.func.isRequired,
        cancelFn: PropTypes.func
    };

    render() {
        let { canRun, isRunning, isDirty, runFn, cancelFn } = this.props;
        let buttonText = null;
        if (isRunning) {
            buttonText = <div className="flex align-center"><Icon className="mr1" name="close" />取消</div>;
        } else if (canRun && isDirty) {
            buttonText = "查询";
        } else if (canRun && !isDirty) {
            buttonText = <div className="flex align-center"><Icon className="mr1" name="refresh" />刷新</div>;
        }
        let actionFn = isRunning ? cancelFn : runFn;
        let classes = cx("Button Button--medium circular RunButton", {
            "RunButton--hidden": !buttonText,
            "Button--primary": isDirty,
            "text-grey-2": !isDirty,
            "text-grey-4-hover": !isDirty,
        });
        return (
            <button className={classes} onClick={actionFn}>
            {buttonText}
            </button>
        );
    }
}
