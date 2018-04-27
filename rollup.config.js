import resolve from 'rollup-plugin-node-resolve'
import tsc from 'rollup-plugin-typescript2'
import commonjs from 'rollup-plugin-commonjs'

import pkg from './package.json'

export default {
    input: 'src/typescript/feather.ts',
    treeshake: false,
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            sourcemap: true,
            banner: `/* feather-ts v${pkg.version} */`,
            exports: 'named'
        },
        {
            file: pkg.module,
            format: 'es',
            sourcemap: true,
            banner: `/* feather-ts v${pkg.version} */`,
            exports: 'named'
        }
    ],
    plugins: [
        commonjs(),
        resolve({
            browser: true
        }),
        tsc({
            tsconfigOverride: {
                compilerOptions: {
                    "module": "ES2015",
                    "target": "es5",
                    "declaration": false
                },
                clean: true
            }
        }),
    ]
}
