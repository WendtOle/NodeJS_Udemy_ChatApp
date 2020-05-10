const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT
const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', ({username, room}, callback) => {
        const { error, user } = addUser({ 
            id: socket.id,
            username,
            room
         })

         if (error)
            return callback((error))

        socket.join(user.room)

        socket.emit('message', generateMessage('Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined.`))

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)

        if (!user)
            return callback('No such user in room!')
        
        const filter = new Filter()

        if(filter.isProfane(message))
            return callback('Profanity is not allowed!')

        io.to(user.room).emit('message', generateMessage(message))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user)
            io.to(user.room).emit('message',generateMessage(`${user.username} has left!`))
    })

    socket.on('sendLocation', ({long, lat}, callback) => {
        const user = getUser(socket.id)

        if (!user)
            return callback('No such user in room!')

        io.to(user.room).emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${lat},${long}`))
        callback()
    })
})

server.listen(port, () => {
    console.log('Server is up and running on Port', port)
})

