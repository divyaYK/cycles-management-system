module.exports = {
	plugins: [
		require("postcss-preset-env")({
			features: { "nesting-rules": false },
		}),
		require("tailwindcss"),
		require("tailwindcss/nesting")(require("postcss-nesting")),
		require("postcss-import"),
		require("autoprefixer"),
	],
};
