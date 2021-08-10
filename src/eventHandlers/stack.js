const _ = window._
export default (event, message) => {
    const scalingPath = '/resource/compute/scaling'
    const prefix = 'orchestration.'
    const pathname = location.pathname

    if (_.startsWith(event, prefix) && pathname.indexOf(scalingPath) > -1) {
        message.__silent__ = true
    }
}
