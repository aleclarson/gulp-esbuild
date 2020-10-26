const { Transform } = require('stream')
const { build } = require('esbuild')
const PluginError = require('plugin-error')
const Vinyl = require('vinyl')

const PLUGIN_NAME = 'gulp-esbuild'

module.exports = (options = {}) =>
  new Transform({
    objectMode: true,
    async transform(file, _, cb) {
      if (file.isDirectory()) {
        return cb(null)
      }

      try {
        var { outputFiles } = await build({
          logLevel: 'silent',
          outdir: file.dirname,
          ...options,
          entryPoints,
          write: false,
        })
      } catch (err) {
        return cb(new PluginError(PLUGIN_NAME, err))
      }

      outputFiles.forEach(file =>
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
