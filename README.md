# webpack-plugin-replace-css-url

Webpack plugin to transform download cdn urls in css and replaced with local file path

Compatible with both webpack3 and webpack4, but only work with [ExtractTextPlugin](https://github.com/webpack-contrib/extract-text-webpack-plugin) or [MiniCssExtractPlugin](https://github.com/webpack-contrib/mini-css-extract-plugin), which emit separate `css` files.

## Install

```bash
npm i -D webpack-plugin-replace-css-url
```

## Usage

In your `webpack.config.js` file:


```javascript
const ReplaceCSSUrl = require('webpack-plugin-replace-css-url')
module.exports = {
  ...
  module: {
    plugins: [
      ...
      // this should be in last plugin
      new ReplaceCSSUrl(options)
    ],
  },
```

All cdn urls will be downloaded to local dirs, as below rule:

```
{
    svg: ['fonts'],
    otf: ['fonts'],
    ttf: ['fonts'],
    eot: ['fonts'],
    woff: ['fonts'],
    woff2: ['fonts'],
    png: ['images'],
    jpg: ['images'],
    gif: ['images'],
}
```

`options.dirs` `Object` object to override above folder.

`options.match` `String|RegExp` regexp to filter urls.

`options.showLog` `Boolean` default `true`, you can pass `false` to display nothing.


