const { merge } = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
    minimize: false
  },
  devServer: {
    static: [
      {
        directory: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        watch: false, // ✅ Disable watching untuk prevent spam requests
      },
      {
        directory: path.resolve(__dirname, 'public'),
        publicPath: '/',
        watch: false, // ✅ Disable watching untuk prevent spam requests
      },
      {
        directory: path.resolve(__dirname, '../'),
        publicPath: '/',
        watch: false, // ✅ Serve test files from root
      }
    ],
    historyApiFallback: true,
    open: true,
    port: 9000,
    hot: false, // ✅ Disable HMR completely
    liveReload: false, // ✅ Disable live reload completely
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    compress: true,
    devMiddleware: {
      writeToDisk: true, // ✅ Penting untuk static files
      publicPath: '/', // ✅ Consistent dengan output.publicPath
    },
    watchFiles: {
      paths: [], // ✅ Disable watching files completely
      options: {
        ignored: /.*/ // ✅ Ignore all files
      }
    },
  },
  watchOptions: {
    ignored: ['**/*'], // ✅ Ignore all files for watching
    aggregateTimeout: 0,
    poll: false
  },
});