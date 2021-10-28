<template>
    <div class="wrap">
        <div class="wrap-left">
            <h1>404</h1>
            <div style="font-size:18px">很抱歉，页面似乎不存在，请跳回首页</div>
            <el-button type="primary" @click="goHome">回到首页</el-button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.wrap{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    .wrap-left{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        height: 25vh;
        justify-content: space-around;
    }
}


</style>

<script>
export default {
    name : '404',
    methods : {
        goHome(){
            this.$router.push('/')
        }
    }
}
</script>