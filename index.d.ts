/// <reference types="node" />

import * as stream from 'stream'

type Format = 'iife' | 'cjs' | 'esm'
type Strict = 'nullish-coalescing' | 'optional-chaining' | 'class-fields'
type Platform = 'browser' | 'node'
type Charset = 'ascii' | 'utf8'

interface CommonOptions {
  target?: string | string[]
  format?: Format
  sourcemap?: boolean | 'inline' | 'external'
  strict?: boolean | Strict[]

  minify?: boolean
  minifyWhitespace?: boolean
  minifyIdentifiers?: boolean
  minifySyntax?: boolean
  charset?: Charset

  jsxFactory?: string
  jsxFragment?: string
}

interface BuildOptions extends CommonOptions {
  platform?: Platform
  tsconfig?: string
  inject?: string[]
}

declare const gulpEsbuild: (options: BuildOptions) => stream.Transform
export = gulpEsbuild
