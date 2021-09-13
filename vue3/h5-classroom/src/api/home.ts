/**
 * api均为假数据，使用Promise + setTimeout模拟返回
 */

import { CATEGORY_TYPES } from './../typings/home'

export function getSliders() {
  return new Promise((resolve) => {
    const sliders = [{ url: '11.jpeg' }, { url: '22.jpeg' }, { url: '33.jpeg' }]
    setTimeout(() => {
      resolve(sliders)
    }, 300)
  })
}

export function getLessons(category: CATEGORY_TYPES, offset: number = 0, limit: number = 5) {
  return new Promise((resolve, reject) => {
    const res = {
      hasMore: true,
      list: [
        {
          id: 1,
          title: 'vue精品课',
          video: '',
          poster: 'vue精品课描述',
          price: 9.9,
          category: 'string'
        },
        {
          id: 2,
          title: 'react从0到1',
          video: '',
          poster: 'react从0到1描述',
          price: 99.9,
          category: 'string'
        },
        {
          id: 3,
          title: '深入node',
          video: '',
          poster: '深入node描述',
          price: 999.9,
          category: 'string'
        },
        {
          id: 4,
          title: 'vue3.0入门',
          video: '',
          poster: 'vue3.0入门描述',
          price: 1,
          category: 'string'
        },
        {
          id: 5,
          title: 'vue原理解析',
          video: '',
          poster: 'vue原理解析描述',
          price: 9999.9,
          category: 'string'
        }
      ]
    }

    if (offset > 20) res.hasMore = false

    setTimeout(() => {
      resolve(res)
    }, 300)
  })
}
