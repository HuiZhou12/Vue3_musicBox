<template>
  <!-- 页面主体边框 -->
  <el-container>
    
    <!-- 页面左侧导航 -->
    <Siderbar />
    <!-- 页面内容主题 -->

    <el-container>
        <!--顶部搜索及登录部分 -->
          <WebHeader />      
          <!-- 页面主体 -->
        <el-main>
          <div class="container">
            
            <router-view></router-view>
            <user-login/>
          </div>
        </el-main>   
        <!-- 页脚部分--> 
         <play-bar></play-bar> 
    </el-container>
     
  </el-container>
</template>

<script>
import Siderbar from './components/Siderbar.vue'
import WebHeader from './components/Header.vue';
import userLogin from './components/Login.vue'
import PlayBar from './components/Playbar.vue';


export default {
  name: 'App',
  components: {
    Siderbar,
    WebHeader,
    userLogin,
    PlayBar
  }
}
</script>

<style lang="less">
@import './assets/less/global.less';

.container {
    padding: 65px @paddingW 70px;
}

.el-main {
    padding: 0;
    background: var(--main-background);
}


</style>