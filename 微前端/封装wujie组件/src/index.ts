import { defineComponent, h, onMounted, watch, getCurrentInstance } from 'vue';
import { startApp } from 'wujie'
import type { PropType } from 'vue'

const wujie = defineComponent({
  props: {
    name: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    el: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    }
  },

  setup(props) {

    const instance = getCurrentInstance()

    const init = () => {
      startApp({
        name: props.name,
        url: props.url,
        el: instance?.refs.wujie as HTMLElement
      })
    }

    onMounted(() => {
      init()
    })

    watch([props.name, props.url], () => {
      init()
    })

    return () => h('div', {
      style: {
        width: props.width,
        height: props.height
      },
      ref: 'wujie'  // ref, 用于获取dom元素
    })
  }
})

wujie.install = function (app) {
  app.component('wujieVue', wujie)
}

export default wujie