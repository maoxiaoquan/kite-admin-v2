const { override, fixBabelImports, addWebpackAlias, addDecoratorsLegacy } = require('customize-cra');
const path = require("path")

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
  }),
  addWebpackAlias({ //路径别名
    "@": path.resolve(__dirname, "src"),
    "@libs": path.resolve(__dirname, "src/libs"),
    "@views": path.resolve(__dirname, "src/views"),
    "@utils": path.resolve(__dirname, "src/utils"),
    "@components": path.resolve(__dirname, "src/components")
  }),
  addDecoratorsLegacy()
);