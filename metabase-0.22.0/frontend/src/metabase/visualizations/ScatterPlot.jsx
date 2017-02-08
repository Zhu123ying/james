import React, { Component, PropTypes } from "react";

import LineAreaBarChart from "./components/LineAreaBarChart.jsx";

export default class ScatterPlot extends LineAreaBarChart {
    static displayName = "散点图";
    static identifier = "scatter";
    static iconName = "bubble";
    static noun = "scatter plot";
}
