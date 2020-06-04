module.exports = {
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^~/(.*)$": "<rootDir>/$1",
    "^vue$": "vue/dist/vue.common.js",
  },
  preset: "@vue/cli-plugin-unit-jest/presets/typescript",
  collectCoverage: false,
  collectCoverageFrom: [
    "<rootDir>/components/**/*.vue",
    "<rootDir>/pages/**/*.vue",
  ],
};
