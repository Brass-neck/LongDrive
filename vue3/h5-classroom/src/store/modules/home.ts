import { CATEGORY_TYPES, IHomeState, ISlider } from '@/typings/home'
import { Module } from 'vuex'
import { IGlobalState } from '..'

// 引入所有动作名称
import * as Types from '../action-types'
import { getSliders } from '../../api/home'

// 首页里应该存哪些属性
const state: IHomeState = {
  /**
   * 首页header中的当前状态
   */
  currentCategory: CATEGORY_TYPES.ALL,
  /**
   * 轮播图
   */
  sliders: [],
  /**
   * 课程列表（注意不是 数组 而是 对象，因为还需要定义一些逻辑的状态）
   */
  lessons: {
    hasMore: true, // 有没有更多数据
    loading: false, // 是否正在加载
    offset: 0, // 列表项偏移
    limit: 5, // 每次几条
    list: [] // 当前已经显示到页面的课程
  }
}

// Module<自己的状态，根状态>
const home: Module<IHomeState, IGlobalState> = {
  namespaced: true,
  state,
  mutations: {
    // state是模块局部的最新状态，payload是要改的分类
    [Types.SET_CATEGORY](state, payload: CATEGORY_TYPES) {
      state.currentCategory = payload
    },
    [Types.SET_SLIDERS](state, sliders: ISlider[]) {
      state.sliders = sliders
    }
  },

  // actions中异步获取数据，然后commit到mutations修改state中的数据
  actions: {
    async [Types.SET_SLIDERS]({ commit }) {
      let sliders = await getSliders()
      // 提交到mutations中去
      commit(Types.SET_SLIDERS, sliders)
    }
  }
}

// 导出这个模块
export default home
