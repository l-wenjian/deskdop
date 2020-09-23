<template>
    <div class="deskdop-bg" :style="{backgroundSize: `${bgType}`,backgroundImage:`url(${imageBgUrl})`}" ref="deskdopRef">
        <div class="deskdop-main" ref="bgRef" @contextmenu.prevent="handleMainMenu($event)">
            <section v-for="(item, index) in list" :key="index">
                <div class="deskdop-list" :style="{
                        top: `${item.y}px`,
                        left: `${item.x}px`,
                        zoom: `${mainZoom}`
                    }" 
                    @dblclick="handleDbclick(item, index)" 
                    @mousedown="handleDown($event, item, index)" 
                    @contextmenu.prevent="handleMenu($event, item)"
                    draggable="true"
                >
                    <div>
                        <span v-if="item.title == '回收站'" class="deskdop-list-icon" :style="{backgroundImage: `url(${recyclePng})`}" ></span>
                        <div v-else-if="item.files" class="deskdop-list-icon deskdop-files-bg">
                            <span class="files-icon-list" v-for="(child, childIndex) in item.children" v-if="childIndex < 9" :style="{backgroundImage: `url(${child.icon})`}"></span>
                        </div>
                        <span v-else class="deskdop-list-icon" :style="{backgroundImage: `url(${item.icon})`}" ></span>
                    </div>
                    <span class="deskdop-list-txt" :title="item.title">{{item.title}}</span>
                </div>
                <template v-if="item.files">
                    <div v-if="item.show">
                        <Dialog ref="dialogRef" 
                            @handle-down="handleDown" 
                            :is-files="true" 
                            :title="item.title" 
                            :_index="index" 
                            :main-zoom="mainZoom" 
                            :datas="item"
                            @close-dialog="closeDialog(item)" 
                            @handle-menu="handleMenu" />
                    </div>
                </template>
            </section>
        </div>
        <!-- 设置按钮 -->
       <!--  <div class="set-con">
            <span class="set-icon-wrap" @click="clickSet()">
                <i class="el-icon-s-tools" :style="{color:'#fff'}"></i>
            </span>
        </div> -->
        <!-- 右键菜单 -->
        <template>
            <div class="menu-con" :style="{top:`${menuTop}px`,left: `${menuLeft}px`,zIndex:`${$store.state.zIndex.zIndex}`}" v-show="showMenu">
                <ul class="menu-wrap">
                    <li class="menu-list" v-for="(item, index) in menuList" :key="index" @click="toPerSet(item)">
                        <span class="list-icon"><i :class="item.icon"></i></span>
                        <span class="list-del">{{item.label}}</span>
                    </li>
                </ul>
            </div>
        </template>
        <!-- 设置菜单 -->
        <template>
            <div class="menu-con" :style="{top:`${setMenu.top}px`,left: `${setMenu.left}px`,zIndex:`${$store.state.zIndex.zIndex}`}" v-show="showSetList">
                <ul class="menu-wrap">
                    <li class="menu-list" v-for="(item, index) in setList" :key="index" @click="toPerSet(item)">
                        <span class="list-icon"><i :class="item.icon"></i></span>
                        <span class="list-del">{{item.label}}</span>
                    </li>
                </ul>
            </div>
        </template>
        <!-- 个性 -->
        <template>
            <div class="notify-con" v-if="showSet">
                <div class="notify-top">
                    <span class="notify-title">设置</span>
                    <span class="notify-close-icon-wrap" @click="showSet = false">
                        <i class="el-icon-close"></i>
                    </span>
                </div>
                <div class="notify-wrap">
                    <div class="notify-list">
                        <span class="notify-list-left">背景更换：</span>
                        <div class="notify-list-right">
                            <el-upload class="avatar-uploader" action="" :auto-upload="false" :on-change="handleChange" :show-file-list="false">
                                <img v-if="imageBgUrl" :src="imageBgUrl" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </div>
                    </div>
                    <div class="notify-list">
                        <span class="notify-list-left">背景调整：</span>
                        <div class="notify-list-right">
                            <el-select v-model="bgType" placeholder="请选择" @change="chagneBgType">
                                <el-option v-for="item in bgTypeList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="notify-list">
                        <span class="notify-list-left">图标大小：</span>
                        <div class="notify-list-right">
                            <el-select v-model="mainZoom" placeholder="请选择" @change="changeIconSize">
                                <el-option v-for="item in iconSizeList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="notify-list">
                        <span class="notify-list-left">显示百度搜索：</span>
                        <div class="notify-list-right">
                            <template>
                                <el-radio-group v-model="showBaidu" @change="changeShowBaidu">
                                    <el-radio :label="1">是</el-radio>
                                    <el-radio :label="0">否</el-radio>
                                </el-radio-group>
                            </template>
                        </div>
                    </div>
                   <!--  <div class="notify-list">
                        <span class="notify-list-left">列表：</span>
                        <div class="notify-list-right">
                            <template>
                                <el-radio-group v-model="showList" @change="changeShowList">
                                    <el-radio :label="1">默认</el-radio>
                                    <el-radio :label="0">自定义</el-radio>
                                </el-radio-group>
                            </template>
                        </div>
                    </div> -->
                </div>
            </div>
        </template>
        <template v-if="showBaidu">
            <Dialog :is-baidu="true" :main-zoom="mainZoom" :show-close="false" />
        </template>

        <!-- 布局格子 -->
        <!-- <div class="gird-wrap">
            <div class="top-line" v-for="(h, i) in xList" :key="i" :style="{left: `${h}px`}">
                <div class="left-line" v-for="(hh, ii) in yList" :key="`${i}-${ii}`" :style="{top: `${hh}px`}"></div>
            </div>
        </div> -->
    </div>
</template>
<script>
import recyclePng from "../assets/recycle.png";
import bg from "../assets/bg.jpg";
import Dialog from '../components/dialog'
import SetForm from '../components/set'
import urlList from '../libs/urlList'
import { setItem, getItem, guid } from '../libs/config'

const MARGIN = 10;
let MAIN_HEIGHT = 74;
let MAIN_WIDTH = 70;

const bgTypeList = [{
    value: '100% 100%',
    label: '百分比'
}, {
    value: 'cover',
    label: '覆盖'
}, {
    value: 'contain',
    label: '图片大小'
},{
    value: `100% auto`,
    label: '宽度100%'
},{
    value: `auto 100%`,
    label: '高度100%'
},]
const iconSizeList = [{
    value: '1.2',
    label: '大图'
}, {
    value: '1',
    label: '中图'
}, {
    value: '0.8',
    label: '小图'
}]
const menuList = [
    {
        value: 'edit',
        icon: 'el-icon-edit',
        label: '修改'
    },
    {
        value: 'del',
        icon: 'el-icon-delete',
        label: '删除'
    },
]
const setList = [
    {
        value: 'add',
        icon: 'el-icon-document-add',
        label: '新增网址'
    },
    {
        value: 'addFiles',
        icon: 'el-icon-folder-add',
        label: '新增文件夹'
    },
    {
        value: 'sort',
        icon: 'el-icon-sort',
        label: '恢复默认排序'
    },
    {
        value: 'initList',
        icon: 'el-icon-s-grid',
        label: '初始化列表'
    },
    {
        value: 'personalise',
        icon: 'el-icon-view',
        label: '个性化'
    },
]
let moveEvent = null

export default {
    name: "deskdop",
    components: {
        Dialog,
        SetForm
    },
    data() {
        return {
            list: getItem('current_list') || urlList,
            recyclePng: recyclePng,
            sort: "orderly",
            mouseDown: false,
            xList: [],
            yList: [],
            mousePositon: null,
            bgTypeList: bgTypeList,
            bgType: getItem('deskdop-bg-mode') || 'cover',
            iconSizeList: iconSizeList,
            menuList: menuList,
            setList: setList,
            showSetList: false,
            imageBgUrl: getItem('deskdop-bg') || bg,
            showSet: false,
            mainZoom: getItem('icon-size') || '1',
            menuTop: 0,
            menuLeft: 0,
            showMenu: false,
            curItem: null,
            curIndex: '',
            curItemEvent: null,
            pIndex: '',
            curItemX: 0,
            curItemY: 0,
            currentIndex: null,
            showBaidu: Number(getItem('show-baidu')) || 0,  // 显示百度
            setMenu: {
                top: 0,
                left: 0
            },
            
        };
    },
    computed: {},
    mounted() {

        this.getWindowPosition()
        
        // this.$refs.bgRef.addEventListener("mouseup", this.handleUp);
        this.$refs.bgRef.onmouseup = this.handleUp

        window.addEventListener('resize', this.mainSize)

        this.init()

    },
    methods: {
        init() {
            if (!getItem('current_list')) {
                this.sortAuto()
            }
            this.listenDrop()
        },
        // 监听拖动
        listenDrop() {
            let _this = this
            document.ondragover = (e) => {
                e.preventDefault()
            }
            // 拖拽到的位置
            document.ondrop = (e) => {
                e.preventDefault()
                
                // 存放的位置判断
                let curMask = null
                for(let k of e.path) {
                    if(k.className == "dialog-content"){
                        curMask = k
                        break
                    }
                }
                if(curMask) {  // 移动到文件夹区域
                    if(_this.curItem.files) return
                    // 文件夹-文件夹
                    let perI = curMask.getAttribute('data-index')
                    if(!isNaN(_this.pIndex)) {
                        // 当前文件夹-当前文件夹
                        if(perI == _this.pIndex) {
                            return
                        } else {
                            // 其他文件夹-当前文件夹
                            _this.list[_this.pIndex].children.splice(_this.curIndex, 1)
                            _this.list[perI].children.push(_this.curItem)
                        }
                    } else{
                        // 桌面 - 文件夹
                        _this.list[perI].children.push(_this.curItem)
                        _this.list.splice(_this.curIndex, 1)
                    }
                } else {
                    // 文件夹-桌面
                    if(!isNaN(_this.pIndex)) {
                        _this.list[_this.pIndex].children.splice(_this.curIndex, 1)
                        _this.list.push(_this.curItem)
                    }
                    // 桌面-桌面
                    let r = _this.curDom.getBoundingClientRect()

                    _this.curItem.x = e.clientX*(1/this.mainZoom) - (r.right - r.left)/2 + window.scrollX
                    _this.curItem.y = e.clientY*(1/this.mainZoom) - (r.bottom - r.top)/2 + window.scrollY

                    let p = _this.getMinPosition()
                    _this.checkPosition(p, e)
                }

                setItem('current_list', this.list)  // 初始化的列表
            }
        },
        // 获取宫格
        getWindowPosition() {
            this.yList = []
            this.xList = []
            let row = Math.floor(this.$refs.bgRef.clientWidth*(1/this.mainZoom) / MAIN_WIDTH);
            let col = Math.floor(this.$refs.bgRef.clientHeight*(1/this.mainZoom) / ((MAIN_HEIGHT + MARGIN - 2)));
            for (let i = 0; i < col; i++) {
                this.yList.push(i * MARGIN + i * MAIN_HEIGHT);
            }
            for (let j = 0; j < row; j++) {
                this.xList.push(j * MAIN_WIDTH);
            }
        },
        // 自动排序
        sortAuto() {
            for(let n = 0, m = this.xList.length; n < m; n++) {
                for(let h = 0, k = this.yList.length; h < k; h++) {
                    if (this.list[k*n+h]) {
                        this.list[k*n+h].x = this.xList[n]
                        this.list[k*n+h].y = this.yList[h]
                        this.list[k*n+h].id = `${n}${h}`
                        if(this.list[k*n+h].children) {
                            this.list[k*n+h].children.map((d, i) => {
                                d.id = `${n}${h}${i}`
                            })
                        }
                    } else {
                        break;
                    }
                }
            }

            setItem('init_list', this.list)  // 初始化的列表
        },
        mainSize(e) {
            this.getWindowPosition()
        },
        handleDbclick(item, index) {
            if(item.files) {
                if(!item.show) {
                    item.show = 1
                    if(this.$refs.dialogRef) {
                        let num = 1

                        for(let k of this.$refs.dialogRef) {
                            if(k.curX == '50%') {
                                k.curX = `${50 - num}%`
                                k.curY = `${50 - num}%`
                                num++
                            }
                        }
                    }
                } else {
                    this.$store.commit('setZIndex')
                    for(let k of this.$refs.dialogRef) {
                        if(k.title == item.title) {
                            k.zIndex = this.$store.state.zIndex.zIndex
                            break;
                        }
                    }
                }
            } else {
                window.open(item.url)
            }
        },
        handleDown(e, item, index, pIndex) {
            if (e.button == 2) return 
            this.curItem = item;
            this.curIndex = index
            this.pIndex = pIndex
            this.curItemEvent = e
            this.curDom = e.currentTarget

            this.curItemX = item.x
            this.curItemY = item.y

            // let rect = e.currentTarget.getBoundingClientRect()
            
            // this.mousePositon = {
            //     x: e.clientX - rect.x + MARGIN - window.scrollX,
            //     y: e.clientY - rect.y + MARGIN - window.scrollY,
            // };
            // this.curDom = e.currentTarget
            // this.$refs.bgRef.addEventListener("mousemove", this.handleMove);
        },
        handleMove(e) {
            this.curItem.y = e.clientY - this.mousePositon.y
            this.curItem.x = e.clientX - this.mousePositon.x
            this.curDom.style.top = `${this.curItem.y}px`
            this.curDom.style.left = `${this.curItem.x}px`
        },
        // 放开鼠标事件
        handleUp(e) {
            // 右键
            // this.$refs.bgRef.removeEventListener("mousemove", this.handleMove);
            if (e.button == 2) return 
            if (this.showMenu) this.showMenu = false
            if (this.showSetList) this.showSetList = false
            if (!this.mousePositon) return

            // 放置位置
            // let p = this.getMinPosition()
            // if (this.curItem.x == p.x&&this.curItem.y == p.y) return 

            // let hasPosition = this.checkPosition(p)
            // if (!hasPosition) {
            //     this.curItem.x = p.x;
            //     this.curItem.y = p.y;
            //     this.curDom.style.top = `${this.curItem.y}px`
            //     this.curDom.style.left = `${this.curItem.x}px`
            // }
        },
        handleMenu(e, item) {
            e.stopPropagation()
            if (item.title == '回收站') return
            this.showMenu = true
            this.curItem = item
            this.menuTop = e.clientY
            this.menuLeft = e.clientX
            if (this.showSetList) this.showSetList = false
        },
        handleMainMenu(e) {
            e.stopPropagation()
            this.showSetList = true
            this.setMenu.top = e.clientY
            this.setMenu.left = e.clientX
            if (this.showMenu) this.showMenu = false
        },
        toPerSet(item) {
            if (this.showMenu) this.showMenu = false
            if (this.showSetList) this.showSetList = false
            switch (item.value) {
                case 'personalise':
                    this.showSet = true
                break;
                case 'sort':
                    this.sortAuto()
                break;
                case 'edit':
                    this.edit(()=>{
                        setItem('current_list', this.list)
                    })
                break;
                case 'del':
                    this.del(()=>{
                        setItem('current_list', this.list)
                    })
                break;
                case 'add':
                    this.add(()=>{
                        setItem('current_list', this.list)
                    })
                break;
                case 'addFiles':
                    this.addFiles(()=>{
                        setItem('current_list', this.list)
                    })
                    break; 
                case 'initList':
                    this.initList()
                    break; 
            }
            
            setItem('current_list', this.list)
        },
        getMinPosition() {
            let minX = this.xList[0],
                minY = this.yList[0];
            for (let i = 1, l = this.xList.length; i < l; i++) {
                if (Math.abs(minX - this.curItem.x) > Math.abs(this.xList[i] - this.curItem.x)) {
                    minX = this.xList[i];
                }
            }
            for (let j = 1, k = this.yList.length; j < k; j++) {
                if (Math.abs(minY - this.curItem.y) > Math.abs(this.yList[j] - this.curItem.y)) {
                    minY = this.yList[j];
                }
            }
            return { x: minX, y: minY }
        },
        clickSet() {
            // this.showSetList = true
        },
        closeDialog(item) {
            item.show = 0
            setItem('current_list', this.list)
        },
        // 图片
        handleChange(file) {
            this.getBase64(file.raw,(res)=>{
                this.imageBgUrl = res
                setItem('deskdop-bg', res)
            })
        },
        getBase64(img, callback) {
          const reader = new FileReader();
          reader.addEventListener('load', () => callback(reader.result));
          reader.readAsDataURL(img);
        },
        // 获取网站图标
        getIco(url) {
            return `http://www.google.cn/s2/favicons?domain=${url}`
        },
        // 检查位置 跟新
        checkPosition(p, e) {
            let isPostion = false, depositItem = null
            for(let i = 0, l = this.list.length; i < l; i++) {
                let h = this.list[i]
                if (p.x == h.x&&p.y == h.y) {
                    isPostion = true
                    depositItem = h
                }
            }
            if (isPostion) {
                this.dropFile(depositItem)
            } else {
                this.curItem.x = p.x;
                this.curItem.y = p.y;
                this.curDom.style.top = `${this.curItem.y}px`  // 触发回流
                this.curDom.style.left = `${this.curItem.x}px`
            }
        },
        dropFile(depositItem) {
            if (depositItem.files&&!this.curItem.files) {
                depositItem.children.push(this.curItem)
                this.list.splice(this.curIndex, 1)
                setItem('current_list', this.list)
                // 
            }else {
                let tempX = this.curItemX, tempY = this.curItemY
                this.curItem.x = depositItem.x
                this.curItem.y = depositItem.y
                depositItem.x = tempX
                depositItem.y = tempY
            }
        },
        // 增，
        add(cb) {
            const h = this.$createElement;
            this.$msgbox({
                title: '新增网址',
                message: h(SetForm, { props: {}}, null),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal: false,
                modal:false,
                beforeClose: (action, instance, done) => {
                    if(action === 'confirm') {
                        let ele = null
                        for(let k of vm.$children) {
                            if (k.hasOwnProperty('websiteName')) {
                                ele = k
                                break;
                            }
                        }
                        if (!ele.website) return this.$message('请输入网址')
                        let obj = {
                            url: ele.website.indexOf('http') === -1 ? `http://${ele.website}` : ele.website,
                            title: ele.websiteName,
                            id: guid(),
                            icon: ele.imageBgUrl || `http://www.google.cn/s2/favicons?domain=${ele.website}`,
                            x: this.setMenu.left,
                            y: this.setMenu.top
                        }
                        if(this.curItem&&this.curItem.files) {
                            this.curItem.children.push(obj)
                        } else {
                            this.list.push(obj)
                        }
                        cb()
                        done()
                    } else {
                        done()
                    }
                },
            }).then(action=>{}).catch(action=>{})
        },
        // 增文件夹
        addFiles(cb) {
            const h = this.$createElement;
            this.$msgbox({
                title: '新增文件夹',
                message: h(SetForm, { props: {
                    fromFile: false
                }}, null),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal: false,
                modal:false,
                callback: (action, vm) => {
                    if(action === 'confirm') {
                        let ele = null
                        for(let k of vm.$children) {
                            if (k.hasOwnProperty('websiteName')) {
                                ele = k
                                break;
                            }
                        }
                        let obj = {
                            title: ele.websiteName,
                            children: [],
                            id: guid(),
                            files: 1,
                            show: 0,
                            x: this.setMenu.left,
                            y: this.setMenu.top
                        }

                        this.list.push(obj)
                        cb()
                    }
                }
            })
        },
        //修改
        edit(cb){
            const h = this.$createElement;
            this.$msgbox({
                title: '修改网址',
                message: h(SetForm, { props: {
                    fromFile: this.curItem.files ? false : true,
                    datas: this.curItem,
                    status: 'edit'
                }}, null),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal: false,
                modal:false,
                beforeClose: (action, instance, done) => {
                    if(action === 'confirm') {
                        let ele = null
                        for(let k of vm.$children) {
                            if (k.hasOwnProperty('websiteName')) {
                                ele = k
                                break;
                            }
                        }
                        this.curItem.title = ele.websiteName
                        this.curItem.icon = ele.imageBgUrl
                        this.curItem.url = ele.website&&ele.website.indexOf('http') === -1 ? `http://${ele.website}` : ele.website
                        cb()
                        done()
                    } else {
                        done()
                    }
                },
            }).then(action=>{}).catch(action=>{})
        },
        //删，
        del(cb, isDrop){
            let isRecycle = false
            for(let i = 0, l = this.list.length; i < l; i++) {
                let h = this.list[i]
                if (h.id === this.curItem.id) {
                    if (h.title == '回收站') return this.$message('回收站不能删除')
                    this.list.splice(i, 1)
                    break;
                }
                if(h.children) {
                    h.children.map((k, ii) => {
                        if (k.id === this.curItem.id) {
                            h.children.splice(ii, 1)
                            if (this.list[0].id == h.id) isRecycle = true
                        }
                    })
                }
            }
            
            if(!isRecycle&&!isDrop&&this.list[0].title == "回收站") {
                this.list[0].children.push(this.curItem)
            }
            cb()
        },
        // 恢复默认列表
        initList(){
            this.$confirm('将恢复成初始列表状态', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              // this.list = getItem('init_list')
              this.list = urlList
              this.sortAuto()
              setItem('current_list', this.list)
            }).catch((e) => {
                console.log(e)
            })
        },
        changeShowList(e) {
            console.log(e)
        },
        changeShowBaidu(e) {
            setItem('show-baidu', e)
        },
        changeIconSize(e) {
            this.getWindowPosition()
            setItem('icon-size', e)
        },
        chagneBgType(e) {
            setItem('deskdop-bg-mode', e)
        }
    },
    destroyed() {
        window.removeEventListener('resize', this.mainSize)
        // this.$refs.bgRef.removeEventListener("mouseup", this.handleUp);
    },
};
</script>
<style lang="scss" scoped>
.deskdop-bg {
    width: 100%;
    height: 100%;
    min-width: 1100px;
    min-height: 600px;
    // background-image: url(../assets/bg.jpg);
    background-color: #000;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    padding: 10px;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    .deskdop-main {
        width: 100%;
        height: 100%;
        position: relative;
        // overflow: auto;
    }

    .deskdop-list {
        width: 52px;
        padding: 4px 9px;
        -webkit-user-select: none;
        user-select: none;
        position: absolute;

        &:hover {
            background: rgba(255, 255, 255, 0.4);
            outline: 2px solid rgba(255, 255, 255, 0.7);
        }
    }

    .deskdop-list-icon {
        width: 30px;
        height: 30px;
        display: block;
        margin: 0 auto;
        justify-content: center;
        align-items: center;
        // background-image: url(../assets/kuaishou.png);
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        border-radius: 8px;
        box-sizing: border-box;
        .deskdop-list-icon-img{
            display: block;
            text-align: center;
            max-height: 45px;
            max-width: 45px;
        }
        &.deskdop-files-bg{
            width: 45px;
            height: 45px;
            background: rgba(255,255,255,0.4);
            border: 2px solid rgba(255, 255, 255, 0.7);
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
        }
        .files-icon-list{
            width: 10px;
            margin-top:2px;
            margin-left: 3px;
            height: 10px;
            /*background-image: url(../assets/kuaishou.png);*/
            background-position: center;
            background-repeat: no-repeat;
            background-size: contain;
            border-radius: 2px;
            box-sizing: border-box;
        }
    }

    .deskdop-list-txt {
        width: 100%;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        color: #fff;
        margin-top: 4px;
        font-size: 12px;
    }

    .set-con {
        position: absolute;
        top: 10px;
        right: 10px;

        .set-icon-wrap {
            cursor: pointer;
        }
    }

    .notify-con {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        height: 100%;
        width: 220px;
        background: #fff;
        padding: 10px;
        box-sizing: border-box;
    }

    .notify-top {
        display: flex;
        justify-content: space-between;
        padding-bottom: 20px;
    }

    .notify-title {
        font-size: 16px;
        font-weight: bold;
    }

    .notify-close-icon-wrap {
        cursor: pointer;

        .el-icon-close {
            font-size: 16px;
            font-weight: bold;
        }
    }

    .notify-wrap {}

    .notify-list {
        align-items: center;
        padding-bottom: 10px;
        font-size: 12px;
    }

    .notify-list-left {
        display: block;
        padding-bottom: 6px;
    }

    .notify-list-right {
        display: block;
    }

    .avatar-uploader {
        width: 100%;
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
        height: 80px;
        line-height: 80px;
        text-align: center;
    }

    .avatar {
        height: 80px;
        display: block;
        margin: 0 auto;
    }
    .menu-con{
        position: fixed;
        background: #fff;
        border-radius: 4px;
        padding:2px;
        font-size: 12px;
        box-shadow: 0 0 5px #5d5d5d;
        .menu-wrap{
        }
        .menu-list{
            display: flex;
            align-items: center;
            border-bottom: 1px solid #e3e3e3;
            padding:8px 10px;
            cursor: pointer;
            &:hover{
                background: #d3d3d3;
            }
            &:last-child{
                border-bottom: none;
            }
        }
        .list-icon{
            width: 20px;
        }
        .list-del{
            flex: 1;
        }
    }

    .gird-wrap{
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(0,0,0,0.2);
        .top-line{
            position: fixed;
            top: 0;
            bottom: 0;
            border-left: 1px solid #e3e3e3;
        }
        .left-line{
            position: fixed;
            left: 0;
            right: 0;
            border-top: 1px solid #e3e3e3;
        }
    }
}
</style>