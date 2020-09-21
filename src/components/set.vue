<template>
    <div class="set-form-con">
        <div class="notify-con">
            <div class="notify-wrap">
                <template v-if="fromFile">
                    <div class="notify-list">
                        <span class="notify-list-left">图标：</span>
                        <div class="notify-list-right">
                            <el-upload class="avatar-uploader" action="" :auto-upload="false" :on-change="handleChange" :show-file-list="false">
                                <img v-if="imageBgUrl" :src="imageBgUrl" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                            <span class="tip">没上传图标会自动识别</span>
                        </div>
                    </div>
                    <div class="notify-list">
                        <span class="notify-list-left">网址：</span>
                        <div class="notify-list-right">
                            <el-input
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 4}"
                                placeholder="请输入内容"
                                v-model="website">
                            </el-input>
                        </div>
                    </div>
                </template>
                <div class="notify-list">
                    <span class="notify-list-left">名称：</span>
                    <div class="notify-list-right">
                        <el-input v-model="websiteName" placeholder="请输入名称"></el-input>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    name: 'setForm',
    components: {
    },
    props: {
        datas: {
            default: () => {},
            type: Object
        },
        fromFile: {
            default: () => true,
            type: Boolean
        },
        status: String
    },
    data() {
        return {
            websiteName: '',
            website: '',
            imageBgUrl: ''
        }
    },
    watch: {
        datas: function (res) {
            if(res) {
                this.websiteName = res.title
                this.website = res.url
                this.imageBgUrl = res.icon
            } else {
                this.websiteName = ''
                this.website = ''
                this.imageBgUrl = ''
            }
            return res
        }
    },
    computed :{

    },
    mounted() {
        if(this.status == 'edit') {
            this.websiteName = this.datas.title
            this.website = this.datas.url
            this.imageBgUrl = this.datas.icon
        }
    },
    methods: {
        // 图片
        handleChange(file) {
            this.getBase64(file.raw,(res)=>{
                this.imageBgUrl = res
            })
        },
        getBase64(img, callback) {
          const reader = new FileReader();
          reader.addEventListener('load', () => callback(reader.result));
          reader.readAsDataURL(img);
        },
    }
}
</script>
<style lang="scss" scoped>
.set-form-con{
    .notify-con {}
    .notify-wrap {
    }

    .notify-list {
        display: flex;
        align-items: center;
        padding-bottom: 10px;
        font-size: 13px;
    }

    .notify-list-left {
        display: block;
        padding-bottom: 6px;
    }

    .notify-list-right {
        flex: 1;
    }

    .avatar-uploader {
        width: 40px;
    }

    /deep/ .avatar-uploader .el-upload {
        border: 1px solid #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 100%;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
    }

    .avatar {
        height: 40px;
        display: block;
        margin: 0 auto;
    }
    .tip{
        color: #ccc;
        font-size: 12px;
    }
}

</style>