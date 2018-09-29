const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          mangle: true
        },
        sourceMap: false
      })
    ]
  },
  entry: {
    main: './src/oauth.module.ts'
  },
  output: {
    filename: 'index.js',
    library: '@codeda/oauth',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader'
      }
    ]
  },
  externals: [
    '@angular/core',
    'rxjs',
    'zone.js',
    'typescript'
  ]
};
