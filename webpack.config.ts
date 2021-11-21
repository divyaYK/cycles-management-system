import path from "path";
import { Configuration, DefinePlugin } from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import StyleLintPlugin from "stylelint-webpack-plugin";
import autoprefixer from "autoprefixer";

const webpackConfig = (): Configuration => ({
	entry: "./src/index.tsx",
	...(process.env.production || !process.env.development
		? {}
		: { devtool: "eval-source-map" }),

	resolve: {
		extensions: [".ts", ".tsx", ".js"],
		plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })],
	},
	output: {
		path: path.join(__dirname, "/build"),
		filename: "build.js",
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: "ts-loader",
				options: {
					transpileOnly: true,
				},
				exclude: /build/,
			},
			{
				// Extract any SCSS content and minimize
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{ loader: "css-loader" },
					{
						loader: "postcss-loader",
					},
					{
						loader: "sass-loader",
						options: {
							implementation: require("sass"),
						},
					},
				],
			},
			{
				// Extract any CSS content and minimize
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{ loader: "css-loader" },
					{ loader: "postcss-loader" },
				],
			},
			{
				test: /\.(png|jpg|gif|svg|eot|ttf|woff)$/,
				use: [
					{
						loader: "file-loader",
					},
				],
			},
		],
	},
	devServer: {
		port: 3000,
		open: true,
		historyApiFallback: true,
	},
	plugins: [
		new HtmlWebpackPlugin({
			// HtmlWebpackPlugin simplifies creation of HTML files to serve your webpack bundles
			template: "./public/index.html",
		}),
		// DefinePlugin allows you to create global constants which can be configured at compile time
		new DefinePlugin({
			"process.env": process.env.production || !process.env.development,
		}),
		new ForkTsCheckerWebpackPlugin({
			// Speeds up TypeScript type checking and ESLint linting (by moving each to a separate process)
			eslint: {
				files: "./src/**/*.{ts,tsx,js,jsx}",
			},
		}),
		new StyleLintPlugin({
			configFile: ".stylelintrc",
			context: "src",
			files: "**/*.scss",
			failOnError: false,
			quiet: false,
		}),
		new MiniCssExtractPlugin({
			filename: "[name].bundle.css",
		}),
	],
});

export default webpackConfig;
