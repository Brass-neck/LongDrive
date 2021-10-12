/**
 * 这个小项目利用 node服务 + 第三方，实现给别人发短信的功能
 *
 * attention
 * 1、username和password是本人申请的第三方平台的账号，里面有可用的短信的额度
 * 2、如果哪一天发不出去了，要么平台完犊子了。。。要么说明短信额度被你们造完了。。。
 */
const http = require('http')
const crypto = require('crypto')
const querystring = require('querystring')

//参数
let url = 'http://www.lokapi.cn/smsUTF8.aspx'

let rece = 'json'
let username = '19952006064'
let password = 'qwaszx123'
let token = '5fe21990'
// param = '手机号1@手机号2@手机号3'
let param = '请添加手机号'
let templateid = '2240553E'

let passwd = md5(password)
let timestamp = Date.now()
let body =
  'action=sendtemplate&username=' +
  username +
  '&password=' +
  passwd +
  '&token=' +
  token +
  '&timestamp=' +
  timestamp
let sign = md5(body)

// 用于请求的选项
let contents = querystring.stringify({
  action: 'sendtemplate',
  username: username,
  password: passwd,
  token: token,
  timestamp: timestamp,
  sign: sign,
  rece: rece,
  templateid: templateid,
  param: param
})

let options = {
  host: 'www.lokapi.cn',
  path: '/smsUTF8.aspx',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': contents.length
  }
}

let req = http.request(options, function (res) {
  res.setEncoding('utf8')
  res.on('err', function (err) {
    console.log(err) //一段html代码
  })
  res.on('data', function (data) {
    console.log('data:', data) //一段html代码
  })
  res.on('end', function (data) {
    console.log('data:', data) //一段html代码
  })
})

req.write(contents)
req.end

function md5(data) {
  // 以md5的格式创建一个哈希值
  let hash = crypto.createHash('md5')
  return hash.update(data).digest('hex').toUpperCase()
}
