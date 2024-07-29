<template >
    <el-header class="header">
        <div class="search">
            <el-input class="search-ipt" v-model="searchWord" placeholder="请输入歌名、歌词、歌手或专辑" clearable> </el-input>
        </div>
        <!-- 用户操作，登陆注册退出 -->
         <div class="user-info">
            <div class="logined" v-if="isLogin">
                <el-dropdown trigger="hover">
                    <el-image :src="accountInformation.avatarUrl" class="avatar"></el-image>
                     
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>Action 1</el-dropdown-item>
                            <el-dropdown-item>Action 2</el-dropdown-item>
                            <el-dropdown-item>Action 3</el-dropdown-item>
                            <el-dropdown-item >Action 4</el-dropdown-item>
                            <el-dropdown-item @click="logout">退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <div class="myself">
                    <a>{{ accountInformation.nickname }}</a>
                    <el-image v-if="isVip" :src="accountInformation.iconUrl" class="vipIcon"></el-image>
                </div>
            </div>
            <span class="login-btn" @click="loginHanlder" v-else>登录</span>
            <userLogin/>
         </div>
         <div class="change-theme">
            <!-- <div :class="['theme-box', {'active' : !playerSettingStore.themeMode}]" @click="changeTheme"> -->
            <div :class="['theme-box', {'active' : !changeValue}]" @click="changeTheme">
                <div class="theme-icon">
                    <i class="iconfont icon-light"></i>
                    <i class="iconfont icon-dark"></i>
                </div>
            </div>
         </div>
    </el-header>

</template>
<script>
import {computed, getCurrentInstance, onBeforeMount, ref} from 'vue';
import store from '../store/index.js';
export default {
    name:'WebHeader',
    setup() {
        const { proxy } = getCurrentInstance()
        const  searchWord = ref('');
        const loginDialog = store.loginDialogStore();
        const accountInfo = store.accountInfoStore();
        const playerSettingStore = store.playerSettingStore();

        const show = ref(true)


        //store的accountInfo文件中动态调用getLogin计算属性以及getAccrountInfo计算属性
        const isLogin = computed(() => { return accountInfo.getLogin})
        const accountInformation = computed(() => { return accountInfo.getAccrountInfo})
        const isVip = computed( () =>{ return accountInfo.getVipInfo})
        function loginHanlder() {
            loginDialog.loginDialogVisible = true;
        }
        function changeTheme() {
            // playerSettingStore.themeMode = !playerSettingStore.themeMode;
            // setThemeMode(playerSettingStore.themeMode);
            // playerSettingStore.getPlayerSetting('themMode', playerSettingStore.themeMode);
            show.value = !show.value
        }
        function setThemeMode(mode) {
            document.querySelector('html').className = mode? 'dark' : '';
        }

        onBeforeMount(() => {
            setThemeMode(playerSettingStore.themeMode);

        })

        //退出登录
        const logout = async () => {
            const {data:res } = await proxy.$http.logout();

            if(res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }
            proxy.$msg.success('退出成功')
            window.localStorage.removeItem('cookie')
            window.localStorage.removeItem('accountInfo');
            window.localStorage.removeItem('isLogin');
            window.localStorage.removeItem('isVip');
            accountInfo.logout();
            accountInfo.stopVipStatusChecker();
            window.location.reload();

        }




        const changeValue = computed(() => {
            return show.value
        })
    
        //退出登录
        return {
            searchWord,
            isLogin,
            accountInformation,
            loginHanlder,
            changeTheme,
            changeValue,
            proxy,
            logout,
            isVip
            
        }
        
    }
}
</script>
<style lang="less" scoped>
@import '../assets/less/global.less';

.header {
    position: fixed; //绝对定位，以整个页面作为视角
    right: 0;
    z-index: 98; // 叠层
    width: calc(100% - @menuWidth); // 动态计算页面的宽度函数calc() ，运算符前后要保留一个空格
    display:flex;
    padding: 0 @paddingW;
    justify-content: flex-end;
    align-items: center;
    height: 60px;
    background: var(--box-background);
    box-shadow: var(--t-modal-shadow);
}

.search {
    position: relative;



}

.user-info {
    padding: 0 0 0 20px;
    text-align: center;

    .avatar {
        display: inline-block;
        width: 30px;
        height: 30px;
        border-radius: var(--border-radius);//把头像变得圆润一点
        overflow: hidden;
        cursor: pointer;
    }

    .logined {
        display: flex;
        align-items: center;

        span {
            display: inline-block;
            font-weight: 300;
            padding: 0 10px;
            cursor: pointer;
        }

        .iconfont {
            color: var(--color-text-main);
            vertical-align: top;
        }
        .myself {
            display: flex;
            align-items: center; /* 确保所有子元素垂直居中对齐 */
            margin: 1px 0;
            padding: 0;
        }

        .myself a {
            cursor: pointer;
            color: #141414;
            margin: 0 5px;
            text-overflow: ellipsis;
            padding-right: 1px;
            font-size: 15px;
        }

        .myself a:hover {
            color: var(--t-primary-color);
            font-weight: 600;
        }

        .vipIcon {
            width: 43px; /* 固定宽度，或根据需要调整 */
            height: 17px; /* 固定高度，或根据需要调整 */
            display: inline-block;
            vertical-align: middle; /* 确保图片元素居中 */
        }


    }
    .login-btn {
            font-size: 16px;
            cursor: pointer;

            &:hover {
                color: var(--t-primary-color);
            }
        }

}

.change-theme {
    padding-left: 20px;

    .theme-icon{
        display: flex;
        justify-content: space-around;
    }
}

.theme-box {
    position: relative;
    width: 40px;
    height: 20px;
    line-height: 20px;
    border-radius: var(--border-radius);
    cursor: pointer;
    background: var(--btn-background);
    box-shadow: inset var(--t-modal-shaw);
    

    &::after {
        position: absolute;
        top: 2px;
        left: 2px;
        content: '';
        display: inline-block;
        width: 16px;
        height: 16px;
        border-radius: var(--border-radius);
        background: var(--box-background);
        transition: all .3s ease-in;
    }
    &.active {
        &::after {
            left: 100%;
            margin-left: -18px;
        }
    }
    .iconfont {
        width: 20px;
        text-align: center;
        transform: opacity .2s ease-in;
    }
 
}
    
</style>