<template>
    <div class="detail">
        <div class="detail-container">
            <div class="detail-main">
                <div class="cover">
                    <div class="cover-img">
                        <el-image :src="info.details.coverImgUrl">
                                <i class="inconfont icon-placeholder"></i>
                        </el-image>
                    </div>

                    <div class="cover-desc">
                        <template v-if="info.details.tags && info.details.tags.length">
                            <h4>标签</h4>
                            <div class="cover-tags" v-if="info.details.tags">
                                <router-link :to="{path: '/playlist', query: {cat: tag}}" v-for="(tag, index) in info.details.tags" :key="index" class="tag">#{{ tag }}</router-link>
                            </div>
                        </template>

                        <template v-if="info.details.trackUpdateTime">
                            <h4>更新时间</h4>
                            <p>{{$utils.formartDate(info.details.trackNumberUpdateTime, 'yyyy-MM-dd HH:mm:ss')}}</p>
                        </template>

                        <template v-if="info.details.subscribers">
                            <h4>喜欢这个歌单的人</h4>
                            <div class="sub-playlist">
                                <router-link :to="{path: '/home', query: {id: User.userId }}" v-for="User in info.details.subscribers" :key="User.userId" class="User-home"> 
                                    <el-image :src="User.avatarUrl" class="cover-avatarIcon"></el-image>
                                </router-link>
                            </div>
                        </template>

                        <template v-if="info.details.description">
                            <h4>介绍</h4>
                            <div class="cover-desc-all">
                                {{ info.details.description }}
                            </div>
                        </template>
                    </div>
                </div>
                <div class="detail-info">
                    <div class="cover-info">
                        <div class="cover-header">
                            {{ info.details.name }}
                        </div>
                        <div class="cover-author">
                            <template v-if="info.details.creator">
                                <router-link :to="{path: '/home', query: {id: info.details.creator.userId }}" class="User-home"> 
                                    <el-image :src="info.details.creator.avatarUrl" class="cover-avatar"></el-image>
                                </router-link>
                                <div class="cover-name">
                                <router-link :to="{path: '/home', query: {id: info.details.creator.userId }}" class="User-home"> {{info.details.creator.nickname }}</router-link>
                                <el-image v-if="info.details.creator.avatarDetail" :src="info.details.creator.avatarDetail.identityIconUrl" class="cover-avatarIcon"></el-image>
                                </div>
                                <div class="cover-date">{{$utils.formartDate(info.details.createTime, 'yyyy-MM-dd')}} 创建</div>
                            </template>
                        </div>
                        <div class="cover-digital">
                            <span class="cover-playCount"> <i class="iconfont icon-playnum"></i> {{$utils.formartNum(info.details.playCount)}}次播放</span>
                            <span class="cover-collect"> <i class="iconfont icon-collect"></i> {{$utils.formartNum(info.details.subscribedCount)}}次收藏</span>
                            <span class="cover-comment"> <i class="iconfont icon-comment"></i> {{$utils.formartNum(info.details.commentCount)}}条留言</span>
                        </div>
                    </div>
                    <div class="song-main">
                        <div class="song-header">
                            <h4>歌曲列表<em>共{{ info.total + '首歌' }}</em></h4>
                            <span class="play-all" @click="playAllSongs"><i class="iconfont icon-audio-play"></i>播放全部</span>
                            <span :class="['collect', info.details.subscribed ? 'active' : '']" @click="subPlayList"><i :class="['iconfont', 'icon-collect' + (info.details.subscribed ? '-active' : '')]"></i> {{ info.details.subscribed ? '已收藏' : '收藏'}}</span>
                        </div>
                        <template v-if="info.isLoading">
                           123
                        </template>
                        <template v-else>
                            <SongList :songList="info.songList" :stripe="true"></SongList>
                            <div class="login-box">
                                <div class="showAllSongsTips" v-if="!accountInfo.getLogin" @click="loginHanlder">登录后查看全部歌曲</div>
                            </div>
                            
                        </template>
                    </div>
                </div>
            </div>
            <div class="detail-aside">
                <template v-if="info.playlists.length">
                    <div class="aside-title">相关表单推荐</div>
                    <div class="aside-main recom-main" >
                        <router-link  v-for="item in info.playlists" :key="item.id" class="recom-item" :to="{ path:'/playlist/detail' ,query: {id :item.id} }">
                            <el-image :src="item.coverImgUrl" class="image"></el-image>
                            <div class="recom-info">
                                <div class="recom-name">{{ item.name }}</div>
                                <div class="recom-author"> By 
                                    <router-link :to="{path: '/home', query: {id: item.creator.userId}}" class="user-name"> {{ item.creator.nickname }}</router-link>
                                </div>
                            </div>
                        </router-link>
                    </div>
                </template>
                <div v-if="info.comments.length" class="playlist-comment">
                    <div class="aside-title"> 歌单评论</div>
                    <div class="aside-main comment-main">
                        <div class="comment-item" v-for="item in info.comments" :key="item.commentId">
                            <router-link :to="{path: '/home', query:{id: item.commentId}}">
                                <el-image :src="item.user.avatarUrl" class="image"></el-image>
                            </router-link>
                            <div class="comment-info">
                                <div class="comment-userInfo"><router-link :to="{ path: '/home', query: { id: item.commentId }}" class="comment-name">{{item.user.nickname}}</router-link><span class="comment-date">{{$utils.formatTime(item.time)}}</span></div>
                                <div class="comment-desc">{{item.content}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import SongList from '@/components/SongList.vue';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import { getCurrentInstance, onMounted, reactive } from 'vue';
import store from '@/store/index';
export default {
    name:'playListDetail',
    components:{
        SongList,
    },
    setup () {
        const { proxy } = getCurrentInstance();
        const accountInfo = store.accountInfoStore();
        const loginDialog = store.loginDialogStore();
        const playListInfo = store.playListInfoStore(); 
        const route = useRoute();
        const info = reactive({
            id: '',
            details: {},
            isLoading: true,
            songList:[],
            playlists:[],
            comments:[],
            total: 0,
            loading:true
        })

        const getDetail = async (params) => {
            info.isLoading = true;
            const {data: res } = await proxy.$http.playListDetail(params)
       
            if (res.code !== 200) {
                return proxy.$msg.error(`请求数据失败,${res.message}`);
            }  
            info.details = res.playlist;

            if(accountInfo.getLogin) {
                getAllsongs(res.playlist.trackIds);
            } else {
                info.songList = proxy.$utils.formatSongs(res.playlist.tracks, res.privileges);
                info.total = info.songList.length;
                console.log(info.total)
                info.isLoading = false;
            }
        } 
        //登录后根据ids获取所有歌曲列表
        const getAllsongs = async (ids) => {
            const sliceArr = [];
            const num = 500;
            let idsArr = []

            //分组，500一组
            for(let i = 0 ; i < ids.length; i += num) {
                //数组.push():在数组结尾添加新元素。 数组.slice(start,end)从start到end拷贝一个新的数组
                sliceArr.push(ids.slice(i, i + num))
            }

            //提取歌曲id,然后进行vip验证
            for (let j = 0; j < sliceArr.length; j++) {
                const arrs = [];
                sliceArr[j].map( (d) => { //d为sliceArr对象元素
                    arrs.push(d.id)// 提取id 
                });
                info.isLoading = true;
                const { data: res } = await proxy.$http.songDetail({ids: arrs.join(','), timestamp: new Date().valueOf() + j});
                idsArr = idsArr.concat(proxy.$utils.formatSongs(res.songs, res.privileges)) //方法用于连接两个或多个数组。a.concat(b);链接a和b组成新的数组
            }

            //把最终数据传入info
            info.songList = idsArr ;
            info.total = idsArr.length;
            info.isLoading = false;
        };

        // 相关歌单推荐
        const getRecom = async(params) => {
            const { data: res } = await proxy.$http.playlistRelated(params);

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败');
            }
            info.playlists = res.playlists;
        };

        // 歌单精彩评论
        const getComment = async(params) => {
            const { data: res } = await proxy.$http.playlistComment(params);

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败');
            }
            info.comments = res.comments;
        };
        const _initialize = (id) => {
            //获取歌单
            getDetail({ id:id, s: 8 });
            //歌单评论
            getComment({ id: id });
            //推荐
            getRecom({ id: id, limit: 8 });            
        }


        onMounted(() => {
            info.id = route.query.id || '';
            _initialize(info.id)
        })

        //路由更新前调用的钩子函数
        onBeforeRouteUpdate((to) => {
            info.songList = [];
            info.total = 0;
            info.id = to.query.id;
            _initialize(info.id);
        });
        //处于未登录状态，点击登录按钮，显示登录框
        const loginHanlder = () => {
            loginDialog.loginDialogVisible = true
        };

        //播放全部歌曲
        const playAllSongs = () => {
            playListInfo.playAll(info.songList);
        }
        // 收藏、取消歌单
        const subPlayList = async() => {
            const { data: res } = await proxy.$http.subPlayList({ id: info.details.id, t: (info.details.subscribed ? 2 : 1) })

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }
            info.details.subscribed = !info.details.subscribed
        };


        return {
            info,
            onBeforeRouteUpdate,
            loginHanlder,
            playAllSongs,
            subPlayList,
            accountInfo,

        }
    
    }
}
</script>
<style lang="less" scoped>
@import '../../assets/less/global.less';
    .detail {
        position: relative;
        margin-bottom: 40px;

        &::after {
            display: block;
            content: '';
            position: absolute;
            top: 140px;
            z-index: 1;
            width: 100%;
            height: calc(100% - 140px);
            box-shadow: var(--t-modal-shadow);
            background: var(--box-background);
            border-radius: var(--border-radius);
        }
    }
    .detail-container {
        position: relative;
        z-index: 9;
        display: flex;
        padding: 35px 0 0 0;
    }
    .detail-main {
        flex: 1;
        display: flex;
    }
    .cover {
        width: 250px;
        padding-left: 30px;
        padding-right: 40px;
    }
    .cover-img {
    width: 250px;
    height: 250px;
    border-radius: var(--border-radius);
    overflow: hidden;
    box-shadow: var(--t-modal-shadow);
    }

    .cover-desc {
        position: relative;
        padding: 10px 0 5px;

        h4{
            color: var(--t-muted-color);
            line-height: 14px;
            padding: 20px 0 5px;
            font-weight: 400;
        }
    }
    p {
        font-weight: 300;
        color: var(--t-muted-color);
    }

    .cover-desc-all {
        line-height: 22px;
        font-size: 14px;
        white-space: pre-line; //后端中的换行符和 <br> 元素会被当作换行处理，即遇到这些标记时会换行
        font-family: inherit;
        font-weight: 300;
        word-break: break-all;
        color: var(--t-muted-color);
        max-height: 800px; // 限制他的盒子高度
        overflow-y: auto;
    }

    .cover-tags {
        .tag {
            display: inline-block;
            margin: 0 5px 5px 0;
            font-size: 12px;
            font-weight: 300;
            color: var(--t-text-color);
            text-decoration: none;

            &:hover {
                color: var(--t-highlight-color);
                font-weight: 350;
            }
        }
  
    }
    
    .sub-playlist {
        font-size: 0;
        display: flex;
        flex-wrap: wrap;// 两行显示
        justify-content: space-between;

        .User-home {
            display: inline-block;
            width: 21%;
            border-radius: var(--border-radius);
            margin: 10px 0 0;
            overflow: hidden;
        }
    }
    .detail-info {
        flex: 1;
    }
    
    .cover-info {
        flex: 1;
        padding: 30px 0 55px;
        border-radius: var(--border-radius);

        .cover-header {
            padding: 10px 0;
            font-size: 34px;
            font-weight: bold;
            height: 34px;
            line-height: 34px;
            overflow: hidden;
            text-overflow: ellipsis; 
            word-break: break-all;
        }
    }
    .cover-author {
        padding: 10px 0 20px;
        height: 32px;
        margin-top: 18px;
        
        .cover-avatar{
            display: inline-block;
            width: 32px;
            height: 32px;
            border-radius: 100%;
            vertical-align: top;      
        }

        .cover-name, .cover-date {
            display: inline-block;
            padding: 0 10px;
            line-height: 32px;
            color: var(--t-muted-color);
        }
        
        .cover-avatarIcon {
            padding-left: 5px;
            width: 12px;
            height: 12px;
        }
    }
    .cover-digital {
            line-height: 0;
            
            span {
                display: inline-block;
                line-height: 18px;
                padding-right: 20px;
                color: var(--t-light-color);
                font-weight: 300;
                

                .iconfont {
                    font-size: 18px;
                    padding-right: 5px;
                    vertical-align: top;
                }
            }
        }
    
    .song-main {
        position: relative;
        border-radius: var(--border-radius);

        .song-header {
            display: flex;
            padding: 20px 0 10px;

            h4 {
                flex: 1;
                font-size: 20px;
                line-height: 30px;
                font-weight: 400;
                color: var(--t-muted-color);
                em {
                    display: inline-block;
                    padding-left: 10px;
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 300;
                    color: var(--t-light-color);
                }
            }
              span {
                display: flex;
                line-height: 16px;
                align-items: center;
                justify-content: center;
                border-radius: var(--border-radius);
                padding: 7px 20px 7px 16px;
                cursor: pointer;
                margin: 0 0 0 15px;
                transition: all .4s;
                background: var(--btn-background);
                color: var(--t-light-color);
                font-weight: 300;

                i {
                    margin-right: 5px;
                    color: var(--t-light-color);
                }
                &:hover {
                    background-color: var(--t-primary-color);
                    color: var(--white-color);
                    i {
                        color: var(--white-color);
                    }
                }

            }
        }
    }

    .detail-aside {
        width: @sideWidth;
        margin-left: @paddingW;
        margin-top: 135px;

        .aside-title {
            display: inline-block;
            font-size: 16px;
            line-height: 16px;
            padding: 0 0 20px;
            color: var(--t-text-color);
        }

        &::before {
            display: inline-block;
            content: '';
            width: 3px;
            height: 16px;
            margin-right: 5px;
            background: var(--t-muted-color);
            border-radius: var(--border-radius);
            vertical-align: top;
        }
    }

    .recom-main {
        padding-bottom: 30px;
        .image {
            width: 60px;
            height: 60px;
            border-radius: 4px;
            overflow: hidden;

            &:hover {
                -webkit-filter: blur(1px);
                transition: all 0.3 ease-in;
            }
        }

        .recom-item {
            display: flex;
            padding: 0 0 20px;
            text-decoration: none;
        }

        .recom-info {
            flex: 1;
            padding-left: 10px;
        }

        .recom-name {
            color: var(--black-color);
            width: 100%;
            height: 20px;
            line-height: 20px;
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;

            &:hover {
                color: var(--t-primary-color);
            }
        }

        .recom-author {
            height: 20px;
            line-height: 20px;
            margin-top: 20px;
            font-size: 12px;
            color:var(--black-color);
        }
    }
    .user-name {
        color: var(--t-light-color);
        text-decoration: none;
    }

    .comment-main {
        font-size: 0;
        padding-right: 20px;

        .image {
            width: 40px;
            height: 40px;
            border-radius: var(--border-radius);
            box-shadow: var(--t-modal-shadow);
            overflow: hidden;
        }

        .comment-item {
            display: flex;
            padding: 10px 0
        }

        .comment-info {
            flex: 1;
            padding-left: 10px;
        }

        .comment-userInfo {
            width: 100%;
            font-size: 0;
        }

        .comment-name {
            text-decoration: none;
            font-size: 14px;
            line-height: 14px;
            font-weight: bold;
            color: var(--black-color);

        }

        .comment-desc {
            font-size: 12px;
            color: var(--t-modal-color);
            line-height: 1.6;
            padding: 5px 10px;
            background: var(--btn-background);
            margin: 5px 0;
            border-radius: var(--border-radius);
            word-break: break-all;
        }
    }
    .login-box{
        display: flex;
        justify-content: center; /* 水平居中 */
        align-items: center; /* 垂直居中 */

        .showAllSongsTips{
   
            margin-top: 30px;
            padding: 10px 10px;
            line-height: 20px;
            font-weight: 570;
            border-radius: var(--border-radius);
            background-color: var(--btn-background);
            color: var(--t-light-color);
            cursor: pointer;
            transition: all 0.2s ease-in; 
            &:hover {
                background-color: var(--t-highlight-color);
                color: var(--white-color);
               
            }
    }

    }
</style>