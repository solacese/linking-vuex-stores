import Vue from 'vue'
import Vuex from 'vuex'
import { mqttClient } from '../common/mqtt-client'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    player: '',
    isTurn: false
  },
  mutations: {
    LOGIN(state, player) {
      state.player = player
      if (state.player === 'Player1') state.isTurn = true
    },
    TOGGLE_TURN(state) {
      state.isTurn = !state.isTurn
    }
  },
  actions: {
    login({ commit }, player) {
      console.log('Attempting to login with ' + player)
      commit('LOGIN', player)
    },
    makeMove({ commit, getters }, move) {
      if (getters.isTurn()) {
        console.log(
          `Sending ${JSON.stringify(move)} to ${getters.getPlayer()}/Move`
        )
        mqttClient.publish(`${getters.getPlayer()}/Move`, move).then(() => {
          commit('TOGGLE_TURN')
        })
      }
    },
    receiveMove({ commit, getters }, otherPlayerMove) {
      if (!getters.isTurn()) {
        console.log(
          `Received move from other player ${JSON.stringify(otherPlayerMove)}`
        )
        commit('TOGGLE_TURN')
      }
    }
  },
  getters: {
    isTurn: state => () => {
      return state.isTurn
    },
    getPlayer: state => () => {
      return state.player
    }
  }
})
