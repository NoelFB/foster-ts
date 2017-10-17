import typescript from 'rollup-plugin-typescript2';

let override = { compilerOptions: { declaration: false } };

export default 
{
    input: './src/index.ts',

	output: [
		{
			format: 'umd',
			name: 'THREE',
			file: 'build/foster.js'
		},
		{
			format: 'es',
			file: 'build/foster.module.js'
		}
	],

    plugins: [
        typescript({ tsconfigOverride: override })
    ]
};