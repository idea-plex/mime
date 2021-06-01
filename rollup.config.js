import dts from 'rollup-plugin-dts';
import pluginNodeResolve from "@rollup/plugin-node-resolve";

// import esbuild from 'rollup-plugin-esbuild';

const name = 'mime';

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
        file: `lib/${name}.js`,
        name,
        format: 'cjs'
    },
    plugins: [typescript({       
        tsconfig: './src/tsconfig.json',
        declaration: false
    })]
},{
    input: 'src/index.ts',
    output: {        
        file: `lib/${name}.mjs`,
        format: 'es'
    },
    plugins: [typescript({        
        tsconfig: './src/tsconfig.json',
        declaration: false
    })]
},{
    input: 'src/index.ts',    
    output: {                
        file: 'lib/index.d.ts',
    },
    plugins: [typescript({
        declarationDir: 'lib',
        tsconfig: './src/tsconfig.json',        
    }), dts()]
}]