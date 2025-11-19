//Ici, on a la partie serveur

const initSocket = (io, name) => {
    // console.log(io);

    io.on('connection', (socket) => {
        console.log(name);
        // console.log(socket)
        socket.on("hello", (res) => {
            console.log("reponse : ", res);
        })
        socket.on("newMessage", (res) => {
            console.log("Nouveau message : ", res);
        })
    })
}

export { initSocket }