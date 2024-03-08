// /*j'importe  toutes les extensions dont je vais avoir besoin pour coder l'application (ainsi j'ai accès à ces extensions):
//   - express : pour faire le lien entre les requêtes html et  routes de l'appli, faire mes try catch,ajouter des middlewares, et démarrer le serveur en écoutant sur le port
//   - mongoose : pour communiquer avec la bdd Mongodb
//   - dotenv : pour faciliter le chargement de mes variables d'environnement présentes ds le fichier.env
//   - express-session : pour gérer et garder en session (en "mémoire") les données de l'user durant toute sa connexion
//   - bcrypt:
// */

// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv").config();
// const session = require("express-session");
// const adminRouter = require("./routes/adminRouter")
// const annoncesRouter = require("./routes/annoncesRouter")

// //ICI IL FAUDRA AUSSI IMPORTER AU FUR ET A MESURE CHAQUE FICHIERS ROUTER //

// const utilisateurRouter = require("./routes/utilisateurRouter");
// //je créer une instance d'express() afin de pouvoir l'utiliser et démarrer le serveur
// const app = express();

// // je déclare ma constante db (process.env permet à l'appli d'accéder à la  variables d'environnement BDD_URL présente dans .env)
// const db = process.env.BDD_URL;

// //je demande à l'appli d'utiliser session() et je sécurise la session avec un mot de passe pour éviter que les sessions soient hackées
// app.use(session({secret: process.env.SECRET_SESSION, saveUninitialized: true, resave: false}));

// // lignes ci dessous pas compris: se refaire expliquer
// app.use(function (req, res, next) {
//     res.locals.session = req.sessionStore;
//     next();
// });

// //je demande à l'appli d'utiliser la methode urlencoded d'express( qui permet deconvertir les données envoyés par l'utilisateur au format string , en format objet js organisé sous la forme clé : valeur )
// app.use(express.urlencoded({extended: true}));
// app.use(express.json());
// // app utilise static pour pouvoir te servir des dossiers statiques présents dans assets
// app.use(express.static("./assets"));
// //ICI IL FAUDRA AUSSI demander à app d'utiliser les fichiers ROUTER qu'on a importé plus haut //
// app.use(adminRouter);
// app.use(utilisateurRouter);
// app.use(annoncesRouter);

// //je demande à l'appli d'écouter sur le port 
// app.listen(process.env.PORT, (err) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Vous êtes connecté au port" + process.env.PORT);
//     }
// })

// //méthode pr demander à mongoose de se connecter à la bdd (mongodb)
// mongoose.set('strictQuery', true) //je veux que mes données soit strictement = à ce qui est ds mon schéma
// mongoose.connect(db)
//     .then(() => {
//         console.log('Vous êtes connecté à la bdd');
//     })
//     .catch((err) => {
//         console.log(err);
//     });
  




