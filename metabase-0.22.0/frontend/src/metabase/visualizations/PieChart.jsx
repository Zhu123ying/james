import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import styles from "./PieChart.css";

import ChartTooltip from "./components/ChartTooltip.jsx";
import ChartWithLegend from "./components/ChartWithLegend.jsx";

import { ChartSettingsError } from "metabase/visualizations/lib/errors";
import { getFriendlyName } from "metabase/visualizations/lib/utils";

import { formatValue } from "metabase/lib/formatting";

import * as colors from "metabase/lib/colors";

import cx from "classnames";

import d3 from "d3";
import _ from "underscore";

const OUTER_RADIUS = 50; // within 100px canvas
const INNER_RADIUS_RATIO = 3 / 5;

const PAD_ANGLE = (Math.PI / 180) * 1; // 1 degree in radians
const SLICE_THRESHOLD = 1 / 360; // 1 degree in percentage
const OTHER_SLICE_MIN_PERCENTAGE = 0.003;

const PERCENT_REGEX = /percent/i;

export default class PieChart extends Component {
    static displayName = "饼图";
    static identifier = "pie";
    static iconName = "pie";

    static minSize = { width: 4, height: 4 };

    static isSensible(cols, rows) {
        return cols.length === 2;
    }

    static checkRenderable(cols, rows, settings) {
        if (!settings["pie.dimension"] || !settings["pie.metric"]) {
            throw new ChartSettingsError("您希望使用那一列的数据?", "Data");
        }
    }

    componentDidUpdate() {
        let groupElement = ReactDOM.findDOMNode(this.refs.group);
        let detailElement = ReactDOM.findDOMNode(this.refs.detail);
        if (groupElement.getBoundingClientRect().width < 100) {
            detailElement.classList.add("hide");
        } else {
            detailElement.classList.remove("hide");
        }
    }

    render() {
        const { series, hovered, onHoverChange, className, gridSize, settings } = this.props;

        const [{ data: { cols, rows }}] = series;
        const dimensionIndex = _.findIndex(cols, (col) => col.name === settings["pie.dimension"]);
        const metricIndex = _.findIndex(cols, (col) => col.name === settings["pie.metric"]);

        const formatDimension = (dimension, jsx = true) => formatValue(dimension, { column: cols[dimensionIndex], jsx, majorWidth: 0 })
        const formatMetric    =    (metric, jsx = true) => formatValue(metric, { column: cols[metricIndex], jsx, majorWidth: 0 })
        const formatPercent   =               (percent) => (100 * percent).toFixed(2) + "%"

        const showPercentInTooltip = !PERCENT_REGEX.test(cols[metricIndex].name) && !PERCENT_REGEX.test(cols[metricIndex].display_name);

        let total = rows.reduce((sum, row) => sum + row[metricIndex], 0);

        // use standard colors for up to 5 values otherwise use color harmony to help differentiate slices
        let sliceColors = Object.values(rows.length > 5 ? colors.harmony : colors.normal);
        let sliceThreshold = typeof settings["pie.slice_threshold"] === "number" ? settings["pie.slice_threshold"] / 100 : SLICE_THRESHOLD;

        let [slices, others] = _.chain(rows)
            .map((row, index) => ({
                key: row[dimensionIndex],
                value: row[metricIndex],
                percentage: row[metricIndex] / total,
                color: sliceColors[index % sliceColors.length]
            }))
            .partition((d) => d.percentage > sliceThreshold)
            .value();

        let otherTotal = others.reduce((acc, o) => acc + o.value, 0);
        let otherSlice;
        if (otherTotal > 0) {
            otherSlice = {
                key: "Other",
                value: otherTotal,
                percentage: otherTotal / total,
                color: "gray"
            };
            slices.push(otherSlice);
        }

        // increase "other" slice so it's barely visible
        if (otherSlice && otherSlice.percentage < OTHER_SLICE_MIN_PERCENTAGE) {
            otherSlice.value = total * OTHER_SLICE_MIN_PERCENTAGE;
        }

        let legendTitles = slices.map(slice => [
            slice.key === "Other" ? slice.key : formatDimension(slice.key, true),
            settings["pie.show_legend_perecent"] ? formatPercent(slice.percentage) : undefined
        ]);
        let legendColors = slices.map(slice => slice.color);

        const pie = d3.layout.pie()
            .sort(null)
            .padAngle(PAD_ANGLE)
            .value(d => d.value);
        const arc = d3.svg.arc()
            .outerRadius(OUTER_RADIUS)
            .innerRadius(OUTER_RADIUS * INNER_RADIUS_RATIO);

        let hoverForIndex = (index, event) => ({
            index,
            event: event && event.nativeEvent,
            data: slices[index] === otherSlice ?
                others.map(o => ({
                    key: formatDimension(o.key, false),
                    value: formatMetric(o.value, false)
                }))
            : [
                { key: getFriendlyName(cols[dimensionIndex]), value: formatDimension(slices[index].key) },
                { key: getFriendlyName(cols[metricIndex]), value: formatMetric(slices[index].value) },
            ].concat(showPercentInTooltip ? [{ key: "Percentage", value: formatPercent(slices[index].percentage) }] : [])
        });

        let value, title;
        if (hovered && hovered.index != null && slices[hovered.index] !== otherSlice) {
            title = slices[hovered.index].key;
            value = slices[hovered.index].value;
        } else {
            title = "Total";
            value = formatMetric(total);
        }

        return (
            <ChartWithLegend
                className={className}
                legendTitles={legendTitles} legendColors={legendColors}
                gridSize={gridSize}
                hovered={hovered} onHoverChange={(d) => onHoverChange && onHoverChange(d && { ...d, ...hoverForIndex(d.index) })}
                showLegend={settings["pie.show_legend"]}
            >
                <div className={styles.ChartAndDetail}>
                    <div ref="detail" className={styles.Detail}>
                        <div className={cx(styles.Value, "fullscreen-normal-text fullscreen-night-text")}>{value}</div>
                        <div className={styles.Title}>{title}</div>
                    </div>
                    <div className={styles.Chart}>
                        <svg className={styles.Donut+ " m1"} viewBox="0 0 100 100">
                            <g ref="group" transform={`translate(50,50)`}>
                                {pie(slices).map((slice, index) =>
                                    <path
                                        key={index}
                                        d={arc(slice)}
                                        fill={slices[index].color}
                                        opacity={(hovered && hovered.index != null && hovered.index !== index) ? 0.3 : 1}
                                        onMouseMove={(e) => onHoverChange && onHoverChange(hoverForIndex(index, e))}
                                        onMouseLeave={() => onHoverChange && onHoverChange(null)}
                                    />
                                )}
                            </g>
                        </svg>
                    </div>
                </div>
                <ChartTooltip series={series} hovered={hovered} />
            </ChartWithLegend>
        );
    }
}
