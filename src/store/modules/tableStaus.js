const state = {
    status: 'view' // add eidt view
}

const mutations = {
    // 设置属性
    setTableStatus: function(state, status) {
        state.status = status
    },
}

const actions = {

}

export default {
    state,
    mutations,
    actions
}
