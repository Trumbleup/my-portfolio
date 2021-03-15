const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.js',
        canvas: './src/canvas.js',
    },
    devServer: {
        contentBase: './dist',
    },
    devtool: 'inline-source-map',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            }
        ]
    }
}