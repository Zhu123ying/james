import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

import FormLabel from "../components/FormLabel.jsx";
import FormInput from "../components/FormInput.jsx";
import FormTextArea from "../components/FormTextArea.jsx";
import FieldSet from "metabase/components/FieldSet.jsx";
import PartialQueryBuilder from "../components/PartialQueryBuilder.jsx";
import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper.jsx";

import { formatValue } from "metabase/lib/formatting";

import { segmentFormSelectors } from "../selectors";
import { reduxForm } from "redux-form";

import cx from "classnames";

@reduxForm({
    form: "segment",
    fields: ["id", "name", "description", "table_id", "definition", "revision_message"],
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
        if (!values.definition || !values.definition.filter || values.definition.filter.length < 1) {
            errors.definition = "At least one filter is required";
        }
        return errors;
    },
    initialValues: { name: "", description: "", table_id: null, definition: { filter: [] }, revision_message: null }
},
segmentFormSelectors)
export default class SegmentForm extends Component {
    updatePreviewSummary(query) {
        this.props.updatePreviewSummary({
            ...query,
            query: {
                ...query.query,
                aggregation: ["count"]
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
        const { fields: { id, name, description, definition, revision_message }, segment, tableMetadata, handleSubmit, previewSummary } = this.props;

        return (
            <LoadingAndErrorWrapper loading={!tableMetadata}>
            { () =>
                <form className="full" onSubmit={handleSubmit}>
                    <div className="wrapper py4">
                        <FormLabel
                            title={(segment && segment.id != null ? "编辑" : "新增") + " 您的数据段"}
                            description={segment && segment.id != null ?
                                "对你的部分进行修改并留下说明性的注释。" :
                                "为"+ tableMetadata.display_name +"选择并添加筛选器以创建 " 
                            }
                        >
                            <PartialQueryBuilder
                                features={{
                                    filter: true
                                }}
                                tableMetadata={{
                                    ...tableMetadata,
                                    segments: null
                                }}
                                previewSummary={previewSummary == null ? "" : formatValue(previewSummary) + " rows"}
                                updatePreviewSummary={this.updatePreviewSummary.bind(this)}
                                {...definition}
                            />
                        </FormLabel>
                        <div style={{ maxWidth: "575px" }}>
                            <FormLabel
                                title="数据段名称"
                                description="请为您的数据段录入一个名称"
                            >
                                <FormInput
                                    field={name}
                                    placeholder="请输入名称"
                                />
                            </FormLabel>
                            <FormLabel
                                title="数据段描述"
                                description="请为您的数据段录入一些描述"
                            >
                                <FormTextArea
                                    field={description}
                                    placeholder="请输入描述"
                                />
                            </FormLabel>
                            { id.value != null &&
                                <FieldSet legend="修改原因">
                                    <FormLabel description="您可以填写对数据段做出调整的原因">
                                        <FormTextArea
                                            field={revision_message}
                                            placeholder="请输入修改原因"
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
