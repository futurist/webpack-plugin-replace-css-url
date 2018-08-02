# webpack-plugin-replace-css-url

## Install

```sh
npm i -D webpack-plugin-replace-css-url
```

## Usgae

In you `webpack.config.js` file:

```js
const ReplaceCSSUrlPlugin = require('webpack-plugin-replace-css-url')

const config = {
  // ... ...
  plugins: [
    // 合并规则：合并所有plugins，同名plugin只出现一次
    new ReplaceCSSUrlPlugin({
      excludes: 'app.css',
      replace: (url, file) => {
        var prefix = '../'.repeat(file.split('/').length - 1) || './';
        var match = /(?:https?:)\/\/at.alicdn.com\/t\/\w+.([^.]+)/.exec(url);
        console.log(file, url);
        return match ? prefix + 'static/font/antd/iconfont.' + match[1] : url;
      }
    })
  ]
}
```


