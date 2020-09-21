const state = {
    tableHeight: window.innerHeight - 194 - 72 - 90
}

const mutations = {
    // 设置属性
    setTableHeight: function(state, height) {
        state.tableHeight = height
    },
}

const actions = {

}

export default {
    state,
    mutations,
    actions
}
