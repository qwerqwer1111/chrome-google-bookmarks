const VueLoaderPlugin = require('vue-loader/lib/plugin');

const production = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/main.ts',

  output: {
    path: `${__dirname}/dist`,
    filename: 'bundle.js'
  },

  plugins: [
    new VueLoaderPlugin()
  ],

  devtool: production ? false : 'inline-source-map',

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/]
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  }
};
