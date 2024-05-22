import { Server, Socket } from 'socket.io';

module.exports = function (server: any) {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    let clientsConnected: { 
        socket: string,
        user: string
    }[] = [];
    io.on('connection', (socket: Socket) => {
        // id of user pass to connection event
        socket.on('add-user-online', (newUser: any) => {
            clientsConnected.push({
                socket: socket.id,
                user: newUser.id
            });
        });

        socket.on('disconnect', () => {
            
        });
    });

    return { io, clientsConnected };
}

