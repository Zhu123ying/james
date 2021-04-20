/**
 * 复制文字到剪贴板
 * Created by Xinhe on 2018-01-19.
 */
import * as React from 'react'
import Proptypes from 'prop-types'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Icon, Notification } from 'ultraui'

const notification = Notification.newInstance()

const simpleFn = () => {
    notification.notice({
        id: 'copySuccess',
        type: 'success',
        // title: langCode['CopySuccess'],
        // content: langCode['CopySuccessText'],
        iconNode: 'icon-correct-o',
        duration: 3
    })
}

const Copy = (props) => {
    const { text, copyText, onCopy, style, className } = props
    const finalStyle = {
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        ...style
    }
    return (
        <div className={className} style={finalStyle}>
            {typeof text === 'string' ? <span className={'m-r-sm'}>{text}</span> : text}
            <CopyToClipboard
                text={copyText || text}
                onCopy={onCopy}
            >
                <Icon type={'copy'} className={'copy'} style={{ cursor: 'pointer', fontSize: '12px' }} />
            </CopyToClipboard>
        </div>
    )
}

Copy.propTypes = {
    text: Proptypes.oneOfType([
        Proptypes.string,
        Proptypes.element
    ]), // 显示的文字
    copyText: Proptypes.string, // 需要复制的内容,为空时会复制显示的文字
    onCopy: Proptypes.func, // 复制完成回调
    style: Proptypes.shape({}), // 样式
    className: Proptypes.string // class
}

Copy.defaultProps = {
    text: '',
    copyText: '',
    onCopy: simpleFn,
    style: {},
    className: ''
}

export default Copy
