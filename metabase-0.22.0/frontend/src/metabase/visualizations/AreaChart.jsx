import React, { Component, PropTypes } from "react";

import LineAreaBarChart from "./components/LineAreaBarChart.jsx";

export default class AreaChart extends LineAreaBarChart {
    static displayName = "面积图";
    static identifier = "area";
    static iconName = "area";
    static noun = "area chart";
}
