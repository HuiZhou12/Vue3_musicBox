<template>
    <div class="progress" @click.stop="point" ref="progress">
        <div class="progress-line"></div>
        <div class="progress-bg" :style="{ width: progressWidth + '%' }">
            <div class="progress-btn" @mousedown.self.stop="move()"></div>
        </div>
    </div>
</template>
<script se>
import { ref } from 'vue';


export default {
    name:'progressLine',
    emits:['setProgressLine'],
    props:['progressWidth'],
    setup(props,{emit}) {
        const progress = ref(null);
        //拖拽进度条
        const move = () => {
        //这行代码将页面的 mousemove 事件绑定到一个回调函数中。当用户在页面上移动鼠标时，浏览器会触发 mousemove 事件
            document.onmousemove = (element) => {
                setProgressLine(element, false)
            }

            // 拖拽进度条的时候 禁止页面文字选中
            document.body.onselectstart = () => false

            //拖拽松开那一刻执行,或者说鼠标松开的时候执行
            document.onmouseup = (element) => {
                setProgressLine(element);
                document.onmousemove = document.onmouseup = document.body.onselectstart = null;
            } 
        }

        //点击音频进度条
        const point = (e) => {
            setProgressLine(e)
        }

        const setProgressLine = (element, flag = true) => { //flag :鼠标拖拽标识
            const $progress = progress.value;
             //  实时获取鼠标横坐标，若是超过进度条最大宽度，则值为进度条的宽度
            const curProgress = element.clientX - getOffsetLeft($progress) >= $progress.offsetWidth ? $progress.offsetWidth : (element.clientX - getOffsetLeft($progress) <= 0 ? 0 : element.clientX - getOffsetLeft($progress))

            emit('setProgressLine', { val: curProgress / $progress.offsetWidth, flag: flag });
        }

        // 获取元素到浏览器左侧距离
        const getOffsetLeft = (obj) => {
            let oLeft = obj.offsetLeft //该值包含了margin-left、border-left 和 padding-left的信息
            let oParent = obj.offsetParent // 改值是计算元素的偏移量

            while (oParent !== null) {
                oLeft += oParent.offsetLeft
                oParent = oParent.offsetParent
            }

            return oLeft
        };

        return {
            point,
            move,
            progress
        }
    }
}
</script>
<style lang="less">
    .progress {
    position: relative;
    width: 100%;
    height: 4px;
    padding: 4px 0;
    border-radius: 2px;
    cursor: pointer;

    .progress-line {
        position: absolute;
        top: 4px;
        left: 0;
        width: 100%;
        height: 4px;
        border-radius: var(--border-radius);
        background: #eee;
        box-shadow:0 0 4px #efefef inset;
    }

    .progress-bg {
        position: absolute;
        top: 4px;
        left: 0;
        width: 0;
        height: 4px;
        border-radius: 2px;
        background: var(--t-primary-color);
    }

    .progress-btn {
        position: absolute;
        right: -6px;
        width: 4px;
        height: 4px;
        border: 4px solid var(--t-highlight-color);
        top: -4.5px;
        background: #fff;
        box-shadow: 0 0 15px 0 rgba(0,0,0,.15);
        transition: all .3s;
        border-radius: 50%;
        cursor: grab;
    }
}
</style>