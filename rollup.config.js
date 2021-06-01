import dts from 'rollup-plugin-dts';
import pluginNodeResolve from "@rollup/plugin-node-resolve";

const name = 'mime';

import typescript from '@rollup/plugin-typescript';

export default [{
    input: 'src/index.ts',
    output: {        
        file: `lib/index.js`,
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
        file: `lib/index.mjs`,
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