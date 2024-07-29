import { getCurrentInstance, onMounted, reactive } from "vue"

export function hotPlayList() {
    const { proxy } = getCurrentInstance();


    const playList_info = reactive({ 
        tags: [],  //热门标签列表
        lists:[],  //表单列表
        index:0,  //当前选中标签
        loading:true,
        params: { limit: 6, offset: 0 }
    });

    //获取热门推荐歌单标签
    const getHotTages = async () => {
        const {data: res } = await proxy.$http.hotPlayList()

        if(res.code !==200) {
            return proxy.$msg.error('数据请求失败')
        }

        res.tags.unshift({name: '为你推荐'})
        playList_info['tags'] = res.tags
    };

    //切换热门推荐歌单标签
    const choosePlayListTag = (index) => {
        playList_info['index'] = index;
        playList_info['params']['cat'] = index !== 0 ? playList_info['tags'][index].name : '' ;
        playList_info['loading'] = true;
        getPlayLIst(playList_info['params']);
    }
    
    //分类表单列表
    const getPlayLIst = async (params) => {
        const {data: res } = await proxy.$http.playList(params);
        
        if(res.code != 200 ) {
            return proxy.$mgs.error('请求数据失败')
        }
        playList_info["lists"] = res.playlists;
        playList_info['loading'] = false;
    }

    onMounted( () => {
        getHotTages();
        getPlayLIst(playList_info['params'])
    })

    return {
        playList_info,
        choosePlayListTag
    }
}