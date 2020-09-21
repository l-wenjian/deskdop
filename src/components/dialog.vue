<template>
    <div :class="`dialog-con ${isBaidu ? 'has-baidu' : ''}`" 
        :style="{
            top:`${typeof curY == 'string' ? curY : curY + 'px'}`,
            left:`${typeof curX == 'string' ? curX : curX + 'px'}`,
            zIndex: zIndex
        }"
        @click="clickDialog"
        >
        <div class="dialog-header">
            <div class="header-left" @mousedown="onmousedonw($event)">
                <span class="title">{{title}}</span>
            </div>
            <div class="header-right">
                <span class="icon-wrap" @click="closeDialog" v-if="showClose">
                    <i class="el-icon-close"></i>
                </span>
            </div>
        </div>
        <template v-if="isFiles">
            <div class="dialog-content" ref="dialogConRef" :data-index="_index">
                <div class="content-wrap">
                    <div 
                        class="content-list" 
                        v-for="(item, index) in datas.children" 
                        :style="{zoom: mainZoom}" 
                        :key="index" 
                        @dblclick="dbClick(item, index)"
                        @mousedown="handleDown($event, item, index)"
                        @contextmenu.prevent="handleMenu($event, item)"
                        draggable="true"
                    >
                        <span class="content-icon-wrap" :style="{backgroundImage: `url(${item.icon})`}"></span>
                        <span class="content-txt">{{item.title}}</span>
                    </div>
                </div>
            </div>
        </template>
        <template v-if="isBaidu">
            <div class="baidu-con">
                <div class="baidu-wrap">
                    <div class="baidu-wrap-left">
                        <el-input class="baidu-wrap-input" v-model="searchValue" placeholder="" @keyup.enter.native="toBaidu"></el-input>
                    </div>
                    <div class="baidu-wrap-right">
                        <span class="baidu-wrap-search" @click="toBaidu">百度搜索</span>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
<script>

export default {
    name: 'com-dialog',
    components: {
    },
    props: {
        title: String,
        mainZoom: String,
        _index: {
            default: () => '',
            type: Number|String
        },  // 标识那个文件夹
        isFiles: {
            default: ()=>false,
            type: Boolean
        },
        isBaidu: {
            default: () => false,
            type: Boolean
        },
        showClose: {
            default: () => true,
            type: Boolean
        },
        datas: {
            default: () => {},
            type: Object
        }
    },
    data() {
        return {
            rectXY: null,
            curX: '50%',
            curY: '50%',
            zIndex: 1,
            searchValue: '',
            marginLeft: 350,
            marginTop: 250,
        }
    },
    computed:{
    },
    mounted() {
        console.log('dd')
        this.$store.commit('setZIndex')
        this.zIndex = this.$store.state.zIndex.zIndex
        // window.addEventListener("mouseup", this.onmouseup);
        if(this.isBaidu) {
            this.marginLeft = 200
            this.marginTop = 40
            this.curY = 60
        }
    },
    activated() {
        console.log('jj')
    },
    methods: {
        onmousedonw(e) {
            let rect = e.currentTarget.getBoundingClientRect()
            this.curX = rect.x + this.marginLeft - 1
            this.curY = rect.y + this.marginTop - 1
            window.addEventListener("mousemove", this.onmove);
            window.addEventListener("mouseup", this.onmouseup);
        },
        onmove(e) {
            this.curX += e.movementX
            this.curY += e.movementY
        },
        onmouseup(e) {
            window.removeEventListener('mousemove', this.onmove)
            window.removeEventListener('mouseup', this.onmouseup)
        },
        clickDialog() {
            if(this.zIndex === this.$store.state.zIndex.zIndex) return
            this.$store.commit('setZIndex')
            this.zIndex = this.$store.state.zIndex.zIndex
        },
        closeDialog() {
            this.$emit('close-dialog')
        },
        dbClick(item, index) {
            window.open(item.url)
        },
        handleMenu($event, item){
            this.$emit('handle-menu', $event, item)
        },
        toBaidu() {
            window.open(`https://www.baidu.com/s?wd=${this.searchValue}&ie=utf-8&oq=${encodeURIComponent(this.searchValue)}`)
        },
        handleDown(e, item, index) {
            this.$emit('handle-down', e, item, index, this._index)
        },
    },
    destroyed() {
        // window.removeEventListener('mouseup', this.onmouseup)
    }
}
</script>
<style lang="scss" scoped>
    .dialog-con{
        position:fixed;
        top:50%;
        left: 50%;
        margin-left: -350px;
        margin-top: -250px;
        background: #fff;
        box-shadow: 0 0 5px #5d5d5d;
        &.has-baidu{
            margin-left: -200px;
            margin-top: -40px
        }
        .dialog-header{
            display: flex;
            padding: 1px;
            height: 28px;
            line-height: 28px;
            .header-left{
                flex: 1;
                padding-left: 12px;
                .title{
                    user-select: none;
                }
            }
            .header-right{
                width: 40px;
                display: flex;
                justify-content: flex-end;
            }
            .icon-wrap{
                display: block;
                height: 100%;
                padding:0 12px;
                &:hover{
                    background: #ec3535;
                    color: #fff;
                }
                .el-icon-close{}
            }
        }
        .dialog-content{
            width: 730px;
            height: 450px;
            padding:4px;
            overflow: auto;
            border-top: 1px solid #e3e3e3;
            .content-wrap{
                display: flex;
                flex-wrap: wrap;
            }
            .content-list{
                flex: 0 0 52px;
                margin: 4px;
                padding: 4px 9px;
                -webkit-user-select: none;
                user-select: none;
                &:hover {
                    background: rgba(0, 0, 0, 0.1);
                    outline: 2px solid rgba(0, 0, 0, 0.2);
                }
            }
            .content-txt{
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                margin-top: 4px;
                font-size: 12px;
            }
            .content-icon-wrap{
                width: 30px;
                height: 30px;
                margin: 0 auto;
                display: block;
                background-image: url(../assets/kuaishou.png);
                background-position: center;
                background-repeat: no-repeat;
                background-size: contain;
                border-radius: 8px;
                box-sizing: border-box;
            }
        }
        .baidu-con{
            width: 400px;
            padding:0 28px 28px;
            background: #fff;
        .baidu-wrap{
            width: 100%;
            display: flex;
            align-items: center;
            border: 1px solid #4e6ef2;
        }
        .baidu-wrap-left{
            flex: 1;
        }
        /deep/.baidu-wrap-input{
            .el-input__inner{
                border: none;
                outline: none;
                border-radius: 0;
            }
        }
        .baidu-wrap-right{
            width: 80px;
            height: 30px;
            line-height: 30px;
        }
        .baidu-wrap-search{
            display: block;
            color: #fff;
            background: #4e6ef2;
            height: 100%;
            text-align: center;
            cursor: pointer;
            border-left: 1px solid #e3e3e3;
        }
    }
    }
</style>