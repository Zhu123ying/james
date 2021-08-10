module.exports = {
    root: true, //  eslint找到这个标识后，不会再去父文件夹中找eslint的配置文件
    parser: 'babel-eslint', // 使用babel-eslint来作为eslint的解析器
    parserOptions: { // 设置解析器选项
        ecmaVersion: 2017,
        ecmaFeatures: {
            "experimentalObjectRestSpread": true,
            "experimentalDecorators": true,
            "jsx": true,
            "arrowFunctions": true,
            "classes": true,
            "modules": true,
            "defaultParams": true
        },
        sourceType: 'module' // 表明自己的代码是ECMAScript模块
    },
    // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
    extends: [
        "standard", // 继承eslint-config-standard里面提供的lint规则
        "plugin:import/errors",
        "plugin:jsx-a11y/recommended",
        "plugin:react/all"
    ],
    // required to lint *.vue files
    plugins: [ // 使用的插件eslint-plugin-html. 写配置文件的时候，可以省略eslint-plugin-
        "standard",
        "import",
        "jsx-a11y",
        "react",
        "babel",
        "react-hooks"
    ],
    // 启用额外的规则或者覆盖基础配置中的规则的默认选项
    rules: {
        "react/jsx-handler-names": 0,
        "react/button-has-type": 0,
        "react/no-unused-prop-types": 0,
        "react/state-in-constructor": 0,
        "react/jsx-fragments": 0,
        "react/jsx-no-useless-fragment": 0,
        "react/no-find-dom-node": 0,
        "react/no-unused-state": 0,
        "react/no-access-state-in-setstate": 0,
        "react/jsx-sort-default-props": 0,
        "react/prop-types": 0,
        "react/jsx-max-depth": 0,
        "react/jsx-newline": 0,
        "react/jsx-one-expression-per-line": 0,
        "react/require-default-props": 0,
        "react/jsx-props-no-spreading": 0,
        "react/function-component-definition": 0,
        "react/no-multi-comp": 0,
        "space-before-function-paren": 0,
        "import/no-unresolved": 0,
        "standard/no-callback-literal": 0,
        "jsx-a11y/href-no-hash": 0,
        "jsx-a11y/click-events-have-key-events": 0,
        "jsx-a11y/no-static-element-interactions": 0,
        "jsx-a11y/no-noninteractive-element-interactions": 0,
        "indent": 0,
        "no-tabs": 0,
        "eol-last": 0,
        "quotes": 0,
        "max-len": 0,
        "no-undef": 0,
        "camelcase": 0,
        "no-control-regex": 0,
        "one-var": 0,
        "no-unused-vars": 0,
        "react/jsx-indent": 0,
        "react/no-string-refs": 0,
        "react/jsx-filename-extension": ["error", {
            "extensions": [".js", ".jsx"]
        }],
        "react/jsx-closing-tag-location": ["warn"],
        "react/jsx-curly-brace-presence": 0,
        "react/prefer-stateless-function": ["warn"],
        "jsx-a11y/anchor-is-valid": 0,
        "react/destructuring-assignment": 0,
        "react/display-name": 0,
        "react/jsx-indent-props": 0,
        "react/forbid-prop-types": 0,
        "react/forbid-component-props": 0,
        "react/jsx-no-bind": 0,
        "react/no-array-index-key": 0,
        "react/no-set-state": 0,
        "react/require-optimization": 0,
        "react/sort-prop-types": 0,
        "react/sort-comp": 0,
        "react/jsx-sort-props": 0,
        "react/jsx-no-literals": 0,
        "react/jsx-max-props-per-line": 0,
        "react-hooks/rules-of-hooks": "error"
    },
    globals: { // 声明在代码中自定义的全局变量
        'CONFIG': true,
        'DEBUG': true,
        'VERSION': true,
        'React': true,
        'ReactDOM': true,
        'LanguageData': true
    },
    env: { // 定义预定义的全局变量,比如browser: true，这样你在代码中可以放心使用宿主环境给你提供的全局变量。
        browser: true, // browser global variables.
        es6: true,
        commonjs: true,
        node: true, // Node.js global variables and Node.js scoping.
        worker: true, // web workers global variables.
        mocha: true, // adds all of the Mocha testing global variables.
        phantomjs: true, // PhantomJS global variables.
        serviceworker: true, // Service Worker global variables.
        jest: true // jest global.
    },
    "settings": {
        "import/extensions": [".js", ".jsx"],
        "react": {
            "createClass": "createReactClass", // Regex for Component Factory to use, default to "createReactClass"
            "pragma": "React", // Pragma to use, default to "React"
            "version": "latest" // React version, default to the latest React stable release
        },
        "propWrapperFunctions": ["forbidExtraProps"] // The names of any functions used to wrap the propTypes object, such as `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
    }
}
