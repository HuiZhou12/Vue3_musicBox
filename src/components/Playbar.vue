<template>
    <div class="playbar-main" >
        <!-- 设定用户自定义事件 -->
        <Buttombox        
        @audioHandler="playSongStates"
        @setVolumeHandler="setvolumeNum"
        @setAudioProgress="setAudioProgress">
        </Buttombox>
        <!-- 接收子组件暴露出来的事件 -->
        <Audiobox ref="audioRef" @setCurrentTime="setCurrentTime"></Audiobox>
    </div>
</template>
<script>
import { watch, ref, provide } from 'vue';
import Audiobox from './Audiobox.vue';
import Buttombox from '@/views/playbor/Buttombox.vue';
export default {
    name:'playBar',
    emits:['setCurrentTime'],
    components:{
        Audiobox,
        Buttombox
    },
    setup (props, {emit}){
        const audioRef = ref(null);
        const currentTime =ref(null);
        provide('currentTime', currentTime);//向子组件提供数据
        //歌曲操作
        const playSongStates = (state) => {
            audioRef.value.playAudioType(state);
        };
        //音量操作
        const setvolumeNum = (state) => {
            audioRef.value.setVolumeHandler(state);
        }
        //当前音频的播放时长
        const setCurrentTime = (t) => {
            currentTime.value = t;
           
        }
        //拖拽音频进度条
        const setAudioProgress = (state) => {
            audioRef.value.setAudioProgress(state);
        }
        //实时更新，让进度条动起来
        watch(currentTime, (newVal) => {
            emit('setCurrentTime', newVal);
        })
        return{
            playSongStates,
            setvolumeNum,
            setCurrentTime,
            setAudioProgress,
            audioRef
        }
    }
}
</script>
<style lang="less">
.playbar-main  {
    position: fixed;
    bottom: 0;
    z-index: 9;
}
</style>