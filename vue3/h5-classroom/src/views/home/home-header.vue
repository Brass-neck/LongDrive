<template>
  <div class="header">
    <van-dropdown-menu active-color="#1989fa">
      <!-- 这里注意绑定的是 modelValue 而不是 value ！！！ -->
      <van-dropdown-item @change="change" :modelValue="category" :options="courses" />
    </van-dropdown-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { CATEGORY_TYPES } from "../../typings/home";

export default defineComponent({
  name: "Header",
  props: {
    category: {
      type: Number as PropType<CATEGORY_TYPES>
    }
  },
  emits: ["setCurrentCategory"], // 为了提示作用
  setup(props, context) {
    const value1 = ref(0);
    const value2 = ref("a");
    const courses = [
      { text: "全部课程", value: CATEGORY_TYPES.ALL },
      { text: "react课程", value: CATEGORY_TYPES.REACT },
      { text: "vue课程", value: CATEGORY_TYPES.VUE },
      { text: "node课程", value: CATEGORY_TYPES.NODE }
    ];

    function change(val: CATEGORY_TYPES) {
      context.emit("setCurrentCategory", val);
    }
    return {
      value1,
      value2,
      courses,
      change
    };
  }
});
</script>
