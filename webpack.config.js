import fs from 'fs'
import path from 'path'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const templateFiles = fs.readdirSync(path.resolve(process.cwd())).filter(fileName => fileName.endsWith('.njk'))

const jsFiles = fs
    .readdirSync(path.resolve(process.cwd(), './src/', 'assets', 'js'))
    .filter(fileName => fileName.endsWith('.js') && !fileName.includes('main'))

const entries = jsFiles.reduce(
    (acc, current) => {
        acc[path.parse(current).name] = path.resolve(process.cwd(), './src/', 'assets', 'js', current)
        return acc
    },
    {
        main: [
            path.resolve(process.cwd(), './src/', 'assets', 'js', 'main.js'),
            path.resolve(process.cwd(), './src/', 'assets', 'css', 'main.css'),
        ],
    }
)

export default {
    target: 'browserslist',
    entry: entries,
    output: {
        path: path.resolve(process.cwd(), './dist'),
        filename: 'assets/js/[name].js',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                loader: 'esbuild-loader',
                options: {
                    target: 'es2015',
                },
            },
            {
                test: /\.(png|gif|jpe?g|svg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/images/[name][ext]',
                },
            },
            {
                test: /\.(woff2?)$/,
                type: 'asset',
                generator: {
                    filename: 'assets/fonts/[name][ext]',
                },
            },
            {
                test: /\.njk$/,
                use: [
                    {
                        loader: 'simple-nunjucks-loader',
                        // options: { assetsPaths: './src/assets' },
                    },
                ],
            },
        ],
    },
    plugins: [
        ...templateFiles.map(templateName => {
            const chunks = ['main']

            jsFiles.forEach(jsName => {
                if (path.parse(templateName).name === path.parse(jsName).name) chunks.push(path.parse(jsName).name)
            })

            return new HtmlWebpackPlugin({
                filename: templateName.replace(/\.njk$/, '.html'),
                template: path.resolve(process.cwd(), templateName),
                chunks,
                minify: false,
            })
        }),
        // new CopyWebpackPlugin({
        //     patterns: [
        //     {
        //         from: path.resolve(process.cwd(), './src', 'assets', 'images'),
        //         to: path.resolve(process.cwd(), './dist', 'assets', 'images'),
        //         toType: 'dir',
        //         globOptions: {
        //             ignore: ['*.DS_Store', 'Thumbs.db'],
        //         },
        //     },
        //     {
        //         from: path.resolve(process.cwd(), './src', 'assets', 'videos'),
        //         to: path.resolve(process.cwd(), './src', 'assets', 'videos'),
        //         toType: 'dir',
        //         globOptions: {
        //             ignore: ['*.DS_Store', 'Thumbs.db'],
        //         },
        //     },
        //     ],
        // }),
    ],
}
