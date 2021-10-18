<template>
    <h1>欢迎来到登录界面</h1>
    <el-button @click="goHome">回到首页</el-button>
</template>

<script>
export default {
    name : 'login',
    methods:{
        goHome(){
            this.$router.push('/welcome')
        }
    },
    mounted(){
        // this.$request({
        //     methods : 'get',
        //     path : '/login',
        //     data : {
        //         name : 'jack'
        //     }
        // }).then(res => {
        //     console.log(res)
        // })
        this.$request.get('/login',{name:'jack'}).then((res) => {
            console.log(res)
        })
    }
}
</script>

<style scoped>

</style>