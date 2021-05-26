import dts from 'rollup-plugin-dts';
// import esbuild from 'rollup-plugin-esbuild';

const name = require('./package.json').main.replace(/\.js$/, '');

// const bundle = config => ({
//   ...config,
//   input: 'src/index.ts',
//   external: id => !/^[./]/.test(id),
// });

// export default [
//   bundle({
//     plugins: [ esbuild() ],
//     output: [
//       {
//         file: `${name}.js`,
//         format: 'cjs',
//         sourcemap: true,
//       },
//       {
//         file: `${name}.mjs`,
//         format: 'es',
//         sourcemap: true,
//       },
//     ],
//   }),
//   bundle({
//     plugins: [ dts({tsconfig: 'tsconfig.lib.json'}) ],
//     output: {
//       file: `${name}.d.ts`,
//       format: 'es',
//     },
//   }),
// ];

import typescript from '@rollup/plugin-typescript';

export default [{
    input: 'src/index.ts',
    output: {        
        file: `dist/${name}.js`,
        name,
        format: 'cjs'
    },
    plugins: [typescript({       
        tsconfig: './tsconfig.lib.json',
        declaration: false
    })]
},{
    input: 'src/index.ts',
    output: {        
        file: `dist/${name}.mjs`,
        format: 'es'
    },
    plugins: [typescript({        
        tsconfig: './tsconfig.lib.json',
        declaration: false
    })]
},{
    input: 'src/index.ts',    
    output: {                
        file: 'dist/index.d.ts',
    },
    plugins: [typescript({
        declarationDir: 'dist',
        tsconfig: './tsconfig.lib.json',        
    }), dts()]
}]