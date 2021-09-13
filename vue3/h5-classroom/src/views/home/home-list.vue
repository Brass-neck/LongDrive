<template>
  <div class="list">
    <van-card
      v-for="ll in lessonList"
      :key="ll.id"
      :price="ll.price"
      :desc="ll.poster"
      :title="ll.title"
      thumb="https://img.yzcdn.cn/vant/ipad.jpeg"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { ILesson } from "../../typings/home";

export default defineComponent({
  name: "List",
  props: {
    lessonList: {
      type: Array as PropType<ILesson[]>
    }
  },
  setup(props) {}
});
</script>
