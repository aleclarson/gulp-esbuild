const { Transform } = require('stream')
const { transform } = require('esbuild')
const PluginError = require('plugin-error')
const Vinyl = require('vinyl')

const PLUGIN_NAME = 'gulp-esbuild'

module.exports = (options = {}) =>
  new Transform({
    objectMode: true,
    async transform(file, _, cb) {
      if (!file.isBuffer()) {
        return cb(null)
      }

      const input = file.contents.toString('utf8')
      try {
        var output = await transform(input, {
          ...options,
          sourcefile: file.path,
          loader: file.extname.slice(1),
        })
      } catch (err) {
        return cb(new PluginError(PLUGIN_NAME, err))
      }

      const outPath = file.path.replace(/\.ts(x)?$/, '.js$1')
      this.push(createFile(outPath, output.js, file))

      if (options.sourcemap == 'external') {
        const mapPath = outPath + '.map'
        this.push(createFile(mapPath, output.jsSourceMap, file))
      }

      cb(null)
    },
  })

const createFile = (filePath, contents, { base, cwd }) =>
  new Vinyl({
    path: filePath,
    contents: Buffer.from(contents),
    base,
    cwd,
  })
