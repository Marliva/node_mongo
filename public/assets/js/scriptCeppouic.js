//Ici, on a la partie client

const socket = io();

//Déclaration des éléments HTML
const sendGlobalMessage = document.getElementById('sendGlobalMessage');
const userList = document.getElementById('userList');
const messages = document.getElementById('messages');
const privateMessage = document.getElementById('privateMessage');
const sendPrivateMessage = document.getElementById('sendPrivateMessage');

// ELEMENTS DE LA MODALE
const privateModal = document.getElementById("privateMessage");
const closePrivateModal = document.getElementById("closePrivateModal");
const privateUserName = document.getElementById("privateUserName");
const sendPrivateMessageBtn = document.getElementById("sendPrivateMessage");

// Variable pour stocker l'ID du destinataire
let selectedUserId = null;


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
            userList.append(li);
            li.addEventListener('click', () => {
                console.log("CLIC SUR :", element.name);
                // On montre la modale
                privateModal.style.display = "block";

                // On enregistre l'utilisateur sélectionné
                selectedUserId = element.id;

                // On affiche son nom dans la modale
                privateUserName.innerText = element.name;

                // On initialise TinyMCE pour le message privé
                tinymce.init({
                    selector: "#privateMessageEditor",
                    menubar: false,
                    toolbar: "bold italic underline | undo redo",
                    height: 200
                });
            });

        };
    });
};

closePrivateModal.addEventListener("click", () => {
    privateModal.style.display = "none";
    tinymce.remove("#privateMessageEditor"); // On nettoie l’éditeur
});


sendPrivateMessageBtn.addEventListener("click", () => {
    const content = tinymce.get("privateMessageEditor").getContent();

    socket.emit("privateMessage", {
        to: selectedUserId,
        content: content
    });

    // On ferme la modale après envoi
    privateModal.style.display = "none";
    tinymce.remove("#privateMessageEditor");
});

socket.on("privateMessageFromServer", (data) => {

    const container = document.getElementById("privateMessagesContainer");

    // Création du bloc de notification
    const notif = document.createElement("div");
    notif.classList.add("private-msg");

    // Contenu HTML du message privé + bouton fermer
    notif.innerHTML = `
        <div class="pm-header">
            <strong>${data.from}</strong> vous a envoyé :
            <span class="pm-close">&times;</span>
        </div>
        <div class="pm-body">${data.content}</div>
    `;

    // Ajout dans la page
    container.appendChild(notif);

    // Gestion du clic sur le bouton fermer
    notif.querySelector(".pm-close").addEventListener("click", () => {
        notif.remove();
    });
});



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
const createTiny = (component) => {
    tinymce.init({
        selector: component,
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
}

createTiny("#message");

//Envoyer un message privé




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
socket.on("messages", updateMessage); //C'est la même formulation que pour les socket.on juste au-dessus

//Un nouvel utilisateur envoie un message
socket.on("newMessageFromServer", updateMessage);