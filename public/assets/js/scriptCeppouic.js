//Ici, on a la partie client

const socket = io();

//Déclaration des éléments HTML
const sendGlobalMessage = document.getElementById('sendGlobalMessage');
//récupération des paramètres get de mon URL
let params = new URLSearchParams(document.location.search);
let name = params.get("name");
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
        'align numlist bullist | link image | table media | ' +
        'lineheight outdent indent | forecolor backcolor removeformat | ' +
        'charmap emoticons | code fullscreen preview | save print | ' +
        'pagebreak anchor codesample | ltr rtl',
    menubar: 'file edit view insert format tools table help'
});

//au clic sur le bouton "Envoyer", je récupère le contenu tinyMCE...
sendGlobalMessage.addEventListener('click', () => {
    let monMessage = tinymce.get('message').getContent();
    //...et je l'envoie au serveur
    socket.emit('newMessage', {monMessage:monMessage});
})