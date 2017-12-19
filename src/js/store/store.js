/* eslint no-shadow:off */
import Vuex from 'vuex';
import Vue from 'vue';
import currencyData from './currency_dashboard_mockdata_mtd.json';
import tradingData from './trading_amt_mockdata.json';


Vue.use(Vuex);

const state = {
  CurrencyData: null,
  TradingData: null,
};

const mutations = {
  getCurrency_dashboard(state, data) {
    state.CurrencyData = data;
  },
  getTrading_amt(state, data) {
    state.TradingData = data;
  },
};

const actions = {
  getCurrency_dashboard({ commit }) {
    commit('getCurrency_dashboard', currencyData);
  },
  getTrading_amt({ commit }) {
    commit('getTrading_amt', tradingData);
  },
};

const getters = {
  CurrencyData: state => state.CurrencyData,
  TradingData: state => state.TradingData,
};

// https://vuex.vuejs.org/en/plugins.html
// Plugins
// const myPlugin = (store) => {
//   // called when the store is initialized
//   store.subscribe((mutation) => {
//   // called after every mutation.
//   console.log(mutation);
//   // The mutation comes in the format of { type, payload }.
//   });
// };

export default new Vuex.Store({
  // plugins: [myPlugin],
  state,
  getters,
  actions,
  mutations,
  strict: true,
});
