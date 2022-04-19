import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/zhqn': {
        target: 'http://qndxx.zua.edu.cn',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/zhqn/, '')
      },
      '/static': {
        target: 'http://qndxx.zua.edu.cn',
        changeOrigin: true
      },
      '/lessonlist': {
        target: 'http://hnqndaxuexi.dahejs.cn/stw/news/list',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/lessonlist/, '')
      },
      '/zqauth': {
        target: 'http://qndxx.zua.edu.cn/tuanwei/check',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/zhqnauth/, ''),
        headers: {
          refer: 'http://qndxx.zua.edu.cn'
        }
      },
      '/lessonroot': {
        target: 'https://h5.cyol.com/special/daxuexi',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/lessonroot/, '')
      }
    }
  }
})
