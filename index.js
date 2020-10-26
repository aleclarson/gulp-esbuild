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

      const outputMaps =
        options.sourcemap == 'external' &&
        outputFiles.filter(file => file.path.endsWith('.map'))

      if (outputMaps) {
        outputFiles = outputFiles.filter(file => !outputMaps.includes(file))
      }

      outputFiles.forEach((file, i) => {
        const entryFile = entryFiles[i]
        this.push(createFile(file, entryFile))
        outputMaps && this.push(createFile(outputMaps[i], entryFile))
      })

      cb(null)
    },
  })

const createFile = (output, { base, cwd }) =>
  new Vinyl({
    path: output.path,
    contents: Buffer.from(output.contents),
    base,
    cwd,
  })
