import { login } from '~/service/authen'

export const state = () => ({
  token: null,
  user: null
})

export const mutations = {
  setToken: (state, token) => {
    state.token = token
  },
  setUser: (state, user) => {
    state.user = user
  },
  removeToken: (state) => {
    state.token = null
  }
}

export const getters = {
  getUser: (state) => {
    return state.user
  }
}

export const actions = {
  async login ({ commit }, user) {
    try {
      const data = await login(user)
      if (data) {
        localStorage.setItem('token', data.data.token)
        commit('setToken', data.data.token)
      }
      return data
    } catch (error) {
      return null
    }
  },
  logout ({ commit }) {
    localStorage.removeItem('token')
    commit('removeToken')
  }
}
