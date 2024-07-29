<template>
    <div class="songs-list-main" :class="{'mini' : props.typeSize == 'mini'}">
        <div class="list-header flex"> 
            <div class="columnIndex">序号</div>
            <div class="columnSong">歌曲</div>
            <div class="columnSinger">歌手</div>
            <div class="columnAlbum" v-if="props.typeSize !== 'mini'">专辑</div>
            <div class="columnTime">时长</div>
        </div>
        <div class="list-scroll" ref="curSongRef">
            <div class="list-main">
                <div :class="isCurSong(item)" v-for="(item, index) in list " :key="item.id">
                    <div class="columnIndex">
                        <span class="songlist-index">{{ indexMethod(index) }}</span>
                        <div class="audio-icon">
                            <div class="column" style="animation-delay: -1.2s;"></div>
                            <div class="column"></div>
                            <div class="column" style="animation-delay: -1.5s;"></div>
                            <div class="column" style="animation-delay: -0.9s;"></div>
                            <div class="column" style="animation-delay: -0.6s;"></div>
                        </div>
                        <i :class="playIcon(item)" @click="playCurrentSong(item)"></i>
                    </div>
                    <div class="columnSong songlist-name">
                        <router-link :to="{path: '/song', query: {id:item.id}}" class="song_name">
                            {{ item.name }}
                        </router-link>
                        <template v-if="props.typeSize !=='mini'">
                            <router-link class="mv-name" :to="{path:'/mv', query:{ id: item.mvId}}" v-if="item.mvId">
                                <i class="iconfont icon-mvlist"></i>
                            </router-link>
                            <i v-if="item.vip" class="iconfont icon-vip"></i>
                        </template>
                    </div>
                    <div class="columnSinger songlist-singer">
                        <router-link class="song-singer" :to="{path:'/singer/detail', query:{ id: author.id}}" v-for="(author, sum) in item.singer" :key="author.id">{{ sum!= 0?  '/' + author.name : author.name }}</router-link>
                    </div>
                    <div class="columnAlbum" v-if="props.typeSize !== 'mini'">
                        <router-link class="songlist-album" :to="{path:'/album', query: {id:item.album.id}}" v-if="item.album">{{ item.album.name }}</router-link>
                    </div>
                    <div class="columnTime">
                        <div class="songlist-time">
                            {{ item.duration }}
                        </div>
                        <div class="songlist-oper">
                            <i class="iconfont icon-add" v-if="props.typeSize !=='mini'" title="添加到列表" @click="addSongList(item)"></i>
                            <i class="iconfont icon-collect" title="收藏"></i>
                            <i class="iconfont icon-del" v-if="props.typeSize =='mini'" title="删除" @click.stop="delItem(index)"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="pagination" v-if="isShowPagination">
            <el-pagination 
            v-model:currentPage="currentPage"
            layout="prev, pager, next" 
            :total="props.songList.length"
            :page-size="props.pageSize"
            />
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import store  from '@/store/index';
import { computed, ref } from 'vue';
const props = defineProps({
    songList: { // 歌曲列表
        type: Array,
        required: true
    },
    typeSize: { // 播放列表展示类型， 默认normal是歌单下的展示列表，mini是播放条下的歌曲列表的
        type: String,
        default: 'normal'
    },
    // 分页加载 || 无限滚动加载 ,按自己喜欢的方式来
    isScroll: {
        type: Boolean,
        default: false
    },
    pageSize: { // 分页 每页的展示数量
        type: Number,
        default: 20
    },
});

const playListInfoStore = store.playListInfoStore();
const accountInfo = store.accountInfoStore();

const isVip = computed(() =>{
    return accountInfo.getVipInfo
}) 
const currentPage = ref(1);
// const curScroll = ref(-1 || 1);

//获取歌曲列表

const list = computed( () => {
    //有限展示
    if(!props.isScroll) {
        return props.songList.slice( 0 , currentPage.value * props.pageSize);
    } else {
        //无限展示
        return props.songList
    }
});

//渲染表单列表歌曲的序号
const indexMethod = (page) => {
    return page + 1 
}
//获取当前播放音乐信息
const curSongInfo = computed( () => {
    return playListInfoStore.playList[playListInfoStore.playIndex];
});
//获取当前播放音乐的icon状态
const playIcon = computed(() => {
    return item => {
        return ['iconfont', 'playicon', playListInfoStore.isPlayed && (item.id === curSongInfo.value.id) ? 'icon-pause' : 'icon-play']
    }
})
// 播放列表样式(后续在这里添加识别用户vip1的功能)
const isCurSong = computed(() => {
    return item => {
        return ['list-item', playListInfoStore.isPlayed && (item.id === curSongInfo.value.id) ? 'active' : '', (item.license || item.vip && isVip.value !== true ) ? 'disable' : '', item.vip ? 'vip' : '']
    }
});
//点击播放/暂停当前音乐，点击之后直接吧所有歌单里的歌加入播放列表
const playCurrentSong = (item) => {
    // 若不是歌曲开始播放 或者 当前播放歌曲不是本歌单显示的歌曲  立即播放当前歌单
    if (!curSongInfo.value || curSongInfo.value.id != item.id) {
        playListInfoStore.selectPlay([item]);
    } else {
        playListInfoStore.$patch({
            isPlayed: !playListInfoStore.isPlayed
        })
    }
    
}
//提当前歌曲到播放列表
const addSongList = (item) => {
    playListInfoStore.addToList([item]);
}
// 在播放列表删除歌曲，播放列表、播放索引重置更新
const delItem = (index) => {
    if(playListInfoStore.playList.length > 1) {
        //删除自身
        playListInfoStore.playList.splice(index, 1)

        if(playListInfoStore.playIndex >= index) {
            playListInfoStore.setPlayIndex(playListInfoStore.playIndex - 1);
        }
        playListInfoStore.setPlayList(playListInfoStore.playList);
    } else {
        playListInfoStore.playList.splice(0,1)
        playListInfoStore.setPlayList(playListInfoStore.playList);
        playListInfoStore.playIndex= null
        playListInfoStore.isPlayed = false
    }
}
//是否显示分页
const isShowPagination = computed( () => {
    return props.songList.length > props.pageSize && !props.isScroll
})


</script>

<style  lang="less" scoped>
.list-header {
    display:  flex;
    line-height: 50px;
    border-bottom: 1px solid #EBEEF5;
    font-weight: 400;
    color: var(--t-text-color);
    display:  flex;
}
.columnIndex {
    width: 60px;
    line-height: 50px;
    padding-left: 10px;
}

.columnSong {
 
    flex: 2;
    width: 0;
    padding-right: 10px;
    overflow: hidden;
    align-items: center;
}

.columnSinger {
    flex:1.5;
    width: 0;
    padding-right: 10px;
    overflow: hidden;
}

.columnAlbum {
    flex: 1;
    width: 0;
}

.columnTime {
    width: 100px;
    padding-right: 10px;
    text-align: right;
}
.list-main {
    transition:transform .3s;

}
.list-item {
    display: flex;
    align-items: flex-start;
    line-height: 50px;
    font-weight: 3000;
    color: var(--t-text-color);
    border-radius: var(--border-radius);
    &:hover {
        box-shadow: var(--t-modal-shadow);
    }
   &:hover div .songlist-time {
    display: none;
    }   
    &:hover div .songlist-oper {
        display: inline-block;
    }
    &.active {
        border-radius: var(--border-radius);
        box-shadow: var(--t-modal-shadow);
        background: var(--s-background);
        
        .songlist-index, .playicon {
            display: none;
        }

        .audio-icon {
            display: flex;
        }

        &:hover {
            .playicon {
                display: block;
                color: var(--t-highlight-color);
            }
            .audio-icon {
                display: none;
            }
        }
    }
    .icon-vip {
        font-size: 30px;
        color: var(--t-highlight-color);
    }

    &.disable {
        color: #ccc;

        a {
            color: #ccc;
        }

        .playicon, .songlist-oper {
            display: none;
        }

        .songlist-index, .songlist-time {
            display: block;
        }
    }

} 
.iconfont {
        margin-left: 10px;
        font-size: 22px;
        cursor: pointer;
        vertical-align: middle;

        &:hover {
        color: var(--t-highlight-color);
        }

    }
.songlist-index {
    display: inline-block;
    width: 2;
    text-align: center;
}

.audio-icon {
    display: none;
    width: 20px;
    height: 18px;
    margin: 16px 2px;
    overflow: hidden;

    .column {
        width: 2px;
        height: 100%;
        margin-left: 2px;
        background-color: var(--t-highlight-color);
        -webkit-animation: play .9s linear infinite alternate;
        animation: play .9s linear infinite alternate
    }
}

.songlist-name {
    a {
        text-decoration: none;
        color: var(--t-text-color);
        display: inline-block;
        max-width: 80%;
        line-height: 50px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: top;
    }
    i:hover {
        color: var(--t-highlight-color);
        cursor: pointer;
    }
    .mv-name {
            text-decoration: none;
        }
    .song_name {
        color: var(--t-text-color);
        &:hover {
            color: var(--t-highlight-color);
        }
        
    }
}

.song-singer, .songlist-album{
    
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-decoration: none;
    color: var(--t-text-color);
    text-overflow: ellipsis;
    line-height: 50px;
    white-space: nowrap;
    vertical-align: top;
    &:hover {
        color: var(--t-highlight-color);
    }
    
}
.songlist-oper {
    display: none;
}
.pagination {
    display: flex;
    justify-content: center;
    padding: 30px 0 ;
    color: #FFF;
}


@-webkit-keyframes play {
    0% {
        -webkit-transform: translateY(0);
        transform: translateY(0)
    }

    to {
        -webkit-transform: translateY(75%);
        transform: translateY(75%)
    }
}

@keyframes play {
    0% {
        -webkit-transform: translateY(0);
        transform: translateY(0)
    }

    to {
        -webkit-transform: translateY(75%);
        transform: translateY(75%)
    }
}

</style>