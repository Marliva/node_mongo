// Importation du module Express
import express from 'express';

// Importation du module HTTP pour créer un serveur HTTP
import http from 'http';

// Importation du module Socket.IO
import { Server } from 'socket.io';

// Importation du module Socket
import { initSocket } from './server/socket.js';

// Création d'une instance d'application Express
const app = express();

// Création d'un serveur HTTP qui utilisera l'application Express
const server = http.Server(app);

// Définition du port d'écoute
const port = 3000;

// Création d'une instance de Socket.IO qui utilisera le serveur HTTP
const io = new Server(server, {
    // Configuration des CORS pour autoriser les requêtes en provenance de l'origine spécifiée
    cors: {
        origin: ["http://127.0.0.1:" + port, "http://127.0.0.1:" + port + "/"]
    },
    // Taille maximale du buffer de requête HTTP
    maxHttpBufferSize: 1e8//100Mo
});


// Définition de la route pour servir les fichiers statiques
app.use(express.static('public'));

// Middleware pour analyser les requêtes JSON
app.use(express.json());

// middleware pour analyser les requetes en format urlencoded (non utilisé dans ce cas)
app.use(express.urlencoded());

// Traitement de la requête POST pour récupérer le pseudo du visiteur
// Etape : On vérifie si le corps de la requête contient des données
// Si c'est le cas, on affiche le contenu de req.body
app.post('/name', (req, res) => {
    if (req.body) {
        console.log("Contenu de la requête POST : ", req.body);
        //socket

    }
});

// Définition de la route pour servir la page d'accueil
app.get('/', (req, res) => {
    // Envoi de la page d'accueil
    res.sendFile('index.html', { root: __dirname });
})

initSocket(io, "Bob");


// Démarrage du serveur
server.listen(port, "127.0.0.1", (req, res) => {
    console.log("Serveur ouvert sur : http://127.0.0.1:" + port);
});
