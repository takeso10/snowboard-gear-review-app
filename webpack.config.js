import { resolve as _resolve, join } from 'path'
import MiniCssExtractPlugin, { loader as _loader } from 'mini-css-extract-plugin'

export const mode = 'development'
export const entry = './src/index.tsx'
export const output = {
  path: _resolve(__dirname, './dist'),
  filename: 'bundle.js',
}
export const devtool = 'inline-source-map'
export const module = {
  rules: [
    {
      test: /\.tsx?$/,
      loader: 'ts-loader',
    },
    {
      test: /\.(scss|sass|css)$/i,
      use: [_loader, 'css-loader', 'sass-loader'],
    },
  ],
}
export const resolve = {
  extensions: ['.ts', '.tsx', '.js', '.json'],
}
export const plugins = [
  new MiniCssExtractPlugin({
    filename: 'style.css', // アウトプットCSSファイル
  }),
]
export const devServer = {
  contentBase: join(__dirname, '/dist'),
  open: true,
  port: 3000,
}
