<template>
    <div class="frame-center">
        <span @click="test">点击</span>
        <iframe class="frame-self" :src="url" frameborder="0" ref="iframeRef"></iframe>
    </div>
</template>
<script>

export default {
    name: 'frame',
    components: {
    },
    data() {
        return {
            url: `https://login.51job.com/login.php`
        }
    },
    computed :{

    },
    mounted() {
        
        this.$refs.iframeRef.onload = (e) => {
            console.dir(this.$refs.iframeRef.contentWindow)
        }
    },
    methods: {
        test() {
             console.dir(this.$refs.iframeRef.contentWindow)
        }
    }
}
</script>
<style lang="scss" scoped>
.frame-center{
    height: 100vh;
    .frame-self{
        width: 100%;
        height: 100%;
    }
}
</style>