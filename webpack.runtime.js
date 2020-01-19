const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode: "development",
    target: "web",
    entry: {
        "scripts/theme": ["./src/startup.runtime.ts"],
        "styles/theme": [`./src/themes/website/styles/styles.scss`]
    },
    output: {
        filename: "./[name].js",
        path: path.resolve(__dirname, "dist")
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                sourceMap: false,
                terserOptions: {
                    mangle: false,
                    output: {
                        comments: false,
                    }
                }
            })
        ],
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "scripts/vendor",
                    chunks: "initial"
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: "css-loader", options: { url: false } },
                    { loader: "postcss-loader" },
                    { loader: "sass-loader" }
                ]
            },
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            },
            {
                test: /\.html$/,
                loader: "html-loader?exportAsEs6Default"
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: "url-loader",
                options: {
                    limit: 10000
                }
            },
            // {
            //     test: /\.vue$/,
            //     loader: "vue-loader"
            // }
            {
                test: /\.liquid$/,
                loader: "raw-loader"
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            hmr: process.env.NODE_ENV === "development"
        }),
        new CopyWebpackPlugin([
            { from: `./src/config.runtime.json`, to: `config.json` },
            { from: `./src/themes/website/styles/fonts`, to: "styles/fonts" }
        ])
    ],
    resolve: {
        // alias: {
        //     "vue$": "vue/dist/vue.esm.js"
        // },
        extensions: [".ts", ".tsx", ".js", ".jsx", ".html", ".scss"]
    }
};