import { createStore } from 'vuex'
import home from './modules/home'
import { IHomeState } from '@/typings'

// 所有模块的state集合
export interface IGlobalState {
  // home模块
  home: IHomeState
}

const store = createStore<IGlobalState>({
  mutations: {},
  actions: {},
  modules: {
    home
  }
})

export default store
