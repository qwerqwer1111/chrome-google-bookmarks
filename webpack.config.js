const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const production = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/main.ts',
  output: {
    path: `${__dirname}/dist`,
    filename: 'bundle.js',
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'manifest.json', to: `${__dirname}/dist/manifest.json` },
      ],
    }),
    new HtmlWebpackPlugin({
      template: 'src/template/popup.html',
      filename: 'popup.html',
      minify: production
        ? { collapseWhitespace: true, minifyCSS: true }
        : false,
    }),
    new VueLoaderPlugin(),
  ],
  devtool: false,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
  },
};
