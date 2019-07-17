const path = require('path');
const fs = require('fs');
const expect = require('chai').expect;
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const entryFilePath = path.join(__dirname, 'source/entry.css');
const outputDirPath = path.join(__dirname, 'output');
const outputFileName = 'output.js';
const outputCSSFileName = 'bundle.css';
const outputCSSPath = path.join(outputDirPath, outputCSSFileName);

const lib = require('../src/index')

const getTestWebPackConfig = lib => {
  return {
    entry: entryFilePath,
    output: {
      path: outputDirPath,
      filename: outputFileName
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            use: ['css-loader']
          })
        }
      ]
    },
    plugins: [
        new ExtractTextPlugin(outputCSSFileName),
        lib
    ]
  };
};

const happyPathCheck = (done, error, stats, expectedURL) => {
  expect(error).to.equal(null);

  fs.readFile(outputCSSPath, 'utf8', (err, contents) => {
    const assertCount = expectedURL.length
    expect(err).to.equal(null);
    expect(contents).to.be.a('string');
    let count = 0
    expectedURL.forEach(p=>{
        count++
        expect(contents).is.include(p);
    })
    expect(count).equal(assertCount)
    done();
  });
};

describe('Replace css url loader test', () => {
  it('should transform cdn url to local url', done => {
    webpack(
      getTestWebPackConfig(
          new lib({
              showLog: false
          })
      ),
      (error, stats) =>
        happyPathCheck(done, error, stats, [
            'fonts/7d222fe68dd211014a79859aaf8b7508a797ae9a.woff',
            'fonts/c8b87dff5e2ffff868ce807ef3d7fadf32a25686.eot',
            'fonts/8d18469d517f2a92fa24178a9b74677edbab9520.eot?#iefix',
            'fonts/7d222fe68dd211014a79859aaf8b7508a797ae9a.woff',
            'fonts/c41f0f30cd369db5725710cfd0d740a15c9b0a55.ttf',
            'fonts/6270bf2697c870681a618534a44c542325521939.svg#iconfont',
            'images/9e18d332eb36b841d535218e578fcece49cefc10.png',
        ])
    );
  });

});
