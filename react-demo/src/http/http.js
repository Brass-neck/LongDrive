import axios from 'axios'
import { CHANGE_LOADING } from '../redux/constant'
import { store } from '../redux/store'

axios.defaults.baseURL = 'http://localhost:8080'

axios.interceptors.request.use((config) => {
  store.dispatch({
    type: CHANGE_LOADING,
    payload: true
  })

  return config
})

axios.interceptors.response.use(
  (response) => {
    if (response.status === 200 && response.statusText === 'OK') {
      store.dispatch({
        type: CHANGE_LOADING,
        payload: false
      })
      return response.data
    }
  },
  (error) => {
    store.dispatch({
      type: CHANGE_LOADING,
      payload: false
    })
    console.log('请求出错：', error)
  }
)

export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function post(url, data) {
  return new Promise((resolve, reject) => {
    axios.post(url, data).then(
      (response) => {
        resolve(response)
      },
      (err) => {
        reject(err)
      }
    )
  })
}

export function del(url, data) {
  return new Promise((resolve, reject) => {
    axios.delete(url, data).then(
      (response) => {
        resolve(response)
      },
      (err) => {
        reject(err)
      }
    )
  })
}

export function patch(url, data) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data).then(
      (response) => {
        resolve(response)
      },
      (err) => {
        reject(err)
      }
    )
  })
}

export function put(url, data) {
  return new Promise((resolve, reject) => {
    axios.put(url, data).then(
      (response) => {
        resolve(response)
      },
      (err) => {
        reject(err)
      }
    )
  })
}
