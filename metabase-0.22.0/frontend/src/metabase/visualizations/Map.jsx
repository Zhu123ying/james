import React, { Component, PropTypes } from "react";

import ChoroplethMap from "./components/ChoroplethMap.jsx";
import PinMap from "./PinMap.jsx";

import { ChartSettingsError } from "metabase/visualizations/lib/errors";

export default class Map extends Component {
    static displayName = "地图";
    static identifier = "map";
    static iconName = "pinmap";

    static aliases = ["state", "country", "pin_map"];

    static minSize = { width: 4, height: 4 };

    static isSensible(cols, rows) {
        return true;
    }

    static checkRenderable(cols, rows, settings) {
        if (settings["map.type"] === "pin") {
            if (!settings["map.longitude_column"] || !settings["map.latitude_column"]) {
                throw new ChartSettingsError("使用地图类型的展示方式前，请在图表设置中选择经度和纬度列。", "Data");
            }
        } else if (settings["map.type"] === "region"){
            if (!settings["map.dimension"] || !settings["map.metric"]) {
                throw new ChartSettingsError("使用地图类型的展示方式前，您需要先设置地图区域和要展示的数据段。", "Data");
            }
        }
    }

    render() {
        const { settings } = this.props;
        const type = settings["map.type"];
        if (type === "pin") {
            return <PinMap {...this.props} />
        } else if (type === "region") {
            return <ChoroplethMap {...this.props} />
        }
    }
}
