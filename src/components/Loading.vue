<template>
    <div class="loading">
        <div class="loader"></div>
    </div>
</template>
<script>
export default {
}
</script>
<style lang="less" scoped>
    .loading {
        position: relative;
        width: 100%;
        height: 100%;
        max-height: 700px;
        min-height: 150px;
    }
    .loader {
        position: absolute;
        top: calc(50% - 1.25em);
        left: calc(50% - 11.25em);
        width: 2.5em;
        height: 2.5m;
    }
</style>