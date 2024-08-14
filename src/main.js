import app from './utils/app';
import router from './router/index';
import './assets/less/global.less';
import ElementPlus, { ElMessage } from 'element-plus';
import 'element-plus/dist/index.css';
import { createPinia } from 'pinia';//引入pina ：详细请见：https://pinia.vuejs.org/
import * as getApis from './apis/http'
import utils from './utils/util';
import store from './store/index';



//绑定全局属性

app.config.globalProperties.$http = getApis;
app.config.globalProperties.$msg = ElMessage; 
app.config.globalProperties.$utils = utils; 

//全局启用相关功能
app.use(router).use(ElementPlus).use(createPinia()).use(router).mount('#app');

//动态网站名
router.beforeEach((to, from, next) => { //路由守卫：在每次路由变化之前执行，to：标识即将进入目标路由对象 from：标识当前导航正要离开的路由对象
    document.title = to.meta.title || 'Vue3 | Musicbox';
    next(); //放行
  });

//启动！vip检查器
const accountInfo = store.accountInfoStore();
//前提要有vip才检测
if(accountInfo.isLogin === true){
    accountInfo.startVipStatusChecker();
}
