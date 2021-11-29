const express = require('express')
const cors = require('cors')
const logger = require('morgan')
const app = express()

app.use(cors())
app.use(logger('dev'))

/**
 * /api/users?currentPage=1&pageSize=5
 */
app.get('/api/users', function (req, res) {
  let currentPage = parseInt(req.query.currentPage)
  let pageSize = parseInt(req.query.pageSize)

  let total = 25
  let list = []
  let offset = (currentPage - 1) * pageSize
  for (let i = offset; i < offset + pageSize; i++) {
    list.push({ id: i + 1, name: 'name' + (i + 1) })
  }
  res.json({
    currentPage,
    pageSize,
    list,
    total,
    totalPage: Math.ceil(total / pageSize)
  })
})

app.listen(8000, () => {
  console.log('server start successfully at port 8000')
})
