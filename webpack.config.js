const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, '/dist'),
        filename: 'bundle.js'
    },
    devtool: 'inline-source-map',
    module:{
        rules:[
            {
                test:/\.tsx?$/,
                loader:'ts-loader',
            },
            {
                test: /\.(scss|sass|css)$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
        ]
    },
    resolve:{
        extensions:['.ts','.tsx','.js','.json']
    },
    plugins: [
        new MiniCssExtractPlugin({
          filename: 'style.css', // アウトプットCSSファイル
        }),
    ],
    devServer: {
        contentBase: path.join(__dirname, '/dist'),
        open: true,
        port: 3000
    }
}