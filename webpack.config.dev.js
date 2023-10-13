import path from 'path'
import { merge } from 'webpack-merge'
import webpackConfig from './webpack.config.js'

export default () => {
    return merge(webpackConfig, {
        mode: 'development',
        devtool: 'inline-source-map',
        devServer: {
            static: {
                directory: path.resolve(process.cwd(), './dist'),
                publicPath: '/',
            },
            devMiddleware: {
                writeToDisk: true, // !!! FOR EXAMPLE, I personally don't use it
            },
        },
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: ['tailwindcss', 'autoprefixer'],
                                },
                            },
                        },
                    ],
                },
            ],
        },
    })
}
