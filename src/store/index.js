import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import settings from './settings'
import * as Types from './types'
import * as API from '@/services/api'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    settings,
  },
  state: {
    categories: [],
    locations: [],
  },
  mutations: {
    SET_STATE(state, payload) {
      Object.assign(state, {
        ...payload,
      })
    },
    [Types.SET_CATEGORYS](state, categories) {
      console.log('[Types.SET_CATEGORYS] => ', categories)
      state.categories = categories
    },
    [Types.SET_LOCATIONS](state, locations) {
      console.log('[Types.SET_CATEGORYS] => ', locations)
      state.locations = locations
    },
  },
  actions: {
    async LOAD_CATEGORYS({ commit }) {
      try {
        const categories = await API.getCategories()
        commit(Types.SET_CATEGORYS, categories)
      } catch (e) {
        commit(Types.SET_CATEGORYS, [])
        Vue.prototype.$notification.error({
          message: 'Loading categories failed',
          description: e.message,
        })
      }
    },
    async LOAD_LOCATIONS({ commit }) {
      try {
        const locations = await API.getLocations()
        commit(Types.SET_LOCATIONS, locations)
      } catch (e) {
        commit(Types.SET_LOCATIONS, [])
        Vue.prototype.$notification.error({
          message: 'Loading locations failed',
          description: e.message,
        })
      }
    },
  },
})
