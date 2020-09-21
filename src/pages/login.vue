<template>
    <div class="login-con">
        <div class="login-form">
            <div class="input-wrap">
                <div class="input-bor">
                    <span class="icon-wrap"><i class="iconfont">&#xe6bb;</i></span>
                    <input class="input-self" type="text" name="账号" v-model="phone" maxlength="11" placeholder="请填写手机号" />
                </div>
                <div class="input-bor">
                    <span class="icon-wrap"><i class="iconfont">&#xe66c;</i></span>
                    <input class="input-self" type="password" name="密码" v-model="password" maxlength="6" placeholder="请填写密码" />
                </div>
                <div class="input-bor" v-if="showRegister">
                    <span class="icon-wrap"><i class="iconfont">&#xe6bd;</i></span>
                    <input class="input-self" type="text" name="验证码" v-model="code" placeholder="请填写验证码">
                    <div class="code-wrap" @click="getrandomStr">
                        <span class="num" v-for="(h, ii) in randomNum" :key="ii">{{h}}</span>
                    </div>
                </div>
            </div>
            <button class="btn-self" @click="submit">{{showRegister ? '注册' : '登陆'}}</button>
            <span class="register" @click="changeStatus">{{showRegister ? '登陆' : '注册'}}</span>
        </div>

    </div>
</template>
<script>

let nums = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", 
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
]

export default {
    name: 'login',
    components: {
    },
    data() {
        return {
            phone: '',
            password: '',
            code: '',
            randomNum: [],
            showRegister: false
        }
    },
    computed :{

    },
    mounted() {
        this.getrandomStr()
    },
    methods: {
        getrandomStr() {
            let len = nums.length - 1
            let arr = []
            for(let i = 0, l = 4; i < l; i++) {
                let key = Math.floor(Math.random() * len)
                arr.push(nums[key])
            }
            this.randomNum = arr
        },
        changeStatus() {
             this.showRegister = !this.showRegister
             this.getrandomStr()
        },
        submit() {
            if (!this.phone) {
                return this.$toast('手机号码不能为空')
            } else if(!this.password) {
                return this.$toast('密码不能为空')
            } else if(this.password.length < 6) {
                return this.$toast('密码长度不能小于6位')
            } else if(!(/^1[3456789]\d{9}$/.test(this.phone))) {
                return this.$toast('手机号码有误')
            }

            if (this.showRegister) {  // 注册
                let codeNo = this.randomNum.join('').toLowerCase()
                let textNo = this.code.toLowerCase()
                if (codeNo != textNo) {
                    setTimeout(()=>{
                        this.getrandomStr()
                    },800)
                    return this.$toast('请输入正确验证码')
                }
                this.$http.post('/api/client-user/add', {
                    phone: this.phone,
                    password: this.password
                }).then(res => {
                    if (res.code === 0) return this.$toast(res.msg)
                    this.$toast(res.msg)
                    this.login()
                    this.showRegister = false
                })
            } else {
                // 登陆
                this.login()
            }
        },
        login() {
            this.$http.post('/api/client-user/login', {
                phone: this.phone,
                password: this.password
            }).then(res => {
                if (res.code === 0) return this.$toast(res.msg)
                this.$toast(res.msg)
                localStorage.setItem('userInfo', JSON.stringify(res.data))
                this.$router.push('/')
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    @import '@/styles/default.scss';
    .login-con{
        height: 100%;
        background: url(../assets/login_bg.png) no-repeat center;
        background-size: 100% 100%;
        .login-form{
            position: fixed;
            top:30%;
            left: 0;
            width: 100%;
        }
        .input-wrap{
            width: 80%;
            margin:0 auto;
        }
        .btn-self{
            width: 80%;
            text-align: center;
            margin:0 auto;
            display: block;
            padding: .2rem 0;
            color: $them-simple;
            font-size: 16px;
            border-radius: .4rem;
            background: #fff;
            margin-top: 1rem;
        }
        .input-bor{
            display: flex;
            margin-bottom: .3rem;
            align-items: center;
            border-bottom: 1px solid #fff;
            .icon-wrap{
                .iconfont{
                    font-size: 16px;
                    color: #fff;
                }
            }
            .input-self{
                flex: 1;
                padding:.2rem;
                background: transparent;
                color: #fff;
                font-size: 16px;
                &::-webkit-input-placeholder{
                    color: #fff;
                }
            }
        }
        .register{
            color: #fff;
            display: block;
            text-align: center;
            padding-top:.3rem;
        }
        .code-wrap{
            width: 2rem;
            height: .6rem;
            background: #fff;
            display: flex;
            align-items: center;
            .num{
                flex: 1;
                text-align: center;
                font-size: .36rem;
                font-weight: bold;
            }
        }
    }
</style>