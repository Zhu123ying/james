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
            errors.name = "Name is required";
        }
        if (!values.description) {
            errors.description = "Description is required";
        }
        if (values.id != null) {
            if (!values.revision_message) {
                errors.revision_message = "Revision message is required";
            }
        }
        let aggregations = values.definition && Query.getAggregations(values.definition);
        if (!aggregations || aggregations.length === 0) {
            errors.definition = "Aggregation is required";
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
                <Link to={"/admin/datamodel/database/" + tableMetadata.db_id + "/table/" + tableMetadata.id} className="Button Button--borderless mx1">Cancel</Link>
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
                            title={(metric && metric.id != null ? "Edit" : "Create") + " Your Metric"}
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
                                description="Give your metric a name to help others find it."
                            >
                                <FormInput
                                    field={name}
                                    placeholder="Something descriptive but not too long"
                                />
                            </FormLabel>
                            <FormLabel
                                title="Describe Your Metric"
                                description="Give your metric a description to help others understand what it's about."
                            >
                                <FormTextArea
                                    field={description}
                                    placeholder="This is a good place to be more specific about less obvious metric rules"
                                />
                            </FormLabel>
                            { id.value != null &&
                                <FieldSet legend="Reason For Changes">
                                    <FormLabel description="Leave a note to explain what changes you made and why they were required.">
                                        <FormTextArea
                                            field={revision_message}
                                            placeholder="This will show up in the revision history for this metric to help everyone remember why things changed"
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
