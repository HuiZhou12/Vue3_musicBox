import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()], //用于指定 Vite 应用的插件
  resolve: { //自定义模块解析
      alias: { //别名
        '@': resolve(__dirname, 'src'), //参考node.js的path.resolve方法，指定@为src文件
      },
  },
});
