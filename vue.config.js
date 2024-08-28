module.exports = {
    pwa: {
      name: 'TETRIS',
      themeColor: '#42b983',
      manifestOptions: {
        background_color: '#ffffff'
      }
    },
    // 如果需要，将 `static` 目录中的文件复制到 `dist` 目录中
    configureWebpack: {
      plugins: [
        new CopyWebpackPlugin({
          patterns: [
            { from: 'static', to: '' }
          ]
        })
      ]
    }
  }
  