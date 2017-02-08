import React, { Component, PropTypes } from "react";

import LineAreaBarChart from "./components/LineAreaBarChart.jsx";

export default class BarChart extends LineAreaBarChart {
    static displayName = "柱状(面积)图";
    static identifier = "bar";
    static iconName = "bar";
    static noun = "bar chart";
}
