var HtmlWebpackPlugin = require('html-webpack-plugin');
var htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: './index.html'
});

module.exports = {
  entry: './app.js',
  output: {
    path: './build',
    filename: 'bundle.js'
  },
  plugins: [
    htmlWebpackPlugin
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      }
    ]
  }
};
