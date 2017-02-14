import React, { Component, PropTypes } from 'react';
import cx from "classnames";
import _ from 'underscore';

import ExpressionEditorTextfield from "./ExpressionEditorTextfield.jsx";
import { isExpression } from "metabase/lib/expressions";


export default class ExpressionWidget extends Component {

    static propTypes = {
        expression: PropTypes.array,
        name: PropTypes.string,
        tableMetadata: PropTypes.object.isRequired,
        onSetExpression: PropTypes.func.isRequired,
        onRemoveExpression: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired
    };

    static defaultProps = {
        expression: null,
        name: ""
    }

    componentWillMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            name: newProps.name,
            expression: newProps.expression
        });
    }

    isValid() {
        const { name, expression, error } = this.state;
        return (!_.isEmpty(name) && !error && isExpression(expression));
    }

    render() {
        const { expression } = this.state;

        return (
            <div style={{maxWidth: "600px"}}>
                <div className="p2">
                    <div className="h5 text-uppercase text-grey-3 text-bold">公式</div>
                    <div>
                        <ExpressionEditorTextfield
                            expression={expression}
                            tableMetadata={this.props.tableMetadata}
                            onChange={(parsedExpression) => this.setState({expression: parsedExpression, error: null})}
                            onError={(errorMessage) => this.setState({error: errorMessage})}
                        />
                        <p className="h5 text-grey-2">
                            您可以像在Excel的单元格中一样，使用"=SUM(x)+1000"这样的格式，来处理数据。
                            
                        </p>
                    </div>

                    <div className="mt3 h5 text-uppercase text-grey-3 text-bold">名称</div>
                    <div>
                        <input
                            className="my1 input block full"
                            type="text"
                            value={this.state.name}
                            placeholder="请输入公式名称"
                            onChange={(event) => this.setState({name: event.target.value})}
                        />
                    </div>
                </div>

                <div className="mt2 p2 border-top flex flex-row align-center justify-between">
                    <div>
                        <button
                            className={cx("Button", {"Button--primary": this.isValid()})}
                            onClick={() => this.props.onSetExpression(this.state.name, this.state.expression)}
                            disabled={!this.isValid()}>{this.props.expression ? "更新" : "保存"}</button>
                        <span className="pl1">&nbsp;</span> <a className="link" onClick={() => this.props.onCancel()}>取消</a>
                    </div>
                    <div>
                        {this.props.expression ?
                         <a className="pr2 text-warning link" onClick={() => this.props.onRemoveExpression(this.props.name)}>删除</a>
                         : null }
                    </div>
                </div>
            </div>
        );
    }
}
