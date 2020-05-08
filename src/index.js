const express = require('express')
const http = require('http')
const path = require('path')

app = express()
const server = http.createServer(app)

const port = process.env.PORT
const publicDirectoryPath = path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath))

server.listen(port, () => {
    console.log('Server is up and running on Port', port)
})

