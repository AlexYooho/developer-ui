import Vue from 'vue'
import Vuex from 'vuex'
import userStore from './userStore'
import chatStore from './chatStore'
import friendStore from './friendStore'
import groupStore from './groupStore'
import uiStore from './uiStore.js';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {
    load(context) {
      return this.dispatch("loadUser").then(() => {
        const promise = [];
        promise.push(this.dispatch("loadFriend"));
        promise.push(this.dispatch("loadNewFriendRequestCount"));
        promise.push(this.dispatch("loadGroup"));
        promise.push(this.dispatch("loadChat"));
        return Promise.all(promise);
      })
    },
    unload(context) {
      context.commit("clear");
    }
  },
  modules: {
    chatStore,
    userStore,
    friendStore,
    groupStore,
    uiStore
  }
})
