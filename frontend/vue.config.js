const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer:{
    client: {
      overlay: {
        runtimeErrors: (error) => {
          const ignoreErrors = [
            "ResizeObserver loop limit exceeded",
            "ResizeObserver loop completed with undelivered notifications.",
          ];
          return !ignoreErrors.includes(error.message);

        },
      },
    },
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
