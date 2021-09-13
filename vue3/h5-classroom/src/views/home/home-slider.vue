<template>
  <div class="slider">
    <!-- v-if 有数据才渲染 -->
    <van-swipe v-if="sliders.length" :autoplay="3000">
      <van-swipe-item v-for="item in realSliders" :key="item" style="height: 200px"
        ><img :src="item" style="height: 100%; width: 100%"
      /></van-swipe-item>
    </van-swipe>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { IGlobalState } from "../../store";
import * as Types from "../../store/action-types";

export default defineComponent({
  name: "Slider",
  /**
   * 合理做法：在home/index.vue中获取轮播图数据然后传入到这里，和home-header一样的逻辑
   * 这里为了演示 vue3 新特性 <suspense></suspense> ，特意将数据获取放到这里来做
   *
   * 如果setup为async异步，那么该组件在引用的地方就需要被suspense标签包裹
   */
  async setup(props) {
    const store = useStore<IGlobalState>();
    let sliders = computed(() => store.state.home.sliders);

    // 缓存，没有数据才请求
    let realSliders;
    if (!sliders.value.length) {
      await store.dispatch(`home/${Types.SET_SLIDERS}`);
      realSliders = sliders.value.map(e => require("../../assets/" + e.url));
    }

    return {
      sliders,
      realSliders
    };
  }
});
</script>
