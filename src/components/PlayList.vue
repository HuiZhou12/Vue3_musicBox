<template>
    <el-skeleton
        :loading="props.loading"
        animated
        :count="props.num"
        :throttle="500"
        class="playlist"
        >
        <template #template>
            <div class="item">
                <el-skeleton-item class="ske-img" variant="image" />
                <div class="ske-info">
                    <el-skeleton-item variant="h3" class="ske-name" />
                    <el-skeleton-item variant="h3" class="ske-name" style="width:50%" />
                    <div class="ske-tags">
                        <el-skeleton-item variant="text" />
                        <el-skeleton-item variant="text" />
                        <el-skeleton-item variant="text" />
                    </div>
                </div>
            </div>
        </template>
        <template #default>
            <div class="playlist">
                <div class="item" v-for="item in props.playList" :key="item.id">
                    <router-link :to="{ path: '/playlist/detail', query: { id: item.id }}" class="faceImg">
                        <el-image :src="item.coverImgUrl" lazy>
                            <template #placeholder>
                                <div class="image-slot">
                                    <i class="iconfont icon-placeholder"></i>
                                </div>
                            </template>
                        </el-image>
                        <span class="playCount"><i class="iconfont icon-playnum"></i><em>{{proxy.$utils.formartNum(item.playCount)}}</em> / {{item.trackCount + '首'}}</span>
                    </router-link>
                   <div class="info">
                        <router-link :to="{ path: '/playlist/detail', query: { id: item.id }}" class="info_name">{{item.name}} </router-link>
                        <div class="tags">
                            <router-link :to="{ path: '/playlist', query: { cat: tag }}" class="tag" v-for="(tag, index) in item.tags" :key="index">#{{tag}}</router-link>
                        </div>
                    </div> 
                </div>
            </div>
        </template>
    </el-skeleton>
</template>
<script setup>
import { getCurrentInstance } from 'vue'; 
    const props = defineProps( {
        playList: Array,
        num: Number,
        loading: Boolean
    });
    const { proxy } = getCurrentInstance();
</script>
<style lang="less">
@import '../assets//less//global.less';
.playlist {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    font-size: 0;
}
.item {
    width: calc(100% / 6 - 20px);
    padding: 20px 0;
    box-sizing: border-box;

    .faceImg {
        display: block;
        position: relative;
        padding-top: 100%;
        box-shadow: var(--t-modal-shadow);
    }

    .el-image {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 3;
        border-radius: 4px;
    }

    .playCount {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 4;
        font-size: 12px;
        display: block;
        text-align: center;
        color: #fff;
        line-height: 30px;
        padding-right: 10px;
        //css颜色渐变网站: https://colorzilla.com/gradient-editor/#000000+0,000000+100&0+0,0.5+97 */
        background: -moz-linear-gradient(left,  rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 97%, rgba(0,0,0,0.5) 100%); /* FF3.6-15 */
        background: -webkit-linear-gradient(left,  rgba(0,0,0,0) 0%,rgba(0,0,0,0.5) 97%,rgba(0,0,0,0.5) 100%); /* Chrome10-25,Safari5.1-6 */
        background: linear-gradient(to right,  rgba(0,0,0,0) 0%,rgba(0,0,0,0.5) 97%,rgba(0,0,0,0.5) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00000000', endColorstr='#80000000',GradientType=1 ); /* IE6-9 */

        .em{
            display: inline-block;
            padding-left: 5px;
            font-style: normal;
        }


        
    }
    &.hover { 
        .faceImg {
            position: relative;
//animation 是 CSS 中的一个属性，用于创建动画效果。通过使用关键帧（@keyframes）来描述元素在不同时间点的样式变化， 
            animation: jello-horizontal 0.9s both;
        }
    }
    .info_name {
        text-decoration: none;
        color: black;
        display: block;
        font-size: 16px;
        line-height: 22px;
        margin-top: 15px;
        font-weight: 400;
        overflow: hidden;
        text-overflow: ellipsis; //处理文本溢出使用（...）处理

        &:hover {
            color: var(--t-primary-color);
            font-weight: 500;
        }
    }
    .tags {
        padding: 5px 0;

        .tag {
            padding-right: 5px;
            text-decoration: none;
            font-size: 12px;
            color: var(--t-primary-color);
        }
    }
}

//歌单封面的宽度 
@w: calc((@containerWidth - 40px) / 6 - 20px);
.el-skeleton {
    font-size: 0;

    .ske-img {
        height: @w;
        line-height: @w;
    }
    .ske-info {
        padding-top: 15px;
    }
    .ske-name {
        line-height: 16px;
        margin: 3px 0;
    }
    .ske-tags {
        display: flex;
        padding: 5px 0;
        * {
            width: 10;
            margin-right: 10px;
        }
    }
}
</style>