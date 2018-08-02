const fs = require('fs');
const replaceCSSUrl = require('replace-css-url');

class ReplaceCSSUrlPlugin {
  constructor(options) {
    this.options = Object.assign({}, options);
  }

  apply(compiler) {
    const handler = (compilation, callback) => {
      const assets = compilation.assets;
      let {exclude, replace, match = /\.css$/i} = this.options;
      exclude = [].concat(exclude).filter(Boolean);
      match = [].concat(match).filter(Boolean);

      if (typeof replace !== 'function') {
        throw '[replace-css-url] options.replace have to be function!';
      }

      let total = 0;
      console.log('\n[replace-css-url]');
      Object.keys(assets).filter((fileName) => {
        let valid = assets[fileName].emitted;
        valid = valid &&
        match.some(rule => rule.test(fileName)) &&
        !exclude.some(
          (excludeRule) => {
            if (excludeRule instanceof RegExp) {
              return excludeRule.test(fileName);
            }
            return fileName.indexOf(excludeRule) > -1;
          }
        );
        return valid;
      }).forEach((fileName) => {
        const {existsAt} = assets[fileName];
        const oldCSS = fs.readFileSync(existsAt, 'utf8');
        const newCSS = replaceCSSUrl(oldCSS, url => replace(fileName, url));
        if (oldCSS !== newCSS) {
          fs.writeFileSync(existsAt, newCSS, 'utf8');
          console.log('** replaced css url:', existsAt);
          total++;
        }
      });

      console.log('** Totally replaced css files:', total);

      callback();
    };

    if (compiler.hooks) {
      compiler.hooks.afterEmit.tap('webpack-plugin-replace-css-url', handler);
    } else {
      compiler.plugin('after-emit', handler);
    }
  }
}

module.exports = ReplaceCSSUrlPlugin

