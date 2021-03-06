/* eslint "react/prop-types": "warn" */
import React, { Component, PropTypes } from "react";

import { isQueryable } from "metabase/lib/table";

import inflection from "inflection";
import cx from "classnames";

const MainPane = ({ databases, show }) =>
    <div>
        <h1>查询指南</h1>
        <p>您可以通过此功能，了解您的数据结构。为了便于查询，我们也提供了一些常用查询选项。</p>
        <ul>
            {databases && databases.filter(db => db.tables && db.tables.length > 0).map(database =>
                <li key={database.id}>
                    <div className="my2">
                        <h2 className="inline-block">{database.name}</h2>
                        <span className="ml1">{database.tables.length + " " + inflection.inflect("table", database.tables.length)}</span>
                    </div>
                    <ul>
                        {database.tables.filter(isQueryable).map((table, index) =>
                            <li key={table.id} className={cx("p1", { "border-bottom": index !== database.tables.length - 1 })}>
                                <a className="text-brand text-brand-darken-hover no-decoration" onClick={() => show("table", table)}>{table.display_name}</a>
                            </li>
                        )}
                    </ul>
                </li>
            )}
        </ul>
    </div>

MainPane.propTypes = {
    show: PropTypes.func.isRequired,
    databases: PropTypes.array
};

export default MainPane;
