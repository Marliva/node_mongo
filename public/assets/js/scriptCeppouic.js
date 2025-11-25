//Ici, on a la partie client

const socket = io();

//Déclaration des éléments HTML
const sendGlobalMessage = document.getElementById('sendGlobalMessage');
const userList = document.getElementById('userList');
const messages = document.getElementById('messages');

//récupération des paramètres get de mon URL
let params = new URLSearchParams(document.location.search);
let name = params.get("name");

//Functions
const updateUser = (res) => {
    let users = res.users;
    userList.innerHTML = "";
    users.forEach(element => {
        if (element.id !== socket.id) {
            console.log("element", element.id, "socket", socket.id);
            const li = document.createElement("li");
            li.innerText = element.name;
            userList.append(li)
        };
    });
};

const updateMessage = (res) => {
    let messageServer = res.messages;
    messages.innerHTML = "";
    messageServer.forEach((element) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <p>${element.name}</p>
            <p>${element.content}</p>
            <p>${moment(element.date).fromNow()}</p>
        `
        messages.append(div);
    })
}

//envoi du nom d'utilisateur au serveur à la première connexion
socket.emit("hello", { name: name });
//utilisation de TinyMCE pour la saisie des messages
tinymce.init({
    selector: '#message',
    plugins: [
        'advlist', 'anchor', 'autolink', 'autosave',
        'charmap', 'code', 'codesample', 'directionality', 'emoticons',
        'fullscreen', 'help', 'image', 'importcss',
        'insertdatetime', 'link', 'lists', 'media', 'nonbreaking',
        'pagebreak', 'preview', 'quickbars', 'save', 'searchreplace', 'table',
        'visualblocks', 'visualchars', 'wordcount'
    ],
    toolbar: 'undo redo | accordion accordionremove | ' +
        'importword exportword exportpdf | math | ' +
        'blocks fontfamily fontsize | bold italic underline strikethrough | ' +
        'lineheight outdent indent | forecolor backcolor removeformat | ',
    menubar: ''
});

//au clic sur le bouton "Envoyer", je récupère le contenu tinyMCE...
sendGlobalMessage.addEventListener('click', () => {
    let monMessage = tinymce.get('message').getContent();
    //...et je l'envoie au serveur
    socket.emit('newMessage', { monMessage: monMessage });

})

//récupération et affichage de la liste des utilisateurs
socket.on("users", (res) => {
    console.log(res);
    updateUser(res);
})

//Un nouvel utilisateur se connecte sur Ceppouic
socket.on("newUser", (res) => {
    console.log("Nouvelle connexion : ", res);
    updateUser(res);
})

//Un utilisateur se déconnecte de Ceppouic
socket.on("userLeft", (res) => {
    console.log("déconnexion : ", res);
    updateUser(res);
})

//récupération et affichage des messages
socket.on("messages",updateMessage); //C'est la même formulation que pour les socket.on juste au-dessus

//Un nouvel utilisateur envoie un message
socket.on("newMessageFromServer", updateMessage);