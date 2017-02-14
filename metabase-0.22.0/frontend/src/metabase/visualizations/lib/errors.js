
import { inflect } from "metabase/lib/formatting";

export class MinColumnsError {
    constructor(minColumns, actualColumns) {
        //this.message = `OUCH! The data from your query doesn't fit the chosen display choice. This visualization requires at least ${actualColumns} ${inflect("column", actualColumns)} of data.`;
        this.message = `当前数据格式不匹配所选的可视化样式`;

    }
}

export class MinRowsError {
    constructor(minRows, actualRows) {
        //this.message = `No dice. We have ${actualRows} data ${inflect("点", actualRows)} to show and that's not enough for this visualization.`;
        this.message = `当前数据格式不匹配所选的可视化样式`;

        this.minRows = minRows;
        this.actualRows = actualRows;
    }
}

export class LatitudeLongitudeError {
    constructor(minRows, actualRows) {
        this.message = "当前数据格式不匹配所选的可视化样式";
    }
}

export class ChartSettingsError {
    constructor(message, section, buttonText) {
        this.message = message || "您可以自定义配置当前图标";
        this.section = section;
        this.buttonText = buttonText || "编辑";
    }
}
