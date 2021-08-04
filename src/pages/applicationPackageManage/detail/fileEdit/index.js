/* eslint-disable */
import React from 'react'
import './index.less'
import HuayunRequest from '~/http/request'
import { applicationPackage as api } from '~/http/api'
import { Icon, Loading, Button as UltrauiButton } from 'ultraui'
import { Collapse, Select, Button, Popover, Modal, Tabs, Table, ButtonGroup, Input as HuayunuiInput } from 'huayunui'
import { Tree, Input } from 'antd'
// codemirror相关引入
import { UnControlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.js'
import 'codemirror/lib/codemirror.css';
// 主题风格
import 'codemirror/theme/solarized.css';
// 代码模式，clike是包含java,c++等模式的
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/css/css';
//ctrl+空格代码提示补全
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/anyword-hint.js';
//代码高亮
import 'codemirror/addon/selection/active-line';
//折叠代码
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
import 'codemirror/addon/edit/closebrackets';
// import 'codemirror/addon/edit/matchbrackets';

const { DirectoryTree } = Tree
// 格式化chartValues文本内容
const formatChartValues = (value = '') => {
    let content = JSON.stringify(value).replace(/\\n/g, '<br></br>').replace(/ /g, '&nbsp;').replace(/^(\s|\")+|(\s|\")+$/g, '').replace(/\\/g, '')
    return content
}
class FileEdit extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isFetching: false,
            treeData: [], // 树形数据
            name: '', // 搜索条件
            expandedKeys: ['0'], // 展开的key集合
            selectedKeys: ['0'], // 被选中的节点key
            showSearchInput: false,
            searchInputValue: '', // 搜索框的值
            validErrorMessage: '', // 校验的错误信息
        }
    }
    componentDidMount() {
        this.getTreeData()
    }
    getTreeData = () => {
        const { currentVersion: { id } } = this.props
        this.setState({
            isFetching: true
        })
        HuayunRequest(api.getApplicationPackageVersionChartDirByVersionId, { id }, {
            success: (res) => {
                this.setState({
                    treeData: this.formatTreeData([res.data]),
                })
            },
            complete: () => {
                this.setState({
                    isFetching: false
                })
            }
        })
    }
    // 将数据进行格式化，方便后面的添加，查询操作等
    formatTreeData = (data) => {
        const { currentVersion } = this.props
        // key例如0-0-0，0-0-1，0-1-1这种
        const loop = (key, arr) => {
            arr.forEach((item, index) => {
                // 设key值
                item.key = key === '' ? `${index}` : `${key}-${index}`
                // 设title
                item.title = (
                    <div className='treeNodeTitle'>
                        {
                            item.isEdit ? (
                                <Input
                                    defaultValue={item.name}
                                    autoFocus
                                    onBlur={(e) => this.handleRenameInputSubmit(e, item)}
                                    ref={node => this[`node${item.key}`] = node}
                                    onChange={e => {
                                        const value = e.target.value.replace(/([^\u0000-\u00FF])/g, '').replace(/[\/\\^$*+?()|[\]{},:'";=]/g, '')
                                        this[`node${item.key}`].setValue(value)
                                    }}
                                />
                            ) : (
                                <span className='titleContent'>{item.name}</span>
                            )
                        }
                        {
                            // 暂定根目录不能编辑和删除
                            (item.rootPath || currentVersion.isCommit) ? null : (
                                <div className='operaGroup'>
                                    <Button type='link' name='' icon={<Icon type='edit' />} onClick={() => this.handleEditTreeNodeItem(item)} disabled={item.type === 'bytefile'} />
                                    <Button type='link' name='' icon={<Icon type='delete' />} onClick={(e) => this.handleDeleteTreeNodeItem(e, item.key)} />
                                </div>
                            )
                        }
                    </div>
                )
                // 循环遍历
                if (item.children) {
                    loop(item.key, item.children)
                } else {
                    item.isLeaf = true
                }
                delete item['icon']
            })
        }
        loop('', data)
        return data
    }
    handleChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        }, () => {
            if (key === 'showSearchInput') {
                this.setState({
                    searchInputValue: ''
                })
            }
        })
    }
    // 获取到当前激活的node节点
    getNodeByNodeKey = (key = '') => {
        // 数据源要取子节点的state里的数据
        let { treeData } = this.state
        let currentNode
        let path = key.split('-')
        path.reduce((result, currentValue, index) => {
            return currentNode = index === path.length - 1 ? result[currentValue] : result[currentValue].children
        }, treeData)
        return currentNode
    }
    // 根据节点获取其父节点的id
    getParentNodeKeyByNodeKey = (key) => {
        let path = key.split('-')
        path.pop()
        return path.join('-')
    }
    // 获取当前节点的父节点
    getParentNodeByNodeKey = (key) => {
        let { treeData } = this.state
        // 当前选中的node的路径
        let keyPathArr = key.split('-')
        keyPathArr.pop()
        // 当前选中的node的父节点的路径
        let parentNodePath = keyPathArr.map((item, index) => {
            return index === keyPathArr.length - 1 ? item : `${item}.children`
        }).join('.')
        let parentNode = _.get(treeData, parentNodePath, {})
        return parentNode
    }
    handleEditTreeNodeItem = (item) => {
        item.isEdit = true
        let newTreeData = _.cloneDeep(this.state.treeData)
        this.setState({
            treeData: this.formatTreeData(newTreeData)
        })
    }
    handleRenameInputSubmit = (e, item) => {
        // 有值就替换，无值要删除
        let { treeData } = this.state
        let val = e.currentTarget.value.trim()
        if (val) {
            let parentNode = this.getParentNodeByNodeKey(item.key)
            item.name = val
            item.filepath = `${parentNode.filepath}/${val}`
            item.isEdit = false
            let newTreeData = _.cloneDeep(treeData)
            this.setState({
                treeData: this.formatTreeData(newTreeData)
            })
        } else {
            this.handleDeleteTreeNodeItem(e, item.key)
        }
    }
    handleDeleteTreeNodeItem = (e, key) => {
        // 这边得禁止冒泡，不然会触发handleSelectTreeNode方法
        e.stopPropagation()
        let { treeData } = this.state
        // 当前选中的node的路径
        let keyPathArr = key.split('-')
        let currentChildNodeIndex = keyPathArr.pop()
        // 当前选中的node的父节点的路径
        let parentNodePath = keyPathArr.map(item => {
            return `${item}.children`
        }).join('.')
        let parentNodeChildren = _.get(treeData, parentNodePath, {})
        parentNodeChildren.splice(currentChildNodeIndex, 1)
        let newTreeData = _.cloneDeep(treeData)
        this.setState({
            treeData: this.formatTreeData(newTreeData),
            selectedKeys: ['0'], // 删除后将selectedKeys重置，不然没有selectedKeys点击创建会报错
        }, () => {
            this.$editorInstance.doc.setValue('')
        })
    }
    // 创建文件、文件夹
    handleAddTreeNodeItem = (type) => {
        let { selectedKeys, treeData, expandedKeys } = this.state
        let currentNode = this.getNodeByNodeKey(selectedKeys[0])
        let parentNode = this.getParentNodeByNodeKey(selectedKeys[0])
        // 如果是在文件夹上点的创建，则直接在文件夹目录下创建，如果点的是文件，则平级创建
        let targetNode = currentNode.type === 'file' ? parentNode : currentNode
        const fileNodeInitData = {
            name: '',
            type: 'file',
            filepath: targetNode.filepath,
            fcontent: '',
            isEdit: true
        }
        const folderNodeInitData = {
            name: '',
            type: 'dir',
            filepath: targetNode.filepath,
            children: [],
            isEdit: true
        }
        const initNode = type === 'file' ? fileNodeInitData : folderNodeInitData
        targetNode.children.push(initNode)
        let newTreeData = _.cloneDeep(treeData)
        this.setState({
            treeData: this.formatTreeData(newTreeData),
            expandedKeys: [...expandedKeys, selectedKeys[0]] // 展开父节点
        })
    }
    // 搜索文件
    handleSearch = () => {
        const { searchInputValue, treeData } = this.state
        let selectedKeys = [], expandedKeys = [] // 搜索出来的结果集
        const filterTreeNodeByName = (arr) => {
            arr.forEach(item => {
                const { name, children, key } = item
                if (name.indexOf(searchInputValue) !== -1) {
                    selectedKeys.push(key)
                }
                if (children) {
                    filterTreeNodeByName(children)
                }
            })
        }
        filterTreeNodeByName(treeData)
        // 将搜索到的结果的节点展开
        selectedKeys.forEach(key => {
            let path = ''
            let pathArr = key.split('-')
            pathArr.pop()
            pathArr.forEach(item => {
                path = path ? `${path}-${item}` : item
                expandedKeys.push(path)
            })
        })
        this.setState({
            selectedKeys,
            expandedKeys
        })
    }
    handleCodeMirrorChange = () => {
        // 获取 CodeMirror.doc.getValue()
        // 赋值 CodeMirror.doc.setValue(value) // 会触发 onChange 事件，小心进入无线递归。
        const key = _.get(this.state, 'selectedKeys.0', '')
        let content = this.$editorInstance.doc.getValue()
        let currentNode = this.getNodeByNodeKey(key)
        // 将编辑器的内容赋给当前节点
        // 注：删除也会触发change，可能会导致找不到currentNode
        if (currentNode) {
            currentNode.fcontent = content
        }
    }
    handleSelectTreeNode = (keys, node) => {
        this.setState({
            selectedKeys: keys
        }, () => {
            let content = ''
            if (node.type === 'file') {
                content = _.get(node, 'fcontent', '')
            }
            this.$editorInstance.doc.setValue(content)
        })
    }
    render() {
        const { currentVersion } = this.props
        const { treeData, isFetching, expandedKeys, selectedKeys, showSearchInput, searchInputValue, validErrorMessage } = this.state
        return (
            <div className='fileEditModalContent'>
                <div className='body'>
                    <div className='treeBox'>
                        <div className='searchBar'>
                            <div className='operaGroup'>
                                <Popover
                                    placement="top"
                                    content={<div>收起</div>}
                                    trigger="hover"
                                    type="text"
                                >
                                    <i className='iconfont icon-object br' onClick={() => this.handleChange('expandedKeys', [])} />
                                </Popover>
                                <Popover
                                    placement="top"
                                    content={<div>创建文件夹</div>}
                                    trigger="hover"
                                    type="text"
                                >
                                    <div>
                                        <UltrauiButton
                                            type='default'
                                            icon='folde'
                                            disabled={currentVersion.isCommit}
                                            onClick={() => this.handleAddTreeNodeItem('dir')}
                                        />
                                    </div>
                                </Popover>
                                <Popover
                                    placement="top"
                                    content={<div>创建文件</div>}
                                    trigger="hover"
                                    type="text"
                                >
                                    <UltrauiButton
                                        type='default'
                                        icon='file'
                                        disabled={currentVersion.isCommit}
                                        onClick={() => this.handleAddTreeNodeItem('file')}
                                    />
                                </Popover>
                            </div>
                            <Button
                                className='searchBtn'
                                type="operate"
                                name=""
                                icon={<Icon type='search' />}
                                onClick={() => this.handleChange('showSearchInput', !showSearchInput)}
                            />
                        </div>
                        <div className='treeContent'>
                            {
                                showSearchInput ? (
                                    <div className='searchInput'>
                                        <HuayunuiInput
                                            suffix={
                                                <div className='searchSuffix'>
                                                    {/* <Icon type='error' onClick={() => this.handleChange('searchInputValue', '')} /> */}
                                                    &nbsp; <a onClick={this.handleSearch}>搜索</a>
                                                </div>
                                            }
                                            value={searchInputValue}
                                            onChange={val => this.handleChange('searchInputValue', val)} />
                                    </div>
                                ) : null
                            }
                            {
                                isFetching ? <Loading /> : (
                                    <DirectoryTree
                                        defaultExpandedKeys={['0']}
                                        selectedKeys={selectedKeys}
                                        onSelect={(keys, { node }) => this.handleSelectTreeNode(keys, node)}
                                        treeData={treeData}
                                        expandAction={false}
                                        expandedKeys={expandedKeys}
                                        onExpand={(keys) => this.handleChange('expandedKeys', keys)}
                                    />
                                )
                            }
                        </div>
                    </div>
                    <div className='codemirrorBox'>
                        <CodeMirror
                            editorDidMount={editor => { this.$editorInstance = editor }}
                            onChange={(instance, changeObj) => this.handleCodeMirrorChange(instance, changeObj)}
                            // value=''
                            options={{
                                mode: { name: 'text/css' },
                                // theme: 'solarized dark',
                                autofocus: false,//自动获取焦点
                                styleActiveLine: true,//光标代码高亮
                                lineNumbers: true, //显示行号
                                smartIndent: true,  //自动缩进
                                //start-设置支持代码折叠
                                lineWrapping: true,
                                foldGutter: true,
                                gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],//end
                                extraKeys: {
                                    "Ctrl": "autocomplete",
                                    "Ctrl-Z": function (editor) {
                                        editor.undo();
                                    },//undo
                                },
                                matchBrackets: true,  //括号匹配，光标旁边的括号都高亮显示
                                autoCloseBrackets: true, //键入时将自动关闭()[]{ }''""
                            }}
                        />
                    </div>
                </div>
                {
                    validErrorMessage ? (
                        <div className='validErrorMessage'>{validErrorMessage}</div>
                    ) : null
                }
            </div>
        )
    }
}

export default FileEdit