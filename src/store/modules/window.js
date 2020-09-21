const state = {
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth
}

const mutations = {
    // 设置属性
    setWindow: function(state, attr) {
        state.innerHeight = attr.innerHeight,
        state.innerWidth = attr.innerWidth
    },
}

const actions = {

}

export default {
    state,
    mutations,
    actions
}
