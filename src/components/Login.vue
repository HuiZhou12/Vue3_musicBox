<template>
    <div class="login">
        <!-- 以下为element-plus对话框的元素及元素属性 -->
        <el-dialog
            v-model="loginDialogStore.loginDialogVisible"
            custom-class="login-container"
            :before-close="loginCloseHander"
            :show-close="false"
            center
            width="300px"
        >
        <div class="login-main">
            <!-- 二维码登录 -->
            <div class="login-qr" v-show="dynamicLogin == 'qr'">
                <div class="login-title">扫码登录</div>
                <div class="qr-tips">使用 网易云音乐APP 扫码登录</div>
                <div :class="['qr-main', {'qr-expired' : isShowExpired && !loading}]">
                    <div class="qr-img">
                        <img v-show="oSrc" :src="oSrc" alt="扫码登录">
                    </div>
                    <span class="qr-expired-btn" v-show="isShowExpired && !loading" @click="refreshQR">二维码过期，点击刷新</span>
                    <div class="loadQR" v-loading="loading" v-show="loading && !oSrc"></div>
                </div>
            </div>

            <!-- 邮箱密码登录 -->
            <div class="login-pwd" v-show="dynamicLogin == 'pwd'">
                <div class="login-title">邮箱密码登录</div>
                <div class="pwd-main">
                    <el-form
                        class="login-form"
                        :model="loginForm"
                        :rules="loginFormRules"
                        ref="loginFormRef"
                    >
                        <!-- 邮箱 -->
                        <el-form-item prop="email">
                            <el-input class="login-ipt" v-model="loginForm.email" type="text" autocomplete="off" placeholder="请输入登录邮箱" clearable/>
                        </el-form-item>
                        <!-- 密码 -->
                         <el-form-item prop="password">
                            <el-input class="login-ipt" v-model="loginForm.password" type="text" autocomplete="off" placeholder="请输入密码" clearable/>
                         </el-form-item>
                         <p class="forgetPwd">忘记密码？</p>
                         <el-form-item>
                            <el-button class="login-submit" type="primary" @click="submitForm" color="#11b0a0">登录</el-button> 
                         </el-form-item>
                    </el-form>   
                </div>
            </div>

            <!-- 手机号登录 -->
            <div class="login-phone" v-show="dynamicLogin == 'phone'">
                <div class="login-title">手机号快捷登录</div>
                <div class="phone-main">
                    <el-form
                        class="login-form"
                        ref="loginFormPhoneRef"
                        :model="loginFormPhone"
                        :rules="loginFormPhoneRules"
                    >
                        <el-form-item prop="phone">
                            <el-select class="select-code" v-model="loginFormPhone.ctcode">
                                <el-option v-for="item in countrycode" :key="item.value" :lable="item.value" :value="item.value">
                                    <span>{{ item.label }}</span>
                                    <span>{{ item.value }}</span>
                                </el-option>
                            </el-select>
                            <el-input class="login-ipt" v-model="loginFormPhone.phone" clearable type="text" placeholder="请输入手机号" />
                        </el-form-item>
                        <!-- 验证码 -->
                         <el-form-item prop="captcha" :error="errorMsg">
                            <el-input class="login-ipt"  v-model="loginFormPhone.captcha" clearable type="text" placeholder="请输入验证码" />
                            <span class="code-btn" @click="getCaptcha">
                                <template v-if="countdown >= 0">
                                    {{countdown}}s
                                </template>
                                <template v-else>
                                    获取验证码
                                </template>
                            </span>
                         </el-form-item>
                         <el-button class="login-submit"  @click="submitPhoneForm" type="primary" color="#11b0a0">登录</el-button> 
                    </el-form>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="login-footer">
                <span class="login-btn selectQR" v-show="dynamicLogin != 'qr'" @click="switchLogin('qr')">APP扫码登录</span>
                <span class="login-btn selectPwd" v-show="dynamicLogin != 'pwd'" @click="switchLogin('pwd')">账号密码登录</span>
                <span class="login-btn selectPhone" v-show="dynamicLogin != 'phone'" @click="switchLogin('phone')">手机号快捷登录</span>
            </div>
        </template>
        </el-dialog>
    </div>
</template>
<script>
import qr from '../assets/js/login/qr';
import pwd from '../assets/js/login/pwd'
import phone from '../assets/js/login/phone'
import countrycode from '../assets/js/countrycode';
import store from '../store/index';
import { computed, ref} from 'vue';

export default {
    name:'userLogin',

    setup(){
        
        const loginType = ref('qr') //登录方式， 默认为二维码登录
        const loginDialogStore = store.loginDialogStore();

        //登录方式
        const { oSrc, isShowExpired, timer, login, getQRkey, loading } = qr(loginType.value); // 二维码
        const { loginForm, loginFormRef, loginFormRules, submitForm } = pwd(); // 账号密码
        const { loginFormPhone, loginFormPhoneRef, loginFormPhoneRules, getCaptcha, countdown, submitPhoneForm, errorMsg } = phone(); // 手机号

        //切换登录方式
        const switchLogin = function(type) {
            loginType.value = type;
            //切换登录方式时候，二维码不再轮流查询用户状态是否扫码，减少请求量
            clearInterval(timer.value);

            //当为扫码时，重启轮流查询
            if(type == 'qr') {
                //如果二维码过期了，渲染新的二维码，否则可以继续沿用二维码，
                if(isShowExpired.value) {
                    getQRkey();
                } else {
                    login();
                }
            }
        }

        //动态登录方式的切换
        const dynamicLogin = computed( () => {
            return loginType.value
        })


        //登录弹窗关闭前的事件回调
        const loginCloseHander = (done) => {
            //清理二维码轮询定时请求
            clearInterval(timer.value)
            done()
        }
        // 当二维码重新过期后，点击刷新一下二维码
        const refreshQR = () => {
            loading.value = true;
            getQRkey();
}

        return {
            loginDialogStore,
            refreshQR,
            loginCloseHander,
            switchLogin,
            oSrc,
            isShowExpired,
            loading,
            dynamicLogin,
            loginForm,
            loginFormRules,
            loginFormRef,
            submitForm,
            loginFormPhone,
            loginFormPhoneRef,
            loginFormPhoneRules,
            submitPhoneForm,
            countrycode,
            errorMsg,
            getCaptcha,
            countdown
        }
    }
}

</script>
<style lang="less" scoped>
@import '../assets/less/global.less';
.login {
    :deep(.login-container) {
        width: 300px;
    }
    :deep(.el-dialog__body),
    :deep(.el-dialog__footer) {
        padding: 0;
    }
}
.login-main {
    height: 250px;
    padding: 0 25px;

    .login-title {
        padding-bottom: 10px;
        font-size: 18px;
        line-height: 18px;
        font-weight: 500;
        color: var(--t-text-color);
    }
}
.login-qr {
    .qr-tips {
        font-size: 12px;
        line-height: 12px;
        color: var(--t-muted-color);
    }

    .qr-main {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 210px;
    }

    .qr-img {
        position: relative;
        display: inline-block;
        font-size: 0;
    }

    .qr-expired {

        .qr-img {

            img {
                opacity: .3;
            }

            &::after {
                display: block;
                content: '';
                position: absolute;
                top: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, .7);
            }
        }

        .qr-expired-btn {
            position: absolute;
            z-index: 2;
            width: 180px;
            height: 180px;
            line-height: 180px;
            text-align: center;
            color: var(--white-color);
            cursor: pointer;
        }
    }

    .loadQR {
        position: absolute !important;
        width: 180px;
        height: 180px;
        

    }
}
.el-loading-spinner {
    color: var(--t-primary-color);
}
.el-select-dropdown__item {
    display: flex;
    justify-content: space-between;
}

.pwd-main {
    padding-top: 20px;
}

.phone-main {
    padding-top: 20px;
    .login-ipt {
        flex: 1;
    }
}

.login-ipt {
    line-height: 40px;
    border-bottom: 1px solid var(--t-light-color);

    :deep(.el-input__wrapper) {
        box-shadow: none;
        line-height: 38px;
        height: 38px;
        padding: 0;
    }

    ::placeholder {
        font-weight: 300;
        color: var(--t-light-color);
    }

    ~ :deep(.el-form-item__error) {
        padding-top: 5px;
    }
}

.select-code {
    width: 65px;
    padding-right: 10px;
    border-bottom: 1px solid var(--t-light-color);

    :deep(.el-input__wrapper) {
        width: 75px;
        box-shadow: none!important;
        line-height: 38px;
        height: 38px;
        padding: 0;
    }

    :deep(.el-input.is-focus .el-input__wrapper) {
        box-shadow: none!important;
    }
}

.code-btn {
    width: 100px;
    line-height: 39px;
    margin-left: 10px;
    text-align: center;
    cursor: pointer;
    background: #f0f0f0;

    &:hover {
        text-decoration: underline;
    }
}

.forgetPwd {
    height: 18px;
    line-height: 18px;
    margin-top: -5px;
    text-align: right;
    font-size: 12px;
    color: #909090;
}
.login-submit {
    width: 100%;
    margin-top: 20px;
    border-radius: 0;
    font-weight: 300;
}

.login-footer {
    display: flex;
    justify-content: space-between;
    padding: 10px 25px 20px;

    .login-btn {
        cursor: pointer;
    }
}
</style>