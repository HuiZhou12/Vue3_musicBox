import { getCurrentInstance, reactive, ref } from "vue";
import store  from "@/store/index";

export default function pwd() {
    const { proxy } = getCurrentInstance();
    const accountInfo = store.accountInfoStore();
    const loginDialogStore = store.loginDialogStore();
    
    //从表单输入邮箱和密码

    const loginForm = reactive({
        email: '',
        password: ''
    });

    //邮箱的正则验证
    const emailVerify = (rule, value, callback) => {
        const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

        if(value === '') {
            callback(new Error('请输入登录邮箱'));
        } else if(reg.test(value)) {
            callback(new Error('登录邮箱的格式错误，请重新输入'));
        } else {
            callback()
        }
    }
    //表单验证规则
    const loginFormRules = {
        email: [{ required: true, validator:emailVerify, trigger: 'blur'}],
        password: [{ required:true, message: '请输入网易密码', tirgger: 'blur'}]
    };
    //获取表单ref ,没有实际意义，只是充当请求接口的舞台
    const loginFormRef = ref()

    //提交表单
    const submitForm = () => {
        if(!loginFormRef.value) return; 
        //validate 会校验表单的整个属性,只要你给这个字段设置上了
        loginFormRef.value.validate(async function(valid) {
            if(valid) {
                const {data: res } = await proxy.$http.loginPwd(loginForm);

                if(res.code !== 200) {
                    proxy.$msg.error(res.message)
                } else {
                    const info = Object.assign({}, res.data.account, res.data.profile);

                    window.localStorage.setItem('isLogin', true);
                    window.localStorage.setItem('accountInfo', JSON.stringify(info));
                    window.localStorage.setItem('cookie', res.data.cookie)
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
        loginForm,
        loginFormRef,
        loginFormRules,
        submitForm,
    }
}