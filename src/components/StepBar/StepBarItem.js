import PropTypes from 'prop-types'
import classnames from 'classnames'

StepBarItem.propTypes = {
  isLast: PropTypes.bool.isRequired,
  isFirst: PropTypes.bool.isRequired,
  past: PropTypes.bool.isRequired,
  future: PropTypes.bool.isRequired,
  now: PropTypes.bool.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  stepIndex: PropTypes.number.isRequired
}

export default function StepBarItem({
  isLast,
  isFirst,
  title,
  stepIndex,
  past,
  future,
  now,
  width
}) {
  const progressItemClassNames = classnames('stepbar-item', {
    isLast,
    isFirst,
    past,
    future,
    now
  })
  return (
    <div className={progressItemClassNames} style={{ width }}>
      <div className="stepbar-body">
        <div className="stepbar-line left" />
        <div className="stepbar-title">
          {past && <div className="circle past" />}
          {now && (
            <div className="circle now">
              <div className="inner-circle" />
            </div>
          )}
          {future && <div className="circle future" />}
          {title}
        </div>
        <div className="stepbar-line right" />
      </div>
    </div>
  )
}
