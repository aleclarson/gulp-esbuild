const { Transform } = require('stream')
const { build } = require('esbuild')
const PluginError = require('plugin-error')
const Vinyl = require('vinyl')

const PLUGIN_NAME = 'gulp-esbuild'

module.exports = function (options = {}) {
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
      if (!entryPoints.length) {
        return cb(null)
      }

      try {
        var data = await build({
          ...options,
          entryPoints,
          write: false,
        })
      } catch (err) {
        return cb(new PluginError(PLUGIN_NAME, err))
      }

      data.outputFiles.forEach(file =>
        this.push(
          new Vinyl({
            path: file.path,
            contents: Buffer.from(file.contents),
          })
        )
      )

      cb(null)
    },
  })
}
