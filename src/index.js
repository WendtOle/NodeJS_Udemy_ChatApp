const express = require('express')
const path = require('path')

const port = process.env.PORT

app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname,'../public')

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.listen(port, () => {
    console.log('Server is up and running on Port', port)
})

