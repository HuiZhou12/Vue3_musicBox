<template>
    <el-aside class="aside-main">
        
        <router-link to="/" class="logo">
            <img src="../assets/img/logo.png">
        </router-link>
        <ul class="nav">
            <!-- 从curNav中查找符合item.path条件的数据，如果有它就会添加is-active类，如果没有就返回-1 -->
            <li :class="{'is-active' : curNav.indexOf(item.path) >= 0}" v-for="item in navList" :key="item.path" @click="selecNav(item)">
                <i :class="[`iconfont`, `icon-${item.path}` ]"></i><span>{{ item.name }}</span>
            </li>
        </ul>
    </el-aside>
</template>
<script>
import { computed, reactive} from 'vue';
import {useRoute, useRouter} from 'vue-router';
export default {
    name:'SiderBar',
    setup(){
        const route = useRoute(); //当前路由地址
        const router = useRouter(); //路由实例
        const navList = reactive([
            {name:'首页',path:'index'},
            {name:'排行榜',path:'rank'},
            {name:'歌单',path:'playlist'},
            {name:'MV',path:'mvlist'},
            {name:'歌手',path:'singer'},
            {name:'我的音乐',path:'my'},
        ]);

        //获取当前路由地址,每当路由路径发生变化时，curNav的值就会自动更新
        const curNav = computed(() => {return route.path});

        const selecNav = (item) => {
            router.push({
                path: `/${item.path}`
            })
        };
        return {
            selecNav,
            navList,
            curNav
        }

    }
}

</script>
<style lang="less" scoped>
@import '../assets/less/global.less';

.aside-main{
    
    position: relative;
    /* 贴层属性，数值越大层数越高 */
    z-index: 100;
    width: @menuWidth;
    text-align: center;
    box-shadow: var(--t-modal-shadow);
    background: var(--box-background);
}

.logo{
    display: inline-block;
    width: 145px;
    height: 81px;
    padding: 20px;
    margin: 0 auto;
    border-bottom: 1px solid #f5f5f5;
    font-size: 0;

    img {
        width: 100%;
        height: 100%;
    }
}

.nav {
    padding-top: 50px;
}

.nav li {
    display:block;
    padding: 10px;
    margin: 10px 20px;
    border-radius: var(--border-radius);
    color: var(--t-text-color);
    text-align: left;
    cursor: pointer;//鼠标悬停到元素上时显示相应样式

    &.is-active{
        color: var(--thighlight-color);
        font-weight: 400;
        background: var(--t-muted-background);
        color: var(--t-primary-color);
        .iconfont {
            color: var(--thighlight-color);
        }
    }
    
    span {
        display: inline-block;
        line-height: 32px;
    }

    .iconfont {
        display: inline-flex;
        width: 32px;
        height: 32px;
        margin-right: 20px;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        vertical-align: top;
    }
    
}
</style>