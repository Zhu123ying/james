import React, { Component } from "react";

import Button from "metabase/components/Button";
import ColorPicker from "metabase/components/ColorPicker";
import FormField from "metabase/components/FormField";
import Input from "metabase/components/Input";
import Modal from "metabase/components/Modal";

import { reduxForm } from "redux-form";

import { normal } from "metabase/lib/colors";

const COLLECTION_COLORS = [
    ...Object.values(normal),
    '#F1B556',
    '#A6E7F3',
    '#7172AD',
    '#7B8797',
];

@reduxForm({
    form: 'collection',
    fields: ['id', 'name', 'description', 'color'],
    validate: (values) => {
        const errors = {};
        if (!values.name) {
            errors.name = "Name is required";
        } else if (values.name.length > 100) {
            errors.name = "Name must be 100 characters or less";
        }
        if (!values.color) {
            errors.color = "Color is required";
        }
        return errors;
    },
    initialValues: {
        name: "",
        description: "",
        // pick a random color to start so everything isn't blue all the time
        color: COLLECTION_COLORS[Math.floor(Math.random() * COLLECTION_COLORS.length)]
    }
})
export default class CollectionEditorForm extends Component {
    render() {
        const { fields, handleSubmit, invalid, onClose } = this.props;
        return (
            <Modal
                inline
                form
                title={fields.id.value != null ? fields.name.value : "新增收藏夹"}
                footer={[
                    <Button className="mr1" onClick={onClose}>
                        取消
                    </Button>,
                    <Button primary disabled={invalid} onClick={handleSubmit}>
                        { fields.id.value != null ? "更新" : "创建" }
                    </Button>
                ]}
                onClose={onClose}
            >
                <div className="NewForm ml-auto mr-auto mt4 pt2" style={{ width: 540 }}>
                    <FormField
                        displayName="名称"
                        {...fields.name}
                    >
                        <Input
                            className="Form-input full"
                            placeholder="请输入收藏夹名称"
                            autoFocus
                            {...fields.name}
                        />
                    </FormField>
                    <FormField
                        displayName="描述"
                        {...fields.description}
                    >
                        <textarea
                            className="Form-input full"
                            placeholder="请输入描述"
                            {...fields.description}
                        />
                    </FormField>
                    <FormField
                        displayName="标记"
                        {...fields.color}
                    >
                        <ColorPicker
                            {...fields.color}
                            colors={COLLECTION_COLORS}
                        />
                    </FormField>
                </div>
            </Modal>
        )
    }
}
