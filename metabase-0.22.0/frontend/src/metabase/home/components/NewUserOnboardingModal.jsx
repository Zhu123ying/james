import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

import MetabaseSettings from "metabase/lib/settings";

export default class NewUserOnboardingModal extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {step: 1};
    }

    static propTypes = {
        onClose: PropTypes.func.isRequired,
        user: PropTypes.object.isRequired
    }

    getStepCount() {
        return MetabaseSettings.get("has_sample_dataset") ? 3 : 2
    }

    nextStep() {
        let nextStep = this.state.step + 1;
        if (nextStep <= this.getStepCount()) {
            this.setState({ step: this.state.step + 1 });
        } else {
            this.closeModal();
        }
    }

    closeModal() {
        this.props.onClose();
    }

    renderStep() {
        return <span>STEP {this.state.step} of {this.getStepCount()}</span>;
    }

    render() {
        const { user } = this.props;
        const { step } = this.state;

        return (
            <div>
                { step === 1 ?
                    <div className="bordered rounded shadowed">
                        <div className="pl4 pr4 pt4 pb1 border-bottom">
                            <h2>{user.first_name},欢迎使用DataUltra BI!</h2>
                            <h2>祝您轻松完成数据分析</h2>

                            <p>DataUltra BI帮助您挖掘数据价值。</p>

                            <p>DataUltra BI最大的价值在于您并不需要掌握太多数据分析技术，就能够找到答案(您通常都不会使用到公式或SQL，只需要按提示操作即可)。</p>
                        </div>
                        <div className="px4 py2 text-grey-2 flex align-center">
                            {this.renderStep()}
                            <button className="Button Button--primary flex-align-right" onClick={() => (this.nextStep())}>下一步</button>
                        </div>
                    </div>
                : step === 2 ?
                    <div className="bordered rounded shadowed">
                        <div className="pl4 pr4 pt4 pb1 border-bottom">
                            <h2>最值得了解的三个问题</h2>

                            <p className="clearfix pt1"><img className="float-left mr2" width="40" height="40" src="/app/home/partials/onboarding_illustration_tables.png" />所有数据都是以表形式组织的。可以当做Excel表格的列和行来思考它们。</p>

                            <p className="clearfix"><img className="float-left mr2" width="40" height="40" src="/app/home/partials/onboarding_illustration_questions.png" />您可以通过输入一些表和字段来提交查询，并且可以使用非常酷炫的图表来展示结果。</p>

                            <p className="clearfix"><img className="float-left mr2" width="40" height="40" src="/app/home/partials/onboarding_illustration_dashboards.png" />当完成查询后，您还可以创建数据面板。数据面板是一组查询的集合，它能够有效的帮助你归类查询，并轻松掌握实时数据变更。</p>
                        </div>
                        <div className="px4 py2 text-grey-2 flex align-center">
                            {this.renderStep()}
                            <button className="Button Button--primary flex-align-right" onClick={() => (this.nextStep())}>下一步</button>
                        </div>
                    </div>
                :
                    <div className="bordered rounded shadowed">
                        <div className="pl4 pr4 pt4 pb1 border-bottom">
                            <h2>试着新增您的第一条查询！</h2>

                            <p>我们会在页面上展示一些工作中经常使用的功能和窗口。</p>
                        </div>
                        <div className="px4 py2 text-grey-2 flex align-center">
                            {this.renderStep()}
                            <span className="flex-align-right">
                                <a className="text-underline-hover cursor-pointer mr3" onClick={() => (this.closeModal())}>开始吧!</a>
                            </span>
                        </div>
                    </div>
                }
            </div>
        );
    }
}
