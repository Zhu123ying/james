import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

export default class NotFound extends Component {
    render() {
        return (
            <div className="layout-centered flex full">
                <div className="p4 text-bold">
                    <h1 className="text-brand text-light mb3">抱歉...</h1>
                    <p className="h4 mb1">没要找到对应页面</p>
                    <p className="h4 my4">您也可以</p>
                    <div className="flex align-center">
                        <Link to="/q" className="Button Button--primary">
                            <div className="p1">再次新增一个查询！</div>
                        </Link>
        
                    </div>
                </div>
            </div>
        );
    }
}
