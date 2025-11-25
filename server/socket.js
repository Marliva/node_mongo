//Ici, on a la partie serveur

const initSocket = (io, name) => {
    // console.log(io);

    let users = [];
    let messages = [];
    io.on('connection', (socket) => {
        // console.log(socket)
        socket.on("hello", (res) => {

            //envoi de la liste des utilisateurs au nouveau client connecté
            socket.emit("users", { "users": users });
            socket.emit("messages", { "messages": messages });
            users.push({ id: socket.id, name: res.name });
            socket["name"] = res.name;
            console.log("reponse : ", res);

            //le serveur doit informer les autres utilisateurs connectés de l'arrivée 
            //d'un nouvel utilisateur
            socket.broadcast.emit("newUser", { "users": users });
        })
        socket.on("newMessage", (res) => {
            let message = {
                id: socket.id,
                name: socket.name,
                content: res.monMessage,
                date: new Date(),
                //creation d'un token
            };
            messages.push(message);
            console.log("Nouveau message : ", message);
            io.emit("newMessageFromServer", { "messages": messages });
        })
        socket.on("disconnect", () => {
            console.log("Un utilisateur s'est déconnecté");
            users = users.filter(value => value.id !== socket.id);
            // envoie aux clients encore connectés, le tableau users mis à jour
            socket.broadcast.emit("userLeft", { "users": users });
        })
        socket.on("privateMessage", (res) => {
            io.to(res.to).emit("privateMessageFromServer", {
                from: socket.name,
                content: res.content,
                date: new Date()
            });
        });

    })
}

export { initSocket }