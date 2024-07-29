import { getCurrentInstance, nextTick, reactive, ref } from "vue";
import store from '@/store/index';

export default function phone() {
    const { proxy } = getCurrentInstance();
    const accountInfo = store.accountInfoStore();
    const loginDialogStore = store.loginDialogStore();

    //表单输入手机号与验证码
    const loginFormPhone = reactive({
        phone: '',     //手机号
        ctcode: '+86', //国家码
        captcha: ''    //验证码
    });

    const phoneVerify = (rule, value, callback) => {
        const reg = /^1[3456789]\d{9}$/;

        if(value === '') {
            callback(new Error('请输入手机号'));
        } else if(reg.test(value)) {
            callback(new Error('手机号格式错误，请重新输入'));
        } else {
            callback()
        }
    };

    const loginFormPhoneRules = {
        phone: [{ required: true, validator:phoneVerify, trigger: 'blur'}],
        captcha: [{ required:true, message: '验证码不能为空', tirgger: 'blur'}]
    };
    const loginFormPhoneRef = ref();
    
    let countdown = ref(-1); //验证码倒计时
    let timer = ref(); //定时器
    let errorMsg = ref(); //返回错误信息

    //获取验证码
    const getCaptcha = () => {
        if( countdown.value >=0) return;
        //验证单个字段validateField(验证的字段，回调函数，验证成功返回true，反之false)
        loginFormPhoneRef.value.validateField('phone', async (vaild) => {
            if(vaild){
                countHandler();
                const {data: res }  = await proxy.$http.sentCode(loginFormPhone);
                
                if(res.code !== 200) {
                    proxy.$msg.error(res.message)
                }
            }
        });
    };

    //验证码倒计时
    const countHandler = () => {
        countdown.value = 10;
        clearInterval(timer.value);

        timer.value = setInterval( () =>{
            if(countdown.value) {
                --countdown.value;
            } else {
                clearInterval(timer.value);
                countdown.value = -1
            }
        },1000 )
    };

    //登录
    const submitPhoneForm= () => {
        loginFormPhoneRef.value.validate(async (vaild) => {
            if(vaild) {
                const {data: res } = await proxy.$http.loginPwd(loginFormPhone);

                if(res.code !== 200) {
                    //在错误信息更新以后，自动执行该函数，以避免错误信息和实际错误描述不符
                    nextTick(()=> {
                        errorMsg.value = res.message;
                    })
                } else {
                    const info = Object.assign({}, res.account, res.profile);

                    window.localStorage.setItem('isLogin', true);
                    window.localStorage.setItem('accountInfo', JSON.stringify(info));
                    window.localStorage.setItem('cookie', res.cookie)
                    accountInfo.$patch({
                        isLogin: true,
                        accountInfo: info
                        });
                        loginDialogStore.loginDialogVisible = false;
                        window.location.reload();
                }
            }
        })
    }
    
    return {
        loginFormPhone,
        loginFormPhoneRef,
        loginFormPhoneRules,
        countdown,
        getCaptcha,
        errorMsg,
        submitPhoneForm
    }
}
