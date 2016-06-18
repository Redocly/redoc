import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

class RollupNG2 {
  constructor(options) {
    this.options = options;
  }
  resolveId(id, from) {
    if (id.startsWith('rxjs/')) {
      return `${__dirname}/node_modules/rxjs-es/${id.replace('rxjs/', '')}.js`;
    }
    
    if(id.startsWith('@angular/core')){
            if(id === '@angular/core'){
                return `${__dirname}/node_modules/@angular/core/esm/index.js`;
            }
            return `${__dirname}/node_modules/@angular/core/esm/${id.split('@angular/core').pop()}.js`;
        }
    if(id.startsWith('@angular/common')){
        if(id === '@angular/common'){
            return `${__dirname}/node_modules/@angular/common/esm/index.js`;
        }
        return `${__dirname}/node_modules/@angular/common/esm/${id.split('@angular/common').pop()}.js`;
    }
    if(id.startsWith('@angular/platform-browser-dynamic')){
        if(id === '@angular/platform-browser-dynamic'){
            return `${__dirname}/node_modules/@angular/platform-browser-dynamic/esm/index.js`;
        }
        return `${__dirname}/node_modules/@angular/platform-browser-dynamic/esm/${id.split('@angular/platform-browser-dynamic').pop()}.js`;
    }
    if(id.startsWith('@angular/platform-browser')){
        if(id === '@angular/platform-browser'){
            return `${__dirname}/node_modules/@angular/platform-browser/esm/index.js`;
        }
        return `${__dirname}/node_modules/@angular/platform-browser/esm/${id.split('@angular/platform-browser').pop()}.js`;
    }
  }
}

const rollupNG2 = (config) => new RollupNG2(config);
export default {
 entry: './.tmp-es/index.js',
 dest: 'dist/vendor.es2015.js',
 format: 'iife',
 moduleName: 'ReDoc',
 plugins: [
   //typescript(),
   rollupNG2(),
   nodeResolve({ jsnext: true, main: true, browser: true }),
   commonjs({
      // non-CommonJS modules will be ignored, but you can also
      // specifically include/exclude files
      include: 'node_modules/**',  // Default: undefined
      exclude: [ 'node_modules/@angular/**', 'node_modules/rxjs/**', 'node_modules/rxjs-es/**' ],  // Default: undefined
      namedExports: { 'marked': ['marked'] }  // Default: undefined 
    })
 ]
}