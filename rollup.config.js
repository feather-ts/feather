import resolve from 'rollup-plugin-node-resolve'
import tsc from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'
import commonjs from 'rollup-plugin-commonjs'
import url from 'rollup-plugin-url'

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
        }
    ],
    plugins: [
        resolve(),
        postcss(),
        url(),
        tsc({
            tsconfigOverride: {
                compilerOptions: {
                    "module": "ES2015",
                    "target": "es5",
                    "declaration": true,
                },
                clean: true
            }
        }),
        commonjs()
    ]
}
