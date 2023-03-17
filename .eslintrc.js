/** @type {import('eslint').Linter.Config} */
const config = {
    ignorePatterns: ["**/node_modules/**", "**/dist/**", "**/test/**"],
    extends: ["iamyth/preset/node"],
    root: true,
    overrides: [
        {
            files: ["**/nest/src/**/*.ts"],
            rules: {
                "@typescript-eslint/ban-types": "off",
            },
        },
    ],
    rules: {
        "@typescript-eslint/member-ordering": "off",
    },
};

module.exports = config;
