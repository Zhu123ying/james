/* eslint "react/prop-types": "warn" */
import React, { Component, PropTypes } from "react";

import MetabaseAnalytics from "metabase/lib/analytics";
import MetabaseSettings from "metabase/lib/settings";
import Toggle from "metabase/components/Toggle.jsx";

import StepTitle from './StepTitle.jsx';
import CollapsedStep from "./CollapsedStep.jsx";


export default class PreferencesStep extends Component {

    static propTypes = {
        stepNumber: PropTypes.number.isRequired,
        activeStep: PropTypes.number.isRequired,
        setActiveStep: PropTypes.func.isRequired,

        allowTracking: PropTypes.bool.isRequired,
        setAllowTracking: PropTypes.func.isRequired,
        setupComplete: PropTypes.bool.isRequired,
        submitSetup: PropTypes.func.isRequired,
    }

    toggleTracking() {
        let { allowTracking } = this.props;

        this.props.setAllowTracking(!allowTracking);
    }

    async formSubmitted(e) {
        e.preventDefault();

        // okay, this is the big one.  we actually submit everything to the api now and complete the process.
        this.props.submitSetup();

        MetabaseAnalytics.trackEvent('Setup', 'Preferences Step', this.props.allowTracking);
    }

    render() {
        let { activeStep, allowTracking, setupComplete, stepNumber, setActiveStep } = this.props;
        const { tag } = MetabaseSettings.get('version');

        let stepText = '基础设置';
        if (setupComplete) {
            stepText = allowTracking ? "开始使用！" : "开始使用！";
        }

        if (activeStep !== stepNumber || setupComplete) {
            return (<CollapsedStep stepNumber={stepNumber} stepText={stepText} isCompleted={setupComplete} setActiveStep={setActiveStep}></CollapsedStep>)
        } else {
            return (
                <section className="SetupStep rounded full relative SetupStep--active">
                    <StepTitle title={stepText} number={stepNumber} />
                    <form onSubmit={this.formSubmitted.bind(this)} noValidate>
                        <div className="Form-field Form-offset">
                           您可以在之后的使用过程中，在管理面板任意加入或移除数据库。
                        </div>

                        <div className="Form-field Form-offset mr4" stytle="display:none">
                            <div style={{borderWidth: "2px"}} className="flex align-center bordered rounded p2">
                                <Toggle value={allowTracking} onChange={this.toggleTracking.bind(this)} className="inline-block" />
                                <span className="ml1">允许Database BI匿名访问并收集用户事件</span>
                            </div>
                        </div>

                        { allowTracking ?
                            <div className="Form-field Form-offset" stytle="display:none">
                                <ul style={{listStyle: "disc inside", lineHeight: "200%"}}>
                                    <li><span style={{fontWeight: "bold"}}>禁止</span>Database BI 收集您的数据或查询。</li>
                                    <li>我们的所有查询完全匿名的</li>
                                    <li>采集也将可以在任何时间被禁止。</li>
                                </ul>
                            </div>
                        : null }

                        <div className="Form-actions">
                            <button className="Button Button--primary">
                                下一步
                            </button>
                            { /* FIXME: <mb-form-message form="usageForm"></mb-form-message>*/ }
                        </div>
                    </form>
                </section>
            );
        }
    }
}
