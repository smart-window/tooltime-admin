import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'

import * as firebase from '@/services/firebase'
import * as jwt from '@/services/jwt'

const mapAuthProviders = {
  firebase: {
    login: firebase.login,
    register: firebase.register,
    currentAccount: firebase.currentAccount,
    logout: firebase.logout,
  },
  jwt: {
    login: jwt.login,
    register: jwt.register,
    currentAccount: jwt.currentAccount,
    logout: jwt.logout,
  },
}

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    name: '',
    role: '',
    email: '',
    authorized: process.env.VUE_APP_AUTHENTICATED || false, // false is default value
    loading: false,
  },
  mutations: {
    SET_STATE(state, payload) {
      Object.assign(state, {
        ...payload,
      })
    },
  },
  actions: {
    LOGIN({ commit, dispatch, rootState }, { payload }) {
      const { email, password } = payload
      commit('SET_STATE', {
        loading: true,
      })

      const login = mapAuthProviders[rootState.settings.authProvider].login
      login(email, password).then((success) => {
        if (success) {
          dispatch('LOAD_CURRENT_ACCOUNT')
          Vue.prototype.$notification.success({
            message: 'Logged In',
            description: 'You have successfully logged in to Air UI Vue Admin Template!',
          })
        }
        if (!success) {
          commit('SET_STATE', {
            loading: false,
          })
        }
      })
    },
    REGISTER({ commit, dispatch, rootState }, { payload }) {
      const { email, password, name } = payload
      commit('SET_STATE', {
        loading: true,
      })

      const register = mapAuthProviders[rootState.settings.authProvider].register
      register(email, password, name).then((success) => {
        if (success) {
          dispatch('LOAD_CURRENT_ACCOUNT')
          Vue.prototype.$notification.success({
            message: 'Succesful Registered',
            description: 'You have successfully registered!',
          })
        }
        if (!success) {
          commit('SET_STATE', {
            loading: false,
          })
        }
      })
    },
    LOAD_CURRENT_ACCOUNT({ commit, rootState, dispatch }) {
      commit('SET_STATE', {
        loading: true,
      })

      const currentAccount = mapAuthProviders[rootState.settings.authProvider].currentAccount
      currentAccount().then((response) => {
        if (response) {
          const { email, name, role } = response
          commit('SET_STATE', {
            name,
            email,
            role,
            authorized: true,
          })

          dispatch('LOAD_CATEGORIES', {}, { root: true })
          dispatch('LOAD_LOCATIONS', {}, { root: true })
        }
        commit('SET_STATE', {
          loading: false,
        })
      })
    },
    LOGOUT({ commit, rootState }) {
      const logout = mapAuthProviders[rootState.settings.authProvider].logout
      logout().then(() => {
        commit('SET_STATE', {
          name: '',
          role: '',
          email: '',
          authorized: false,
          loading: false,
        })
        router.push('/auth/login')
      })
    },
  },
  getters: {
    user: (state) => state,
  },
}
