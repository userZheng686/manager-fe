<template>
 <div class="basic-layout">
    <div class="nav-side"></div>
    <div class="content-right">
      <div class="nav-top"></div>
      <div class="wrapper">
        <router-view></router-view>
      </div>
    </div>
 </div>
</template>

<script>
import { ref } from 'vue'
export default{
  name : 'Home'
}

</script>


<style lang="scss" scoped>
.basic-layout{
 position: relative;
 .nav-side{
  position: fixed;
  width: 200px;
  height: 100vh;
  background-color: #001529;
  color: #fff;
  overflow-y: auto;
  transition: width .5s;
 }
 .content-right{
  
 }
}
</style>
