const path = require('path')
const webpack = require('webpack')

function resolve(dir) {
  return path.join(__dirname, dir)
}

// vue.config.js
module.exports = {
  /*
    Vue-cli3:
    Crashed when using Webpack `import()` #2463
    https://github.com/vuejs/vue-cli/issues/2463

   */
  /*
  pages: {
    index: {
      entry: 'src/main.js',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  */

  publicPath: '',

  configureWebpack: {
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))
      .set('@views', resolve('src/views'))
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {},
        javascriptEnabled: true
      }
    }
  },

  assetsDir: 'static',
  runtimeCompiler: true,

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'sass',
      patterns: []
    }
  },

  pwa: {
    name: 'EdirectInsure',
    iconPaths: {
      favicon32: 'static/icon/icon-32x32.png',
      favicon16: 'static/icon/icon-16x16.png',
      appleTouchIcon: 'static/icon/icon-152x152.png',
      maskIcon: 'static/icon/icon.svg',
      msTileImage: 'static/icon/icon-144x144.png'
    }
  },

  transpileDependencies: ['vuetify', 'vuex-persist']
}
