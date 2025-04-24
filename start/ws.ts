import app from '@adonisjs/core/services/app'
import { Server } from 'socket.io'
import server from '@adonisjs/core/services/server'

app.ready(() => {
    const io = new Server(server.getNodeServer(), {
        path: '/socket',
        cors: {
            origin: '*',
        },
    })
    io?.on('connection', (socket) => {
        console.log('A new connection', socket.id)

        socket.emit('simple', 'You are in simple')
        socket.on('response', (message) => {
            console.log('hi there', message)
        })
    })
})
