<template>
    <div class="play-bar" v-if="curSongInfo">
        <el-slider class="audioProgress"
         v-model="audioProgressWidth"
         :show-tooltip="false"
         @change="setAudioProgress" 
        />
        <div class="play-bar-main">
            <div class="bar-l">
                <router-link :to="{path:'/song' , query:{id: curSongInfo.id}}">
                    <el-image :src="curSongInfo.album.picUrl" class="bar-cover-img" ></el-image>
                </router-link>
                <div class="bar-name">
                    <router-link :to="{path:'/song' , query:{id: curSongInfo.id}}" class="song-name">{{ curSongInfo.name }}</router-link>
                    <p> <router-link class="song-author" :to="{path:'/singer/detail', query:{ id: author.id}}" v-for="(author, sum) in curSongInfo.singer" :key="author.id">{{ sum!= 0?  '/' + author.name : author.name }}</router-link></p>
                </div>
                <div class="bar-time">
                    <span>{{$utils.formatSongTime(currentTime * 1000)}}</span> / {{curSongInfo.duration}}
                </div>
            </div>
            <div class="bar-m">
                <div class="bar-control">
                    <i class="iconfont icon-audio-prev" title="上一首" @click.stop="emit('audioHandler', 'prev')"></i>
                    <i :class="['iconfont', playIcon]" @click.stop="emit('audioHandler', 'play')"></i>
                    <i class="iconfont icon-audio-next" title="下一首" @click.stop="emit('audioHandler','next')"></i>
                </div>
            </div>
            <div class="bar-r">
                <div class="bar-oper">
                    <div class="volume-main">
                        <i :class="['iconfont', mutedIcon]" title="音量" @click.stop="volumeHandler"></i>
                        <progress-line class="volumeLine" :progressWidth="volumeProgressWidth" @setProgressLine="setvolumeProgress"></progress-line>
                    </div>
                    <i class="iconfont" :class="patternIcon.className" :title="patternIcon.title" @click.stop="changePlayPattern"></i>
                    <div class="lyric" ref="lyricsBtnRef" @click="lyricsHanlder">
                        <span class="lyric-btn" title="歌词">词</span>
                    </div>
                    <el-tooltip
                    class="box-item"
                    effect="dark"
                    placement="top"
                    :hide-after="3000"
                    :offset=20
                    v-model:visible="isShowTips.visiable"
                >
                    <template #content>
                        <span >{{isShowTips.txt}}</span>
                    </template>
                    <div class="playlist-main" ref="playlistBtnRef" @click="playlistHanlder">
                        <i class="iconfont icon-gedan"></i>
                        <div class="playlist-num" v-if="playListInfoStore.playList">{{ 99 > playListInfoStore.playList.length ? playListInfoStore.playList.length : '99+'}}</div>
                    </div>
                </el-tooltip>
                </div>
            </div>
        </div>    
    </div>
    <!-- elementplus 气泡卡片，用于构建歌词和播放列表-->
    <el-popover
    :show-arrow="false"
    placement="top"
    v-model:visible="isShowLyrics"
    :width="clickType == 'lyrics' ? 400 : 550"
    :height="300"
    :virtual-ref="popoverBtn"
    :offset=20
    effect="light"
    virtual-triggering
>
    <div class="pop-main" ref="popoverRef">
        <template v-if="clickType == 'lyrics'">
            <h3 class="pop-header">
                <span>歌词</span>
            </h3>
            <lyrics :sId="curSongInfo.id" :currentTime="currentTime"></lyrics>
        </template>
        <template v-if="clickType == 'playlist'"> 
            <h3 class="pop-header">
                <span>播放列表<em>(共{{playListInfoStore.playList.length}}首)</em></span>
                <div class="del-songlist" @click="clearSonglist"><i class="iconfont icon-del" title="清空列表"></i>清空列表</div>
            </h3>
            <song-list :songList="playListInfoStore.playList" :typeSize="'mini'" :isScroll="true"></song-list>
        </template>
    </div>
</el-popover>
</template>
<script>
import store from '@/store/index';
import ProgressLine from '@/components/ProgressLine.vue'
import { computed, ref, inject } from 'vue';
import SongList from '@/components/SongList.vue';

export default {
    name:'buttomBox',
    emits:['audioHandler', 'setVolumeHandler', 'setAudioProgress'],
    components:{
        ProgressLine,
        SongList,

    },
    setup(props,{ emit }) {
        const playListInfoStore = store.playListInfoStore();
        const playerSettingStore = store.playerSettingStore();
        const isPlayed = computed( () => {//捕捉当前歌曲是否在播放
            return playListInfoStore.getIsplayed;
        });
        const curSongInfo = computed(() => { //获取当前的歌曲信息，一首歌就是一个对象{}
            return playListInfoStore.getPlayList[playListInfoStore.getPlayIndex]
        });
        //当前时长，接收父组件的数据
        const currentTime = inject('currentTime');
        const isMuted = ref(false); //是否静音
        const volumeNum = ref(playerSettingStore.volume); //音量值
        const oldVolume = ref(0);

        //播放按钮图标的动态变化
        const playIcon = computed(() => {
            return !isPlayed.value ? 'icon-audio-play' : 'icon-audio-pause';
        });
        //是否静音图标变换
        const mutedIcon = computed(() => {
            return isMuted.value ? 'icon-volume-active' : 'icon-volume';
        });

        //设置音频音量进度条
        const volumeProgressWidth = computed( () => {
            return volumeNum.value * 100
        });

        //音量静音及取消的事件
        const volumeHandler = () => {
            isMuted.value = !isMuted.value;
            isMuted.value && (oldVolume.value = volumeNum.value);
            volumeNum.value = isMuted.value ? 0 : oldVolume.value;
            emit('setVolumeHandler', volumeNum.value)

            //保存到store(本地)中
            playerSettingStore.setPlayerSetting('volume', volumeNum.value);
        }

        // 点击拖拽音量条，设置当前音量
        const setvolumeProgress = (params) => {
            isMuted.value = params.val ? 0 : 1;
            volumeNum.value = params.val;
            oldVolume.value = params.val;

            // 实时改变音量大小
            emit('setVolumeHandler', params.val);
            // 保存到store中
            playerSettingStore.setPlayerSetting('volume', params.val);
        }

        //播放模式：循环播放、单曲循环、随机播放
        const patternIcon = computed( () => {
            const params  = [{
                className: 'icon-loop',
                title: '循环模式'
            },{
                className: 'icon-single-cycle',
                title: '单曲循环'
            },{
                className:'icon-shuffle',
                title:' 随机播放'
            }];
            return params[playerSettingStore.mode]
        });

        //切换播放模式
        const changePlayPattern = () => {
            playerSettingStore.mode = playerSettingStore.mode >= 2 ? 0 : playerSettingStore.mode + 1;
            playerSettingStore.setPlayerSetting('mode', playerSettingStore.mode);
        };

        //音频的进度条
        const audioProgressWidth = computed({
            get() {  
                return currentTime.value / curSongInfo.value.milliseconds * 100;
             
            },
            set(val) {
                currentTime.value = val * curSongInfo.value.milliseconds / 100;
            }
        });

        const setAudioProgress = (val) => {
            currentTime.value = val * curSongInfo.value.milliseconds / 100;

            emit('setAudioProgress', currentTime.value);
        };
        const popoverBtn = ref();
        const lyricsBtnRef = ref();
        const playlistBtnRef = ref();

        const clickType = ref(); // 点击类型
        // 显示歌词面板
        const popoverRef = ref();
        const isShowLyrics = ref(false);
        const lyricsHanlder = () => {
            popoverBtn.value = lyricsBtnRef.value;
            if (clickType.value == 'lyrics') {
                isShowLyrics.value = !isShowLyrics.value;
            } else {
                isShowLyrics.value = true;
            }

            clickType.value = 'lyrics';
        }
        const lyricHanlder = (e) => {
            const composedPath = e.composedPath();
            
            if (composedPath.includes(popoverRef.value)) return;
            isShowLyrics.value = false;
        }
        //显示播放列表
        const playlistHanlder = () => {
            popoverBtn.value = playlistBtnRef.value;
            if (clickType.value == 'playlist') {
                isShowLyrics.value = !isShowLyrics.value;
            } else {
                isShowLyrics.value = true;
            }

            clickType.value = 'playlist';
        }

        const isShowTips = computed(() => playListInfoStore.isShowTips);

        // 清空播放列表
        const clearSonglist = () => {
            playListInfoStore.setPlayIndex();
            playListInfoStore.setPlayList();
            playListInfoStore.$patch({
                isPlayed: false
            });
            isShowLyrics.value = false;
        };

        return {
            curSongInfo,
            audioProgressWidth,
            setAudioProgress,
            currentTime,
            emit,
            playIcon,
            mutedIcon,
            volumeHandler,
            setvolumeProgress,
            volumeProgressWidth,
            patternIcon,
            changePlayPattern,
            lyricsHanlder,
            isShowTips,
            clearSonglist,
            lyricHanlder,
            playlistHanlder,
            playListInfoStore,
            clickType,
            playlistBtnRef,
            popoverRef,
            isShowLyrics,
            popoverBtn
        }

    }
}
</script>
<style lang="less">
@import '../../assets/less/global.less';
.play-bar {
    position: fixed;
    bottom: 0;
    left: @menuWidth + @paddingW;
    z-index: 5;
    width: calc(100% - @menuWidth - @paddingW - @paddingW);
    height: 70px;
    background: var(--box-background);
    box-shadow: var(--t-modal-shadow);
}
.play-bar-main {
    display: flex;
    font-size: 0;
    line-height: 0;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    margin: 1 auto;

    .bar-l {
        display: flex;
        width: 300px;
        align-items: center;
        justify-content: center;
    }

    .bar-cover-img {
        width: 50px;
        height: 50px;
        border-radius: var(--border-radius);
        box-shadow: var(--t-modal-shadow);
    } 

    .bar-name {
        flex: 1;
        font-size: 0;
        padding: 0 20px;
        overflow: hidden;


        .song-name {
            display: block;
            margin-bottom: 20px;
            line-height: 12px;
            font-size: 14px;
            font-size: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-decoration: none;
            color: #141414;

            &:hover {
                color: var(--t-highlight-color);
                overflow: visible;
                font-weight: 500;
            }
        }
        
        p {
            line-height: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            
        }

        .song-author {
            line-height: 12px;
            font-size: 12px;
            color: var(--t-light-color);
            text-decoration: none;
            &:hover {
                font-weight: 700;
            }
        }
    }

    .bar-time {
        line-height: 50px;
        font-size: 14px;
        color: #606266;
        text-align: center;
    }
    .bar-control {
        display: flex;
        padding: 15px 0 ;
        line-height: 1;
        align-items: center;
        justify-content: center;

        .iconfont {
            margin: 0 20px;
            font-size: 25px;
            cursor: pointer;
            color: #666;
        }
        
        .icon-audio-play, .icon-audio-pause {
            font-size: 40px;
            font-weight: bold;
            color: var(--t-highlight-color);
        }
    }

    .bar-oper {
        position: relative;
        display: flex;
        font-size: 0;
        line-height: 50px;
        align-items: center;
        justify-content: center;

        .iconfont {
            margin-left: 10px;
            font-size: 20px;
            cursor: pointer;
            vertical-align: middle;
        }
    }
    .volume-main {
        flex: 1;
        padding: 10px 0;
        display: flex;
        align-items: center;

        .volumeLine {
            width: 150px;
            margin: 0 10px;
        }
    }

    .lyric {
        display: inline-block;
        padding: 18px 5px 18px 15px;
        font-size: 18px;
        line-height: 18px;
        vertical-align: top;
        color: var(--t-light-color);
        cursor: pointer;
    }

    .playlist-main {
        position: relative;
        padding-right: 20px;

        .playlist-num {
            position: absolute;
            top: 20%;
            left: 50%;
            width: 24px;
            text-align: center;
            font-size: 12px;
            line-height: 12px;
            color: var(--t-muted-color);
        }
    }
}
.custom-popover {
  max-height: 300px; 
}

.popover-content {
  max-height: 300px; 
  overflow-y: auto;  
}
.pop-main {
    min-height: 420px;
    max-height: 300px; /* 设置内容区域的最大高度 */
    overflow-y: auto;  /* 内容超出时启用垂直滚动条 */

    .pop-header {
        display: flex;
        line-height: 40px;

        span {
            display: inline-block;
            flex: 1;
        }

        em {
            display: inline-block;
            padding-left: 10px;
            font-size: 12px;
            line-height: 14px;
            font-style: normal;
            font-weight: normal;
            color: #666;
            vertical-align: baseline;
        }

        .del-songlist {
            font-size: 14px;
            font-weight: normal;
            cursor: pointer;

            .iconfont {
                font-size: 22px;
                vertical-align: middle;
            }
        }
    }
}

.audioProgress {
    position: absolute;
    top: -16px;
    z-index: 9;
    
    .el-slider__runway{
        background: var(--btn-background);
    }
    .el-slider__bar{
        background-color: var(--t-highlight-color)
    }
    .el-slider__button {

        border: 2px solid var(--t-highlight-color);

    }

}

.playContent {
    overflow: hidden;
}
</style>