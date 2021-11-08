import { get, post, del, put, patch } from '../http/http'
import MAP from '../utils/wordMap'
import * as utils from '../utils/utils.js'

window.$g = {
  get,
  post,
  del,
  put,
  patch,
  MAP,
  utils
}
