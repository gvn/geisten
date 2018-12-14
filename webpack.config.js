const path = require(`path`);
const CopyWebpackPlugin = require(`copy-webpack-plugin`);

module.exports = {
  mode: `development`,
  entry: `./src/js/main.js`,
  output: {
    path: path.resolve(__dirname, `dist`),
    filename: `js/main.bundle.js`
  },
  devServer: {
    contentBase: `./dist`,
    watchContentBase: true
  },
  module: {
    rules: [
      {
        test: /\.js(x?)$/,
        exclude: /node_modules/,
        use: {
          loader: `babel-loader`,
          options: {
            presets: [`es2015`, `react`]
          }
        }
      },
      {
        test: /\.(s?)css$/,
        use: [{
          loader: `style-loader`
        }, {
          loader: `css-loader`
        }, {
          loader: `sass-loader`
        }]
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: `src/index.html`,
      to: `index.html`,
      toType: `file`
    }])
  ]
};
