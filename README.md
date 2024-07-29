## 前言
hello 大家好，我是一个整天只知道敲代码的大学生，突出一个宅！如各位所见，这个项目是一个基于componsition API 的使用，利用[网易云音乐的AIP](http://193.112.200.228/docs/#/?id=neteasecloudmusicapi)构建的音乐网站vue3项目。

我呢是一个小白，因为兴趣的驱使下加入web开发这条道路，虽然前后还不足一年，但在自己的坚持下也算是收获良多(当然，和真正的大佬我算是小虾米)。

做这个项目的起因是在去年年底的刷b站的时候刷到了一个github项目，也就是《[bilibili](https://www.bilibili.com/video/BV1rA411s7oE/?vd_source=86ae9822d0bf0aaf135f5d17eb0bbf11)》, 顺着这个视频知道了这位大佬做的相关项目《[基于网易云音乐API实现PC端音乐网站](https://gitee.com/trtst/vue_pc_music)》，让当时学完Vue的我手痒痒，但奈何学务再身，实在抽不出时间。直到这个暑假，我终于可以做一个属于自己的音乐网站了。于是就有这上述这个的臃肿且时不时bug蹦出来的vue3项目。

## 适用人群
之所以分享出来，是为了让刚刚学完vue3，想找一个项目杀一杀实践一下的同学提供参考，各位大佬可以绕道走了。
## 效果展示
当然，也同样欢迎未接触过vue3的同学上手体验一下，感受一下Vue的魅力[在线预览](https://huizhou12.github.io/)

**说了这么多，也该切入主题了，这是一个内部充斥的大量注释的vue3项目，目的是为了让各位同学快速理解代码的作用以及理解功能是如何实现的，关于一些外部引入的组件，我也贴出了相应链接，供前往学习。**

## 项目目录
```js
├── node_modules      // npm依赖包
├── dist              // 项目build后的文件
├── public            // 存放静态资源（如图片、字体等）,在vite中不会把该文件作为项目入口
├── src               // 静态资源文件
│   ├── apis          // axios 封装及接口请求地址
│   ├── assets        // 公共资源静态文件
│   ├── components    // 公共组件
│   ├── router        // 路由
│   ├── store         // vue的状态管理
│   ├── utils         // 封装的工具
│   ├── views         // 项目的主要页面
│   ├── App.vue       // vue项目的主组件
│   └── main.js       // vue项目的主JS文件
├── .gitignore       // gitignore忽略文件
├── index.html       // vite入口文件
├── package.json     // node包管理文件
├── README.md        // 描述文件
└── vite.config.js   // vite的配置文件
```

## 技术栈
vite + vue3.x + vue-router + Pinia + element-plus + axio + less + swiper

## 下载相关
代码完全开源，供交流学习，下载在这里我就不细，我默认大家都会这个操作，祝大家学习愉快 如果觉得对各位同学有帮助，可以给个三连击，给个 star 支持一下也行，十分感谢各位！