import React, { Component, PropTypes } from "react";

import cx from "classnames";

const AddRow = ({ value, isValid, placeholder, onKeyDown, onChange, onDone, onCancel, children }) =>
    <div className="my2 pl1 p1 bordered border-brand rounded relative flex align-center">
        {children}
        <input
            className="input--borderless h3 ml1 flex-full"
            type="text"
            value={value}
            placeholder={placeholder}
            autoFocus
            onKeyDown={onKeyDown}
            onChange={onChange}
        />
        <span className="link no-decoration cursor-pointer" onClick={onCancel}>
            取消
        </span>
        <button className={cx("Button ml2", {"Button--primary": !!isValid})} disabled={!isValid} onClick={onDone}>
            新增
        </button>
    </div>

export default AddRow;
