const production = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/main.ts',

  output: {
    path: `${__dirname}/dist`,
    filename: 'bundle.js'
  },

  devtool: production ? false : 'inline-source-map',

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  }
};
