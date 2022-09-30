# Buffer 的一些概念

Buffer 是一个像 Array 的对象，但它主要用于操作**字节**，Buffer 是一个典型的 JavaScript 与 C++结合的模块，它将`性能相关`的部分用 `C++` 实现，将`非性能相关`的部分用 `JavaScript` 实现

在 Node 中，内存是十分珍稀的资源，由于一般情况下， Buffer 操作的内容是字节而不是字符串，并且通常量比较大，例如：I/O 流、图片/文件内容等，所以，Buffer 所占用的内存**不是通过 V8 分配的**，属于**堆外内存**

> 由于 V8 垃圾回收性能的影响，将常用的操作对象用更高效和专有的内存分配回收策略来管理是个不错的思路

# Buffer api

## 一、创建 Buffer

1. new Buffer(array | string)

参数：  
直接传入具体数据

```js
let buf1 = new Buffer([10, 20, 30, 40, 50])
let buf2 = new Buffer('hello')
```

不推荐使用，使用时会有 warning，`Buffer() is deprecated due to security and usability issues. Please use the Buffer.alloc(), Buffer.allocUnsafe(), or Buffer.from() methods instead.`，建议用其他 api 替代

2. Buffer.alloc(size, [fill], [encoding])

参数：  
 size：必填，分配一个 size `字节`大小的内存  
 fill：可选，使用 fill 来填充 Buffer 中的每一个字节  
 encoding：可选，如果 fill 为字符串，那么使用 encoding 来对字符串进行编码为二进制

```js
const buf1 = Buffer.alloc(5)
console.log(buf1) // <Buffer 00 00 00 00 00>

const buf2 = Buffer.alloc(10, 1)
console.log(buf2) // <Buffer 01 01 01 01 01 01 01 01 01 01>

const buf3 = Buffer.alloc(12, 'hello world!', 'utf-8')
console.log(buf3) // <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64 21>
```

3. Buffer.from(array | string | Buffer object | Object)

参数：

- 传入 Buffer 对象时，相当于拷贝一份传入的 Buffer 对象
- 还可以传入普通 Object

```js
const buf1 = Buffer.from([1, 2, 3, 4, 5])
console.log(buf) // <Buffer 01 02 03 04 05>

const buf2 = Buffer.from('hello', 'utf-8')
console.log(buf) // <Buffer 68 65 6c 6c 6f>

const buff3 = Buffer.from(buf2)
console.log(buf2 === buf3) // false

// 传入普通对象
let obj = {
  [Symbol.toPrimitive](hint) {
    return 'a'
  }
}
const buff4 = Buffer.from(obj)
console.log(buff4.toString()) // a
```

4. 注意事项

给元素的赋值如果小于 0，就将该值逐次加 256，直到得到一个 0 到 255 之间的整数。如果得到的数值大于 255，就逐次减 256，直到得到 0~255 区间内的数值。如果是小数，舍弃小数部分，只保留整数部分

```js
const buf = Buffer.alloc(30)

buf[20] = -100
console.log(buf[20]) // 156

buf[21] = 300
console.log(buf[21]) // 44

buf[22] = 3.1415
console.log(buf[22]) // 3
```

## 二、Buffer 对象的属性

1. length

通过 length 属性可以知道 Buffer 数组的长度

```js
const buf = Buffer.from('Hello World!')
console.log(buf.length) // 12
```

2. buffer

Buffer 对象内部实际存储数据的是一个 ArrayBuffer 的对象，通过 buffer 属性可以得到这个对象

```js
const buf = Buffer.alloc(5)
console.log(buf.buffer) // ArrayBuffer { [Uint8Contents]: <00 00 00 00 00>, byteLength: 5 }
```

3. 读取 Buffer

   3.1 下标

   ```js
   const buf = Buffer.from([1, 2, 3, 4, 5])
   console.log(buf[0]) // 1
   console.log(buf[5]) // undefined
   ```

   3.2 readXXX

   通过 buf.readInt8() buf.readInt16() buf.readUint8() buf.readUint16() 等方法来访问 Buffer 对象中的内容

   ```js
   const buf = Buffer.from([1, 2, 3, 4, 5])
   console.log(buf.readInt8(2)) // 3
   console.log(buf.readInt8(5)) // RangeError [ERR_OUT_OF_RANGE]: The value of "offset" is out of range.
   ```

   3.3 迭代器

   Buffer 对象的迭代器同数组的迭代器相同，也有三个迭代器：entries，keys，values

4. 写 Buffer

   4.1 下标

   ```js
   const buf = Buffer.from([1, 2, 3])
   buf[0] = 4
   console.log(buf) // <Buffer 04 02 03>
   ```

   4.2 write(string, [offset], [length], [encoding])

   参数：  
   string：要写入的字符串  
   offset：偏移量，即跳过 offset 个字节开始写入，默认为 0  
   length：要写入的最大字节数，不超过 buf.length - offset，默认值为 buf.length - offset  
   encoding：指定编码，默认为 utf-8

   ```js
   const buff = Buffer.from([1, 2, 3, 4])
   // 跳过1个字符开始写入
   buff.write('hi', 1)
   console.log(buf) // <Buffer 01 68 69 04>
   ```

   4.3 writeInt8(value, offset)

   参数：  
   value：要写入的值  
   offset：偏移量，默认为 0

   ```js
   const buff = Buffer.alloc(5)
   buff.writeInt8(6, 0)
   buff.writeInt8(5, 1)
   console.log('buff: ', buff)
   // buff:  <Buffer 06 05 00 00 00>
   ```

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

所以，长度为 11 的 Buffer 每次只能读取 2 个中文（3\*3=9 字节） + 2 字节乱码
