import { defineStore } from "pinia";
import utils from "@/utils/util";
import { accountInfoStore }  from './accountInfo.js';
import { computed } from "vue";


const isVip = computed(() =>{
    return accountInfoStore().getVipInfo
}) 

//合并歌曲到播放列表查看
const concatPlayList = (list, playList = []) => {
    // filter过滤无版权及vip歌曲
    if(!isVip.value){
        console.log(isVip.value)
        return utils.concatPlayList(list.filter(item => { return !item.license && !item.vip}), playList)
    } else {
        return utils.concatPlayList(list, playList)
    }
    
}
//当前音乐在播放列表的索引
const findIndex = (list, playList) => {
    return playList.findIndex(d => { return d.id ===list.id}
    )
}

let timer = null

export const playListInfoStore = defineStore(('playListInfo'), {
    state: () => {
        return {
            playList: JSON.parse(window.localStorage.getItem('PLAYLIST')) || [], //当前播放列表
            playIndex: JSON.parse(window.localStorage.getItem('PLAYINDEX')) || 0, // 当前音乐播放索引
            isPlayed : false, //当前歌曲是否在播放
            isShowTips: {
                visiable: false,
                txt:''
            },
        }
    },
    getters: {
        getPlayList: (state) => {
            return state.playList || []
        },
        getPlayIndex: (state) => {
            return state.playIndex || 0
        },
        getIsplayed: (state) => {
            return state.isPlayed || false
        },
    },
    actions: {
        //播放当前选中的歌曲
        selectPlay (list) {
            const playList = concatPlayList(list, this.playList);
            this.playList = playList;
            this.playIndex = findIndex(list[0], playList);
            this.isPlayed = true;
            this.isShowTips =  {
                visiable: true,
                txt: '已开始播放'
            };

            clearTimeout(timer);
            timer = setTimeout(() => {
                this.isShowTips.visiable = false;
            }, 25000);

            window.localStorage.setItem('PLAYLIST',JSON.stringify(playList));
            window.localStorage.setItem('PLAYINDEX', this.playIndex);
        },
        //添加歌曲到当前播放列表
        addToList (list) {
            const playlist = concatPlayList(list, this.playList);
            this.playList = playlist;
            this.isShowTips = {
                visiable: true,
                txt:'已经添加到播放列表'
            };
            clearTimeout(timer);
            timer = setTimeout(() => {
                this.isShowTips.visiable = false;
            }, 25000);

            window.localStorage.setItem('PLAYLIST', JSON.stringify(playlist));
        },
        //播放全部音乐（点击歌单里面的歌时自动清理当前播放列表）

        playAll (list) {
            const playlist = concatPlayList(list);
            this.playList = playlist;
            this.isShowTips = {
                visiable: true,
                txt:'已经添加到播放列表'
            };
            clearTimeout(timer);
            timer = setTimeout(() => {
                this.isShowTips.visiable = false;
            }, 25000);

            window.localStorage.setItem('PLAYLIST', JSON.stringify(playlist));
            window.localStorage.setItem('PLAYINDEX', this.playIndex);
        },

        //默认两件套
        setPlayIndex(val = 0) {
            this.playIndex = val
            window.localStorage.setItem('PLAYINDEX', val);
        },
        setPlayList(val = []) {
            this.playList = val
            window.localStorage.setItem('PLAYLIST', JSON.stringify(val));
        }
    }
})