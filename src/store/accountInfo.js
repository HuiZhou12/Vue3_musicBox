
import { defineStore } from "pinia";
import { getVip } from '../apis/http'



//efineStore()第一个参数要传入一个独一无二的名字id
export const accountInfoStore = defineStore('account_info', {
    //相当于vue2里的data
    state: () => {
        return {
            isLogin: false, //用户的登录状态
            accountInfo: null, // 登录用户信息
            isVip: false, //是否为vip用户
            expireTime: null, // vip 过期时间
            checkVip: null //定时器
        }

    },
    //相当于vue2里的computed
    getters: {
        getLogin: () =>{
            //有数据就为真，没数据就为假
            return JSON.parse(window.localStorage.getItem('isLogin')) || false;
        },
        getAccrountInfo: (state) => {
            return state.accountInfo || JSON.parse(window.localStorage.getItem('accountInfo')|| '{}');
        },
        getVipInfo : () => {
            return JSON.parse(window.localStorage.getItem('isVip')) || false;
        },
    },
    //相当于vue2里的methods
    actions: {
        logout() {
            this.$patch({ //允许对state进行部分更新
                isLogin: false,
                accountInfo: null,
                isVip:false,
                expireTime: null,
            })
        },
        //检查vip状态
        async checkVipStatus(){
            try {
                const { data: isvip } = await getVip();
                if( isvip.data.associator.expireTime >= Date.now()) {
                    this.$patch({
                        isVip:true,
                        expireTime: isvip.data.associator.expireTime || null,
                    });
                    console.log('执行到这里')
                    window.localStorage.setItem('isVip', true)
                } else {
                    this.$patch({
                        isVip: false,
                        expireTime: null,
                    });
                    window.localStorage.setItem('isVip', false)
                }
            } catch (error) {
                console.error('检查vip状态出错:',error);
            }
        },
        
        startVipStatusChecker() {
            this.checkVipStatus();
            //60秒检查一次
             this.checkVip = setInterval(this.checkVipStatus, 60000)
        },

        stopVipStatusChecker() {
            clearInterval(this.checkVip);
            this.checkVip = null
        }
        
        

    }
})