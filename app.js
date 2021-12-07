const express = require('express')

// 创建web服务器
const app = express()

// 托管静态文件
app.use(express.static('./dist'))

// 监听web服务器
app.listen(3000, () => {
    console.log('web server running at http://0.0.0.0')
})
