import store from "@/store/index";
import { getCurrentInstance, reactive, watch, watchEffect, toRefs } from "vue";

export default function qr(type) {
    const { proxy } = getCurrentInstance();
    const accountInfo = store.accountInfoStore();
    const loginDialogStore = store.loginDialogStore();
    const info = reactive({
        unikey: '',    //二维码生成的key
        oSrc: '',       //生成的二维码图片
        isShowExpired: true, //二维码是否过期
        timer: null,  //定时器，轮流询问扫码状态
        loading: true //是否为处于加载状态
    })


    
    //获取二维码登录需要的key
    //async function name(param0, param1)
    const getQRkey = async () => { //声明一下函数为异步函数
        //await关键字的作用就是暂停函数的执行，等待异步操作，直到操作完成
        const {data: res } = await proxy.$http.getQRkey();
        //上面的赋值方式为解构赋值,也就是从对象或数组中提取相关值，而不是普通的变量


        if(res.code !== 200){
            proxy.$msg.error(res.message)
        } else {
            info.unikey = res.data.unikey;

        }
    };
    //根据获取的key，生成二维码图片
    const createQRkey = async () => { 
        const {data: res } = await proxy.$http.createQR({key:info.unikey});


        if(res.code !== 200){
            proxy.$msg.error(res.message)
        } else {
            info.isShowExpired = false;
            info.oSrc = res.data.qrimg;
        }
    };

    //轮流查询扫码的状态接口
    const checkQR = async ()  => {
        const {data: res } = await proxy.$http.checkQR({key: info.unikey})

        return res;
    };

    //获取登录状态及用户信息
    const getQRLogin = async (cookie) => {
        const { data: res } = await proxy.$http.getQRLogin({ cookie });
        if(res.data.code !== 200){
            proxy.$msg.error(res.message)
        } else {
            //判断当前用户是否为vip
            const { data: isvip } = await proxy.$http.getVip();
            if( isvip.data.associator.expireTime >= Date.now()) {
                window.localStorage.setItem('isVip', true);
                accountInfo.$patch({
                    isVip:true
                });
            }


            //获得含两个源对象属性的新对象 info
            const info = Object.assign({}, res.data.account, res.data.profile, isvip.data.associator || {});

            window.localStorage.setItem('isLogin', true);
            window.localStorage.setItem('accountInfo', JSON.stringify(info));
            window.localStorage.setItem('cookie', cookie);
            accountInfo.$patch({
                isLogin:true,
                accountInfo: info
            });
            accountInfo.startVipStatusChecker();
            loginDialogStore.loginDialogVisible = false;
            window.location.reload();
        }
    }
//下列为函数的调用要求

    //实现每3秒查询扫码的状态，以防止二维码过期不更新
    const login = () => {
        clearInterval(info.timer);
        info.timer = setInterval(async () => {
            const stateRes = await checkQR();
            
            //二维码过期
            if(stateRes.code === 800) {
                clearInterval(info.timer);
                info.isShowExpired = true;
            }

            //扫码授权成功，返回cookie ,回调getQRLogin
            if(stateRes.code === 803) {
                clearInterval(info.timer);
                getQRLogin(stateRes.cookie);
            }
        }, 3000);
        
    }

    //当响应式数据发生变化的时候，该函数就会被执行
    watchEffect( () => {
        if(info.unikey) {
            createQRkey();
            info.loading = false;
            login()
        }
    });

    watch(() => loginDialogStore.loginDialogVisible, (newFlag) => {
        if (type == 'qr' && newFlag) {
            info.loading = true;
            getQRkey();
        }
    })

    return {
        ...toRefs(info),
        login,
        getQRkey
    }


}

