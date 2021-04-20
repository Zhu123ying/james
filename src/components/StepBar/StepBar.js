import PropTypes from 'prop-types'
import StepBarItem from './StepBarItem'

import './stepbar.less'

StepBar.propTypes = {
  steps: PropTypes.array.isRequired,
  prefixCls: PropTypes.string,
  currentStep: PropTypes.number
}

StepBar.defaultProps = {
  currentStep: 0,
  prefixCls: 'ult'
}

export default function StepBar({ prefixCls, steps = [], currentStep = 0 }) {
  const stepNum = steps.length
  const stepItemWidth = `${100.0 / (stepNum || 1)}%`

  return (
    <div className={`${prefixCls}-stepbar`}>
      {steps.map(({ title }, stepIndex) => (
        <StepBarItem
          key={`${title}-${stepIndex}`}
          isLast={stepIndex === stepNum - 1}
          isFirst={stepIndex === 0}
          title={title}
          stepIndex={stepIndex}
          past={stepIndex < currentStep}
          future={stepIndex > currentStep}
          now={stepIndex === currentStep}
          width={stepItemWidth}
        />
      ))}
    </div>
  )
}
