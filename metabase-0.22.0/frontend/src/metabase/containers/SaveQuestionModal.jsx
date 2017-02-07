import React, { Component, PropTypes } from "react";

import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import FormField from "metabase/components/FormField.jsx";
import ModalContent from "metabase/components/ModalContent.jsx";
import Radio from "metabase/components/Radio.jsx";
import Select, { Option } from "metabase/components/Select.jsx";
import Button from "metabase/components/Button";
import CollectionList from "metabase/questions/containers/CollectionList";

import Query from "metabase/lib/query";
import { cancelable } from "metabase/lib/promise";

import "./SaveQuestionModal.css";

export default class SaveQuestionModal extends Component {

    constructor(props, context) {
        super(props, context);

        const isStructured = Query.isStructured(props.card.dataset_query);

        this.state = {
            error: null,
            valid: false,
            details: {
                name: props.card.name || isStructured ? Query.generateQueryDescription(props.tableMetadata, props.card.dataset_query.query) : "",
                description: props.card.description || null,
                collection_id: props.card.collection_id || null,
                saveType: props.originalCard ? "overwrite" : "create"
            }
        };
    }

    static propTypes = {
        card: PropTypes.object.isRequired,
        originalCard: PropTypes.object,
        tableMetadata: PropTypes.object, // can't be required, sometimes null
        createFn: PropTypes.func.isRequired,
        saveFn: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired
    }

    componentDidMount() {
        this.validateForm();
    }

    componentDidUpdate() {
        this.validateForm();
    }

    componentWillUnmount() {
        if (this.requestPromise) {
            this.requestPromise.cancel();
        }
    }

    validateForm() {
        let { details } = this.state;

        let valid = true;

        // name is required for create
        if (details.saveType === "create" && !details.name) {
            valid = false;
        }

        if (this.state.valid !== valid) {
            this.setState({ valid });
        }
    }

    onChange(fieldName, fieldValue) {
        this.setState({ details: { ...this.state.details, [fieldName]: fieldValue ? fieldValue : null }});
    }

    formSubmitted = async (e) => {
        try {
            if (e) {
                e.preventDefault();
            }

            let { details } = this.state;
            let { card, originalCard, addToDashboard, createFn, saveFn } = this.props;

            card = {
                ...card,
                name: details.saveType === "overwrite" ?
                    originalCard.name :
                    details.name.trim(),
                // since description is optional, it can be null, so check for a description before trimming it
                description: details.saveType === "overwrite" ?
                    originalCard.description :
                    details.description ? details.description.trim() : null,
                collection_id: details.collection_id
            };

            if (details.saveType === "create") {
                this.requestPromise = cancelable(createFn(card, addToDashboard));
            } else if (details.saveType === "overwrite") {
                card.id = this.props.originalCard.id;
                this.requestPromise = cancelable(saveFn(card, addToDashboard));
            }

            await this.requestPromise;
            this.props.onClose();
        } catch (error) {
            if (error && !error.isCanceled) {
                this.setState({ error: error });
            }
        }
    }

    render() {
        let { error, details } = this.state;
        var formError;
        if (error) {
            var errorMessage;
            if (error.status === 500) {
                errorMessage = "服务器错误";
            }

            if (error.data && error.data.message) {
                errorMessage = error.data.message;
            }
            if (error.data && error.data.errors) {
                errorMessage = Object.values(error.data.errors);
            }

            // TODO: timeout display?
            if (errorMessage) {
                formError = (
                    <span className="text-error px2">{errorMessage}</span>
                );
            }
        }

        var saveOrUpdate = null;
        if (!this.props.card.id && this.props.originalCard) {
            saveOrUpdate = (
                <FormField
                    displayName="替换或保存为新查询？"
                    fieldName="saveType"
                    errors={this.state.errors}
                >
                    <Radio
                        value={this.state.details.saveType}
                        onChange={(value) => this.onChange("saveType", value)}
                        options={[
                            { name: `替换原来的查询： "${this.props.originalCard.name}"`, value: "overwrite" },
                            { name: "保存为一个新查询", value: "保存" },
                        ]}
                        isVertical
                    />
                </FormField>
            );
        }

        let title = this.props.addToDashboard ? "第一步, 保存你的查询" : "保存";

        return (
            <ModalContent
                id="SaveQuestionModal"
                title={title}
                footer={[
                        formError,
                        <Button onClick={this.props.onClose}>
                            取消
                        </Button>,
                        <Button primary={this.state.valid} disabled={!this.state.valid} onClick={this.formSubmitted}>
                            保存
                        </Button>
                ]}
                onClose={this.props.onClose}
            >
                <form className="Form-inputs" onSubmit={this.formSubmitted}>
                    {saveOrUpdate}
                    <ReactCSSTransitionGroup
                        transitionName="saveQuestionModalFields"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={500}
                    >
                        { details.saveType === "create" &&
                            <div key="saveQuestionModalFields" className="saveQuestionModalFields">
                                <FormField
                                    displayName="Name"
                                    fieldName="name"
                                    errors={this.state.errors}
                                >
                                    <input
                                        className="Form-input full"
                                        name="名称" 
                                        placeholder="请输入名称"
                                        value={this.state.details.name}
                                        onChange={(e) => this.onChange("name", e.target.value)}
                                        autoFocus
                                    />
                                </FormField>
                                <FormField
                                    displayName="Description"
                                    fieldName="description"
                                    errors={this.state.errors}
                                >
                                    <textarea
                                        className="Form-input full"
                                        name="备注"
                                        placeholder="请填写备注"
                                        value={this.state.details.description}
                                        onChange={(e) => this.onChange("description", e.target.value)}
                                    />
                                </FormField>
                                <CollectionList writable>
                                { (collections) => collections.length > 0 &&
                                    <FormField
                                        displayName="Which collection should this go in?"
                                        fieldName="collection_id"
                                        errors={this.state.errors}
                                    >
                                        <Select
                                            className="block"
                                            value={this.state.details.collection_id}
                                            onChange={e => this.onChange("collection_id", e.target.value)}
                                        >
                                            {[{ name: "None", id: null }]
                                            .concat(collections)
                                            .map((collection, index) =>
                                                <Option
                                                    key={index}
                                                    value={collection.id}
                                                    icon={collection.id != null && "collection"}
                                                    iconColor={collection.color}
                                                    iconSize={18}
                                                >
                                                    {collection.name}
                                                </Option>
                                            )}
                                        </Select>
                                    </FormField>
                                }
                                </CollectionList>
                            </div>
                        }
                    </ReactCSSTransitionGroup>
                </form>
            </ModalContent>
        );
    }
}
