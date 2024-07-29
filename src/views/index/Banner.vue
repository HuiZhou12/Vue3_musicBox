<template>
    <div class="banner">
        <!-- 骨架屏：在需要等待加载内容的位置用一个box进行占位，让视觉效果变得更好，详细请见：element plus骨架屏 -->
        <el-skeleton :loading="loading" animated>
            <template #template>
                <el-skeleton-item variant="image" class="skeleton-img"/>
                <el-skeleton-item variant="image" class="skeleton-img"/>
                <el-skeleton-item variant="image" class="skeleton-img"/>
            </template>
            <template #default>
                <!-- 相关轮播图参数 -->
                <swiper
                    :slides-per-view="3"
                    :space-between="30"
                    :modules="modules"
                    :pagination="{ clickable: true }"
                    v-if="lists" 
                   :autoplay="{ delay: 3000 }"
                >
                <!-- 轮播图 -->
                <swiper-slide v-for="item in lists" :key="item.imageUrl">
                    <el-image :src="item.imageUrl" :alt="item.typeTitle" class="banner_image">
                        <template #placeholder>
                                <div class="image-slot">
                                    <i class="iconfont icon-placeholder"></i>
                                </div>
                            </template>
                    </el-image>
                </swiper-slide>
                
            </swiper>
            </template>
        </el-skeleton>
    </div>
</template>
<script>
//引入Swiper，详细请见：https://swiper.com.cn/
import { Swiper, SwiperSlide } from 'swiper/vue'
// 引入swiper样式（按需导入）
import 'swiper/css'
import 'swiper/css/pagination' // 轮播图底面的小圆点
import 'swiper/css/scrollbar'  // 轮播图的滚动条， 轮播图里一般不怎么会使用到滚动条，如果有用到的话import导入就行
// 引入swiper核心和所需模块
import { Autoplay, Pagination, Navigation } from 'swiper/modules'//自动播放轮波图，翻页按钮以及下方小圆点
import {  getCurrentInstance, onMounted, ref,  } from 'vue';
export default {
    name:'mainBanner',
    components:{
        Swiper,
        SwiperSlide
    },
    setup() {
        const modules = [Autoplay, Pagination, Navigation];
        const { proxy } = getCurrentInstance();
        let lists = ref([]);
        const loading = ref(true);

        const getBanner = async() => {
            const { data: res } = await proxy.$http.getBanner()

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }

            lists.value = res.banners;
            loading.value = false;
}
        onMounted( () => {
            getBanner()
        })

        return {
            loading,
            modules,
            lists
        }
    }
}
</script>
<style lang="less">
@import '../../assets//less/global.less';
@w: calc((@containerWidth - 90px) / 3 );
.banner {
    padding-bottom: 30px;
    font-size: 0;
}
.banner_wrap {
    position: relative;
    padding: 35px 0;
    .calcHeight(@w, 1080, 400);

    .banner_img {
        width: 100%;
        height: 100%;
        cursor: pointer;
    }

    .swiper-slide, .el-image {
        // 取保图片在400px和1080px之间
        .calcHeight(@w, 1080, 400);
    }
}

.el-skeleton {
    display: flex;
    justify-content: space-between;
    padding: 35px 0;

    .skeleton-img {
        flex: 1;
        .calcHeight(@w, 1080, 400);
        margin-right: 30px;

        &:last-child {
            margin: 0;
        }
    }
}

.swiper {

    .swiper-slide {
        border-radius: var(--border-radius);
        box-shadow: var(--t-modal-shadow);
        overflow: hidden;
    }
    .swiper-pagination-bullet-active {
        width: 15px;
        border-radius: var(--border-radius);
        background: var(--t-primary-color);
        transition: all .3s ease;
    }
}
</style>