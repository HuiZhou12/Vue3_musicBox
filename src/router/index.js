import {createRouter, createWebHistory} from 'vue-router';

//全部路由
const routes = [
    { path:'/', redirect: '/index' },
    { path: '/index', name:'index', component: () => import('../views/index/index.vue'), meta:{title: 'Home | Musicbox'} },
    { path: '/playlist', name:'playlist', component: () => import('../views/playlist/index.vue'), meta:{title: 'Playlist | Musicbox'}},
    { path: '/playlist/detail', name: 'playListDetail', component: () => import('../views/playlist/detail.vue')},
    { path: '/rank', name: 'rank', meta: {title: 'Rank | Musicbox'} }
];


//应用路由
const routerModel = createRouter({
    // history 拥有两种模式：createWebHistory（没有/#/） 和 createWebHashHistory（有/#/）
    history: createWebHistory(),
    routes
});

export default routerModel;
