const path = require('path')

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
            }
        ]
    },
    resolve:{
        extensions:['.ts','.tsx','.js','.json']
    },
    devServer: {
        contentBase: path.join(__dirname, '/dist'),
        open: true,
        port: 3000
    }
}