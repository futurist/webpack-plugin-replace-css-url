const { join, relative, dirname } = require('path')
const { RawSource } = require('webpack-sources')

const replaceCSSUrl = require('replace-css-url')
const fetch = require('node-fetch')
const sha1 = require('sha1')
const url = require('url')

class Plugin {
  constructor (options = {}) {
    this.options = options || {}
  }
  apply (compiler) {
    const action = (compilation, callback) => {
      const { assets } = compilation
      const { match, dirs, showLog = true } = this.options
      const DIR = {
        svg: ['fonts'],
        otf: ['fonts'],
        ttf: ['fonts'],
        eot: ['fonts'],
        woff: ['fonts'],
        woff2: ['fonts'],
        png: ['images'],
        jpg: ['images'],
        gif: ['images'],
        ...dirs
      }

      Promise.all(
        Object.keys(assets).map(name => {
          if (!name.endsWith('.css')) return Promise.resolve()
          const content = assets[name].source()

          const oldCSS = content

          const downloadArr = []
          replaceCSSUrl(oldCSS, link => {
            const urlObj = url.parse(link)
            let condition =
              urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
            const matchArr = /\.([^.]+)$/.exec(urlObj.pathname)
            if (match && condition) {
              condition = new RegExp(match).test(link)
            }
            if (condition && matchArr) {
              const ext = matchArr[1]
              downloadArr.push({
                link,
                urlObj,
                ext
              })
            }
            return link
          })

          return Promise.all(
            downloadArr.map(obj => {
              const { link, ext } = obj
              return fetch(link)
              .then(res => res.buffer())
              .then(buffer => {
                const saveDir = DIR[ext];
                const filepath = join(
                  join(...saveDir),
                  sha1(link) + '.' + ext
                );
                obj.filepath = filepath;
                assets[filepath] = new RawSource(buffer);
              })
            })
          ).then(() => {
            const newCSS = replaceCSSUrl(oldCSS, link => {
              const obj = downloadArr.find(v => v.link === link)
              if (obj) {
                const { urlObj, filepath } = obj
                const newLink =
                  filepath +
                  (urlObj.search || '') +
                  (urlObj.hash || '')
                if(showLog){
                  console.log(`[replace-css-url]: "${link}" with "${newLink}"`)
                }
                return newLink
              } else {
                return link
              }
            })
            assets[name] = new RawSource(newCSS)
          })
        })
      )
        .then(() => {
          callback()
        })
        .catch(callback)
    }
    if (compiler.hooks) {
      compiler.hooks.emit.tapAsync('ReplaceCSSUrl', action)
    } else {
      compiler.plugin('emit', action)
    }
  }
}

module.exports = Plugin
