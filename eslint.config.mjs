import preactConfig from 'eslint-config-preact';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
    ...preactConfig,
    prettierRecommended,
    {
        settings: {
            jest: {
                version: 27
            }
        },
        ignores: ["build/*"]
    }
];
