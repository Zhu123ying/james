import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

import FormLabel from "../components/FormLabel.jsx";
import FormInput from "../components/FormInput.jsx";
import FormTextArea from "../components/FormTextArea.jsx";
import FieldSet from "metabase/components/FieldSet.jsx";
import PartialQueryBuilder from "../components/PartialQueryBuilder.jsx";
import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper.jsx";

import { formatValue } from "metabase/lib/formatting";

import { metricFormSelectors } from "../selectors";
import { reduxForm } from "redux-form";

import Query from "metabase/lib/query";

import cx from "classnames";

@reduxForm({
    form: "metric",
    fields: ["id", "name", "description", "table_id", "definition", "revision_message", "show_in_getting_started"],
    validate: (values) => {
        const errors = {};
        if (!values.name) {
            errors.name = "必须填写名称";
        }
        if (!values.description) {
            errors.description = "必须填写修改信息";
        }
        if (values.id != null) {
            if (!values.revision_message) {
                errors.revision_message = "必须填写修改信息";
            }
        }
        let aggregations = values.definition && Query.getAggregations(values.definition);
        if (!aggregations || aggregations.length === 0) {
            errors.definition = "必须选择集合";
        }
        return errors;
    }
},
metricFormSelectors)
export default class MetricForm extends Component {
    updatePreviewSummary(query) {
        this.props.updatePreviewSummary({
            ...query,
            query: {
                aggregation: ["count"],
                ...query.query,
            }
        })
    }

    renderActionButtons() {
        const { invalid, handleSubmit, tableMetadata } = this.props;
        return (
            <div>
                <button className={cx("Button", { "Button--primary": !invalid, "disabled": invalid })} onClick={handleSubmit}>保存</button>
                <Link to={"/admin/datamodel/database/" + tableMetadata.db_id + "/table/" + tableMetadata.id} className="Button Button--borderless mx1">取消</Link>
            </div>
        )
    }

    render() {
        const { fields: { id, name, description, definition, revision_message }, metric, tableMetadata, handleSubmit, previewSummary } = this.props;

        return (
            <LoadingAndErrorWrapper loading={!tableMetadata}>
            { () =>
                <form className="full" onSubmit={handleSubmit}>
                    <div className="wrapper py4">
                        <FormLabel
                            title={(metric && metric.id != null ? "编辑" : "新增") + " 查询条件"}
                            description={metric && metric.id != null ?
                                "修改查询条件并留下说明性的注释" :
                                "您可以创建自己的产讯条件，并保存到这张表中。包括聚合类型、聚合字段和任意添加的筛选器。例如，您可以创建一个针对订单表的《平均价格》专有计算方法。"
                            }
                        >
                        <PartialQueryBuilder
                            features={{
                                filter: true,
                                aggregation: true
                            }}
                            tableMetadata={{
                                ...tableMetadata,
                                aggregation_options: tableMetadata.aggregation_options.filter(a => a.short !== "rows"),
                                metrics: null
                            }}
                            previewSummary={previewSummary == null ? "" : "结果: " + formatValue(previewSummary)}
                            updatePreviewSummary={this.updatePreviewSummary.bind(this)}
                            {...definition}
                        />
                        </FormLabel>
                        <div style={{ maxWidth: "575px" }}>
                            <FormLabel
                                title="查询条件名称"
                                description="为您的查询条件命名"
                            >
                                <FormInput
                                    field={name}
                                    placeholder="请输入名称"
                                />
                            </FormLabel>
                            <FormLabel
                                title="查询条件描述"
                                description="为您的查询条件增加描述，方便其他用户调用"
                            >
                                <FormTextArea
                                    field={description}
                                    placeholder="请输入描述"
                                />
                            </FormLabel>
                            { id.value != null &&
                                <FieldSet legend="修改原因">
                                    <FormLabel description="描述修改内容及必要性">
                                        <FormTextArea
                                            field={revision_message}
                                            placeholder="修改原因将显示在历史记录中，方便团队成员及时了解变更情况"
                                        />
                                    </FormLabel>
                                    <div className="flex align-center">
                                        {this.renderActionButtons()}
                                    </div>
                                </FieldSet>
                            }
                        </div>
                    </div>

                    { id.value == null &&
                        <div className="border-top py4">
                            <div className="wrapper">
                                {this.renderActionButtons()}
                            </div>
                        </div>
                    }
                </form>
            }
            </LoadingAndErrorWrapper>
        );
    }
}
