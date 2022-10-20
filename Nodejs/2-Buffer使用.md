## 三、使用 Buffer

使用 Buffer 创建可读流、可写流，处理 I/O

```js
const fs = require('fs')
// 假设 1.txt 是中文内容
const rs = fs.createReadStream('./1.txt', { highWaterMark: 11 })

let data = ''

rs.on('data', (chunk) => {
  // 这里会存在隐式转换的逻辑
  data += chunk
  // 相当于 data.toString() + chunk.toString()
})
rs.on('end', () => {
  console.log(data)
})
```

**中文乱码问题**

`highWaterMark` 是设置可读流每次读取的 Buffer 的长度，如果设置了这个值，并且在读的是**中文**，可能会导致乱码问题

`buf.toString()` 方法默认以 `UTF-8` 为编码，**中文字在 UTF-8 下占 3 个字节**

所以，长度为 11 的 Buffer 每次只能读取 3 个中文（3\*3=9 字节） + 2 字节乱码

**解决方案 之 string_decoder**

设置 encoding 可以解决中文乱码问题

```js
const rs = fs.createReadStream('./1.txt', { highWaterMark: 11 })

rs.setEncoding('utf8')
```

在调用 setEncoding()时，可读流对象在内部设置了一个 `decoder 对象`，每次 data 事件都通过该 `decoder 对象`进行 Buffer 到字符串的解码，然后传递给调用者。所以设置编码后，data 不再收到原始的 `Buffer 对象`

```js
var StringDecoder = require('string_decoder').StringDecoder
var decoder = new StringDecoder('utf8')

var buf1 = new Buffer([0xe5, 0xba, 0x8a, 0xe5, 0x89, 0x8d, 0xe6, 0x98, 0x8e, 0xe6, 0x9c])
console.log(decoder.write(buf1))
// => 床前明

var buf2 = new Buffer([0x88, 0xe5, 0x85, 0x89, 0xef, 0xbc, 0x8c, 0xe7, 0x96, 0x91, 0xe6])
console.log(decoder.write(buf2))
// => 月光，疑
```

具体原理过程是这样，StringDecoder 在得到编码后，知道**宽字节字符串在 UTF-8 编码下是以 3 个字节的方式存储的**

所以第一次 write()时，只输出前 9 个字节转码形成的字符，“月”字的**前两个字节**被保留在 `StringDecoder` 实例内部

第二次 write()时，**会将这 2 个剩余字节和后续 11 个字节组合在一起**，再次用 3 的整数倍字节进行转码。于是乱码问题通过这种中间形式被解决了

## 四、正确拼接 Buffer

正确的拼接方式，是用一个数组来存储**接收到的所有 Buffer 片段**，并记录下所有片段的总长度，然后调用 `Buffer.concat()` 方法生成一个合并的 Buffer 对象

```js
var chunks = []
var size = 0

res.on('data', function (chunk) {
  chunks.push(chunk)
  size += chunk.length
})

res.on('end', function () {
  var buf = Buffer.concat(chunks, size)
  var str = iconv.decode(buf, 'utf8')
  console.log(str)
})
```
