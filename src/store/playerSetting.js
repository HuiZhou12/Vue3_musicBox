import { defineStore } from "pinia";

//从本地存储中拿出播放器的相关设置参数
const playerSettingInfo = JSON.parse(window.localStorage.getItem('player-setting')) || {};

export const playerSettingStore = defineStore('playerSetting', {
    state: () => {
        return{
            mode: playerSettingInfo.mode || 0, //播放模式 0循环播放、1单曲循环、2随机播放(Buttombox.vue)
            //如果 playerSettingInfo.volume 存在且不为 null 或 undefined，则使用其值作为音量；否则，将音量设置为 .8。
            //用人话说就是设置一个初始默认值。
            volume: playerSettingInfo.volume ?? .8, // 播放音量
            lock:playerSettingInfo.lock || false, //播放条是否固定
            themeMode: playerSettingInfo.themeMode, //网站配色
        }
    },
    getters: {
        getMode: (state) => {
            return state.mode;
        },
        getVolume: (state) => {
            return state.volume;
        },
        getLock: (state) =>{
            return state.lock;
        },
        getThemeMode: (state) =>{
            return state.themeMode;
        }
    },
    actions: {
        setPlayerSetting(type, val) {
            const info = JSON.parse(window.localStorage.getItem('player-setting')) || {};
            info[type] = val;//动态设置info属性，他不是数组
            window.localStorage.setItem('player-setting', JSON.stringify(info));
        }
    }

})