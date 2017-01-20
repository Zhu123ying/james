import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

import ModalContent from "metabase/components/ModalContent.jsx";

export default class CreatedDatabaseModal extends Component {
    static propTypes = {
        databaseId: PropTypes.number.isRequired,
        onClose: PropTypes.func.isRequired,
        onDone: PropTypes.func.isRequired
    };

    render() {
        const { onClose, onDone, databaseId } = this.props;
        return (
            <ModalContent
                title="数据库添加成功"
                onClose={onClose}
            >
                <div className="Form-inputs mb4">
                    <p>
                        我们正在分析当前数据库结构，并为您提供一些小建议。
                        <Link to={"/admin/datamodel/database/"+databaseId}>查看数据库</Link>
                        &nbsp;您可以在数据模型选项中查看我们找到的数据并进行编辑，当然，您也可以对于这部分数据
                        <Link to={"/q?db="+databaseId}>新增查询</Link>
                        about
                        this database.
                    </p>
                </div>

                <div className="Form-actions flex layout-centered">
                    <button className="Button Button--primary px3" onClick={onDone}>确认</button>
                </div>
            </ModalContent>
        );
    }
}
