/* eslint-disable react/display-name */

import React, { Component, PropTypes } from "react";

import Tutorial, { qs, qsWithContent } from "./Tutorial.jsx";

import RetinaImage from "react-retina-image";

const QUERY_BUILDER_STEPS = [
    {
        getPortalTarget: () => qs(".GuiBuilder"),
        getModal: (props) =>
            <div className="text-centered">
                <RetinaImage className="mb2" forceOriginalDimensions={false} src="/app/img/qb_tutorial/question_builder.png" width={186} />
                <h3>欢迎使用可视化查询功能！</h3>
                <p>可视化查询功能可以让您轻松的通过按步骤提问的方式，从您的数据中获取答案。</p>
                <a className="Button Button--primary" onClick={props.onNext}>更多</a>
            </div>
    },
    {
        getPortalTarget: () => qs(".GuiBuilder-data"),
        getModalTarget: () => qs(".GuiBuilder-data"),
        getModal: (props) =>
            <div className="text-centered">
                <RetinaImage id="QB-TutorialTableImg" className="mb2" forceOriginalDimensions={false} src="/app/img/qb_tutorial/table.png" width={157} />
                <h3>第一步：选择您需要查询结果的表。</h3>
                <p>先选择"Orders"表</p>
            </div>,
        shouldAllowEvent: (e) => qs(".GuiBuilder-data a").contains(e.target)
    },
    {
        getPortalTarget: () => qs(".GuiBuilder-data"),
        getPageFlagTarget: () => qsWithContent(".List-section-header", "Sample Dataset"),
        shouldAllowEvent: (e) => qsWithContent(".List-section-header", "Sample Dataset").contains(e.target),
        optional: true
    },
    {
        getPortalTarget: () => qs(".GuiBuilder-data"),
        getPageFlagTarget: () => qsWithContent(".List-item", "Orders"),
        shouldAllowEvent: (e) => qsWithContent(".List-item > a", "Orders").contains(e.target)
    },
    {
        getPortalTarget: () => qs(".GuiBuilder-filtered-by"),
        getModalTarget: () => qs(".GuiBuilder-filtered-by"),
        getModal: (props) =>
            <div className="text-centered">
                <RetinaImage
                    className="mb2"
                    forceOriginalDimensions={false}
                    id="QB-TutorialFunnelImg"
                    src="/app/img/qb_tutorial/funnel.png"
                    width={135}
                />
                <h3>第二步：过滤表单直至留下关键数据</h3>
                <p>点击"+"按钮并选择过滤条件</p>
            </div>,
        shouldAllowEvent: (e) => qs(".GuiBuilder-filtered-by a").contains(e.target)
    },
    {
        getPortalTarget: () => qs(".GuiBuilder-filtered-by"),
        getPageFlagTarget: () => qsWithContent(".List-item", "Created At"),
        shouldAllowEvent: (e) => qsWithContent(".List-item > a", "Created At").contains(e.target)
    },
    {
        getPortalTarget: () => qs(".GuiBuilder-filtered-by"),
        getPageFlagText: () => "在这儿，我们可以选择通过天数来筛选，试一试 10",
        getPageFlagTarget: () => qs('[data-ui-tag="relative-date-input"]'),
        shouldAllowEvent: (e) => qs('[data-ui-tag="relative-date-input"]').contains(e.target)
    },
    {
        getPortalTarget: () => qs(".GuiBuilder-filtered-by"),
        getPageFlagTarget: () => qs('[data-ui-tag="add-filter"]'),
        shouldAllowEvent: (e) => qs('[data-ui-tag="add-filter"]').contains(e.target)
    },
    {
        getPortalTarget: () => qs(".Query-section-aggregation"),
        getModalTarget: () => qs(".Query-section-aggregation"),
        getModal: (props) =>
            <div className="text-centered">
                <RetinaImage
                    className="mb2"
                    forceOriginalDimensions={false}
                    id="QB-TutorialCalculatorImg"
                    src="/app/img/qb_tutorial/calculator.png"
                    width={115}
                />
                <h3>第三步：您可以选择累加或平均数据，计数表中的行数，或只查看原始数据。 </h3>
                <p>尝试点击 <strong>Raw Data</strong> ，将它改为 <strong>Count of rows</strong> ，这样我们就能统计这张表里一共有多少订单了。</p>
            </div>,
        shouldAllowEvent: (e) => qs('.View-section-aggregation').contains(e.target)
    },
    {
        getPortalTarget: () => qs(".Query-section-aggregation"),
        getPageFlagTarget: () => qsWithContent(".List-item", "Count of rows"),
        shouldAllowEvent: (e) => qsWithContent(".List-item > a", "Count of rows").contains(e.target)
    },
    {
        getPortalTarget: () => qs(".Query-section-breakout"),
        getModalTarget: () => qs(".Query-section-breakout"),
        getModal: (props) =>
            <div className="text-centered">
                <RetinaImage
                    className="mb2"
                    forceOriginalDimensions={false}
                    id="QB-TutorialBananaImg"
                    src="/app/img/qb_tutorial/banana.png"
                    width={232}
                />
                <h3>第四步：更改group by参数，可以选择 “mouth”、“day”或“category” </h3>
                <p>尝试点击 <strong>Add a grouping</strong>, 并选择 <strong>Created At: by Week</strong>.</p>
            </div>,
        shouldAllowEvent: (e) => qs('.Query-section-breakout').contains(e.target)
    },
    {
        getPortalTarget: () => qs(".Query-section-breakout"),
        getPageFlagTarget: () => qs(".FieldList-grouping-trigger"),
        getPageFlagText: () => "Click on \"by day\" to change it to \"Week.\"",
        shouldAllowEvent: (e) => qs(".FieldList-grouping-trigger").contains(e.target)
    },
    {
        getPortalTarget: () => qs(".Query-section-breakout"),
        getPageFlagTarget: () => qsWithContent(".List-item", "Week"),
        shouldAllowEvent: (e) => qsWithContent(".List-item > a", "Week").contains(e.target)
    },
    {
        getPortalTarget: () => qs(".RunButton"),
        getModalTarget: () => qs(".RunButton"),
        getModal: (props) =>
            <div className="text-centered">
                <RetinaImage
                    className="mb2"
                    forceOriginalDimensions={false}
                    id="QB-TutorialRocketImg"
                    src="/app/img/qb_tutorial/rocket.png"
                    width={217}
                />
                <h3>第五步：开始查询</h3>
                <p>干得好! 点击 <strong>查询</strong> 获取查询结果!</p>
            </div>,
        shouldAllowEvent: (e) => qs(".RunButton").contains(e.target)
    },
    {
        getPortalTarget: () => qs(".VisualizationSettings"),
        getModalTarget: () => qs(".VisualizationSettings"),
        getModal: (props) =>
            <div className="text-centered">
                <RetinaImage
                    className="mb2"
                    forceOriginalDimensions={false}
                    id="QB-TutorialChartImg"
                    src="/app/img/qb_tutorial/chart.png"
                    width={160}
                />
                <h3>第六步：您可以选择图标来展示您的数据</h3>
                <p>尝试点击 <strong>数据展示方式</strong> 并选择 <strong>折线图</strong>.</p>
            </div>,
        shouldAllowEvent: (e) => qs(".VisualizationSettings a").contains(e.target)
    },
    {
        getPortalTarget: () => qs(".VisualizationSettings"),
        getPageFlagTarget: () => qsWithContent(".ChartType-popover li", "Line"),
        shouldAllowEvent: (e) => qsWithContent(".ChartType-popover li", "Line").contains(e.target)
    },
    {
        getPortalTarget: () => true,
        getModal: (props) =>
            <div className="text-centered">
                <RetinaImage
                    className="mb2"
                    forceOriginalDimensions={false}
                    id="QB-TutorialBoatImg"
                    src="/app/img/qb_tutorial/boat.png" width={190}
                />
                <h3>太棒了!</h3>
                <p>您已经完成了学习，下面您可以开始您的数据探索之旅了，如果您有其他问题，欢迎随时联系您的客户顾问。</p>
                <a className="Button Button--primary" onClick={props.onNext}>Thanks!</a>
            </div>
    },
    {
        getModalTarget: () => qsWithContent(".Header-buttonSection a", "Save"),
        getModal: (props) =>
            <div className="text-centered">
                <h3>保存查询结构</h3>
                <p>顺便说一下，您可以保存您的问题，以便您以后可以参考他们。保存的问题，也可以放在仪表板中。</p>
                <a className="Button Button--primary" onClick={props.onClose}>确认</a>
            </div>
    }
]

export default class QueryBuilderTutorial extends Component {
    render() {
        return <Tutorial steps={QUERY_BUILDER_STEPS} {...this.props} />;
    }
}
