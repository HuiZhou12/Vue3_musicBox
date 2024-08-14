<template>
    <!-- @canplay：当浏览器有足够数据可以开始播放时触发。
        @playing：当音频开始播放时触发。
        @ended：当音频播放结束时触发。
        @timeupdate：当音频的播放位置发生变化时触发。 -->
    <audio v-if="curSongInfo" 
    ref="myAudio"
    preload="auto"
    @canplay="canplaySong"
    @playing="playSong"
    @ended="endedSong"
    @timeupdate="updateSongTime"
    :src="curSongInfo.url"
    ></audio>
</template>
<script>
import store  from '@/store/index';
import { computed, nextTick, onMounted, ref, watch, watchEffect, getCurrentInstance } from 'vue';
export default {
    name:'audioBox',
    emits:['setCurrentTime'],
    setup(props, {emit}) {
        const { proxy } = getCurrentInstance();
        const myAudio = ref(null);
        const curSongInfo = ref(null);
        const playListInfoStore = store.playListInfoStore();
        const playerSettingStore = store.playerSettingStore();
        const isPlayed = computed( () => playListInfoStore.getIsplayed);
        //当前播放音乐信息
    // 监听 playIndex 变化，获取新的歌曲信息
        watchEffect(async () => {
            const $myAudio = myAudio.value;
            if ($myAudio) {
                $myAudio.pause(); // 切歌时暂停当前音频
                
            }
            try {
            const { data: res } = await proxy.$http.getSong(playListInfoStore.playList[playListInfoStore.playIndex].id);
            curSongInfo.value = res.data[0]; // 更新当前歌曲信息
            $myAudio.play(); // 继续播放当前音乐
            } catch (error) {
            console.error('出错啦:', error);
            }
        });

        // const curSongInfo = computed( async () =>  {
        //     const { data: res } = await proxy.$http.getSong(playListInfoStore.playList[playListInfoStore.playIndex].id);
        //     console.log(res)
        //     return res
        // });
        //初始化音频准备
        const initAudioReady = ref(false);

        //音频初始化后准备就绪
        const canplaySong = () => {
            initAudioReady.value = true;
        };

        //音频播放获取音频总时长
        const playSong = () =>{
            initAudioReady.value =true;
            playListInfoStore.$patch({
                isPlayed:true 
            });
        };

        // 音乐 播放/暂停/上一首/下一首
        const playAudioType = (type) => {
            if (type === 'play') {
                playListInfoStore.$patch({
                    isPlayed: !isPlayed.value
                });
            } else {
                changeSong(type);
            }
        };
        
        //手动切换歌曲
        const changeSong = (type) => { //prev/next  上一首/下一首
            if(playListInfoStore.playList.length !== 1 ){// 若播放列表只有一首歌则单曲循环
                let index = playListInfoStore.playIndex;

                if(playerSettingStore.mode === 2) { //随机模式
                    index = Math.floor(Math.random() * playListInfoStore.playList.length - 1)
                } else if( type === 'prev') {
                    index = index === 0 ? playListInfoStore.playList.length - 1 : --index 
                } else {
                    index = index >= playListInfoStore.playList.length - 1 ? 0 : ++index
                    
                }

                initAudioReady.value =false; 
                playListInfoStore.isPlayed = false;// 暂停播放当期音乐，准备换下一首
                playListInfoStore.setPlayIndex(index); //更改当前播放音乐的索引，换成下一回搜歌曲的索引
            } else {
                loopSong()
            }
        };
        //单曲循环
        const loopSong = () => {
            const $myAudio = myAudio.value; //获取dom元素<audio></audio>
            //调用</audio>里的属性和方法
            $myAudio.currentTime = 0
            $myAudio.play()
            playListInfoStore.$patch({
                isPlayed:true,
            });
        } 
        //自动切歌
        const endedSong = () => {
            if(playerSettingStore.mode === 1) {
                loopSong()
            } else {
                changeSong('next');
            }
        };
        //设置音频音量大小
        const setVolumeHandler = (val) => {
            const $myAudio = myAudio.value; // 和上面同理
            $myAudio.volume = val;
            $myAudio.muted = val ? 0 : 1
        };
        //手动拖拽进度条时，获取当前时长
        const setAudioProgress = (t) => {
            console.log('执行到我这里了')
            const $myAudio = myAudio.value;
            $myAudio.currentTime = t;
        };

        //监听音频时间，实时更新当前播放时间
        const updateSongTime = (element) => {
            if(!initAudioReady.value){
                return
            }
            emit('setCurrentTime', element.target.currentTime);
        };

        onMounted(() => {
            nextTick(() => {
                const $myAudio = myAudio.value;
                if($myAudio) {
                    $myAudio.volume = playerSettingStore.volume;
                }
            })
        })

        //监听当前播放歌曲的信息
        watch(curSongInfo, (newSong, oldSong) => {
            //点击同一首歌，直接返回
            if(!newSong || (oldSong && newSong.id === oldSong.id)) {
                return
            }
            // 当前播放歌曲变化的时候  重置状态及当前播放的时长
            initAudioReady.value = false;
            emit('setCurrentTime', 0);

            nextTick(() => {
                const $myAudio = myAudio.value;
                if ($myAudio) {
                    $myAudio.play();
                }
            })
        },{deep:true});

        // 等待音频加载成功完成后播放
        watchEffect(() => {
            if(!initAudioReady.value) {
                return
            }
            const $myAudio = myAudio.value;

            if ($myAudio) {
                isPlayed.value ? $myAudio.play() : $myAudio.pause()
            }
        })

        return {
            myAudio,
            canplaySong,
            playSong,
            endedSong,
            updateSongTime,
            curSongInfo,
            playAudioType,
            setVolumeHandler,
            setAudioProgress
        }
    }
}
</script>
<style>
    
</style>