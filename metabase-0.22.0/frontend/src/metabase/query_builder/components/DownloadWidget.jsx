import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";

import PopoverWithTrigger from "metabase/components/PopoverWithTrigger.jsx";
import Icon from "metabase/components/Icon.jsx";
import DownloadButton from "metabase/components/DownloadButton.jsx";

import FieldSet from "metabase/components/FieldSet.jsx";

import _ from "underscore";

const DownloadWidget = ({ className, card, datasetQuery, isLarge }) =>
    <PopoverWithTrigger
        triggerElement={<Icon className={className} title="Download this data" name='download' size={16} />}
    >
        <div className="p2" style={{ maxWidth: 300 }}>
            <h4>下载</h4>
            {isLarge &&
                <FieldSet className="my2 text-gold border-gold" legend="友情提醒">
                    <div className="my1">您要下载的查询结果包含较多数据，这个过程会花费一定的时间</div>
                    <div>一次最多可以下载1,000,000行的查询结果</div>
                </FieldSet>
            }
            <div className="flex flex-row mt2">
                {["csv", "json"].map(type =>
                    <DownloadButton
                        className="mr1 text-uppercase text-default"
                        url={card.id != null ?
                            `/api/card/${card.id}/query/${type}`:
                            `/api/dataset/${type}`
                        }
                        params={card.id != null ?
                            { parameters: JSON.stringify(datasetQuery.parameters) } :
                            // exclude `constraints` to ensure we download all rows (up to hard-coded 1M):
                            { query: JSON.stringify(_.omit(datasetQuery, "constraints")) }
                        }
                        extensions={[type]}
                    >
                        {type}
                    </DownloadButton>
                )}
            </div>
        </div>
    </PopoverWithTrigger>

DownloadWidget.propTypes = {
    className: PropTypes.string,
    card: PropTypes.object.isRequired,
    datasetQuery: PropTypes.object.isRequired,
    isLarge: PropTypes.bool
};

export default DownloadWidget;
