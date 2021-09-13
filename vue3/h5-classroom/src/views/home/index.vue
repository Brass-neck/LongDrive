<template>
  <div class="home">
    <!-- 头部 -->
    <home-header :category="category" @setCurrentCategory="setCurrentCategory"></home-header>

    <div class="home-container" ref="refreshElm">
      <!-- 轮播图 -->
      <Suspense>
        <template #default>
          <home-slider></home-slider>
        </template>
        <template #fallback> loading </template>
      </Suspense>

      <!-- 列表 -->
      <home-list :lessonList="lessonList"></home-list>
      <van-divider v-if="isLoading" class="divider"> loading... </van-divider>
      <van-divider v-if="!hasMore" class="divider"> 我是有底线的 </van-divider>
    </div>
  </div>
</template>

<style lang="less">
.home-container {
  position: absolute;
  top: 48px;
  bottom: 50px;
  width: 100%;
  overflow-y: scroll;
}
.divider {
  border-color: '#1989fa';
  padding: '0 16px';
}
</style>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { Store, useStore } from "vuex";

import HomeHeader from "./home-header.vue";
import HomeList from "./home-list.vue";
import HomeSlider from "./home-slider.vue";

import { IGlobalState } from "../../store/index";
import { CATEGORY_TYPES } from "../../typings/home";
import * as Types from "../../store/action-types";
import { useLoadMore } from "../../hooks/useLoadMore";

// 功能函数可以提取到hooks中去

// 处理头部课程类型
function useCategory(store: Store<IGlobalState>) {
  let category = computed(() => store.state.home.currentCategory);

  function setCurrentCategory(category: CATEGORY_TYPES) {
    // 把最新category提交到home模块下
    store.commit(`home/${Types.SET_CATEGORY}`, category);
  }
  return {
    category,
    setCurrentCategory
  };
}

// 处理课程列表
function useCourseList(store: Store<IGlobalState>) {
  const lessonList = computed(() => store.state.home.lessons.list);

  // vuex中list为空，才加载接口，来回切换页面触发的mounted，不会加载该接口，直接使用vuex
  onMounted(() => {
    if (!lessonList.value.length) {
      store.dispatch(`home/${Types.SET_COURSES_LIST}`);
    }
  });
  return {
    lessonList
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

    // 获取 vuex 中的分类状态，并且提供一个更改状态的方法
    const { category, setCurrentCategory } = useCategory(store);

    // 课程列表
    const { lessonList } = useCourseList(store);

    // 下滑触底
    const refreshElm = ref<null | HTMLElement>(null);
    const { isLoading, hasMore } = useLoadMore(
      refreshElm,
      store,
      `home/${Types.SET_COURSES_LIST}`
    );

    return {
      category,
      setCurrentCategory,
      lessonList,
      isLoading,
      hasMore,
      refreshElm
    };
  }
});
</script>
