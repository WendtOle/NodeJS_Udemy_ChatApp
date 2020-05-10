const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationURLTemplate = document.querySelector('#location-message-template').innerHTML

//Options
const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true})

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('HH:mm')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (message) => {
    console.log(message.locationURL)
    const html = Mustache.render(locationURLTemplate, {
        username: message.username,
        locationURL: message.locationURL,
        createdAt: moment(message.createdAt).format('HH:mm')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit',(e) => {
    e.preventDefault()
    $messageFormButton.setAttribute('disabled','disabled')
    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {

        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error)
            return console.log(error)
        
        console.log('Message delivered')
    })
})

$locationButton.addEventListener('click', () => {
    if (!navigator.geolocation)
        return alert('Geolocation is not supported by your browser')

    $locationButton.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition(({coords}) => {
        socket.emit('sendLocation', {lat: coords.latitude, long: coords.longitude}, () => {
            $locationButton.removeAttribute('disabled')
            console.log('Location shared!')
        })
    })
})

socket.emit('join', {username, room}, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})