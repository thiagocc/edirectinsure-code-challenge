import colors from 'vuetify/lib/util/colors'

const state = {
  mode: 'light',
  themeColor: 'blue',
}

// getters
const getters = {
  getThemeColor: state => {
    return colors[state.themeColor].base
  },
}

// actions
const actions = {}

// mutations
const mutations = {
  setUsername(state, payload) {
    state.username = payload
  },
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations,
}
