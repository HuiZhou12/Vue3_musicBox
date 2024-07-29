import { defineStore } from "pinia";


export const loginDialogStore =  defineStore('loginDialog',{
    state: () => {
        return {
            loginDialogVisible: false, //登录弹床是否可见，这里默认为不可见
        }
    },
    getters: {},
    actions: {
        setLoginVisible(val) {
            //this的指向规则和vue2一样
            this.loginDialogVisible = val;
        }
    }
    
})