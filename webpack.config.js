const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

  entry: './src/main.ts',

  module: {
    rules: [

      // Images
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource'
      },

      // TypeScript
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },

      // Musique / sons
      {
        test: /\.(mp3|wav|ogg)$/i,
        type: 'asset/resource'
      }

    ]
  },

  resolve: {
    extensions: ['.ts', '.js'],
  },

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    open: true,
    port: 8080,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],

};