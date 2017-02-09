/* eslint "react/prop-types": "warn" */
import React, { Component, PropTypes } from "react";

import { LeftNavPane, LeftNavPaneItem } from "metabase/components/LeftNavPane.jsx";

import AdminLayout from "metabase/components/AdminLayout.jsx";

export default class AdminPeopleApp extends Component {
    static propTypes = {
        children: PropTypes.any
    };

    render() {
        const { children } = this.props;
        return (
            <AdminLayout
                sidebar={
                    <LeftNavPane>
                        <LeftNavPaneItem name="用户" path="/admin/people" index />
                        <LeftNavPaneItem name="用户组" path="/admin/people/groups" />
                    </LeftNavPane>
                }
            >
                {children}
            </AdminLayout>
        );
    }
}
