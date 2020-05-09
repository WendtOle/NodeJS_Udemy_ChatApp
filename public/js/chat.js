const socket = io()

socket.on('message', (message) => {
    console.log(message)
})

document.getElementById('message-form').addEventListener('submit',(e) => {
    e.preventDefault()
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message)
})

document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation)
        return alert('Geolocation is not supported by your browser')

    navigator.geolocation.getCurrentPosition(({coords}) => {
        console.log('Choords where found - emitting them now')
        socket.emit('sendLocation', {lat: coords.latitude, long: coords.longitude})
    })
})