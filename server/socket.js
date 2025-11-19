//Ici, on a la partie serveur

const initSocket = (io, name) => {
    // console.log(io);

    const users = [];
    io.on('connection', (socket) => {
        console.log(name);
        // console.log(socket)
        socket.on("hello", (res) => {

            //envoi de la liste des utilisateurs au nouveau client connecté
            socket.emit("userList", {users:users});
            
            users.push({id:socket.id, name: res.name})
            console.log("reponse : ", res);
        })
        socket.on("newMessage", (res) => {
            console.log("Nouveau message : ", res);
        })
    })
}

export { initSocket }