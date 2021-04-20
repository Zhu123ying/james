/* eslint-disable react/no-multi-comp */
import React from 'react'
import StepBar from 'components/StepBar'
import PropTypes from 'prop-types'
import './style.less'

export default function BaseStep({ children, currentStep, visible, steps }) {
    return (
        <div style={{ display: visible ? 'block' : 'none' }}>
            <StepBar
                steps={steps}
                currentStep={currentStep}
            />
            <div className="separate" style={{ width: '100%', marginBottom: 32 }}><hr /><hr /></div>
            {children}
        </div>
    )
}
BaseStep.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]).isRequired,
    currentStep: PropTypes.number.isRequired,
    visible: PropTypes.bool.isRequired,
    steps: PropTypes.array
}
BaseStep.defaultProps = {
    steps: [
        { title: '基本信息' },
        { title: '安全设置' },
        { title: '网络配置' }
    ]
}

/**
 * 创建自定义步骤的Step组件
 * @param {*} steps 自定义步骤数组
 */
export const getStepComponent = (steps) => {
    return (props) => {
        return (
            <BaseStep
                steps={steps}
                {...props}
            />
        )
    }
}
