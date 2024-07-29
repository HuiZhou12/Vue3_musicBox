<template >
    <div class="playlist" >
        <div class="filter card"  v-if="categories.length">
            <div class="filter-item" v-for="(item, index) in categories" :key="index">
                <div class="filter-title">{{ item.name }}</div>
                <div class="filter-box">
                    <span :class="['item-box', curType === sub.name ? 'active' : '']" v-for="sub in item.children" :key="sub.name" @click="selectType(sub)">{{ sub.name }}</span>
                </div>
            </div>
        </div>
        <div class="list-container">
            <div class="list-main">
                <div class="list-head">
                    <h2>{{ curType }} <em v-if="curType !== allType" class="filter-close"><i class="iconfont icon-closed" @click="closed"></i></em></h2>
                    <div class="type">
                        <span :class="params.order === 'hot'? 'active' : ''">热门</span>
                    </div>
                </div>
            </div>
        </div>    
            <!-- 以下元素盒子使用了自定义指令，具体为
            v-infinite-scroll="loadMore" ：当用户滚动到页面底部时，这个方法就会被调用
            :infinite-scroll-disabled="busy" 这个属性用于控制自定义指令是否被禁用
            :infinite-scroll-distance="100"：当滚动到接近底部100像素时，回触发loadMore方法-->
            <div class='wrapper infinite-list' v-infinite-scroll="loadMore" :infinite-scroll-disabled="busy" :infinite-scroll-distance="100">
                <play-list :playList="playlist_list" :loading="playlist_loading" :num="playlist_count" ></play-list>
            </div>
        
    </div>
</template>
<script>
import PlayList  from '@/components/PlayList.vue';
import { useRoute, useRouter } from 'vue-router';
import { getCurrentInstance, onMounted, reactive, ref, watch } from 'vue';
export default {
    name:'playListIndex',
    components:{
        PlayList,
    },
    setup() {
        const { proxy} = getCurrentInstance();
        const route = useRoute();
        const router = useRouter();
        const cat = route.query.cat;
        const params = reactive({
            order:'hot',// 热度
            cat:cat, // 类型
            limit:48, //每页放的项目数
            offset:0 // 分页数
        });
        const categories = ref([]);
        const curType = ref('全部歌单');
        const allType = '全部歌单';
        const busy = ref(true);
        const playlist_list = ref([]);
        const playlist_count = ref(24);
        const playlist_loading = ref(true);

        //查看歌单分类
        const getCatlist = async () => {
            const {data: res} = await proxy.$http.catlist()

            if(res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }
            //把得到的5个类型数据放入到categories数组中
            for(let k in res.categories) {
                categories.value.push({
                    name:res.categories[k],
                    children:res.sub.filter(s => s.category == k) // 添加多个所属该4种类型的其中之一的歌单，他是一个对象数组
                });
            }
            curType.value = cat ? cat : res.all.name;
        }

        //获取歌单列表
        const getPlayList = async () => {
            const {data: res } = await proxy.$http.playList(params);

            if(res.code !== 200) {
                return proxy.$msg.error('数据请求失败');
            }

            playlist_list.value = params.offset !==0 ? [...playlist_list.value, ...res.playlists] : res.playlists;
            busy.value = playlist_list.value.length >= res.total;
            playlist_loading.value = false;
        };

        //选择分类
        const selectType = (item) => {
            playlist_list.value = [];
            busy.value = true;
            router.push({path:'playlist', query: {cat: item.name, order: params.order} });
        };
        
        const closed = () => {
            playlist_list.value = [];
            busy.value = true;
            router.push({path: 'playlist'})
        };

        const loadMore = () => {
            busy.value = true;
            params.offset = playlist_list.value.length;
        };

        onMounted(() => {
            getCatlist();
            getPlayList(params);
        })

        watch( () => route.query, (newVal) => { //监视目标为： () => route.query：一个计算属性函数，返回当前路由的查询参数对象（query）也就是携带get参数
            const { cat, order } = newVal;

            curType.value = cat || allType; 
            params.cat = curType.value;
            params.order = order || 'hot'
        });
        watch(() => params, (newVal, oldVal) => {
            if(newVal.cat != oldVal.cat) {
                busy.value = true;
                playlist_list.value = [];
            }
            getPlayList(newVal);
        }, {
            deep:true // 深度监听
        });

        return {
            categories,
            curType,
            selectType,
            playlist_count,
            closed,
            loadMore,
            params,
            playlist_list,
            playlist_loading
        }
    }
    
}
</script>
<style lang="less">
.playlist {
    padding: 25px 0 0 0;
}
.list-container {
    display: flex;
    
}
.list-main {
    flex: 1;
}


.filter {
    padding: 10px 0 10px 20px;
}

.filter-item {
    display: flex;
    align-items: center;
    font-size: 0;
    padding: 5px 0;

    .filter-title {
        display: inline-block;
        font-size: 14px;
        line-height: 14px;
        padding: 0 20px 0 0;
        color: var(--t-muted-color);
        font-weight: 300;
        cursor: pointer;
        border-right: 1px solid #eee;
    }

    .filter-box {
        flex: 1;
        display: flex;
        flex-wrap: wrap;

        span {
            display: inline-block;
            width: 70px;
            font-size: 14px;
            line-height: 14px;
            height: 14px;
            margin: 5px 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;
            text-align: center;

            &:hover, &.active {
                color: var(--t-highlight-color);
                font-weight: 800;
                text-overflow:clip
            }
        }
    }
}
.wrapper {
    min-height: 500px;
    display: block;
}

.list-head {
    display:flex;
    padding: 15px 0 0;

    h2 {
        font-size: 24px;
        line-height: 30px;
        font-weight: 400;
    }

    .filter-close {
        display: inline-block;
        line-height: 16px;
        vertical-align: top;
        cursor: pointer;
    }
    .type {
        padding: 5px 20px;

        span{
            font-size: 20px;
            position: relative;
            z-index: 9;
            display: inline-block;
            height: 20px;
            line-height: 20px;
            margin-right: 35px;
            cursor: pointer;
            font-weight: 300;
            color: #333;

            &.active {
                font-weight: 600;
                color: var(--t-text-color);

                &::after {
                    position: absolute;
                    content: "";
                    left: 0;
                    bottom: 1px;
                    width: 100%;
                    height: 6px;
                    background: var(--t-highlight-color);
                    z-index: -1;
                }
            }
        }
    }
    
}
.card {
    padding: 20px 20px;
    margin-bottom: 20px;
    box-shadow: var(--t-modal-shadow);
    border-radius: var(--border-radius);
    background: var(--box-background);
}

</style>