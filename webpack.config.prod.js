import { merge } from 'webpack-merge'
import webpackConfig from './webpack.config.js'
import TerserPlugin from 'terser-webpack-plugin'
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

export default () => {
    return merge(webpackConfig, {
        mode: 'production',
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
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
        plugins: [new MiniCssExtractPlugin({ filename: 'assets/css/[name].css' })],
        optimization: {
            minimize: true,
            minimizer: [
                '...',
                new TerserPlugin({
                    minify: TerserPlugin.esbuildMinify,
                    terserOptions: {},
                }),
                new ImageMinimizerPlugin({
                    minimizer: {
                        implementation: ImageMinimizerPlugin.imageminMinify,
                        options: {
                            plugins: [
                                ['gifsicle', { interlaced: true }],
                                ['mozjpeg', { quality: 80 }],
                                ['pngquant', { quality: [0.5, 0.7] }],
                                [
                                    'svgo',
                                    {
                                        plugins: [
                                            {
                                                name: 'preset-default',
                                                params: {
                                                    overrides: {
                                                        removeViewBox: false,
                                                        addAttributesToSVGElement: {
                                                            params: {
                                                                attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                ],
                            ],
                        },
                    },
                }),
            ],
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        chunks: 'all',
                        maxInitialRequests: Infinity,
                        minSize: 0,
                        test: /[\\/]node_modules[\\/]/,
                        name(module) {
                            // get the name. E.g. node_modules/.pnpm/packageName/not/this/part.js
                            // or node_modules/packageName
                            const packageName = module.context.match(/[\\/]node_modules[\\/].pnpm\/(.*?)([\\/]|$)/)[1]

                            // npm package names are URL-safe, but some servers don't like @ symbols
                            return `vendor.${packageName.replace('@', '')}`
                        },
                    },
                },
            },
        },
    })
}
