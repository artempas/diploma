const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer:{
    proxy:{
      '^/api':{
        changeOrigin:true,
        target: process.env.VUE_APP_API_URL,
        logLevel: 'debug',
        pathRewrite:{
          '^/api':'/'
        }
      }
    }
  }
})
