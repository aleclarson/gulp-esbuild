const {Transform} = require('stream')
const {build} = require('esbuild')
const PluginError = require('plugin-error')
const Vinyl = require('vinyl')

const PLUGIN_NAME = 'gulp-esbuild'

module.exports = function(options = {}) {
	const entryPoints = options.entryPoints || []

	return new Transform({
		objectMode: true,
		transform(file, _, cb) {
			if (options.entryPoints) {
				return cb(null)
			}
			if (file.isBuffer() || file.isStream()) {
				entryPoints.push(file.path)
			}
			cb(null)
		},
		async flush(cb) {
			const params = {
				...options,
				entryPoints,
				write: false,
			}
			let data

			try {
				data = await build(params)
			} catch(err) {
				return cb(new PluginError(PLUGIN_NAME, err))
			}

			const {outputFiles} = data

			outputFiles.forEach(it => {
				const file = new Vinyl({
					path: it.path,
					contents: Buffer.from(it.contents),
				})

				this.push(file)
			})

			cb(null)
		},
	})
}
