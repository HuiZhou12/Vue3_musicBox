<template>
        <Banner/>
        <div class="card">
            <div class="card-title">
                <h3>热门推荐</h3>
                <span v-for="(item, index) in playList_info.tags" :key="item.id" :class=" {'active' : index == playList_info.index}" @click="choosePlayListTag(index)"> {{ item.name }}</span>
            </div>
            <div class="card-body">
                <play-list :playList="playList_info.lists" :loading="playList_info.loading" :num="playList_info.params.limit"></play-list>
            </div>
        </div>
</template>
<script>
import Banner from './Banner.vue';
import playList  from '@/components/PlayList.vue';

import { hotPlayList } from "@/assets/js/index/hot"

export default {
    name:'mainIndex',
    components: {
        Banner,
        playList
    },
    setup () {
        const { playList_info, choosePlayListTag } = hotPlayList();

        return {
            playList_info,
            choosePlayListTag
        }
    }
}
</script>
<style lang="less">
@import '../../assets/less/global.less';
.card {
    padding: 0 20px;
    margin-bottom: 20px;
    box-shadow: var(--t-modal-shadow);
    background: var(--box-background);
    border-radius: var(--border-radius);

    .card-title {
        padding: 30px 0 10px; //上 左右 下的参数

        h3 {
            display: block;
            padding-right: 20px;
            font-size: 20px;
            line-height: 20px;
            font-weight: 400;
            color: var(--t-text-color);
            margin-bottom: 10px;
        }
        span {
            display: inline-block;
            font-size: 14px;
            margin: 0 20px 0 0;
            overflow: hidden;
            font-weight: 300;
            cursor: pointer;

            &.active {
                position: relative;
                z-index: 1;
                font-weight: 400;
                

                &:after {
                    position: absolute;
                    content: "";
                    left: 0;
                    bottom: 1px;
                    width: 100%;
                    height: 4px;
                    background: var(--t-primary-color);
                    z-index: -1;
                }
            }
        }
    }
}
    
</style>