import typescript from 'rollup-plugin-typescript';
import {uglify} from 'rollup-plugin-uglify';
import nodeResolve from 'rollup-plugin-node-resolve';
import {minify} from 'uglify-es';

export default {
  input: './src/index.ts',
  output: {
    file: 'dist/bundle/fog.js',
    format: 'umd',
    name: 'fog',
    exports: 'default',
    sourcemap: true
  },
  plugins: [
    typescript({
      typescript: require('typescript'),
    }),
    nodeResolve({jsnext: true, main: true}),
    uglify({}, minify)
  ],
}