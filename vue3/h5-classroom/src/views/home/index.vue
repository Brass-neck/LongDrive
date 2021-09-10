<template>
  <div class="home">
    <!-- 头部 -->
    <home-header :category="category" @setCurrentCategory="setCurrentCategory"></home-header>
    <!-- 轮播图 -->
    <home-slider></home-slider>

    <!-- 列表 -->
    <home-list></home-list>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { Store, useStore } from "vuex";

import HomeHeader from "./home-header.vue";
import HomeList from "./home-list.vue";
import HomeSlider from "./home-slider.vue";

import { IGlobalState } from "../../store/index";
import { CATEGORY_TYPES } from "../../typings/index";
import * as Types from "../../store/action-types";

//todo: Store<IGlobalState>泛型？
// 功能可以提取到hooks中去
function useCategory(store: Store<IGlobalState>) {
  let category = computed(() => store.state.home.currentCategory);

  function setCurrentCategory(category: CATEGORY_TYPES) {
    // 把最新category提交到home模块下
    store.commit(`/home/${Types.SET_CATEGORY}`, category);
  }
  return {
    category,
    setCurrentCategory
  };
}

export default defineComponent({
  name: "Home",
  components: {
    HomeHeader,
    HomeSlider,
    HomeList
  },
  setup() {
    let store = useStore<IGlobalState>();

    // 1. 获取 vuex 中的分类状态，并且提供一个更改状态的方法
    const { category, setCurrentCategory } = useCategory(store);

    return {
      category,
      setCurrentCategory
    };
  }
});
</script>
