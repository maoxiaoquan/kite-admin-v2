const {
  override,
  fixBabelImports,
  addWebpackAlias,
  addDecoratorsLegacy,
} = require('customize-cra')
const path = require('path')

const rewiredMap = () => (config) => {
  config.devtool =
    config.mode === 'development' ? 'cheap-module-source-map' : false
  return config
}

const paths = require('react-scripts/config/paths')
const outpath = path.resolve('../kite/static/_admin')
paths.appBuild = outpath // 修改打包目录
module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
  }),
  addWebpackAlias({
    //路径别名
    '@': path.resolve(__dirname, 'src'),
    '@libs': path.resolve(__dirname, 'src/libs'),
    '@views': path.resolve(__dirname, 'src/views'),
    '@utils': path.resolve(__dirname, 'src/utils'),
    '@components': path.resolve(__dirname, 'src/components'),
  }),
  addDecoratorsLegacy(),
  // 关闭mapSource
  rewiredMap()
)
