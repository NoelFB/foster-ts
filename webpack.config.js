module.exports = 
{  
    entry: './src/index.ts',
    output: 
    {
        filename: 'foster.js',
        path: __dirname + "/dist"
    },
    resolve: 
    {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js']
    },
    module: 
    {
        loaders: 
        [
            { test: /\.ts?$/, loader: 'awesome-typescript-loader' },
        ]
    },
    externals:
    {
        fs: "Fs",
        path: "Path",
        electron: "Electron"
    }
}