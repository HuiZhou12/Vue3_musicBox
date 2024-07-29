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
app.use(router).use(ElementPlus).use(createPinia()).mount('#app');


//启动！vip检查器
const accountInfo = store.accountInfoStore();
if(accountInfo.isLogin === true){
    accountInfo.startVipStatusChecker();
}
