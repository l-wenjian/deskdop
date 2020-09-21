<template>
    <div id="app">
        <keep-alive :include="includePage">
            <router-view ref="myrouter"></router-view>
        </keep-alive>
    </div>
</template>
<script>

export default {
    name: 'App',
    components: {
        
    },
    computed :{
        // 页面缓存
        includePage () {
            let arr = ['pages']
            // for (const item of this.tabs.option) {
            //     if (item.page) arr.push(item.page)
            // }
            // arr = this.$differs(arr)
            return arr
        }
    },
    mounted() {

    },
    methods: {

    }
}
</script>
<style>


</style>