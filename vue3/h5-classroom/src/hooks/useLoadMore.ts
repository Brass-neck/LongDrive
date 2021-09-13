import { Ref } from '@vue/reactivity'
import { Store } from 'vuex'
import { IGlobalState } from '../store/index'
import _ from 'lodash'
import { computed, onMounted } from 'vue'

export function useLoadMore(
  refreshELm: Ref<null | HTMLElement>,
  store: Store<IGlobalState>,
  type: string
) {
  let element: HTMLElement

  function _loadMore() {
    // 可视区高度
    let containerHeight = element.clientHeight
    // 卷区（已经滚动的）高度
    let scrollTop = element.scrollTop
    // 整个高度
    let scrollHeight = element.scrollHeight

    if (containerHeight + scrollTop + 20 >= scrollHeight) store.dispatch(type)
  }

  onMounted(() => {
    // mounted后，元素挂载完成，所以一定是 HTMLElement类型
    element = refreshELm.value as HTMLElement
    element.addEventListener('scroll', _.debounce(_loadMore, 300))
  })

  const isLoading = computed(() => store.state.home.lessons.loading)
  const hasMore = computed(() => store.state.home.lessons.hasMore)

  return {
    isLoading,
    hasMore
  }
}
