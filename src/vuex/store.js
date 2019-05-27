import Vue from 'vue'
import Vuex from 'vuex'
import firebaseService from '@/services/firebaseServices.js'
import * as user from '@/vuex/modules/user.js'
import * as notification from '@/vuex/modules/notification.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    notification
  },
  state: {
    JMTZs: [],
    getJMTZs: null,
    getAllJMTZs: null
  },
  mutations: {
    GET_JMTZS(state, payload) {
      state.getJMTZs = payload
    },
    GET_ALL_JMTZS(state, payload) {
      state.getAllJMTZs = payload
    },
    SET_JMTZ(state, payload) {
      state.JMTZs.push(payload)
    },
    REMOVE_JMTZ(state, obj) {
      state.getJMTZs = obj
    }
  },
  actions: {
    createjmt({ commit, dispatch, rootState }, payload) {
      return firebaseService
        .addJMTZ({ rootState }, payload)
        .then(() => {
          commit('SET_JMTZ', payload)
          const notification = {
            type: 'success',
            message: '존맛탱집이 생성되었습니다.'
          }
          dispatch('notification/add', notification, { root: true })
        })
        .catch(error => {
          const notification = {
            type: 'error',
            message: '오류가 발생했습니다. : ' + error.message
          }
          dispatch('notification/add', notification, { root: true })
          throw error
        })
    },
    getJMTZs({ rootState, dispatch, commit }) {
      console.log('2. store action getJMTZs start')
      return firebaseService
        .getJMTZ({ rootState })
        .once('value')
        .then(snapshot => {
          console.log('3. after fb servcices', snapshot.val())
          const notification = {
            type: 'success',
            message: '존맛탱집 리스트를 정상적으로 불러왔습니다.'
          }
          dispatch('notification/add', notification, { root: true })
          commit('GET_JMTZS', snapshot.val())
          return snapshot.val()
        })
        .catch(error => {
          const notification = {
            type: 'error',
            message: '오류가 발생했습니다. : ' + error.message
          }
          dispatch('notification/add', notification, { root: true })
        })
    },
    getAllJMTZs({ rootState, dispatch, commit }) {
      return firebaseService
        .getAllJMTZ({ rootState })
        .once('value')
        .then(snapshot => {
          const notification = {
            type: 'success',
            message: '존맛탱집 전체 리스트를 정상적으로 불러왔습니다.'
          }
          dispatch('notification/add', notification, { root: true })
          commit('GET_ALL_JMTZS', snapshot.val())
          return snapshot.val()
        })
        .catch(error => {
          const notification = {
            type: 'error',
            message: '오류가 발생했습니다. : ' + error.message
          }
          dispatch('notification/add', notification, { root: true })
        })
    },
    removeJMTZ({ rootState, commit, dispatch }, { obj, key }) {
      return firebaseService
        .removeJMTZ({ rootState }, obj, key)
        .then(() => {
          const notification = {
            type: 'success',
            message: '정상적으로 리스트 삭제되었습니다.'
          }
          dispatch('notification/add', notification, { root: true })
          commit('REMOVE_JMTZ', obj)
        })
        .catch(error => {
          const notification = {
            type: 'error',
            message: '오류가 발생했습니다. : ' + error.message
          }
          dispatch('notification/add', notification, { root: true })
        })
    }
  },
  getters: {}
})
