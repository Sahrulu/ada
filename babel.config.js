const merge = require('lodash/merge')
const find = require('./utils/find')
const read = require('./utils/read')
const browserlistConfig = require('./browserlist.config')

module.exports = options => {
  let babelRc = {
    presets: [
      [require.resolve('babel-preset-env'), {
        targets: {
          browsers: browserlistConfig(options)
        }
      }],
      require.resolve('babel-preset-react')
    ],
    plugins: [
      require.resolve('babel-plugin-transform-runtime'),
      require.resolve('babel-plugin-syntax-dynamic-import'),
      !options.build && options.hotReact && require.resolve('react-hot-loader/babel')
    ].filter(Boolean)
  }

  if (options.srcDir && options.cwd) {
    const userConfig = find(options.srcDir, options.cwd, '.babelrc')
    let userRc = {}

    if (userConfig) {
      userRc = JSON.parse(read(userConfig))

      merge(babelRc, userRc)
    }
  }

  options.debug && console.log('babelRc:', babelRc)

  return babelRc
}
