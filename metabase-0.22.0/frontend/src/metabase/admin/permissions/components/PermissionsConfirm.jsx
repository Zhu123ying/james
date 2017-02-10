import React, { Component, PropTypes } from "react";

import { inflect } from "metabase/lib/formatting";

import Tooltip from "metabase/components/Tooltip";

const GroupName = ({ group }) =>
    <span className="text-brand">{group.name}</span>

const DatabaseName = ({ database }) =>
    <span className="text-brand">{database.name}</span>

const TableAccessChange = ({ tables, verb, color }) => {
    const tableNames = Object.values(tables).map(t => t.name);
    return (
        <span>
            {verb}
            <Tooltip tooltip={<div className="p1">{tableNames.map(name => <div>{name}</div>)}</div>}>
                <span>
                    <span className={color}>{" " + tableNames.length + " " + inflect("table", tableNames.length)}</span>
                </span>
            </Tooltip>
        </span>
    )
}


const PermissionsConfirm = ({ diff }) =>
    <div>
        {Object.values(diff.groups).map(group =>
            Object.values(group.databases).map(database =>
                <div>
                    { (database.grantedTables || database.revokedTables) &&
                        <div>
                            <GroupName group={group} />
                            {" 将 "}
                            {database.grantedTables && <TableAccessChange verb="可以访问" color="text-success" tables={database.grantedTables} /> }
                            {database.grantedTables && database.revokedTables && " 同时 "}
                            {database.revokedTables && <TableAccessChange verb="禁止访问" color="text-warning" tables={database.revokedTables} /> }
                            {" - "}
                            <DatabaseName database={database} />
                            {"。"}
                        </div>
                    }
                    { database.native &&
                        <div>
                            <GroupName group={group} />
                            { database.native === "none" ?
                                " 不再可以 "
                            :
                                " 可以 "
                            }
                            { database.native === "read" ?
                                <span className="text-gold">读</span>
                            : database.native === "write" ?
                                <span className="text-success">写</span>
                            :
                                <span>读或写</span>
                            }
                            {" 本地查询 "}
                            <DatabaseName database={database} />
                            {"."}
                        </div>
                    }
                </div>
            )
        )}
    </div>

export default PermissionsConfirm;
