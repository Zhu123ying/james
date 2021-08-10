/* eslint-disable */

// 格式化chartValues文本内容
const formatChartValues = (value = '') => {
    let content = JSON.stringify(value).replace(/</g, '< ').replace(/>/g, ' >').replace(/\\n/g, '<br>').replace(/ /g, '&nbsp;').replace(/^(\s|\")+|(\s|\")+$/g, '').replace(/\\/g, '')
    return content
}

// 根据应用的类型获取对应的版本信息
const versionDetailKeyObject = {
    COMMON: 'applicationPackageVersion', // 普通的，正常流程创建的
    APPSTORE: 'applicationPackageVersionStore' // 应用商城创建的
}

// 根据应用的类型获取对应的应用包信息
const packageDetailKeyObject = {
    COMMON: 'applicationPackage', // 普通的，正常流程创建的
    APPSTORE: 'applicationPackageStore' // 应用商城创建的
}

const renderStorageConfigTooltip = (data, intl) => {
    const { name, value, pvDescription } = data
    const { accessModes, reclaimPilicy, storageClass } = pvDescription || {}

    return (
        <div className="detailItem">
            <div className="detailLine">
                <span className='title'>{intl.formatMessage({ id: 'StorageConfigName' })}：</span>
                <span className='content'>{name}</span>
            </div>
            <div className="detailLine">
                <span className='title'>{`${intl.formatMessage({ id: 'Capacity' })}(Gi)`}：</span>
                <span className='content'>{value}</span>
            </div>
            <div className="detailLine">
                <span className='title'>{intl.formatMessage({ id: 'StorageConfigDescription' })}：</span>
                <span className='content'></span>
            </div>
            <div className="detailLine">
                <span className='title'>Access Modes：</span>
                <span className='content'>{(accessModes || []).join('、')}</span>
            </div>
            <div className="detailLine">
                <span className='title'>Reclaim Policy：</span>
                <span className='content'>{reclaimPilicy}</span>
            </div>
            <div className="detailLine">
                <span className='title'>StorageClass：</span>
                <span className='content'>{storageClass}</span>
            </div>
        </div>
    )
}

const renderStateWithDot = (dotClass, text) => {
    return (
        <div className='stateLineWithDot'>
            <div className={`stateDot ${dotClass}`}></div>
            {text}
        </div>
    )
}

export {
    formatChartValues,
    versionDetailKeyObject,
    packageDetailKeyObject,
    renderStorageConfigTooltip,
    renderStateWithDot,
}